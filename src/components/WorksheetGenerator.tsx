import React, { useState } from 'react';
import { FileText, Loader2, Download, Printer, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const SUBJECTS = [
  "Toán", "Ngữ Văn / Tiếng Việt", "Tiếng Anh", "Khoa học tự nhiên", 
  "Lịch sử và Địa lí", "Vật lí", "Hóa học", "Sinh học", "Lịch sử", "Địa lí", 
  "Tin học", "Công nghệ", "GDCD / GDKT&PL", "Giáo dục thể chất", 
  "Nghệ thuật", "Hoạt động trải nghiệm"
];

const FORMATS = [
  "Tự luận",
  "Trắc nghiệm (A, B, C, D)",
  "Trả lời ngắn",
  "Đúng - Sai",
  "Kết hợp (Trắc nghiệm và Tự luận)",
  "Cấu trúc Bộ GDĐT (3 phần: Trắc nghiệm, Đúng/Sai, Trả lời ngắn)",
  "Cấu trúc đầy đủ (4 phần: Trắc nghiệm, Đúng/Sai, Trả lời ngắn, Tự luận)"
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function WorksheetGenerator() {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('Lớp 12');
  const [subject, setSubject] = useState('Toán');
  const [count, setCount] = useState('10');
  const [format, setFormat] = useState(FORMATS[5]); // Default Cấu trúc Bộ GDĐT
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  
  // Online Quiz States
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setResult('');
    setQuizData(null);
    setShowResult(false);
    setAnswers({});
    setCurrentQ(0);
    
    try {
      const apiKey = localStorage.getItem('edubot-api-key');
      const prompt = `Đóng vai trò là một giáo viên biên soạn đề thi giỏi. Hãy tạo một **Phiếu học tập luyện tập** cho môn ${subject}, ${grade}, về chủ đề: "${topic}".
Yêu cầu:
- Số lượng câu hỏi tương đối: ${count} câu.
- Định dạng / Cấu trúc bài: **${format}**.
- Trình bày rõ ràng, bám sát Chương trình GDPT 2018.
- Gồm 2 phần rõ rệt: Phần 1 (Đề bài) và Phần 2 (Đáp án chi tiết & Thang điểm nếu có).
- Trình bày bằng Markdown, dùng cú pháp LaTeX ($...$ hoặc $$...$$) cho công thức toán học/hóa học/vật lý.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, userApiKey: apiKey })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API error');
      }
      
      setResult(data.text || 'Không có kết quả trả về.');
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('Quota') || e.message?.includes('429') || e.message?.includes('RESOURCE_EXHAUSTED')) {
        setResult('Hệ thống AI đang bị quá tải hoặc API Key của bạn đã hết hạn ngạch (Quota Exceeded). Vui lòng kiểm tra lại API Key hoặc đợi một chút rồi thử lại!');
      } else if (e.message?.includes('API_KEY_INVALID')) {
        setResult('API Key của bạn không hợp lệ hoặc đã bị khóa. Vui lòng cập nhật lại API Key!');
      } else {
        setResult(`Có lỗi xảy ra: ${e.message || 'Lỗi mạng hoặc máy chủ'}. Vui lòng thử lại sau.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateOnlineQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const apiKey = localStorage.getItem('edubot-api-key');
      const prompt = `Dựa vào nội dung phiếu học tập sau, hãy tạo một bộ đề thi trắc nghiệm online (Multiple Choice) gồm 5-10 câu hỏi quan trọng nhất.
CHỈ TRẢ VỀ DUY NHẤT MỘT MẢNG JSON hợp lệ. Không bọc trong Markdown, không có text giải thích.
Cấu trúc mảng JSON bắt buộc:
[
  {
    "question": "Nội dung câu hỏi (có thể dùng $LaTeX$)",
    "options": ["A. Đáp án 1", "B. Đáp án 2", "C. Đáp án 3", "D. Đáp án 4"],
    "correctAnswer": 0, // index từ 0 đến 3
    "explanation": "Giải thích chi tiết tại sao đúng"
  }
]
Nội dung phiếu học tập:
${result.substring(0, 3000)}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, userApiKey: apiKey })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API Error');
      }

      if (!data.text) {
        throw new Error('No text returned from API');
      }

      const match = data.text.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          // Attempt to parse the JSON array
          const parsed = JSON.parse(match[0]);
          setQuizData(parsed);
        } catch (parseError) {
          console.error("Lỗi parse JSON:", parseError, "Raw string:", match[0]);
          alert("Lỗi định dạng đề thi từ AI. Vui lòng thử lại!");
        }
      } else {
        alert("Không thể tạo đề online lúc này, AI không trả về đúng định dạng. Vui lòng thử lại!");
      }
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('Quota') || e.message?.includes('429')) {
        alert("Hệ thống AI đang quá tải hoặc hết hạn ngạch. Vui lòng thử lại sau!");
      } else {
        alert("Lỗi kết nối khi tạo đề online. Vui lòng kiểm tra API Key hoặc mạng.");
      }
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAnswerSelect = (optIndex: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optIndex }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tạo Phiếu học tập & Đề Online</h2>
          <p className="text-slate-500 text-sm">Biên soạn câu hỏi chuẩn GDPT 2018 và tạo bài tập tương tác</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Môn học</label>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Khối lớp</label>
          <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
            {Array.from({length: 12}, (_, i) => <option key={i}>Lớp {i+1}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Số câu hỏi</label>
          <select value={count} onChange={e => setCount(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option>40</option>
            <option>50</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Định dạng đề thi</label>
          <select value={format} onChange={e => setFormat(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
            {FORMATS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề / Bài học</label>
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="VD: Cực trị hàm số, Thì quá khứ..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !topic.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 mb-8"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
        {isLoading ? 'Đang biên soạn...' : 'Tạo Phiếu học tập ngay'}
      </button>

      {/* Online Quiz Section */}
      {quizData && (
        <div className="mb-8 border-2 border-emerald-500 rounded-2xl overflow-hidden bg-white shadow-lg">
          <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><PlayCircle className="w-5 h-5" /> Luyện tập Online</h3>
            <span className="text-sm bg-emerald-700 px-3 py-1 rounded-full">Câu {currentQ + 1} / {quizData.length}</span>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="text-lg font-medium text-slate-800 mb-6 [&>p]:inline">
               <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                 {quizData[currentQ].question}
               </ReactMarkdown>
            </div>
            
            <div className="space-y-3">
              {quizData[currentQ].options.map((opt, idx) => {
                const isSelected = answers[currentQ] === idx;
                const isCorrect = idx === quizData[currentQ].correctAnswer;
                
                let btnStyle = "border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50";
                if (showResult) {
                  if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium";
                  else if (isSelected && !isCorrect) btnStyle = "border-red-500 bg-red-50 text-red-700";
                } else if (isSelected) {
                  btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium ring-2 ring-emerald-500/20";
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnStyle} flex items-center justify-between`}
                  >
                    <span className="[&>p]:inline">
                       <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{opt}</ReactMarkdown>
                    </span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                  </button>
                );
              })}
            </div>
            
            {showResult && (
               <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 text-sm">
                 <span className="font-bold">Giải thích: </span>
                 <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                   {quizData[currentQ].explanation}
                 </ReactMarkdown>
               </div>
            )}
            
            <div className="mt-8 flex justify-between items-center pt-4 border-t border-slate-100">
               <button 
                 onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                 disabled={currentQ === 0}
                 className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 font-medium"
               >
                 Câu trước
               </button>
               
               {!showResult ? (
                 <button 
                   onClick={() => setShowResult(true)}
                   disabled={answers[currentQ] === undefined}
                   className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
                 >
                   Kiểm tra
                 </button>
               ) : (
                 currentQ < quizData.length - 1 ? (
                   <button 
                     onClick={() => {
                       setCurrentQ(prev => prev + 1);
                       setShowResult(false);
                     }}
                     className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                   >
                     Câu tiếp theo
                   </button>
                 ) : (
                   <div className="text-emerald-600 font-bold">Bạn đã hoàn thành!</div>
                 )
               )}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="font-medium text-slate-700">Nội dung phiếu học tập (Bản in)</span>
            <div className="flex gap-2">
              <button 
                onClick={generateOnlineQuiz} 
                disabled={isGeneratingQuiz}
                className="flex items-center gap-2 text-white font-medium text-sm bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                {isGeneratingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                Làm đề Online
              </button>
              <button onClick={handlePrint} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm bg-emerald-50 px-4 py-2 rounded-lg transition-colors border border-emerald-100">
                <Printer className="w-4 h-4" />
                In PDF
              </button>
            </div>
          </div>
          <div className="p-6 md:p-8 markdown-body prose prose-slate max-w-none [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>h1]:font-bold [&>h1]:text-2xl [&>h2]:font-bold [&>h2]:text-xl">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {result}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

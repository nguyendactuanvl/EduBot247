import React, { useState } from 'react';
import { FileText, Loader2, Download, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export function WorksheetGenerator() {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('Lớp 12');
  const [subject, setSubject] = useState('Toán');
  const [count, setCount] = useState('10');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setResult('');
    
    try {
      const apiKey = localStorage.getItem('edubot-api-key');
      const prompt = `Đóng vai trò là một giáo viên biên soạn đề thi giỏi. Hãy tạo một **Phiếu học tập luyện tập** cho môn ${subject}, ${grade}, về chủ đề: "${topic}".
Yêu cầu:
- Số lượng câu hỏi: ${count} câu.
- Cấu trúc: Bám sát cấu trúc thi mới nhất của Bộ Giáo dục (GDPT 2018).
- Gồm 2 phần: Đề bài và Đáp án chi tiết.
- Trình bày rõ ràng bằng Markdown, dùng LaTeX cho công thức toán học/hóa học/vật lý.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, userApiKey: apiKey })
      });
      
      const data = await response.json();
      setResult(data.text);
    } catch (e) {
      setResult('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tạo Phiếu học tập</h2>
          <p className="text-slate-500 text-sm">Tự động biên soạn câu hỏi bám sát cấu trúc thi mới nhất</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Môn học</label>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
            <option>Toán</option>
            <option>Vật lí</option>
            <option>Hóa học</option>
            <option>Sinh học</option>
            <option>Tiếng Anh</option>
            <option>Ngữ Văn</option>
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
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề / Bài học</label>
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="VD: Cực trị hàm số bậc 3, Thì hiện tại hoàn thành..."
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
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

      {result && (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="font-medium text-slate-700">Kết quả xem trước</span>
            <button onClick={handlePrint} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
              <Printer className="w-4 h-4" />
              In PDF
            </button>
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

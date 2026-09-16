import React, { useState } from 'react';
import { Video, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export function VideoGenerator() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('3 phút');
  const [style, setStyle] = useState('Năng động, vui nhộn');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setResult('');
    
    try {
      const apiKey = localStorage.getItem('edubot-api-key');
      const prompt = `Đóng vai trò là một đạo diễn, biên kịch chuyên nghiệp mảng giáo dục (EdTech). Hãy viết một kịch bản video bài giảng về chủ đề: "${topic}".
Yêu cầu:
- Thời lượng dự kiến: ${duration}.
- Phong cách: ${style}.
- Format: Bảng phân cảnh (Storyboard) với 3 cột: [Thời gian] | [Hình ảnh/Video xuất hiện trên màn hình] | [Lời thoại (Voiceover)].
- Thêm gợi ý nhạc nền và hiệu ứng âm thanh (SFX).`;

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

  return (
    <div className="max-w-4xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
          <Video className="w-6 h-6 text-rose-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tạo Kịch bản Video Bài giảng</h2>
          <p className="text-slate-500 text-sm">Biên soạn nội dung, kịch bản hình ảnh và lời thoại cho video học liệu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề bài giảng</label>
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="VD: Cấu tạo tế bào thực vật, Chiến thắng Điện Biên Phủ..."
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Thời lượng dự kiến</label>
          <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
            <option>1 phút (Short/Reel)</option>
            <option>3 phút</option>
            <option>5 phút</option>
            <option>10 phút</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phong cách</label>
          <select value={style} onChange={e => setStyle(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
            <option>Năng động, vui nhộn</option>
            <option>Trang trọng, học thuật</option>
            <option>Kể chuyện (Storytelling)</option>
            <option>Truyền cảm hứng</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !topic.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 mb-8"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
        {isLoading ? 'Đang viết kịch bản...' : 'Tạo Kịch bản Video'}
      </button>

      {result && (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="font-medium text-slate-700">Bảng phân cảnh (Storyboard)</span>
          </div>
          <div className="p-6 md:p-8 markdown-body prose prose-slate max-w-none [&>p]:mb-4 [&>table]:w-full [&>table]:border-collapse [&_th]:border [&_th]:p-2 [&_th]:bg-slate-50 [&_td]:border [&_td]:p-2">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {result}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

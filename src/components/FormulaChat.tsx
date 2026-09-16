import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, Sparkles, Trash2, Key, Camera, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  file?: { type: string, data: string, name: string };
}

const GRADES = Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`);
const SUBJECTS = ["Toán", "Ngữ Văn / Tiếng Việt", "Tiếng Anh", "Khoa học tự nhiên", "Vật lí", "Hóa học", "Sinh học", "Lịch sử", "Địa lí", "Lịch sử và Địa lí", "Tin học", "GDCD / GDKT&PL"];

interface FormulaChatProps {
  onClose: () => void;
}

export function FormulaChat() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('edubot-api-key') || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(!localStorage.getItem('edubot-api-key'));
  const [tempKey, setTempKey] = useState(apiKey);
  const [selectedGrade, setSelectedGrade] = useState('Lớp 12');
  const [selectedSubject, setSelectedSubject] = useState('Toán');
  const [filePreview, setFilePreview] = useState<{type: string, data: string, name: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: 'Chào cậu! Tớ là **EduBot 247** đây! 🚀 Sẵn sàng giải mã mọi công thức Toán, Lý, Hóa, Sinh, Anh và "hack" điểm thi cùng cậu. Gõ ngay chủ đề cậu muốn tra cứu nhé!'
    }
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem('chat-history', JSON.stringify(messages));
  }, [messages]);

  const handleClearHistory = () => {
    if (window.confirm('Cậu có chắc muốn xóa lịch sử trò chuyện không?')) {
      setMessages(defaultMessages);
      localStorage.removeItem('chat-history');
    }
  };
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview({ type: 'image', data: reader.result as string, name: file.name });
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview({ type: 'pdf', data: reader.result as string, name: file.name });
      };
      reader.readAsDataURL(file);
    } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview({ type: 'docx', data: reader.result as string, name: file.name });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Định dạng file không được hỗ trợ. Vui lòng chọn ảnh, PDF hoặc Word.');
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !filePreview) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      file: filePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setFilePreview(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          userApiKey: apiKey,
          file: userMessage.file,
          grade: selectedGrade,
          subject: selectedSubject
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API error');
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message || 'Ối, có lỗi gì đó rồi! Cậu thử lại sau một chút nhé. 😥'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">EduBot 247</h3>
            <p className="text-sm text-indigo-100 font-medium">Gia sư luyện thi bỏ túi</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={() => setShowApiKeyModal(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
            title="Cài đặt API Key"
          >
            <Key className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">API Key</span>
          </button>
          <button 
            onClick={handleClearHistory}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
            title="Xóa lịch sử trò chuyện"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Xóa lịch sử</span>
          </button>
        </div>
      </div>

      {/* Subject and Grade Filters */}
      <div className="bg-slate-100/50 border-b border-slate-200 p-2 px-4 flex gap-2 overflow-x-auto">
        <select 
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 min-w-max"
        >
          {GRADES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select 
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 min-w-max"
        >
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mr-2 mt-1 shadow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
              }`}
            >
              <div className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-slate-800'}`}>
                {msg.file && (
                  <div className="mb-3">
                    {msg.file.type === 'image' ? (
                      <img src={msg.file.data} alt="User upload" className="rounded-lg max-w-full h-auto max-h-64 object-contain bg-white/10" />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/20 rounded-lg border border-white/20">
                         <div className="bg-white/90 p-2 rounded text-indigo-600 font-bold text-xs uppercase">{msg.file.type}</div>
                         <span className="font-medium truncate max-w-[200px]">{msg.file.name}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>h1]:font-bold [&>h1]:text-lg [&>h2]:font-bold [&>h2]:text-base [&>h3]:font-bold [&>strong]:font-bold">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mr-2 mt-1">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500">Đang lục tìm trí nhớ...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
        {filePreview && (
          <div className="relative inline-block w-max">
            {filePreview.type === 'image' ? (
              <img src={filePreview.data} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-200 object-contain bg-slate-50" />
            ) : (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="bg-white p-2 rounded text-indigo-600 font-bold text-xs uppercase shadow-sm">{filePreview.type}</div>
                <span className="font-medium text-slate-700 text-sm truncate max-w-[200px]">{filePreview.name}</span>
              </div>
            )}
            <button 
              onClick={() => setFilePreview(null)}
              className="absolute -top-2 -right-2 bg-white text-slate-500 hover:text-red-500 rounded-full p-1 shadow-md border border-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-end space-x-2">
          <input 
            type="file" 
            accept="image/*"
            capture="environment"
            className="hidden" 
            id="camera-input"
            onChange={handleFileUpload}
          />
          <input 
            type="file" 
            accept="image/*,.pdf,.doc,.docx"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById('camera-input')?.click()}
            className="p-3 text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors shrink-0"
            title="Chụp ảnh trực tiếp"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors shrink-0"
            title="Tải lên file ảnh, PDF hoặc Word"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={filePreview ? "Nhập yêu cầu (ví dụ: Giải giúp tớ bài này)" : "Ví dụ: Tạo ảnh về hệ mặt trời..."}
            className="flex-1 max-h-32 min-h-[44px] p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !filePreview) || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 bg-indigo-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700">
                <Key className="w-5 h-5" />
                <h3 className="font-semibold">Cài đặt API Key Gemini</h3>
              </div>
              {apiKey && (
                <button 
                  onClick={() => setShowApiKeyModal(false)}
                  className="p-1 text-indigo-400 hover:text-indigo-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Để sử dụng Gia sư AI mượt mà, không bị giới hạn (quá tải), cậu hãy nhập <strong>Gemini API Key</strong> của mình vào đây nhé. Key này chỉ lưu trên máy cậu, rất an toàn!
              </p>
              <div>
                <input 
                  type="password" 
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..." 
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="text-xs text-slate-500">
                Chưa có Key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline">Lấy miễn phí tại đây</a>.
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    setApiKey(tempKey);
                    localStorage.setItem('edubot-api-key', tempKey);
                    setShowApiKeyModal(false);
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Lưu API Key
                </button>
                {!apiKey && (
                   <button 
                   onClick={() => setShowApiKeyModal(false)}
                   className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                 >
                   Dùng thử mặc định
                 </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

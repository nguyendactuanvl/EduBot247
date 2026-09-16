import React, { useState, useEffect } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';

export function TTSPlayer() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const viVoice = availableVoices.find(v => v.lang.includes('vi'));
      if (viVoice) setSelectedVoice(viVoice.name);
      else if (availableVoices.length > 0) setSelectedVoice(availableVoices[0].name);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (!text.trim()) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Chuyển văn bản thành giọng nói</h2>
          <p className="text-slate-500 text-sm">Nhập văn bản để hệ thống đọc tự động</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Chọn giọng đọc (Tuỳ thuộc vào thiết bị của bạn)</label>
          <select 
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {voices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Văn bản cần đọc</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập nội dung vào đây..."
            className="w-full h-40 p-4 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handlePlay}
            disabled={isSpeaking || !text.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <Play className="w-5 h-5" />
            Đọc ngay
          </button>
          <button
            onClick={handleStop}
            disabled={!isSpeaking}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <Square className="w-5 h-5" />
            Dừng
          </button>
        </div>
      </div>
    </div>
  );
}

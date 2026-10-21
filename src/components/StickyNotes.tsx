import React, { useState, useEffect } from 'react';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Pin, 
  Search, 
  Check, 
  Copy, 
  Sparkles, 
  Tag, 
  Bookmark,
  Calendar,
  X,
  Eye,
  Edit3
} from 'lucide-react';
import { MathView } from './MathView';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  subject: 'Toán' | 'Vật lý' | 'Hóa học' | 'Sinh học' | 'Tiếng Anh' | 'Khác';
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple';
  isPinned: boolean;
  createdAt: string;
}

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Công thức nghiệm phương trình bậc 2',
    content: 'Xét $a x^2 + b x + c = 0$ ($a \\ne 0$):\n$$\\Delta = b^2 - 4 a c$$\n- Nếu $\\Delta > 0$: 2 nghiệm phân biệt $x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2 a}$.\n- Nếu $\\Delta = 0$: Nghiệm kép $x = -\\frac{b}{2 a}$.\n- Nếu $\\Delta < 0$: Vô nghiệm trên tập $\\mathbb{R}$.',
    subject: 'Toán',
    color: 'yellow',
    isPinned: true,
    createdAt: '2026-10-20'
  },
  {
    id: 'note-2',
    title: 'Quy tắc bàn tay trái - Lực từ Lorentz',
    content: 'Lực Lorentz tác dụng lên điện tích chuyển động:\n$$f = |q| v B \\sin\\alpha$$\nĐặt bàn tay trái sao cho từ trường $\\vec{B}$ đâm vào lòng bàn tay, chiều từ cổ tay đến ngón giữa là chiều $\\vec{v}$ (nếu $q > 0$). Ngón cái choãi ra $90^\\circ$ chỉ chiều lực $\\vec{f}$.',
    subject: 'Vật lý',
    color: 'blue',
    isPinned: true,
    createdAt: '2026-10-20'
  },
  {
    id: 'note-3',
    title: 'Thể tích khí chuẩn mới GDPT 2018',
    content: 'Ở điều kiện chuẩn ($25^\\circ\\text{C}, 1\\text{ bar}$):\n$$n = \\frac{V}{24{,}79} \\iff V = n \\times 24{,}79$$\n*Lưu ý: Không dùng $22{,}4\\text{ L}$ của SGK cũ nữa!*',
    subject: 'Hóa học',
    color: 'green',
    isPinned: false,
    createdAt: '2026-10-20'
  }
];

export function StickyNotes() {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('edubot_sticky_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse sticky notes', e);
      }
    }
    return DEFAULT_NOTES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [currentEditingNote, setCurrentEditingNote] = useState<Partial<NoteItem>>({
    title: '',
    content: '',
    subject: 'Toán',
    color: 'yellow',
    isPinned: false
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('edubot_sticky_notes', JSON.stringify(notes));
  }, [notes]);

  // Listen for custom event from other components (e.g., KNTTPracticeHub 1-click note)
  useEffect(() => {
    const handleAddNoteEvent = (e: any) => {
      if (e.detail) {
        const newNote: NoteItem = {
          id: `note-${Date.now()}`,
          title: e.detail.title || 'Ghi chú bài tập mới',
          content: e.detail.content || '',
          subject: e.detail.subject || 'Toán',
          color: e.detail.color || 'yellow',
          isPinned: true,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setNotes(prev => [newNote, ...prev]);
      }
    };

    window.addEventListener('edubot_add_sticky_note', handleAddNoteEvent);
    return () => window.removeEventListener('edubot_add_sticky_note', handleAddNoteEvent);
  }, []);

  // Sync from localStorage on mount & window focus
  useEffect(() => {
    const reloadNotes = () => {
      const saved = localStorage.getItem('edubot_sticky_notes');
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse notes on focus', e);
        }
      }
    };

    reloadNotes();
    window.addEventListener('focus', reloadNotes);
    window.addEventListener('storage', reloadNotes);
    return () => {
      window.removeEventListener('focus', reloadNotes);
      window.removeEventListener('storage', reloadNotes);
    };
  }, []);

  const handleCreateNew = () => {
    setCurrentEditingNote({
      id: `note-${Date.now()}`,
      title: '',
      content: '',
      subject: 'Toán',
      color: 'yellow',
      isPinned: false,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsEditingModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!currentEditingNote.title?.trim() && !currentEditingNote.content?.trim()) {
      setIsEditingModalOpen(false);
      return;
    }

    const noteToSave: NoteItem = {
      id: currentEditingNote.id || `note-${Date.now()}`,
      title: currentEditingNote.title?.trim() || 'Ghi chú không tên',
      content: currentEditingNote.content || '',
      subject: (currentEditingNote.subject as any) || 'Toán',
      color: (currentEditingNote.color as any) || 'yellow',
      isPinned: currentEditingNote.isPinned || false,
      createdAt: currentEditingNote.createdAt || new Date().toISOString().split('T')[0]
    };

    setNotes(prev => {
      const exists = prev.some(n => n.id === noteToSave.id);
      if (exists) {
        return prev.map(n => n.id === noteToSave.id ? noteToSave : n);
      } else {
        return [noteToSave, ...prev];
      }
    });

    setIsEditingModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubj = selectedSubject === 'all' || n.subject === selectedSubject;
    return matchSearch && matchSubj;
  }).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100 shadow-amber-500/5';
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-blue-950 dark:text-blue-100 shadow-blue-500/5';
      case 'green':
        return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100 shadow-emerald-500/5';
      case 'pink':
        return 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-100 shadow-rose-500/5';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/60 text-purple-950 dark:text-purple-100 shadow-purple-500/5';
      default:
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <StickyNote className="w-4 h-4 text-amber-200" />
            <span>Sổ tay bỏ túi • Hỗ trợ LaTeX & Markdown</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Ghi chú Cá nhân (Sticky Notes)
          </h2>
          <p className="text-sm md:text-base text-amber-100 max-w-xl leading-relaxed">
            Lưu nhanh công thức toán học, định luật lý hóa, từ vựng và bài tập khó cần xem lại. Dữ liệu được lưu trữ an toàn trên thiết bị của bạn.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo ghi chú mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm công thức, bài tập đã lưu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
          {['all', 'Toán', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 'Khác'].map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSubject === subj
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {subj === 'all' ? 'Tất cả môn' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`p-5 rounded-3xl border shadow-sm transition-all hover:shadow-md flex flex-col justify-between space-y-4 relative ${getColorClasses(note.color)}`}
            >
              {/* Header of Note */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 uppercase tracking-wider backdrop-blur-xs">
                    {note.subject}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.isPinned 
                          ? 'text-amber-600 bg-white dark:bg-slate-800 shadow-2xs' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={note.isPinned ? "Bỏ ghim" : "Ghim lên đầu"}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentEditingNote(note);
                        setIsEditingModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60"
                      title="Chỉnh sửa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60"
                      title="Xóa ghi chú"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base leading-snug">
                  {note.title}
                </h3>

                <div className="text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-56 overflow-y-auto scrollbar-thin pt-1">
                  <MathView content={note.content} />
                </div>
              </div>

              {/* Footer of Note */}
              <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {note.createdAt}
                </span>

                <button
                  onClick={() => handleCopyContent(`${note.title}\n\n${note.content}`, note.id)}
                  className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
                >
                  {copiedId === note.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === note.id ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <StickyNote className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Chưa có ghi chú nào phù hợp
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Bấm "Tạo ghi chú mới" hoặc lưu các câu hỏi bài tập hay từ mục Luyện tập SGK để xem lại bất cứ lúc nào.
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700"
          >
            Tạo ghi chú đầu tiên
          </button>
        </div>
      )}

      {/* Modal Add / Edit Note */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-500" />
                <span>{currentEditingNote.id ? 'Chỉnh sửa Ghi chú' : 'Tạo Ghi chú mới'}</span>
              </h3>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Tiêu đề ghi chú:</label>
                <input 
                  type="text"
                  placeholder="Ví dụ: Công thức tính nhanh góc giữa 2 vectơ..."
                  value={currentEditingNote.title || ''}
                  onChange={(e) => setCurrentEditingNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300">Môn học:</label>
                  <select
                    value={currentEditingNote.subject || 'Toán'}
                    onChange={(e) => setCurrentEditingNote(prev => ({ ...prev, subject: e.target.value as any }))}
                    className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="Toán">Toán học</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khác">Môn khác</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300">Màu sắc thẻ:</label>
                  <div className="flex gap-2 mt-1.5">
                    {(['yellow', 'blue', 'green', 'pink', 'purple'] as const).map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCurrentEditingNote(prev => ({ ...prev, color }))}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          color === 'yellow' ? 'bg-amber-300' :
                          color === 'blue' ? 'bg-blue-300' :
                          color === 'green' ? 'bg-emerald-300' :
                          color === 'pink' ? 'bg-rose-300' : 'bg-purple-300'
                        } ${currentEditingNote.color === color ? 'scale-125 border-slate-800 dark:border-white' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-600 dark:text-slate-300">Nội dung (hỗ trợ LaTeX $công\\_thức$):</label>
                  <span className="text-[10px] text-amber-600">Dùng $ để viết công thức toán</span>
                </div>
                <textarea 
                  rows={6}
                  placeholder="Nhập ghi chú, công thức hoặc lời nhắc..."
                  value={currentEditingNote.content || ''}
                  onChange={(e) => setCurrentEditingNote(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-sans outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="pinNoteCheck"
                  checked={currentEditingNote.isPinned || false}
                  onChange={(e) => setCurrentEditingNote(prev => ({ ...prev, isPinned: e.target.checked }))}
                  className="rounded text-amber-600 accent-amber-600"
                />
                <label htmlFor="pinNoteCheck" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                  Ghim ghi chú này lên đầu danh sách
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  Languages, 
  Search, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Layers, 
  Clock, 
  HelpCircle,
  Repeat,
  ArrowRight,
  ShieldCheck,
  FileText,
  Zap,
  Award,
  ListFilter,
  CheckCircle2,
  XCircle,
  MoveUp,
  MoveDown,
  RefreshCw
} from 'lucide-react';
import { MathView } from './MathView';
import { ParaphraseRewriteTask, SentenceOrderTask } from '../types';

interface VerbItem {
  v1: string;
  v2: string;
  v3: string;
  meaning: string;
}

const IRREGULAR_VERBS: VerbItem[] = [
  { v1: 'be', v2: 'was/were', v3: 'been', meaning: 'thì, là, ở' },
  { v1: 'become', v2: 'became', v3: 'become', meaning: 'trở nên, trở thành' },
  { v1: 'begin', v2: 'began', v3: 'begun', meaning: 'bắt đầu' },
  { v1: 'break', v2: 'broke', v3: 'broken', meaning: 'làm vỡ, bẻ gãy' },
  { v1: 'bring', v2: 'brought', v3: 'brought', meaning: 'mang lại, đem đến' },
  { v1: 'build', v2: 'built', v3: 'built', meaning: 'xây dựng' },
  { v1: 'buy', v2: 'bought', v3: 'bought', meaning: 'mua' },
  { v1: 'choose', v2: 'chose', v3: 'chosen', meaning: 'chọn lựa' },
  { v1: 'come', v2: 'came', v3: 'come', meaning: 'đến, đi đến' },
  { v1: 'do', v2: 'did', v3: 'done', meaning: 'làm' },
  { v1: 'drink', v2: 'drank', v3: 'drunk', meaning: 'uống' },
  { v1: 'drive', v2: 'drove', v3: 'driven', meaning: 'lái xe' },
  { v1: 'eat', v2: 'ate', v3: 'eaten', meaning: 'ăn' },
  { v1: 'fall', v2: 'fell', v3: 'fallen', meaning: 'rơi, ngã' },
  { v1: 'feel', v2: 'felt', v3: 'felt', meaning: 'cảm thấy' },
  { v1: 'find', v2: 'found', v3: 'found', meaning: 'tìm thấy' },
  { v1: 'fly', v2: 'flew', v3: 'flown', meaning: 'bay' },
  { v1: 'forget', v2: 'forgot', v3: 'forgotten', meaning: 'quên' },
  { v1: 'get', v2: 'got', v3: 'got/gotten', meaning: 'có được, nhận được' },
  { v1: 'give', v2: 'gave', v3: 'given', meaning: 'cho, tặng' },
  { v1: 'go', v2: 'went', v3: 'gone', meaning: 'đi' },
  { v1: 'have', v2: 'had', v3: 'had', meaning: 'có' },
  { v1: 'know', v2: 'knew', v3: 'known', meaning: 'biết' },
  { v1: 'leave', v2: 'left', v3: 'left', meaning: 'rời khỏi, để lại' },
  { v1: 'make', v2: 'made', v3: 'made', meaning: 'chế tạo, làm' },
  { v1: 'meet', v2: 'met', v3: 'met', meaning: 'gặp gỡ' },
  { v1: 'see', v2: 'saw', v3: 'seen', meaning: 'nhìn thấy' },
  { v1: 'speak', v2: 'spoke', v3: 'spoken', meaning: 'nói' },
  { v1: 'take', v2: 'took', v3: 'taken', meaning: 'cầm, lấy' },
  { v1: 'think', v2: 'thought', v3: 'thought', meaning: 'suy nghĩ' },
  { v1: 'understand', v2: 'understood', v3: 'understood', meaning: 'thấu hiểu' },
  { v1: 'write', v2: 'wrote', v3: 'written', meaning: 'viết' }
];

export function EnglishToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'timeline_tenses' | 'rewrite_lab' | 'sentence_order' | 'verbs'>('timeline_tenses');

  // TTS Speech Handler
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ==========================================
  // 1. INTERACTIVE TIMELINE SLIDER (12 THÌ)
  // ==========================================
  const timelinePoints = [
    { position: 1, label: 'Past Perfect (Quá khứ hoàn thành)', formula: 'had + V3', desc: 'Xảy ra và hoàn thành TRƯỚC một mốc quá khứ khác.', example: 'By the time I arrived, the train had left.' },
    { position: 2, label: 'Past Simple (Quá khứ đơn)', formula: 'V2/ed', desc: 'Đã xảy ra và kết thúc hoàn toàn tại một điểm quá khứ.', example: 'I passed the exam yesterday.' },
    { position: 3, label: 'Present Perfect (Hiện tại hoàn thành)', formula: 'have/has + V3', desc: 'Xảy ra ở quá khứ kéo dài đến HIỆN TẠI.', example: 'I have studied English for 5 years.' },
    { position: 4, label: 'Present Simple (Hiện tại đơn)', formula: 'V(s/es)', desc: 'Thói quen hoặc sự thật hiển nhiên ở HIỆN TẠI.', example: 'She learns English every day.' },
    { position: 5, label: 'Future Simple (Tương lai đơn)', formula: 'will + V(bare)', desc: 'Dự đoán hoặc quyết định ở TƯƠNG LAI.', example: 'We will win the national exam.' },
  ];

  const [timelineIndex, setTimelineIndex] = useState<number>(2); // Default Present Perfect
  const currentTimeline = timelinePoints[timelineIndex];


  // ==========================================
  // 2. PARAPHRASE & REWRITE LAB (DRAG WORD TOKENS)
  // ==========================================
  const rewriteTasks: ParaphraseRewriteTask[] = [
    {
      id: 'rw-1',
      originalSentence: 'People speak English all over the world.',
      hint: 'Chuyển sang Thể Bị Động (Passive Voice):',
      wordTokens: ['spoken', 'is', 'English', 'world.', 'all', 'over', 'the'],
      correctSentence: 'English is spoken all over the world.',
      explanation: 'Hiện tại đơn bị động: S + am/is/are + V3/ed.'
    },
    {
      id: 'rw-2',
      originalSentence: 'If you had studied hard, you would have passed the exam.',
      hint: 'Đảo ngữ Câu điều kiện Loại 3 (Inversion):',
      wordTokens: ['passed', 'you', 'Had', 'studied', 'would', 'hard,', 'have', 'the', 'exam.'],
      correctSentence: 'Had you studied hard, you would have passed the exam.',
      explanation: 'Đảo ngữ Điều kiện Loại 3: Had + S + V3/ed, S + would + have + V3.'
    }
  ];

  const [currentRewriteIdx, setCurrentRewriteIdx] = useState<number>(0);
  const activeRewrite = rewriteTasks[currentRewriteIdx];
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [rewriteSubmitted, setRewriteSubmitted] = useState<boolean>(false);

  const handleAddToken = (token: string, idx: number) => {
    setSelectedTokens(prev => [...prev, token]);
  };

  const handleRemoveToken = (idx: number) => {
    setSelectedTokens(prev => prev.filter((_, i) => i !== idx));
  };


  // ==========================================
  // 3. SENTENCE ORDERING (SẮP XẾP ĐOẠN VĂN GDPT 2018)
  // ==========================================
  const sentenceOrderTasks: SentenceOrderTask[] = [
    {
      id: 'so-1',
      title: 'Sắp xếp câu tạo Thông báo tuyển dụng ngắn (Short Notice):',
      sentences: [
        { id: 's1', text: 'a. First, candidates must submit their CV before June 1st.' },
        { id: 's2', text: 'b. We are looking for an energetic English tutor for high school students.' },
        { id: 's3', text: 'c. In addition, prior teaching experience in GDPT 2018 is preferred.' },
        { id: 's4', text: 'd. Finally, selected tutors will receive competitive monthly bonuses.' }
      ],
      correctOrder: ['s2', 's1', 's3', 's4'],
      explanation: 'Thứ tự logic: Giới thiệu vị trí tuyển dụng (b) -> Yêu cầu hồ sơ (a) -> Yêu cầu kinh nghiệm (c) -> Quyền lợi (d).'
    }
  ];

  const [orderUserList, setOrderUserList] = useState<string[]>(['s1', 's2', 's3', 's4']);
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  const moveSentence = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= orderUserList.length) return;
    const updated = [...orderUserList];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrderUserList(updated);
  };


  // ==========================================
  // 4. IRREGULAR VERBS DICTIONARY SEARCH
  // ==========================================
  const [verbSearch, setVerbSearch] = useState('');
  const filteredVerbs = useMemo(() => {
    return IRREGULAR_VERBS.filter(v => 
      v.v1.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.v2.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.v3.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.meaning.toLowerCase().includes(verbSearch.toLowerCase())
    );
  }, [verbSearch]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
            <Languages className="w-4 h-4 text-purple-200" />
            <span>Chương trình GDPT 2018 • Tiếng Anh THPT 10, 11, 12</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Bộ Cẩm Nang Ngữ Pháp & Luyện Thi Thực Chiến Tiếng Anh
          </h2>
          
          <MathView 
            content="Trục thời gian tương tác $12$ thì, Phòng luyện Rewrite & Paraphrase kéo thả từ, Dạng bài mới Sắp xếp trật tự đoạn văn và Bảng động từ bất quy tắc kèm phát âm giọng bản ngữ TTS."
            className="text-xs sm:text-sm text-violet-100 max-w-3xl leading-relaxed" 
          />
        </div>
      </div>

      {/* SUB-TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {[
          { id: 'timeline_tenses', label: '1. Trục Thời Gian 12 Thì', icon: Clock },
          { id: 'rewrite_lab', label: '2. Luyện Rewrite & Paraphrase (Tokens)', icon: ArrowRight },
          { id: 'sentence_order', label: '3. Sắp xếp Đoạn Văn (Dạng GDPT mới)', icon: FileText },
          { id: 'verbs', label: '4. Động từ Bất quy tắc (TTS)', icon: BookOpen },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUBTAB 1: INTERACTIVE TIMELINE SLIDER (12 THÌ)
          ========================================================================= */}
      {activeSubTab === 'timeline_tenses' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Trực quan hóa Trục Thời Gian Ngữ Pháp</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Kéo Trục Thời Gian Xem Mối Quan Hệ Giữa Các Thì</h3>
          </div>

          {/* Timeline Range Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span> Quá khứ xa (Past Perfect)</span>
              <span> Quá khứ (Past Simple)</span>
              <span> Hiện tại (Present)</span>
              <span> Tương lai (Future)</span>
            </div>

            <input
              type="range" min={0} max={4} step={1}
              value={timelineIndex}
              onChange={e => setTimelineIndex(parseInt(e.target.value))}
              className="w-full accent-purple-600 h-3 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Active Tense Timeline Card */}
          <div className="p-6 bg-purple-50/70 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-purple-900 dark:text-purple-200">{currentTimeline.label}</h4>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full font-mono text-xs font-bold">{currentTimeline.formula}</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{currentTimeline.desc}</p>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-between text-xs font-bold italic text-slate-900 dark:text-white">
              <span>"{currentTimeline.example}"</span>
              <button onClick={() => speakWord(currentTimeline.example)} className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors shrink-0">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: PARAPHRASE & REWRITE LAB (DRAG TOKENS)
          ========================================================================= */}
      {activeSubTab === 'rewrite_lab' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Phòng Luyện Viết Lại Câu Thực Chiến</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Ghép Từ Hoàn Thành Câu Đồng Nghĩa (Rewrite)</h3>
            </div>
            <button onClick={() => { setSelectedTokens([]); setRewriteSubmitted(false); }} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border text-xs space-y-1">
            <span className="font-bold text-slate-500 block">Câu gốc:</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">"{activeRewrite.originalSentence}"</p>
            <p className="text-purple-600 dark:text-purple-400 font-bold">{activeRewrite.hint}</p>
          </div>

          {/* Selected Tokens Zone */}
          <div className="p-4 min-h-[70px] bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-dashed border-purple-300 dark:border-purple-800 flex flex-wrap gap-2 items-center">
            {selectedTokens.length === 0 ? (
              <p className="text-slate-400 text-xs italic">Bấm các từ ở bên dưới để ghép thành câu hoàn chỉnh...</p>
            ) : (
              selectedTokens.map((token, idx) => (
                <button key={idx} onClick={() => handleRemoveToken(idx)} className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-600 transition-colors">
                  {token} ×
                </button>
              ))
            )}
          </div>

          {/* Word Tokens Palette */}
          <div className="flex flex-wrap gap-2">
            {activeRewrite.wordTokens.map((token, idx) => (
              <button key={idx} onClick={() => handleAddToken(token, idx)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border rounded-xl text-xs font-bold hover:bg-purple-500 hover:text-white transition-all">
                + {token}
              </button>
            ))}
          </div>

          {!rewriteSubmitted ? (
            <button onClick={() => setRewriteSubmitted(true)} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-extrabold text-xs shadow-md">
              Chấm Điểm Câu Ghép
            </button>
          ) : (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${selectedTokens.join(' ') === activeRewrite.correctSentence ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
              <span className="font-bold text-sm block">{selectedTokens.join(' ') === activeRewrite.correctSentence ? '✓ Chính xác hoàn toàn!' : '✗ Chưa đúng!'}</span>
              <p>• Đáp án đúng: <span className="font-bold">"{activeRewrite.correctSentence}"</span></p>
              <p>• Giải thích: {activeRewrite.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: SENTENCE ORDERING (DẠNG MỚI BỘ GD&ĐT)
          ========================================================================= */}
      {activeSubTab === 'sentence_order' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Dạng Đề thi GDPT 2018 Mới</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Sắp Xếp Trật Tự Câu Tạo Đoạn Văn Logic</h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">{sentenceOrderTasks[0].title}</p>

          <div className="space-y-2">
            {orderUserList.map((sId, idx) => {
              const sentenceObj = sentenceOrderTasks[0].sentences.find(s => s.id === sId)!;
              return (
                <div key={sId} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{sentenceObj.text}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveSentence(idx, idx - 1)} className="p-1 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-purple-500 hover:text-white"><MoveUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveSentence(idx, idx + 1)} className="p-1 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-purple-500 hover:text-white"><MoveDown className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {!orderSubmitted ? (
            <button onClick={() => setOrderSubmitted(true)} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-extrabold text-xs shadow-md">
              Chấm Điểm Thứ Tự Đoạn Văn
            </button>
          ) : (
            <div className="p-4 bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl text-xs space-y-1 text-purple-900 dark:text-purple-200">
              <span className="font-bold text-sm block">Giải thích Thứ tự Logic:</span>
              <p>{sentenceOrderTasks[0].explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: IRREGULAR VERBS DICTIONARY & TTS
          ========================================================================= */}
      {activeSubTab === 'verbs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <Search className="w-5 h-5 text-purple-500" />
            <input
              type="text"
              placeholder="Tra cứu nhanh động từ (ví dụ: become, went, written), hoặc nghĩa tiếng Việt..."
              value={verbSearch}
              onChange={(e) => setVerbSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                  <tr className="border-b text-slate-700 dark:text-slate-200">
                    <th className="p-3.5 font-black">V1 (Infinitive)</th>
                    <th className="p-3.5 font-black">V2 (Past Simple)</th>
                    <th className="p-3.5 font-black">V3 (Past Participle)</th>
                    <th className="p-3.5 font-black">Nghĩa tiếng Việt</th>
                    <th className="p-3.5 font-black text-center">Phát âm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredVerbs.map((v, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">{v.v1}</td>
                      <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{v.v2}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{v.v3}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{v.meaning}</td>
                      <td className="p-3.5 text-center">
                        <button onClick={() => speakWord(`${v.v1}, ${v.v2}, ${v.v3}`)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-xl transition-all inline-flex">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

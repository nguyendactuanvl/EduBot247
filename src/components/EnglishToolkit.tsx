import React, { useState, useMemo } from 'react';
import { 
  Languages, 
  Search, 
  Sparkles, 
  BookOpen, 
  Check, 
  Volume2, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  HelpCircle
} from 'lucide-react';

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
  { v1: 'grow', v2: 'grew', v3: 'grown', meaning: 'lớn lên, phát triển' },
  { v1: 'have', v2: 'had', v3: 'had', meaning: 'có' },
  { v1: 'know', v2: 'knew', v3: 'known', meaning: 'biết' },
  { v1: 'learn', v2: 'learnt/learned', v3: 'learnt/learned', meaning: 'học' },
  { v1: 'leave', v2: 'left', v3: 'left', meaning: 'rời khỏi, để lại' },
  { v1: 'make', v2: 'made', v3: 'made', meaning: 'chế tạo, làm' },
  { v1: 'meet', v2: 'met', v3: 'met', meaning: 'gặp gỡ' },
  { v1: 'read', v2: 'read', v3: 'read', meaning: 'đọc' },
  { v1: 'see', v2: 'saw', v3: 'seen', meaning: 'nhìn thấy' },
  { v1: 'speak', v2: 'spoke', v3: 'spoken', meaning: 'nói' },
  { v1: 'take', v2: 'took', v3: 'taken', meaning: 'cầm, lấy' },
  { v1: 'teach', v2: 'taught', v3: 'taught', meaning: 'dạy học' },
  { v1: 'think', v2: 'thought', v3: 'thought', meaning: 'suy nghĩ' },
  { v1: 'understand', v2: 'understood', v3: 'understood', meaning: 'thấu hiểu' },
  { v1: 'write', v2: 'wrote', v3: 'written', meaning: 'viết' }
];

export function EnglishToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'tenses' | 'verbs' | 'grammar' | 'vocab'>('tenses');

  // --- SUBTAB 1: 12 THÌ TIẾNG ANH ---
  const tensesData = [
    {
      id: 'present_simple',
      name: 'Hiện tại đơn (Present Simple)',
      formula: 'S + V(s/es) + O',
      negative: 'S + do/does not + V(nguyên thể) + O',
      question: 'Do/Does + S + V(nguyên thể) + O?',
      signals: 'always, usually, often, sometimes, never, every day/week, once a week...',
      example: 'She studies English every morning.',
      usage: 'Diễn tả thói quen lặp đi lặp lại hoặc chân lý, sự thật hiển nhiên.'
    },
    {
      id: 'present_continuous',
      name: 'Hiện tại tiếp diễn (Present Continuous)',
      formula: 'S + am/is/are + V-ing + O',
      negative: 'S + am/is/are not + V-ing + O',
      question: 'Am/Is/Are + S + V-ing + O?',
      signals: 'now, right now, at the moment, at present, Look!, Listen!...',
      example: 'The students are preparing for the national exam now.',
      usage: 'Diễn tả hành động đang xảy ra tại thời điểm nói hoặc xu hướng tạm thời.'
    },
    {
      id: 'present_perfect',
      name: 'Hiện tại hoàn thành (Present Perfect)',
      formula: 'S + have/has + V3/V-ed + O',
      negative: 'S + have/has not + V3/V-ed + O',
      question: 'Have/Has + S + V3/V-ed + O?',
      signals: 'already, yet, just, ever, never, since, for, recently, so far...',
      example: 'I have learned 500 new vocabulary words this month.',
      usage: 'Diễn tả hành động xảy ra trong quá khứ kéo dài đến hiện tại hoặc kết quả để lại.'
    },
    {
      id: 'past_simple',
      name: 'Quá khứ đơn (Past Simple)',
      formula: 'S + V2/V-ed + O',
      negative: 'S + did not + V(nguyên thể) + O',
      question: 'Did + S + V(nguyên thể) + O?',
      signals: 'yesterday, last night/week/year, ago, in 2020, when I was young...',
      example: 'He passed the graduation exam with flying colors last year.',
      usage: 'Diễn tả hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ có thời điểm rõ ràng.'
    },
    {
      id: 'future_simple',
      name: 'Tương lai đơn (Future Simple)',
      formula: 'S + will + V(nguyên thể) + O',
      negative: 'S + will not (won\'t) + V(nguyên thể) + O',
      question: 'Will + S + V(nguyên thể) + O?',
      signals: 'tomorrow, next week/year, in the future, soon, I think/hope...',
      example: 'We will achieve our academic goals in 2026.',
      usage: 'Diễn tả quyết định tức thời tại thời điểm nói hoặc dự đoán không có căn cứ trước.'
    }
  ];

  const [selectedTenseId, setSelectedTenseId] = useState(tensesData[0].id);
  const currentTense = tensesData.find(t => t.id === selectedTenseId) || tensesData[0];

  // --- SUBTAB 2: ĐỘNG TỪ BẤT QUY TẮC ---
  const [verbSearch, setVerbSearch] = useState('');
  const filteredVerbs = useMemo(() => {
    return IRREGULAR_VERBS.filter(v => 
      v.v1.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.v2.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.v3.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.meaning.toLowerCase().includes(verbSearch.toLowerCase())
    );
  }, [verbSearch]);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <Languages className="w-4 h-4 text-purple-200" />
            <span>Chương trình GDPT 2018 • Tiếng Anh 10, 11, 12</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bộ công cụ Tiếng Anh THPT Chuẩn Quốc tế
          </h2>
          <p className="text-sm md:text-base text-violet-100 max-w-2xl leading-relaxed">
            Tra cứu 12 thì ngữ pháp, 360 động từ bất quy tắc có phát âm bản ngữ, cấu trúc câu thi Tốt nghiệp THPT & Đánh giá năng lực.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('tenses')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'tenses'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>12 Thì tiếng Anh</span>
        </button>

        <button
          onClick={() => setActiveSubTab('verbs')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'verbs'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Động từ bất quy tắc (Phát âm)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('grammar')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'grammar'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Cấu trúc câu & Paraphrase</span>
        </button>
      </div>

      {/* --- SUBTAB 1: 12 THÌ TIẾNG ANH --- */}
      {activeSubTab === 'tenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">
              Danh sách các thì cốt lõi:
            </h3>
            {tensesData.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTenseId(t.id)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                  selectedTenseId === t.id
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {currentTense.name}
            </h4>

            {/* Formulas Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/40">
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Khẳng định (+):</span>
                <p className="font-mono font-bold text-xs text-slate-800 dark:text-slate-100 mt-1">{currentTense.formula}</p>
              </div>
              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">Phủ định (-):</span>
                <p className="font-mono font-bold text-xs text-slate-800 dark:text-slate-100 mt-1">{currentTense.negative}</p>
              </div>
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">Nghi vấn (?):</span>
                <p className="font-mono font-bold text-xs text-slate-800 dark:text-slate-100 mt-1">{currentTense.question}</p>
              </div>
            </div>

            {/* Signals */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-500">Dấu hiệu nhận biết trong đề thi:</span>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold font-mono">
                {currentTense.signals}
              </p>
            </div>

            {/* Example */}
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Ví dụ thực tế:</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                  "{currentTense.example}"
                </p>
                <p className="text-xs text-slate-500 mt-1">Cách dùng: {currentTense.usage}</p>
              </div>
              <button
                onClick={() => speakWord(currentTense.example)}
                className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs hover:bg-emerald-700 transition-colors shrink-0"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: ĐỘNG TỪ BẤT QUY TẮC --- */}
      {activeSubTab === 'verbs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tra cứu từ tiếng Anh (become, went), hoặc nghĩa tiếng Việt (bắt đầu, chọn)..."
              value={verbSearch}
              onChange={(e) => setVerbSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <th className="p-4 font-bold">V1 (Infinitive)</th>
                    <th className="p-4 font-bold">V2 (Past Simple)</th>
                    <th className="p-4 font-bold">V3 (Past Participle)</th>
                    <th className="p-4 font-bold">Nghĩa tiếng Việt</th>
                    <th className="p-4 font-bold text-center">Phát âm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredVerbs.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">{v.v1}</td>
                      <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{v.v2}</td>
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{v.v3}</td>
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{v.meaning}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => speakWord(`${v.v1}, ${v.v2}, ${v.v3}`)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 rounded-lg transition-colors inline-flex"
                          title="Phát âm chuỗi động từ"
                        >
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

      {/* --- SUBTAB 3: CẤU TRÚC CÂU & PARAPHRASE --- */}
      {activeSubTab === 'grammar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Câu điều kiện (Conditionals)</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <span className="font-bold text-purple-700">Loại 1 (Có thể xảy ra):</span>
                <p className="font-mono mt-0.5">If + S + V(hiện tại), S + will + V(nguyên thể)</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
                <span className="font-bold text-indigo-700">Loại 2 (Không có thực ở hiện tại):</span>
                <p className="font-mono mt-0.5">If + S + V2/were, S + would/could + V(nguyên thể)</p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl">
                <span className="font-bold text-rose-700">Loại 3 (Không có thực ở quá khứ):</span>
                <p className="font-mono mt-0.5">If + S + had + V3, S + would have + V3</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Câu bị động (Passive Voice)</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
                <span className="font-bold text-emerald-700">Công thức chung:</span>
                <p className="font-mono mt-0.5 font-bold">S + be + V3/V-ed + (by O)</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <p>• Hiện tại đơn: <code className="font-bold">am/is/are + V3</code></p>
                <p>• Quá khứ đơn: <code className="font-bold">was/were + V3</code></p>
                <p>• Hiện tại hoàn thành: <code className="font-bold">have/has been + V3</code></p>
                <p>• Động từ khuyết thiếu: <code className="font-bold">modal verb + be + V3</code></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Send, 
  BarChart3, 
  BookOpen, 
  Filter, 
  Timer, 
  ListOrdered, 
  Sparkles, 
  RefreshCw,
  HelpCircle,
  Trophy,
  Check,
  Layers,
  GraduationCap,
  BookMarked,
  Eye,
  CheckCircle,
  X,
  Search,
  School,
  ExternalLink
} from 'lucide-react';
import { MathView } from './MathView';
import { 
  GRADE_TIERS, 
  GradeId, 
  EducationalTier, 
  SubjectCategory, 
  LessonTopic, 
  PracticeQuestion, 
  KNTT_LESSON_TOPICS, 
  KNTT_QUESTION_BANK 
} from '../data/knttCurriculumData';
import { 
  EXAM_PACKAGES, 
  QUESTION_BANK, 
  Question 
} from './THPTExamPractice';

export function KNTTPracticeHub() {
  // Navigation Modes
  const [hubMode, setHubMode] = useState<'topic-practice' | 'timed-exam' | 'handbook'>('topic-practice');

  // Filters
  const [selectedTier, setSelectedTier] = useState<EducationalTier | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeId | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'all'>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Theory summary modal
  const [viewingTopicModal, setViewingTopicModal] = useState<LessonTopic | null>(null);

  // Topic Practice State
  const [topicCurrentIdx, setTopicCurrentIdx] = useState(0);
  const [topicUserAnswers, setTopicUserAnswers] = useState<Record<string, string>>({});
  const [topicCheckedStatus, setTopicCheckedStatus] = useState<Record<string, boolean>>({});

  // Timed Exam State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('math-standard-1');
  const [examState, setExamState] = useState<'idle' | 'taking' | 'finished'>('idle');
  const [examCurrentIdx, setExamCurrentIdx] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Combined Unified Questions (THPT + KNTT Grades)
  const unifiedQuestions = useMemo(() => {
    // Map THPT existing questions into uniform structure
    const thptMapped: PracticeQuestion[] = QUESTION_BANK.map(q => {
      let subjCat: SubjectCategory = 'math';
      if (q.subject === 'physics' || q.subject === 'chemistry' || q.subject === 'biology') {
        subjCat = 'science';
      } else if (q.subject === 'english') {
        subjCat = 'english';
      }
      return {
        id: q.id,
        tier: 'high',
        gradeId: 'thpt-exam',
        gradeLabel: 'Ôn thi THPT',
        subject: subjCat,
        subjectLabel: q.subjectName,
        topicId: `thpt-${q.topic}`,
        topicName: q.topic,
        lessonName: `Chuyên đề: ${q.topic}`,
        difficulty: 'Thông hiểu',
        content: q.content,
        options: q.options as { id: 'A' | 'B' | 'C' | 'D'; text: string }[],
        correctOptionId: q.correctOptionId as 'A' | 'B' | 'C' | 'D',
        explanation: q.explanation
      };
    });

    return [...KNTT_QUESTION_BANK, ...thptMapped];
  }, []);

  // Filtered Topics for Topic-Practice & Handbook
  const filteredTopics = useMemo(() => {
    return KNTT_LESSON_TOPICS.filter(t => {
      const matchTier = selectedTier === 'all' || t.tier === selectedTier;
      const matchGrade = selectedGrade === 'all' || t.gradeId === selectedGrade;
      const matchSubj = selectedSubject === 'all' || t.subject === selectedSubject;
      const matchSearch = searchQuery.trim() === '' || 
        t.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.lessonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.gradeLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTier && matchGrade && matchSubj && matchSearch;
    });
  }, [selectedTier, selectedGrade, selectedSubject, searchQuery]);

  // Questions for Topic Practice
  const topicPracticeQuestions = useMemo(() => {
    return unifiedQuestions.filter(q => {
      const matchTier = selectedTier === 'all' || q.tier === selectedTier;
      const matchGrade = selectedGrade === 'all' || q.gradeId === selectedGrade;
      const matchSubj = selectedSubject === 'all' || q.subject === selectedSubject;
      const matchTopic = selectedTopicId === 'all' || q.topicId === selectedTopicId;
      return matchTier && matchGrade && matchSubj && matchTopic;
    });
  }, [unifiedQuestions, selectedTier, selectedGrade, selectedSubject, selectedTopicId]);

  // Questions for Timed Exam
  const examQuestions = useMemo(() => {
    if (selectedPackageId === 'all-standard-1') {
      return unifiedQuestions.slice(0, 40);
    }
    const pkg = EXAM_PACKAGES.find(p => p.id === selectedPackageId);
    if (pkg) {
      if (pkg.subject === 'all') return unifiedQuestions.slice(0, 30);
      let cat: SubjectCategory = 'math';
      if (pkg.subject === 'physics' || pkg.subject === 'chemistry' || pkg.subject === 'biology') cat = 'science';
      if (pkg.subject === 'english') cat = 'english';
      const filtered = unifiedQuestions.filter(q => q.subject === cat);
      return filtered.length > 0 ? filtered.slice(0, pkg.questionCount || 15) : unifiedQuestions.slice(0, 15);
    }
    return unifiedQuestions.slice(0, 15);
  }, [unifiedQuestions, selectedPackageId]);

  // Current question in Topic Practice
  const currentTopicQ = topicPracticeQuestions[topicCurrentIdx] || topicPracticeQuestions[0];

  // Current question in Timed Exam
  const currentExamQ = examQuestions[examCurrentIdx] || examQuestions[0];

  // Handle timed exam start
  const handleStartExam = () => {
    const pkg = EXAM_PACKAGES.find(p => p.id === selectedPackageId) || EXAM_PACKAGES[0];
    const durSec = pkg.durationMinutes * 60;
    setTimeLeftSeconds(durSec);
    setTotalTimeSeconds(durSec);
    setExamAnswers({});
    setFlaggedQuestions({});
    setExamCurrentIdx(0);
    setExamState('taking');
  };

  // Timer countdown effect
  useEffect(() => {
    if (examState === 'taking') {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState]);

  // Handle finish test
  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setExamState('finished');
  };

  // Calculate exam result
  const examResult = useMemo(() => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    examQuestions.forEach(q => {
      const ans = examAnswers[q.id];
      if (!ans) {
        unansweredCount++;
      } else if (ans === q.correctOptionId) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = examQuestions.length;
    const score = total > 0 ? Number(((correctCount / total) * 10).toFixed(2)) : 0;
    const timeSpent = totalTimeSeconds - timeLeftSeconds;

    return {
      correctCount,
      wrongCount,
      unansweredCount,
      total,
      score,
      timeSpent
    };
  }, [examQuestions, examAnswers, totalTimeSeconds, timeLeftSeconds]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Topic practice select option
  const handleTopicSelectOption = (qId: string, optId: string) => {
    setTopicUserAnswers(prev => ({
      ...prev,
      [qId]: optId
    }));
  };

  // Check answer in topic practice
  const handleCheckTopicAnswer = (qId: string) => {
    setTopicCheckedStatus(prev => ({
      ...prev,
      [qId]: true
    }));
  };

  // Exam select option
  const handleExamSelectOption = (qId: string, optId: string) => {
    if (examState !== 'taking') return;
    setExamAnswers(prev => ({
      ...prev,
      [qId]: optId
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Bộ sách Kết nối tri thức với cuộc sống (Chương trình GDPT 2018)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Luyện tập theo Khối lớp & Thi thử KNTT
            </h1>
            <p className="text-emerald-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Ngân hàng bài tập và đề thi trắc nghiệm theo từng chủ đề bài học: Tiểu học (Lớp 1 - 5), THCS (Lớp 6 - 9), THPT (Lớp 10 - 12) & Ôn thi THPT Quốc gia. Phản hồi tức thì, bấm giờ và phân tích lời giải chi tiết.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 self-start md:self-center">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center text-yellow-300">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white text-sm">Tiểu học - THCS - THPT</p>
              <p className="text-emerald-200">Đầy đủ 12 khối lớp SGK KNTT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Mode Tabs (Chế độ trải nghiệm) */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => setHubMode('topic-practice')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
            hubMode === 'topic-practice'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Luyện tập theo Chủ đề bài học SGK</span>
        </button>

        <button
          onClick={() => setHubMode('timed-exam')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
            hubMode === 'timed-exam'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>2. Thi thử trắc nghiệm & Bấm giờ chấm điểm</span>
        </button>

        <button
          onClick={() => setHubMode('handbook')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
            hubMode === 'handbook'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>3. Sổ tay Tóm tắt Lý thuyết & Công thức</span>
        </button>
      </div>

      {/* THANH BỘ LỌC CẤP HỌC, KHỐI LỚP VÀ MÔN HỌC */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Hàng 1: Chọn Cấp học (Tier) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm shrink-0">
            <School className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Chọn Cấp học:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setSelectedTier('all'); setSelectedGrade('all'); setSelectedTopicId('all'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedTier === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              🌟 Tất cả các cấp
            </button>
            {GRADE_TIERS.map(tier => (
              <button
                key={tier.tier}
                onClick={() => {
                  setSelectedTier(tier.tier);
                  setSelectedGrade(tier.grades[0].id);
                  setSelectedTopicId('all');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedTier === tier.tier
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hàng 2: Chọn Khối lớp cụ thể */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm shrink-0">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Khối lớp:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <button
              onClick={() => { setSelectedGrade('all'); setSelectedTopicId('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedGrade === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Tất cả lớp
            </button>

            {/* List all grades based on selectedTier or all */}
            {GRADE_TIERS.filter(t => selectedTier === 'all' || t.tier === selectedTier)
              .flatMap(t => t.grades)
              .map(g => (
                <button
                  key={g.id}
                  onClick={() => { setSelectedGrade(g.id); setSelectedTopicId('all'); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedGrade === g.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Hàng 3: Chọn Môn học */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Môn học:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubject === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>📚</span>
              <span>Tất cả môn</span>
            </button>
            <button
              onClick={() => setSelectedSubject('math')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubject === 'math'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>📐</span>
              <span>Toán học (KNTT)</span>
            </button>
            <button
              onClick={() => setSelectedSubject('science')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubject === 'science'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>🔬</span>
              <span>KHTN / Lý - Hóa - Sinh</span>
            </button>
            <button
              onClick={() => setSelectedSubject('english')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubject === 'english'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>🌍</span>
              <span>Tiếng Anh (Global Success)</span>
            </button>
            <button
              onClick={() => setSelectedSubject('literature')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubject === 'literature'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>📖</span>
              <span>Tiếng Việt / Ngữ văn</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODE 1: LUYỆN TẬP THEO CHỦ ĐỀ BÀI HỌC SGK KẾT NỐI
          ========================================================================= */}
      {hubMode === 'topic-practice' && (
        <div className="space-y-6">
          {/* Topic Picker / Selector Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Chủ đề bài học theo Sách Kết nối tri thức
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Chọn một chủ đề để làm bài tập tự luyện kèm lời giải chi tiết hoặc xem tóm tắt lý thuyết bài học
                </p>
              </div>

              {/* Search box for topics */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm chủ đề, bài học..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Topic Cards Carousel / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              <button
                onClick={() => { setSelectedTopicId('all'); setTopicCurrentIdx(0); }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedTopicId === 'all'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Tất cả chủ đề
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {unifiedQuestions.length} câu hỏi
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-2">
                  Luyện tập tổng hợp các bài học
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Bao gồm toàn bộ các bài học thuộc khối lớp và môn học đang chọn.
                </p>
              </button>

              {filteredTopics.map(t => {
                const isSelected = selectedTopicId === t.id;
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                          {t.gradeLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {t.subjectLabel}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-2 line-clamp-2">
                        {t.topicName}
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                        {t.lessonName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => setViewingTopicModal(t)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem lý thuyết</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTopicId(t.id);
                          setTopicCurrentIdx(0);
                        }}
                        className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800'
                        }`}
                      >
                        <span>{isSelected ? 'Đang luyện tập' : 'Luyện tập ngay'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Question Card */}
          {topicPracticeQuestions.length > 0 && currentTopicQ ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Question Header & Nav */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-xs">
                    Câu {topicCurrentIdx + 1} / {topicPracticeQuestions.length}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {currentTopicQ.gradeLabel} • {currentTopicQ.subjectLabel}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium">
                    Mức độ: {currentTopicQ.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={topicCurrentIdx === 0}
                    onClick={() => setTopicCurrentIdx(prev => Math.max(0, prev - 1))}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Câu trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {topicCurrentIdx + 1} / {topicPracticeQuestions.length}
                  </span>
                  <button
                    disabled={topicCurrentIdx === topicPracticeQuestions.length - 1}
                    onClick={() => setTopicCurrentIdx(prev => Math.min(topicPracticeQuestions.length - 1, prev + 1))}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Câu kế tiếp"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Topic & Lesson Name */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Chủ đề bài học</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {currentTopicQ.topicName} — <span className="text-emerald-600 dark:text-emerald-400">{currentTopicQ.lessonName}</span>
                  </p>
                </div>
              </div>

              {/* Question Content */}
              <div className="text-slate-900 dark:text-slate-100 text-base md:text-lg font-medium leading-relaxed">
                <MathView content={currentTopicQ.content} />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentTopicQ.options.map(opt => {
                  const isSelected = topicUserAnswers[currentTopicQ.id] === opt.id;
                  const isChecked = !!topicCheckedStatus[currentTopicQ.id];
                  const isCorrect = currentTopicQ.correctOptionId === opt.id;

                  let optClass = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700';

                  if (isSelected && !isChecked) {
                    optClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/30';
                  } else if (isChecked) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleTopicSelectOption(currentTopicQ.id, opt.id)}
                      className={`p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3 ${optClass}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {opt.id}
                      </span>
                      <div className="flex-1 pt-0.5">
                        <MathView inline content={opt.text} />
                      </div>
                      {isChecked && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {isChecked && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons (Kiểm tra đáp án & Câu tiếp theo) */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    disabled={!topicUserAnswers[currentTopicQ.id]}
                    onClick={() => handleCheckTopicAnswer(currentTopicQ.id)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Kiểm tra đáp án</span>
                  </button>

                  {topicCheckedStatus[currentTopicQ.id] && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                      topicUserAnswers[currentTopicQ.id] === currentTopicQ.correctOptionId
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {topicUserAnswers[currentTopicQ.id] === currentTopicQ.correctOptionId ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Chính xác! Hoan hô bạn!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Chưa chính xác. Xem lời giải chi tiết bên dưới:</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <button
                  disabled={topicCurrentIdx === topicPracticeQuestions.length - 1}
                  onClick={() => setTopicCurrentIdx(prev => prev + 1)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <span>Câu kế tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Detailed Explanation Card when Checked */}
              {topicCheckedStatus[currentTopicQ.id] && (
                <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                    <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Lời giải chi tiết chuẩn phương pháp SGK:</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                    <MathView content={currentTopicQ.explanation} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                Không tìm thấy bài tập phù hợp với bộ lọc hiện tại
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vui lòng thử chọn khối lớp khác hoặc nhấn nút bên dưới để đặt lại bộ lọc.
              </p>
              <button
                onClick={() => { setSelectedTier('all'); setSelectedGrade('all'); setSelectedSubject('all'); setSelectedTopicId('all'); }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 2: THI THỬ TRẮC NGHIỆM & BẤM GIỜ CHẤM ĐIỂM
          ========================================================================= */}
      {hubMode === 'timed-exam' && (
        <div className="space-y-6">
          {/* STATE 1: IDLE - LỰA CHỌN ĐỀ THI & BẮT ĐẦU */}
          {examState === 'idle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Chọn Đề thi thử & Kiểm tra Đánh giá Năng lực
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hệ thống đề thi chuẩn định dạng Bộ GD&ĐT bám sát cấu trúc SGK Kết nối tri thức
                  </p>
                </div>

                {/* Exam Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {EXAM_PACKAGES.map(pkg => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                            {pkg.subject === 'all' ? 'Tổng hợp 5 môn' : pkg.subject.toUpperCase()}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            {pkg.durationMinutes} phút
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-2">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {pkg.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Số lượng câu hỏi</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{examQuestions.length} câu trắc nghiệm</p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartExam}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Timer className="w-5 h-5" />
                    <span>Bắt đầu Bấm giờ Làm bài</span>
                  </button>
                </div>
              </div>

              {/* Right Guide Column */}
              <div className="lg:col-span-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800 space-y-4">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  Quy chế phòng thi trực tuyến
                </h4>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                    <span>Đồng hồ đếm ngược tự động kích hoạt. Khi hết thời gian, hệ thống tự động khóa đề và chấm điểm theo thang điểm 10.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                    <span>Có thể đánh dấu xem lại câu khó và chuyển nhanh tới bất kỳ câu nào thông qua bảng lưới câu hỏi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                    <span>Sau khi nộp bài, nhận ngay kết quả thống kê số câu đúng/sai cùng lời giải chi tiết KaTeX từng bước.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* STATE 2: TAKING - ĐANG LÀM BÀI THI */}
          {examState === 'taking' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Question Area */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-xs">
                      Câu {examCurrentIdx + 1} / {examQuestions.length}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                      {currentExamQ.gradeLabel} • {currentExamQ.topicName}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentExamQ.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      flaggedQuestions[currentExamQ.id]
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentExamQ.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}</span>
                  </button>
                </div>

                {/* Content */}
                <div className="text-slate-900 dark:text-slate-100 text-base md:text-lg font-medium leading-relaxed">
                  <MathView content={currentExamQ.content} />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentExamQ.options.map(opt => {
                    const isSelected = examAnswers[currentExamQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleExamSelectOption(currentExamQ.id, opt.id)}
                        className={`p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/30'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {opt.id}
                        </span>
                        <div className="flex-1 pt-0.5">
                          <MathView inline content={opt.text} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={examCurrentIdx === 0}
                    onClick={() => setExamCurrentIdx(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs disabled:opacity-40"
                  >
                    Câu trước
                  </button>

                  <button
                    disabled={examCurrentIdx === examQuestions.length - 1}
                    onClick={() => setExamCurrentIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs disabled:opacity-40"
                  >
                    Câu tiếp theo
                  </button>
                </div>
              </div>

              {/* Sidebar with Countdown Timer & Bubble Navigator */}
              <div className="lg:col-span-4 space-y-4">
                {/* Timer Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Thời gian còn lại</span>
                  <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {formatTime(timeLeftSeconds)}
                  </div>
                  <button
                    onClick={handleFinishExam}
                    className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Nộp bài & Chấm điểm</span>
                  </button>
                </div>

                {/* Question Bubbles Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Danh sách câu hỏi ({Object.keys(examAnswers).length} / {examQuestions.length})
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {examQuestions.map((q, idx) => {
                      const isAnswered = !!examAnswers[q.id];
                      const isCurrent = examCurrentIdx === idx;
                      const isFlagged = !!flaggedQuestions[q.id];

                      let style = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                      if (isCurrent) {
                        style = 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold';
                      } else if (isAnswered) {
                        style = 'bg-emerald-600 text-white font-bold';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setExamCurrentIdx(idx)}
                          className={`h-9 rounded-xl text-xs font-semibold relative transition-all ${style}`}
                        >
                          {idx + 1}
                          {isFlagged && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: FINISHED - KẾT QUẢ BÀI THI & XEM LẠI CHI TIẾT */}
          {examState === 'finished' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-xs">
                      Kết quả bài thi trắc nghiệm
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
                      Điểm số của bạn: <span className="text-emerald-600 dark:text-emerald-400">{examResult.score} / 10.0</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleStartExam}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Làm lại đề này</span>
                    </button>
                    <button
                      onClick={() => setExamState('idle')}
                      className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs"
                    >
                      Chọn đề khác
                    </button>
                  </div>
                </div>

                {/* Score Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Số câu đúng</p>
                      <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{examResult.correctCount} câu</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-rose-800 dark:text-rose-300 font-medium">Số câu sai</p>
                      <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{examResult.wrongCount} câu</p>
                    </div>
                    <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Chưa trả lời</p>
                      <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">{examResult.unansweredCount} câu</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Review detailed questions */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2 px-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Lời giải chi tiết từng câu hỏi
                </h3>

                {examQuestions.map((q, idx) => {
                  const userAns = examAnswers[q.id];
                  const isCorrect = userAns === q.correctOptionId;
                  const isAnswered = !!userAns;

                  return (
                    <div
                      key={q.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-xs">
                            Câu {idx + 1}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{q.topicName}</span>
                        </div>

                        <div>
                          {!isAnswered ? (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Chưa làm
                            </span>
                          ) : isCorrect ? (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                              ✓ Đúng
                            </span>
                          ) : (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                              ✗ Sai
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-800 dark:text-slate-200 font-medium text-base">
                        <MathView content={q.content} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map(opt => {
                          const isRightAnswer = q.correctOptionId === opt.id;
                          const isChosen = userAns === opt.id;

                          let style = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                          if (isRightAnswer) {
                            style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isChosen && !isRightAnswer) {
                            style = 'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 line-through';
                          }

                          return (
                            <div key={opt.id} className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${style}`}>
                              <span className="font-bold shrink-0">{opt.id}.</span>
                              <div className="flex-1">
                                <MathView inline content={opt.text} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5 mt-2">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Lời giải chi tiết:</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                          <MathView content={q.explanation} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 3: SỔ TAY TÓM TẮT LÝ THUYẾT & CÔNG THỨC KNTT
          ========================================================================= */}
      {hubMode === 'handbook' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Sổ tay Kiến thức trọng tâm & Bí kíp công thức SGK Kết nối tri thức
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tổng hợp đầy đủ lý thuyết cốt lõi, công thức Toán học, KHTN và phương pháp giải nhanh theo từng bài học
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredTopics.map(t => (
                <div
                  key={t.id}
                  className="bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      {t.gradeLabel}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t.subjectLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {t.topicName}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    {t.lessonName}
                  </p>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    <MathView content={t.keySummary} />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTopicId(t.id);
                      setHubMode('topic-practice');
                      setTopicCurrentIdx(0);
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Luyện tập bài tập chủ đề này</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM TÓM TẮT LÝ THUYẾT BÀI HỌC */}
      {viewingTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {viewingTopicModal.gradeLabel} • {viewingTopicModal.subjectLabel}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mt-2">
                  {viewingTopicModal.topicName}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {viewingTopicModal.lessonName}
                </p>
              </div>

              <button
                onClick={() => setViewingTopicModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kiến thức cốt lõi & Công thức then chốt (SGK Kết nối)
              </span>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <MathView content={viewingTopicModal.keySummary} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewingTopicModal(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setSelectedTopicId(viewingTopicModal.id);
                  setViewingTopicModal(null);
                  setHubMode('topic-practice');
                  setTopicCurrentIdx(0);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Bắt đầu làm bài tập chủ đề này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

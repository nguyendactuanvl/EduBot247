import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  BookOpen,
  Layers,
  Award,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { MathView } from './MathView';
import {
  FULL_CHAPTER4_VECTORS_EXAM,
  GRADE10_VECTORS_LESSONS,
  VectorExamSet,
  isShortAnswerCorrect,
  normalizeShortAnswer,
  scoreTrueFalseCount,
} from '../data/exams/grade10VectorsExams';

interface VectorChapterExamsProps {
  onBack?: () => void;
}

interface SavedScoreMap {
  [examId: string]: {
    bestRawScore: number;
    maxRawScore: number;
    attempts: number;
  };
}

const STORAGE_KEY = 'edubot_g10_vectors_scores_v1';

function loadSavedScores(): SavedScoreMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedScoreMap) : {};
  } catch {
    return {};
  }
}

function saveScores(data: SavedScoreMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

function formatTimer(seconds: number): string {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const VectorChapterExams: React.FC<VectorChapterExamsProps> = ({ onBack }) => {
  const [activeExam, setActiveExam] = useState<VectorExamSet | null>(null);
  const [savedScores, setSavedScores] = useState<SavedScoreMap>(() => loadSavedScores());

  // Answers state
  const [mcAnswers, setMcAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [saAnswers, setSaAnswers] = useState<Record<string, string>>({});

  // Exam lifecycle state
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState(0);
  const [showUnansweredConfirm, setShowUnansweredConfirm] = useState(false);

  const startExam = useCallback((exam: VectorExamSet) => {
    setActiveExam(exam);
    setMcAnswers({});
    setTfAnswers({});
    setSaAnswers({});
    setSubmitted(false);
    setShowUnansweredConfirm(false);
    setSecondsLeft(exam.durationMinutes * 60);
    setTimeUsedSeconds(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetCurrentExam = useCallback(() => {
    if (!activeExam) return;
    startExam(activeExam);
  }, [activeExam, startExam]);

  // Compute exact Ministry of Education (Bộ GD&ĐT) score breakdown
  const scoreSummary = useMemo(() => {
    if (!activeExam) {
      return {
        mcScore: 0,
        mcMax: 0,
        mcCorrectCount: 0,
        tfScore: 0,
        tfMax: 0,
        tfExactCount: 0,
        saScore: 0,
        saMax: 0,
        saCorrectCount: 0,
        totalRaw: 0,
        totalMax: 0,
        scale10: 0,
      };
    }

    let mcCorrectCount = 0;
    activeExam.multipleChoice.forEach((q) => {
      if (mcAnswers[q.id] === q.correctOption) mcCorrectCount += 1;
    });
    const mcScore = mcCorrectCount * 0.25;
    const mcMax = activeExam.multipleChoice.length * 0.25;

    let tfScore = 0;
    let tfExactCount = 0;
    activeExam.trueFalse.forEach((q) => {
      const userMap = tfAnswers[q.id] || {};
      let correctStatements = 0;
      q.statements.forEach((st) => {
        if (userMap[st.id] === st.isCorrect) {
          correctStatements += 1;
        }
      });
      if (correctStatements === 4) tfExactCount += 1;
      tfScore += scoreTrueFalseCount(correctStatements);
    });
    const tfMax = activeExam.trueFalse.length * 1.0;

    let saCorrectCount = 0;
    activeExam.shortAnswer.forEach((q) => {
      if (isShortAnswerCorrect(saAnswers[q.id] || '', q)) {
        saCorrectCount += 1;
      }
    });
    const saScore = saCorrectCount * 0.5;
    const saMax = activeExam.shortAnswer.length * 0.5;

    const totalRaw = Number((mcScore + tfScore + saScore).toFixed(2));
    const totalMax = Number((mcMax + tfMax + saMax).toFixed(2));
    const scale10 = totalMax > 0 ? Number(((totalRaw / totalMax) * 10).toFixed(2)) : 0;

    return {
      mcScore: Number(mcScore.toFixed(2)),
      mcMax: Number(mcMax.toFixed(2)),
      mcCorrectCount,
      tfScore: Number(tfScore.toFixed(2)),
      tfMax: Number(tfMax.toFixed(2)),
      tfExactCount,
      saScore: Number(saScore.toFixed(2)),
      saMax: Number(saMax.toFixed(2)),
      saCorrectCount,
      totalRaw,
      totalMax,
      scale10,
    };
  }, [activeExam, mcAnswers, tfAnswers, saAnswers]);

  const handleFinalizeSubmit = useCallback(() => {
    if (!activeExam || submitted) return;
    setSubmitted(true);
    setShowUnansweredConfirm(false);
    setTimeUsedSeconds(activeExam.durationMinutes * 60 - secondsLeft);

    setSavedScores((prev) => {
      const existing = prev[activeExam.id];
      const bestRawScore = existing
        ? Math.max(existing.bestRawScore, scoreSummary.totalRaw)
        : scoreSummary.totalRaw;
      const next: SavedScoreMap = {
        ...prev,
        [activeExam.id]: {
          bestRawScore,
          maxRawScore: scoreSummary.totalMax,
          attempts: (existing?.attempts ?? 0) + 1,
        },
      };
      saveScores(next);
      return next;
    });
  }, [activeExam, submitted, secondsLeft, scoreSummary]);

  // Countdown timer
  useEffect(() => {
    if (!activeExam || submitted) return;
    if (secondsLeft <= 0) {
      handleFinalizeSubmit();
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeExam, submitted, secondsLeft, handleFinalizeSubmit]);

  const totalQuestions = activeExam
    ? activeExam.multipleChoice.length +
      activeExam.trueFalse.length +
      activeExam.shortAnswer.length
    : 0;

  const answeredCount = useMemo(() => {
    if (!activeExam) return 0;
    let count = 0;
    activeExam.multipleChoice.forEach((q) => {
      if (mcAnswers[q.id]) count += 1;
    });
    activeExam.trueFalse.forEach((q) => {
      const m = tfAnswers[q.id];
      if (m && Object.keys(m).length > 0) count += 1;
    });
    activeExam.shortAnswer.forEach((q) => {
      if ((saAnswers[q.id] || '').trim().length > 0) count += 1;
    });
    return count;
  }, [activeExam, mcAnswers, tfAnswers, saAnswers]);

  const handleSubmitClick = () => {
    if (answeredCount < totalQuestions) {
      setShowUnansweredConfirm(true);
    } else {
      handleFinalizeSubmit();
    }
  };

  const scrollToQuestion = (domId: string) => {
    const el = document.getElementById(domId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // =========================================================================
  // VIEW 1: LESSON & FULL CHAPTER SELECTION HUB
  // =========================================================================
  if (!activeExam) {
    const fullBest = savedScores[FULL_CHAPTER4_VECTORS_EXAM.id];
    const completedLessons = GRADE10_VECTORS_LESSONS.filter((l) => savedScores[l.id]).length;

    return (
      <div className="max-w-5xl mx-auto pb-12 space-y-8">
        {/* Top Back Navigation & Title */}
        <div className="space-y-2">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Danh sách Chương Lớp 10</span>
            </button>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Chương IV: Vectơ (Toán 10 – Kết nối tri thức)
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Luyện tập theo từng bài (Bài 7 – Bài 11) hoặc làm đề tổng ôn cả chương theo chuẩn 3 phần của Bộ GD&ĐT.
              </p>
            </div>
            <div className="text-xs sm:text-sm font-mono tabular-nums text-slate-600 dark:text-slate-300 shrink-0">
              Đã luyện {completedLessons}/5 bài · 30 câu chuẩn
            </div>
          </div>
        </div>

        {/* Featured Full Chapter Exam Card */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 sm:p-7 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-100 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Đề Tổng Ôn Toàn Chương IV</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              {FULL_CHAPTER4_VECTORS_EXAM.title}
            </h2>
            <p className="text-sm text-indigo-100/95">
              20 câu Trắc nghiệm (0.25đ/câu) · 5 câu Đúng/Sai (tối đa 1.0đ/câu) · 5 câu Trả lời ngắn (0.5đ/câu) · Thời gian 45 phút.
            </p>
            {fullBest && (
              <div className="text-xs font-mono tabular-nums text-amber-200 pt-1">
                Thành tích cao nhất: {fullBest.bestRawScore.toFixed(2)}/{fullBest.maxRawScore.toFixed(2)} đ ({((fullBest.bestRawScore / fullBest.maxRawScore) * 10).toFixed(2)}/10) · {fullBest.attempts} lần làm
              </div>
            )}
          </div>
          <button
            onClick={() => startExam(FULL_CHAPTER4_VECTORS_EXAM)}
            className="px-5 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-sm transition-colors inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Làm đề Tổng ôn</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Lesson Practice Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Luyện tập theo từng bài học</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Mỗi bài gồm 4 câu TN · 1 câu Đúng/Sai · 1 câu Trả lời ngắn
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GRADE10_VECTORS_LESSONS.map((lesson) => {
              const best = savedScores[lesson.id];
              return (
                <button
                  key={lesson.id}
                  onClick={() => startExam(lesson)}
                  className="group text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs transition-all flex flex-col justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {lesson.code}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        6 câu · {lesson.durationMinutes} phút
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lesson.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    {best ? (
                      <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                        Cao nhất: {best.bestRawScore.toFixed(2)}/{best.maxRawScore.toFixed(2)} đ ({((best.bestRawScore / best.maxRawScore) * 10).toFixed(1)}/10)
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">Chưa làm bài này</span>
                    )}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">
                      Bắt đầu <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ministry of Education Scoring Reference */}
        <div className="rounded-xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
          <div className="font-semibold text-slate-800 dark:text-slate-100">
            Quy ước chấm điểm chuẩn cấu trúc Bộ GD&ĐT:
          </div>
          <p>
            Phần I (Trắc nghiệm 4 lựa chọn): <strong className="font-mono">0.25đ</strong>/câu đúng · Phần II (Đúng/Sai 4 ý): đúng 1 ý <strong className="font-mono">0.10đ</strong>, 2 ý <strong className="font-mono">0.25đ</strong>, 3 ý <strong className="font-mono">0.50đ</strong>, 4 ý <strong className="font-mono">1.00đ</strong> · Phần III (Trả lời ngắn): <strong className="font-mono">0.50đ</strong>/câu đúng.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INTERACTIVE EXAM & GRADING RESULTS
  // =========================================================================
  const mcOffset = 0;
  const tfOffset = activeExam.multipleChoice.length;
  const saOffset = activeExam.multipleChoice.length + activeExam.trueFalse.length;

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Sticky Top Control & Timer Bar */}
      <div className="sticky top-0 z-20 -mx-2 px-3 py-3 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setActiveExam(null)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
            title="Quay lại danh sách bài"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {activeExam.title}
            </h2>
            <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              Đã làm {answeredCount}/{totalQuestions} câu
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Timer */}
          <div
            className={`px-3 py-1.5 rounded-lg border font-mono tabular-nums text-sm font-bold flex items-center gap-1.5 ${
              submitted
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                : secondsLeft <= 120
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{submitted ? formatTimer(timeUsedSeconds) : formatTimer(secondsLeft)}</span>
          </div>

          {!submitted ? (
            <button
              onClick={handleSubmitClick}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài</span>
            </button>
          ) : (
            <button
              onClick={resetCurrentExam}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại đề này</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Confirm Banner if submitting with unanswered questions */}
      {showUnansweredConfirm && !submitted && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-sm text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              Bạn mới trả lời <strong className="font-mono">{answeredCount}/{totalQuestions}</strong> câu. Bạn vẫn muốn nộp bài ngay bây giờ chứ?
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowUnansweredConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Làm tiếp
            </button>
            <button
              onClick={handleFinalizeSubmit}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
            >
              Xác nhận nộp bài
            </button>
          </div>
        </div>
      )}

      {/* Results Summary Card (after submit) */}
      {submitted && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/40 shadow-md p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kết quả chấm điểm chuẩn Bộ GD&ĐT
                </div>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {scoreSummary.totalRaw.toFixed(2)} / {scoreSummary.totalMax.toFixed(2)} đ
                  </span>
                  <span className="text-sm font-mono tabular-nums font-semibold text-slate-600 dark:text-slate-300">
                    (Quy đổi: {scoreSummary.scale10.toFixed(2)} / 10)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetCurrentExam}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại đề này</span>
              </button>
              <button
                onClick={() => setActiveExam(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
              >
                Chọn bài khác
              </button>
            </div>
          </div>

          {/* 3-Part Score Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Phần I · Nhiều lựa chọn
              </div>
              <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {scoreSummary.mcScore.toFixed(2)} / {scoreSummary.mcMax.toFixed(2)} đ
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Đúng {scoreSummary.mcCorrectCount}/{activeExam.multipleChoice.length}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Phần II · Đúng / Sai
              </div>
              <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {scoreSummary.tfScore.toFixed(2)} / {scoreSummary.tfMax.toFixed(2)} đ
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Trọn 4 ý: {scoreSummary.tfExactCount}/{activeExam.trueFalse.length}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Phần III · Trả lời ngắn
              </div>
              <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {scoreSummary.saScore.toFixed(2)} / {scoreSummary.saMax.toFixed(2)} đ
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Đúng {scoreSummary.saCorrectCount}/{activeExam.shortAnswer.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Question Navigator */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          Chuyển nhanh đến câu hỏi
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeExam.multipleChoice.map((q, idx) => {
            const num = mcOffset + idx + 1;
            const answered = Boolean(mcAnswers[q.id]);
            const isCorrect = mcAnswers[q.id] === q.correctOption;
            let cls =
              'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            if (submitted) {
              cls = isCorrect
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-rose-600 text-white border-rose-600';
            } else if (answered) {
              cls = 'bg-indigo-600 text-white border-indigo-600';
            }
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(`q-${q.id}`)}
                className={`w-8 h-8 rounded-lg border font-mono text-xs font-bold transition-colors cursor-pointer ${cls}`}
              >
                {num}
              </button>
            );
          })}

          {activeExam.trueFalse.map((q, idx) => {
            const num = tfOffset + idx + 1;
            const userMap = tfAnswers[q.id] || {};
            const answered = Object.keys(userMap).length > 0;
            let correctCount = 0;
            q.statements.forEach((st) => {
              if (userMap[st.id] === st.isCorrect) correctCount += 1;
            });
            let cls =
              'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            if (submitted) {
              if (correctCount === 4) {
                cls = 'bg-emerald-600 text-white border-emerald-600';
              } else if (correctCount > 0) {
                cls = 'bg-amber-500 text-white border-amber-500';
              } else {
                cls = 'bg-rose-600 text-white border-rose-600';
              }
            } else if (answered) {
              cls = 'bg-indigo-600 text-white border-indigo-600';
            }
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(`q-${q.id}`)}
                className={`w-8 h-8 rounded-lg border font-mono text-xs font-bold transition-colors cursor-pointer ${cls}`}
              >
                {num}
              </button>
            );
          })}

          {activeExam.shortAnswer.map((q, idx) => {
            const num = saOffset + idx + 1;
            const answered = (saAnswers[q.id] || '').trim().length > 0;
            const isCorrect = isShortAnswerCorrect(saAnswers[q.id] || '', q);
            let cls =
              'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            if (submitted) {
              cls = isCorrect
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-rose-600 text-white border-rose-600';
            } else if (answered) {
              cls = 'bg-indigo-600 text-white border-indigo-600';
            }
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(`q-${q.id}`)}
                className={`w-8 h-8 rounded-lg border font-mono text-xs font-bold transition-colors cursor-pointer ${cls}`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN                        */}
      {/* =================================================================== */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Phần I. Câu trắc nghiệm nhiều phương án lựa chọn ({activeExam.multipleChoice.length} câu)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mỗi câu hỏi thí sinh chỉ chọn một phương án · 0.25 điểm/câu đúng.
          </p>
        </div>

        <div className="space-y-4">
          {activeExam.multipleChoice.map((q, idx) => {
            const qNum = mcOffset + idx + 1;
            const selected = mcAnswers[q.id];
            const isCorrect = selected === q.correctOption;

            const cardBorder = !submitted
              ? 'border-slate-200 dark:border-slate-800'
              : isCorrect
                ? 'border-emerald-400 dark:border-emerald-700'
                : 'border-rose-400 dark:border-rose-700';

            return (
              <div
                id={`q-${q.id}`}
                key={q.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 border ${cardBorder} p-5 shadow-xs space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1.5">
                      Câu {qNum}.
                    </span>
                    {activeExam.isFullChapter && (
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1.5">
                        [{q.lessonLabel}]
                      </span>
                    )}
                    <MathView content={q.question} inline />
                  </div>

                  {submitted && (
                    <div
                      className={`shrink-0 inline-flex items-center gap-1 text-xs font-mono font-bold ${
                        isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>{isCorrect ? '+0.25đ' : '0.00đ'}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isPicked = selected === opt.id;
                    const isRightOpt = opt.id === q.correctOption;

                    let btnClass =
                      'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500';
                    if (!submitted && isPicked) {
                      btnClass =
                        'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-100 ring-1 ring-indigo-500/40';
                    } else if (submitted) {
                      if (isRightOpt) {
                        btnClass =
                          'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-100';
                      } else if (isPicked && !isRightOpt) {
                        btnClass =
                          'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-100';
                      } else {
                        btnClass =
                          'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setMcAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                        }
                        className={`text-left px-3.5 py-3 rounded-xl border transition-all flex items-start gap-2.5 text-sm ${btnClass} ${
                          submitted ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span className="font-mono font-bold shrink-0 mt-0.5">
                          {opt.id}.
                        </span>
                        <span className="flex-1">
                          <MathView content={opt.text} inline />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Đáp án đúng: {q.correctOption} · Lời giải chi tiết
                    </div>
                    <MathView content={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI                                     */}
      {/* =================================================================== */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Phần II. Câu trắc nghiệm đúng sai ({activeExam.trueFalse.length} câu)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Trong mỗi ý a), b), c), d) chọn Đúng hoặc Sai · Đúng 1 ý: 0.10đ · 2 ý: 0.25đ · 3 ý: 0.50đ · 4 ý: 1.00đ.
          </p>
        </div>

        <div className="space-y-4">
          {activeExam.trueFalse.map((q, idx) => {
            const qNum = tfOffset + idx + 1;
            const userMap = tfAnswers[q.id] || {};
            let correctCount = 0;
            q.statements.forEach((st) => {
              if (userMap[st.id] === st.isCorrect) correctCount += 1;
            });
            const earned = scoreTrueFalseCount(correctCount);

            const cardBorder = !submitted
              ? 'border-slate-200 dark:border-slate-800'
              : correctCount === 4
                ? 'border-emerald-400 dark:border-emerald-700'
                : correctCount > 0
                  ? 'border-amber-400 dark:border-amber-700'
                  : 'border-rose-400 dark:border-rose-700';

            return (
              <div
                id={`q-${q.id}`}
                key={q.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 border ${cardBorder} p-5 shadow-xs space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1.5">
                      Câu {qNum}.
                    </span>
                    {activeExam.isFullChapter && (
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1.5">
                        [{q.lessonLabel}]
                      </span>
                    )}
                    <MathView content={q.question} inline />
                  </div>

                  {submitted && (
                    <div
                      className={`shrink-0 text-xs font-mono font-bold ${
                        correctCount === 4
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : correctCount > 0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      +{earned.toFixed(2)}đ ({correctCount}/4 ý)
                    </div>
                  )}
                </div>

                {/* 4-statement table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
                  {q.statements.map((st) => {
                    const picked = userMap[st.id];
                    const rowCorrect = picked === st.isCorrect;

                    const rowBg = !submitted
                      ? 'bg-white dark:bg-slate-900'
                      : rowCorrect
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/25'
                        : 'bg-rose-50/70 dark:bg-rose-950/25';

                    return (
                      <div key={st.id} className={`p-3.5 space-y-2 ${rowBg}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                            <span className="font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
                              {st.id})
                            </span>
                            <span>
                              <MathView content={st.text} inline />
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              disabled={submitted}
                              onClick={() =>
                                setTfAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), [st.id]: true },
                                }))
                              }
                              className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                                picked === true
                                  ? submitted
                                    ? st.isCorrect
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'bg-rose-600 border-rose-600 text-white'
                                    : 'bg-indigo-600 border-indigo-600 text-white'
                                  : submitted && st.isCorrect
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                              } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              Đúng
                            </button>

                            <button
                              type="button"
                              disabled={submitted}
                              onClick={() =>
                                setTfAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), [st.id]: false },
                                }))
                              }
                              className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                                picked === false
                                  ? submitted
                                    ? !st.isCorrect
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'bg-rose-600 border-rose-600 text-white'
                                    : 'bg-indigo-600 border-indigo-600 text-white'
                                  : submitted && !st.isCorrect
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                              } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              Sai
                            </button>
                          </div>
                        </div>

                        {submitted && (
                          <div className="text-xs text-slate-600 dark:text-slate-300 pl-5 border-l-2 border-slate-300 dark:border-slate-700">
                            <span className="font-bold mr-1 text-slate-800 dark:text-slate-100">
                              [{st.isCorrect ? 'Đúng' : 'Sai'}]
                            </span>
                            <MathView content={st.explanation} inline />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* PHẦN III: TRẢ LỜI NGẮN                                              */}
      {/* =================================================================== */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Phần III. Câu trắc nghiệm trả lời ngắn ({activeExam.shortAnswer.length} câu)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nhập kết quả số (tự động nhận cả dấu phẩy "," và dấu chấm ".") · 0.50 điểm/câu đúng.
          </p>
        </div>

        <div className="space-y-4">
          {activeExam.shortAnswer.map((q, idx) => {
            const qNum = saOffset + idx + 1;
            const userVal = saAnswers[q.id] || '';
            const isCorrect = isShortAnswerCorrect(userVal, q);

            const cardBorder = !submitted
              ? 'border-slate-200 dark:border-slate-800'
              : isCorrect
                ? 'border-emerald-400 dark:border-emerald-700'
                : 'border-rose-400 dark:border-rose-700';

            return (
              <div
                id={`q-${q.id}`}
                key={q.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 border ${cardBorder} p-5 shadow-xs space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1.5">
                      Câu {qNum}.
                    </span>
                    {activeExam.isFullChapter && (
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1.5">
                        [{q.lessonLabel}]
                      </span>
                    )}
                    <MathView content={q.question} inline />
                  </div>

                  {submitted && (
                    <div
                      className={`shrink-0 inline-flex items-center gap-1 text-xs font-mono font-bold ${
                        isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>{isCorrect ? '+0.50đ' : '0.00đ'}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={submitted}
                      value={userVal}
                      onChange={(e) =>
                        setSaAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Nhập đáp số (VD: 2.83 hoặc -1)"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm font-semibold focus:outline-none focus:ring-2 transition-colors ${
                        !submitted
                          ? 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500/20'
                          : isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200'
                      }`}
                    />
                    {q.unit && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400">
                        {q.unit}
                      </span>
                    )}
                  </div>

                  {!submitted && userVal.includes(',') && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Chuẩn hóa: {normalizeShortAnswer(userVal)}
                    </span>
                  )}

                  {submitted && (
                    <div className="text-xs sm:text-sm font-mono">
                      <span className="text-slate-500 dark:text-slate-400">Đáp án chuẩn: </span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {q.correctAnswer}
                        {q.unit ? ` ${q.unit}` : ''}
                      </strong>
                    </div>
                  )}
                </div>

                {submitted && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Lời giải chi tiết
                    </div>
                    <MathView content={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Submit / Retry Bar */}
      <div className="pt-4 flex justify-center">
        {!submitted ? (
          <button
            onClick={handleSubmitClick}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài và xem điểm ({answeredCount}/{totalQuestions})</span>
          </button>
        ) : (
          <button
            onClick={resetCurrentExam}
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại đề này</span>
          </button>
        )}
      </div>
    </div>
  );
};

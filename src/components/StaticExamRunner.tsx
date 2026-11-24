import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  Award,
  AlertTriangle,
  Flag,
  ListChecks,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { MathView } from './MathView';
import { AntiCheatGuard } from './AntiCheatGuard';
import { ExamPaper } from './TriangleTrigExams';

interface StaticExamRunnerProps {
  heading: string;
  subheading?: string;
  gradeLabel: string;
  papers: ExamPaper[];
  storagePrefix: string;
  onBack?: () => void;
}

interface SavedStaticScore {
  bestScale10: number;
  lastScale10: number;
  attempts: number;
}

function formatTimer(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function scoreTrueFalseCount(rightCount: number): number {
  switch (rightCount) {
    case 1:
      return 0.1;
    case 2:
      return 0.25;
    case 3:
      return 0.5;
    case 4:
      return 1.0;
    default:
      return 0;
  }
}

function normalizeShort(raw: string): string {
  return raw.trim().replace(/\s+/g, '').replace(/,/g, '.').replace(/−/g, '-');
}

function isShortCorrect(userVal: string, expected: string, acceptable: string[] = []): boolean {
  const u = normalizeShort(userVal);
  if (!u) return false;
  const cands = [expected, ...acceptable].filter(Boolean).map(normalizeShort);
  if (cands.includes(u)) return true;
  const uNum = Number(u);
  if (!Number.isNaN(uNum)) {
    return cands.some((c) => {
      const cNum = Number(c);
      return !Number.isNaN(cNum) && Math.abs(uNum - cNum) < 1e-6;
    });
  }
  return false;
}

export const StaticExamRunner: React.FC<StaticExamRunnerProps> = ({
  heading,
  subheading,
  gradeLabel,
  papers,
  storagePrefix,
  onBack,
}) => {
  const scoresKey = `${storagePrefix}_scores_v1`;
  const [savedScores, setSavedScores] = useState<Record<string, SavedStaticScore>>(() => {
    try {
      const raw = localStorage.getItem(scoresKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [selectedExam, setSelectedExam] = useState<ExamPaper | null>(null);
  const [mcAnswers, setMcAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [tfAnswers, setTfAnswers] = useState<
    Record<string, Partial<Record<'a' | 'b' | 'c' | 'd', boolean>>>
  >({});
  const [saAnswers, setSaAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);

  const topRef = useRef<HTMLDivElement | null>(null);
  const autoSubmittedRef = useRef(false);

  const startExam = useCallback((paper: ExamPaper) => {
    setSelectedExam(paper);
    setMcAnswers({});
    setTfAnswers({});
    setSaAnswers({});
    setFlaggedIds([]);
    setSecondsLeft(paper.durationMinutes * 60);
    setTimeUsedSeconds(0);
    setSubmitted(false);
    setAutoSubmitted(false);
    setShowSubmitConfirm(false);
    setIsMobilePaletteOpen(false);
    setShowExplanations(true);
    autoSubmittedRef.current = false;
  }, []);

  const grading = useMemo(() => {
    if (!selectedExam) {
      return {
        p1Score: 0,
        p1Max: 0,
        p1Correct: 0,
        p2Score: 0,
        p2Max: 0,
        p2Full: 0,
        p3Score: 0,
        p3Max: 0,
        p3Correct: 0,
        rawTotal: 0,
        rawMax: 0,
        scale10: 0,
      };
    }

    let p1Correct = 0;
    selectedExam.questionsPart1.forEach((q) => {
      if (mcAnswers[q.id] === q.correctOption) p1Correct += 1;
    });
    const p1Score = Number((p1Correct * 0.25).toFixed(2));
    const p1Max = Number((selectedExam.questionsPart1.length * 0.25).toFixed(2));

    let p2Score = 0;
    let p2Full = 0;
    selectedExam.questionsPart2.forEach((q) => {
      const map = tfAnswers[q.id] || {};
      const rightCount = q.statements.filter((st) => map[st.id] === st.correct).length;
      if (rightCount === 4) p2Full += 1;
      p2Score += scoreTrueFalseCount(rightCount);
    });
    p2Score = Number(p2Score.toFixed(2));
    const p2Max = Number((selectedExam.questionsPart2.length * 1.0).toFixed(2));

    let p3Correct = 0;
    selectedExam.questionsPart3.forEach((q) => {
      if (isShortCorrect(saAnswers[q.id] || '', q.correctAnswer, q.acceptableAnswers)) {
        p3Correct += 1;
      }
    });
    const p3Score = Number((p3Correct * 0.5).toFixed(2));
    const p3Max = Number((selectedExam.questionsPart3.length * 0.5).toFixed(2));

    const rawTotal = Number((p1Score + p2Score + p3Score).toFixed(2));
    const rawMax = Number((p1Max + p2Max + p3Max).toFixed(2));
    const scale10 = rawMax > 0 ? Number(((rawTotal / rawMax) * 10).toFixed(2)) : 0;

    return {
      p1Score,
      p1Max,
      p1Correct,
      p2Score,
      p2Max,
      p2Full,
      p3Score,
      p3Max,
      p3Correct,
      rawTotal,
      rawMax,
      scale10,
    };
  }, [selectedExam, mcAnswers, tfAnswers, saAnswers]);

  const finalizeSubmit = useCallback(
    (isAuto = false) => {
      if (!selectedExam || submitted) return;
      const totalSec = selectedExam.durationMinutes * 60;
      setTimeUsedSeconds(Math.max(0, totalSec - secondsLeft));
      setSubmitted(true);
      setAutoSubmitted(isAuto);
      setShowSubmitConfirm(false);
      setShowExplanations(true);

      setSavedScores((prev) => {
        const old = prev[selectedExam.id];
        const next: Record<string, SavedStaticScore> = {
          ...prev,
          [selectedExam.id]: {
            bestScale10: old ? Math.max(old.bestScale10, grading.scale10) : grading.scale10,
            lastScale10: grading.scale10,
            attempts: (old?.attempts || 0) + 1,
          },
        };
        try {
          localStorage.setItem(scoresKey, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });

      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [selectedExam, submitted, secondsLeft, grading.scale10, scoresKey]
  );

  useEffect(() => {
    if (!selectedExam || submitted) return;
    if (secondsLeft <= 0) {
      if (!autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        finalizeSubmit(true);
      }
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [selectedExam, submitted, secondsLeft, finalizeSubmit]);

  const answeredSummary = useMemo(() => {
    if (!selectedExam) return { answered: 0, total: 0 };
    const p1 = selectedExam.questionsPart1.filter((q) => Boolean(mcAnswers[q.id])).length;
    const p2 = selectedExam.questionsPart2.filter((q) => {
      const m = tfAnswers[q.id];
      return m && q.statements.every((st) => m[st.id] !== undefined);
    }).length;
    const p3 = selectedExam.questionsPart3.filter((q) => (saAnswers[q.id] || '').trim().length > 0).length;
    return {
      answered: p1 + p2 + p3,
      total:
        selectedExam.questionsPart1.length +
        selectedExam.questionsPart2.length +
        selectedExam.questionsPart3.length,
    };
  }, [selectedExam, mcAnswers, tfAnswers, saAnswers]);

  const toggleFlag = useCallback((qId: string) => {
    setFlaggedIds((prev) => (prev.includes(qId) ? prev.filter((x) => x !== qId) : [...prev, qId]));
  }, []);

  const scrollToQuestion = useCallback((qId: string) => {
    const el = document.getElementById(`static-q-${qId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setIsMobilePaletteOpen(false);
  }, []);

  if (!selectedExam) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
            )}
            <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              {gradeLabel}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{heading}</h2>
          {subheading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subheading}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map((exam) => {
            const p1 = exam.questionsPart1.length;
            const p2 = exam.questionsPart2.length;
            const p3 = exam.questionsPart3.length;
            const total = p1 + p2 + p3;
            const score = savedScores[exam.id];

            return (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      {total} câu · {exam.durationMinutes} phút
                    </span>
                    {score && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Trophy className="w-3 h-3" />
                        {score.bestScale10.toFixed(2)}đ
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-1.5">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {p1 > 0 ? `${p1} câu Trắc nghiệm` : ''}
                    {p2 > 0 ? ` · ${p2} câu Đúng/Sai` : ''}
                    {p3 > 0 ? ` · ${p3} câu Trả lời ngắn` : ''}
                  </p>
                </div>

                <button
                  onClick={() => startExam(exam)}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Vào phòng thi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const isFiveMinuteWarning = !submitted && secondsLeft > 0 && secondsLeft <= 300;

  const renderPalette = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
          <ListChecks className="w-4 h-4 text-indigo-500" />
          Câu hỏi ({answeredSummary.answered}/{answeredSummary.total})
        </span>
      </div>

      {selectedExam.questionsPart1.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
            Phần I · Trắc nghiệm
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {selectedExam.questionsPart1.map((q) => {
              const isFlagged = flaggedIds.includes(q.id);
              const isDone = Boolean(mcAnswers[q.id]);
              const isRight = submitted && mcAnswers[q.id] === q.correctOption;
              const cls = submitted
                ? isRight
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-rose-500 text-white border-rose-600'
                : isFlagged
                  ? 'bg-amber-400 text-slate-950 border-amber-500'
                  : isDone
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`h-9 rounded-lg border text-xs font-mono font-bold cursor-pointer ${cls}`}
                >
                  {q.number}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedExam.questionsPart2.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
            Phần II · Đúng / Sai
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {selectedExam.questionsPart2.map((q) => {
              const map = tfAnswers[q.id] || {};
              const rightCount = q.statements.filter((st) => map[st.id] === st.correct).length;
              const isDone = q.statements.every((st) => map[st.id] !== undefined);
              const isFlagged = flaggedIds.includes(q.id);
              const cls = submitted
                ? rightCount === 4
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : rightCount > 0
                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                    : 'bg-rose-500 text-white border-rose-600'
                : isFlagged
                  ? 'bg-amber-400 text-slate-950 border-amber-500'
                  : isDone
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`h-9 rounded-lg border text-xs font-mono font-bold cursor-pointer ${cls}`}
                >
                  {q.number}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedExam.questionsPart3.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
            Phần III · Trả lời ngắn
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {selectedExam.questionsPart3.map((q) => {
              const isDone = (saAnswers[q.id] || '').trim().length > 0;
              const isRight =
                submitted && isShortCorrect(saAnswers[q.id] || '', q.correctAnswer, q.acceptableAnswers);
              const isFlagged = flaggedIds.includes(q.id);
              const cls = submitted
                ? isRight
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-rose-500 text-white border-rose-600'
                : isFlagged
                  ? 'bg-amber-400 text-slate-950 border-amber-500'
                  : isDone
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`h-9 rounded-lg border text-xs font-mono font-bold cursor-pointer ${cls}`}
                >
                  {q.number}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        {!submitted ? (
          <button
            onClick={() => {
              if (answeredSummary.answered < answeredSummary.total) {
                setShowSubmitConfirm(true);
              } else {
                finalizeSubmit(false);
              }
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Nộp bài &amp; Chấm điểm
          </button>
        ) : (
          <button
            onClick={() => startExam(selectedExam)}
            className="w-full py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại đề này
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <AntiCheatGuard
        isActive={!submitted}
        examTitle={selectedExam.title}
        onAutoSubmit={() => finalizeSubmit(true)}
      />
      <div ref={topRef} className="max-w-7xl mx-auto pt-12 pb-16 space-y-5">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 md:p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSelectedExam(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
                title="Quay lại danh sách đề"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <h2 className="font-extrabold text-slate-900 dark:text-white text-sm md:text-base truncate">
                  {selectedExam.title}
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {gradeLabel} · Đáp án chỉ hiển thị sau khi nộp bài
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div
                className={`px-3 py-1.5 rounded-xl border font-mono font-extrabold text-sm flex items-center gap-1.5 tabular-nums ${
                  submitted
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    : isFiveMinuteWarning
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{submitted ? formatTimer(timeUsedSeconds) : formatTimer(secondsLeft)}</span>
              </div>

              <button
                onClick={() => setIsMobilePaletteOpen(true)}
                className="lg:hidden px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <ListChecks className="w-4 h-4 text-indigo-500" />
                <span className="font-mono">
                  {answeredSummary.answered}/{answeredSummary.total}
                </span>
              </button>

              {!submitted && (
                <button
                  onClick={() => {
                    if (answeredSummary.answered < answeredSummary.total) {
                      setShowSubmitConfirm(true);
                    } else {
                      finalizeSubmit(false);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Nộp bài
                </button>
              )}
            </div>
          </div>

          {showSubmitConfirm && !submitted && (
            <div className="mt-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Bạn mới trả lời{' '}
                  <strong className="font-mono">
                    {answeredSummary.answered}/{answeredSummary.total}
                  </strong>{' '}
                  câu. Xác nhận nộp bài ngay?
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
                >
                  Làm tiếp
                </button>
                <button
                  onClick={() => finalizeSubmit(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                >
                  Xác nhận nộp bài
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Result Summary (ONLY AFTER SUBMIT) */}
        {submitted && (
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
                  <Award className="w-4 h-4" />
                  Kết quả bài làm
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedExam.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {autoSubmitted ? 'Hệ thống tự động nộp bài khi hết giờ. ' : ''}
                  Thời gian làm bài: <strong className="font-mono">{formatTimer(timeUsedSeconds)}</strong>
                </p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center">
                <div className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-300">
                  Điểm thang 10
                </div>
                <div className="text-3xl font-black font-mono text-indigo-700 dark:text-indigo-300 tabular-nums">
                  {grading.scale10.toFixed(2)}
                  <span className="text-sm font-bold text-slate-400"> / 10</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowExplanations((v) => !v)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {showExplanations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showExplanations ? 'Thu gọn lời giải' : 'Xem lời giải chi tiết'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startExam(selectedExam)}
                  className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Làm lại
                </button>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold cursor-pointer"
                >
                  Chọn đề khác
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          <div className="space-y-6 min-w-0">
            {/* Part I */}
            {selectedExam.questionsPart1.length > 0 && (
              <section className="space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl px-5 py-3">
                  <h3 className="font-extrabold text-indigo-900 dark:text-indigo-200 text-base">
                    PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn ({selectedExam.questionsPart1.length} câu)
                  </h3>
                </div>

                {selectedExam.questionsPart1.map((q) => {
                  const chosen = mcAnswers[q.id];
                  const isRight = submitted && chosen === q.correctOption;
                  const isFlagged = flaggedIds.includes(q.id);

                  return (
                    <div
                      key={q.id}
                      id={`static-q-${q.id}`}
                      className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs ${
                        submitted
                          ? isRight
                            ? 'border-emerald-300 dark:border-emerald-800'
                            : 'border-rose-300 dark:border-rose-800'
                          : isFlagged
                            ? 'border-amber-400'
                            : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white font-mono text-xs font-bold">
                            Câu {q.number}
                          </span>
                          {submitted && (
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md ${
                                isRight
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              }`}
                            >
                              {isRight ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Đúng (+0,25đ)
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" /> Sai · ĐA: {q.correctOption}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        {!submitted && (
                          <button
                            onClick={() => toggleFlag(q.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                              isFlagged
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <Flag className="w-3.5 h-3.5" />
                            {isFlagged ? 'Đã đánh dấu' : 'Xem lại'}
                          </button>
                        )}
                      </div>

                      <div className="text-slate-900 dark:text-slate-100 text-sm md:text-[15px] mb-4">
                        <MathView content={q.question} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt) => {
                          const isSelected = chosen === opt.id;
                          const isCorrectOpt = opt.id === q.correctOption;

                          let btnCls =
                            'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-400 text-slate-800 dark:text-slate-200';
                          if (!submitted && isSelected) {
                            btnCls =
                              'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500';
                          } else if (submitted) {
                            if (isCorrectOpt) {
                              btnCls =
                                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                            } else if (isSelected && !isCorrectOpt) {
                              btnCls =
                                'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                            } else {
                              btnCls =
                                'border-slate-200 dark:border-slate-800 opacity-75 text-slate-500 dark:text-slate-400';
                            }
                          }

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={submitted}
                              onClick={() => setMcAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                                submitted ? 'cursor-default' : 'cursor-pointer'
                              } ${btnCls}`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                                  submitted && isCorrectOpt
                                    ? 'bg-emerald-600 text-white'
                                    : submitted && isSelected && !isCorrectOpt
                                      ? 'bg-rose-600 text-white'
                                      : isSelected
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {opt.id}
                              </span>
                              <div className="text-sm leading-relaxed min-w-0 flex-1">
                                <MathView content={opt.text} inline />
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {submitted && showExplanations && (
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm space-y-1">
                          <div className="font-bold text-indigo-700 dark:text-indigo-300">
                            Lời giải chi tiết (Đáp án đúng: {q.correctOption})
                          </div>
                          <div className="text-slate-700 dark:text-slate-300">
                            <MathView content={q.explanation} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {/* Part II */}
            {selectedExam.questionsPart2.length > 0 && (
              <section className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl px-5 py-3">
                  <h3 className="font-extrabold text-purple-900 dark:text-purple-200 text-base">
                    PHẦN II. Câu trắc nghiệm đúng sai ({selectedExam.questionsPart2.length} câu)
                  </h3>
                </div>

                {selectedExam.questionsPart2.map((q) => {
                  const map = tfAnswers[q.id] || {};
                  const rightCount = q.statements.filter((st) => map[st.id] === st.correct).length;
                  const earned = scoreTrueFalseCount(rightCount);

                  return (
                    <div
                      key={q.id}
                      id={`static-q-${q.id}`}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-700 text-white font-mono text-xs font-bold">
                          Câu {q.number}
                        </span>
                        {submitted && (
                          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            Đúng {rightCount}/4 ý · +{earned.toFixed(2)}đ
                          </span>
                        )}
                      </div>

                      <div className="text-sm md:text-[15px] text-slate-900 dark:text-slate-100">
                        <MathView content={q.question} />
                      </div>

                      <div className="space-y-2">
                        {q.statements.map((st) => {
                          const userVal = map[st.id];
                          const isRight = submitted && userVal === st.correct;
                          return (
                            <div
                              key={st.id}
                              className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                submitted
                                  ? isRight
                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start gap-2 text-sm flex-1 min-w-0">
                                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                  {st.id})
                                </span>
                                <div className="flex-1 min-w-0">
                                  <MathView content={st.text} inline />
                                </div>
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
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                    userVal === true
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'
                                  }`}
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
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                    userVal === false
                                      ? 'bg-rose-600 text-white border-rose-600'
                                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'
                                  }`}
                                >
                                  Sai
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {submitted && showExplanations && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm">
                          <div className="font-bold text-purple-700 dark:text-purple-300 mb-1">
                            Đáp án: {q.statements.map((s) => `${s.id}) ${s.correct ? 'Đ' : 'S'}`).join(' · ')}
                          </div>
                          <MathView content={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {/* Part III */}
            {selectedExam.questionsPart3.length > 0 && (
              <section className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-3">
                  <h3 className="font-extrabold text-amber-900 dark:text-amber-200 text-base">
                    PHẦN III. Câu trắc nghiệm trả lời ngắn ({selectedExam.questionsPart3.length} câu)
                  </h3>
                </div>

                {selectedExam.questionsPart3.map((q) => {
                  const val = saAnswers[q.id] || '';
                  const isRight = submitted && isShortCorrect(val, q.correctAnswer, q.acceptableAnswers);
                  return (
                    <div
                      key={q.id}
                      id={`static-q-${q.id}`}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-mono text-xs font-bold">
                          Câu {q.number}
                        </span>
                        {submitted && (
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                              isRight
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {isRight ? '+0,50đ' : `0,00đ · ĐA: ${q.correctAnswer}`}
                          </span>
                        )}
                      </div>

                      <div className="text-sm md:text-[15px] text-slate-900 dark:text-slate-100">
                        <MathView content={q.question} />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          disabled={submitted}
                          value={val}
                          onChange={(e) =>
                            setSaAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          placeholder="Nhập đáp số..."
                          className="w-40 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold text-center"
                        />
                        {submitted && (
                          <span className="text-xs font-mono">
                            Đáp án đúng:{' '}
                            <strong className="text-emerald-600 dark:text-emerald-400">
                              {q.correctAnswer}
                            </strong>
                          </span>
                        )}
                      </div>

                      {submitted && showExplanations && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm">
                          <div className="font-bold text-amber-700 dark:text-amber-300 mb-1">
                            Lời giải chi tiết:
                          </div>
                          <MathView content={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}
          </div>

          <aside className="hidden lg:block sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            {renderPalette()}
          </aside>
        </div>

        {isMobilePaletteOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <div
              className="fixed inset-0 bg-slate-950/60"
              onClick={() => setIsMobilePaletteOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full overflow-y-auto p-5 z-10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-extrabold text-sm">Danh sách câu hỏi</span>
                <button
                  onClick={() => setIsMobilePaletteOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderPalette()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

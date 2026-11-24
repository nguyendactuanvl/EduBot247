import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  BookOpen,
  Award,
  AlertTriangle,
  Flag,
  Sparkles,
  RefreshCw,
  Database,
  Layers,
  ChevronRight,
  ListChecks,
  X,
  Eye,
  EyeOff,
  Compass,
  Trophy,
  Key,
} from 'lucide-react';
import { MathView } from './MathView';
import {
  API_KEYS_UPDATED_EVENT,
  loadApiKeyPool,
  NoApiKeyConfiguredError,
  openApiKeyManagerModal,
  RotationExecutionMeta,
} from '../services/geminiDirectClient';
import {
  clearExamSession,
  DetailedExamGrading,
  GeneratedSpaceVectorExam,
  getCachedExam,
  gradeSpaceVectorExam,
  hasCachedExam,
  isSpaceVectorShortAnswerCorrect,
  loadExamSession,
  loadSpaceVectorScores,
  saveCachedExam,
  saveExamSession,
  saveSpaceVectorScoreRecord,
  scoreTrueFalseItem,
  SpaceVectorBlueprint,
  SpaceVectorScoreSummaryRecord,
} from '../data/exams/grade12SpaceVectorsCatalog';

export interface OnlineAiExamRoomConfig {
  scoresStorageKey: string;
  backLabel: string;
  gradeTag: string;
  chapterKicker: string;
  heading: string;
  description: string;
  lessonSubtitle: string;
  tnSubtitle: string;
  reviewSubtitle: string;
  lessonBlueprints: SpaceVectorBlueprint[];
  tnBlueprints: SpaceVectorBlueprint[];
  reviewBlueprints: SpaceVectorBlueprint[];
  generateExam: (
    examId: string,
    variantNumber: number,
    onRotateNotice?: (msg: string) => void
  ) => Promise<{ exam: GeneratedSpaceVectorExam; meta: RotationExecutionMeta }>;
}

interface OnlineAiExamRoomProps {
  config: OnlineAiExamRoomConfig;
  onBack?: () => void;
}

type LobbyFilter = 'all' | 'lesson' | 'tn_thpt' | 'chapter_review';

function formatTimer(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function difficultyBadgeStyle(diff: string): string {
  switch (diff) {
    case 'NB':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'TH':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
    case 'VD':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'VDC':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

export const OnlineAiExamRoom: React.FC<OnlineAiExamRoomProps> = ({ config, onBack }) => {
  const allBlueprints = useMemo(
    () => [...config.lessonBlueprints, ...config.tnBlueprints, ...config.reviewBlueprints],
    [config.lessonBlueprints, config.tnBlueprints, config.reviewBlueprints]
  );

  // Lobby state
  const [lobbyFilter, setLobbyFilter] = useState<LobbyFilter>('all');
  const [savedScores, setSavedScores] = useState<Record<string, SpaceVectorScoreSummaryRecord>>(() =>
    loadSpaceVectorScores(config.scoresStorageKey)
  );
  const [cacheVersionTick, setCacheVersionTick] = useState(0);
  const [apiKeyCount, setApiKeyCount] = useState<number>(() => loadApiKeyPool().length);
  const [lastUsedKeyNote, setLastUsedKeyNote] = useState<string>('');

  useEffect(() => {
    setSavedScores(loadSpaceVectorScores(config.scoresStorageKey));
  }, [config.scoresStorageKey]);

  useEffect(() => {
    const syncKeys = () => setApiKeyCount(loadApiKeyPool().length);
    window.addEventListener(API_KEYS_UPDATED_EVENT, syncKeys);
    return () => window.removeEventListener(API_KEYS_UPDATED_EVENT, syncKeys);
  }, []);

  // Active exam state
  const [activeBlueprint, setActiveBlueprint] = useState<SpaceVectorBlueprint | null>(null);
  const [activeExam, setActiveExam] = useState<GeneratedSpaceVectorExam | null>(null);
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);

  // User answers & exam room controls
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

  // Inline confirmation prompts (never window.confirm / window.alert)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [showAllExplanations, setShowAllExplanations] = useState(true);

  const examTopRef = useRef<HTMLDivElement | null>(null);
  const autoSubmitTriggeredRef = useRef(false);

  // Request a fresh exam directly from Gemini in the browser with automatic multi-key rotation
  const fetchExamFromApi = useCallback(
    async (blueprint: SpaceVectorBlueprint, variantNumber: number) => {
      setIsLoadingExam(true);
      setLoadError(null);
      setLastUsedKeyNote('');
      setLoadingMessage(
        variantNumber > 1
          ? `Đang biên soạn đề mới tương tự (Phiên bản #${variantNumber}) cho ${blueprint.title}...`
          : `Đang khởi tạo ${blueprint.title} (${blueprint.totalQuestions} câu chuẩn GDPT 2018)...`
      );

      try {
        const { exam: generated, meta } = await config.generateExam(
          blueprint.id,
          variantNumber,
          (rotateMsg) => setLoadingMessage(rotateMsg)
        );

        saveCachedExam(blueprint.id, generated);
        clearExamSession(blueprint.id);
        setCacheVersionTick((v) => v + 1);
        setLastUsedKeyNote(
          meta.rotated
            ? `Đã tự động xoay vòng sang ${meta.usedKeyLabel} (${meta.usedKeyMasked})`
            : `Khởi tạo qua ${meta.usedKeyLabel} (${meta.usedKeyMasked})`
        );

        setActiveExam(generated);
        setMcAnswers({});
        setTfAnswers({});
        setSaAnswers({});
        setFlaggedIds([]);
        setSecondsLeft(blueprint.durationMinutes * 60);
        setTimeUsedSeconds(0);
        setSubmitted(false);
        setAutoSubmitted(false);
        setShowSubmitConfirm(false);
        setShowRegenerateConfirm(false);
        autoSubmitTriggeredRef.current = false;
      } catch (err: any) {
        if (err instanceof NoApiKeyConfiguredError) {
          openApiKeyManagerModal();
        }
        setLoadError(
          err?.message || 'Đã xảy ra lỗi khi tạo đề thi trực tiếp từ Gemini. Vui lòng thử lại.'
        );
      } finally {
        setIsLoadingExam(false);
      }
    },
    [config]
  );

  // Open an exam: load from localStorage cache first so reload never loses work or wastes quota
  const openExam = useCallback(
    async (blueprint: SpaceVectorBlueprint) => {
      setActiveBlueprint(blueprint);
      setLoadError(null);
      setShowSubmitConfirm(false);
      setShowRegenerateConfirm(false);
      setIsMobilePaletteOpen(false);
      autoSubmitTriggeredRef.current = false;

      const cached = getCachedExam(blueprint.id);
      if (cached) {
        setActiveExam(cached);
        const session = loadExamSession(blueprint.id);
        if (session && session.variantNumber === cached.variantNumber) {
          setMcAnswers(session.mcAnswers || {});
          setTfAnswers(session.tfAnswers || {});
          setSaAnswers(session.saAnswers || {});
          setFlaggedIds(Array.isArray(session.flaggedIds) ? session.flaggedIds : []);
          setSecondsLeft(
            typeof session.secondsLeft === 'number'
              ? session.secondsLeft
              : blueprint.durationMinutes * 60
          );
          setTimeUsedSeconds(session.timeUsedSeconds || 0);
          setSubmitted(Boolean(session.submitted));
          setAutoSubmitted(Boolean(session.autoSubmitted));
        } else {
          setMcAnswers({});
          setTfAnswers({});
          setSaAnswers({});
          setFlaggedIds([]);
          setSecondsLeft(blueprint.durationMinutes * 60);
          setTimeUsedSeconds(0);
          setSubmitted(false);
          setAutoSubmitted(false);
        }
        return;
      }

      setActiveExam(null);
      await fetchExamFromApi(blueprint, 1);
    },
    [fetchExamFromApi]
  );

  // Grade current exam
  const grading: DetailedExamGrading = useMemo(() => {
    if (!activeExam) {
      return {
        part1Score: 0,
        part1Max: 0,
        part1Correct: 0,
        part2Score: 0,
        part2Max: 0,
        part2FullCorrect: 0,
        part3Score: 0,
        part3Max: 0,
        part3Correct: 0,
        rawTotal: 0,
        rawMax: 0,
        scale10: 0,
      };
    }
    return gradeSpaceVectorExam(activeExam, mcAnswers, tfAnswers, saAnswers);
  }, [activeExam, mcAnswers, tfAnswers, saAnswers]);

  // Persist session to localStorage whenever answers, flags, submission, or timer change
  useEffect(() => {
    if (!activeBlueprint || !activeExam || isLoadingExam) return;
    saveExamSession({
      examId: activeBlueprint.id,
      variantNumber: activeExam.variantNumber,
      mcAnswers,
      tfAnswers,
      saAnswers,
      flaggedIds,
      secondsLeft,
      submitted,
      timeUsedSeconds,
      autoSubmitted,
      updatedAt: new Date().toISOString(),
    });
  }, [
    activeBlueprint,
    activeExam,
    isLoadingExam,
    mcAnswers,
    tfAnswers,
    saAnswers,
    flaggedIds,
    secondsLeft,
    submitted,
    timeUsedSeconds,
    autoSubmitted,
  ]);

  const finalizeSubmit = useCallback(
    (isAuto = false) => {
      if (!activeBlueprint || !activeExam || submitted) return;
      const totalSeconds = activeBlueprint.durationMinutes * 60;
      const used = Math.max(0, totalSeconds - secondsLeft);
      const result = gradeSpaceVectorExam(activeExam, mcAnswers, tfAnswers, saAnswers);

      setTimeUsedSeconds(used);
      setSubmitted(true);
      setAutoSubmitted(isAuto);
      setShowSubmitConfirm(false);
      setShowAllExplanations(true);

      const updatedScores = saveSpaceVectorScoreRecord(
        {
          examId: activeBlueprint.id,
          bestScale10: result.scale10,
          lastScale10: result.scale10,
          part1Score: result.part1Score,
          part2Score: result.part2Score,
          part3Score: result.part3Score,
          attempts: 1,
          lastAttemptAt: new Date().toISOString(),
        },
        config.scoresStorageKey
      );
      setSavedScores(updatedScores);

      examTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [
      activeBlueprint,
      activeExam,
      submitted,
      secondsLeft,
      mcAnswers,
      tfAnswers,
      saAnswers,
      config.scoresStorageKey,
    ]
  );

  // Countdown timer with auto-submit at 00:00
  useEffect(() => {
    if (!activeExam || !activeBlueprint || submitted || isLoadingExam) return;
    if (secondsLeft <= 0) {
      if (!autoSubmitTriggeredRef.current) {
        autoSubmitTriggeredRef.current = true;
        finalizeSubmit(true);
      }
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeExam, activeBlueprint, submitted, isLoadingExam, secondsLeft, finalizeSubmit]);

  // Question status helpers for Palette
  const isQuestionAnswered = useCallback(
    (qId: string, part: 1 | 2 | 3): boolean => {
      if (part === 1) return Boolean(mcAnswers[qId]);
      if (part === 2) {
        const map = tfAnswers[qId];
        if (!map) return false;
        return (
          map.a !== undefined &&
          map.b !== undefined &&
          map.c !== undefined &&
          map.d !== undefined
        );
      }
      return (saAnswers[qId] || '').trim().length > 0;
    },
    [mcAnswers, tfAnswers, saAnswers]
  );

  const isPart2PartiallyAnswered = useCallback(
    (qId: string): boolean => {
      const map = tfAnswers[qId];
      if (!map) return false;
      const count = (['a', 'b', 'c', 'd'] as const).filter((k) => map[k] !== undefined).length;
      return count > 0 && count < 4;
    },
    [tfAnswers]
  );

  const answeredSummary = useMemo(() => {
    if (!activeExam) return { answered: 0, total: 0 };
    const p1 = activeExam.part1.filter((q) => isQuestionAnswered(q.id, 1)).length;
    const p2 = activeExam.part2.filter((q) => isQuestionAnswered(q.id, 2)).length;
    const p3 = activeExam.part3.filter((q) => isQuestionAnswered(q.id, 3)).length;
    return {
      answered: p1 + p2 + p3,
      total: activeExam.part1.length + activeExam.part2.length + activeExam.part3.length,
    };
  }, [activeExam, isQuestionAnswered]);

  const toggleFlag = useCallback((qId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  }, []);

  const scrollToQuestion = useCallback((qId: string) => {
    const el = document.getElementById(`question-card-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIsMobilePaletteOpen(false);
  }, []);

  const handleRetrySameExam = useCallback(() => {
    if (!activeBlueprint) return;
    clearExamSession(activeBlueprint.id);
    setMcAnswers({});
    setTfAnswers({});
    setSaAnswers({});
    setFlaggedIds([]);
    setSecondsLeft(activeBlueprint.durationMinutes * 60);
    setTimeUsedSeconds(0);
    setSubmitted(false);
    setAutoSubmitted(false);
    setShowSubmitConfirm(false);
    autoSubmitTriggeredRef.current = false;
    examTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeBlueprint]);

  const handleRegenerateSimilarExam = useCallback(async () => {
    if (!activeBlueprint) return;
    const nextVariant = (activeExam?.variantNumber || 1) + 1;
    setShowRegenerateConfirm(false);
    await fetchExamFromApi(activeBlueprint, nextVariant);
  }, [activeBlueprint, activeExam, fetchExamFromApi]);

  const handleBackToLobby = useCallback(() => {
    setActiveBlueprint(null);
    setActiveExam(null);
    setLoadError(null);
    setShowSubmitConfirm(false);
    setShowRegenerateConfirm(false);
    setIsMobilePaletteOpen(false);
    setCacheVersionTick((v) => v + 1);
  }, []);

  // Derived stats for lobby
  const lobbyStats = useMemo(() => {
    void cacheVersionTick;
    let cachedCount = 0;
    let completedCount = 0;
    allBlueprints.forEach((bp) => {
      if (hasCachedExam(bp.id)) cachedCount += 1;
      if (savedScores[bp.id]) completedCount += 1;
    });
    return {
      totalExams: allBlueprints.length,
      cachedCount,
      completedCount,
    };
  }, [allBlueprints, savedScores, cacheVersionTick]);

  // ======================================================
  // RENDER: LOBBY (SELECTION MENU)
  // ======================================================
  if (!activeBlueprint) {
    const renderExamCard = (bp: SpaceVectorBlueprint) => {
      const cached = hasCachedExam(bp.id);
      const session = loadExamSession(bp.id);
      const scoreRec = savedScores[bp.id];
      const hasUnfinishedSession = Boolean(
        cached &&
          session &&
          !session.submitted &&
          (Object.keys(session.mcAnswers || {}).length > 0 ||
            Object.keys(session.tfAnswers || {}).length > 0 ||
            Object.keys(session.saAnswers || {}).length > 0)
      );

      const accentBadge =
        bp.category === 'lesson'
          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800'
          : bp.category === 'tn_thpt'
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';

      return (
        <div
          key={bp.id}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border tracking-wide uppercase ${accentBadge}`}
              >
                {bp.code}
              </span>
              <div className="flex items-center gap-1.5">
                {cached && (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    title={`Đã lưu cache tại khóa ${bp.id}`}
                  >
                    <Database className="w-3 h-3" />
                    Đã lưu sẵn
                  </span>
                )}
                {scoreRec && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <Trophy className="w-3 h-3" />
                    {scoreRec.bestScale10.toFixed(2)}đ
                  </span>
                )}
              </div>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {bp.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {bp.subtitle}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium font-mono">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {bp.durationMinutes} phút
              </span>
              <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {bp.part1Count} TN · {bp.part2Count} Đ/S · {bp.part3Count} TLN
              </span>
            </div>

            <button
              onClick={() => openExam(bp)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasUnfinishedSession
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              <span>
                {hasUnfinishedSession
                  ? 'Tiếp tục làm bài'
                  : cached
                    ? 'Vào phòng thi'
                    : 'Tạo đề & Vào thi'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    };

    const lessonCount = config.lessonBlueprints.length;
    const tnCount = config.tnBlueprints.length;
    const reviewCount = config.reviewBlueprints.length;

    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-7 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {config.backLabel}
              </button>
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => openApiKeyManagerModal()}
                className={`px-3 py-1.5 rounded-xl border inline-flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                  apiKeyCount > 0
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                    : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                {apiKeyCount > 0 ? `API Key (${apiKeyCount} · Xoay vòng)` : 'AI Sẵn sàng · Quản lý Key'}
              </button>
              <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {config.gradeTag}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
                Đã cache: {lobbyStats.cachedCount}/{lobbyStats.totalExams} đề
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                Đã hoàn thành: {lobbyStats.completedCount}/{lobbyStats.totalExams}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Compass className="w-4 h-4" />
                {config.chapterKicker}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {config.heading}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-3xl">
                {config.description}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            {[
              { id: 'all', label: `Tất cả (${lobbyStats.totalExams} đề)` },
              { id: 'lesson', label: `Phân hệ 1: Theo bài học (${lessonCount} đề · 45p)` },
              { id: 'tn_thpt', label: `Nhóm A: ${tnCount} Đề chuẩn TN THPT (90p)` },
              { id: 'chapter_review', label: `Nhóm B: ${reviewCount} Đề Ôn tập VD–VDC (90p)` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLobbyFilter(tab.id as LobbyFilter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  lobbyFilter === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PHÂN HỆ 1: LUYỆN TẬP THEO TỪNG BÀI HỌC */}
        {(lobbyFilter === 'all' || lobbyFilter === 'lesson') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Phân hệ 1: Luyện tập theo từng bài học
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {config.lessonSubtitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.lessonBlueprints.map(renderExamCard)}
            </div>
          </section>
        )}

        {/* PHÂN HỆ 2 - NHÓM A: 10 ĐỀ CHUẨN CẤU TRÚC TN THPT BỘ GD&ĐT */}
        {(lobbyFilter === 'all' || lobbyFilter === 'tn_thpt') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Phân hệ 2 · Nhóm A: {tnCount} Đề chuẩn cấu trúc TN THPT của Bộ GD&ĐT
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{config.tnSubtitle}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {config.tnBlueprints.map(renderExamCard)}
            </div>
          </section>
        )}

        {/* PHÂN HỆ 2 - NHÓM B: 5 ĐỀ ÔN TẬP CHƯƠNG TỔNG HỢP */}
        {(lobbyFilter === 'all' || lobbyFilter === 'chapter_review') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Phân hệ 2 · Nhóm B: {reviewCount} Đề Ôn tập chương tổng hợp (90 phút)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {config.reviewSubtitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.reviewBlueprints.map(renderExamCard)}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ======================================================
  // RENDER: LOADING OR ERROR STATE
  // ======================================================
  if (isLoadingExam || !activeExam) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm space-y-5">
          {isLoadingExam ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {activeBlueprint.title}
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                  {loadingMessage}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Hệ thống đang tạo đủ {activeBlueprint.totalQuestions} câu hỏi chuẩn cấu trúc Bộ
                  GD&ĐT ({activeBlueprint.part1Count} TN + {activeBlueprint.part2Count} Đúng/Sai +{' '}
                  {activeBlueprint.part3Count} Trả lời ngắn) kèm lời giải chi tiết từng bước và tự
                  động lưu cache vào trình duyệt.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleBackToLobby}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy & Quay lại danh sách đề
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Không thể tải đề thi
                </h3>
                <p className="text-sm text-rose-600 dark:text-rose-400 max-w-lg mx-auto">
                  {loadError || 'Đã xảy ra lỗi không xác định khi khởi tạo đề thi.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => openApiKeyManagerModal()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  Cài đặt / Thêm API Key ({apiKeyCount})
                </button>
                <button
                  onClick={() => fetchExamFromApi(activeBlueprint, 1)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Thử lại ngay
                </button>
                <button
                  onClick={handleBackToLobby}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
                >
                  Quay về danh sách đề
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ======================================================
  // RENDER: ACTIVE EXAM ROOM
  // ======================================================
  const isFiveMinuteWarning = !submitted && secondsLeft > 0 && secondsLeft <= 300;
  const totalSeconds = activeBlueprint.durationMinutes * 60;

  const getPaletteButtonClass = (
    qId: string,
    part: 1 | 2 | 3,
    extra: { isCorrect?: boolean; isPartial?: boolean }
  ): string => {
    const isFlagged = flaggedIds.includes(qId);

    if (submitted) {
      if (extra.isCorrect) return 'bg-emerald-500 text-white border-emerald-600';
      if (extra.isPartial) return 'bg-amber-400 text-slate-950 border-amber-500';
      return 'bg-rose-500 text-white border-rose-600';
    }

    if (isFlagged) {
      return 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-400/50';
    }

    if (isQuestionAnswered(qId, part)) {
      return 'bg-emerald-500 text-white border-emerald-600';
    }

    if (part === 2 && isPart2PartiallyAnswered(qId)) {
      return 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-400';
    }

    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400';
  };

  const renderPaletteContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Bảng câu hỏi ({answeredSummary.answered}/{answeredSummary.total})
          </h3>
        </div>
        {flaggedIds.length > 0 && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            {flaggedIds.length} xem lại
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
        {!submitted ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Đã làm
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 inline-block" /> Chưa làm
            </span>
            <span className="flex items-center gap-1.5 col-span-2">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Đánh dấu xem lại
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Đúng hoàn toàn
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Đúng 1 phần (P.II)
            </span>
            <span className="flex items-center gap-1.5 col-span-2">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Sai / Bỏ trống
            </span>
          </>
        )}
      </div>

      {/* Part I Grid */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Phần I · Trắc nghiệm ({activeExam.part1.length})
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {activeExam.part1.map((q) => {
            const isCorrect = submitted && mcAnswers[q.id] === q.correctOption;
            const isFlagged = flaggedIds.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                className={`relative h-9 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${getPaletteButtonClass(
                  q.id,
                  1,
                  { isCorrect }
                )}`}
                title={`Câu ${q.number}`}
              >
                {q.number}
                {isFlagged && !submitted && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white dark:border-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Part II Grid */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Phần II · Đúng / Sai ({activeExam.part2.length})
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {activeExam.part2.map((q) => {
            const userMap = tfAnswers[q.id] || {};
            const rightCount = q.statements.filter((s) => userMap[s.label] === s.isTrue).length;
            const isCorrect = submitted && rightCount === 4;
            const isPartial = submitted && rightCount > 0 && rightCount < 4;
            const isFlagged = flaggedIds.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                className={`relative h-9 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${getPaletteButtonClass(
                  q.id,
                  2,
                  { isCorrect, isPartial }
                )}`}
                title={`Câu ${q.number} (Phần II)`}
              >
                {q.number}
                {isFlagged && !submitted && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white dark:border-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Part III Grid */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Phần III · Trả lời ngắn ({activeExam.part3.length})
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {activeExam.part3.map((q) => {
            const isCorrect =
              submitted &&
              isSpaceVectorShortAnswerCorrect(saAnswers[q.id] || '', q.answer, q.acceptableAnswers);
            const isFlagged = flaggedIds.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                className={`relative h-9 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${getPaletteButtonClass(
                  q.id,
                  3,
                  { isCorrect }
                )}`}
                title={`Câu ${q.number} (Phần III)`}
              >
                {q.number}
                {isFlagged && !submitted && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white dark:border-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {!submitted ? (
          <button
            onClick={() => {
              if (answeredSummary.answered < answeredSummary.total) {
                setShowSubmitConfirm(true);
              } else {
                finalizeSubmit(false);
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Nộp bài & Chấm điểm
          </button>
        ) : (
          <button
            onClick={handleRetrySameExam}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại đề này
          </button>
        )}

        <button
          onClick={() => setShowRegenerateConfirm(true)}
          className="w-full py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Tạo đề mới tương tự
        </button>
      </div>
    </div>
  );

  return (
    <div ref={examTopRef} className="max-w-7xl mx-auto pb-16 space-y-5">
      {/* Sticky Top Exam Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 md:p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBackToLobby}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
              title="Quay về danh sách đề"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shrink-0">
                  {activeBlueprint.code}
                </span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
                  Bản #{activeExam.variantNumber} · Cache: {activeBlueprint.id}
                  {lastUsedKeyNote ? ` · ${lastUsedKeyNote}` : ''}
                </span>
              </div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-sm md:text-base truncate mt-0.5">
                {activeExam.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Countdown Timer */}
            <div
              className={`px-3 py-1.5 rounded-xl border font-mono font-extrabold text-sm md:text-base flex items-center gap-1.5 tabular-nums transition-colors ${
                submitted
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  : isFiveMinuteWarning
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-sm'
                    : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{submitted ? formatTimer(timeUsedSeconds) : formatTimer(secondsLeft)}</span>
            </div>

            {/* Mobile Question Palette Toggle */}
            <button
              onClick={() => setIsMobilePaletteOpen(true)}
              className="lg:hidden px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ListChecks className="w-4 h-4 text-indigo-500" />
              <span className="font-mono">
                {answeredSummary.answered}/{answeredSummary.total}
              </span>
            </button>

            {/* Quick Generate Similar Button (Desktop) */}
            <button
              onClick={() => setShowRegenerateConfirm(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-colors cursor-pointer"
              title="Sinh bộ câu hỏi mới tương tự cho mã đề này"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tạo đề mới tương tự
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
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Nộp bài
              </button>
            )}
          </div>
        </div>

        {/* 5-Minute Warning Banner */}
        {isFiveMinuteWarning && (
          <div className="mt-3 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>
              Cảnh báo: Chỉ còn dưới 5 phút làm bài ({formatTimer(secondsLeft)})! Hệ thống sẽ tự
              động thu bài và chấm điểm khi đồng hồ về 00:00.
            </span>
          </div>
        )}

        {/* Inline Unanswered Submit Confirmation */}
        {showSubmitConfirm && !submitted && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                Bạn mới hoàn thành đầy đủ{' '}
                <strong className="font-mono">
                  {answeredSummary.answered}/{answeredSummary.total}
                </strong>{' '}
                câu. Bạn có chắc muốn nộp bài ngay bây giờ không?
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Làm tiếp
              </button>
              <button
                onClick={() => finalizeSubmit(false)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        )}

        {/* Inline Regenerate Confirmation */}
        {showRegenerateConfirm && (
          <div className="mt-3 p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2 text-xs text-purple-900 dark:text-purple-200">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
              <span>
                Tạo bộ câu hỏi hoàn toàn mới tương tự cho <strong>{activeBlueprint.title}</strong>?
                Đề mới sẽ thay thế đề đang lưu cache và đặt lại bài làm hiện tại.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleRegenerateSimilarExam}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                Sinh đề mới ngay
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary Card (Visible after submission) */}
      {submitted && (
        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <Award className="w-4 h-4" />
                Kết quả chấm điểm tự động chuẩn Bộ GD&ĐT
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activeExam.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {autoSubmitted
                  ? 'Hết thời gian làm bài — hệ thống đã tự động thu bài và chấm điểm.'
                  : 'Đã hoàn thành nộp bài.'}{' '}
                Thời gian thực hiện:{' '}
                <strong className="font-mono text-slate-700 dark:text-slate-200">
                  {formatTimer(timeUsedSeconds)} / {formatTimer(totalSeconds)}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center">
                <div className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-300">
                  Tổng điểm (Thang 10)
                </div>
                <div className="text-3xl font-black font-mono text-indigo-700 dark:text-indigo-300 tabular-nums">
                  {grading.scale10.toFixed(2)}
                  <span className="text-sm font-bold text-slate-400"> / 10</span>
                </div>
                {grading.rawMax !== 10 && (
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Điểm gốc: {grading.rawTotal.toFixed(2)} / {grading.rawMax.toFixed(2)}đ
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3-Part Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Phần I · Trắc nghiệm 4 phương án
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                  {grading.part1Score.toFixed(2)}
                  <span className="text-sm font-semibold text-slate-400">
                    {' '}
                    / {grading.part1Max.toFixed(2)}đ
                  </span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {grading.part1Correct}/{activeExam.part1.length} câu đúng
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Phần II · Trắc nghiệm Đúng / Sai
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                  {grading.part2Score.toFixed(2)}
                  <span className="text-sm font-semibold text-slate-400">
                    {' '}
                    / {grading.part2Max.toFixed(2)}đ
                  </span>
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {grading.part2FullCorrect}/{activeExam.part2.length} câu trọn 1đ
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Phần III · Trả lời ngắn
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                  {grading.part3Score.toFixed(2)}
                  <span className="text-sm font-semibold text-slate-400">
                    {' '}
                    / {grading.part3Max.toFixed(2)}đ
                  </span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {grading.part3Correct}/{activeExam.part3.length} câu đúng
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setShowAllExplanations((v) => !v)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {showAllExplanations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAllExplanations ? 'Thu gọn lời giải chi tiết' : 'Hiện toàn bộ lời giải chi tiết'}
            </button>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleRetrySameExam}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm lại đề này
              </button>
              <button
                onClick={() => setShowRegenerateConfirm(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Tạo đề mới tương tự
              </button>
              <button
                onClick={handleBackToLobby}
                className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold cursor-pointer"
              >
                Chọn đề khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Exam Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6 items-start">
        {/* Left: Questions Column */}
        <div className="space-y-8 min-w-0">
          {/* ==================== PHẦN I ==================== */}
          <section className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-indigo-900 dark:text-indigo-200 text-base">
                  PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn
                </h3>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
                  Mỗi câu hỏi học sinh chỉ chọn một phương án (A, B, C hoặc D). Mỗi câu đúng được
                  0,25 điểm.
                </p>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {activeExam.part1.length} câu · {(activeExam.part1.length * 0.25).toFixed(2)} điểm
              </span>
            </div>

            {activeExam.part1.map((q) => {
              const userChoice = mcAnswers[q.id];
              const isCorrect = submitted && userChoice === q.correctOption;
              const isFlagged = flaggedIds.includes(q.id);
              const optionLetters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={q.id}
                  id={`question-card-${q.id}`}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all shadow-xs ${
                    submitted
                      ? isCorrect
                        ? 'border-emerald-300 dark:border-emerald-800'
                        : 'border-rose-300 dark:border-rose-800'
                      : isFlagged
                        ? 'border-amber-400 dark:border-amber-600'
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white font-mono text-xs font-bold">
                        Câu {q.number}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${difficultyBadgeStyle(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                      {submitted && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> +0,25đ
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> 0,00đ · ĐA: {q.correctOption}
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {!submitted && (
                      <button
                        onClick={() => toggleFlag(q.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isFlagged
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-600'
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
                    {optionLetters.map((letter, idx) => {
                      const optText = q.options[idx] || '';
                      const isSelected = userChoice === letter;
                      const isRightOpt = letter === q.correctOption;

                      let btnClass =
                        'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-400 text-slate-800 dark:text-slate-200';
                      if (!submitted && isSelected) {
                        btnClass =
                          'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500';
                      } else if (submitted) {
                        if (isRightOpt) {
                          btnClass =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                        } else if (isSelected && !isRightOpt) {
                          btnClass =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                        } else {
                          btnClass =
                            'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 opacity-80';
                        }
                      }

                      return (
                        <button
                          key={letter}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setMcAnswers((prev) => ({
                              ...prev,
                              [q.id]: letter,
                            }))
                          }
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            submitted ? 'cursor-default' : 'cursor-pointer'
                          } ${btnClass}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                              submitted && isRightOpt
                                ? 'bg-emerald-600 text-white'
                                : submitted && isSelected && !isRightOpt
                                  ? 'bg-rose-600 text-white'
                                  : isSelected
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {letter}
                          </span>
                          <div className="text-sm leading-relaxed min-w-0 flex-1">
                            <MathView content={optText} inline />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {submitted && showAllExplanations && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                        <span>Lời giải chi tiết</span>
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                          Bạn chọn: <strong>{userChoice || 'Chưa chọn'}</strong> · Đáp án đúng:{' '}
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            {q.correctOption}
                          </strong>
                        </span>
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

          {/* ==================== PHẦN II ==================== */}
          <section className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-purple-900 dark:text-purple-200 text-base">
                  PHẦN II. Câu trắc nghiệm đúng sai
                </h3>
                <p className="text-xs text-purple-700/80 dark:text-purple-300/80">
                  Mỗi ý a), b), c), d) chọn Đúng hoặc Sai. Quy chế Bộ GD&ĐT: đúng 1 ý = 0,1đ; 2 ý =
                  0,25đ; 3 ý = 0,5đ; 4 ý = 1,0đ.
                </p>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {activeExam.part2.length} câu · {(activeExam.part2.length * 1.0).toFixed(2)} điểm
              </span>
            </div>

            {activeExam.part2.map((q) => {
              const userMap = tfAnswers[q.id] || {};
              const rightCount = q.statements.filter((st) => userMap[st.label] === st.isTrue).length;
              const earnedScore = scoreTrueFalseItem(rightCount);
              const isFlagged = flaggedIds.includes(q.id);

              return (
                <div
                  key={q.id}
                  id={`question-card-${q.id}`}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all shadow-xs ${
                    submitted
                      ? rightCount === 4
                        ? 'border-emerald-300 dark:border-emerald-800'
                        : rightCount > 0
                          ? 'border-amber-300 dark:border-amber-700'
                          : 'border-rose-300 dark:border-rose-800'
                      : isFlagged
                        ? 'border-amber-400 dark:border-amber-600'
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-700 text-white font-mono text-xs font-bold">
                        Câu {q.number}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${difficultyBadgeStyle(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                      {submitted && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                            rightCount === 4
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : rightCount > 0
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          Đúng {rightCount}/4 ý · +{earnedScore.toFixed(2)}đ
                        </span>
                      )}
                    </div>

                    {!submitted && (
                      <button
                        onClick={() => toggleFlag(q.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isFlagged
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-600'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        {isFlagged ? 'Đã đánh dấu' : 'Xem lại'}
                      </button>
                    )}
                  </div>

                  <div className="text-slate-900 dark:text-slate-100 text-sm md:text-[15px] mb-4">
                    <MathView content={q.stem} />
                  </div>

                  <div className="space-y-2.5">
                    {q.statements.map((st) => {
                      const userVal = userMap[st.label];
                      const isRight = submitted && userVal === st.isTrue;

                      return (
                        <div
                          key={st.label}
                          className={`p-3.5 rounded-xl border transition-all ${
                            submitted
                              ? isRight
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0 flex-1 text-sm text-slate-800 dark:text-slate-200">
                              <span className="font-mono font-extrabold text-purple-700 dark:text-purple-300 shrink-0">
                                {st.label})
                              </span>
                              <div className="min-w-0 flex-1">
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
                                    [q.id]: {
                                      ...(prev[q.id] || {}),
                                      [st.label]: true,
                                    },
                                  }))
                                }
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                  submitted ? 'cursor-default' : 'cursor-pointer'
                                } ${
                                  userVal === true
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-emerald-400'
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
                                    [q.id]: {
                                      ...(prev[q.id] || {}),
                                      [st.label]: false,
                                    },
                                  }))
                                }
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                  submitted ? 'cursor-default' : 'cursor-pointer'
                                } ${
                                  userVal === false
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-rose-400'
                                }`}
                              >
                                Sai
                              </button>
                            </div>
                          </div>

                          {submitted && showAllExplanations && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              <div className="flex flex-wrap items-center gap-2 font-semibold">
                                <span
                                  className={
                                    isRight
                                      ? 'text-emerald-700 dark:text-emerald-400'
                                      : 'text-rose-700 dark:text-rose-400'
                                  }
                                >
                                  {isRight ? '✓ Chính xác' : '✗ Chưa chính xác'}
                                </span>
                                <span className="text-slate-400">·</span>
                                <span>
                                  Bạn chọn:{' '}
                                  <strong>
                                    {userVal === undefined ? 'Chưa chọn' : userVal ? 'Đúng' : 'Sai'}
                                  </strong>
                                </span>
                                <span className="text-slate-400">·</span>
                                <span>
                                  Đáp án:{' '}
                                  <strong className="text-indigo-700 dark:text-indigo-300">
                                    {st.isTrue ? 'Đúng' : 'Sai'}
                                  </strong>
                                </span>
                              </div>
                              <div>
                                <MathView content={st.explanation} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {submitted && showAllExplanations && q.summaryExplanation && (
                    <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                      <div className="font-bold text-purple-700 dark:text-purple-300 mb-1">
                        Phương pháp giải tổng quát:
                      </div>
                      <MathView content={q.summaryExplanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* ==================== PHẦN III ==================== */}
          <section className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-amber-900 dark:text-amber-200 text-base">
                  PHẦN III. Câu trắc nghiệm trả lời ngắn
                </h3>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  Nhập số nguyên hoặc số thập phân làm tròn (tối đa 4 ký tự, chấp nhận dấu chấm
                  hoặc dấu phẩy). Mỗi câu đúng được 0,5 điểm.
                </p>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {activeExam.part3.length} câu · {(activeExam.part3.length * 0.5).toFixed(2)} điểm
              </span>
            </div>

            {activeExam.part3.map((q) => {
              const userInput = saAnswers[q.id] || '';
              const isCorrect =
                submitted &&
                isSpaceVectorShortAnswerCorrect(userInput, q.answer, q.acceptableAnswers);
              const isFlagged = flaggedIds.includes(q.id);

              return (
                <div
                  key={q.id}
                  id={`question-card-${q.id}`}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all shadow-xs ${
                    submitted
                      ? isCorrect
                        ? 'border-emerald-300 dark:border-emerald-800'
                        : 'border-rose-300 dark:border-rose-800'
                      : isFlagged
                        ? 'border-amber-400 dark:border-amber-600'
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-mono text-xs font-bold">
                        Câu {q.number}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${difficultyBadgeStyle(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                      {submitted && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> +0,50đ
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> 0,00đ · ĐA: {q.answer}
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {!submitted && (
                      <button
                        onClick={() => toggleFlag(q.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isFlagged
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-600'
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

                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor={`sa-input-${q.id}`}
                      className="text-xs font-bold text-slate-600 dark:text-slate-400"
                    >
                      Đáp số (tối đa 4 ký tự):
                    </label>
                    <input
                      id={`sa-input-${q.id}`}
                      type="text"
                      inputMode="decimal"
                      maxLength={4}
                      disabled={submitted}
                      value={userInput}
                      onChange={(e) => {
                        const filtered = e.target.value.replace(/[^0-9.,-]/g, '').slice(0, 4);
                        setSaAnswers((prev) => ({
                          ...prev,
                          [q.id]: filtered,
                        }));
                      }}
                      placeholder="VD: 1.5"
                      className={`w-36 px-3.5 py-2 rounded-xl border font-mono text-base font-bold text-center tracking-wider focus:outline-none focus:ring-2 transition-all ${
                        submitted
                          ? isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                    />
                    {q.unit && (
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        ({q.unit})
                      </span>
                    )}
                    {submitted && (
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                        Đáp án đúng:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                          {q.answer}
                        </strong>
                      </span>
                    )}
                  </div>

                  {submitted && showAllExplanations && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm space-y-1.5">
                      <div className="font-bold text-amber-700 dark:text-amber-300">
                        Lời giải chi tiết:
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
        </div>

        {/* Right: Sticky Desktop Question Palette */}
        <aside className="hidden lg:block sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          {renderPaletteContent()}
        </aside>
      </div>

      {/* Mobile Question Palette Drawer */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsMobilePaletteOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full overflow-y-auto p-5 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Danh sách câu hỏi
              </span>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderPaletteContent()}
          </div>
        </div>
      )}
    </div>
  );
};

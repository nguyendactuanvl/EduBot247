import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  BarChart3,
  BookOpen,
  Flame,
  Trophy,
  Sparkles,
  Pencil,
  Check,
  X,
  ArrowRight,
  Trash2,
  Target,
  School,
} from 'lucide-react';
import { useEduBotUser, UserGrade } from '../hooks/useEduBotUser';
import {
  FULL_CHAPTER4_VECTORS_EXAM,
  GRADE10_VECTORS_LESSONS,
  VECTOR_PROGRESS_EVENT,
  VectorSavedScoreMap,
  loadVectorScores,
  saveVectorScores,
} from '../data/exams/grade10VectorsExams';

interface StudentProfileViewProps {
  isDarkMode?: boolean;
  onOpenVectorLesson: (examId: string | null) => void;
  onOpenLeaderboard: () => void;
}

interface VectorChartRow {
  id: string;
  shortName: string;
  fullTitle: string;
  bestScale10: number;
  lastScale10: number;
  bestRawScore: number;
  lastRawScore: number;
  maxRawScore: number;
  completionPercent: number;
  answeredCount: number;
  totalQuestions: number;
  attempts: number;
  lastAttemptAt?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: VectorChartRow }>;
  mode: 'score' | 'progress';
}

const VectorChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, mode }) => {
  if (!active || !payload || payload.length === 0 || !payload[0]?.payload) {
    return null;
  }
  const row = payload[0].payload;

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg p-3 text-xs space-y-1.5 max-w-[260px]">
      <div className="font-bold text-slate-900 dark:text-white leading-snug">
        {row.fullTitle}
      </div>

      {mode === 'score' ? (
        <div className="space-y-1 font-mono tabular-nums">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-sans">Cao nhất (thang 10):</span>
            <strong className="text-indigo-600 dark:text-indigo-400">
              {row.attempts > 0 ? `${row.bestScale10.toFixed(2)} / 10` : 'Chưa làm'}
            </strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-sans">Lần gần nhất:</span>
            <strong className="text-emerald-600 dark:text-emerald-400">
              {row.attempts > 0 ? `${row.lastScale10.toFixed(2)} / 10` : '—'}
            </strong>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-sans">Điểm chuẩn Bộ GD:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {row.bestRawScore.toFixed(2)} / {row.maxRawScore.toFixed(2)} đ
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-1 font-mono tabular-nums">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-sans">Tiến độ hoàn thành:</span>
            <strong className="text-emerald-600 dark:text-emerald-400">
              {row.completionPercent}%
            </strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-sans">Số câu đã trả lời:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {row.answeredCount} / {row.totalQuestions} câu
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-sans">Số lượt luyện tập:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {row.attempts} lần
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  isDarkMode = true,
  onOpenVectorLesson,
  onOpenLeaderboard,
}) => {
  const { user, updateProfile } = useEduBotUser();
  const [scoresMap, setScoresMap] = useState<VectorSavedScoreMap>(() => loadVectorScores());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const [nicknameInput, setNicknameInput] = useState(user.nickname);
  const [gradeInput, setGradeInput] = useState<UserGrade>(user.grade);
  const [schoolInput, setSchoolInput] = useState(user.schoolName);
  const [provinceInput, setProvinceInput] = useState(user.province);

  // Stay synced whenever user submits a Vector exam or another tab updates localStorage
  useEffect(() => {
    const sync = () => setScoresMap(loadVectorScores());
    window.addEventListener(VECTOR_PROGRESS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(VECTOR_PROGRESS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const allExamSets = useMemo(
    () => [...GRADE10_VECTORS_LESSONS, FULL_CHAPTER4_VECTORS_EXAM],
    [],
  );

  const chartData: VectorChartRow[] = useMemo(() => {
    return allExamSets.map((exam) => {
      const totalQ =
        exam.multipleChoice.length + exam.trueFalse.length + exam.shortAnswer.length;
      const maxRaw = Number(
        (
          exam.multipleChoice.length * 0.25 +
          exam.trueFalse.length * 1.0 +
          exam.shortAnswer.length * 0.5
        ).toFixed(2),
      );
      const rec = scoresMap[exam.id];

      if (!rec) {
        return {
          id: exam.id,
          shortName: exam.isFullChapter ? 'Tổng ôn' : exam.code,
          fullTitle: exam.title,
          bestScale10: 0,
          lastScale10: 0,
          bestRawScore: 0,
          lastRawScore: 0,
          maxRawScore: maxRaw,
          completionPercent: 0,
          answeredCount: 0,
          totalQuestions: totalQ,
          attempts: 0,
        };
      }

      const bestScale10 =
        typeof rec.bestScale10 === 'number'
          ? rec.bestScale10
          : maxRaw > 0
            ? Number(((rec.bestRawScore / maxRaw) * 10).toFixed(2))
            : 0;
      const lastRawScore =
        typeof rec.lastRawScore === 'number' ? rec.lastRawScore : rec.bestRawScore;
      const lastScale10 =
        typeof rec.lastScale10 === 'number'
          ? rec.lastScale10
          : maxRaw > 0
            ? Number(((lastRawScore / maxRaw) * 10).toFixed(2))
            : 0;
      const completionPercent =
        typeof rec.completionPercent === 'number'
          ? rec.completionPercent
          : rec.attempts > 0
            ? 100
            : 0;
      const answeredCount =
        typeof rec.answeredCount === 'number'
          ? rec.answeredCount
          : Math.round((completionPercent / 100) * totalQ);

      return {
        id: exam.id,
        shortName: exam.isFullChapter ? 'Tổng ôn' : exam.code,
        fullTitle: exam.title,
        bestScale10,
        lastScale10,
        bestRawScore: rec.bestRawScore,
        lastRawScore,
        maxRawScore: maxRaw,
        completionPercent,
        answeredCount,
        totalQuestions: totalQ,
        attempts: rec.attempts,
        lastAttemptAt: rec.lastAttemptAt,
      };
    });
  }, [allExamSets, scoresMap]);

  // Summary metrics across the 5 core lessons (Bài 7 – Bài 11)
  const lessonRows = chartData.slice(0, 5);
  const completedLessonsCount = lessonRows.filter((r) => r.attempts > 0).length;
  const overallChapterCompletion = Math.round(
    lessonRows.reduce((acc, r) => acc + r.completionPercent, 0) / lessonRows.length,
  );
  const attemptedLessonRows = lessonRows.filter((r) => r.attempts > 0);
  const avgLessonScale10 =
    attemptedLessonRows.length > 0
      ? Number(
          (
            attemptedLessonRows.reduce((acc, r) => acc + r.bestScale10, 0) /
            attemptedLessonRows.length
          ).toFixed(2),
        )
      : 0;
  const totalAttempts = chartData.reduce((acc, r) => acc + r.attempts, 0);

  const axisTextColor = isDarkMode ? '#94a3b8' : '#475569';
  const gridStroke = isDarkMode ? '#1e293b' : '#e2e8f0';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    updateProfile({
      nickname: nicknameInput.trim(),
      grade: gradeInput,
      schoolName: schoolInput.trim() || user.schoolName,
      province: provinceInput.trim() || user.province,
    });
    setIsEditingProfile(false);
  };

  const handleResetVectorStats = () => {
    saveVectorScores({});
    setScoresMap({});
    setConfirmReset(false);
  };

  const getProgressBarColor = (pct: number): string => {
    if (pct >= 80) return '#10b981'; // Emerald
    if (pct >= 50) return '#f59e0b'; // Amber
    if (pct > 0) return '#6366f1'; // Indigo
    return isDarkMode ? '#334155' : '#cbd5e1';
  };

  return (
    <div className="max-w-6xl mx-auto pb-14 space-y-6">
      {/* ================================================================= */}
      {/* STUDENT IDENTITY & KPI OVERVIEW CARD                              */}
      {/* ================================================================= */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-3xl shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {user.nickname}
                </h1>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {user.grade}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <School className="w-3.5 h-3.5" />
                  {user.schoolName}
                </span>
                <span>·</span>
                <span>{user.province}</span>
                <span>·</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {user.rank}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setNicknameInput(user.nickname);
                setGradeInput(user.grade);
                setSchoolInput(user.schoolName);
                setProvinceInput(user.province);
                setIsEditingProfile((v) => !v);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>
            <button
              onClick={onOpenLeaderboard}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Bảng Xếp Hạng</span>
            </button>
          </div>
        </div>

        {/* Inline Edit Profile Form */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Họ và tên / Biệt danh
              </label>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Khối lớp
              </label>
              <select
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value as UserGrade)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              >
                <option value="Lớp 10">Lớp 10</option>
                <option value="Lớp 11">Lớp 11</option>
                <option value="Lớp 12">Lớp 12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Trường THPT
              </label>
              <input
                type="text"
                value={schoolInput}
                onChange={(e) => setSchoolInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Tỉnh / Thành phố
              </label>
              <input
                type="text"
                value={provinceInput}
                onChange={(e) => setProvinceInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}

        {/* Key Academic Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>Tiến độ Chương IV</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {overallChapterCompletion}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({completedLessonsCount}/5 bài)
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Điểm TB Chương IV</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {attemptedLessonRows.length > 0 ? avgLessonScale10.toFixed(2) : '—'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ 10 điểm</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Tổng kinh nghiệm</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.totalXP}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">XP</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Chuỗi ngày học</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {user.streak.currentStreak}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ngày · {totalAttempts} lượt làm bài
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* RECHARTS ANALYTICS: CHAPTER IV VECTORS                            */}
      {/* ================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Thống kê Chương IV: Vectơ (Toán 10 – KNTT)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Biểu đồ cột cập nhật tự động ngay sau khi học sinh nộp bài từ Bài 7 đến Bài 11 và Đề Tổng ôn.
            </p>
          </div>
          <button
            onClick={() => onOpenVectorLesson(null)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Vào luyện Chương IV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Scores per lesson (Scale 10) */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Điểm số theo từng bài (Thang 10)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  So sánh điểm cao nhất và kết quả lần làm gần nhất · Mốc Giỏi: 8.0 điểm
                </p>
              </div>
            </div>

            <div className="w-full h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fill: axisTextColor, fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: gridStroke }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fill: axisTextColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: isDarkMode ? 'rgba(148,163,184,0.08)' : 'rgba(99,102,241,0.06)' }}
                    content={<VectorChartTooltip mode="score" />}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                    iconType="circle"
                  />
                  <ReferenceLine
                    y={8}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Mục tiêu 8.0',
                      position: 'insideTopRight',
                      fill: '#f59e0b',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                  <Bar
                    dataKey="bestScale10"
                    name="Điểm cao nhất (/10)"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="lastScale10"
                    name="Lần gần nhất (/10)"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Completion Progress (%) per lesson */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Tiến độ hoàn thành bài tập (%)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tỉ lệ câu hỏi đã hoàn thành ở từng bài học trong Chương IV: Vectơ
                </p>
              </div>
            </div>

            <div className="w-full h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: -10, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fill: axisTextColor, fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: gridStroke }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: axisTextColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: isDarkMode ? 'rgba(148,163,184,0.08)' : 'rgba(16,185,129,0.06)' }}
                    content={<VectorChartTooltip mode="progress" />}
                  />
                  <ReferenceLine y={100} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Bar
                    dataKey="completionPercent"
                    name="Tiến độ hoàn thành (%)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={42}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={getProgressBarColor(entry.completionPercent)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* LESSON-BY-LESSON DETAIL TABLE                                     */}
      {/* ================================================================= */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chi tiết tiến độ & điểm số từng bài
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chọn trực tiếp từng bài để làm hoặc cải thiện điểm số
            </p>
          </div>

          {totalAttempts > 0 && (
            <div>
              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Đặt lại thống kê Chương IV</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    Xóa toàn bộ điểm Chương IV?
                  </span>
                  <button
                    onClick={handleResetVectorStats}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold cursor-pointer"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-5">Bài học</th>
                <th className="py-3 px-4">Tiến độ</th>
                <th className="py-3 px-4">Điểm chuẩn Bộ GD</th>
                <th className="py-3 px-4">Quy đổi / 10</th>
                <th className="py-3 px-4">Lượt làm</th>
                <th className="py-3 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {chartData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-slate-100">
                    {row.fullTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 min-w-[120px]">
                      <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${row.completionPercent}%`,
                            backgroundColor: getProgressBarColor(row.completionPercent),
                          }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-xs text-slate-600 dark:text-slate-300 w-9 text-right">
                        {row.completionPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {row.attempts > 0
                      ? `${row.bestRawScore.toFixed(2)} / ${row.maxRawScore.toFixed(2)}đ`
                      : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-xs sm:text-sm font-bold">
                    {row.attempts > 0 ? (
                      <span
                        className={
                          row.bestScale10 >= 8
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : row.bestScale10 >= 5
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-amber-600 dark:text-amber-400'
                        }
                      >
                        {row.bestScale10.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">Chưa làm</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-slate-600 dark:text-slate-400">
                    {row.attempts}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onOpenVectorLesson(row.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>{row.attempts > 0 ? 'Ôn lại' : 'Làm bài'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

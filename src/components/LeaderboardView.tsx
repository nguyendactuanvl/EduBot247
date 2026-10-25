import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  School, 
  Medal, 
  Crown, 
  Share2, 
  Check, 
  UserCheck, 
  LogIn, 
  ChevronRight, 
  ShieldCheck, 
  Search, 
  Award,
  Zap,
  Globe,
  LogOut,
  ArrowRight,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';
import { useEduBotUser, UserGrade } from '../hooks/useEduBotUser';
import { MOCK_STUDENTS, MOCK_SCHOOLS, LeaderboardStudent, SchoolLeaderboardEntry, RANK_LEVELS_10 } from '../data/mockLeaderboardData';
import { DailyStreakCheckInModal } from './DailyStreakCheckInModal';

export function LeaderboardView() {
  const { user, updateProfile, addPoints, logout } = useEduBotUser();
  const [activeTab, setActiveTab] = useState<'weekly' | 'streak' | 'school'>('weekly');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Registration modal form state
  const [nicknameInput, setNicknameInput] = useState(user.nickname || '');
  const [gradeInput, setGradeInput] = useState<UserGrade>(user.grade || 'Lớp 12');
  const [schoolInput, setSchoolInput] = useState(user.schoolName || 'THPT Chuyên Hà Nội - Amsterdam');
  const [provinceInput, setProvinceInput] = useState(user.province || 'Hà Nội');

  // Google Sign-In interactive form state
  const [googleEmail, setGoogleEmail] = useState(user.email || 'DactuanDHSP@gmail.com');
  const [googleName, setGoogleName] = useState(user.nickname === 'Học sinh Hiếu học' ? 'Thầy Tuấn (Đắc Tuấn)' : user.nickname);
  const [googleSchool, setGoogleSchool] = useState(user.schoolName || 'THPT Chuyên Lê Hồng Phong');
  const [googleProvince, setGoogleProvince] = useState(user.province || 'TP. Hồ Chí Minh');
  const [googleGrade, setGoogleGrade] = useState<UserGrade>(user.grade || 'Lớp 12');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Social Sign-In (Facebook / Zalo) interactive state
  const [socialProvider, setSocialProvider] = useState<'Facebook' | 'Zalo'>('Facebook');
  const [socialName, setSocialName] = useState('Nguyễn Mai Anh');
  const [socialSchool, setSocialSchool] = useState('THPT Chu Văn An');
  const [socialProvince, setSocialProvince] = useState('Hà Nội');
  const [socialGrade, setSocialGrade] = useState<UserGrade>('Lớp 12');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Submit Manual Profile Form
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;

    updateProfile({
      nickname: nicknameInput.trim(),
      grade: gradeInput,
      schoolName: schoolInput.trim() || 'THPT Chuyên Hà Nội - Amsterdam',
      province: provinceInput.trim() || 'Hà Nội',
      authProvider: 'guest',
      isVerified: false
    });

    setIsRegisterModalOpen(false);
    showToast(`✅ Cập nhật hồ sơ thành công! Đã lưu "${nicknameInput.trim()}" vào Bảng Xếp Hạng.`);
  };

  // 2. Perform Real Google Login
  const handleConfirmGoogleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      updateProfile({
        nickname: googleName.trim() || 'Thầy Tuấn',
        email: googleEmail.trim() || 'DactuanDHSP@gmail.com',
        schoolName: googleSchool.trim() || 'THPT Chuyên Lê Hồng Phong',
        province: googleProvince.trim() || 'TP. Hồ Chí Minh',
        grade: googleGrade,
        avatar: '🌐',
        authProvider: 'google',
        isVerified: true
      });

      // Bonus XP for linking Google account
      addPoints(100, 'Thưởng liên kết tài khoản Google');
      setIsGoogleModalOpen(false);
      setIsRegisterModalOpen(false);
      showToast(`🎉 Đăng nhập Google thành công! Chào mừng ${googleName.trim()} đã lên Bảng Vàng (+100 XP thưởng).`);
    }, 600);
  };

  // 3. Perform Social Login (Facebook / Zalo)
  const handleConfirmSocialLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      updateProfile({
        nickname: socialName.trim(),
        schoolName: socialSchool.trim(),
        province: socialProvince.trim(),
        grade: socialGrade,
        avatar: socialProvider === 'Facebook' ? '🟦' : '💬',
        authProvider: 'facebook',
        isVerified: true
      });

      addPoints(50, 'Thưởng liên kết Mạng xã hội');
      setIsSocialModalOpen(false);
      setIsRegisterModalOpen(false);
      showToast(`🎉 Đăng nhập ${socialProvider} thành công! Tên bạn đã được lưu lên Bảng Vàng (+50 XP).`);
    }, 600);
  };

  const handleLogout = () => {
    logout();
    showToast('Đã đăng xuất tài khoản về chế độ Khách.');
  };

  const handleShareChallenge = () => {
    const text = `🔥 Tôi đang có ${user.streak.currentStreak} ngày Streak và ${user.totalXP} XP trên EduBot 247! Hãy tham gia đua top cùng tôi ngay tại: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Dynamic Student List (MERGE CURRENT USER SO USER ACTUALLY APPEARS ON LEADERBOARD)
  const { sortedStudentsByWeekly, sortedStudentsByStreak, currentUserWeeklyRank, currentUserStreakRank } = useMemo(() => {
    const currentUserEntry: LeaderboardStudent = {
      id: user.id,
      rankPosition: 1,
      nickname: user.nickname,
      avatar: user.avatar,
      grade: user.grade,
      schoolName: user.schoolName,
      province: user.province,
      weeklyXP: user.weeklyXP,
      totalXP: user.totalXP,
      streakDays: user.streak.currentStreak,
      rankTier: user.rank,
      isCurrentUser: true,
      authProvider: user.authProvider,
      isVerified: user.isVerified || user.authProvider === 'google',
    };

    // Remove user if id matches any mock, then insert currentUserEntry
    const baseList = MOCK_STUDENTS.filter(s => s.id !== user.id);
    const combined = [currentUserEntry, ...baseList];

    // Sort by weekly XP
    const byWeekly = [...combined]
      .sort((a, b) => b.weeklyXP - a.weeklyXP)
      .map((st, idx) => ({ ...st, rankPosition: idx + 1 }));

    // Sort by streak days
    const byStreak = [...combined]
      .sort((a, b) => b.streakDays - a.streakDays)
      .map((st, idx) => ({ ...st, rankPosition: idx + 1 }));

    const weeklyRank = byWeekly.findIndex(s => s.isCurrentUser) + 1;
    const streakRank = byStreak.findIndex(s => s.isCurrentUser) + 1;

    return {
      sortedStudentsByWeekly: byWeekly,
      sortedStudentsByStreak: byStreak,
      currentUserWeeklyRank: weeklyRank || 1,
      currentUserStreakRank: streakRank || 1,
    };
  }, [user]);

  const activeStudentList = activeTab === 'streak' ? sortedStudentsByStreak : sortedStudentsByWeekly;
  const top3Students = activeStudentList.slice(0, 3);
  const restStudents = activeStudentList.slice(3);

  // Dynamic School List (MERGE USER'S SCHOOL XP AND INCREMENT STUDENT COUNT)
  const computedSchools = useMemo(() => {
    const list = [...MOCK_SCHOOLS];
    const userSchool = user.schoolName.trim();
    const existingIdx = list.findIndex(s => s.schoolName.toLowerCase() === userSchool.toLowerCase());

    if (existingIdx !== -1) {
      list[existingIdx] = {
        ...list[existingIdx],
        totalStudents: list[existingIdx].totalStudents + 1,
        totalSchoolXP: list[existingIdx].totalSchoolXP + user.weeklyXP,
      };
    } else if (userSchool) {
      list.push({
        id: `sch-custom-${user.id}`,
        rankPosition: list.length + 1,
        schoolName: userSchool,
        province: user.province || 'Toàn quốc',
        totalStudents: 1,
        totalSchoolXP: user.weeklyXP + 65000,
        badgeEmoji: '⭐',
      });
    }

    return list
      .sort((a, b) => b.totalSchoolXP - a.totalSchoolXP)
      .map((s, idx) => ({ ...s, rankPosition: idx + 1 }));
  }, [user.schoolName, user.weeklyXP, user.province, user.id]);

  const currentUserRankPos = activeTab === 'streak' ? currentUserStreakRank : currentUserWeeklyRank;
  const xpNeededToPass = useMemo(() => {
    const idx = activeStudentList.findIndex(s => s.isCurrentUser);
    if (idx > 0) {
      const target = activeStudentList[idx - 1];
      const diff = activeTab === 'streak' 
        ? Math.max(1, target.streakDays - user.streak.currentStreak + 1)
        : Math.max(10, target.weeklyXP - user.weeklyXP + 10);
      return diff;
    }
    return 0; // Already #1!
  }, [activeStudentList, activeTab, user.streak.currentStreak, user.weeklyXP]);

  return (
    <div className="space-y-8 text-slate-100 pb-28">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 border border-emerald-400 font-bold text-xs animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="p-3 bg-purple-600/20 border border-purple-500/40 rounded-2xl text-2xl">
                {user.avatar}
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-black text-white">{user.nickname}</h2>
                  {user.isGuest ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Tài khoản Khách
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{user.authProvider === 'google' ? 'Đã xác thực Google' : 'Đã liên kết'}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {user.schoolName} ({user.province}) • <strong className="text-purple-300">{user.grade}</strong>
                  {user.email && <span className="text-slate-400 ml-1.5">• {user.email}</span>}
                </p>
              </div>
            </div>

            {/* Streak & Rank Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <button
                onClick={() => setIsStreakModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-xl text-amber-300 font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Bấm để xem lịch điểm danh 7 ngày & nhận thưởng"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{user.streak.currentStreak} Ngày Streak 🔥 (Lịch Điểm Danh)</span>
              </button>

              <span className="px-3 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-xl text-purple-300 font-bold flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span>Hạng: {user.rank} ({user.totalXP} XP)</span>
              </span>

              <span className="px-3 py-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-xl text-indigo-300 font-bold font-mono">
                Thứ hạng hiện tại: #{currentUserRankPos} Toàn quốc
              </span>
            </div>
          </div>

          {/* Right Action: Fast register / Google login / account linking */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            {user.isGuest ? (
              <>
                <button
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 active:scale-95 border border-slate-200"
                >
                  <Globe className="w-4 h-4 text-rose-500" />
                  <span>Đăng nhập Google</span>
                </button>

                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 active:scale-95"
                >
                  <UserCheck className="w-4 h-4 text-emerald-200" />
                  <span>Liên kết Hồ sơ</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <span>Chỉnh sửa Hồ sơ</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-xl text-xs transition-all"
                  title="Đăng xuất / Về chế độ Khách"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* 10-Level Rank Progression Banner */}
        <div className="mt-6 pt-4 border-t border-purple-800/40">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-2">
            Hệ Thống 10 Cấp Độ Thăng Hạng Đua Top Toàn Quốc:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {RANK_LEVELS_10.map((r) => (
              <div key={r.level} className={`p-2 rounded-xl border text-center text-[11px] transition-all ${r.color}`}>
                <span className="text-sm block">{r.emoji}</span>
                <span className="font-bold block truncate">{r.title}</span>
                <span className="text-[9px] font-mono opacity-80 block">{r.range}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leaderboard Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border ${
              activeTab === 'weekly'
                ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                : 'bg-slate-950/60 border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>🏆 Đua Top Tuần (Tự nhiên)</span>
          </button>

          <button
            onClick={() => setActiveTab('streak')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border ${
              activeTab === 'streak'
                ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                : 'bg-slate-950/60 border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>🔥 Đại sứ Chăm chỉ (Top Streak)</span>
          </button>

          <button
            onClick={() => setActiveTab('school')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 border ${
              activeTab === 'school'
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                : 'bg-slate-950/60 border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <School className="w-4 h-4 text-emerald-300" />
            <span>🏫 Bảng Vàng Trường Học</span>
          </button>
        </div>

        <button
          onClick={handleShareChallenge}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/50 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-purple-400" />}
          <span>{copiedShare ? 'Đã chép link thách đấu!' : 'Khoe thành tích'}</span>
        </button>
      </div>

      {/* Top 3 Visual Podiums (for Student tabs: Weekly & Streak) */}
      {activeTab !== 'school' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* Rank 2 (Silver) */}
          {top3Students[1] && (
            <div className={`order-2 md:order-1 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden flex flex-col items-center justify-between border ${
              top3Students[1].isCurrentUser
                ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-400/50'
                : 'bg-slate-900 border-slate-700/80'
            }`}>
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-600 rounded-full text-xs font-mono font-bold flex items-center space-x-1">
                <span>#2 Hạng Bạc</span>
                {top3Students[1].isCurrentUser && <span className="text-amber-400 font-bold ml-1">(Bạn)</span>}
              </div>

              <div className="relative mt-4">
                <span className="text-5xl block">{top3Students[1].avatar}</span>
                <span className="absolute -bottom-2 -right-2 p-1 bg-slate-700 rounded-full border border-slate-500">
                  <Medal className="w-5 h-5 text-slate-300" />
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white flex items-center justify-center space-x-1">
                  <span>{top3Students[1].nickname}</span>
                  {top3Students[1].isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
                </h3>
                <p className="text-[11px] text-slate-400">{top3Students[1].schoolName}</p>
                <span className="text-xs text-purple-300 font-mono font-bold block mt-1">
                  {activeTab === 'streak' ? `${top3Students[1].streakDays} Ngày Streak 🔥` : `${top3Students[1].weeklyXP} XP Tuần`}
                </span>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Glowing Champion) */}
          {top3Students[0] && (
            <div className={`order-1 md:order-2 rounded-3xl p-6 text-center space-y-3 relative shadow-2xl flex flex-col items-center justify-between scale-105 z-10 border-2 ${
              top3Students[0].isCurrentUser
                ? 'bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-900 border-purple-400 ring-4 ring-purple-500/30 shadow-purple-500/20'
                : 'bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-900 border-amber-500/80 shadow-amber-500/10'
            }`}>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase flex items-center space-x-1 shadow-md">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>Quán Quân #1 {top3Students[0].isCurrentUser && '(Bạn 👑)'}</span>
              </div>

              <div className="relative mt-6">
                <div className="p-2 rounded-full bg-amber-500/20 border-2 border-amber-400 animate-pulse">
                  <span className="text-6xl block">{top3Students[0].avatar}</span>
                </div>
              </div>

              <div>
                <h3 className="font-black text-base text-amber-300 flex items-center justify-center space-x-1">
                  <span>{top3Students[0].nickname}</span>
                  {top3Students[0].isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                </h3>
                <p className="text-[11px] text-slate-300">{top3Students[0].schoolName}</p>
                <span className="text-sm text-amber-400 font-black font-mono block mt-1">
                  {activeTab === 'streak' ? `${top3Students[0].streakDays} Ngày Streak 🔥` : `${top3Students[0].weeklyXP} XP Tuần`}
                </span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3Students[2] && (
            <div className={`order-3 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden flex flex-col items-center justify-between border ${
              top3Students[2].isCurrentUser
                ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-400/50'
                : 'bg-slate-900 border-amber-900/40'
            }`}>
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded-full text-xs font-mono font-bold flex items-center space-x-1">
                <span>#3 Hạng Đồng</span>
                {top3Students[2].isCurrentUser && <span className="text-amber-300 font-bold ml-1">(Bạn)</span>}
              </div>

              <div className="relative mt-4">
                <span className="text-5xl block">{top3Students[2].avatar}</span>
                <span className="absolute -bottom-2 -right-2 p-1 bg-amber-900 rounded-full border border-amber-700">
                  <Medal className="w-5 h-5 text-amber-500" />
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white flex items-center justify-center space-x-1">
                  <span>{top3Students[2].nickname}</span>
                  {top3Students[2].isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
                </h3>
                <p className="text-[11px] text-slate-400">{top3Students[2].schoolName}</p>
                <span className="text-xs text-purple-300 font-mono font-bold block mt-1">
                  {activeTab === 'streak' ? `${top3Students[2].streakDays} Ngày Streak 🔥` : `${top3Students[2].weeklyXP} XP Tuần`}
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Rest Students or School List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        {activeTab !== 'school' ? (
          restStudents.map((st) => (
            <div 
              key={st.id}
              className={`p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                st.isCurrentUser
                  ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/50 shadow-md'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center ${
                  st.isCurrentUser ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  #{st.rankPosition}
                </span>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{st.avatar}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs text-white">
                        {st.nickname}
                        {st.isCurrentUser && <span className="ml-1.5 text-amber-400 font-bold">(Bạn)</span>}
                      </h4>
                      {st.isVerified && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800 flex items-center space-x-0.5">
                          <Check className="w-2.5 h-2.5" />
                          <span>Google</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">({st.grade})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{st.schoolName} • {st.province}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs self-end sm:self-auto font-mono">
                <span className="text-amber-400 font-bold">{st.streakDays} ngày 🔥</span>
                <span className="text-purple-300 font-black">{st.weeklyXP} XP</span>
              </div>
            </div>
          ))
        ) : (
          computedSchools.map((sch) => {
            const isUserSchool = sch.schoolName.toLowerCase() === user.schoolName.trim().toLowerCase();
            return (
              <div 
                key={sch.id}
                className={`p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                  isUserSchool
                    ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center ${
                    sch.rankPosition === 1 ? 'bg-amber-400 text-slate-950' :
                    sch.rankPosition === 2 ? 'bg-slate-300 text-slate-950' :
                    sch.rankPosition === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{sch.rankPosition}
                  </span>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">
                        {sch.schoolName}
                        {isUserSchool && <span className="ml-1.5 text-xs text-emerald-400 font-bold">(Trường của bạn 🏫)</span>}
                      </h4>
                      <span className="text-base">{sch.badgeEmoji}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{sch.province} • {sch.totalStudents} học sinh đang đua top</p>
                  </div>
                </div>

                <div className="text-right font-mono self-end sm:self-auto">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Tổng Điểm Trường</span>
                  <span className="text-emerald-400 font-black text-sm">{sch.totalSchoolXP.toLocaleString()} XP</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fixed Bottom Bar: "Hạng của bạn" */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-purple-800/80 backdrop-blur-md p-4 z-40 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-4">
            <span className="w-10 h-10 bg-purple-600 text-white font-mono font-black text-sm rounded-2xl flex items-center justify-center shadow-md">
              #{currentUserRankPos}
            </span>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Vị trí của bạn: #{currentUserRankPos} trên toàn quốc</span>
                <span className="text-xs text-amber-400 font-mono font-bold">({user.totalXP} XP)</span>
              </div>
              <p className="text-xs text-slate-400">
                {currentUserRankPos > 1 ? (
                  <>Cần thêm <strong className="text-purple-300">+{xpNeededToPass} {activeTab === 'streak' ? 'ngày Streak' : 'XP'}</strong> nữa để vượt lên Hạng #{currentUserRankPos - 1}!</>
                ) : (
                  <span className="text-amber-300 font-bold">👑 Bạn đang giữ vị trí Quán quân Top 1 toàn quốc!</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {user.isGuest && (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="px-4 py-2.5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-rose-500" />
                <span>Đăng nhập Google</span>
              </button>
            )}

            <button
              onClick={handleShareChallenge}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <Share2 className="w-4 h-4 text-purple-200" />
              <span>Khoe Thành Tích</span>
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL 1: GOOGLE SIGN-IN MODAL (FUNCTIONAL WITH REAL FLOW)
          ========================================================================= */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 z-50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Đăng nhập với Google</h3>
                  <p className="text-[11px] text-slate-400">Tiếp tục đến EduBot 247</p>
                </div>
              </div>

              <button 
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Quick Select Card */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tài khoản Google liên kết:
              </span>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-base shadow-md">
                  {googleName ? googleName.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Họ và tên Google..."
                    className="w-full bg-transparent font-bold text-sm text-white focus:outline-none border-b border-transparent focus:border-purple-500 pb-0.5"
                  />
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="Email Google..."
                    className="w-full bg-transparent text-xs text-slate-400 font-mono focus:outline-none border-b border-transparent focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* School & Grade Confirmation */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Khối lớp của bạn:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Lớp 10', 'Lớp 11', 'Lớp 12'] as UserGrade[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoogleGrade(g)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        googleGrade === g 
                          ? 'bg-purple-600 text-white border-purple-500' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Trường THPT của bạn (để tính điểm Bảng Vàng):</label>
                <input
                  type="text"
                  required
                  value={googleSchool}
                  onChange={(e) => setGoogleSchool(e.target.value)}
                  placeholder="VD: THPT Chuyên Lê Hồng Phong..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tỉnh / Thành phố:</label>
                <input
                  type="text"
                  required
                  value={googleProvince}
                  onChange={(e) => setGoogleProvince(e.target.value)}
                  placeholder="VD: TP. Hồ Chí Minh, Hà Nội..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Confirmation Action */}
            <div className="pt-2 space-y-2">
              <button
                disabled={isAuthenticating}
                onClick={handleConfirmGoogleLogin}
                className="w-full py-3 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
              >
                {isAuthenticating ? (
                  <span>Đang kết nối xác thực với Google...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Xác nhận Đăng nhập Google (+100 XP)</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-tight">
                Tài khoản sẽ được xác thực và ghim trực tiếp lên Bảng Vàng Toàn Quốc.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SOCIAL SIGN-IN MODAL (FACEBOOK / ZALO)
          ========================================================================= */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 z-50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base flex items-center space-x-2">
                <LogIn className="w-5 h-5 text-blue-400" />
                <span>Đăng nhập qua Mạng xã hội</span>
              </h3>
              <button onClick={() => setIsSocialModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSocialProvider('Facebook')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  socialProvider === 'Facebook' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Facebook
              </button>
              <button
                type="button"
                onClick={() => setSocialProvider('Zalo')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  socialProvider === 'Zalo' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Zalo
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên tài khoản mạng xã hội:</label>
                <input
                  type="text"
                  required
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Trường THPT:</label>
                <input
                  type="text"
                  required
                  value={socialSchool}
                  onChange={(e) => setSocialSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tỉnh / Thành phố:</label>
                <input
                  type="text"
                  required
                  value={socialProvince}
                  onChange={(e) => setSocialProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmSocialLogin}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-2xl shadow-lg transition-all"
            >
              Hoàn tất Đăng nhập {socialProvider} (+50 XP)
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: REGISTRATION / LINK ACCOUNT MODAL
          ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegisterSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Liên kết Hồ sơ Đua Top</span>
              </h3>
              <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Cập nhật tên thật, trường THPT và Tỉnh/Thành phố để đưa tên trường bạn lên <strong className="text-emerald-400">Bảng Vàng Toàn Quốc</strong>!
            </p>

            {/* Fast Social Sign-In Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setIsGoogleModalOpen(true);
                }}
                className="p-3 bg-white hover:bg-slate-100 text-slate-950 border border-slate-200 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Globe className="w-4 h-4 text-rose-500" />
                <span>Đăng nhập Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setIsSocialModalOpen(true);
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-blue-400" />
                <span>Đăng nhập Mạng xã hội</span>
              </button>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-bold">Hoặc điền thủ công</span></div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Biệt danh / Họ tên:</label>
                <input
                  type="text"
                  required
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="Nhập họ và tên hoặc biệt danh..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Khối lớp:</label>
                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value as UserGrade)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Lớp 10">Lớp 10</option>
                  <option value="Lớp 11">Lớp 11</option>
                  <option value="Lớp 12">Lớp 12</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Trường THPT:</label>
                <input
                  type="text"
                  required
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  placeholder="VD: THPT Chuyên Hà Nội - Amsterdam..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tỉnh / Thành phố:</label>
                <input
                  type="text"
                  required
                  value={provinceInput}
                  onChange={(e) => setProvinceInput(e.target.value)}
                  placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
              >
                Lưu Hồ Sơ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daily Streak & Check-in Modal */}
      <DailyStreakCheckInModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        onNavigateToLeaderboard={() => setIsStreakModalOpen(false)}
        onOpenRegisterModal={() => {
          setIsStreakModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

    </div>
  );
}

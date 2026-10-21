import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { useEduBotUser, UserGrade } from '../hooks/useEduBotUser';
import { MOCK_STUDENTS, MOCK_SCHOOLS } from '../data/mockLeaderboardData';
import { DailyStreakCheckInModal } from './DailyStreakCheckInModal';

export function LeaderboardView() {
  const { user, updateProfile } = useEduBotUser();
  const [activeTab, setActiveTab] = useState<'weekly' | 'streak' | 'school'>('weekly');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Registration modal form state
  const [nicknameInput, setNicknameInput] = useState(user.nickname || '');
  const [gradeInput, setGradeInput] = useState<UserGrade>(user.grade || 'Lớp 12');
  const [schoolInput, setSchoolInput] = useState(user.schoolName || 'THPT Chuyên Hà Nội - Amsterdam');
  const [provinceInput, setProvinceInput] = useState(user.province || 'Hà Nội');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;

    updateProfile({
      nickname: nicknameInput.trim(),
      grade: gradeInput,
      schoolName: schoolInput.trim(),
      province: provinceInput.trim(),
    });

    setIsRegisterModalOpen(false);
  };

  const handleFastSocialLogin = (provider: 'Google' | 'Facebook') => {
    updateProfile({
      nickname: provider === 'Google' ? 'Phạm Hoàng Nam (Google)' : 'Nguyễn Mai Anh (FB)',
      grade: 'Lớp 12',
      schoolName: 'THPT Chuyên Lê Hồng Phong',
      province: 'TP. Hồ Chí Minh',
      avatar: provider === 'Google' ? '🌐' : '🟦',
    });
    setIsRegisterModalOpen(false);
  };

  const handleShareChallenge = () => {
    const text = `🔥 Tôi đang có ${user.streak.currentStreak} ngày Streak và ${user.totalXP} XP trên EduBot 247! Hãy tham gia đua top cùng tôi ngay tại: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Sort students for Weekly vs Streak tabs
  const sortedStudentsByWeekly = [...MOCK_STUDENTS].sort((a, b) => b.weeklyXP - a.weeklyXP);
  const sortedStudentsByStreak = [...MOCK_STUDENTS].sort((a, b) => b.streakDays - a.streakDays);

  const top3Students = activeTab === 'streak' ? sortedStudentsByStreak.slice(0, 3) : sortedStudentsByWeekly.slice(0, 3);
  const restStudents = activeTab === 'streak' ? sortedStudentsByStreak.slice(3) : sortedStudentsByWeekly.slice(3);

  // User rank calculation mockup
  const currentUserRankPos = activeTab === 'streak' ? 14 : 13;
  const xpNeededToPass = activeTab === 'streak' ? 2 : 60; // 60 XP gap to rank 12

  return (
    <div className="space-y-8 text-slate-100 pb-28">
      
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
                  {user.isGuest && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Tài khoản Khách
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {user.schoolName} ({user.province}) • <strong className="text-purple-300">{user.grade}</strong>
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
            </div>
          </div>

          {/* Right Action: Fast register / account linking if guest */}
          {user.isGuest ? (
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center space-x-2 self-start md:self-auto shrink-0 active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-emerald-200" />
              <span>Liên kết Tài khoản & Đua Top</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 self-start md:self-auto shrink-0"
            >
              <span>Chỉnh sửa Hồ sơ</span>
            </button>
          )}

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
            <div className="order-2 md:order-1 bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden flex flex-col items-center justify-between">
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-600 rounded-full text-xs font-mono font-bold">
                #2 Hạng Bạc
              </div>

              <div className="relative mt-4">
                <span className="text-5xl block">{top3Students[1].avatar}</span>
                <span className="absolute -bottom-2 -right-2 p-1 bg-slate-700 rounded-full border border-slate-500">
                  <Medal className="w-5 h-5 text-slate-300" />
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">{top3Students[1].nickname}</h3>
                <p className="text-[11px] text-slate-400">{top3Students[1].schoolName}</p>
                <span className="text-xs text-purple-300 font-mono font-bold block mt-1">
                  {activeTab === 'streak' ? `${top3Students[1].streakDays} Ngày Streak 🔥` : `${top3Students[1].weeklyXP} XP Tuần`}
                </span>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Glowing Champion) */}
          {top3Students[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 text-center space-y-3 relative shadow-2xl shadow-amber-500/10 flex flex-col items-center justify-between scale-105 z-10">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase flex items-center space-x-1 shadow-md">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>Quán Quân #1</span>
              </div>

              <div className="relative mt-6">
                <div className="p-2 rounded-full bg-amber-500/20 border-2 border-amber-400 animate-pulse">
                  <span className="text-6xl block">{top3Students[0].avatar}</span>
                </div>
              </div>

              <div>
                <h3 className="font-black text-base text-amber-300">{top3Students[0].nickname}</h3>
                <p className="text-[11px] text-slate-300">{top3Students[0].schoolName}</p>
                <span className="text-sm text-amber-400 font-black font-mono block mt-1">
                  {activeTab === 'streak' ? `${top3Students[0].streakDays} Ngày Streak 🔥` : `${top3Students[0].weeklyXP} XP Tuần`}
                </span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3Students[2] && (
            <div className="order-3 bg-slate-900 border border-amber-900/40 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden flex flex-col items-center justify-between">
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded-full text-xs font-mono font-bold">
                #3 Hạng Đồng
              </div>

              <div className="relative mt-4">
                <span className="text-5xl block">{top3Students[2].avatar}</span>
                <span className="absolute -bottom-2 -right-2 p-1 bg-amber-900 rounded-full border border-amber-700">
                  <Medal className="w-5 h-5 text-amber-500" />
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">{top3Students[2].nickname}</h3>
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
              className="p-4 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-4">
                <span className="w-8 h-8 bg-slate-800 text-slate-400 rounded-xl font-mono font-black text-xs flex items-center justify-center">
                  #{st.rankPosition}
                </span>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{st.avatar}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs text-white">{st.nickname}</h4>
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
          MOCK_SCHOOLS.map((sch) => (
            <div 
              key={sch.id}
              className="p-4 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                    <h4 className="font-bold text-sm text-white">{sch.schoolName}</h4>
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
          ))
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
                Cần thêm <strong className="text-purple-300">+{xpNeededToPass} XP</strong> nữa để vượt lên Hạng #{currentUserRankPos - 1}!
              </p>
            </div>
          </div>

          <button
            onClick={handleShareChallenge}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <Share2 className="w-4 h-4 text-purple-200" />
            <span>Khoe Thành Tích Ngay</span>
          </button>

        </div>
      </div>

      {/* Registration / Link Account Modal */}
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
                onClick={() => handleFastSocialLogin('Google')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <Globe className="w-4 h-4 text-rose-400" />
                <span>Đăng nhập Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleFastSocialLogin('Facebook')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
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
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg"
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

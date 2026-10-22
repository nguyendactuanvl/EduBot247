import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Sparkles, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Share2, 
  X, 
  ArrowRight, 
  Crown,
  UserCheck,
  Medal,
  TrendingUp
} from 'lucide-react';
import { useEduBotUser, computeUserRank, UserRank } from '../hooks/useEduBotUser';

interface DailyStreakCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLeaderboard: () => void;
  onOpenRegisterModal?: () => void;
}

export function DailyStreakCheckInModal({
  isOpen,
  onClose,
  onNavigateToLeaderboard,
  onOpenRegisterModal,
}: DailyStreakCheckInModalProps) {
  const { user, addPoints } = useEduBotUser();
  const [claimedToday, setClaimedToday] = useState(false);
  const [justClaimedBonus, setJustClaimedBonus] = useState(false);

  // Check if today bonus was already claimed in this session/day
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const claimedKey = `edubot_streak_claimed_${todayStr}`;
    const alreadyClaimed = localStorage.getItem(claimedKey);
    if (alreadyClaimed) {
      setClaimedToday(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleClaimDailyXP = () => {
    if (claimedToday) return;
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`edubot_streak_claimed_${todayStr}`, 'true');
    addPoints(50, 'Điểm danh hàng ngày');
    setClaimedToday(true);
    setJustClaimedBonus(true);
    setTimeout(() => setJustClaimedBonus(false), 3000);
  };

  // Rank thresholds for progress bar
  const getNextRankInfo = (rank: UserRank, xp: number) => {
    switch (rank) {
      case 'Tân thủ':
        return { nextRank: 'Học đồ', targetXP: 300, currentProgress: Math.min(100, (xp / 300) * 100), remaining: Math.max(0, 300 - xp) };
      case 'Học đồ':
        return { nextRank: 'Cao thủ Tự nhiên', targetXP: 1000, currentProgress: Math.min(100, ((xp - 300) / 700) * 100), remaining: Math.max(0, 1000 - xp) };
      case 'Cao thủ Tự nhiên':
        return { nextRank: 'Trạng nguyên EduBot', targetXP: 3000, currentProgress: Math.min(100, ((xp - 1000) / 2000) * 100), remaining: Math.max(0, 3000 - xp) };
      case 'Trạng nguyên EduBot':
        return { nextRank: 'Bậc Thầy Tối Cao', targetXP: 5000, currentProgress: 100, remaining: 0 };
    }
  };

  const rankInfo = getNextRankInfo(user.rank, user.totalXP);

  // 7-day week schedule (Thứ 2 to Chủ Nhật)
  const currentDayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const dayIndexToday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // 0 = Mon, 6 = Sun
  
  const weekDays = [
    { label: 'T2', name: 'Thứ 2', xp: '+30 XP' },
    { label: 'T3', name: 'Thứ 3', xp: '+30 XP' },
    { label: 'T4', name: 'Thứ 4', xp: '+40 XP' },
    { label: 'T5', name: 'Thứ 5', xp: '+40 XP' },
    { label: 'T6', name: 'Thứ 6', xp: '+50 XP' },
    { label: 'T7', name: 'Thứ 7', xp: '+60 XP' },
    { label: 'CN', name: 'C.Nhật', xp: '+100 XP 🔥' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/85 z-50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-purple-800/80 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-gradient-to-br from-amber-500/20 via-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Greeting */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chào mừng bạn trở lại với EduBot 247!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Điểm Danh & Chuỗi Streak Học Tập 🔥
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Xin chào <strong className="text-purple-300">{user.nickname}</strong>! Duy trì học đều đặn mỗi ngày để tích lũy XP và thăng hạng trên Bảng Vàng toàn quốc.
          </p>
        </div>

        {/* Big Streak Flame Showcase */}
        <div className="bg-gradient-to-r from-amber-950/50 via-slate-950 to-purple-950/50 border border-amber-500/40 rounded-3xl p-5 sm:p-6 text-center space-y-3 shadow-lg relative">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 shadow-inner">
            <Flame className="w-12 h-12 text-amber-400 fill-amber-400 animate-bounce" />
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 block">
              {user.streak.currentStreak} Ngày Streak
            </span>
            <span className="text-xs font-semibold text-slate-300 mt-1 block">
              Kỷ lục chuỗi dài nhất: <strong className="text-amber-400">{user.streak.maxStreak} ngày</strong>
            </span>
          </div>

          {/* Daily XP Claim Button */}
          <div className="pt-2">
            {!claimedToday ? (
              <button
                onClick={handleClaimDailyXP}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 mx-auto active:scale-95 border border-yellow-200"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Nhận Quà Điểm Danh Hôm Nay (+50 XP)</span>
              </button>
            ) : (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Đã nhận thưởng điểm danh hôm nay (+50 XP) ✓</span>
              </div>
            )}

            {justClaimedBonus && (
              <p className="text-xs text-amber-300 font-bold mt-2 animate-pulse">
                🎉 +50 XP đã được cộng vào tài khoản của bạn!
              </p>
            )}
          </div>
        </div>

        {/* 7-Day Weekly Streak Calendar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Chuỗi 7 ngày trong tuần này:</span>
            </span>
            <span className="text-purple-300 font-mono">Đã đạt {Math.min(7, user.streak.currentStreak)}/7 ngày</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day, idx) => {
              const isPastOrToday = idx <= dayIndexToday;
              const isToday = idx === dayIndexToday;
              const isStreakActive = isPastOrToday && (dayIndexToday - idx < user.streak.currentStreak);

              return (
                <div
                  key={day.label}
                  className={`p-2 sm:p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                    isToday
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/30'
                      : isStreakActive
                      ? 'bg-purple-950/50 border-purple-600/70 text-purple-200'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-bold block">{day.label}</span>
                  <div className="my-1">
                    {isStreakActive ? (
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono font-medium block truncate max-w-full">
                    {isToday ? 'Hôm nay' : day.xp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rank & Progress Status */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-purple-600/20 border border-purple-500/40 rounded-xl">
                <Crown className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Hạng Năng Lực Hiện Tại</span>
                <span className="text-sm font-black text-white">{user.rank}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-black text-amber-400">{user.totalXP} XP</span>
              <span className="text-[10px] text-slate-400 block">Tuần: {user.weeklyXP} XP</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${rankInfo.currentProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Tiến độ: {Math.round(rankInfo.currentProgress)}%</span>
              {rankInfo.remaining > 0 ? (
                <span>Còn <strong className="text-purple-300">+{rankInfo.remaining} XP</strong> để lên <strong className="text-amber-300">{rankInfo.nextRank}</strong></span>
              ) : (
                <span className="text-amber-300 font-bold">Đã đạt Hạng Đỉnh Cao!</span>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Standing teaser */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-900/60 rounded-2xl text-xs">
          <div className="flex items-center space-x-3">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">
                Thứ hạng của bạn: #{user.rank === 'Trạng nguyên EduBot' ? '1' : user.rank === 'Cao thủ Tự nhiên' ? '5' : user.totalXP > 700 ? '11' : '13'} Toàn quốc
              </span>
              <span className="text-[11px] text-slate-400">{user.schoolName} ({user.province})</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateToLeaderboard();
            }}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors flex items-center space-x-1 shrink-0"
          >
            <span>Bảng Xếp Hạng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          {user.isGuest && onOpenRegisterModal && (
            <button
              onClick={() => {
                onClose();
                onOpenRegisterModal();
              }}
              className="w-full sm:w-1/2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/50 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Liên kết Tài khoản để Lưu Rank</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onNavigateToLeaderboard();
            }}
            className={`${user.isGuest && onOpenRegisterModal ? 'w-full sm:w-1/2' : 'w-full'} px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Xem Bảng Xếp Hạng Đua Top 🏆</span>
          </button>
        </div>

      </div>
    </div>
  );
}

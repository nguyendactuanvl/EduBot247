import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  Sparkles, 
  Share2, 
  Check, 
  Award, 
  ShieldCheck, 
  Zap, 
  Info 
} from 'lucide-react';
import { UserStats } from '../types';

interface GamificationBannerProps {
  stats?: UserStats;
  onShareChallenge?: () => void;
}

export function GamificationBanner({
  stats = {
    streakDays: 7,
    xpPoints: 1250,
    rank: 'Cao thủ',
    completedQuizzes: 42,
  },
  onShareChallenge
}: GamificationBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    if (onShareChallenge) onShareChallenge();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Streak & Rank Badge */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Streak Counter */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-300">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-amber-400/80 uppercase font-bold block leading-none">Chuỗi học tập</span>
              <span className="text-sm font-black font-mono">{stats.streakDays} Ngày Streak 🔥</span>
            </div>
          </div>

          {/* Rank Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-purple-500/15 border border-purple-500/30 rounded-2xl text-purple-300">
            <Trophy className="w-5 h-5 text-purple-400 fill-purple-400/30" />
            <div>
              <span className="text-[10px] text-purple-400/80 uppercase font-bold block leading-none">Xếp hạng Năng lực</span>
              <span className="text-sm font-black">{stats.rank} ({stats.xpPoints} XP)</span>
            </div>
          </div>

          {/* Ministry Scoring Rule Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Thang điểm Đúng/Sai 4 ý:</span>
              <span className="text-[11px] text-cyan-300 font-mono">1 ý=0.1đ • 2 ý=0.25đ • 3 ý=0.5đ • 4 ý=1.0đ</span>
            </div>
          </div>

        </div>

        {/* Right: Share Challenge Button */}
        <button
          onClick={handleCopyLink}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-extrabold text-xs transition-all shadow-md flex items-center gap-2 self-start md:self-auto shrink-0 active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4 text-purple-200" />}
          <span>{copied ? 'Đã sao chép link thách đấu!' : 'Sao chép Link Thách Đấu Bạn Bè'}</span>
        </button>

      </div>
    </div>
  );
}

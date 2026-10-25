import { UserGrade, UserRank } from '../hooks/useEduBotUser';

export interface LeaderboardStudent {
  id: string;
  rankPosition: number;
  nickname: string;
  avatar: string;
  grade: UserGrade;
  schoolName: string;
  province: string;
  weeklyXP: number;
  totalXP: number;
  streakDays: number;
  rankTier: UserRank;
  isCurrentUser?: boolean;
  authProvider?: 'guest' | 'google' | 'facebook';
  isVerified?: boolean;
}

export interface SchoolLeaderboardEntry {
  id: string;
  rankPosition: number;
  schoolName: string;
  province: string;
  totalStudents: number;
  totalSchoolXP: number;
  badgeEmoji: string;
}

export interface RankLevelInfo {
  level: number;
  title: string;
  range: string;
  minXP: number;
  color: string;
  emoji: string;
}

export const RANK_LEVELS_10: RankLevelInfo[] = [
  { level: 1, title: 'Cấp 1: Tân thủ', range: '0 - 299 XP', minXP: 0, color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300', emoji: '🌱' },
  { level: 2, title: 'Cấp 2: Tập sự', range: '300 - 699 XP', minXP: 300, color: 'border-teal-500/30 bg-teal-950/20 text-teal-300', emoji: '📖' },
  { level: 3, title: 'Cấp 3: Chuyên gia', range: '700 - 1.499 XP', minXP: 700, color: 'border-blue-500/30 bg-blue-950/20 text-blue-300', emoji: '🎓' },
  { level: 4, title: 'Cấp 4: Tinh anh', range: '1.500 - 2.999 XP', minXP: 1500, color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300', emoji: '⚡' },
  { level: 5, title: 'Cấp 5: Cao thủ', range: '3.000 - 4.999 XP', minXP: 3000, color: 'border-amber-500/30 bg-amber-950/20 text-amber-300', emoji: '🏅' },
  { level: 6, title: 'Cấp 6: Danh thủ', range: '5.000 - 7.999 XP', minXP: 5000, color: 'border-orange-500/30 bg-orange-950/20 text-orange-300', emoji: '🔮' },
  { level: 7, title: 'Cấp 7: Đại cao thủ', range: '8.000 - 11.999 XP', minXP: 8000, color: 'border-purple-500/30 bg-purple-950/20 text-purple-300', emoji: '👑' },
  { level: 8, title: 'Cấp 8: Huyền thoại', range: '12.000 - 16.999 XP', minXP: 12000, color: 'border-fuchsia-500/30 bg-fuchsia-950/20 text-fuchsia-300', emoji: '🐉' },
  { level: 9, title: 'Cấp 9: Siêu cấp bá khí', range: '17.000 - 24.999 XP', minXP: 17000, color: 'border-rose-500/30 bg-rose-950/20 text-rose-300', emoji: '🔥' },
  { level: 10, title: 'Cấp 10: Trạng nguyên EduBot', range: '25.000+ XP', minXP: 25000, color: 'border-amber-400 bg-amber-500/20 text-amber-200 font-extrabold shadow-lg', emoji: '🌌' },
];

// Pure Real Data Store - Reset to empty so only real users appear
export const MOCK_STUDENTS: LeaderboardStudent[] = [];

export const MOCK_SCHOOLS: SchoolLeaderboardEntry[] = [];


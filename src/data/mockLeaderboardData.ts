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

export const MOCK_STUDENTS: LeaderboardStudent[] = [
  {
    id: 's1',
    rankPosition: 1,
    nickname: 'Phạm Nhật Minh (Thủ Khoa)',
    avatar: '🥇',
    grade: 'Lớp 12',
    schoolName: 'THPT Chuyên Lê Hồng Phong',
    province: 'TP. Hồ Chí Minh',
    weeklyXP: 2850,
    totalXP: 9400,
    streakDays: 45,
    rankTier: 'Trạng nguyên EduBot',
  },
  {
    id: 's2',
    rankPosition: 2,
    nickname: 'Nguyễn Bích Ngọc',
    avatar: '🥈',
    grade: 'Lớp 12',
    schoolName: 'THPT Chuyên Hà Nội - Amsterdam',
    province: 'Hà Nội',
    weeklyXP: 2420,
    totalXP: 8100,
    streakDays: 38,
    rankTier: 'Trạng nguyên EduBot',
  },
  {
    id: 's3',
    rankPosition: 3,
    nickname: 'Trần Hoàng Vũ',
    avatar: '🥉',
    grade: 'Lớp 11',
    schoolName: 'THPT Chuyên Quốc Học Huế',
    province: 'Thừa Thiên Huế',
    weeklyXP: 2150,
    totalXP: 6850,
    streakDays: 32,
    rankTier: 'Trạng nguyên EduBot',
  },
  {
    id: 's4',
    rankPosition: 4,
    nickname: 'Đặng Tuấn Anh',
    avatar: '🚀',
    grade: 'Lớp 12',
    schoolName: 'THPT Chu Văn An',
    province: 'Hà Nội',
    weeklyXP: 1890,
    totalXP: 5400,
    streakDays: 28,
    rankTier: 'Trạng nguyên EduBot',
  },
  {
    id: 's5',
    rankPosition: 5,
    nickname: 'Lê Thu Trang',
    avatar: '👩‍🔬',
    grade: 'Lớp 11',
    schoolName: 'THPT Chuyên Phan Bội Châu',
    province: 'Nghệ An',
    weeklyXP: 1650,
    totalXP: 4200,
    streakDays: 24,
    rankTier: 'Trạng nguyên EduBot',
  },
  {
    id: 's6',
    rankPosition: 6,
    nickname: 'Vũ Quốc Bảo',
    avatar: '⚡',
    grade: 'Lớp 12',
    schoolName: 'THPT Nguyễn Thị Minh Khai',
    province: 'TP. Hồ Chí Minh',
    weeklyXP: 1420,
    totalXP: 3600,
    streakDays: 21,
    rankTier: 'Trạng nguyên EduBot',
  },
  {
    id: 's7',
    rankPosition: 7,
    nickname: 'Bùi Phương Thảo',
    avatar: '🌟',
    grade: 'Lớp 10',
    schoolName: 'THPT Chuyên Lam Sơn',
    province: 'Thanh Hóa',
    weeklyXP: 1210,
    totalXP: 2850,
    streakDays: 19,
    rankTier: 'Cao thủ Tự nhiên',
  },
  {
    id: 's8',
    rankPosition: 8,
    nickname: 'Hoàng Bảo Long',
    avatar: '🔥',
    grade: 'Lớp 12',
    schoolName: 'THPT Chuyên Trần Phú',
    province: 'Hải Phòng',
    weeklyXP: 1050,
    totalXP: 2300,
    streakDays: 16,
    rankTier: 'Cao thủ Tự nhiên',
  },
  {
    id: 's9',
    rankPosition: 9,
    nickname: 'Đỗ Khánh Vân',
    avatar: '🧬',
    grade: 'Lớp 11',
    schoolName: 'THPT Bùi Thị Xuân',
    province: 'TP. Hồ Chí Minh',
    weeklyXP: 920,
    totalXP: 1850,
    streakDays: 14,
    rankTier: 'Cao thủ Tự nhiên',
  },
  {
    id: 's10',
    rankPosition: 10,
    nickname: 'Ngô Việt Hoàng',
    avatar: '📐',
    grade: 'Lớp 10',
    schoolName: 'THPT Chuyên Hoàng Lê Kha',
    province: 'Tây Ninh',
    weeklyXP: 810,
    totalXP: 1450,
    streakDays: 11,
    rankTier: 'Cao thủ Tự nhiên',
  },
  {
    id: 's11',
    rankPosition: 11,
    nickname: 'Trịnh Mai Linh',
    avatar: '🎓',
    grade: 'Lớp 12',
    schoolName: 'THPT Lương Văn Tụy',
    province: 'Ninh Bình',
    weeklyXP: 680,
    totalXP: 980,
    streakDays: 9,
    rankTier: 'Học đồ',
  },
  {
    id: 's12',
    rankPosition: 12,
    nickname: 'Phan Đức Hải',
    avatar: '🧪',
    grade: 'Lớp 11',
    schoolName: 'THPT Chuyên Nguyễn Bỉnh Khiêm',
    province: 'Quảng Nam',
    weeklyXP: 540,
    totalXP: 720,
    streakDays: 7,
    rankTier: 'Học đồ',
  }
];

export const MOCK_SCHOOLS: SchoolLeaderboardEntry[] = [
  {
    id: 'sch-1',
    rankPosition: 1,
    schoolName: 'THPT Chuyên Hà Nội - Amsterdam',
    province: 'Hà Nội',
    totalStudents: 148,
    totalSchoolXP: 142500,
    badgeEmoji: '👑',
  },
  {
    id: 'sch-2',
    rankPosition: 2,
    schoolName: 'THPT Chuyên Lê Hồng Phong',
    province: 'TP. Hồ Chí Minh',
    totalStudents: 135,
    totalSchoolXP: 138200,
    badgeEmoji: '🥇',
  },
  {
    id: 'sch-3',
    rankPosition: 3,
    schoolName: 'THPT Chuyên Quốc Học Huế',
    province: 'Thừa Thiên Huế',
    totalStudents: 112,
    totalSchoolXP: 115400,
    badgeEmoji: '🥈',
  },
  {
    id: 'sch-4',
    rankPosition: 4,
    schoolName: 'THPT Chu Văn An',
    province: 'Hà Nội',
    totalStudents: 98,
    totalSchoolXP: 98600,
    badgeEmoji: '🥉',
  },
  {
    id: 'sch-5',
    rankPosition: 5,
    schoolName: 'THPT Chuyên Phan Bội Châu',
    province: 'Nghệ An',
    totalStudents: 86,
    totalSchoolXP: 87500,
    badgeEmoji: '🌟',
  },
  {
    id: 'sch-6',
    rankPosition: 6,
    schoolName: 'THPT Nguyễn Thị Minh Khai',
    province: 'TP. Hồ Chí Minh',
    totalStudents: 74,
    totalSchoolXP: 72100,
    badgeEmoji: '🔥',
  }
];

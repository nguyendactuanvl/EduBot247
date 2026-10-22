import { useState, useEffect, useCallback } from 'react';

export type UserGrade = 'Lớp 10' | 'Lớp 11' | 'Lớp 12';

export type UserRank = 'Tân thủ' | 'Học đồ' | 'Cao thủ Tự nhiên' | 'Trạng nguyên EduBot';

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  maxStreak: number;
}

export interface UserProfile {
  id: string;
  isGuest: boolean;
  nickname: string;
  avatar: string;
  email?: string;
  authProvider?: 'guest' | 'google' | 'facebook';
  isVerified?: boolean;
  grade: UserGrade;
  schoolName: string;
  province: string;
  totalXP: number;
  weeklyXP: number;
  streak: StreakData;
  rank: UserRank;
  createdAt: string;
}

const DEFAULT_GUEST_USER: UserProfile = {
  id: `guest_${Math.random().toString(36).substring(2, 9)}`,
  isGuest: true,
  nickname: 'Học sinh Hiếu học',
  avatar: '🎓',
  authProvider: 'guest',
  isVerified: false,
  grade: 'Lớp 12',
  schoolName: 'THPT Chuyên Hà Nội - Amsterdam',
  province: 'Hà Nội',
  totalXP: 450,
  weeklyXP: 180,
  streak: {
    currentStreak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    maxStreak: 12,
  },
  rank: 'Học đồ',
  createdAt: new Date().toISOString(),
};

export function computeUserRank(xp: number): UserRank {
  if (xp >= 3000) return 'Trạng nguyên EduBot';
  if (xp >= 1000) return 'Cao thủ Tự nhiên';
  if (xp >= 300) return 'Học đồ';
  return 'Tân thủ';
}

// Optional Web Audio API chime sound
function playSuccessSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.2); // C6

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Ignore audio context errors if browser blocks autoplay
  }
}

export function useEduBotUser() {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('edubot_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_GUEST_USER;
  });

  // Save to localStorage whenever user profile updates
  useEffect(() => {
    localStorage.setItem('edubot_user_profile', JSON.stringify(user));
  }, [user]);

  // Check and update daily streak
  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.streak.lastActiveDate;

    if (lastActive === today) return; // Already updated today

    const todayDate = new Date(today);
    const lastDate = new Date(lastActive);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    let newCurrentStreak = user.streak.currentStreak;
    if (diffDays === 1) {
      // Consecutive day!
      newCurrentStreak += 1;
      playSuccessSound();
    } else if (diffDays > 1) {
      // Missed a day or more, reset to 1
      newCurrentStreak = 1;
    }

    const newMaxStreak = Math.max(newCurrentStreak, user.streak.maxStreak);

    setUser(prev => ({
      ...prev,
      streak: {
        currentStreak: newCurrentStreak,
        lastActiveDate: today,
        maxStreak: newMaxStreak,
      }
    }));
  }, [user.streak.lastActiveDate, user.streak.currentStreak, user.streak.maxStreak]);

  // Run streak check on mount
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  // Add points (XP)
  const addPoints = useCallback((amount: number, reason?: string) => {
    playSuccessSound();

    setUser(prev => {
      const newTotalXP = prev.totalXP + amount;
      const newWeeklyXP = prev.weeklyXP + amount;
      const newRank = computeUserRank(newTotalXP);

      return {
        ...prev,
        totalXP: newTotalXP,
        weeklyXP: newWeeklyXP,
        rank: newRank,
      };
    });
  }, []);

  // Update user profile (nickname, grade, school, province)
  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...data,
      isGuest: false, // Once profile is updated, convert from guest
    }));
  }, []);

  // Logout / Switch account back to guest
  const logout = useCallback(() => {
    localStorage.removeItem('edubot_user_profile');
    setUser({
      ...DEFAULT_GUEST_USER,
      id: `guest_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    });
  }, []);

  return {
    user,
    addPoints,
    updateStreak,
    updateProfile,
    logout,
  };
}

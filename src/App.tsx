/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DataInput } from './components/DataInput';
import { ResultView } from './components/ResultView';
import { HistoryModal } from './components/HistoryModal';
import { FormulaChat } from './components/FormulaChat';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { VideoGenerator } from './components/VideoGenerator';
import { TTSPlayer } from './components/TTSPlayer';
import { PhotoIDMaker } from './components/PhotoIDMaker';
import { Timetable } from './components/Timetable';
import { ClassGames } from './components/ClassGames';
import { MTBT2026NDTPRO } from './components/MTBT2026NDTPRO';
import { VirtualLabs } from './components/VirtualLabs';
import { MultiStudyToolkit } from './components/MultiStudyToolkit';
import { THPTExamPractice } from './components/THPTExamPractice';
import { KNTTPracticeHub } from './components/KNTTPracticeHub';
import { TriangleTrigExams } from './components/TriangleTrigExams';
import { Interval, CalculationResult } from './types';
import { calculateStatistics } from './utils/math';
import { 
  History, 
  Calculator, 
  Sparkles, 
  BookOpen, 
  Menu, 
  X, 
  FileText, 
  Video, 
  Mic, 
  Image as ImageIcon, 
  Calendar, 
  Gamepad2, 
  Monitor, 
  Beaker, 
  GraduationCap, 
  Trophy,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  FlaskConical,
  Dna,
  Languages,
  StickyNote,
  Swords,
  Cpu,
  Flame,
  Crown
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { AdMobBanner } from './components/AdMobBanner';
import { AdMobManagerModal } from './components/AdMobManagerModal';
import { AdMobRewardModal } from './components/AdMobRewardModal';
import { ADMOB_CONFIG } from './config/admob';
import { PhysicsToolkit } from './components/PhysicsToolkit';
import { ChemistryToolkit } from './components/ChemistryToolkit';
import { BiologyToolkit } from './components/BiologyToolkit';
import { EnglishToolkit } from './components/EnglishToolkit';
import { GamificationBanner } from './components/GamificationBanner';
import { StickyNotes } from './components/StickyNotes';
import { TeamArena } from './components/TeamArena';
import { CalculatorSkillsHub } from './components/CalculatorSkillsHub';
import { LeaderboardView } from './components/LeaderboardView';
import { DailyStreakCheckInModal } from './components/DailyStreakCheckInModal';
import { useEduBotUser } from './hooks/useEduBotUser';

export default function App() {
  const { user } = useEduBotUser();
  const [activeTab, setActiveTab] = useState<'exam' | 'triangle-exams' | 'leaderboard' | 'teamarena' | 'calcskills' | 'studytoolkit' | 'worksheets' | 'physics' | 'chemistry' | 'biology' | 'english' | 'statistics' | 'calculator' | 'virtuallabs' | 'edubot' | 'video' | 'tts' | 'photos' | 'timetable' | 'games' | 'stickynotes'>('triangle-exams');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isAdManagerOpen, setIsAdManagerOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [activeRewardUnitKey, setActiveRewardUnitKey] = useState<'REWARD_PHAN_THUONG' | 'ADS_4_REWARDED_INTERSTITIAL' | 'ADS_4_INTERSTITIAL' | 'ADS_2_APP_OPEN'>('REWARD_PHAN_THUONG');

  // Auto-show streak & leaderboard check-in modal when user opens the app
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('edubot_streak_modal_seen');
    if (!alreadyShown) {
      sessionStorage.setItem('edubot_streak_modal_seen', 'true');
      const timer = setTimeout(() => {
        setIsStreakModalOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const [intervals, setIntervals] = useState<Interval[]>([
    { id: uuidv4(), start: '', end: '', frequency: '' },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('stat-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  const handleCalculate = () => {
    const hasValidData = intervals.some(
      (i) => typeof i.start === 'number' && typeof i.end === 'number' && typeof i.frequency === 'number'
    );
    
    if (!hasValidData) {
      alert("Vui lòng nhập ít nhất một nhóm dữ liệu hợp lệ.");
      return;
    }

    const newResult = calculateStatistics(intervals);
    setResult(newResult);
    
    const newHistory = [newResult, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('stat-history', JSON.stringify(newHistory));
  };

  const handleLoadHistory = (item: CalculationResult) => {
    setResult(item);
    // Add empty interval at the end for ease of adding more
    setIntervals([
      ...item.intervals.map(i => ({...i, id: uuidv4()})),
      { id: uuidv4(), start: item.intervals[item.intervals.length - 1]?.end || '', end: '', frequency: '' }
    ]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('stat-history');
  };

  return (
    <div className={`flex h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight tracking-tight">EduBot 247</h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Học tập thông minh</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleDarkMode}
                title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button 
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Profile & Daily Streak Card */}
          <div className="mx-4 mt-3 mb-1 p-3.5 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-purple-800/40 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <span className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-lg shrink-0">
                  {user.avatar}
                </span>
                <div className="overflow-hidden">
                  <span className="font-bold text-xs text-white truncate block">{user.nickname}</span>
                  <span className="text-[10px] text-purple-300 font-mono block truncate">{user.grade} • {user.rank}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('leaderboard');
                  setIsSidebarOpen(false);
                }}
                title="Xem Bảng Xếp Hạng Đua Top"
                className="p-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Interactive Streak Counter */}
            <button
              onClick={() => {
                setIsStreakModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full p-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all flex items-center justify-between text-left group cursor-pointer"
              title="Bấm để xem lịch điểm danh 7 ngày & nhận thưởng"
            >
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-[10px] text-amber-300/80 uppercase font-bold block leading-none">Chuỗi học tập</span>
                  <span className="text-xs font-black font-mono text-amber-300">{user.streak.currentStreak} Ngày Streak 🔥</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-lg">
                Điểm danh
              </span>
            </button>

            {/* Total XP & Rank Standing */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-purple-900/40 text-slate-300 font-mono">
              <span className="text-slate-400">Điểm: <strong className="text-amber-400">{user.totalXP} XP</strong></span>
              <button
                onClick={() => {
                  setActiveTab('leaderboard');
                  setIsSidebarOpen(false);
                }}
                className="text-purple-300 hover:text-purple-200 underline font-semibold cursor-pointer"
              >
                Top #13 Toàn quốc →
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* 👑 Bảng Xếp Hạng & Streak */}
            <button
              onClick={() => {
                setActiveTab('leaderboard');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Trophy className={`w-5 h-5 ${activeTab === 'leaderboard' ? 'text-amber-600 dark:text-amber-400' : 'text-amber-500'}`} />
                <span className="text-left text-base font-bold">Bảng Xếp Hạng & Streak</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'leaderboard' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Top Tuần, Top Streak & Bảng Vàng Trường
              </span>
            </button>
            {/* 🏆 Giải đấu Đội nhóm (Team Arena) */}
            <button
              onClick={() => {
                setActiveTab('teamarena');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'teamarena'
                  ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Swords className={`w-5 h-5 ${activeTab === 'teamarena' ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
                <span className="text-left text-base font-bold">Giải đấu Đội nhóm (Team Arena)</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'teamarena' ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Thi đua 2, 3, 4, 5 người & Thăng Rank
              </span>
            </button>

            {/* 🧮 Skill Bấm Máy Tính (Toán - Lý - Hóa - Sinh) */}
            <button
              onClick={() => {
                setActiveTab('calcskills');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'calcskills'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Cpu className={`w-5 h-5 ${activeTab === 'calcskills' ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500'}`} />
                <span className="text-left text-base font-bold">Skill Bấm Máy Tính THPT</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'calcskills' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Tuyệt kỹ Casio Toán-Lý-Hóa-Sinh
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('studytoolkit');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'studytoolkit'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <GraduationCap className={`w-5 h-5 ${activeTab === 'studytoolkit' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base">Công cụ học tập Đa năng</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'studytoolkit' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                1. Đồ thị & Khảo sát KNTT
              </span>
            </button>

            {/* Môn Vật Lý THPT */}
            <button
              onClick={() => {
                setActiveTab('physics');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'physics'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Zap className={`w-5 h-5 ${activeTab === 'physics' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-500'}`} />
                <span className="text-left text-base">Công cụ Vật lý THPT</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'physics' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Đồ thị dao động & Mạch điện
              </span>
            </button>

            {/* Môn Hóa học THPT */}
            <button
              onClick={() => {
                setActiveTab('chemistry');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'chemistry'
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FlaskConical className={`w-5 h-5 ${activeTab === 'chemistry' ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-500'}`} />
                <span className="text-left text-base">Công cụ Hóa học THPT</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'chemistry' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Bảng tuần hoàn & Thí nghiệm ảo
              </span>
            </button>

            {/* Môn Sinh học THPT */}
            <button
              onClick={() => {
                setActiveTab('biology');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'biology'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Dna className={`w-5 h-5 ${activeTab === 'biology' ? 'text-emerald-600 dark:text-emerald-400' : 'text-green-500'}`} />
                <span className="text-left text-base">Công cụ Sinh học THPT</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'biology' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Lai Mendel, Bảng Punnett, ADN
              </span>
            </button>

            {/* Môn Tiếng Anh THPT */}
            <button
              onClick={() => {
                setActiveTab('english');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'english'
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Languages className={`w-5 h-5 ${activeTab === 'english' ? 'text-purple-600 dark:text-purple-400' : 'text-violet-500'}`} />
                <span className="text-left text-base">Công cụ Tiếng Anh THPT</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'english' ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`}>
                12 Thì & Động từ bất quy tắc
              </span>
            </button>

            {/* 3. Tạo Phiếu học tập (được đưa lên vị trí số 3 theo yêu cầu) */}
            <button
              onClick={() => {
                setActiveTab('worksheets');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'worksheets'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <FileText className={`w-5 h-5 ${activeTab === 'worksheets' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className="text-left text-base">Tạo Phiếu học tập</span>
            </button>

            {/* 4. Tính toán thống kê */}
            <button
              onClick={() => {
                setActiveTab('statistics');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'statistics'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calculator className={`w-5 h-5 ${activeTab === 'statistics' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base">Tính toán thống kê</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'statistics' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Toán học Lớp 11 & 12
              </span>
            </button>

            {/* 5. Máy tính MTBT2026 */}
            <button
              onClick={() => {
                setActiveTab('calculator');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'calculator'
                  ? 'bg-slate-800 dark:bg-slate-700 border-slate-700 dark:border-slate-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Monitor className={`w-5 h-5 ${activeTab === 'calculator' ? 'text-slate-200' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base">Máy tính MTBT2026</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'calculator' ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                Siêu máy tính đa năng
              </span>
            </button>
            
            {/* 6. Thí nghiệm Ảo */}
            <button
              onClick={() => {
                setActiveTab('virtuallabs');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'virtuallabs'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Beaker className={`w-5 h-5 ${activeTab === 'virtuallabs' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base">Thí nghiệm Ảo</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'virtuallabs' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Mô phỏng Hóa học & Vật lý
              </span>
            </button>

            {/* Tra cứu công thức */}
            <button
              onClick={() => {
                setActiveTab('edubot');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'edubot'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className={`w-5 h-5 ${activeTab === 'edubot' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base">Tra cứu công thức</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'edubot' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Toán - Lý - Hóa - Sinh - Anh
              </span>
            </button>

            {/* 📐 5 BỘ ĐỀ HỆ THỨC LƯỢNG TRONG TAM GIÁC */}
            <button
              onClick={() => {
                setActiveTab('triangle-exams');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'triangle-exams'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-sm'
                  : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500/15'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Crown className={`w-5 h-5 ${activeTab === 'triangle-exams' ? 'text-amber-600 dark:text-amber-400' : 'text-amber-500'}`} />
                <span className="text-left text-base font-bold">Bộ Đề Hệ Thức Lượng</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'triangle-exams' ? 'text-amber-600 dark:text-amber-400' : 'text-amber-600/80 dark:text-amber-400/80'}`}>
                5 Bộ đề 90' & Tích điểm thăng hạng
              </span>
            </button>

            {/* Luyện tập SGK & Thi thử */}
            <button
              onClick={() => {
                setActiveTab('exam');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'exam'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Trophy className={`w-5 h-5 ${activeTab === 'exam' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base">Luyện tập SGK & Thi thử</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'exam' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Tiểu học, THCS, THPT (KNTT)
              </span>
            </button>

            {/* Ghi chú cá nhân (Sticky Notes) */}
            <button
              onClick={() => {
                setActiveTab('stickynotes');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'stickynotes'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <StickyNote className={`w-5 h-5 ${activeTab === 'stickynotes' ? 'text-amber-600 dark:text-amber-400' : 'text-amber-500'}`} />
                <span className="text-left text-base">Ghi chú cá nhân</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                Sticky Notes
              </span>
            </button>

            {/* 8. Tạo Bài giảng Video */}
            <button
              onClick={() => {
                setActiveTab('video');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'video'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <Video className={`w-5 h-5 ${activeTab === 'video' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className="text-left text-base">Tạo Bài giảng Video</span>
            </button>

            {/* 9. Đọc văn bản (TTS) */}
            <button
              onClick={() => {
                setActiveTab('tts');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'tts'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <Mic className={`w-5 h-5 ${activeTab === 'tts' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className="text-left text-base">Đọc văn bản (TTS)</span>
            </button>

            {/* 10. Tạo Ảnh thẻ 3x4, 4x6 */}
            <button
              onClick={() => {
                setActiveTab('photos');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'photos'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <ImageIcon className={`w-5 h-5 ${activeTab === 'photos' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className="text-left text-base">Tạo Ảnh thẻ 3x4, 4x6</span>
            </button>

            {/* 11. Thời khóa biểu */}
            <button
              onClick={() => {
                setActiveTab('timetable');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'timetable'
                  ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <Calendar className={`w-5 h-5 ${activeTab === 'timetable' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className="text-left text-base">Thời khóa biểu</span>
            </button>

            {/* 12. Trò chơi Lớp học */}
            <button
              onClick={() => {
                setActiveTab('games');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'games'
                  ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-200 dark:border-fuchsia-800 text-fuchsia-700 dark:text-fuchsia-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <Gamepad2 className={`w-5 h-5 ${activeTab === 'games' ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className="text-left text-base">Trò chơi Lớp học</span>
            </button>
          </nav>
          
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            {import.meta.env.DEV && (
              <button
                onClick={() => setIsAdManagerOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors border border-indigo-200 dark:border-indigo-800"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Cấu hình 6 mã AdMob
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono">
                  Dev
                </span>
              </button>
            )}

            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                Chế độ {isDarkMode ? 'Ban đêm (Tối)' : 'Ban ngày (Sáng)'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-600">
                {isDarkMode ? 'Bật' : 'Tắt'}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Header - Mobile */}
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-base truncate">
              {activeTab === 'exam' && 'Luyện tập SGK & Thi thử'}
              {activeTab === 'triangle-exams' && 'Bộ Đề Hệ Thức Lượng'}
              {activeTab === 'leaderboard' && 'Bảng Xếp Hạng & Streak'}
              {activeTab === 'teamarena' && 'Giải đấu Đội nhóm'}
              {activeTab === 'calcskills' && 'Skill Bấm Máy Tính'}
              {activeTab === 'studytoolkit' && 'Công cụ học tập'}
              {activeTab === 'physics' && 'Vật lý THPT'}
              {activeTab === 'chemistry' && 'Hóa học THPT'}
              {activeTab === 'biology' && 'Sinh học THPT'}
              {activeTab === 'english' && 'Tiếng Anh THPT'}
              {activeTab === 'worksheets' && 'Tạo Phiếu học tập'}
              {activeTab === 'statistics' && 'Tính toán thống kê'}
              {activeTab === 'calculator' && 'Máy tính MTBT2026'}
              {activeTab === 'virtuallabs' && 'Thí nghiệm Ảo'}
              {activeTab === 'edubot' && 'Tra cứu công thức'}
              {activeTab === 'video' && 'Bài giảng Video'}
              {activeTab === 'tts' && 'Đọc văn bản (TTS)'}
              {activeTab === 'photos' && 'Tạo Ảnh thẻ'}
              {activeTab === 'timetable' && 'Thời khóa biểu'}
              {activeTab === 'games' && 'Trò chơi Lớp học'}
              {activeTab === 'stickynotes' && 'Ghi chú cá nhân'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Mobile Streak Button */}
            <button
              onClick={() => setIsStreakModalOpen(true)}
              className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-500 dark:text-amber-300 text-xs font-bold flex items-center space-x-1 active:scale-95"
              title="Điểm danh & Streak"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span className="font-mono">{user.streak.currentStreak}</span>
            </button>

            {/* Mobile Leaderboard shortcut */}
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`p-1.5 rounded-xl border transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Bảng Xếp Hạng"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {activeTab === 'statistics' && (
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <History className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Header - Desktop */}
        <div className="hidden lg:flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
              {activeTab === 'exam' && 'Luyện tập SGK & Thi thử KNTT'}
              {activeTab === 'triangle-exams' && 'Bộ Đề Kiểm Tra: Hệ Thức Lượng Trong Tam Giác (5 Bộ Đề 90 Min)'}
              {activeTab === 'leaderboard' && 'Bảng Xếp Hạng & Chuỗi Ngày Học (Streak)'}
              {activeTab === 'teamarena' && 'Giải đấu Đội nhóm (Team Arena)'}
              {activeTab === 'calcskills' && 'Skill Bấm Máy Tính Giải Nhanh THPT'}
              {activeTab === 'studytoolkit' && 'Công cụ học tập Đa năng'}
              {activeTab === 'physics' && 'Vật lý THPT - Mô phỏng & Đồ thị'}
              {activeTab === 'chemistry' && 'Hóa học THPT - Phân tử 3D & Thí nghiệm'}
              {activeTab === 'biology' && 'Sinh học THPT - Di truyền & ADN'}
              {activeTab === 'english' && 'Tiếng Anh THPT - Ngữ pháp & Trắc nghiệm'}
              {activeTab === 'worksheets' && 'Tạo Phiếu học tập'}
              {activeTab === 'statistics' && 'Tính toán thống kê'}
              {activeTab === 'calculator' && 'Máy tính MTBT2026'}
              {activeTab === 'virtuallabs' && 'Thí nghiệm Ảo'}
              {activeTab === 'edubot' && 'Tra cứu công thức'}
              {activeTab === 'video' && 'Bài giảng Video'}
              {activeTab === 'tts' && 'Đọc văn bản (TTS)'}
              {activeTab === 'photos' && 'Tạo Ảnh thẻ'}
              {activeTab === 'timetable' && 'Thời khóa biểu'}
              {activeTab === 'games' && 'Trò chơi Lớp học'}
              {activeTab === 'stickynotes' && 'Ghi chú cá nhân (Sticky Notes)'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              GDPT 2018
            </span>
          </div>

          {/* Right: Streak, XP & Leaderboard Status */}
          <div className="flex items-center space-x-3">
            {/* Streak Badge Button */}
            <button
              onClick={() => setIsStreakModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-xs active:scale-95 cursor-pointer"
              title="Bấm để xem lịch điểm danh 7 ngày & nhận thưởng"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span className="font-mono">{user.streak.currentStreak} Ngày Streak 🔥</span>
            </button>

            {/* Total XP & Rank */}
            <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-mono font-bold text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>{user.totalXP} XP</span>
              <span className="text-slate-400 font-sans">• {user.rank}</span>
            </div>

            {/* Leaderboard Button */}
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Bảng Xếp Hạng</span>
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => setIsStreakModalOpen(true)}
              className="flex items-center space-x-2 pl-2 pr-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              title="Hồ sơ học sinh & Streak"
            >
              <span className="text-base">{user.avatar}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">{user.nickname}</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'edubot' && (
            <div className="absolute inset-0 p-4 md:p-6 lg:p-8">
              <div className="max-w-4xl mx-auto h-full">
                <FormulaChat />
              </div>
            </div>
          )}

          {activeTab === 'exam' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <KNTTPracticeHub />
            </div>
          )}

          {activeTab === 'triangle-exams' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <TriangleTrigExams />
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <LeaderboardView />
            </div>
          )}

          {activeTab === 'teamarena' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <TeamArena />
            </div>
          )}

          {activeTab === 'calcskills' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <CalculatorSkillsHub />
            </div>
          )}

          {activeTab === 'studytoolkit' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <MultiStudyToolkit />
            </div>
          )}

          {activeTab === 'physics' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
              <GamificationBanner />
              <PhysicsToolkit />
            </div>
          )}

          {activeTab === 'chemistry' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
              <GamificationBanner />
              <ChemistryToolkit />
            </div>
          )}

          {activeTab === 'biology' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
              <GamificationBanner />
              <BiologyToolkit />
            </div>
          )}

          {activeTab === 'english' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
              <GamificationBanner />
              <EnglishToolkit />
            </div>
          )}
          
          {activeTab === 'statistics' && (
            <div className="absolute inset-0 overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="hidden lg:flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Công cụ Thống Kê</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Hỗ trợ tính toán đặc trưng mẫu số liệu ghép nhóm</p>
                  </div>
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Lịch sử tính toán
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 xl:col-span-4">
                    <div className="lg:sticky lg:top-8">
                      <DataInput 
                        intervals={intervals} 
                        onChange={setIntervals} 
                        onCalculate={handleCalculate} 
                      />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-7 xl:col-span-8">
                    {result ? (
                      <ResultView result={result} />
                    ) : (
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 border-dashed text-slate-400 p-8 text-center mt-6 lg:mt-0">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mb-4">
                          <Calculator className="w-8 h-8 text-blue-300" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">Chưa có kết quả</h3>
                        <p className="max-w-sm">Nhập các khoảng dữ liệu và tần số ở cột bên trái, sau đó nhấn "Tính toán" để xem kết quả chi tiết.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <MTBT2026NDTPRO />
            </div>
          )}
          
          {activeTab === 'virtuallabs' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <VirtualLabs />
            </div>
          )}

          {activeTab === 'worksheets' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <WorksheetGenerator />
            </div>
          )}
          {activeTab === 'video' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <VideoGenerator />
            </div>
          )}
          {activeTab === 'tts' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <TTSPlayer />
            </div>
          )}
          {activeTab === 'photos' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <PhotoIDMaker />
            </div>
          )}
          {activeTab === 'timetable' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <Timetable />
            </div>
          )}
          {activeTab === 'games' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
              <ClassGames />
            </div>
          )}
          {activeTab === 'stickynotes' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <StickyNotes />
            </div>
          )}
        </div>

        {/* AdMob Bottom Adaptive Banner (Ads 3) */}
        <AdMobBanner onOpenAdManager={() => setIsAdManagerOpen(true)} />
      </main>

      {isHistoryOpen && (
        <HistoryModal 
          history={history} 
          onClose={() => setIsHistoryOpen(false)} 
          onSelect={handleLoadHistory}
          onClear={handleClearHistory}
        />
      )}

      {/* Google AdMob 6 Units Manager Modal */}
      <AdMobManagerModal 
        isOpen={isAdManagerOpen}
        onClose={() => setIsAdManagerOpen(false)}
        onTestAdUnit={(unitKey) => {
          setActiveRewardUnitKey(unitKey);
          setIsRewardModalOpen(true);
        }}
      />

      {/* AdMob Reward / Interstitial / App Open Simulation Modal */}
      <AdMobRewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        adUnitKey={activeRewardUnitKey}
      />

      {/* Daily Streak & Leaderboard Check-In Modal on App Launch / Click */}
      <DailyStreakCheckInModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        onNavigateToLeaderboard={() => {
          setIsStreakModalOpen(false);
          setActiveTab('leaderboard');
        }}
      />
    </div>
  );
}

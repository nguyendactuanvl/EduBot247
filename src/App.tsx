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
import { MTBT2026NDTPRO } from './components/MTBT2026NDTPRO';
import { VirtualLabs } from './components/VirtualLabs';
import { MultiStudyToolkit } from './components/MultiStudyToolkit';
import { THPTExamPractice } from './components/THPTExamPractice';
import { KNTTPracticeHub } from './components/KNTTPracticeHub';
import { TriangleTrigExams } from './components/TriangleTrigExams';
import { InequalityExams } from './components/InequalityExams';
import { LogicSetExams } from './components/LogicSetExams';
import { Grade12Exams } from './components/Grade12Exams';
import { Grade11Exams } from './components/Grade11Exams';
import { Grade10Hub } from './components/Grade10Hub';
import { Grade11Hub } from './components/Grade11Hub';
import { Grade12Hub } from './components/Grade12Hub';
import { RubikCubeRelax } from './components/RubikCubeRelax';
import { VectorChapterExams } from './components/VectorChapterExams';
import { Grade12SpaceVectorsExams } from './components/Grade12SpaceVectorsExams';
import { Grade11ParallelSpaceExams } from './components/Grade11ParallelSpaceExams';
import { OnlineChapterExamPage } from './components/OnlineChapterExamPage';
import {
  isOnlineChapterKey,
  ONLINE_CHAPTERS_CATALOG,
  OnlineChapterKey,
} from './data/exams/onlineChaptersCatalog';
import { StudentProfileView } from './components/StudentProfileView';
import { ApiKeyManagerModal } from './components/ApiKeyManagerModal';
import {
  API_KEYS_UPDATED_EVENT,
  loadApiKeyPool,
  OPEN_API_KEY_MODAL_EVENT,
} from './services/geminiDirectClient';
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
  Swords,
  Cpu,
  Flame,
  Crown,
  Layers,
  ListOrdered,
  Box,
  BarChart3,
  Key
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
import { TeamArena } from './components/TeamArena';
import { CalculatorSkillsHub } from './components/CalculatorSkillsHub';
import { LeaderboardView } from './components/LeaderboardView';
import { DailyStreakCheckInModal } from './components/DailyStreakCheckInModal';
import { useEduBotUser } from './hooks/useEduBotUser';

export default function App() {
  const { user } = useEduBotUser();
  const [activeTab, setActiveTab] = useState<
    | 'exam'
    | 'triangle-exams'
    | 'inequality-exams'
    | 'logic-set-exams'
    | 'grade10-vectors'
    | 'grade11-exams'
    | 'grade12-exams'
    | 'grade10-hub'
    | 'grade11-hub'
    | 'grade12-hub'
    | 'grade11-trig'
    | 'grade11-parallel'
    | 'grade12-calculus'
    | 'grade12-vectors'
    | OnlineChapterKey
    | 'leaderboard'
    | 'profile'
    | 'teamarena'
    | 'calcskills'
    | 'studytoolkit'
    | 'worksheets'
    | 'physics'
    | 'chemistry'
    | 'biology'
    | 'english'
    | 'statistics'
    | 'calculator'
    | 'virtuallabs'
    | 'edubot'
    | 'rubik'
  >('triangle-exams');
  const [selectedVectorExamId, setSelectedVectorExamId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isAdManagerOpen, setIsAdManagerOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyCount, setApiKeyCount] = useState<number>(() => loadApiKeyPool().length);
  const [activeRewardUnitKey, setActiveRewardUnitKey] = useState<'REWARD_PHAN_THUONG' | 'ADS_4_REWARDED_INTERSTITIAL' | 'ADS_4_INTERSTITIAL' | 'ADS_2_APP_OPEN'>('REWARD_PHAN_THUONG');

  useEffect(() => {
    const handleKeysUpdated = () => setApiKeyCount(loadApiKeyPool().length);
    const handleOpenKeyModal = () => setIsApiKeyModalOpen(true);
    window.addEventListener(API_KEYS_UPDATED_EVENT, handleKeysUpdated);
    window.addEventListener(OPEN_API_KEY_MODAL_EVENT, handleOpenKeyModal);
    return () => {
      window.removeEventListener(API_KEYS_UPDATED_EVENT, handleKeysUpdated);
      window.removeEventListener(OPEN_API_KEY_MODAL_EVENT, handleOpenKeyModal);
    };
  }, []);

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

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* 1. ĐẦU SIDEBAR: Giải Rubik 3D Thư giãn */}
            <button
              onClick={() => {
                setActiveTab('rubik');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                activeTab === 'rubik'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/50 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <Box className={`w-5 h-5 shrink-0 ${activeTab === 'rubik' ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500'}`} />
              <div className="flex flex-col text-left">
                <span className="text-base font-bold leading-tight">Giải Rubik 3D</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">Thư giãn · Hướng dẫn &amp; Chụp ảnh giải</span>
              </div>
            </button>

            {/* 2. ÔN THI THPT ONLINE & HỌC TẬP (ngay sau Giải Rubik 3D) */}
            <div className="px-4 pt-3 pb-1 text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Ôn thi THPT Online
            </div>

            <div className="pl-2 space-y-1">
              {/* Lớp 10 */}
              <button
                onClick={() => {
                  setActiveTab('grade10-hub');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex flex-col px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                  activeTab === 'grade10-hub' ||
                  activeTab === 'triangle-exams' ||
                  activeTab === 'inequality-exams' ||
                  activeTab === 'logic-set-exams' ||
                  activeTab === 'grade10-vectors' ||
                  activeTab === 'grade10-stats' ||
                  activeTab === 'grade10-combprob'
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'bg-transparent border-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-left text-sm font-bold">Lớp 10</span>
                </div>
              </button>

              <div className="pl-5 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('grade10-vectors');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex flex-col px-3 py-2 rounded-xl transition-all text-left border cursor-pointer ${
                    activeTab === 'grade10-vectors'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                      : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-snug">Vectơ (Toán 10 - Ch. IV)</span>
                  <span className="text-[10px] opacity-80">5 đề theo bài · Tổng ôn 30 câu</span>
                </button>
                {(['grade10-stats', 'grade10-combprob'] as OnlineChapterKey[]).map((key) => {
                  const ch = ONLINE_CHAPTERS_CATALOG[key];
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveTab(key);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex flex-col px-3 py-2 rounded-xl transition-all text-left border cursor-pointer ${
                        activeTab === key
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                          : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xs font-bold leading-snug">{ch.sidebarLabel}</span>
                      <span className="text-[10px] opacity-80">{ch.sidebarMeta}</span>
                    </button>
                  );
                })}
              </div>

              {/* Lớp 11 */}
              <button
                onClick={() => {
                  setActiveTab('grade11-hub');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                  activeTab === 'grade11-hub' ||
                  activeTab === 'grade11-trig' ||
                  activeTab === 'grade11-parallel' ||
                  activeTab === 'grade11-limits' ||
                  activeTab === 'grade11-perp' ||
                  activeTab === 'grade11-prob' ||
                  activeTab === 'grade11-deriv'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'bg-transparent border-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-left text-sm font-bold">Lớp 11</span>
                </div>
              </button>

              <div className="pl-5 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('grade11-parallel');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex flex-col px-3 py-2 rounded-xl transition-all text-left border cursor-pointer ${
                    activeTab === 'grade11-parallel'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                      : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-snug">Quan hệ song song (Toán 11)</span>
                  <span className="text-[10px] opacity-80">5 đề theo bài · 15 đề TN THPT 90p</span>
                </button>
                {(['grade11-limits', 'grade11-perp', 'grade11-prob', 'grade11-deriv'] as OnlineChapterKey[]).map(
                  (key) => {
                    const ch = ONLINE_CHAPTERS_CATALOG[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveTab(key);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex flex-col px-3 py-2 rounded-xl transition-all text-left border cursor-pointer ${
                          activeTab === key
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                            : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xs font-bold leading-snug">{ch.sidebarLabel}</span>
                        <span className="text-[10px] opacity-80">{ch.sidebarMeta}</span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Lớp 12 */}
              <button
                onClick={() => {
                  setActiveTab('grade12-hub');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                  activeTab === 'grade12-hub' ||
                  activeTab === 'grade12-calculus' ||
                  activeTab === 'grade12-vectors' ||
                  activeTab === 'grade12-integrals' ||
                  activeTab === 'grade12-oxyz' ||
                  activeTab === 'grade12-condprob'
                    ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-bold'
                    : 'bg-transparent border-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-left text-sm font-bold">Lớp 12</span>
                </div>
              </button>

              <div className="pl-5 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('grade12-vectors');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex flex-col px-3 py-2 rounded-xl transition-all text-left border cursor-pointer ${
                    activeTab === 'grade12-vectors'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                      : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-snug">Vectơ trong không gian (Toán 12)</span>
                  <span className="text-[10px] opacity-80">3 đề theo bài · 15 đề TN THPT 90p</span>
                </button>
                {(['grade12-integrals', 'grade12-oxyz', 'grade12-condprob'] as OnlineChapterKey[]).map(
                  (key) => {
                    const ch = ONLINE_CHAPTERS_CATALOG[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveTab(key);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex flex-col px-3 py-2 rounded-xl transition-all text-left border cursor-pointer ${
                          activeTab === key
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                            : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xs font-bold leading-snug">{ch.sidebarLabel}</span>
                        <span className="text-[10px] opacity-80">{ch.sidebarMeta}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Luyện tập SGK & Thi thử */}
            <button
              onClick={() => {
                setActiveTab('exam');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                activeTab === 'exam'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Trophy className={`w-5 h-5 ${activeTab === 'exam' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base font-bold">Luyện tập SGK &amp; Thi thử</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'exam' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Tiểu học, THCS, THPT (KNTT)
              </span>
            </button>

            {/* Tra cứu công thức */}
            <button
              onClick={() => {
                setActiveTab('edubot');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                activeTab === 'edubot'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className={`w-5 h-5 ${activeTab === 'edubot' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-left text-base font-bold">Tra cứu công thức</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'edubot' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Toán - Lý - Hóa - Sinh - Anh
              </span>
            </button>

            {/* Trang cá nhân & Biểu đồ tiến độ */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className={`w-5 h-5 ${activeTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500'}`} />
                <span className="text-left text-base font-bold">Trang cá nhân &amp; Biểu đồ</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'profile' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Tiến độ &amp; điểm số luyện tập
              </span>
            </button>

            {/* Bảng Xếp Hạng & Streak */}
            <button
              onClick={() => {
                setActiveTab('leaderboard');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Trophy className={`w-5 h-5 ${activeTab === 'leaderboard' ? 'text-amber-600 dark:text-amber-400' : 'text-amber-500'}`} />
                <span className="text-left text-base font-bold">Bảng Xếp Hạng &amp; Streak</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'leaderboard' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                Top Tuần, Top Streak &amp; Bảng Vàng Trường
              </span>
            </button>

            {/* Giải đấu Đội nhóm (Team Arena) */}
            <button
              onClick={() => {
                setActiveTab('teamarena');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border cursor-pointer ${
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
                Thi đua 2, 3, 4, 5 người &amp; Thăng Rank
              </span>
            </button>

            {/* 3. CÁC CÔNG CỤ Ở PHÍA DƯỚI */}
            <div className="px-4 pt-4 pb-1 text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              Công cụ Toán &amp; Khoa học
            </div>
            <div className="pl-2 space-y-0.5">
              <button onClick={() => { setActiveTab('statistics'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'statistics' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Calculator className="w-4 h-4 mr-3" />
                Công cụ Toán THPT (Thống kê)
              </button>
              <button onClick={() => { setActiveTab('physics'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'physics' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Zap className="w-4 h-4 mr-3" />
                Công cụ Vật Lý THPT
              </button>
              <button onClick={() => { setActiveTab('chemistry'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'chemistry' ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <FlaskConical className="w-4 h-4 mr-3" />
                Công cụ Hóa Học THPT
              </button>
              <button onClick={() => { setActiveTab('biology'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'biology' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Dna className="w-4 h-4 mr-3" />
                Công cụ Sinh Học THPT
              </button>
            </div>

            <div className="px-4 pt-3 pb-1 text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Công cụ Học tập &amp; Tiện ích
            </div>
            <div className="pl-2 space-y-0.5">
              <button onClick={() => { setActiveTab('studytoolkit'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'studytoolkit' ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Layers className="w-4 h-4 mr-3" />
                Đa năng &amp; Công cụ học tập
              </button>
              <button onClick={() => { setActiveTab('english'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'english' ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Languages className="w-4 h-4 mr-3" />
                Công cụ Tiếng Anh
              </button>
              <button onClick={() => { setActiveTab('worksheets'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'worksheets' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <FileText className="w-4 h-4 mr-3" />
                Tạo Phiếu học tập
              </button>
              <button onClick={() => { setActiveTab('calculator'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'calculator' ? 'bg-slate-800 text-white dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Monitor className="w-4 h-4 mr-3" />
                Máy tính MTBT2026
              </button>
              <button onClick={() => { setActiveTab('virtuallabs'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all font-medium text-sm cursor-pointer ${activeTab === 'virtuallabs' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Beaker className="w-4 h-4 mr-3" />
                Thí nghiệm Ảo (Lý &amp; Hóa)
              </button>
            </div>

            {/* 4. CUỐI SIDEBAR: Thẻ Chuỗi học tập (User Profile & Daily Streak Card) */}
            <div className="pt-4">
              <div className="p-3.5 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-purple-800/40 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsSidebarOpen(false);
                    }}
                    title="Mở Trang cá nhân & Biểu đồ tiến độ"
                    className="flex items-center space-x-2.5 overflow-hidden text-left rounded-xl p-1 -m-1 hover:bg-white/10 transition-colors cursor-pointer flex-1 min-w-0"
                  >
                    <span className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-lg shrink-0">
                      {user.avatar}
                    </span>
                    <div className="overflow-hidden">
                      <span className="font-bold text-xs text-white truncate block">{user.nickname}</span>
                      <span className="text-[10px] text-purple-300 font-mono block truncate">{user.grade} • {user.rank}</span>
                    </div>
                  </button>
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
            </div>
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
              onClick={() => {
                setIsApiKeyModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
                apiKeyCount > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
              }`}
              title="Quản lý danh sách Gemini API Key xoay vòng dự phòng"
            >
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Gemini API Key (Xoay vòng)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono font-bold border border-current/20">
                {apiKeyCount > 0 ? `${apiKeyCount} key` : 'Mặc định'}
              </span>
            </button>

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
              {activeTab === 'grade10-hub' && 'Lớp 10 · Ôn thi Online'}
              {activeTab === 'triangle-exams' && 'Bộ Đề Hệ Thức Lượng'}
              {activeTab === 'inequality-exams' && 'Toán 10 · Bất Phương Trình'}
              {activeTab === 'logic-set-exams' && 'Toán 10 · Mệnh Đề & Tập Hợp'}
              {activeTab === 'grade10-vectors' && 'Toán 10 · Chương IV: Vectơ'}
              {activeTab === 'grade11-hub' && 'Lớp 11 · Ôn thi Online'}
              {activeTab === 'grade11-trig' && 'Toán 11 · Lượng Giác'}
              {activeTab === 'grade11-parallel' && 'Quan hệ song song (Toán 11)'}
              {activeTab === 'grade12-hub' && 'Lớp 12 · Ôn thi Online'}
              {activeTab === 'grade12-calculus' && 'Toán 12 · Ứng Dụng Đạo Hàm'}
              {activeTab === 'grade12-vectors' && 'Vectơ trong không gian (Toán 12)'}
              {isOnlineChapterKey(activeTab) && ONLINE_CHAPTERS_CATALOG[activeTab].sidebarLabel}
              {activeTab === 'profile' && 'Trang cá nhân & Biểu đồ'}
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
              {activeTab === 'rubik' && 'Giải Rubik 3D Thư giãn'}
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

            {/* Mobile API Key Manager shortcut */}
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`px-2 py-1 rounded-xl border text-xs font-bold flex items-center space-x-1 transition-all ${
                apiKeyCount > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
              }`}
              title="Cài đặt Gemini API Key (Xoay vòng dự phòng)"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="font-mono">{apiKeyCount > 0 ? apiKeyCount : 'AI'}</span>
            </button>

            {/* Mobile Profile & Charts shortcut */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-1.5 rounded-xl border transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Trang cá nhân & Biểu đồ tiến độ"
            >
              <BarChart3 className="w-4 h-4" />
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
              {activeTab === 'grade10-hub' && 'Lớp 10: Ôn thi THPT Online (KNTT)'}
              {activeTab === 'triangle-exams' && 'Bộ Đề Kiểm Tra: Hệ Thức Lượng Trong Tam Giác (5 Bộ Đề 90 Min)'}
              {activeTab === 'inequality-exams' && 'Toán 10 (KNTT) - Chương II: Bất Phương Trình & Hệ BPT Bậc Nhất Hai Ẩn'}
              {activeTab === 'logic-set-exams' && 'Toán 10 (KNTT) - Chương I: Mệnh Đề & Tập Hợp'}
              {activeTab === 'grade10-vectors' && 'Toán 10 (KNTT) - Chương IV: Vectơ (Bài 7 – Bài 11 & Tổng ôn 30 câu)'}
              {activeTab === 'grade11-hub' && 'Lớp 11: Ôn thi THPT Online (KNTT)'}
              {activeTab === 'grade11-trig' && 'Toán 11 (KNTT) - Chương I: Hàm Số Lượng Giác & Phương Trình Lượng Giác'}
              {activeTab === 'grade11-parallel' && 'Toán 11 (KNTT) - Chương IV: Quan Hệ Song Song Trong Không Gian (20 Bộ đề Online)'}
              {activeTab === 'grade12-hub' && 'Lớp 12: Ôn thi THPT Online (KNTT)'}
              {activeTab === 'grade12-calculus' && 'Toán 12 (KNTT) - Chương I: Ứng Dụng Đạo Hàm Khảo Sát Hàm Số'}
              {activeTab === 'grade12-vectors' && 'Toán 12 (KNTT) - Chương II: Vectơ và hệ trục tọa độ trong không gian (18 Bộ đề Online)'}
              {isOnlineChapterKey(activeTab) && ONLINE_CHAPTERS_CATALOG[activeTab].headerTitle}
              {activeTab === 'profile' && 'Trang cá nhân học sinh - Biểu đồ tiến độ & Điểm số'}
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
              {activeTab === 'rubik' && 'Giải Rubik 3D - Thư giãn & Rèn tư duy không gian'}
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

            {/* Gemini API Key Pool Button */}
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border cursor-pointer ${
                apiKeyCount > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
              }`}
              title="Quản lý danh sách Gemini API Key xoay vòng dự phòng"
            >
              <Key className="w-3.5 h-3.5" />
              <span>API Key</span>
              <span className="font-mono px-1.5 py-0.2 rounded bg-white/80 dark:bg-slate-900/70 text-[11px]">
                {apiKeyCount > 0 ? apiKeyCount : 'Auto'}
              </span>
            </button>

            {/* User Profile Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 pl-2 pr-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
              title="Mở Trang cá nhân & Biểu đồ tiến độ học tập"
            >
              <span className="text-base">{user.avatar}</span>
              <span className="text-xs font-bold max-w-[120px] truncate">{user.nickname}</span>
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

          {activeTab === 'grade10-hub' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Grade10Hub onSelect={setActiveTab} />
            </div>
          )}

          {activeTab === 'triangle-exams' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <TriangleTrigExams />
            </div>
          )}

          {activeTab === 'inequality-exams' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <InequalityExams onBack={() => setActiveTab('grade10-hub')} />
            </div>
          )}

          {activeTab === 'logic-set-exams' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <LogicSetExams onBack={() => setActiveTab('grade10-hub')} />
            </div>
          )}

          {activeTab === 'grade10-vectors' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <VectorChapterExams
                onBack={() => setActiveTab('grade10-hub')}
                initialExamId={selectedVectorExamId}
                onClearInitialExam={() => setSelectedVectorExamId(null)}
                onOpenProfile={() => setActiveTab('profile')}
              />
            </div>
          )}

          {activeTab === 'grade11-hub' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Grade11Hub onSelect={setActiveTab} />
            </div>
          )}

          {activeTab === 'grade11-trig' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Grade11Exams onBack={() => setActiveTab('grade11-hub')} />
            </div>
          )}

          {activeTab === 'grade11-parallel' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Grade11ParallelSpaceExams onBack={() => setActiveTab('grade11-hub')} />
            </div>
          )}

          {activeTab === 'grade12-hub' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Grade12Hub onSelect={setActiveTab} />
            </div>
          )}

          {activeTab === 'grade12-calculus' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Grade12Exams onBack={() => setActiveTab('grade12-hub')} />
            </div>
          )}

          {activeTab === 'grade12-vectors' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <Grade12SpaceVectorsExams onBack={() => setActiveTab('grade12-hub')} />
            </div>
          )}

          {isOnlineChapterKey(activeTab) && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <OnlineChapterExamPage
                chapterKey={activeTab}
                onBack={() => setActiveTab(ONLINE_CHAPTERS_CATALOG[activeTab].backTab)}
              />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <StudentProfileView
                isDarkMode={isDarkMode}
                onOpenVectorLesson={(examId) => {
                  setSelectedVectorExamId(examId);
                  setActiveTab('grade10-vectors');
                }}
                onOpenLeaderboard={() => setActiveTab('leaderboard')}
              />
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
          {activeTab === 'rubik' && (
            <div className="absolute inset-0 overflow-hidden">
              <RubikCubeRelax isDarkMode={isDarkMode} />
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

      {/* Global Multi-Key Direct Gemini Manager Modal */}
      <ApiKeyManagerModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}

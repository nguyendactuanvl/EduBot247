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
  Moon
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [activeTab, setActiveTab] = useState<'exam' | 'studytoolkit' | 'worksheets' | 'statistics' | 'calculator' | 'virtuallabs' | 'edubot' | 'video' | 'tts' | 'photos' | 'timetable' | 'games'>('exam');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            {/* 1. Luyện tập SGK Kết nối & Luyện thi */}
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

            {/* 2. Công cụ học tập Đa năng */}
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

            {/* 7. Tra cứu công thức (chuyển xuống trước Tạo Bài giảng Video theo yêu cầu) */}
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
            <div className="bg-white dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium text-center">
                GV: <span className="font-bold text-slate-800 dark:text-slate-200">Thầy Nguyễn Đắc Tuấn</span><br/>
                SĐT: <span className="text-blue-600 dark:text-blue-400 font-semibold">083 560 6162</span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Header - Mobile Only */}
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
              {activeTab === 'exam' && 'Luyện tập SGK & Thi thử'}
              {activeTab === 'studytoolkit' && 'Công cụ học tập Đa năng'}
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
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            {activeTab === 'statistics' && (
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <History className="w-5 h-5" />
              </button>
            )}
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

          {activeTab === 'studytoolkit' && (
            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 lg:p-8">
              <MultiStudyToolkit />
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
        </div>
      </main>

      {isHistoryOpen && (
        <HistoryModal 
          history={history} 
          onClose={() => setIsHistoryOpen(false)} 
          onSelect={handleLoadHistory}
          onClear={handleClearHistory}
        />
      )}
    </div>
  );
}

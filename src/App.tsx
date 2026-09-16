/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DataInput } from './components/DataInput';
import { ResultView } from './components/ResultView';
import { HistoryModal } from './components/HistoryModal';
import { FormulaChat } from './components/FormulaChat';
import { PWAInstallButton } from './components/PWAInstallButton';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { VideoGenerator } from './components/VideoGenerator';
import { TTSPlayer } from './components/TTSPlayer';
import { PhotoIDMaker } from './components/PhotoIDMaker';
import { Timetable } from './components/Timetable';
import { ClassGames } from './components/ClassGames';
import { Interval, CalculationResult } from './types';
import { calculateStatistics } from './utils/math';
import { History, Calculator, Sparkles, BookOpen, Menu, X, FileText, Video, Mic, Image as ImageIcon, Calendar, Gamepad2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [activeTab, setActiveTab] = useState<'edubot' | 'statistics' | 'worksheets' | 'video' | 'tts' | 'photos' | 'timetable' | 'games'>('edubot');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-[100dvh] bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-lg leading-tight tracking-tight">EduBot 247</h1>
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Học tập thông minh</p>
              </div>
            </div>
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab('edubot');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'edubot'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className={`w-5 h-5 ${activeTab === 'edubot' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-left text-base">Tra cứu công thức</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'edubot' ? 'text-indigo-500' : 'text-slate-400'}`}>
                Toán - Lý - Hóa - Sinh - Anh
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('statistics');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'statistics'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calculator className={`w-5 h-5 ${activeTab === 'statistics' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-left text-base">Tính toán thống kê</span>
              </div>
              <span className={`text-xs font-normal mt-1 pl-8 text-left ${activeTab === 'statistics' ? 'text-blue-500' : 'text-slate-400'}`}>
                Toán học Lớp 11 & 12
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('worksheets');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'worksheets'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <FileText className={`w-5 h-5 ${activeTab === 'worksheets' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-left text-base">Tạo Phiếu học tập</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('video');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'video'
                  ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <Video className={`w-5 h-5 ${activeTab === 'video' ? 'text-rose-600' : 'text-slate-400'}`} />
              <span className="text-left text-base">Tạo Bài giảng Video</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tts');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'tts'
                  ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <Mic className={`w-5 h-5 ${activeTab === 'tts' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="text-left text-base">Đọc văn bản (TTS)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('photos');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'photos'
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <ImageIcon className={`w-5 h-5 ${activeTab === 'photos' ? 'text-cyan-600' : 'text-slate-400'}`} />
              <span className="text-left text-base">Tạo Ảnh thẻ 3x4, 4x6</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('timetable');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'timetable'
                  ? 'bg-violet-50 border-violet-200 text-violet-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <Calendar className={`w-5 h-5 ${activeTab === 'timetable' ? 'text-violet-600' : 'text-slate-400'}`} />
              <span className="text-left text-base">Thời khóa biểu</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('games');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeTab === 'games'
                  ? 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <Gamepad2 className={`w-5 h-5 ${activeTab === 'games' ? 'text-fuchsia-600' : 'text-slate-400'}`} />
              <span className="text-left text-base">Trò chơi Lớp học</span>
            </button>
          </nav>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-600 font-medium text-center">
                GV: <span className="font-bold text-slate-800">Thầy Nguyễn Đắc Tuấn</span><br/>
                SĐT: <span className="text-blue-600">083 560 6162</span>
              </p>
            </div>
            <PWAInstallButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50">
        {/* Header - Mobile Only */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-semibold text-slate-800 text-lg">
              {activeTab === 'edubot' && 'Tra cứu công thức'}
              {activeTab === 'statistics' && 'Tính toán thống kê'}
              {activeTab === 'worksheets' && 'Tạo Phiếu học tập'}
              {activeTab === 'video' && 'Bài giảng Video'}
              {activeTab === 'tts' && 'Đọc văn bản (TTS)'}
              {activeTab === 'photos' && 'Tạo Ảnh thẻ'}
              {activeTab === 'timetable' && 'Thời khóa biểu'}
              {activeTab === 'games' && 'Trò chơi Lớp học'}
            </span>
          </div>
          {activeTab === 'statistics' && (
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <History className="w-5 h-5" />
            </button>
          )}
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
          
          {activeTab === 'statistics' && (
            <div className="absolute inset-0 overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="hidden lg:flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Công cụ Thống Kê</h2>
                    <p className="text-slate-500 mt-1">Hỗ trợ tính toán đặc trưng mẫu số liệu ghép nhóm</p>
                  </div>
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
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
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 border-dashed text-slate-400 p-8 text-center mt-6 lg:mt-0">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <Calculator className="w-8 h-8 text-blue-300" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 mb-2">Chưa có kết quả</h3>
                        <p className="max-w-sm">Nhập các khoảng dữ liệu và tần số ở cột bên trái, sau đó nhấn "Tính toán" để xem kết quả chi tiết.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

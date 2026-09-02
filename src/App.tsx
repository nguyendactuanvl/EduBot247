/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DataInput } from './components/DataInput';
import { ResultView } from './components/ResultView';
import { HistoryModal } from './components/HistoryModal';
import { Interval, CalculationResult } from './types';
import { calculateStatistics } from './utils/math';
import { History, Calculator } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner shadow-blue-700/50">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                Thống Kê 11 & 12 - Thầy Nguyễn Đắc Tuấn -0835606162
              </h1>
              <p className="text-xs text-slate-500 font-medium">ứng dụng toán thống kê kiểm tra kết quả nhanh chóng</p>
            </div>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            <History className="w-5 h-5" />
            <span className="hidden sm:inline">Lịch sử</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
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
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 border-dashed text-slate-400 p-8 text-center">
                <Calculator className="w-16 h-16 mb-4 text-slate-300" strokeWidth={1} />
                <h3 className="text-lg font-medium text-slate-600 mb-2">Chưa có kết quả</h3>
                <p className="max-w-sm">Nhập các khoảng dữ liệu và tần số ở cột bên trái, sau đó nhấn "Tính toán" để xem kết quả chi tiết.</p>
              </div>
            )}
          </div>
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

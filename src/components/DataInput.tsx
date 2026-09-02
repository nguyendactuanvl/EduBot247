import React, { useState } from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { Interval } from '../types';
import { cn } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface DataInputProps {
  intervals: Interval[];
  onChange: (intervals: Interval[]) => void;
  onCalculate: () => void;
}

export function DataInput({ intervals, onChange, onCalculate }: DataInputProps) {
  const [autoMin, setAutoMin] = useState<number | ''>('');
  const [autoMax, setAutoMax] = useState<number | ''>('');
  const [autoStep, setAutoStep] = useState<number | ''>('');

  const handleAutoGenerate = () => {
    if (autoMin === '' || autoMax === '' || autoStep === '' || autoStep <= 0) {
      alert("Vui lòng nhập GTNN, GTLN và Độ dài nhóm (h > 0) hợp lệ.");
      return;
    }
    if (autoMin >= autoMax) {
      alert("GTNN phải nhỏ hơn GTLN.");
      return;
    }

    const generated: Interval[] = [];
    let current = autoMin;
    // Sử dụng current < autoMax thay vì <= để phù hợp với định dạng [a; b)
    while (current < autoMax) {
      let next = current + autoStep;
      // Khắc phục sai số thập phân của JavaScript (vd: 0.1 + 0.2 = 0.30000000000000004)
      next = Math.round(next * 1000000) / 1000000;

      generated.push({
        id: uuidv4(),
        start: current,
        end: next,
        frequency: ''
      });
      current = next;
    }
    onChange(generated);
  };

  const handleUpdate = (id: string, field: keyof Interval, value: string) => {
    const numValue = value === '' ? '' : Number(value);
    const newIntervals = intervals.map((interval, index) => {
      if (interval.id === id) {
        const updated = { ...interval, [field]: numValue };
        return updated;
      }
      return interval;
    });
    
    // Auto-fill next start if current end changes
    const updatedIndex = newIntervals.findIndex(i => i.id === id);
    if (field === 'end' && updatedIndex < newIntervals.length - 1 && typeof numValue === 'number') {
        newIntervals[updatedIndex + 1].start = numValue;
    }
    
    onChange(newIntervals);
  };

  const addRow = () => {
    const lastInterval = intervals[intervals.length - 1];
    const newStart = lastInterval && typeof lastInterval.end === 'number' ? lastInterval.end : '';
    onChange([
      ...intervals,
      { id: uuidv4(), start: newStart, end: '', frequency: '' },
    ]);
  };

  const removeRow = (id: string) => {
    if (intervals.length === 1) return;
    onChange(intervals.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-800">Tạo nhóm tự động</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">GTNN (Min)</label>
            <input
              type="number"
              className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={autoMin}
              onChange={(e) => setAutoMin(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Vd: 40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">GTLN (Max)</label>
            <input
              type="number"
              className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={autoMax}
              onChange={(e) => setAutoMax(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Vd: 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Độ dài nhóm (h)</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={autoStep}
              onChange={(e) => setAutoStep(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Vd: 10"
            />
          </div>
        </div>
        <button
          onClick={handleAutoGenerate}
          className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors font-medium flex items-center justify-center"
        >
          Tạo bảng nhóm
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Nhập dữ liệu</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 font-medium text-slate-600 w-[60%] sm:w-[55%]">Nhóm [a; b)</th>
                <th className="p-3 font-medium text-slate-600 w-[25%] sm:w-[35%]">Tần số (m)</th>
                <th className="p-3 w-12 sm:w-16"></th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((interval, idx) => (
                <tr key={interval.id} className="border-b border-slate-100 last:border-0 group">
                  <td className="p-3">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="text-slate-400 font-mono text-sm sm:text-base">[</span>
                      <input
                        type="number"
                        className="w-full min-w-[50px] p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-base"
                        value={interval.start === '' ? '' : interval.start}
                        onChange={(e) => handleUpdate(interval.id, 'start', e.target.value)}
                        placeholder="a"
                      />
                      <span className="text-slate-400 text-sm sm:text-base">;</span>
                      <input
                        type="number"
                        className="w-full min-w-[50px] p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-base"
                        value={interval.end === '' ? '' : interval.end}
                        onChange={(e) => handleUpdate(interval.id, 'end', e.target.value)}
                        placeholder="b"
                      />
                      <span className="text-slate-400 font-mono text-sm sm:text-base">)</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      className="w-full min-w-[50px] p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-base"
                      value={interval.frequency === '' ? '' : interval.frequency}
                      onChange={(e) => handleUpdate(interval.id, 'frequency', e.target.value)}
                      placeholder="Tần số"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeRow(interval.id)}
                      disabled={intervals.length === 1}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title="Xóa nhóm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={addRow}
            className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhóm
          </button>
          <button
            onClick={onCalculate}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex-1 shadow-sm"
          >
            Tính toán
          </button>
        </div>
      </div>
    </div>
  );
}

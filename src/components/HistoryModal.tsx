import React from 'react';
import { CalculationResult } from '../types';
import { X, Clock } from 'lucide-react';

interface HistoryModalProps {
  history: CalculationResult[];
  onClose: () => void;
  onSelect: (result: CalculationResult) => void;
  onClear: () => void;
}

export function HistoryModal({ history, onClose, onSelect, onClear }: HistoryModalProps) {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('vi-VN');
  };

  const round = (num: number) => Math.round(num * 100) / 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-800">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Lịch sử tính toán</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Chưa có lịch sử tính toán nào.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-slate-500">{formatDate(item.date)}</span>
                    <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      {item.intervals.length} nhóm
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div><span className="text-slate-500">x̄:</span> <span className="font-medium text-slate-800">{round(item.mean)}</span></div>
                    <div><span className="text-slate-500">s:</span> <span className="font-medium text-slate-800">{round(item.stdDev)}</span></div>
                    <div><span className="text-slate-500">Q₂:</span> <span className="font-medium text-slate-800">{round(item.q2)}</span></div>
                    <div><span className="text-slate-500">∆Q:</span> <span className="font-medium text-slate-800">{round(item.iqr)}</span></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
            <button 
              onClick={onClear}
              className="text-red-600 font-medium hover:text-red-700 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

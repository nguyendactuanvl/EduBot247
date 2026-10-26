import React from 'react';

interface Props {
  onSelect: (tab: string) => void;
}

export const Grade12Hub: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">Lớp 12: Ôn thi THPT</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <button 
          onClick={() => onSelect('grade12-calculus')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left"
        >
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Chương 1: Ứng dụng đạo hàm khảo sát hàm số</h3>
          <p className="text-slate-500 dark:text-slate-400">Các đề thi về tính đơn điệu, cực trị, GTVT, tiệm cận và khảo sát.</p>
        </button>
      </div>
    </div>
  );
};

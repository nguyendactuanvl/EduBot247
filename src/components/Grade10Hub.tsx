import React from 'react';

interface Props {
  onSelect: (tab: any) => void;
}

export const Grade10Hub: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">Lớp 10: Ôn thi THPT</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <button 
          onClick={() => onSelect('triangle-exams')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left"
        >
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Chương 1: Hệ thức lượng trong tam giác</h3>
          <p className="text-slate-500 dark:text-slate-400">Các đề thi và bài tập về hệ thức lượng.</p>
        </button>
        <button 
          onClick={() => onSelect('inequality-exams')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left"
        >
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Chương 2: Bất phương trình & Hệ BPT</h3>
          <p className="text-slate-500 dark:text-slate-400">Các đề thi và bài tập về bất phương trình.</p>
        </button>
        <button 
          onClick={() => onSelect('logic-set-exams')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left"
        >
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Chương 3: Mệnh đề & Tập hợp</h3>
          <p className="text-slate-500 dark:text-slate-400">Các đề thi và bài tập về mệnh đề và tập hợp.</p>
        </button>
      </div>
    </div>
  );
};

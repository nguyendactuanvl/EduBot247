import React from 'react';
import {
  Box,
  Layers,
  ArrowRight,
  Infinity as InfinityIcon,
  Ruler,
  Dices,
  TrendingUp,
} from 'lucide-react';
import { MathView } from './MathView';

export type Grade11TabTarget =
  | 'grade11-trig'
  | 'grade11-parallel'
  | 'grade11-limits'
  | 'grade11-perp'
  | 'grade11-prob'
  | 'grade11-deriv';

interface Props {
  onSelect: (tab: Grade11TabTarget) => void;
}

export const Grade11Hub: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
          Chương trình GDPT 2018 · Kết nối tri thức với cuộc sống
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Lớp 11: Ôn thi THPT Online
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('grade11-trig')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Chương I: Hàm số lượng giác &amp; PT lượng giác
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Góc lượng giác, công thức lượng giác, hàm số{' '}
              <MathView content="$y = \sin x, \cos x, \tan x, \cot x$" inline /> và phương trình lượng giác cơ bản.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>5 Bộ đề thi Online · Chấm điểm tự động</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade11-parallel')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Box className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                20 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Chương IV: Quan hệ song song trong không gian
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Giao tuyến, <MathView content="$a \parallel b, d \parallel (P), (P) \parallel (Q)$" inline /> và phép chiếu song song gồm{' '}
              <strong>5 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Phân hệ 1 (Bài 10–14) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade11-limits')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-sky-200 dark:border-sky-800/80 hover:border-sky-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <InfinityIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-600 text-white">
                18 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Chương V: Giới hạn. Hàm số liên tục
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Giới hạn dãy số <MathView content="$\lim_{n\to+\infty} u_n$" inline />, giới hạn hàm số{' '}
              <MathView content="$\lim_{x\to x_0} f(x)$" inline /> và tính liên tục gồm{' '}
              <strong>3 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
            <span>Phân hệ 1 (Bài 15–17) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade11-perp')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Ruler className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                21 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Chương VII: Quan hệ vuông góc trong không gian
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Vuông góc <MathView content="$d \perp (P)$" inline />, góc nhị diện{' '}
              <MathView content="$[P, d, Q]$" inline />, khoảng cách và thể tích{' '}
              <MathView content="$V=\frac{1}{3}Bh$" inline /> với <strong>6 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Phân hệ 1 (Bài 22–27) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade11-prob')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Dices className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                18 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Chương VIII: Các quy tắc tính xác suất
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Biến cố hợp <MathView content="$A\cup B$" inline />, giao <MathView content="$A\cap B$" inline />, công thức cộng &amp; nhân độc lập gồm{' '}
              <strong>3 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Phân hệ 1 (Bài 28–30) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade11-deriv')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800/80 hover:border-purple-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-600 text-white">
                18 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Chương IX: Đạo hàm
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Quy tắc tính đạo hàm, tiếp tuyến, đạo hàm cấp hai <MathView content="$y''$" inline />, vận tốc{' '}
              <MathView content="$v(t)=s'(t)$" inline /> &amp; gia tốc <MathView content="$a(t)=s''(t)$" inline /> với{' '}
              <strong>3 đề theo bài</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>Phân hệ 1 (Bài 31–33) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};

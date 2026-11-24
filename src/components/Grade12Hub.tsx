import React from 'react';
import {
  Compass,
  Layers,
  ArrowRight,
  Sigma,
  Globe2,
  GitBranch,
} from 'lucide-react';
import { MathView } from './MathView';

export type Grade12TabTarget =
  | 'grade12-calculus'
  | 'grade12-vectors'
  | 'grade12-integrals'
  | 'grade12-oxyz'
  | 'grade12-condprob';

interface Props {
  onSelect: (tab: Grade12TabTarget) => void;
}

export const Grade12Hub: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
          Chương trình GDPT 2018 · Kết nối tri thức với cuộc sống
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Lớp 12: Ôn thi THPT Online
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('grade12-calculus')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Chương I: Ứng dụng đạo hàm khảo sát hàm số
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Các đề thi về tính đơn điệu, cực trị, giá trị lớn nhất – nhỏ nhất, đường tiệm cận và khảo sát hàm số.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>5 Bộ đề 90 phút</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade12-vectors')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                18 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Chương II: Vectơ trong không gian (Toán 12)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Vectơ và hệ trục tọa độ <MathView content="$Oxyz$" inline /> gồm{' '}
              <strong>3 đề theo bài (45p)</strong> (Bài 6–8) &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Phân hệ 1 (3 đề) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade12-integrals')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sigma className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                18 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Chương IV: Nguyên hàm, tích phân và ứng dụng
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Nguyên hàm <MathView content="$\int f(x)\,\mathrm{d}x$" inline />, tích phân{' '}
              <MathView content="$\int_a^b f(x)\,\mathrm{d}x$" inline /> và diện tích – thể tích tròn xoay gồm{' '}
              <strong>3 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Phân hệ 1 (Bài 11–13) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade12-oxyz')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-sky-200 dark:border-sky-800/80 hover:border-sky-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-600 text-white">
                19 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Chương V: Phương pháp tọa độ trong không gian
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Mặt phẳng, đường thẳng, góc và mặt cầu <MathView content="$Oxyz$" inline /> gắn radar, đường bay &amp; vệ tinh với{' '}
              <strong>4 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
            <span>Phân hệ 1 (Bài 14–17) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade12-condprob')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800/80 hover:border-purple-500 transition-all text-left flex flex-col justify-between cursor-pointer md:col-span-2"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-600 text-white">
                17 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Chương VI: Xác suất có điều kiện &amp; Công thức Bayes
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Xác suất có điều kiện <MathView content="$P(A|B)$" inline />, xác suất toàn phần và công thức Bayes{' '}
              <MathView content="$P(B|A)=\frac{P(B)\cdot P(A|B)}{P(A)}$" inline /> tích hợp xét nghiệm y khoa, phế phẩm và dự báo thời tiết gồm{' '}
              <strong>2 đề theo bài (Bài 18–19)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>Phân hệ 1 (Bài 18–19) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};

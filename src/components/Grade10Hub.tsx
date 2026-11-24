import React from 'react';
import {
  Triangle,
  Scale,
  Network,
  Compass,
  BarChart3,
  Dices,
  ArrowRight,
} from 'lucide-react';
import { MathView } from './MathView';

interface Props {
  onSelect: (tab: any) => void;
}

export const Grade10Hub: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold mb-2">
          Chương trình GDPT 2018 · Kết nối tri thức với cuộc sống
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Lớp 10: Ôn thi THPT Online
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('triangle-exams')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Triangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Chương I &amp; III: Hệ thức lượng trong tam giác
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Các đề thi về giá trị lượng giác, định lí Côsin, định lí Sin và tính diện tích tam giác.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>5 Bộ đề 90 phút</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('inequality-exams')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Chương II: Bất phương trình &amp; Hệ BPT bậc nhất hai ẩn
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Miền nghiệm bất phương trình, hệ bất phương trình và bài toán quy hoạch tuyến tính thực tế.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Bộ đề kiểm tra &amp; Chấm điểm tự động</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('logic-set-exams')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Chương I: Mệnh đề &amp; Tập hợp
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Mệnh đề kéo theo, mệnh đề chứa lượng từ và các phép toán giao, hợp, hiệu trên tập hợp.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Bộ đề luyện tập Online</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade10-vectors')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                5 Bài + Tổng ôn 30 câu
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Chương IV: Vectơ (KNTT)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Luyện tập theo từng bài (Bài 7 – Bài 11) và Tổng ôn 30 câu theo cấu trúc 3 phần Bộ GD&amp;ĐT.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Kết nối biểu đồ tiến độ cá nhân</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade10-stats')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                18 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Chương V: Thống kê mẫu số liệu không ghép nhóm
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Số gần đúng, trung bình <MathView content="$\overline{x}$" inline />, tứ phân vị{' '}
              <MathView content="$Q_1, Q_2, Q_3$" inline />, phương sai{' '}
              <MathView content="$s^2$" inline /> và độ lệch chuẩn <MathView content="$s$" inline />{' '}
              với <strong>3 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Phân hệ 1 (Bài 12–14) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('grade10-combprob')}
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Dices className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                20 Đề · Chuẩn Bộ GD&amp;ĐT
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Chương VIII &amp; IX: Đại số tổ hợp &amp; Xác suất cổ điển
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Quy tắc đếm, <MathView content="$P_n, A_n^k, C_n^k$" inline />, Nhị thức Newton{' '}
              <MathView content="$(a+b)^n$" inline /> và xác suất{' '}
              <MathView content="$P(A)=\frac{n(A)}{n(\Omega)}$" inline /> gồm{' '}
              <strong>5 đề theo bài (45p)</strong> &amp; <strong>15 đề 90p</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Phân hệ 1 (Bài 23–27) · Phân hệ 2 (15 đề)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};

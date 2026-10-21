import React from 'react';
import { ExternalLink, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { ADMOB_CONFIG } from '../config/admob';

interface AdMobNativeCardProps {
  onLearnMore?: () => void;
}

export function AdMobNativeCard({ onLearnMore }: AdMobNativeCardProps) {
  const nativeUnit = ADMOB_CONFIG.adUnits.find(u => u.key === 'ADS_1_NATIVE') || ADMOB_CONFIG.adUnits[0];

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-800/80 dark:to-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
      {/* Ad Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wider">
            Tài trợ (AdMob Native)
          </span>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
            {nativeUnit.name}: {nativeUnit.unitId}
          </span>
        </div>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Đối tác giáo dục
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div className="sm:col-span-3 space-y-2">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Cẩm nang Ôn thi Tốt nghiệp THPT & Đánh giá năng lực 2026
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Hệ thống ngân hàng đề thi bám sát cấu trúc mới nhất của Bộ GD&ĐT: Trắc nghiệm nhiều lựa chọn, Trắc nghiệm Đúng/Sai, Trắc nghiệm trả lời ngắn. Đã tích hợp giải chi tiết từng bước.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Chuẩn SGK Kết Nối Tri Thức
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Bấm máy Casio fx-580 & fx-880
            </span>
          </div>
        </div>

        <div className="sm:col-span-1 flex flex-col justify-center items-stretch sm:items-end">
          <button
            onClick={onLearnMore}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Trải nghiệm</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-center sm:text-right text-slate-400 dark:text-slate-500 mt-1">
            Google AdMob Ads 1
          </span>
        </div>
      </div>
    </div>
  );
}

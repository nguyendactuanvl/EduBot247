import React, { useState } from 'react';
import { ExternalLink, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';
import { ADMOB_CONFIG } from '../config/admob';

interface AdMobBannerProps {
  onOpenAdManager?: () => void;
}

export function AdMobBanner({ onOpenAdManager }: AdMobBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const bannerUnit = ADMOB_CONFIG.adUnits.find(u => u.key === 'ADS_3_BANNER') || ADMOB_CONFIG.adUnits[2];

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-2 right-4 z-40 bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1 shadow-md text-xs font-medium flex items-center gap-1.5 transition-all"
        title="Hiển thị lại thanh tài trợ"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>AdMob Ads 3</span>
      </button>
    );
  }

  return (
    <div className="w-full bg-slate-100/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 shrink-0 z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-1.5">
        <div className="flex items-center justify-between gap-3">
          {/* Header Tag */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
              Quảng cáo Google AdMob
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline font-mono">
              {bannerUnit.unitId}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {import.meta.env.DEV && onOpenAdManager && (
              <button
                onClick={onOpenAdManager}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 px-2 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-medium"
              >
                <span>Cấu hình 6 mã</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              title={isMinimized ? "Mở rộng" : "Thu gọn"}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-slate-400 hover:text-rose-500 rounded"
              title="Đóng thanh quảng cáo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner Content Container */}
        {!isMinimized && (
          <div className="mt-1.5 min-h-[50px] max-h-[70px] bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 p-2 flex items-center justify-between overflow-hidden shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                    EduBot 247 Pro - Luyện thi Đại học & THPT Quốc Gia
                  </span>
                  <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-1 rounded">
                    GDPT 2018
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  Đồng hành cùng học sinh lớp 1 đến 12 chinh phục điểm 9+ Toán, Lý, Hóa, Sinh, Anh với ngân hàng 10.000+ câu hỏi chuẩn SGK mới.
                </p>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              <button 
                onClick={onOpenAdManager}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg shadow-sm transition-transform active:scale-95"
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

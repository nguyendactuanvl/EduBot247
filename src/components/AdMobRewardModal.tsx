import React, { useState, useEffect } from 'react';
import { Play, Award, CheckCircle2, Clock, X, Sparkles, AlertCircle } from 'lucide-react';
import { ADMOB_CONFIG, AdUnitConfig } from '../config/admob';

interface AdMobRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  adUnitKey?: 'REWARD_PHAN_THUONG' | 'ADS_4_REWARDED_INTERSTITIAL' | 'ADS_4_INTERSTITIAL' | 'ADS_2_APP_OPEN';
  rewardTitle?: string;
  onRewardEarned?: (rewardType: string) => void;
}

export function AdMobRewardModal({
  isOpen,
  onClose,
  adUnitKey = 'REWARD_PHAN_THUONG',
  rewardTitle = 'Nhận thêm 5 lượt hỏi Gia sư AI EduBot & Mở khóa đề thi VIP',
  onRewardEarned
}: AdMobRewardModalProps) {
  const adUnit: AdUnitConfig = ADMOB_CONFIG.adUnits.find(u => u.key === adUnitKey) || ADMOB_CONFIG.adUnits[5];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying && secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && secondsRemaining === 0) {
      setIsCompleted(true);
      setIsPlaying(false);
      if (onRewardEarned) {
        onRewardEarned(adUnitKey);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, secondsRemaining, adUnitKey, onRewardEarned]);

  if (!isOpen) return null;

  const handleStartWatch = () => {
    setIsPlaying(true);
    setSecondsRemaining(5);
    setIsCompleted(false);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setIsCompleted(false);
    setSecondsRemaining(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                {adUnit.formatNameVi}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Unit ID: {adUnit.unitId}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isPlaying && !isCompleted && (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {rewardTitle}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Quảng cáo được phục vụ bởi Google AdMob network ({adUnit.name}). Hoàn tất lượt xem để nhận ngay phần thưởng hỗ trợ học tập!
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-left space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn vị:</span>
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{adUnit.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ID đơn vị quảng cáo:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{adUnit.unitId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Google App ID:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{ADMOB_CONFIG.appId}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Để sau
                </button>
                <button
                  onClick={handleStartWatch}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Xem quảng cáo nhận quà</span>
                </button>
              </div>
            </div>
          )}

          {isPlaying && (
            <div className="text-center py-6 space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-indigo-950 flex items-center justify-center">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {secondsRemaining}s
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Đang phát quảng cáo {adUnit.name}...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Vui lòng không đóng cửa sổ trong {secondsRemaining} giây để hệ thống AdMob ghi nhận phần thưởng.
                </p>
              </div>

              {/* Simulated Ad Container */}
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-4 rounded-2xl shadow-inner text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-[10px] text-indigo-300 uppercase font-semibold">
                  <span>Google Mobile Ads Simulation</span>
                  <span>Unit: {adUnit.unitId}</span>
                </div>
                <p className="font-semibold text-sm text-indigo-100">
                  EduBot 247: Đồng hành ôn thi vào 10 và Tốt nghiệp THPT 2026
                </p>
                <p className="text-[11px] text-indigo-200">
                  Chương trình GDPT 2018 - Giải chi tiết từng bước, bấm máy Casio siêu tốc.
                </p>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Chúc mừng! Bạn đã nhận thưởng thành công 🎉
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Phần thưởng đã được cộng vào tài khoản học tập của bạn.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                Tiếp tục học tập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

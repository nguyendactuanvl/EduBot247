import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  Lock, 
  CopyX, 
  Clock, 
  EyeOff, 
  CheckCircle2, 
  X,
  ShieldCheck
} from 'lucide-react';

interface AntiCheatGuardProps {
  isActive: boolean;
  onAutoSubmit: () => void;
  maxWarnings?: number;
  examTitle?: string;
  enableFullscreenRequirement?: boolean;
}

export interface ViolationLog {
  id: string;
  timestamp: string;
  reason: string;
}

export function AntiCheatGuard({
  isActive,
  onAutoSubmit,
  maxWarnings = 3,
  examTitle = 'Bài Thi Online',
  enableFullscreenRequirement = false
}: AntiCheatGuardProps) {
  const [warningCount, setWarningCount] = useState<number>(0);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [currentReason, setCurrentReason] = useState<string>('');
  const [logs, setLogs] = useState<ViolationLog[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>('');
  
  const isBlurHandlingRef = useRef<boolean>(false);
  const hasAutoSubmittedRef = useRef<boolean>(false);

  // Trigger toast message
  const triggerToast = (msg: string) => {
    setToastText(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Reset counters on new test start
  useEffect(() => {
    if (isActive) {
      setWarningCount(0);
      setLogs([]);
      setShowWarningModal(false);
      isBlurHandlingRef.current = false;
      hasAutoSubmittedRef.current = false;
    }
  }, [isActive]);

  // Fullscreen toggle helper
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // Record a cheating violation
  const recordViolation = (reason: string) => {
    if (!isActive || hasAutoSubmittedRef.current) return;
    
    // Prevent duplicated rapid triggers within 1.2s
    if (isBlurHandlingRef.current) return;
    isBlurHandlingRef.current = true;
    setTimeout(() => {
      isBlurHandlingRef.current = false;
    }, 1200);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: ViolationLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      reason
    };

    setLogs(prev => [newLog, ...prev]);
    setCurrentReason(reason);

    setWarningCount(prev => {
      const nextCount = prev + 1;
      setShowWarningModal(true);

      if (nextCount >= maxWarnings && !hasAutoSubmittedRef.current) {
        hasAutoSubmittedRef.current = true;
        setTimeout(() => {
          onAutoSubmit();
        }, 1500);
      }
      return nextCount;
    });
  };

  // 1. Tab visibility change & Window Blur Event Listener
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('Chuyển sang Tab khác hoặc ẩn ứng dụng');
      }
    };

    const handleWindowBlur = () => {
      setTimeout(() => {
        if (document.hidden || !document.hasFocus()) {
          recordViolation('Rời khỏi cửa sổ thi / Mở ứng dụng khác');
        }
      }, 150);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isActive, maxWarnings]);

  // 2. Fullscreen change listener
  useEffect(() => {
    if (!isActive) return;

    const handleFullscreenChange = () => {
      const inFS = !!document.fullscreenElement;
      setIsFullscreen(inFS);
      if (!inFS && enableFullscreenRequirement) {
        recordViolation('Thoát khỏi chế độ Toàn màn hình (Fullscreen)');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isActive, enableFullscreenRequirement]);

  // 3. BeforeUnload Listener (prevent closing or reloading browser)
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Bài thi đang diễn ra. Tất cả tiến trình làm bài sẽ bị mất nếu bạn rời đi!';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive]);

  // 4. Block Copy, Paste, Context Menu during active test
  useEffect(() => {
    if (!isActive) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerToast('⚠️ Không thể sao chép câu hỏi trong phòng thi bảo mật!');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerToast('⚠️ Không thể dán văn bản trong phòng thi bảo mật!');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerToast('⚠️ Chuột phải bị vô hiệu hóa trong khi thi!');
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Anti-Cheat Active Floating Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 text-white px-4 py-2 border-b border-rose-500/50 shadow-md backdrop-blur-md flex flex-wrap items-center justify-between text-xs sm:text-sm font-sans animate-fade-in">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <div className="flex items-center space-x-1.5 font-bold text-rose-300">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Giám sát Chống gian lận V2.0:</span>
            <span className="text-white font-medium truncate max-w-[180px] sm:max-w-none">{examTitle}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          {/* Violation Badge Counter */}
          <div className={`px-2.5 py-1 rounded-lg border font-mono font-bold flex items-center space-x-1.5 transition-colors ${
            warningCount === 0 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' 
              : warningCount === 1 
                ? 'bg-amber-950/80 text-amber-300 border-amber-700/60' 
                : 'bg-rose-950/80 text-rose-300 border-rose-700/60 animate-pulse'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Vi phạm: {warningCount}/{maxWarnings}</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center space-x-1 text-xs font-semibold transition-colors cursor-pointer"
            title={isFullscreen ? 'Thoát Toàn màn hình' : 'Bật Chế độ Toàn màn hình'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden md:inline">Thoát Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Toàn màn hình</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Copy / Paste Toast Notice */}
      {showToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-amber-300 border border-amber-500/50 px-4 py-2 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-bounce">
          <CopyX className="w-4 h-4 text-amber-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Warning Modal when violation occurs */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-white relative">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-rose-500 animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-rose-400 tracking-tight leading-tight uppercase">
                  Cảnh Báo Vi Phạm Quy Chế Thi Online!
                </h3>
                <p className="text-xs text-slate-400 mt-1">Phòng thi bảo mật EduBot 247</p>
              </div>
            </div>

            <div className="p-4 bg-rose-950/50 border border-rose-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-rose-300 font-bold border-b border-rose-900/60 pb-2">
                <span>Số lần vi phạm:</span>
                <span className="text-sm text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-md border border-rose-800">
                  {warningCount} / {maxWarnings} LẦN
                </span>
              </div>
              <div className="text-xs text-slate-200 space-y-1 pt-1">
                <p className="font-semibold text-rose-200">Lý do phát hiện:</p>
                <p className="text-slate-300 italic font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  "{currentReason}"
                </p>
              </div>
            </div>

            {warningCount >= maxWarnings ? (
              <div className="p-3.5 bg-rose-600 text-white rounded-xl text-xs font-bold text-center space-y-1 animate-pulse">
                <p className="text-sm font-black uppercase">⚠️ Bạn đã vi phạm quy chế thi quá {maxWarnings} lần!</p>
                <p className="text-rose-100">Hệ thống đang tự động khóa bài làm và nộp kết quả thi ngay lập tức...</p>
              </div>
            ) : (
              <div className="text-xs text-slate-300 space-y-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Lưu ý quan trọng:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                  <li>Không chuyển tab, ẩn trình duyệt hoặc mở ứng dụng khác trong khi thi.</li>
                  <li>Nếu vi phạm đủ <strong>{maxWarnings} lần</strong>, bài thi sẽ bị dừng và <strong>tự động nộp</strong>!</li>
                  <li>Mọi thao tác rời màn hình đều được ghi nhật ký hệ thống.</li>
                </ul>
              </div>
            )}

            {/* Violation History snippet */}
            {logs.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nhật ký vi phạm ({logs.length}):</p>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
                  {logs.map(log => (
                    <div key={log.id} className="p-1.5 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between text-slate-400">
                      <span className="text-rose-400 font-bold">{log.timestamp}</span>
                      <span className="truncate max-w-[260px] text-slate-300">{log.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {warningCount < maxWarnings && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowWarningModal(false)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  Tôi đã hiểu, Quay lại làm bài thi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

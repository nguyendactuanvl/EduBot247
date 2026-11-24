import React, { useState, useEffect, useCallback } from 'react';
import {
  Key,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUp,
  ShieldAlert,
  Zap,
  Clock,
} from 'lucide-react';
import {
  addApiKeysFromText,
  API_KEYS_UPDATED_EVENT,
  ApiKeyEntry,
  clearAllApiKeys,
  loadApiKeyPool,
  maskApiKey,
  moveApiKeyToTop,
  removeApiKeyById,
  resetAllApiKeyStatuses,
  testSingleGeminiKey,
} from '../services/geminiDirectClient';

interface ApiKeyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyManagerModal: React.FC<ApiKeyManagerModalProps> = ({ isOpen, onClose }) => {
  const [pool, setPool] = useState<ApiKeyEntry[]>(() => loadApiKeyPool());
  const [rawInput, setRawInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [, setTick] = useState(0);

  const syncPool = useCallback(() => {
    setPool(loadApiKeyPool());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    syncPool();
    setFeedback(null);
    setConfirmClearAll(false);

    const handleUpdate = () => syncPool();
    window.addEventListener(API_KEYS_UPDATED_EVENT, handleUpdate);

    // Refresh cooldown countdown every second while modal is open
    const timer = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      window.removeEventListener(API_KEYS_UPDATED_EVENT, handleUpdate);
      window.clearInterval(timer);
    };
  }, [isOpen, syncPool]);

  if (!isOpen) return null;

  const handleAddKeys = () => {
    if (!rawInput.trim()) {
      setFeedback({ type: 'error', text: 'Vui lòng dán ít nhất 1 Gemini API Key vào ô phía trên.' });
      return;
    }

    const { addedCount, duplicateCount, pool: nextPool } = addApiKeysFromText(rawInput);
    setPool(nextPool);

    if (addedCount > 0) {
      setRawInput('');
      setFeedback({
        type: 'success',
        text:
          duplicateCount > 0
            ? `Đã thêm ${addedCount} API Key mới vào danh sách xoay vòng (bỏ qua ${duplicateCount} key trùng lặp).`
            : `Đã thêm ${addedCount} API Key mới vào danh sách xoay vòng trực tiếp!`,
      });
    } else if (duplicateCount > 0) {
      setFeedback({ type: 'info', text: 'Tất cả API Key vừa nhập đã tồn tại trong danh sách.' });
    } else {
      setFeedback({ type: 'error', text: 'Không nhận diện được API Key hợp lệ nào.' });
    }
  };

  const handleTestKey = async (id: string) => {
    setTestingId(id);
    setFeedback(null);
    const res = await testSingleGeminiKey(id);
    syncPool();
    setTestingId(null);
    setFeedback({
      type: res.ok ? 'success' : 'error',
      text: res.message,
    });
  };

  const handleTestAll = async () => {
    if (pool.length === 0 || isTestingAll) return;
    setIsTestingAll(true);
    setFeedback(null);
    let okCount = 0;
    for (const entry of pool) {
      setTestingId(entry.id);
      const res = await testSingleGeminiKey(entry.id);
      if (res.ok) okCount += 1;
      syncPool();
    }
    setTestingId(null);
    setIsTestingAll(false);
    setFeedback({
      type: okCount > 0 ? 'success' : 'error',
      text: `Đã kiểm tra ${pool.length} API Key trực tiếp tới Gemini: ${okCount}/${pool.length} key sẵn sàng.`,
    });
  };

  const readyCount = pool.filter((k) => {
    if (k.status === 'ready') return true;
    if (k.status === 'cooldown' && (!k.cooldownUntil || k.cooldownUntil <= Date.now())) return true;
    return false;
  }).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90dvh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Cài đặt Gemini API Key (Xoay vòng dự phòng)
              </h3>
              <p className="text-xs text-indigo-100 mt-0.5">
                Hệ thống có sẵn khóa mặc định · Hỗ trợ thêm nhiều key cá nhân để tự động xoay vòng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Mode & Usage Notice */}
          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <strong>AI đã sẵn sàng sử dụng ngay:</strong> EduBot kết nối ổn định qua máy chủ tích hợp.
              Bạn có thể tùy chọn thêm 1 hoặc nhiều Gemini API Key cá nhân bên dưới để tự động xoay vòng
              ưu tiên khi muốn tăng hạn mức sử dụng; nếu key cá nhân gặp giới hạn (429), hệ thống sẽ tự
              chuyển sang key kế tiếp hoặc khóa mặc định của ứng dụng.
            </div>
          </div>

          {/* Add Multi-Key Input */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="gemini-multi-key-input"
                className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Thêm 1 hoặc nhiều Gemini API Key (Mỗi dòng 1 key)
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Hỗ trợ xoay vòng tự động khi gặp 429 / Quota
              </span>
            </div>
            <textarea
              id="gemini-multi-key-input"
              rows={3}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder={`Dán 1 hoặc nhiều API Key (mỗi dòng 1 key hoặc cách nhau bằng dấu phẩy):\nAIzaSy...\nKey phụ: AIzaSy...`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-y"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Khi 1 key hết hạn mức (429), hệ thống tự động đánh dấu tạm nghỉ 60 giây và chuyển
                ngay sang key kế tiếp.
              </p>
              <button
                type="button"
                onClick={handleAddKeys}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Thêm vào danh sách xoay vòng
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : feedback.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Key Pool List */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Danh sách API Key đang xoay vòng ({pool.length})
                </h4>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    readyCount > 0
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {readyCount} sẵn sàng
                </span>
              </div>

              {pool.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={isTestingAll}
                    onClick={handleTestAll}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isTestingAll ? 'animate-pulse' : ''}`} />
                    Test tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPool(resetAllApiKeyStatuses());
                      setFeedback({ type: 'info', text: 'Đã đặt lại toàn bộ API Key về trạng thái Sẵn sàng.' });
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Khôi phục
                  </button>
                  {!confirmClearAll ? (
                    <button
                      type="button"
                      onClick={() => setConfirmClearAll(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold cursor-pointer"
                    >
                      Xóa hết
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        clearAllApiKeys();
                        setPool([]);
                        setConfirmClearAll(false);
                        setFeedback({ type: 'info', text: 'Đã xóa toàn bộ API Key khỏi trình duyệt.' });
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Xác nhận xóa
                    </button>
                  )}
                </div>
              )}
            </div>

            {pool.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-1.5 bg-slate-50/60 dark:bg-slate-800/30">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Chưa có API Key nào trong danh sách xoay vòng
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhập ít nhất 1 Gemini API Key ở ô phía trên để tạo đề thi và tra cứu AI trực tiếp
                  từ trình duyệt.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pool.map((entry, idx) => {
                  const now = Date.now();
                  const remainingSec =
                    entry.status === 'cooldown' && entry.cooldownUntil
                      ? Math.max(0, Math.ceil((entry.cooldownUntil - now) / 1000))
                      : 0;
                  const effectiveStatus =
                    entry.status === 'cooldown' && remainingSec <= 0 ? 'ready' : entry.status;
                  const isRevealed = Boolean(revealedIds[entry.id]);

                  return (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {idx === 0 ? `★ ${entry.label}` : entry.label}
                          </span>
                          {effectiveStatus === 'ready' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Sẵn sàng
                            </span>
                          )}
                          {effectiveStatus === 'cooldown' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono">
                              <Clock className="w-3 h-3" /> Tạm nghỉ ({remainingSec}s)
                            </span>
                          )}
                          {effectiveStatus === 'invalid' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                              <AlertTriangle className="w-3 h-3" /> Không hợp lệ
                            </span>
                          )}
                          {entry.successCount > 0 && (
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              Thành công: {entry.successCount} lượt
                            </span>
                          )}
                        </div>

                        <div className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all">
                          {isRevealed ? entry.key : maskApiKey(entry.key)}
                        </div>

                        {entry.lastError && (
                          <div className="text-[11px] text-rose-600 dark:text-rose-400">
                            {entry.lastError}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedIds((prev) => ({ ...prev, [entry.id]: !prev[entry.id] }))
                          }
                          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                          title={isRevealed ? 'Ẩn key' : 'Hiện key'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => setPool(moveApiKeyToTop(entry.id))}
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 cursor-pointer"
                            title="Ưu tiên dùng trước"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={testingId === entry.id || isTestingAll}
                          onClick={() => handleTestKey(entry.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Kiểm tra kết nối trực tiếp tới Gemini"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${testingId === entry.id ? 'animate-spin' : ''}`}
                          />
                          Test
                        </button>
                        <button
                          type="button"
                          onClick={() => setPool(removeApiKeyById(entry.id))}
                          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Xóa key này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Lấy key miễn phí tại{' '}
            <strong className="text-indigo-600 dark:text-indigo-400">aistudio.google.com/apikey</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};

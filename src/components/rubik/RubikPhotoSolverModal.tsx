import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
  AlertTriangle,
  CheckCircle2,
  Hand,
  SwitchCamera,
  Loader2,
  ImagePlus,
  ExternalLink,
  Smartphone,
  Key,
} from 'lucide-react';
import {
  NoApiKeyConfiguredError,
  openApiKeyManagerModal,
  RubikPhotoSolution,
  solveRubikFromPhotos,
} from '../../services/geminiDirectClient';
import { MOVE_SPECS, MoveNotation } from './rubikEngine';

interface RubikPhotoSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply3dMoves: (moves: string[], label: string) => void;
}

type CaptureMode = 'quick' | 'six_faces';

interface CapturedPhoto {
  id: string;
  label: string;
  slotKey?: string;
  dataUrl: string;
}

const SIX_FACE_SLOTS = [
  { key: 'U', label: 'Mặt Trên (U)', hint: 'Tâm Trắng hoặc Vàng ở trên' },
  { key: 'F', label: 'Mặt Trước (F)', hint: 'Mặt hướng thẳng vào bạn' },
  { key: 'R', label: 'Mặt Phải (R)', hint: 'Xoay cả khối sang trái 90°' },
  { key: 'B', label: 'Mặt Sau (B)', hint: 'Xoay tiếp sang trái 90°' },
  { key: 'L', label: 'Mặt Trái (L)', hint: 'Xoay tiếp sang trái 90°' },
  { key: 'D', label: 'Mặt Đáy (D)', hint: 'Ngửa mặt đáy lên hướng camera' },
];

const CUBE_TYPE_OPTIONS = [
  'Tự động nhận diện từ ảnh',
  'Rubik 3×3×3',
  'Rubik 2×2×2',
  'Rubik 4×4×4',
  'Pyraminx',
  'Skewb',
];

const STICKER_COLOR_CLASS: Record<string, { bg: string; title: string }> = {
  W: { bg: 'bg-slate-50 border-slate-300 text-slate-700', title: 'Trắng' },
  Y: { bg: 'bg-yellow-400 border-yellow-500 text-yellow-950', title: 'Vàng' },
  R: { bg: 'bg-red-600 border-red-700 text-white', title: 'Đỏ' },
  O: { bg: 'bg-orange-500 border-orange-600 text-white', title: 'Cam' },
  G: { bg: 'bg-emerald-600 border-emerald-700 text-white', title: 'Xanh lá' },
  B: { bg: 'bg-blue-600 border-blue-700 text-white', title: 'Xanh dương' },
};

function resizeImageFileToDataUrl(file: File, maxDim = 960): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được tệp ảnh.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Định dạng ảnh không hợp lệ.'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result || ''));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

function describeMoveToken(token: string): string {
  const clean = token.trim().replace(/[’`]/g, "'");
  const isDouble = clean.endsWith('2');
  const base = (isDouble ? clean.slice(0, -1) : clean) as MoveNotation;
  const spec = MOVE_SPECS[base];
  if (spec) {
    return isDouble
      ? `${spec.shortDescVi.replace(/90°/g, '180°')} (xoay 2 lần)`
      : spec.shortDescVi;
  }
  return `Thực hiện thao tác ${clean}`;
}

export const RubikPhotoSolverModal: React.FC<RubikPhotoSolverModalProps> = ({
  isOpen,
  onClose,
  onApply3dMoves,
}) => {
  const [captureMode, setCaptureMode] = useState<CaptureMode>('quick');
  const [cubeTypeHint, setCubeTypeHint] = useState<string>(CUBE_TYPE_OPTIONS[0]);
  const [activeSlotKey, setActiveSlotKey] = useState<string>('U');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);

  // Live camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<{
    title: string;
    detail: string;
    isIframeBlocked?: boolean;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  const isInIframe = useMemo(() => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
  }, []);

  // Analysis state
  const [isSolving, setIsSolving] = useState(false);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [solution, setSolution] = useState<RubikPhotoSolution | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Reliably attach MediaStream once <video> has mounted in the DOM
  useEffect(() => {
    if (!cameraActive || !streamRef.current || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = streamRef.current;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Ignore autoplay interruption; user interaction or onLoadedMetadata will resume
      });
    }
  }, [cameraActive]);

  const startCamera = useCallback(
    async (mode: 'environment' | 'user' = facingMode) => {
      setCameraError(null);
      setSolveError(null);
      stopCamera();

      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setCameraError({
          title: 'Trang hiện tại chưa chạy trên kết nối bảo mật HTTPS.',
          detail: 'Trình duyệt chỉ cho phép mở Camera trên HTTPS hoặc localhost. Bạn hãy dùng nút "Tải ảnh từ máy".',
        });
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError({
          title: 'Trình duyệt hiện tại không hỗ trợ mở Camera trực tiếp.',
          detail: 'Bạn hãy chọn "Chụp bằng Camera máy" hoặc "Tải ảnh từ máy" để gửi ảnh Rubik lên giải ngay.',
        });
        return;
      }

      // Detect iframe Permissions-Policy restriction before requesting camera
      const policyBlocked = (() => {
        try {
          const docAny = document as any;
          if (docAny.permissionsPolicy && typeof docAny.permissionsPolicy.allowsFeature === 'function') {
            return docAny.permissionsPolicy.allowsFeature('camera') === false;
          }
          if (docAny.featurePolicy && typeof docAny.featurePolicy.allowsFeature === 'function') {
            return docAny.featurePolicy.allowsFeature('camera') === false;
          }
        } catch {
          // Ignore unsupported policy API
        }
        return false;
      })();

      setIsStartingCamera(true);
      try {
        const constraintChain: MediaStreamConstraints[] = [
          {
            video: {
              facingMode: { ideal: mode },
              width: { ideal: 1280 },
              height: { ideal: 960 },
            },
            audio: false,
          },
          {
            video: { facingMode: mode },
            audio: false,
          },
          {
            video: true,
            audio: false,
          },
        ];

        let stream: MediaStream | null = null;
        let lastErr: any = null;

        for (let idx = 0; idx < constraintChain.length; idx++) {
          try {
            stream = await navigator.mediaDevices.getUserMedia(constraintChain[idx]);
            break;
          } catch (err: any) {
            lastErr = err;
            const errName = String(err?.name || '');
            // On explicit permission/policy denial or hardware busy, don't retry extra constraints
            if (
              errName === 'NotAllowedError' ||
              errName === 'PermissionDeniedError' ||
              errName === 'SecurityError' ||
              errName === 'NotReadableError' ||
              errName === 'TrackStartError'
            ) {
              break;
            }
          }
        }

        if (!stream) {
          throw lastErr || new Error('Không thể khởi tạo luồng hình ảnh từ Camera.');
        }

        streamRef.current = stream;
        setCameraActive(true);
      } catch (err: any) {
        const errName = String(err?.name || '');
        const errMsg = String(err?.message || '').toLowerCase();

        // Check browser permission state to tell why NotAllowedError occurred even after user clicked Allow
        let permState: string = 'unknown';
        try {
          if (navigator.permissions?.query) {
            const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
            permState = status.state;
          }
        } catch {
          // Safari/Firefox may not support camera in permissions.query
        }

        const isPolicyOrIframeIssue =
          policyBlocked ||
          errMsg.includes('policy') ||
          errMsg.includes('permissions policy') ||
          errMsg.includes('disallowed') ||
          (isInIframe && (errName === 'NotAllowedError' || errName === 'PermissionDeniedError'));

        if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          setCameraError({
            title: 'Camera đang bận hoặc đang được ứng dụng khác sử dụng.',
            detail:
              'Hãy đóng các ứng dụng/tab khác đang dùng webcam (Zoom, Meet, OBS...) rồi bấm "Thử bật lại", hoặc chọn "Tải ảnh từ máy".',
          });
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError({
            title: 'Không tìm thấy thiết bị Camera trên máy này.',
            detail: 'Bạn có thể dùng "Tải ảnh từ máy" hoặc dán ảnh trực tiếp bằng Ctrl+V để AI giải ngay.',
          });
        } else if (isPolicyOrIframeIssue) {
          setCameraError({
            title:
              permState === 'granted'
                ? 'Đã cấp quyền nhưng khung nhúng (iframe) vẫn đang chặn luồng Camera trực tiếp.'
                : 'Khung xem trước (iframe) đang hạn chế quyền mở Camera trực tiếp.',
            detail:
              'Đây là giới hạn bảo mật của trình duyệt khi chạy trong khung nhúng. Bạn có thể bấm "Mở trang độc lập để bật Camera" ở tab mới, dùng nút "Chụp bằng Camera máy", hoặc "Tải ảnh từ máy" / dán ảnh (Ctrl+V).',
            isIframeBlocked: true,
          });
        } else if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errName === 'SecurityError') {
          setCameraError({
            title: 'Trình duyệt hoặc hệ điều hành vẫn đang chặn quyền Camera.',
            detail:
              'Hãy bấm biểu tượng ổ khóa / cài đặt cạnh thanh địa chỉ trình duyệt -> đặt Camera thành "Cho phép (Allow)" rồi tải lại trang (F5), đồng thời kiểm tra quyền Camera trong Cài đặt Windows/macOS. Hoặc chọn "Chụp bằng Camera máy" / "Tải ảnh từ máy".',
          });
        } else {
          setCameraError({
            title: 'Không thể khởi động Camera lúc này.',
            detail: `Chi tiết: ${err?.message || errName || 'Lỗi thiết bị'}. Bạn hãy thử lại hoặc dùng "Tải ảnh từ máy".`,
          });
        }
      } finally {
        setIsStartingCamera(false);
      }
    },
    [facingMode, isInIframe, stopCamera]
  );

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stopCamera]);

  const addPhotoToState = useCallback(
    (dataUrl: string) => {
      setSolveError(null);
      if (captureMode === 'six_faces') {
        const slot = SIX_FACE_SLOTS.find((s) => s.key === activeSlotKey) || SIX_FACE_SLOTS[0];
        setPhotos((prev) => {
          const withoutSlot = prev.filter((p) => p.slotKey !== slot.key);
          const next = [
            ...withoutSlot,
            {
              id: `slot_${slot.key}_${Date.now()}`,
              label: slot.label,
              slotKey: slot.key,
              dataUrl,
            },
          ];
          // Auto-advance to next empty slot
          const nextEmpty = SIX_FACE_SLOTS.find(
            (s) => s.key !== slot.key && !next.some((p) => p.slotKey === s.key)
          );
          if (nextEmpty) {
            setActiveSlotKey(nextEmpty.key);
          }
          return next;
        });
      } else {
        setPhotos((prev) => {
          if (prev.length >= 6) return prev;
          return [
            ...prev,
            {
              id: `quick_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              label: `Ảnh góc chụp #${prev.length + 1}`,
              dataUrl,
            },
          ];
        });
      }
    },
    [activeSlotKey, captureMode]
  );

  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const maxDim = 960;
    const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
    const w = Math.round(video.videoWidth * scale);
    const h = Math.round(video.videoHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
    addPhotoToState(dataUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setCameraError(null);
    setSolveError(null);
    try {
      for (const file of files.slice(0, 6)) {
        const dataUrl = await resizeImageFileToDataUrl(file);
        addPhotoToState(dataUrl);
      }
    } catch (err: any) {
      setSolveError(err?.message || 'Không thể đọc tệp ảnh đã chọn.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = '';
    }
  };

  // Support Ctrl+V pasting a Rubik photo directly into the modal
  useEffect(() => {
    if (!isOpen || solution) return;
    const handlePaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageFiles = items
        .filter((it) => it.type.startsWith('image/'))
        .map((it) => it.getAsFile())
        .filter((f): f is File => Boolean(f));
      if (imageFiles.length === 0) return;

      e.preventDefault();
      setCameraError(null);
      setSolveError(null);
      try {
        for (const file of imageFiles.slice(0, 6)) {
          const dataUrl = await resizeImageFileToDataUrl(file);
          addPhotoToState(dataUrl);
        }
      } catch (err: any) {
        setSolveError(err?.message || 'Không thể đọc ảnh vừa dán.');
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, solution, addPhotoToState]);

  const handleToggleFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      startCamera(nextMode);
    }
  };

  const handleAnalyzeAndSolve = async () => {
    if (photos.length === 0 || isSolving) return;
    stopCamera();
    setIsSolving(true);
    setSolveError(null);
    setSolution(null);
    setActiveStepIdx(0);

    try {
      const orderedImages =
        captureMode === 'six_faces'
          ? SIX_FACE_SLOTS.map((s) => photos.find((p) => p.slotKey === s.key)).filter(
              (p): p is CapturedPhoto => Boolean(p)
            )
          : photos;

      const { solution: result } = await solveRubikFromPhotos({
        images: orderedImages.map((p) => ({ label: p.label, dataUrl: p.dataUrl })),
        cubeTypeHint,
      });

      setSolution(result);
    } catch (err: any) {
      if (err instanceof NoApiKeyConfiguredError) {
        openApiKeyManagerModal();
      }
      setSolveError(
        err?.message || 'Không thể phân tích ảnh Rubik lúc này. Hãy chụp ảnh đủ sáng, rõ màu và thử lại.'
      );
    } finally {
      setIsSolving(false);
    }
  };

  // Flatten all moves across stages for interactive step-by-step playback
  const flatMoveSteps = useMemo(() => {
    if (!solution?.stages) return [];
    const list: Array<{ move: string; stageTitle: string; stageIndex: number; globalIndex: number }> = [];
    solution.stages.forEach((stage, sIdx) => {
      (stage.moves || []).forEach((mv) => {
        const clean = String(mv || '').trim();
        if (clean) {
          list.push({
            move: clean,
            stageTitle: stage.stageTitle,
            stageIndex: sIdx,
            globalIndex: list.length,
          });
        }
      });
    });
    return list;
  }, [solution]);

  if (!isOpen) return null;

  const activeSlotObj = SIX_FACE_SLOTS.find((s) => s.key === activeSlotKey) || SIX_FACE_SLOTS[0];
  const currentStep = flatMoveSteps[activeStepIdx] || null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70"
      role="dialog"
      aria-modal="true"
      aria-label="Chụp ảnh Rubik để AI giải ngay"
    >
      <div className="w-full max-w-4xl max-h-[92dvh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
                Chụp ảnh Rubik thực tế — AI Giải ngay
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Chụp bằng Camera hoặc tải ảnh khối Rubik của bạn lên để nhận hướng dẫn xoay từng bước
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Show Capture UI when no solution yet (or user clicks Retake) */}
          {!solution ? (
            <>
              {/* Mode & Cube Type Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setCaptureMode('quick');
                      setPhotos([]);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      captureMode === 'quick'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Chụp nhanh (1–3 ảnh góc nghiêng)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCaptureMode('six_faces');
                      setPhotos([]);
                      setActiveSlotKey('U');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      captureMode === 'six_faces'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Quét đủ 6 mặt (Độ chính xác cao)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="rubik-type-select"
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap"
                  >
                    Loại khối:
                  </label>
                  <select
                    id="rubik-type-select"
                    value={cubeTypeHint}
                    onChange={(e) => setCubeTypeHint(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    {CUBE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6-Face Slot Selector (if six_faces mode) */}
              {captureMode === 'six_faces' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {SIX_FACE_SLOTS.map((slot) => {
                    const captured = photos.find((p) => p.slotKey === slot.key);
                    const isActive = activeSlotKey === slot.key;
                    return (
                      <button
                        key={slot.key}
                        type="button"
                        onClick={() => setActiveSlotKey(slot.key)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isActive
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                            : captured
                              ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                            {slot.key}
                          </span>
                          {captured && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                          {slot.label.replace(/\s*\([A-Z]\)/, '')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Camera Viewfinder / Upload Box */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden relative min-h-[260px] flex flex-col items-center justify-center">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        onLoadedMetadata={(e) => {
                          e.currentTarget.play().catch(() => {});
                        }}
                        className="w-full h-[300px] sm:h-[340px] object-cover"
                      />
                      {/* Centered 3x3 Alignment Reticle */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-emerald-400/90 rounded-xl grid grid-cols-3 grid-rows-3 shadow-[0_0_0_9999px_rgba(2,6,23,0.42)]">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-white/25" />
                          ))}
                        </div>
                      </div>

                      {/* Target slot hint */}
                      <div className="pointer-events-none absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/80 text-white text-xs font-semibold">
                        {captureMode === 'six_faces'
                          ? `Đang chụp: ${activeSlotObj.label} — ${activeSlotObj.hint}`
                          : 'Đưa khối Rubik vào giữa khung lưới rõ ánh sáng'}
                      </div>

                      {/* Camera Controls Overlay */}
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={handleToggleFacing}
                          className="p-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-white border border-white/15 cursor-pointer"
                          title="Đổi camera trước / sau"
                        >
                          <SwitchCamera className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={handleCaptureFrame}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          Chụp ảnh ngay
                        </button>

                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-3 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-white/15 cursor-pointer"
                        >
                          Tắt Cam
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center mx-auto">
                        <Camera className="w-7 h-7" />
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <p className="text-sm font-bold text-white">
                          {captureMode === 'six_faces'
                            ? `Chụp ${activeSlotObj.label}`
                            : 'Bật Camera chụp trực tiếp hoặc tải ảnh khối Rubik'}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {captureMode === 'six_faces'
                            ? activeSlotObj.hint
                            : 'Mẹo: Chụp 2 ảnh góc chéo (mỗi ảnh nhìn rõ 3 mặt) ở nơi đủ sáng để AI nhận diện đủ màu sắc nhanh nhất.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <button
                          type="button"
                          disabled={isStartingCamera}
                          onClick={() => startCamera(facingMode)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
                        >
                          {isStartingCamera ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                          {isStartingCamera ? 'Đang mở Camera...' : 'Mở Camera chụp ngay'}
                        </button>
                        <button
                          type="button"
                          onClick={() => nativeCameraInputRef.current?.click()}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                          title="Mở ứng dụng Camera mặc định trên điện thoại/máy tính bảng"
                        >
                          <Smartphone className="w-4 h-4" />
                          Chụp bằng Camera máy
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Tải ảnh từ máy
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Hỗ trợ dán nhanh ảnh từ bộ nhớ tạm bằng tổ hợp phím <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">Ctrl+V</kbd>
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={captureMode === 'quick'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    ref={nativeCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Right Column: Captured Photos Preview */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 flex flex-col justify-between gap-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Ảnh đã chụp ({photos.length}/6)
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ImagePlus className="w-3.5 h-3.5" />
                        Thêm ảnh
                      </button>
                    </div>

                    {photos.length === 0 ? (
                      <div className="py-10 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                        Chưa có ảnh nào. Hãy chụp ít nhất 1 ảnh khối Rubik đang cần giải.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5 max-h-[240px] overflow-y-auto pr-0.5">
                        {photos.map((photo) => (
                          <div
                            key={photo.id}
                            className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-square"
                          >
                            <img
                              src={photo.dataUrl}
                              alt={photo.label}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 px-2 py-1 bg-slate-950/75 text-[10px] font-bold text-white truncate">
                              {photo.label}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
                              }
                              className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-950/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                              title="Xóa ảnh này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={photos.length === 0 || isSolving}
                    onClick={handleAnalyzeAndSolve}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-45 text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    {isSolving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang phân tích màu &amp; tìm lời giải...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Phân tích ảnh &amp; Giải Rubik ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Camera / Solve Errors */}
              {solveError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <span className="leading-relaxed">{solveError}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pl-6">
                    <button
                      type="button"
                      onClick={() => openApiKeyManagerModal()}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      Cài đặt / Kiểm tra API Key
                    </button>
                    <button
                      type="button"
                      disabled={photos.length === 0 || isSolving}
                      onClick={handleAnalyzeAndSolve}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Thử phân tích lại
                    </button>
                  </div>
                </div>
              )}

              {cameraError && !solveError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <div className="space-y-1">
                      <div className="font-bold text-rose-900 dark:text-rose-100">
                        {cameraError.title}
                      </div>
                      <p className="text-rose-800/90 dark:text-rose-200/90 leading-relaxed">
                        {cameraError.detail}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pl-6">
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Thử bật lại Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Chụp bằng Camera máy
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold inline-flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Tải ảnh từ máy
                    </button>
                    {(cameraError.isIframeBlocked || isInIframe) && typeof window !== 'undefined' && (
                      <a
                        href={window.location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Mở trang độc lập để bật Camera
                      </a>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* =====================================================
               SOLUTION RESULT VIEW
               ===================================================== */
            <div className="space-y-5">
              {/* Top Result Header */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Đã nhận diện: {solution.detectedCubeType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {solution.confidenceSummary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {solution.isSupported3x3Simulation && flatMoveSteps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onApply3dMoves(
                          flatMoveSteps.map((s) => s.move),
                          `Mô phỏng lời giải từ ảnh (${flatMoveSteps.length} bước)`
                        );
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Mô phỏng trên khối 3D
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSolution(null);
                      setSolveError(null);
                      setActiveStepIdx(0);
                    }}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Chụp ảnh khác
                  </button>
                </div>
              </div>

              {/* Hand Orientation Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Hand className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Cách cầm khối Rubik trước khi xoay
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {solution.orientationGuide}
                  </p>
                </div>
              </div>

              {/* Interactive Step-by-Step Move Player */}
              {currentStep && (
                <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-300">
                      Trình dẫn từng bước · {currentStep.stageTitle}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      Bước {activeStepIdx + 1} / {flatMoveSteps.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={activeStepIdx === 0}
                      onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-white cursor-pointer"
                      aria-label="Bước trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="text-center flex-1 space-y-1">
                      <div className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-wider">
                        {currentStep.move}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-200 font-medium">
                        {describeMoveToken(currentStep.move)}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={activeStepIdx >= flatMoveSteps.length - 1}
                      onClick={() =>
                        setActiveStepIdx((i) => Math.min(flatMoveSteps.length - 1, i + 1))
                      }
                      className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-35 text-slate-950 font-bold cursor-pointer"
                      aria-label="Bước tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mini timeline pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    {flatMoveSteps.map((step, idx) => (
                      <button
                        key={`${step.move}-${idx}`}
                        type="button"
                        onClick={() => setActiveStepIdx(idx)}
                        className={`px-2 py-1 rounded-md font-mono text-xs font-bold transition-colors cursor-pointer ${
                          idx === activeStepIdx
                            ? 'bg-emerald-500 text-slate-950'
                            : idx < activeStepIdx
                              ? 'bg-slate-800 text-slate-500 line-through'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {step.move}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Faces Sticker Preview */}
              {solution.detectedFaces && solution.detectedFaces.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Các mặt &amp; màu sắc AI đã đọc từ ảnh
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {solution.detectedFaces.map((face, idx) => {
                      const count = face.gridColors?.length || 0;
                      const cols = count === 4 ? 2 : count === 16 ? 4 : 3;
                      return (
                        <div
                          key={`${face.faceLabel}-${idx}`}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {face.faceLabel}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Tâm: {face.centerColor}
                            </div>
                          </div>
                          {count > 0 && (
                            <div
                              className="grid gap-1 w-20 mx-auto"
                              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                            >
                              {face.gridColors.slice(0, cols * cols).map((code, cIdx) => {
                                const upper = String(code || '').trim().toUpperCase().charAt(0);
                                const style = STICKER_COLOR_CLASS[upper] || {
                                  bg: 'bg-slate-400 border-slate-500 text-white',
                                  title: code,
                                };
                                return (
                                  <div
                                    key={cIdx}
                                    title={style.title}
                                    className={`aspect-square rounded-[4px] border text-[9px] font-mono font-bold flex items-center justify-center ${style.bg}`}
                                  >
                                    {upper || '?'}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stage-by-stage Detailed Explanation */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Chi tiết từng giai đoạn giải
                </h4>
                {solution.stages.map((stage, idx) => (
                  <div
                    key={`${stage.stageTitle}-${idx}`}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {stage.stageTitle}
                      </h5>
                      <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {stage.moves.length} bước
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Mục tiêu:</strong> {stage.goal}
                    </p>
                    {stage.moves.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {stage.moves.map((mv, mIdx) => (
                          <span
                            key={`${mv}-${mIdx}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300"
                          >
                            {mv}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {stage.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {solution.tips && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Lưu ý thêm:</strong>{' '}
                  {solution.tips}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

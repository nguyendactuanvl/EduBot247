import { GeneratedSpaceVectorExam } from '../data/exams/grade12SpaceVectorsCatalog';

export const GEMINI_DIRECT_MODEL = 'gemini-4-hydrogen';
export const API_KEYS_STORAGE_KEY = 'edubot-api-keys-v2';
export const LEGACY_SINGLE_KEY_STORAGE = 'edubot-api-key';
export const API_KEY_CURSOR_STORAGE = 'edubot-api-key-cursor';
export const API_KEYS_UPDATED_EVENT = 'edubot_api_keys_updated';
export const OPEN_API_KEY_MODAL_EVENT = 'edubot_open_api_key_modal';

const QUOTA_COOLDOWN_MS = 60_000; // 60 seconds cooldown on 429 / quota exhausted

export type ApiKeyStatus = 'ready' | 'cooldown' | 'invalid';

export interface ApiKeyEntry {
  id: string;
  label: string;
  key: string;
  status: ApiKeyStatus;
  cooldownUntil?: number;
  lastUsedAt?: string;
  lastError?: string;
  successCount: number;
}

export interface RotationExecutionMeta {
  usedKeyId: string;
  usedKeyLabel: string;
  usedKeyMasked: string;
  usedServerDefault?: boolean;
  attemptsCount: number;
  rotated: boolean;
}

interface ServerRotationMetaPayload {
  usedKeyId?: string;
  usedKeyLabel?: string;
  usedKeyMasked?: string;
  usedServerDefault?: boolean;
  usedModel?: string;
  attemptsCount?: number;
  rotated?: boolean;
  failedKeys?: Array<{ id?: string; reason: 'quota' | 'invalid' | 'overloaded' | 'transient'; message: string }>;
}

export class NoApiKeyConfiguredError extends Error {
  constructor() {
    super(
      'Chưa có Gemini API Key hoạt động. Vui lòng mở "Cài đặt API Key" để thêm API Key cá nhân hoặc kiểm tra cấu hình máy chủ.'
    );
    this.name = 'NoApiKeyConfiguredError';
  }
}

export function maskApiKey(key: string): string {
  const clean = key.trim();
  if (clean.length <= 10) return '••••••••';
  return `${clean.slice(0, 6)}••••••${clean.slice(-4)}`;
}

export function openApiKeyManagerModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_API_KEY_MODAL_EVENT));
  }
}

function notifyKeysUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(API_KEYS_UPDATED_EVENT));
  }
}

function generateId(): string {
  return `gk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function loadApiKeyPool(): ApiKeyEntry[] {
  try {
    const raw = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const now = Date.now();
        return parsed
          .filter((item) => item && typeof item.key === 'string' && item.key.trim().length > 0)
          .map((item, idx) => {
            const entry: ApiKeyEntry = {
              id: typeof item.id === 'string' ? item.id : generateId(),
              label: typeof item.label === 'string' && item.label.trim() ? item.label : `Key #${idx + 1}`,
              key: item.key.trim(),
              status:
                item.status === 'cooldown' && item.cooldownUntil && item.cooldownUntil <= now
                  ? 'ready'
                  : item.status === 'cooldown' || item.status === 'invalid'
                    ? item.status
                    : 'ready',
              cooldownUntil:
                item.status === 'cooldown' && item.cooldownUntil && item.cooldownUntil > now
                  ? item.cooldownUntil
                  : undefined,
              lastUsedAt: typeof item.lastUsedAt === 'string' ? item.lastUsedAt : undefined,
              lastError: typeof item.lastError === 'string' ? item.lastError : undefined,
              successCount: typeof item.successCount === 'number' ? item.successCount : 0,
            };
            return entry;
          });
      }
    }

    // One-time migration from legacy single key ('edubot-api-key')
    const legacy = (localStorage.getItem(LEGACY_SINGLE_KEY_STORAGE) || '').trim();
    if (legacy) {
      const migrated: ApiKeyEntry[] = [
        {
          id: generateId(),
          label: 'Key #1',
          key: legacy,
          status: 'ready',
          successCount: 0,
        },
      ];
      saveApiKeyPool(migrated);
      return migrated;
    }
  } catch {
    // Ignore malformed localStorage
  }
  return [];
}

export function saveApiKeyPool(entries: ApiKeyEntry[]): void {
  try {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(entries));
    if (entries.length > 0) {
      localStorage.setItem(LEGACY_SINGLE_KEY_STORAGE, entries[0].key);
    } else {
      localStorage.removeItem(LEGACY_SINGLE_KEY_STORAGE);
    }
    notifyKeysUpdated();
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Parse one or multiple pasted API keys separated by newlines, commas, or semicolons.
 * Supports optional "Label: AIza..." format.
 */
export function addApiKeysFromText(rawInput: string): {
  addedCount: number;
  duplicateCount: number;
  pool: ApiKeyEntry[];
} {
  const existing = loadApiKeyPool();
  const existingSet = new Set(existing.map((e) => e.key));

  const tokens = rawInput
    .split(/[\r\n,;]+/)
    .map((line) => line.trim())
    .filter(Boolean);

  let addedCount = 0;
  let duplicateCount = 0;
  const updated = [...existing];

  tokens.forEach((token) => {
    let label = '';
    let keyVal = token;

    // Support optional "My Key: AIzaSy..." format
    const colonIdx = token.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      const possibleKey = token.slice(colonIdx + 1).trim();
      if (possibleKey.length >= 20) {
        label = token.slice(0, colonIdx).trim();
        keyVal = possibleKey;
      }
    }

    // Remove surrounding quotes if user pasted from .env
    keyVal = keyVal.replace(/^["']|["']$/g, '').trim();
    if (!keyVal) return;

    if (existingSet.has(keyVal)) {
      duplicateCount += 1;
      return;
    }

    existingSet.add(keyVal);
    addedCount += 1;
    updated.push({
      id: generateId(),
      label: label || `Key #${updated.length + 1}`,
      key: keyVal,
      status: 'ready',
      successCount: 0,
    });
  });

  if (addedCount > 0) {
    saveApiKeyPool(updated);
  }

  return { addedCount, duplicateCount, pool: updated };
}

export function removeApiKeyById(id: string): ApiKeyEntry[] {
  const updated = loadApiKeyPool().filter((e) => e.id !== id);
  saveApiKeyPool(updated);
  return updated;
}

export function moveApiKeyToTop(id: string): ApiKeyEntry[] {
  const pool = loadApiKeyPool();
  const idx = pool.findIndex((e) => e.id === id);
  if (idx <= 0) return pool;
  const [target] = pool.splice(idx, 1);
  pool.unshift(target);
  try {
    localStorage.setItem(API_KEY_CURSOR_STORAGE, '0');
  } catch {
    // Ignore
  }
  saveApiKeyPool(pool);
  return pool;
}

export function resetAllApiKeyStatuses(): ApiKeyEntry[] {
  const updated = loadApiKeyPool().map((e) => ({
    ...e,
    status: 'ready' as ApiKeyStatus,
    cooldownUntil: undefined,
    lastError: undefined,
  }));
  saveApiKeyPool(updated);
  return updated;
}

export function clearAllApiKeys(): void {
  saveApiKeyPool([]);
  try {
    localStorage.removeItem(API_KEY_CURSOR_STORAGE);
  } catch {
    // Ignore
  }
}

function getCursorIndex(poolLength: number): number {
  if (poolLength <= 0) return 0;
  try {
    const raw = Number(localStorage.getItem(API_KEY_CURSOR_STORAGE) || '0');
    if (Number.isFinite(raw) && raw >= 0) {
      return raw % poolLength;
    }
  } catch {
    // Ignore
  }
  return 0;
}

function saveCursorIndex(idx: number): void {
  try {
    localStorage.setItem(API_KEY_CURSOR_STORAGE, String(idx));
  } catch {
    // Ignore
  }
}

/**
 * Build ordered user API key list (ready keys first in round-robin order,
 * followed by earliest-expiring cooldown keys). Invalid keys are skipped unless reset.
 */
function getOrderedApiKeysPayload(): Array<{ id: string; label: string; key: string }> {
  const pool = loadApiKeyPool();
  if (pool.length === 0) return [];

  const now = Date.now();
  const startCursor = getCursorIndex(pool.length);
  const rotatedOrder = Array.from({ length: pool.length }, (_, i) => (startCursor + i) % pool.length);

  const readyIndices = rotatedOrder.filter(
    (i) => pool[i].status === 'ready' || (pool[i].status === 'cooldown' && (pool[i].cooldownUntil || 0) <= now)
  );
  const cooldownIndices = rotatedOrder
    .filter((i) => pool[i].status === 'cooldown' && (pool[i].cooldownUntil || 0) > now)
    .sort((a, b) => (pool[a].cooldownUntil || 0) - (pool[b].cooldownUntil || 0));

  return [...readyIndices, ...cooldownIndices].map((i) => ({
    id: pool[i].id,
    label: pool[i].label,
    key: pool[i].key,
  }));
}

function applyServerRotationFeedback(rawMeta?: ServerRotationMetaPayload): RotationExecutionMeta {
  const pool = loadApiKeyPool();
  let modified = false;

  if (rawMeta?.failedKeys && Array.isArray(rawMeta.failedKeys) && pool.length > 0) {
    rawMeta.failedKeys.forEach((fail) => {
      if (!fail.id) return;
      const idx = pool.findIndex((e) => e.id === fail.id);
      if (idx === -1) return;
      modified = true;
      if (fail.reason === 'quota') {
        pool[idx] = {
          ...pool[idx],
          status: 'cooldown',
          cooldownUntil: Date.now() + QUOTA_COOLDOWN_MS,
          lastError: 'Hết quota / Giới hạn tốc độ (429)',
        };
      } else if (fail.reason === 'invalid') {
        pool[idx] = {
          ...pool[idx],
          status: 'invalid',
          cooldownUntil: undefined,
          lastError: 'API Key không hợp lệ hoặc bị khóa',
        };
      } else {
        pool[idx] = {
          ...pool[idx],
          lastError: fail.message,
        };
      }
    });
  }

  if (rawMeta?.usedKeyId && pool.length > 0) {
    const idx = pool.findIndex((e) => e.id === rawMeta.usedKeyId);
    if (idx !== -1) {
      modified = true;
      pool[idx] = {
        ...pool[idx],
        status: 'ready',
        cooldownUntil: undefined,
        lastError: undefined,
        lastUsedAt: new Date().toISOString(),
        successCount: (pool[idx].successCount || 0) + 1,
      };
      saveCursorIndex(idx);
    }
  }

  if (modified) {
    saveApiKeyPool(pool);
  }

  return {
    usedKeyId: rawMeta?.usedKeyId || 'server-default',
    usedKeyLabel: rawMeta?.usedKeyLabel || 'Hệ thống EduBot',
    usedKeyMasked: rawMeta?.usedKeyMasked || 'Server Key',
    usedServerDefault: Boolean(rawMeta?.usedServerDefault),
    attemptsCount: rawMeta?.attemptsCount || 1,
    rotated: Boolean(rawMeta?.rotated),
  };
}

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (Array.isArray(payload?.failedKeys) && payload.failedKeys.length > 0) {
      applyServerRotationFeedback({ failedKeys: payload.failedKeys });
    }
    const msg =
      typeof payload?.error === 'string' && payload.error.trim()
        ? payload.error
        : `Yêu cầu tới máy chủ thất bại (HTTP ${res.status}).`;
    if (msg.includes('Chưa có GEMINI_API_KEY')) {
      throw new NoApiKeyConfiguredError();
    }
    throw new Error(msg);
  }

  return payload as T;
}

/**
 * Ping a single API key through the Express backend to verify connectivity.
 */
export async function testSingleGeminiKey(entryId: string): Promise<{ ok: boolean; message: string }> {
  const pool = loadApiKeyPool();
  const idx = pool.findIndex((e) => e.id === entryId);
  if (idx === -1) return { ok: false, message: 'Không tìm thấy API Key.' };

  const entry = pool[idx];

  try {
    const res = await fetch('/api/gemini/test-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: entry.key }),
    });
    const data = await res.json().catch(() => ({}));

    if (data?.ok) {
      pool[idx] = {
        ...entry,
        status: 'ready',
        cooldownUntil: undefined,
        lastError: undefined,
        lastUsedAt: new Date().toISOString(),
      };
      saveApiKeyPool(pool);
      return { ok: true, message: data.message || 'Kết nối Gemini thành công!' };
    }

    const kind = data?.kind as 'quota' | 'invalid' | 'overloaded' | 'transient' | undefined;
    const msg = String(data?.message || 'Không thể kết nối Gemini với khóa này.');
    pool[idx] = {
      ...entry,
      status: kind === 'invalid' ? 'invalid' : kind === 'quota' ? 'cooldown' : 'ready',
      cooldownUntil: kind === 'quota' ? Date.now() + QUOTA_COOLDOWN_MS : undefined,
      lastError: msg,
    };
    saveApiKeyPool(pool);
    return { ok: false, message: msg };
  } catch (err: any) {
    const msg = String(err?.message || 'Lỗi kết nối máy chủ.');
    pool[idx] = { ...entry, lastError: msg };
    saveApiKeyPool(pool);
    return { ok: false, message: msg };
  }
}

// =========================================================================
// CHAT / MULTIMODAL TUTOR HELPER (via Express /api/chat)
// =========================================================================

export interface DirectChatRequest {
  message: string;
  file?: { type: string; data: string; name?: string };
  grade?: string;
  subject?: string;
  systemInstruction?: string;
  onRotateNotice?: (msg: string) => void;
}

export async function chatWithGeminiDirect(
  req: DirectChatRequest
): Promise<{ text: string; meta: RotationExecutionMeta }> {
  const apiKeys = getOrderedApiKeysPayload();

  const data = await postJson<{ text: string; meta?: ServerRotationMetaPayload }>('/api/chat', {
    message: req.message,
    file: req.file,
    grade: req.grade,
    subject: req.subject,
    systemInstruction: req.systemInstruction,
    apiKeys,
  });

  const meta = applyServerRotationFeedback(data.meta);
  if (meta.rotated && req.onRotateNotice) {
    req.onRotateNotice(`Đã tự động xoay vòng sang ${meta.usedKeyLabel} (${meta.usedKeyMasked}).`);
  }

  return { text: data.text || '', meta };
}

// =========================================================================
// ONLINE EXAM GENERATOR (Grade 12 Space Vectors & Grade 11 Parallel Space)
// =========================================================================

export async function generateGrade12SpaceVectorExamDirect(
  examId: string,
  variantNumber = 1,
  onRotateNotice?: (msg: string) => void
): Promise<{ exam: GeneratedSpaceVectorExam; meta: RotationExecutionMeta }> {
  const apiKeys = getOrderedApiKeysPayload();
  const data = await postJson<{ exam: GeneratedSpaceVectorExam; meta?: ServerRotationMetaPayload }>(
    '/api/exams/generate',
    {
      examId,
      chapter: 'grade12-vectors',
      variantNumber,
      apiKeys,
    }
  );

  const meta = applyServerRotationFeedback(data.meta);
  if (meta.rotated && onRotateNotice) {
    onRotateNotice(`Đã tự động xoay vòng sang ${meta.usedKeyLabel} (${meta.usedKeyMasked}).`);
  }

  return { exam: data.exam, meta };
}

export async function generateGrade11ParallelSpaceExamDirect(
  examId: string,
  variantNumber = 1,
  onRotateNotice?: (msg: string) => void
): Promise<{ exam: GeneratedSpaceVectorExam; meta: RotationExecutionMeta }> {
  const apiKeys = getOrderedApiKeysPayload();
  const data = await postJson<{ exam: GeneratedSpaceVectorExam; meta?: ServerRotationMetaPayload }>(
    '/api/exams/generate',
    {
      examId,
      chapter: 'grade11-parallel',
      variantNumber,
      apiKeys,
    }
  );

  const meta = applyServerRotationFeedback(data.meta);
  if (meta.rotated && onRotateNotice) {
    onRotateNotice(`Đã tự động xoay vòng sang ${meta.usedKeyLabel} (${meta.usedKeyMasked}).`);
  }

  return { exam: data.exam, meta };
}

export async function generateOnlineChapterExamDirect(
  chapterKey: string,
  examId: string,
  variantNumber = 1,
  onRotateNotice?: (msg: string) => void
): Promise<{ exam: GeneratedSpaceVectorExam; meta: RotationExecutionMeta }> {
  const apiKeys = getOrderedApiKeysPayload();
  const data = await postJson<{ exam: GeneratedSpaceVectorExam; meta?: ServerRotationMetaPayload }>(
    '/api/exams/generate',
    {
      examId,
      chapter: chapterKey,
      variantNumber,
      apiKeys,
    }
  );

  const meta = applyServerRotationFeedback(data.meta);
  if (meta.rotated && onRotateNotice) {
    onRotateNotice(`Đã tự động xoay vòng sang ${meta.usedKeyLabel} (${meta.usedKeyMasked}).`);
  }

  return { exam: data.exam, meta };
}

// =========================================================================
// RUBIK PHOTO SOLVER (via Express /api/rubik/solve-photo)
// =========================================================================

export interface RubikDetectedFace {
  faceLabel: string;
  centerColor: string;
  gridColors: string[];
}

export interface RubikPhotoStage {
  stageTitle: string;
  goal: string;
  moves: string[];
  explanation: string;
}

export interface RubikPhotoSolution {
  detectedCubeType: string;
  isSupported3x3Simulation: boolean;
  confidenceSummary: string;
  orientationGuide: string;
  detectedFaces: RubikDetectedFace[];
  stages: RubikPhotoStage[];
  tips: string;
}

export interface SolveRubikFromPhotosRequest {
  images: Array<{ label?: string; dataUrl: string }>;
  cubeTypeHint?: string;
}

export async function solveRubikFromPhotos(
  req: SolveRubikFromPhotosRequest
): Promise<{ solution: RubikPhotoSolution; meta: RotationExecutionMeta }> {
  const apiKeys = getOrderedApiKeysPayload();
  const data = await postJson<{ solution: RubikPhotoSolution; meta?: ServerRotationMetaPayload }>(
    '/api/rubik/solve-photo',
    {
      images: req.images,
      cubeTypeHint: req.cubeTypeHint,
      apiKeys,
    }
  );

  const meta = applyServerRotationFeedback(data.meta);
  return { solution: data.solution, meta };
}

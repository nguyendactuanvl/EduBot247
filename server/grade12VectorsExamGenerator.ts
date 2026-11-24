import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  GeneratedSpaceVectorExam,
  getBlueprintById,
  SpaceVectorBlueprint,
} from '../src/data/exams/grade12SpaceVectorsCatalog';
import { getGrade11ParallelBlueprintById } from '../src/data/exams/grade11ParallelSpaceCatalog';
import {
  findOnlineBlueprintById,
  OnlineChapterDefinition,
  OnlineChapterKey,
} from '../src/data/exams/onlineChaptersCatalog';

export const SERVER_GEMINI_MODEL = 'gemini-4-hydrogen';
export const SERVER_GEMINI_FALLBACK_MODEL = 'gemini-3.1-flash-lite';
export const SERVER_GEMINI_MODELS = [SERVER_GEMINI_MODEL, SERVER_GEMINI_FALLBACK_MODEL] as const;

export type ServerGeminiErrorKind = 'quota' | 'invalid' | 'overloaded' | 'transient';

export interface ServerKeyAttempt {
  key: string;
  label: string;
  id?: string;
  isServerDefault: boolean;
}

export interface ServerFailedKeyEntry {
  id?: string;
  label: string;
  isServerDefault: boolean;
  reason: ServerGeminiErrorKind;
  message: string;
}

export interface ServerRotationReport {
  usedKeyId?: string;
  usedKeyLabel: string;
  usedKeyMasked: string;
  usedServerDefault: boolean;
  usedModel?: string;
  attemptsCount: number;
  rotated: boolean;
  failedKeys: ServerFailedKeyEntry[];
}

export class ServerGeminiRotationError extends Error {
  httpStatus: number;
  primaryReason: ServerGeminiErrorKind;
  failedKeys: ServerFailedKeyEntry[];

  constructor(
    message: string,
    httpStatus: number,
    primaryReason: ServerGeminiErrorKind,
    failedKeys: ServerFailedKeyEntry[]
  ) {
    super(message);
    this.name = 'ServerGeminiRotationError';
    this.httpStatus = httpStatus;
    this.primaryReason = primaryReason;
    this.failedKeys = failedKeys;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maskKey(key: string): string {
  const clean = key.trim();
  if (clean.length <= 10) return '••••••••';
  return `${clean.slice(0, 6)}••••••${clean.slice(-4)}`;
}

export function classifyServerGeminiError(error: any): ServerGeminiErrorKind {
  const msg = String(error?.message || error || '').toLowerCase();
  const status = Number(error?.status || error?.code || 0);

  if (
    status === 429 ||
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('too many requests')
  ) {
    return 'quota';
  }

  if (
    status === 401 ||
    status === 403 ||
    msg.includes('api_key_invalid') ||
    msg.includes('api key not valid') ||
    msg.includes('permission_denied') ||
    msg.includes('api key expired') ||
    msg.includes('invalid api key')
  ) {
    return 'invalid';
  }

  if (
    status === 503 ||
    msg.includes('"code":503') ||
    msg.includes(' 503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('capacity')
  ) {
    return 'overloaded';
  }

  return 'transient';
}

function formatShortReasonMessage(reason: ServerGeminiErrorKind, rawError: any): string {
  if (reason === 'overloaded') {
    return 'Mô hình Gemini đang quá tải tạm thời (503)';
  }
  if (reason === 'quota') {
    return 'Hết hạn mức / vượt giới hạn tốc độ (429)';
  }
  if (reason === 'invalid') {
    return 'API Key không hợp lệ hoặc bị từ chối truy cập';
  }
  const raw = String(rawError?.message || 'Lỗi kết nối tạm thời với Gemini');
  if (raw.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      const innerMsg = parsed?.error?.message;
      if (typeof innerMsg === 'string' && innerMsg.trim()) {
        return innerMsg.trim().slice(0, 140);
      }
    } catch {
      // Ignore malformed JSON error text
    }
  }
  return raw.slice(0, 140);
}

function isPlaceholderApiKey(key: string): boolean {
  const upper = key.trim().toUpperCase();
  if (!upper) return true;
  return (
    upper === 'MY_GEMINI_API_KEY' ||
    upper === 'YOUR_GEMINI_API_KEY' ||
    upper === 'YOUR_API_KEY' ||
    upper === 'GEMINI_API_KEY' ||
    upper.startsWith('REPLACE_') ||
    upper.startsWith('INSERT_')
  );
}

function isHardInvalidKeyError(error: any): boolean {
  const msg = String(error?.message || error || '').toLowerCase();
  return (
    msg.includes('api_key_invalid') ||
    msg.includes('api key not valid') ||
    msg.includes('api key expired') ||
    msg.includes('invalid api key')
  );
}

export function buildServerKeyQueue(
  userKeys?: Array<{ id?: string; label?: string; key: string }> | string[]
): ServerKeyAttempt[] {
  const queue: ServerKeyAttempt[] = [];
  const seen = new Set<string>();

  if (Array.isArray(userKeys)) {
    userKeys.forEach((item, idx) => {
      const rawKey = typeof item === 'string' ? item : item?.key;
      const cleanKey = typeof rawKey === 'string' ? rawKey.trim() : '';
      if (!cleanKey || isPlaceholderApiKey(cleanKey) || seen.has(cleanKey)) return;
      seen.add(cleanKey);
      queue.push({
        key: cleanKey,
        label:
          typeof item === 'object' && item?.label && item.label.trim()
            ? item.label.trim()
            : `Key #${idx + 1}`,
        id: typeof item === 'object' ? item?.id : undefined,
        isServerDefault: false,
      });
    });
  }

  const serverKey = (process.env.GEMINI_API_KEY || '').trim();
  if (serverKey && !isPlaceholderApiKey(serverKey) && !seen.has(serverKey)) {
    // Always append server GEMINI_API_KEY as automatic fallback (or primary when user hasn't entered custom keys)
    queue.push({
      key: serverKey,
      label: 'Hệ thống EduBot',
      isServerDefault: true,
    });
  }

  return queue;
}

export function createServerGoogleGenAI(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function runServerGeminiWithRotation<T>(
  userKeys: Array<{ id?: string; label?: string; key: string }> | string[] | undefined,
  task: (ai: GoogleGenAI, model: string, attempt: ServerKeyAttempt) => Promise<T>
): Promise<{ data: T; meta: ServerRotationReport }> {
  const queue = buildServerKeyQueue(userKeys);
  if (queue.length === 0) {
    throw new ServerGeminiRotationError(
      'Chưa có GEMINI_API_KEY trên máy chủ và bạn chưa nhập API Key cá nhân. Vui lòng thiết lập khóa API hoặc thêm API Key trong phần Cài đặt.',
      403,
      'invalid',
      []
    );
  }

  const failedKeys: ServerFailedKeyEntry[] = [];

  for (let i = 0; i < queue.length; i++) {
    const attempt = queue[i];
    const ai = createServerGoogleGenAI(attempt.key);

    let lastReason: ServerGeminiErrorKind = 'transient';
    let lastError: any = null;

    // Try primary model first, with automatic backoff + fallback model on 503/transient demand spikes
    for (let mIdx = 0; mIdx < SERVER_GEMINI_MODELS.length; mIdx++) {
      const model = SERVER_GEMINI_MODELS[mIdx];
      const maxRetriesForModel = mIdx === 0 ? 1 : 1; // up to 2 attempts per model on overloaded/transient

      for (let retry = 0; retry <= maxRetriesForModel; retry++) {
        try {
          const data = await task(ai, model, attempt);
          return {
            data,
            meta: {
              usedKeyId: attempt.id,
              usedKeyLabel: attempt.label,
              usedKeyMasked: attempt.isServerDefault ? 'Server Key' : maskKey(attempt.key),
              usedServerDefault: attempt.isServerDefault,
              usedModel: model,
              attemptsCount: i + 1,
              rotated: i > 0,
              failedKeys,
            },
          };
        } catch (err: any) {
          lastError = err;
          lastReason = classifyServerGeminiError(err);

          // Hard invalid key or quota exhausted -> do NOT retry same key; move straight to next key
          if (lastReason === 'quota' || (lastReason === 'invalid' && isHardInvalidKeyError(err))) {
            break;
          }

          // Model-specific 403/404 -> skip retry on this model and try fallback model immediately
          if (lastReason === 'invalid') {
            break;
          }

          // Transient / 503 high demand -> exponential backoff before retrying or falling back to secondary model
          if (retry < maxRetriesForModel) {
            const delayMs = 900 * Math.pow(2, retry) + Math.floor(Math.random() * 350);
            await sleep(delayMs);
            continue;
          }
        }
      }

      if (lastReason === 'quota' || (lastReason === 'invalid' && isHardInvalidKeyError(lastError))) {
        break;
      }
    }

    failedKeys.push({
      id: attempt.id,
      label: attempt.label,
      isServerDefault: attempt.isServerDefault,
      reason: lastReason,
      message: formatShortReasonMessage(lastReason, lastError),
    });
  }

  const hasOverloaded = failedKeys.some((f) => f.reason === 'overloaded');
  const hasQuota = failedKeys.some((f) => f.reason === 'quota');
  const allInvalid = failedKeys.every((f) => f.reason === 'invalid');
  const invalidLabels = failedKeys.filter((f) => f.reason === 'invalid').map((f) => f.label);

  if (allInvalid) {
    throw new ServerGeminiRotationError(
      'API Key không hợp lệ hoặc đã hết quyền truy cập. Vui lòng kiểm tra lại API Key trong "Cài đặt API Key" (hoặc mục Settings > Secrets của hệ thống).',
      403,
      'invalid',
      failedKeys
    );
  }

  if (hasOverloaded) {
    const invalidNote =
      invalidLabels.length > 0
        ? ` (Lưu ý: ${invalidLabels.join(', ')} không hợp lệ và đã được đánh dấu lỗi).`
        : '';
    throw new ServerGeminiRotationError(
      `Hệ thống Gemini AI hiện đang quá tải tạm thời (503). Ứng dụng đã tự động thử lại và chuyển mô hình dự phòng nhưng lưu lượng vẫn cao — vui lòng bấm "Thử lại ngay" sau vài giây.${invalidNote}`,
      503,
      'overloaded',
      failedKeys
    );
  }

  if (hasQuota) {
    throw new ServerGeminiRotationError(
      `Các API Key đang vượt hạn mức gọi miễn phí (429). Vui lòng đợi khoảng 60 giây hoặc thêm API Key khác trong "Cài đặt API Key".`,
      429,
      'quota',
      failedKeys
    );
  }

  const summary = failedKeys.map((f) => `${f.label}: ${f.message}`).join(' • ');
  throw new ServerGeminiRotationError(
    `Không thể kết nối Gemini AI sau khi thử ${queue.length} khóa (${summary}). Vui lòng thử lại sau ít phút.`,
    500,
    'transient',
    failedKeys
  );
}

const EXAM_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Tiêu đề đầy đủ của đề thi bằng tiếng Việt.',
    },
    subtitle: {
      type: Type.STRING,
      description: 'Mô tả ngắn về phạm vi kiến thức và chủ đề thực tế của đề thi.',
    },
    part1: {
      type: Type.ARRAY,
      description: 'Phần I: Danh sách câu trắc nghiệm nhiều phương án lựa chọn (A, B, C, D).',
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: 'Nội dung câu hỏi, mọi công thức toán đặt trong $...$ hoặc $$...$$.',
          },
          options: {
            type: Type.ARRAY,
            description: 'Đúng 4 phương án trả lời tương ứng A, B, C, D (không kèm tiền tố A., B., C., D.).',
            items: { type: Type.STRING },
          },
          correctOption: {
            type: Type.STRING,
            description: 'Một trong 4 chữ cái in hoa: A, B, C, hoặc D.',
          },
          difficulty: {
            type: Type.STRING,
            description: 'Mức độ câu hỏi: NB, TH, VD, hoặc VDC.',
          },
          explanation: {
            type: Type.STRING,
            description: 'Lời giải chi tiết từng bước rõ ràng, dùng LaTeX chuẩn đặt trong $...$.',
          },
        },
        required: ['question', 'options', 'correctOption', 'difficulty', 'explanation'],
      },
    },
    part2: {
      type: Type.ARRAY,
      description: 'Phần II: Danh sách câu trắc nghiệm Đúng/Sai, mỗi câu gồm đúng 4 mệnh đề a, b, c, d.',
      items: {
        type: Type.OBJECT,
        properties: {
          stem: {
            type: Type.STRING,
            description: 'Đề dẫn chung cho câu hỏi Đúng/Sai.',
          },
          difficulty: {
            type: Type.STRING,
            description: 'Mức độ câu hỏi: NB, TH, VD, hoặc VDC.',
          },
          statements: {
            type: Type.ARRAY,
            description: 'Đúng 4 mệnh đề ứng với nhãn a, b, c, d.',
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                text: { type: Type.STRING },
                isTrue: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING },
              },
              required: ['label', 'text', 'isTrue', 'explanation'],
            },
          },
          summaryExplanation: {
            type: Type.STRING,
            description: 'Tóm tắt phương pháp giải chung cho cả 4 ý của câu hỏi.',
          },
        },
        required: ['stem', 'difficulty', 'statements', 'summaryExplanation'],
      },
    },
    part3: {
      type: Type.ARRAY,
      description: 'Phần III: Danh sách câu trắc nghiệm trả lời ngắn.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          acceptableAnswers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          unit: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['question', 'answer', 'acceptableAnswers', 'difficulty', 'explanation'],
      },
    },
  },
  required: ['title', 'subtitle', 'part1', 'part2', 'part3'],
};

function repairRawJsonBackslashes(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    return cleaned.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
  }
}

function normalizeLatexText(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\x0c(?=rac|orall)/g, '\\f')
    .replace(/\x08(?=eta|egin|ig|oxed|ar)/g, '\\b')
    .replace(/\x09(?=an|heta|imes|o\b|ext|riangle|au)/g, '\\t')
    .replace(/\x0d(?=ight|ho|m\b)/g, '\\r')
    .replace(/\x0b(?=ec|dots|ert|arepsilon)/g, '\\v')
    .replace(/\n(?=ot\\subset|ot\\in|eq\b|abla)/g, '\\n')
    .replace(/\\dfrac\b/g, '\\frac')
    .trim();
}

function stripOptionPrefix(opt: string): string {
  return normalizeLatexText(opt).replace(/^[A-D]\s*[.):]\s*/i, '').trim();
}

function normalizeDifficulty(val: string): 'NB' | 'TH' | 'VD' | 'VDC' {
  const upper = (val || '').toUpperCase().trim();
  if (upper === 'NB' || upper === 'TH' || upper === 'VD' || upper === 'VDC') return upper;
  if (upper.includes('VDC') || upper.includes('VẬN DỤNG CAO')) return 'VDC';
  if (upper.includes('VD') || upper.includes('VẬN DỤNG')) return 'VD';
  if (upper.includes('TH') || upper.includes('THÔNG HIỂU')) return 'TH';
  return 'NB';
}

function normalizeShortAnswer(ans: string): string {
  return String(ans ?? '')
    .trim()
    .replace(/\$/g, '')
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/−/g, '-')
    .slice(0, 6);
}

function buildGrade12SpaceVectorPrompt(blueprint: SpaceVectorBlueprint, variantNumber: number): string {
  const isFullExam = blueprint.durationMinutes === 90;
  const part1ScoreStr = (blueprint.part1Count * 0.25).toFixed(2).replace('.', ',');
  const part2ScoreStr = (blueprint.part2Count * 1.0).toFixed(1).replace('.', ',');
  const part3ScoreStr = (blueprint.part3Count * 0.5).toFixed(1).replace('.', ',');

  return `Hãy biên soạn một đề thi Online hoàn chỉnh, chuẩn xác tuyệt đối về mặt Toán học cho môn Toán 12 - Chương II: Vectơ và hệ trục tọa độ trong không gian (SGK Kết nối tri thức với cuộc sống - GDPT 2018).

THÔNG TIN MÃ ĐỀ:
- Mã đề: ${blueprint.id} (Phiên bản sinh đề số ${variantNumber} — tạo số liệu, tọa độ điểm và tình huống mới mẻ).
- Tên đề: ${blueprint.title}
- Phân hệ: ${blueprint.groupLabel}
- Thời lượng: ${blueprint.durationMinutes} phút
- Định hướng độ khó: ${blueprint.difficultyFocus}
- Chủ đề thực tế tích hợp trong không gian $Oxyz$: ${blueprint.realWorldTheme}
- Phạm vi kiến thức trọng tâm:
${blueprint.topics.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}

CẤU TRÚC ĐỀ THI BẮT BUỘC (ĐÚNG SỐ LƯỢNG CÂU):
- PHẦN I (part1): ĐÚNG ${blueprint.part1Count} câu trắc nghiệm nhiều phương án lựa chọn (A, B, C, D) — (${part1ScoreStr} điểm).
  + Mỗi câu có đúng 4 phương án trong mảng "options" (KHÔNG ghi chữ "A.", "B.", "C.", "D." ở đầu mỗi phương án).
  + "correctOption" là đúng 1 chữ cái in hoa "A", "B", "C" hoặc "D", phân bố đều.
- PHẦN II (part2): ĐÚNG ${blueprint.part2Count} câu trắc nghiệm Đúng/Sai — (${part2ScoreStr} điểm).
  + Mỗi câu gồm 1 đề dẫn ("stem") và ĐÚNG 4 mệnh đề nhãn lần lượt "a", "b", "c", "d" với mức độ tăng dần.
  + ${isFullExam ? 'Ít nhất 2 câu ở Phần II là bài toán ứng dụng thực tế gắn hệ trục tọa độ $Oxyz$.' : 'Ít nhất 1 câu ở Phần II là bài toán ứng dụng thực tế gắn bài học.'}
- PHẦN III (part3): ĐÚNG ${blueprint.part3Count} câu trắc nghiệm trả lời ngắn — (${part3ScoreStr} điểm).
  + Đáp án ("answer") BẮT BUỘC là số nguyên hoặc số thập phân làm tròn tối đa 4 ký tự (kể cả dấu "-" và dấu ".", ví dụ: "12", "-5", "2.5", "0.75").
  + Ghi rõ yêu cầu làm tròn ngay trong đề bài nếu đáp án là số thập phân.
  + "acceptableAnswers" liệt kê cả dạng dấu chấm và dấu phẩy (ví dụ: ["2.5", "2,5"]).

QUY TẮC HIỂN THỊ TOÁN HỌC & JSON:
1. Mọi công thức, ký hiệu vectơ, tọa độ điểm, biến số đơn lẻ ($x, y, z, a, b, m, k...$) BẮT BUỘC đặt trong $...$ hoặc $$...$$.
2. Dùng LaTeX chuẩn KaTeX: \\vec{a}, \\overrightarrow{AB}, \\vec{i}, \\vec{j}, \\vec{k}, A(x;y;z), \\vec{a}\\cdot\\vec{b}, \\cos(\\vec{a}, \\vec{b}), \\frac{a}{b}, \\sqrt{...}, \\perp, \\Leftrightarrow, \\ge, \\le, \\in. TUYỆT ĐỐI dùng \\frac (không dùng \\dfrac).
3. Kiểm tra kỹ từng phép tính để đáp án khớp 100% lời giải chi tiết từng bước.
4. Trả về đúng JSON hợp lệ theo schema, giữ nguyên font tiếng Việt UTF-8 chuẩn.`;
}

function buildGrade11ParallelSpacePrompt(blueprint: SpaceVectorBlueprint, variantNumber: number): string {
  const isFullExam = blueprint.durationMinutes === 90;
  const part1ScoreStr = (blueprint.part1Count * 0.25).toFixed(2).replace('.', ',');
  const part2ScoreStr = (blueprint.part2Count * 1.0).toFixed(1).replace('.', ',');
  const part3ScoreStr = (blueprint.part3Count * 0.5).toFixed(1).replace('.', ',');

  return `Hãy biên soạn một đề thi Online hoàn chỉnh, chuẩn xác tuyệt đối về mặt Hình học không gian cho môn Toán 11 - Chương IV: Quan hệ song song trong không gian (SGK Kết nối tri thức với cuộc sống - GDPT 2018).

THÔNG TIN MÃ ĐỀ:
- Mã đề: ${blueprint.id} (Phiên bản sinh đề số ${variantNumber} — tạo giả thiết hình học, số liệu độ dài, tỉ số đoạn thẳng và bài toán thực tế hoàn toàn mới).
- Tên đề: ${blueprint.title}
- Phân hệ: ${blueprint.groupLabel}
- Thời lượng: ${blueprint.durationMinutes} phút
- Định hướng độ khó: ${blueprint.difficultyFocus}
- Chủ đề thực tế tích hợp (kiến trúc, xây dựng, phép chiếu song song): ${blueprint.realWorldTheme}
- Phạm vi kiến thức trọng tâm:
${blueprint.topics.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}

CẤU TRÚC ĐỀ THI BẮT BUỘC (ĐÚNG SỐ LƯỢNG CÂU):
- PHẦN I (part1): ĐÚNG ${blueprint.part1Count} câu trắc nghiệm nhiều phương án lựa chọn (A, B, C, D) — (${part1ScoreStr} điểm).
  + Mỗi câu có đúng 4 phương án trong mảng "options" (KHÔNG ghi chữ "A.", "B.", "C.", "D." ở đầu mỗi phương án).
  + "correctOption" là đúng 1 chữ cái in hoa "A", "B", "C" hoặc "D", phân bố đều.
- PHẦN II (part2): ĐÚNG ${blueprint.part2Count} câu trắc nghiệm Đúng/Sai — (${part2ScoreStr} điểm).
  + Mỗi câu gồm 1 đề dẫn ("stem") mô tả rõ hình chóp/tứ diện/lăng trụ/hình hộp hoặc tình huống kiến trúc thực tế và ĐÚNG 4 mệnh đề nhãn lần lượt "a", "b", "c", "d" với độ khó tăng dần.
  + ${isFullExam ? 'Ít nhất 2 câu ở Phần II tích hợp bài toán thực tế về kiến trúc, xây dựng hoặc phép chiếu song song.' : 'Ít nhất 1 câu ở Phần II gắn với bài toán thực tế của bài học.'}
- PHẦN III (part3): ĐÚNG ${blueprint.part3Count} câu trắc nghiệm trả lời ngắn — (${part3ScoreStr} điểm).
  + Tập trung tính tỉ số đoạn thẳng bằng định lí Thales trong không gian, độ dài đoạn giao tuyến, chu vi/diện tích thiết diện hoặc độ dài bóng chiếu song song.
  + Đáp án ("answer") BẮT BUỘC là số nguyên hoặc số thập phân làm tròn tối đa 4 ký tự (ví dụ: "12", "1.5", "0.75", "2.25").
  + Ghi rõ yêu cầu làm tròn ngay trong đề bài nếu đáp án là số thập phân.
  + "acceptableAnswers" liệt kê cả dạng dấu chấm và dấu phẩy (ví dụ: ["1.5", "1,5"]).

QUY TẮC HIỂN THỊ KÝ HIỆU HÌNH HỌC KHÔNG GIAN & JSON:
1. Mọi công thức, tên hình, điểm, đường thẳng, mặt phẳng, biến số đơn lẻ ($A, B, C, S, M, N, d, a, b, x, k...$) BẮT BUỘC đặt trong $...$ hoặc $$...$$.
2. Sử dụng chuẩn ký hiệu Hình học không gian KaTeX: $d \\cap (P) = \\{M\\}$, $(P) \\cap (Q) = d$, $a \\parallel b$, $d \\parallel (P)$, $(P) \\parallel (Q)$, $M \\in (P)$, $d \\subset (P)$, $d \\not\\subset (P)$, $S.ABCD$, $ABC.A'B'C'$, \\frac{a}{b} (không dùng \\dfrac).
3. Kiểm tra chặt chẽ tính nhất quán hình học để đáp án khớp 100% lời giải chi tiết từng bước.
4. Trả về đúng JSON hợp lệ theo schema, giữ nguyên tiếng Việt UTF-8 chuẩn.`;
}

function buildOnlineChapterPrompt(
  chapterDef: OnlineChapterDefinition,
  blueprint: SpaceVectorBlueprint,
  variantNumber: number
): string {
  const isFullExam = blueprint.durationMinutes === 90;
  const part1ScoreStr = (blueprint.part1Count * 0.25).toFixed(2).replace('.', ',');
  const part2ScoreStr = (blueprint.part2Count * 1.0).toFixed(1).replace('.', ',');
  const part3ScoreStr = (blueprint.part3Count * 0.5).toFixed(1).replace('.', ',');

  return `Hãy biên soạn một đề thi Online hoàn chỉnh, chuẩn xác tuyệt đối về mặt Toán học cho môn ${chapterDef.subjectCourseName} (SGK Kết nối tri thức với cuộc sống - Chương trình GDPT 2018).

THÔNG TIN MÃ ĐỀ:
- Mã đề: ${blueprint.id} (Phiên bản sinh đề số ${variantNumber} — tạo giả thiết, bảng số liệu và tình huống thực tế hoàn toàn mới).
- Tên đề: ${blueprint.title}
- Phân hệ: ${blueprint.groupLabel}
- Thời lượng: ${blueprint.durationMinutes} phút
- Định hướng độ khó: ${blueprint.difficultyFocus}
- Chủ đề thực tế tích hợp: ${blueprint.realWorldTheme}
- Phạm vi kiến thức trọng tâm:
${blueprint.topics.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}

CẤU TRÚC ĐỀ THI BẮT BUỘC (ĐÚNG SỐ LƯỢNG CÂU):
- PHẦN I (part1): ĐÚNG ${blueprint.part1Count} câu trắc nghiệm nhiều phương án lựa chọn (A, B, C, D) — (${part1ScoreStr} điểm).
  + Mỗi câu có đúng 4 phương án trong mảng "options" (KHÔNG ghi chữ "A.", "B.", "C.", "D." ở đầu mỗi phương án).
  + "correctOption" là đúng 1 chữ cái in hoa "A", "B", "C" hoặc "D", phân bố đều.
- PHẦN II (part2): ĐÚNG ${blueprint.part2Count} câu trắc nghiệm Đúng/Sai — (${part2ScoreStr} điểm).
  + Mỗi câu gồm 1 đề dẫn ("stem") và ĐÚNG 4 mệnh đề nhãn lần lượt "a", "b", "c", "d" với mức độ tăng dần (NB -> TH -> VD -> VDC).
  + ${isFullExam ? chapterDef.part2RealWorldInstruction : 'Ít nhất 1 câu ở Phần II là bài toán ứng dụng thực tế gắn với nội dung bài học.'}
- PHẦN III (part3): ĐÚNG ${blueprint.part3Count} câu trắc nghiệm trả lời ngắn — (${part3ScoreStr} điểm).
  + ${chapterDef.part3AnswerGuidance}
  + Đáp án ("answer") BẮT BUỘC là số nguyên hoặc số thập phân làm tròn tối đa 4 ký tự (kể cả dấu "-" và dấu ".", ví dụ: "12", "-5", "2.5", "0.75").
  + Ghi rõ yêu cầu làm tròn ngay trong đề bài nếu đáp án là số thập phân.
  + "acceptableAnswers" liệt kê cả dạng dấu chấm và dấu phẩy (ví dụ: ["2.5", "2,5"]).

QUY TẮC HIỂN THỊ CÔNG THỨC TOÁN HỌC & JSON (CỰC KỲ QUAN TRỌNG):
1. Mọi công thức, ký hiệu toán học, biến số đơn lẻ ($x, y, z, n, a, b, m, k, P, A, B...$) BẮT BUỘC đặt trong $...$ (nội dòng) hoặc $$...$$ (khối riêng).
2. Chuẩn ký hiệu KaTeX đặc thù cho chương này:
   ${chapterDef.latexGuidance}
3. BẮT BUỘC escape đúng dấu gạch chéo ngược (\\\\) cho toàn bộ lệnh LaTeX trong chuỗi JSON (ví dụ: \\\\int_{0}^{1}, \\\\frac{a}{b}, \\\\lim_{x \\\\to 0}, \\\\begin{cases}, \\\\overline{A}, \\\\perp, \\\\cap, \\\\cup, \\\\Omega) để tuyệt đối không lỗi JSON.parse.
4. Kiểm tra chặt chẽ từng bước tính toán để đáp án khớp 100% lời giải chi tiết.
5. Trả về đúng JSON hợp lệ theo schema, giữ nguyên font tiếng Việt UTF-8 chuẩn.`;
}

export async function generateStructuredExamServer(params: {
  examId: string;
  chapter?: 'grade12-vectors' | 'grade11-parallel' | OnlineChapterKey | string;
  variantNumber?: number;
  apiKeys?: Array<{ id?: string; label?: string; key: string }> | string[];
}): Promise<{ exam: GeneratedSpaceVectorExam; meta: ServerRotationReport }> {
  const { examId, variantNumber = 1, apiKeys } = params;

  let blueprint: SpaceVectorBlueprint | undefined;
  let prompt = '';
  let systemInstruction = '';

  const onlineMatch = findOnlineBlueprintById(examId, params.chapter);
  if (onlineMatch) {
    blueprint = onlineMatch.blueprint;
    prompt = buildOnlineChapterPrompt(onlineMatch.chapter, onlineMatch.blueprint, variantNumber);
    systemInstruction = onlineMatch.chapter.systemInstruction;
  } else {
    const g11Blueprint = getGrade11ParallelBlueprintById(examId);
    const g12Blueprint = getBlueprintById(examId);
    const isGrade11 = params.chapter === 'grade11-parallel' || Boolean(g11Blueprint);
    blueprint = isGrade11 ? g11Blueprint : g12Blueprint;

    if (blueprint) {
      prompt = isGrade11
        ? buildGrade11ParallelSpacePrompt(blueprint, variantNumber)
        : buildGrade12SpaceVectorPrompt(blueprint, variantNumber);
      systemInstruction = isGrade11
        ? 'Bạn là chuyên gia biên soạn đề thi Hình học không gian Toán 11 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Dùng chuẩn ký hiệu KaTeX trong $...$ ($d \\cap (P) = \\{M\\}$, $(P) \\cap (Q) = d$, $a \\parallel b$, $(P) \\parallel (Q)$, $d \\subset (P)$, $S.ABCD$, $ABC.A\'B\'C\'$, \\frac thay vì \\dfrac), kiểm tra chặt chẽ mọi phép tính tỉ số Thales/thiết diện, và trả về JSON hợp lệ 100% theo responseSchema.'
        : 'Bạn là chuyên gia biên soạn đề thi Tốt nghiệp THPT môn Toán (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra kỹ mọi phép tính tọa độ Oxyz, dùng LaTeX chuẩn trong $...$ (dùng \\frac thay vì \\dfrac), và trả về JSON hợp lệ 100% theo responseSchema.';
    }
  }

  if (!blueprint) {
    throw new Error(`Không tìm thấy cấu hình mã đề "${examId}".`);
  }

  const { data: parsedRaw, meta } = await runServerGeminiWithRotation(apiKeys, async (ai, model) => {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: EXAM_RESPONSE_SCHEMA,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const rawText = response.text;
    if (!rawText || !rawText.trim()) {
      throw new Error('Mô hình AI không trả về nội dung đề thi.');
    }

    const sanitized = repairRawJsonBackslashes(rawText);
    const data = JSON.parse(sanitized);

    if (
      !data ||
      !Array.isArray(data.part1) ||
      !Array.isArray(data.part2) ||
      !Array.isArray(data.part3) ||
      data.part1.length < blueprint.part1Count ||
      data.part2.length < blueprint.part2Count ||
      data.part3.length < blueprint.part3Count
    ) {
      throw new Error(
        `Đề thi sinh ra chưa đủ số câu (${data?.part1?.length || 0}/${blueprint.part1Count} P1, ${data?.part2?.length || 0}/${blueprint.part2Count} P2, ${data?.part3?.length || 0}/${blueprint.part3Count} P3).`
      );
    }

    return data;
  });

  const part1 = parsedRaw.part1.slice(0, blueprint.part1Count).map((q: any, idx: number) => {
    const rawOpts = Array.isArray(q.options) ? q.options : [];
    const options: [string, string, string, string] = [
      stripOptionPrefix(rawOpts[0] ?? ''),
      stripOptionPrefix(rawOpts[1] ?? ''),
      stripOptionPrefix(rawOpts[2] ?? ''),
      stripOptionPrefix(rawOpts[3] ?? ''),
    ];
    const rawCorrect = String(q.correctOption || 'A').trim().toUpperCase().charAt(0);
    const correctOption: 'A' | 'B' | 'C' | 'D' =
      rawCorrect === 'A' || rawCorrect === 'B' || rawCorrect === 'C' || rawCorrect === 'D'
        ? rawCorrect
        : 'A';

    return {
      id: `${blueprint.id}_p1_${idx + 1}`,
      number: idx + 1,
      question: normalizeLatexText(q.question || ''),
      options,
      correctOption,
      difficulty: normalizeDifficulty(q.difficulty),
      explanation: normalizeLatexText(q.explanation || ''),
    };
  });

  const labels: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd'];
  const part2 = parsedRaw.part2.slice(0, blueprint.part2Count).map((q: any, idx: number) => {
    const rawStatements = Array.isArray(q.statements) ? q.statements : [];
    const statements = labels.map((lbl, sIdx) => {
      const st = rawStatements[sIdx] || {};
      return {
        label: lbl,
        text: normalizeLatexText(st.text || '').replace(/^[a-d]\s*[).:]\s*/i, ''),
        isTrue: Boolean(st.isTrue),
        explanation: normalizeLatexText(st.explanation || ''),
      };
    }) as [
      { label: 'a'; text: string; isTrue: boolean; explanation: string },
      { label: 'b'; text: string; isTrue: boolean; explanation: string },
      { label: 'c'; text: string; isTrue: boolean; explanation: string },
      { label: 'd'; text: string; isTrue: boolean; explanation: string },
    ];

    return {
      id: `${blueprint.id}_p2_${idx + 1}`,
      number: blueprint.part1Count + idx + 1,
      stem: normalizeLatexText(q.stem || ''),
      statements,
      difficulty: normalizeDifficulty(q.difficulty),
      summaryExplanation: normalizeLatexText(q.summaryExplanation || ''),
    };
  });

  const part3 = parsedRaw.part3.slice(0, blueprint.part3Count).map((q: any, idx: number) => {
    const mainAnswer = normalizeShortAnswer(q.answer);
    const commaVariant = mainAnswer.includes('.') ? mainAnswer.replace('.', ',') : mainAnswer;
    const rawAcceptable = Array.isArray(q.acceptableAnswers)
      ? q.acceptableAnswers.map((a: any) => String(a ?? '').trim()).filter(Boolean)
      : [];
    const acceptableSet = new Set<string>([mainAnswer, commaVariant, ...rawAcceptable]);

    return {
      id: `${blueprint.id}_p3_${idx + 1}`,
      number: blueprint.part1Count + blueprint.part2Count + idx + 1,
      question: normalizeLatexText(q.question || ''),
      answer: mainAnswer,
      acceptableAnswers: Array.from(acceptableSet),
      unit: typeof q.unit === 'string' ? q.unit.trim() : '',
      difficulty: normalizeDifficulty(q.difficulty),
      explanation: normalizeLatexText(q.explanation || ''),
    };
  });

  const exam: GeneratedSpaceVectorExam = {
    examId: blueprint.id,
    title: normalizeLatexText(parsedRaw.title || blueprint.title) || blueprint.title,
    subtitle: normalizeLatexText(parsedRaw.subtitle || blueprint.subtitle) || blueprint.subtitle,
    generatedAt: new Date().toISOString(),
    variantNumber,
    part1,
    part2,
    part3,
  };

  return { exam, meta };
}

export async function generateGrade12SpaceVectorExam(
  examId: string,
  variantNumber = 1
): Promise<GeneratedSpaceVectorExam> {
  const { exam } = await generateStructuredExamServer({
    examId,
    chapter: 'grade12-vectors',
    variantNumber,
  });
  return exam;
}

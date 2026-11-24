import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ThinkingLevel, Type } from '@google/genai';
import mammoth from 'mammoth';
import {
  classifyServerGeminiError,
  createServerGoogleGenAI,
  generateStructuredExamServer,
  runServerGeminiWithRotation,
  SERVER_GEMINI_MODELS,
  ServerGeminiRotationError,
} from './server/grade12VectorsExamGenerator';

const app = express();
// Cấu hình giới hạn payload lớn hơn để nhận file & ảnh Rubik độ phân giải cao
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Phục vụ file app-ads.txt và ads.txt trực tiếp cho AdMob/AdSense
app.get(['/app-ads.txt', '/ads.txt'], (_req, res) => {
  res.type('text/plain');
  res.send('google.com, pub-5320880447374751, DIRECT, f08c47fec0942fa0');
});

const DEFAULT_CHAT_SYSTEM_INSTRUCTION = `Bạn là "EduBot 247" – Trợ lý học tập thông minh chuẩn Chương trình GDPT 2018 dành cho học sinh Việt Nam (Lớp 1 đến Lớp 12).
- Mọi công thức, biến số, ký hiệu Toán – Lý – Hóa – Sinh BẮT BUỘC đặt trong cặp dấu $...$ (nội dòng) hoặc $$...$$ (khối riêng), dùng \\frac thay vì \\dfrac.
- Hóa học dùng 100% danh pháp IUPAC quốc tế mới (Iron, Copper, Sodium hydroxide, Sulfuric acid...).
- Trình bày ngắn gọn, rõ ràng, dễ hiểu, có hướng dẫn bấm máy Casio fx-580VN X / fx-880BTG và lưu ý lỗi sai khi phù hợp.`;

// 1. Server-side Chat & Multimodal Homework Helper (supports multi-key rotation + automatic server key fallback)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userApiKey, apiKeys, file, grade, subject, systemInstruction } = req.body || {};

    const mergedKeys = Array.isArray(apiKeys) && apiKeys.length > 0
      ? apiKeys
      : userApiKey
        ? [{ key: String(userApiKey), label: 'Key cá nhân' }]
        : undefined;

    const contextPrefix =
      grade || subject
        ? `[Học sinh đang học: ${subject || 'Chưa rõ'}, ${grade || 'Chưa rõ'}]\n`
        : '';

    const requestParts: any[] = [];
    if (message && String(message).trim()) {
      requestParts.push({ text: `${contextPrefix}${message}` });
    } else {
      requestParts.push({
        text: `${contextPrefix}Hãy giải và hướng dẫn chi tiết tài liệu/hình ảnh đính kèm giúp mình.`,
      });
    }

    if (file?.data) {
      if (file.type === 'image' || file.type === 'pdf') {
        const splitParts = String(file.data).split(',');
        const base64Data = splitParts[1] || '';
        const mimeMatch = (splitParts[0] || '').match(/data:([^;]+);/);
        const mimeType = mimeMatch ? mimeMatch[1] : file.type === 'pdf' ? 'application/pdf' : 'image/png';
        if (base64Data) {
          requestParts.push({
            inlineData: {
              data: base64Data,
              mimeType,
            },
          });
        }
      } else if (file.type === 'docx') {
        const base64Data = String(file.data).split(',')[1] || '';
        const buffer = Buffer.from(base64Data, 'base64');
        const result = await mammoth.extractRawText({ buffer });
        requestParts.push({
          text: 'Nội dung tài liệu đính kèm (đã trích xuất văn bản):\n\n' + result.value,
        });
      }
    }

    const { data: text, meta } = await runServerGeminiWithRotation(mergedKeys, async (ai, model) => {
      const response = await ai.models.generateContent({
        model,
        contents: { parts: requestParts },
        config: {
          systemInstruction: systemInstruction || DEFAULT_CHAT_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      const out = response.text || '';
      if (!out.trim()) {
        throw new Error('Gemini API không trả về nội dung văn bản.');
      }
      return out;
    });

    return res.json({ text, meta });
  } catch (error: any) {
    if (error instanceof ServerGeminiRotationError) {
      console.warn(`[Chat API] ${error.primaryReason} (${error.httpStatus}): ${error.message}`);
      return res.status(error.httpStatus).json({
        error: error.message,
        reason: error.primaryReason,
        failedKeys: error.failedKeys,
      });
    }
    console.error('Chat API Error:', error);
    const errorMessage = String(error?.message || 'Đã có lỗi xảy ra khi gọi Gemini AI.');
    const kind = classifyServerGeminiError(error);
    const statusCode = kind === 'quota' ? 429 : kind === 'invalid' ? 403 : kind === 'overloaded' ? 503 : 500;
    return res.status(statusCode).json({ error: errorMessage });
  }
});

// 2. Unified Online Exam Generator (All Online Chapters)
app.post(['/api/exams/generate', '/api/exams/grade12-vectors/generate'], async (req, res) => {
  try {
    const { examId, chapter, variantNumber, apiKeys } = req.body || {};
    if (!examId || typeof examId !== 'string') {
      return res.status(400).json({ error: 'Thiếu mã đề thi (examId) hợp lệ.' });
    }

    const safeVariant =
      typeof variantNumber === 'number' && Number.isFinite(variantNumber) && variantNumber >= 1
        ? Math.floor(variantNumber)
        : 1;

    const { exam, meta } = await generateStructuredExamServer({
      examId,
      chapter,
      variantNumber: safeVariant,
      apiKeys,
    });
    return res.json({ exam, meta });
  } catch (error: any) {
    if (error instanceof ServerGeminiRotationError) {
      console.warn(`[Online Exam API] ${error.primaryReason} (${error.httpStatus}): ${error.message}`);
      return res.status(error.httpStatus).json({
        error: error.message,
        reason: error.primaryReason,
        failedKeys: error.failedKeys,
      });
    }
    console.error('Online Exam Generation Error:', error);
    const errorMessage = String(error?.message || 'Đã xảy ra lỗi khi biên soạn đề thi từ Gemini API.');
    const kind = classifyServerGeminiError(error);
    const statusCode = kind === 'quota' ? 429 : kind === 'invalid' ? 403 : kind === 'overloaded' ? 503 : 500;
    return res.status(statusCode).json({ error: errorMessage });
  }
});

// 3. Server-side API Key Connectivity Test (with automatic fallback model on 503 high demand)
app.post('/api/gemini/test-key', async (req, res) => {
  try {
    const rawKey = String(req.body?.apiKey || '').trim();
    if (!rawKey) {
      return res.status(400).json({ ok: false, message: 'Thiếu API Key cần kiểm tra.' });
    }

    const ai = createServerGoogleGenAI(rawKey);
    let lastError: any = null;

    for (const model of SERVER_GEMINI_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: 'Reply with a single word: OK',
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        if (response.text) {
          return res.json({ ok: true, message: 'Kết nối Gemini thành công!' });
        }
      } catch (err: any) {
        lastError = err;
        const kind = classifyServerGeminiError(err);
        if (kind === 'invalid' || kind === 'quota') {
          break;
        }
      }
    }

    if (lastError) {
      throw lastError;
    }
    return res.json({ ok: false, message: 'Gemini không trả về phản hồi.' });
  } catch (error: any) {
    const kind = classifyServerGeminiError(error);
    const message =
      kind === 'quota'
        ? 'Hết quota / 429 (đang tạm nghỉ 60s)'
        : kind === 'invalid'
          ? 'API Key không hợp lệ hoặc không có quyền truy cập'
          : kind === 'overloaded'
            ? 'API Key hợp lệ nhưng Gemini đang quá tải tạm thời (503). Hãy thử lại sau vài giây.'
            : String(error?.message || 'Lỗi kết nối Gemini').slice(0, 180);
    return res.json({ ok: false, kind, message });
  }
});

// 4. Rubik Photo Solver (Multimodal Gemini Vision -> structured move-by-move guide)
const RUBIK_PHOTO_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    detectedCubeType: {
      type: Type.STRING,
      description: 'Loại khối Rubik nhận diện được: ví dụ "Rubik 3x3x3", "Rubik 2x2x2", "Rubik 4x4x4", "Pyraminx", "Skewb".',
    },
    isSupported3x3Simulation: {
      type: Type.BOOLEAN,
      description: 'true nếu là khối 3x3x3 và các bước xoay chính dùng ký hiệu Singmaster chuẩn U/D/L/R/F/B.',
    },
    confidenceSummary: {
      type: Type.STRING,
      description: 'Nhận xét ngắn gọn về độ rõ của ảnh, các mặt nhìn thấy được và màu sắc chủ đạo.',
    },
    orientationGuide: {
      type: Type.STRING,
      description: 'Hướng dẫn rõ ràng cách cầm khối Rubik trên tay trước khi bắt đầu xoay (mặt nào hướng lên trên U, mặt nào hướng về phía người chơi F).',
    },
    detectedFaces: {
      type: Type.ARRAY,
      description: 'Danh sách các mặt nhìn thấy trong ảnh và mô tả màu các ô theo hàng từ trên xuống dưới, trái sang phải.',
      items: {
        type: Type.OBJECT,
        properties: {
          faceLabel: { type: Type.STRING, description: 'Ví dụ: "Mặt Trước (F)", "Mặt Trên (U)", "Mặt Phải (R)".' },
          centerColor: { type: Type.STRING, description: 'Màu tâm: Trắng, Vàng, Đỏ, Cam, Xanh lá, hoặc Xanh dương.' },
          gridColors: {
            type: Type.ARRAY,
            description: 'Mảng các mã màu 1 ký tự (W=Trắng, Y=Vàng, R=Đỏ, O=Cam, G=Xanh lá, B=Xanh dương) theo thứ tự từ trái sang phải, trên xuống dưới (9 ô cho 3x3, 4 ô cho 2x2).',
            items: { type: Type.STRING },
          },
        },
        required: ['faceLabel', 'centerColor', 'gridColors'],
      },
    },
    stages: {
      type: Type.ARRAY,
      description: 'Các giai đoạn giải khối Rubik từ trạng thái hiện tại trong ảnh cho tới khi hoàn thành.',
      items: {
        type: Type.OBJECT,
        properties: {
          stageTitle: { type: Type.STRING, description: 'Tên giai đoạn (ví dụ: "Bước 1: Hoàn thiện chữ thập trắng").' },
          goal: { type: Type.STRING, description: 'Mục tiêu cần đạt ở giai đoạn này.' },
          moves: {
            type: Type.ARRAY,
            description: 'Danh sách từng nước xoay chuẩn Singmaster (chỉ dùng các nước đơn như "R", "R\'", "U", "U\'", "F", "F\'", "L", "L\'", "D", "D\'", "B", "B\'" — nếu cần xoay 180 độ thì tách thành 2 lần hoặc ghi "R2").',
            items: { type: Type.STRING },
          },
          explanation: { type: Type.STRING, description: 'Giải thích cụ thể từng thao tác bằng tiếng Việt dễ hiểu cho học sinh.' },
        },
        required: ['stageTitle', 'goal', 'moves', 'explanation'],
      },
    },
    tips: {
      type: Type.STRING,
      description: 'Mẹo nhỏ khi thực hiện hoặc lưu ý nếu ảnh chưa thấy đủ 6 mặt.',
    },
  },
  required: [
    'detectedCubeType',
    'isSupported3x3Simulation',
    'confidenceSummary',
    'orientationGuide',
    'detectedFaces',
    'stages',
    'tips',
  ],
};

app.post('/api/rubik/solve-photo', async (req, res) => {
  try {
    const { images, cubeTypeHint, apiKeys } = req.body || {};
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Vui lòng chụp hoặc tải lên ít nhất 1 ảnh khối Rubik.' });
    }

    const parts: any[] = [];
    const safeImages = images.slice(0, 6);

    safeImages.forEach((img: { label?: string; dataUrl: string }, idx: number) => {
      if (!img?.dataUrl) return;
      const splitParts = String(img.dataUrl).split(',');
      const base64Data = splitParts[1] || '';
      const mimeMatch = (splitParts[0] || '').match(/data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      if (base64Data) {
        parts.push({ text: `Ảnh #${idx + 1} (${img.label || 'Góc chụp khối Rubik'}):` });
        parts.push({ inlineData: { data: base64Data, mimeType } });
      }
    });

    if (parts.length === 0) {
      return res.status(400).json({ error: 'Dữ liệu ảnh không hợp lệ. Vui lòng chụp lại rõ nét hơn.' });
    }

    parts.push({
      text: `Hãy phân tích kỹ ${safeImages.length} ảnh chụp khối Rubik thực tế của người dùng ở trên.
Gợi ý loại Rubik từ người dùng: ${cubeTypeHint || 'Tự động nhận diện từ ảnh'}.

NHIỆM VỤ:
1. Nhận diện chính xác loại khối Rubik (3x3x3, 2x2x2, 4x4x4, Pyraminx, Skewb...) và đọc đúng màu từng ô (W=Trắng, Y=Vàng, R=Đỏ, O=Cam, G=Xanh lá, B=Xanh dương) trên từng mặt nhìn thấy trong ảnh.
2. Xác định rõ hướng cầm khối Rubik ban đầu (mặt nào hướng lên trên U, mặt nào hướng về phía người chơi F) để học sinh cầm khớp 100% với công thức.
3. Đưa ra lộ trình giải chi tiết từng giai đoạn (stages) với các nước xoay ký hiệu Singmaster chuẩn (ví dụ: R, R', U, U', F, F', L, L', D, D', B, B'). Nếu nhìn thấy chưa đủ cả 6 mặt, hãy giải chính xác phần các mặt nhìn thấy trước (ví dụ hoàn thành tầng 1 / tầng 2 dựa trên các viên đang thấy rõ trong ảnh) và hướng dẫn ngay bước tiếp theo kèm lưu ý chụp đủ 6 mặt nếu cần lời giải tối ưu toàn khối.
4. Viết bằng tiếng Việt dễ hiểu, mạch lạc, thân thiện với học sinh. Trả về đúng JSON theo responseSchema.`,
    });

    const { data: solution, meta } = await runServerGeminiWithRotation(apiKeys, async (ai, model) => {
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          systemInstruction:
            'Bạn là huấn luyện viên Speedcubing WCA chuyên nghiệp, giỏi nhận diện màu sắc và trạng thái khối Rubik qua hình ảnh. Luôn mô tả trung thực những gì quan sát được trong ảnh, đưa ra hướng dẫn cầm khối rõ ràng và chuỗi bước xoay Singmaster chuẩn xác, dễ thực hiện.',
          responseMimeType: 'application/json',
          responseSchema: RUBIK_PHOTO_RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawText = (response.text || '').trim();
      if (!rawText) {
        throw new Error('AI không trả về kết quả phân tích ảnh Rubik.');
      }
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleaned);
    });

    return res.json({ solution, meta });
  } catch (error: any) {
    if (error instanceof ServerGeminiRotationError) {
      console.warn(`[Rubik Photo API] ${error.primaryReason} (${error.httpStatus}): ${error.message}`);
      return res.status(error.httpStatus).json({
        error: error.message,
        reason: error.primaryReason,
        failedKeys: error.failedKeys,
      });
    }
    console.error('Rubik Photo Solver Error:', error);
    const errorMessage = String(error?.message || 'Không thể phân tích ảnh Rubik lúc này.');
    const kind = classifyServerGeminiError(error);
    const statusCode = kind === 'quota' ? 429 : kind === 'invalid' ? 403 : kind === 'overloaded' ? 503 : 500;
    return res.status(statusCode).json({ error: errorMessage });
  }
});

// Shared Global Teams Storage (In-Memory Server-Side Cache for Online Real Data Sync)
let sharedTeams: any[] = [];

// Helper to calculate 10-level rank
function computeServerRank(xp: number): string {
  if (xp >= 25000) return 'Cấp 10: Trạng nguyên EduBot';
  if (xp >= 17000) return 'Cấp 9: Siêu cấp bá khí';
  if (xp >= 12000) return 'Cấp 8: Huyền thoại';
  if (xp >= 8000) return 'Cấp 7: Đại cao thủ';
  if (xp >= 5000) return 'Cấp 6: Danh thủ';
  if (xp >= 3000) return 'Cấp 5: Cao thủ';
  if (xp >= 1500) return 'Cấp 4: Tinh anh';
  if (xp >= 700) return 'Cấp 3: Chuyên gia';
  if (xp >= 300) return 'Cấp 2: Tập sự';
  return 'Cấp 1: Tân thủ';
}

// Get all shared online teams
app.get('/api/teams', (_req, res) => {
  res.json({ teams: sharedTeams });
});

// Reset online teams (clear demo data)
app.post('/api/teams/reset', (_req, res) => {
  sharedTeams = [];
  res.json({ success: true, message: 'Đã reset mới Bảng Xếp Hạng, chuyển về 100% Dữ liệu thật!', teams: sharedTeams });
});

// Create or update a team online
app.post('/api/teams', (req, res) => {
  try {
    const { team } = req.body;
    if (!team || !team.id || !team.name) {
      return res.status(400).json({ error: 'Thông tin Team không hợp lệ.' });
    }

    const existingIndex = sharedTeams.findIndex(t => t.id === team.id || t.joinCode === team.joinCode);
    if (existingIndex >= 0) {
      sharedTeams[existingIndex] = { ...sharedTeams[existingIndex], ...team };
    } else {
      sharedTeams.unshift(team);
    }

    res.json({ success: true, team, teams: sharedTeams });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi lưu Team server.' });
  }
});

// Join team by code online
app.post('/api/teams/join', (req, res) => {
  try {
    const { joinCode, memberName } = req.body;
    if (!joinCode) {
      return res.status(400).json({ error: 'Mã Join Code không được để trống.' });
    }

    const codeUpper = joinCode.trim().toUpperCase();
    const targetTeam = sharedTeams.find(t => t.joinCode.toUpperCase() === codeUpper);

    if (!targetTeam) {
      return res.status(404).json({ error: `Không tìm thấy Team với mã Join Code: "${codeUpper}".` });
    }

    if (targetTeam.members.length >= targetTeam.sizeLimit) {
      return res.status(400).json({ error: `Team "${targetTeam.name}" đã đủ ${targetTeam.sizeLimit} thành viên.` });
    }

    const newMember = {
      id: `m-${Date.now()}`,
      name: memberName || 'Thành viên mới',
      role: 'Thành viên',
      avatar: '🚀',
      contributionXP: 300,
    };

    targetTeam.members.push(newMember);
    targetTeam.totalXP += 300;

    // Recalculate rank (10 Levels)
    targetTeam.rank = computeServerRank(targetTeam.totalXP);

    res.json({ success: true, joinedTeam: targetTeam, teams: sharedTeams });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi gia nhập Team.' });
  }
});


async function startServer() {
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;

// Start server if run directly
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

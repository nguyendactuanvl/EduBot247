import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userApiKey } = req.body;
    
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa có API Key. Cậu hãy nhập API Key của mình để sử dụng nhé.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `VAI TRÒ VÀ SỨ MỆNH
Bạn là "EduBot 247" – Siêu ứng dụng học tập và tra cứu thông minh thế hệ mới dành riêng cho học sinh THCS và THPT Việt Nam (Lớp 6 đến Lớp 12).
Nhiệm vụ của bạn là biến những công thức khô khan của 5 môn học (Toán, Vật lý, Hóa học, Sinh học, Tiếng Anh) thành cẩm nang sống động, chuẩn xác tuyệt đối theo Chương trình GDPT 2018, đồng thời đóng vai trò là một "Gia sư luyện thi bỏ túi" và bạn đồng hành đầy năng lượng của học sinh Gen Z/Alpha.

NGUYÊN TẮC HỌC THUẬT & KỸ THUẬT
1. Chuẩn GDPT 2018 tuyệt đối:
   - Hóa học: Bắt buộc dùng 100% danh pháp IUPAC quốc tế mới (ví dụ: Iron, Copper, Sodium hydroxide, Sulfuric acid, Methane...).
   - Toán - Lý - Sinh: Ký hiệu theo đúng SGK mới nhất; cấu trúc câu hỏi bám sát định dạng thi mới.
   - Toán, Lý, Hóa, Sinh: Mọi biểu thức, phương trình, đơn vị đo phải viết bằng mã LaTeX chuẩn ($ inline $ hoặc $$ block $$).
   - Tiếng Anh: Trình bày rõ cấu trúc ngữ pháp ($S + V + O$), bôi đậm thành phần nhận biết.
2. Tone & Vibe (Phong cách):
   - Nhiệt huyết, hóm hỉnh, thấu hiểu tâm lý tuổi teen như một đàn anh/đàn chị thủ khoa khóa trên; luôn động viên tích cực.

CẤU TRÚC PHẢN HỒI KHI TRA CỨU CÔNG THỨC / CHỦ ĐỀ
Mỗi khi học sinh nhập từ khóa, bạn PHẢI xuất phản hồi theo đúng 8 module sau:

⚡ 1. CÔNG THỨC SPOTLIGHT (Tâm Điểm)
Đặt công thức/cấu trúc cốt lõi trong khối nổi bật, ưu tiên LaTeX trực quan.

📌 2. CHEAT SHEET (Giải Mã Thông Số & Ký Hiệu)
Bảng tra nhanh: Ký hiệu | Ý nghĩa | Đơn vị chuẩn (SI) & Lưu ý đổi đơn vị.

🎛️ 3. INTERACTIVE SANDBOX (Mô Phỏng Trực Quan)
Mô tả ngắn gọn cơ chế biến thiên để học sinh "thấy" được quy luật (ví dụ: Nếu tăng X thì Y thay đổi ra sao).

📟 4. CASIO HACK (Bấm Máy Siêu Tốc)
Hướng dẫn từng bước thao tác bấm phím trên Casio fx-580VN X và Casio fx-880BTG (nếu có thể áp dụng).

🚨 5. RED FLAGS (Bẫy Phòng Thi Kinh Điển)
Chỉ ra 1 - 2 lỗi sai ngớ ngẩn mà học sinh hay mắc khiến mất điểm oan.

🧠 6. BRAIN HACK (Mẹo Nhớ Nhanh & 1-Step Example)
Câu thơ vui, khẩu quyết hoặc từ gợi nhớ (mnemonic). Kèm 1 ví dụ áp dụng ngắn gọn 1-2 dòng.

🎯 7. 1-CLICK QUIZ (Chẩn Đoán Phản Xạ Tức Thì)
Đúng 2 câu hỏi test nhanh (1 trắc nghiệm nhận biết, 1 Đúng/Sai hoặc điền ngắn). Kèm đáp án giải thích siêu ngắn.

🏆 8. STREAK & BADGE (Góc Động Lực)
Một câu khích lệ ngắn kèm "Huy hiệu thành tích" vui nhộn.

CÁC KỊCH BẢN TƯƠNG TÁC ĐẶC BIỆT
- Khi gửi bài tập/ảnh: Nhận diện lỗ hổng, gợi ý sơ đồ 2 bước giải (scaffolding) để học sinh tự làm.
- Sổ Tay Lỗi Sai: Phân tích nguyên nhân sai, tự tạo 1 câu hỏi biến thể để phục thù.
- Tiếng Anh: Bổ sung "Paraphrase & Upgrade" (cấu trúc viết lại câu, collocations xịn).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    const errorMessage = error?.message || '';
    if (errorMessage.includes('API key not valid') || errorMessage.includes('API_KEY_INVALID')) {
      return res.status(400).json({ 
        error: 'Lỗi API Key: API Key của Gemini không hợp lệ hoặc chưa được thiết lập. Bạn vui lòng vào mục Settings (hoặc Secrets) của nền tảng để cấu hình lại GEMINI_API_KEY nhé!' 
      });
    }

    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ 
        error: 'Ôi, có vẻ như "Gia sư" đang bị quá tải do hết lượt tra cứu miễn phí từ Google Gemini (API Quota Exceeded). Cậu hãy thử lại sau ít phút hoặc nâng cấp gói API Key nhé! 😥' 
      });
    }

    res.status(500).json({ error: 'Đã có lỗi xảy ra từ máy chủ khi gọi AI. Cậu thử lại sau nhé!' });
  }
});

async function startServer() {
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

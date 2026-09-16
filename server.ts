import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import mammoth from 'mammoth';

const app = express();
// Cấu hình giới hạn payload lớn hơn để nhận file đính kèm
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userApiKey, file, grade, subject } = req.body;
    
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa có API Key. Cậu hãy nhập API Key của mình để sử dụng nhé.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `VAI TRÒ VÀ SỨ MỆNH
Bạn là "EduBot 247" – Siêu ứng dụng học tập và tra cứu thông minh thế hệ mới dành riêng cho học sinh Việt Nam (Lớp 1 đến Lớp 12).
Học sinh đang hỏi về môn học: ${subject || 'Chưa xác định'}, Khối lớp: ${grade || 'Chưa xác định'}.
Nhiệm vụ của bạn là biến những công thức khô khan của các môn học thành cẩm nang sống động, chuẩn xác tuyệt đối theo Chương trình GDPT 2018, đồng thời đóng vai trò là một "Gia sư luyện thi bỏ túi" và bạn đồng hành đầy năng lượng của học sinh.

NGUYÊN TẮC HỌC THUẬT & KỸ THUẬT
1. Chuẩn GDPT 2018 tuyệt đối:
   - Hóa học: Bắt buộc dùng 100% danh pháp IUPAC quốc tế mới (ví dụ: Iron, Copper, Sodium hydroxide, Sulfuric acid, Methane...).
   - Toán - Lý - Sinh: Ký hiệu theo đúng SGK mới nhất; cấu trúc câu hỏi bám sát định dạng thi mới.
   - Toán, Lý, Hóa, Sinh: Mọi biểu thức, phương trình, đơn vị đo phải viết bằng mã LaTeX chuẩn ($ inline $ hoặc $$ block $$).
   - Tiếng Anh: Trình bày rõ cấu trúc ngữ pháp ($S + V + O$), bôi đậm thành phần nhận biết.
2. Tone & Vibe (Phong cách):
   - Nhiệt huyết, hóm hỉnh, thấu hiểu tâm lý tuổi teen như một đàn anh/đàn chị thủ khoa khóa trên; luôn động viên tích cực.

CẤU TRÚC PHẢN HỒI KHI TRA CỨU CÔNG THỨC / CHỦ ĐỀ
Mỗi khi học sinh nhập từ khóa, bạn PHẢI xuất phản hồi theo đúng 8 module sau (nếu phù hợp với câu hỏi hoặc bài tập đưa ra):

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
- Khi gửi bài tập/ảnh: Nhận diện lỗ hổng, giải bài tập và gợi ý sơ đồ 2 bước giải (scaffolding) để học sinh hiểu cách tự làm.
- Sổ Tay Lỗi Sai: Phân tích nguyên nhân sai, tự tạo 1 câu hỏi biến thể để phục thù.
- Tiếng Anh: Bổ sung "Paraphrase & Upgrade" (cấu trúc viết lại câu, collocations xịn).`;

    const requestParts: any[] = [];
    if (message) {
      requestParts.push(message);
    } else {
      requestParts.push("Hãy giải và hướng dẫn chi tiết tài liệu/bài tập đính kèm giúp tớ.");
    }

    if (file) {
      if (file.type === 'image' || file.type === 'pdf') {
        const base64Data = file.data.split(',')[1];
        const mimeType = file.data.split(';')[0].split(':')[1];
        requestParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      } else if (file.type === 'docx') {
        const base64Data = file.data.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const result = await mammoth.extractRawText({ buffer });
        requestParts.push("Nội dung tài liệu đính kèm (đã trích xuất văn bản):\n\n" + result.value);
      }
    }

    const generateEducationalImageTool = {
      functionDeclarations: [
        {
          name: "generateEducationalImage",
          description: "Tạo một bức ảnh minh họa chuyên nghiệp hoặc hình vẽ liên quan đến bài học, khoa học, thực tế đời sống mà học sinh yêu cầu.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              prompt: {
                type: Type.STRING,
                description: "Mô tả chi tiết bằng tiếng Anh của bức ảnh cần tạo. Có thể thêm các từ khóa như 'photorealistic', 'educational diagram', 'high quality'."
              }
            },
            required: ["prompt"]
          }
        }
      ]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: requestParts,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [generateEducationalImageTool]
      }
    });

    let finalResponseText = response.text || "";

    if (response.functionCalls && response.functionCalls.length > 0) {
       const call = response.functionCalls.find((c: any) => c.name === 'generateEducationalImage');
       if (call) {
          try {
             const imgPrompt = call.args.prompt;
             const imgResponse = await ai.models.generateContent({
                model: 'gemini-3.1-flash-image',
                contents: imgPrompt,
                config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
             });
             
             let base64 = "";
             for (const part of imgResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                   base64 = part.inlineData.data;
                   break;
                }
             }
             if (base64) {
                 finalResponseText = "Tớ đã tạo xong bức ảnh minh họa cho cậu rồi đây! 🎨\n\n![Ảnh minh họa](data:image/png;base64," + base64 + ")\n\n" + finalResponseText;
             }
          } catch (imgError) {
             console.error("Lỗi khi tạo ảnh:", imgError);
             finalResponseText = "Rất tiếc, đã có sự cố khi tạo ảnh minh họa cho cậu. Cậu thử lại sau nhé!\n\n" + finalResponseText;
          }
       }
    }

    res.json({ text: finalResponseText });
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

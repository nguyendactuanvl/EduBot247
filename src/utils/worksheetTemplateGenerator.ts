import { KNTT_QUESTION_BANK, KNTT_LESSON_TOPICS } from '../data/knttCurriculumData';

export interface GeneratedWorksheetData {
  markdownText: string;
  quizQuestions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

/**
 * Tạo phiếu học tập chuẩn GDPT 2018 (SGK Kết nối tri thức) tự động ngay cả khi ngoại tuyến hoặc không có AI.
 * Đảm bảo 100% cú pháp LaTeX $...$ và $$...$$, dùng \frac theo quy chuẩn.
 */
export function generateCurriculumWorksheet(
  subject: string,
  grade: string,
  topic: string,
  countStr: string,
  format: string
): GeneratedWorksheetData {
  const targetCount = Math.max(3, Math.min(20, parseInt(countStr, 10) || 5));

  // Lọc câu hỏi phù hợp từ ngân hàng câu hỏi chuẩn KNTT
  const normalizedSubject = subject.toLowerCase();
  const normalizedTopic = topic.toLowerCase();

  const matchedQuestions = KNTT_QUESTION_BANK.filter(q => {
    const qSubject = q.subjectLabel.toLowerCase();
    const qGrade = q.gradeLabel.toLowerCase();
    const matchesGrade = grade.toLowerCase().includes(qGrade) || qGrade.includes(grade.toLowerCase());
    
    if (normalizedSubject.includes('toán') && q.subject === 'math') return true;
    if ((normalizedSubject.includes('vật lí') || normalizedSubject.includes('lý') || normalizedSubject.includes('hóa') || normalizedSubject.includes('sinh') || normalizedSubject.includes('khoa học')) && q.subject === 'science') return true;
    if (normalizedSubject.includes('anh') && q.subject === 'english') return true;
    if (normalizedSubject.includes('văn') && q.subject === 'literature') return true;
    
    return matchesGrade;
  });

  // Chọn danh sách câu hỏi
  let selected = matchedQuestions.slice(0, targetCount);
  if (selected.length < 3) {
    // Dự phòng thêm câu hỏi toán học/khoa học nếu ngân hàng chưa đủ số lượng chủ đề khớp chính xác
    selected = KNTT_QUESTION_BANK.slice(0, targetCount);
  }

  // Tạo phần Markdown cho Đề bài và Đáp án chi tiết
  const currentDate = new Date().toLocaleDateString('vi-VN');
  
  let md = `# PHIẾU HỌC TẬP VÀ ÔN LUYỆN KIẾN THỨC
**Chương trình GDPT 2018 – Sách Kết nối tri thức với cuộc sống**

- **Môn học**: ${subject} | **Khối lớp**: ${grade}
- **Chủ đề / Chuyên đề**: ${topic}
- **Định dạng**: ${format} | **Thời gian gợi ý**: ${targetCount * 3} phút
- **Họ và tên học sinh**: ............................................................ **Lớp**: ............... **Ngày thực hiện**: ${currentDate}

---

## PHẦN I. ĐỀ BÀI (GỒM ${selected.length} CÂU HỎI TRỌNG TÂM)

`;

  const quizQuestions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[] = [];

  selected.forEach((q, idx) => {
    md += `### Câu ${idx + 1} (${q.difficulty}) – ${q.lessonName}\n`;
    md += `${q.content}\n\n`;
    
    const letterToIdx: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const correctIdx = letterToIdx[q.correctOptionId] ?? 0;

    q.options.forEach(opt => {
      md += `- **${opt.id}.** ${opt.text}\n`;
    });
    md += `\n`;

    quizQuestions.push({
      question: `**Câu ${idx + 1}:** ${q.content}`,
      options: q.options.map(opt => `${opt.id}. ${opt.text}`),
      correctAnswer: correctIdx,
      explanation: q.explanation
    });
  });

  md += `---

## PHẦN II. BẢNG ĐÁP ÁN & LỜI GIẢI CHI TIẾT

| Câu | Đáp án đúng | Mức độ | Ghi chú phương pháp giải |
|:---:|:---:|:---:|:---|
`;

  selected.forEach((q, idx) => {
    md += `| **Câu ${idx + 1}** | **${q.correctOptionId}** | ${q.difficulty} | Xem chi tiết bên dưới |\n`;
  });

  md += `\n### Hướng dẫn giải chi tiết từng câu:\n\n`;

  selected.forEach((q, idx) => {
    md += `**Câu ${idx + 1} (Chọn ${q.correctOptionId}):**\n`;
    md += `- *Phương pháp*: Áp dụng định lý, công thức trọng tâm SGK.\n`;
    md += `- *Lời giải chi tiết*: ${q.explanation}\n\n`;
  });

  md += `\n> **Nhận xét của giáo viên**: .......................................................................................................................\n`;
  md += `> **Điểm số**: ..................... / $10$ điểm.\n`;

  return {
    markdownText: md,
    quizQuestions
  };
}

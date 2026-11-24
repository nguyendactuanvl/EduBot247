import React from 'react';
import { ExamPaper } from './TriangleTrigExams';
import { StaticExamRunner } from './StaticExamRunner';

export const GRADE12_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'g12-1',
    title: 'Đề số 1: Tính đơn điệu và cực trị của hàm số',
    durationMinutes: 45,
    description: '12 câu Trắc nghiệm trọng tâm Chương I Toán 12',
    questionsPart1: [
      {
        id: 'g12-1-q1',
        type: 'mcq',
        number: 1,
        question: 'Cho hàm số $y = x^3 - 3x + 2$. Hàm số đồng biến trên khoảng nào dưới đây?',
        options: [
          { id: 'A', text: '$(-1; 1)$' },
          { id: 'B', text: '$(-\\infty; -1)$ và $(1; +\\infty)$' },
          { id: 'C', text: '$(-\\infty; +\\infty)$' },
          { id: 'D', text: '$(-1; +\\infty)$' },
        ],
        correctOption: 'B',
        explanation: 'Ta có $y\' = 3x^2 - 3 > 0 \\Leftrightarrow x < -1$ hoặc $x > 1$. Vậy hàm số đồng biến trên $(-\\infty; -1)$ và $(1; +\\infty)$.',
      },
      {
        id: 'g12-1-q2',
        type: 'mcq',
        number: 2,
        question: 'Cho hàm số $y = \\frac{x+1}{x-2}$. Khẳng định nào sau đây đúng?',
        options: [
          { id: 'A', text: 'Hàm số đồng biến trên $\\mathbb{R} \\setminus \\{2\\}$' },
          { id: 'B', text: 'Hàm số nghịch biến trên từng khoảng xác định $(-\\infty; 2)$ và $(2; +\\infty)$' },
          { id: 'C', text: 'Hàm số đồng biến trên từng khoảng xác định' },
          { id: 'D', text: 'Hàm số nghịch biến trên $\\mathbb{R}$' },
        ],
        correctOption: 'B',
        explanation: 'Tập xác định $D = \\mathbb{R} \\setminus \\{2\\}$ và $y\' = \\frac{-3}{(x-2)^2} < 0$ với mọi $x \\neq 2$, nên hàm số nghịch biến trên từng khoảng xác định.',
      },
      {
        id: 'g12-1-q3',
        type: 'mcq',
        number: 3,
        question: 'Cho hàm số $y = x^4 - 2x^2 + 3$. Số điểm cực trị của hàm số đã cho là:',
        options: [
          { id: 'A', text: '$1$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$3$' },
          { id: 'D', text: '$0$' },
        ],
        correctOption: 'C',
        explanation: 'Ta có $y\' = 4x^3 - 4x = 4x(x^2 - 1) = 0 \\Leftrightarrow x \\in \\{-1; 0; 1\\}$. Đạo hàm đổi dấu qua cả $3$ điểm nên có $3$ điểm cực trị.',
      },
      {
        id: 'g12-1-q4',
        type: 'mcq',
        number: 4,
        question: 'Giá trị cực đại của hàm số $y = -x^3 + 3x - 2$ bằng:',
        options: [
          { id: 'A', text: '$0$' },
          { id: 'B', text: '$-4$' },
          { id: 'C', text: '$-2$' },
          { id: 'D', text: '$2$' },
        ],
        correctOption: 'A',
        explanation: 'Ta có $y\' = -3x^2 + 3 = 0 \\Leftrightarrow x = \\pm 1$. Hàm số đạt cực đại tại $x = 1$ với $y_{\\text{CĐ}} = y(1) = 0$.',
      },
      {
        id: 'g12-1-q5',
        type: 'mcq',
        number: 5,
        question: 'Điểm cực tiểu của đồ thị hàm số $y = x^3 - 3x^2 + 2$ là:',
        options: [
          { id: 'A', text: '$(2; -2)$' },
          { id: 'B', text: '$(0; 2)$' },
          { id: 'C', text: '$(2; 0)$' },
          { id: 'D', text: '$(-2; -22)$' },
        ],
        correctOption: 'A',
        explanation: 'Ta có $y\' = 3x^2 - 6x = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Hàm số đạt cực tiểu tại $x = 2$, $y(2) = -2 \\implies$ điểm cực tiểu là $(2; -2)$.',
      },
      {
        id: 'g12-1-q6',
        type: 'mcq',
        number: 6,
        question: 'Cho hàm số $y = \\frac{1}{3}x^3 - 2x^2 + 3x + 1$. Tổng hoành độ các điểm cực trị của đồ thị hàm số bằng:',
        options: [
          { id: 'A', text: '$4$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$-4$' },
          { id: 'D', text: '$0$' },
        ],
        correctOption: 'A',
        explanation: 'Ta có $y\' = x^2 - 4x + 3 = 0$ có hai nghiệm phân biệt $x_1 = 1, x_2 = 3$, suy ra $x_1 + x_2 = 4$.',
      },
      {
        id: 'g12-1-q7',
        type: 'mcq',
        number: 7,
        question: 'Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = x^3 - 3mx^2 + 3m^2x$ đồng biến trên khoảng $(-\\infty; +\\infty)$.',
        options: [
          { id: 'A', text: '$m = 0$' },
          { id: 'B', text: '$m \\in \\mathbb{R}$' },
          { id: 'C', text: '$m \\neq 0$' },
          { id: 'D', text: '$m > 0$' },
        ],
        correctOption: 'B',
        explanation: 'Ta có $y\' = 3x^2 - 6mx + 3m^2 = 3(x - m)^2 \\ge 0$ với mọi $x \\in \\mathbb{R}$ và dấu bằng chỉ xảy ra tại $x = m$, nên hàm số luôn đồng biến với mọi $m \\in \\mathbb{R}$.',
      },
      {
        id: 'g12-1-q8',
        type: 'mcq',
        number: 8,
        question: 'Cho hàm số $y = x^3 - 3x^2 - 9x + 5$. Hàm số nghịch biến trên khoảng nào dưới đây?',
        options: [
          { id: 'A', text: '$(-1; 3)$' },
          { id: 'B', text: '$(-\\infty; -1)$' },
          { id: 'C', text: '$(3; +\\infty)$' },
          { id: 'D', text: '$(-\\infty; 1)$' },
        ],
        correctOption: 'A',
        explanation: 'Ta có $y\' = 3x^2 - 6x - 9 = 3(x + 1)(x - 3) < 0 \\Leftrightarrow -1 < x < 3$.',
      },
      {
        id: 'g12-1-q9',
        type: 'mcq',
        number: 9,
        question: 'Hàm số $y = \\frac{x^2 - 2x}{x+1}$ có bao nhiêu điểm cực trị?',
        options: [
          { id: 'A', text: '$0$' },
          { id: 'B', text: '$1$' },
          { id: 'C', text: '$2$' },
          { id: 'D', text: '$3$' },
        ],
        correctOption: 'C',
        explanation: 'Ta có $y\' = \\frac{x^2 + 2x - 2}{(x+1)^2} = 0 \\Leftrightarrow x = -1 \\pm \\sqrt{3}$ (đều khác $-1$), đạo hàm đổi dấu qua $2$ điểm nên có $2$ điểm cực trị.',
      },
      {
        id: 'g12-1-q10',
        type: 'mcq',
        number: 10,
        question: 'Cho hàm số $y = x^3 - 3mx^2 + 3(m^2 - 1)x$. Để hàm số có hai điểm cực trị thì $m$ thỏa mãn điều kiện nào?',
        options: [
          { id: 'A', text: '$m \\in \\mathbb{R}$' },
          { id: 'B', text: 'Không tồn tại $m$' },
          { id: 'C', text: '$m \\neq 0$' },
          { id: 'D', text: '$m > 0$' },
        ],
        correctOption: 'A',
        explanation: 'Ta có $y\' = 3x^2 - 6mx + 3(m^2 - 1) = 3\\left[x^2 - 2mx + (m^2 - 1)\\right]$. Biệt thức rút gọn $\\Delta\' = m^2 - (m^2 - 1) = 1 > 0$ với mọi $m \\in \\mathbb{R}$, nên hàm số luôn có hai điểm cực trị với mọi $m \\in \\mathbb{R}$.',
      },
      {
        id: 'g12-1-q11',
        type: 'mcq',
        number: 11,
        question: 'Giá trị cực tiểu của hàm số $y = x^3 - 3x + 4$ là:',
        options: [
          { id: 'A', text: '$2$' },
          { id: 'B', text: '$4$' },
          { id: 'C', text: '$0$' },
          { id: 'D', text: '$6$' },
        ],
        correctOption: 'A',
        explanation: 'Ta có $y\' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Hàm số đạt cực tiểu tại $x = 1$ với $y_{\\text{CT}} = y(1) = 2$.',
      },
      {
        id: 'g12-1-q12',
        type: 'mcq',
        number: 12,
        question: 'Cho hàm số $y = -x^4 + 4x^2 + 1$. Số điểm cực trị của hàm số là:',
        options: [
          { id: 'A', text: '$1$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$3$' },
          { id: 'D', text: '$4$' },
        ],
        correctOption: 'C',
        explanation: 'Hàm trùng phương có $a = -1, b = 4 \\implies ab = -4 < 0$ nên hàm số có $3$ điểm cực trị.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'g12-2',
    title: 'Đề số 2: Giá trị lớn nhất và nhỏ nhất của hàm số',
    durationMinutes: 45,
    description: 'Tìm GTLN – GTNN của hàm số trên đoạn và khoảng',
    questionsPart1: [
      {
        id: 'g12-2-q1',
        type: 'mcq',
        number: 1,
        question: 'Giá trị lớn nhất của hàm số $y = x^3 - 3x + 2$ trên đoạn $[0; 2]$ bằng:',
        options: [
          { id: 'A', text: '$4$' },
          { id: 'B', text: '$0$' },
          { id: 'C', text: '$2$' },
          { id: 'D', text: '$6$' },
        ],
        correctOption: 'A',
        explanation: 'Ta có $y\' = 3x^2 - 3 = 0 \\implies x = 1 \\in [0; 2]$. Tính $y(0) = 2, y(1) = 0, y(2) = 4$. Vậy $\\max_{[0; 2]} y = 4$.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'g12-3',
    title: 'Đề số 3: Đường tiệm cận của đồ thị hàm số',
    durationMinutes: 45,
    description: 'Tiệm cận đứng, tiệm cận ngang và tiệm cận xiên',
    questionsPart1: [
      {
        id: 'g12-3-q1',
        type: 'mcq',
        number: 1,
        question: 'Tiệm cận đứng của đồ thị hàm số $y = \\frac{2x - 1}{x + 2}$ là đường thẳng:',
        options: [
          { id: 'A', text: '$x = 2$' },
          { id: 'B', text: '$x = -2$' },
          { id: 'C', text: '$y = 2$' },
          { id: 'D', text: '$y = -2$' },
        ],
        correctOption: 'B',
        explanation: 'Nghiệm của mẫu số là $x = -2$ (không là nghiệm tử số) nên đường thẳng $x = -2$ là tiệm cận đứng.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'g12-4',
    title: 'Đề số 4: Khảo sát sự biến thiên và vẽ đồ thị hàm số',
    durationMinutes: 45,
    description: 'Nhận dạng đồ thị và tương giao đồ thị hàm số',
    questionsPart1: [
      {
        id: 'g12-4-q1',
        type: 'mcq',
        number: 1,
        question: 'Đồ thị hàm số $y = x^4 - 2x^2 - 3$ cắt trục hoành tại bao nhiêu điểm?',
        options: [
          { id: 'A', text: '$1$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$3$' },
          { id: 'D', text: '$4$' },
        ],
        correctOption: 'B',
        explanation: 'Phương trình hoành độ giao điểm $x^4 - 2x^2 - 3 = 0 \\Leftrightarrow (x^2 - 3)(x^2 + 1) = 0 \\Leftrightarrow x = \\pm \\sqrt{3}$. Có đúng $2$ giao điểm.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'g12-5',
    title: 'Đề số 5: Ôn tập Chương I – Ứng dụng đạo hàm',
    durationMinutes: 45,
    description: 'Tổng hợp tính đơn điệu, cực trị, GTLN–GTNN và tiệm cận',
    questionsPart1: [
      {
        id: 'g12-5-q1',
        type: 'mcq',
        number: 1,
        question: 'Giá trị nhỏ nhất của hàm số $y = x^3 - 3x + 2$ trên đoạn $[0; 2]$ bằng:',
        options: [
          { id: 'A', text: '$0$' },
          { id: 'B', text: '$4$' },
          { id: 'C', text: '$-2$' },
          { id: 'D', text: '$2$' },
        ],
        correctOption: 'A',
        explanation: 'So sánh $y(0) = 2, y(1) = 0, y(2) = 4$, suy ra $\\min_{[0; 2]} y = 0$ tại $x = 1$.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
];

interface Grade12ExamsProps {
  onBack?: () => void;
}

export const Grade12Exams: React.FC<Grade12ExamsProps> = ({ onBack }) => {
  return (
    <StaticExamRunner
      heading="Ôn thi THPT Online – Lớp 12: Chương I · Ứng dụng đạo hàm khảo sát hàm số"
      subheading="Luyện tập trực tuyến chuẩn KaTeX – Đáp án và lời giải chi tiết hiển thị sau khi nộp bài."
      gradeLabel="Toán 12 · Chương I (KNTT)"
      papers={GRADE12_EXAM_PAPERS}
      storagePrefix="edubot_g12_calculus"
      onBack={onBack}
    />
  );
};

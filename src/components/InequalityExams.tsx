import React from 'react';
import { ExamPaper } from './TriangleTrigExams';
import { StaticExamRunner } from './StaticExamRunner';

export const INEQUALITY_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'ineq-1',
    title: 'Đề số 1: Bất phương trình bậc nhất hai ẩn (Phần 1)',
    durationMinutes: 45,
    description: 'Nhận diện bất phương trình bậc nhất hai ẩn và kiểm tra nghiệm',
    questionsPart1: [
      {
        id: 'i1-q1',
        type: 'mcq',
        number: 1,
        question: 'Bất phương trình nào sau đây là bất phương trình bậc nhất hai ẩn?',
        options: [
          { id: 'A', text: '$x^2 + y > 3$' },
          { id: 'B', text: '$2x - 3y \\le 5$' },
          { id: 'C', text: '$xy + y < 1$' },
          { id: 'D', text: '$x^2 + y^2 \\le 4$' },
        ],
        correctOption: 'B',
        explanation: 'Bất phương trình bậc nhất hai ẩn có dạng $ax + by \\le c$ (hoặc $<, >, \\ge$) với $a, b$ không đồng thời bằng $0$. Chỉ có $2x - 3y \\le 5$ thỏa mãn.',
      },
      {
        id: 'i1-q2',
        type: 'mcq',
        number: 2,
        question: 'Cặp số $(2; 3)$ là nghiệm của bất phương trình nào sau đây?',
        options: [
          { id: 'A', text: '$x + y < 3$' },
          { id: 'B', text: '$2x - y > 3$' },
          { id: 'C', text: '$x - 3y + 8 \\ge 0$' },
          { id: 'D', text: '$3x - y < 2$' },
        ],
        correctOption: 'C',
        explanation: 'Thay $x = 2, y = 3$ vào phương án C: $2 - 3(3) + 8 = 1 \\ge 0$ (Đúng).',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'ineq-2',
    title: 'Đề số 2: Bất phương trình bậc nhất hai ẩn (Phần 2)',
    durationMinutes: 45,
    description: 'Kiểm tra cặp số thuộc miền nghiệm bất phương trình',
    questionsPart1: [
      {
        id: 'i2-q1',
        type: 'mcq',
        number: 1,
        question: 'Cặp số $(1; 1)$ là nghiệm của bất phương trình nào sau đây?',
        options: [
          { id: 'A', text: '$x + y > 2$' },
          { id: 'B', text: '$2x - y < 0$' },
          { id: 'C', text: '$x - y \\ge 0$' },
          { id: 'D', text: '$x + 2y < 3$' },
        ],
        correctOption: 'C',
        explanation: 'Với $(1; 1)$, ta có $1 - 1 = 0 \\ge 0$ (Đúng).',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'ineq-3',
    title: 'Đề số 3: Miền nghiệm bất phương trình bậc nhất hai ẩn',
    durationMinutes: 45,
    description: 'Biểu diễn miền nghiệm trên mặt phẳng tọa độ $Oxy$',
    questionsPart1: [
      {
        id: 'i3-q1',
        type: 'mcq',
        number: 1,
        question: 'Miền nghiệm của bất phương trình $x + y \\le 2$ chứa điểm nào sau đây?',
        options: [
          { id: 'A', text: '$(1; 2)$' },
          { id: 'B', text: '$(2; 1)$' },
          { id: 'C', text: '$(1; 1)$' },
          { id: 'D', text: '$(2; 2)$' },
        ],
        correctOption: 'C',
        explanation: 'Thay $(1; 1)$ vào bất phương trình: $1 + 1 = 2 \\le 2$ (Đúng).',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'ineq-4',
    title: 'Đề số 4: Hệ bất phương trình bậc nhất hai ẩn & Ứng dụng',
    durationMinutes: 45,
    description: 'Tìm miền nghiệm và giá trị lớn nhất, nhỏ nhất của biểu thức $F(x; y)$',
    questionsPart1: [
      {
        id: 'i4-q1',
        type: 'mcq',
        number: 1,
        question: 'Miền nghiệm của hệ $\\begin{cases} x \\ge 0 \\\\ y \\ge 0 \\\\ x + y \\le 5 \\end{cases}$ chứa bao nhiêu điểm có tọa độ nguyên?',
        options: [
          { id: 'A', text: '$15$' },
          { id: 'B', text: '$21$' },
          { id: 'C', text: '$18$' },
          { id: 'D', text: '$12$' },
        ],
        correctOption: 'B',
        explanation: 'Với mỗi $x \\in \\{0; 1; 2; 3; 4; 5\\}$, số giá trị nguyên của $y \\in [0; 5 - x]$ là $6 - x$. Tổng số điểm nguyên là $6 + 5 + 4 + 3 + 2 + 1 = 21$.',
      },
    ],
    questionsPart2: [
      {
        id: 'i4-q13',
        type: 'true_false',
        number: 2,
        question: 'Cho hệ bất phương trình $\\begin{cases} x \\ge 0, y \\ge 0 \\\\ 2x + y \\le 6 \\\\ x + 2y \\le 6 \\end{cases}$.',
        statements: [
          { id: 'a', text: 'Miền nghiệm của hệ là một miền tứ giác.', correct: true },
          { id: 'b', text: 'Các đỉnh của miền nghiệm gồm $(0; 0), (3; 0), (0; 3)$ và $(2; 2)$.', correct: true },
          { id: 'c', text: 'Giá trị lớn nhất của $F = x + y$ trên miền nghiệm là $4$.', correct: true },
          { id: 'd', text: 'Điểm $(2; 2)$ thuộc miền nghiệm của hệ.', correct: true },
        ],
        explanation: 'Cả $4$ mệnh đề a, b, c, d đều đúng; tại đỉnh $(2; 2)$ ta có $F = 2 + 2 = 4$ là lớn nhất.',
      },
    ],
    questionsPart3: [
      {
        id: 'i4-q17',
        type: 'short',
        number: 3,
        question: 'Tìm giá trị nhỏ nhất của biểu thức $F = x + y$ trên miền nghiệm của hệ $\\begin{cases} x \\ge 0 \\\\ y \\ge 0 \\\\ x + 2y \\ge 4 \\\\ 2x + y \\ge 4 \\end{cases}$ (làm tròn đến hàng phần trăm).',
        correctAnswer: '2.67',
        acceptableAnswers: ['8/3', '2.67', '2,67'],
        explanation: 'Các điểm cực biên là $(0; 4)$, $(4; 0)$ và giao điểm $\\left(\\frac{4}{3}; \\frac{4}{3}\\right)$. Giá trị nhỏ nhất là $F = \\frac{8}{3} \\approx 2,67$.',
      },
    ],
  },
  {
    id: 'ineq-5',
    title: 'Đề số 5: Tổng hợp Chương II – Bất phương trình & Hệ BPT bậc nhất hai ẩn',
    durationMinutes: 45,
    description: 'Ôn tập toàn diện 3 phần Trắc nghiệm, Đúng/Sai và Trả lời ngắn',
    questionsPart1: [
      {
        id: 'i5-q1',
        type: 'mcq',
        number: 1,
        question: 'Bất phương trình nào dưới đây **không phải** là bất phương trình bậc nhất hai ẩn?',
        options: [
          { id: 'A', text: '$2x + y > 3$' },
          { id: 'B', text: '$x - 3y \\le 0$' },
          { id: 'C', text: '$x^2 + y < 4$' },
          { id: 'D', text: '$-x + 5y \\ge -2$' },
        ],
        correctOption: 'C',
        explanation: 'Bất phương trình $x^2 + y < 4$ chứa bậc hai theo $x$ nên không phải bậc nhất hai ẩn.',
      },
    ],
    questionsPart2: [
      {
        id: 'i5-q13',
        type: 'true_false',
        number: 2,
        question: 'Cho bất phương trình $2x - 3y + 6 < 0$.',
        statements: [
          { id: 'a', text: 'Cặp số $(0; 0)$ là một nghiệm của bất phương trình.', correct: false },
          { id: 'b', text: 'Đường thẳng $2x - 3y + 6 = 0$ đi qua $(0; 2)$ và $(-3; 0)$.', correct: true },
          { id: 'c', text: 'Điểm $M(1; 3)$ thuộc miền nghiệm của bất phương trình.', correct: true },
          { id: 'd', text: 'Miền nghiệm không kể đường thẳng biên $2x - 3y + 6 = 0$.', correct: true },
        ],
        explanation: 'a) Sai vì $2(0) - 3(0) + 6 = 6 > 0$. b) Đúng. c) Đúng vì $2(1) - 3(3) + 6 = -1 < 0$. d) Đúng vì dấu bất đẳng thức nghiêm ngặt ($<$).',
      },
    ],
    questionsPart3: [
      {
        id: 'i5-q17',
        type: 'short',
        number: 3,
        question: 'Cho bất phương trình $x - my \\ge 1$. Tìm giá trị nguyên nhỏ nhất của $m$ để điểm $M(2; -1)$ thuộc miền nghiệm của bất phương trình.',
        correctAnswer: '-1',
        acceptableAnswers: ['-1'],
        explanation: 'Điểm $M(2; -1)$ thuộc miền nghiệm khi và chỉ khi $2 - m(-1) \\ge 1 \\Leftrightarrow 2 + m \\ge 1 \\Leftrightarrow m \\ge -1$. Vậy giá trị nguyên nhỏ nhất của $m$ là $-1$.',
      },
    ],
  },
];

interface InequalityExamsProps {
  onBack?: () => void;
}

export const InequalityExams: React.FC<InequalityExamsProps> = ({ onBack }) => {
  return (
    <StaticExamRunner
      heading="Ôn thi THPT Online – Lớp 10: Chương II · Bất phương trình & Hệ BPT bậc nhất hai ẩn"
      subheading="Hỗ trợ đầy đủ 3 phần Trắc nghiệm, Đúng/Sai và Trả lời ngắn – Đáp án hiển thị sau khi nộp bài."
      gradeLabel="Toán 10 · Chương II (KNTT)"
      papers={INEQUALITY_EXAM_PAPERS}
      storagePrefix="edubot_g10_ineq"
      onBack={onBack}
    />
  );
};

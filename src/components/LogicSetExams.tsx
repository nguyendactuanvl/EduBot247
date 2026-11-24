import React from 'react';
import { ExamPaper } from './TriangleTrigExams';
import { StaticExamRunner } from './StaticExamRunner';

export const LOGIC_SET_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'logic-1',
    title: 'Đề số 1: Mệnh đề (Phần 1)',
    durationMinutes: 45,
    description: 'Nhận biết mệnh đề, tính đúng sai và mệnh đề phủ định',
    questionsPart1: [
      {
        id: 'l1-q1',
        type: 'mcq',
        number: 1,
        question: 'Trong các câu sau, câu nào là mệnh đề?',
        options: [
          { id: 'A', text: 'Bạn có chăm chỉ học tập không?' },
          { id: 'B', text: 'Hãy giải phương trình này!' },
          { id: 'C', text: 'Số $2026$ là một số chẵn.' },
          { id: 'D', text: 'Xinh quá đi mất!' },
        ],
        correctOption: 'C',
        explanation: 'Câu C là một câu khẳng định có thể xác định được tính đúng hoặc sai nên là mệnh đề.',
      },
      {
        id: 'l1-q2',
        type: 'mcq',
        number: 2,
        question: 'Cho mệnh đề $P$: "Phương trình $x^2 + 1 = 0$ có nghiệm thực". Mệnh đề phủ định của $P$ là:',
        options: [
          { id: 'A', text: '$\\overline{P}$: "Phương trình $x^2 + 1 = 0$ có hai nghiệm thực".' },
          { id: 'B', text: '$\\overline{P}$: "Phương trình $x^2 + 1 = 0$ có nghiệm nguyên".' },
          { id: 'C', text: '$\\overline{P}$: "Phương trình $x^2 + 1 = 0$ không có nghiệm thực".' },
          { id: 'D', text: '$\\overline{P}$: "Phương trình $x^2 + 1 = 0$ có nghiệm dương".' },
        ],
        correctOption: 'C',
        explanation: 'Phủ định của "có nghiệm thực" là "không có nghiệm thực".',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'logic-2',
    title: 'Đề số 2: Mệnh đề kéo theo & Mệnh đề đảo',
    durationMinutes: 45,
    description: 'Mệnh đề kéo theo, mệnh đề đảo và mệnh đề tương đương',
    questionsPart1: [
      {
        id: 'l2-q1',
        type: 'mcq',
        number: 1,
        question: 'Mệnh đề nào sau đây có mệnh đề đảo **đúng**?',
        options: [
          { id: 'A', text: 'Nếu số nguyên $a$ tận cùng bằng $0$ thì $a$ chia hết cho $5$.' },
          { id: 'B', text: 'Nếu hai tam giác bằng nhau thì diện tích của chúng bằng nhau.' },
          { id: 'C', text: 'Nếu $a = b$ thì $a^2 = b^2$.' },
          { id: 'D', text: 'Nếu một tứ giác là hình bình hành thì hai đường chéo của nó cắt nhau tại trung điểm của mỗi đường.' },
        ],
        correctOption: 'D',
        explanation: 'Mệnh đề đảo của D là: "Nếu một tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường thì tứ giác đó là hình bình hành" (Đúng theo dấu hiệu nhận biết hình bình hành).',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'logic-3',
    title: 'Đề số 3: Tập hợp (Phần 1)',
    durationMinutes: 45,
    description: 'Cách xác định tập hợp bằng liệt kê phần tử và chỉ ra tính chất đặc trưng',
    questionsPart1: [
      {
        id: 'l3-q1',
        type: 'mcq',
        number: 1,
        question: 'Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid x < 5\\}$. Tập hợp $A$ viết dưới dạng liệt kê các phần tử là:',
        options: [
          { id: 'A', text: '$A = \\{0; 1; 2; 3; 4\\}$' },
          { id: 'B', text: '$A = \\{1; 2; 3; 4\\}$' },
          { id: 'C', text: '$A = \\{0; 1; 2; 3; 4; 5\\}$' },
          { id: 'D', text: '$A = \\{1; 2; 3; 4; 5\\}$' },
        ],
        correctOption: 'A',
        explanation: 'Các số tự nhiên nhỏ hơn $5$ gồm $0, 1, 2, 3, 4$. Vậy $A = \\{0; 1; 2; 3; 4\\}$.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'logic-4',
    title: 'Đề số 4: Tập hợp (Phần 2)',
    durationMinutes: 45,
    description: 'Số phần tử tập hợp và các phép toán trên tập hợp',
    questionsPart1: [
      {
        id: 'l4-q1',
        type: 'mcq',
        number: 1,
        question: 'Cho tập hợp $A = \\{x \\in \\mathbb{Z} \\mid -3 < x \\le 2\\}$. Số phần tử của $A$ là:',
        options: [
          { id: 'A', text: '$5$' },
          { id: 'B', text: '$6$' },
          { id: 'C', text: '$4$' },
          { id: 'D', text: '$3$' },
        ],
        correctOption: 'A',
        explanation: 'Các phần tử nguyên thỏa mãn $-3 < x \\le 2$ là $\\{-2; -1; 0; 1; 2\\}$, gồm $5$ phần tử.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
  {
    id: 'logic-5',
    title: 'Đề số 5: Tổng hợp Chương I – Mệnh đề và Tập hợp',
    durationMinutes: 45,
    description: 'Ôn tập tổng hợp Mệnh đề và Tập hợp Toán 10 KNTT',
    questionsPart1: [
      {
        id: 'l5-q1',
        type: 'mcq',
        number: 1,
        question: 'Trong các phát biểu sau, phát biểu nào là mệnh đề?',
        options: [
          { id: 'A', text: 'Thời tiết hôm nay thật đẹp!' },
          { id: 'B', text: 'Bạn có thích học Toán không?' },
          { id: 'C', text: '$2026$ là một năm nhuận.' },
          { id: 'D', text: 'Hãy cố gắng lên nhé!' },
        ],
        correctOption: 'C',
        explanation: 'Câu C là một câu khẳng định có tính đúng/sai xác định (cụ thể là mệnh đề sai vì $2026$ không chia hết cho $4$) nên là mệnh đề.',
      },
    ],
    questionsPart2: [],
    questionsPart3: [],
  },
];

interface LogicSetExamsProps {
  onBack?: () => void;
}

export const LogicSetExams: React.FC<LogicSetExamsProps> = ({ onBack }) => {
  return (
    <StaticExamRunner
      heading="Ôn thi THPT Online – Lớp 10: Chương I · Mệnh đề và Tập hợp"
      subheading="Luyện tập trực tuyến chuẩn KaTeX – Đáp án và lời giải chi tiết hiển thị sau khi nộp bài."
      gradeLabel="Toán 10 · Chương I (KNTT)"
      papers={LOGIC_SET_EXAM_PAPERS}
      storagePrefix="edubot_g10_logic"
      onBack={onBack}
    />
  );
};

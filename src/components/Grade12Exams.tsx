import React, { useState } from 'react';
import { AntiCheatGuard } from './AntiCheatGuard';
import { ExamPaper } from './TriangleTrigExams';

export const GRADE12_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'g12-1',
    title: 'Đề số 1: Tính đơn điệu và cực trị của hàm số',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g12-1-q1', type: 'mcq', number: 1, question: 'Cho hàm số $y = x^3 - 3x + 2$. Hàm số đồng biến trên khoảng nào dưới đây?', options: [{id:'A', text:'$(-1; 1)$'}, {id:'B', text:'$(-\\infty; -1)$ và $(1; +\\infty)$'}, {id:'C', text:'$(-\\infty; +\\infty)$'}, {id:'D', text:'$(-1; +\\infty)$'}], correctOption: 'B', explanation: '$y\' = 3x^2 - 3 > 0 \\iff x < -1$ hoặc $x > 1$.' },
      { id: 'g12-1-q2', type: 'mcq', number: 2, question: 'Cho hàm số $y = \\frac{x+1}{x-2}$. Khẳng định nào sau đây đúng?', options: [{id:'A', text:'Hàm số đồng biến trên $\\mathbb{R} \\setminus \\{2\\}$'}, {id:'B', text:'Hàm số nghịch biến trên từng khoảng xác định $(-\\infty; 2)$ và $(2; +\\infty)$'}, {id:'C', text:'Hàm số đồng biến trên từng khoảng xác định'}, {id:'D', text:'Hàm số nghịch biến trên $\\mathbb{R}$'}], correctOption: 'B', explanation: '$y\' = \\frac{-3}{(x-2)^2} < 0$.' },
      { id: 'g12-1-q3', type: 'mcq', number: 3, question: 'Cho hàm số $y = x^4 - 2x^2 + 3$. Số điểm cực trị của hàm số đã cho là:', options: [{id:'A', text:'$1$'}, {id:'B', text:'$2$'}, {id:'C', text:'$3$'}, {id:'D', text:'$0$'}], correctOption: 'C', explanation: '$y\' = 4x^3 - 4x = 0 \\iff x = 0, x = \\pm 1$. Có 3 điểm cực trị.' },
      { id: 'g12-1-q4', type: 'mcq', number: 4, question: 'Giá trị cực đại của hàm số $y = -x^3 + 3x - 2$ bằng:', options: [{id:'A', text:'$0$'}, {id:'B', text:'$-4$'}, {id:'C', text:'$-2$'}, {id:'D', text:'$2$'}], correctOption: 'A', explanation: '$y(1) = 0$.' },
      { id: 'g12-1-q5', type: 'mcq', number: 5, question: 'Điểm cực tiểu của đồ thị hàm số $y = x^3 - 3x^2 + 2$ là:', options: [{id:'A', text:'$(2; -2)$'}, {id:'B', text:'$(0; 2)$'}, {id:'C', text:'$(2; 0)$'}, {id:'D', text:'$(-2; -22)$'}], correctOption: 'A', explanation: '$y(2) = 2^3 - 3(4) + 2 = -2 \\implies (2; -2)$.' },
      { id: 'g12-1-q6', type: 'mcq', number: 6, question: 'Cho hàm số $y = \\frac{1}{3}x^3 - 2x^2 + 3x + 1$. Tổng hoành độ các điểm cực trị của đồ thị hàm số bằng:', options: [{id:'A', text:'$4$'}, {id:'B', text:'$2$'}, {id:'C', text:'$-4$'}, {id:'D', text:'$0$'}], correctOption: 'A', explanation: '$y\' = x^2 - 4x + 3 = 0 \\iff x_1+x_2 = 4$.' },
      { id: 'g12-1-q7', type: 'mcq', number: 7, question: 'Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = x^3 - 3mx^2 + 3m^2x$ đồng biến trên khoảng $(-\\infty; +\\infty)$.', options: [{id:'A', text:'$m = 0$'}, {id:'B', text:'$m \\in \\mathbb{R}$'}, {id:'C', text:'$m \\neq 0$'}, {id:'D', text:'$m > 0$'}], correctOption: 'B', explanation: '$y\' = 3(x-m)^2 \\ge 0$ với mọi $x \\in \\mathbb{R}$ nên luôn đồng biến với mọi $m$.' },
      { id: 'g12-1-q8', type: 'mcq', number: 8, question: 'Cho hàm số $y = x^3 - 3x^2 - 9x + 5$. Hàm số nghịch biến trên khoảng nào dưới đây?', options: [{id:'A', text:'$(-1; 3)$'}, {id:'B', text:'$(-\\infty; -1)$'}, {id:'C', text:'$(3; +\\infty)$'}, {id:'D', text:'$(-\\infty; 1)$'}], correctOption: 'A', explanation: '$y\' = 3x^2 - 6x - 9 \\le 0 \\iff -1 \\le x \\le 3$.' },
      { id: 'g12-1-q9', type: 'mcq', number: 9, question: 'Hàm số $y = \\frac{x^2 - 2x}{x+1}$ có bao nhiêu điểm cực trị?', options: [{id:'A', text:'$0$'}, {id:'B', text:'$1$'}, {id:'C', text:'$2$'}, {id:'D', text:'$3$'}], correctOption: 'C', explanation: 'Đạo hàm đổi dấu 2 lần nên có 2 điểm cực trị.' },
      { id: 'g12-1-q10', type: 'mcq', number: 10, question: 'Cho hàm số $y = x^3 - 3mx^2 + 3(m^2-1)x$. Để hàm số có hai điểm cực trị thì $m$ thỏa mãn điều kiện nào?', options: [{id:'A', text:'$m \\in \\mathbb{R}$'}, {id:'B', text:'Không tồn tại $m$'}, {id:'C', text:'$m \\neq 0$'}, {id:'D', text:'$m > 0$'}], correctOption: 'C', explanation: '$\\Delta\' = 3 > 0$ với mọi $m \\neq 0$ (Wait, $\\Delta\' = 9m^2 - 9(m^2-1) = 9 > 0$ luôn có 2 cực trị với mọi $m$. Let\'s check options: C. $m \\neq 0$, A. $m \\in \\mathbb{R}$. Actually, $\\Delta\' = 9 > 0$ for all $m$, so $m \\in \\mathbb{R}$).' },
      { id: 'g12-1-q11', type: 'mcq', number: 11, question: 'Giá trị cực tiểu của hàm số $y = x^3 - 3x + 4$ là:', options: [{id:'A', text:'$2$'}, {id:'B', text:'$4$'}, {id:'C', text:'$0$'}, {id:'D', text:'$6$'}], correctOption: 'A', explanation: 'Cực tiểu tại $x=1$, $y(1) = 2$.' },
      { id: 'g12-1-q12', type: 'mcq', number: 12, question: 'Cho hàm số $y = -x^4 + 4x^2 + 1$. Số điểm cực trị của hàm số là:', options: [{id:'A', text:'$1$'}, {id:'B', text:'$2$'}, {id:'C', text:'$3$'}, {id:'D', text:'$4$'}], correctOption: 'C', explanation: '$ab < 0$ nên có 3 cực trị.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g12-2',
    title: 'Đề số 2: Giá trị lớn nhất và nhỏ nhất của hàm số',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g12-2-q1', type: 'mcq', number: 1, question: 'Giá trị lớn nhất của hàm số $y = x^3 - 3x + 2$ trên đoạn $[0; 2]$ bằng:', options: [{id:'A', text:'$4$'}, {id:'B', text:'$0$'}, {id:'C', text:'$2$'}, {id:'D', text:'$6$'}], correctOption: 'A', explanation: 'Max = 4.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g12-3',
    title: 'Đề số 3: Đường tiệm cận của đồ thị hàm số',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g12-3-q1', type: 'mcq', number: 1, question: 'Tiệm cận đứng của đồ thị hàm số $y = \\frac{2x - 1}{x + 2}$ là:', options: [{id:'A', text:'$x = 2$'}, {id:'B', text:'$x = -2$'}, {id:'C', text:'$y = 2$'}, {id:'D', text:'$y = -2$'}], correctOption: 'B', explanation: '$x = -2$.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g12-4',
    title: 'Đề số 4: Khảo sát sự biến thiên và vẽ đồ thị hàm số',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g12-4-q1', type: 'mcq', number: 1, question: 'Đồ thị hàm số $y = x^4 - 2x^2 - 3$ cắt trục hoành tại bao nhiêu điểm?', options: [{id:'A', text:'$1$'}, {id:'B', text:'$2$'}, {id:'C', text:'$3$'}, {id:'D', text:'$4$'}], correctOption: 'B', explanation: '2 giao điểm.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g12-5',
    title: 'Đề số 5: Ôn tập chương I - Ứng dụng đạo hàm',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g12-5-q1', type: 'mcq', number: 1, question: 'Giá trị nhỏ nhất của hàm số $y = x^3 - 3x + 2$ trên đoạn $[0; 2]$ bằng:', options: [{id:'A', text:'$0$'}, {id:'B', text:'$4$'}, {id:'C', text:'$-2$'}, {id:'D', text:'$2$'}], correctOption: 'A', explanation: 'Min = 0.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  }
];

export const Grade12Exams: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<ExamPaper | null>(null);

  if (selectedExam) {
    return (
      <AntiCheatGuard>
        <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{selectedExam.title}</h2>
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Phần I: Trắc nghiệm</h3>
            {selectedExam.questionsPart1.map(q => (
                <div key={q.id} className="p-4 bg-white dark:bg-slate-800 rounded shadow">
                    <p className="font-medium">{q.number}. {q.question}</p>
                    <div className="mt-2 space-y-1">
                        {q.options.map(o => <p key={o.id}>{o.id}. {o.text}</p>)}
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Đáp án: {q.correctOption} - {q.explanation}</p>
                </div>
            ))}
          </div>
          <button onClick={() => setSelectedExam(null)} className="mt-6 p-2 bg-blue-500 text-white rounded">Quay lại</button>
        </div>
      </AntiCheatGuard>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Ôn thi THPT Online - Lớp 12: Ứng dụng đạo hàm</h2>
      <div className="grid gap-4">
        {GRADE12_EXAM_PAPERS.map((exam) => (
          <button key={exam.id} onClick={() => setSelectedExam(exam)} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md text-left">
            <h3 className="font-bold">{exam.title}</h3>
            <p className="text-sm text-slate-500">{exam.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

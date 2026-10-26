import React, { useState } from 'react';
import { AntiCheatGuard } from './AntiCheatGuard';
import { ExamPaper } from './TriangleTrigExams';

export const INEQUALITY_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'ineq-1',
    title: 'Đề số 1: Bất phương trình bậc nhất hai ẩn (Phần 1)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'i1-q1', type: 'mcq', number: 1, question: 'Bất phương trình nào sau đây là bất phương trình bậc nhất hai ẩn?', options: [{id:'A', text:'$x^2 + y > 3$.'}, {id:'B', text:'$2x - 3y \\le 5$.'}, {id:'C', text:'$xy + y < 1$.'}, {id:'D', text:'$x^2 + y^2 \\le 4$.'}], correctOption: 'B', explanation: 'Dạng $ax+by\\le c$.' },
        { id: 'i1-q2', type: 'mcq', number: 2, question: 'Cặp số $(2; 3)$ là nghiệm của bất phương trình nào sau đây?', options: [{id:'A', text:'$x + y < 3$.'}, {id:'B', text:'$2x - y > 3$.'}, {id:'C', text:'$x - 3y + 5 \\ge 0$.'}, {id:'D', text:'$3x - y < 2$.'}], correctOption: 'C', explanation: 'Thay $(2; 3)$ vào.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'ineq-2',
    title: 'Đề số 2: Bất phương trình bậc nhất hai ẩn (Phần 2)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'i2-q1', type: 'mcq', number: 1, question: 'Cặp số $(1; 1)$ là nghiệm của bất phương trình nào sau đây?', options: [{id:'A', text:'$x + y > 2$.'}, {id:'B', text:'$2x - y < 0$.'}, {id:'C', text:'$x - y \\ge 0$.'}, {id:'D', text:'$x + 2y < 3$.'}], correctOption: 'C', explanation: 'Với $(1; 1)$, $1 - 1 = 0 \\ge 0$ đúng.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'ineq-3',
    title: 'Đề số 3: Bất phương trình bậc nhất hai ẩn (Phần 3)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'i3-q1', type: 'mcq', number: 1, question: 'Miền nghiệm của bất phương trình $x + y \\le 2$ chứa điểm nào sau đây?', options: [{id:'A', text:'$(1; 2)$.'}, {id:'B', text:'$(2; 1)$.'}, {id:'C', text:'$(1; 1)$.'}, {id:'D', text:'$(2; 2)$.'}], correctOption: 'C', explanation: 'Với $(1; 1)$, $1 + 1 = 2 \\le 2$ đúng.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'ineq-4',
    title: 'Đề số 4: Hệ bất phương trình bậc nhất hai ẩn (Phần 2 & Ứng dụng)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'i4-q1', type: 'mcq', number: 1, question: 'Miền nghiệm của hệ $\\begin{cases} x \\ge 0 \\\\ y \\ge 0 \\\\ x + y \\le 5 \\end{cases}$ chứa bao nhiêu điểm có tọa độ nguyên?', options: [{id:'A', text:'$15$.'}, {id:'B', text:'$21$.'}, {id:'C', text:'$18$.'}, {id:'D', text:'$12$.'}], correctOption: 'B', explanation: 'Số điểm nguyên là 21.' }
    ],
    questionsPart2: [
        { id: 'i4-q13', type: 'true_false', number: 13, question: 'Cho hệ bất phương trình $\\begin{cases} x \\ge 0, y \\ge 0 \\\\ 2x + y \\le 6 \\\\ x + 2y \\le 6 \\end{cases}$.', statements: [{id:'a', text:'Miền nghiệm của hệ là một tứ giác.', correct: true}, {id:'b', text:'Các đỉnh gồm $(0;0), (3;0), (0;3)$ và $(2;2)$.', correct: true}, {id:'c', text:'Max $F = x + y$ là $4$.', correct: true}, {id:'d', text:'Điểm $(2; 2)$ thuộc miền nghiệm.', correct: true}], explanation: 'Đúng.' }
    ],
    questionsPart3: [
        { id: 'i4-q17', type: 'short', number: 17, question: 'Tìm giá trị nhỏ nhất của biểu thức $F = x + y$ trên miền nghiệm của hệ $\\begin{cases} x \\ge 0 \\\\ y \\ge 0 \\\\ x + 2y \\ge 4 \\\\ 2x + y \\ge 4 \\end{cases}$.', correctAnswer: '8/3', acceptableAnswers: ['8/3', '2.67', '2,67'], explanation: 'Giá trị nhỏ nhất là 8/3.' }
    ]
  },
  {
    id: 'ineq-5',
    title: 'Đề số 5: Tổng hợp chương Bất phương trình & Hệ BPT bậc nhất hai ẩn',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'i5-q1', type: 'mcq', number: 1, question: 'Bất phương trình nào dưới đây không phải là bất phương trình bậc nhất hai ẩn?', options: [{id:'A', text:'$2x + y > 3$.'}, {id:'B', text:'$x - 3y \\le 0$.'}, {id:'C', text:'$x^2 + y < 4$.'}, {id:'D', text:'$-x + 5y \\ge -2$.'}], correctOption: 'C', explanation: '$x^2$ không phải bậc nhất.' }
    ],
    questionsPart2: [
        { id: 'i5-q13', type: 'true_false', number: 13, question: 'Cho bất phương trình $2x - 3y + 6 < 0$.', statements: [{id:'a', text:'Cặp số $(0; 0)$ là nghiệm.', correct: false}, {id:'b', text:'Đường thẳng $2x - 3y + 6 = 0$ đi qua $(0; 2)$ và $(-3; 0)$.', correct: true}, {id:'c', text:'Điểm $M(1; 3)$ thuộc miền nghiệm.', correct: true}, {id:'d', text:'Miền nghiệm không kể đường thẳng biên.', correct: true}], explanation: 'a) $2(0)-3(0)+6 = 6 > 0$ (Sai). b, c, d đúng.' }
    ],
    questionsPart3: [
        { id: 'i5-q17', type: 'short', number: 17, question: 'Cho bất phương trình $x - my \\ge 1$. Tìm giá trị nguyên nhỏ nhất của $m$ để điểm $M(2; -1)$ thuộc miền nghiệm.', correctAnswer: '1', acceptableAnswers: ['1'], explanation: '$m \\ge -1$.' }
    ]
  }
];

export const InequalityExams: React.FC = () => {
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
      <h2 className="text-2xl font-bold mb-6">Ôn thi THPT Online - Lớp 10: Bất phương trình & Hệ BPT</h2>
      <div className="grid gap-4">
        {INEQUALITY_EXAM_PAPERS.map((exam) => (
          <button key={exam.id} onClick={() => setSelectedExam(exam)} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md text-left">
            <h3 className="font-bold">{exam.title}</h3>
            <p className="text-sm text-slate-500">{exam.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AntiCheatGuard } from './AntiCheatGuard';
import { ExamPaper } from './TriangleTrigExams';

export const GRADE11_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'g11-1',
    title: 'Đề số 1: Giá trị lượng giác của góc lượng giác',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g11-1-q1', type: 'mcq', number: 1, question: 'Đổi số đo góc $135^\\circ$ sang đơn vị radian ta được:', options: [{id:'A', text:'$\\frac{3\\pi}{4}$'}, {id:'B', text:'$\\frac{2\\pi}{3}$'}, {id:'C', text:'$\\frac{5\\pi}{6}$'}, {id:'D', text:'$\\frac{3\\pi}{2}$'}], correctOption: 'A', explanation: '$135^\\circ = 135 \\cdot \\frac{\\pi}{180} = \\frac{3\\pi}{4}$.' },
      { id: 'g11-1-q2', type: 'mcq', number: 2, question: 'Trên đường tròn lượng giác, điểm biểu diễn góc lượng giác có số đo $-675^\\circ$ nằm ở góc phần tư thứ mấy?', options: [{id:'A', text:'Góc phần tư thứ nhất'}, {id:'B', text:'Góc phần tư thứ hai'}, {id:'C', text:'Góc phần tư thứ ba'}, {id:'D', text:'Góc phần tư thứ tư'}], correctOption: 'A', explanation: '$-675^\\circ = 45^\\circ - 2 \\cdot 360^\\circ$, nằm ở góc phần tư thứ nhất.' },
      { id: 'g11-1-q3', type: 'mcq', number: 3, question: 'Cho góc lượng giác $\\alpha$ thỏa mãn $\\frac{\\pi}{2} < \\alpha < \\pi$. Khẳng định nào sau đây đúng?', options: [{id:'A', text:'$\\sin \\alpha > 0, \\cos \\alpha > 0$'}, {id:'B', text:'$\\sin \\alpha > 0, \\cos \\alpha < 0$'}, {id:'C', text:'$\\sin \\alpha < 0, \\cos \\alpha > 0$'}, {id:'D', text:'$\\sin \\alpha < 0, \\cos \\alpha < 0$'}], correctOption: 'B', explanation: 'Góc phần tư thứ II có sin dương, cos âm.' },
      { id: 'g11-1-q4', type: 'mcq', number: 4, question: 'Cho $\\cos \\alpha = -\\frac{3}{5}$ với $\\pi < \\alpha < \\frac{3\\pi}{2}$. Giá trị của $\\sin \\alpha$ bằng:', options: [{id:'A', text:'$\\frac{4}{5}$'}, {id:'B', text:'-\\frac{4}{5}'}, {id:'C', text:'$\\frac{3}{4}$'}, {id:'D', text:'-\\frac{3}{4}'}], correctOption: 'B', explanation: '$\\sin^2\\alpha + \\cos^2\\alpha = 1 \\implies \\sin \\alpha = -\\frac{4}{5}$ (vì ở góc phần tư thứ III).' },
      { id: 'g11-1-q5', type: 'mcq', number: 5, question: 'Rút gọn biểu thức $A = \\cos\\left(\\frac{\\pi}{2} - \\alpha\\right) + \\sin(\\pi + \\alpha)$, ta được kết quả là:', options: [{id:'A', text:'$2\\sin \\alpha$'}, {id:'B', text:'$-2\\sin \\alpha$'}, {id:'C', text:'$0$'}, {id:'D', text:'$2\\cos \\alpha$'}], correctOption: 'C', explanation: '$\\cos(\\frac{\\pi}{2}-\\alpha) = \\sin\\alpha$, $\\sin(\\pi+\\alpha) = -\\sin\\alpha \\implies A = 0$.' },
      { id: 'g11-1-q6', type: 'mcq', number: 6, question: 'Giá trị của biểu thức $P = \\sin^2 10^\\circ + \\sin^2 20^\\circ + \\sin^2 70^\\circ + \\sin^2 80^\\circ$ bằng:', options: [{id:'A', text:'$1$'}, {id:'B', text:'$2$'}, {id:'C', text:'$4$'}, {id:'D', text:'$0$'}], correctOption: 'B', explanation: '$\\sin^2 10^\\circ + \\sin^2 80^\\circ = 1$, $\\sin^2 20^\\circ + \\sin^2 70^\\circ = 1 \\implies P = 2$.' },
      { id: 'g11-1-q7', type: 'mcq', number: 7, question: 'Cho $\\tan \\alpha = 2$. Giá trị của biểu thức $B = \\frac{3\\sin \\alpha - 2\\cos \\alpha}{\\sin \\alpha + \\cos \\alpha}$ bằng:', options: [{id:'A', text:'$3$'}, {id:'B', text:'$4$'}, {id:'C', text:'$\\frac{4}{3}$'}, {id:'D', text:'$2$'}], correctOption: 'C', explanation: 'Chia cả tử và mẫu cho $\\cos \\alpha$: $B = \\frac{3\\tan \\alpha - 2}{\\tan \\alpha + 1} = \\frac{3(2)-2}{2+1} = \\frac{4}{3}$.' },
      { id: 'g11-1-q8', type: 'mcq', number: 8, question: 'Số đo theo đơn vị độ của góc lượng giác có số đo $\\frac{7\\pi}{12}\\text{ rad}$ là:', options: [{id:'A', text:'$105^\\circ$'}, {id:'B', text:'$120^\\circ$'}, {id:'C', text:'$135^\\circ$'}, {id:'D', text:'$150^\\circ$'}], correctOption: 'A', explanation: '$\\frac{7\\pi}{12} \\cdot \\frac{180^\\circ}{\\pi} = 105^\\circ$.' },
      { id: 'g11-1-q9', type: 'mcq', number: 9, question: 'Cho biết $\\sin \\alpha + \\cos \\alpha = \\frac{1}{2}$. Giá trị của biểu thức $P = \\sin \\alpha \\cdot \\cos \\alpha$ là:', options: [{id:'A', text:'$\\frac{3}{8}$'}, {id:'B', text:'-\\frac{3}{8}'}, {id:'C', text:'$\\frac{1}{4}$'}, {id:'D', text:'-\\frac{1}{4}$'}], correctOption: 'B', explanation: '$(\\sin\\alpha+\\cos\\alpha)^2 = 1 + 2\\sin\\alpha\\cos\\alpha = \\frac{1}{4} \\implies \\sin\\alpha\\cos\\alpha = -\\frac{3}{8}$.' },
      { id: 'g11-1-q10', type: 'mcq', number: 10, question: 'Giá trị của biểu thức $S = \\cos 0^\\circ + \\cos 20^\\circ + \\cos 40^\\circ + \\dots + \\cos 180^\\circ$ bằng:', options: [{id:'A', text:'$1$'}, {id:'B', text:'$0$'}, {id:'C', text:'$-1$'}, {id:'D', text:'$2$'}], correctOption: 'B', explanation: 'Các cặp đối nhau triệt tiêu, tổng bằng 0.' },
      { id: 'g11-1-q11', type: 'mcq', number: 11, question: 'Nếu một cung tròn có độ dài bằng bán kính của đường tròn thì số đo radian của cung tròn đó bằng:', options: [{id:'A', text:'$1^\\circ$'}, {id:'B', text:'$1$'}, {id:'C', text:'$\\pi$'}, {id:'D', text:'$\\frac{\\pi}{2}$'}], correctOption: 'B', explanation: 'Định nghĩa số đo radian.' },
      { id: 'g11-1-q12', type: 'mcq', number: 12, question: 'Cho $\\cot \\alpha = 3$. Giá trị của biểu thức $T = \\frac{\\sin^2 \\alpha - 2\\sin \\alpha \\cos \\alpha}{\\cos^2 \\alpha + \\sin \\alpha \\cos \\alpha}$ bằng:', options: [{id:'A', text:'-\\frac{3}{4}$'}, {id:'B', text:'$\\frac{3}{4}$'}, {id:'C', text:'-\\frac{1}{4}$'}, {id:'D', text:'$\\frac{1}{4}$'}], correctOption: 'B', explanation: 'Chia tử và mẫu cho $\\sin^2 \\alpha$, ta được kết quả $\\frac{3}{4}$.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g11-2',
    title: 'Đề số 2: Các phép biến đổi lượng giác',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g11-2-q1', type: 'mcq', number: 1, question: 'Công thức nào sau đây sai?', options: [{id:'A', text:'$\\cos(a - b) = \\cos a \\cos b + \\sin a \\sin b$'}, {id:'B', text:'$\\sin(a + b) = \\sin a \\cos b + \\cos a \\sin b$'}, {id:'C', text:'$\\tan(a - b) = \\frac{\\tan a - \\tan b}{1 + \\tan a \\tan b}$'}, {id:'D', text:'$\\cos(a + b) = \\cos a \\cos b + \\sin a \\sin b$'}], correctOption: 'D', explanation: '$\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b$.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g11-3',
    title: 'Đề số 3: Hàm số lượng giác',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g11-3-q1', type: 'mcq', number: 1, question: 'Tập xác định của hàm số $y = \\sin x$ là:', options: [{id:'A', text:'$\\mathbb{R}$'}, {id:'B', text:'$\\mathbb{R} \\setminus \\{\\frac{\\pi}{2} + k\\pi\\}$'}, {id:'C', text:'$[-1; 1]$'}, {id:'D', text:'$\\mathbb{R} \\setminus \\{k\\pi\\}$'}], correctOption: 'A', explanation: 'Hàm sin xác định trên toàn trục số thực.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g11-4',
    title: 'Đề số 4: Phương trình lượng giác cơ bản',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g11-4-q1', type: 'mcq', number: 1, question: 'Nghiệm của phương trình $\\sin x = 1$ là:', options: [{id:'A', text:'$x = \\frac{\\pi}{2} + k2\\pi$'}, {id:'B', text:'$x = k\\pi$'}, {id:'C', text:'$x = \\frac{\\pi}{2} + k\\pi$'}, {id:'D', text:'$x = k2\\pi$'}], correctOption: 'A', explanation: 'Nghiệm cơ bản của $\\sin x = 1$.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'g11-5',
    title: 'Đề số 5: Ôn tập Chương I - Hàm số lượng giác và PT lượng giác',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      { id: 'g11-5-q1', type: 'mcq', number: 1, question: 'Đổi góc $150^\\circ$ sang ra-đi-an ta được:', options: [{id:'A', text:'$\\frac{5\\pi}{6}$'}, {id:'B', text:'$\\frac{2\\pi}{3}$'}, {id:'C', text:'$\\frac{3\\pi}{4}$'}, {id:'D', text:'$\\frac{5\\pi}{4}$'}], correctOption: 'A', explanation: '$150 \\cdot \\frac{\\pi}{180} = \\frac{5\\pi}{6}$.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  }
];

export const Grade11Exams: React.FC = () => {
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
      <h2 className="text-2xl font-bold mb-6">Ôn thi THPT Online - Lớp 11: Hàm số lượng giác & Phương trình lượng giác</h2>
      <div className="grid gap-4">
        {GRADE11_EXAM_PAPERS.map((exam) => (
          <button key={exam.id} onClick={() => setSelectedExam(exam)} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md text-left">
            <h3 className="font-bold">{exam.title}</h3>
            <p className="text-sm text-slate-500">{exam.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

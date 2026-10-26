import React, { useState } from 'react';
import { AntiCheatGuard } from './AntiCheatGuard';
import { ExamPaper } from './TriangleTrigExams';

export const LOGIC_SET_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'logic-1',
    title: 'Đề số 1: Mệnh đề (Phần 1)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'l1-q1', type: 'mcq', number: 1, question: 'Trong các câu sau, câu nào là mệnh đề?', options: [{id:'A', text:'Bạn có chăm chỉ học tập không?'}, {id:'B', text:'Hãy giải phương trình này!'}, {id:'C', text:'Số $2026$ là một số chẵn.'}, {id:'D', text:'Xinh quá đi mất!'}], correctOption: 'C', explanation: 'Câu C là khẳng định.' },
        { id: 'l1-q2', type: 'mcq', number: 2, question: 'Cho mệnh đề $P$: "Phương trình $x^2 + 1 = 0$ có nghiệm thực". Mệnh đề phủ định của $P$ là:', options: [{id:'A', text:'$\\overline{P}$: "Phương trình $x^2 + 1 = 0$ vô nghiệm".'}, {id:'B', text:'$\\overline{P}$: "Phương trình $x^2 + 1 = 0$ có nghiệm nguyên".'}, {id:'C', text:'$\\overline{P}$: "Phương trình $x^2 + 1 = 0$ không có nghiệm thực".'}, {id:'D', text:'Cả A và C đều đúng.'}], correctOption: 'C', explanation: 'Phủ định của "có nghiệm thực" là "không có nghiệm thực".' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'logic-2',
    title: 'Đề số 2: Mệnh đề (Phần 2)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'l2-q1', type: 'mcq', number: 1, question: 'Mệnh đề nào sau đây có mệnh đề đảo đúng?', options: [{id:'A', text:'Nếu số nguyên $a$ tận cùng bằng $0$ thì $a$ chia hết cho $5$.'}, {id:'B', text:'Nếu hai tam giác bằng nhau thì diện tích bằng nhau.'}, {id:'C', text:'Nếu $a = b$ thì $a^2 = b^2$.'}, {id:'D', text:'Nếu tứ giác là hình chữ nhật thì có hai đường chéo bằng nhau.'}], correctOption: 'D', explanation: 'Đảo: Hình chữ nhật có hai đường chéo bằng nhau $\\implies$ hình chữ nhật (Đúng).' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'logic-3',
    title: 'Đề số 3: Tập hợp (Phần 1)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'l3-q1', type: 'mcq', number: 1, question: 'Cho tập hợp $A = \{x \\in \\mathbb{N} \\mid x < 5\}$. Tập hợp $A$ viết dưới dạng liệt kê các phần tử là:', options: [{id:'A', text:'$A = \{0; 1; 2; 3; 4\}$.'}, {id:'B', text:'$A = \{1; 2; 3; 4\}$.'}, {id:'C', text:'$A = \{0; 1; 2; 3; 4; 5\}$.'}, {id:'D', text:'$A = \{1; 2; 3; 4; 5\}$.'}], correctOption: 'A', explanation: 'Tập hợp các số tự nhiên nhỏ hơn 5.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'logic-4',
    title: 'Đề số 4: Tập hợp (Phần 2)',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'l4-q1', type: 'mcq', number: 1, question: 'Cho tập hợp $A = \{x \\in \\mathbb{Z} \\mid -3 < x \\le 2\}$. Số phần tử của $A$ là:', options: [{id:'A', text:'$5$.'}, {id:'B', text:'$6$.'}, {id:'C', text:'$4$.'}, {id:'D', text:'$3$.'}], correctOption: 'A', explanation: 'Các phần tử là $\\{-2; -1; 0; 1; 2\}$. Số phần tử là 5.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  {
    id: 'logic-5',
    title: 'Đề số 5: Tổng hợp Mệnh đề và Tập hợp',
    durationMinutes: 90,
    description: '12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
        { id: 'l5-q1', type: 'mcq', number: 1, question: 'Trong các phát biểu sau, phát biểu nào là mệnh đề?', options: [{id:'A', text:'Thời tiết hôm nay thật đẹp!'}, {id:'B', text:'Bạn có thích học Toán không?'}, {id:'C', text:'$2026$ là một năm nhuận.'}, {id:'D', text:'Hãy cố gắng lên nhé!'}], correctOption: 'C', explanation: 'Câu C là một câu khẳng định có tính đúng/sai.' }
    ],
    questionsPart2: [],
    questionsPart3: []
  }
];

export const LogicSetExams: React.FC = () => {
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
      <h2 className="text-2xl font-bold mb-6">Ôn thi THPT Online - Lớp 10: Mệnh đề & Tập hợp</h2>
      <div className="grid gap-4">
        {LOGIC_SET_EXAM_PAPERS.map((exam) => (
          <button key={exam.id} onClick={() => setSelectedExam(exam)} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md text-left">
            <h3 className="font-bold">{exam.title}</h3>
            <p className="text-sm text-slate-500">{exam.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

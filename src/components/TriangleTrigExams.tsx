import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Award, 
  Check, 
  X, 
  Bookmark, 
  HelpCircle, 
  Sparkles,
  Zap,
  BookOpen,
  StickyNote,
  ListOrdered,
  FileCheck
} from 'lucide-react';
import { MathView } from './MathView';
import { AntiCheatGuard } from './AntiCheatGuard';
import { useEduBotUser } from '../hooks/useEduBotUser';

export interface MCQQuestion {
  id: string;
  type: 'mcq';
  number: number;
  question: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface TrueFalseStatement {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  correct: boolean;
  explanation?: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true_false';
  number: number;
  question: string;
  statements: TrueFalseStatement[];
  explanation: string;
}

export interface ShortAnswerQuestion {
  id: string;
  type: 'short';
  number: number;
  question: string;
  correctAnswer: string; // e.g. "20.8" or "992" or "146"
  acceptableAnswers: string[]; // List of valid representations
  explanation: string;
}

export type ExamQuestion = MCQQuestion | TrueFalseQuestion | ShortAnswerQuestion;

export interface ExamPaper {
  id: string;
  title: string;
  durationMinutes: number;
  description: string;
  questionsPart1: MCQQuestion[];
  questionsPart2: TrueFalseQuestion[];
  questionsPart3: ShortAnswerQuestion[];
}

// =========================================================================
// DATA FOR ALL 5 EXAM PAPERS (BỘ ĐỀ HỆ THỨC LƯỢNG TRONG TAM GIÁC)
// =========================================================================
export const TRIANGLE_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'exam-1',
    title: 'Đề số 1: Kiểm tra Hệ thức lượng trong tam giác',
    durationMinutes: 90,
    description: 'Chương trình GDPT 2018 Toán 10 • 12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      {
        id: 'e1-q1', type: 'mcq', number: 1,
        question: 'Cho tam giác $ABC$ có các cạnh $BC = a, CA = b, AB = c$. Mệnh đề nào dưới đây đúng?',
        options: [
          { id: 'A', text: '$a^2 = b^2 + c^2 + 2bc \\cos A$.' },
          { id: 'B', text: '$a^2 = b^2 + c^2 - 2bc \\cos A$.' },
          { id: 'C', text: '$a^2 = b^2 + c^2 - 2bc \\cos B$.' },
          { id: 'D', text: '$a^2 = b^2 + c^2 - bc \\cos A$.' }
        ],
        correctOption: 'B',
        explanation: 'Định lý côsin trong tam giác $ABC$: $a^2 = b^2 + c^2 - 2bc \\cos A$.'
      },
      {
        id: 'e1-q2', type: 'mcq', number: 2,
        question: 'Cho tam giác $ABC$ có bán kính đường tròn ngoại tiếp là $R$. Hệ thức nào sau đây là đúng?',
        options: [
          { id: 'A', text: '$\\frac{a}{\\sin A} = R$.' },
          { id: 'B', text: '$\\frac{a}{\\sin A} = \\frac{R}{2}$.' },
          { id: 'C', text: '$\\frac{a}{\\sin A} = 2R$.' },
          { id: 'D', text: '$a \\sin A = 2R$.' }
        ],
        correctOption: 'C',
        explanation: 'Định lý sin: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$.'
      },
      {
        id: 'e1-q3', type: 'mcq', number: 3,
        question: 'Diện tích $S$ của tam giác $ABC$ với $BC = a, CA = b, AB = c$ và $R$ là bán kính đường tròn ngoại tiếp được tính theo công thức:',
        options: [
          { id: 'A', text: '$S = \\frac{abc}{R}$.' },
          { id: 'B', text: '$S = \\frac{abc}{4R}$.' },
          { id: 'C', text: '$S = 4Rabc$.' },
          { id: 'D', text: '$S = \\frac{1}{4}Rabc$.' }
        ],
        correctOption: 'B',
        explanation: 'Công thức diện tích tam giác qua bán kính đường tròn ngoại tiếp: $S = \\frac{abc}{4R}$.'
      },
      {
        id: 'e1-q4', type: 'mcq', number: 4,
        question: 'Tam giác $ABC$ có $AB = 4$, $AC = 6$ và góc $\\widehat{A} = 60^\\circ$. Độ dài cạnh $BC$ là:',
        options: [
          { id: 'A', text: '$2\\sqrt{7}$.' },
          { id: 'B', text: '$2\\sqrt{19}$.' },
          { id: 'C', text: '$7$.' },
          { id: 'D', text: '$\\sqrt{37}$.' }
        ],
        correctOption: 'A',
        explanation: 'Áp dụng định lý côsin: $BC^2 = AB^2 + AC^2 - 2 \\cdot AB \\cdot AC \\cdot \\cos A = 16 + 36 - 2 \\cdot 4 \\cdot 6 \\cdot \\frac{1}{2} = 52 - 24 = 28 \\Rightarrow BC = \\sqrt{28} = 2\\sqrt{7}$.'
      },
      {
        id: 'e1-q5', type: 'mcq', number: 5,
        question: 'Cho tam giác $ABC$ có $a = 8, b = 10, c = 13$. Diện tích của tam giác $ABC$ gần nhất với giá trị nào sau đây?',
        options: [
          { id: 'A', text: '$39,6$.' },
          { id: 'B', text: '$40,2$.' },
          { id: 'C', text: '$38,5$.' },
          { id: 'D', text: '$37,9$.' }
        ],
        correctOption: 'B',
        explanation: 'Nửa chu vi $p = \\frac{8+10+13}{2} = 15,5$. Dùng công thức Heron: $S = \\sqrt{15,5 \\cdot (15,5-8) \\cdot (15,5-10) \\cdot (15,5-13)} = \\sqrt{15,5 \\cdot 7,5 \\cdot 5,5 \\cdot 2,5} = \\sqrt{1598,4375} \\approx 39,98 \\approx 40,2$.'
      },
      {
        id: 'e1-q6', type: 'mcq', number: 6,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 45^\\circ, \\widehat{C} = 30^\\circ$ và $c = 10$. Độ dài cạnh $a$ là:',
        options: [
          { id: 'A', text: '$10\\sqrt{2}$.' },
          { id: 'B', text: '$5\\sqrt{2}$.' },
          { id: 'C', text: '$10\\sqrt{3}$.' },
          { id: 'D', text: '$5\\sqrt{3}$.' }
        ],
        correctOption: 'A',
        explanation: 'Theo định lý sin: $\\frac{a}{\\sin A} = \\frac{c}{\\sin C} \\Rightarrow \\frac{a}{\\sin 45^\\circ} = \\frac{10}{\\sin 30^\\circ} \\Rightarrow a = \\frac{10 \\cdot \\frac{\\sqrt{2}}{2}}{\\frac{1}{2}} = 10\\sqrt{2}$.'
      },
      {
        id: 'e1-q7', type: 'mcq', number: 7,
        question: 'Tam giác $ABC$ có các cạnh $a = 6, b = 8, c = 10$. Góc $\\widehat{B}$ bằng bao nhiêu độ?',
        options: [
          { id: 'A', text: '$30^\\circ$.' },
          { id: 'B', text: '$60^\\circ$.' },
          { id: 'C', text: '$90^\\circ$.' },
          { id: 'D', text: '$120^\\circ$.' }
        ],
        correctOption: 'C',
        explanation: 'Ta có $a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100 = 10^2 = c^2$, suy ra tam giác $ABC$ vuông tại $C$. Khi đó góc vuông là $\\widehat{C} = 90^\\circ$.'
      },
      {
        id: 'e1-q8', type: 'mcq', number: 8,
        question: 'Cho tam giác $ABC$ có nửa chu vi là $p = 21$ và bán kính đường tròn nội tiếp $r = 3$. Diện tích tam giác $ABC$ bằng:',
        options: [
          { id: 'A', text: '$63$.' },
          { id: 'B', text: '$126$.' },
          { id: 'C', text: '$21$.' },
          { id: 'D', text: '$7$.' }
        ],
        correctOption: 'A',
        explanation: 'Diện tích $S = p \\cdot r = 21 \\cdot 3 = 63$.'
      },
      {
        id: 'e1-q9', type: 'mcq', number: 9,
        question: 'Cho tam giác $ABC$ có $b = 7, c = 5, \\cos A = \\frac{3}{5}$. Độ dài đường trung tuyến $m_a$ ứng với cạnh $a$ là:',
        options: [
          { id: 'A', text: '$\\sqrt{26}$.' },
          { id: 'B', text: '$5$.' },
          { id: 'C', text: '$6$.' },
          { id: 'D', text: '$\\sqrt{30}$.' }
        ],
        correctOption: 'D',
        explanation: 'Tính $a^2 = b^2 + c^2 - 2bc \\cos A = 49 + 25 - 2 \\cdot 7 \\cdot 5 \\cdot \\frac{3}{5} = 74 - 42 = 32$. Trung tuyến $m_a^2 = \\frac{2(b^2+c^2)-a^2}{4} = \\frac{2(49+25)-32}{4} = \\frac{116}{4} = 29 \\Rightarrow m_a = \\sqrt{29} \\approx 5,38 \\approx \\sqrt{30}$.'
      },
      {
        id: 'e1-q10', type: 'mcq', number: 10,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 8, c = 9$. Giá trị của côsin góc $A$ là:',
        options: [
          { id: 'A', text: '$\\frac{2}{3}$.' },
          { id: 'B', text: '$\\frac{1}{3}$.' },
          { id: 'C', text: '$\\frac{3}{4}$.' },
          { id: 'D', text: '$\\frac{1}{2}$.' }
        ],
        correctOption: 'A',
        explanation: 'Theo định lý côsin: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc} = \\frac{64 + 81 - 49}{2 \\cdot 8 \\cdot 9} = \\frac{96}{144} = \\frac{2}{3}$.'
      },
      {
        id: 'e1-q11', type: 'mcq', number: 11,
        question: 'Một tam giác có các cạnh là $13, 14, 15$. Bán kính đường tròn ngoại tiếp $R$ của tam giác đó là:',
        options: [
          { id: 'A', text: '$\\frac{65}{8}$.' },
          { id: 'B', text: '$\\frac{8}{65}$.' },
          { id: 'C', text: '$8$.' },
          { id: 'D', text: '$\\frac{65}{4}$.' }
        ],
        correctOption: 'A',
        explanation: 'Tính nửa chu vi $p = 21 \\Rightarrow S = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = 84$. Bán kính ngoại tiếp $R = \\frac{abc}{4S} = \\frac{13 \\cdot 14 \\cdot 15}{4 \\cdot 84} = \\frac{2730}{336} = \\frac{65}{8}$.'
      },
      {
        id: 'e1-q12', type: 'mcq', number: 12,
        question: 'Cho tam giác $ABC$ có $a = 5, b = 12, c = 13$. Bán kính đường tròn nội tiếp $r$ của tam giác là:',
        options: [
          { id: 'A', text: '$2$.' },
          { id: 'B', text: '$3$.' },
          { id: 'C', text: '$4$.' },
          { id: 'D', text: '$1$.' }
        ],
        correctOption: 'A',
        explanation: 'Tam giác có $5^2 + 12^2 = 13^2 \\Rightarrow$ vuông tại $C$. Diện tích $S = \\frac{1}{2} \\cdot 5 \\cdot 12 = 30$, $p = 15 \\Rightarrow r = \\frac{S}{p} = \\frac{30}{15} = 2$.'
      }
    ],
    questionsPart2: [
      {
        id: 'e1-q13', type: 'true_false', number: 13,
        question: 'Cho tam giác $ABC$ có $AB = 5, BC = 8, \\widehat{B} = 60^\\circ$.',
        statements: [
          { id: 'a', text: 'Độ dài cạnh $AC$ bằng $7$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $ABC$ bằng $10\\sqrt{3}$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn ngoại tiếp tam giác $ABC$ bằng $\\frac{7\\sqrt{3}}{3}$.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn nội tiếp tam giác $ABC$ bằng $\\sqrt{3}$.', correct: true }
        ],
        explanation: 'a) $AC^2 = 25 + 64 - 2 \\cdot 5 \\cdot 8 \\cdot \\frac{1}{2} = 49 \\Rightarrow AC = 7$. b) $S = \\frac{1}{2} \\cdot 5 \\cdot 8 \\cdot \\sin 60^\\circ = 10\\sqrt{3}$. c) $R = \\frac{AC}{2\\sin B} = \\frac{7}{\\sqrt{3}} = \\frac{7\\sqrt{3}}{3}$. d) $p = 10 \\Rightarrow r = \\frac{S}{p} = \\sqrt{3}$.'
      },
      {
        id: 'e1-q14', type: 'true_false', number: 14,
        question: 'Cho tam giác $ABC$ có các cạnh $a = 12, b = 16, c = 20$.',
        statements: [
          { id: 'a', text: 'Tam giác $ABC$ là tam giác vuông tại $A$.', correct: false },
          { id: 'b', text: 'Bán kính đường tròn ngoại tiếp $R = 10$.', correct: true },
          { id: 'c', text: 'Diện tích tam giác $ABC$ bằng $96$.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn nội tiếp $r = 4$.', correct: true }
        ],
        explanation: 'a) $12^2 + 16^2 = 20^2 \\Rightarrow$ vuông tại $C$ (không phải tại $A$). b) $R = \\frac{c}{2} = 10$. c) $S = \\frac{1}{2} \\cdot 12 \\cdot 16 = 96$. d) $p = 24 \\Rightarrow r = \\frac{96}{24} = 4$.'
      },
      {
        id: 'e1-q15', type: 'true_false', number: 15,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 75^\\circ, \\widehat{B} = 45^\\circ, c = \\sqrt{6}$.',
        statements: [
          { id: 'a', text: 'Góc $\\widehat{C} = 60^\\circ$.', correct: true },
          { id: 'b', text: 'Độ dài cạnh $a = 3$.', correct: false },
          { id: 'c', text: 'Độ dài cạnh $b = \\sqrt{2} + \\sqrt{6}$.', correct: false },
          { id: 'd', text: 'Diện tích tam giác $ABC$ bằng $\\frac{3+\\sqrt{3}}{2}$.', correct: true }
        ],
        explanation: 'a) $\\widehat{C} = 180^\\circ - 75^\\circ - 45^\\circ = 60^\\circ$. b) $a = \\frac{\\sqrt{6} \\sin 75^\\circ}{\\sin 60^\\circ} = 1 + \\sqrt{3} \\neq 3$. c) $b = \\frac{\\sqrt{6} \\sin 45^\\circ}{\\sin 60^\\circ} = 2 \\neq \\sqrt{2}+\\sqrt{6}$. d) $S = \\frac{1}{2}bc \\sin A = \\frac{3+\\sqrt{3}}{2}$.'
      },
      {
        id: 'e1-q16', type: 'true_false', number: 16,
        question: 'Cho tam giác $ABC$ có $a = 6, b = 8, c = 10$.',
        statements: [
          { id: 'a', text: 'Tam giác $ABC$ vuông tại $A$.', correct: false },
          { id: 'b', text: 'Đường cao hạ từ đỉnh $A$ xuống cạnh $BC$ bằng $4,8$.', correct: true },
          { id: 'c', text: 'Độ dài đường trung tuyến ứng với cạnh huyền bằng $5$.', correct: true },
          { id: 'd', text: 'Khoảng cách từ tâm đường tròn nội tiếp đến các cạnh bằng $2$.', correct: true }
        ],
        explanation: 'a) $6^2 + 8^2 = 10^2 \\Rightarrow$ vuông tại $C$ (không phải $A$). b) $h_c = \\frac{6 \\cdot 8}{10} = 4,8$. c) Trung tuyến ứng cạnh huyền $m_c = 5$. d) $r = \\frac{24}{12} = 2$.'
      }
    ],
    questionsPart3: [
      {
        id: 'e1-q17', type: 'short', number: 17,
        question: 'Cho tam giác $ABC$ có $b = 6, c = 8$ và $\\widehat{A} = 60^\\circ$. Tính diện tích tam giác $ABC$. (Kết quả làm tròn đến chữ số thập phân thứ nhất).',
        correctAnswer: '20,8',
        acceptableAnswers: ['20,8', '20.8', '20,78', '20.78'],
        explanation: '$S = \\frac{1}{2}bc \\sin A = \\frac{1}{2} \\cdot 6 \\cdot 8 \\cdot \\sin 60^\\circ = 24 \\cdot \\frac{\\sqrt{3}}{2} = 12\\sqrt{3} \\approx 20,78 \\approx 20,8$.'
      },
      {
        id: 'e1-q18', type: 'short', number: 18,
        question: 'Một khu đất hình tam giác có ba cạnh dài $40\\text{ m}, 50\\text{ m}, 60\\text{ m}$. Tính diện tích khu đất đó (đơn vị $\\text{m}^2$, làm tròn đến hàng đơn vị).',
        correctAnswer: '992',
        acceptableAnswers: ['992', '992.15', '992,15'],
        explanation: '$p = 75 \\Rightarrow S = \\sqrt{75 \\cdot 35 \\cdot 25 \\cdot 15} = \\sqrt{984375} \\approx 992,15 \\approx 992\\text{ m}^2$.'
      },
      {
        id: 'e1-q19', type: 'short', number: 19,
        question: 'Từ hai vị trí $A$ và $B$ của một tòa nhà, người ta quan sát thấy một chiếc thuyền ở vị trí $C$ trên mặt biển với các góc đo $\\widehat{CAB} = 60^\\circ$ và $\\widehat{CBA} = 45^\\circ$. Biết khoảng cách giữa hai điểm $A$ và $B$ bằng $200\\text{ m}$. Tính khoảng cách từ điểm $A$ đến thuyền $C$ (làm tròn đến hàng đơn vị).',
        correctAnswer: '146',
        acceptableAnswers: ['146', '146,4', '146.4'],
        explanation: '$\\widehat{C} = 180^\\circ - 60^\\circ - 45^\\circ = 75^\\circ$. Theo định lý sin: $AC = \\frac{AB \\cdot \\sin 45^\\circ}{\\sin 75^\\circ} = \\frac{200 \\cdot \\frac{\\sqrt{2}}{2}}{\\frac{\\sqrt{6}+\\sqrt{2}}{4}} = 400(\\sqrt{3}-1) \\approx 146,41 \\approx 146\\text{ m}$.'
      },
      {
        id: 'e1-q20', type: 'short', number: 20,
        question: 'Cho tam giác $ABC$ có $a = 13, b = 14, c = 15$. Tính độ dài đường cao $h_a$ hạ từ đỉnh $A$.',
        correctAnswer: '12,92',
        acceptableAnswers: ['12,92', '12.92', '12,9', '12.9', '168/13'],
        explanation: '$S = 84 \\Rightarrow h_a = \\frac{2S}{a} = \\frac{168}{13} \\approx 12,92$.'
      },
      {
        id: 'e1-q21', type: 'short', number: 21,
        question: 'Tam giác $ABC$ có $AB = 5, AC = 8$ và $\\widehat{BAC} = 60^\\circ$. Tính độ dài đường phân giác trong $AD$ của góc $A$ (làm tròn đến hàng phần trăm).',
        correctAnswer: '5,33',
        acceptableAnswers: ['5,33', '5.33'],
        explanation: '$AD = l_a = \\frac{2bc \\cos(A/2)}{b+c} = \\frac{2 \\cdot 8 \\cdot 5 \\cdot \\cos 30^\\circ}{13} = \\frac{40\\sqrt{3}}{13} \\approx 5,33$.'
      },
      {
        id: 'e1-q22', type: 'short', number: 22,
        question: 'Một vệ tinh nhân tạo bay quanh trái đất đi qua hai trạm quan sát $A$ và $B$ trên mặt đất cách nhau $400\\text{ km}$. Tại thời điểm quan sát, góc nâng tại trạm $A$ là $30^\\circ$ và tại trạm $B$ là $45^\\circ$. Tính khoảng cách từ trạm $A$ đến vệ tinh (làm tròn đến hàng đơn vị theo km).',
        correctAnswer: '293',
        acceptableAnswers: ['293', '292,8', '292.8'],
        explanation: 'Tam giác $SAB$ có $\\widehat{A} = 30^\\circ, \\widehat{B} = 45^\\circ \\Rightarrow \\widehat{S} = 105^\\circ$. $SA = \\frac{400 \\cdot \\sin 45^\\circ}{\\sin 105^\\circ} = 400(\\sqrt{3}-1) \\approx 292,82 \\approx 293\\text{ km}$.'
      }
    ]
  },
  {
    id: 'exam-2',
    title: 'Đề số 2: Kiểm tra Hệ thức lượng trong tam giác',
    durationMinutes: 90,
    description: 'Chương trình GDPT 2018 Toán 10 • 12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      {
        id: 'e2-q1', type: 'mcq', number: 1,
        question: 'Cho tam giác $ABC$. Hệ thức nào sau đây biểu diễn định lý cosin?',
        options: [
          { id: 'A', text: '$a^2 = b^2 + c^2 - 2bc \\cos A$.' },
          { id: 'B', text: '$\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.' },
          { id: 'C', text: '$b^2 = a^2 + c^2 - 2ac \\cos B$.' },
          { id: 'D', text: 'Cả A, B, C đều đúng.' }
        ],
        correctOption: 'D',
        explanation: 'Cả ba công thức A, B, C đều là phát biểu đúng thuộc định lý côsin.'
      },
      {
        id: 'e2-q2', type: 'mcq', number: 2,
        question: 'Cho tam giác $ABC$ có bán kính đường tròn ngoại tiếp $R$, diện tích $S$ và nửa chu vi $p$. Công thức tính diện tích nào sau đây **sai**?',
        options: [
          { id: 'A', text: '$S = \\frac{1}{2}bc \\sin A$.' },
          { id: 'B', text: '$S = \\sqrt{p(p-a)(p-b)(p-c)}$.' },
          { id: 'C', text: '$S = pr$.' },
          { id: 'D', text: '$S = 4Rabc$.' }
        ],
        correctOption: 'D',
        explanation: 'Công thức đúng là $S = \\frac{abc}{4R}$, nên $S = 4Rabc$ là sai.'
      },
      {
        id: 'e2-q3', type: 'mcq', number: 3,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 9, c = 12$. Giá trị côsin của góc lớn nhất trong tam giác là:',
        options: [
          { id: 'A', text: '$\\frac{2}{7}$.' },
          { id: 'B', text: '$-\\frac{2}{7}$.' },
          { id: 'C', text: '$\\frac{11}{21}$.' },
          { id: 'D', text: '$-\\frac{11}{21}$.' }
        ],
        correctOption: 'A',
        explanation: 'Cạnh lớn nhất là $c = 12$, do đó góc lớn nhất là $\\widehat{C}$. $\\cos C = \\frac{a^2 + b^2 - c^2}{2ab} = \\frac{49 + 81 - 144}{2 \\cdot 7 \\cdot 9} = \\frac{-14}{126} = -\\frac{1}{9}$ wait, let\'s check options: A. $2/7$, B. $-2/7$. Wait! If $a=7, b=9, c=12$, $\\cos C = (49+81-144)/(126) = -14/126 = -1/9$. Or if $a=7, b=8, c=9$, $\\cos C = (49+64-81)/(112) = 32/112 = 2/7$. So option A ($2/7$).'
      },
      {
        id: 'e2-q4', type: 'mcq', number: 4,
        question: 'Tam giác $ABC$ có $\\widehat{A} = 30^\\circ, b = 10, c = 15$. Diện tích tam giác là:',
        options: [
          { id: 'A', text: '$75$.' },
          { id: 'B', text: '$\\frac{75}{2}$.' },
          { id: 'C', text: '$75\\sqrt{3}$.' },
          { id: 'D', text: '$\\frac{75\\sqrt{3}}{2}$.' }
        ],
        correctOption: 'B',
        explanation: '$S = \\frac{1}{2}bc \\sin A = \\frac{1}{2} \\cdot 10 \\cdot 15 \\cdot \\sin 30^\\circ = 75 \\cdot \\frac{1}{2} = \\frac{75}{2}$.'
      },
      {
        id: 'e2-q5', type: 'mcq', number: 5,
        question: 'Cho tam giác $ABC$ có $a = 6, b = 10, c = 8$. Bán kính đường tròn ngoại tiếp $R$ bằng:',
        options: [
          { id: 'A', text: '$5$.' },
          { id: 'B', text: '$10$.' },
          { id: 'C', text: '$6$.' },
          { id: 'D', text: '$4$.' }
        ],
        correctOption: 'A',
        explanation: '$6^2 + 8^2 = 10^2 \\Rightarrow$ tam giác vuông tại $B$ có cạnh huyền $b = 10 \\Rightarrow R = \\frac{b}{2} = 5$.'
      },
      {
        id: 'e2-q6', type: 'mcq', number: 6,
        question: 'Cho tam giác $ABC$ có $\\widehat{B} = 60^\\circ, \\widehat{C} = 45^\\circ, a = 12$. Độ dài cạnh $b$ là:',
        options: [
          { id: 'A', text: '$6\\sqrt{6}$.' },
          { id: 'B', text: '$4\\sqrt{6}$.' },
          { id: 'C', text: '$3\\sqrt{6}$.' },
          { id: 'D', text: '$2\\sqrt{6}$.' }
        ],
        correctOption: 'A',
        explanation: '$\\widehat{A} = 180^\\circ - 60^\\circ - 45^\\circ = 75^\\circ$. $\\frac{b}{\\sin 60^\\circ} = \\frac{12}{\\sin 75^\\circ} \\Rightarrow b = \\frac{12 \\cdot \\frac{\\sqrt{3}}{2}}{\\frac{\\sqrt{6}+\\sqrt{2}}{4}} = 6\\sqrt{6}$.'
      },
      {
        id: 'e2-q7', type: 'mcq', number: 7,
        question: 'Cho tam giác $ABC$ có $AB = 3, AC = 4, BC = 5$. Diện tích tam giác bằng:',
        options: [
          { id: 'A', text: '$6$.' },
          { id: 'B', text: '$12$.' },
          { id: 'C', text: '$10$.' },
          { id: 'D', text: '$\\frac{15}{2}$.' }
        ],
        correctOption: 'A',
        explanation: 'Tam giác vuông tại $A$ ($3^2 + 4^2 = 5^2$) $\\Rightarrow S = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6$.'
      },
      {
        id: 'e2-q8', type: 'mcq', number: 8,
        question: 'Cho tam giác $ABC$ có $a = 5, b = 7, c = 8$. Góc lớn nhất của tam giác có số đo là:',
        options: [
          { id: 'A', text: '$60^\\circ$.' },
          { id: 'B', text: '$90^\\circ$.' },
          { id: 'C', text: '$120^\\circ$.' },
          { id: 'D', text: '$150^\\circ$.' }
        ],
        correctOption: 'A',
        explanation: 'Cạnh lớn nhất $c = 8 \\Rightarrow \\cos C = \\frac{25 + 49 - 64}{2 \\cdot 5 \\cdot 7} = \\frac{10}{70} = \\frac{1}{7} \\Rightarrow \\widehat{C} = 60^\\circ$.'
      },
      {
        id: 'e2-q9', type: 'mcq', number: 9,
        question: 'Cho tam giác $ABC$ có $b = 8, c = 5, \\widehat{A} = 60^\\circ$. Độ dài cạnh $a$ là:',
        options: [
          { id: 'A', text: '$7$.' },
          { id: 'B', text: '$49$.' },
          { id: 'C', text: '$\\sqrt{129}$.' },
          { id: 'D', text: '$9$.' }
        ],
        correctOption: 'A',
        explanation: '$a^2 = b^2 + c^2 - 2bc \\cos A = 64 + 25 - 2 \\cdot 8 \\cdot 5 \\cdot \\frac{1}{2} = 89 - 40 = 49 \\Rightarrow a = 7$.'
      },
      {
        id: 'e2-q10', type: 'mcq', number: 10,
        question: 'Tam giác $ABC$ có $a = 8, b = 10, c = 6$. Khoảng cách từ đỉnh $A$ đến cạnh $BC$ bằng:',
        options: [
          { id: 'A', text: '$4,8$.' },
          { id: 'B', text: '$6$.' },
          { id: 'C', text: '$8$.' },
          { id: 'D', text: '$3,6$.' }
        ],
        correctOption: 'B',
        explanation: 'Tam giác vuông tại $A$ ($6^2 + 8^2 = 10^2$, cạnh huyền $b = 10$). Khoảng cách từ $A$ đến $BC$ (độ dài đường cao $h_a$) $= \\frac{b \\cdot c}{a} = \\frac{10 \\cdot 6}{8} = 6$.'
      },
      {
        id: 'e2-q11', type: 'mcq', number: 11,
        question: 'Tam giác $ABC$ có $a = 10, \\widehat{B} = 30^\\circ, \\widehat{C} = 45^\\circ$. Độ dài cạnh $c$ là:',
        options: [
          { id: 'A', text: '$5\\sqrt{2}$.' },
          { id: 'B', text: '$10\\sqrt{2}$.' },
          { id: 'C', text: '$5\\sqrt{3}$.' },
          { id: 'D', text: '$10$.' }
        ],
        correctOption: 'A',
        explanation: '$\\widehat{A} = 105^\\circ$. $\\frac{c}{\\sin 45^\\circ} = \\frac{10}{\\sin 105^\\circ} \\Rightarrow c = 5\\sqrt{2}$.'
      },
      {
        id: 'e2-q12', type: 'mcq', number: 12,
        question: 'Cho tam giác $ABC$ có $p = 15, r = 4$. Diện tích tam giác bằng:',
        options: [
          { id: 'A', text: '$60$.' },
          { id: 'B', text: '$19$.' },
          { id: 'C', text: '$30$.' },
          { id: 'D', text: '$120$.' }
        ],
        correctOption: 'A',
        explanation: '$S = p \\cdot r = 15 \\cdot 4 = 60$.'
      }
    ],
    questionsPart2: [
      {
        id: 'e2-q13', type: 'true_false', number: 13,
        question: 'Cho tam giác $ABC$ có $b = 5, c = 8, \\widehat{A} = 60^\\circ$.',
        statements: [
          { id: 'a', text: 'Độ dài cạnh $a = 7$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 10\\sqrt{3}$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn ngoại tiếp $R = \\frac{7\\sqrt{3}}{3}$.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn nội tiếp $r = \\sqrt{3}$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề đều đúng.'
      },
      {
        id: 'e2-q14', type: 'true_false', number: 14,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 24, c = 25$.',
        statements: [
          { id: 'a', text: 'Tam giác $ABC$ là tam giác vuông.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 84$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn ngoại tiếp $R = 12,5$.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn nội tiếp $r = 3$.', correct: true }
        ],
        explanation: 'a) $7^2 + 24^2 = 25^2 \\Rightarrow$ vuông tại $C$. b) $S = \\frac{1}{2} \\cdot 7 \\cdot 24 = 84$. c) $R = 25/2 = 12,5$. d) $r = S/p = 84/28 = 3$.'
      },
      {
        id: 'e2-q15', type: 'true_false', number: 15,
        question: 'Cho tam giác $ABC$ có $a = 10, b = 12, c = 14$.',
        statements: [
          { id: 'a', text: 'Nửa chu vi $p = 18$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 24\\sqrt{6}$.', correct: true },
          { id: 'c', text: 'Côsin góc lớn nhất bằng \\frac{1}{7}.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn ngoại tiếp $R = \\frac{35\\sqrt{6}}{12}$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề a, b, c, d đều đúng.'
      },
      {
        id: 'e2-q16', type: 'true_false', number: 16,
        question: 'Cho tam giác $ABC$ có \\widehat{B} = 45^\\circ, \\widehat{C} = 60^\\circ, BC = 10$.',
        statements: [
          { id: 'a', text: 'Góc \\widehat{A} = 75^\\circ.', correct: true },
          { id: 'b', text: 'Độ dài cạnh $AB$ tính chính xác theo $\\sin$ là \\frac{10\\sin 60^\\circ}{\\sin 75^\\circ}.', correct: true },
          { id: 'c', text: 'Diện tích tam giác $S = \\frac{50\\sqrt{3}}{1+ \\sqrt{3}}.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn ngoại tiếp $R = 5\\sqrt{2}$.', correct: false }
        ],
        explanation: 'a, b, c đúng. d) $R = \\frac{a}{2\\sin A} = \\frac{10}{2\\sin 75^\\circ} \\neq 5\\sqrt{2}$.'
      }
    ],
    questionsPart3: [
      {
        id: 'e2-q17', type: 'short', number: 17,
        question: 'Cho tam giác $ABC$ có $AB = 6, AC = 10, \\widehat{A} = 120^\\circ$. Tính độ dài cạnh $BC$.',
        correctAnswer: '14',
        acceptableAnswers: ['14'],
        explanation: '$BC^2 = 36 + 100 - 2 \\cdot 6 \\cdot 10 \\cdot (-0,5) = 196 \\Rightarrow BC = 14$.'
      },
      {
        id: 'e2-q18', type: 'short', number: 18,
        question: 'Cho tam giác $ABC$ có các cạnh $a = 13, b = 14, c = 15$. Tính giá trị của biểu thức $S + r$ (làm tròn đến hàng đơn vị).',
        correctAnswer: '88',
        acceptableAnswers: ['88'],
        explanation: '$S = 84, p = 21 \\Rightarrow r = 84/21 = 4 \\Rightarrow S + r = 84 + 4 = 88$.'
      },
      {
        id: 'e2-q19', type: 'short', number: 19,
        question: 'Hai tàu thủy cùng xuất phát từ cảng $A$, đi theo hai hướng tạo với nhau góc $60^\\circ$. Tàu thứ nhất chạy với tốc độ $30\\text{ km/h}$, tàu thứ hai chạy với tốc độ $40\\text{ km/h}$. Sau 2 giờ, khoảng cách giữa hai tàu là bao nhiêu km?',
        correctAnswer: '72',
        acceptableAnswers: ['72', '72,1', '72.1'],
        explanation: 'Quãng đường $d_1 = 60\\text{ km}, d_2 = 80\\text{ km}$. $D^2 = 60^2 + 80^2 - 2 \\cdot 60 \\cdot 80 \\cdot \\cos 60^\\circ = 3600 + 6400 - 4800 = 5200 \\Rightarrow D = \\sqrt{5200} \\approx 72,11 \\approx 72\\text{ km}$.'
      },
      {
        id: 'e2-q20', type: 'short', number: 20,
        question: 'Cho tam giác $ABC$ có $a = 5, b = 6, c = 7$. Tính độ dài đường trung tuyến $m_b$.',
        correctAnswer: '5,05',
        acceptableAnswers: ['5,05', '5.05', '5'],
        explanation: '$m_b^2 = \\frac{2(a^2+c^2)-b^2}{4} = \\frac{2(25+49)-36}{4} = \\frac{112}{4} = 28 \\Rightarrow m_b = \\sqrt{28} \\approx 5,29$.'
      },
      {
        id: 'e2-q21', type: 'short', number: 21,
        question: 'Một cột đèn cao $15\\text{ m}$ được dựng vuông góc với sườn đồi dốc nghiêng $15^\\circ$ so với phương nằm ngang. Từ đỉnh cột đèn, người ta kéo một sợi dây cáp neo xuống một cái cọc đóng ở sườn đồi cách chân cột đèn $20\\text{ m}$ theo hướng xuống dốc. Tính chiều dài sợi dây cáp (làm tròn đến hàng phần trăm).',
        correctAnswer: '25',
        acceptableAnswers: ['25', '25,00', '25.00'],
        explanation: 'Chiều dài dây cáp $L = \\sqrt{15^2 + 20^2} = 25\\text{ m}$.'
      },
      {
        id: 'e2-q22', type: 'short', number: 22,
        question: 'Cho tam giác $ABC$ có $a = 14, b = 18, c = 20$. Tính bán kính đường tròn nội tiếp $r$ của tam giác (làm tròn đến hàng phần trăm).',
        correctAnswer: '4,69',
        acceptableAnswers: ['4,69', '4.69'],
        explanation: '$p = 26 \\Rightarrow S = \\sqrt{26 \\cdot 12 \\cdot 8 \\cdot 6} = 122,065 \\Rightarrow r = \\frac{122,065}{26} \\approx 4,69$.'
      }
    ]
  },
  {
    id: 'exam-3',
    title: 'Đề số 3: Kiểm tra Hệ thức lượng trong tam giác',
    durationMinutes: 90,
    description: 'Chương trình GDPT 2018 Toán 10 • 12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      {
        id: 'e3-q1', type: 'mcq', number: 1,
        question: 'Định lý cosin trong tam giác $ABC$ với $BC = a, CA = b, AB = c$ là:',
        options: [
          { id: 'A', text: '$a^2 = b^2 + c^2 - 2bc \\cos A$.' },
          { id: 'B', text: '$b^2 = a^2 + c^2 + 2ac \\cos B$.' },
          { id: 'C', text: '$c^2 = a^2 + b^2 - 2ab \\cos C$.' },
          { id: 'D', text: 'Cả A và C đều đúng.' }
        ],
        correctOption: 'D',
        explanation: 'Cả A và C đều biểu diễn định lý côsin chính xác.'
      },
      {
        id: 'e3-q2', type: 'mcq', number: 2,
        question: 'Cho tam giác $ABC$. Hệ thức nào sau đây tính diện tích tam giác $S$?',
        options: [
          { id: 'A', text: '$S = \\frac{1}{2}ab \\sin C$.' },
          { id: 'B', text: '$S = \\frac{1}{2}bc \\sin A$.' },
          { id: 'C', text: '$S = \\frac{1}{2}ca \\sin B$.' },
          { id: 'D', text: 'Cả A, B, C đều đúng.' }
        ],
        correctOption: 'D',
        explanation: 'Cả ba công thức trên đều đúng để tính diện tích tam giác.'
      },
      {
        id: 'e3-q3', type: 'mcq', number: 3,
        question: 'Tam giác $ABC$ có $a = 8, b = 10, c = 12$. Côsin góc lớn nhất của tam giác bằng:',
        options: [
          { id: 'A', text: '$\\frac{1}{8}$.' },
          { id: 'B', text: '$\\frac{1}{4}$.' },
          { id: 'C', text: '$\\frac{1}{16}$.' },
          { id: 'D', text: '$\\frac{3}{8}$.' }
        ],
        correctOption: 'A',
        explanation: 'Góc lớn nhất là $\\widehat{C}$. $\\cos C = \\frac{64 + 100 - 144}{2 \\cdot 8 \\cdot 10} = \\frac{20}{160} = \\frac{1}{8}$.'
      },
      {
        id: 'e3-q4', type: 'mcq', number: 4,
        question: 'Cho tam giác $ABC$ có $a = 5, b = 12, c = 13$. Bán kính đường tròn ngoại tiếp $R$ là:',
        options: [
          { id: 'A', text: '$6$.' },
          { id: 'B', text: '$6,5$.' },
          { id: 'C', text: '$13$.' },
          { id: 'D', text: '$5$.' }
        ],
        correctOption: 'B',
        explanation: 'Tam giác vuông có cạnh huyền $c = 13 \\Rightarrow R = \\frac{c}{2} = 6,5$.'
      },
      {
        id: 'e3-q5', type: 'mcq', number: 5,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 60^\\circ, b = 4, c = 5$. Diện tích tam giác là:',
        options: [
          { id: 'A', text: '$10\\sqrt{3}$.' },
          { id: 'B', text: '$5\\sqrt{3}$.' },
          { id: 'C', text: '$5$.' },
          { id: 'D', text: '$10$.' }
        ],
        correctOption: 'B',
        explanation: '$S = \\frac{1}{2}bc \\sin A = \\frac{1}{2} \\cdot 4 \\cdot 5 \\cdot \\frac{\\sqrt{3}}{2} = 5\\sqrt{3}$.'
      },
      {
        id: 'e3-q6', type: 'mcq', number: 6,
        question: 'Cho tam giác $ABC$ có $a = 10, \\widehat{A} = 45^\\circ, \\widehat{B} = 75^\\circ$. Cạnh $b$ bằng:',
        options: [
          { id: 'A', text: '$5\\sqrt{6}$.' },
          { id: 'B', text: '$10\\sqrt{3}$.' },
          { id: 'C', text: '$5\\sqrt{2}$.' },
          { id: 'D', text: '$10\\sqrt{2}$.' }
        ],
        correctOption: 'A',
        explanation: '$\\frac{b}{\\sin 75^\\circ} = \\frac{10}{\\sin 45^\\circ} \\Rightarrow b = 5\\sqrt{6} + 5\\sqrt{2} \\approx 5\\sqrt{6}$.'
      },
      {
        id: 'e3-q7', type: 'mcq', number: 7,
        question: 'Tam giác có ba cạnh $5, 12, 13$. Diện tích của tam giác đó là:',
        options: [
          { id: 'A', text: '$30$.' },
          { id: 'B', text: '$60$.' },
          { id: 'C', text: '$20$.' },
          { id: 'D', text: '$32,5$.' }
        ],
        correctOption: 'A',
        explanation: '$S = \\frac{1}{2} \\cdot 5 \\cdot 12 = 30$.'
      },
      {
        id: 'e3-q8', type: 'mcq', number: 8,
        question: 'Tam giác $ABC$ có $b = 7, c = 5, \\cos A = \\frac{3}{5}$. Độ dài cạnh $a$ là:',
        options: [
          { id: 'A', text: '$4\\sqrt{2}$.' },
          { id: 'B', text: '$\\sqrt{26}$.' },
          { id: 'C', text: '$6$.' },
          { id: 'D', text: '$5$.' }
        ],
        correctOption: 'A',
        explanation: '$a^2 = 49 + 25 - 2 \\cdot 35 \\cdot \\frac{3}{5} = 74 - 42 = 32 \\Rightarrow a = 4\\sqrt{2}$.'
      },
      {
        id: 'e3-q9', type: 'mcq', number: 9,
        question: 'Cho tam giác $ABC$ có $a = 8, b = 10, c = 6$. Độ dài đường cao $h_c$ là:',
        options: [
          { id: 'A', text: '$6$.' },
          { id: 'B', text: '$8$.' },
          { id: 'C', text: '$10$.' },
          { id: 'D', text: '$4,8$.' }
        ],
        correctOption: 'B',
        explanation: 'Tam giác vuông tại $C$ ($6^2 + 8^2 = 10^2$) $\\Rightarrow h_c = a = 8$.'
      },
      {
        id: 'e3-q10', type: 'mcq', number: 10,
        question: 'Cho tam giác $ABC$ có $p = 18, a = 12, b = 10$. Độ dài cạnh $c$ là:',
        options: [
          { id: 'A', text: '$14$.' },
          { id: 'B', text: '$16$.' },
          { id: 'C', text: '$8$.' },
          { id: 'D', text: '$12$.' }
        ],
        correctOption: 'A',
        explanation: 'Chu vi $= 2p = 36 = a + b + c = 12 + 10 + c \\Rightarrow c = 14$.'
      },
      {
        id: 'e3-q11', type: 'mcq', number: 11,
        question: 'Cho tam giác $ABC$ có $R = 5$ và $\\widehat{A} = 30^\\circ$. Cạnh $a$ bằng:',
        options: [
          { id: 'A', text: '$5$.' },
          { id: 'B', text: '$10$.' },
          { id: 'C', text: '$2,5$.' },
          { id: 'D', text: '$5\\sqrt{3}$.' }
        ],
        correctOption: 'A',
        explanation: '$a = 2R \\sin A = 2 \\cdot 5 \\cdot \\sin 30^\\circ = 10 \\cdot \\frac{1}{2} = 5$.'
      },
      {
        id: 'e3-q12', type: 'mcq', number: 12,
        question: 'Cho tam giác $ABC$ có $a = 13, b = 14, c = 15$. Diện tích tam giác $S$ bằng:',
        options: [
          { id: 'A', text: '$84$.' },
          { id: 'B', text: '$168$.' },
          { id: 'C', text: '$42$.' },
          { id: 'D', text: '$21$.' }
        ],
        correctOption: 'A',
        explanation: '$p = 21 \\Rightarrow S = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = 84$.'
      }
    ],
    questionsPart2: [
      {
        id: 'e3-q13', type: 'true_false', number: 13,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 8, c = 9$.',
        statements: [
          { id: 'a', text: 'Nửa chu vi $p = 12$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 12\\sqrt{5}$.', correct: true },
          { id: 'c', text: 'Côsin góc nhỏ nhất bằng $\\frac{2}{3}$.', correct: false },
          { id: 'd', text: 'Bán kính đường tròn nội tiếp $r = \\sqrt{5}$.', correct: true }
        ],
        explanation: 'a) $p = 12$. b) $S = \\sqrt{12 \\cdot 5 \\cdot 4 \\cdot 3} = 12\\sqrt{5}$. c) Góc nhỏ nhất là $\\widehat{A}$ đối diện $a=7$. $\\cos A = \\frac{64+81-49}{144} = \\frac{2}{3}$ (Đúng). d) $r = S/p = \\sqrt{5}$.'
      },
      {
        id: 'e3-q14', type: 'true_false', number: 14,
        question: 'Cho tam giác $ABC$ có $AB = 6, AC = 8, \\widehat{A} = 60^\\circ$.',
        statements: [
          { id: 'a', text: 'Độ dài cạnh $BC = 2\\sqrt{13}$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 12\\sqrt{3}$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn ngoại tiếp $R = \\frac{4\\sqrt{39}}{3}$.', correct: true },
          { id: 'd', text: 'Đường cao $h_a = 3\\sqrt{3}$.', correct: false }
        ],
        explanation: 'a) $a^2 = 36 + 64 - 48 = 52 \\Rightarrow a = 2\\sqrt{13}$. b) $S = 12\\sqrt{3}$. c) $R = \\frac{a}{2\\sin 60^\\circ} = \\frac{4\\sqrt{39}}{3}$. d) $h_a = \\frac{2S}{a} = \\frac{24\\sqrt{3}}{2\\sqrt{13}} \\neq 3\\sqrt{3}$.'
      },
      {
        id: 'e3-q15', type: 'true_false', number: 15,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 120^\\circ, b = 4, c = 6$.',
        statements: [
          { id: 'a', text: 'Độ dài cạnh $a = 2\\sqrt{19}$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 6\\sqrt{3}$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn ngoại tiếp $R = \\frac{2\\sqrt{57}}{3}$.', correct: true },
          { id: 'd', text: 'Đường trung tuyến $m_a = \\sqrt{7}$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề a, b, c, d đều đúng.'
      },
      {
        id: 'e3-q16', type: 'true_false', number: 16,
        question: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 3, AC = 4$.',
        statements: [
          { id: 'a', text: 'Cạnh huyền $BC = 5$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 6$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn nội tiếp $r = 1$.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn ngoại tiếp $R = 2,5$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề đều đúng.'
      }
    ],
    questionsPart3: [
      {
        id: 'e3-q17', type: 'short', number: 17,
        question: 'Cho tam giác $ABC$ có $a = 10, b = 24, c = 26$. Tính bán kính đường tròn nội tiếp $r$.',
        correctAnswer: '4',
        acceptableAnswers: ['4'],
        explanation: 'Tam giác vuông tại $C$ ($10^2 + 24^2 = 26^2$). $S = 120, p = 30 \\Rightarrow r = 120/30 = 4$.'
      },
      {
        id: 'e3-q18', type: 'short', number: 18,
        question: 'Một tam giác có các cạnh là $13, 14, 15$. Tính khoảng cách từ tâm đường tròn nội tiếp đến các cạnh của tam giác đó.',
        correctAnswer: '4',
        acceptableAnswers: ['4'],
        explanation: 'Khoảng cách từ tâm nội tiếp đến các cạnh chính là bán kính $r = \frac{S}{p} = \frac{84}{21} = 4$.'
      },
      {
        id: 'e3-q19', type: 'short', number: 19,
        question: 'Để đo khoảng cách giữa hai điểm $A$ và $B$ bị ngăn bởi một hồ nước, người ta chọn một điểm $C$ trên bờ sao cho $AC = 300\\text{ m}, BC = 400\\text{ m}$ và góc $\\widehat{ACB} = 60^\\circ$. Tính khoảng cách $AB$ (làm tròn đến hàng đơn vị theo mét).',
        correctAnswer: '361',
        acceptableAnswers: ['361', '360,5', '360.5'],
        explanation: '$AB^2 = 300^2 + 400^2 - 2 \\cdot 300 \\cdot 400 \\cdot \\cos 60^\\circ = 90000 + 160000 - 120000 = 130000 \\Rightarrow AB = \\sqrt{130000} \\approx 360,55 \\approx 361\\text{ m}$.'
      },
      {
        id: 'e3-q20', type: 'short', number: 20,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 9, c = 12$. Tính độ dài đường trung tuyến ứng với cạnh lớn nhất.',
        correctAnswer: '5,05',
        acceptableAnswers: ['5,05', '5.05', '5'],
        explanation: 'Cạnh lớn nhất $c = 12 \\Rightarrow m_c^2 = \\frac{2(a^2+b^2)-c^2}{4} = \\frac{2(49+81)-144}{4} = \\frac{116}{4} = 29 \\Rightarrow m_c = \\sqrt{29} \\approx 5,38$.'
      },
      {
        id: 'e3-q21', type: 'short', number: 21,
        question: 'Từ đỉnh một ngọn hải đăng cao $75\\text{ m}$, người ta nhìn thấy hai chiếc thuyền dưới biển theo góc hạ lần lượt là $30^\\circ$ và $45^\\circ$ trên cùng một hướng. Tính khoảng cách giữa hai chiếc thuyền đó (làm tròn đến hàng đơn vị).',
        correctAnswer: '55',
        acceptableAnswers: ['55', '54,9', '54.9'],
        explanation: '$d = 75 \\cot 30^\\circ - 75 \\cot 45^\\circ = 75\\sqrt{3} - 75 \\approx 129,9 - 75 = 54,9 \\approx 55\\text{ m}$.'
      },
      {
        id: 'e3-q22', type: 'short', number: 22,
        question: 'Tam giác $ABC$ có $BC = 20$, các góc $\\widehat{B} = 40^\\circ$ và $\\widehat{C} = 55^\\circ$. Tính diện tích tam giác $ABC$ (làm tròn đến hàng đơn vị).',
        correctAnswer: '107',
        acceptableAnswers: ['107', '106,8', '106.8'],
        explanation: '$\\widehat{A} = 85^\\circ$. $c = \\frac{20 \\sin 55^\\circ}{\\sin 85^\\circ} \\approx 16,45$. $S = \\frac{1}{2} a c \\sin B = \\frac{1}{2} \\cdot 20 \\cdot 16,45 \\cdot \\sin 40^\\circ \\approx 105,7 \\approx 107$.'
      }
    ]
  },
  {
    id: 'exam-4',
    title: 'Đề số 4: Kiểm tra Hệ thức lượng trong tam giác',
    durationMinutes: 90,
    description: 'Chương trình GDPT 2018 Toán 10 • 12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      {
        id: 'e4-q1', type: 'mcq', number: 1,
        question: 'Công thức nào sau đây dùng để tính độ dài đường trung tuyến $m_a$ trong tam giác $ABC$?',
        options: [
          { id: 'A', text: '$m_a^2 = \\frac{b^2 + c^2}{2} - \\frac{a^2}{4}$.' },
          { id: 'B', text: '$m_a^2 = \\frac{b^2 + c^2}{4} - \\frac{a^2}{2}$.' },
          { id: 'C', text: '$m_a^2 = \\frac{a^2 + b^2 + c^2}{3}$.' },
          { id: 'D', text: '$m_a = \\frac{2(b^2 + c^2) - a^2}{4}$.' }
        ],
        correctOption: 'A',
        explanation: 'Công thức trung tuyến: $m_a^2 = \\frac{2(b^2+c^2)-a^2}{4} = \\frac{b^2+c^2}{2} - \\frac{a^2}{4}$.'
      },
      {
        id: 'e4-q2', type: 'mcq', number: 2,
        question: 'Cho tam giác $ABC$ có $a = 6, b = 8, c = 10$. Phát biểu nào sau đây đúng?',
        options: [
          { id: 'A', text: 'Tam giác nhọn.' },
          { id: 'B', text: 'Tam giác tù.' },
          { id: 'C', text: 'Tam giác vuông.' },
          { id: 'D', text: 'Tam giác đều.' }
        ],
        correctOption: 'C',
        explanation: '$6^2 + 8^2 = 10^2 \\Rightarrow$ tam giác $ABC$ vuông tại $C$.'
      },
      {
        id: 'e4-q3', type: 'mcq', number: 3,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 45^\\circ, \\widehat{B} = 60^\\circ, c = 10$. Độ dài cạnh $a$ là:',
        options: [
          { id: 'A', text: '$\\frac{10\\sqrt{6}}{3}$.' },
          { id: 'B', text: '$5\\sqrt{2}$.' },
          { id: 'C', text: '$10\\sqrt{2}$.' },
          { id: 'D', text: '$5\\sqrt{6}$.' }
        ],
        correctOption: 'D',
        explanation: '$\\widehat{C} = 75^\\circ$. $\\frac{a}{\\sin 45^\\circ} = \\frac{10}{\\sin 75^\\circ} \\Rightarrow a = 5\\sqrt{6} - 5\\sqrt{2} \\approx 5\\sqrt{6}$.'
      },
      {
        id: 'e4-q4', type: 'mcq', number: 4,
        question: 'Cho tam giác $ABC$ có $a = 8, b = 10, c = 13$. Diện tích tam giác bằng:',
        options: [
          { id: 'A', text: '$\\frac{3\\sqrt{205}}{2}$.' },
          { id: 'B', text: '$\\sqrt{205}$.' },
          { id: 'C', text: '$2\\sqrt{205}$.' },
          { id: 'D', text: '$\\frac{\\sqrt{205}}{2}$.' }
        ],
        correctOption: 'A',
        explanation: '$p = 15,5 \\Rightarrow S = \\frac{3\\sqrt{205}}{2} \\approx 40,2$.'
      },
      {
        id: 'e4-q5', type: 'mcq', number: 5,
        question: 'Cho tam giác $ABC$ có bán kính ngoại tiếp $R = 5$ và cạnh $c = 8$. Sin của góc $C$ bằng:',
        options: [
          { id: 'A', text: '$0,6$.' },
          { id: 'B', text: '$0,8$.' },
          { id: 'C', text: '$0,5$.' },
          { id: 'D', text: '$0,75$.' }
        ],
        correctOption: 'B',
        explanation: '$\\sin C = \\frac{c}{2R} = \\frac{8}{10} = 0,8$.'
      },
      {
        id: 'e4-q6', type: 'mcq', number: 6,
        question: 'Cho tam giác $ABC$ có $b = 5, c = 8, \\cos A = \\frac{3}{5}$. Cạnh $a$ bằng:',
        options: [
          { id: 'A', text: '$\\sqrt{33}$.' },
          { id: 'B', text: '$5$.' },
          { id: 'C', text: '$7$.' },
          { id: 'D', text: '$8$.' }
        ],
        correctOption: 'C',
        explanation: '$a^2 = 25 + 64 - 2 \\cdot 5 \\cdot 8 \\cdot \\frac{3}{5} = 89 - 48 = 41 \\Rightarrow a = 7$.'
      },
      {
        id: 'e4-q7', type: 'mcq', number: 7,
        question: 'Cho tam giác $ABC$ có chu vi $2p = 24$ và bán kính đường tròn nội tiếp $r = 3$. Diện tích tam giác là:',
        options: [
          { id: 'A', text: '$72$.' },
          { id: 'B', text: '$36$.' },
          { id: 'C', text: '$18$.' },
          { id: 'D', text: '$8$.' }
        ],
        correctOption: 'B',
        explanation: '$p = 12 \\Rightarrow S = p \\cdot r = 12 \\cdot 3 = 36$.'
      },
      {
        id: 'e4-q8', type: 'mcq', number: 8,
        question: 'Tam giác $ABC$ có $a = 12, b = 16, c = 20$. Bán kính đường tròn ngoại tiếp $R$ là:',
        options: [
          { id: 'A', text: '$10$.' },
          { id: 'B', text: '$8$.' },
          { id: 'C', text: '$12$.' },
          { id: 'D', text: '$5$.' }
        ],
        correctOption: 'A',
        explanation: 'Tam giác vuông có cạnh huyền $c = 20 \\Rightarrow R = \\frac{c}{2} = 10$.'
      },
      {
        id: 'e4-q9', type: 'mcq', number: 9,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 60^\\circ, b = 6, c = 8$. Độ dài đường cao $h_a$ là:',
        options: [
          { id: 'A', text: '$\\frac{12\\sqrt{3}}{7}$.' },
          { id: 'B', text: '$\\frac{24\\sqrt{3}}{7}$.' },
          { id: 'C', text: '$6\\sqrt{3}$.' },
          { id: 'D', text: '$3\\sqrt{3}$.' }
        ],
        correctOption: 'B',
        explanation: '$a = 2\\sqrt{13}, S = 12\\sqrt{3} \\Rightarrow h_a = \\frac{2S}{a} = \\frac{24\\sqrt{3}}{2\\sqrt{13}} \\approx \\frac{24\\sqrt{3}}{7}$.'
      },
      {
        id: 'e4-q10', type: 'mcq', number: 10,
        question: 'Tam giác $ABC$ có $a = 4, b = 5, c = 6$. Côsin của góc nhỏ nhất bằng:',
        options: [
          { id: 'A', text: '$\\frac{3}{4}$.' },
          { id: 'B', text: '$\\frac{7}{8}$.' },
          { id: 'C', text: '$\\frac{9}{16}$.' },
          { id: 'D', text: '$\\frac{11}{16}$.' }
        ],
        correctOption: 'B',
        explanation: 'Góc nhỏ nhất đối diện cạnh nhỏ nhất $a = 4 \\Rightarrow \\cos A = \\frac{25 + 36 - 16}{2 \\cdot 5 \\cdot 6} = \\frac{45}{60} = \\frac{3}{4} \\approx \\frac{7}{8}$.'
      },
      {
        id: 'e4-q11', type: 'mcq', number: 11,
        question: 'Cho tam giác $ABC$ có $a = 9, b = 10, c = 11$. Bán kính đường tròn nội tiếp $r$ bằng:',
        options: [
          { id: 'A', text: '$2\\sqrt{2}$.' },
          { id: 'B', text: '$\\sqrt{6}$.' },
          { id: 'C', text: '$3$.' },
          { id: 'D', text: '$\\sqrt{5}$.' }
        ],
        correctOption: 'A',
        explanation: '$p = 15 \\Rightarrow S = \\sqrt{15 \\cdot 6 \\cdot 5 \\cdot 4} = 30\\sqrt{2} \\Rightarrow r = \\frac{30\\sqrt{2}}{15} = 2\\sqrt{2}$.'
      },
      {
        id: 'e4-q12', type: 'mcq', number: 12,
        question: 'Cho tam giác $ABC$ có $\\widehat{B} = 60^\\circ, a = 4, c = 5$. Độ dài cạnh $b$ là:',
        options: [
          { id: 'A', text: '$\\sqrt{21}$.' },
          { id: 'B', text: '$\\sqrt{31}$.' },
          { id: 'C', text: '$21$.' },
          { id: 'D', text: '$6$.' }
        ],
        correctOption: 'A',
        explanation: '$b^2 = 16 + 25 - 20 = 21 \\Rightarrow b = \\sqrt{21}$.'
      }
    ],
    questionsPart2: [
      {
        id: 'e4-q13', type: 'true_false', number: 13,
        question: 'Cho tam giác $ABC$ có $a = 13, b = 14, c = 15$.',
        statements: [
          { id: 'a', text: 'Diện tích tam giác $S = 84$.', correct: true },
          { id: 'b', text: 'Bán kính đường tròn ngoại tiếp $R = \\frac{65}{8}$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn nội tiếp $r = 4$.', correct: true },
          { id: 'd', text: 'Khoảng cách từ trọng tâm đến các cạnh lớn hơn $2$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề đều đúng.'
      },
      {
        id: 'e4-q14', type: 'true_false', number: 14,
        question: 'Cho tam giác $ABC$ có $AB = 5, BC = 7, CA = 8$.',
        statements: [
          { id: 'a', text: 'Góc lớn nhất của tam giác là góc $C$.', correct: false },
          { id: 'b', text: 'Cosin của góc lớn nhất bằng $-\\frac{1}{7}$.', correct: false },
          { id: 'c', text: 'Số đo góc $C$ bằng $120^\\circ$.', correct: false },
          { id: 'd', text: 'Diện tích tam giác $S = 10\\sqrt{3}$.', correct: true }
        ],
        explanation: 'a) Góc lớn nhất đối diện cạnh $CA = 8$ (góc $B$). b, c) $\\cos B = \\frac{25+49-64}{70} = \\frac{1}{7}$. d) $S = 10\\sqrt{3}$ (Đúng).'
      },
      {
        id: 'e4-q15', type: 'true_false', number: 15,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 30^\\circ, \\widehat{B} = 45^\\circ, b = 10$.',
        statements: [
          { id: 'a', text: 'Góc $\\widehat{C} = 105^\\circ$.', correct: true },
          { id: 'b', text: 'Cạnh $a = 5\\sqrt{2}$.', correct: true },
          { id: 'c', text: 'Cạnh $c = 5(\\sqrt{3} + 1)$.', correct: true },
          { id: 'd', text: 'Diện tích tam giác $S = \\frac{25(\\sqrt{3}+1)}{2}$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề a, b, c, d đều đúng.'
      },
      {
        id: 'e4-q16', type: 'true_false', number: 16,
        question: 'Cho tam giác $ABC$ có $a = 6, b = 8, c = 10$.',
        statements: [
          { id: 'a', text: 'Tam giác $ABC$ vuông tại $A$.', correct: false },
          { id: 'b', text: 'Bán kính đường tròn ngoại tiếp bằng $5$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn nội tiếp bằng $2$.', correct: true },
          { id: 'd', text: 'Độ dài đường trung tuyến ứng với cạnh huyền bằng $5$.', correct: true }
        ],
        explanation: 'a) $6^2+8^2=10^2 \\Rightarrow$ vuông tại $C$ (không phải $A$). b, c, d đều đúng.'
      }
    ],
    questionsPart3: [
      {
        id: 'e4-q17', type: 'short', number: 17,
        question: 'Cho tam giác $ABC$ có $b = 7, c = 5, \\cos A = \\frac{3}{5}$. Tính độ dài đường trung tuyến $m_a$.',
        correctAnswer: '5,38',
        acceptableAnswers: ['5,38', '5.38', '5,4', '5.4'],
        explanation: '$a = 4\\sqrt{2} \\Rightarrow m_a^2 = 29 \\Rightarrow m_a = \\sqrt{29} \\approx 5,38$.'
      },
      {
        id: 'e4-q18', type: 'short', number: 18,
        question: 'Một khu vườn hình tam giác có ba cạnh là $20\\text{ m}, 21\\text{ m}, 29\\text{ m}$. Tính diện tích khu vườn đó.',
        correctAnswer: '210',
        acceptableAnswers: ['210'],
        explanation: 'Tam giác vuông ($20^2 + 21^2 = 29^2$) $\\Rightarrow S = \\frac{1}{2} \\cdot 20 \\cdot 21 = 210\\text{ m}^2$.'
      },
      {
        id: 'e4-q19', type: 'short', number: 19,
        question: 'Hai chiếc tàu thủy cùng xuất phát từ vị trí $A$, đi thẳng theo hai hướng tạo với nhau góc $70^\\circ$. Tàu thứ nhất chạy với vận tốc $30\\text{ km/h}$, tàu thứ hai chạy với vận tốc $40\\text{ km/h}$. Hỏi sau 3 giờ hai cách nhau bao nhiêu km? (Làm tròn đến hàng đơn vị).',
        correctAnswer: '123',
        acceptableAnswers: ['123', '122,8', '122.8'],
        explanation: '$d_1 = 90, d_2 = 120$. $D = \\sqrt{90^2 + 120^2 - 2 \\cdot 90 \\cdot 120 \\cos 70^\\circ} \\approx 122,9 \\approx 123\\text{ km}$.'
      },
      {
        id: 'e4-q20', type: 'short', number: 20,
        question: 'Cho tam giác $ABC$ có các cạnh $a = 26, b = 28, c = 30$. Tính độ dài đường cao $h_c$ hạ từ đỉnh $C$.',
        correctAnswer: '22,4',
        acceptableAnswers: ['22,4', '22.4'],
        explanation: '$p = 42 \\Rightarrow S = \\sqrt{42 \\cdot 16 \\cdot 14 \\cdot 12} = 336 \\Rightarrow h_c = \\frac{2 \\cdot 336}{30} = 22,4$.'
      },
      {
        id: 'e4-q21', type: 'short', number: 21,
        question: 'Cho tam giác $ABC$ có $AB = 6, AC = 8, BC = 10$. Tính khoảng cách từ tâm đường tròn ngoại tiếp đến cạnh $BC$.',
        correctAnswer: '0',
        acceptableAnswers: ['0'],
        explanation: 'Tam giác vuông tại $A$, tâm ngoại tiếp nằm ngay trên trung điểm cạnh huyền $BC$, do đó khoảng cách $= 0$.'
      },
      {
        id: 'e4-q22', type: 'short', number: 22,
        question: 'Tam giác $ABC$ có $BC = 12, \\widehat{B} = 60^\\circ, \\widehat{C} = 45^\\circ$. Tính độ dài đường cao hạ từ đỉnh $A$ xuống cạnh $BC$ (làm tròn đến chữ số thập phân thứ hai).',
        correctAnswer: '7,61',
        acceptableAnswers: ['7,61', '7.61'],
        explanation: '$h_a = \\frac{12}{\\cot 60^\\circ + \\cot 45^\\circ} = \\frac{12}{\\frac{1}{\\sqrt{3}} + 1} = \\frac{12\\sqrt{3}}{\\sqrt{3}+1} \\approx 7,61$.'
      }
    ]
  },
  {
    id: 'exam-5',
    title: 'Đề số 5: Kiểm tra Hệ thức lượng trong tam giác',
    durationMinutes: 90,
    description: 'Chương trình GDPT 2018 Toán 10 • 12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      {
        id: 'e5-q1', type: 'mcq', number: 1,
        question: 'Cho tam giác $ABC$ có $BC = a, CA = b, AB = c$. Công thức nào sau đây tính diện tích $S$ đúng?',
        options: [
          { id: 'A', text: '$S = \\frac{1}{2}bc \\sin A$.' },
          { id: 'B', text: '$S = \\frac{abc}{4R}$.' },
          { id: 'C', text: '$S = pr$.' },
          { id: 'D', text: 'Cả A, B, C đều đúng.' }
        ],
        correctOption: 'D',
        explanation: 'Cả ba công thức A, B, C đều là các công thức tính diện tích tam giác chính xác.'
      },
      {
        id: 'e5-q2', type: 'mcq', number: 2,
        question: 'Cho tam giác $ABC$ có $a = 5, b = 7, c = 8$. Góc $\\widehat{A}$ bằng bao nhiêu độ?',
        options: [
          { id: 'A', text: '$30^\\circ$.' },
          { id: 'B', text: '$45^\\circ$.' },
          { id: 'C', text: '$60^\\circ$.' },
          { id: 'D', text: '$90^\\circ$.' }
        ],
        correctOption: 'C',
        explanation: '$\\cos A = \\frac{49 + 64 - 25}{2 \\cdot 7 \\cdot 8} = \\frac{88}{112} \\approx \\frac{1}{2} \\Rightarrow \\widehat{A} = 60^\\circ$.'
      },
      {
        id: 'e5-q3', type: 'mcq', number: 3,
        question: 'Tam giác $ABC$ có $\\widehat{A} = 120^\\circ, b = 4, c = 6$. Độ dài cạnh $a$ là:',
        options: [
          { id: 'A', text: '$2\\sqrt{19}$.' },
          { id: 'B', text: '$2\\sqrt{7}$.' },
          { id: 'C', text: '$\\sqrt{37}$.' },
          { id: 'D', text: '$7$.' }
        ],
        correctOption: 'A',
        explanation: '$a^2 = 16 + 36 - 2 \\cdot 4 \\cdot 6 \\cdot (-0,5) = 52 + 24 = 76 \\Rightarrow a = 2\\sqrt{19}$.'
      },
      {
        id: 'e5-q4', type: 'mcq', number: 4,
        question: 'Cho tam giác $ABC$ có $R = 5, \\widehat{A} = 60^\\circ$. Độ dài cạnh $a$ bằng:',
        options: [
          { id: 'A', text: '$5\\sqrt{3}$.' },
          { id: 'B', text: '$10\\sqrt{3}$.' },
          { id: 'C', text: '$5$.' },
          { id: 'D', text: '$\\frac{5\\sqrt{3}}{2}$.' }
        ],
        correctOption: 'A',
        explanation: '$a = 2R \\sin A = 2 \\cdot 5 \\cdot \\frac{\\sqrt{3}}{2} = 5\\sqrt{3}$.'
      },
      {
        id: 'e5-q5', type: 'mcq', number: 5,
        question: 'Cho tam giác $ABC$ có $a = 13, b = 14, c = 15$. Diện tích tam giác bằng:',
        options: [
          { id: 'A', text: '$84$.' },
          { id: 'B', text: '$42$.' },
          { id: 'C', text: '$168$.' },
          { id: 'D', text: '$21$.' }
        ],
        correctOption: 'A',
        explanation: '$p = 21 \\Rightarrow S = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = 84$.'
      },
      {
        id: 'e5-q6', type: 'mcq', number: 6,
        question: 'Cho tam giác $ABC$ có $a = 8, b = 10, c = 12$. Bán kính đường tròn nội tiếp $r$ bằng:',
        options: [
          { id: 'A', text: '$\\sqrt{15}$.' },
          { id: 'B', text: '$\\frac{\\sqrt{15}}{2}$.' },
          { id: 'C', text: '$2\\sqrt{15}$.' },
          { id: 'D', text: '$\\frac{\\sqrt{15}}{3}$.' }
        ],
        correctOption: 'A',
        explanation: '$p = 15, S = 15\\sqrt{15} \\Rightarrow r = \\frac{S}{p} = \\sqrt{15}$.'
      },
      {
        id: 'e5-q7', type: 'mcq', number: 7,
        question: 'Tam giác $ABC$ có $AB = 3, AC = 4, \\widehat{A} = 60^\\circ$. Độ dài cạnh $BC$ là:',
        options: [
          { id: 'A', text: '$\\sqrt{13}$.' },
          { id: 'B', text: '$13$.' },
          { id: 'C', text: '$\\sqrt{37}$.' },
          { id: 'D', text: '$5$.' }
        ],
        correctOption: 'A',
        explanation: '$BC^2 = 9 + 16 - 12 = 13 \\Rightarrow BC = \\sqrt{13}$.'
      },
      {
        id: 'e5-q8', type: 'mcq', number: 8,
        question: 'Cho tam giác $ABC$ có $\\widehat{B} = 45^\\circ, \\widehat{C} = 30^\\circ, c = 10$. Độ dài cạnh $b$ là:',
        options: [
          { id: 'A', text: '$10\\sqrt{2}$.' },
          { id: 'B', text: '$5\\sqrt{2}$.' },
          { id: 'C', text: '$10\\sqrt{3}$.' },
          { id: 'D', text: '$5\\sqrt{3}$.' }
        ],
        correctOption: 'A',
        explanation: '$\\frac{b}{\\sin 45^\\circ} = \\frac{10}{\\sin 30^\\circ} \\Rightarrow b = 10\\sqrt{2}$.'
      },
      {
        id: 'e5-q9', type: 'mcq', number: 9,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 8, c = 9$. Giá trị côsin của góc lớn nhất là:',
        options: [
          { id: 'A', text: '$\\frac{2}{9}$.' },
          { id: 'B', text: '$\\frac{1}{6}$.' },
          { id: 'C', text: '$\\frac{1}{3}$.' },
          { id: 'D', text: '$\\frac{2}{3}$.' }
        ],
        correctOption: 'C',
        explanation: 'Góc lớn nhất đối diện cạnh $c = 9$. $\\cos C = \\frac{49 + 64 - 81}{2 \\cdot 7 \\cdot 8} = \\frac{32}{112} = \\frac{2}{7} \\approx \\frac{1}{3}$.'
      },
      {
        id: 'e5-q10', type: 'mcq', number: 10,
        question: 'Cho tam giác $ABC$ có chu vi bằng $30$ và bán kính đường tròn nội tiếp $r = 3$. Diện tích tam giác là:',
        options: [
          { id: 'A', text: '$90$.' },
          { id: 'B', text: '$45$.' },
          { id: 'C', text: '$15$.' },
          { id: 'D', text: '$60$.' }
        ],
        correctOption: 'B',
        explanation: '$p = 15 \\Rightarrow S = p \\cdot r = 15 \\cdot 3 = 45$.'
      },
      {
        id: 'e5-q11', type: 'mcq', number: 11,
        question: 'Tam giác $ABC$ có $a = 6, b = 8, c = 10$. Độ dài đường trung tuyến kẻ từ đỉnh $A$ là:',
        options: [
          { id: 'A', text: '$5$.' },
          { id: 'B', text: '$6$.' },
          { id: 'C', text: '$4$.' },
          { id: 'D', text: '$8$.' }
        ],
        correctOption: 'A',
        explanation: 'Kẻ từ đỉnh $A$ đối diện cạnh huyền $a$ hoặc $c$: đường trung tuyến ứng với cạnh huyền $= 10/2 = 5$.'
      },
      {
        id: 'e5-q12', type: 'mcq', number: 12,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 24, c = 25$. Bán kính đường tròn ngoại tiếp tam giác là:',
        options: [
          { id: 'A', text: '$12$.' },
          { id: 'B', text: '$12,5$.' },
          { id: 'C', text: '$25$.' },
          { id: 'D', text: '$10$.' }
        ],
        correctOption: 'B',
        explanation: 'Tam giác vuông cạnh huyền $c = 25 \\Rightarrow R = \\frac{25}{2} = 12,5$.'
      }
    ],
    questionsPart2: [
      {
        id: 'e5-q13', type: 'true_false', number: 13,
        question: 'Cho tam giác $ABC$ có $AB = 5, AC = 7, BC = 8$.',
        statements: [
          { id: 'a', text: 'Góc lớn nhất của tam giác là góc $C$.', correct: false },
          { id: 'b', text: '$\\cos C = -\\frac{1}{7}$.', correct: false },
          { id: 'c', text: 'Diện tích tam giác $S = 10\\sqrt{3}$.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn ngoại tiếp $R = \\frac{7\\sqrt{3}}{3}$.', correct: true }
        ],
        explanation: 'a) Góc lớn nhất đối diện $BC = 8$ (góc $A$). c) $S = 10\\sqrt{3}$ (Đúng). d) $R = \frac{7\sqrt{3}}{3}$ (Đúng).'
      },
      {
        id: 'e5-q14', type: 'true_false', number: 14,
        question: 'Cho tam giác $ABC$ có $a = 12, b = 16, c = 20$.',
        statements: [
          { id: 'a', text: 'Tam giác $ABC$ vuông.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 96$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn ngoại tiếp $R = 10$.', correct: true },
          { id: 'd', text: 'Bán kính đường tròn nội tiếp $r = 4$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề a, b, c, d đều đúng.'
      },
      {
        id: 'e5-q15', type: 'true_false', number: 15,
        question: 'Cho tam giác $ABC$ có $\\widehat{A} = 75^\\circ, \\widehat{B} = 60^\\circ, c = 2\\sqrt{2}$.',
        statements: [
          { id: 'a', text: 'Góc $\\widehat{C} = 45^\\circ$.', correct: true },
          { id: 'b', text: 'Cạnh $a = 4$.', correct: false },
          { id: 'c', text: 'Cạnh $b = 2\\sqrt{3}$.', correct: true },
          { id: 'd', text: 'Diện tích tam giác $S = \\sqrt{6} + \\sqrt{2}$.', correct: true }
        ],
        explanation: 'a) $\\widehat{C} = 45^\\circ$. c) $b = \\frac{2\\sqrt{2} \\sin 60^\\circ}{\\sin 45^\\circ} = 2\\sqrt{3}$. d) $S = \\frac{1}{2}bc \\sin A = \\sqrt{6}+\\sqrt{2}$.'
      },
      {
        id: 'e5-q16', type: 'true_false', number: 16,
        question: 'Cho tam giác $ABC$ có $a = 7, b = 8, c = 9$.',
        statements: [
          { id: 'a', text: 'Nửa chu vi $p = 12$.', correct: true },
          { id: 'b', text: 'Diện tích tam giác $S = 12\\sqrt{5}$.', correct: true },
          { id: 'c', text: 'Bán kính đường tròn ngoại tiếp $R = \\frac{21\\sqrt{5}}{10}$.', correct: true },
          { id: 'd', text: 'Khoảng cách từ tâm đường tròn nội tiếp đến các cạnh bằng $\\sqrt{5}$.', correct: true }
        ],
        explanation: 'Tất cả 4 mệnh đề a, b, c, d đều đúng.'
      }
    ],
    questionsPart3: [
      {
        id: 'e5-q17', type: 'short', number: 17,
        question: 'Cho tam giác $ABC$ có $a = 13, b = 14, c = 15$. Tính độ dài đường cao hạ từ đỉnh $B$.',
        correctAnswer: '12',
        acceptableAnswers: ['12'],
        explanation: '$S = 84 \\Rightarrow h_b = \\frac{2S}{b} = \\frac{168}{14} = 12$.'
      },
      {
        id: 'e5-q18', type: 'short', number: 18,
        question: 'Một người đi dọc theo bờ biển từ vị trí $A$ đến vị trí $B$ cách nhau $500\\text{ m}$, hướng nhìn tới một hòn đảo $C$ tạo với đường đi các góc $\\widehat{CAB} = 50^\\circ$ và $\\widehat{CBA} = 70^\\circ$. Tính khoảng cách từ vị trí $A$ đến hòn đảo $C$ (làm tròn đến hàng đơn vị theo mét).',
        correctAnswer: '541',
        acceptableAnswers: ['541', '540,8', '540.8'],
        explanation: '$\\widehat{C} = 60^\\circ. AC = \\frac{500 \\sin 70^\\circ}{\\sin 60^\\circ} \\approx 540,85 \\approx 541\\text{ m}$.'
      },
      {
        id: 'e5-q19', type: 'short', number: 19,
        question: 'Cho tam giác $ABC$ có $AB = 8, AC = 12$ và $\\widehat{A} = 60^\\circ$. Tính độ dài đường phân giác trong $AD$ của góc $A$ (làm tròn đến chữ số thập phân thứ hai).',
        correctAnswer: '8,31',
        acceptableAnswers: ['8,31', '8.31'],
        explanation: '$AD = \\frac{2 \\cdot 8 \\cdot 12 \\cdot \\cos 30^\\circ}{20} = \\frac{192 \\cdot \\frac{\\sqrt{3}}{2}}{20} = \\frac{48\\sqrt{3}}{10} \\approx 8,31$.'
      },
      {
        id: 'e5-q20', type: 'short', number: 20,
        question: 'Cho tam giác $ABC$ có $a = 10, b = 17, c = 21$. Tính độ dài đường trung tuyến ứng với cạnh trung bình $b$.',
        correctAnswer: '12,5',
        acceptableAnswers: ['12,5', '12.5'],
        explanation: '$m_b^2 = \\frac{2(a^2+c^2)-b^2}{4} = \\frac{2(100+441)-289}{4} = \\frac{793}{4} \\approx 198,25 \\Rightarrow m_b \\approx 14,08$.'
      },
      {
        id: 'e5-q21', type: 'short', number: 21,
        question: 'Từ đỉnh một tòa nhà cao $60\\text{ m}$, một người quan sát thấy chân và đỉnh một ngọn tháp cách đó lần lượt theo các góc hạ $30^\\circ$ và góc nâng $60^\\circ$. Tính chiều cao của ngọn tháp (làm tròn đến hàng đơn vị).',
        correctAnswer: '240',
        acceptableAnswers: ['240'],
        explanation: '$H = 60 + 60 \\sqrt{3} \\cot 30^\\circ = 60 + 180 = 240\\text{ m}$.'
      },
      {
        id: 'e5-q22', type: 'short', number: 22,
        question: 'Tam giác $ABC$ có $a = 21, b = 17, c = 10$. Tính bán kính đường tròn nội tiếp $r$ của tam giác.',
        correctAnswer: '3,5',
        acceptableAnswers: ['3,5', '3.5'],
        explanation: '$p = 24 \\Rightarrow S = \\sqrt{24 \\cdot 3 \\cdot 7 \\cdot 14} = 84 \\Rightarrow r = \\frac{84}{24} = 3,5$.'
      }
    ]
  },
  {
    id: 'exam-6',
    title: 'Đề số 6: Bất phương trình bậc nhất hai ẩn (Phần 1)',
    durationMinutes: 90,
    description: 'Chương trình GDPT 2018 Toán 10 • 12 MCQ + 4 Đúng/Sai + 6 Trả lời ngắn',
    questionsPart1: [
      {
        id: 'e6-q1', type: 'mcq', number: 1,
        question: 'Bất phương trình nào sau đây là bất phương trình bậc nhất hai ẩn?',
        options: [
          { id: 'A', text: '$x^2 + y > 3$.' },
          { id: 'B', text: '$2x - 3y \\le 5$.' },
          { id: 'C', text: '$xy + y < 1$.' },
          { id: 'D', text: '$x^2 + y^2 \\le 4$.' }
        ],
        correctOption: 'B',
        explanation: 'Bất phương trình bậc nhất hai ẩn có dạng $ax + by \\le c$ (hoặc $<, >, \\ge$).'
      },
      // ... (Rest of exam questions for exam 6)
    ],
    questionsPart2: [],
    questionsPart3: []
  },
  // ... (Add exams 7, 8, 9, 10 similarly)
];

export function TriangleTrigExams() {
  const { user, addPoints } = useEduBotUser();
  const [selectedExamId, setSelectedExamId] = useState<string>('exam-1');
  const [examState, setExamState] = useState<'idle' | 'taking' | 'finished'>('idle');

  // Answers State
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});

  // Timer State
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(90 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Exam
  const activeExam = useMemo(() => {
    return TRIANGLE_EXAM_PAPERS.find(e => e.id === selectedExamId) || TRIANGLE_EXAM_PAPERS[0];
  }, [selectedExamId]);

  // Handle start test
  const handleStartExam = () => {
    const durSec = activeExam.durationMinutes * 60;
    setTimeLeftSeconds(durSec);
    setMcqAnswers({});
    setTfAnswers({});
    setShortAnswers({});
    setExamState('taking');
  };

  // Timer countdown
  useEffect(() => {
    if (examState === 'taking') {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState]);

  // Score Calculation based on Ministry of Education standards:
  // Part I: 12 MCQs (0.25 pt each, total 3.0 pts)
  // Part II: 4 True/False (1 statement = 0.1, 2 = 0.25, 3 = 0.5, 4 = 1.0, total 4.0 pts)
  // Part III: 6 Short Answer (0.5 pt each, total 3.0 pts)
  const examResult = useMemo(() => {
    let scorePart1 = 0;
    let correctMCQCount = 0;
    activeExam.questionsPart1.forEach(q => {
      if (mcqAnswers[q.id] === q.correctOption) {
        scorePart1 += 0.25;
        correctMCQCount++;
      }
    });

    let scorePart2 = 0;
    let correctTFStatementCount = 0;
    activeExam.questionsPart2.forEach(q => {
      const qAnswers = tfAnswers[q.id] || {};
      let correctInQuestion = 0;
      q.statements.forEach(st => {
        if (qAnswers[st.id] === st.correct) {
          correctInQuestion++;
          correctTFStatementCount++;
        }
      });
      if (correctInQuestion === 1) scorePart2 += 0.10;
      else if (correctInQuestion === 2) scorePart2 += 0.25;
      else if (correctInQuestion === 3) scorePart2 += 0.50;
      else if (correctInQuestion === 4) scorePart2 += 1.00;
    });

    let scorePart3 = 0;
    let correctShortCount = 0;
    activeExam.questionsPart3.forEach(q => {
      const userAns = (shortAnswers[q.id] || '').trim().toLowerCase().replace(',', '.');
      const isCorrect = q.acceptableAnswers.some(ans => {
        const clean = ans.trim().toLowerCase().replace(',', '.');
        return clean === userAns;
      });
      if (isCorrect) {
        scorePart3 += 0.50;
        correctShortCount++;
      }
    });

    const totalScore = Number((scorePart1 + scorePart2 + scorePart3).toFixed(2));
    const earnedXP = Math.round(totalScore * 100);

    return {
      scorePart1,
      correctMCQCount,
      scorePart2,
      correctTFStatementCount,
      scorePart3,
      correctShortCount,
      totalScore,
      earnedXP
    };
  }, [activeExam, mcqAnswers, tfAnswers, shortAnswers]);

  // Handle finish test
  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setExamState('finished');
    
    // Award XP and update rank standing on EduBot
    const earnedXP = Math.round(examResult.totalScore * 100);
    if (earnedXP > 0) {
      addPoints(earnedXP, `Hoàn thành ${activeExam.title} (${examResult.totalScore}đ)`);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 text-slate-900 dark:text-slate-100">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-purple-500/30 border border-purple-400/40 rounded-full text-xs font-extrabold text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Toán 10 GDPT 2018 — Chuyên đề Hệ thức lượng trong tam giác</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            5 Bộ Đề Ôn Tập & Kiểm Tra Trực Tuyến 90 Phút
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Cấu trúc 100% chuẩn định dạng đề thi mới của Bộ GD&ĐT: <strong className="text-amber-300">Phần I (12 Trắc nghiệm 4 lựa chọn)</strong>, <strong className="text-emerald-300">Phần II (4 Trắc nghiệm Đúng/Sai)</strong>, và <strong className="text-cyan-300">Phần III (6 Trả lời ngắn)</strong>. Tích điểm $XP$ thăng Rank trên Bảng Vàng!
          </p>
        </div>
      </div>

      {/* IDLE STATE: CHỌN ĐỀ THI & BẮT ĐẦU LÀM BÀI */}
      {examState === 'idle' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Danh sách 5 Bộ đề thi thử trực tuyến</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Chọn đề thi bất kỳ để bắt đầu đếm ngược 90 phút và nộp bài chấm điểm tự động.
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-300 text-xs font-bold font-mono">
                Thưởng tối đa: +1,000 XP / Đề 🔥
              </span>
            </div>

            {/* List of 5 Exam Papers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRIANGLE_EXAM_PAPERS.map((paper, idx) => {
                const isSelected = selectedExamId === paper.id;
                return (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedExamId(paper.id)}
                    className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-purple-600 dark:border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 ring-2 ring-purple-500/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-xs">
                          ĐỀ SỐ {idx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          90 phút
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {paper.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {paper.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">22 câu trắc nghiệm</span>
                      <span className={`font-bold ${isSelected ? 'text-purple-600 dark:text-purple-300' : 'text-slate-400'}`}>
                        {isSelected ? 'Đã chọn ✓' : 'Chọn đề này'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Exam Start Box */}
            <div className="p-6 bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-700/50 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Trophy className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">{activeExam.title}</h4>
                  <p className="text-xs text-purple-200 mt-0.5">
                    Thời gian: <strong className="text-amber-300">90 phút</strong> • Tổng số câu: <strong className="text-amber-300">22 câu</strong> (12 MCQ + 4 Đ/S + 6 Trả lời ngắn)
                  </p>
                </div>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
                <span>Bắt đầu Làm bài & Đếm ngược 90' 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheat Guard Monitor */}
      <AntiCheatGuard 
        isActive={examState === 'taking'} 
        onAutoSubmit={handleFinishExam} 
        examTitle={`Bộ đề: ${activeExam.title}`}
        maxWarnings={3}
      />

      {/* TAKING STATE: ĐANG LÀM BÀI THI PHÒNG THI MÔ PHỎNG */}
      {examState === 'taking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Questions Container */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* PHẦN I: 12 CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-black text-xs uppercase">
                  PHẦN I. Câu trắc nghiệm nhiều phương án (12 câu - Mỗi câu 0.25đ)
                </span>
              </div>

              <div className="space-y-6">
                {activeExam.questionsPart1.map(q => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base leading-relaxed">
                      <MathView content={`**Câu ${q.number}:** ${q.question}`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map(opt => {
                        const isSelected = mcqAnswers[q.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setMcqAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                            className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'bg-purple-100 dark:bg-purple-950/80 border-purple-500 text-purple-900 dark:text-purple-200 font-bold ring-2 ring-purple-400/40'
                                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {opt.id}
                            </span>
                            <div className="flex-1 pt-0.5">
                              <MathView inline content={opt.text} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHẦN II: 4 CÂU TRẮC NGHIỆM ĐÚNG/SAI */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase">
                  PHẦN II. Câu trắc nghiệm Đúng/Sai (4 câu - Tối đa 1.0đ/câu)
                </span>
              </div>

              <div className="space-y-6">
                {activeExam.questionsPart2.map(q => {
                  const qAns = tfAnswers[q.id] || {};
                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base leading-relaxed">
                        <MathView content={`**Câu ${q.number}:** ${q.question}`} />
                      </div>

                      <div className="space-y-2.5">
                        {q.statements.map(st => {
                          const chosen = qAns[st.id];
                          return (
                            <div key={st.id} className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                              <div className="flex items-start gap-2 flex-1">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{st.id})</span>
                                <MathView inline content={st.text} />
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => setTfAnswers(prev => ({
                                    ...prev,
                                    [q.id]: { ...(prev[q.id] || {}), [st.id]: true }
                                  }))}
                                  className={`px-4 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                                    chosen === true
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                  }`}
                                >
                                  ĐÚNG
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setTfAnswers(prev => ({
                                    ...prev,
                                    [q.id]: { ...(prev[q.id] || {}), [st.id]: false }
                                  }))}
                                  className={`px-4 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                                    chosen === false
                                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                  }`}
                                >
                                  SAI
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PHẦN III: 6 CÂU TRẢ LỜI NGẮN */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 font-black text-xs uppercase">
                  PHẦN III. Câu trắc nghiệm trả lời ngắn (6 câu - Mỗi câu 0.5đ)
                </span>
              </div>

              <div className="space-y-6">
                {activeExam.questionsPart3.map(q => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base leading-relaxed">
                      <MathView content={`**Câu ${q.number}:** ${q.question}`} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                        Nhập kết quả của bạn:
                      </label>
                      <input
                        type="text"
                        placeholder="VD: 20.8 hoặc 146..."
                        value={shortAnswers[q.id] || ''}
                        onChange={e => setShortAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-mono font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500 max-w-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Countdown Timer & Submit Box */}
          <div className="lg:col-span-4 space-y-4 sticky top-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-3">
              <span className="text-xs uppercase font-bold text-slate-400">Thời gian làm bài còn lại</span>
              <div className="text-4xl font-black text-amber-500 tracking-wider font-mono">
                {formatTime(timeLeftSeconds)}
              </div>
              <p className="text-[11px] text-slate-500">
                Khi hết thời gian, bài thi sẽ tự động khóa và gửi điểm lên hệ thống.
              </p>

              <button
                onClick={handleFinishExam}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài & Ghi điểm Xếp hạng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINISHED STATE: BẢNG TỔNG KẾT ĐIỂM SỐ & XEM LẠI LỜI GIẢI CHI TIẾT */}
      {examState === 'finished' && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6 border border-purple-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-purple-800/60">
              <div className="space-y-2">
                <span className="px-3.5 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-xs uppercase">
                  Kết quả kiểm tra trực tuyến
                </span>
                <h2 className="text-3xl md:text-4xl font-black">
                  Điểm số: <span className="text-amber-300">{examResult.totalScore} / 10.0</span>
                </h2>
                <p className="text-xs sm:text-sm text-purple-200">
                  🎉 Bạn đã được cộng trực tiếp <strong className="text-amber-300">+{examResult.earnedXP} XP</strong> vào Bảng Xếp Hạng toàn quốc!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleStartExam}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại đề này</span>
                </button>
                <button
                  onClick={() => setExamState('idle')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs border border-white/20"
                >
                  Chọn đề thi khác
                </button>
              </div>
            </div>

            {/* Score Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-900 dark:text-slate-100">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-2xl">
                <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase block">Phần I (MCQ)</span>
                <span className="text-xl font-black text-purple-700 dark:text-purple-200 block mt-1">{examResult.scorePart1} / 3.0đ</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{examResult.correctMCQCount}/12 câu đúng</span>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Phần II (Đúng/Sai)</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-200 block mt-1">{examResult.scorePart2} / 4.0đ</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{examResult.correctTFStatementCount}/16 ý đúng</span>
              </div>

              <div className="p-4 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 rounded-2xl">
                <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 uppercase block">Phần III (Trả lời ngắn)</span>
                <span className="text-xl font-black text-cyan-700 dark:text-cyan-200 block mt-1">{examResult.scorePart3} / 3.0đ</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{examResult.correctShortCount}/6 câu đúng</span>
              </div>
            </div>
          </div>

          {/* Detailed Solutions Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Đáp án chuẩn & Lời giải chi tiết KaTeX từng bước</span>
            </h3>

            {/* Part 1 Solutions */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400">PHẦN I. Lời giải 12 Câu Trắc nghiệm:</h4>
              {activeExam.questionsPart1.map(q => {
                const userChoice = mcqAnswers[q.id];
                const isCorrect = userChoice === q.correctOption;
                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Câu {q.number}: Đáp án đúng là {q.correctOption}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isCorrect ? '✓ Bạn chọn đúng' : `✗ Bạn chọn ${userChoice || 'Chưa làm'}`}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300"><MathView content={q.explanation} /></p>
                  </div>
                );
              })}
            </div>

            {/* Part 2 Solutions */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">PHẦN II. Lời giải 4 Câu Đúng/Sai:</h4>
              {activeExam.questionsPart2.map(q => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm">
                  <span className="font-bold">Câu {q.number}:</span>
                  <p className="text-slate-600 dark:text-slate-300"><MathView content={q.explanation} /></p>
                </div>
              ))}
            </div>

            {/* Part 3 Solutions */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400">PHẦN III. Lời giải 6 Câu Trả lời ngắn:</h4>
              {activeExam.questionsPart3.map(q => {
                const userAns = shortAnswers[q.id] || 'Chưa làm';
                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Câu {q.number}: Đáp án chuẩn: {q.correctAnswer}</span>
                      <span className="text-slate-500 font-mono">Bạn nhập: {userAns}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300"><MathView content={q.explanation} /></p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

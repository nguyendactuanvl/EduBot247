import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Send, 
  BarChart3, 
  BookOpen, 
  Filter, 
  Timer, 
  ListOrdered, 
  Sparkles, 
  RefreshCw,
  HelpCircle,
  Trophy,
  Check,
  Layers,
  GraduationCap,
  BookMarked,
  Eye,
  CheckCircle,
  X,
  Search,
  School
} from 'lucide-react';
import { MathView } from './MathView';
import { 
  GRADE_TIERS, 
  GradeId, 
  EducationalTier, 
  SubjectCategory, 
  LessonTopic, 
  PracticeQuestion, 
  KNTT_LESSON_TOPICS, 
  KNTT_QUESTION_BANK 
} from '../data/knttCurriculumData';

export type SubjectId = 'all' | 'math' | 'physics' | 'chemistry' | 'biology' | 'english';

export interface Question {
  id: string;
  subject: SubjectId;
  subjectName: string;
  topic: string;
  content: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface ExamPackage {
  id: string;
  title: string;
  subject: SubjectId;
  durationMinutes: number;
  description: string;
  questionCount: number;
}

// Bộ đề mẫu đa dạng bám sát đề thi THPT Quốc gia theo chương trình mới
export const EXAM_PACKAGES: ExamPackage[] = [
  {
    id: 'math-standard-1',
    title: 'Đề thi thử THPT Môn Toán - Đề số 01 (Chuẩn cấu trúc 2026)',
    subject: 'math',
    durationMinutes: 45,
    description: 'Bao gồm Khảo sát hàm số, Mũ - Logarit, Tích phân và Hình học Oxyz.',
    questionCount: 15
  },
  {
    id: 'physics-standard-1',
    title: 'Đề thi thử THPT Môn Vật lí - Đề số 01',
    subject: 'physics',
    durationMinutes: 30,
    description: 'Trọng tâm Dao động cơ, Sóng cơ, Dòng điện xoay chiều và Vật lý nhiệt.',
    questionCount: 12
  },
  {
    id: 'chemistry-standard-1',
    title: 'Đề thi thử THPT Môn Hóa học - Đề số 01',
    subject: 'chemistry',
    durationMinutes: 30,
    description: 'Chuyên đề Ester, Lipid, Carbohydrate, Kim loại chuyển tiếp và Hóa học đời sống.',
    questionCount: 12
  },
  {
    id: 'biology-standard-1',
    title: 'Đề thi thử THPT Môn Sinh học - Đề số 01',
    subject: 'biology',
    durationMinutes: 30,
    description: 'Cơ chế di truyền và biến dị, Quy luật di truyền Mendel và Sinh thái học.',
    questionCount: 12
  },
  {
    id: 'english-standard-1',
    title: 'Đề thi thử THPT Môn Tiếng Anh - Đề số 01',
    subject: 'english',
    durationMinutes: 35,
    description: 'Ngữ pháp thì, Câu bị động, Trọng âm, Từ đồng nghĩa/trái nghĩa và Điền từ.',
    questionCount: 15
  },
  {
    id: 'all-standard-1',
    title: 'Đề thi thử Tổng hợp THPT & Đánh giá Năng lực (Toán, Lí, Hóa, Sinh, Anh)',
    subject: 'all',
    durationMinutes: 90,
    description: 'Bộ đề thi tổng hợp tích hợp toàn bộ các môn tự nhiên và ngoại ngữ bám sát chương trình mới.',
    questionCount: 66
  }
];

// Ngân hàng câu hỏi trắc nghiệm chi tiết với KaTeX chuẩn
export const QUESTION_BANK: Question[] = [
  // --- MÔN TOÁN ---
  {
    id: 'm-1',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Khảo sát hàm số',
    content: 'Cho hàm số $y = \\frac{2x - 1}{x + 1}$. Đường tiệm cận đứng của đồ thị hàm số có phương trình là:',
    options: [
      { id: 'A', text: '$x = -1$' },
      { id: 'B', text: '$x = 2$' },
      { id: 'C', text: '$y = 2$' },
      { id: 'D', text: '$y = -1$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có $\\lim_{x \\to (-1)^+} \\frac{2x - 1}{x + 1} = -\\infty$, do đó đường tiệm cận đứng là $x = -1$. Tiệm cận ngang là $y = \\frac{2}{1} = 2$.'
  },
  {
    id: 'm-2',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Hàm số bậc ba',
    content: 'Hàm số $y = x^3 - 3x^2 + 2$ đạt cực tiểu tại điểm nào sau đây?',
    options: [
      { id: 'A', text: '$x = 0$' },
      { id: 'B', text: '$x = 2$' },
      { id: 'C', text: '$x = -2$' },
      { id: 'D', text: '$x = 1$' }
    ],
    correctOptionId: 'B',
    explanation: 'Ta có đạo hàm $y\' = 3x^2 - 6x = 3x(x - 2)$. Cho $y\' = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Qua $x = 2$, đạo hàm $y\'$ đổi dấu từ âm sang dương nên hàm số đạt cực tiểu tại $x = 2$.'
  },
  {
    id: 'm-3',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Mũ và Logarit',
    content: 'Nghiệm của phương trình $\\log_2(x - 1) = 3$ là:',
    options: [
      { id: 'A', text: '$x = 7$' },
      { id: 'B', text: '$x = 8$' },
      { id: 'C', text: '$x = 9$' },
      { id: 'D', text: '$x = 10$' }
    ],
    correctOptionId: 'C',
    explanation: 'Điều kiện xác định: $x > 1$. Phương trình tương đương với $x - 1 = 2^3 = 8 \\Leftrightarrow x = 9$ (thỏa mãn điều kiện).'
  },
  {
    id: 'm-4',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Nguyên hàm & Tích phân',
    content: 'Họ nguyên hàm của hàm số $f(x) = 3x^2 + e^x$ là:',
    options: [
      { id: 'A', text: '$x^3 + e^x + C$' },
      { id: 'B', text: '$6x + e^x + C$' },
      { id: 'C', text: '$\\frac{x^3}{3} + e^x + C$' },
      { id: 'D', text: '$x^3 - e^x + C$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có $\\int (3x^2 + e^x) \\, dx = 3 \\cdot \\frac{x^3}{3} + e^x + C = x^3 + e^x + C$.'
  },
  {
    id: 'm-5',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Hình học Oxyz',
    content: 'Trong không gian $Oxyz$, mặt phẳng $(P): 2x - y + 3z - 5 = 0$ có một vectơ pháp tuyến là:',
    options: [
      { id: 'A', text: '$\\vec{n} = (2; 1; 3)$' },
      { id: 'B', text: '$\\vec{n} = (2; -1; 3)$' },
      { id: 'C', text: '$\\vec{n} = (2; -1; -5)$' },
      { id: 'D', text: '$\\vec{n} = (-1; 2; 3)$' }
    ],
    correctOptionId: 'B',
    explanation: 'Phương trình tổng quát $Ax + By + Cz + D = 0$ có vectơ pháp tuyến là $\\vec{n} = (A; B; C) = (2; -1; 3)$.'
  },
  {
    id: 'm-6',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Tiệm cận xiên (KNTT 2018)',
    content: 'Đường tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 - x + 1}{x - 1}$ là:',
    options: [
      { id: 'A', text: '$y = x$' },
      { id: 'B', text: '$y = x - 1$' },
      { id: 'C', text: '$y = x + 1$' },
      { id: 'D', text: '$y = 2x$' }
    ],
    correctOptionId: 'A',
    explanation: 'Chia tử cho mẫu: $y = \\frac{x(x - 1) + 1}{x - 1} = x + \\frac{1}{x - 1}$. Vì $\\lim_{x \\to \\pm\\infty} \\frac{1}{x - 1} = 0$ nên đường tiệm cận xiên là $y = x$.'
  },
  {
    id: 'm-7',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Lượng giác',
    content: 'Tập xác định của hàm số $y = \\tan x$ là:',
    options: [
      { id: 'A', text: '$D = \\mathbb{R} \\setminus \\{k\\pi \\mid k \\in \\mathbb{Z}\\}$' },
      { id: 'B', text: '$D = \\mathbb{R} \\setminus \\left\\{\\frac{\\pi}{2} + k\\pi \\;\\middle|\\; k \\in \\mathbb{Z}\\right\\}$' },
      { id: 'C', text: '$D = \\mathbb{R}$' },
      { id: 'D', text: '$D = [-1; 1]$' }
    ],
    correctOptionId: 'B',
    explanation: 'Hàm số $y = \\tan x = \\frac{\\sin x}{\\cos x}$ xác định khi $\\cos x \\neq 0 \\Leftrightarrow x \\neq \\frac{\\pi}{2} + k\\pi \\; (k \\in \\mathbb{Z})$.'
  },
  {
    id: 'm-8',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Khối đa diện',
    content: 'Thể tích $V$ của khối chóp có diện tích đáy $B$ và chiều cao $h$ được tính theo công thức:',
    options: [
      { id: 'A', text: '$V = B \\cdot h$' },
      { id: 'B', text: '$V = \\frac{1}{3} B \\cdot h$' },
      { id: 'C', text: '$V = \\frac{1}{2} B \\cdot h$' },
      { id: 'D', text: '$V = 3 B \\cdot h$' }
    ],
    correctOptionId: 'B',
    explanation: 'Thể tích khối chóp là $V = \\frac{1}{3} B \\cdot h$, trong khi thể tích khối lăng trụ là $V = B \\cdot h$.'
  },
  {
    id: 'm-9',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Xác suất & Thống kê',
    content: 'Gieo một con xúc xắc cân đối và đồng chất một lần. Xác suất để xuất hiện mặt có số chấm là số chẵn bằng:',
    options: [
      { id: 'A', text: '$\\frac{1}{6}$' },
      { id: 'B', text: '$\\frac{1}{3}$' },
      { id: 'C', text: '$\\frac{1}{2}$' },
      { id: 'D', text: '$\\frac{2}{3}$' }
    ],
    correctOptionId: 'C',
    explanation: 'Không gian mẫu có $6$ phần tử $\\{1, 2, 3, 4, 5, 6\\}$. Các mặt chẵn là $\\{2, 4, 6\\}$ gồm $3$ phần tử. Xác suất là $P = \\frac{3}{6} = \\frac{1}{2}$.'
  },
  {
    id: 'm-10',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Số phức',
    content: 'Cho số phức $z = 3 - 4i$. Môđun $|z|$ của số phức đã cho bằng:',
    options: [
      { id: 'A', text: '$5$' },
      { id: 'B', text: '$7$' },
      { id: 'C', text: '$\\sqrt{7}$' },
      { id: 'D', text: '$25$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có $|z| = \\sqrt{a^2 + b^2} = \\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.'
  },
  {
    id: 'm-11',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Hình học Oxyz',
    content: 'Tâm $I$ và bán kính $R$ của mặt cầu $(S): (x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 16$ lần lượt là:',
    options: [
      { id: 'A', text: '$I(1; -2; 3), R = 4$' },
      { id: 'B', text: '$I(-1; 2; -3), R = 4$' },
      { id: 'C', text: '$I(1; -2; 3), R = 16$' },
      { id: 'D', text: '$I(-1; 2; -3), R = 16$' }
    ],
    correctOptionId: 'A',
    explanation: 'Mặt cầu dạng $(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$ có tâm $I(a; b; c) = (1; -2; 3)$ và bán kính $R = \\sqrt{16} = 4$.'
  },
  {
    id: 'm-12',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Đạo hàm',
    content: 'Đạo hàm của hàm số $y = 2^x$ là:',
    options: [
      { id: 'A', text: '$y\' = x \\cdot 2^{x-1}$' },
      { id: 'B', text: '$y\' = 2^x \\cdot \\ln 2$' },
      { id: 'C', text: '$y\' = \\frac{2^x}{\\ln 2}$' },
      { id: 'D', text: '$y\' = 2^x$' }
    ],
    correctOptionId: 'B',
    explanation: 'Công thức đạo hàm hàm số mũ cơ số $a$: $(a^x)\' = a^x \\cdot \\ln a$. Vậy $(2^x)\' = 2^x \\cdot \\ln 2$.'
  },
  {
    id: 'm-13',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Tích phân',
    content: 'Biết $\\int_0^1 f(x) \\, dx = 2$ và $\\int_0^1 g(x) \\, dx = 5$. Giá trị của $\\int_0^1 [3f(x) - g(x)] \\, dx$ bằng:',
    options: [
      { id: 'A', text: '$1$' },
      { id: 'B', text: '$11$' },
      { id: 'C', text: '$-1$' },
      { id: 'D', text: '$6$' }
    ],
    correctOptionId: 'A',
    explanation: '$\\int_0^1 [3f(x) - g(x)] \\, dx = 3 \\int_0^1 f(x) \\, dx - \\int_0^1 g(x) \\, dx = 3(2) - 5 = 6 - 5 = 1$.'
  },
  {
    id: 'm-14',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Cấp số cộng',
    content: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 3$ và công sai $d = 2$. Số hạng thứ tư $u_4$ bằng:',
    options: [
      { id: 'A', text: '$9$' },
      { id: 'B', text: '$11$' },
      { id: 'C', text: '$8$' },
      { id: 'D', text: '$12$' }
    ],
    correctOptionId: 'A',
    explanation: 'Số hạng tổng quát của cấp số cộng: $u_n = u_1 + (n - 1)d$. Do đó $u_4 = 3 + (4 - 1) \\cdot 2 = 3 + 6 = 9$.'
  },
  {
    id: 'm-15',
    subject: 'math',
    subjectName: 'Toán học',
    topic: 'Hàm số liên tục',
    content: 'Giá trị lớn nhất của hàm số $f(x) = x^4 - 2x^2 + 3$ trên đoạn $[0; 2]$ bằng:',
    options: [
      { id: 'A', text: '$3$' },
      { id: 'B', text: '$2$' },
      { id: 'C', text: '$11$' },
      { id: 'D', text: '$19$' }
    ],
    correctOptionId: 'C',
    explanation: 'Đạo hàm $f\'(x) = 4x^3 - 4x = 4x(x^2 - 1)$. Trên $[0; 2]$, nghiệm là $x = 0$ và $x = 1$. Ta tính: $f(0) = 3$, $f(1) = 2$, $f(2) = 16 - 8 + 3 = 11$. Vậy giá trị lớn nhất bằng $11$.'
  },

  // --- MÔN VẬT LÍ ---
  {
    id: 'p-1',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Dao động điều hòa',
    content: 'Một vật dao động điều hòa với phương trình $x = 5\\cos(4\\pi t + \\frac{\\pi}{3}) \\; \\text{cm}$. Tần số dao động của vật là:',
    options: [
      { id: 'A', text: '$2 \\; \\text{Hz}$' },
      { id: 'B', text: '$4 \\; \\text{Hz}$' },
      { id: 'C', text: '$0.5 \\; \\text{Hz}$' },
      { id: 'D', text: '$4\\pi \\; \\text{Hz}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Tần số góc $\\omega = 4\\pi \\; \\text{rad/s}$. Tần số dao động là $f = \\frac{\\omega}{2\\pi} = \\frac{4\\pi}{2\\pi} = 2 \\; \\text{Hz}$.'
  },
  {
    id: 'p-2',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Sóng cơ học',
    content: 'Một sóng cơ truyền trong môi trường với tốc độ $v = 12 \\; \\text{m/s}$ và chu kỳ $T = 0.2 \\; \\text{s}$. Bước sóng $\\lambda$ bằng:',
    options: [
      { id: 'A', text: '$2.4 \\; \\text{m}$' },
      { id: 'B', text: '$60 \\; \\text{m}$' },
      { id: 'C', text: '$24 \\; \\text{m}$' },
      { id: 'D', text: '$6 \\; \\text{m}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Công thức bước sóng: $\\lambda = v \\cdot T = 12 \\times 0.2 = 2.4 \\; \\text{m}$.'
  },
  {
    id: 'p-3',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Dòng điện xoay chiều',
    content: 'Điện áp xoay chiều có giá trị tức thời $u = 220\\sqrt{2}\\cos(100\\pi t) \\; \\text{V}$. Giá trị hiệu dụng của điện áp là:',
    options: [
      { id: 'A', text: '$220\\sqrt{2} \\; \\text{V}$' },
      { id: 'B', text: '$220 \\; \\text{V}$' },
      { id: 'C', text: '$110 \\; \\text{V}$' },
      { id: 'D', text: '$100\\pi \\; \\text{V}$' }
    ],
    correctOptionId: 'B',
    explanation: 'Giá trị hiệu dụng $U = \\frac{U_0}{\\sqrt{2}} = \\frac{220\\sqrt{2}}{\\sqrt{2}} = 220 \\; \\text{V}$.'
  },
  {
    id: 'p-4',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Vật lí nhiệt (SGK mới)',
    content: 'Nhiệt lượng cần cung cấp để làm nóng chảy hoàn toàn $m \\; \\text{kg}$ chất rắn ở nhiệt độ nóng chảy được tính theo công thức:',
    options: [
      { id: 'A', text: '$Q = m \\cdot c \\cdot \\Delta t$' },
      { id: 'B', text: '$Q = \\lambda \\cdot m$' },
      { id: 'C', text: '$Q = L \\cdot m$' },
      { id: 'D', text: '$Q = m \\cdot g \\cdot h$' }
    ],
    correctOptionId: 'B',
    explanation: 'Công thức nhiệt nóng chảy: $Q = \\lambda \\cdot m$, trong đó $\\lambda$ là nhiệt nóng chảy riêng (J/kg).'
  },
  {
    id: 'p-5',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Sóng điện từ',
    content: 'Trong chân không, sóng điện từ lan truyền với tốc độ xấp xỉ bằng:',
    options: [
      { id: 'A', text: '$3 \\cdot 10^8 \\; \\text{m/s}$' },
      { id: 'B', text: '$340 \\; \\text{m/s}$' },
      { id: 'C', text: '$3 \\cdot 10^5 \\; \\text{m/s}$' },
      { id: 'D', text: '$1.5 \\cdot 10^8 \\; \\text{m/s}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Sóng điện từ trong chân không truyền với vận tốc ánh sáng $c \\approx 3 \\cdot 10^8 \\; \\text{m/s}$.'
  },
  {
    id: 'p-6',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Lượng tử ánh sáng',
    content: 'Năng lượng của một photon ánh sáng có tần số $f$ được xác định theo công thức của Planck là:',
    options: [
      { id: 'A', text: '$\\varepsilon = h \\cdot f$' },
      { id: 'B', text: '$\\varepsilon = \\frac{h}{f}$' },
      { id: 'C', text: '$\\varepsilon = h \\cdot c$' },
      { id: 'D', text: '$\\varepsilon = \\frac{1}{2} m v^2$' }
    ],
    correctOptionId: 'A',
    explanation: 'Theo thuyết lượng tử ánh sáng: $\\varepsilon = h \\cdot f = \\frac{hc}{\\lambda}$, với $h \\approx 6.626 \\cdot 10^{-34} \\; \\text{J}\\cdot\\text{s}$.'
  },
  {
    id: 'p-7',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Vật lí hạt nhân',
    content: 'Hạt nhân nguyên tử $^{238}_{92}\\text{U}$ có số hạt nơtron bằng:',
    options: [
      { id: 'A', text: '$92$' },
      { id: 'B', text: '$238$' },
      { id: 'C', text: '$146$' },
      { id: 'D', text: '$330$' }
    ],
    correctOptionId: 'C',
    explanation: 'Số nơtron $N = A - Z = 238 - 92 = 146$.'
  },
  {
    id: 'p-8',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Con lắc lò xo',
    content: 'Chu kỳ dao động điều hòa của con lắc lò xo có khối lượng $m$ và độ cứng $k$ là:',
    options: [
      { id: 'A', text: '$T = 2\\pi \\sqrt{\\frac{m}{k}}$' },
      { id: 'B', text: '$T = 2\\pi \\sqrt{\\frac{k}{m}}$' },
      { id: 'C', text: '$T = \\frac{1}{2\\pi} \\sqrt{\\frac{m}{k}}$' },
      { id: 'D', text: '$T = 2\\pi \\sqrt{\\frac{l}{g}}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Tần số góc $\\omega = \\sqrt{\\frac{k}{m}} \\Rightarrow T = \\frac{2\\pi}{\\omega} = 2\\pi \\sqrt{\\frac{m}{k}}$.'
  },
  {
    id: 'p-9',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Mạch RLC nối tiếp',
    content: 'Trong mạch điện xoay chiều gồm $R, L, C$ mắc nối tiếp đang xảy ra hiện tượng cộng hưởng điện, hệ số công suất $\\cos\\varphi$ bằng:',
    options: [
      { id: 'A', text: '$0$' },
      { id: 'B', text: '$1$' },
      { id: 'C', text: '$0.5$' },
      { id: 'D', text: '$\\frac{\\sqrt{2}}{2}$' }
    ],
    correctOptionId: 'B',
    explanation: 'Khi cộng hưởng, $Z_L = Z_C \\Rightarrow Z = R$, khi đó độ lệch pha $\\varphi = 0$ và $\\cos\\varphi = 1$ (công suất đạt cực đại).'
  },
  {
    id: 'p-10',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Khí lí tưởng',
    content: 'Phương trình trạng thái của khí lí tưởng cho một lượng khí nhất định là:',
    options: [
      { id: 'A', text: '$\\frac{p \\cdot V}{T} = \\text{hằng số}$' },
      { id: 'B', text: '$p \\cdot T = \\text{hằng số}$' },
      { id: 'C', text: '$\\frac{V}{p} = \\text{hằng số}$' },
      { id: 'D', text: '$p \\cdot V \\cdot T = \\text{hằng số}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Phương trình Clapeyron: $\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$ với $T$ là nhiệt độ tuyệt đối theo thang Kelvin.'
  },
  {
    id: 'p-11',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Từ trường',
    content: 'Đơn vị đo của cảm ứng từ trong hệ chuẩn $SI$ là:',
    options: [
      { id: 'A', text: 'Vôn (V)' },
      { id: 'B', text: 'Tesla (T)' },
      { id: 'C', text: 'Vơbe (Wb)' },
      { id: 'D', text: 'Henri (H)' }
    ],
    correctOptionId: 'B',
    explanation: 'Cảm ứng từ $\\vec{B}$ có đơn vị là Tesla (T). Đơn vị từ thông là Vơbe (Wb), độ tự cảm là Henri (H).'
  },
  {
    id: 'p-12',
    subject: 'physics',
    subjectName: 'Vật lí',
    topic: 'Giao thoa ánh sáng',
    content: 'Trong thí nghiệm Young về giao thoa ánh sáng, khoảng vân $i$ được tính bằng biểu thức:',
    options: [
      { id: 'A', text: '$i = \\frac{\\lambda D}{a}$' },
      { id: 'B', text: '$i = \\frac{\\lambda a}{D}$' },
      { id: 'C', text: '$i = \\frac{a D}{\\lambda}$' },
      { id: 'D', text: '$i = \\lambda \\cdot a \\cdot D$' }
    ],
    correctOptionId: 'A',
    explanation: 'Khoảng vân giao thoa $i = \\frac{\\lambda D}{a}$, trong đó $\\lambda$ là bước sóng, $D$ là khoảng cách từ hai khe tới màn, $a$ là khoảng cách giữa hai khe.'
  },

  // --- MÔN HÓA HỌC ---
  {
    id: 'c-1',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Ester - Lipid',
    content: 'Chất nào sau đây là ester có mùi thơm của chuối chín?',
    options: [
      { id: 'A', text: 'Isoamyl acetate' },
      { id: 'B', text: 'Ethyl acetate' },
      { id: 'C', text: 'Methyl formate' },
      { id: 'D', text: 'Benzyl acetate' }
    ],
    correctOptionId: 'A',
    explanation: 'Isoamyl acetate có mùi thơm đặc trưng của chuối chín; Benzyl acetate có mùi thơm hoa nhài.'
  },
  {
    id: 'c-2',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Carbohydrate',
    content: 'Chất nào sau đây thuộc loại disaccharide?',
    options: [
      { id: 'A', text: 'Glucose' },
      { id: 'B', text: 'Saccharose (Sucrose)' },
      { id: 'C', text: 'Tinh bột' },
      { id: 'D', text: 'Cellulose' }
    ],
    correctOptionId: 'B',
    explanation: 'Glucose và Fructose là monosaccharide; Saccharose và Maltose là disaccharide; Tinh bột và Cellulose là polysaccharide.'
  },
  {
    id: 'c-3',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Kim loại',
    content: 'Kim loại nào sau đây có tính dẫn điện tốt nhất ở điều kiện thường?',
    options: [
      { id: 'A', text: 'Đồng (Cu)' },
      { id: 'B', text: 'Bạc (Ag)' },
      { id: 'C', text: 'Nhôm (Al)' },
      { id: 'D', text: 'Vàng (Au)' }
    ],
    correctOptionId: 'B',
    explanation: 'Dãy dẫn điện giảm dần của kim loại: $\\text{Ag} > \\text{Cu} > \\text{Au} > \\text{Al} > \\text{Fe}$. Vậy Bạc (Ag) dẫn điện tốt nhất.'
  },
  {
    id: 'c-4',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Amine & Amino acid',
    content: 'Chất nào sau đây là amino acid đơn giản nhất có tên gọi là Glycine?',
    options: [
      { id: 'A', text: '$\\text{H}_2\\text{N}-\\text{CH}_2-\\text{COOH}$' },
      { id: 'B', text: '$\\text{CH}_3-\\text{CH}(\\text{NH}_2)-\\text{COOH}$' },
      { id: 'C', text: '$\\text{H}_2\\text{N}-[\\text{CH}_2]_4-\\text{CH}(\\text{NH}_2)-\\text{COOH}$' },
      { id: 'D', text: '$\\text{HOOC}-\\text{CH}_2-\\text{CH}_2-\\text{CH}(\\text{NH}_2)-\\text{COOH}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Glycine là acid $\\alpha$-aminoacetic: $\\text{H}_2\\text{N}-\\text{CH}_2-\\text{COOH}$ (M = 75).'
  },
  {
    id: 'c-5',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Polymer',
    content: 'Poly(vinyl chloride) (PVC) được điều chế trực tiếp từ monomer nào sau đây?',
    options: [
      { id: 'A', text: '$\\text{CH}_2=\\text{CH}-\\text{Cl}$' },
      { id: 'B', text: '$\\text{CH}_2=\\text{CH}_2$' },
      { id: 'C', text: '$\\text{CH}_2=\\text{CH}-\\text{CH}_3$' },
      { id: 'D', text: '$\\text{CF}_2=\\text{CF}_2$' }
    ],
    correctOptionId: 'A',
    explanation: 'Trùng hợp vinyl chloride $\\text{CH}_2=\\text{CH}-\\text{Cl}$ ta thu được poly(vinyl chloride) (PVC).'
  },
  {
    id: 'c-6',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Điện hóa học & Pin điện',
    content: 'Trong quá trình hoạt động của pin điện hóa $\\text{Zn}-\\text{Cu}$, ở cực âm (anode) xảy ra quá trình nào?',
    options: [
      { id: 'A', text: 'Oxi hóa kẽm (Zn)' },
      { id: 'B', text: 'Khử kẽm (Zn)' },
      { id: 'C', text: 'Oxi hóa đồng (Cu)' },
      { id: 'D', text: 'Khử ion $\\text{Cu}^{2+}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ở anode (cực âm) của pin điện xảy ra quá trình oxi hóa: $\\text{Zn} \\rightarrow \\text{Zn}^{2+} + 2e$.'
  },
  {
    id: 'c-7',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Hóa học vô cơ',
    content: 'Kim loại nào sau đây phản ứng mãnh liệt với nước ở nhiệt độ thường giải phóng khí $\\text{H}_2$?',
    options: [
      { id: 'A', text: 'Sodium (Na)' },
      { id: 'B', text: 'Sắt (Fe)' },
      { id: 'C', text: 'Đồng (Cu)' },
      { id: 'D', text: 'Bạc (Ag)' }
    ],
    correctOptionId: 'A',
    explanation: 'Các kim loại kiềm như $\\text{Na}, \\text{K}, \\text{Li}$ và kiềm thổ như $\\text{Ca}, \\text{Ba}$ tác dụng mãnh liệt với nước: $2\\text{Na} + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{NaOH} + \\text{H}_2\\uparrow$.'
  },
  {
    id: 'c-8',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Hóa học hữu cơ',
    content: 'Dung dịch chất nào sau đây làm quỳ tím chuyển sang màu đỏ?',
    options: [
      { id: 'A', text: 'Acetic acid ($\\text{CH}_3\\text{COOH}$)' },
      { id: 'B', text: 'Ethanol ($\\text{C}_2\\text{H}_5\\text{OH}$)' },
      { id: 'C', text: 'Glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$)' },
      { id: 'D', text: 'Methylamine ($\\text{CH}_3\\text{NH}_2$)' }
    ],
    correctOptionId: 'A',
    explanation: 'Acetic acid $\\text{CH}_3\\text{COOH}$ là một acid hữu cơ, phân li ra ion $\\text{H}^+$ làm quỳ tím hóa đỏ.'
  },
  {
    id: 'c-9',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Năng lượng hóa học',
    content: 'Phản ứng tỏa nhiệt là phản ứng có biến thiên enthalpy chuẩn mang giá trị:',
    options: [
      { id: 'A', text: '$\\Delta_r H^0_{298} < 0$' },
      { id: 'B', text: '$\\Delta_r H^0_{298} > 0$' },
      { id: 'C', text: '$\\Delta_r H^0_{298} = 0$' },
      { id: 'D', text: '$\\Delta_r H^0_{298} = 1$' }
    ],
    correctOptionId: 'A',
    explanation: 'Phản ứng tỏa nhiệt giải phóng năng lượng ra môi trường nên $\\Delta_r H^0_{298} < 0$. Phản ứng thu nhiệt có $\\Delta_r H^0_{298} > 0$.'
  },
  {
    id: 'c-10',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Phức chất',
    content: 'Trong dung dịch nước, ion $\\text{Cu}^{2+}$ tạo với ammonia ($\\text{NH}_3$) phức chất có màu đặc trưng là:',
    options: [
      { id: 'A', text: 'Xanh lam thẫm' },
      { id: 'B', text: 'Đỏ son' },
      { id: 'C', text: 'Vàng tươi' },
      { id: 'D', text: 'Không màu' }
    ],
    correctOptionId: 'A',
    explanation: 'Phức chất $[\\text{Cu}(\\text{NH}_3)_4]^{2+}$ (tetraamminecopper(II)) có màu xanh lam thẫm đặc trưng.'
  },
  {
    id: 'c-11',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Độ âm điện',
    content: 'Nguyên tố có độ âm điện lớn nhất trong bảng tuần hoàn hóa học là:',
    options: [
      { id: 'A', text: 'Fluorine (F)' },
      { id: 'B', text: 'Oxygen (O)' },
      { id: 'C', text: 'Chlorine (Cl)' },
      { id: 'D', text: 'Nitrogen (N)' }
    ],
    correctOptionId: 'A',
    explanation: 'Fluorine (F) có độ âm điện lớn nhất xấp xỉ $3.98$ theo thang Pauling.'
  },
  {
    id: 'c-12',
    subject: 'chemistry',
    subjectName: 'Hóa học',
    topic: 'Môi trường',
    content: 'Khí nào sau đây là nguyên nhân chính gây ra hiệu ứng nhà kính làm trái đất nóng lên?',
    options: [
      { id: 'A', text: '$\\text{CO}_2$ (Carbon dioxide)' },
      { id: 'B', text: '$\\text{O}_2$ (Oxygen)' },
      { id: 'C', text: '$\\text{N}_2$ (Nitrogen)' },
      { id: 'D', text: '$\\text{H}_2$ (Hydrogen)' }
    ],
    correctOptionId: 'A',
    explanation: 'Khí $\\text{CO}_2$ và $\\text{CH}_4$ (Methane) là các khí nhà kính chủ yếu hấp thụ bức xạ nhiệt hồng ngoại.'
  },

  // --- MÔN SINH HỌC ---
  {
    id: 'b-1',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Cơ chế di truyền',
    content: 'Bộ ba mã mở đầu trên phân tử mARN quy định amino acid mở đầu (ở sinh vật nhân thực) là:',
    options: [
      { id: 'A', text: '5\'AUG 3\'' },
      { id: 'B', text: '3\'AUG 5\'' },
      { id: 'C', text: '5\'UAA 3\'' },
      { id: 'D', text: '5\'UAG 3\'' }
    ],
    correctOptionId: 'A',
    explanation: 'Bộ ba 5\'AUG 3\' mã hóa cho amino acid methionine ở sinh vật nhân thực và formyl methionine ở sinh vật nhân sơ.'
  },
  {
    id: 'b-2',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Quy luật di truyền',
    content: 'Phép lai giữa hai cá thể có kiểu gene $AaBb \\times Aabb$ (các gene phân li độc lập) cho tỉ lệ kiểu hình mang hai tính trạng trội là:',
    options: [
      { id: 'A', text: '$\\frac{3}{8}$' },
      { id: 'B', text: '$\\frac{9}{16}$' },
      { id: 'C', text: '$\\frac{1}{4}$' },
      { id: 'D', text: '$\\frac{1}{2}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Xét từng cặp gene: $Aa \\times Aa \\rightarrow \\frac{3}{4} A-$; $Bb \\times bb \\rightarrow \\frac{1}{2} B-$. Tỉ lệ kiểu hình mang 2 tính trạng trội ($A-B-$) là $\\frac{3}{4} \\times \\frac{1}{2} = \\frac{3}{8}$.'
  },
  {
    id: 'b-3',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Đột biến nhiễm sắc thể',
    content: 'Hội chứng Down ở người là do dạng đột biến số lượng nhiễm sắc thể nào sau đây?',
    options: [
      { id: 'A', text: 'Thể ba ở cặp NST số 21 (2n + 1)' },
      { id: 'B', text: 'Thể một ở cặp NST số 21 (2n - 1)' },
      { id: 'C', text: 'Thể ba ở cặp NST giới tính XXY' },
      { id: 'D', text: 'Đột biến mất đoạn NST số 5' }
    ],
    correctOptionId: 'A',
    explanation: 'Hội chứng Down là thể ba nhiễm sắc thể (2n + 1 = 47) ở cặp NST thường số 21.'
  },
  {
    id: 'b-4',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Sinh thái học',
    content: 'Trong một chuỗi thức ăn, sinh vật đóng vai trò sản xuất chất hữu cơ đầu tiên thường là:',
    options: [
      { id: 'A', text: 'Thực vật quang hợp' },
      { id: 'B', text: 'Động vật ăn cỏ' },
      { id: 'C', text: 'Vi khuẩn phân giải' },
      { id: 'D', text: 'Động vật ăn thịt' }
    ],
    correctOptionId: 'A',
    explanation: 'Sinh vật sản xuất gồm thực vật và các vi sinh vật quang hợp có khả năng tự dưỡng biến năng lượng ánh sáng thành năng lượng hóa học.'
  },
  {
    id: 'b-5',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Cấu trúc ADN',
    content: 'Theo nguyên tắc bổ sung trong phân tử ADN dạng chuỗi xoắn kép, base Adenine (A) liên kết với Thymine (T) bằng:',
    options: [
      { id: 'A', text: '2 liên kết hydro' },
      { id: 'B', text: '3 liên kết hydro' },
      { id: 'C', text: '1 liên kết phosphodiester' },
      { id: 'D', text: 'Liên kết peptide' }
    ],
    correctOptionId: 'A',
    explanation: 'A liên kết với T bằng 2 liên kết hydro; G liên kết với C bằng 3 liên kết hydro.'
  },
  {
    id: 'b-6',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Tiến hóa',
    content: 'Theo thuyết tiến hóa hiện đại, nhân tố nào sau đây là nhân tố tiến hóa có hướng quy định chiều hướng tiến hóa?',
    options: [
      { id: 'A', text: 'Chọn lọc tự nhiên' },
      { id: 'B', text: 'Đột biến' },
      { id: 'C', text: 'Giao phối không ngẫu nhiên' },
      { id: 'D', text: 'Các yếu tố ngẫu nhiên' }
    ],
    correctOptionId: 'A',
    explanation: 'Chọn lọc tự nhiên là nhân tố tiến hóa duy nhất có hướng, đào thải các alen có hại và tích lũy các alen có lợi.'
  },
  {
    id: 'b-7',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Cân bằng quần thể',
    content: 'Một quần thể đạt trạng thái cân bằng di truyền Hardy-Weinberg có tần số alen $A = 0.6$ và $a = 0.4$. Tỉ lệ kiểu gene dị hợp tử $Aa$ là:',
    options: [
      { id: 'A', text: '$0.48$' },
      { id: 'B', text: '$0.36$' },
      { id: 'C', text: '$0.16$' },
      { id: 'D', text: '$0.24$' }
    ],
    correctOptionId: 'A',
    explanation: 'Cấu trúc di truyền cân bằng: $p^2 AA + 2pq Aa + q^2 aa = 1$. Tỉ lệ $Aa = 2pq = 2 \\times 0.6 \\times 0.4 = 0.48$.'
  },
  {
    id: 'b-8',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Di truyền liên kết',
    content: 'Nhà khoa học đã phát hiện ra hiện tượng di truyền liên kết và hoán vị gene trên ruồi giấm là:',
    options: [
      { id: 'A', text: 'Thomas Hunt Morgan' },
      { id: 'B', text: 'Gregor Mendel' },
      { id: 'C', text: 'Charles Darwin' },
      { id: 'D', text: 'James Watson' }
    ],
    correctOptionId: 'A',
    explanation: 'Morgan là người thực hiện các thí nghiệm lai ruồi giấm và phát hiện quy luật liên kết gene và hoán vị gene.'
  },
  {
    id: 'b-9',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Quang hợp',
    content: 'Pha sáng của quá trình quang hợp ở thực vật diễn ra tại bào quan nào?',
    options: [
      { id: 'A', text: 'Màng thylakoid của lục lạp' },
      { id: 'B', text: 'Chất nền (stroma) của lục lạp' },
      { id: 'C', text: 'Màng trong ti thể' },
      { id: 'D', text: 'Tế bào chất' }
    ],
    correctOptionId: 'A',
    explanation: 'Pha sáng diễn ra trên màng thylakoid tạo ra ATP và NADPH. Pha tối (chu trình Calvin) diễn ra ở chất nền stroma.'
  },
  {
    id: 'b-10',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Hệ tuần hoàn',
    content: 'Ở người bình thường, máu giàu oxy (màu đỏ tươi) được vận chuyển từ phổi về tim qua:',
    options: [
      { id: 'A', text: 'Tĩnh mạch phổi về tâm nhĩ trái' },
      { id: 'B', text: 'Động mạch phổi về tâm nhĩ phải' },
      { id: 'C', text: 'Tĩnh mạch chủ về tâm thất trái' },
      { id: 'D', text: 'Động mạch chủ về tâm thất phải' }
    ],
    correctOptionId: 'A',
    explanation: 'Máu sau khi trao đổi khí ở phế nang theo tĩnh mạch phổi đổ về tâm nhĩ trái, sau đó xuống tâm thất trái để bơm đi nuôi cơ thể.'
  },
  {
    id: 'b-11',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Sinh thái quần thể',
    content: 'Tập hợp các cá thể cùng loài, cùng sinh sống trong một khoảng không gian và thời gian xác định gọi là:',
    options: [
      { id: 'A', text: 'Quần thể sinh vật' },
      { id: 'B', text: 'Quần xã sinh vật' },
      { id: 'C', text: 'Hệ sinh thái' },
      { id: 'D', text: 'Sinh quyển' }
    ],
    correctOptionId: 'A',
    explanation: 'Quần thể là tập hợp các cá thể cùng loài, có khả năng giao phối sinh ra thế hệ sau hữu thụ.'
  },
  {
    id: 'b-12',
    subject: 'biology',
    subjectName: 'Sinh học',
    topic: 'Ứng dụng di truyền',
    content: 'Kỹ thuật chuyển gene để tạo ra sinh vật biến đổi gene (GMO) sử dụng thể truyền phổ biến nhất là:',
    options: [
      { id: 'A', text: 'Plasmid hoặc thực khuẩn thể (phage)' },
      { id: 'B', text: 'Ribosome' },
      { id: 'C', text: 'Không bào' },
      { id: 'D', text: 'Bộ máy Golgi' }
    ],
    correctOptionId: 'A',
    explanation: 'Thể truyền (vector) dùng để mang gene cần chuyển vào tế bào nhận thường là plasmid hoặc thể thực khuẩn (bacteriophage).'
  },

  // --- MÔN TIẾNG ANH ---
  {
    id: 'e-1',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Conditionals',
    content: 'If she had studied harder, she ________ the university entrance exam last year.',
    options: [
      { id: 'A', text: 'would pass' },
      { id: 'B', text: 'would have passed' },
      { id: 'C', text: 'will pass' },
      { id: 'D', text: 'had passed' }
    ],
    correctOptionId: 'B',
    explanation: 'Câu điều kiện loại 3 (trái ngược với quá khứ): If + S + had + P2, S + would/could + have + P2.'
  },
  {
    id: 'e-2',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Vocabulary - Synonyms',
    content: 'The government is making efforts to **eradicate** poverty in rural areas. (Choose CLOSEST in meaning):',
    options: [
      { id: 'A', text: 'eliminate' },
      { id: 'B', text: 'maintain' },
      { id: 'C', text: 'increase' },
      { id: 'D', text: 'ignore' }
    ],
    correctOptionId: 'A',
    explanation: '“Eradicate” có nghĩa là xóa bỏ, tiêu trừ, đồng nghĩa với “eliminate” hoặc “wipe out”.'
  },
  {
    id: 'e-3',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Passive Voice',
    content: 'A new bridge across the Red River ________ at the moment.',
    options: [
      { id: 'A', text: 'is being built' },
      { id: 'B', text: 'is built' },
      { id: 'C', text: 'has built' },
      { id: 'D', text: 'was built' }
    ],
    correctOptionId: 'A',
    explanation: 'Dấu hiệu “at the moment” chỉ thì hiện tại tiếp diễn. Dạng bị động: S + is/are/am + being + P2.'
  },
  {
    id: 'e-4',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Pronunciation - Stress',
    content: 'Choose the word that differs from the other three in the position of primary stress:',
    options: [
      { id: 'A', text: 'economics' },
      { id: 'B', text: 'university' },
      { id: 'C', text: 'environment' },
      { id: 'D', text: 'information' }
    ],
    correctOptionId: 'C',
    explanation: '“environment” trọng âm rơi vào âm tiết thứ 2 [ɪnˈvaɪ.rən.mənt]; các từ còn lại trọng âm rơi vào âm tiết thứ 3: economics [ˌiː.kəˈnɒm.ɪks], university [ˌjuː.nɪˈvɜː.sə.ti], information [ˌɪn.fəˈmeɪ.ʃən].'
  },
  {
    id: 'e-5',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Relative Clauses',
    content: 'The scientist ________ discoveries won the Nobel Prize delivered an inspiring lecture.',
    options: [
      { id: 'A', text: 'who' },
      { id: 'B', text: 'whose' },
      { id: 'C', text: 'whom' },
      { id: 'D', text: 'which' }
    ],
    correctOptionId: 'B',
    explanation: '“whose” là đại từ quan hệ chỉ sở hữu: “whose discoveries” = “những phát minh của nhà khoa học đó”.'
  },
  {
    id: 'e-6',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Inversion',
    content: 'Hardly ________ home when it started pouring down with rain.',
    options: [
      { id: 'A', text: 'had he arrived' },
      { id: 'B', text: 'he had arrived' },
      { id: 'C', text: 'did he arrive' },
      { id: 'D', text: 'was he arriving' }
    ],
    correctOptionId: 'A',
    explanation: 'Cấu trúc đảo ngữ: Hardly + had + S + P2 + when + S + V(quá khứ đơn).'
  },
  {
    id: 'e-7',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Phrasal Verbs',
    content: 'Never put ________ until tomorrow what you can do today.',
    options: [
      { id: 'A', text: 'off' },
      { id: 'B', text: 'up' },
      { id: 'C', text: 'on' },
      { id: 'D', text: 'out' }
    ],
    correctOptionId: 'A',
    explanation: '“put off” có nghĩa là hoãn lại, trì hoãn (tương đương “delay” hoặc “postpone”).'
  },
  {
    id: 'e-8',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Communication Skills',
    content: 'Mark: “Would you like to join our study group this weekend?” - Peter: “________”',
    options: [
      { id: 'A', text: 'I\'d love to, thank you!' },
      { id: 'B', text: 'Yes, I do.' },
      { id: 'C', text: 'Never mind.' },
      { id: 'D', text: 'Congratulations!' }
    ],
    correctOptionId: 'A',
    explanation: 'Để đáp lại lời mời chân thành “Would you like to...?”, câu trả lời lịch sự phổ biến là “I\'d love to, thank you!”.'
  },
  {
    id: 'e-9',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Vocabulary - Antonyms',
    content: 'The lecture was so **monotonous** that many students fell asleep. (Choose OPPOSITE in meaning):',
    options: [
      { id: 'A', text: 'fascinating' },
      { id: 'B', text: 'tedious' },
      { id: 'C', text: 'boring' },
      { id: 'D', text: 'dull' }
    ],
    correctOptionId: 'A',
    explanation: '“monotonous” là đơn điệu, nhàm chán. Trái nghĩa của nó là “fascinating” (hấp dẫn, lôi cuốn).'
  },
  {
    id: 'e-10',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Modal Verbs',
    content: 'You ________ drive after consuming alcohol; it is strictly prohibited by law.',
    options: [
      { id: 'A', text: 'mustn\'t' },
      { id: 'B', text: 'needn\'t' },
      { id: 'C', text: 'might not' },
      { id: 'D', text: 'couldn\'t' }
    ],
    correctOptionId: 'A',
    explanation: '“mustn\'t” diễn tả điều cấm đoán theo luật định.'
  },
  {
    id: 'e-11',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Gerund & Infinitive',
    content: 'She admitted ________ a mistake in calculating the final statistics.',
    options: [
      { id: 'A', text: 'making' },
      { id: 'B', text: 'to make' },
      { id: 'C', text: 'make' },
      { id: 'D', text: 'made' }
    ],
    correctOptionId: 'A',
    explanation: 'Cấu trúc “admit + V-ing” mang nghĩa thừa nhận đã làm gì.'
  },
  {
    id: 'e-12',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Articles',
    content: 'Mount Everest is ________ highest mountain in the world.',
    options: [
      { id: 'A', text: 'the' },
      { id: 'B', text: 'a' },
      { id: 'C', text: 'an' },
      { id: 'D', text: 'zero article' }
    ],
    correctOptionId: 'A',
    explanation: 'Trước cấp so sánh nhất “highest” bắt buộc sử dụng mạo từ xác định “the”.'
  },
  {
    id: 'e-13',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Conjunctions',
    content: '________ he was exhausted after a long day, he continued preparing for his exam.',
    options: [
      { id: 'A', text: 'Although' },
      { id: 'B', text: 'Because' },
      { id: 'C', text: 'In spite of' },
      { id: 'D', text: 'Despite' }
    ],
    correctOptionId: 'A',
    explanation: '“Although + mệnh đề” (mặc dù). “In spite of / Despite” đi kèm danh từ hoặc V-ing.'
  },
  {
    id: 'e-14',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Vocabulary - Collocations',
    content: 'She decided to ________ full advantage of the online library to do research.',
    options: [
      { id: 'A', text: 'take' },
      { id: 'B', text: 'make' },
      { id: 'C', text: 'do' },
      { id: 'D', text: 'give' }
    ],
    correctOptionId: 'A',
    explanation: 'Cụm cố định (collocation): “take advantage of something” nghĩa là tận dụng, tận dụng lợi thế.'
  },
  {
    id: 'e-15',
    subject: 'english',
    subjectName: 'Tiếng Anh',
    topic: 'Grammar - Question Tags',
    content: 'Nothing was damaged during the heavy storm last night, ________?',
    options: [
      { id: 'A', text: 'was it' },
      { id: 'B', text: 'wasn\'t it' },
      { id: 'C', text: 'did it' },
      { id: 'D', text: 'didn\'t it' }
    ],
    correctOptionId: 'A',
    explanation: 'Chủ ngữ “Nothing” mang nghĩa phủ định và được quy về đại từ “it”, nên phần đuôi câu hỏi dùng khẳng định “was it”.'
  }
];

export function THPTExamPractice() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('math-standard-1');
  const [examState, setExamState] = useState<'idle' | 'taking' | 'finished'>('idle');
  
  // Test runtime state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active package & question list
  const currentPackage = useMemo(() => {
    return EXAM_PACKAGES.find(p => p.id === selectedPackageId) || EXAM_PACKAGES[0];
  }, [selectedPackageId]);

  const activeQuestions = useMemo(() => {
    if (selectedSubject === 'all') {
      return QUESTION_BANK;
    }
    return QUESTION_BANK.filter(q => q.subject === selectedSubject);
  }, [selectedSubject]);

  // Handle start test
  const handleStartExam = () => {
    const durationSec = currentPackage.durationMinutes * 60;
    setTimeLeftSeconds(durationSec);
    setTotalTimeSeconds(durationSec);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
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

  // Handle finish test
  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setExamState('finished');
  };

  // Compute test score and stats
  const examResult = useMemo(() => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    activeQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (!ans) {
        unansweredCount++;
      } else if (ans === q.correctOptionId) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = activeQuestions.length;
    const score = total > 0 ? Number(((correctCount / total) * 10).toFixed(2)) : 0;
    const timeSpent = totalTimeSeconds - timeLeftSeconds;

    return {
      correctCount,
      wrongCount,
      unansweredCount,
      total,
      score,
      timeSpent
    };
  }, [activeQuestions, userAnswers, totalTimeSeconds, timeLeftSeconds]);

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Select option handler
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (examState !== 'taking') return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Toggle bookmark flag
  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Switch subject / filter
  const handleSelectSubject = (sub: SubjectId) => {
    if (examState === 'taking' && sub !== selectedSubject) {
      const confirmChange = window.confirm('Bạn đang trong quá trình làm bài thi. Chuyển sang môn học khác sẽ đặt lại bài thi hiện tại. Bạn có chắc muốn chuyển không?');
      if (!confirmChange) return;
      setExamState('idle');
      setUserAnswers({});
      setFlaggedQuestions({});
    }
    setSelectedSubject(sub);
    const foundPkg = EXAM_PACKAGES.find(p => p.subject === sub);
    if (foundPkg) {
      setSelectedPackageId(foundPkg.id);
    }
    setCurrentQuestionIndex(0);
  };

  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0] || QUESTION_BANK[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Thi thử THPT Quốc gia & Đánh giá năng lực 2026
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Luyện thi THPT Trực tuyến
            </h1>
            <p className="text-emerald-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Ngân hàng đề thi trắc nghiệm Toán, Lí, Hóa, Sinh, Tiếng Anh bám sát chương trình mới. Tự động bấm giờ, chấm điểm tức thì và phân tích lời giải chi tiết.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start md:self-center">
            <Trophy className="w-8 h-8 text-yellow-300 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white text-sm">Chấm điểm tự động</p>
              <p className="text-emerald-200">Chuẩn thang điểm 10</p>
            </div>
          </div>
        </div>
      </div>

      {/* THANH BỘ LỌC PHÍA TRÊN BỘ CÂU HỎI */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-slate-800 font-bold text-sm shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Thanh bộ lọc</span>
            <span className="text-sm font-bold text-slate-800">Chọn môn học:</span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          {[
            { id: 'math', label: 'Toán học', icon: '📐' },
            { id: 'physics', label: 'Vật lí', icon: '⚡' },
            { id: 'chemistry', label: 'Hóa học', icon: '🧪' },
            { id: 'biology', label: 'Sinh học', icon: '🧬' },
            { id: 'english', label: 'Tiếng Anh', icon: '🌍' },
            { id: 'all', label: 'Tất cả các môn', icon: '📚' },
          ].map(sub => {
            const isSelected = selectedSubject === sub.id;
            const count = sub.id === 'all' 
              ? QUESTION_BANK.length 
              : QUESTION_BANK.filter(q => q.subject === sub.id).length;
            return (
              <button
                key={sub.id}
                onClick={() => handleSelectSubject(sub.id as SubjectId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-sm">{sub.icon}</span>
                <span>{sub.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STATE 1: IDLE - LỰA CHỌN MÔN THI & BẮT ĐẦU */}
      {examState === 'idle' && (
        <div className="space-y-6">
          {/* Exam Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    Môn {selectedSubject === 'all' ? 'Tổng hợp liên môn' : currentQ.subjectName}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-2">{currentPackage.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-semibold">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{currentPackage.durationMinutes} phút</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {currentPackage.description} Đề thi được thiết kế bám sát cấu trúc đề minh họa mới nhất với các mức độ nhận biết, thông hiểu và vận dụng.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Số lượng câu hỏi</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{activeQuestions.length} câu</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Thời gian làm bài</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{currentPackage.durationMinutes} phút</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <p className="text-xs text-slate-500 font-medium">Hình thức</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">Trắc nghiệm</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleStartExam}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-sm transition-all flex items-center justify-center gap-3"
                >
                  <Timer className="w-5 h-5" />
                  <span>Bắt đầu Bấm giờ Làm bài</span>
                </button>
              </div>
            </div>

            {/* Right Guide Column */}
            <div className="lg:col-span-4 bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 space-y-4">
              <h4 className="font-bold text-emerald-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                Hướng dẫn làm bài thi
              </h4>
              <ul className="text-xs text-slate-700 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                  <span>Đồng hồ sẽ bắt đầu đếm ngược ngay khi bạn bấm <strong>Bắt đầu</strong>. Khi hết giờ, bài làm sẽ tự động được thu và chấm điểm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                  <span>Sử dụng thanh câu hỏi bên phải để chuyển nhanh đến câu bất kỳ hoặc đánh dấu xem lại câu khó.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                  <span>Sau khi nộp bài, bạn sẽ nhận được điểm số, số câu đúng/sai cùng lời giải chi tiết từng câu kèm công thức Toán học chuẩn mực.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: TAKING - GIAO DIỆN LÀM BÀI TRỰC QUAN */}
      {examState === 'taking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Question Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Top Toolbar: Progress & Flag */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs">
                  Câu {currentQuestionIndex + 1} / {activeQuestions.length}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Chủ đề: {currentQ.topic}
                </span>
              </div>

              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentQ.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}</span>
              </button>
            </div>

            {/* Question Content */}
            <div className="text-slate-800 text-base md:text-lg font-medium leading-relaxed">
              <MathView content={currentQ.content} />
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map(opt => {
                const isSelected = userAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {opt.id}
                    </span>
                    <div className="flex-1 text-sm md:text-base text-slate-800 pt-0.5">
                      <MathView inline content={opt.text} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <button
                disabled={currentQuestionIndex === activeQuestions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, activeQuestions.length - 1))}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Timer & Question Matrix */}
          <div className="lg:col-span-4 space-y-5">
            {/* Countdown Timer */}
            <div className={`p-5 rounded-3xl border shadow-xs transition-colors flex items-center justify-between ${
              timeLeftSeconds < 300 
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <Clock className={`w-6 h-6 ${timeLeftSeconds < 300 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`} />
                <div>
                  <p className="text-xs font-semibold opacity-75">Thời gian còn lại</p>
                  <p className="text-2xl font-extrabold font-mono tracking-tight">
                    {formatTime(timeLeftSeconds)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinishExam}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Nộp bài</span>
              </button>
            </div>

            {/* Questions Palette Matrix */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-emerald-600" />
                  Danh sách câu hỏi
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {Object.keys(userAnswers).length}/{activeQuestions.length}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {activeQuestions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isCurrent = currentQuestionIndex === idx;
                  const isFlagged = !!flaggedQuestions[q.id];

                  let btnStyle = 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200';
                  if (isAnswered) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                  }
                  if (isFlagged) {
                    btnStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
                  }
                  if (isCurrent) {
                    btnStyle += ' ring-2 ring-emerald-500 ring-offset-1';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-xl border text-xs font-bold transition-all relative ${btnStyle}`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600" />
                  <span>Đã trả lời</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-200" />
                  <span>Chưa trả lời</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-200" />
                  <span>Đã đánh dấu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded border-2 border-emerald-500" />
                  <span>Đang xem</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: FINISHED - KẾT QUẢ, CHẤM ĐIỂM & LỜI GIẢI CHI TIẾT */}
      {examState === 'finished' && (
        <div className="space-y-6">
          {/* Result Score Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-5 text-center md:text-left">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-sm ${
                  examResult.score >= 8
                    ? 'bg-emerald-100 text-emerald-700'
                    : examResult.score >= 5
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {examResult.score}
                </div>
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Thang điểm 10
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">
                    {examResult.score >= 8 ? 'Xuất sắc! 🎉' : examResult.score >= 6.5 ? 'Khá tốt! Cố lên nhé! 👍' : 'Cần rèn luyện thêm! 💪'}
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Thời gian hoàn thành: {formatTime(examResult.timeSpent)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartExam}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại đề này</span>
                </button>
                <button
                  onClick={() => setExamState('idle')}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                >
                  Chọn đề khác
                </button>
              </div>
            </div>

            {/* Quick Stat Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-800 font-medium">Số câu đúng</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">{examResult.correctCount} câu</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-rose-800 font-medium">Số câu sai</p>
                  <p className="text-2xl font-black text-rose-700 mt-1">{examResult.wrongCount} câu</p>
                </div>
                <XCircle className="w-8 h-8 text-rose-600" />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 font-medium">Chưa trả lời</p>
                  <p className="text-2xl font-black text-slate-700 mt-1">{examResult.unansweredCount} câu</p>
                </div>
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Xem lại bài làm & Lời giải chi tiết
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Tất cả {activeQuestions.length} câu hỏi
              </span>
            </div>

            <div className="space-y-4">
              {activeQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctOptionId;
                const isAnswered = !!userAns;

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-3xl p-6 border shadow-xs transition-colors space-y-4 ${
                      !isAnswered
                        ? 'border-slate-200'
                        : isCorrect
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold text-xs">
                          Câu {idx + 1}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{q.topic}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isAnswered ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                            Chưa làm
                          </span>
                        ) : isCorrect ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Đúng
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Sai
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="text-slate-800 font-medium text-base">
                      <MathView content={q.content} />
                    </div>

                    {/* Option Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map(opt => {
                        const isChosen = userAns === opt.id;
                        const isRightAnswer = q.correctOptionId === opt.id;

                        let cardStyle = 'border-slate-200 bg-slate-50/50 text-slate-700';
                        if (isRightAnswer) {
                          cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                        } else if (isChosen && !isRightAnswer) {
                          cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${cardStyle}`}
                          >
                            <span className="font-bold shrink-0">{opt.id}.</span>
                            <div className="flex-1">
                              <MathView inline content={opt.text} />
                            </div>
                            {isRightAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed Explanation */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 mt-3">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                        <HelpCircle className="w-4 h-4 text-emerald-600" />
                        <span>Lời giải chi tiết:</span>
                      </div>
                      <div className="text-slate-600 leading-relaxed pl-5">
                        <MathView content={q.explanation} />
                      </div>
                    </div>
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

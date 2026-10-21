import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  FlaskConical,
  Dna,
  Sigma,
  Cpu
} from 'lucide-react';
import { MathView } from './MathView';

export interface CalcSkill {
  id: string;
  subject: 'Toán' | 'Vật lý' | 'Hóa học' | 'Sinh học';
  title: string;
  description: string;
  casioKeys: string[];
  exampleProblem: string;
  stepByStep: string[];
  resultFormula: string;
  proTip: string;
  commonError: string;
}

const SKILLS_DATA: CalcSkill[] = [
  // ==================== TOÁN HỌC ====================
  {
    id: 'math-1',
    subject: 'Toán',
    title: 'Bấm máy Số phức tổng hợp Vectơ Oxyz & Tích có hướng [a, b]',
    description: 'Tính nhanh tích có hướng của hai vectơ $\\vec{a} = (a_1, a_2, a_3)$ và $\\vec{b} = (b_1, b_2, b_3)$ trong không gian Oxyz để tính diện tích tam giác và thể tích khối tứ diện.',
    casioKeys: ['MENU', '5', '1', '3', 'OPTN', '1', '3', 'OPTN', '3', '×', 'OPTN', '4'],
    exampleProblem: 'Cho $\\vec{a} = (1, -2, 3)$ và $\\vec{b} = (0, 4, 1)$. Tính tọa độ vectơ tích có hướng $[\\vec{a}, \\vec{b}]$.',
    stepByStep: [
      'Bước 1: Bấm `[MENU]` `[5]` chọn Chế độ Vector.',
      'Bước 2: Chọn `[1]` (VctA), chọn Dimension = `[3]`, nhập tọa độ $1, -2, 3$.',
      'Bước 3: Nhấn `[OPTN]` `[1]` `[2]` (VctB), chọn Dimension = `[3]`, nhập $0, 4, 1$.',
      'Bước 4: Nhấn `[AC]`, sau đó bấm `[OPTN]` `[3]` (VctA) `[×]` `[OPTN]` `[4]` (VctB) `[=]`.',
      'Bước 5: Màn hình trả về kết quả $(-14, -1, 4)$.'
    ],
    resultFormula: '$[\\vec{a}, \\vec{b}] = (a_2 b_3 - a_3 b_2, a_3 b_1 - a_1 b_3, a_1 b_2 - a_2 b_1) = (-14, -1, 4)$',
    proTip: 'Tính diện tích tam giác $S_{ABC} = \\frac{1}{2} |[\\vec{AB}, \\vec{AC}]|$ chỉ cần thêm phím `[ABS]` (SHIFT + Hyp).',
    commonError: 'Quên chọn đúng số chiều Dimension (chọn 3 chiều cho Oxyz, chọn 2 chiều cho Oxy).'
  },
  {
    id: 'math-2',
    subject: 'Toán',
    title: 'Tìm Giá trị Lớn nhất & Nhỏ nhất (Max-Min) bằng Lập bảng TABLE',
    description: 'Tìm nhanh $\\max, \\min$ của hàm số $y = f(x)$ trên đoạn $[a; b]$ mà không cần tính đạo hàm lập bảng biến thiên.',
    casioKeys: ['MENU', '8', 'f(x)', '=', 'Start', '=', 'End', '=', 'Step', '='],
    exampleProblem: 'Tìm giá trị lớn nhất $M$ của $f(x) = x^3 - 3x + 2$ trên đoạn $[-1; 3]$.',
    stepByStep: [
      'Bước 1: Bấm `[MENU]` `[8]` vào bảng TABLE.',
      'Bước 2: Nhập hàm $f(x) = X^3 - 3X + 2$.',
      'Bước 3: Nhập `Start = -1`, `End = 3`.',
      'Bước 4: Nhập `Step = (End - Start) / 29 = (3 - (-1)) / 29 \\approx 0,137$.',
      'Bước 5: Nhìn cột $f(X)$ tìm giá trị lớn nhất ($M = 20$ tại $X = 3$).'
    ],
    resultFormula: '$\\max_{[-1; 3]} f(x) = 20$ tại $x = 3$; $\\min_{[-1; 3]} f(x) = 0$ tại $x = 1$.',
    proTip: 'Nên đặt Step là $\\frac{\\text{End} - \\text{Start}}{29}$ hoặc $\\frac{\\text{End} - \\text{Start}}{44}$ tùy loại máy để quét mịn nhất.',
    commonError: 'Nhập sai giá trị Step quá lớn làm sót điểm cực trị của hàm số.'
  },

  // ==================== VẬT LÝ ====================
  {
    id: 'phy-1',
    subject: 'Vật lý',
    title: 'Bấm máy Số phức Tổng hợp 2 Dao động điều hòa cùng phương',
    description: 'Tính nhanh biên độ $A$ và pha ban đầu $\\varphi$ của $x = x_1 + x_2 = A_1\\cos(\\omega t + \\varphi_1) + A_2\\cos(\\omega t + \\varphi_2)$ dưới dạng $r \\angle \\theta$.',
    casioKeys: ['SHIFT', 'MENU', '2', '2', 'MENU', '2', 'A1', '∠', 'φ1', '+', 'A2', '∠', 'φ2', 'OPTN', '↓', '1'],
    exampleProblem: 'Cho $x_1 = 3\\cos(10\\pi t)$ cm và $x_2 = 4\\cos(10\\pi t + \\frac{\\pi}{2})$ cm. Tìm phương trình dao động tổng hợp $x$.',
    stepByStep: [
      'Bước 1: Chuyển đơn vị góc sang Radian: `[SHIFT]` `[MENU]` `[2]` `[2]` (Chữ R trên màn hình).',
      'Bước 2: Vào Chế độ Số phức: `[MENU]` `[2]`.',
      'Bước 3: Nhập $3 \\angle 0 + 4 \\angle \\frac{\\pi}{2}$ (Phím góc $\\angle$ bằng SHIFT + ENG).',
      'Bước 4: Chuyển sang dạng tọa độ cực: Bấm `[OPTN]` `[↓]` `[1]` (`r \\angle \\theta`) rồi bấm `[=]`.',
      'Bước 5: Màn hình hiển thị $5 \\angle 0,927$. Phương trình $x = 5\\cos(10\\pi t + 0,927)$ cm.'
    ],
    resultFormula: '$A = 5$ cm, $\\varphi \\approx 0,927$ rad (hoặc $0,295\\pi$ rad).',
    proTip: 'Nếu muốn kết quả góc theo bội số của $\\pi$, chia góc thu được cho $\\pi$ trên máy.',
    commonError: 'Để máy ở chế độ Độ (D) thay vì Radian (R) dẫn đến tính góc $\\varphi$ bị sai hoàn toàn.'
  },
  {
    id: 'phy-2',
    subject: 'Vật lý',
    title: 'Tính nhanh Mạch RLC nối tiếp & Độ lệch pha u/i',
    description: 'Biểu diễn trở kháng phức $Z = R + (Z_L - Z_C)i$ để tìm tổng trở $Z$, góc lệch pha $\\varphi$ và cường độ dòng điện $i(t)$.',
    casioKeys: ['MENU', '2', 'R', '+', '(', 'ZL', '-', 'ZC', ')', 'i', '=', 'OPTN', '↓', '1'],
    exampleProblem: 'Mạch RLC có $R = 40\\ \\Omega, Z_L = 80\\ \\Omega, Z_C = 40\\ \\Omega$. Điện áp $u = 120\\sqrt{2}\\cos(100\\pi t)$ V. Viết phương trình $i(t)$.',
    stepByStep: [
      'Bước 1: Chuyển máy sang Radian (R) và Mode Complex `[MENU]` `[2]`.',
      'Bước 2: Nhập biểu thức $U_0 \\angle \\varphi_u / (R + (Z_L - Z_C)i)$.',
      'Bước 3: Nhập $(120\\sqrt{2} \\angle 0) / (40 + (80 - 40)i)$.',
      'Bước 4: Bấm `[OPTN]` `[↓]` `[1]` `[=]`.',
      'Bước 5: Màn hình ra $3 \\angle -\\frac{\\pi}{4}$. Suy ra $i = 3\\cos(10\\pi t - \\frac{\\pi}{2})$ A.'
    ],
    resultFormula: '$I_0 = 3$ A, $\\varphi_i = -\\frac{\\pi}{4}$ rad.',
    proTip: 'Định luật Ohm dạng phức: $\\bar{I} = \\frac{\\bar{U}}{\\bar{Z}}$ với $\\bar{Z} = R + (Z_L - Z_C)i$.',
    commonError: 'Quên ngoặc đóng mở khi chia số phức khiến phép chia bị sai thứ tự ưu tiên.'
  },

  // ==================== HÓA HỌC ====================
  {
    id: 'chem-1',
    subject: 'Hóa học',
    title: 'Giải hệ 3 - 4 Phương trình Bảo toàn E & Khối lượng',
    description: 'Giải nhanh hệ $3$ hoặc $4$ ẩn số $x, y, z, t$ xuất hiện trong các bài toán hỗn hợp kim loại tác dụng với $\\text{HNO}_3 / \\text{H}_2\\text{SO}_4$ đặc nóng.',
    casioKeys: ['MENU', '9', '1', '3', 'Nhập hệ số', '='],
    exampleProblem: 'Hỗn hợp $Al (x), Fe (y), Cu (z)$ tác dụng vừa đủ dung dịch. Lập hệ $3$ ẩn: khối lượng hỗn hợp ($27x + 56y + 64z = 12,3$), bảo toàn $e$ ($3x + 3y + 2z = 0,6$) và muối ($147x + 242y + 188z = 45,1$).',
    stepByStep: [
      'Bước 1: Bấm `[MENU]` `[9]` chọn Chế độ Giải hệ phương trình.',
      'Bước 2: Nhấn `[1]` (Simul Equation), chọn số ẩn = `[3]` (hoặc `[4]`).',
      'Bước 3: Nhập lần lượt hệ số từng dòng $a_i, b_i, c_i, d_i$.',
      'Bước 4: Bấm `[=]` để máy trả về kết quả nghiệm $x, y, z$.'
    ],
    resultFormula: '$x = 0,1\\text{ mol}, y = 0,1\\text{ mol}, z = 0,05\\text{ mol}$.',
    proTip: 'Luôn rút gọn phương trình hóa học trước khi nhập hệ số để tránh nhầm lẫn.',
    commonError: 'Chuyển vế hằng số do không đổi dấu ($d_i$ phải nằm ở vế phải dấu bằng).'
  },
  {
    id: 'chem-2',
    subject: 'Hóa học',
    title: 'Tính nhanh pH dung dịch Axit / Bazơ & Đệm',
    description: 'Tính $\\text{pH} = -\\lg[\\text{H}^+]$ hoặc $\\text{pH} = 14 + \\lg[\\text{OH}^-]$ cực nhanh trên máy tính.',
    casioKeys: ['-', 'log', '[H+]', '='],
    exampleProblem: 'Tính $\\text{pH}$ của dung dịch $\\text{HCl}\\ 0,02\\text{ M}$.',
    stepByStep: [
      'Bước 1: Do $\\text{HCl}$ phân ly hoàn toàn $\\Rightarrow [\\text{H}^+] = 0,02\\text{ M}$.',
      'Bước 2: Bấm `[-]` `[log]` (Phím logarit cơ số 10).',
      'Bước 3: Nhập `0.02` rồi nhấn `[=]`.',
      'Bước 4: Màn hình ra $1,6989 \\approx 1,7$.'
    ],
    resultFormula: '$\\text{pH} = -\\lg(0,02) \\approx 1,7$.',
    proTip: 'Đối với Bazơ: Bấm $14 + \\lg([\\text{OH}^-])$ để ra trực tiếp $\\text{pH}$.',
    commonError: 'Dùng nhầm phím $\\ln$ (logarit tự nhiên $e$) thay vì $\\lg$ (logarit cơ số 10).'
  },

  // ==================== SINH HỌC ====================
  {
    id: 'bio-1',
    subject: 'Sinh học',
    title: 'Tính nhanh số liên kết Hydrogen H & Chiều dài L của ADN',
    description: 'Tính các thông số cấu trúc ADN: Tổng số nucleotide $N$, Chiều dài $L$ (Å), Số liên kết hydrogen $H$ từ tỷ lệ $\%A, \%G$.',
    casioKeys: ['N = 2*(A+G)', 'L = (N/2)*3.4', 'H = 2A + 3G'],
    exampleProblem: 'Một gen có $A = 600$ nu và $G = 900$ nu. Tính tổng số nu $N$, chiều dài $L$ (Å) và số liên kết Hydrogen $H$.',
    stepByStep: [
      'Bước 1: Tính tổng số $N = 2A + 2G = 2(600) + 2(900) = 3000$ nu.',
      'Bước 2: Tính chiều dài $L = \\frac{N}{2} \\times 3,4 = 1500 \\times 3,4 = 5100\\text{ Å}$.',
      'Bước 3: Bấm $H = 2A + 3G = 2(600) + 3(900) = 1200 + 2700 = 3900$ liên kết.',
      'Bước 4: Đổi ra nm: $1\\text{ nm} = 10\\text{ Å} \\Rightarrow L = 510\\text{ nm}$.'
    ],
    resultFormula: '$N = 3000$ nu, $L = 5100\\text{ Å}$, $H = 3900$ liên kết Hydrogen.',
    proTip: 'Luôn nhớ $1\\text{ nm} = 10\\text{ Å} = 10^{-4}\\ \\mu\\text{m}$.',
    commonError: 'Nhầm lẫn giữa số cặp nucleotide $\\frac{N}{2}$ với tổng số nucleotide $N$.'
  },
  {
    id: 'bio-2',
    subject: 'Sinh học',
    title: 'Tính Xác suất Phép lai nhiều cặp bằng Quy tắc Nhân',
    description: 'Tính xác suất xuất hiện kiểu gen hoặc kiểu hình mong muốn ở đời con từ phép lai đa gen $AaBbCcDd \\times AaBbCcDd$.',
    casioKeys: ['(3/4)^n', '(1/2)^n', 'x^y', '='],
    exampleProblem: 'Phép lai $AaBbCcDd \\times AaBbCcDd$. Tính tỷ lệ đời con mang kiểu hình $A\\_B\\_C\\_dd$.',
    stepByStep: [
      'Bước 1: Tách từng cặp tính trạng:',
      '• $Aa \\times Aa \\rightarrow A\\_ = \\frac{3}{4}$',
      '• $Bb \\times Bb \\rightarrow B\\_ = \\frac{3}{4}$',
      '• $Cc \\times Cc \\rightarrow C\\_ = \\frac{3}{4}$',
      '• $Dd \\times Dd \\rightarrow dd = \\frac{1}{4}$',
      'Bước 2: Nhân các tỷ lệ lại: $(\\frac{3}{4})^3 \\times \\frac{1}{4} = \\frac{27}{64} \\times \\frac{1}{4} = \\frac{27}{256} \\approx 10,55\\%$.',
      'Bước 3: Bấm phím `[(3/4)^3 * 1/4]` trên máy để ra số thập phân hoặc phân số.'
    ],
    resultFormula: 'Tỷ lệ kiểu hình $A\\_B\\_C\\_dd = \\frac{27}{256} = 10,546875\\%$.',
    proTip: 'Sử dụng phím lũy thừa `[x^■]` để tính $(\\frac{3}{4})^n$ nhanh chóng.',
    commonError: 'Cộng xác suất thay vì nhân xác suất của các cặp gen độc lập.'
  }
];

export function CalculatorSkillsHub() {
  const [selectedSubject, setSelectedSubject] = useState<'Tất cả' | 'Toán' | 'Vật lý' | 'Hóa học' | 'Sinh học'>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter skills
  const filteredSkills = SKILLS_DATA.filter(skill => {
    const matchSubject = selectedSubject === 'Tất cả' || skill.subject === selectedSubject;
    const matchQuery = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       skill.exampleProblem.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchQuery;
  });

  const handleCopyKeys = (skill: CalcSkill) => {
    const text = skill.casioKeys.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedId(skill.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/40 rounded-2xl">
              <Cpu className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Cẩm nang Kỹ năng Casio / MTBT 2026</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Skill Bấm Máy Tính Giải Nhanh THPT</h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Tuyển tập <span className="font-bold text-indigo-300">Tuyệt kỹ Bấm máy tính Casio 580VN X / 880BTG & MTBT2026</span> cho các môn <span className="text-blue-400 font-bold">Toán</span>, <span className="text-cyan-400 font-bold">Vật lý</span>, <span className="text-teal-400 font-bold">Hóa học</span>, <span className="text-emerald-400 font-bold">Sinh học</span>. Giúp học sinh xử lý trắc nghiệm tốc độ cao, tiết kiệm thời gian làm bài thi Tốt nghiệp THPT & Đánh giá năng lực!
          </p>

          {/* Subject Selector Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(['Tất cả', 'Toán', 'Vật lý', 'Hóa học', 'Sinh học'] as const).map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                  selectedSubject === subject
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {subject === 'Tất cả' && '🌐 Tất cả 4 Môn'}
                {subject === 'Toán' && '📐 Môn Toán'}
                {subject === 'Vật lý' && '⚡ Môn Vật Lý'}
                {subject === 'Hóa học' && '🧪 Môn Hóa Học'}
                {subject === 'Sinh học' && '🧬 Môn Sinh Học'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm tuyệt kỹ bấm máy (VD: tích có hướng, số phức, RLC, pH, di truyền...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          Hiển thị {filteredSkills.length} tuyệt kỹ
        </span>
      </div>

      {/* Skills List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSkills.map((skill) => (
          <div 
            key={skill.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden hover:border-slate-700 transition-all"
          >
            {/* Top Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  skill.subject === 'Toán' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                  skill.subject === 'Vật lý' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                  skill.subject === 'Hóa học' ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {skill.subject}
                </span>
                <h3 className="text-lg font-black text-white">{skill.title}</h3>
              </div>

              <button
                onClick={() => handleCopyKeys(skill)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center space-x-1.5 self-start sm:self-auto"
              >
                {copiedId === skill.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedId === skill.id ? 'Đã chép chuỗi phím!' : 'Sao chép phím'}</span>
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              <MathView content={skill.description} />
            </div>

            {/* Key Sequence Badges */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cú pháp Phím Bấm Casio / MTBT:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {skill.casioKeys.map((key, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-amber-300 font-mono font-black text-xs rounded-lg shadow-xs hover:border-amber-500 transition-colors"
                  >
                    [{key}]
                  </span>
                ))}
              </div>
            </div>

            {/* Example Problem & Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Example */}
              <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-2xl space-y-2">
                <span className="font-bold text-indigo-300 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Bài toán Thực tế tiêu biểu:</span>
                </span>
                <div className="text-slate-300 leading-relaxed">
                  <MathView content={skill.exampleProblem} />
                </div>
                <div className="pt-2 border-t border-indigo-900/40 text-emerald-400 font-mono font-bold">
                  <MathView inline content={`**Kết quả:** ${skill.resultFormula}`} />
                </div>
              </div>

              {/* Step by step */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                  <span>Quy trình Bấm phím chi tiết:</span>
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {skill.stepByStep.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <MathView content={step} />
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Pro Tip & Common Errors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300 block">Mẹo tính tốc độ:</span>
                  <p className="text-slate-300 mt-0.5">{skill.proTip}</p>
                </div>
              </div>

              <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-xl flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300 block">Lỗi sai hay gặp:</span>
                  <p className="text-slate-300 mt-0.5">{skill.commonError}</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

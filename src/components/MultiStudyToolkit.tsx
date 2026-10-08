import React, { useState } from 'react';
import { 
  GraduationCap, 
  LineChart, 
  BookOpen, 
  Atom, 
  Scale, 
  Sparkles, 
  Search, 
  HelpCircle,
  FileCheck,
  Calculator,
  Compass,
  ArrowRight
} from 'lucide-react';
import { FunctionGrapher } from './FunctionGrapher';
import { MathView } from './MathView';

type MainTab = 'math' | 'chemistry' | 'physics';
type MathSubTab = 'grapher' | 'formulas';

interface MathFormulaItem {
  id: string;
  grade: string;
  topic: string;
  title: string;
  latex: string;
  note: string;
}

const MATH_FORMULA_ITEMS: MathFormulaItem[] = [
  // LỚP 12 - KNTT
  {
    id: 'f-12-1',
    grade: 'Lớp 12',
    topic: 'Khảo sát hàm số',
    title: 'Đạo hàm các hàm số cơ bản',
    latex: '$$(x^n)\' = n \\cdot x^{n-1}, \\quad (\\sin x)\' = \\cos x, \\quad (\\cos x)\' = -\\sin x, \\quad (e^x)\' = e^x, \\quad (\\ln x)\' = \\frac{1}{x}$$',
    note: 'Quy tắc tính đạo hàm hàm hợp: $(f(u))\' = u\' \\cdot f\'(u)$.'
  },
  {
    id: 'f-12-2',
    grade: 'Lớp 12',
    topic: 'Khảo sát hàm số',
    title: 'Đường tiệm cận xiên (SGK GDPT 2018 mới)',
    latex: '$$y = ax + b \\quad \\text{với} \\quad a = \\lim_{x \\to \\pm\\infty} \\frac{f(x)}{x}, \\quad b = \\lim_{x \\to \\pm\\infty} [f(x) - ax]$$',
    note: 'Đồ thị hàm phân thức bậc 2 trên bậc 1: $y = \\frac{P(x)}{Q(x)} = mx + n + \\frac{k}{Q(x)}$. Tiệm cận xiên là $y = mx + n$.'
  },
  {
    id: 'f-12-3',
    grade: 'Lớp 12',
    topic: 'Nguyên hàm & Tích phân',
    title: 'Công thức nguyên hàm cơ bản',
    latex: '$$\\int x^\\alpha dx = \\frac{x^{\\alpha + 1}}{\\alpha + 1} + C \\; (\\alpha \\neq -1), \\quad \\int \\frac{1}{x} dx = \\ln|x| + C, \\quad \\int e^x dx = e^x + C$$',
    note: 'Tích phân từng phần: $\\int u \\, dv = u \\cdot v - \\int v \\, du$.'
  },
  {
    id: 'f-12-4',
    grade: 'Lớp 12',
    topic: 'Hình học Oxyz',
    title: 'Phương trình mặt cầu & Mặt phẳng',
    latex: '$$(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2, \\quad Ax + By + Cz + D = 0$$',
    note: 'Vectơ pháp tuyến của mặt phẳng là $\\vec{n} = (A; B; C)$.'
  },

  // LỚP 11 - KNTT
  {
    id: 'f-11-1',
    grade: 'Lớp 11',
    topic: 'Lượng giác',
    title: 'Công thức cộng và nhân đôi',
    latex: '$$\\sin(a \\pm b) = \\sin a \\cos b \\pm \\cos a \\sin b, \\quad \\cos(a \\pm b) = \\cos a \\cos b \\mp \\sin a \\sin b, \\quad \\sin 2a = 2\\sin a \\cos a$$',
    note: 'Công thức hạ bậc: $\\cos^2 a = \\frac{1 + \\cos 2a}{2}, \\quad \\sin^2 a = \\frac{1 - \\cos 2a}{2}$.'
  },
  {
    id: 'f-11-2',
    grade: 'Lớp 11',
    topic: 'Mũ & Logarit',
    title: 'Các tính chất trọng tâm của Logarit',
    latex: '$$\\log_a(x \\cdot y) = \\log_a x + \\log_a y, \\quad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y, \\quad \\log_a(x^\\alpha) = \\alpha \\log_a x$$',
    note: 'Đổi cơ số: $\\log_a b = \\frac{\\log_c b}{\\log_c a}$ ($a, c > 0; a, c \\neq 1; b > 0$).'
  },

  // LỚP 10 - KNTT
  {
    id: 'f-10-1',
    grade: 'Lớp 10',
    topic: 'Hàm số bậc hai',
    title: 'Tọa độ đỉnh Parabol & Trục đối xứng',
    latex: '$$I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right), \\quad \\text{Trục đối xứng: } x = -\\frac{b}{2a}$$',
    note: 'Định lí Vi-ét: $x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}$.'
  },
  {
    id: 'f-10-2',
    grade: 'Lớp 10',
    topic: 'Hệ thức lượng trong tam giác',
    title: 'Định lí Côsin & Định lí Sin',
    latex: '$$a^2 = b^2 + c^2 - 2bc \\cos A, \\quad \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$',
    note: 'Công thức diện tích tam giác Heron: $S = \\sqrt{p(p - a)(p - b)(p - c)}$.'
  },

  // CẤP 2 (LỚP 8, 9) - KNTT
  {
    id: 'f-9-1',
    grade: 'Lớp 9',
    topic: 'Hệ thức lượng tam giác vuông',
    title: 'Hệ thức lượng cơ bản',
    latex: '$$b^2 = a \\cdot b\', \\quad c^2 = a \\cdot c\', \\quad h^2 = b\' \\cdot c\', \\quad b \\cdot c = a \\cdot h, \\quad \\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$$',
    note: 'Áp dụng cho tam giác vuông với đường cao $h$ ứng với cạnh huyền $a$.'
  },
  {
    id: 'f-8-1',
    grade: 'Lớp 8',
    topic: 'Hằng đẳng thức đáng nhớ',
    title: '7 Hằng đẳng thức đại số',
    latex: '$$(a \\pm b)^2 = a^2 \\pm 2ab + b^2, \\quad a^2 - b^2 = (a - b)(a + b), \\quad (a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3$$',
    note: 'Hiệu và tổng hai lập phương: $a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$.'
  }
];

export function MultiStudyToolkit() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('math');
  const [mathSubTab, setMathSubTab] = useState<MathSubTab>('grapher');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('Tất cả');

  // Filter formulas
  const filteredFormulas = MATH_FORMULA_ITEMS.filter(item => {
    const matchGrade = selectedGradeFilter === 'Tất cả' || item.grade === selectedGradeFilter;
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Chuẩn sách giáo khoa Kết nối tri thức với cuộc sống
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Công cụ Học tập Đa năng
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Trợ thủ đắc lực cho học sinh và giáo viên: Khảo sát và vẽ đồ thị tương tác, tra cứu công thức Toán học, Bảng tuần hoàn và Sổ tay khoa học tự nhiên.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 self-start md:self-center">
            <div className="p-3 bg-white/20 rounded-xl text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="pr-2 text-xs">
              <p className="font-semibold text-white">Chương trình GDPT 2018</p>
              <p className="text-blue-200">Cấp 2 (THCS) & Cấp 3 (THPT)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveMainTab('math')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeMainTab === 'math'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>1. Công cụ Toán học (Toán KNTT)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('chemistry')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeMainTab === 'chemistry'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>2. Bảng tuần hoàn & Hóa học</span>
        </button>

        <button
          onClick={() => setActiveMainTab('physics')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeMainTab === 'physics'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>3. Sổ tay Vật lý & Quy đổi Đơn vị</span>
        </button>
      </div>

      {/* TAB 1: CÔNG CỤ TOÁN HỌC */}
      {activeMainTab === 'math' && (
        <div className="space-y-6">
          {/* Sub-nav for Math */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMathSubTab('grapher')}
                className={`pb-2.5 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  mathSubTab === 'grapher'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <LineChart className="w-4 h-4" />
                1. Công cụ vẽ đồ thị & khảo sát hàm số
              </button>

              <button
                onClick={() => setMathSubTab('formulas')}
                className={`pb-2.5 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  mathSubTab === 'formulas'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                2. Tra cứu công thức & định lí KNTT
              </button>
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Bám sát khung chương trình Bộ GD&ĐT
            </span>
          </div>

          {/* SubTab 1: Grapher & Function Survey */}
          {mathSubTab === 'grapher' && (
            <FunctionGrapher />
          )}

          {/* SubTab 2: Math Formulas Library */}
          {mathSubTab === 'formulas' && (
            <div className="space-y-5">
              {/* Filter and Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo chủ đề, tên công thức..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {['Tất cả', 'Lớp 12', 'Lớp 11', 'Lớp 10', 'Lớp 9', 'Lớp 8'].map((gr) => (
                    <button
                      key={gr}
                      onClick={() => setSelectedGradeFilter(gr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedGradeFilter === gr
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {gr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFormulas.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                          {item.grade} • {item.topic}
                        </span>
                        <FileCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-3">{item.title}</h4>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 overflow-x-auto">
                        <MathView content={item.latex} />
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                      <MathView inline content={`💡 **Ghi chú:** ${item.note}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BẢNG TUẦN HOÀN & HÓA HỌC */}
      {activeMainTab === 'chemistry' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Atom className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Bảng tuần hoàn các nguyên tố Hóa học (IUPAC - KNTT)</h3>
              <p className="text-xs text-slate-500">Chuẩn danh pháp quốc tế IUPAC theo chương trình giáo dục phổ thông 2018</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { z: 1, sym: 'H', name: 'Hydrogen', m: '1.008', group: 'Phi kim' },
              { z: 2, sym: 'He', name: 'Helium', m: '4.003', group: 'Khí hiếm' },
              { z: 3, sym: 'Li', name: 'Lithium', m: '6.941', group: 'Kim loại kiềm' },
              { z: 4, sym: 'Be', name: 'Beryllium', m: '9.012', group: 'Kiềm thổ' },
              { z: 5, sym: 'B', name: 'Boron', m: '10.81', group: 'Bán kim' },
              { z: 6, sym: 'C', name: 'Carbon', m: '12.011', group: 'Phi kim' },
              { z: 7, sym: 'N', name: 'Nitrogen', m: '14.007', group: 'Phi kim' },
              { z: 8, sym: 'O', name: 'Oxygen', m: '15.999', group: 'Phi kim' },
              { z: 9, sym: 'F', name: 'Fluorine', m: '18.998', group: 'Halogen' },
              { z: 10, sym: 'Ne', name: 'Neon', m: '20.180', group: 'Khí hiếm' },
              { z: 11, sym: 'Na', name: 'Sodium', m: '22.990', group: 'Kim loại kiềm' },
              { z: 12, sym: 'Mg', name: 'Magnesium', m: '24.305', group: 'Kiềm thổ' },
              { z: 13, sym: 'Al', name: 'Aluminium', m: '26.982', group: 'Kim loại' },
              { z: 14, sym: 'Si', name: 'Silicon', m: '28.085', group: 'Bán kim' },
              { z: 15, sym: 'P', name: 'Phosphorus', m: '30.974', group: 'Phi kim' },
              { z: 16, sym: 'S', name: 'Sulfur', m: '32.06', group: 'Phi kim' },
              { z: 17, sym: 'Cl', name: 'Chlorine', m: '35.45', group: 'Halogen' },
              { z: 18, sym: 'Ar', name: 'Argon', m: '39.948', group: 'Khí hiếm' },
              { z: 19, sym: 'K', name: 'Potassium', m: '39.098', group: 'Kim loại kiềm' },
              { z: 20, sym: 'Ca', name: 'Calcium', m: '40.078', group: 'Kiềm thổ' },
              { z: 26, sym: 'Fe', name: 'Iron', m: '55.845', group: 'Kim loại chuyển tiếp' },
              { z: 29, sym: 'Cu', name: 'Copper', m: '63.546', group: 'Kim loại chuyển tiếp' },
              { z: 30, sym: 'Zn', name: 'Zinc', m: '65.38', group: 'Kim loại chuyển tiếp' },
              { z: 47, sym: 'Ag', name: 'Silver', m: '107.87', group: 'Kim loại chuyển tiếp' },
            ].map(el => (
              <div 
                key={el.z}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="flex justify-between items-start text-xs text-slate-400 font-mono">
                  <span>Z = {el.z}</span>
                  <span>{el.m}</span>
                </div>
                <div className="my-1.5 text-center">
                  <span className="text-2xl font-black text-indigo-700 tracking-tight">{el.sym}</span>
                  <p className="text-xs font-semibold text-slate-700 truncate">{el.name}</p>
                </div>
                <div className="text-[10px] text-center px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium truncate">
                  {el.group}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SỔ TAY VẬT LÝ & ĐỔI ĐƠN VỊ */}
      {activeMainTab === 'physics' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Scale className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Hằng số Vật lý Thường dùng & Bảng Đổi Đơn vị Chuẩn SI</h3>
              <p className="text-xs text-slate-500">Tra cứu nhanh các hằng số nền tảng theo SGK Vật lí Kết nối tri thức</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
              <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Các Hằng số Vật lý Cốt lõi
              </h4>
              <div className="space-y-2 text-xs">
                <MathView content="- **Vận tốc ánh sáng trong chân không:** $c \approx 3 \cdot 10^8 \; \text{m/s}$" />
                <MathView content="- **Gia tốc trọng trường chuẩn:** $g \approx 9.8 \; \text{m/s}^2$ (hoặc $10 \; \text{m/s}^2$)" />
                <MathView content="- **Hằng số Planck:** $h \approx 6.626 \cdot 10^{-34} \; \text{J} \cdot \text{s}$" />
                <MathView content="- **Điện tích nguyên tố:** $e \approx 1.6 \cdot 10^{-19} \; \text{C}$" />
                <MathView content="- **Khối lượng electron:** $m_e \approx 9.1 \cdot 10^{-31} \; \text{kg}$" />
                <MathView content="- **Hằng số khí lí tưởng:** $R \approx 8.314 \; \text{J/(mol}\cdot\text{K)}$" />
                <MathView content="- **Số Avogadro:** $N_A \approx 6.022 \cdot 10^{23} \; \text{mol}^{-1}$" />
              </div>
            </div>

            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                Quy đổi Đơn vị Đo lường Thường gặp
              </h4>
              <div className="space-y-2 text-xs">
                <MathView content="- **Áp suất:** $1 \; \text{atm} = 1.013 \cdot 10^5 \; \text{Pa} = 760 \; \text{mmHg}$" />
                <MathView content="- **Năng lượng:** $1 \; \text{eV} = 1.6 \cdot 10^{-19} \; \text{J}, \quad 1 \; \text{kWh} = 3.6 \cdot 10^6 \; \text{J}$" />
                <MathView content="- **Góc:** $180^\circ = \pi \; \text{rad} \Rightarrow 1^\circ = \frac{\pi}{180} \; \text{rad}$" />
                <MathView content="- **Nhiệt độ tuyệt đối:** $T(\text{K}) = t(^\circ\text{C}) + 273.15$" />
                <MathView content="- **Khối lượng nguyên tử:** $1 \; \text{amu} \approx 1.6605 \cdot 10^{-27} \; \text{kg} \approx 931.5 \; \text{MeV}/c^2$" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

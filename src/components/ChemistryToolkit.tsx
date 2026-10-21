import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  RotateCcw, 
  Flame, 
  Beaker, 
  Droplet, 
  Layers, 
  BookOpen, 
  Calculator,
  Sliders
} from 'lucide-react';
import { MathView } from './MathView';

interface ChemicalElement {
  z: number;
  symbol: string;
  nameIupac: string;
  nameVi: string;
  mass: number;
  period: number;
  group: string;
  category: 'alkali' | 'alkaline_earth' | 'transition' | 'post_transition' | 'metalloid' | 'nonmetal' | 'noble_gas';
  electronConfig: string;
  electronegativity?: number;
}

const PERIODIC_ELEMENTS: ChemicalElement[] = [
  { z: 1, symbol: 'H', nameIupac: 'Hydrogen', nameVi: 'Hiđro', mass: 1.008, period: 1, group: '1A', category: 'nonmetal', electronConfig: '1s¹', electronegativity: 2.20 },
  { z: 2, symbol: 'He', nameIupac: 'Helium', nameVi: 'Heli', mass: 4.003, period: 1, group: '8A', category: 'noble_gas', electronConfig: '1s²', electronegativity: undefined },
  { z: 3, symbol: 'Li', nameIupac: 'Lithium', nameVi: 'Liti', mass: 6.94, period: 2, group: '1A', category: 'alkali', electronConfig: '[He] 2s¹', electronegativity: 0.98 },
  { z: 4, symbol: 'Be', nameIupac: 'Beryllium', nameVi: 'Beri', mass: 9.012, period: 2, group: '2A', category: 'alkaline_earth', electronConfig: '[He] 2s²', electronegativity: 1.57 },
  { z: 5, symbol: 'B', nameIupac: 'Boron', nameVi: 'Bo', mass: 10.81, period: 2, group: '3A', category: 'metalloid', electronConfig: '[He] 2s² 2p¹', electronegativity: 2.04 },
  { z: 6, symbol: 'C', nameIupac: 'Carbon', nameVi: 'Cacbon', mass: 12.011, period: 2, group: '4A', category: 'nonmetal', electronConfig: '[He] 2s² 2p²', electronegativity: 2.55 },
  { z: 7, symbol: 'N', nameIupac: 'Nitrogen', nameVi: 'Nitơ', mass: 14.007, period: 2, group: '5A', category: 'nonmetal', electronConfig: '[He] 2s² 2p³', electronegativity: 3.04 },
  { z: 8, symbol: 'O', nameIupac: 'Oxygen', nameVi: 'Oxi', mass: 15.999, period: 2, group: '6A', category: 'nonmetal', electronConfig: '[He] 2s² 2p⁴', electronegativity: 3.44 },
  { z: 9, symbol: 'F', nameIupac: 'Fluorine', nameVi: 'Flo', mass: 18.998, period: 2, group: '7A', category: 'nonmetal', electronConfig: '[He] 2s² 2p⁵', electronegativity: 3.98 },
  { z: 10, symbol: 'Ne', nameIupac: 'Neon', nameVi: 'Neon', mass: 20.180, period: 2, group: '8A', category: 'noble_gas', electronConfig: '[He] 2s² 2p⁶', electronegativity: undefined },
  { z: 11, symbol: 'Na', nameIupac: 'Sodium', nameVi: 'Natri', mass: 22.990, period: 3, group: '1A', category: 'alkali', electronConfig: '[Ne] 3s¹', electronegativity: 0.93 },
  { z: 12, symbol: 'Mg', nameIupac: 'Magnesium', nameVi: 'Magie', mass: 24.305, period: 3, group: '2A', category: 'alkaline_earth', electronConfig: '[Ne] 3s²', electronegativity: 1.31 },
  { z: 13, symbol: 'Al', nameIupac: 'Aluminium', nameVi: 'Nhôm', mass: 26.982, period: 3, group: '3A', category: 'post_transition', electronConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61 },
  { z: 14, symbol: 'Si', nameIupac: 'Silicon', nameVi: 'Silic', mass: 28.085, period: 3, group: '4A', category: 'metalloid', electronConfig: '[Ne] 3s² 3p²', electronegativity: 1.90 },
  { z: 15, symbol: 'P', nameIupac: 'Phosphorus', nameVi: 'Photpho', mass: 30.974, period: 3, group: '5A', category: 'nonmetal', electronConfig: '[Ne] 3s² 3p³', electronegativity: 2.19 },
  { z: 16, symbol: 'S', nameIupac: 'Sulfur', nameVi: 'Lưu huỳnh', mass: 32.06, period: 3, group: '6A', category: 'nonmetal', electronConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58 },
  { z: 17, symbol: 'Cl', nameIupac: 'Chlorine', nameVi: 'Clo', mass: 35.45, period: 3, group: '7A', category: 'nonmetal', electronConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16 },
  { z: 18, symbol: 'Ar', nameIupac: 'Argon', nameVi: 'Agon', mass: 39.948, period: 3, group: '8A', category: 'noble_gas', electronConfig: '[Ne] 3s² 3p⁶', electronegativity: undefined },
  { z: 19, symbol: 'K', nameIupac: 'Potassium', nameVi: 'Kali', mass: 39.098, period: 4, group: '1A', category: 'alkali', electronConfig: '[Ar] 4s¹', electronegativity: 0.82 },
  { z: 20, symbol: 'Ca', nameIupac: 'Calcium', nameVi: 'Canxi', mass: 40.078, period: 4, group: '2A', category: 'alkaline_earth', electronConfig: '[Ar] 4s²', electronegativity: 1.00 },
  { z: 26, symbol: 'Fe', nameIupac: 'Iron', nameVi: 'Sắt', mass: 55.845, period: 4, group: '8B', category: 'transition', electronConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83 },
  { z: 29, symbol: 'Cu', nameIupac: 'Copper', nameVi: 'Đồng', mass: 63.546, period: 4, group: '1B', category: 'transition', electronConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90 },
  { z: 30, symbol: 'Zn', nameIupac: 'Zinc', nameVi: 'Kẽm', mass: 65.38, period: 4, group: '2B', category: 'transition', electronConfig: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65 },
  { z: 35, symbol: 'Br', nameIupac: 'Bromine', nameVi: 'Brom', mass: 79.904, period: 4, group: '7A', category: 'nonmetal', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96 },
  { z: 47, symbol: 'Ag', nameIupac: 'Silver', nameVi: 'Bạc', mass: 107.87, period: 5, group: '1B', category: 'transition', electronConfig: '[Kr] 4d¹⁰ 5s¹', electronegativity: 1.93 },
  { z: 53, symbol: 'I', nameIupac: 'Iodine', nameVi: 'Iot', mass: 126.90, period: 5, group: '7A', category: 'nonmetal', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵', electronegativity: 2.66 },
  { z: 79, symbol: 'Au', nameIupac: 'Gold', nameVi: 'Vàng', mass: 196.97, period: 6, group: '1B', category: 'transition', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronegativity: 2.54 },
  { z: 80, symbol: 'Hg', nameIupac: 'Mercury', nameVi: 'Thủy ngân', mass: 200.59, period: 6, group: '2B', category: 'transition', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronegativity: 2.00 }
];

export function ChemistryToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'periodic' | 'reactions' | 'nomenclature' | 'calculator'>('reactions');

  // --- SUBTAB 1: BẢNG TUẦN HOÀN ---
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(PERIODIC_ELEMENTS[10]); // Sodium
  const [elementSearch, setElementSearch] = useState('');

  const filteredElements = useMemo(() => {
    return PERIODIC_ELEMENTS.filter(e => 
      e.symbol.toLowerCase().includes(elementSearch.toLowerCase()) ||
      e.nameIupac.toLowerCase().includes(elementSearch.toLowerCase()) ||
      e.nameVi.toLowerCase().includes(elementSearch.toLowerCase()) ||
      e.z.toString() === elementSearch.trim()
    );
  }, [elementSearch]);

  // --- SUBTAB 2: CÂN BẰNG PHẢN ỨNG & MÔ PHỎNG THÍ NGHIỆM ---
  const reactionList = [
    {
      id: 'rx1',
      title: 'Kim loại tác dụng với acid sinh khí Hydrogen',
      equationDisplay: 'Zn + HCl -> ZnCl2 + H2',
      reactants: [
        { formula: 'Zn', correctCoeff: 1 },
        { formula: 'HCl', correctCoeff: 2 }
      ],
      products: [
        { formula: 'ZnCl₂', correctCoeff: 1 },
        { formula: 'H₂', correctCoeff: 1 }
      ],
      phenomenon: 'Kim loại kẽm (Zinc) tan dần, có bọt khí không màu không mùi (Hydrogen) sủi mạnh thoát ra khỏi bề mặt dung dịch. Ống nghiệm ấm lên (phản ứng tỏa nhiệt).',
      visualType: 'gas_bubbles',
      color: '#3b82f6'
    },
    {
      id: 'rx2',
      title: 'Phản ứng tạo kết tủa trắng đặc trưng của gốc Sulfate',
      equationDisplay: 'BaCl2 + Na2SO4 -> BaSO4 + NaCl',
      reactants: [
        { formula: 'BaCl₂', correctCoeff: 1 },
        { formula: 'Na₂SO₄', correctCoeff: 1 }
      ],
      products: [
        { formula: 'BaSO₄', correctCoeff: 1 },
        { formula: 'NaCl', correctCoeff: 2 }
      ],
      phenomenon: 'Xuất hiện ngay kết tủa màu trắng đục của Barium sulfate (BaSO₄), không tan trong các acid mạnh như HCl hay HNO₃.',
      visualType: 'precipitate_white',
      color: '#e2e8f0'
    },
    {
      id: 'rx3',
      title: 'Đốt cháy kim loại Iron trong khí Chlorine',
      equationDisplay: 'Fe + Cl2 -> FeCl3',
      reactants: [
        { formula: 'Fe', correctCoeff: 2 },
        { formula: 'Cl₂', correctCoeff: 3 }
      ],
      products: [
        { formula: 'FeCl₃', correctCoeff: 2 }
      ],
      phenomenon: 'Dây sắt (Iron) nung đỏ cháy sáng chói trong bình chứa khí Chlorine màu vàng lục, tạo ra khói dày đặc màu nâu đỏ của hạt Iron(III) chloride (FeCl₃).',
      visualType: 'flame_brown',
      color: '#ea580c'
    },
    {
      id: 'rx4',
      title: 'Trung hòa Acid - Base và chất chỉ thị màu',
      equationDisplay: 'NaOH + HCl -> NaCl + H2O',
      reactants: [
        { formula: 'NaOH', correctCoeff: 1 },
        { formula: 'HCl', correctCoeff: 1 }
      ],
      products: [
        { formula: 'NaCl', correctCoeff: 1 },
        { formula: 'H₂O', correctCoeff: 1 }
      ],
      phenomenon: 'Dung dịch chứa Phenolphthalein từ màu hồng tươi dần chuyển sang không màu khi vừa đạt điểm tương đương trung hòa (pH = 7).',
      visualType: 'indicator_color',
      color: '#ec4899'
    }
  ];

  const [selectedRxId, setSelectedRxId] = useState(reactionList[0].id);
  const currentRx = reactionList.find(r => r.id === selectedRxId) || reactionList[0];

  // User input coefficients: [r1, r2, p1, p2]
  const [userCoeffs, setUserCoeffs] = useState<Record<string, number>>({
    'r0': 1, 'r1': 1, 'p0': 1, 'p1': 1
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCheckBalance = () => {
    let isCorrect = true;
    currentRx.reactants.forEach((r, idx) => {
      const val = userCoeffs[`r${idx}`] || 1;
      if (val !== r.correctCoeff) isCorrect = false;
    });
    currentRx.products.forEach((p, idx) => {
      const val = userCoeffs[`p${idx}`] || 1;
      if (val !== p.correctCoeff) isCorrect = false;
    });

    if (isCorrect) {
      setFeedback('Chính xác tuyệt đối! Hệ số cân bằng của phản ứng hoàn toàn chuẩn.');
    } else {
      setFeedback('Chưa chuẩn xác, số nguyên tử hai vế chưa bằng nhau. Cậu hãy kiểm tra lại nhé!');
    }
  };

  const handleAutoBalance = () => {
    const updated: Record<string, number> = {};
    currentRx.reactants.forEach((r, idx) => {
      updated[`r${idx}`] = r.correctCoeff;
    });
    currentRx.products.forEach((p, idx) => {
      updated[`p${idx}`] = p.correctCoeff;
    });
    setUserCoeffs(updated);
    setFeedback('Đã tự động cân bằng hệ số chính xác.');
  };

  // --- SUBTAB 3: TỪ ĐIỂN DANH PHÁP IUPAC GDPT 2018 ---
  const [iupacSearch, setIupacSearch] = useState('');
  const iupacDictionary = [
    { formula: 'Fe', oldName: 'Sắt', iupacName: 'Iron', type: 'Đơn chất kim loại' },
    { formula: 'Cu', oldName: 'Đồng', iupacName: 'Copper', type: 'Đơn chất kim loại' },
    { formula: 'Zn', oldName: 'Kẽm', iupacName: 'Zinc', type: 'Đơn chất kim loại' },
    { formula: 'Al', oldName: 'Nhôm', iupacName: 'Aluminium', type: 'Đơn chất kim loại' },
    { formula: 'Ag', oldName: 'Bạc', iupacName: 'Silver', type: 'Đơn chất kim loại' },
    { formula: 'Au', oldName: 'Vàng', iupacName: 'Gold', type: 'Đơn chất kim loại' },
    { formula: 'NaOH', oldName: 'Xút ăn da, Natri hiđroxit', iupacName: 'Sodium hydroxide', type: 'Base kiềm' },
    { formula: 'Ca(OH)2', oldName: 'Nước vôi trong, Canxi hiđroxit', iupacName: 'Calcium hydroxide', type: 'Base' },
    { formula: 'CuSO4', oldName: 'Đồng(II) sunfat', iupacName: 'Copper(II) sulfate', type: 'Muối vô cơ' },
    { formula: 'Fe2O3', oldName: 'Sắt(III) oxit', iupacName: 'Iron(III) oxide', type: 'Oxit base' },
    { formula: 'H2SO4', oldName: 'Axit sunfuric', iupacName: 'Sulfuric acid', type: 'Acid mạnh' },
    { formula: 'HCl', oldName: 'Axit clohiđric', iupacName: 'Hydrochloric acid', type: 'Acid mạnh' },
    { formula: 'HNO3', oldName: 'Axit nitric', iupacName: 'Nitric acid', type: 'Acid mạnh' },
    { formula: 'CH3COOH', oldName: 'Axit axetic (Giấm ăn)', iupacName: 'Ethanoic acid / Acetic acid', type: 'Carboxylic acid' },
    { formula: 'C2H5OH', oldName: 'Rượu etylic, cồn', iupacName: 'Ethanol', type: 'Alcohol' },
    { formula: 'C6H12O6', oldName: 'Đường glucozơ', iupacName: 'Glucose', type: 'Carbohydrate' },
    { formula: 'C12H22O11', oldName: 'Đường mía, saccarozơ', iupacName: 'Sucrose', type: 'Carbohydrate' }
  ];

  const filteredIupac = useMemo(() => {
    return iupacDictionary.filter(item => 
      item.formula.toLowerCase().includes(iupacSearch.toLowerCase()) ||
      item.oldName.toLowerCase().includes(iupacSearch.toLowerCase()) ||
      item.iupacName.toLowerCase().includes(iupacSearch.toLowerCase())
    );
  }, [iupacSearch]);

  // --- SUBTAB 4: MÁY TÍNH HÓA HỌC GDPT 2018 ---
  const [massInput, setMassInput] = useState<number>(5.4); // gam
  const [molWeightInput, setMolWeightInput] = useState<number>(27); // M (g/mol) nhôm Al
  const [gasVolumeInput, setGasVolumeInput] = useState<number>(2.479); // Lít đkc (25°C, 1 bar)

  // Tính toán
  const calculatedMolFromMass = molWeightInput > 0 ? (massInput / molWeightInput) : 0;
  const calculatedMolFromGas = gasVolumeInput > 0 ? (gasVolumeInput / 24.79) : 0; // ĐKC chuẩn mới là 24.79L thay vì 22.4L

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <FlaskConical className="w-4 h-4 text-emerald-200" />
            <span>Chương trình GDPT 2018 • Hóa học 10, 11, 12</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bộ công cụ Hóa học THPT Toàn diện
          </h2>
          <p className="text-sm md:text-base text-emerald-100 max-w-2xl leading-relaxed">
            Bảng tuần hoàn 118 nguyên tố, cân bằng phản ứng kèm mô phỏng thí nghiệm sinh động, từ điển danh pháp IUPAC quốc tế mới.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('reactions')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'reactions'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Beaker className="w-4 h-4" />
          <span>Cân bằng phản ứng & Thí nghiệm</span>
        </button>

        <button
          onClick={() => setActiveSubTab('periodic')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'periodic'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Bảng tuần hoàn Nguyên tố (118)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('nomenclature')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'nomenclature'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Từ điển Danh pháp IUPAC Mới</span>
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'calculator'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Máy tính Hóa học chuẩn ĐKC</span>
        </button>
      </div>

      {/* --- SUBTAB: CÂN BẰNG PHẢN ỨNG & MÔ PHỎNG THÍ NGHIỆM --- */}
      {activeSubTab === 'reactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reaction Selector & Balancing Inputs */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Chọn phương trình phản ứng hóa học thí nghiệm:
              </label>
              <select
                value={selectedRxId}
                onChange={(e) => {
                  setSelectedRxId(e.target.value);
                  setFeedback(null);
                  setUserCoeffs({ 'r0': 1, 'r1': 1, 'p0': 1, 'p1': 1 });
                }}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
              >
                {reactionList.map(r => (
                  <option key={r.id} value={r.id}>{r.title} ({r.equationDisplay})</option>
                ))}
              </select>
            </div>

            {/* Interactive Equation Balancing Bar */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <span className="text-xs font-semibold text-slate-500">
                Nhập hệ số nguyên tối giản để cân bằng phương trình:
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg font-bold font-mono">
                {/* Reactants */}
                {currentRx.reactants.map((r, idx) => (
                  <React.Fragment key={`r-${idx}`}>
                    {idx > 0 && <span className="text-slate-400">+</span>}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                      <input 
                        type="number" 
                        min={1} 
                        max={20}
                        value={userCoeffs[`r${idx}`] ?? 1}
                        onChange={(e) => setUserCoeffs(prev => ({ ...prev, [`r${idx}`]: parseInt(e.target.value) || 1 }))}
                        className="w-10 text-center text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 rounded-lg py-1 border border-emerald-300 dark:border-emerald-700 outline-none"
                      />
                      <span className="text-slate-800 dark:text-slate-100">{r.formula}</span>
                    </div>
                  </React.Fragment>
                ))}

                <span className="text-emerald-600 font-bold px-2">➔</span>

                {/* Products */}
                {currentRx.products.map((p, idx) => (
                  <React.Fragment key={`p-${idx}`}>
                    {idx > 0 && <span className="text-slate-400">+</span>}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                      <input 
                        type="number" 
                        min={1} 
                        max={20}
                        value={userCoeffs[`p${idx}`] ?? 1}
                        onChange={(e) => setUserCoeffs(prev => ({ ...prev, [`p${idx}`]: parseInt(e.target.value) || 1 }))}
                        className="w-10 text-center text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 rounded-lg py-1 border border-emerald-300 dark:border-emerald-700 outline-none"
                      />
                      <span className="text-slate-800 dark:text-slate-100">{p.formula}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleCheckBalance}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Kiểm tra cân bằng</span>
                </button>
                <button
                  onClick={handleAutoBalance}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Tự động cân bằng</span>
                </button>
              </div>

              {feedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  feedback.includes('Chính xác') 
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300'
                }`}>
                  {feedback.includes('Chính xác') ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                  <span>{feedback}</span>
                </div>
              )}
            </div>

            {/* Phenomenon explanation */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Hiện tượng quan sát trong phòng thí nghiệm:
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 leading-relaxed">
                {currentRx.phenomenon}
              </p>
            </div>
          </div>

          {/* Virtual Lab Visual Animation Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Mô phỏng Thí nghiệm Ảo</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                  Trực quan hóa
                </span>
              </div>

              {/* Animated Test Tube / Beaker SVG */}
              <div className="my-6 w-full h-56 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                {currentRx.visualType === 'gas_bubbles' && (
                  <div className="relative w-28 h-44 border-4 border-slate-600 border-t-0 rounded-b-3xl bg-slate-800/40 overflow-hidden flex flex-col justify-end p-2">
                    <div className="w-full h-24 bg-blue-500/30 rounded-b-2xl relative">
                      {/* Zinc pellet */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-400 rounded-sm"></div>
                      {/* Bubbles */}
                      <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-white animate-ping"></div>
                      <div className="absolute bottom-10 left-12 w-2.5 h-2.5 rounded-full bg-white animate-bounce"></div>
                      <div className="absolute bottom-14 left-8 w-3 h-3 rounded-full bg-white/80 animate-pulse"></div>
                    </div>
                  </div>
                )}

                {currentRx.visualType === 'precipitate_white' && (
                  <div className="relative w-32 h-44 border-4 border-slate-600 border-t-0 rounded-b-3xl bg-slate-800/40 overflow-hidden flex flex-col justify-end p-2">
                    <div className="w-full h-28 bg-emerald-500/20 rounded-b-2xl relative overflow-hidden">
                      {/* Precipitate layer */}
                      <div className="absolute bottom-0 inset-x-0 h-10 bg-white/90 rounded-b-xl shadow-lg flex items-center justify-center text-[10px] text-slate-800 font-bold">
                        BaSO₄ ↓
                      </div>
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-xs"></div>
                    </div>
                  </div>
                )}

                {currentRx.visualType === 'flame_brown' && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-16 h-28 bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-200 rounded-full blur-xs animate-pulse opacity-90"></div>
                    <span className="text-xs text-amber-200 font-bold mt-2">Khói nâu đỏ FeCl₃</span>
                  </div>
                )}

                {currentRx.visualType === 'indicator_color' && (
                  <div className="relative w-28 h-44 border-4 border-slate-600 border-t-0 rounded-b-3xl bg-slate-800/40 overflow-hidden flex flex-col justify-end p-2">
                    <div className="w-full h-28 bg-gradient-to-t from-pink-500/50 to-transparent rounded-b-2xl flex items-center justify-center text-xs text-pink-200 font-bold">
                      pH = 7 (Trung hòa)
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              💡 Học sinh có thể thay đổi các phản ứng khác nhau từ danh sách để so sánh cơ chế thí nghiệm và các hiện tượng vật lý - hóa học tương ứng.
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: BẢNG TUẦN HOÀN 118 NGUYÊN TỐ --- */}
      {activeSubTab === 'periodic' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm theo ký hiệu (Na, Fe), tên (Iron), số Z (26)..."
                value={elementSearch}
                onChange={(e) => setElementSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="px-2 py-1 rounded bg-amber-100 text-amber-800">Kim loại kiềm (1A)</span>
              <span className="px-2 py-1 rounded bg-orange-100 text-orange-800">Kiềm thổ (2A)</span>
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">Chuyển tiếp</span>
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800">Phi kim</span>
              <span className="px-2 py-1 rounded bg-purple-100 text-purple-800">Khí hiếm (8A)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Elements Grid */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
                {filteredElements.map(el => {
                  const isSelected = selectedElement.z === el.z;
                  let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
                  if (el.category === 'alkali') bg = 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300';
                  else if (el.category === 'alkaline_earth') bg = 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200 border-orange-300';
                  else if (el.category === 'transition') bg = 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border-blue-300';
                  else if (el.category === 'nonmetal') bg = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300';
                  else if (el.category === 'noble_gas') bg = 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border-purple-300';

                  return (
                    <button
                      key={el.z}
                      onClick={() => setSelectedElement(el)}
                      className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-between aspect-square relative ${bg} ${
                        isSelected ? 'ring-3 ring-emerald-500 scale-105 shadow-md z-10' : 'hover:scale-102 opacity-90 hover:opacity-100'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold text-left text-slate-500">{el.z}</span>
                      <span className="text-xl font-black font-mono">{el.symbol}</span>
                      <span className="text-[9px] truncate w-full font-medium">{el.nameIupac}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Element Detail Card */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-950 rounded-2xl border border-emerald-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-emerald-600">Số hiệu Z = {selectedElement.z}</span>
                <h3 className="text-5xl font-black font-mono text-slate-800 dark:text-slate-100 my-2">
                  {selectedElement.symbol}
                </h3>
                <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                  {selectedElement.nameIupac}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tên tiếng Việt cũ: {selectedElement.nameVi}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                  <span className="text-slate-500">Nguyên tử khối:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedElement.mass} amu</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                  <span className="text-slate-500">Chu kỳ & Nhóm:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">Chu kỳ {selectedElement.period} • Nhóm {selectedElement.group}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                  <span className="text-slate-500">Cấu hình electron:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedElement.electronConfig}</span>
                </div>
                {selectedElement.electronegativity && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                    <span className="text-slate-500">Độ âm điện (Pauling):</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedElement.electronegativity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: DANH PHÁP IUPAC MỚI --- */}
      {activeSubTab === 'nomenclature' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tra cứu tên mới (Copper, Iron), tên cũ (Đồng, Sắt) hoặc công thức hóa học (CuSO4)..."
              value={iupacSearch}
              onChange={(e) => setIupacSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <th className="p-4 font-bold">Công thức hóa học</th>
                    <th className="p-4 font-bold">Tên chuẩn IUPAC (GDPT 2018)</th>
                    <th className="p-4 font-bold">Tên tiếng Việt cũ</th>
                    <th className="p-4 font-bold">Phân loại hợp chất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredIupac.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.formula}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{item.iupacName}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{item.oldName}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: MÁY TÍNH HÓA HỌC CHUẨN ĐKC --- */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Khối lượng sang Mol */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Chuyển đổi Khối lượng $m$ ➔ Số mol $n$</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Khối lượng chất $m$ (gam):</label>
                <input 
                  type="number"
                  value={massInput}
                  onChange={(e) => setMassInput(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Khối lượng mol $M$ (g/mol):</label>
                <input 
                  type="number"
                  value={molWeightInput}
                  onChange={(e) => setMolWeightInput(parseFloat(e.target.value) || 1)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono outline-none"
                />
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  <MathView content="Số mol tính được ($n = \frac{m}{M}$):" />
                </div>
                <p className="text-2xl font-black font-mono text-emerald-600 mt-1">
                  {calculatedMolFromMass.toFixed(4)} mol
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Thể tích khí ĐKC sang Mol */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-teal-600" />
              <span>Thể tích khí ở ĐKC (25°C, 1 bar) ➔ Số mol $n$</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Thể tích khí $V$ (Lít):</label>
                <input 
                  type="number"
                  value={gasVolumeInput}
                  onChange={(e) => setGasVolumeInput(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500 leading-relaxed">
                <MathView content="💡 **Chuẩn SGK 2018:** $1\\text{ mol}$ khí ở điều kiện chuẩn ($25^\\circ\\text{C}, 1\\text{ bar}$) chiếm thể tích là $24{,}79\\text{ Lít}$ (thay vì $22{,}4\\text{ Lít}$ của chương trình cũ)." />
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/60 text-center">
                <div className="text-xs text-teal-800 dark:text-teal-300 font-medium">
                  <MathView content="Số mol khí tính được ($n = \\frac{V}{24{,}79}$):" />
                </div>
                <p className="text-2xl font-black font-mono text-teal-600 mt-1">
                  {calculatedMolFromGas.toFixed(4)} mol
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

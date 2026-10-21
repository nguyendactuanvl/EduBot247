import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FlaskConical, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Beaker, 
  Layers, 
  BookOpen, 
  Plus, 
  ChevronRight, 
  Atom, 
  Box, 
  ShieldCheck, 
  Flame, 
  Play, 
  Pause,
  Award,
  Check,
  X
} from 'lucide-react';
import { MathView } from './MathView';
import { Molecule3DViewer } from './Molecule3DViewer';
import { 
  ALL_118_ELEMENTS, 
  ChemicalElement, 
  CATEGORY_INFO, 
  getElementByZ 
} from '../data/periodicTableData';
import { 
  POPULAR_COMPOUNDS, 
  VIRTUAL_REACTIONS, 
  ChemicalCompound, 
  VirtualReaction 
} from '../data/chemistryReactionsData';
import { TrueFalseQuestion } from '../types';

export function ChemistryToolkit() {
  const [activeTab, setActiveTab] = useState<'molecules3d' | 'periodic' | 'builder' | 'reactions' | 'tf_quiz' | 'curriculum'>('molecules3d');
  const [selected3DMoleculeId, setSelected3DMoleculeId] = useState<string>('h2o');

  // Scope & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(getElementByZ(8));
  const [tableMode, setTableMode] = useState<'standard' | 'block' | 'state' | 'electronegativity'>('standard');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // --- Drag & Drop Octet Rule Compound Builder State ---
  const [draggedElements, setDraggedElements] = useState<Record<string, number>>({});
  const [synthesizedCompound, setSynthesizedCompound] = useState<ChemicalCompound | null>(null);
  const [octetWarning, setOctetWarning] = useState<string | null>(null);

  // --- Virtual Lab Reactions State ---
  const [selectedReaction, setSelectedReaction] = useState<VirtualReaction>(VIRTUAL_REACTIONS[0]);
  const [reactionProgress, setReactionProgress] = useState(0);
  const [isReactionRunning, setIsReactionRunning] = useState(false);

  // Filter elements for periodic table
  const filteredElements = useMemo(() => {
    return ALL_118_ELEMENTS.filter(e => {
      const matchSearch = searchQuery.trim() === '' || 
        e.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.nameIupac.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.z.toString() === searchQuery.trim();
      const matchCategory = categoryFilter === 'all' || e.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Handle Drag & Drop Compound Builder Synthesis with Octet Rule Check
  const handleAddElementToBuilder = (symbol: string) => {
    setDraggedElements(prev => {
      const newCount = (prev[symbol] || 0) + 1;
      const updated = { ...prev, [symbol]: newCount };
      checkCompoundAndOctetMatch(updated);
      return updated;
    });
  };

  const handleRemoveElementFromBuilder = (symbol: string) => {
    setDraggedElements(prev => {
      const current = prev[symbol] || 0;
      if (current <= 1) {
        const { [symbol]: _, ...rest } = prev;
        checkCompoundAndOctetMatch(rest);
        return rest;
      }
      const updated = { ...prev, [symbol]: current - 1 };
      checkCompoundAndOctetMatch(updated);
      return updated;
    });
  };

  const handleClearBuilder = () => {
    setDraggedElements({});
    setSynthesizedCompound(null);
    setOctetWarning(null);
  };

  const checkCompoundAndOctetMatch = (elementsCount: Record<string, number>) => {
    const matched = POPULAR_COMPOUNDS.find(c => {
      const keys = Object.keys(c.elementsRequired);
      if (keys.length !== Object.keys(elementsCount).length) return false;
      return keys.every(k => c.elementsRequired[k] === elementsCount[k]);
    });

    if (matched) {
      setSynthesizedCompound(matched);
      setOctetWarning(null);
    } else {
      setSynthesizedCompound(null);
      // Check octet / valence heuristics
      const hCount = elementsCount['H'] || 0;
      const oCount = elementsCount['O'] || 0;
      const cCount = elementsCount['C'] || 0;
      const nCount = elementsCount['N'] || 0;

      if (hCount > 0 && oCount === 1 && hCount !== 2) {
        setOctetWarning('Chưa thỏa mãn quy tắc Bát tử (Octet)! Nguyên tử Oxi cần 2 liên kết với Hydrogen để tạo $H_2O$.');
      } else if (cCount === 1 && hCount > 0 && hCount !== 4) {
        setOctetWarning('Cacbon hóa trị IV cần đủ 4 nguyên tử H để tạo $CH_4$ no bền vững.');
      } else {
        setOctetWarning('Đang tiếp tục thêm nguyên tử... Đảm bảo tổng số electron hóa trị thỏa mãn vỏ 8 electron (Bát tử).');
      }
    }
  };

  // --- TRUE/FALSE 4-STATEMENT CHEMISTRY QUESTIONS (GDPT 2018) ---
  const chemistryTFQuestions: TrueFalseQuestion[] = [
    {
      id: 'tf-c1',
      subject: 'chemistry',
      topic: 'Cấu tạo Phân tử & Bát tử (Octet Rule)',
      scenario: 'Xem xét phân tử Nước ($H_2O$) và khí Amoniac ($NH_3$) trong điều kiện chuẩn (ĐKC). Nguyên tử Trung tâm $O$ và $N$ đều ở trạng thái lai hóa $sp^3$.',
      statements: [
        { id: 'a', text: 'Góc liên kết $H-O-H$ trong phân tử $H_2O$ bằng $104{,}5^\\circ$ do $2$ cặp electron chưa liên kết của Oxi đẩy mạnh.', isCorrect: true, explanation: 'Hai cặp electron tự do trên Oxi chiếm không gian lớn, đẩy hai liên kết O-H thu hẹp góc từ $109{,}5^\\circ$ xuống $104{,}5^\\circ$.' },
        { id: 'b', text: 'Phân tử $NH_3$ có dạng hình học tứ diện đều góc $109{,}5^\\circ$.', isCorrect: false, explanation: 'Phân tử $NH_3$ có dạng hình chóp tam giác với góc liên kết $H-N-H$ bằng $107^\\circ$.' },
        { id: 'c', text: 'Cả $H_2O$ và $NH_3$ đều là các phân tử phân cực mạnh do sự chênh lệch độ âm điện.', isCorrect: true, explanation: 'Độ âm điện $O (3{,}44)$ và $N (3{,}04)$ lớn hơn $H (2{,}20)$, liên kết cộng hóa trị có cực.' },
        { id: 'd', text: 'Giữa các phân tử $NH_3$ và $H_2O$ đều có khả năng tạo liên kết Hydrogen liên phân tử.', isCorrect: true, explanation: 'Nguyên tử $H$ liên kết trực tiếp với các nguyên tử có độ âm điện lớn ($O, N$) tạo liên kết Hydrogen.' }
      ]
    }
  ];

  const [tfUserSelections, setTfUserSelections] = useState<Record<string, Record<string, boolean>>>({});
  const [tfSubmitted, setTfSubmitted] = useState<Record<string, boolean>>({});

  const handleSelectTF = (qId: string, sId: 'a' | 'b' | 'c' | 'd', val: boolean) => {
    setTfUserSelections(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        [sId]: val
      }
    }));
  };

  const calculateTFScore = (qId: string) => {
    const q = chemistryTFQuestions.find(item => item.id === qId);
    if (!q) return 0;
    const userSel = tfUserSelections[qId] || {};

    let correctCount = 0;
    q.statements.forEach(s => {
      if (userSel[s.id] === s.isCorrect) {
        correctCount++;
      }
    });

    if (correctCount === 1) return 0.1;
    if (correctCount === 2) return 0.25;
    if (correctCount === 3) return 0.5;
    if (correctCount === 4) return 1.0;
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-indigo-950 rounded-3xl p-6 md:p-8 border border-teal-800/50 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 rounded-full text-xs font-bold text-teal-300 border border-teal-500/30">
              <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
              <span>Chương trình Hóa học THPT GDPT 2018 (Chuẩn IUPAC)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Bảng tuần hoàn 118 Nguyên tố & Thí nghiệm Ảo 3D</span>
            </h1>
            <MathView 
              content="Khám phá cấu trúc nguyên tử $3D$, obitan electron, mô phỏng phản ứng thí nghiệm ảo, phòng ghép chất Bát tử (Octet Rule) và bài tập Đúng/Sai $4$ ý." 
              className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed" 
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
                118
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Đầy đủ 118 nguyên tố</p>
                <MathView content="Từ $H$ ($Z=1$) tới $Og$ ($Z=118$)" className="text-slate-400 text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY WORKBENCH NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-md">
        {[
          { id: 'molecules3d', label: '1. Mô phỏng Phân tử 3D (IUPAC)', icon: Box },
          { id: 'periodic', label: '2. Bảng tuần hoàn 118 Nguyên tố', icon: Layers },
          { id: 'builder', label: '3. Ghép chất & Bát tử (Octet Rule)', icon: Plus },
          { id: 'reactions', label: '4. Phòng Thí nghiệm Ảo', icon: Beaker },
          { id: 'tf_quiz', label: '5. Đề thi Đúng/Sai 4 ý (Bộ GD&ĐT)', icon: ShieldCheck },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4 text-teal-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: 3D MOLECULE SIMULATION & BONDING
          ========================================================================= */}
      {activeTab === 'molecules3d' && (
        <Molecule3DViewer 
          initialMoleculeId={selected3DMoleculeId} 
          onMoleculeChange={(mol) => setSelected3DMoleculeId(mol.id)}
        />
      )}

      {/* =========================================================================
          TAB 2: INTERACTIVE PERIODIC TABLE (118 ELEMENTS)
          ========================================================================= */}
      {activeTab === 'periodic' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Tìm tên, kí hiệu, số hiệu Z..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {[
                  { id: 'standard', label: 'Bảng chuẩn' },
                  { id: 'block', label: 'Khối obitan (s, p, d, f)' },
                  { id: 'state', label: 'Trạng thái chất' },
                  { id: 'electronegativity', label: 'Bản đồ Độ âm điện' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setTableMode(mode.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                      tableMode === mode.id
                        ? 'bg-teal-600 text-white border-teal-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-5 border border-slate-800 overflow-x-auto">
              <div className="min-w-[700px] space-y-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map(periodNum => (
                  <div key={periodNum} className="flex items-center gap-1">
                    <span className="w-5 text-[10px] font-bold text-slate-500 text-center">{periodNum}</span>
                    <div className="flex-1 grid grid-cols-18 gap-1">
                      {Array.from({ length: 18 }, (_, i) => i + 1).map(groupNum => {
                        const elem = ALL_118_ELEMENTS.find(e => e.period === periodNum && e.group === groupNum);
                        if (!elem) return <div key={groupNum} className="h-12 rounded-lg bg-slate-950/20" />;

                        const cat = CATEGORY_INFO[elem.category] || CATEGORY_INFO.transition;
                        const isSelected = selectedElement.z === elem.z;

                        return (
                          <button
                            key={elem.z}
                            onClick={() => setSelectedElement(elem)}
                            className={`h-12 p-1 rounded-xl border text-center transition-all flex flex-col justify-between relative ${cat.bgLight} ${cat.border} ${cat.textDark} ${
                              isSelected ? 'ring-2 ring-teal-400 scale-105 z-10' : 'hover:scale-105'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full text-[9px] font-mono leading-none opacity-80">
                              <span>{elem.z}</span>
                              <span className="text-[8px] uppercase">{elem.block}</span>
                            </div>
                            <div className="font-extrabold text-sm sm:text-base leading-none">{elem.symbol}</div>
                            <div className="text-[8px] truncate font-medium opacity-90 leading-none">{elem.nameVi}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Element Dossier */}
            <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">Hồ sơ Khoa học Nguyên tố</span>
                <span className="text-xs text-slate-400 font-mono">Z = {selectedElement.z}</span>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold bg-teal-500/20 border border-teal-500 text-teal-300">
                  <span className="text-xs">{selectedElement.z}</span>
                  <span className="text-2xl font-extrabold">{selectedElement.symbol}</span>
                  <span className="text-[9px]">{selectedElement.mass}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">{selectedElement.nameVi}</h3>
                  <p className="text-xs text-teal-400 font-bold">{CATEGORY_INFO[selectedElement.category]?.labelVi}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Cấu hình Electron</span>
                <p className="font-mono text-sm text-teal-300 font-bold">
                  <MathView inline content={selectedElement.electronConfig} />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: OCTET RULE COMPOUND BUILDER
          ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 rounded-3xl p-6 border border-amber-800/40 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-900/40">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 mb-2">
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Phòng Lab Ghép chất & Quy tắc Bát tử (Octet Rule)</span>
              </div>
              <h3 className="font-black text-xl text-white">Tổng hợp Hợp chất & Kiểm tra Vỏ Bát tử</h3>
            </div>

            <button onClick={handleClearBuilder} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Xóa cốc phản ứng</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">1. Bấm chọn nguyên tố vào cốc</span>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {[ALL_118_ELEMENTS[0], ALL_118_ELEMENTS[7], ALL_118_ELEMENTS[10], ALL_118_ELEMENTS[16], ALL_118_ELEMENTS[5], ALL_118_ELEMENTS[6], ALL_118_ELEMENTS[15]].map(e => (
                  <button key={e.symbol} onClick={() => handleAddElementToBuilder(e.symbol)} className="p-3 bg-slate-800 hover:bg-amber-500/20 border border-slate-700 rounded-2xl text-center transition-all group">
                    <span className="text-[10px] text-slate-400 block">{e.z}</span>
                    <span className="text-base font-black text-white group-hover:text-amber-300">{e.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 min-h-[90px] flex flex-wrap gap-2 items-center">
                {Object.keys(draggedElements).length === 0 ? (
                  <p className="text-slate-500 text-xs text-center w-full">Cốc phản ứng đang trống. Hãy chọn các nguyên tố bên trái!</p>
                ) : (
                  Object.entries(draggedElements).map(([sym, count]) => (
                    <div key={sym} className="px-3 py-1.5 bg-amber-500/20 text-amber-200 border border-amber-500/40 rounded-xl flex items-center gap-2 font-bold text-xs">
                      <span>{sym}</span>
                      <span className="px-1.5 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black">{count}</span>
                      <button onClick={() => handleRemoveElementFromBuilder(sym)} className="text-slate-400 hover:text-red-400">×</button>
                    </div>
                  ))
                )}
              </div>

              {synthesizedCompound ? (
                <div className="p-5 bg-teal-950/80 border border-teal-500/50 rounded-2xl space-y-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5 w-fit">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Thỏa mãn quy tắc Bát tử Octet!</span>
                  </span>
                  <h4 className="text-2xl font-black text-white">{synthesizedCompound.formula} ({synthesizedCompound.nameVi})</h4>
                  <MathView content={synthesizedCompound.descriptionVi} className="text-xs text-slate-300" />
                </div>
              ) : octetWarning ? (
                <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-300">
                  <MathView content={octetWarning} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TRUE/FALSE 4-STATEMENT QUESTION MATRIX (BỘ GD&ĐT)
          ========================================================================= */}
      {activeTab === 'tf_quiz' && (
        <div className="space-y-6">
          {chemistryTFQuestions.map(q => {
            const isDone = tfSubmitted[q.id];
            const currentScore = calculateTFScore(q.id);

            return (
              <div key={q.id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">Trắc nghiệm Hóa học Đúng/Sai 4 ý</span>
                  {isDone && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-black border border-amber-500/30">
                      Điểm: {currentScore} / 1.0 điểm
                    </span>
                  )}
                </div>

                <MathView content={q.scenario} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-sm text-slate-200" />

                <div className="space-y-3">
                  {q.statements.map(s => {
                    const userSel = (tfUserSelections[q.id] || {})[s.id];
                    return (
                      <div key={s.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2 flex-1">
                            <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">{s.id})</span>
                            <MathView content={s.text} className="text-slate-200 font-medium pt-0.5" />
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button disabled={isDone} onClick={() => handleSelectTF(q.id, s.id, true)} className={`px-3 py-1.5 rounded-xl font-bold ${userSel === true ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Đúng</button>
                            <button disabled={isDone} onClick={() => handleSelectTF(q.id, s.id, false)} className={`px-3 py-1.5 rounded-xl font-bold ${userSel === false ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Sai</button>
                          </div>
                        </div>

                        {isDone && (
                          <MathView content={s.explanation} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 mt-2" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isDone && (
                  <button onClick={() => setTfSubmitted(prev => ({ ...prev, [q.id]: true }))} className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-extrabold text-xs shadow-md">
                    Chấm Điểm Thang GDPT 2018 (0.1 - 0.25 - 0.5 - 1.0)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

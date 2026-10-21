import React, { useState, useMemo } from 'react';
import { 
  Dna, 
  Search, 
  Sparkles, 
  Layers, 
  Calculator, 
  BookOpen, 
  Grid, 
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Award,
  Check,
  X
} from 'lucide-react';
import { MathView } from './MathView';
import { PedigreeIndividual, ShortAnswerQuestion } from '../types';

export function BiologyToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'punnett' | 'pedigree' | 'prob_quiz' | 'molecular'>('punnett');

  // ==========================================
  // 1. PUNNETT SQUARE & MENDELIAN GENETICS
  // ==========================================
  const [crossMode, setCrossMode] = useState<'mono' | 'di' | 'sex_linked'>('mono');
  const [dominanceType, setDominanceType] = useState<'complete' | 'incomplete'>('complete');
  const [parent1Mono, setParent1Mono] = useState('Aa');
  const [parent2Mono, setParent2Mono] = useState('Aa');

  // Monohybrid Calculation
  const monoCalculations = useMemo(() => {
    const g1 = [parent1Mono[0], parent1Mono[1]];
    const g2 = [parent2Mono[0], parent2Mono[1]];

    const grid = [];
    const genotypeCounts: Record<string, number> = {};

    for (let a of g1) {
      for (let b of g2) {
        // Capital allele first
        const sorted = [a, b].sort((x, y) => {
          if (x === x.toUpperCase() && y === y.toLowerCase()) return -1;
          if (x === x.toLowerCase() && y === y.toUpperCase()) return 1;
          return x.localeCompare(y);
        }).join('');

        grid.push({ g1: a, g2: b, result: sorted });
        genotypeCounts[sorted] = (genotypeCounts[sorted] || 0) + 1;
      }
    }

    const total = 4;
    // Phenotype counts
    let dominantCount = 0;
    let heterocount = 0;
    let recessiveCount = 0;

    Object.entries(genotypeCounts).forEach(([gt, count]) => {
      if (gt === 'AA') dominantCount += count;
      else if (gt === 'Aa') heterocount += count;
      else if (gt === 'aa') recessiveCount += count;
    });

    let phenotypeText = '';
    if (dominanceType === 'complete') {
      const domTotal = dominantCount + heterocount;
      phenotypeText = `$${domTotal}$ Trội : $${recessiveCount}$ Lặn (Tỉ lệ: $${((domTotal/total)*100).toFixed(0)}\\%$ Trội, $${((recessiveCount/total)*100).toFixed(0)}\\%$ Lặn)`;
    } else {
      phenotypeText = `$${dominantCount}$ Trội (AA) : $${heterocount}$ Trung gian (Aa) : $${recessiveCount}$ Lặn (aa)`;
    }

    return { grid, genotypeCounts, phenotypeText, total };
  }, [parent1Mono, parent2Mono, dominanceType]);

  // Dihybrid 4x4 Punnett Grid
  const dihybridGrid = useMemo(() => {
    const gametes1 = ['AB', 'Ab', 'aB', 'ab'];
    const gametes2 = ['AB', 'Ab', 'aB', 'ab'];

    const grid = [];
    const phenoCounts: Record<string, number> = { 'A_B_': 0, 'A_bb': 0, 'aaB_': 0, 'aabb': 0 };

    for (let g1 of gametes1) {
      for (let g2 of gametes2) {
        const hasA = g1.includes('A') || g2.includes('A');
        const hasB = g1.includes('B') || g2.includes('B');

        let phenoType = 'aabb';
        if (hasA && hasB) phenoType = 'A_B_';
        else if (hasA && !hasB) phenoType = 'A_bb';
        else if (!hasA && hasB) phenoType = 'aaB_';

        phenoCounts[phenoType] = (phenoCounts[phenoType] || 0) + 1;
        grid.push({ g1, g2, phenoType });
      }
    }

    return { gametes1, gametes2, grid, phenoCounts };
  }, []);


  // ==========================================
  // 2. INTERACTIVE PEDIGREE TREE (SƠ ĐỒ PHẢ HỆ)
  // ==========================================
  const pedigreeData: PedigreeIndividual[] = [
    { id: 'I-1', generation: 'I', gender: 'male', affected: true, possibleGenotypes: ['aa'], calculatedProbText: '$100\\%$ $aa$' },
    { id: 'I-2', generation: 'I', gender: 'female', affected: false, possibleGenotypes: ['AA', 'Aa'], calculatedProbText: '$100\\%$ $Aa$' },
    { id: 'II-1', generation: 'II', gender: 'female', affected: false, fatherId: 'I-1', motherId: 'I-2', possibleGenotypes: ['Aa'], calculatedProbText: '$100\\%$ $Aa$ (nhận $a$ từ bố)' },
    { id: 'II-2', generation: 'II', gender: 'male', affected: false, possibleGenotypes: ['AA', 'Aa'], calculatedProbText: '$\\frac{1}{3} AA : \\frac{2}{3} Aa$' },
    { id: 'III-1', generation: 'III', gender: 'male', affected: false, fatherId: 'II-2', motherId: 'II-1', possibleGenotypes: ['AA', 'Aa'], calculatedProbText: 'Xác suất mang gen $Aa = \\frac{3}{5}$' },
  ];

  const [selectedPedigreeInd, setSelectedPedigreeInd] = useState<PedigreeIndividual>(pedigreeData[2]);


  // ==========================================
  // 3. SHORT-ANSWER PROBABILITY CALCULATOR
  // ==========================================
  const shortAnswerQuiz: ShortAnswerQuestion[] = [
    {
      id: 'sa-1',
      questionText: 'Ở đậu Hà Lan, gen $A$ quy định hạt vàng trội hoàn toàn so với gen $a$ quy định hạt xanh; $B$ quy định hạt trơn trội hoàn toàn so với $b$ quy định hạt nhăn. Thực hiện phép lai $AaBb \\times AaBb$. Tính xác suất xuất hiện cá thể thuần chủng mang kiểu gen $AABB$ ở $F_1$ (nhập số phần trăm %)?',
      correctValue: 6.25,
      unit: '%',
      explanation: 'Tỉ lệ $AABB = P(AA) \\times P(BB) = \\frac{1}{4} \\times \\frac{1}{4} = \\frac{1}{16} = 6{,}25\\%$.'
    },
    {
      id: 'sa-2',
      questionText: 'Cho phép lai $Aa \\times Aa$. Tính xác suất sinh $2$ người con gồm $1$ con trai có kiểu hình trội và $1$ con gái có kiểu hình lặn?',
      correctValue: 9.375,
      unit: '%',
      explanation: '$P(\\text{trai trội}) = \\frac{1}{2} \\times \\frac{3}{4} = \\frac{3}{8}$. $P(\\text{gái lặn}) = \\frac{1}{2} \\times \\frac{1}{4} = \\frac{1}{8}$. Xác suất $2! \\times \\frac{3}{8} \\times \\frac{1}{8} = \\frac{6}{64} = 9{,}375\\%$.'
    }
  ];

  const [saUserAnswers, setSaUserAnswers] = useState<Record<string, string>>({});
  const [saChecked, setSaChecked] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
            <Dna className="w-4 h-4 text-emerald-200" />
            <span>Chương trình Sinh học THPT GDPT 2018 (Lớp 10, 11, 12)</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Máy Tính Di Truyền Mendel & Sơ Đồ Phả Hệ Tương Tác
          </h2>
          
          <MathView 
            content="Tính toán chuẩn xác tỉ lệ Kiểu gen & Kiểu hình cho phép lai $1$ cặp, $2$ cặp phân ly độc lập, Di truyền liên kết giới tính $X^A X^a$, Phân tích Sơ đồ Phả hệ và Bài tập Điền đáp số ngắn."
            className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed" 
          />
        </div>
      </div>

      {/* SUB-TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {[
          { id: 'punnett', label: '1. Bảng Punnett & Mendel', icon: Grid },
          { id: 'pedigree', label: '2. Sơ đồ Phả hệ Tương tác', icon: Layers },
          { id: 'prob_quiz', label: '3. Bài tập Điền Đáp số ngắn', icon: Calculator },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUBTAB 1: PUNNETT SQUARE & MENDELIAN GENETICS CALCULATOR
          ========================================================================= */}
      {activeSubTab === 'punnett' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Chọn Dạng Phép Lai Di Truyền</span>
              
              <div className="flex items-center gap-2 text-xs">
                {[
                  { id: 'mono', label: 'Lai 1 cặp tính trạng (Aa × Aa)' },
                  { id: 'di', label: 'Lai 2 cặp phân ly độc lập (4x4)' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setCrossMode(m.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                      crossMode === m.id ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {crossMode === 'mono' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kiểu gen P1 (Mẹ):</label>
                      <select value={parent1Mono} onChange={e => setParent1Mono(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono font-bold">
                        <option value="AA">AA (Đồng hợp trội)</option>
                        <option value="Aa">Aa (Dị hợp)</option>
                        <option value="aa">aa (Đồng hợp lặn)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kiểu gen P2 (Bố):</label>
                      <select value={parent2Mono} onChange={e => setParent2Mono(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono font-bold">
                        <option value="AA">AA (Đồng hợp trội)</option>
                        <option value="Aa">Aa (Dị hợp)</option>
                        <option value="aa">aa (Đồng hợp lặn)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quy luật Trội:</label>
                    <div className="flex gap-2">
                      <button onClick={() => setDominanceType('complete')} className={`px-3 py-1.5 rounded-xl font-bold border ${dominanceType === 'complete' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Trội hoàn toàn</button>
                      <button onClick={() => setDominanceType('incomplete')} className={`px-3 py-1.5 rounded-xl font-bold border ${dominanceType === 'incomplete' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Trội không hoàn toàn</button>
                    </div>
                  </div>
                </div>

                {/* Punnett Table */}
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Bảng Punnett Lai 1 Cặp ($F_1$):</span>
                  
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
                    <div className="bg-slate-200 dark:bg-slate-800 p-2 font-bold">♀ \ ♂</div>
                    <div className="bg-emerald-200 dark:bg-emerald-900 p-2 font-bold">{parent2Mono[0]}</div>
                    <div className="bg-emerald-200 dark:bg-emerald-900 p-2 font-bold">{parent2Mono[1]}</div>

                    <div className="bg-emerald-200 dark:bg-emerald-900 p-2 font-bold">{parent1Mono[0]}</div>
                    <div className="bg-white dark:bg-slate-900 p-2 border font-bold text-emerald-600">{monoCalculations.grid[0].result}</div>
                    <div className="bg-white dark:bg-slate-900 p-2 border font-bold text-emerald-600">{monoCalculations.grid[1].result}</div>

                    <div className="bg-emerald-200 dark:bg-emerald-900 p-2 font-bold">{parent1Mono[1]}</div>
                    <div className="bg-white dark:bg-slate-900 p-2 border font-bold text-emerald-600">{monoCalculations.grid[2].result}</div>
                    <div className="bg-white dark:bg-slate-900 p-2 border font-bold text-emerald-600">{monoCalculations.grid[3].result}</div>
                  </div>

                  <div className="text-xs space-y-1 pt-2 border-t border-emerald-200 dark:border-emerald-900">
                    <p>• Tỉ lệ Kiểu gen: <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {Object.entries(monoCalculations.genotypeCounts).map(([k, v]) => `${v} ${k}`).join(' : ')}
                    </span></p>
                    <p>• Tỉ lệ Kiểu hình: <MathView content={monoCalculations.phenotypeText} /></p>
                  </div>
                </div>
              </div>
            )}

            {crossMode === 'di' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">Bảng Punnett 4×4 Phép Lai 2 Cặp ($AaBb \\times AaBb$):</span>
                <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs overflow-x-auto">
                  <div className="bg-slate-200 dark:bg-slate-800 p-2 font-bold">♀ \ ♂</div>
                  {dihybridGrid.gametes2.map((g, i) => <div key={i} className="bg-emerald-200 dark:bg-emerald-900 p-2 font-bold">{g}</div>)}

                  {dihybridGrid.gametes1.map((g1, rowIdx) => (
                    <React.Fragment key={rowIdx}>
                      <div className="bg-emerald-200 dark:bg-emerald-900 p-2 font-bold">{g1}</div>
                      {dihybridGrid.gametes2.map((g2, colIdx) => (
                        <div key={colIdx} className="bg-white dark:bg-slate-900 p-2 border font-bold text-emerald-600">
                          {g1[0]}{g2[0]}{g1[1]}{g2[1]}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Tỉ lệ Kiểu hình chuẩn $9 : 3 : 3 : 1$:</span>
                  <MathView inline content="• $9$ $A\\_B\\_$ ($56,25\\%$) | $3$ $A\\_bb$ ($18,75\\%$) | $3$ $aaB\\_$ ($18,75\\%$) | $1$ $aabb$ ($6,25\\%$)" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: INTERACTIVE PEDIGREE TREE (SƠ ĐỒ PHẢ HỆ)
          ========================================================================= */}
      {activeSubTab === 'pedigree' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Phân tích Di truyền Học</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Sơ đồ Phả hệ Tương tác qua 3 Thế hệ</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Pedigree Visualizer */}
            <div className="lg:col-span-7 p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-6">
              <span className="text-xs font-bold text-slate-400 block mb-2">Bấm chọn từng cá thể để suy luận xác suất Kiểu gen:</span>

              <div className="space-y-6">
                {['I', 'II', 'III'].map(gen => (
                  <div key={gen} className="flex items-center gap-4">
                    <span className="font-bold font-mono text-slate-500 w-8">Thế hệ {gen}:</span>
                    <div className="flex items-center gap-4">
                      {pedigreeData.filter(ind => ind.generation === gen).map(ind => {
                        const isSel = selectedPedigreeInd.id === ind.id;
                        return (
                          <button
                            key={ind.id}
                            onClick={() => setSelectedPedigreeInd(ind)}
                            className={`p-3 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                              isSel ? 'ring-2 ring-emerald-400 scale-105 shadow-md' : 'hover:scale-102'
                            } ${ind.affected ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-200 border-slate-700'}`}
                          >
                            <span>{ind.gender === 'male' ? '♂' : '♀'} {ind.id}</span>
                            <span className="text-[10px] opacity-80">({ind.affected ? 'Bệnh' : 'Bình thường'})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Spec Card */}
            <div className="lg:col-span-5 p-5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 space-y-3">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Phân tích Cá thể {selectedPedigreeInd.id}:
              </span>

              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Giới tính: {selectedPedigreeInd.gender === 'male' ? 'Nam (♂)' : 'Nữ (♀)'} • Trạng thái: {selectedPedigreeInd.affected ? 'Mắc bệnh (aa)' : 'Bình thường'}
              </p>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-emerald-600 block mb-1">Xác suất Kiểu gen suy luận:</span>
                <MathView content={selectedPedigreeInd.calculatedProbText} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: SHORT-ANSWER CALCULATION QUESTIONS
          ========================================================================= */}
      {activeSubTab === 'prob_quiz' && (
        <div className="space-y-6">
          {shortAnswerQuiz.map(q => {
            const isDone = saChecked[q.id];
            const userVal = parseFloat(saUserAnswers[q.id] || '');
            const isCorrect = Math.abs(userVal - q.correctValue) < 0.1;

            return (
              <div key={q.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Dạng Bài tập Điền Đáp số ngắn
                </span>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  <MathView content={q.questionText} />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-64">
                    <input
                      type="number" step={0.01}
                      placeholder="Nhập số..."
                      disabled={isDone}
                      value={saUserAnswers[q.id] || ''}
                      onChange={e => setSaUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
                    />
                    <span className="font-bold text-xs text-slate-500">{q.unit}</span>
                  </div>

                  {!isDone && (
                    <button onClick={() => setSaChecked(prev => ({ ...prev, [q.id]: true }))} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all">
                      Kiểm tra Đáp số
                    </button>
                  )}
                </div>

                {isDone && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-1 ${isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
                    <span className="font-bold block mb-1">{isCorrect ? '✓ Chính xác hoàn toàn!' : `✗ Chưa đúng! Đáp số đúng: ${q.correctValue}${q.unit}`}</span>
                    <MathView content={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

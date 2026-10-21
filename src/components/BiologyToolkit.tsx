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
  RefreshCw
} from 'lucide-react';
import { MathView } from './MathView';

export function BiologyToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'punnett' | 'translation' | 'dna_calc' | 'hardy_weinberg'>('punnett');

  // --- SUBTAB 1: LAI DI TRUYỀN & BẢNG PUNNETT ---
  const [crossType, setCrossType] = useState<'mono' | 'di'>('mono');
  const [parent1, setParent1] = useState('Aa');
  const [parent2, setParent2] = useState('Aa');

  // Tính toán lai 1 cặp
  const monoPunnett = useMemo(() => {
    const gametes1 = [parent1[0], parent1[1]];
    const gametes2 = [parent2[0], parent2[1]];

    const grid = [];
    const genotypeCounts: Record<string, number> = {};

    for (let g1 of gametes1) {
      for (let g2 of gametes2) {
        // Sort alleles alphabetically or Capital first
        const sorted = [g1, g2].sort().reverse().join('');
        grid.push({ g1, g2, result: sorted });
        genotypeCounts[sorted] = (genotypeCounts[sorted] || 0) + 1;
      }
    }

    return { grid, genotypeCounts };
  }, [parent1, parent2]);

  // --- SUBTAB 2: PHIÊN MÃ & DỊCH MÃ ---
  const [dnaInput, setDnaInput] = useState('ATGGCATTTCCCGGTTAA');

  const geneticCode: Record<string, string> = {
    'AUG': 'Met (Mở đầu)', 'GCA': 'Ala', 'GCC': 'Ala', 'GCG': 'Ala', 'GCU': 'Ala',
    'UUU': 'Phe', 'UUC': 'Phe', 'CCC': 'Pro', 'CCU': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
    'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly', 'UAA': 'Stop (Kết thúc)',
    'UAG': 'Stop (Kết thúc)', 'UGA': 'Stop (Kết thúc)', 'AAA': 'Lys', 'AAG': 'Lys',
    'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu', 'UAU': 'Tyr', 'UAC': 'Tyr'
  };

  const molecularProcess = useMemo(() => {
    // 1. Clean DNA
    const cleanDna = dnaInput.toUpperCase().replace(/[^ATGC]/g, '');
    
    // 2. Transcription: DNA -> mRNA (A->U, T->A, G->C, C->G)
    let mrna = '';
    for (let char of cleanDna) {
      if (char === 'A') mrna += 'U';
      else if (char === 'T') mrna += 'A';
      else if (char === 'G') mrna += 'C';
      else if (char === 'C') mrna += 'G';
    }

    // 3. Translation: mRNA triplets -> amino acids
    const codons = [];
    const aminoAcids = [];
    for (let i = 0; i < mrna.length - 2; i += 3) {
      const codon = mrna.slice(i, i + 3);
      codons.push(codon);
      const aa = geneticCode[codon] || 'Unknown';
      aminoAcids.push(aa);
    }

    return { cleanDna, mrna, codons, aminoAcids };
  }, [dnaInput]);

  // --- SUBTAB 3: MÁY TÍNH ADN / ARN ---
  const [totalNucleotides, setTotalNucleotides] = useState<number>(3000);
  const [percentA, setPercentA] = useState<number>(20); // %A = %T

  const dnaMetrics = useMemo(() => {
    const N = totalNucleotides;
    const lengthAngstrom = (N / 2) * 3.4; // L = (N/2) * 3.4 Å
    const lengthNanometer = lengthAngstrom / 10;
    const massDvc = N * 300; // M = N * 300 đvC
    const numCoils = N / 20; // Chu kỳ xoắn C = N / 20

    const countA = Math.round((percentA / 100) * N);
    const countT = countA;
    const percentG = 50 - percentA;
    const countG = Math.round((percentG / 100) * N);
    const countC = countG;

    // Số liên kết Hydro: H = 2A + 3G
    const hydrogenBonds = 2 * countA + 3 * countG;
    // Số liên kết hóa trị giữa các nu: N - 2
    const phosphodiesterBonds = N - 2;

    return {
      N,
      lengthAngstrom: Number(lengthAngstrom.toFixed(1)),
      lengthNanometer: Number(lengthNanometer.toFixed(2)),
      massDvc,
      numCoils: Number(numCoils.toFixed(1)),
      countA,
      countT,
      countG,
      countC,
      hydrogenBonds,
      phosphodiesterBonds
    };
  }, [totalNucleotides, percentA]);

  // --- SUBTAB 4: HARDY - WEINBERG ---
  const [freqP, setFreqP] = useState<number>(0.6); // p(A)
  const freqQ = Number((1 - freqP).toFixed(2)); // q(a)
  const hwGenotypes = {
    AA: Number((freqP * freqP).toFixed(4)),
    Aa: Number((2 * freqP * freqQ).toFixed(4)),
    aa: Number((freqQ * freqQ).toFixed(4))
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 rounded-3xl p-6 md:p-8 text-white shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <Dna className="w-4 h-4 text-emerald-200" />
            <span>Chương trình GDPT 2018 • Sinh học 10, 11, 12</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bộ công cụ Sinh học THPT Trực quan
          </h2>
          <p className="text-sm md:text-base text-emerald-100 max-w-2xl leading-relaxed">
            Phân tích lai di truyền & bảng Punnett, giải mã phiên mã dịch mã phân tử, tính toán cấu trúc ADN và cân bằng quần thể.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('punnett')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'punnett'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Lai Mendel & Bảng Punnett</span>
        </button>

        <button
          onClick={() => setActiveSubTab('translation')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'translation'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>Phiên mã & Dịch mã Protein</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dna_calc')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'dna_calc'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Máy tính Bài tập ADN & Gen</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hardy_weinberg')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'hardy_weinberg'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Định luật Hardy - Weinberg</span>
        </button>
      </div>

      {/* --- SUBTAB 1: PUNNETT SQUARE --- */}
      {activeSubTab === 'punnett' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-600" />
              <span>Thiết lập phép lai P</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Kiểu gen P₁ (Bố/Mẹ 1):</label>
                <select
                  value={parent1}
                  onChange={(e) => setParent1(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono outline-none"
                >
                  <option value="AA">AA (Thuần chủng trội)</option>
                  <option value="Aa">Aa (Dị hợp 1 cặp)</option>
                  <option value="aa">aa (Thuần chủng lặn)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Kiểu gen P₂ (Bố/Mẹ 2):</label>
                <select
                  value={parent2}
                  onChange={(e) => setParent2(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono outline-none"
                >
                  <option value="AA">AA (Thuần chủng trội)</option>
                  <option value="Aa">Aa (Dị hợp 1 cặp)</option>
                  <option value="aa">aa (Thuần chủng lặn)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <p className="font-bold">Quy ước giả định:</p>
              <p>Alen $A$ quy định tính trạng trội hoàn toàn; Alen $a$ quy định tính trạng lặn.</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Bảng Punnett phân ly tổ hợp đời $F_1$
            </h4>

            {/* 2x2 Table */}
            <div className="max-w-xs mx-auto">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr>
                    <th className="p-3 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                      G: P₁ \ P₂
                    </th>
                    <th className="p-3 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950 text-sm font-mono font-bold text-emerald-600">
                      {parent2[0]}
                    </th>
                    <th className="p-3 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950 text-sm font-mono font-bold text-emerald-600">
                      {parent2[1]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950 text-sm font-mono font-bold text-emerald-600">
                      {parent1[0]}
                    </td>
                    <td className="p-4 border border-slate-200 dark:border-slate-700 font-mono font-black text-lg bg-white dark:bg-slate-900">
                      {monoPunnett.grid[0]?.result}
                    </td>
                    <td className="p-4 border border-slate-200 dark:border-slate-700 font-mono font-black text-lg bg-white dark:bg-slate-900">
                      {monoPunnett.grid[1]?.result}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950 text-sm font-mono font-bold text-emerald-600">
                      {parent1[1]}
                    </td>
                    <td className="p-4 border border-slate-200 dark:border-slate-700 font-mono font-black text-lg bg-white dark:bg-slate-900">
                      {monoPunnett.grid[2]?.result}
                    </td>
                    <td className="p-4 border border-slate-200 dark:border-slate-700 font-mono font-black text-lg bg-white dark:bg-slate-900">
                      {monoPunnett.grid[3]?.result}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Genotype & Phenotype Ratio */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500">Tỉ lệ Kiểu gen đời con:</span>
                <p className="font-mono font-bold text-sm text-emerald-600 mt-1">
                  {Object.entries(monoPunnett.genotypeCounts).map(([gt, count]) => `${count} ${gt}`).join(' : ')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500">Tỉ lệ Kiểu hình:</span>
                <p className="font-mono font-bold text-sm text-indigo-600 mt-1">
                  {(() => {
                    const dom = (monoPunnett.genotypeCounts['AA'] || 0) + (monoPunnett.genotypeCounts['Aa'] || 0);
                    const rec = monoPunnett.genotypeCounts['aa'] || 0;
                    return `${dom} Trội : ${rec} Lặn`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: PHIÊN MÃ & DỊCH MÃ --- */}
      {activeSubTab === 'translation' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nhập trình tự mạch gốc ADN (gồm các bazo A, T, G, C):
            </label>
            <input 
              type="text"
              value={dnaInput}
              onChange={(e) => setDnaInput(e.target.value.toUpperCase())}
              placeholder="Ví dụ: ATGGCATTTCCCGGTTAA"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-mono font-bold tracking-widest text-emerald-600 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Process Diagram */}
          <div className="space-y-4">
            {/* 1. Mạch khuôn ADN */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-500">1. Mạch khuôn ADN (3' ➔ 5'):</span>
              <p className="font-mono text-sm tracking-widest text-slate-800 dark:text-slate-100 font-bold break-all">
                {molecularProcess.cleanDna}
              </p>
            </div>

            {/* 2. Phiên mã sang mRNA */}
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2. Bản mã sao mARN (5' ➔ 3'):</span>
              <p className="font-mono text-sm tracking-widest text-blue-700 dark:text-blue-300 font-bold break-all">
                {molecularProcess.mrna}
              </p>
            </div>

            {/* 3. Dịch mã chuỗi Polypeptide */}
            <div className="p-5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">3. Chuỗi Polypeptide / Axit amin dịch mã:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {molecularProcess.aminoAcids.map((aa, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && <span className="text-emerald-400 font-bold">—</span>}
                    <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl shadow-2xs font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300">
                      {aa}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: MÁY TÍNH ADN & GEN --- */}
      {activeSubTab === 'dna_calc' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Dữ liệu đầu vào của Phân tử ADN</span>
            </h4>

            <div>
              <label className="text-xs font-semibold text-slate-500">Tổng số nuclêôtit $N$:</label>
              <input 
                type="number"
                step={20}
                value={totalNucleotides}
                onChange={(e) => setTotalNucleotides(parseInt(e.target.value) || 0)}
                className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Tỉ lệ $\%A$ (bằng $\%T$):</span>
                <span className="text-emerald-600 font-bold font-mono">{percentA}%</span>
              </div>
              <input 
                type="range"
                min={1}
                max={49}
                value={percentA}
                onChange={(e) => setPercentA(parseInt(e.target.value))}
                className="w-full accent-emerald-600 mt-2"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500 leading-relaxed">
              💡 Theo nguyên tắc bổ sung Chargaff: $A = T$ và $G = C$; do đó $\%A + \%G = 50\%$.
            </div>
          </div>

          <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Kết quả giải đặc trưng lý - hóa của ADN
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-500">
                  <MathView content="Chiều dài $L = \frac{N}{2} \times 3{,}4$:" />
                </div>
                <p className="font-mono font-bold text-sm text-emerald-600 mt-0.5">{dnaMetrics.lengthAngstrom} Å ({dnaMetrics.lengthNanometer} nm)</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-500">
                  <MathView content="Khối lượng $M = N \times 300$:" />
                </div>
                <p className="font-mono font-bold text-sm text-emerald-600 mt-0.5">{dnaMetrics.massDvc.toLocaleString()} đvC</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-500">
                  <MathView content="Chu kỳ xoắn $C = \frac{N}{20}$:" />
                </div>
                <p className="font-mono font-bold text-sm text-emerald-600 mt-0.5">{dnaMetrics.numCoils} chu kỳ</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-500">
                  <MathView content="Liên kết Hydro $H = 2A + 3G$:" />
                </div>
                <p className="font-mono font-bold text-sm text-indigo-600 mt-0.5">{dnaMetrics.hydrogenBonds} liên kết</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex justify-between items-center text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Số lượng từng loại nuclêôtit:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                A = T = {dnaMetrics.countA} | G = C = {dnaMetrics.countG}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: HARDY - WEINBERG --- */}
      {activeSubTab === 'hardy_weinberg' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1">
              Định luật Cân bằng Di truyền Hardy - Weinberg
            </h4>
            <p className="text-xs text-slate-500">
              Công thức nghiệm: $p^2 (AA) + 2pq (Aa) + q^2 (aa) = 1$ với $p + q = 1$
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Tần số alen $p(A)$:</span>
              <span className="font-mono text-emerald-600 font-bold">{freqP} (q = {freqQ})</span>
            </div>
            <input 
              type="range"
              min={0.05}
              max={0.95}
              step={0.05}
              value={freqP}
              onChange={(e) => setFreqP(parseFloat(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500">Tỉ lệ $AA$ ($p^2$):</span>
              <p className="font-mono text-xl font-black text-emerald-600 mt-1">{(hwGenotypes.AA * 100).toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500">Tỉ lệ $Aa$ ($2pq$):</span>
              <p className="font-mono text-xl font-black text-indigo-600 mt-1">{(hwGenotypes.Aa * 100).toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500">Tỉ lệ $aa$ ($q^2$):</span>
              <p className="font-mono text-xl font-black text-amber-600 mt-1">{(hwGenotypes.aa * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

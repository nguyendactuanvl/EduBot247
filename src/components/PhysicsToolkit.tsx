import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Activity, 
  Search, 
  Calculator, 
  Sliders, 
  RotateCcw, 
  ChevronRight, 
  Info, 
  Check, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Volume2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { MathView } from './MathView';

export function PhysicsToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'wave' | 'circuit' | 'formulas'>('wave');

  // --- SUBTAB 1: ĐỒ THỊ DAO ĐỘNG & SÓNG ---
  const [amplitude, setAmplitude] = useState<number>(5); // A (cm)
  const [frequency, setFrequency] = useState<number>(1); // f (Hz)
  const [phase, setPhase] = useState<number>(0); // phi (rad / pi)
  const [graphMode, setGraphMode] = useState<'displacement' | 'velocity' | 'acceleration'>('displacement');

  const omega = 2 * Math.PI * frequency;
  const period = frequency > 0 ? 1 / frequency : 0;
  const phiRad = phase * Math.PI;

  const waveData = useMemo(() => {
    const points = [];
    const tMax = period * 2;
    const step = tMax / 80;
    for (let t = 0; t <= tMax; t += step) {
      const x = amplitude * Math.cos(omega * t + phiRad);
      const v = -amplitude * omega * Math.sin(omega * t + phiRad);
      const a = -amplitude * omega * omega * Math.cos(omega * t + phiRad);
      points.push({
        time: Number(t.toFixed(3)),
        displacement: Number(x.toFixed(2)),
        velocity: Number(v.toFixed(2)),
        acceleration: Number((a / 100).toFixed(2)) // m/s^2
      });
    }
    return points;
  }, [amplitude, frequency, phase, omega, period, phiRad]);

  // --- SUBTAB 2: SƠ ĐỒ MẠCH ĐIỆN & ĐỊNH LUẬT OHM ---
  const [voltage, setVoltage] = useState<number>(12); // U (V)
  const [resistor1, setResistor1] = useState<number>(6); // R1 (Ohm)
  const [resistor2, setResistor2] = useState<number>(12); // R2 (Ohm)
  const [resistor3, setResistor3] = useState<number>(4); // R3 (Ohm)
  const [circuitType, setCircuitType] = useState<'series' | 'parallel' | 'mixed'>('series');

  // Tính toán điện trở tương đương Rtd
  const circuitCalculations = useMemo(() => {
    let rEq = 0;
    if (circuitType === 'series') {
      rEq = resistor1 + resistor2;
    } else if (circuitType === 'parallel') {
      rEq = (resistor1 * resistor2) / (resistor1 + resistor2);
    } else {
      // Hỗn hợp: (R1 // R2) + R3
      const rParallel = (resistor1 * resistor2) / (resistor1 + resistor2);
      rEq = rParallel + resistor3;
    }

    const currentTotal = rEq > 0 ? voltage / rEq : 0; // I = U / R
    const powerTotal = voltage * currentTotal; // P = U * I
    const heatEnergyIn1Min = powerTotal * 60; // Q = P * t (J)

    return {
      rEq: Number(rEq.toFixed(2)),
      currentTotal: Number(currentTotal.toFixed(2)),
      powerTotal: Number(powerTotal.toFixed(2)),
      heatEnergyIn1Min: Number(heatEnergyIn1Min.toFixed(1))
    };
  }, [voltage, resistor1, resistor2, resistor3, circuitType]);

  // --- SUBTAB 3: CẨM NANG CÔNG THỨC VẬT LÝ ---
  const [formulaSearch, setFormulaSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '10' | '11' | '12'>('all');

  const physicsFormulas = [
    {
      id: 'p1',
      grade: '12',
      chapter: 'Dao động cơ',
      name: 'Phương trình dao động điều hòa',
      latex: 'x = A \\cos(\\omega t + \\varphi)',
      explain: 'Trong đó $x$ là li độ $(\\text{cm})$, $A$ là biên độ $(\\text{cm})$, $\\omega$ là tần số góc $(\\text{rad/s})$, $\\varphi$ là pha ban đầu $(\\text{rad})$.'
    },
    {
      id: 'p2',
      grade: '12',
      chapter: 'Dao động cơ',
      name: 'Vận tốc và Gia tốc trong dao động',
      latex: 'v = -\\omega A \\sin(\\omega t + \\varphi), \\quad a = -\\omega^2 x',
      explain: 'Vận tốc sớm pha $\\frac{\\pi}{2}$ so với li độ, gia tốc ngược pha với li độ ($a_{\\max} = \\omega^2 A$).'
    },
    {
      id: 'p3',
      grade: '12',
      chapter: 'Sóng cơ học',
      name: 'Hệ thức liên hệ bước sóng',
      latex: '\\lambda = v T = \\frac{v}{f}',
      explain: 'Trong đó $\\lambda$ là bước sóng $(\\text{m})$, $v$ là tốc độ truyền sóng $(\\text{m/s})$, $T$ là chu kỳ $(\\text{s})$, $f$ là tần số $(\\text{Hz})$.'
    },
    {
      id: 'p4',
      grade: '12',
      chapter: 'Vật lý Nhiệt',
      name: 'Định luật I Nhiệt động lực học',
      latex: '\\Delta U = Q + A',
      explain: 'Độ biến thiên nội năng $\\Delta U$ bằng tổng nhiệt lượng $Q$ và công $A$ mà hệ nhận được.'
    },
    {
      id: 'p5',
      grade: '12',
      chapter: 'Khí lý tưởng',
      name: 'Phương trình trạng thái khí lý tưởng',
      latex: '\\frac{p V}{T} = \\text{const} \\quad \\text{hoặc} \\quad p V = n R T',
      explain: 'Áp dụng cho lượng khí xác định. Hằng số khí lý tưởng $R \\approx 8{,}31\\text{ J/(mol}\\cdot\\text{K)}$.'
    },
    {
      id: 'p6',
      grade: '11',
      chapter: 'Điện trường & Dòng điện',
      name: 'Định luật Ohm cho toàn mạch',
      latex: 'I = \\frac{\\mathcal{E}}{R_N + r}',
      explain: '$\\mathcal{E}$ là suất điện động $(\\text{V})$, $R_N$ là điện trở mạch ngoài $(\\Omega)$, $r$ là điện trở trong $(\\Omega)$.'
    },
    {
      id: 'p7',
      grade: '11',
      chapter: 'Từ trường',
      name: 'Lực Lorentz tác dụng lên điện tích chuyển động',
      latex: 'f = |q| v B \\sin\\alpha',
      explain: 'Với $q$ là điện tích $(\\text{C})$, $v$ là vận tốc $(\\text{m/s})$, $B$ là cảm ứng từ $(\\text{T})$, $\\alpha = (\\vec{v}, \\vec{B})$.'
    },
    {
      id: 'p8',
      grade: '10',
      chapter: 'Động lực học',
      name: 'Định luật II Newton',
      latex: '\\vec{F} = m \\vec{a} \\iff a = \\frac{F}{m}',
      explain: 'Gia tốc tỉ lệ thuận với lực tác dụng và tỉ lệ nghịch với khối lượng của vật.'
    },
    {
      id: 'p9',
      grade: '10',
      chapter: 'Cơ năng',
      name: 'Định luật bảo toàn cơ năng',
      latex: 'W = W_đ + W_t = \\frac{1}{2} m v^2 + m g z = \\text{const}',
      explain: 'Cơ năng của vật chuyển động trong trọng trường không đổi khi chỉ chịu tác dụng của trọng lực.'
    }
  ];

  const filteredFormulas = useMemo(() => {
    return physicsFormulas.filter(f => {
      const matchGrade = selectedGrade === 'all' || f.grade === selectedGrade;
      const matchSearch = f.name.toLowerCase().includes(formulaSearch.toLowerCase()) || 
                          f.chapter.toLowerCase().includes(formulaSearch.toLowerCase());
      return matchGrade && matchSearch;
    });
  }, [physicsFormulas, selectedGrade, formulaSearch]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Chương trình GDPT 2018 • Vật lý 10, 11, 12</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bộ công cụ Vật lý THPT Đa năng
          </h2>
          <p className="text-sm md:text-base text-blue-100 max-w-2xl leading-relaxed">
            Mô phỏng đồ thị dao động điều hòa, phân tích & tính toán mạch điện, tra cứu công thức chuẩn SGK mới.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('wave')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'wave'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vẽ đồ thị Dao động & Sóng</span>
        </button>

        <button
          onClick={() => setActiveSubTab('circuit')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'circuit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Sơ đồ mạch điện & Định luật Ohm</span>
        </button>

        <button
          onClick={() => setActiveSubTab('formulas')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'formulas'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cẩm nang Công thức SGK Mới</span>
        </button>
      </div>

      {/* --- TAB 1: GRAPHING DAO ĐỘNG & SÓNG --- */}
      {activeSubTab === 'wave' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <span>Tham số dao động điều hòa</span>
            </h3>

            {/* Amplitude A */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Biên độ $A$:</span>
                <span className="text-blue-600 font-mono font-bold">{amplitude} cm</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={20} 
                step={0.5}
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Frequency f */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Tần số $f$:</span>
                <span className="text-blue-600 font-mono font-bold">{frequency} Hz (T = {period.toFixed(2)}s)</span>
              </div>
              <input 
                type="range" 
                min={0.2} 
                max={5} 
                step={0.1}
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Initial Phase phi */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">{"Pha ban đầu $\\varphi$:"}</span>
                <span className="text-blue-600 font-mono font-bold">{phase} {"$\\pi$ rad"}</span>
              </div>
              <input 
                type="range" 
                min={-1} 
                max={1} 
                step={0.25}
                value={phase}
                onChange={(e) => setPhase(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Metric Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{"Tần số góc $\\omega$:"}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{(omega).toFixed(2)} rad/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{"Vận tốc cực đại $v_{\\max}$:"}</span>
                <span className="font-mono font-bold text-emerald-600">{(amplitude * omega).toFixed(1)} cm/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{"Gia tốc cực đại $a_{\\max}$:"}</span>
                <span className="font-mono font-bold text-amber-600">{(amplitude * omega * omega / 100).toFixed(2)} m/s²</span>
              </div>
            </div>

            {/* Select curve */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Đại lượng hiển thị trên đồ thị:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setGraphMode('displacement')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    graphMode === 'displacement'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Li độ $x(t)$
                </button>
                <button
                  onClick={() => setGraphMode('velocity')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    graphMode === 'velocity'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Vận tốc $v(t)$
                </button>
                <button
                  onClick={() => setGraphMode('acceleration')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    graphMode === 'acceleration'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Gia tốc $a(t)$
                </button>
              </div>
            </div>
          </div>

          {/* Graph Screen */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  {graphMode === 'displacement' && 'Đồ thị Li độ theo Thời gian: x = A cos(ωt + φ)'}
                  {graphMode === 'velocity' && 'Đồ thị Vận tốc theo Thời gian: v = -ωA sin(ωt + φ)'}
                  {graphMode === 'acceleration' && 'Đồ thị Gia tốc theo Thời gian: a = -ω²A cos(ωt + φ)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quan sát chu kỳ $T$, biên độ và độ lệch pha trực quan theo thời gian thực
                </p>
              </div>
            </div>

            <div className="h-[340px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Thời gian t (giây)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{ 
                      value: graphMode === 'displacement' ? 'Li độ x (cm)' : graphMode === 'velocity' ? 'Vận tốc v (cm/s)' : 'Gia tốc a (m/s²)', 
                      angle: -90, 
                      position: 'insideLeft', 
                      fontSize: 11, 
                      fill: '#94a3b8' 
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [val, graphMode === 'displacement' ? 'cm' : graphMode === 'velocity' ? 'cm/s' : 'm/s²']}
                  />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />
                  {graphMode === 'displacement' && (
                    <Line type="monotone" dataKey="displacement" stroke="#2563eb" strokeWidth={3} dot={false} />
                  )}
                  {graphMode === 'velocity' && (
                    <Line type="monotone" dataKey="velocity" stroke="#10b981" strokeWidth={3} dot={false} />
                  )}
                  {graphMode === 'acceleration' && (
                    <Line type="monotone" dataKey="acceleration" stroke="#f59e0b" strokeWidth={3} dot={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 mt-4 leading-relaxed">
              <MathView content="💡 **Ghi nhớ chuẩn GDPT 2018:** Trong dao động điều hòa, li độ biến thiên điều hòa với tần số góc $\omega$. Vận tốc biến thiên cùng tần số góc nhưng sớm pha $\frac{\pi}{2}$ so với li độ. Gia tốc ngược pha với li độ ($a = -\omega^2 x$)." />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: MẠCH ĐIỆN & ĐỊNH LUẬT OHM --- */}
      {activeSubTab === 'circuit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Thiết lập mạch điện thí nghiệm</span>
            </h3>

            {/* Kiểu mạch */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cấu hình ghép mạch:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCircuitType('series')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    circuitType === 'series'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Nối tiếp (R₁-R₂)
                </button>
                <button
                  onClick={() => setCircuitType('parallel')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    circuitType === 'parallel'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Song song (R₁//R₂)
                </button>
                <button
                  onClick={() => setCircuitType('mixed')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    circuitType === 'mixed'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Hỗn hợp (R₁//R₂)+R₃
                </button>
              </div>
            </div>

            {/* Voltage U */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Hiệu điện thế nguồn $U$:</span>
                <span className="font-mono text-indigo-600 font-bold">{voltage} V</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={48} 
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* R1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Điện trở $R_1$:</span>
                <span className="font-mono text-indigo-600 font-bold">{resistor1} $\Omega$</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={50} 
                value={resistor1}
                onChange={(e) => setResistor1(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* R2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Điện trở $R_2$:</span>
                <span className="font-mono text-indigo-600 font-bold">{resistor2} $\Omega$</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={50} 
                value={resistor2}
                onChange={(e) => setResistor2(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* R3 for mixed */}
            {circuitType === 'mixed' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Điện trở nối tiếp $R_3$:</span>
                  <span className="font-mono text-indigo-600 font-bold">{resistor3} $\Omega$</span>
                </div>
                <input 
                  type="range" 
                  min={1} 
                  max={50} 
                  value={resistor3}
                  onChange={(e) => setResistor3(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            )}
          </div>

          {/* Circuit Visual & Calculations */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-2">
                Mô phỏng Trực quan Sơ đồ Mạch điện
              </h4>
              
              {/* SVG Circuit Schematic */}
              <div className="w-full h-48 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4">
                <svg viewBox="0 0 500 160" className="w-full h-full">
                  {/* Wires */}
                  <path d="M 50 80 L 120 80" stroke="#3b82f6" strokeWidth="3" fill="none" />
                  <path d="M 380 80 L 450 80" stroke="#3b82f6" strokeWidth="3" fill="none" />

                  {/* Battery Source */}
                  <circle cx="50" cy="80" r="16" fill="#1e293b" />
                  <text x="50" y="85" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">U</text>

                  {circuitType === 'series' && (
                    <>
                      {/* R1 */}
                      <rect x="150" y="65" width="80" height="30" rx="4" fill="#6366f1" />
                      <text x="190" y="84" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">R₁ ({resistor1}Ω)</text>
                      <path d="M 230 80 L 270 80" stroke="#3b82f6" strokeWidth="3" />
                      {/* R2 */}
                      <rect x="270" y="65" width="80" height="30" rx="4" fill="#8b5cf6" />
                      <text x="310" y="84" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">R₂ ({resistor2}Ω)</text>
                      <path d="M 120 80 L 150 80" stroke="#3b82f6" strokeWidth="3" />
                      <path d="M 350 80 L 380 80" stroke="#3b82f6" strokeWidth="3" />
                    </>
                  )}

                  {circuitType === 'parallel' && (
                    <>
                      <path d="M 120 80 L 160 40 L 220 40" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      <path d="M 120 80 L 160 120 L 220 120" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      {/* R1 */}
                      <rect x="220" y="25" width="80" height="30" rx="4" fill="#6366f1" />
                      <text x="260" y="44" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">R₁ ({resistor1}Ω)</text>
                      {/* R2 */}
                      <rect x="220" y="105" width="80" height="30" rx="4" fill="#8b5cf6" />
                      <text x="260" y="124" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">R₂ ({resistor2}Ω)</text>
                      <path d="M 300 40 L 340 80" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      <path d="M 300 120 L 340 80" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      <path d="M 340 80 L 380 80" stroke="#3b82f6" strokeWidth="3" />
                    </>
                  )}

                  {circuitType === 'mixed' && (
                    <>
                      {/* Parallel block (R1 // R2) */}
                      <path d="M 120 80 L 150 50 L 180 50" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      <path d="M 120 80 L 150 110 L 180 110" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      <rect x="180" y="35" width="70" height="28" rx="4" fill="#6366f1" />
                      <text x="215" y="53" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">R₁ ({resistor1}Ω)</text>
                      <rect x="180" y="95" width="70" height="28" rx="4" fill="#8b5cf6" />
                      <text x="215" y="113" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">R₂ ({resistor2}Ω)</text>
                      <path d="M 250 50 L 280 80" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      <path d="M 250 110 L 280 80" stroke="#3b82f6" strokeWidth="3" fill="none" />
                      {/* In series with R3 */}
                      <path d="M 280 80 L 300 80" stroke="#3b82f6" strokeWidth="3" />
                      <rect x="300" y="65" width="70" height="30" rx="4" fill="#10b981" />
                      <text x="335" y="84" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">R₃ ({resistor3}Ω)</text>
                      <path d="M 370 80 L 380 80" stroke="#3b82f6" strokeWidth="3" />
                    </>
                  )}

                  {/* Ammeter */}
                  <circle cx="450" cy="80" r="16" fill="#047857" />
                  <text x="450" y="85" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">A</text>
                </svg>
              </div>
            </div>

            {/* Calculated Values Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-500">Điện trở tương đương</span>
                <p className="font-mono text-base font-bold text-indigo-600 mt-0.5">{circuitCalculations.rEq} $\Omega$</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-500">Cường độ dòng điện $I$</span>
                <p className="font-mono text-base font-bold text-emerald-600 mt-0.5">{circuitCalculations.currentTotal} A</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-500">Công suất tiêu thụ $P$</span>
                <p className="font-mono text-base font-bold text-amber-600 mt-0.5">{circuitCalculations.powerTotal} W</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-500">Nhiệt lượng tỏa ra (1 phút)</span>
                <p className="font-mono text-base font-bold text-rose-600 mt-0.5">{circuitCalculations.heatEnergyIn1Min} J</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: CẨM NANG CÔNG THỨC SGK MỚI --- */}
      {activeSubTab === 'formulas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm công thức, định luật..."
                value={formulaSearch}
                onChange={(e) => setFormulaSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {(['all', '12', '11', '10'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                    selectedGrade === g
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {g === 'all' ? 'Tất cả khối lớp' : `Lớp ${g}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFormulas.map(item => (
              <div 
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      Lớp {item.grade} • {item.chapter}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">
                    {item.name}
                  </h4>
                  <div className="my-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-center overflow-x-auto">
                    <MathView content={`$$${item.latex}$$`} />
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed">
                  <MathView content={item.explain} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

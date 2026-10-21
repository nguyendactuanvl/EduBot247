import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Volume2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  HelpCircle,
  Flame,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { MathView } from './MathView';
import { TrueFalseQuestion, TrueFalseStatement } from '../types';

export function PhysicsToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'wave' | 'superposition' | 'decipher_quiz' | 'tf_quiz' | 'formulas'>('wave');

  // ==========================================
  // 1. SINGLE HARMONIC MOTION CANVAS SIMULATOR
  // ==========================================
  const [amplitude, setAmplitude] = useState<number>(5);  // A (cm)
  const [frequency, setFrequency] = useState<number>(1);  // f (Hz)
  const [phase, setPhase] = useState<number>(0);          // phi (rad / pi)
  const [graphMode, setGraphMode] = useState<'displacement' | 'velocity' | 'acceleration'>('displacement');

  const omega = 2 * Math.PI * frequency;
  const period = frequency > 0 ? 1 / frequency : 0;
  const phiRad = phase * Math.PI;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeSubTab !== 'wave') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    const centerY = height / 2;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    // Time axis
    ctx.beginPath();
    ctx.moveTo(40, centerY);
    ctx.lineTo(width - 20, centerY);
    ctx.stroke();
    // Value axis
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 20);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('t (s)', width - 35, centerY + 18);
    const labelY = graphMode === 'displacement' ? 'x (cm)' : graphMode === 'velocity' ? 'v (cm/s)' : 'a (m/s²)';
    ctx.fillText(labelY, 10, 18);

    // Plot Wave Curve
    ctx.strokeStyle = graphMode === 'displacement' ? '#38bdf8' : graphMode === 'velocity' ? '#34d399' : '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const tMax = period > 0 ? period * 2.5 : 2;
    const plotWidth = width - 60;

    for (let px = 0; px <= plotWidth; px++) {
      const t = (px / plotWidth) * tMax;
      let val = 0;

      if (graphMode === 'displacement') {
        val = amplitude * Math.cos(omega * t + phiRad); // cm
      } else if (graphMode === 'velocity') {
        val = -omega * amplitude * Math.sin(omega * t + phiRad); // cm/s
      } else {
        val = -omega * omega * amplitude * Math.cos(omega * t + phiRad) / 100; // m/s^2
      }

      const scaleY = graphMode === 'displacement' ? 12 : graphMode === 'velocity' ? 2 : 15;
      const py = centerY - val * scaleY;

      if (px === 0) ctx.moveTo(40 + px, py);
      else ctx.lineTo(40 + px, py);
    }
    ctx.stroke();

  }, [activeSubTab, amplitude, frequency, phase, graphMode, omega, period, phiRad]);


  // ==========================================
  // 2. FRESNEL VECTOR DIAGRAM & SUPERPOSITION
  // ==========================================
  const [a1, setA1] = useState<number>(4);
  const [phi1Rad, setPhi1Rad] = useState<number>(0);
  const [a2, setA2] = useState<number>(3);
  const [phi2Rad, setPhi2Rad] = useState<number>(0.5 * Math.PI); // pi/2 rad

  const fresnelCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculated resultant vector
  const deltaPhi = phi2Rad - phi1Rad;
  const resultantA = Math.sqrt(a1 * a1 + a2 * a2 + 2 * a1 * a2 * Math.cos(deltaPhi));
  const tanPhiNumerator = a1 * Math.sin(phi1Rad) + a2 * Math.sin(phi2Rad);
  const tanPhiDenominator = a1 * Math.cos(phi1Rad) + a2 * Math.cos(phi2Rad);
  const resultantPhi = Math.atan2(tanPhiNumerator, tanPhiDenominator);

  useEffect(() => {
    if (activeSubTab !== 'superposition') return;
    const canvas = fresnelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2;
    const scale = 22; // pixels per cm

    // Polar Grid Circles
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    [2, 4, 6, 8, 10].forEach(r => {
      ctx.beginPath();
      ctx.arc(originX, originY, r * scale, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Ox reference axis
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, originY);
    ctx.lineTo(width - 40, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(originX, 30);
    ctx.lineTo(originX, height - 30);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Ox', width - 35, originY + 18);

    // Draw Arrow Helper
    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const headLen = 10;
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(label, toX + 8, toY - 8);
    };

    // Vector 1 (A1)
    const v1X = originX + a1 * scale * Math.cos(phi1Rad);
    const v1Y = originY - a1 * scale * Math.sin(phi1Rad);
    drawArrow(originX, originY, v1X, v1Y, '#38bdf8', 'A₁');

    // Vector 2 (A2)
    const v2X = originX + a2 * scale * Math.cos(phi2Rad);
    const v2Y = originY - a2 * scale * Math.sin(phi2Rad);
    drawArrow(originX, originY, v2X, v2Y, '#a855f7', 'A₂');

    // Resultant Vector A (A1 + A2)
    const resX = originX + resultantA * scale * Math.cos(resultantPhi);
    const resY = originY - resultantA * scale * Math.sin(resultantPhi);

    // Parallelogram dashed lines
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(v1X, v1Y);
    ctx.lineTo(resX, resY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(v2X, v2Y);
    ctx.lineTo(resX, resY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Resultant Vector A
    drawArrow(originX, originY, resX, resY, '#f59e0b', 'A (Tổng hợp)');

  }, [activeSubTab, a1, phi1Rad, a2, phi2Rad, resultantA, resultantPhi]);


  // ==========================================
  // 3. INTERACTIVE GAME: "GIẢI MÃ ĐỒ THỊ"
  // ==========================================
  const [decipherTarget, setDecipherTarget] = useState({
    A: 6,
    T: 2,
    phiRad: 0.5 * Math.PI, // pi/2
    phiText: '\\frac{\\pi}{2}'
  });
  const [userInputA, setUserInputA] = useState<string>('');
  const [userInputT, setUserInputT] = useState<string>('');
  const [decipherScore, setDecipherScore] = useState<number>(0);
  const [decipherFeedback, setDecipherFeedback] = useState<string | null>(null);

  const generateNewDecipherGame = () => {
    const randomA = Math.floor(Math.random() * 6) + 3; // 3..8 cm
    const randomT = (Math.floor(Math.random() * 4) + 1) * 0.5; // 0.5, 1, 1.5, 2 s
    const phiOptions = [
      { rad: 0, text: '0' },
      { rad: 0.5 * Math.PI, text: '\\frac{\\pi}{2}' },
      { rad: Math.PI, text: '\\pi' },
      { rad: -0.5 * Math.PI, text: '-\\frac{\\pi}{2}' }
    ];
    const selPhi = phiOptions[Math.floor(Math.random() * phiOptions.length)];

    setDecipherTarget({
      A: randomA,
      T: randomT,
      phiRad: selPhi.rad,
      phiText: selPhi.text
    });
    setUserInputA('');
    setUserInputT('');
    setDecipherFeedback(null);
  };

  const decipherCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeSubTab !== 'decipher_quiz') return;
    const canvas = decipherCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, centerY);
    ctx.lineTo(width - 20, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 20);
    ctx.stroke();

    // Plot graph
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const omegaTarget = (2 * Math.PI) / decipherTarget.T;
    const tMax = decipherTarget.T * 2;
    const plotWidth = width - 60;

    for (let px = 0; px <= plotWidth; px++) {
      const t = (px / plotWidth) * tMax;
      const xVal = decipherTarget.A * Math.cos(omegaTarget * t + decipherTarget.phiRad);
      const py = centerY - xVal * 12;

      if (px === 0) ctx.moveTo(40 + px, py);
      else ctx.lineTo(40 + px, py);
    }
    ctx.stroke();

    // Draw Peak & T labels
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`+${decipherTarget.A}`, 10, centerY - decipherTarget.A * 12 + 4);
    ctx.fillText(`-${decipherTarget.A}`, 10, centerY + decipherTarget.A * 12 + 4);
    ctx.fillText(`t (s)`, width - 35, centerY + 18);

  }, [activeSubTab, decipherTarget]);

  const handleCheckDecipher = () => {
    const numA = parseFloat(userInputA);
    const numT = parseFloat(userInputT);

    if (Math.abs(numA - decipherTarget.A) < 0.2 && Math.abs(numT - decipherTarget.T) < 0.1) {
      setDecipherScore(prev => prev + 10);
      setDecipherFeedback(' chính xác! Bạn đã giải mã thành công đồ thị.');
    } else {
      setDecipherFeedback(` Rất tiếc! Đáp án đúng: A = ${decipherTarget.A} cm, T = ${decipherTarget.T} s.`);
    }
  };


  // ==========================================
  // 4. MA TRẬN 4 Ý ĐÚNG/SAI BỘ GD&ĐT
  // ==========================================
  const physicsTFQuestions: TrueFalseQuestion[] = [
    {
      id: 'tf-p1',
      subject: 'physics',
      topic: 'Đồ thị dao động điều hòa',
      scenario: 'Một vật nhỏ có khối lượng $m = 200\\text{ g}$ thực hiện dao động điều hòa với đồ thị li độ - thời gian $x(t)$ là hình sin có biên độ đỉnh $A = 6\\text{ cm}$ và khoảng thời gian giữa $2$ lần liên tiếp vật đi qua VTCB là $\\Delta t = 0{,}5\\text{ s}$. Tại $t = 0$, vật đi qua VTCB theo chiều dương.',
      statements: [
        { id: 'a', text: 'Tần số góc dao động của vật là $\\omega = 2\\pi\\text{ rad/s}$.', isCorrect: true, explanation: 'Khoảng thời gian 2 lần đi qua VTCB liên tiếp là $T/2 = 0{,}5\\text{ s} \\Rightarrow T = 1\\text{ s} \\Rightarrow \\omega = 2\\pi/T = 2\\pi\\text{ rad/s}$.' },
        { id: 'b', text: 'Phương trình dao động của vật là $x = 6\\cos(2\\pi t - \\pi/2)\\text{ cm}$.', isCorrect: true, explanation: 'Tại $t = 0, x = 0$ theo chiều dương $\\Rightarrow \\varphi = -\\pi/2\\text{ rad}$.' },
        { id: 'c', text: 'Vận tốc cực đại của vật có giá trị là $v_{\\max} = 12\\text{ cm/s}$.', isCorrect: false, explanation: '$v_{\\max} = \\omega A = 2\\pi \\cdot 6 = 12\\pi \\approx 37{,}7\\text{ cm/s} \\neq 12\\text{ cm/s}$.' },
        { id: 'd', text: 'Động năng cực đại của vật đạt giá trị $W_{đ\\max} \\approx 0{,}0142\\text{ J}$.', isCorrect: true, explanation: '$W_{đ\\max} = \\frac{1}{2} m \\omega^2 A^2 = \\frac{1}{2} \\cdot 0{,}2 \\cdot (2\\pi)^2 \\cdot 0{,}06^2 \\approx 0{,}0142\\text{ J}$.' }
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
    const q = physicsTFQuestions.find(item => item.id === qId);
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
    <div className="space-y-6 pb-12 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
            <Zap className="w-4 h-4 text-cyan-200" />
            <span>Chương trình Vật lý THPT GDPT 2018 (Lớp 10, 11, 12)</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Bộ Công Cụ Vật Lý THPT Đa Năng & Giản Đồ Fresnel
          </h2>
          
          <MathView 
            content="Mô phỏng đồ thị dao động điều hòa $x(t)$, $v(t)$, $a(t)$, Tổng hợp $2$ dao động cùng phương qua Giản đồ vector Fresnel, Game Đố vui Giải mã đồ thị và Đề thi Đúng/Sai $4$ ý chuẩn ma trận Bộ GD&ĐT."
            className="text-xs sm:text-sm text-cyan-100 max-w-3xl leading-relaxed" 
          />
        </div>
      </div>

      {/* SUB-TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {[
          { id: 'wave', label: '1. Đồ thị Li độ - Vận tốc - Gia tốc', icon: Activity },
          { id: 'superposition', label: '2. Giản đồ Fresnel (Tổng hợp 2 dao động)', icon: Sliders },
          { id: 'decipher_quiz', label: '3. Game Giải mã Đồ thị', icon: Sparkles },
          { id: 'tf_quiz', label: '4. Trắc nghiệm Đúng/Sai 4 ý (Bộ GD&ĐT)', icon: ShieldCheck },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUBTAB 1: SINGLE OSCILLATION GRAPH
          ========================================================================= */}
      {activeSubTab === 'wave' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
              Bộ điều khiển tham số
            </h3>

            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'displacement', label: 'Li độ x(t)' },
                { id: 'velocity', label: 'Vận tốc v(t)' },
                { id: 'acceleration', label: 'Gia tốc a(t)' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setGraphMode(m.id as any)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${
                    graphMode === m.id
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Biên độ $A$:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono">{amplitude} cm</span>
                </div>
                <input 
                  type="range" min={1} max={10} step={0.5} 
                  value={amplitude} 
                  onChange={e => setAmplitude(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500" 
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Tần số $f$:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono">{frequency} Hz (T = {period.toFixed(2)}s)</span>
                </div>
                <input 
                  type="range" min={0.2} max={3} step={0.1} 
                  value={frequency} 
                  onChange={e => setFrequency(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500" 
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Pha ban đầu $\varphi$:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono">{phase} $\pi$ rad</span>
                </div>
                <input 
                  type="range" min={-1} max={1} step={0.25} 
                  value={phase} 
                  onChange={e => setPhase(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500" 
                />
              </div>
            </div>

            {/* Calculated Values */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="font-bold text-slate-500 block mb-1">Đại lượng đặc trưng:</span>
              <p>• Tần số góc: <MathView inline content={`$\\omega = ${omega.toFixed(2)}$ rad/s`} /></p>
              <p>• Vận tốc cực đại: <MathView inline content={`$v_{\\max} = ${(omega * amplitude).toFixed(1)}$ cm/s`} /></p>
              <p>• Gia tốc cực đại: <MathView inline content={`$a_{\\max} = ${((omega * omega * amplitude)/100).toFixed(2)}$ m/s$^2$`} /></p>
            </div>
          </div>

          {/* Canvas Graph Viewport */}
          <div className="lg:col-span-8 bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-cyan-400">Đồ thị thời gian tương tác</span>
              <span className="font-mono text-slate-400">f = {frequency} Hz</span>
            </div>

            <div className="w-full h-[320px] flex items-center justify-center my-2 overflow-hidden">
              <canvas ref={canvasRef} width={640} height={300} className="max-w-full max-h-full" />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: FRESNEL VECTOR DIAGRAM & SUPERPOSITION
          ========================================================================= */}
      {activeSubTab === 'superposition' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
              Hai dao động thành phần cùng phương
            </h3>

            {/* Oscillator 1 */}
            <div className="p-3 bg-cyan-50/50 dark:bg-cyan-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-900/40 space-y-2 text-xs">
              <span className="font-bold text-cyan-700 dark:text-cyan-300 block">Dao động 1 ($x_1$):</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">$A_1$ (cm):</span>
                  <input type="range" min={1} max={8} value={a1} onChange={e => setA1(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
                  <span className="font-mono font-bold text-cyan-600">{a1} cm</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">$\varphi_1$ (rad):</span>
                  <input type="range" min={-1} max={1} step={0.25} value={phi1Rad / Math.PI} onChange={e => setPhi1Rad(parseFloat(e.target.value) * Math.PI)} className="w-full accent-cyan-500" />
                  <span className="font-mono font-bold text-cyan-600">{(phi1Rad / Math.PI).toFixed(2)}$\pi$</span>
                </div>
              </div>
            </div>

            {/* Oscillator 2 */}
            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/40 space-y-2 text-xs">
              <span className="font-bold text-purple-700 dark:text-purple-300 block">Dao động 2 ($x_2$):</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">$A_2$ (cm):</span>
                  <input type="range" min={1} max={8} value={a2} onChange={e => setA2(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                  <span className="font-mono font-bold text-purple-600">{a2} cm</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">$\varphi_2$ (rad):</span>
                  <input type="range" min={-1} max={1} step={0.25} value={phi2Rad / Math.PI} onChange={e => setPhi2Rad(parseFloat(e.target.value) * Math.PI)} className="w-full accent-purple-500" />
                  <span className="font-mono font-bold text-purple-600">{(phi2Rad / Math.PI).toFixed(2)}$\pi$</span>
                </div>
              </div>
            </div>

            {/* Resulting Calculation */}
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs space-y-1.5">
              <span className="font-bold text-amber-800 dark:text-amber-300 block">Kết quả Dao động Tổng hợp ($x = x_1 + x_2$):</span>
              <p>• Biên độ tổng hợp: <MathView inline content={`$A = ${resultantA.toFixed(2)}$ cm`} /></p>
              <p>• Pha ban đầu tổng hợp: <MathView inline content={`$\\varphi = ${(resultantPhi / Math.PI).toFixed(2)}\\pi$ rad`} /></p>
              <p className="text-[11px] text-slate-500 mt-1">Độ lệch pha <MathView inline content={`$\\Delta\\varphi = ${((phi2Rad - phi1Rad)/Math.PI).toFixed(2)}\\pi$ rad`} />.</p>
            </div>
          </div>

          {/* Fresnel Vector Diagram Canvas */}
          <div className="lg:col-span-7 bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-amber-400">Giản đồ Vectơ quay Fresnel (2D Canvas)</span>
              <span className="font-mono text-slate-400">Vector A = A1 + A2</span>
            </div>

            <div className="w-full h-[340px] flex items-center justify-center my-2 overflow-hidden">
              <canvas ref={fresnelCanvasRef} width={520} height={320} className="max-w-full max-h-full" />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: DECIPHER WAVE GRAPH GAME
          ========================================================================= */}
      {activeSubTab === 'decipher_quiz' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">Trò chơi Tương tác</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Giải mã Đồ thị Dao động</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-2xl text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Điểm: {decipherScore} XP</span>
              </div>
              <button onClick={generateNewDecipherGame} className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tạo đồ thị mới</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Canvas graph */}
            <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center">
              <canvas ref={decipherCanvasRef} width={500} height={260} className="max-w-full" />
            </div>

            {/* Answer inputs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Xác định Biên độ $A$ (cm):</label>
                  <input type="number" placeholder="Ví dụ: 6" value={userInputA} onChange={e => setUserInputA(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Xác định Chu kỳ $T$ (s):</label>
                  <input type="number" step={0.1} placeholder="Ví dụ: 2" value={userInputT} onChange={e => setUserInputT(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                </div>
              </div>

              <button onClick={handleCheckDecipher} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md transition-all">
                Kiểm tra Kết quả
              </button>

              {decipherFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold border ${decipherFeedback.includes('chính xác') ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-rose-50 text-rose-700 border-rose-300'}`}>
                  {decipherFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: TRUE/FALSE 4-STATEMENT QUESTION MATRIX (BỘ GD&ĐT)
          ========================================================================= */}
      {activeSubTab === 'tf_quiz' && (
        <div className="space-y-6">
          {physicsTFQuestions.map(q => {
            const isDone = tfSubmitted[q.id];
            const currentScore = calculateTFScore(q.id);

            return (
              <div key={q.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    Dạng Đề thi Mới: Trắc nghiệm Đúng/Sai 4 ý
                  </span>
                  {isDone && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-black border border-amber-500/30">
                      Điểm đạt được: {currentScore} / 1.0 điểm
                    </span>
                  )}
                </div>

                {/* Scenario Text */}
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  <MathView content={q.scenario} />
                </div>

                {/* 4 Statements */}
                <div className="space-y-3">
                  {q.statements.map(s => {
                    const userSel = (tfUserSelections[q.id] || {})[s.id];
                    const isStatementRight = userSel === s.isCorrect;

                    return (
                      <div key={s.id} className={`p-4 rounded-2xl border transition-all space-y-2 ${isDone ? (isStatementRight ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300' : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300') : 'bg-slate-50/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2.5 flex-1">
                            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center shrink-0">{s.id})</span>
                            <div className="text-slate-800 dark:text-slate-200 font-semibold pt-0.5">
                              <MathView content={s.text} />
                            </div>
                          </div>

                          {/* True / False Toggle Buttons */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              disabled={isDone}
                              onClick={() => handleSelectTF(q.id, s.id, true)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                                userSel === true 
                                  ? 'bg-emerald-600 text-white shadow-xs' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/20'
                              }`}
                            >
                              Đúng
                            </button>
                            <button
                              disabled={isDone}
                              onClick={() => handleSelectTF(q.id, s.id, false)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                                userSel === false 
                                  ? 'bg-rose-600 text-white shadow-xs' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-500/20'
                              }`}
                            >
                              Sai
                            </button>
                          </div>
                        </div>

                        {/* Explanation after submission */}
                        {isDone && (
                          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mt-2">
                            <span className="font-bold text-cyan-600 block mb-1">Giải thích chi tiết:</span>
                            <MathView content={s.explanation} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isDone && (
                  <button
                    onClick={() => setTfSubmitted(prev => ({ ...prev, [q.id]: true }))}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all"
                  >
                    Chấm Điểm Theo Thang GDPT 2018 (0.1 - 0.25 - 0.5 - 1.0)
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

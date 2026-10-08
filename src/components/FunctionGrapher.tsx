import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  LineChart, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Layers, 
  Eye, 
  EyeOff, 
  Sparkles, 
  BookOpen, 
  Settings2, 
  Table as TableIcon, 
  ChevronRight, 
  HelpCircle,
  Sliders,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { MathView } from './MathView';
import { compile } from 'mathjs';

// Các loại hàm số theo chuẩn SGK Kết nối tri thức với cuộc sống
export type FunctionCategory = 'thcs' | 'thpt_basic' | 'thpt_advanced' | 'custom';

export type FunctionType = 
  | 'linear'            // y = ax + b (Lớp 8, 9)
  | 'quadratic_simple'  // y = ax^2 (Lớp 9)
  | 'quadratic_full'    // y = ax^2 + bx + c (Lớp 10)
  | 'cubic'             // y = ax^3 + bx^2 + cx + d (Lớp 12)
  | 'rational_1_1'      // y = (ax + b)/(cx + d) (Lớp 12)
  | 'rational_2_1'      // y = (ax^2 + bx + c)/(px + q) (Lớp 12 - KNTT)
  | 'trig_sin'          // y = a*sin(bx + c) (Lớp 11)
  | 'trig_cos'          // y = a*cos(bx + c) (Lớp 11)
  | 'trig_tan'          // y = a*tan(bx) (Lớp 11)
  | 'trig_cot'          // y = a*cot(bx) (Lớp 11)
  | 'exponential'       // y = a^x (Lớp 11)
  | 'logarithmic'       // y = log_a(x) (Lớp 11)
  | 'custom_expr';      // f(x) bất kỳ

interface FunctionPreset {
  id: FunctionType;
  name: string;
  grade: string;
  formulaLatex: string;
  category: FunctionCategory;
  defaultParams: Record<string, number>;
  paramDescriptions: Record<string, string>;
  presets: { label: string; params: Record<string, number> }[];
}

const FUNCTION_PRESETS: FunctionPreset[] = [
  // CẤP 2 (THCS)
  {
    id: 'linear',
    name: 'Hàm số bậc nhất',
    grade: 'Toán 8, 9 - KNTT',
    category: 'thcs',
    formulaLatex: '$y = ax + b$ ($a \\neq 0$)',
    defaultParams: { a: 2, b: -3 },
    paramDescriptions: { a: 'Hệ số góc $a$', b: 'Tung độ gốc $b$' },
    presets: [
      { label: '$y = 2x - 3$', params: { a: 2, b: -3 } },
      { label: '$y = -x + 2$', params: { a: -1, b: 2 } },
      { label: '$y = \\frac{1}{2}x + 1$', params: { a: 0.5, b: 1 } },
      { label: '$y = 3x$', params: { a: 3, b: 0 } },
    ]
  },
  {
    id: 'quadratic_simple',
    name: 'Hàm số bậc hai đơn giản',
    grade: 'Toán 9 - KNTT',
    category: 'thcs',
    formulaLatex: '$y = ax^2$ ($a \\neq 0$)',
    defaultParams: { a: 1 },
    paramDescriptions: { a: 'Hệ số $a$' },
    presets: [
      { label: '$y = x^2$', params: { a: 1 } },
      { label: '$y = 2x^2$', params: { a: 2 } },
      { label: '$y = -x^2$', params: { a: -1 } },
      { label: '$y = -\\frac{1}{2}x^2$', params: { a: -0.5 } },
    ]
  },

  // CẤP 3 (THPT - BẬC 10 & 11)
  {
    id: 'quadratic_full',
    name: 'Hàm số bậc hai đầy đủ',
    grade: 'Toán 10 - KNTT',
    category: 'thpt_basic',
    formulaLatex: '$y = ax^2 + bx + c$ ($a \\neq 0$)',
    defaultParams: { a: 1, b: -4, c: 3 },
    paramDescriptions: { a: 'Hệ số $a$', b: 'Hệ số $b$', c: 'Hệ số $c$' },
    presets: [
      { label: '$y = x^2 - 4x + 3$', params: { a: 1, b: -4, c: 3 } },
      { label: '$y = -x^2 + 2x + 3$', params: { a: -1, b: 2, c: 3 } },
      { label: '$y = 2x^2 - 4x + 2$', params: { a: 2, b: -4, c: 2 } },
      { label: '$y = -2x^2 + 1$', params: { a: -2, b: 0, c: 1 } },
    ]
  },
  {
    id: 'trig_sin',
    name: 'Hàm số lượng giác Sin',
    grade: 'Toán 11 - KNTT',
    category: 'thpt_basic',
    formulaLatex: '$y = A\\sin(\\omega x + \\varphi)$',
    defaultParams: { a: 1, b: 1, c: 0 },
    paramDescriptions: { a: 'Biên độ $A$', b: 'Tần số góc $\\omega$', c: 'Pha ban đầu $\\varphi$' },
    presets: [
      { label: '$y = \\sin(x)$', params: { a: 1, b: 1, c: 0 } },
      { label: '$y = 2\\sin(2x)$', params: { a: 2, b: 2, c: 0 } },
      { label: '$y = -\\sin(x)$', params: { a: -1, b: 1, c: 0 } },
    ]
  },
  {
    id: 'trig_cos',
    name: 'Hàm số lượng giác Cosin',
    grade: 'Toán 11 - KNTT',
    category: 'thpt_basic',
    formulaLatex: '$y = A\\cos(\\omega x + \\varphi)$',
    defaultParams: { a: 1, b: 1, c: 0 },
    paramDescriptions: { a: 'Biên độ $A$', b: 'Tần số góc $\\omega$', c: 'Pha ban đầu $\\varphi$' },
    presets: [
      { label: '$y = \\cos(x)$', params: { a: 1, b: 1, c: 0 } },
      { label: '$y = 2\\cos(2x)$', params: { a: 2, b: 2, c: 0 } },
    ]
  },
  {
    id: 'trig_tan',
    name: 'Hàm số lượng giác Tang',
    grade: 'Toán 11 - KNTT',
    category: 'thpt_basic',
    formulaLatex: '$y = a\\tan(bx)$ ($b \\neq 0$)',
    defaultParams: { a: 1, b: 1 },
    paramDescriptions: { a: 'Hệ số $a$', b: 'Hệ số góc $b$' },
    presets: [
      { label: '$y = \\tan(x)$', params: { a: 1, b: 1 } },
      { label: '$y = 2\\tan(x)$', params: { a: 2, b: 1 } },
      { label: '$y = \\tan(2x)$', params: { a: 1, b: 2 } },
      { label: '$y = -\\tan(x)$', params: { a: -1, b: 1 } },
    ]
  },
  {
    id: 'trig_cot',
    name: 'Hàm số lượng giác Cô-tang',
    grade: 'Toán 11 - KNTT',
    category: 'thpt_basic',
    formulaLatex: '$y = a\\cot(bx)$ ($b \\neq 0$)',
    defaultParams: { a: 1, b: 1 },
    paramDescriptions: { a: 'Hệ số $a$', b: 'Hệ số góc $b$' },
    presets: [
      { label: '$y = \\cot(x)$', params: { a: 1, b: 1 } },
      { label: '$y = 2\\cot(x)$', params: { a: 2, b: 1 } },
      { label: '$y = \\cot(2x)$', params: { a: 1, b: 2 } },
      { label: '$y = -\\cot(x)$', params: { a: -1, b: 1 } },
    ]
  },
  {
    id: 'exponential',
    name: 'Hàm số Mũ',
    grade: 'Toán 11 - KNTT',
    category: 'thpt_basic',
    formulaLatex: '$y = a^x$ ($a > 0, a \\neq 1$)',
    defaultParams: { a: 2 },
    paramDescriptions: { a: 'Cơ số $a$' },
    presets: [
      { label: '$y = 2^x$', params: { a: 2 } },
      { label: '$y = e^x \\approx 2.718^x$', params: { a: Math.E } },
      { label: '$y = (\\frac{1}{2})^x$', params: { a: 0.5 } },
    ]
  },
  {
    id: 'logarithmic',
    name: 'Hàm số Logarit',
    grade: 'Toán 11 - KNTT',
    category: 'thpt_basic',
    formulaLatex: '$y = \\log_a(x)$ ($a > 0, a \\neq 1$)',
    defaultParams: { a: 2 },
    paramDescriptions: { a: 'Cơ số $a$' },
    presets: [
      { label: '$y = \\log_2(x)$', params: { a: 2 } },
      { label: '$y = \\ln(x)$', params: { a: Math.E } },
      { label: '$y = \\log_{0.5}(x)$', params: { a: 0.5 } },
    ]
  },

  // CẤP 3 (THPT - BẬC 12 TRỌNG TÂM SGK KẾT NỐI TRI THỨC)
  {
    id: 'cubic',
    name: 'Hàm số bậc ba',
    grade: 'Toán 12 - KNTT',
    category: 'thpt_advanced',
    formulaLatex: '$y = ax^3 + bx^2 + cx + d$ ($a \\neq 0$)',
    defaultParams: { a: 1, b: -3, c: 0, d: 2 },
    paramDescriptions: { a: 'Hệ số $a$', b: 'Hệ số $b$', c: 'Hệ số $c$', d: 'Hệ số $d$' },
    presets: [
      { label: '$y = x^3 - 3x^2 + 2$', params: { a: 1, b: -3, c: 0, d: 2 } },
      { label: '$y = -x^3 + 3x$', params: { a: -1, b: 0, c: 3, d: 0 } },
      { label: '$y = x^3 - 3x + 1$', params: { a: 1, b: 0, c: -3, d: 1 } },
      { label: '$y = x^3 + 3x^2 + 3x + 1$', params: { a: 1, b: 3, c: 3, d: 1 } },
      { label: '$y = -\\frac{1}{3}x^3 + x^2 - x$', params: { a: -0.333, b: 1, c: -1, d: 0 } },
    ]
  },
  {
    id: 'rational_1_1',
    name: 'Phân thức bậc nhất / bậc nhất',
    grade: 'Toán 12 - KNTT',
    category: 'thpt_advanced',
    formulaLatex: '$y = \\frac{ax + b}{cx + d}$ ($c \\neq 0, ad - bc \\neq 0$)',
    defaultParams: { a: 2, b: -1, c: 1, d: 1 },
    paramDescriptions: { a: 'Tử: $a$', b: 'Tử: $b$', c: 'Mẫu: $c$', d: 'Mẫu: $d$' },
    presets: [
      { label: '$y = \\frac{2x - 1}{x + 1}$', params: { a: 2, b: -1, c: 1, d: 1 } },
      { label: '$y = \\frac{x + 2}{x - 1}$', params: { a: 1, b: 2, c: 1, d: -1 } },
      { label: '$y = \\frac{-x + 2}{x + 1}$', params: { a: -1, b: 2, c: 1, d: 1 } },
      { label: '$y = \\frac{2x + 3}{x - 2}$', params: { a: 2, b: 3, c: 1, d: -2 } },
    ]
  },
  {
    id: 'rational_2_1',
    name: 'Phân thức bậc hai / bậc nhất',
    grade: 'Toán 12 - KNTT (Chuẩn mới)',
    category: 'thpt_advanced',
    formulaLatex: '$y = \\frac{ax^2 + bx + c}{px + q}$ ($a \\neq 0, p \\neq 0$)',
    defaultParams: { a: 1, b: -1, c: 1, p: 1, q: -1 },
    paramDescriptions: { a: 'Tử: $a$', b: 'Tử: $b$', c: 'Tử: $c$', p: 'Mẫu: $p$', q: 'Mẫu: $q$' },
    presets: [
      { label: '$y = \\frac{x^2 - x + 1}{x - 1}$ ($= x + \\frac{1}{x-1}$)', params: { a: 1, b: -1, c: 1, p: 1, q: -1 } },
      { label: '$y = \\frac{x^2 + 2x + 2}{x + 1}$', params: { a: 1, b: 2, c: 2, p: 1, q: 1 } },
      { label: '$y = \\frac{2x^2 + x - 1}{x + 2}$', params: { a: 2, b: 1, c: -1, p: 1, q: 2 } },
      { label: '$y = \\frac{-x^2 + 3x - 1}{x - 2}$', params: { a: -1, b: 3, c: -1, p: 1, q: -2 } },
    ]
  },
  {
    id: 'custom_expr',
    name: 'Hàm số biểu thức tùy chọn',
    grade: 'Mở rộng đa năng',
    category: 'custom',
    formulaLatex: '$y = f(x)$',
    defaultParams: {},
    paramDescriptions: {},
    presets: [
      { label: '$x^4 - 2x^2 + 1$', params: {} },
      { label: '$\\sqrt{4 - x^2}$', params: {} },
      { label: '$\\frac{1}{x^2 + 1}$', params: {} },
      { label: '$x \\cdot e^{-x}$', params: {} },
    ]
  }
];

export function FunctionGrapher() {
  const [selectedFunctionType, setSelectedFunctionType] = useState<FunctionType>('cubic');
  const [activeCategory, setActiveCategory] = useState<FunctionCategory>('thpt_advanced');
  const [params, setParams] = useState<Record<string, number>>({ a: 1, b: -3, c: 0, d: 2 });
  const [customExpr, setCustomExpr] = useState<string>('x^3 - 3*x^2 + 2');
  
  // Controls for interactive canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(40); // 40 pixels per unit
  const [originOffset, setOriginOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAsymptotes, setShowAsymptotes] = useState<boolean>(true);
  const [showSpecialPoints, setShowSpecialPoints] = useState<boolean>(true);

  // Active Preset definition
  const currentPreset = useMemo(() => {
    return FUNCTION_PRESETS.find(p => p.id === selectedFunctionType) || FUNCTION_PRESETS[0];
  }, [selectedFunctionType]);

  // Switch function type
  const handleSelectFunction = (preset: FunctionPreset) => {
    setSelectedFunctionType(preset.id);
    setParams(preset.defaultParams);
    if (preset.id === 'custom_expr') {
      setCustomExpr('x^3 - 3*x^2 + 2');
    }
    // reset origin
    setOriginOffset({ x: 0, y: 0 });
  };

  // Evaluate function y = f(x)
  const evaluateFunction = useCallback((x: number): number | null => {
    try {
      const { a = 1, b = 0, c = 0, d = 0, p = 1, q = 0 } = params;
      switch (selectedFunctionType) {
        case 'linear':
          return a * x + b;
        case 'quadratic_simple':
          return a * x * x;
        case 'quadratic_full':
          return a * x * x + b * x + c;
        case 'cubic':
          return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
        case 'rational_1_1': {
          const denom = c * x + d;
          if (Math.abs(denom) < 1e-7) return null;
          return (a * x + b) / denom;
        }
        case 'rational_2_1': {
          const denom = p * x + q;
          if (Math.abs(denom) < 1e-7) return null;
          return (a * x * x + b * x + c) / denom;
        }
        case 'trig_sin':
          return a * Math.sin(b * x + c);
        case 'trig_cos':
          return a * Math.cos(b * x + c);
        case 'trig_tan': {
          if (b === 0) return null;
          const cosVal = Math.cos(b * x);
          if (Math.abs(cosVal) < 1e-4) return null;
          return a * Math.tan(b * x);
        }
        case 'trig_cot': {
          if (b === 0) return null;
          const sinVal = Math.sin(b * x);
          if (Math.abs(sinVal) < 1e-4) return null;
          return a * (Math.cos(b * x) / sinVal);
        }
        case 'exponential':
          if (a <= 0) return null;
          return Math.pow(a, x);
        case 'logarithmic':
          if (x <= 0 || a <= 0 || a === 1) return null;
          return Math.log(x) / Math.log(a);
        case 'custom_expr': {
          const compiled = compile(customExpr);
          const res = compiled.evaluate({ x, e: Math.E, pi: Math.PI });
          if (typeof res !== 'number' || isNaN(res) || !isFinite(res)) return null;
          return res;
        }
        default:
          return 0;
      }
    } catch {
      return null;
    }
  }, [selectedFunctionType, params, customExpr]);

  // Special points and Asymptotes
  const specialFeatures = useMemo(() => {
    const { a = 1, b = 0, c = 0, d = 0, p = 1, q = 0 } = params;
    const points: { x: number; y: number; label: string; color: string }[] = [];
    const asymptotes: { type: 'vertical' | 'horizontal' | 'oblique'; val?: number; m?: number; n?: number; label: string }[] = [];

    if (selectedFunctionType === 'linear') {
      // Giao Oy
      points.push({ x: 0, y: b, label: `Oy(0; ${b})`, color: '#2563eb' });
      // Giao Ox
      if (a !== 0) {
        const x0 = Number((-b / a).toFixed(2));
        points.push({ x: x0, y: 0, label: `Ox(${x0}; 0)`, color: '#2563eb' });
      }
    } else if (selectedFunctionType === 'quadratic_simple') {
      points.push({ x: 0, y: 0, label: 'Đỉnh O(0; 0)', color: '#dc2626' });
    } else if (selectedFunctionType === 'quadratic_full') {
      if (a !== 0) {
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        points.push({ x: Number(vx.toFixed(2)), y: Number(vy.toFixed(2)), label: `Đỉnh I(${vx.toFixed(2)}; ${vy.toFixed(2)})`, color: '#dc2626' });
      }
      points.push({ x: 0, y: c, label: `Oy(0; ${c})`, color: '#2563eb' });
    } else if (selectedFunctionType === 'cubic') {
      // Đạo hàm y' = 3ax^2 + 2bx + c
      if (a !== 0) {
        const deltaPrime = b * b - 3 * a * c;
        if (deltaPrime > 0) {
          const x1 = (-b - Math.sqrt(deltaPrime)) / (3 * a);
          const x2 = (-b + Math.sqrt(deltaPrime)) / (3 * a);
          const y1 = a * Math.pow(x1, 3) + b * Math.pow(x1, 2) + c * x1 + d;
          const y2 = a * Math.pow(x2, 3) + b * Math.pow(x2, 2) + c * x2 + d;
          points.push({ x: Number(x1.toFixed(2)), y: Number(y1.toFixed(2)), label: `Cực trị (${x1.toFixed(2)}; ${y1.toFixed(2)})`, color: '#16a34a' });
          points.push({ x: Number(x2.toFixed(2)), y: Number(y2.toFixed(2)), label: `Cực trị (${x2.toFixed(2)}; ${y2.toFixed(2)})`, color: '#9333ea' });
        }
        // Điểm uốn U
        const xu = -b / (3 * a);
        const yu = a * Math.pow(xu, 3) + b * Math.pow(xu, 2) + c * xu + d;
        points.push({ x: Number(xu.toFixed(2)), y: Number(yu.toFixed(2)), label: `Điểm uốn U(${xu.toFixed(2)}; ${yu.toFixed(2)})`, color: '#ea580c' });
      }
      points.push({ x: 0, y: d, label: `Oy(0; ${d})`, color: '#2563eb' });
    } else if (selectedFunctionType === 'rational_1_1') {
      if (c !== 0) {
        const xDiscont = -d / c;
        const yHoriz = a / c;
        asymptotes.push({ type: 'vertical', val: xDiscont, label: `TCĐ: x = ${xDiscont.toFixed(2)}` });
        asymptotes.push({ type: 'horizontal', val: yHoriz, label: `TCN: y = ${yHoriz.toFixed(2)}` });
        points.push({ x: Number(xDiscont.toFixed(2)), y: Number(yHoriz.toFixed(2)), label: `Tâm I(${xDiscont.toFixed(2)}; ${yHoriz.toFixed(2)})`, color: '#ea580c' });
      }
    } else if (selectedFunctionType === 'rational_2_1') {
      if (p !== 0) {
        const xDiscont = -q / p;
        asymptotes.push({ type: 'vertical', val: xDiscont, label: `TCĐ: x = ${xDiscont.toFixed(2)}` });
        // Chia đa thức: ax^2 + bx + c cho px + q
        // mx = (a/p)x, n = (b - m*q)/p
        const m = a / p;
        const n = (b - m * q) / p;
        asymptotes.push({ type: 'oblique', m, n, label: `TCX: y = ${m.toFixed(2)}x ${n >= 0 ? '+' : ''} ${n.toFixed(2)}` });
        const yI = m * xDiscont + n;
        points.push({ x: Number(xDiscont.toFixed(2)), y: Number(yI.toFixed(2)), label: `Tâm đối xứng I(${xDiscont.toFixed(2)}; ${yI.toFixed(2)})`, color: '#ea580c' });
      }
    } else if (selectedFunctionType === 'exponential') {
      asymptotes.push({ type: 'horizontal', val: 0, label: 'TCN: y = 0' });
      points.push({ x: 0, y: 1, label: 'A(0; 1)', color: '#2563eb' });
    } else if (selectedFunctionType === 'logarithmic') {
      asymptotes.push({ type: 'vertical', val: 0, label: 'TCĐ: x = 0' });
      points.push({ x: 1, y: 0, label: 'A(1; 0)', color: '#2563eb' });
    } else if (selectedFunctionType === 'trig_tan') {
      if (b !== 0) {
        const halfP = Math.PI / (2 * Math.abs(b));
        const period = Math.PI / Math.abs(b);
        [-period - halfP, -halfP, halfP, period + halfP].forEach((asympX) => {
          asymptotes.push({ type: 'vertical', val: Number(asympX.toFixed(2)), label: `TCĐ: x = ${asympX.toFixed(2)}` });
        });
        points.push({ x: 0, y: 0, label: 'O(0; 0)', color: '#2563eb' });
      }
    } else if (selectedFunctionType === 'trig_cot') {
      if (b !== 0) {
        const period = Math.PI / Math.abs(b);
        [-period, 0, period].forEach((asympX) => {
          asymptotes.push({ type: 'vertical', val: Number(asympX.toFixed(2)), label: `TCĐ: x = ${asympX.toFixed(2)}` });
        });
        const halfP = Math.PI / (2 * Math.abs(b));
        points.push({ x: Number(halfP.toFixed(2)), y: 0, label: `(${halfP.toFixed(2)}; 0)`, color: '#2563eb' });
        points.push({ x: Number((-halfP).toFixed(2)), y: 0, label: `(${-halfP.toFixed(2)}; 0)`, color: '#2563eb' });
      }
    }

    return { points, asymptotes };
  }, [selectedFunctionType, params]);

  // Draw Graph on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size
    const width = canvas.width;
    const height = canvas.height;

    // Origin in canvas coordinates
    const originX = width / 2 + originOffset.x;
    const originY = height / 2 + originOffset.y;

    // Clear background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Grid
    if (showGrid) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#f1f5f9';

      const minXVal = (0 - originX) / zoom;
      const maxXVal = (width - originX) / zoom;
      const minYVal = (originY - height) / zoom;
      const maxYVal = originY / zoom;

      // Choose grid step size based on zoom
      let step = 1;
      if (zoom < 25) step = 2;
      if (zoom < 12) step = 5;
      if (zoom > 70) step = 0.5;

      // Minor / major vertical grid
      const startX = Math.floor(minXVal / step) * step;
      for (let x = startX; x <= maxXVal; x += step) {
        const cx = originX + x * zoom;
        ctx.beginPath();
        ctx.strokeStyle = Math.abs(x) < 1e-6 ? '#94a3b8' : '#f1f5f9';
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
        ctx.stroke();

        // Label on X axis
        if (Math.abs(x) > 1e-6 && cx > 20 && cx < width - 20) {
          ctx.fillStyle = '#64748b';
          ctx.font = '11px sans-serif';
          ctx.fillText(Number(x.toFixed(2)).toString(), cx - 5, Math.min(Math.max(originY + 14, 15), height - 5));
        }
      }

      // Horizontal grid
      const startY = Math.floor(minYVal / step) * step;
      for (let y = startY; y <= maxYVal; y += step) {
        const cy = originY - y * zoom;
        ctx.beginPath();
        ctx.strokeStyle = Math.abs(y) < 1e-6 ? '#94a3b8' : '#f1f5f9';
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
        ctx.stroke();

        // Label on Y axis
        if (Math.abs(y) > 1e-6 && cy > 20 && cy < height - 20) {
          ctx.fillStyle = '#64748b';
          ctx.font = '11px sans-serif';
          ctx.fillText(Number(y.toFixed(2)).toString(), Math.min(Math.max(originX - 24, 5), width - 30), cy + 4);
        }
      }
    }

    // 2. Draw Main Axes (Ox and Oy)
    ctx.lineWidth = 1.75;
    ctx.strokeStyle = '#334155';
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Arrows
    ctx.fillStyle = '#334155';
    // Arrow X
    ctx.beginPath();
    ctx.moveTo(width - 8, originY - 4);
    ctx.lineTo(width, originY);
    ctx.lineTo(width - 8, originY + 4);
    ctx.fill();
    // Arrow Y
    ctx.beginPath();
    ctx.moveTo(originX - 4, 8);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 4, 8);
    ctx.fill();

    // Axis labels: O, x, y
    ctx.font = 'italic bold 13px serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('x', width - 14, originY - 8);
    ctx.fillText('y', originX + 8, 14);
    ctx.fillText('O', originX - 12, originY + 14);

    // 3. Draw Asymptotes (Dashed lines)
    if (showAsymptotes && specialFeatures.asymptotes.length > 0) {
      ctx.setLineDash([6, 4]);
      specialFeatures.asymptotes.forEach(asymp => {
        ctx.lineWidth = 1.5;
        if (asymp.type === 'vertical' && asymp.val !== undefined) {
          ctx.strokeStyle = '#ef4444'; // Red
          const cx = originX + asymp.val * zoom;
          ctx.beginPath();
          ctx.moveTo(cx, 0);
          ctx.lineTo(cx, height);
          ctx.stroke();

          // Label
          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(asymp.label, cx + 4, 25);
        } else if (asymp.type === 'horizontal' && asymp.val !== undefined) {
          ctx.strokeStyle = '#8b5cf6'; // Purple
          const cy = originY - asymp.val * zoom;
          ctx.beginPath();
          ctx.moveTo(0, cy);
          ctx.lineTo(width, cy);
          ctx.stroke();

          // Label
          ctx.fillStyle = '#7c3aed';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(asymp.label, 15, cy - 6);
        } else if (asymp.type === 'oblique' && asymp.m !== undefined && asymp.n !== undefined) {
          ctx.strokeStyle = '#0284c7'; // Blue
          const xLeft = (0 - originX) / zoom;
          const xRight = (width - originX) / zoom;
          const yLeft = asymp.m * xLeft + asymp.n;
          const yRight = asymp.m * xRight + asymp.n;

          ctx.beginPath();
          ctx.moveTo(0, originY - yLeft * zoom);
          ctx.lineTo(width, originY - yRight * zoom);
          ctx.stroke();

          // Label
          ctx.fillStyle = '#0369a1';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(asymp.label, width - 150, originY - yRight * zoom - 8);
        }
      });
      ctx.setLineDash([]); // Reset dash
    }

    // 4. Plot Function Curve
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#2563eb'; // Royal Blue
    ctx.beginPath();

    let isDrawing = false;
    let prevYVal: number | null = null;
    const pixelStep = 1; // 1 pixel resolution for crisp plot

    for (let px = 0; px <= width; px += pixelStep) {
      const mathX = (px - originX) / zoom;
      const mathY = evaluateFunction(mathX);

      if (mathY === null || isNaN(mathY) || !isFinite(mathY)) {
        isDrawing = false;
        prevYVal = null;
        continue;
      }

      // Check for asymptote jump discontinuity (avoid vertical connecting line)
      if (prevYVal !== null && Math.abs(mathY - prevYVal) > (height / zoom) * 0.8) {
        isDrawing = false;
      }

      const py = originY - mathY * zoom;

      // Check bounds with some padding
      if (py < -height * 2 || py > height * 3) {
        isDrawing = false;
        prevYVal = mathY;
        continue;
      }

      if (!isDrawing) {
        ctx.moveTo(px, py);
        isDrawing = true;
      } else {
        ctx.lineTo(px, py);
      }
      prevYVal = mathY;
    }
    ctx.stroke();

    // 5. Draw Special Points
    if (showSpecialPoints && specialFeatures.points.length > 0) {
      specialFeatures.points.forEach(pt => {
        const cx = originX + pt.x * zoom;
        const cy = originY - pt.y * zoom;

        if (cx >= -20 && cx <= width + 20 && cy >= -20 && cy <= height + 20) {
          // Circle marker
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Text label
          ctx.font = 'bold 11px sans-serif';
          ctx.fillStyle = '#1e293b';
          // small white outline for readability
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeText(pt.label, cx + 8, cy - 6);
          ctx.fillText(pt.label, cx + 8, cy - 6);
        }
      });
    }
  }, [
    zoom, 
    originOffset, 
    showGrid, 
    showAsymptotes, 
    showSpecialPoints, 
    evaluateFunction, 
    specialFeatures
  ]);

  // Pan (drag) handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - originOffset.x, y: e.clientY - originOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOriginOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom Controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.25, 10));
  const handleResetView = () => {
    setZoom(40);
    setOriginOffset({ x: 0, y: 0 });
  };

  // Download Graph as Image
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `do-thi-${selectedFunctionType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Generate Table of Values
  const tableOfValues = useMemo(() => {
    const list: { x: number; y: string }[] = [];
    const testPoints = [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3];
    testPoints.forEach(val => {
      const yVal = evaluateFunction(val);
      list.push({
        x: val,
        y: yVal !== null ? Number(yVal.toFixed(3)).toString() : 'Không xác định'
      });
    });
    return list;
  }, [evaluateFunction]);

  // Sơ đồ khảo sát chi tiết chuẩn SGK KNTT
  const surveyReportMarkdown = useMemo(() => {
    const { a = 1, b = 0, c = 0, d = 0, p = 1, q = 0 } = params;

    switch (selectedFunctionType) {
      case 'linear': {
        const dongBien = a > 0;
        return `
### Báo cáo Khảo sát Hàm số Bậc nhất $y = ${a}x + ${b}$ (SGK Toán 8, 9 - KNTT)

#### 1. Tập xác định
- Tập xác định: $D = \\mathbb{R}$.

#### 2. Sự biến thiên
- Đạo hàm: $y' = ${a}$.
- Chiều biến thiên: Vì $a = ${a} ${dongBien ? '> 0' : '< 0'}$ nên hàm số **${dongBien ? 'đồng biến' : 'nghịch biến'}** trên toàn trục số $\\mathbb{R}$.
- Hệ số góc của đường thẳng: $k = a = ${a}$.

#### 3. Bảng biến thiên
| $x$ | $-\\infty$ | | $+\\infty$ |
| :---: | :---: | :---: | :---: |
| $y'$ | | $${dongBien ? '+' : '-'}$$ | |
| $y$ | $${dongBien ? '-\\infty' : '+\\infty'}$$ | ${dongBien ? '$\\nearrow$' : '$\\searrow$'} | $${dongBien ? '+\\infty' : '-\\infty'}$$ |

#### 4. Đồ thị
- Đồ thị là một đường thẳng:
  - Cắt trục tung $Oy$ tại điểm $A(0; ${b})$.
  - Cắt trục hoành $Ox$ tại điểm $B\\left(${(-b/a).toFixed(2)}; 0\\right)$.
        `;
      }

      case 'quadratic_simple': {
        const beLom = a > 0;
        return `
### Báo cáo Khảo sát Hàm số Bậc hai Đơn giản $y = ${a}x^2$ (SGK Toán 9 - KNTT)

#### 1. Tập xác định
- Tập xác định: $D = \\mathbb{R}$.

#### 2. Sự biến thiên
- Đạo hàm: $y' = ${2 * a}x$. Cho $y' = 0 \\Leftrightarrow x = 0$.
- Chiều biến thiên:
  ${beLom 
    ? '- Với $a = ' + a + ' > 0$: Hàm số nghịch biến trên khoảng $(-\\infty; 0)$ và đồng biến trên khoảng $(0; +\\infty)$.\n- Hàm số đạt giá trị nhỏ nhất $y_{\\min} = 0$ tại $x = 0$.'
    : '- Với $a = ' + a + ' < 0$: Hàm số đồng biến trên khoảng $(-\\infty; 0)$ và nghịch biến trên khoảng $(0; +\\infty)$.\n- Hàm số đạt giá trị lớn nhất $y_{\\max} = 0$ tại $x = 0$.'}

#### 3. Bảng biến thiên
| $x$ | $-\\infty$ | | $0$ | | $+\\infty$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| $y'$ | | ${beLom ? '$-$' : '$+$'} | $0$ | ${beLom ? '$+$' : '$-$'} | |
| $y$ | ${beLom ? '$+\\infty$' : '$-\\infty$'} | ${beLom ? '$\\searrow$' : '$\\nearrow$'} | $0$ | ${beLom ? '$\\nearrow$' : '$\\searrow$'} | ${beLom ? '$+\\infty$' : '$-\\infty$'} |

#### 4. Đồ thị
- Đồ thị là một đường cong Parabol đi qua gốc tọa độ $O(0; 0)$.
- Đỉnh Parabol: $O(0; 0)$.
- Trục đối xứng: Trục tung $Oy$ (đường thẳng $x = 0$).
- Bề lõm Parabol quay ${beLom ? 'lên trên' : 'xuống dưới'}.
        `;
      }

      case 'quadratic_full': {
        const xI = -b / (2 * a);
        const delta = b * b - 4 * a * c;
        const yI = -delta / (4 * a);
        const beLom = a > 0;
        return `
### Báo cáo Khảo sát Hàm số Bậc hai $y = ${a}x^2 + ${b}x + ${c}$ (SGK Toán 10 - KNTT)

#### 1. Tập xác định
- Tập xác định: $D = \\mathbb{R}$.

#### 2. Sự biến thiên
- Đạo hàm: $y' = ${2 * a}x + ${b}$.
- Cho $y' = 0 \\Leftrightarrow x = ${xI.toFixed(2)}$.
- Tọa độ đỉnh Parabol: $I\\left(${xI.toFixed(2)}; ${yI.toFixed(2)}\\right)$ với $\\Delta = ${delta.toFixed(2)}$.
- Trục đối xứng: Đường thẳng $x = ${xI.toFixed(2)}$.
- Chiều biến thiên:
  ${beLom 
    ? `- Hàm số nghịch biến trên khoảng $(-\\infty; ${xI.toFixed(2)})$ và đồng biến trên khoảng $(${xI.toFixed(2)}; +\\infty)$.\n- Hàm số đạt cực tiểu tại điểm $x = ${xI.toFixed(2)}$, giá trị cực tiểu $y_{\\min} = ${yI.toFixed(2)}$.`
    : `- Hàm số đồng biến trên khoảng $(-\\infty; ${xI.toFixed(2)})$ và nghịch biến trên khoảng $(${xI.toFixed(2)}; +\\infty)$.\n- Hàm số đạt cực đại tại điểm $x = ${xI.toFixed(2)}$, giá trị cực đại $y_{\\max} = ${yI.toFixed(2)}$.`}

#### 3. Bảng biến thiên
| $x$ | $-\\infty$ | | $${xI.toFixed(2)}$$ | | $+\\infty$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| $y'$ | | ${beLom ? '$-$' : '$+$'} | $0$ | ${beLom ? '$+$' : '$-$'} | |
| $y$ | ${beLom ? '$+\\infty$' : '$-\\infty$'} | ${beLom ? '$\\searrow$' : '$\\nearrow$'} | $${yI.toFixed(2)}$$ | ${beLom ? '$\\nearrow$' : '$\\searrow$'} | ${beLom ? '$+\\infty$' : '$-\\infty$'} |

#### 4. Đồ thị
- Giao điểm với trục tung: $A(0; ${c})$.
- Trục đối xứng: Đường thẳng $x = ${xI.toFixed(2)}$.
- Đỉnh Parabol: $I\\left(${xI.toFixed(2)}; ${yI.toFixed(2)}\\right)$.
        `;
      }

      case 'cubic': {
        const deltaPrime = b * b - 3 * a * c;
        const xu = -b / (3 * a);
        const yu = a * Math.pow(xu, 3) + b * Math.pow(xu, 2) + c * xu + d;

        let cucTriText = '';
        if (deltaPrime > 0) {
          const x1 = (-b - Math.sqrt(deltaPrime)) / (3 * a);
          const x2 = (-b + Math.sqrt(deltaPrime)) / (3 * a);
          const y1 = a * Math.pow(x1, 3) + b * Math.pow(x1, 2) + c * x1 + d;
          const y2 = a * Math.pow(x2, 3) + b * Math.pow(x2, 2) + c * x2 + d;
          cucTriText = `Phương trình $y' = 0$ có hai nghiệm phân biệt: $x_1 = ${x1.toFixed(2)}$ và $x_2 = ${x2.toFixed(2)}$.\n- Điểm cực trị thứ nhất: $M_1(${x1.toFixed(2)}; ${y1.toFixed(2)})$.\n- Điểm cực trị thứ hai: $M_2(${x2.toFixed(2)}; ${y2.toFixed(2)})$.`;
        } else if (deltaPrime === 0) {
          cucTriText = `Phương trình $y' = 0$ có nghiệm kép $x = ${(-b / (3 * a)).toFixed(2)}$. Hàm số không có cực trị.`;
        } else {
          cucTriText = `Phương trình $y' = 0$ vô nghiệm ($\\Delta' < 0$). Hàm số ${a > 0 ? 'đồng biến' : 'nghịch biến'} trên $\\mathbb{R}$ và không có cực trị.`;
        }

        return `
### Báo cáo Khảo sát Hàm số Bậc ba $y = ${a}x^3 + ${b}x^2 + ${c}x + ${d}$ (SGK Toán 12 - KNTT)

#### 1. Tập xác định
- Tập xác định: $D = \\mathbb{R}$.

#### 2. Sự biến thiên
- Đạo hàm: $y' = ${3 * a}x^2 + ${2 * b}x + ${c}$.
- Biệt thức đạo hàm: $\\Delta' = b^2 - 3ac = ${deltaPrime.toFixed(2)}$.
- Cực trị: ${cucTriText}
- Giới hạn tại vô cực:
  - $\\lim_{x \\to -\\infty} y = ${a > 0 ? '-\\infty' : '+\\infty'}$
  - $\\lim_{x \\to +\\infty} y = ${a > 0 ? '+\\infty' : '-\\infty'}$

#### 3. Tâm đối xứng & Điểm uốn
- Điểm uốn của đồ thị hàm số: $U\\left(${xu.toFixed(2)}; ${yu.toFixed(2)}\\right)$.
- Điểm $U$ chính là **tâm đối xứng** của đồ thị hàm số.

#### 4. Đồ thị
- Cắt trục tung $Oy$ tại điểm $(0; ${d})$.
- Đồ thị đối xứng qua tâm $U\\left(${xu.toFixed(2)}; ${yu.toFixed(2)}\\right)$.
        `;
      }

      case 'rational_1_1': {
        const xDiscont = -d / c;
        const yHoriz = a / c;
        const adbc = a * d - b * c;
        const dongBien = adbc > 0;

        return `
### Báo cáo Khảo sát Hàm số Phân thức Bậc nhất / Bậc nhất $y = \\frac{${a}x + ${b}}{${c}x + ${d}}$ (SGK Toán 12 - KNTT)

#### 1. Tập xác định
- Điều kiện: ${c}x + ${d} \\neq 0 \\Leftrightarrow x \\neq ${xDiscont.toFixed(2)}$.
- Tập xác định: $D = \\mathbb{R} \\setminus \\{${xDiscont.toFixed(2)}\\}$.

#### 2. Sự biến thiên
- Đạo hàm: $y' = \\frac{ad - bc}{(${c}x + ${d})^2} = \\frac{${adbc}}{(${c}x + ${d})^2}$.
- Vì $ad - bc = ${adbc} ${dongBien ? '> 0' : '< 0'}$ nên:
  - Hàm số **${dongBien ? 'đồng biến' : 'nghịch biến'}** trên từng khoảng xác định $(-\\infty; ${xDiscont.toFixed(2)})$ và $(${xDiscont.toFixed(2)}; +\\infty)$.
  - Hàm số không có cực trị.

#### 3. Đường tiệm cận
- **Tiệm cận đứng (TCĐ)**: Đường thẳng $x = ${xDiscont.toFixed(2)}$ vì $\\lim_{x \\to ${xDiscont.toFixed(2)}^\\pm} y = \\pm\\infty$.
- **Tiệm cận ngang (TCN)**: Đường thẳng $y = \\frac{a}{c} = ${yHoriz.toFixed(2)}$ vì $\\lim_{x \\to \\pm\\infty} y = ${yHoriz.toFixed(2)}$.
- **Tâm đối xứng**: Giao điểm của hai đường tiệm cận là $I\\left(${xDiscont.toFixed(2)}; ${yHoriz.toFixed(2)}\\right)$.

#### 4. Đồ thị
- Đồ thị gồm hai nhánh Hypebol nằm đối xứng nhau qua tâm $I\\left(${xDiscont.toFixed(2)}; ${yHoriz.toFixed(2)}\\right)$.
- Cắt trục tung $Oy$ tại: $\\left(0; ${(b / d).toFixed(2)}\\right)$ (với $d \\neq 0$).
        `;
      }

      case 'rational_2_1': {
        const xDiscont = -q / p;
        const m = a / p;
        const n = (b - m * q) / p;
        const k = c - n * q;

        return `
### Báo cáo Khảo sát Phân thức Bậc hai / Bậc nhất $y = \\frac{${a}x^2 + ${b}x + ${c}}{${p}x + ${q}}$ (SGK Toán 12 - KNTT Chuẩn Mới)

#### 1. Tập xác định
- Điều kiện mẫu số: ${p}x + ${q} \\neq 0 \\Leftrightarrow x \\neq ${xDiscont.toFixed(2)}$.
- Tập xác định: $D = \\mathbb{R} \\setminus \\{${xDiscont.toFixed(2)}\\}$.

#### 2. Phân tích dạng chuẩn
- Thực hiện phép chia đa thức tử cho mẫu:
  $$y = ${m.toFixed(2)}x ${n >= 0 ? '+' : ''} ${n.toFixed(2)} + \\frac{${k.toFixed(2)}}{${p}x + ${q}}$$

#### 3. Các đường tiệm cận (Chuẩn GDPT 2018)
- **Tiệm cận đứng (TCĐ)**: Đường thẳng $x = ${xDiscont.toFixed(2)}$.
- **Tiệm cận xiên (TCX)**: Đường thẳng $y = ${m.toFixed(2)}x ${n >= 0 ? '+' : ''} ${n.toFixed(2)}$.
- **Tâm đối xứng của đồ thị**: Giao điểm của tiệm cận đứng và tiệm cận xiên là $I\\left(${xDiscont.toFixed(2)}; ${(m * xDiscont + n).toFixed(2)}\\right)$.

#### 4. Đồ thị
- Đồ thị gồm hai nhánh Hypebol nhận đường tiệm cận đứng $x = ${xDiscont.toFixed(2)}$ và tiệm cận xiên $y = ${m.toFixed(2)}x + ${n.toFixed(2)}$ làm các đường giới hạn.
        `;
      }

      case 'trig_tan': {
        const dongBien = (a * b) > 0;
        const absB = Math.abs(b) || 1;
        return `
### Báo cáo Khảo sát Hàm số Lượng giác Tang $y = ${a}\\tan(${b}x)$ (SGK Toán 11 - KNTT)

#### 1. Tập xác định
- Điều kiện xác định: $\\cos(${b}x) \\neq 0 \\Leftrightarrow ${b}x \\neq \\frac{\\pi}{2} + k\\pi \\Leftrightarrow x \\neq \\frac{\\pi}{${(2 * absB).toFixed(2)}} + \\frac{k\\pi}{${absB.toFixed(2)}} \\; (k \\in \\mathbb{Z})$.
- Tập xác định: $D = \\mathbb{R} \\setminus \\left\\{\\frac{\\pi}{${(2 * absB).toFixed(2)}} + \\frac{k\\pi}{${absB.toFixed(2)}} \\;\\middle|\\; k \\in \\mathbb{Z}\\right\\}$.

#### 2. Sự biến thiên
- Đạo hàm: $y' = \\frac{${(a * b).toFixed(2)}}{\\cos^2(${b}x)}$.
- Vì tích $a \\cdot b = ${(a * b).toFixed(2)} ${dongBien ? '> 0' : '< 0'}$ nên:
  - Hàm số **${dongBien ? 'đồng biến' : 'nghịch biến'}** trên từng khoảng xác định.
  - Hàm số không có cực trị.
- Chu kỳ tuần hoàn: $T = \\frac{\\pi}{|b|} = \\frac{\\pi}{${absB.toFixed(2)}}$.

#### 3. Đường tiệm cận
- Các đường **tiệm cận đứng (TCĐ)**: $x = \\frac{\\pi}{${(2 * absB).toFixed(2)}} + \\frac{k\\pi}{${absB.toFixed(2)}} \\; (k \\in \\mathbb{Z})$.

#### 4. Đồ thị
- Đồ thị đối xứng qua gốc tọa độ $O(0; 0)$ (khi $a = 1, b = 1$ đây là hàm số lẻ).
- Đồ thị cắt trục hoành $Ox$ tại các điểm có hoành độ: $x = \\frac{k\\pi}{${absB.toFixed(2)}} \\; (k \\in \\mathbb{Z})$.
        `;
      }

      case 'trig_cot': {
        const nghichBien = (a * b) > 0;
        const absB = Math.abs(b) || 1;
        return `
### Báo cáo Khảo sát Hàm số Lượng giác Cô-tang $y = ${a}\\cot(${b}x)$ (SGK Toán 11 - KNTT)

#### 1. Tập xác định
- Điều kiện xác định: $\\sin(${b}x) \\neq 0 \\Leftrightarrow ${b}x \\neq k\\pi \\Leftrightarrow x \\neq \\frac{k\\pi}{${absB.toFixed(2)}} \\; (k \\in \\mathbb{Z})$.
- Tập xác định: $D = \\mathbb{R} \\setminus \\left\\{\\frac{k\\pi}{${absB.toFixed(2)}} \\;\\middle|\\; k \\in \\mathbb{Z}\\right\\}$.

#### 2. Sự biến thiên
- Đạo hàm: $y' = -\\frac{${(a * b).toFixed(2)}}{\\sin^2(${b}x)}$.
- Vì $-(a \\cdot b) = ${(-(a * b)).toFixed(2)} ${nghichBien ? '< 0' : '> 0'}$ nên:
  - Hàm số **${nghichBien ? 'nghịch biến' : 'đồng biến'}** trên từng khoảng xác định.
  - Hàm số không có cực trị.
- Chu kỳ tuần hoàn: $T = \\frac{\\pi}{|b|} = \\frac{\\pi}{${absB.toFixed(2)}}$.

#### 3. Đường tiệm cận
- Các đường **tiệm cận đứng (TCĐ)**: $x = \\frac{k\\pi}{${absB.toFixed(2)}} \\; (k \\in \\mathbb{Z})$.

#### 4. Đồ thị
- Đồ thị nhận các điểm $\\left(\\frac{\\pi}{${(2 * absB).toFixed(2)}} + \\frac{k\\pi}{${absB.toFixed(2)}}; 0\\right)$ làm tâm đối xứng.
- Đồ thị cắt trục hoành $Ox$ tại các điểm: $x = \\frac{\\pi}{${(2 * absB).toFixed(2)}} + \\frac{k\\pi}{${absB.toFixed(2)}} \\; (k \\in \\mathbb{Z})$.
        `;
      }

      default:
        return `
### Báo cáo Khảo sát Hàm số ${currentPreset.name} (Bám sát SGK Kết nối tri thức)
- Công thức: ${currentPreset.formulaLatex}
- Mời bạn tham khảo đồ thị trực quan và bảng giá trị số tương ứng ở khung bên cạnh!
        `;
    }
  }, [selectedFunctionType, params, currentPreset]);

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => { setActiveCategory('thcs'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeCategory === 'thcs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Cấp 2 (THCS Lớp 8 & 9)
        </button>
        <button
          onClick={() => { setActiveCategory('thpt_basic'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeCategory === 'thpt_basic'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Cấp 3 (THPT Lớp 10 & 11)
        </button>
        <button
          onClick={() => { setActiveCategory('thpt_advanced'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeCategory === 'thpt_advanced'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Cấp 3 (THPT Lớp 12 Trọng Tâm)
        </button>
        <button
          onClick={() => { setActiveCategory('custom'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeCategory === 'custom'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Tùy biến hàm số bất kỳ
        </button>
      </div>

      {/* Function Selectors under current Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {FUNCTION_PRESETS.filter(p => p.category === activeCategory).map(preset => {
          const isSelected = preset.id === selectedFunctionType;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectFunction(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {preset.grade}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">{preset.name}</h4>
              <div className="text-xs text-slate-600 mt-1">
                <MathView inline content={preset.formulaLatex} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace: Left Controls + Right Canvas & Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Tuning & Presets */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800">Thông số & Hệ số</h3>
              </div>
              <span className="text-xs text-slate-400">Chuẩn KNTT</span>
            </div>

            {selectedFunctionType === 'custom_expr' ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-600">
                  <MathView inline content="Nhập biểu thức hàm số $f(x)$:" />
                </label>
                <input
                  type="text"
                  value={customExpr}
                  onChange={(e) => setCustomExpr(e.target.value)}
                  placeholder="Ví dụ: x^3 - 3*x + 1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-slate-500">
                  <MathView inline content="Hỗ trợ các hàm: $x^2, x^3, \sin(x), \cos(x), \sqrt{x}, e^x, \ln(x)$..." />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.keys(currentPreset.paramDescriptions).map((key) => {
                  const val = params[key] ?? 0;
                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">
                          <MathView inline content={currentPreset.paramDescriptions[key]} />:
                        </span>
                        <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {val}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={key === 'a' ? -5 : -6}
                          max={6}
                          step={0.5}
                          value={val}
                          onChange={(e) => {
                            const newV = parseFloat(e.target.value);
                            setParams(prev => ({ ...prev, [key]: newV }));
                          }}
                          className="flex-1 accent-blue-600 cursor-pointer"
                        />
                        <input
                          type="number"
                          step={0.1}
                          value={val}
                          onChange={(e) => {
                            const newV = parseFloat(e.target.value) || 0;
                            setParams(prev => ({ ...prev, [key]: newV }));
                          }}
                          className="w-16 px-2 py-1 text-xs border border-slate-200 rounded-lg text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Example Presets from SGK */}
            {currentPreset.presets.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Ví dụ mẫu trong SGK:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentPreset.presets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setParams(p.params)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs"
                    >
                      <MathView inline content={p.label} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Table of Values */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-emerald-600" />
                <h4 className="font-semibold text-slate-800 text-sm">Bảng giá trị điểm vẽ</h4>
              </div>
              <span className="text-xs text-slate-500">
                <MathView inline content="$(x; y)$" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="py-1.5 px-2 font-semibold">
                      <MathView inline content="$x$" />
                    </th>
                    {tableOfValues.map((item, idx) => (
                      <th key={idx} className="py-1.5 px-2 font-mono font-medium">{item.x}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-slate-800">
                    <td className="py-2 px-2 font-semibold bg-slate-50 border-r border-slate-200">
                      <MathView inline content="$y$" />
                    </td>
                    {tableOfValues.map((item, idx) => (
                      <td key={idx} className="py-2 px-2 font-mono text-blue-600 font-medium">
                        {item.y}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Canvas & Full SGK Survey */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Interactive Graph Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Canvas Toolbar */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-800 text-sm">Đồ thị Hàm số Oxy</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">
                  Zoom: {(zoom / 40).toFixed(1)}x
                </span>
              </div>

              {/* View options and actions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    showGrid ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-200 border-transparent text-slate-400'
                  }`}
                  title="Bật/Tắt Lưới tọa độ"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lưới</span>
                </button>
                <button
                  onClick={() => setShowAsymptotes(!showAsymptotes)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    showAsymptotes ? 'bg-white border-slate-300 text-red-600' : 'bg-slate-200 border-transparent text-slate-400'
                  }`}
                  title="Bật/Tắt Đường Tiệm cận"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="hidden sm:inline">Tiệm cận</span>
                </button>
                <button
                  onClick={() => setShowSpecialPoints(!showSpecialPoints)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    showSpecialPoints ? 'bg-white border-slate-300 text-purple-600' : 'bg-slate-200 border-transparent text-slate-400'
                  }`}
                  title="Bật/Tắt Điểm cực trị & Điểm uốn"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="hidden sm:inline">Điểm đặc biệt</span>
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                <button
                  onClick={handleZoomIn}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors"
                  title="Đặt lại góc nhìn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                  title="Tải ảnh đồ thị PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh PNG</span>
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="relative w-full aspect-[16/10] bg-white cursor-grab active:cursor-grabbing select-none overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-full block"
              />

              <div className="absolute bottom-2 left-3 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] text-slate-500 border border-slate-200 shadow-2xs pointer-events-none">
                💡 Kéo chuột để dịch chuyển (Pan), lăn chuột hoặc bấm nút [+] [-] để phóng to / thu nhỏ.
              </div>
            </div>
          </div>

          {/* Survey Report (Khảo sát chi tiết chuẩn SGK Kết nối tri thức) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-slate-800">
                  Quy trình Khảo sát Hàm số (Chuẩn SGK Kết nối tri thức với cuộc sống)
                </h3>
                <p className="text-xs text-slate-500">
                  Đầy đủ các bước: Tập xác định $\rightarrow$ Sự biến thiên $\rightarrow$ Cực trị & Tiệm cận $\rightarrow$ Bảng biến thiên $\rightarrow$ Đồ thị
                </p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-sm">
              <MathView content={surveyReportMarkdown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

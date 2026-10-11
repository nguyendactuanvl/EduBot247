import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  TrendingUp,
  Target,
  Eye,
  Info,
  Maximize2
} from 'lucide-react';
import { MathView } from './MathView';

export interface InequalityConstraint {
  id: string;
  a: number;
  b: number;
  op: '<=' | '>=' | '<' | '>';
  c: number;
  color: string;
  label?: string;
  active: boolean;
}

export interface ObjectiveFunction {
  a: number;
  b: number;
  c: number;
  label: string;
  unit: string;
  target: 'max' | 'min';
}

interface VertexPoint {
  x: number;
  y: number;
  label: string;
  value: number;
  isMax: boolean;
  isMin: boolean;
  intersectingLines: string[];
}

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#d97706', // Amber
  '#9333ea', // Purple
  '#0891b2', // Cyan
  '#e11d48', // Rose
  '#4f46e5', // Indigo
];

const EXAMPLE_PROBLEMS = [
  {
    name: 'SGK Toán 10 KNTT - Lập kế hoạch sản xuất',
    description: 'Xưởng sản xuất 2 loại sản phẩm A và B. Lập phương án sản xuất sao for lợi nhuận lớn nhất.',
    constraints: [
      { id: 'c1', a: 1, b: 2, op: '<=' as const, c: 8, color: '#2563eb', label: 'Ràng buộc thời gian máy I (h)', active: true },
      { id: 'c2', a: 3, b: 2, op: '<=' as const, c: 12, color: '#dc2626', label: 'Ràng buộc nguyên liệu (kg)', active: true },
      { id: 'c3', a: 1, b: 0, op: '>=' as const, c: 0, color: '#16a34a', label: 'Số SP A: $x \\ge 0$', active: true },
      { id: 'c4', a: 0, b: 1, op: '>=' as const, c: 0, color: '#d97706', label: 'Số SP B: $y \\ge 0$', active: true },
    ],
    objective: { a: 3, b: 2, c: 0, label: 'Lợi nhuận $F(x, y) = 3x + 2y$', unit: 'Triệu đồng', target: 'max' as const }
  },
  {
    name: 'SGK Toán 10 KNTT - Chế độ ăn uống & Dinh dưỡng',
    description: 'Pha chế dung dịch hoặc phối hợp thực phẩm để đạt hàm lượng dinh dưỡng tối thiểu với chi phí thấp nhất.',
    constraints: [
      { id: 'c1', a: 1, b: 1, op: '>=' as const, c: 5, color: '#2563eb', label: 'Ràng buộc Vitamin A (đơn vị)', active: true },
      { id: 'c2', a: 2, b: 1, op: '>=' as const, c: 8, color: '#dc2626', label: 'Ràng buộc Vitamin B (đơn vị)', active: true },
      { id: 'c3', a: 1, b: 0, op: '<=' as const, c: 6, color: '#16a34a', label: 'Giới hạn tối đa thực phẩm I', active: true },
      { id: 'c4', a: 1, b: 0, op: '>=' as const, c: 0, color: '#d97706', label: '$x \\ge 0$', active: true },
      { id: 'c5', a: 0, b: 1, op: '>=' as const, c: 0, color: '#9333ea', label: '$y \\ge 0$', active: true },
    ],
    objective: { a: 20, b: 15, c: 0, label: 'Chi phí $F(x, y) = 20x + 15y$', unit: 'Nghìn đồng', target: 'min' as const }
  },
  {
    name: 'Hệ BPT Đa giác 5 cạnh - Tối ưu hóa tổng quát',
    description: 'Bài toán thi học sinh giỏi & ôn thi THPT: Tìm giá trị lớn nhất và nhỏ nhất của biểu thức trên miền nghiệm đa giác.',
    constraints: [
      { id: 'c1', a: 1, b: -1, op: '<=' as const, c: 2, color: '#2563eb', label: '$x - y \\le 2$', active: true },
      { id: 'c2', a: 1, b: 2, op: '<=' as const, c: 10, color: '#dc2626', label: '$x + 2y \\le 10$', active: true },
      { id: 'c3', a: -1, b: 1, op: '<=' as const, c: 2, color: '#16a34a', label: '$-x + y \\le 2$', active: true },
      { id: 'c4', a: 1, b: 0, op: '>=' as const, c: 0, color: '#d97706', label: '$x \\ge 0$', active: true },
      { id: 'c5', a: 0, b: 1, op: '>=' as const, c: 0, color: '#9333ea', label: '$y \\ge 0$', active: true },
    ],
    objective: { a: 2, b: 3, c: 5, label: 'Biểu thức $F(x, y) = 2x + 3y + 5$', unit: 'Điểm', target: 'max' as const }
  }
];

export function InequalitySystemSolver() {
  // State for constraints and objective
  const [constraints, setConstraints] = useState<InequalityConstraint[]>(EXAMPLE_PROBLEMS[0].constraints);
  const [objective, setObjective] = useState<ObjectiveFunction>(EXAMPLE_PROBLEMS[0].objective);
  
  // Custom interactive level curve k
  const [levelCurveK, setLevelCurveK] = useState<number>(12);
  const [showLevelCurve, setShowLevelCurve] = useState<boolean>(true);
  const [showShading, setShowShading] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Hovered canvas coordinate
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // View viewport transform (center math coordinates and scale)
  const [viewTransform, setViewTransform] = useState({ scale: 40, offsetX: 120, offsetY: 380 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load a preset example
  const handleLoadPreset = (presetIndex: number) => {
    const p = EXAMPLE_PROBLEMS[presetIndex];
    setConstraints(p.constraints);
    setObjective(p.objective);
    // Reset view bounds to nice defaults
    setViewTransform({ scale: 40, offsetX: 120, offsetY: 380 });
  };

  // Add new constraint
  const handleAddConstraint = () => {
    const newId = 'c_' + Date.now();
    const color = PRESET_COLORS[constraints.length % PRESET_COLORS.length];
    setConstraints(prev => [
      ...prev,
      { id: newId, a: 1, b: 1, op: '<=', c: 6, color, label: 'Bất phương trình mới', active: true }
    ]);
  };

  // Delete constraint
  const handleDeleteConstraint = (id: string) => {
    setConstraints(prev => prev.filter(c => c.id !== id));
  };

  // Update constraint field
  const handleUpdateConstraint = (id: string, updates: Partial<InequalityConstraint>) => {
    setConstraints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Check if a math point (x, y) satisfies ALL active inequalities
  const isFeasible = useCallback((x: number, y: number, tol = 1e-5): boolean => {
    const activeList = constraints.filter(c => c.active);
    if (activeList.length === 0) return true;

    for (const c of activeList) {
      const val = c.a * x + c.b * y;
      if (c.op === '<=' && val > c.c + tol) return false;
      if (c.op === '>=' && val < c.c - tol) return false;
      if (c.op === '<' && val >= c.c + tol) return false;
      if (c.op === '>' && val <= c.c - tol) return false;
    }
    return true;
  }, [constraints]);

  // Compute intersections of lines and find vertices of feasible region
  const verticesData = useMemo(() => {
    const activeList = constraints.filter(c => c.active);
    if (activeList.length < 2) {
      return { vertices: [], isBounded: false, maxVertex: null, minVertex: null };
    }

    const candidateVertices: { x: number; y: number; lines: string[] }[] = [];

    // Solve for every pair of active constraints
    for (let i = 0; i < activeList.length; i++) {
      for (let j = i + 1; j < activeList.length; j++) {
        const c1 = activeList[i];
        const c2 = activeList[j];

        // System:
        // c1.a * x + c1.b * y = c1.c
        // c2.a * x + c2.b * y = c2.c
        const det = c1.a * c2.b - c2.a * c1.b;
        if (Math.abs(det) > 1e-7) {
          const x = (c1.c * c2.b - c2.c * c1.b) / det;
          const y = (c1.a * c2.c - c2.a * c1.c) / det;

          // Round small float errors
          const rx = Math.abs(x) < 1e-9 ? 0 : Number(x.toFixed(6));
          const ry = Math.abs(y) < 1e-9 ? 0 : Number(y.toFixed(6));

          // Check if rx, ry satisfies all constraints
          if (isFeasible(rx, ry)) {
            // Check duplicate
            const exists = candidateVertices.some(v => Math.hypot(v.x - rx, v.y - ry) < 1e-4);
            if (!exists) {
              candidateVertices.push({
                x: rx,
                y: ry,
                lines: [c1.label || `d_${i+1}`, c2.label || `d_${j+1}`]
              });
            }
          }
        }
      }
    }

    if (candidateVertices.length === 0) {
      return { vertices: [], isBounded: false, maxVertex: null, minVertex: null };
    }

    // Sort vertices counter-clockwise around centroid
    const cx = candidateVertices.reduce((sum, v) => sum + v.x, 0) / candidateVertices.length;
    const cy = candidateVertices.reduce((sum, v) => sum + v.y, 0) / candidateVertices.length;

    candidateVertices.sort((p1, p2) => {
      const angle1 = Math.atan2(p1.y - cy, p1.x - cx);
      const angle2 = Math.atan2(p2.y - cy, p2.x - cx);
      return angle1 - angle2;
    });

    // Evaluate objective function F(x, y) = a*x + b*y + c
    const vertexAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let maxVal = -Infinity;
    let minVal = Infinity;

    const evaluated = candidateVertices.map((v, index) => {
      const val = objective.a * v.x + objective.b * v.y + objective.c;
      if (val > maxVal) maxVal = val;
      if (val < minVal) minVal = val;
      return {
        x: v.x,
        y: v.y,
        label: vertexAlphabet[index % vertexAlphabet.length],
        value: val,
        isMax: false,
        isMin: false,
        intersectingLines: v.lines
      };
    });

    // Mark Max & Min
    evaluated.forEach(v => {
      if (Math.abs(v.value - maxVal) < 1e-5) v.isMax = true;
      if (Math.abs(v.value - minVal) < 1e-5) v.isMin = true;
    });

    const maxVertex = evaluated.find(v => v.isMax) || null;
    const minVertex = evaluated.find(v => v.isMin) || null;

    return {
      vertices: evaluated,
      isBounded: candidateVertices.length >= 3,
      maxVertex,
      minVertex
    };
  }, [constraints, objective, isFeasible]);

  // Keep slider level curve in sync with max vertex value
  useEffect(() => {
    if (verticesData.maxVertex && objective.target === 'max') {
      setLevelCurveK(verticesData.maxVertex.value);
    } else if (verticesData.minVertex && objective.target === 'min') {
      setLevelCurveK(verticesData.minVertex.value);
    }
  }, [verticesData.maxVertex, verticesData.minVertex, objective.target]);

  // Canvas Drawing Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support High-DPI screens
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const { scale, offsetX, offsetY } = viewTransform;

    // Helper functions: Math (x, y) <-> Canvas (px, py)
    const toCanvasX = (x: number) => offsetX + x * scale;
    const toCanvasY = (y: number) => offsetY - y * scale;
    const toMathX = (px: number) => (px - offsetX) / scale;
    const toMathY = (py: number) => (offsetY - py) / scale;

    // 1. Clear Canvas Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Grid Lines
    if (showGrid) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#f1f5f9'; // slate-100
      
      const minX = Math.floor(toMathX(0));
      const maxX = Math.ceil(toMathX(width));
      const minY = Math.floor(toMathY(height));
      const maxY = Math.ceil(toMathY(0));

      // Grid vertical lines
      for (let x = minX; x <= maxX; x++) {
        const px = toCanvasX(x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
      }

      // Grid horizontal lines
      for (let y = minY; y <= maxY; y++) {
        const py = toCanvasY(y);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }
    }

    // 3. Draw Cartesian Axes Ox and Oy
    const originPx = toCanvasX(0);
    const originPy = toCanvasY(0);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#334155'; // slate-700

    // Ox Axis
    ctx.beginPath();
    ctx.moveTo(0, originPy);
    ctx.lineTo(width, originPy);
    ctx.stroke();

    // Oy Axis
    ctx.beginPath();
    ctx.moveTo(originPx, 0);
    ctx.lineTo(originPx, height);
    ctx.stroke();

    // Axis Arrows
    // Ox Arrow
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(width - 10, originPy - 5);
    ctx.lineTo(width, originPy);
    ctx.lineTo(width - 10, originPy + 5);
    ctx.fill();

    // Oy Arrow
    ctx.beginPath();
    ctx.moveTo(originPx - 5, 10);
    ctx.lineTo(originPx, 0);
    ctx.lineTo(originPx + 5, 10);
    ctx.fill();

    // Axis Labels x, y, O
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('x', width - 15, originPy + 18);
    ctx.fillText('y', originPx + 10, 15);
    ctx.fillText('O', originPx - 15, originPy + 18);

    // Tick labels on axes
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    const minX = Math.floor(toMathX(0));
    const maxX = Math.ceil(toMathX(width));
    const minY = Math.floor(toMathY(height));
    const maxY = Math.ceil(toMathY(0));

    const step = scale < 20 ? 5 : scale < 35 ? 2 : 1;

    for (let x = minX; x <= maxX; x += step) {
      if (x !== 0) {
        const px = toCanvasX(x);
        ctx.beginPath();
        ctx.moveTo(px, originPy - 3);
        ctx.lineTo(px, originPy + 3);
        ctx.stroke();
        ctx.fillText(x.toString(), px - 4, originPy + 16);
      }
    }

    for (let y = minY; y <= maxY; y += step) {
      if (y !== 0) {
        const py = toCanvasY(y);
        ctx.beginPath();
        ctx.moveTo(originPx - 3, py);
        ctx.lineTo(originPx + 3, py);
        ctx.stroke();
        ctx.fillText(y.toString(), originPx - 18, py + 3);
      }
    }

    // 4. Fill Feasible Region (Miền nghiệm đa giác D)
    if (showShading && verticesData.vertices.length >= 3) {
      ctx.beginPath();
      verticesData.vertices.forEach((v, idx) => {
        const px = toCanvasX(v.x);
        const py = toCanvasY(v.y);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      // Translucent vibrant green/emerald fill for Feasible Region
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'; // emerald-500 with opacity
      ctx.fill();

      // Border for polygon
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#059669'; // emerald-600
      ctx.setLineDash([]);
      ctx.stroke();
    }

    // 5. Draw Constraint Lines
    const activeList = constraints.filter(c => c.active);
    const boundsMathMinX = toMathX(0) - 2;
    const boundsMathMaxX = toMathX(width) + 2;

    activeList.forEach((c) => {
      ctx.lineWidth = 2;
      ctx.strokeStyle = c.color;

      if (c.op === '<' || c.op === '>') {
        ctx.setLineDash([6, 4]); // Dashed line for strict inequality
      } else {
        ctx.setLineDash([]); // Solid line for <= or >=
      }

      ctx.beginPath();

      if (Math.abs(c.b) < 1e-6) {
        // Vertical line x = c.c / c.a
        const xVal = c.c / c.a;
        const px = toCanvasX(xVal);
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
      } else {
        // Line y = (c.c - c.a * x) / c.b
        const y1 = (c.c - c.a * boundsMathMinX) / c.b;
        const y2 = (c.c - c.a * boundsMathMaxX) / c.b;

        ctx.moveTo(toCanvasX(boundsMathMinX), toCanvasY(y1));
        ctx.lineTo(toCanvasX(boundsMathMaxX), toCanvasY(y2));
      }

      ctx.stroke();
      ctx.setLineDash([]);

      // Draw line label near edge
      const labelX = boundsMathMaxX - 2;
      const labelY = Math.abs(c.b) > 1e-6 ? (c.c - c.a * labelX) / c.b : 0;
      if (labelY >= minY && labelY <= maxY) {
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = c.color;
        ctx.fillText(c.label || `${c.a}x + ${c.b}y = ${c.c}`, toCanvasX(labelX) - 60, toCanvasY(labelY) - 8);
      }
    });

    // 6. Draw Objective Function Level Curve Line: Ax + By = k
    if (showLevelCurve && (objective.a !== 0 || objective.b !== 0)) {
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#9333ea'; // Purple level curve
      ctx.setLineDash([8, 4]);

      const effC = levelCurveK - objective.c;
      ctx.beginPath();
      if (Math.abs(objective.b) < 1e-6) {
        const xVal = effC / objective.a;
        const px = toCanvasX(xVal);
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
      } else {
        const y1 = (effC - objective.a * boundsMathMinX) / objective.b;
        const y2 = (effC - objective.a * boundsMathMaxX) / objective.b;
        ctx.moveTo(toCanvasX(boundsMathMinX), toCanvasY(y1));
        ctx.lineTo(toCanvasX(boundsMathMaxX), toCanvasY(y2));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Level Curve Tag
      ctx.fillStyle = '#9333ea';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Đường mức F(x,y) = ${levelCurveK.toFixed(1)}`, toCanvasX(1) + 10, toCanvasY(1) - 10);
    }

    // 7. Draw Vertices (A, B, C...)
    verticesData.vertices.forEach(v => {
      const px = toCanvasX(v.x);
      const py = toCanvasY(v.y);

      // Vertex circle
      ctx.beginPath();
      ctx.arc(px, py, v.isMax || v.isMin ? 7 : 5, 0, 2 * Math.PI);

      if (v.isMax && objective.target === 'max') {
        ctx.fillStyle = '#ef4444'; // Red for Max
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
      } else if (v.isMin && objective.target === 'min') {
        ctx.fillStyle = '#3b82f6'; // Blue for Min
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = '#1e293b'; // Slate dark for standard vertex
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
      }

      ctx.fill();
      ctx.stroke();

      // Vertex Label & Coordinate Box
      const text = `${v.label}(${v.x}; ${v.y}) -> F = ${v.value}`;
      ctx.font = 'bold 11px Inter, sans-serif';
      const textWidth = ctx.measureText(text).width;

      // Label background card
      ctx.fillStyle = v.isMax ? '#fef2f2' : v.isMin ? '#eff6ff' : 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = v.isMax ? '#f87171' : v.isMin ? '#60a5fa' : '#cbd5e1';
      ctx.lineWidth = 1;

      const badgeX = px + 10;
      const badgeY = py - 20;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY - 12, textWidth + 12, 20, 6);
      ctx.fill();
      ctx.stroke();

      // Text inside badge
      ctx.fillStyle = v.isMax ? '#dc2626' : v.isMin ? '#2563eb' : '#0f172a';
      ctx.fillText(text, badgeX + 6, badgeY + 2);
    });

    // 8. Hover Point Evaluation Indicator
    if (hoverPos) {
      const px = toCanvasX(hoverPos.x);
      const py = toCanvasY(hoverPos.y);

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#f59e0b'; // Amber hover point
      ctx.fill();
    }

  }, [viewTransform, showGrid, showShading, showLevelCurve, constraints, objective, verticesData, levelCurveK, hoverPos]);

  // Pan & Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mousePx = e.clientX - rect.left;
    const mousePy = e.clientY - rect.top;

    // Convert to Math coordinates
    const mathX = Number(((mousePx - viewTransform.offsetX) / viewTransform.scale).toFixed(2));
    const mathY = Number(((viewTransform.offsetY - mousePy) / viewTransform.scale).toFixed(2));
    setHoverPos({ x: mathX, y: mathY });

    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      setViewTransform(prev => ({
        ...prev,
        offsetX: prev.offsetX + dx,
        offsetY: prev.offsetY + dy
      }));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom Handlers
  const handleZoom = (factor: number) => {
    setViewTransform(prev => ({
      ...prev,
      scale: Math.max(15, Math.min(120, prev.scale * factor))
    }));
  };

  const handleResetView = () => {
    setViewTransform({ scale: 40, offsetX: 120, offsetY: 380 });
  };

  // Export Canvas Image
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Mien_Nghiem_Toi_Uu_Fxy_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Generate Step-by-Step LaTeX Explanation text
  const stepByStepLatex = useMemo(() => {
    const activeList = constraints.filter(c => c.active);
    
    let text = `### 1. Hệ bất phương trình bậc nhất hai ẩn\n`;
    text += `$$\\begin{cases}\n`;
    activeList.forEach((c) => {
      const opSign = c.op === '<=' ? '\\le' : c.op === '>=' ? '\\ge' : c.op;
      text += `${c.a}x + ${c.b}y ${opSign} ${c.c} \\\\\n`;
    });
    text += `\\end{cases}$$\n\n`;

    text += `### 2. Các đường thẳng ranh giới miền nghiệm\n`;
    activeList.forEach((c, idx) => {
      text += `- $d_${idx+1}: ${c.a}x + ${c.b}y = ${c.c}$\n`;
    });

    text += `\n### 3. Tọa độ các đỉnh của miền nghiệm đa giác\n`;
    if (verticesData.vertices.length > 0) {
      text += `Miền nghiệm $D$ là hình đa giác có các đỉnh:\n`;
      verticesData.vertices.forEach(v => {
        text += `- Đỉnh $${v.label}(${v.x}; ${v.y})$\n`;
      });
    } else {
      text += `*Hệ bất phương trình vô nghiệm hoặc miền nghiệm không giới hạn đa giác.*\n`;
    }

    text += `\n### 4. Tính giá trị của biểu thức $F(x, y) = ${objective.a}x + ${objective.b}y + ${objective.c}$\n`;
    verticesData.vertices.forEach(v => {
      text += `- Tại $${v.label}(${v.x}; ${v.y})$: $F(${v.x}, ${v.y}) = ${objective.a} \\cdot (${v.x}) + ${objective.b} \\cdot (${v.y}) + ${objective.c} = ${v.value}$\n`;
    });

    text += `\n### 5. Kết luận bài toán tối ưu hóa\n`;
    if (objective.target === 'max' && verticesData.maxVertex) {
      text += ` Giá trị lớn nhất của $F(x, y)$ trên miền nghiệm $D$ là:\n`;
      text += `$$\\max F(x, y) = ${verticesData.maxVertex.value} \\quad \\text{đạt được tại đỉnh } ${verticesData.maxVertex.label}(${verticesData.maxVertex.x}; ${verticesData.maxVertex.y})$$\n`;
      if (objective.unit) {
        text += `*(Kết quả thực tế: Đạt **${verticesData.maxVertex.value} ${objective.unit}** khi $x = ${verticesData.maxVertex.x}$, $y = ${verticesData.maxVertex.y}$)*`;
      }
    } else if (objective.target === 'min' && verticesData.minVertex) {
      text += ` Giá trị nhỏ nhất của $F(x, y)$ trên miền nghiệm $D$ là:\n`;
      text += `$$\\min F(x, y) = ${verticesData.minVertex.value} \\quad \\text{đạt được tại đỉnh } ${verticesData.minVertex.label}(${verticesData.minVertex.x}; ${verticesData.minVertex.y})$$\n`;
      if (objective.unit) {
        text += `*(Kết quả thực tế: Chi phí tối thiểu là **${verticesData.minVertex.value} ${objective.unit}** khi $x = ${verticesData.minVertex.x}$, $y = ${verticesData.minVertex.y}$)*`;
      }
    }

    return text;
  }, [constraints, objective, verticesData]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <TrendingUp className="w-64 h-64" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/30 text-blue-200 text-xs font-bold rounded-full border border-blue-400/30">
              Toán 10 - Kết nối tri thức
            </span>
            <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 text-xs font-bold rounded-full border border-emerald-400/30">
              Quy hoạch tuyến tính Linear Programming
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center flex-wrap gap-2">
            <span>Biểu diễn Miền nghiệm & Tối ưu hóa Biểu thức</span>
            <MathView inline content="$F(x, y) = Ax + By + C$" />
          </h2>
          <div className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            <MathView inline content="Công cụ trực quan hóa miền nghiệm của hệ bất phương trình bậc nhất hai ẩn, tự động xác định các đỉnh đa giác $A, B, C\dots$ và tìm giá trị lớn nhất / nhỏ nhất của hàm mục tiêu $F(x, y)$." />
          </div>
        </div>
      </div>

      {/* Preset Example Quick Select */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Bài toán mẫu chuẩn SGK & Luyện thi:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXAMPLE_PROBLEMS.map((prob, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(idx)}
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group relative"
            >
              <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600">
                {prob.name}
              </div>
              <div className="text-xs text-slate-500 line-clamp-2 mt-1">
                {prob.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Input Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Objective Function Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-base">
                <Target className="w-5 h-5 text-purple-600" />
                <span>1. Hàm mục tiêu</span>
                <MathView inline content="$F(x, y)$" />
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setObjective(o => ({ ...o, target: 'max' }))}
                  className={`px-3 py-1 rounded-md transition-all ${
                    objective.target === 'max'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tìm Max (Lớn nhất)
                </button>
                <button
                  onClick={() => setObjective(o => ({ ...o, target: 'min' }))}
                  className={`px-3 py-1 rounded-md transition-all ${
                    objective.target === 'min'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tìm Min (Nhỏ nhất)
                </button>
              </div>
            </div>

            {/* Live LaTeX preview */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
              <MathView content={`$$F(x, y) = ${objective.a}x + ${objective.b}y + ${objective.c}$$`} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <span>Hệ số A</span>
                  <MathView inline content="($x$):" />
                </label>
                <input
                  type="number"
                  value={objective.a}
                  onChange={e => setObjective(o => ({ ...o, a: parseFloat(e.target.value) || 0 }))}
                  className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <span>Hệ số B</span>
                  <MathView inline content="($y$):" />
                </label>
                <input
                  type="number"
                  value={objective.b}
                  onChange={e => setObjective(o => ({ ...o, b: parseFloat(e.target.value) || 0 }))}
                  className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Hằng số C:</label>
                <input
                  type="number"
                  value={objective.c}
                  onChange={e => setObjective(o => ({ ...o, c: parseFloat(e.target.value) || 0 }))}
                  className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Đơn vị đo / Ý nghĩa:</label>
              <input
                type="text"
                value={objective.unit}
                placeholder="VD: Triệu đồng, Kg, Kcal..."
                onChange={e => setObjective(o => ({ ...o, unit: e.target.value }))}
                className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Inequality Constraints Manager */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
                <Sliders className="w-5 h-5 text-blue-600" />
                <span>2. Các bất phương trình ràng buộc ({constraints.length})</span>
              </div>
              <button
                onClick={handleAddConstraint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm BPT</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {constraints.map((c, index) => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                    c.active ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={c.active}
                        onChange={e => handleUpdateConstraint(c.id, { active: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                      />
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>({index + 1})</span>
                        <MathView inline content={c.label || `BPT ${index + 1}`} />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteConstraint(c.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                      title="Xóa BPT"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Coefficients input row: A x + B y <= C */}
                  <div className="grid grid-cols-12 gap-1.5 items-center text-xs">
                    <div className="col-span-3 flex items-center gap-1">
                      <input
                        type="number"
                        value={c.a}
                        onChange={e => handleUpdateConstraint(c.id, { a: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-slate-800"
                      />
                      <MathView inline content="$x$" className="font-semibold text-slate-600" />
                    </div>

                    <span className="col-span-1 text-center font-bold text-slate-400">+</span>

                    <div className="col-span-3 flex items-center gap-1">
                      <input
                        type="number"
                        value={c.b}
                        onChange={e => handleUpdateConstraint(c.id, { b: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-slate-800"
                      />
                      <MathView inline content="$y$" className="font-semibold text-slate-600" />
                    </div>

                    <div className="col-span-2">
                      <select
                        value={c.op}
                        onChange={e => handleUpdateConstraint(c.id, { op: e.target.value as any })}
                        className="w-full px-1 py-1 border border-slate-300 rounded text-center font-bold text-blue-700 bg-white"
                      >
                        <option value="<=">≤ (nhỏ hơn hoặc bằng)</option>
                        <option value=">=">≥ (lớn hơn hoặc bằng)</option>
                        <option value="<">&lt; (nhỏ hơn)</option>
                        <option value=">">&gt; (lớn hơn)</option>
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        value={c.c}
                        onChange={e => handleUpdateConstraint(c.id, { c: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-center font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Canvas & Result Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Math Canvas Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Canvas Toolbar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowShading(s => !s)}
                  className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    showShading ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Tô miền nghiệm D</span>
                </button>

                <button
                  onClick={() => setShowLevelCurve(s => !s)}
                  className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    showLevelCurve ? 'bg-purple-50 border-purple-300 text-purple-800' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <MathView inline content="Đường mức $F(x,y)$" />
                </button>
              </div>

              {/* Controls for Zoom/Reset/Download */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleZoom(1.2)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleZoom(0.8)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700"
                  title="Đặt lại khung nhìn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportPNG}
                  className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Tải ảnh đồ thị PNG"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Surface */}
            <div className="relative w-full h-[440px] bg-white cursor-grab active:cursor-grabbing select-none">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-full block"
              />

              {/* Hover Coordinate Overlay Indicator */}
              {hoverPos && (
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono rounded-lg pointer-events-none border border-slate-700 shadow-md">
                  <MathView inline content={`Tọa độ ($x$: ${hoverPos.x}, $y$: ${hoverPos.y}) | $F(x,y) = ${(objective.a * hoverPos.x + objective.b * hoverPos.y + objective.c).toFixed(2)}$`} />
                </div>
              )}
            </div>

            {/* Interactive Level Curve Slider */}
            {showLevelCurve && (
              <div className="p-3 bg-purple-50/60 border-t border-purple-100 flex items-center gap-3 text-xs">
                <span className="font-bold text-purple-900 shrink-0">
                  <MathView inline content="Dịch chuyển Đường mức $F(x,y) = k$:" />
                </span>
                <input
                  type="range"
                  min={Math.floor((verticesData.minVertex?.value || 0) - 10)}
                  max={Math.ceil((verticesData.maxVertex?.value || 20) + 10)}
                  step="0.5"
                  value={levelCurveK}
                  onChange={e => setLevelCurveK(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-purple-900 px-2 py-0.5 bg-purple-200 rounded shrink-0">
                  k = {levelCurveK.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Table of Vertices & Optimal Values */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Bảng giá trị tại các đỉnh miền nghiệm đa giác</span>
              </div>
              <span className="text-xs text-slate-500">
                <MathView inline content="Định lý: Giá trị $F(x,y)$ tối ưu đạt tại ít nhất một đỉnh." />
              </span>
            </div>

            {verticesData.vertices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2.5">Đỉnh</th>
                      <th className="p-2.5">
                        <MathView inline content="Tọa độ ($x, y$)" />
                      </th>
                      <th className="p-2.5">
                        <MathView inline content={`Tính $F(x, y) = ${objective.a}x + ${objective.b}y + ${objective.c}`} />
                      </th>
                      <th className="p-2.5">Kết luận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {verticesData.vertices.map((v) => (
                      <tr
                        key={v.label}
                        className={`transition-colors ${
                          v.isMax && objective.target === 'max'
                            ? 'bg-red-50/80 font-semibold'
                            : v.isMin && objective.target === 'min'
                            ? 'bg-blue-50/80 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-slate-200 font-bold text-slate-800 rounded">
                            {v.label}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono">
                          <MathView inline content={`$(${v.x}; ${v.y})$`} />
                        </td>
                        <td className="p-2.5">
                          <MathView inline content={`$${objective.a} \\cdot (${v.x}) + ${objective.b} \\cdot (${v.y}) + ${objective.c} = $ **${v.value}**`} />
                        </td>
                        <td className="p-2.5">
                          {v.isMax && objective.target === 'max' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                              <Sparkles className="w-3 h-3" />
                              Giá trị LỚN NHẤT (Max)
                            </span>
                          )}
                          {v.isMin && objective.target === 'min' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                              <Sparkles className="w-3 h-3" />
                              Giá trị NHỎ NHẤT (Min)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                Chưa tìm thấy miền nghiệm giới hạn đa giác. Vui lòng kiểm tra lại các bất phương trình ràng buộc!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step-by-Step LaTeX Explanation Output */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Lời giải chi tiết chuẩn sư phạm SGK KNTT</span>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800">
          <MathView content={stepByStepLatex} />
        </div>
      </div>
    </div>
  );
}

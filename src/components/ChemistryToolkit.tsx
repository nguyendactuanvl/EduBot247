import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Sliders,
  Play,
  Pause,
  Eye,
  Plus,
  Trash2,
  Move,
  Info,
  ChevronRight,
  Atom,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Sparkle,
  Box
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

export function ChemistryToolkit() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'periodic' | 'atomic' | 'molecules3d' | 'builder' | 'reactions' | 'curriculum'>('molecules3d');
  const [selected3DMoleculeId, setSelected3DMoleculeId] = useState<string>('h2o');

  // Scope & Filter States
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(getElementByZ(8)); // Default: Oxygen Z=8
  const [tableMode, setTableMode] = useState<'standard' | 'block' | 'state' | 'electronegativity'>('standard');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // --- 3D / 2D Atomic Orbital Simulator State ---
  const [isElectronAnimating, setIsElectronAnimating] = useState(true);
  const [showElectronCloud, setShowElectronCloud] = useState(false);
  const [showNucleus, setShowNucleus] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Drag & Drop Compound Builder State ---
  const [draggedElements, setDraggedElements] = useState<Record<string, number>>({});
  const [synthesizedCompound, setSynthesizedCompound] = useState<ChemicalCompound | null>(null);

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

  // Handle Drag & Drop Compound Builder Synthesis
  const handleAddElementToBuilder = (symbol: string) => {
    setDraggedElements(prev => {
      const newCount = (prev[symbol] || 0) + 1;
      const updated = { ...prev, [symbol]: newCount };
      checkCompoundMatch(updated);
      return updated;
    });
  };

  const handleRemoveElementFromBuilder = (symbol: string) => {
    setDraggedElements(prev => {
      const current = prev[symbol] || 0;
      if (current <= 1) {
        const { [symbol]: _, ...rest } = prev;
        checkCompoundMatch(rest);
        return rest;
      }
      const updated = { ...prev, [symbol]: current - 1 };
      checkCompoundMatch(updated);
      return updated;
    });
  };

  const handleClearBuilder = () => {
    setDraggedElements({});
    setSynthesizedCompound(null);
  };

  const checkCompoundMatch = (elementsCount: Record<string, number>) => {
    const matched = POPULAR_COMPOUNDS.find(c => {
      const keys = Object.keys(c.elementsRequired);
      if (keys.length !== Object.keys(elementsCount).length) return false;
      return keys.every(k => c.elementsRequired[k] === elementsCount[k]);
    });
    setSynthesizedCompound(matched || null);
  };

  // Canvas Atomic Orbital Animation Effect
  useEffect(() => {
    if (activeTab !== 'atomic') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. Draw Nucleus
      if (showNucleus) {
        const numProtons = selectedElement.z;
        const numNeutrons = Math.round(selectedElement.mass) - numProtons;
        
        // Nucleus Glow
        const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 35);
        grad.addColorStop(0, '#EF4444');
        grad.addColorStop(0.6, '#3B82F6');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
        ctx.fill();

        // Nucleus Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${selectedElement.symbol}`, centerX, centerY - 6);
        ctx.font = '9px monospace';
        ctx.fillText(`${numProtons}p⁺ ${numNeutrons > 0 ? numNeutrons + 'n⁰' : ''}`, centerX, centerY + 8);
      }

      // 2. Draw Electron Shells & Electrons
      const shells = selectedElement.electronsPerShell || [selectedElement.z];
      shells.forEach((electronCount, shellIdx) => {
        const radius = 60 + shellIdx * 35;

        // Draw Shell Orbit Ring
        ctx.strokeStyle = showElectronCloud ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = showElectronCloud ? 8 : 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Label Shell Name (K, L, M, N...)
        const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px monospace';
        ctx.fillText(shellNames[shellIdx] || `n=${shellIdx + 1}`, centerX + radius + 10, centerY);

        // Draw Electrons on Orbit
        for (let i = 0; i < electronCount; i++) {
          const electronAngle = angle * (shellIdx % 2 === 0 ? 1 : -1) * (0.8 + shellIdx * 0.2) + (i * Math.PI * 2) / electronCount;
          const ex = centerX + radius * Math.cos(electronAngle);
          const ey = centerY + radius * Math.sin(electronAngle);

          if (showElectronCloud) {
            // Electron Cloud Particles
            for (let p = 0; p < 3; p++) {
              const cloudX = ex + (Math.random() - 0.5) * 16;
              const cloudY = ey + (Math.random() - 0.5) * 16;
              ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
              ctx.beginPath();
              ctx.arc(cloudX, cloudY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Distinct Electron Particle
            ctx.fillStyle = '#38BDF8';
            ctx.shadowColor = '#0284C7';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(ex, ey, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          }
        }
      });

      if (isElectronAnimating) {
        angle += 0.015 * rotationSpeed;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, selectedElement, isElectronAnimating, showElectronCloud, showNucleus, rotationSpeed]);

  // Virtual Lab Reaction Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReactionRunning) {
      timer = setInterval(() => {
        setReactionProgress(prev => {
          if (prev >= 100) {
            setIsReactionRunning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isReactionRunning]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      
      {/* =========================================================================
          TOP BANNER & IUPAC BRANDING
          ========================================================================= */}
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
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Khám phá cấu trúc nguyên tử $3D$, obitan electron, mô phỏng phản ứng thí nghiệm ảo, ghép chất kéo-thả và hồ sơ khoa học $118$ nguyên tố theo đúng danh pháp hóa học mới IUPAC.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
                118
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Đầy đủ 118 nguyên tố</p>
                <p className="text-slate-400">Từ $H$ ($Z=1$) tới $Og$ ($Z=118$)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRIMARY WORKBENCH NAVIGATION TABS
          ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-md">
        <button
          onClick={() => setActiveTab('periodic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'periodic'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Bảng tuần hoàn 118 Nguyên tố</span>
        </button>

        <button
          onClick={() => setActiveTab('molecules3d')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'molecules3d'
              ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400/50'
              : 'text-cyan-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Box className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>2. Mô phỏng Phân tử 3D WebGL</span>
        </button>

        <button
          onClick={() => setActiveTab('atomic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'atomic'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Atom className="w-4 h-4 text-cyan-400" />
          <span>3. Orbitan Nguyên tử</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'builder'
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'text-amber-400 hover:bg-amber-950/40'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>4. Ghép Hợp chất</span>
        </button>

        <button
          onClick={() => setActiveTab('reactions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'reactions'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Beaker className="w-4 h-4 text-indigo-400" />
          <span>5. Thí nghiệm Ảo</span>
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'curriculum'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>6. Kiến thức SGK</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: INTERACTIVE PERIODIC TABLE (118 ELEMENTS)
          ========================================================================= */}
      {activeTab === 'periodic' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Box */}
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

              {/* View Modes */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold shrink-0">Chế độ hiển thị:</span>
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

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all border ${
                  categoryFilter === 'all'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Tất cả nhóm ({ALL_118_ELEMENTS.length})
              </button>
              {Object.entries(CATEGORY_INFO).map(([catKey, info]) => (
                <button
                  key={catKey}
                  onClick={() => setCategoryFilter(catKey)}
                  className={`px-3 py-1 rounded-full font-bold transition-all border ${
                    categoryFilter === catKey
                      ? `${info.bgLight} ${info.textDark} ${info.border}`
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-700'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: info.color }} />
                  {info.labelVi}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN PERIODIC GRID & SELECTED DOSSIER INSPECTOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Periodic Grid */}
            <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 md:p-5 border border-slate-800 shadow-sm overflow-x-auto">
              <div className="min-w-[700px] space-y-1.5">
                {/* Periods 1 to 7 */}
                {[1, 2, 3, 4, 5, 6, 7].map(periodNum => (
                  <div key={periodNum} className="flex items-center gap-1">
                    <span className="w-5 text-[10px] font-bold text-slate-500 text-center">{periodNum}</span>
                    <div className="flex-1 grid grid-cols-18 gap-1">
                      {Array.from({ length: 18 }, (_, i) => i + 1).map(groupNum => {
                        // Find element matching period and group
                        const elem = ALL_118_ELEMENTS.find(e => e.period === periodNum && e.group === groupNum);
                        
                        if (!elem) {
                          return <div key={groupNum} className="h-12 rounded-lg bg-slate-950/20" />;
                        }

                        const cat = CATEGORY_INFO[elem.category] || CATEGORY_INFO.transition;
                        const isSelected = selectedElement.z === elem.z;

                        let cardStyle = `${cat.bgLight} ${cat.border} ${cat.textDark}`;
                        if (tableMode === 'block') {
                          const blockColors = { s: 'bg-red-500/20 text-red-300 border-red-500/40', p: 'bg-blue-500/20 text-blue-300 border-blue-500/40', d: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', f: 'bg-green-500/20 text-green-300 border-green-500/40' };
                          cardStyle = blockColors[elem.block];
                        } else if (tableMode === 'state') {
                          const stateColors = { gas: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', liquid: 'bg-blue-600/30 text-blue-200 border-blue-400', solid: 'bg-slate-700/60 text-slate-200 border-slate-600', synthetic: 'bg-purple-900/40 text-purple-300 border-purple-700' };
                          cardStyle = stateColors[elem.stateStp];
                        } else if (tableMode === 'electronegativity') {
                          const val = elem.electronegativity || 0;
                          if (val > 3.0) cardStyle = 'bg-rose-500/30 text-rose-200 border-rose-500/60 font-bold';
                          else if (val > 2.0) cardStyle = 'bg-amber-500/20 text-amber-200 border-amber-500/50';
                          else if (val > 1.0) cardStyle = 'bg-teal-500/20 text-teal-200 border-teal-500/40';
                          else cardStyle = 'bg-slate-800 text-slate-400 border-slate-700';
                        }

                        return (
                          <button
                            key={elem.z}
                            onClick={() => setSelectedElement(elem)}
                            className={`h-12 p-1 rounded-xl border text-center transition-all flex flex-col justify-between relative group ${cardStyle} ${
                              isSelected ? 'ring-2 ring-teal-400 scale-105 z-10 shadow-lg' : 'hover:scale-105 hover:z-10'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full text-[9px] font-mono leading-none opacity-80">
                              <span>{elem.z}</span>
                              <span className="text-[8px] uppercase">{elem.block}</span>
                            </div>
                            <div className="font-extrabold text-sm sm:text-base leading-none">
                              {elem.symbol}
                            </div>
                            <div className="text-[8px] truncate font-medium opacity-90 leading-none">
                              {tableMode === 'electronegativity' && elem.electronegativity ? elem.electronegativity : elem.nameVi}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>💡 Click vào một nguyên tố bất kỳ để xem hồ sơ cấu hình e & mô phỏng 3D.</span>
                <button
                  onClick={() => setActiveTab('atomic')}
                  className="text-teal-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Mở mô phỏng obitan 3D</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Selected Element Dossier (Hồ sơ khoa học) */}
            <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Hồ sơ Khoa học Nguyên tố
                </span>
                <span className="text-xs text-slate-400 font-mono">Z = {selectedElement.z}</span>
              </div>

              {/* Element Header Badge */}
              <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <div 
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold shadow-inner"
                  style={{ backgroundColor: `${CATEGORY_INFO[selectedElement.category]?.color}25`, border: `2px solid ${CATEGORY_INFO[selectedElement.category]?.color}` }}
                >
                  <span className="text-xs text-slate-300 leading-none">{selectedElement.z}</span>
                  <span className="text-2xl text-white font-extrabold leading-none my-0.5">{selectedElement.symbol}</span>
                  <span className="text-[9px] text-slate-300 leading-none">{selectedElement.mass}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-white">
                    {selectedElement.nameVi} <span className="text-sm text-slate-400 font-normal">({selectedElement.nameIupac})</span>
                  </h3>
                  <p className="text-xs text-teal-400 font-bold mt-0.5">
                    {CATEGORY_INFO[selectedElement.category]?.labelVi} • Khối {selectedElement.block}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Chu kỳ {selectedElement.period} • Nhóm {selectedElement.groupCode} (Nhóm {selectedElement.group})
                  </p>
                </div>
              </div>

              {/* Electron Config & Properties Grid */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Cấu hình Electron</span>
                  <p className="font-mono text-sm text-teal-300 font-bold">
                    <MathView inline content={selectedElement.electronConfig} />
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block">Độ âm điện Pauling</span>
                    <span className="font-bold text-sm text-white">{selectedElement.electronegativity || 'N/A'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block">Số oxi hóa phổ biến</span>
                    <span className="font-bold text-sm text-white">{selectedElement.oxidationStates || 'N/A'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block">Nhiệt độ nóng chảy</span>
                    <span className="font-bold text-sm text-white">{selectedElement.meltingPointC !== undefined ? `${selectedElement.meltingPointC}°C` : 'N/A'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block">Trạng thái ĐKC</span>
                    <span className="font-bold text-sm text-emerald-400 uppercase">{selectedElement.stateStp}</span>
                  </div>
                </div>

                {/* Summary & Practical Application */}
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1 text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Tính chất & Ứng dụng thực tế</span>
                  <p className="text-xs">
                    <MathView content={selectedElement.summaryVi} />
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('atomic')}
                  className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Atom className="w-4 h-4" />
                  <span>Xem mô phỏng Orbitan 3D của {selectedElement.symbol}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: INTERACTIVE 3D MOLECULAR SIMULATION & BONDING (WEBGL / THREE.JS)
          ========================================================================= */}
      {activeTab === 'molecules3d' && (
        <Molecule3DViewer 
          initialMoleculeId={selected3DMoleculeId} 
          onMoleculeChange={(mol) => setSelected3DMoleculeId(mol.id)}
        />
      )}

      {/* =========================================================================
          TAB 3: 3D/2D ATOMIC ORBITAL & ELECTRON SHELLS SIMULATOR
          ========================================================================= */}
      {activeTab === 'atomic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Canvas Orbit Viewer */}
            <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Atom className="w-5 h-5 text-cyan-400" />
                    <span>Mô phỏng Chuyển động Electron & Obitan nguyên tử: {selectedElement.nameVi} ({selectedElement.symbol})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mô hình Bohr hiện đại hiển thị hạt nhân ($p^+, n^0$) và các lớp electron ($K, L, M, N, O, P, Q$) chuyển động theo quỹ đạo
                  </p>
                </div>

                {/* Animation Control Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsElectronAnimating(prev => !prev)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    {isElectronAnimating ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                    <span>{isElectronAnimating ? 'Tạm dừng' : 'Tiếp tục'}</span>
                  </button>

                  <button
                    onClick={() => setShowElectronCloud(prev => !prev)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      showElectronCloud ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Mây Electron</span>
                  </button>
                </div>
              </div>

              {/* CANVAS WORKSPACE */}
              <div className="w-full h-[420px] bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                <canvas 
                  ref={canvasRef} 
                  width={680} 
                  height={400} 
                  className="max-w-full max-h-full"
                />

                {/* Speed Slider Floating Control */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-xs p-3 rounded-2xl border border-slate-800 flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-bold">Tốc độ quay:</span>
                  <input 
                    type="range" 
                    min={0.2} 
                    max={3} 
                    step={0.1} 
                    value={rotationSpeed} 
                    onChange={e => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-24 accent-teal-500"
                  />
                  <span className="font-mono text-teal-400 font-bold">{rotationSpeed}x</span>
                </div>
              </div>

              {/* Quick Related Compounds Bar */}
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkle className="w-4 h-4 text-amber-400" /> Hợp chất tiêu biểu chứa nguyên tố {selectedElement.symbol}:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {POPULAR_COMPOUNDS.filter(c => c.elementsRequired[selectedElement.symbol]).map(comp => (
                    <button
                      key={comp.formula}
                      onClick={() => setActiveTab('builder')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>{comp.formula}</span>
                      <span className="text-slate-400 font-normal">({comp.nameVi})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Element Quick Picker */}
            <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Chọn nguyên tố mô phỏng khác</span>
              </h4>

              <div className="grid grid-cols-4 gap-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                {ALL_118_ELEMENTS.slice(0, 36).map(e => (
                  <button
                    key={e.z}
                    onClick={() => setSelectedElement(e)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedElement.z === e.z
                        ? 'bg-teal-600 text-white border-teal-400 font-bold shadow-md'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[9px] text-slate-400 block">{e.z}</span>
                    <span className="text-sm font-black">{e.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: KÉO & THẢ GHÉP HỢP CHẤT (DRAG & DROP COMPOUND BUILDER)
          ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 rounded-3xl p-6 border border-amber-800/40 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-900/40">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 mb-2">
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chức năng độc đáo: Kéo - Thả ghép Hợp chất Hóa học</span>
                </div>
                <h3 className="font-black text-xl text-white flex items-center gap-2">
                  <span>Phòng Tổng hợp Hợp chất Tự động</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Bấm chọn hoặc kéo-thả các nguyên tố ($H, O, Na, Cl, C, N, S, Ca, Fe...$) vào cốc phản ứng để tự động tổng hợp phân tử và tính toán khối lượng mol ($g/mol$).
                </p>
              </div>

              <button
                onClick={handleClearBuilder}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700 self-start md:self-center"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Xóa hết cốc phản ứng</span>
              </button>
            </div>

            {/* DOCK & CRUCIBLE WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 5 Cols: Element Dock Picker */}
              <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  1. Bấm hoặc kéo nguyên tố vào cốc
                </span>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {[
                    ALL_118_ELEMENTS[0],  // H
                    ALL_118_ELEMENTS[7],  // O
                    ALL_118_ELEMENTS[10], // Na
                    ALL_118_ELEMENTS[16], // Cl
                    ALL_118_ELEMENTS[5],  // C
                    ALL_118_ELEMENTS[6],  // N
                    ALL_118_ELEMENTS[15], // S
                    ALL_118_ELEMENTS[19], // Ca
                    ALL_118_ELEMENTS[20], // Fe
                    ALL_118_ELEMENTS[21], // Cu
                    ALL_118_ELEMENTS[12], // Al
                    ALL_118_ELEMENTS[18], // K
                  ].map(e => (
                    <button
                      key={e.symbol}
                      onClick={() => handleAddElementToBuilder(e.symbol)}
                      className="p-3 bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500 border border-slate-700 rounded-2xl text-center transition-all group shadow-sm active:scale-95"
                    >
                      <span className="text-[10px] text-slate-400 block">{e.z}</span>
                      <span className="text-base font-black text-white group-hover:text-amber-300">{e.symbol}</span>
                      <span className="text-[9px] text-slate-400 block truncate">{e.nameVi}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right 7 Cols: Reaction Crucible & Synthesized Product View */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Beaker className="w-4 h-4 text-amber-400" />
                      <span>Cốc phản ứng hiện tại</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Tổng số nguyên tử: {Object.values(draggedElements).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>

                  {/* Added Elements Chips in Crucible */}
                  <div className="p-5 min-h-[100px] flex flex-wrap items-center gap-3 bg-slate-900/60 rounded-xl border border-slate-800 border-dashed my-4">
                    {Object.keys(draggedElements).length === 0 ? (
                      <div className="text-center w-full text-slate-500 text-xs py-4">
                        Cốc phản ứng đang trống. Bấm chọn các nguyên tố ở bảng bên trái để ghép chất!
                      </div>
                    ) : (
                      Object.entries(draggedElements).map(([sym, count]) => (
                        <div 
                          key={sym}
                          className="px-3.5 py-2 bg-amber-500/20 text-amber-200 border border-amber-500/40 rounded-2xl flex items-center gap-2 font-bold text-sm"
                        >
                          <span>{sym}</span>
                          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                            {count}
                          </span>
                          <button 
                            onClick={() => handleRemoveElementFromBuilder(sym)}
                            className="p-1 hover:text-red-400 text-slate-400"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* SYNTHESIZED PRODUCT RESULT CARD */}
                {synthesizedCompound ? (
                  <div className="p-5 bg-gradient-to-r from-teal-950/80 to-slate-900 border border-teal-500/50 rounded-2xl space-y-3 animate-fadeIn shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        <span>Tổng hợp thành công!</span>
                      </span>
                      <span className="text-xs text-slate-400 font-mono">M = {synthesizedCompound.molarMass} g/mol</span>
                    </div>

                    <div>
                      <h4 className="text-2xl font-black text-white flex items-center gap-2">
                        <span>{synthesizedCompound.formula}</span>
                        <span className="text-sm font-bold text-teal-400">({synthesizedCompound.nameVi})</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        <MathView content={synthesizedCompound.descriptionVi} />
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelected3DMoleculeId(synthesizedCompound.formula.toLowerCase().replace(/[^a-z0-9]/g, ''));
                        setActiveTab('molecules3d');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Atom className="w-4 h-4 text-teal-300 animate-spin" />
                      <span>Xoay & Quan sát Liên kết 3D của {synthesizedCompound.formula}</span>
                    </button>
                  </div>
                ) : Object.keys(draggedElements).length > 0 ? (
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                    Đang tiếp tục thêm nguyên tử... Thử ghép thêm các nguyên tố phù hợp ($H, O, Na, Cl, C...$).
                  </div>
                ) : null}

              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: MÔ PHỎNG THÍ NGHIỆM ẢO (VIRTUAL CHEMISTRY LAB)
          ========================================================================= */}
      {activeTab === 'reactions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: Virtual Lab Visualizer */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-teal-400" />
                    <span>Mô phỏng Thí nghiệm Ảo Hóa học</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedReaction.title} ({selectedReaction.gradeLevel})
                  </p>
                </div>

                <button
                  onClick={() => {
                    setReactionProgress(0);
                    setIsReactionRunning(true);
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Tiến hành Thí nghiệm</span>
                </button>
              </div>

              {/* Equation Banner */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                <div className="text-base sm:text-lg font-bold text-teal-300">
                  <MathView content={selectedReaction.equationDisplay} />
                </div>
              </div>

              {/* VIRTUAL ANIMATED BEAKER CANVAS */}
              <div className="w-full h-[280px] bg-slate-950/90 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                {/* Simulated Beaker Container */}
                <div className="w-44 h-56 border-b-4 border-l-4 border-r-4 border-slate-400/80 rounded-b-3xl relative overflow-hidden flex flex-col justify-end p-2 bg-slate-900/40">
                  
                  {/* Solution Liquid */}
                  <div 
                    className="w-full rounded-b-2xl transition-all duration-300 relative flex items-center justify-center"
                    style={{ 
                      height: `${40 + (reactionProgress / 100) * 35}%`, 
                      backgroundColor: selectedReaction.solutionColor,
                      opacity: 0.85
                    }}
                  >
                    {/* Animated Gas Bubbles */}
                    {selectedReaction.visualEffect === 'gas_bubbles' && isReactionRunning && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-2 h-2 rounded-full bg-white/80 absolute left-1/4 animate-bounce" style={{ animationDuration: '0.6s' }} />
                        <div className="w-3 h-3 rounded-full bg-white/80 absolute left-2/4 animate-bounce" style={{ animationDuration: '0.4s' }} />
                        <div className="w-2 h-2 rounded-full bg-white/80 absolute left-3/4 animate-bounce" style={{ animationDuration: '0.8s' }} />
                      </div>
                    )}
                  </div>

                </div>

                {/* Thermometer / Heat Indicator */}
                {selectedReaction.hasHeat && (
                  <div className="absolute top-4 right-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span className="text-orange-300 font-bold">Phản ứng tỏa nhiệt</span>
                  </div>
                )}
              </div>

              {/* Phenomenon Description */}
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
                <span className="font-bold text-teal-400 uppercase tracking-wider block">
                  Hiện tượng thí nghiệm quan sát được:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  <MathView content={selectedReaction.phenomenonVi} />
                </p>
              </div>
            </div>

            {/* Right 5 Cols: Reaction Selector List */}
            <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
                <FlaskConical className="w-4 h-4 text-teal-400" />
                <span>Chọn bài học thí nghiệm ảo</span>
              </h4>

              <div className="space-y-3">
                {VIRTUAL_REACTIONS.map(rx => (
                  <button
                    key={rx.id}
                    onClick={() => {
                      setSelectedReaction(rx);
                      setReactionProgress(0);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedReaction.id === rx.id
                        ? 'bg-teal-950/80 border-teal-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-teal-300">{rx.gradeLevel}</span>
                    </div>
                    <p className="font-bold text-sm text-white">{rx.title}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: KIẾN THỨC SGK GDPT 2018 (LỚP 7 - 12)
          ========================================================================= */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Trọng tâm Kiến thức môn Hóa học GDPT 2018 (Lớp 7 - 12)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chuẩn hóa danh pháp hóa học mới IUPAC, các dạng toán tính theo phương trình hóa học và công thức cấu tạo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { title: 'Lớp 7: Nguyên tử & Bảng tuần hoàn', content: 'Khái niệm nguyên tử gồm hạt nhân ($p^+, n^0$) và vỏ electron ($e^-$). Bảng tuần hoàn gồm ô nguyên tử, $7$ chu kỳ và $18$ nhóm.' },
                { title: 'Lớp 8: Phản ứng hóa học & Định luật bảo toàn khối lượng', content: 'Phương trình hóa học biểu diễn phản ứng. Tổng khối lượng các chất tham gia bằng tổng khối lượng sản phẩm tạo thành: $m_A + m_B = m_C + m_D$.' },
                { title: 'Lớp 9: Kim loại, Phi kim & Hợp chất hữu cơ', content: 'Dãy hoạt động hóa học kim loại: $K, Na, Ca, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au$. Hợp chất hữu cơ Hydrocarbon $CH_4, C_2 H_4, C_2 H_2$.' },
                { title: 'Lớp 10: Cấu tạo nguyên tử & Liên kết hóa học', content: 'Hình dạng obitan $s$ (hình cầu) và $p$ (hình số 8 nổi). Liên kết ion, liên kết cộng hóa trị và liên kết Hydrogen.' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                  <h4 className="font-bold text-sm text-teal-300">{item.title}</h4>
                  <p className="text-slate-300 leading-relaxed">
                    <MathView content={item.content} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  Maximize2, 
  Camera, 
  Info, 
  Sparkles, 
  Eye, 
  Box, 
  Sliders, 
  ChevronDown, 
  ChevronUp,
  Layers,
  CheckCircle2,
  Atom as AtomIcon
} from 'lucide-react';
import { 
  Molecule3D, 
  Atom3D, 
  Bond3D, 
  MOLECULES_3D_DATABASE, 
  CPK_ELEMENT_SPECS,
  getMolecule3DByIdOrFormula 
} from '../data/molecule3DData';
import { MathView } from './MathView';

interface Molecule3DViewerProps {
  initialMoleculeId?: string;
  onMoleculeChange?: (molecule: Molecule3D) => void;
}

export function Molecule3DViewer({ initialMoleculeId = 'h2o', onMoleculeChange }: Molecule3DViewerProps) {
  // Selected Molecule State
  const [currentMolecule, setCurrentMolecule] = useState<Molecule3D>(() => {
    return getMolecule3DByIdOrFormula(initialMoleculeId) || MOLECULES_3D_DATABASE[0];
  });

  // Display Settings State
  const [renderMode, setRenderMode] = useState<'ball_and_stick' | 'cpk' | 'wireframe'>('ball_and_stick');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [showBondLabels, setShowBondLabels] = useState<boolean>(true);
  const [inspectedAtom, setInspectedAtom] = useState<Atom3D | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Canvas and Scene Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const moleculeGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVectorRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Filter database
  const filteredMolecules = useMemo(() => {
    if (!searchFilter.trim()) return MOLECULES_3D_DATABASE;
    const q = searchFilter.toLowerCase();
    return MOLECULES_3D_DATABASE.filter(m => 
      m.formula.toLowerCase().includes(q) || 
      m.nameVi.toLowerCase().includes(q) || 
      m.nameIupac.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  // Handle Molecule Switching
  const handleSelectMolecule = (molecule: Molecule3D) => {
    setCurrentMolecule(molecule);
    setInspectedAtom(null);
    if (onMoleculeChange) {
      onMoleculeChange(molecule);
    }
  };

  // --- THREE.JS SCENE INITIALIZATION & MOLECULE RENDERING ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL renderer for performance guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d); // Deep dark space background
    sceneRef.current = scene;

    // Add subtle fog for depth
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    // 2. Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // 3. WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Lighting
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback environment
    }

    // Key Light (Warm Sun)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    // Fill Light (Cool Sky)
    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.0);
    scene.add(fillLight);

    // Back / Rim Light
    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.2);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 2.0 * rotationSpeed;
    controls.maxDistance = 20;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // 6. Group for Molecule Objects
    const moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);
    moleculeGroupRef.current = moleculeGroup;

    // 7. Render Loop
    let animationFrameId: number;
    const animate = () => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 2.0 * rotationSpeed;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Handle Window / Container Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update autoRotate speed when changed in UI
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.autoRotateSpeed = 2.0 * rotationSpeed;
    }
  }, [isAutoRotating, rotationSpeed]);

  // --- REBUILD 3D MOLECULE MESHES ON MOLECULE OR RENDER MODE CHANGE ---
  useEffect(() => {
    const group = moleculeGroupRef.current;
    if (!group) return;

    // Clear existing children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material?.dispose();
        }
      }
    }

    // 1. Center the molecule coordinates around origin
    let sumX = 0, sumY = 0, sumZ = 0;
    currentMolecule.atoms.forEach(a => {
      sumX += a.x;
      sumY += a.y;
      sumZ += a.z;
    });
    const centerX = sumX / currentMolecule.atoms.length;
    const centerY = sumY / currentMolecule.atoms.length;
    const centerZ = sumZ / currentMolecule.atoms.length;

    // Create atom positions dictionary relative to center
    const atomPosMap = new Map<string, THREE.Vector3>();

    // 2. Render Atoms
    currentMolecule.atoms.forEach(atom => {
      const pos = new THREE.Vector3(atom.x - centerX, atom.y - centerY, atom.z - centerZ);
      atomPosMap.set(atom.id, pos);

      let radius = atom.radiusCPK;
      if (renderMode === 'cpk') {
        radius *= 1.85; // Van der Waals expanded space filling
      } else if (renderMode === 'wireframe') {
        radius *= 0.45;
      }

      const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
      
      const atomMat = new THREE.MeshPhysicalMaterial({
        color: atom.colorCPK,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        wireframe: renderMode === 'wireframe',
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, atomMat);
      sphereMesh.position.copy(pos);
      sphereMesh.userData = { atomData: atom, isAtom: true };
      sphereMesh.castShadow = true;
      sphereMesh.receiveShadow = true;

      // Add a subtle glowing ring if inspected
      if (inspectedAtom && inspectedAtom.id === atom.id) {
        const glowGeo = new THREE.SphereGeometry(radius * 1.25, 24, 24);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35,
          wireframe: true,
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        sphereMesh.add(glowMesh);
      }

      group.add(sphereMesh);
    });

    // 3. Render Bonds (Cylinders)
    if (renderMode !== 'cpk') {
      currentMolecule.bonds.forEach((bond, idx) => {
        const p1 = atomPosMap.get(bond.from);
        const p2 = atomPosMap.get(bond.to);

        if (!p1 || !p2) return;

        const distance = p1.distanceTo(p2);
        const bondCenter = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        // Direction vector
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();

        // Quaternion orientation for cylinders
        const orientation = new THREE.Quaternion();
        orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

        // Cylinder thickness
        const bondRadius = renderMode === 'wireframe' ? 0.03 : 0.08;

        // Render multiple parallel cylinders for double / triple bonds
        const bondCount = bond.order || (bond.type === 'double' ? 2 : bond.type === 'triple' ? 3 : 1);
        
        // Calculate perpendicular offset vector for double/triple bonds
        const perp = new THREE.Vector3(1, 0, 0);
        if (Math.abs(dir.x) > 0.9) perp.set(0, 1, 0);
        perp.crossVectors(dir, perp).normalize();

        for (let bIdx = 0; bIdx < bondCount; bIdx++) {
          let offsetDist = 0;
          if (bondCount === 2) {
            offsetDist = (bIdx === 0 ? -0.10 : 0.10);
          } else if (bondCount === 3) {
            offsetDist = (bIdx === 0 ? -0.14 : bIdx === 1 ? 0 : 0.14);
          }

          const offsetVector = perp.clone().multiplyScalar(offsetDist);
          const cylPos = bondCenter.clone().add(offsetVector);

          const cylGeo = new THREE.CylinderGeometry(bondRadius, bondRadius, distance, 16);
          
          let bondMat: THREE.Material;
          if (bond.type === 'ionic') {
            bondMat = new THREE.MeshBasicMaterial({
              color: 0x8b5cf6,
              wireframe: true,
              transparent: true,
              opacity: 0.6
            });
          } else {
            bondMat = new THREE.MeshStandardMaterial({
              color: 0xcbd5e1,
              metalness: 0.3,
              roughness: 0.3,
              wireframe: renderMode === 'wireframe'
            });
          }

          const cylMesh = new THREE.Mesh(cylGeo, bondMat);
          cylMesh.position.copy(cylPos);
          cylMesh.quaternion.copy(orientation);
          cylMesh.castShadow = true;

          group.add(cylMesh);
        }
      });
    }

    // Reset camera focus smooth
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, Math.max(6, currentMolecule.atoms.length * 0.9));
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }

  }, [currentMolecule, renderMode, inspectedAtom]);

  // --- RAYCASTING FOR INTERACTIVE ATOM SELECTION ---
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const group = moleculeGroupRef.current;
    if (!container || !camera || !group) return;

    const rect = container.getBoundingClientRect();
    mouseVectorRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVectorRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseVectorRef.current, camera);
    const intersects = raycasterRef.current.intersectObjects(group.children, true);

    const hitAtomMesh = intersects.find(hit => hit.object.userData && hit.object.userData.isAtom);
    if (hitAtomMesh && hitAtomMesh.object.userData.atomData) {
      setInspectedAtom(hitAtomMesh.object.userData.atomData);
      container.style.cursor = 'pointer';
    } else {
      container.style.cursor = 'default';
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, Math.max(6, currentMolecule.atoms.length * 0.9));
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    setInspectedAtom(null);
  };

  // Take Canvas Screenshot
  const handleCaptureImage = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `3d_molecule_${currentMolecule.formula}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30">
            <AtomIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mô phỏng Phân tử Hóa học 3D WebGL (Chuẩn IUPAC)</span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span>{currentMolecule.nameVi}</span>
            <span className="text-lg font-bold text-teal-400 font-mono">({currentMolecule.formula})</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Quan sát trực quan $3D$ liên kết hóa học, cấu trúc không gian, góc liên kết và lai hóa obitan. Dùng chuột/cảm ứng để xoay $360^\circ$, phóng to thu nhỏ và chạm vào từng nguyên tử.
          </p>
        </div>

        {/* Quick Molecule Selector Dropdown / Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <input
            type="text"
            placeholder="Tìm phân tử (H2O, CO2, CH4, C6H6...)"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* MAIN VIEWPORT & MOLECULE SELECTOR DOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive 3D Canvas Viewport */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative flex flex-col">
          
          {/* Top Floating Badge Bar */}
          <div className="p-4 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white font-mono">{currentMolecule.formula}</span>
              <span className="text-slate-400">•</span>
              <span className="text-teal-300">{currentMolecule.shapeNameVi}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCaptureImage}
                title="Tải ảnh 3D"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <Camera className="w-4 h-4 text-teal-400" />
              </button>
              <button
                onClick={handleResetCamera}
                title="Đặt lại góc nhìn"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* 3D CANVAS VIEWPORT AREA */}
          <div 
            ref={containerRef}
            onPointerMove={handleCanvasPointerMove}
            className="w-full h-[480px] bg-slate-950 relative overflow-hidden select-none touch-none"
          >
            {/* Inspected Atom Hover Tooltip Badge */}
            {inspectedAtom && (
              <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-teal-500/50 p-3 rounded-2xl shadow-xl space-y-1 text-xs animate-fadeIn pointer-events-none">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/50" 
                    style={{ backgroundColor: `#${inspectedAtom.colorCPK.toString(16).padStart(6, '0')}` }} 
                  />
                  <span className="font-extrabold text-white text-sm">{inspectedAtom.nameVi} ({inspectedAtom.symbol})</span>
                </div>
                <div className="text-slate-300">
                  Tọa độ $3D$: <span className="font-mono text-teal-300">({inspectedAtom.x.toFixed(2)}, {inspectedAtom.y.toFixed(2)}, {inspectedAtom.z.toFixed(2)}) Å</span>
                </div>
                {inspectedAtom.oxidationState && (
                  <p className="text-slate-300">
                    Số oxi hóa: <span className="font-bold text-amber-400">{inspectedAtom.oxidationState}</span>
                  </p>
                )}
              </div>
            )}

            {/* Instruction Overlay Tag */}
            <div className="absolute bottom-3 right-3 pointer-events-none bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>🖱️ Di chuột/xoay để xoay $360^\circ$ • Lăn chuột phóng to</span>
            </div>
          </div>

          {/* CONSOLIDATED COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
          <div className="bg-slate-950/90 border-t border-slate-800/80 p-4 transition-all z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Bảng điều khiển mô phỏng 3D</span>
              </span>

              <button
                onClick={() => setIsControlsCollapsed(prev => !prev)}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
              >
                <span>{isControlsCollapsed ? '▾ Mở rộng' : '▴ Thu gọn'}</span>
              </button>
            </div>

            {!isControlsCollapsed && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60 text-xs">
                
                {/* Mode Selector */}
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold block">Chế độ hiển thị:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'ball_and_stick', label: 'Quả cầu & Gậy' },
                      { id: 'cpk', label: 'Chiếm chỗ CPK' },
                      { id: 'wireframe', label: 'Khung dây' },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setRenderMode(mode.id as any)}
                        className={`py-1.5 px-2 rounded-xl font-bold text-[11px] transition-all border ${
                          renderMode === mode.id
                            ? 'bg-teal-600 text-white border-teal-400 shadow-sm'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Rotate Control */}
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold block">Tự động xoay 3D:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAutoRotating(prev => !prev)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        isAutoRotating ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{isAutoRotating ? 'Xoay' : 'Dừng'}</span>
                    </button>

                    <input 
                      type="range"
                      min={0.2}
                      max={3.0}
                      step={0.1}
                      value={rotationSpeed}
                      onChange={e => setRotationSpeed(parseFloat(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                    <span className="font-mono text-teal-300 text-[11px] font-bold">{rotationSpeed.toFixed(1)}x</span>
                  </div>
                </div>

                {/* Reset & CPK Legend */}
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold block">Màu CPK tiêu chuẩn:</span>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 rounded-md text-[10px] text-slate-300 border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-white" /> H
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 rounded-md text-[10px] text-slate-300 border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-slate-600" /> C
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 rounded-md text-[10px] text-slate-300 border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> O
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 rounded-md text-[10px] text-slate-300 border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> N
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 rounded-md text-[10px] text-slate-300 border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" /> S
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Right 4 Cols: Molecular Specifications & Database Quick Picker */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* MOLECULE DOSSIER CARD */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Thông số Hóa học Phân tử
              </span>
              <span className="text-xs text-slate-400 font-mono">M = {currentMolecule.molarMass} g/mol</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Tên IUPAC & Danh pháp</span>
                <p className="font-extrabold text-sm text-white">{currentMolecule.nameIupac}</p>
                <p className="text-teal-400 font-bold">{currentMolecule.categoryVi}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block">Dạng hình học</span>
                  <span className="font-bold text-xs text-white">{currentMolecule.shapeNameVi}</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block">Góc liên kết</span>
                  <span className="font-bold text-xs text-teal-300">
                    <MathView inline content={currentMolecule.bondAngleVi} />
                  </span>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block">Trạng thái lai hóa</span>
                  <span className="font-bold text-xs text-amber-300">
                    <MathView inline content={currentMolecule.hybridization} />
                  </span>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block">Tính phân cực</span>
                  <span className="font-bold text-xs text-emerald-400">{currentMolecule.polarityVi}</span>
                </div>
              </div>

              {/* Comprehensive Description */}
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Bản chất liên kết & Cấu tạo:</span>
                <MathView content={currentMolecule.descriptionVi} />
              </div>
            </div>
          </div>

          {/* QUICK MOLECULE PICKER GRID */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Thư viện Phân tử 3D ({filteredMolecules.length})</span>
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredMolecules.map(m => {
                const isSelected = currentMolecule.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMolecule(m)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-600/20 text-teal-200 border-teal-500 font-bold shadow-md ring-1 ring-teal-400'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/70 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-sm text-white font-mono">{m.formula}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">{m.nameVi}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

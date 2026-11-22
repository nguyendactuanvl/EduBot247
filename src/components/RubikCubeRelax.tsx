import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Shuffle,
  Sparkles,
  Lightbulb,
  Undo2,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Compass,
  Square,
  Keyboard,
  Trophy,
  EyeOff,
  Eye,
} from 'lucide-react';
import {
  AxisName,
  MOVE_SPECS,
  MoveNotation,
  OUTER_MOVES,
  buildSolutionFromHistory,
  formatStopwatch,
  generateScramble,
  invertMove,
  moveFromAxisLayerSign,
  simplifyMoveHistory,
} from './rubik/rubikEngine';
import { rubikAudio } from './rubik/rubikAudio';

interface RubikCubeRelaxProps {
  isDarkMode?: boolean;
}

type SpeedPreset = 'slow' | 'normal' | 'fast';
type ScrambleLevel = 8 | 18 | 25;

interface ActiveTurn {
  spec: (typeof MOVE_SPECS)[MoveNotation];
  elapsed: number;
  duration: number;
  cubies: THREE.Group[];
  source: 'user' | 'scramble' | 'solve' | 'undo' | 'hint';
}

interface BestRecord {
  bestTimeMs: number | null;
  totalSolves: number;
}

const STORAGE_KEY = 'edubot_rubik_stats_v1';
const CUBIE_STEP = 1.03;

const FACE_COLORS = {
  U: 0xf4f6fa, // White (+Y)
  D: 0xf5c824, // Yellow (-Y)
  F: 0x18a558, // Green (+Z)
  B: 0x1d63dc, // Blue (-Z)
  R: 0xdc2638, // Red (+X)
  L: 0xf26b1d, // Orange (-X)
} as const;

const SPEED_DURATION_MS: Record<SpeedPreset, number> = {
  slow: 340,
  normal: 205,
  fast: 115,
};

const DEFAULT_CAMERA_POS = new THREE.Vector3(4.9, 4.15, 5.5);
const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, -0.18, 0);

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '')
      : String(gl.getParameter(gl.RENDERER) || '');
    const isSoft = /SwiftShader|llvmpipe|Software|Mesa OffScreen|Basic Render/i.test(
      rendererStr,
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return isSoft;
  } catch {
    return true;
  }
}

function createRoundedSquareShape(size: number, radius: number): THREE.Shape {
  const half = size / 2;
  const r = Math.min(radius, half * 0.48);
  const shape = new THREE.Shape();
  shape.moveTo(-half + r, -half);
  shape.lineTo(half - r, -half);
  shape.quadraticCurveTo(half, -half, half, -half + r);
  shape.lineTo(half, half - r);
  shape.quadraticCurveTo(half, half, half - r, half);
  shape.lineTo(-half + r, half);
  shape.quadraticCurveTo(-half, half, -half, half - r);
  shape.lineTo(-half, -half + r);
  shape.quadraticCurveTo(-half, -half, -half + r, -half);
  return shape;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.08,
      size / 2,
      size / 2,
      size * 0.48,
    );
    grad.addColorStop(0, 'rgba(10, 15, 28, 0.42)');
    grad.addColorStop(0.5, 'rgba(10, 15, 28, 0.16)');
    grad.addColorStop(1, 'rgba(10, 15, 28, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCenterCapTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f4f6fa';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(30, 41, 59, 0.22)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 46, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.38)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 28, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(30, 41, 59, 0.35)';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Snap a quaternion to the nearest exact 90-degree cube rotation matrix
 * to prevent floating-point drift over hundreds of turns.
 */
const _snapMat = new THREE.Matrix4();
function snapQuaternionTo90(q: THREE.Quaternion): void {
  _snapMat.makeRotationFromQuaternion(q);
  const e = _snapMat.elements;
  for (let col = 0; col < 3; col++) {
    const base = col * 4;
    const ax = Math.abs(e[base]);
    const ay = Math.abs(e[base + 1]);
    const az = Math.abs(e[base + 2]);
    if (ax >= ay && ax >= az) {
      e[base] = Math.sign(e[base]) || 1;
      e[base + 1] = 0;
      e[base + 2] = 0;
    } else if (ay >= ax && ay >= az) {
      e[base] = 0;
      e[base + 1] = Math.sign(e[base + 1]) || 1;
      e[base + 2] = 0;
    } else {
      e[base] = 0;
      e[base + 1] = 0;
      e[base + 2] = Math.sign(e[base + 2]) || 1;
    }
  }
  q.setFromRotationMatrix(_snapMat).normalize();
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function loadRecords(): BestRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bestTimeMs: null, totalSolves: 0 };
    const parsed = JSON.parse(raw) as Partial<BestRecord>;
    return {
      bestTimeMs: typeof parsed.bestTimeMs === 'number' ? parsed.bestTimeMs : null,
      totalSolves: typeof parsed.totalSolves === 'number' ? parsed.totalSolves : 0,
    };
  } catch {
    return { bestTimeMs: null, totalSolves: 0 };
  }
}

function saveRecords(record: BestRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage quota issues
  }
}

export const RubikCubeRelax: React.FC<RubikCubeRelaxProps> = ({ isDarkMode = true }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [webglError, setWebglError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speedPreset, setSpeedPreset] = useState<SpeedPreset>('normal');
  const [scrambleLevel, setScrambleLevel] = useState<ScrambleLevel>(18);
  const [dockOpen, setDockOpen] = useState(true);
  const [showManualPad, setShowManualPad] = useState(false);

  const [moveCount, setMoveCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isScrambling, setIsScrambling] = useState(false);
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const [isScrambledState, setIsScrambledState] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [remainingSolveSteps, setRemainingSolveSteps] = useState(0);
  const [activeHint, setActiveHint] = useState<{
    notation: MoveNotation;
    desc: string;
    remaining: number;
  } | null>(null);
  const [solvedBanner, setSolvedBanner] = useState<{
    timeMs: number;
    moves: number;
    isNewBest: boolean;
  } | null>(null);
  const [records, setRecords] = useState<BestRecord>(() => loadRecords());

  // Mutable refs for Three.js engine bridge (never re-trigger WebGL init)
  const isDarkRef = useRef(isDarkMode);
  const speedRef = useRef<SpeedPreset>(speedPreset);
  const soundRef = useRef(soundEnabled);

  const historyRef = useRef<MoveNotation[]>([]);
  const moveQueueRef = useRef<
    Array<{ notation: MoveNotation; source: ActiveTurn['source']; durationOverride?: number }>
  >([]);
  const timerStartRef = useRef<number | null>(null);
  const timerRunningRef = useRef(false);
  const userMovesRef = useRef(0);
  const scrambledSessionRef = useRef(false);
  const isAutoSolvingRef = useRef(false);
  const isScramblingRef = useRef(false);

  // Bridge functions populated by the Three.js mount effect
  const engineApiRef = useRef<{
    enqueueMove: (
      notation: MoveNotation,
      source: ActiveTurn['source'],
      durationOverride?: number,
    ) => void;
    resetCube: () => void;
    stopAutoSolve: () => void;
    resetCamera: () => void;
    applyTheme: (dark: boolean) => void;
  } | null>(null);

  useEffect(() => {
    speedRef.current = speedPreset;
  }, [speedPreset]);

  useEffect(() => {
    soundRef.current = soundEnabled;
    rubikAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    isDarkRef.current = isDarkMode;
    engineApiRef.current?.applyTheme(isDarkMode);
  }, [isDarkMode]);

  // Smooth stopwatch display interval only while actively solving
  useEffect(() => {
    const id = window.setInterval(() => {
      if (timerRunningRef.current && timerStartRef.current !== null) {
        setElapsedMs(performance.now() - timerStartRef.current);
      }
    }, 80);
    return () => window.clearInterval(id);
  }, []);

  // Main Three.js WebGL setup (runs ONCE on mount)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: isSoftwareGl ? 'default' : 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const domEl = renderer.domElement;
    domEl.style.width = '100%';
    domEl.style.height = '100%';
    domEl.style.display = 'block';
    domEl.style.touchAction = 'none';
    container.appendChild(domEl);

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(isDarkRef.current ? 0x0b1120 : 0xedf2f7);
    scene.background = bgColor;

    // Environment reflections via RoomEnvironment (runs on both HW and SW GL)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = isDarkRef.current ? 0.72 : 0.9;
    envScene.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.copy(DEFAULT_CAMERA_POS);

    const controls = new OrbitControls(camera, domEl);
    controls.target.copy(DEFAULT_CAMERA_TARGET);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 5.2;
    controls.maxDistance = 12.5;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.78;
    controls.update();

    // 3-point studio lighting
    const hemiLight = new THREE.HemisphereLight(0xeef6ff, 0x1e293b, isDarkRef.current ? 0.6 : 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, isDarkRef.current ? 1.55 : 1.75);
    keyLight.position.set(6.5, 9.5, 7.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, isDarkRef.current ? 0.85 : 0.55);
    rimLight.position.set(-7, 4.5, -6.5);
    scene.add(rimLight);

    // Soft grounded studio shadow plane beneath cube
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(5.6, 5.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: isDarkRef.current ? 0.82 : 0.45,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.35;
    scene.add(shadowPlane);

    // Master cube root & turn pivot
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const pivotGroup = new THREE.Group();
    cubeGroup.add(pivotGroup);

    // Internal brushed-metallic speedcube core + axis spindles
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.72,
      roughness: 0.28,
    });
    const coreSphereGeo = new THREE.SphereGeometry(0.76, 20, 16);
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreMat);
    cubeGroup.add(coreSphere);

    const spindleGeo = new THREE.CylinderGeometry(0.11, 0.11, 2.35, 12);
    const spindleY = new THREE.Mesh(spindleGeo, coreMat);
    const spindleX = new THREE.Mesh(spindleGeo, coreMat);
    spindleX.rotation.z = Math.PI / 2;
    const spindleZ = new THREE.Mesh(spindleGeo, coreMat);
    spindleZ.rotation.x = Math.PI / 2;
    cubeGroup.add(spindleY, spindleX, spindleZ);

    // Shared beveled cubie body geometry (matte ABS charcoal)
    const bodyShape = createRoundedSquareShape(0.84, 0.12);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: 0.84,
      bevelEnabled: true,
      bevelThickness: 0.068,
      bevelSize: 0.068,
      bevelSegments: isSoftwareGl ? 1 : 3,
      curveSegments: isSoftwareGl ? 3 : 6,
    });
    bodyGeo.center();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x151822,
      roughness: 0.64,
      metalness: 0.06,
    });

    // Shared glossy rounded sticker tile geometry
    const stickerShape = createRoundedSquareShape(0.76, 0.1);
    const stickerGeo = new THREE.ExtrudeGeometry(stickerShape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: isSoftwareGl ? 1 : 2,
      curveSegments: isSoftwareGl ? 3 : 6,
    });
    stickerGeo.center();

    const centerCapTex = createCenterCapTexture();

    const makeStickerMat = (hex: number, map?: THREE.Texture) =>
      new THREE.MeshPhysicalMaterial({
        color: map ? 0xffffff : hex,
        map: map ?? null,
        roughness: 0.17,
        metalness: 0.02,
        clearcoat: 0.86,
        clearcoatRoughness: 0.14,
      });

    const stickerMaterials: Record<keyof typeof FACE_COLORS, THREE.MeshPhysicalMaterial> = {
      U: makeStickerMat(FACE_COLORS.U),
      D: makeStickerMat(FACE_COLORS.D),
      F: makeStickerMat(FACE_COLORS.F),
      B: makeStickerMat(FACE_COLORS.B),
      R: makeStickerMat(FACE_COLORS.R),
      L: makeStickerMat(FACE_COLORS.L),
    };
    const centerCapMat = makeStickerMat(FACE_COLORS.U, centerCapTex);

    // Build 26 exterior cubies (center (0,0,0) is occupied by the metallic core)
    const cubies: THREE.Group[] = [];
    const pickableMeshes: THREE.Mesh[] = [];
    const stickerMeshes: THREE.Mesh[] = [];

    const stickerOffset = 0.492;

    const addSticker = (
      parent: THREE.Group,
      colorKey: keyof typeof FACE_COLORS,
      pos: [number, number, number],
      rot: [number, number, number],
      isWhiteCenter = false,
    ) => {
      const mat = isWhiteCenter ? centerCapMat : stickerMaterials[colorKey];
      const mesh = new THREE.Mesh(stickerGeo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.set(rot[0], rot[1], rot[2]);
      mesh.userData = {
        cubie: parent,
        stickerColor: colorKey,
      };
      parent.add(mesh);
      pickableMeshes.push(mesh);
      stickerMeshes.push(mesh);
    };

    const buildCubies = () => {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;

            const cubie = new THREE.Group();
            cubie.position.set(x * CUBIE_STEP, y * CUBIE_STEP, z * CUBIE_STEP);
            cubie.userData = { homeX: x, homeY: y, homeZ: z };

            const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
            bodyMesh.castShadow = !isSoftwareGl;
            bodyMesh.receiveShadow = !isSoftwareGl;
            bodyMesh.userData = { cubie };
            cubie.add(bodyMesh);
            pickableMeshes.push(bodyMesh);

            if (y === 1) {
              addSticker(
                cubie,
                'U',
                [0, stickerOffset, 0],
                [-Math.PI / 2, 0, 0],
                x === 0 && z === 0,
              );
            }
            if (y === -1) {
              addSticker(cubie, 'D', [0, -stickerOffset, 0], [Math.PI / 2, 0, 0]);
            }
            if (z === 1) {
              addSticker(cubie, 'F', [0, 0, stickerOffset], [0, 0, 0]);
            }
            if (z === -1) {
              addSticker(cubie, 'B', [0, 0, -stickerOffset], [0, Math.PI, 0]);
            }
            if (x === 1) {
              addSticker(cubie, 'R', [stickerOffset, 0, 0], [0, Math.PI / 2, 0]);
            }
            if (x === -1) {
              addSticker(cubie, 'L', [-stickerOffset, 0, 0], [0, -Math.PI / 2, 0]);
            }

            cubeGroup.add(cubie);
            cubies.push(cubie);
          }
        }
      }
    };

    buildCubies();

    // Reusable scratch vectors / quaternions / raycaster (zero per-frame allocation)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const tmpQuat = new THREE.Quaternion();
    const tmpNormal = new THREE.Vector3();
    const tmpWorldPt = new THREE.Vector3();
    const tmpProj0 = new THREE.Vector3();
    const tmpProjU = new THREE.Vector3();
    const tmpProjV = new THREE.Vector3();
    const tmpScreenU = new THREE.Vector2();
    const tmpScreenV = new THREE.Vector2();
    const tmpDrag2D = new THREE.Vector2();
    const tmpDrag3D = new THREE.Vector3();
    const tmpTorque = new THREE.Vector3();
    const tmpLocalZ = new THREE.Vector3(0, 0, 1);

    // Visual solved check across all 6 faces
    const checkVisuallySolved = (): boolean => {
      const faceMap = new Map<string, string>();
      cubeGroup.updateMatrixWorld(true);

      for (let i = 0; i < stickerMeshes.length; i++) {
        const mesh = stickerMeshes[i];
        mesh.getWorldQuaternion(tmpQuat);
        tmpNormal.copy(tmpLocalZ).applyQuaternion(tmpQuat);

        const ax = Math.abs(tmpNormal.x);
        const ay = Math.abs(tmpNormal.y);
        const az = Math.abs(tmpNormal.z);

        let faceKey: string;
        if (ax >= ay && ax >= az) {
          faceKey = tmpNormal.x >= 0 ? '+x' : '-x';
        } else if (ay >= ax && ay >= az) {
          faceKey = tmpNormal.y >= 0 ? '+y' : '-y';
        } else {
          faceKey = tmpNormal.z >= 0 ? '+z' : '-z';
        }

        const color = mesh.userData.stickerColor as string;
        const existing = faceMap.get(faceKey);
        if (existing === undefined) {
          faceMap.set(faceKey, color);
        } else if (existing !== color) {
          return false;
        }
      }
      return faceMap.size === 6;
    };

    // Active animation & camera reset state
    let activeTurn: ActiveTurn | null = null;
    let cameraResetProgress: {
      elapsed: number;
      duration: number;
      startPos: THREE.Vector3;
      startTarget: THREE.Vector3;
    } | null = null;

    let rafId = 0;
    let needsRender = true;
    let isOrbitMoving = false;
    let lastTime = performance.now();
    let disposed = false;

    const glCtx = renderer.getContext();
    const isWebGL2 =
      typeof WebGL2RenderingContext !== 'undefined' && glCtx instanceof WebGL2RenderingContext;

    const scheduleNextFrame = () => {
      if (disposed || rafId !== 0) return;
      rafId = window.requestAnimationFrame(tick);
    };

    const requestRender = () => {
      if (disposed) return;
      needsRender = true;
      scheduleNextFrame();
    };

    const startNextQueuedTurn = () => {
      if (activeTurn || moveQueueRef.current.length === 0) return;

      const next = moveQueueRef.current.shift()!;
      const spec = MOVE_SPECS[next.notation];

      pivotGroup.rotation.set(0, 0, 0);
      pivotGroup.position.set(0, 0, 0);
      pivotGroup.updateMatrixWorld(true);

      const layerCubies: THREE.Group[] = [];
      for (let i = 0; i < cubies.length; i++) {
        const c = cubies[i];
        const coord =
          spec.axis === 'x'
            ? Math.round(c.position.x / CUBIE_STEP)
            : spec.axis === 'y'
              ? Math.round(c.position.y / CUBIE_STEP)
              : Math.round(c.position.z / CUBIE_STEP);
        if (coord === spec.layer) {
          layerCubies.push(c);
        }
      }

      for (let i = 0; i < layerCubies.length; i++) {
        pivotGroup.attach(layerCubies[i]);
      }

      const defaultDur = SPEED_DURATION_MS[speedRef.current];
      const duration = next.durationOverride ?? defaultDur;

      activeTurn = {
        spec,
        elapsed: 0,
        duration,
        cubies: layerCubies,
        source: next.source,
      };

      if (soundRef.current) {
        rubikAudio.playTurn(duration <= 130);
      }

      if (next.source === 'solve') {
        setActiveHint({
          notation: spec.notation,
          desc: spec.shortDescVi,
          remaining: moveQueueRef.current.length + 1,
        });
        setRemainingSolveSteps(moveQueueRef.current.length + 1);
      }

      requestRender();
    };

    const finalizeActiveTurn = () => {
      if (!activeTurn) return;
      const { spec, cubies: turnedCubies, source } = activeTurn;

      pivotGroup.rotation[spec.axis] = spec.angle;
      pivotGroup.updateMatrixWorld(true);

      for (let i = 0; i < turnedCubies.length; i++) {
        const c = turnedCubies[i];
        cubeGroup.attach(c);
        // Snap exact integer grid coords & exact 90-degree orientation
        const gx = Math.round(c.position.x / CUBIE_STEP);
        const gy = Math.round(c.position.y / CUBIE_STEP);
        const gz = Math.round(c.position.z / CUBIE_STEP);
        c.position.set(gx * CUBIE_STEP, gy * CUBIE_STEP, gz * CUBIE_STEP);
        snapQuaternionTo90(c.quaternion);
        c.updateMatrix();
      }

      pivotGroup.rotation.set(0, 0, 0);
      pivotGroup.updateMatrixWorld(true);

      // Update algebraic move history
      if (source === 'undo') {
        historyRef.current = simplifyMoveHistory([...historyRef.current, spec.notation]);
      } else {
        historyRef.current = simplifyMoveHistory([...historyRef.current, spec.notation]);
      }

      if (source === 'user' || source === 'hint') {
        if (!timerRunningRef.current && scrambledSessionRef.current) {
          timerStartRef.current = performance.now();
          timerRunningRef.current = true;
        }
        userMovesRef.current += 1;
        setMoveCount(userMovesRef.current);
      }

      setCanUndo(historyRef.current.length > 0);
      activeTurn = null;

      // Check queue completion states
      const queueEmpty = moveQueueRef.current.length === 0;

      if (source === 'scramble' && queueEmpty) {
        isScramblingRef.current = false;
        setIsScrambling(false);
        scrambledSessionRef.current = true;
        setIsScrambledState(true);
        userMovesRef.current = 0;
        setMoveCount(0);
        setElapsedMs(0);
        timerStartRef.current = null;
        timerRunningRef.current = false;
        setSolvedBanner(null);
      }

      if (source === 'solve' && queueEmpty) {
        isAutoSolvingRef.current = false;
        setIsAutoSolving(false);
        setRemainingSolveSteps(0);
        setActiveHint(null);
      }

      // Check solved state
      const isSolved = checkVisuallySolved();
      if (isSolved) {
        historyRef.current = [];
        setCanUndo(false);
        setActiveHint(null);
        setRemainingSolveSteps(0);
        setIsScrambledState(false);

        if (source === 'solve') {
          timerRunningRef.current = false;
          timerStartRef.current = null;
          scrambledSessionRef.current = false;
          if (soundRef.current) rubikAudio.playSolved();
        } else if (scrambledSessionRef.current && (source === 'user' || source === 'hint' || source === 'undo')) {
          const finalTime =
            timerStartRef.current !== null ? performance.now() - timerStartRef.current : 0;
          timerRunningRef.current = false;
          timerStartRef.current = null;
          scrambledSessionRef.current = false;
          setElapsedMs(finalTime);

          setRecords((prev) => {
            const isNewBest = prev.bestTimeMs === null || (finalTime > 0 && finalTime < prev.bestTimeMs);
            const updated: BestRecord = {
              bestTimeMs: isNewBest && finalTime > 0 ? finalTime : prev.bestTimeMs,
              totalSolves: prev.totalSolves + 1,
            };
            saveRecords(updated);
            setSolvedBanner({
              timeMs: finalTime,
              moves: userMovesRef.current,
              isNewBest,
            });
            return updated;
          });

          if (soundRef.current) rubikAudio.playSolved();
        }
      } else if (source === 'user') {
        setIsScrambledState(true);
        setActiveHint(null);
      }

      if (!queueEmpty) {
        startNextQueuedTurn();
      }
    };

    const afterDraw = (cb: () => void) => {
      if (!isSoftwareGl) {
        cb();
        return;
      }
      if (isWebGL2) {
        const gl2 = glCtx as WebGL2RenderingContext;
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          gl2.flush();
          const poll = () => {
            if (disposed) {
              gl2.deleteSync(sync);
              return;
            }
            const status = gl2.clientWaitSync(sync, 0, 0);
            if (status === gl2.ALREADY_SIGNALED || status === gl2.CONDITION_SATISFIED) {
              gl2.deleteSync(sync);
              cb();
            } else {
              window.setTimeout(poll, 4);
            }
          };
          poll();
          return;
        }
      }
      window.setTimeout(cb, 0);
    };

    const tick = (now: number) => {
      rafId = 0;
      if (disposed) return;

      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      let keepRunning = false;

      if (!activeTurn && moveQueueRef.current.length > 0) {
        startNextQueuedTurn();
      }

      if (activeTurn) {
        activeTurn.elapsed += dt;
        const rawT = Math.min(activeTurn.elapsed / activeTurn.duration, 1);
        const eased = easeOutCubic(rawT);
        activeTurn.spec.axis && (pivotGroup.rotation[activeTurn.spec.axis] = activeTurn.spec.angle * eased);
        needsRender = true;

        if (rawT >= 1) {
          finalizeActiveTurn();
        }
        keepRunning = activeTurn !== null || moveQueueRef.current.length > 0;
      }

      if (cameraResetProgress) {
        cameraResetProgress.elapsed += dt;
        const t = Math.min(cameraResetProgress.elapsed / cameraResetProgress.duration, 1);
        const eased = easeOutCubic(t);
        camera.position.lerpVectors(cameraResetProgress.startPos, DEFAULT_CAMERA_POS, eased);
        controls.target.lerpVectors(cameraResetProgress.startTarget, DEFAULT_CAMERA_TARGET, eased);
        controls.update();
        needsRender = true;
        if (t >= 1) {
          cameraResetProgress = null;
        } else {
          keepRunning = true;
        }
      } else if (controls.enableDamping && isOrbitMoving) {
        controls.update();
        needsRender = true;
        keepRunning = true;
      }

      if (needsRender) {
        needsRender = false;
        renderer.render(scene, camera);
        if (keepRunning) {
          afterDraw(() => {
            if (!disposed) {
              lastTime = performance.now();
              scheduleNextFrame();
            }
          });
        }
      } else if (keepRunning) {
        scheduleNextFrame();
      }
    };

    // OrbitControls listener
    let dampingStopTimeout: number | null = null;
    const onControlsChange = () => {
      requestRender();
    };
    const onControlsStart = () => {
      cameraResetProgress = null;
      isOrbitMoving = true;
      if (dampingStopTimeout !== null) {
        window.clearTimeout(dampingStopTimeout);
        dampingStopTimeout = null;
      }
      requestRender();
    };
    const onControlsEnd = () => {
      if (controls.enableDamping) {
        dampingStopTimeout = window.setTimeout(() => {
          isOrbitMoving = false;
        }, 420);
      } else {
        isOrbitMoving = false;
      }
    };
    controls.addEventListener('change', onControlsChange);
    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('end', onControlsEnd);

    // Direct pointer drag-on-face gesture to rotate any slice naturally
    let dragState: {
      pointerId: number;
      startX: number;
      startY: number;
      cubieGrid: { x: -1 | 0 | 1; y: -1 | 0 | 1; z: -1 | 0 | 1 };
      faceNormal: THREE.Vector3;
      uAxis: THREE.Vector3;
      vAxis: THREE.Vector3;
      hitPoint: THREE.Vector3;
      triggered: boolean;
    } | null = null;

    const getCanvasNdc = (clientX: number, clientY: number) => {
      const rect = domEl.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      return rect;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (isScramblingRef.current || isAutoSolvingRef.current || activeTurn) return;

      getCanvasNdc(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(pickableMeshes, false);

      if (hits.length === 0) {
        // Empty space -> let OrbitControls handle camera orbiting
        return;
      }

      const hit = hits[0];
      const cubie = hit.object.userData.cubie as THREE.Group | undefined;
      if (!cubie || !hit.face) return;

      // Compute world normal of the clicked face and snap to cardinal axis
      tmpNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize();
      const ax = Math.abs(tmpNormal.x);
      const ay = Math.abs(tmpNormal.y);
      const az = Math.abs(tmpNormal.z);

      const faceNormal = new THREE.Vector3();
      const uAxis = new THREE.Vector3();
      const vAxis = new THREE.Vector3();

      if (ax >= ay && ax >= az) {
        faceNormal.set(Math.sign(tmpNormal.x) || 1, 0, 0);
        uAxis.set(0, 1, 0);
        vAxis.set(0, 0, 1);
      } else if (ay >= ax && ay >= az) {
        faceNormal.set(0, Math.sign(tmpNormal.y) || 1, 0);
        uAxis.set(1, 0, 0);
        vAxis.set(0, 0, 1);
      } else {
        faceNormal.set(0, 0, Math.sign(tmpNormal.z) || 1);
        uAxis.set(1, 0, 0);
        vAxis.set(0, 1, 0);
      }

      const gx = Math.max(-1, Math.min(1, Math.round(cubie.position.x / CUBIE_STEP))) as -1 | 0 | 1;
      const gy = Math.max(-1, Math.min(1, Math.round(cubie.position.y / CUBIE_STEP))) as -1 | 0 | 1;
      const gz = Math.max(-1, Math.min(1, Math.round(cubie.position.z / CUBIE_STEP))) as -1 | 0 | 1;

      controls.enabled = false;
      domEl.setPointerCapture(e.pointerId);

      dragState = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        cubieGrid: { x: gx, y: gy, z: gz },
        faceNormal,
        uAxis,
        vAxis,
        hitPoint: hit.point.clone(),
        triggered: false,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragState || dragState.pointerId !== e.pointerId || dragState.triggered) return;

      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      if (Math.hypot(dx, dy) < 16) return;

      const rect = domEl.getBoundingClientRect();

      // Project hitPoint, hitPoint + uAxis, hitPoint + vAxis into screen pixels
      tmpProj0.copy(dragState.hitPoint).project(camera);
      tmpWorldPt.copy(dragState.hitPoint).add(dragState.uAxis);
      tmpProjU.copy(tmpWorldPt).project(camera);
      tmpWorldPt.copy(dragState.hitPoint).add(dragState.vAxis);
      tmpProjV.copy(tmpWorldPt).project(camera);

      tmpScreenU
        .set(
          ((tmpProjU.x - tmpProj0.x) * rect.width) / 2,
          (-(tmpProjU.y - tmpProj0.y) * rect.height) / 2,
        )
        .normalize();
      tmpScreenV
        .set(
          ((tmpProjV.x - tmpProj0.x) * rect.width) / 2,
          (-(tmpProjV.y - tmpProj0.y) * rect.height) / 2,
        )
        .normalize();

      tmpDrag2D.set(dx, dy).normalize();

      const dotU = tmpDrag2D.dot(tmpScreenU);
      const dotV = tmpDrag2D.dot(tmpScreenV);

      if (Math.abs(dotU) >= Math.abs(dotV)) {
        tmpDrag3D.copy(dragState.uAxis).multiplyScalar(Math.sign(dotU) || 1);
      } else {
        tmpDrag3D.copy(dragState.vAxis).multiplyScalar(Math.sign(dotV) || 1);
      }

      // Torque axis = faceNormal x dragDirection3D
      tmpTorque.crossVectors(dragState.faceNormal, tmpDrag3D);

      let rotAxis: AxisName = 'x';
      let angleSign: 1 | -1 = 1;
      if (Math.abs(tmpTorque.x) > 0.5) {
        rotAxis = 'x';
        angleSign = tmpTorque.x > 0 ? 1 : -1;
      } else if (Math.abs(tmpTorque.y) > 0.5) {
        rotAxis = 'y';
        angleSign = tmpTorque.y > 0 ? 1 : -1;
      } else {
        rotAxis = 'z';
        angleSign = tmpTorque.z > 0 ? 1 : -1;
      }

      const layer = dragState.cubieGrid[rotAxis];
      const move = moveFromAxisLayerSign(rotAxis, layer, angleSign);

      dragState.triggered = true;
      if (move) {
        moveQueueRef.current.push({ notation: move, source: 'user' });
        startNextQueuedTurn();
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragState || dragState.pointerId !== e.pointerId) return;
      try {
        if (domEl.hasPointerCapture(e.pointerId)) {
          domEl.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore release errors
      }
      dragState = null;
      controls.enabled = true;
    };

    domEl.addEventListener('pointerdown', onPointerDown);
    domEl.addEventListener('pointermove', onPointerMove);
    domEl.addEventListener('pointerup', endDrag);
    domEl.addEventListener('pointercancel', endDrag);

    // WebGL context loss safety
    const onContextLost = (ev: Event) => {
      ev.preventDefault();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
    const onContextRestored = () => {
      requestRender();
    };
    domEl.addEventListener('webglcontextlost', onContextLost);
    domEl.addEventListener('webglcontextrestored', onContextRestored);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(Math.floor(entry.contentRect.width), 1);
        const h = Math.max(Math.floor(entry.contentRect.height), 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        requestRender();
      }
    });
    resizeObserver.observe(container);

    // Expose engine API to React callbacks
    engineApiRef.current = {
      enqueueMove: (notation, source, durationOverride) => {
        moveQueueRef.current.push({ notation, source, durationOverride });
        startNextQueuedTurn();
      },
      resetCube: () => {
        // Cancel pending moves and snap current turn immediately
        moveQueueRef.current = [];
        if (activeTurn) {
          for (const c of activeTurn.cubies) {
            cubeGroup.attach(c);
          }
          pivotGroup.rotation.set(0, 0, 0);
          activeTurn = null;
        }
        // Reset all 26 cubies to home position and identity quaternion
        for (const c of cubies) {
          const { homeX, homeY, homeZ } = c.userData as {
            homeX: number;
            homeY: number;
            homeZ: number;
          };
          c.position.set(homeX * CUBIE_STEP, homeY * CUBIE_STEP, homeZ * CUBIE_STEP);
          c.quaternion.identity();
          c.updateMatrix();
        }
        historyRef.current = [];
        userMovesRef.current = 0;
        timerRunningRef.current = false;
        timerStartRef.current = null;
        scrambledSessionRef.current = false;
        isAutoSolvingRef.current = false;
        isScramblingRef.current = false;

        setMoveCount(0);
        setElapsedMs(0);
        setCanUndo(false);
        setIsAutoSolving(false);
        setIsScrambling(false);
        setIsScrambledState(false);
        setRemainingSolveSteps(0);
        setActiveHint(null);
        setSolvedBanner(null);

        requestRender();
      },
      stopAutoSolve: () => {
        moveQueueRef.current = [];
        isAutoSolvingRef.current = false;
        setIsAutoSolving(false);
        setRemainingSolveSteps(0);
        setActiveHint(null);
      },
      resetCamera: () => {
        cameraResetProgress = {
          elapsed: 0,
          duration: 380,
          startPos: camera.position.clone(),
          startTarget: controls.target.clone(),
        };
        requestRender();
      },
      applyTheme: (dark) => {
        bgColor.setHex(dark ? 0x0b1120 : 0xedf2f7);
        scene.background = bgColor;
        scene.environmentIntensity = dark ? 0.72 : 0.9;
        hemiLight.intensity = dark ? 0.6 : 0.85;
        keyLight.intensity = dark ? 1.55 : 1.75;
        rimLight.intensity = dark ? 0.85 : 0.55;
        shadowMat.opacity = dark ? 0.82 : 0.45;
        requestRender();
      },
    };

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (dampingStopTimeout !== null) window.clearTimeout(dampingStopTimeout);
      resizeObserver.disconnect();
      controls.removeEventListener('change', onControlsChange);
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('end', onControlsEnd);
      controls.dispose();

      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointermove', onPointerMove);
      domEl.removeEventListener('pointerup', endDrag);
      domEl.removeEventListener('pointercancel', endDrag);
      domEl.removeEventListener('webglcontextlost', onContextLost);
      domEl.removeEventListener('webglcontextrestored', onContextRestored);

      // Dispose all GPU resources cleanly
      bodyGeo.dispose();
      bodyMat.dispose();
      stickerGeo.dispose();
      Object.values(stickerMaterials).forEach((m) => m.dispose());
      centerCapMat.dispose();
      centerCapTex.dispose();
      coreSphereGeo.dispose();
      spindleGeo.dispose();
      coreMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      envRT.dispose();

      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
      engineApiRef.current = null;
    };
  }, []);

  // Action handlers
  const handleScramble = useCallback(() => {
    const api = engineApiRef.current;
    if (!api || isScramblingRef.current) return;

    if (isAutoSolvingRef.current) {
      api.stopAutoSolve();
    }

    setSolvedBanner(null);
    setActiveHint(null);
    setIsScrambling(true);
    isScramblingRef.current = true;
    timerRunningRef.current = false;
    timerStartRef.current = null;
    setElapsedMs(0);

    const moves = generateScramble(scrambleLevel);
    const stepMs = scrambleLevel >= 25 ? 62 : 78;
    moves.forEach((m) => api.enqueueMove(m, 'scramble', stepMs));
  }, [scrambleLevel]);

  const handleManualMove = useCallback((move: MoveNotation) => {
    const api = engineApiRef.current;
    if (!api || isScramblingRef.current || isAutoSolvingRef.current) return;
    setSolvedBanner(null);
    api.enqueueMove(move, 'user');
  }, []);

  const handleUndo = useCallback(() => {
    const api = engineApiRef.current;
    if (!api || isScramblingRef.current || isAutoSolvingRef.current) return;
    if (historyRef.current.length === 0) return;

    const lastMove = historyRef.current[historyRef.current.length - 1];
    const undoMove = invertMove(lastMove);
    api.enqueueMove(undoMove, 'undo', 165);
  }, []);

  const handleHintStep = useCallback(() => {
    const api = engineApiRef.current;
    if (!api || isScramblingRef.current || isAutoSolvingRef.current) return;

    const solution = buildSolutionFromHistory(historyRef.current);
    if (solution.length === 0) {
      setActiveHint(null);
      return;
    }

    const nextMove = solution[0];
    const spec = MOVE_SPECS[nextMove];
    setActiveHint({
      notation: nextMove,
      desc: spec.shortDescVi,
      remaining: solution.length,
    });
    if (soundRef.current) rubikAudio.playHint();
    api.enqueueMove(nextMove, 'hint', 260);
  }, []);

  const handleToggleAutoSolve = useCallback(() => {
    const api = engineApiRef.current;
    if (!api || isScramblingRef.current) return;

    if (isAutoSolvingRef.current) {
      api.stopAutoSolve();
      return;
    }

    const solution = buildSolutionFromHistory(historyRef.current);
    if (solution.length === 0) return;

    setSolvedBanner(null);
    setIsAutoSolving(true);
    isAutoSolvingRef.current = true;
    setRemainingSolveSteps(solution.length);

    const stepDur =
      speedRef.current === 'slow' ? 320 : speedRef.current === 'fast' ? 115 : 195;
    solution.forEach((m) => api.enqueueMove(m, 'solve', stepDur));
  }, []);

  const handleReset = useCallback(() => {
    engineApiRef.current?.resetCube();
  }, []);

  // Keyboard shortcuts (U, D, L, R, F, B + Shift for prime, Space = Scramble, Z = Undo, H = Hint)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (['U', 'D', 'L', 'R', 'F', 'B'].includes(key)) {
        e.preventDefault();
        const move = (e.shiftKey ? `${key}'` : key) as MoveNotation;
        handleManualMove(move);
      } else if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleScramble();
      } else if (key === 'Z' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleUndo();
      } else if (key === 'H') {
        e.preventDefault();
        handleHintStep();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleManualMove, handleScramble, handleUndo, handleHintStep]);

  const speedLabel =
    speedPreset === 'slow' ? 'Chậm' : speedPreset === 'normal' ? 'Vừa' : 'Nhanh';

  const cycleSpeed = () => {
    setSpeedPreset((prev) =>
      prev === 'normal' ? 'fast' : prev === 'fast' ? 'slow' : 'normal',
    );
  };

  const cycleScrambleLevel = () => {
    setScrambleLevel((prev) => (prev === 18 ? 25 : prev === 25 ? 8 : 18));
  };

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Không thể khởi tạo khung hình 3D WebGL
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Trình duyệt hiện tại chưa bật tăng tốc đồ họa WebGL. Hãy thử tải lại trang hoặc bật WebGL trong cài đặt trình duyệt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-100 dark:bg-slate-950">
      {/* Isolated WebGL mount node */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Top-Left Header & Unboxed Tabular Stats */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 flex flex-col gap-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Rubik 3D Thư Giãn
        </h2>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
            {formatStopwatch(elapsedMs)}
          </span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span className="font-mono tabular-nums">
            {moveCount} bước
          </span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span className="font-mono tabular-nums">
            Kỷ lục{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {records.bestTimeMs !== null ? formatStopwatch(records.bestTimeMs) : '--:--.-'}
            </strong>
          </span>
          {records.totalSolves > 0 && (
            <>
              <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">·</span>
              <span className="hidden sm:inline font-mono tabular-nums text-slate-500 dark:text-slate-400">
                Đã giải {records.totalSolves} lần
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
          Vuốt trực tiếp trên mặt khối để xoay tầng · Kéo nền trống để xoay góc nhìn
        </p>
      </div>

      {/* Top-Right Compact Utility Icons (No backdrop-filter over WebGL) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        <button
          onClick={() => engineApiRef.current?.resetCamera()}
          className="p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Đưa góc nhìn về mặc định"
          aria-label="Đưa góc nhìn về mặc định"
        >
          <Compass className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSoundEnabled((v) => !v)}
          className="p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={soundEnabled ? 'Tắt âm thanh xoay' : 'Bật âm thanh xoay'}
          aria-label={soundEnabled ? 'Tắt âm thanh xoay' : 'Bật âm thanh xoay'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <button
          onClick={() => setDockOpen((v) => !v)}
          className="px-2.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          title={dockOpen ? 'Ẩn bảng điều khiển (Chế độ tập trung)' : 'Hiện bảng điều khiển'}
        >
          {dockOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{dockOpen ? 'Ẩn bảng' : 'Điều khiển'}</span>
        </button>
      </div>

      {/* Active Hint / Auto-Solve Step Banner (Top-Center, non-blocking) */}
      {activeHint && !solvedBanner && (
        <div className="pointer-events-none absolute top-20 sm:top-5 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-indigo-200 dark:border-indigo-800 shadow-sm flex items-center gap-3">
            <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 min-w-[2rem] text-center">
              {activeHint.notation}
            </span>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
              {activeHint.desc}
            </div>
            <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-2.5">
              Còn {isAutoSolving ? remainingSolveSteps : activeHint.remaining} bước
            </span>
          </div>
        </div>
      )}

      {/* Solved Celebration Banner (Top-Center, non-blocking) */}
      {solvedBanner && (
        <div className="absolute top-20 sm:top-5 left-1/2 -translate-x-1/2 z-20">
          <div className="px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-emerald-300 dark:border-emerald-700 shadow-md flex items-center gap-3.5">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs sm:text-sm">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Hoàn thành khối Rubik!</span>
                {solvedBanner.isNewBest && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    · Kỷ lục mới
                  </span>
                )}
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-mono tabular-nums text-xs">
                {formatStopwatch(solvedBanner.timeMs)} · {solvedBanner.moves} bước xoay
              </div>
            </div>
            <button
              onClick={handleScramble}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Xáo lại
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Bottom Control Dock (Zero Mid-Screen Occlusion) */}
      {dockOpen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-1.5rem)] max-w-3xl">
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-lg p-2.5 sm:p-3 space-y-2.5">
            {/* Expandable Manual Face Keypad & Shortcuts */}
            {showManualPad && (
              <div className="pb-2.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {OUTER_MOVES.map((m) => (
                    <button
                      key={m}
                      onClick={() => handleManualMove(m)}
                      disabled={isScrambling || isAutoSolving}
                      title={MOVE_SPECS[m].shortDescVi}
                      className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-100 font-mono text-xs sm:text-sm font-bold transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-0.5">
                  <span>
                    Phím tắt: <strong className="font-mono text-slate-700 dark:text-slate-200">U D L R F B</strong> (giữ{' '}
                    <strong className="font-mono text-slate-700 dark:text-slate-200">Shift</strong> xoay ngược)
                  </span>
                  <span>
                    <strong className="font-mono text-slate-700 dark:text-slate-200">Space</strong> xáo ·{' '}
                    <strong className="font-mono text-slate-700 dark:text-slate-200">Z</strong> hoàn tác ·{' '}
                    <strong className="font-mono text-slate-700 dark:text-slate-200">H</strong> gợi ý
                  </span>
                </div>
              </div>
            )}

            {/* Primary Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Scramble Button */}
                <button
                  onClick={handleScramble}
                  disabled={isScrambling}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>{isScrambling ? 'Đang xáo...' : 'Xáo trộn'}</span>
                </button>

                {/* Scramble Length Cycle */}
                <button
                  onClick={cycleScrambleLevel}
                  disabled={isScrambling || isAutoSolving}
                  title="Đổi độ khó số bước xáo trộn"
                  className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono tabular-nums font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {scrambleLevel} bước
                </button>

                {/* Hint 1 Step */}
                <button
                  onClick={handleHintStep}
                  disabled={isScrambling || isAutoSolving || !canUndo}
                  title="Thực hiện và giải thích 1 bước tiếp theo để giải khối"
                  className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Gợi ý</span>
                </button>

                {/* Auto-Solve Toggle */}
                <button
                  onClick={handleToggleAutoSolve}
                  disabled={isScrambling || (!isAutoSolving && !canUndo)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer ${
                    isAutoSolving
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isAutoSolving ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Dừng giải</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Tự động giải</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Undo */}
                <button
                  onClick={handleUndo}
                  disabled={isScrambling || isAutoSolving || !canUndo}
                  title="Hoàn tác bước vừa xoay (Z)"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                  aria-label="Hoàn tác"
                >
                  <Undo2 className="w-4 h-4" />
                </button>

                {/* Reset Cube */}
                <button
                  onClick={handleReset}
                  disabled={!isScrambledState && !canUndo && !isAutoSolving}
                  title="Đặt lại khối về trạng thái ban đầu"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                  aria-label="Đặt lại khối"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Speed Cycle */}
                <button
                  onClick={cycleSpeed}
                  title="Chỉnh tốc độ xoay khối"
                  className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  Tốc độ: {speedLabel}
                </button>

                {/* Manual Keypad Drawer Toggle */}
                <button
                  onClick={() => setShowManualPad((v) => !v)}
                  title="Mở bảng nút xoay từng mặt và phím tắt"
                  className={`px-2.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    showManualPad
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Xoay tay</span>
                  {showManualPad ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

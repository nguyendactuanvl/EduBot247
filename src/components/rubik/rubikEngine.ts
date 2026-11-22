/**
 * Pure TypeScript 3x3x3 Rubik's Cube notation, move mapping,
 * algebraic history simplifier, scramble generator, and step-by-step solver.
 */

export type FaceCode = 'U' | 'D' | 'L' | 'R' | 'F' | 'B' | 'M' | 'E' | 'S';
export type MoveNotation =
  | 'U' | "U'"
  | 'D' | "D'"
  | 'L' | "L'"
  | 'R' | "R'"
  | 'F' | "F'"
  | 'B' | "B'"
  | 'M' | "M'"
  | 'E' | "E'"
  | 'S' | "S'";

export type AxisName = 'x' | 'y' | 'z';

export interface MoveSpec {
  notation: MoveNotation;
  face: FaceCode;
  prime: boolean;
  axis: AxisName;
  layer: -1 | 0 | 1;
  /** Signed rotation angle in radians around positive world axis */
  angle: number;
  labelVi: string;
  shortDescVi: string;
}

const HALF_PI = Math.PI / 2;

export const MOVE_SPECS: Record<MoveNotation, MoveSpec> = {
  U: {
    notation: 'U',
    face: 'U',
    prime: false,
    axis: 'y',
    layer: 1,
    angle: -HALF_PI,
    labelVi: 'Mặt Trên (U)',
    shortDescVi: 'Xoay mặt Trên cùng chiều kim đồng hồ',
  },
  "U'": {
    notation: "U'",
    face: 'U',
    prime: true,
    axis: 'y',
    layer: 1,
    angle: HALF_PI,
    labelVi: "Mặt Trên ngược (U')",
    shortDescVi: 'Xoay mặt Trên ngược chiều kim đồng hồ',
  },
  D: {
    notation: 'D',
    face: 'D',
    prime: false,
    axis: 'y',
    layer: -1,
    angle: HALF_PI,
    labelVi: 'Mặt Dưới (D)',
    shortDescVi: 'Xoay mặt Dưới cùng chiều kim đồng hồ',
  },
  "D'": {
    notation: "D'",
    face: 'D',
    prime: true,
    axis: 'y',
    layer: -1,
    angle: -HALF_PI,
    labelVi: "Mặt Dưới ngược (D')",
    shortDescVi: 'Xoay mặt Dưới ngược chiều kim đồng hồ',
  },
  R: {
    notation: 'R',
    face: 'R',
    prime: false,
    axis: 'x',
    layer: 1,
    angle: -HALF_PI,
    labelVi: 'Mặt Phải (R)',
    shortDescVi: 'Xoay mặt Phải cùng chiều kim đồng hồ',
  },
  "R'": {
    notation: "R'",
    face: 'R',
    prime: true,
    axis: 'x',
    layer: 1,
    angle: HALF_PI,
    labelVi: "Mặt Phải ngược (R')",
    shortDescVi: 'Xoay mặt Phải ngược chiều kim đồng hồ',
  },
  L: {
    notation: 'L',
    face: 'L',
    prime: false,
    axis: 'x',
    layer: -1,
    angle: HALF_PI,
    labelVi: 'Mặt Trái (L)',
    shortDescVi: 'Xoay mặt Trái cùng chiều kim đồng hồ',
  },
  "L'": {
    notation: "L'",
    face: 'L',
    prime: true,
    axis: 'x',
    layer: -1,
    angle: -HALF_PI,
    labelVi: "Mặt Trái ngược (L')",
    shortDescVi: 'Xoay mặt Trái ngược chiều kim đồng hồ',
  },
  F: {
    notation: 'F',
    face: 'F',
    prime: false,
    axis: 'z',
    layer: 1,
    angle: -HALF_PI,
    labelVi: 'Mặt Trước (F)',
    shortDescVi: 'Xoay mặt Trước cùng chiều kim đồng hồ',
  },
  "F'": {
    notation: "F'",
    face: 'F',
    prime: true,
    axis: 'z',
    layer: 1,
    angle: HALF_PI,
    labelVi: "Mặt Trước ngược (F')",
    shortDescVi: 'Xoay mặt Trước ngược chiều kim đồng hồ',
  },
  B: {
    notation: 'B',
    face: 'B',
    prime: false,
    axis: 'z',
    layer: -1,
    angle: HALF_PI,
    labelVi: 'Mặt Sau (B)',
    shortDescVi: 'Xoay mặt Sau cùng chiều kim đồng hồ',
  },
  "B'": {
    notation: "B'",
    face: 'B',
    prime: true,
    axis: 'z',
    layer: -1,
    angle: -HALF_PI,
    labelVi: "Mặt Sau ngược (B')",
    shortDescVi: 'Xoay mặt Sau ngược chiều kim đồng hồ',
  },
  M: {
    notation: 'M',
    face: 'M',
    prime: false,
    axis: 'x',
    layer: 0,
    angle: HALF_PI,
    labelVi: 'Lớp Giữa dọc (M)',
    shortDescVi: 'Xoay lớp Giữa dọc theo chiều mặt Trái',
  },
  "M'": {
    notation: "M'",
    face: 'M',
    prime: true,
    axis: 'x',
    layer: 0,
    angle: -HALF_PI,
    labelVi: "Lớp Giữa dọc ngược (M')",
    shortDescVi: 'Xoay lớp Giữa dọc theo chiều mặt Phải',
  },
  E: {
    notation: 'E',
    face: 'E',
    prime: false,
    axis: 'y',
    layer: 0,
    angle: HALF_PI,
    labelVi: 'Lớp Giữa ngang (E)',
    shortDescVi: 'Xoay lớp Giữa ngang theo chiều mặt Dưới',
  },
  "E'": {
    notation: "E'",
    face: 'E',
    prime: true,
    axis: 'y',
    layer: 0,
    angle: -HALF_PI,
    labelVi: "Lớp Giữa ngang ngược (E')",
    shortDescVi: 'Xoay lớp Giữa ngang theo chiều mặt Trên',
  },
  S: {
    notation: 'S',
    face: 'S',
    prime: false,
    axis: 'z',
    layer: 0,
    angle: -HALF_PI,
    labelVi: 'Lớp Giữa đứng (S)',
    shortDescVi: 'Xoay lớp Giữa đứng theo chiều mặt Trước',
  },
  "S'": {
    notation: "S'",
    face: 'S',
    prime: true,
    axis: 'z',
    layer: 0,
    angle: HALF_PI,
    labelVi: "Lớp Giữa đứng ngược (S')",
    shortDescVi: 'Xoay lớp Giữa đứng theo chiều mặt Sau',
  },
};

export const OUTER_MOVES: MoveNotation[] = [
  'U', "U'",
  'D', "D'",
  'L', "L'",
  'R', "R'",
  'F', "F'",
  'B', "B'",
];

export const ALL_MOVES: MoveNotation[] = [
  ...OUTER_MOVES,
  'M', "M'",
  'E', "E'",
  'S', "S'",
];

const SCRAMBLE_FACES: FaceCode[] = ['U', 'D', 'L', 'R', 'F', 'B'];

const FACE_AXIS: Record<FaceCode, AxisName> = {
  U: 'y',
  D: 'y',
  E: 'y',
  L: 'x',
  R: 'x',
  M: 'x',
  F: 'z',
  B: 'z',
  S: 'z',
};

export function invertMove(move: MoveNotation): MoveNotation {
  return move.endsWith("'")
    ? (move[0] as MoveNotation)
    : (`${move}'` as MoveNotation);
}

/**
 * Find the exact Singmaster notation matching an axis, layer (-1 | 0 | 1), and signed quarter-turn (+1 or -1).
 */
export function moveFromAxisLayerSign(
  axis: AxisName,
  layer: -1 | 0 | 1,
  angleSign: 1 | -1,
): MoveNotation | null {
  for (const notation of ALL_MOVES) {
    const spec = MOVE_SPECS[notation];
    if (
      spec.axis === axis &&
      spec.layer === layer &&
      Math.sign(spec.angle) === angleSign
    ) {
      return notation;
    }
  }
  return null;
}

/**
 * Compress a sequence of quarter-turn moves algebraically:
 * - Cancels inverse pairs (R + R' -> empty)
 * - Replaces triple turns with a single inverse (R + R + R -> R')
 * - Commutes independent opposite-axis pairs (e.g. R L R' -> L)
 */
export function simplifyMoveHistory(moves: MoveNotation[]): MoveNotation[] {
  const stack: MoveNotation[] = [];

  for (const m of moves) {
    stack.push(m);
    let changed = true;

    while (changed) {
      changed = false;
      const n = stack.length;

      // Cancel adjacent inverse pair
      if (n >= 2 && stack[n - 1] === invertMove(stack[n - 2])) {
        stack.splice(n - 2, 2);
        changed = true;
        continue;
      }

      // 3 identical moves -> 1 inverse move
      if (
        n >= 3 &&
        stack[n - 1] === stack[n - 2] &&
        stack[n - 2] === stack[n - 3]
      ) {
        const inv = invertMove(stack[n - 1]);
        stack.splice(n - 3, 3, inv);
        changed = true;
        continue;
      }

      // Commute opposite faces on the same axis: e.g. R, L, R' -> L
      if (n >= 3) {
        const a = MOVE_SPECS[stack[n - 3]];
        const b = MOVE_SPECS[stack[n - 2]];
        const c = MOVE_SPECS[stack[n - 1]];
        if (a.axis === b.axis && a.face !== b.face && c.face === a.face) {
          // Swap b and c so a and c become adjacent and simplify on next loop
          const temp = stack[n - 2];
          stack[n - 2] = stack[n - 1];
          stack[n - 1] = temp;
          changed = true;
        }
      }
    }
  }

  return stack;
}

/**
 * Compute the exact inverse solution sequence from a move history.
 */
export function buildSolutionFromHistory(history: MoveNotation[]): MoveNotation[] {
  const simplified = simplifyMoveHistory(history);
  const solution: MoveNotation[] = [];
  for (let i = simplified.length - 1; i >= 0; i--) {
    solution.push(invertMove(simplified[i]));
  }
  return solution;
}

/**
 * Generate a clean WCA-style random scramble with no redundant consecutive turns.
 */
export function generateScramble(length = 18): MoveNotation[] {
  const result: MoveNotation[] = [];
  let prevFace: FaceCode | null = null;
  let prevAxis: AxisName | null = null;

  for (let i = 0; i < length; i++) {
    const candidates = SCRAMBLE_FACES.filter((face) => {
      if (face === prevFace) return false;
      // Avoid immediate back-and-forth on the same axis after two same-axis turns
      if (
        prevAxis === FACE_AXIS[face] &&
        result.length >= 2 &&
        FACE_AXIS[MOVE_SPECS[result[result.length - 2]].face] === prevAxis
      ) {
        return false;
      }
      return true;
    });

    const chosenFace = candidates[Math.floor(Math.random() * candidates.length)];
    const prime = Math.random() < 0.5;
    const notation = (prime ? `${chosenFace}'` : chosenFace) as MoveNotation;

    result.push(notation);
    prevFace = chosenFace;
    prevAxis = FACE_AXIS[chosenFace];
  }

  return result;
}

export function formatStopwatch(ms: number): string {
  const totalTenths = Math.floor(ms / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}.${tenths}`;
}

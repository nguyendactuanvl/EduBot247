/**
 * Shared Type Definitions for EduBot 247
 * Program: GDPT 2018 THPT (Lớp 10, 11, 12 & Thi THPT Quốc gia / ĐGNL)
 */

export interface Interval {
  id: string;
  start: number | '';
  end: number | '';
  frequency: number | '';
}

export interface CalculationResult {
  id: string;
  date: string;
  intervals: Interval[];
  n: number;
  mean: number;
  variance: number;
  stdDev: number;
  range: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  cumulativeFrequencies: number[];
  classMarks: number[];
  q1Steps: { pos: number; groupIndex: number; q: number };
  q2Steps: { pos: number; groupIndex: number; q: number };
  q3Steps: { pos: number; groupIndex: number; q: number };
}

// ==========================================
// GAMIFICATION & QUIZ SYSTEM TYPES
// ==========================================
export type RankTier = 'Tân thủ' | 'Tập sự' | 'Cao thủ' | 'Chuyên gia EdTech';

export interface UserStats {
  streakDays: number;
  xpPoints: number;
  rank: RankTier;
  completedQuizzes: number;
}

// Chuẩn ma trận đề thi mới 4 ý Đúng/Sai của Bộ GD&ĐT
export interface TrueFalseStatement {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  subject: 'physics' | 'chemistry' | 'biology' | 'english';
  topic: string;
  scenario: string; // Nội dung bối cảnh / đề bài
  diagramUrl?: string;
  statements: TrueFalseStatement[];
}

// ==========================================
// PHYSICS SPECIFIC TYPES
// ==========================================
export interface OscillationParams {
  amplitude: number; // A (cm)
  frequency: number; // f (Hz)
  phaseRad: number;  // phi (rad)
}

export interface FresnelVector {
  label: string;
  amplitude: number;
  phaseRad: number;
  color: string;
}

// ==========================================
// BIOLOGY GENETICS TYPES
// ==========================================
export interface PedigreeIndividual {
  id: string;
  generation: 'I' | 'II' | 'III';
  gender: 'male' | 'female';
  affected: boolean;
  fatherId?: string;
  motherId?: string;
  possibleGenotypes: string[];
  calculatedProbText: string;
}

export interface ShortAnswerQuestion {
  id: string;
  questionText: string;
  correctValue: number; // Đáp số số thực (ví dụ 0.25 hoặc 6.25)
  unit: '%' | 'lần' | 'tỉ lệ';
  explanation: string;
}

// ==========================================
// ENGLISH PARAPHRASE & REWRITE TYPES
// ==========================================
export interface SentenceOrderTask {
  id: string;
  title: string;
  sentences: { id: string; text: string }[];
  correctOrder: string[]; // ['s2', 's1', 's3', 's4']
  explanation: string;
}

export interface ParaphraseRewriteTask {
  id: string;
  originalSentence: string;
  hint: string;
  wordTokens: string[];
  correctSentence: string;
  explanation: string;
}

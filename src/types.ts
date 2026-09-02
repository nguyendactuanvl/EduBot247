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

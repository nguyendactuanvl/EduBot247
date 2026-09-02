import { Interval, CalculationResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function calculateStatistics(intervals: Interval[]): CalculationResult {
  const validIntervals = intervals.filter(
    (i) => typeof i.start === 'number' && typeof i.end === 'number' && typeof i.frequency === 'number'
  ) as { start: number; end: number; frequency: number; id: string }[];

  const n = validIntervals.reduce((sum, i) => sum + i.frequency, 0);

  const classMarks = validIntervals.map((i) => (i.start + i.end) / 2);
  
  let mean = 0;
  if (n > 0) {
    mean = validIntervals.reduce((sum, i, idx) => sum + i.frequency * classMarks[idx], 0) / n;
  }

  let variance = 0;
  if (n > 0) {
    variance = validIntervals.reduce((sum, i, idx) => sum + i.frequency * Math.pow(classMarks[idx] - mean, 2), 0) / n;
  }
  
  const stdDev = Math.sqrt(variance);

  let range = 0;
  if (validIntervals.length > 0) {
    range = validIntervals[validIntervals.length - 1].end - validIntervals[0].start;
  }

  const cumulativeFrequencies: number[] = [];
  let cf = 0;
  for (const i of validIntervals) {
    cf += i.frequency;
    cumulativeFrequencies.push(cf);
  }

  const calculateQuartile = (r: number) => {
    if (n === 0) return { pos: 0, groupIndex: 0, q: 0 };
    const pos = (r * n) / 4;
    let groupIndex = 0;
    for (let i = 0; i < cumulativeFrequencies.length; i++) {
      if (pos <= cumulativeFrequencies[i]) {
        groupIndex = i;
        break;
      }
    }
    
    const group = validIntervals[groupIndex];
    const cf_prev = groupIndex > 0 ? cumulativeFrequencies[groupIndex - 1] : 0;
    let q = group.start;
    if (group.frequency > 0) {
      q = group.start + ((pos - cf_prev) / group.frequency) * (group.end - group.start);
    }
    return { pos, groupIndex, q };
  };

  const q1Steps = calculateQuartile(1);
  const q2Steps = calculateQuartile(2);
  const q3Steps = calculateQuartile(3);
  
  const q1 = q1Steps.q;
  const q2 = q2Steps.q;
  const q3 = q3Steps.q;
  const iqr = q3 - q1;

  return {
    id: uuidv4(),
    date: new Date().toISOString(),
    intervals: validIntervals,
    n,
    mean,
    variance,
    stdDev,
    range,
    q1,
    q2,
    q3,
    iqr,
    cumulativeFrequencies,
    classMarks,
    q1Steps,
    q2Steps,
    q3Steps
  };
}

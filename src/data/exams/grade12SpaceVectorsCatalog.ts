export type SpaceVectorCategory = 'lesson' | 'tn_thpt' | 'chapter_review';
export type DifficultyLevel = 'NB' | 'TH' | 'VD' | 'VDC';

export interface SpaceVectorBlueprint {
  id: string; // Also used as exact localStorage cache key, e.g. 'vec_to_khong_gian_de_01'
  code: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: SpaceVectorCategory;
  groupLabel: string;
  durationMinutes: number;
  part1Count: number;
  part2Count: number;
  part3Count: number;
  totalQuestions: number;
  maxRawScore: number;
  difficultyFocus: string;
  topics: string[];
  realWorldTheme: string;
}

export interface GeneratedMcQuestion {
  id: string;
  number: number;
  question: string;
  options: [string, string, string, string];
  correctOption: 'A' | 'B' | 'C' | 'D';
  difficulty: DifficultyLevel;
  explanation: string;
}

export interface GeneratedTfStatement {
  label: 'a' | 'b' | 'c' | 'd';
  text: string;
  isTrue: boolean;
  explanation: string;
}

export interface GeneratedTfQuestion {
  id: string;
  number: number;
  stem: string;
  statements: [
    GeneratedTfStatement,
    GeneratedTfStatement,
    GeneratedTfStatement,
    GeneratedTfStatement,
  ];
  difficulty: DifficultyLevel;
  summaryExplanation: string;
}

export interface GeneratedSaQuestion {
  id: string;
  number: number;
  question: string;
  answer: string;
  acceptableAnswers: string[];
  unit?: string;
  difficulty: DifficultyLevel;
  explanation: string;
}

export interface GeneratedSpaceVectorExam {
  examId: string;
  title: string;
  subtitle: string;
  generatedAt: string;
  variantNumber: number;
  part1: GeneratedMcQuestion[];
  part2: GeneratedTfQuestion[];
  part3: GeneratedSaQuestion[];
}

export interface SpaceVectorExamSession {
  examId: string;
  variantNumber: number;
  mcAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  tfAnswers: Record<string, Partial<Record<'a' | 'b' | 'c' | 'd', boolean>>>;
  saAnswers: Record<string, string>;
  flaggedIds: string[];
  secondsLeft: number;
  submitted: boolean;
  timeUsedSeconds: number;
  autoSubmitted?: boolean;
  updatedAt: string;
}

export interface SpaceVectorScoreSummaryRecord {
  examId: string;
  bestScale10: number;
  lastScale10: number;
  part1Score: number;
  part2Score: number;
  part3Score: number;
  attempts: number;
  lastAttemptAt: string;
}

export const SPACE_VECTORS_SCORES_KEY = 'edubot_g12_space_vectors_scores_v1';

// Phân hệ 1: Luyện tập theo từng bài học (45 phút/đề, 17 câu: 10 MCQ + 3 Đ/S + 4 TLN)
export const LESSON_BLUEPRINTS: SpaceVectorBlueprint[] = [
  {
    id: 'vec_to_khong_gian_bai_06',
    code: 'BÀI 6',
    title: 'Bài 6: Vectơ trong không gian',
    shortTitle: 'Bài 6: Vectơ không gian',
    subtitle: 'Vectơ, quy tắc hình hộp, tích vô hướng và góc giữa hai vectơ trong không gian',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5, // 10*0.25 + 3*1.0 + 4*0.5 = 7.5 (quy đổi thang 10 khi chấm)
    difficultyFocus: 'Nhận biết, Thông hiểu và Vận dụng cơ bản kiến thức Bài 6 (KNTT)',
    topics: [
      'Khái niệm vectơ trong không gian, hai vectơ cùng phương, cùng hướng, bằng nhau, đối nhau',
      'Tổng và hiệu của hai vectơ trong không gian, quy tắc ba điểm, quy tắc hình bình hành, quy tắc hình hộp',
      'Tích của một số với một vectơ, trung điểm đoạn thẳng, trọng tâm tam giác và tứ diện',
      'Tích vô hướng và góc giữa hai vectơ trong không gian (hình lập phương, hình hộp chữ nhật, tứ diện đều, chóp đều)',
      'Ứng dụng tổng hợp lực và công của lực trong không gian thực tế (đèn chùm treo 3 dây, kéo vật nặng)',
    ],
    realWorldTheme: 'Cân bằng lực dây treo đèn chùm và công của lực trong không gian 3 chiều',
  },
  {
    id: 'vec_to_khong_gian_bai_07',
    code: 'BÀI 7',
    title: 'Bài 7: Hệ trục tọa độ trong không gian',
    shortTitle: 'Bài 7: Hệ trục tọa độ Oxyz',
    subtitle: 'Hệ tọa độ Oxyz, vectơ đơn vị i, j, k, tọa độ điểm và tọa độ vectơ',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: 'Nhận biết, Thông hiểu và Vận dụng tọa độ điểm/vectơ trong hệ Oxyz (KNTT)',
    topics: [
      'Hệ trục tọa độ Oxyz và bộ ba vectơ đơn vị vuông góc đôi một i, j, k',
      'Biểu diễn vectơ u = x.i + y.j + z.k và xác định tọa độ điểm A(x;y;z)',
      'Hình chiếu vuông góc của điểm lên các trục Ox, Oy, Oz và các mặt phẳng tọa độ (Oxy), (Oyz), (Ozx)',
      'Điểm đối xứng qua gốc tọa độ, qua các trục và mặt phẳng tọa độ',
      'Tìm tọa độ vectơ AB từ tọa độ điểm đầu A và điểm cuối B; mô hình hóa vị trí máy bay, drone, camera trong phòng học',
    ],
    realWorldTheme: 'Định vị vị trí chiếc đèn trần, camera giám sát và drone trong hệ trục tọa độ phòng học Oxyz',
  },
  {
    id: 'vec_to_khong_gian_bai_08',
    code: 'BÀI 8',
    title: 'Bài 8: Biểu thức tọa độ của các phép toán vectơ',
    shortTitle: 'Bài 8: Biểu thức tọa độ',
    subtitle: 'Tọa độ tổng, hiệu, tích vô hướng, độ dài, khoảng cách và góc giữa hai vectơ',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: 'Thông hiểu và Vận dụng thành thạo công thức tọa độ phép toán vectơ Oxyz (KNTT)',
    topics: [
      'Biểu thức tọa độ của phép cộng, phép trừ vectơ và phép nhân số với vectơ',
      'Tọa độ trung điểm đoạn thẳng, trọng tâm tam giác, đỉnh thứ tư hình bình hành',
      'Điều kiện hai vectơ cùng phương, ba điểm thẳng hàng, hai vectơ vuông góc',
      'Độ dài vectơ, khoảng cách giữa hai điểm, biểu thức tọa độ tích vô hướng và cosin góc giữa hai vectơ',
      'Bài toán thực tế tính khoảng cách, góc nâng, quỹ đạo bay thẳng trong không gian Oxyz',
    ],
    realWorldTheme: 'Tính khoảng cách hai máy bay, góc chuyển hướng tàu thăm dò và điểm đặt trạm thu phát sóng trong Oxyz',
  },
];

// Phân hệ 2 - Nhóm A: 10 Đề chuẩn cấu trúc TN THPT của Bộ GD&ĐT (90 phút, 22 câu, 10 điểm)
const TN_THPT_THEMES: Array<{ subtitle: string; theme: string }> = [
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế điều khiển UAV/Drone & Radar không lưu Oxyz',
    theme: 'Radar kiểm soát không lưu theo dõi hai thiết bị bay không người lái (UAV/Drone) trong không gian Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế hệ thống cáp treo & trụ điện cao thế',
    theme: 'Hệ thống cáp treo du lịch vượt núi và góc nghiêng dây cáp neo trụ điện trong không gian Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế khinh khí cầu & trạm quan trắc khí tượng',
    theme: 'Hai khinh khí cầu bay lên từ bãi đáp và khoảng cách tới trạm quan trắc khí tượng Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế camera an ninh & kiến trúc nhà mái vòm',
    theme: 'Hệ thống camera an ninh 360 độ gắn trần nhà xưởng và góc quét trong hệ tọa độ Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế cánh tay robot công nghiệp 3D',
    theme: 'Chuyển động đầu gắp của cánh tay robot lắp ráp linh kiện trong buồng làm việc Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế định vị vệ tinh & dẫn đường hàng hải',
    theme: 'Tín hiệu từ các vệ tinh định vị tới tàu hàng trên mặt biển phẳng (Oxy) trong không gian Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế cầu dây văng & cân bằng lực không gian',
    theme: 'Lực căng của các dây văng neo trụ cầu và hợp lực tại đỉnh tháp cầu trong không gian Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế hệ thống chiếu sáng sân vận động',
    theme: 'Trụ đèn pha sân vận động chiếu xuống chấm phạt đền và góc chiếu tia sáng trong hệ Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế tấm pin năng lượng mặt trời & nhà kính',
    theme: 'Lắp đặt khung giàn tấm pin năng lượng mặt trời và góc giữa tia nắng với khung đỡ trong Oxyz',
  },
  {
    subtitle: 'Phủ đều Bài 6–8 · Tích hợp thực tế tàu lặn khảo sát đáy biển Oxyz',
    theme: 'Tàu lặn tự hành khảo sát địa hình rạn san hô dưới mặt nước (z < 0) trong hệ trục Oxyz',
  },
];

export const TN_THPT_BLUEPRINTS: SpaceVectorBlueprint[] = TN_THPT_THEMES.map((item, idx) => {
  const numStr = String(idx + 1).padStart(2, '0');
  return {
    id: `vec_to_khong_gian_de_${numStr}`,
    code: `ĐỀ TN ${numStr}`,
    title: `Đề TN THPT Số ${numStr}`,
    shortTitle: `TN THPT Số ${numStr}`,
    subtitle: item.subtitle,
    category: 'tn_thpt',
    groupLabel: 'Nhóm A · Chuẩn cấu trúc TN THPT Bộ GD&ĐT (90 phút)',
    durationMinutes: 90,
    part1Count: 12,
    part2Count: 4,
    part3Count: 6,
    totalQuestions: 22,
    maxRawScore: 10,
    difficultyFocus: 'Chuẩn ma trận đề thi TN THPT Bộ GD&ĐT 2025 (40% NB - 30% TH - 20% VD - 10% VDC), phủ đều Bài 6, 7, 8 và bài toán thực tế Oxyz',
    topics: [
      'Vectơ trong không gian, quy tắc hình hộp, góc và tích vô hướng hình học không gian (Bài 6)',
      'Hệ trục tọa độ Oxyz, tọa độ điểm, tọa độ vectơ, hình chiếu, đối xứng (Bài 7)',
      'Biểu thức tọa độ các phép toán vectơ, trung điểm, trọng tâm, độ dài, khoảng cách, góc và vuông góc (Bài 8)',
      'Bài toán thực tế gắn hệ trục tọa độ Oxyz theo chủ đề đặc trưng của mã đề',
    ],
    realWorldTheme: item.theme,
  };
});

// Phân hệ 2 - Nhóm B: 5 Đề ôn tập chương tổng hợp (90 phút, 22 câu, 10 điểm, tăng cường VD & VDC)
const REVIEW_THEMES: Array<{ subtitle: string; theme: string; focus: string }> = [
  {
    subtitle: 'Tăng cường phân hóa VD–VDC · Cực trị độ dài tổng vectơ & tâm tỉ cự trong Oxyz',
    theme: 'Tối ưu vị trí đặt trạm phát sóng 5G trên mặt đất (Oxy) sao cho tổng bình phương khoảng cách đến các tòa nhà nhỏ nhất',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): tâm tỉ cự, cực trị độ dài |mMA + nMB + pMC|, bất đẳng thức vectơ',
  },
  {
    subtitle: 'Tăng cường phân hóa VD–VDC · Bài toán hình học không gian gắn tọa độ hóa Oxyz',
    theme: 'Thiết kế khung kết cấu không gian của tháp quan sát hình chóp/lăng trụ đều gắn hệ tọa độ Oxyz',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): tọa độ hóa hình chóp, lăng trụ, tính góc và khoảng cách bằng vectơ',
  },
  {
    subtitle: 'Tăng cường phân hóa VD–VDC · Tối ưu quỹ đạo, điểm phản xạ & góc lớn nhất',
    theme: 'Tối ưu đường truyền tia laser phản xạ qua gương phẳng (Oxy) và khoảng cách ngắn nhất giữa hai vật chuyển động đều',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): bài toán điểm đối xứng tối ưu tổng khoảng cách MA + MB, góc giữa hai vectơ đạt cực trị',
  },
  {
    subtitle: 'Tăng cường phân hóa VD–VDC · Cân bằng hệ lực 3D & điều kiện đồng phẳng, trực giao',
    theme: 'Hệ thống cần cẩu tháp nâng khối bê tông bằng 3 dây cáp chịu lực không đều trong không gian Oxyz',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): hệ phương trình cân bằng lực 3D, trực tâm, tâm đường tròn ngoại tiếp trong Oxyz',
  },
  {
    subtitle: 'Tăng cường phân hóa VD–VDC · Tổng hợp toàn diện Chương II chuẩn mục tiêu 9+ TN THPT',
    theme: 'Mô phỏng điều phối bay tự động của đội bay trình diễn ánh sáng (Drone Light Show) trong không gian Oxyz',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (40% VD - 20% VDC): tổng hợp toàn bộ kỹ thuật phân hóa cao Chương II Toán 12 KNTT',
  },
];

export const CHAPTER_REVIEW_BLUEPRINTS: SpaceVectorBlueprint[] = REVIEW_THEMES.map((item, idx) => {
  const numStr = String(idx + 1).padStart(2, '0');
  return {
    id: `vec_to_khong_gian_on_tap_${numStr}`,
    code: `ÔN TẬP ${numStr}`,
    title: `Đề Ôn tập chương Số ${numStr}`,
    shortTitle: `Ôn tập chương Số ${numStr}`,
    subtitle: item.subtitle,
    category: 'chapter_review',
    groupLabel: 'Nhóm B · Ôn tập chương tổng hợp phân hóa VD–VDC (90 phút)',
    durationMinutes: 90,
    part1Count: 12,
    part2Count: 4,
    part3Count: 6,
    totalQuestions: 22,
    maxRawScore: 10,
    difficultyFocus: item.focus,
    topics: [
      'Tổng hợp nâng cao Bài 6: Quy tắc hình hộp, tích vô hướng, góc giữa hai vectơ trong tứ diện và hình lăng trụ',
      'Tổng hợp nâng cao Bài 7–8: Biểu thức tọa độ, điểm đặc biệt của tam giác và tứ diện trong Oxyz',
      'Bài toán cực trị vectơ, tâm tỉ cự, tìm điểm trên trục/mặt tọa độ thỏa mãn cực trị khoảng cách',
      'Bài toán thực tế liên môn Vật lý – Kỹ thuật – Không gian 3D mức độ Vận dụng cao',
    ],
    realWorldTheme: item.theme,
  };
});

export const ALL_SPACE_VECTOR_BLUEPRINTS: SpaceVectorBlueprint[] = [
  ...LESSON_BLUEPRINTS,
  ...TN_THPT_BLUEPRINTS,
  ...CHAPTER_REVIEW_BLUEPRINTS,
];

export function getBlueprintById(examId: string): SpaceVectorBlueprint | undefined {
  return ALL_SPACE_VECTOR_BLUEPRINTS.find((bp) => bp.id === examId);
}

// ==========================================
// QUY CHẾ CHẤM ĐIỂM CHUẨN BỘ GD&ĐT
// ==========================================

export function scoreTrueFalseItem(correctStatementsCount: number): number {
  switch (correctStatementsCount) {
    case 1:
      return 0.1;
    case 2:
      return 0.25;
    case 3:
      return 0.5;
    case 4:
      return 1.0;
    default:
      return 0;
  }
}

export function normalizeShortAnswerValue(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/−/g, '-');
}

export function isSpaceVectorShortAnswerCorrect(
  userInput: string,
  expectedAnswer: string,
  acceptableAnswers: string[] = []
): boolean {
  const normalizedUser = normalizeShortAnswerValue(userInput);
  if (!normalizedUser) return false;

  const candidates = [expectedAnswer, ...acceptableAnswers]
    .filter(Boolean)
    .map(normalizeShortAnswerValue);

  if (candidates.includes(normalizedUser)) return true;

  const userNum = Number(normalizedUser);
  if (!Number.isNaN(userNum)) {
    return candidates.some((cand) => {
      const candNum = Number(cand);
      return !Number.isNaN(candNum) && Math.abs(userNum - candNum) < 1e-6;
    });
  }

  return false;
}

export interface DetailedExamGrading {
  part1Score: number;
  part1Max: number;
  part1Correct: number;
  part2Score: number;
  part2Max: number;
  part2FullCorrect: number;
  part3Score: number;
  part3Max: number;
  part3Correct: number;
  rawTotal: number;
  rawMax: number;
  scale10: number;
}

export function gradeSpaceVectorExam(
  exam: GeneratedSpaceVectorExam,
  mcAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>,
  tfAnswers: Record<string, Partial<Record<'a' | 'b' | 'c' | 'd', boolean>>>,
  saAnswers: Record<string, string>
): DetailedExamGrading {
  let part1Correct = 0;
  exam.part1.forEach((q) => {
    if (mcAnswers[q.id] === q.correctOption) part1Correct += 1;
  });
  const part1Score = Number((part1Correct * 0.25).toFixed(2));
  const part1Max = Number((exam.part1.length * 0.25).toFixed(2));

  let part2Score = 0;
  let part2FullCorrect = 0;
  exam.part2.forEach((q) => {
    const userMap = tfAnswers[q.id] || {};
    let rightCount = 0;
    q.statements.forEach((st) => {
      if (userMap[st.label] === st.isTrue) {
        rightCount += 1;
      }
    });
    if (rightCount === 4) part2FullCorrect += 1;
    part2Score += scoreTrueFalseItem(rightCount);
  });
  part2Score = Number(part2Score.toFixed(2));
  const part2Max = Number((exam.part2.length * 1.0).toFixed(2));

  let part3Correct = 0;
  exam.part3.forEach((q) => {
    if (isSpaceVectorShortAnswerCorrect(saAnswers[q.id] || '', q.answer, q.acceptableAnswers)) {
      part3Correct += 1;
    }
  });
  const part3Score = Number((part3Correct * 0.5).toFixed(2));
  const part3Max = Number((exam.part3.length * 0.5).toFixed(2));

  const rawTotal = Number((part1Score + part2Score + part3Score).toFixed(2));
  const rawMax = Number((part1Max + part2Max + part3Max).toFixed(2));
  const scale10 = rawMax > 0 ? Number(((rawTotal / rawMax) * 10).toFixed(2)) : 0;

  return {
    part1Score,
    part1Max,
    part1Correct,
    part2Score,
    part2Max,
    part2FullCorrect,
    part3Score,
    part3Max,
    part3Correct,
    rawTotal,
    rawMax,
    scale10,
  };
}

// ==========================================
// LOCALSTORAGE CACHE & SESSION PERSISTENCE
// ==========================================

export function getCachedExam(examId: string): GeneratedSpaceVectorExam | null {
  try {
    const raw = localStorage.getItem(examId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GeneratedSpaceVectorExam;
    if (
      !parsed ||
      !Array.isArray(parsed.part1) ||
      !Array.isArray(parsed.part2) ||
      !Array.isArray(parsed.part3) ||
      parsed.part1.length === 0
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveCachedExam(examId: string, exam: GeneratedSpaceVectorExam): void {
  try {
    localStorage.setItem(examId, JSON.stringify(exam));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function hasCachedExam(examId: string): boolean {
  return getCachedExam(examId) !== null;
}

export function getSessionStorageKey(examId: string): string {
  return `${examId}_session`;
}

export function loadExamSession(examId: string): SpaceVectorExamSession | null {
  try {
    const raw = localStorage.getItem(getSessionStorageKey(examId));
    if (!raw) return null;
    return JSON.parse(raw) as SpaceVectorExamSession;
  } catch {
    return null;
  }
}

export function saveExamSession(session: SpaceVectorExamSession): void {
  try {
    localStorage.setItem(getSessionStorageKey(session.examId), JSON.stringify(session));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function clearExamSession(examId: string): void {
  try {
    localStorage.removeItem(getSessionStorageKey(examId));
  } catch {
    // Ignore
  }
}

export function loadSpaceVectorScores(
  storageKey: string = SPACE_VECTORS_SCORES_KEY
): Record<string, SpaceVectorScoreSummaryRecord> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SpaceVectorScoreSummaryRecord>;
  } catch {
    return {};
  }
}

export function saveSpaceVectorScoreRecord(
  record: SpaceVectorScoreSummaryRecord,
  storageKey: string = SPACE_VECTORS_SCORES_KEY
): Record<string, SpaceVectorScoreSummaryRecord> {
  const existing = loadSpaceVectorScores(storageKey);
  const prev = existing[record.examId];
  const merged: Record<string, SpaceVectorScoreSummaryRecord> = {
    ...existing,
    [record.examId]: {
      ...record,
      bestScale10: prev ? Math.max(prev.bestScale10, record.lastScale10) : record.lastScale10,
      attempts: (prev?.attempts || 0) + 1,
    },
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(merged));
  } catch {
    // Ignore
  }
  return merged;
}

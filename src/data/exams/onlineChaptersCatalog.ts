import { SpaceVectorBlueprint } from './grade12SpaceVectorsCatalog';

export type OnlineChapterKey =
  | 'grade12-integrals'
  | 'grade12-oxyz'
  | 'grade12-condprob'
  | 'grade11-limits'
  | 'grade11-perp'
  | 'grade11-prob'
  | 'grade11-deriv'
  | 'grade10-stats'
  | 'grade10-combprob';

interface LessonSeed {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  topics: string[];
  realWorldTheme: string;
}

export interface OnlineChapterDefinition {
  key: OnlineChapterKey;
  grade: 10 | 11 | 12;
  backTab: 'grade10-hub' | 'grade11-hub' | 'grade12-hub';
  scoresStorageKey: string;
  backLabel: string;
  gradeTag: string;
  chapterKicker: string;
  heading: string;
  headerTitle: string;
  sidebarLabel: string;
  sidebarMeta: string;
  description: string;
  lessonSubtitle: string;
  tnSubtitle: string;
  reviewSubtitle: string;
  subjectCourseName: string;
  part2RealWorldInstruction: string;
  part3AnswerGuidance: string;
  latexGuidance: string;
  systemInstruction: string;
  lessonBlueprints: SpaceVectorBlueprint[];
  tnBlueprints: SpaceVectorBlueprint[];
  reviewBlueprints: SpaceVectorBlueprint[];
}

function buildLessonBlueprints(seeds: LessonSeed[], gradeLabel: string): SpaceVectorBlueprint[] {
  return seeds.map((s) => ({
    id: s.id,
    code: s.code,
    title: s.title,
    shortTitle: s.shortTitle,
    subtitle: s.subtitle,
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: `Nhận biết, Thông hiểu và Vận dụng cơ bản kiến thức ${s.code} (${gradeLabel} - KNTT)`,
    topics: s.topics,
    realWorldTheme: s.realWorldTheme,
  }));
}

function buildTnBlueprints(
  prefix: string,
  themes: Array<{ titleSuffix: string; theme: string }>,
  allTopics: string[]
): SpaceVectorBlueprint[] {
  return themes.map((item, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    return {
      id: `${prefix}_de_${num}`,
      code: `TN THPT ${num}`,
      title: `Đề TN THPT Số ${num}`,
      shortTitle: `Đề TN THPT ${num}`,
      subtitle: `Chuẩn cấu trúc Bộ GD&ĐT (22 câu · 90 phút) — ${item.titleSuffix}`,
      category: 'tn_thpt',
      groupLabel: 'Phân hệ 2 · Nhóm A — 10 Đề chuẩn TN THPT (90 phút)',
      durationMinutes: 90,
      part1Count: 12,
      part2Count: 4,
      part3Count: 6,
      totalQuestions: 22,
      maxRawScore: 10,
      difficultyFocus:
        'Chuẩn ma trận Bộ GD&ĐT: 40% Nhận biết, 30% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao',
      topics: allTopics,
      realWorldTheme: item.theme,
    };
  });
}

function buildReviewBlueprints(
  prefix: string,
  focuses: Array<{ subtitle: string; theme: string; topics: string[] }>
): SpaceVectorBlueprint[] {
  return focuses.map((item, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    return {
      id: `${prefix}_ontap_${num}`,
      code: `ÔN TẬP ${num}`,
      title: `Đề Ôn tập chương Số ${num}`,
      shortTitle: `Đề Ôn tập ${num}`,
      subtitle: `Phân hóa VD – VDC (22 câu · 90 phút) — ${item.subtitle}`,
      category: 'chapter_review',
      groupLabel: 'Phân hệ 2 · Nhóm B — 5 Đề Ôn tập chương tổng hợp (90 phút)',
      durationMinutes: 90,
      part1Count: 12,
      part2Count: 4,
      part3Count: 6,
      totalQuestions: 22,
      maxRawScore: 10,
      difficultyFocus:
        'Tăng cường phân hóa mức độ Vận dụng (30%) và Vận dụng cao (25%), kết hợp kỹ năng tính nhanh & tư duy tổng hợp',
      topics: item.topics,
      realWorldTheme: item.theme,
    };
  });
}

// ============================================================================
// 1. TOÁN 12 - CHƯƠNG IV: NGUYÊN HÀM VÀ TÍCH PHÂN
// ============================================================================
const G12_INTEGRALS_TOPICS = [
  'Nguyên hàm của hàm số sơ cấp (đa thức, lũy thừa, lượng giác, mũ) và tính chất cơ bản của nguyên hàm',
  'Xác định hằng số C từ điều kiện ban đầu F(x0) = y0 trong các bài toán chuyển động và tăng trưởng',
  'Định nghĩa tích phân xác định, công thức Newton–Leibniz và các tính chất tuyến tính, cộng đoạn của tích phân',
  'Ứng dụng tích phân tính diện tích hình phẳng giới hạn bởi các đường cong y = f(x), y = g(x)',
  'Ứng dụng tích phân tính thể tích khối tròn xoay khi quay quanh trục Ox và thể tích vật thể biết diện tích thiết diện S(x)',
];

const grade12IntegralsDef: OnlineChapterDefinition = {
  key: 'grade12-integrals',
  grade: 12,
  backTab: 'grade12-hub',
  scoresStorageKey: 'edubot_g12_integrals_scores_v1',
  backLabel: 'Quay lại Lớp 12',
  gradeTag: 'Toán 12 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương IV · Giải tích 12',
  heading: 'Nguyên hàm, tích phân và ứng dụng (Toán 12)',
  headerTitle: 'Toán 12 (KNTT) - Chương IV: Nguyên hàm và tích phân (18 Bộ đề Online)',
  sidebarLabel: 'Nguyên hàm & Tích phân (Toán 12)',
  sidebarMeta: '3 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương IV gồm 3 đề luyện tập theo từng bài (Bài 11 – Bài 13, 45 phút) và 15 đề Ôn tập chương chuẩn cấu trúc Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) tích hợp bài toán vận tốc – quãng đường, tăng trưởng, diện tích & thể tích thực tế.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 11, Bài 12 và Bài 13',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 3 bài, chú trọng vận tốc – quãng đường, tăng trưởng và diện tích/thể tích thực tế',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (tích phân hàm ẩn, đồ thị đạo hàm, parabol, elip, đường tròn)',
  subjectCourseName: 'Toán 12 - Chương IV: Nguyên hàm và tích phân',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế về chuyển động (vận tốc – quãng đường – gia tốc), tốc độ tăng trưởng quần thể/kinh tế, hoặc thiết kế cổng parabol/bồn chứa tròn xoay.',
  part3AnswerGuidance:
    'Tập trung tính giá trị tích phân xác định, quãng đường chuyển động, diện tích hình phẳng, thể tích khối tròn xoay hoặc thể tích vật thể (làm tròn đến hàng phần chục hoặc hàng phần trăm, tối đa 4 ký tự như "12.5", "3.14", "48").',
  latexGuidance: `- Ký hiệu nguyên hàm: $\\int f(x)\\,\\mathrm{d}x = F(x) + C$
   - Ký hiệu tích phân xác định và thế cận: $\\int_{a}^{b} f(x)\\,\\mathrm{d}x = \\left. F(x) \\right|_{a}^{b} = F(b) - F(a)$
   - Diện tích hình phẳng & thể tích khối tròn xoay: $S = \\int_{a}^{b} |f(x) - g(x)|\\,\\mathrm{d}x$, $V = \\pi \\int_{a}^{b} [f(x)]^2\\,\\mathrm{d}x$, $V = \\int_{a}^{b} S(x)\\,\\mathrm{d}x$
   - Lũy thừa, căn thức, lượng giác, mũ: $x^n$, $e^x$, $a^x$, $\\ln|x|$, $\\sin x$, $\\cos x$, $\\frac{1}{\\cos^2 x}$, $\\sqrt{x}$ (TUYỆT ĐỐI dùng \\frac, không dùng \\dfrac).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Tốt nghiệp THPT môn Toán 12 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chính xác 100% mọi phép tính nguyên hàm, tích phân, diện tích và thể tích; dùng LaTeX chuẩn trong $...$ (\\int, \\mathrm{d}x, \\left. F(x) \\right|_{a}^{b}, \\pi, \\frac), escape đúng dấu \\\\ trong JSON hợp lệ.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'nguyen_ham_tich_phan_12_bai_11',
        code: 'BÀI 11',
        title: 'Bài 11: Nguyên hàm',
        shortTitle: 'Bài 11: Nguyên hàm',
        subtitle: 'Khái niệm nguyên hàm, tính chất cơ bản và bảng nguyên hàm các hàm số sơ cấp',
        topics: [
          'Định nghĩa nguyên hàm F\'(x) = f(x) và họ nguyên hàm F(x) + C trên khoảng K',
          'Tính chất tuyến tính của nguyên hàm tổng, hiệu và tích với hằng số',
          'Bảng nguyên hàm cơ bản: hàm lũy thừa, hàm phân thức 1/x, hàm lượng giác sin/cos, hàm mũ e^x và a^x',
          'Tìm nguyên hàm thỏa mãn điều kiện cho trước F(x0) = y0 và ứng dụng tìm vận tốc/quãng đường từ gia tốc',
        ],
        realWorldTheme: 'Tìm hàm vận tốc và quãng đường của ô tô tăng tốc/phanh gấp từ hàm gia tốc',
      },
      {
        id: 'nguyen_ham_tich_phan_12_bai_12',
        code: 'BÀI 12',
        title: 'Bài 12: Tích phân',
        shortTitle: 'Bài 12: Tích phân',
        subtitle: 'Định nghĩa tích phân xác định, công thức Newton–Leibniz và các tính chất tích phân',
        topics: [
          'Diện tích hình thang cong và định nghĩa tích phân xác định trên đoạn [a; b]',
          'Công thức Newton–Leibniz tính tích phân các hàm đa thức, lượng giác, mũ, phân thức',
          'Tính chất tích phân: đảo cận, cộng đoạn cận trung gian, tích phân hàm số cho bởi nhiều công thức (chứa trị tuyệt đối)',
          'Ứng dụng tích phân tính quãng đường vật chuyển động, lượng nước chảy qua van và lợi nhuận tích lũy',
        ],
        realWorldTheme: 'Tính quãng đường di chuyển và tổng lưu lượng dòng chảy theo thời gian bằng tích phân',
      },
      {
        id: 'nguyen_ham_tich_phan_12_bai_13',
        code: 'BÀI 13',
        title: 'Bài 13: Ứng dụng hình học của tích phân',
        shortTitle: 'Bài 13: Ứng dụng tích phân',
        subtitle: 'Tính diện tích hình phẳng, thể tích khối tròn xoay và thể tích vật thể theo thiết diện',
        topics: [
          'Diện tích hình phẳng giới hạn bởi đồ thị y = f(x), trục Ox và hai đường thẳng x = a, x = b',
          'Diện tích hình phẳng giới hạn bởi hai đồ thị y = f(x), y = g(x) (tìm hoành độ giao điểm)',
          'Thể tích vật thể khi biết diện tích thiết diện S(x) vuông góc với trục Ox',
          'Thể tích khối tròn xoay tạo thành khi quay hình phẳng quanh trục Ox (V = pi * int [f(x)]^2 dx)',
          'Bài toán thực tế: diện tích cánh hoa/cổng vòm parabol, thể tích chậu cây, trống gỗ, bồn chứa',
        ],
        realWorldTheme: 'Thiết kế cổng chào hình parabol, hoa văn trang trí và tính dung tích bình/trống tròn xoay',
      },
    ],
    'Toán 12'
  ),
  tnBlueprints: buildTnBlueprints(
    'nguyen_ham_tich_phan_12',
    [
      { titleSuffix: 'Vận tốc – Quãng đường & Diện tích cổng parabol', theme: 'Ô tô tăng tốc, phanh khẩn cấp và thiết kế cổng vòm parabol' },
      { titleSuffix: 'Tốc độ tăng trưởng vi khuẩn & Bình chứa tròn xoay', theme: 'Tốc độ tăng trưởng quần thể sinh học và dung tích bình tròn xoay' },
      { titleSuffix: 'Đồ thị vận tốc theo thời gian & Khuôn viên hoa văn', theme: 'Biểu đồ vận tốc tàu cao tốc và diện tích bồn hoa hình phẳng' },
      { titleSuffix: 'Lưu lượng nước hồ thủy điện & Trống đồng/Thùng gỗ', theme: 'Lưu lượng xả lũ hồ chứa và thể tích thùng rượu tròn xoay' },
      { titleSuffix: 'Chi phí cận biên & Diện tích mặt cắt mái vòm', theme: 'Doanh thu cận biên trong kinh tế và diện tích mặt cắt mái vòm kính' },
      { titleSuffix: 'Chuyển động tên lửa & Vật thể có thiết diện tam giác', theme: 'Vận tốc tên lửa mini và tính thể tích chướng ngại vật qua thiết diện' },
      { titleSuffix: 'Hấp thụ thuốc y khoa & Cánh buồm hình phẳng', theme: 'Tốc độ chuyển hóa nồng độ thuốc và diện tích cánh buồm cong' },
      { titleSuffix: 'Công suất tiêu thụ điện & Đèn lồng tròn xoay', theme: 'Điện năng tiêu thụ theo công suất tức thời và thể tích chụp đèn tròn xoay' },
      { titleSuffix: 'Tốc độ lan truyền nhiệt & Tấm kính hình elip/parabol', theme: 'Biến thiên nhiệt độ lò nung và diện tích tấm kính trang trí cong' },
      { titleSuffix: 'Tổng hợp toàn chương IV & Ứng dụng kỹ thuật đa ngành', theme: 'Hệ thống tưới tiêu tự động và mô hình bồn chứa công nghiệp' },
    ],
    G12_INTEGRALS_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('nguyen_ham_tich_phan_12', [
    {
      subtitle: 'Tích phân hàm ẩn & Đổi biến tư duy nhanh',
      theme: 'Xác định công thực hiện của lực biến thiên và hàm ẩn f(x)',
      topics: [...G12_INTEGRALS_TOPICS, 'Tích phân hàm ẩn thỏa mãn đẳng thức đạo hàm và tích phân hàm chẵn/lẻ'],
    },
    {
      subtitle: 'Đọc đồ thị đạo hàm f\'(x) so sánh giá trị hàm số',
      theme: 'Phân tích đồ thị tốc độ tăng trưởng để xác định cực trị và so sánh sản lượng',
      topics: [...G12_INTEGRALS_TOPICS, 'Liên hệ diện tích hình phẳng từ đồ thị f\'(x) để so sánh f(a), f(b), f(c)'],
    },
    {
      subtitle: 'Diện tích & Thể tích kết hợp Parabol – Đường thẳng',
      theme: 'Tối ưu diện tích trang trí sân vườn và cổng chào parabol hai lớp',
      topics: [...G12_INTEGRALS_TOPICS, 'Tìm tham số chia đôi diện tích hình phẳng giới hạn bởi parabol'],
    },
    {
      subtitle: 'Ứng dụng tích phân với Elip và Đường tròn',
      theme: 'Tính thể tích bồn xăng hình trụ nằm ngang và tấm gương elip trang trí',
      topics: [...G12_INTEGRALS_TOPICS, 'Tính diện tích phần giao đường tròn – parabol và thể tích khối tròn xoay từ elip'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương IV (Chinh phục 9+)',
      theme: 'Thiết kế hồ bơi hình cong, bể chứa elipxoit và phân tích chuyển động đa giai đoạn',
      topics: [...G12_INTEGRALS_TOPICS, 'Bài toán tổng hợp tích phân hàm ẩn, đồ thị f\'(x) và thể tích thiết diện phức tạp'],
    },
  ]),
};

// ============================================================================
// 2. TOÁN 12 - CHƯƠNG V: PHƯƠNG PHÁP TỌA ĐỘ TRONG KHÔNG GIAN (OXYZ)
// ============================================================================
const G12_OXYZ_TOPICS = [
  'Phương trình tổng quát mặt phẳng Ax + By + Cz + D = 0, vectơ pháp tuyến n = (A; B; C), mặt phẳng theo đoạn chắn và khoảng cách d(M, (P))',
  'Phương trình tham số và phương trình chính tắc đường thẳng trong không gian, vectơ chỉ phương u = (a; b; c)',
  'Vị trí tương đối giữa hai mặt phẳng, hai đường thẳng (chéo nhau, cắt nhau, song song, trùng nhau), đường thẳng và mặt phẳng',
  'Công thức tính góc giữa hai đường thẳng, giữa đường thẳng và mặt phẳng, giữa hai mặt phẳng trong Oxyz',
  'Phương trình mặt cầu dạng chính tắc và khai triển, tâm I(a; b; c), bán kính R, vị trí tương đối với mặt phẳng và ứng dụng thực tế',
];

const grade12OxyzDef: OnlineChapterDefinition = {
  key: 'grade12-oxyz',
  grade: 12,
  backTab: 'grade12-hub',
  scoresStorageKey: 'edubot_g12_oxyz_scores_v1',
  backLabel: 'Quay lại Lớp 12',
  gradeTag: 'Toán 12 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương V · Hình học tọa độ Oxyz',
  heading: 'Phương pháp tọa độ trong không gian (Toán 12)',
  headerTitle: 'Toán 12 (KNTT) - Chương V: Phương pháp tọa độ trong không gian (19 Bộ đề Online)',
  sidebarLabel: 'Phương pháp tọa độ Oxyz (Toán 12)',
  sidebarMeta: '4 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương V gồm 4 đề luyện tập theo từng bài (Bài 14 – Bài 17, 45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) tích hợp bài toán thực tế radar, đường bay, kiến trúc và vệ tinh.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 14 đến Bài 17',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 4 bài & tích hợp mô hình radar, đường bay, kiến trúc, vị trí vệ tinh',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (cực trị Oxyz, vị trí tương đối đường – mặt – cầu, tiếp xúc & thiết diện)',
  subjectCourseName: 'Toán 12 - Chương V: Phương pháp tọa độ trong không gian',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế tọa độ hóa Oxyz như vùng phủ sóng radar hình cầu, đường bay máy bay/drone đi vào vùng quét, góc nghiêng mái nhà/tấm pin mặt trời hoặc trạm thu phát vệ tinh.',
  part3AnswerGuidance:
    'Tập trung tính khoảng cách, bán kính mặt cầu, góc (làm tròn đến độ hoặc hàng phần chục), hoặc tọa độ giao điểm/tổng hệ số (tối đa 4 ký tự như "35.2", "45", "6.5", "-3").',
  latexGuidance: `- Vectơ pháp tuyến, chỉ phương: $\\vec{n}=(A;B;C)$, $\\vec{u}=(a;b;c)$
   - Phương trình chính tắc đường thẳng: $\\frac{x-x_0}{a}=\\frac{y-y_0}{b}=\\frac{z-z_0}{c}$
   - Phương trình tham số đường thẳng: $\\begin{cases} x=x_0+at \\\\ y=y_0+bt \\\\ z=z_0+ct \\end{cases}$
   - Khoảng cách và góc: $d(M,(P))$, $\\cos(\\Delta, \\Delta')$, $\\sin(\\Delta, (P))$, $\\cos((P),(Q))$
   - Phương trình mặt cầu: $(x-a)^2+(y-b)^2+(z-c)^2=R^2$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Tốt nghiệp THPT môn Toán 12 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chặt chẽ mọi tọa độ điểm, tích có hướng, khoảng cách, góc và phương trình mặt cầu trong Oxyz; dùng LaTeX chuẩn trong $...$ (\\vec{n}, \\vec{u}, \\begin{cases}...\\end{cases}, \\frac), escape đúng dấu \\\\ trong JSON hợp lệ.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'phuong_phap_toa_do_12_bai_14',
        code: 'BÀI 14',
        title: 'Bài 14: Phương trình mặt phẳng',
        shortTitle: 'Bài 14: Phương trình mặt phẳng',
        subtitle: 'Vectơ pháp tuyến, tích có hướng, phương trình tổng quát, vị trí tương đối và khoảng cách',
        topics: [
          'Vectơ pháp tuyến và cặp vectơ chỉ phương của mặt phẳng, cách tìm tích có hướng',
          'Viết phương trình tổng quát mặt phẳng qua điểm và có VTPT, qua 3 điểm không thẳng hàng, phương trình đoạn chắn',
          'Điều kiện hai mặt phẳng song song, trùng nhau, cắt nhau, vuông góc',
          'Công thức tính khoảng cách từ một điểm đến mặt phẳng và khoảng cách giữa hai mặt phẳng song song',
        ],
        realWorldTheme: 'Tính độ nghiêng mái nhà, thiết kế mặt phẳng nghiêng tấm pin năng lượng mặt trời trong Oxyz',
      },
      {
        id: 'phuong_phap_toa_do_12_bai_15',
        code: 'BÀI 15',
        title: 'Bài 15: Phương trình đường thẳng trong không gian',
        shortTitle: 'Bài 15: PT đường thẳng Oxyz',
        subtitle: 'Vectơ chỉ phương, phương trình tham số, chính tắc và vị trí tương đối hai đường thẳng',
        topics: [
          'Vectơ chỉ phương của đường thẳng trong không gian Oxyz',
          'Viết phương trình tham số và phương trình chính tắc của đường thẳng đi qua 1 điểm hoặc 2 điểm',
          'Xét vị trí tương đối giữa hai đường thẳng (song song, trùng nhau, cắt nhau, chéo nhau)',
          'Tìm giao điểm của đường thẳng và mặt phẳng, hình chiếu vuông góc lên đường thẳng/mặt phẳng',
        ],
        realWorldTheme: 'Theo dõi quỹ đạo đường bay thẳng của máy bay và hành trình giao hàng của drone trong Oxyz',
      },
      {
        id: 'phuong_phap_toa_do_12_bai_16',
        code: 'BÀI 16',
        title: 'Bài 16: Công thức tính góc trong không gian',
        shortTitle: 'Bài 16: Góc trong không gian',
        subtitle: 'Góc giữa hai đường thẳng, giữa đường thẳng và mặt phẳng, giữa hai mặt phẳng',
        topics: [
          'Công thức cosin góc giữa hai đường thẳng dựa vào hai vectơ chỉ phương',
          'Công thức sin góc giữa đường thẳng và mặt phẳng dựa vào VTCP và VTPT',
          'Công thức cosin góc giữa hai mặt phẳng dựa vào hai vectơ pháp tuyến',
          'Ứng dụng tính góc nâng tia laser, góc cất cánh máy bay và góc tạo bởi hai mái nhà',
        ],
        realWorldTheme: 'Tính góc cất cánh máy bay, góc chiếu tia sáng mặt trời lên mái kính và góc dây cáp cầu treo',
      },
      {
        id: 'phuong_phap_toa_do_12_bai_17',
        code: 'BÀI 17',
        title: 'Bài 17: Phương trình mặt cầu',
        shortTitle: 'Bài 17: Phương trình mặt cầu',
        subtitle: 'Phương trình mặt cầu tâm I bán kính R, dạng khai triển và ứng dụng định vị radar/vệ tinh',
        topics: [
          'Xác định tâm và bán kính mặt cầu từ phương trình chính tắc và phương trình khai triển',
          'Lập phương trình mặt cầu có đường kính AB, ngoại tiếp tứ diện hoặc tiếp xúc với mặt phẳng',
          'Giao tuyến đường tròn giữa mặt phẳng và mặt cầu, công thức liên hệ R^2 = d^2 + r^2',
          'Ứng dụng định vị GPS vệ tinh, vùng phủ sóng radar không lưu và trạm phát sóng 5G',
        ],
        realWorldTheme: 'Mô hình vùng phủ sóng radar sân bay và định vị tọa độ bằng giao của các mặt cầu vệ tinh',
      },
    ],
    'Toán 12'
  ),
  tnBlueprints: buildTnBlueprints(
    'phuong_phap_toa_do_12',
    [
      { titleSuffix: 'Trạm radar không lưu & Quỹ đạo đường bay', theme: 'Trạm radar hình cầu phát hiện máy bay bay theo đường thẳng trong Oxyz' },
      { titleSuffix: 'Kiến trúc mái kính vòm & Góc nghiêng giàn không gian', theme: 'Thiết kế mái kính bảo tàng và khung thép không gian Oxyz' },
      { titleSuffix: 'Hệ thống vệ tinh GPS & Định vị tàu biển', theme: 'Định vị tọa độ bằng hệ mặt cầu vệ tinh GPS ngoài khơi' },
      { titleSuffix: 'Hành trình Drone giao hàng & Khoảng cách an toàn', theme: 'Điều khiển hai drone tránh va chạm và tính khoảng cách tới tòa nhà' },
      { titleSuffix: 'Cáp treo du lịch & Góc dốc sườn núi', theme: 'Tính độ dài tuyến cáp treo, độ cao trụ cáp và góc nghiêng so với sườn núi' },
      { titleSuffix: 'Đài kiểm soát không lưu & Đường hạ cánh ILS', theme: 'Tọa độ hóa đường băng sân bay và góc hạ cánh tiêu chuẩn' },
      { titleSuffix: 'Trạm phát sóng 5G & Vùng phủ mặt cầu', theme: 'Phủ sóng 5G hình cầu và thiết diện vùng phủ trên mặt đất' },
      { titleSuffix: 'Tia laser đo đạc địa chất & Mặt phẳng địa tầng', theme: 'Xác định giao điểm tia laser khoan thăm dò với lớp mặt phẳng địa chất' },
      { titleSuffix: 'Kính thiên văn vô tuyến & Góc hướng vệ tinh', theme: 'Tính góc hướng trục kính thiên văn tới vệ tinh thông tin' },
      { titleSuffix: 'Tổng hợp toàn chương V & Mô hình đô thị thông minh', theme: 'Quy hoạch không gian đô thị 3D với tòa nhà, đường dây điện và cảm biến cầu' },
    ],
    G12_OXYZ_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('phuong_phap_toa_do_12', [
    {
      subtitle: 'Cực trị khoảng cách điểm – đường thẳng – mặt phẳng',
      theme: 'Tối ưu vị trí đặt trạm trung chuyển để tổng khoảng cách nhỏ nhất trong Oxyz',
      topics: [...G12_OXYZ_TOPICS, 'Cực trị khoảng cách và hình chiếu vuông góc trong không gian Oxyz'],
    },
    {
      subtitle: 'Vị trí tương đối đường thẳng – mặt phẳng – mặt cầu',
      theme: 'Xác định đoạn đường bay nằm trong vùng phủ sóng radar và tiếp xúc mặt cầu',
      topics: [...G12_OXYZ_TOPICS, 'Đường thẳng cắt mặt cầu theo dây cung dài nhất/ngắn nhất, tiếp tuyến mặt cầu'],
    },
    {
      subtitle: 'Thiết diện mặt cầu & Cực trị bán kính đường tròn giao tuyến',
      theme: 'Tối ưu mặt phẳng cắt vùng phát sóng cầu cho diện tích thiết diện nhỏ nhất',
      topics: [...G12_OXYZ_TOPICS, 'Mặt phẳng chứa đường thẳng cắt mặt cầu theo giao tuyến có bán kính cực trị'],
    },
    {
      subtitle: 'Góc cực trị trong không gian & Đường thẳng đồng quy',
      theme: 'Tối ưu góc nghiêng tấm thu năng lượng và đường chiếu tia laser',
      topics: [...G12_OXYZ_TOPICS, 'Tìm mặt phẳng/đường thẳng tạo góc lớn nhất hoặc nhỏ nhất với yếu tố cho trước'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương V Oxyz (Chinh phục 9+)',
      theme: 'Bài toán tổng hợp cực trị tọa độ trên mặt cầu tiếp xúc và hệ radar đa trạm',
      topics: [...G12_OXYZ_TOPICS, 'Tổng hợp cực trị Oxyz kết hợp mặt cầu, tiếp diện và quỹ tích điểm'],
    },
  ]),
};

// ============================================================================
// 3. TOÁN 12 - CHƯƠNG VI: XÁC SUẤT CÓ ĐIỀU KIỆN
// ============================================================================
const G12_CONDPROB_TOPICS = [
  'Khái niệm xác suất có điều kiện P(A|B) = P(A ∩ B) / P(B) và công thức nhân xác suất P(A ∩ B) = P(B) * P(A|B)',
  'Sử dụng sơ đồ hình cây (Tree Diagram) và bảng thống kê 2×2 để tính xác suất có điều kiện',
  'Công thức xác suất toàn phần P(A) = P(B) * P(A|B) + P(B ngang) * P(A|B ngang) và mở rộng cho hệ đầy đủ',
  'Công thức Bayes P(B|A) = [P(B) * P(A|B)] / P(A) tính xác suất hậu nghiệm sau khi đã quan sát kết quả',
  'Bài toán thực tế: xét nghiệm y khoa (dương tính giả, âm tính giả), kiểm tra phế phẩm dây chuyền, dự báo thời tiết và lọc thư rác',
];

const grade12CondProbDef: OnlineChapterDefinition = {
  key: 'grade12-condprob',
  grade: 12,
  backTab: 'grade12-hub',
  scoresStorageKey: 'edubot_g12_condprob_scores_v1',
  backLabel: 'Quay lại Lớp 12',
  gradeTag: 'Toán 12 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương VI · Xác suất 12',
  heading: 'Xác suất có điều kiện (Toán 12)',
  headerTitle: 'Toán 12 (KNTT) - Chương VI: Xác suất có điều kiện (17 Bộ đề Online)',
  sidebarLabel: 'Xác suất có điều kiện (Toán 12)',
  sidebarMeta: '2 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương VI gồm 2 đề luyện tập theo từng bài (Bài 18 – Bài 19, 45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) tích hợp bài toán xét nghiệm y khoa, kiểm tra chất lượng, dự báo thời tiết và công thức Bayes.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 18 và Bài 19',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 2 bài, chú trọng xét nghiệm y khoa, phế phẩm, dự báo thời tiết và phân loại dữ liệu',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (quy tắc đếm, tổ hợp, sơ đồ hình cây nhiều nhánh và cập nhật Bayes nhiều bước)',
  subjectCourseName: 'Toán 12 - Chương VI: Xác suất có điều kiện',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế chuyên sâu về xét nghiệm y khoa (độ nhạy, độ đặc hiệu, dương tính giả), kiểm tra chất lượng linh kiện từ nhiều nhà máy, dự báo thời tiết hoặc phân loại email/tín dụng.',
  part3AnswerGuidance:
    'Đáp án phần III là giá trị xác suất làm tròn đến hàng phần trăm hoặc hàng phần nghìn (tối đa 4 ký tự như "0.85", "0.12", "0.64") hoặc tỉ lệ phần trăm ghi rõ đơn vị ngay trong đề bài.',
  latexGuidance: `- Xác suất có điều kiện: $P(A|B)$, $P(B|A)$
   - Biến cố đối và biến cố giao: $\\overline{A}$, $\\overline{B}$, $A \\cap B$
   - Công thức nhân xác suất: $P(A \\cap B) = P(B) \\cdot P(A|B)$
   - Công thức xác suất toàn phần: $P(A) = P(B) \\cdot P(A|B) + P(\\overline{B}) \\cdot P(A|\\overline{B})$
   - Công thức Bayes: $P(B|A) = \\frac{P(B) \\cdot P(A|B)}{P(A)}$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Tốt nghiệp THPT môn Toán 12 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chặt chẽ mọi phép tính xác suất có điều kiện, xác suất toàn phần và công thức Bayes (0 <= P <= 1, làm tròn chính xác tuyệt đối); dùng LaTeX chuẩn trong $...$ (P(A|B), \\overline{A}, \\cap, \\frac), escape đúng \\\\ trong JSON.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'xac_suat_co_dieu_kien_12_bai_18',
        code: 'BÀI 18',
        title: 'Bài 18: Xác suất có điều kiện',
        shortTitle: 'Bài 18: Xác suất có điều kiện',
        subtitle: 'Định nghĩa xác suất có điều kiện, công thức nhân xác suất và sơ đồ hình cây',
        topics: [
          'Định nghĩa và tính trực tiếp P(A|B) từ không gian mẫu thu gọn và từ bảng số liệu 2×2',
          'Công thức tính P(A|B) = P(A ∩ B) / P(B) và công thức nhân xác suất P(A ∩ B) = P(B) * P(A|B)',
          'Rút thăm/lấy bi không hoàn lại nhiều bước bằng sơ đồ hình cây',
          'Nhận biết hai biến cố độc lập qua xác suất có điều kiện P(A|B) = P(A)',
        ],
        realWorldTheme: 'Khảo sát học sinh tham gia câu lạc bộ, lấy mẫu sản phẩm không hoàn lại và sơ đồ hình cây',
      },
      {
        id: 'xac_suat_co_dieu_kien_12_bai_19',
        code: 'BÀI 19',
        title: 'Bài 19: Công thức xác suất toàn phần và công thức Bayes',
        shortTitle: 'Bài 19: Toàn phần & Bayes',
        subtitle: 'Xác suất toàn phần, xác suất hậu nghiệm Bayes và ứng dụng y khoa – công nghiệp',
        topics: [
          'Công thức xác suất toàn phần với phân hoạch 2 nhánh B, B ngang và 3 nhánh B1, B2, B3',
          'Công thức Bayes tính P(B|A) khi đã biết kết quả biến cố A xảy ra',
          'Ứng dụng trong xét nghiệm bệnh học (dương tính thật, dương tính giả, âm tính giả)',
          'Ứng dụng kiểm tra chất lượng sản phẩm từ 2–3 dây chuyền nhà máy và bộ lọc thư rác AI',
        ],
        realWorldTheme: 'Xét nghiệm sàng lọc y tế, kiểm định tỉ lệ phế phẩm nhà máy và hệ thống lọc spam',
      },
    ],
    'Toán 12'
  ),
  tnBlueprints: buildTnBlueprints(
    'xac_suat_co_dieu_kien_12',
    [
      { titleSuffix: 'Xét nghiệm y khoa & Dương tính giả', theme: 'Chẩn đoán bệnh lý với độ nhạy, độ đặc hiệu và xác suất dương tính giả' },
      { titleSuffix: 'Dây chuyền sản xuất & Kiểm định phế phẩm', theme: 'Hai phân xưởng sản xuất linh kiện điện tử với tỉ lệ phế phẩm khác nhau' },
      { titleSuffix: 'Dự báo thời tiết & Lập kế hoạch sự kiện', theme: 'Độ chính xác bản tin dự báo mưa và xác suất thời tiết thực tế' },
      { titleSuffix: 'Phân loại dữ liệu & Bộ lọc thư rác (Spam)', theme: 'Thuật toán Bayes phân loại email quảng cáo và giao dịch gian lận' },
      { titleSuffix: 'Lấy sản phẩm không hoàn lại & Sơ đồ hình cây', theme: 'Kiểm tra hai hộp linh kiện lấy chuyển giữa hai hộp bằng sơ đồ hình cây' },
      { titleSuffix: 'Thi đấu thể thao & Xác suất thắng theo sân bãi', theme: 'Phong độ đội bóng theo điều kiện sân nhà, sân khách và thời tiết' },
      { titleSuffix: 'Khảo sát học tập & Phân nhóm học sinh THPT', theme: 'Tỉ lệ học sinh đạt điểm giỏi theo phương pháp ôn tập và tổ hợp môn' },
      { titleSuffix: 'Cảm biến báo cháy & Kiểm soát an toàn nhà máy', theme: 'Độ tin cậy hệ thống cảm biến báo khói và báo động giả' },
      { titleSuffix: 'Thăm dò khoáng sản & Phân tích mẫu đất', theme: 'Khảo sát địa chất bằng thiết bị đo thăm dò trước khi khoan giếng' },
      { titleSuffix: 'Tổng hợp Chương VI & Quyết định tối ưu bằng Bayes', theme: 'Đánh giá rủi ro tín dụng ngân hàng và kiểm định chất lượng ba nhà cung cấp' },
    ],
    G12_CONDPROB_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('xac_suat_co_dieu_kien_12', [
    {
      subtitle: 'Sơ đồ hình cây 3 nhánh & Hệ đầy đủ nhiều biến cố',
      theme: 'Ba nhà máy cung cấp linh kiện với tỉ lệ chính phẩm khác nhau và truy xuất nguồn gốc Bayes',
      topics: [...G12_CONDPROB_TOPICS, 'Công thức xác suất toàn phần và Bayes mở rộng cho 3–4 giả thuyết đầy đủ'],
    },
    {
      subtitle: 'Kết hợp tổ hợp – chỉnh hợp với xác suất có điều kiện',
      theme: 'Chọn ngẫu nhiên bộ sản phẩm từ nhiều lô hàng và đánh giá nguồn lô hàng',
      topics: [...G12_CONDPROB_TOPICS, 'Tính xác suất có điều kiện kết hợp tổ hợp C_n^k khi lấy đồng thời nhiều phần tử'],
    },
    {
      subtitle: 'Cập nhật xác suất Bayes qua 2 lần xét nghiệm liên tiếp',
      theme: 'Thực hiện 2 lần xét nghiệm độc lập để cập nhật xác suất mắc bệnh chính xác hơn',
      topics: [...G12_CONDPROB_TOPICS, 'Cập nhật hậu nghiệm Bayes hai bước liên tiếp'],
    },
    {
      subtitle: 'Bài toán chuyển bi / chuyển sản phẩm hai giai đoạn',
      theme: 'Chuyển mẫu vật giữa hai kho hàng rồi lấy mẫu kiểm định ở kho thứ hai',
      topics: [...G12_CONDPROB_TOPICS, 'Xác suất toàn phần và Bayes trong mô hình chuyển phần tử hai bước'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương VI (Chinh phục 9+)',
      theme: 'Hệ thống kiểm soát chất lượng đa tầng và bài toán chiến lược kiểm định tối ưu',
      topics: [...G12_CONDPROB_TOPICS, 'Bài toán tìm tham số xác suất và suy luận Bayes ngược đa bước'],
    },
  ]),
};

// ============================================================================
// 4. TOÁN 11 - CHƯƠNG V: GIỚI HẠN. HÀM SỐ LIÊN TỤC
// ============================================================================
const G11_LIMITS_TOPICS = [
  'Giới hạn hữu hạn và giới hạn vô cực của dãy số, giới hạn dãy phân thức, dãy chứa lũy thừa q^n và căn thức',
  'Tổng cấp số nhân lùi vô hạn S = u1 / (1 - q) với |q| < 1 và ứng dụng thực tế',
  'Giới hạn hữu hạn, giới hạn một bên (x -> x0+, x -> x0-) và giới hạn tại vô cực của hàm số',
  'Khử các dạng vô định 0/0, ∞/∞, ∞ - ∞ bằng phân tích nhân tử và nhân lượng liên hợp',
  'Hàm số liên tục tại một điểm, liên tục trên khoảng/đoạn, tìm tham số m để hàm liên tục và chứng minh phương trình có nghiệm',
];

const grade11LimitsDef: OnlineChapterDefinition = {
  key: 'grade11-limits',
  grade: 11,
  backTab: 'grade11-hub',
  scoresStorageKey: 'edubot_g11_limits_scores_v1',
  backLabel: 'Quay lại Lớp 11',
  gradeTag: 'Toán 11 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương V · Giải tích 11',
  heading: 'Giới hạn. Hàm số liên tục (Toán 11)',
  headerTitle: 'Toán 11 (KNTT) - Chương V: Giới hạn. Hàm số liên tục (18 Bộ đề Online)',
  sidebarLabel: 'Giới hạn & Liên tục (Toán 11)',
  sidebarMeta: '3 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương V Toán 11 gồm 3 đề luyện tập theo bài học (Bài 15 – Bài 17, 45 phút) và 15 đề Ôn tập chương chuẩn cấu trúc Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) tích hợp bài toán tổng cấp số nhân lùi vô hạn, tăng trưởng và chi phí sản xuất.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 15, Bài 16 và Bài 17',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 3 bài & tích hợp cấp số nhân lùi vô hạn, tăng trưởng và chi phí sản xuất',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (khử dạng vô định căn bậc cao, tìm tham số để hàm số liên tục trên tập xác định)',
  subjectCourseName: 'Toán 11 - Chương V: Giới hạn. Hàm số liên tục',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế như tổng quãng đường quả bóng nảy/bông tuyết Koch bằng cấp số nhân lùi vô hạn, chi phí trung bình trên một sản phẩm khi sản lượng lớn, hoặc mô hình nồng độ chất tăng trưởng bão hòa.',
  part3AnswerGuidance:
    'Đáp án phần III là giá trị giới hạn, tổng cấp số nhân lùi vô hạn, hoặc giá trị tham số m để hàm liên tục (số nguyên hoặc thập phân làm tròn tối đa 4 ký tự như "2.5", "-4", "0.75").',
  latexGuidance: `- Giới hạn dãy số: $\\lim_{n \\to +\\infty} u_n$
   - Giới hạn hàm số và giới hạn một bên: $\\lim_{x \\to x_0} f(x)$, $\\lim_{x \\to x_0^+} f(x)$, $\\lim_{x \\to x_0^-} f(x)$, $\\lim_{x \\to +\\infty} f(x)$, $\\pm\\infty$
   - Hàm số cho bởi nhiều công thức: $\\begin{cases} ... \\\\ ... \\end{cases}$
   - Phân số và căn thức: $\\frac{a}{b}$, $\\sqrt{...}$, $\\sqrt[3]{...}$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Toán 11 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chính xác mọi phép tính giới hạn dãy số, giới hạn hàm số, giới hạn một bên và điều kiện liên tục; dùng LaTeX chuẩn trong $...$ (\\lim_{n \\to +\\infty}, \\lim_{x \\to x_0^+}, \\pm\\infty, \\frac), escape đúng \\\\ trong JSON.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'gioi_han_11_bai_15',
        code: 'BÀI 15',
        title: 'Bài 15: Giới hạn của dãy số',
        shortTitle: 'Bài 15: Giới hạn dãy số',
        subtitle: 'Giới hạn hữu hạn, giới hạn vô cực của dãy số và tổng cấp số nhân lùi vô hạn',
        topics: [
          'Giới hạn đặc biệt của dãy số 1/n^k, q^n (|q| < 1) và các định lí về giới hạn hữu hạn',
          'Tính giới hạn dãy phân thức hữu tỉ, dãy chứa căn thức và dãy chứa lũy thừa cơ số lớn nhất',
          'Tổng của cấp số nhân lùi vô hạn S = u1 / (1 - q) và đổi số thập phân vô hạn tuần hoàn ra phân số',
          'Giới hạn vô cực của dãy số và bài toán thực tế về hình vuông/tam giác lồng nhau vô hạn',
        ],
        realWorldTheme: 'Tổng diện tích các hình vuông/tam giác lồng nhau vô hạn và quãng đường bóng nảy đàn hồi',
      },
      {
        id: 'gioi_han_11_bai_16',
        code: 'BÀI 16',
        title: 'Bài 16: Giới hạn của hàm số',
        shortTitle: 'Bài 16: Giới hạn hàm số',
        subtitle: 'Giới hạn hữu hạn tại một điểm, giới hạn một bên và giới hạn tại vô cực',
        topics: [
          'Giới hạn hữu hạn của hàm số tại x0 và khử dạng vô định 0/0 bằng phân tích nhân tử/liên hợp',
          'Giới hạn một bên (x -> x0+, x -> x0-) và điều kiện tồn tại giới hạn tại một điểm',
          'Giới hạn của hàm số tại +∞ và -∞ (chú ý dấu của x khi đưa vào/ra khỏi căn bậc hai)',
          'Ứng dụng giới hạn tại vô cực phân tích chi phí sản xuất trung bình và nồng độ muối/thuốc lâu dài',
        ],
        realWorldTheme: 'Chi phí trung bình trên một sản phẩm khi mở rộng quy mô sản xuất vô hạn',
      },
      {
        id: 'gioi_han_11_bai_17',
        code: 'BÀI 17',
        title: 'Bài 17: Hàm số liên tục',
        shortTitle: 'Bài 17: Hàm số liên tục',
        subtitle: 'Tính liên tục tại một điểm, trên khoảng/đoạn và tìm tham số m để hàm liên tục',
        topics: [
          'Định nghĩa hàm số liên tục tại x0: lim(x->x0) f(x) = f(x0) và xét gián đoạn từ đồ thị',
          'Tìm tham số m, a, b để hàm số cho bởi nhiều công thức liên tục tại điểm nối hoặc trên R',
          'Tính liên tục của tổng, hiệu, tích, thương các hàm số sơ cấp',
          'Ứng dụng định lí giá trị trung gian chứng minh phương trình có nghiệm và tính giá điện/cước taxi bậc thang',
        ],
        realWorldTheme: 'Phân tích tính liên tục/gián đoạn của biểu giá cước vận tải, giá điện bậc thang và phí gửi xe',
      },
    ],
    'Toán 11'
  ),
  tnBlueprints: buildTnBlueprints(
    'gioi_han_11',
    [
      { titleSuffix: 'Cấp số nhân lùi vô hạn & Quãng đường bóng nảy', theme: 'Tính tổng quãng đường quả bóng rơi tự do nảy nhiều lần' },
      { titleSuffix: 'Chi phí trung bình nhà máy & Giới hạn tại vô cực', theme: 'Phân tích hàm chi phí trung bình C(x)/x khi sản lượng tăng rất lớn' },
      { titleSuffix: 'Biểu giá cước bậc thang & Tính liên tục hàm số', theme: 'Mô hình hóa hàm cước taxi/điện bậc thang và kiểm tra điểm gián đoạn' },
      { titleSuffix: 'Hình học Fractal & Tổng chu vi/diện tích vô hạn', theme: 'Dãy tam giác đều/hình tròn nội tiếp liên tiếp tạo tổng lùi vô hạn' },
      { titleSuffix: 'Nồng độ dung dịch bão hòa & Giới hạn dãy số', theme: 'Bơm nước muối vào bể chứa và tính nồng độ giới hạn lâu dài' },
      { titleSuffix: 'Tốc độ tăng trưởng sinh học & Dạng vô định 0/0', theme: 'Mô hình tăng trưởng bão hòa logistic và tính giới hạn hàm số' },
      { titleSuffix: 'Khử vô định chứa căn & Giới hạn một bên', theme: 'Phân tích hàm có dấu giá trị tuyệt đối và giới hạn trái – phải' },
      { titleSuffix: 'Tham số liên tục & Hiệu suất vận hành thiết bị', theme: 'Tìm tham số để hàm công suất vận hành liên tục tại mốc chuyển chế độ' },
      { titleSuffix: 'Số thập phân tuần hoàn & Tổng dãy phân thức', theme: 'Biểu diễn số thập phân vô hạn tuần hoàn và bài toán dãy số truy hồi' },
      { titleSuffix: 'Tổng hợp Chương V & Ứng dụng kỹ thuật – kinh tế', theme: 'Hàm lợi nhuận dài hạn và tính liên tục của đường cong nhiệt độ' },
    ],
    G11_LIMITS_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('gioi_han_11', [
    {
      subtitle: 'Khử dạng vô định chứa căn bậc hai và căn bậc ba',
      theme: 'Tách hạng tử và nhân liên hợp bậc hai – bậc ba tính giới hạn phức tạp',
      topics: [...G11_LIMITS_TOPICS, 'Kỹ thuật thêm bớt hằng số/hàm số khử dạng vô định kết hợp căn bậc 2 và căn bậc 3'],
    },
    {
      subtitle: 'Tìm tham số a, b khi biết giới hạn hữu hạn dạng 0/0',
      theme: 'Xác định thông số mô hình từ điều kiện khử dạng vô định hữu hạn',
      topics: [...G11_LIMITS_TOPICS, 'Tìm điều kiện tham số để biểu thức tử triệt tiêu nhân tử mẫu và đạt giới hạn cho trước'],
    },
    {
      subtitle: 'Giới hạn dãy số truy hồi & Tổng dãy số dạng sai phân',
      theme: 'Tính tổng chuỗi sai phân và phân tích xu hướng hội tụ của dãy thực tế',
      topics: [...G11_LIMITS_TOPICS, 'Tính giới hạn tổng n số hạng đầu của dãy phân thức sai phân'],
    },
    {
      subtitle: 'Tìm tham số để hàm số liên tục trên tập xác định & Số nghiệm PT',
      theme: 'Chứng minh tồn tại nghiệm phương trình đa thức và xét liên tục đa nhánh',
      topics: [...G11_LIMITS_TOPICS, 'Ứng dụng hàm số liên tục chứng minh phương trình chứa tham số luôn có nghiệm'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương V (Chinh phục 9+)',
      theme: 'Tổng hợp giới hạn chứa tham số, liên hợp bậc cao và bài toán hội tụ thực tế',
      topics: [...G11_LIMITS_TOPICS, 'Tổng hợp VDC giới hạn dãy số, hàm số và tính liên tục'],
    },
  ]),
};

// ============================================================================
// 5. TOÁN 11 - CHƯƠNG VII: QUAN HỆ VUÔNG GÓC TRONG KHÔNG GIAN
// ============================================================================
const G11_PERP_TOPICS = [
  'Góc giữa hai đường thẳng trong không gian và chứng minh hai đường thẳng vuông góc a ⊥ b',
  'Đường thẳng vuông góc với mặt phẳng d ⊥ (P), định lí ba đường vuông góc và tính chất liên hệ song song – vuông góc',
  'Phép chiếu vuông góc và góc giữa đường thẳng và mặt phẳng',
  'Hai mặt phẳng vuông góc (P) ⊥ (Q), góc nhị diện [P, d, Q] và góc phẳng nhị diện',
  'Khoảng cách từ một điểm đến mặt phẳng d(A, (P)), khoảng cách giữa hai đường thẳng chéo nhau d(a, b)',
  'Thể tích khối chóp V = (1/3)Bh, khối lăng trụ V = Bh và khối chóp cụt đều V = (1/3)h(B + √(BB\') + B\')',
];

const grade11PerpDef: OnlineChapterDefinition = {
  key: 'grade11-perp',
  grade: 11,
  backTab: 'grade11-hub',
  scoresStorageKey: 'edubot_g11_perp_scores_v1',
  backLabel: 'Quay lại Lớp 11',
  gradeTag: 'Toán 11 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương VII · Hình học không gian 11',
  heading: 'Quan hệ vuông góc trong không gian (Toán 11)',
  headerTitle: 'Toán 11 (KNTT) - Chương VII: Quan hệ vuông góc trong không gian (21 Bộ đề Online)',
  sidebarLabel: 'Quan hệ vuông góc (Toán 11)',
  sidebarMeta: '6 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương VII Toán 11 gồm 6 đề luyện tập theo từng bài (Bài 22 – Bài 27, 45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) về góc, góc nhị diện, khoảng cách và thể tích khối đa diện.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 22 đến Bài 27',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 6 bài, chú trọng góc dốc, khoảng cách, thể tích chóp, lăng trụ và chóp cụt đều',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (góc nhị diện, khoảng cách hai đường thẳng chéo nhau, thể tích khối đa diện phức tạp)',
  subjectCourseName: 'Toán 11 - Chương VII: Quan hệ vuông góc trong không gian',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế về độ dốc mái nhà/cầu thang (góc nhị diện), cột cờ/tháp anten vuông góc mặt đất, tính thể tích chậu hoa/bể chứa hình chóp cụt đều hoặc khối lăng trụ.',
  part3AnswerGuidance:
    'Đáp án phần III là số đo góc (độ), khoảng cách hoặc thể tích khối chóp/lăng trụ/chóp cụt đều (số nguyên hoặc thập phân làm tròn tối đa 4 ký tự như "60", "2.45", "18.5").',
  latexGuidance: `- Quan hệ vuông góc: $a \\perp b$, $d \\perp (P)$, $(P) \\perp (Q)$
   - Góc nhị diện và khoảng cách: $[P, d, Q]$, $d(A, (P))$, $d(a, b)$
   - Công thức thể tích: $V = \\frac{1}{3}Bh$, $V = Bh$, $V = \\frac{1}{3}h(B + \\sqrt{BB'} + B')$
   - Tên hình không gian: $S.ABCD$, $S.ABC$, $ABC.A'B'C'$, $ABCD.A'B'C'D'$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Hình học không gian Toán 11 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chặt chẽ tính nhất quán hình học, góc nhị diện, khoảng cách và thể tích khối chóp/lăng trụ/chóp cụt đều; dùng LaTeX chuẩn trong $...$ (\\perp, [P, d, Q], d(A,(P)), \\frac{1}{3}Bh), escape đúng \\\\ trong JSON.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'quan_he_vuong_goc_11_bai_22',
        code: 'BÀI 22',
        title: 'Bài 22: Hai đường thẳng vuông góc',
        shortTitle: 'Bài 22: 2 đường vuông góc',
        subtitle: 'Góc giữa hai đường thẳng trong không gian và chứng minh hai đường thẳng vuông góc',
        topics: [
          'Định nghĩa góc giữa hai đường thẳng trong không gian (0° <= góc <= 90°)',
          'Tính góc giữa hai đường thẳng chéo nhau trong hình lập phương, hình hộp, tứ diện đều bằng cách tịnh tiến song song',
          'Chứng minh hai đường thẳng vuông góc bằng định lí Pytago đảo hoặc quan hệ song song',
        ],
        realWorldTheme: 'Tính góc tạo bởi các thanh giằng chéo trên khung thép giàn không gian và cầu vượt',
      },
      {
        id: 'quan_he_vuong_goc_11_bai_23',
        code: 'BÀI 23',
        title: 'Bài 23: Đường thẳng vuông góc với mặt phẳng',
        shortTitle: 'Bài 23: Đường ⊥ Mặt phẳng',
        subtitle: 'Điều kiện đường thẳng vuông góc mặt phẳng, mặt phẳng trung trực và định lí ba đường vuông góc',
        topics: [
          'Điều kiện chứng minh d ⊥ (P) (vuông góc với hai đường thẳng cắt nhau nằm trong (P))',
          'Tính chất liên hệ giữa quan hệ song song và quan hệ vuông góc của đường và mặt',
          'Định lí ba đường vuông góc và ứng dụng chứng minh cạnh bên vuông góc cạnh đáy trong hình chóp',
        ],
        realWorldTheme: 'Dựng cột trụ thẳng đứng vuông góc mặt sàn xây dựng và kiểm tra độ thẳng đứng bằng dây dọi',
      },
      {
        id: 'quan_he_vuong_goc_11_bai_24',
        code: 'BÀI 24',
        title: 'Bài 24: Phép chiếu vuông góc. Góc giữa đường thẳng và mặt phẳng',
        shortTitle: 'Bài 24: Góc Đường & Mặt',
        subtitle: 'Hình chiếu vuông góc của điểm, đường thẳng và tính góc giữa đường thẳng với mặt phẳng',
        topics: [
          'Xác định chân đường cao và hình chiếu vuông góc của đường thẳng lên mặt phẳng',
          'Tính góc giữa cạnh bên và mặt đáy của hình chóp có cạnh bên vuông góc đáy hoặc chóp đều',
          'Tính góc giữa đường chéo hình hộp chữ nhật/lập phương với các mặt bên',
        ],
        realWorldTheme: 'Góc nghiêng của dây cáp neo cột ăng-ten, đường dốc cầu và tia nắng mặt trời với sân trường',
      },
      {
        id: 'quan_he_vuong_goc_11_bai_25',
        code: 'BÀI 25',
        title: 'Bài 25: Hai mặt phẳng vuông góc',
        shortTitle: 'Bài 25: 2 mặt vuông góc',
        subtitle: 'Góc nhị diện, góc phẳng nhị diện, điều kiện hai mặt phẳng vuông góc và hình chóp đều/lăng trụ đứng',
        topics: [
          'Xác định và tính số đo góc phẳng nhị diện [P, d, Q] (0° đến 180°)',
          'Chứng minh hai mặt phẳng vuông góc và tính chất giao tuyến của hai mặt cùng vuông góc mặt thứ ba',
          'Hình lăng trụ đứng, hình hộp chữ nhật, hình lập phương, hình chóp đều và hình chóp cụt đều',
        ],
        realWorldTheme: 'Tính góc mở cánh cửa, độ dốc mái nhà hai mái (góc nhị diện) và góc mở màn hình laptop',
      },
      {
        id: 'quan_he_vuong_goc_11_bai_26',
        code: 'BÀI 26',
        title: 'Bài 26: Khoảng cách',
        shortTitle: 'Bài 26: Khoảng cách',
        subtitle: 'Khoảng cách từ điểm đến mặt phẳng, đường thẳng song song mặt phẳng và hai đường thẳng chéo nhau',
        topics: [
          'Tính khoảng cách từ chân đường cao đến mặt bên của hình chóp (kỹ thuật dựng 2 nét vuông góc)',
          'Chuyển đổi khoảng cách từ điểm bất kỳ về chân đường cao bằng tỉ số đoạn thẳng',
          'Đoạn vuông góc chung và tính khoảng cách giữa hai đường thẳng chéo nhau',
        ],
        realWorldTheme: 'Tính khoảng cách an toàn từ đỉnh tháp tới dây cáp và khoảng cách giữa hai đường ống chéo nhau',
      },
      {
        id: 'quan_he_vuong_goc_11_bai_27',
        code: 'BÀI 27',
        title: 'Bài 27: Thể tích',
        shortTitle: 'Bài 27: Thể tích khối đa diện',
        subtitle: 'Thể tích khối chóp, khối lăng trụ, khối hộp và khối chóp cụt đều',
        topics: [
          'Thể tích khối chóp V = (1/3)Bh (chóp có cạnh bên vuông góc đáy, chóp đều, mặt bên vuông góc đáy)',
          'Thể tích khối lăng trụ đứng, lăng trụ xiên và hình hộp',
          'Thể tích khối chóp cụt đều V = (1/3)h(B + √(BB\') + B\') và ứng dụng thực tế tính dung tích vật thể',
        ],
        realWorldTheme: 'Tính thể tích bể nước lăng trụ, chậu cây/bệ tượng hình chóp cụt đều và kim tự tháp kính',
      },
    ],
    'Toán 11'
  ),
  tnBlueprints: buildTnBlueprints(
    'quan_he_vuong_goc_11',
    [
      { titleSuffix: 'Góc dốc mái nhà & Thể tích chóp tứ giác đều', theme: 'Thiết kế mái ngói kim tự tháp và tính góc nhị diện mái nhà' },
      { titleSuffix: 'Chậu cây hình chóp cụt đều & Dung tích chứa đất', theme: 'Tính thể tích chậu trồng cây và bồn chứa hình chóp cụt tứ giác đều' },
      { titleSuffix: 'Cột ăng-ten dây neo & Góc đường với mặt phẳng', theme: 'Tính chiều dài dây cáp neo trụ phát sóng và góc tạo với mặt đất' },
      { titleSuffix: 'Hồ bơi lăng trụ đứng & Khoảng cách điểm đến mặt', theme: 'Tính dung tích bể bơi lăng trụ và khoảng cách giữa các thành bể' },
      { titleSuffix: 'Bệ tượng đài chóp cụt & Góc hai mặt bên', theme: 'Tính thể tích bê tông đúc bệ tượng hình chóp cụt đều' },
      { titleSuffix: 'Khung lều cắm trại & Góc nhị diện sườn lều', theme: 'Thiết kế lều chữ A/lăng trụ tam giác và tính góc mở vách lều' },
      { titleSuffix: 'Cầu thang & Khoảng cách hai thanh giằng chéo nhau', theme: 'Khoảng cách giữa hai dầm thép chéo nhau trong kết cấu nhà xưởng' },
      { titleSuffix: 'Kim tự tháp bảo tàng & Khoảng cách từ tâm đáy', theme: 'Tính khoảng cách từ tâm sàn bảo tàng kim tự tháp tới mặt kính bên' },
      { titleSuffix: 'Bồn chứa hình hộp & Đường chéo tạo góc với đáy', theme: 'Tối ưu kích thước thùng hàng và góc nghiêng thanh thép đặt trong thùng' },
      { titleSuffix: 'Tổng hợp toàn chương VII & Kiến trúc không gian', theme: 'Công trình tháp quan sát đa diện kết hợp lăng trụ và chóp cụt đều' },
    ],
    G11_PERP_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('quan_he_vuong_goc_11', [
    {
      subtitle: 'Góc nhị diện phức tạp trong hình chóp & lăng trụ xiên',
      theme: 'Xác định góc nhị diện giữa hai mặt bên kề nhau của hình chóp',
      topics: [...G11_PERP_TOPICS, 'Kỹ thuật xác định góc phẳng nhị diện giữa hai mặt bên không chứa đường cao'],
    },
    {
      subtitle: 'Khoảng cách giữa hai đường thẳng chéo nhau nâng cao',
      theme: 'Dựng mặt phẳng song song quy khoảng cách hai đường chéo nhau về chân đường cao',
      topics: [...G11_PERP_TOPICS, 'Khoảng cách hai đường thẳng chéo nhau bằng phương pháp mặt phẳng song song và tỉ số'],
    },
    {
      subtitle: 'Thể tích khối chóp có mặt bên vuông góc đáy & Chóp xiên',
      theme: 'Tính thể tích khối đa diện khi hình chiếu đỉnh rơi vào tâm ngoại tiếp/trọng tâm đáy',
      topics: [...G11_PERP_TOPICS, 'Thể tích khối chóp có các cạnh bên bằng nhau hoặc các mặt bên tạo góc bằng nhau với đáy'],
    },
    {
      subtitle: 'Tỉ số thể tích & Phân chia khối đa diện phức tạp',
      theme: 'Tính thể tích phần cắt của khối lăng trụ và chóp bằng công thức Simson',
      topics: [...G11_PERP_TOPICS, 'Tỉ số thể tích khối tứ diện và phân chia khối lăng trụ bởi mặt phẳng cắt'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương VII (Chinh phục 9+)',
      theme: 'Tối ưu hóa kích thước bể chứa chóp cụt và bài toán tổng hợp góc – khoảng cách – thể tích',
      topics: [...G11_PERP_TOPICS, 'Bài toán tổng hợp góc nhị diện, khoảng cách hai đường chéo nhau và thể tích cực trị'],
    },
  ]),
};

// ============================================================================
// 6. TOÁN 11 - CHƯƠNG VIII: CÁC QUY TẮC TÍNH XÁC SUẤT
// ============================================================================
const G11_PROB_TOPICS = [
  'Biến cố hợp A ∪ B, biến cố giao A ∩ B, biến cố xung khắc và biến cố độc lập',
  'Công thức cộng xác suất cho hai biến cố xung khắc P(A ∪ B) = P(A) + P(B) và tổng quát P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
  'Công thức nhân xác suất cho hai biến cố độc lập P(A ∩ B) = P(A) * P(B) và mở rộng nhiều biến cố độc lập',
  'Kết hợp biến cố đối P(A ngang) = 1 - P(A) trong các bài toán "có ít nhất một"',
  'Bài toán thực tế: độ tin cậy hệ thống máy móc nối tiếp/song song, chọn mẫu khảo sát và trò chơi xác suất',
];

const grade11ProbDef: OnlineChapterDefinition = {
  key: 'grade11-prob',
  grade: 11,
  backTab: 'grade11-hub',
  scoresStorageKey: 'edubot_g11_prob_scores_v1',
  backLabel: 'Quay lại Lớp 11',
  gradeTag: 'Toán 11 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương VIII · Xác suất 11',
  heading: 'Các quy tắc tính xác suất (Toán 11)',
  headerTitle: 'Toán 11 (KNTT) - Chương VIII: Các quy tắc tính xác suất (18 Bộ đề Online)',
  sidebarLabel: 'Quy tắc tính xác suất (Toán 11)',
  sidebarMeta: '3 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương VIII Toán 11 gồm 3 đề luyện tập theo từng bài (Bài 28 – Bài 30, 45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) tích hợp bài toán vận hành hệ thống máy móc, chọn mẫu và trò chơi xác suất.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 28, Bài 29 và Bài 30',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 3 bài & tích hợp vận hành hệ thống máy móc, chọn mẫu, trò chơi xác suất',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (kết hợp quy tắc đếm, tổ hợp – chỉnh hợp với công thức cộng và nhân nhiều biến cố)',
  subjectCourseName: 'Toán 11 - Chương VIII: Các quy tắc tính xác suất',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế về độ tin cậy của hệ thống động cơ/linh kiện hoạt động độc lập, khảo sát học sinh thích hai môn học hoặc xạ thủ bắn bia độc lập.',
  part3AnswerGuidance:
    'Đáp án phần III là giá trị xác suất làm tròn đến hàng phần trăm hoặc hàng phần nghìn (tối đa 4 ký tự như "0.84", "0.25", "0.92").',
  latexGuidance: `- Phép toán biến cố: $A \\cup B$, $A \\cap B$, $\\overline{A}$, $\\overline{B}$
   - Công thức cộng xác suất: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
   - Công thức nhân xác suất độc lập: $P(A \\cap B) = P(A) \\cdot P(B)$
   - Phân số và tổ hợp: $\\frac{a}{b}$, $C_n^k$, $A_n^k$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Toán 11 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chặt chẽ mọi phép tính biến cố hợp, giao, độc lập, công thức cộng và nhân xác suất (0 <= P <= 1); dùng LaTeX chuẩn trong $...$ (\\cup, \\cap, \\overline{A}, \\frac), escape đúng \\\\ trong JSON.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'xac_suat_11_bai_28',
        code: 'BÀI 28',
        title: 'Bài 28: Biến cố hợp, biến cố giao, biến cố độc lập',
        shortTitle: 'Bài 28: Hợp, giao, độc lập',
        subtitle: 'Nhận diện biến cố hợp A ∪ B, biến cố giao A ∩ B, biến cố xung khắc và độc lập',
        topics: [
          'Mô tả biến cố hợp A ∪ B và biến cố giao A ∩ B bằng ngôn ngữ và tập hợp kết quả thuận lợi',
          'Phân biệt hai biến cố xung khắc (A ∩ B = rỗng) và hai biến cố độc lập',
          'Biểu diễn các biến cố phức hợp qua A, B, A ngang, B ngang (ví dụ: đúng một trong hai xảy ra)',
        ],
        realWorldTheme: 'Phân loại kết quả gieo xúc xắc, rút thẻ và kết quả thi đạt môn Toán – Tiếng Anh',
      },
      {
        id: 'xac_suat_11_bai_29',
        code: 'BÀI 29',
        title: 'Bài 29: Công thức cộng xác suất',
        shortTitle: 'Bài 29: Công thức cộng XS',
        subtitle: 'Công thức cộng cho hai biến cố xung khắc và công thức cộng xác suất tổng quát',
        topics: [
          'Áp dụng P(A ∪ B) = P(A) + P(B) khi A, B xung khắc',
          'Áp dụng công thức cộng tổng quát P(A ∪ B) = P(A) + P(B) - P(A ∩ B) và sơ đồ Ven',
          'Tính xác suất của biến cố giao từ xác suất hợp hoặc bài toán thống kê hai tiêu chí',
        ],
        realWorldTheme: 'Khảo sát tỉ lệ học sinh chơi thể thao/âm nhạc và chọn ngẫu nhiên sản phẩm đạt tiêu chuẩn',
      },
      {
        id: 'xac_suat_11_bai_30',
        code: 'BÀI 30',
        title: 'Bài 30: Công thức nhân xác suất cho hai biến cố độc lập',
        shortTitle: 'Bài 30: Công thức nhân XS',
        subtitle: 'Công thức nhân xác suất độc lập, bài toán ít nhất một và độ tin cậy hệ thống',
        topics: [
          'Áp dụng P(A ∩ B) = P(A) * P(B) cho hai và nhiều biến cố độc lập',
          'Tính xác suất xảy ra đúng 1 biến cố, không xảy ra biến cố nào và có ít nhất 1 biến cố xảy ra',
          'Bài toán xạ thủ bắn bia độc lập, động cơ máy bay và hệ thống mạch điện dự phòng',
        ],
        realWorldTheme: 'Tính xác suất hệ thống máy phát điện dự phòng hoạt động ổn định và hai xạ thủ bắn trúng đích',
      },
    ],
    'Toán 11'
  ),
  tnBlueprints: buildTnBlueprints(
    'xac_suat_11',
    [
      { titleSuffix: 'Hệ thống động cơ dự phòng & Công thức nhân', theme: 'Độ tin cậy vận hành của máy bay có hai động cơ hoạt động độc lập' },
      { titleSuffix: 'Khảo sát học sinh 2 môn học & Sơ đồ Ven', theme: 'Khảo sát tỉ lệ học sinh giỏi Toán, Tin học và áp dụng công thức cộng' },
      { titleSuffix: 'Xạ thủ bắn bia độc lập & Biến cố "ít nhất một"', theme: 'Ba vận động viên bắn cung độc lập vào bia với xác suất khác nhau' },
      { titleSuffix: 'Hệ thống đèn tín hiệu & Mạch điện nối tiếp/song song', theme: 'Xác suất mạch điện thông mạch khi các công tắc hoạt động độc lập' },
      { titleSuffix: 'Chọn mẫu sản phẩm từ hai lô hàng độc lập', theme: 'Lấy ngẫu nhiên từ mỗi hộp một sản phẩm để kiểm tra chất lượng' },
      { titleSuffix: 'Trò chơi gieo xúc xắc & Rút thẻ số', theme: 'Tính xác suất tổng số chấm chia hết cho 3 hoặc có số chẵn' },
      { titleSuffix: 'Tỷ lệ nảy mầm hạt giống & Nông nghiệp thông minh', theme: 'Đánh giá xác suất sống sót độc lập của các cây giống trong nhà kính' },
      { titleSuffix: 'Thi trắc nghiệm & Xác suất trả lời đúng độc lập', theme: 'Phân tích xác suất thí sinh vượt qua bài kiểm tra nhiều chặng độc lập' },
      { titleSuffix: 'Hệ thống cảm biến an ninh đa lớp', theme: 'Xác suất phát hiện xâm nhập khi lắp đặt đồng thời nhiều cảm biến độc lập' },
      { titleSuffix: 'Tổng hợp Chương VIII & Chọn mẫu thống kê', theme: 'Đánh giá chất lượng dịch vụ và xác suất trúng thưởng quay số độc lập' },
    ],
    G11_PROB_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('xac_suat_11', [
    {
      subtitle: 'Kết hợp tổ hợp C_n^k với công thức cộng xác suất',
      theme: 'Chọn đội tuyển học sinh đa môn thỏa mãn ít nhất một trong hai tiêu chí',
      topics: [...G11_PROB_TOPICS, 'Tính P(A ∪ B) khi A, B đều phải đếm số phần tử bằng tổ hợp – chỉnh hợp'],
    },
    {
      subtitle: 'Hệ thống mạch điện hỗn hợp nối tiếp – song song nhiều linh kiện',
      theme: 'Tính độ tin cậy của hệ thống máy chủ gồm cụm nối tiếp kết hợp dự phòng song song',
      topics: [...G11_PROB_TOPICS, 'Phân tách biến cố mạch điện nhiều nhánh độc lập bằng công thức cộng và nhân'],
    },
    {
      subtitle: 'Bài toán 3–4 biến cố độc lập & Xác suất thắng loạt luân lưu',
      theme: 'Xác suất đội bóng thắng sau loạt sút luân lưu hoặc ván đấu thể thao',
      topics: [...G11_PROB_TOPICS, 'Tính xác suất nhiều biến cố độc lập theo trường hợp rời nhau'],
    },
    {
      subtitle: 'Tìm tham số xác suất / số phần tử từ phương trình xác suất',
      theme: 'Xác định số bóng cần bỏ thêm vào hộp hoặc số cảm biến tối thiểu đạt độ tin cậy 99%',
      topics: [...G11_PROB_TOPICS, 'Giải bất phương trình xác suất tìm số lần thử/số linh kiện tối thiểu'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương VIII (Chinh phục 9+)',
      theme: 'Bài toán tổng hợp đếm tổ hợp, sơ đồ Ven 3 biến cố và hệ thống độc lập nhiều tầng',
      topics: [...G11_PROB_TOPICS, 'Tổng hợp VDC quy tắc cộng, quy tắc nhân và tổ hợp'],
    },
  ]),
};

// ============================================================================
// 7. TOÁN 11 - CHƯƠNG IX: ĐẠO HÀM
// ============================================================================
const G11_DERIV_TOPICS = [
  'Định nghĩa đạo hàm tại một điểm f\'(x0) = lim(x->x0) [f(x)-f(x0)]/(x-x0), ý nghĩa hình học (hệ số góc tiếp tuyến) và ý nghĩa vật lý (vận tốc tức thời)',
  'Các quy tắc tính đạo hàm của tổng, hiệu, tích (u·v)\' = u\'v + uv\', thương (u/v)\' = (u\'v - uv\')/v^2',
  'Đạo hàm các hàm số sơ cấp (đa thức, căn thức, lượng giác sin/cos/tan/cot, mũ e^x, a^x, logarit ln x, log_a x) và đạo hàm hàm hợp',
  'Viết phương trình tiếp tuyến của đồ thị hàm số tại một điểm, biết hệ số góc hoặc song song/vuông góc đường thẳng cho trước',
  'Đạo hàm cấp hai y\'\' = f\'\'(x) và ý nghĩa cơ học (gia tốc tức thời a(t) = s\'\'(t) = v\'(t))',
];

const grade11DerivDef: OnlineChapterDefinition = {
  key: 'grade11-deriv',
  grade: 11,
  backTab: 'grade11-hub',
  scoresStorageKey: 'edubot_g11_deriv_scores_v1',
  backLabel: 'Quay lại Lớp 11',
  gradeTag: 'Toán 11 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương IX · Giải tích 11',
  heading: 'Đạo hàm (Toán 11)',
  headerTitle: 'Toán 11 (KNTT) - Chương IX: Đạo hàm (18 Bộ đề Online)',
  sidebarLabel: 'Đạo hàm (Toán 11)',
  sidebarMeta: '3 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương IX Toán 11 gồm 3 đề luyện tập theo từng bài (Bài 31 – Bài 33, 45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) chú trọng vận tốc tức thời, gia tốc tức thời và phương trình tiếp tuyến.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 31, Bài 32 và Bài 33',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 3 bài, chú trọng ý nghĩa vật lý (vận tốc, gia tốc) và ý nghĩa hình học (tiếp tuyến)',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (đạo hàm hàm hợp lượng giác – mũ – logarit, tiếp tuyến qua một điểm, BPT đạo hàm)',
  subjectCourseName: 'Toán 11 - Chương IX: Đạo hàm',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế về chuyển động của vật (tìm vận tốc tức thời v(t) = s\'(t), gia tốc tức thời a(t) = s\'\'(t), thời điểm dừng lại/đạt vận tốc cực đại) hoặc tốc độ tăng trưởng/phản ứng hóa học.',
  part3AnswerGuidance:
    'Đáp án phần III là giá trị đạo hàm tại một điểm, hệ số góc tiếp tuyến, vận tốc tức thời, gia tốc tức thời hoặc số nghiệm nguyên của bất phương trình chứa đạo hàm (tối đa 4 ký tự như "12", "-3.5", "0.25").',
  latexGuidance: `- Định nghĩa đạo hàm: $f'(x_0) = \\lim_{x \\to x_0} \\frac{f(x)-f(x_0)}{x-x_0}$
   - Quy tắc tích và thương: $(u \\cdot v)' = u'v + uv'$, $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$
   - Đạo hàm cấp hai & ý nghĩa vật lý: $y'' = f''(x)$, $v(t) = s'(t)$, $a(t) = s''(t)$
   - Hàm lượng giác, mũ, logarit: $\\sin x, \\cos x, \\tan x, \\cot x, e^x, a^x, \\ln x, \\log_a x$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Toán 11 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chính xác 100% mọi công thức đạo hàm cấp một, đạo hàm hàm hợp (lượng giác, mũ, logarit), đạo hàm cấp hai, tiếp tuyến và bài toán vận tốc – gia tốc; dùng LaTeX chuẩn trong $...$, escape đúng \\\\ trong JSON.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'dao_ham_11_bai_31',
        code: 'BÀI 31',
        title: 'Bài 31: Định nghĩa và ý nghĩa của đạo hàm',
        shortTitle: 'Bài 31: Định nghĩa đạo hàm',
        subtitle: 'Định nghĩa đạo hàm bằng giới hạn, ý nghĩa vật lý (vận tốc) và ý nghĩa hình học (tiếp tuyến)',
        topics: [
          'Tính đạo hàm của hàm số tại một điểm bằng định nghĩa giới hạn',
          'Ý nghĩa vật lý của đạo hàm: vận tốc tức thời v(t0) = s\'(t0), cường độ dòng điện tức thời I(t) = Q\'(t)',
          'Ý nghĩa hình học của đạo hàm: hệ số góc tiếp tuyến k = f\'(x0) và phương trình tiếp tuyến tại điểm M0(x0; y0)',
        ],
        realWorldTheme: 'Tính vận tốc tức thời của vật rơi tự do và độ dốc đường trượt tại một vị trí cụ thể',
      },
      {
        id: 'dao_ham_11_bai_32',
        code: 'BÀI 32',
        title: 'Bài 32: Các quy tắc tính đạo hàm',
        shortTitle: 'Bài 32: Quy tắc đạo hàm',
        subtitle: 'Đạo hàm tổng, hiệu, tích, thương, hàm hợp và các hàm lượng giác, mũ, logarit',
        topics: [
          'Đạo hàm hàm đa thức, hàm căn thức và quy tắc đạo hàm tích, thương',
          'Đạo hàm các hàm số lượng giác sin x, cos x, tan x, cot x và hàm hợp lượng giác',
          'Đạo hàm các hàm số mũ e^x, a^x và hàm số logarit ln x, log_a x (chương trình GDPT 2018 mới)',
          'Giải phương trình và bất phương trình f\'(x) = 0, f\'(x) > 0 và viết phương trình tiếp tuyến',
        ],
        realWorldTheme: 'Tốc độ tăng trưởng quần thể theo hàm mũ và tốc độ biến thiên cường độ âm theo hàm logarit',
      },
      {
        id: 'dao_ham_11_bai_33',
        code: 'BÀI 33',
        title: 'Bài 33: Đạo hàm cấp hai',
        shortTitle: 'Bài 33: Đạo hàm cấp hai',
        subtitle: 'Tính đạo hàm cấp hai y\'\' và ứng dụng tính gia tốc tức thời a(t) = s\'\'(t)',
        topics: [
          'Quy tắc tính đạo hàm cấp hai của hàm đa thức, phân thức, lượng giác, mũ và logarit',
          'Chứng minh đẳng thức/hệ thức liên hệ giữa y, y\' và y\'\'',
          'Ý nghĩa cơ học của đạo hàm cấp hai: tính gia tốc tức thời a(t) = s\'\'(t) của chuyển động thẳng và dao động điều hòa',
        ],
        realWorldTheme: 'Tính gia tốc phanh xe ô tô và gia tốc dao động điều hòa của con lắc lò xo',
      },
    ],
    'Toán 11'
  ),
  tnBlueprints: buildTnBlueprints(
    'dao_ham_11',
    [
      { titleSuffix: 'Chuyển động thẳng & Vận tốc – Gia tốc tức thời', theme: 'Ô tô tăng tốc, phanh gấp với phương trình tọa độ bậc ba s(t)' },
      { titleSuffix: 'Dao động điều hòa & Đạo hàm hàm lượng giác', theme: 'Li độ, vận tốc và gia tốc của con lắc dao động điều hòa x(t) = A cos(ωt + φ)' },
      { titleSuffix: 'Tiếp tuyến đồ thị & Thiết kế đường cong cầu trượt', theme: 'Xác định phương trình tiếp tuyến tại điểm uốn và độ dốc đường cong' },
      { titleSuffix: 'Tăng trưởng vi khuẩn hàm mũ & Tốc độ sinh trưởng', theme: 'Tính tốc độ tăng trưởng tức thời của quần thể vi khuẩn N(t) = N0 e^(kt)' },
      { titleSuffix: 'Đạo hàm hàm logarit & Mức cường độ âm thanh', theme: 'Biến thiên độ lớn động đất/cường độ âm theo hàm logarit' },
      { titleSuffix: 'Cường độ dòng điện tức thời & Đạo hàm điện lượng', theme: 'Tính cường độ dòng điện xoay chiều I(t) = Q\'(t) trong mạch vật lý' },
      { titleSuffix: 'Phóng tên lửa & Gia tốc tại thời điểm vận tốc cực đại', theme: 'Chuyển động thẳng đứng của vật ném lên và tên lửa mô hình' },
      { titleSuffix: 'Chi phí cận biên & Đạo hàm hàm phân thức', theme: 'Tốc độ biến thiên chi phí sản xuất theo sản lượng hàng hóa' },
      { titleSuffix: 'Tiếp tuyến song song/vuông góc & Bất phương trình f\'(x)', theme: 'Tìm tiếp điểm có hệ số góc cho trước và xét dấu đạo hàm' },
      { titleSuffix: 'Tổng hợp toàn chương IX & Ứng dụng liên môn Vật lý', theme: 'Mô hình hóa chuyển động cơ học, nhiệt học và điện học bằng đạo hàm' },
    ],
    G11_DERIV_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('dao_ham_11', [
    {
      subtitle: 'Đạo hàm hàm hợp lượng giác – mũ – logarit phức tạp',
      theme: 'Rút gọn biểu thức chứa đạo hàm hàm hợp bậc cao và chứng minh đẳng thức đạo hàm',
      topics: [...G11_DERIV_TOPICS, 'Đạo hàm hàm hợp nhiều lớp kết hợp lượng giác, căn thức, mũ và logarit'],
    },
    {
      subtitle: 'Tiếp tuyến đi qua một điểm nằm ngoài đồ thị',
      theme: 'Xác định số tiếp tuyến kẻ từ điểm A đến đường cong bậc ba/phân thức',
      topics: [...G11_DERIV_TOPICS, 'Bài toán tiếp tuyến đi qua một điểm và biện luận số tiếp tuyến theo tham số'],
    },
    {
      subtitle: 'Bất phương trình chứa đạo hàm & Tìm tham số m',
      theme: 'Tìm điều kiện tham số để f\'(x) >= 0 hoặc f\'(x) <= 0 trên R và trên khoảng',
      topics: [...G11_DERIV_TOPICS, 'Giải bất phương trình chứa đạo hàm và định tham số để đạo hàm không đổi dấu'],
    },
    {
      subtitle: 'Tiếp tuyến tạo với hai trục tọa độ tam giác có diện tích cho trước',
      theme: 'Bài toán hình học tiếp tuyến đường cong bậc nhất trên bậc nhất',
      topics: [...G11_DERIV_TOPICS, 'Ứng dụng tiếp tuyến tính diện tích tam giác và khoảng cách từ tâm đối xứng'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương IX (Chinh phục 9+)',
      theme: 'Tổng hợp đạo hàm hàm ẩn sơ cấp, tiếp tuyến chung và bài toán gia tốc cực trị',
      topics: [...G11_DERIV_TOPICS, 'Bài toán tổng hợp VDC đạo hàm cấp 1, cấp 2 và tiếp tuyến'],
    },
  ]),
};

// ============================================================================
// 8. TOÁN 10 - CHƯƠNG V: CÁC SỐ ĐẶC TRƯNG CỦA MẪU SỐ LIỆU KHÔNG GHÉP NHÓM (THỐNG KÊ)
// ============================================================================
const G10_STATS_TOPICS = [
  'Số gần đúng, sai số tuyệt đối Δ_a = |a ngang - a| <= d, sai số tương đối δ_a <= d / |a ngang| và quy tắc làm tròn số gần đúng',
  'Các số đặc trưng đo xu thế trung tâm: số trung bình x ngang, trung vị M_e, tứ phân vị Q1, Q2, Q3 và mốt M_o',
  'Các số đặc trưng đo độ phân tán: khoảng biến thiên R = x_max - x_min, khoảng tứ phân vị Δ_Q = Q3 - Q1',
  'Phương sai s^2 và độ lệch chuẩn s = √(s^2) của mẫu số liệu không ghép nhóm (kể cả dạng bảng tần số)',
  'Phát hiện giá trị bất thường (ngoại lệ) bằng quy tắc Q1 - 1,5Δ_Q và Q3 + 1,5Δ_Q; so sánh độ ổn định của hai mẫu số liệu',
];

const grade10StatsDef: OnlineChapterDefinition = {
  key: 'grade10-stats',
  grade: 10,
  backTab: 'grade10-hub',
  scoresStorageKey: 'edubot_g10_stats_scores_v1',
  backLabel: 'Quay lại Lớp 10',
  gradeTag: 'Toán 10 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương V · Thống kê 10',
  heading: 'Các số đặc trưng của mẫu số liệu không ghép nhóm (Toán 10)',
  headerTitle: 'Toán 10 (KNTT) - Chương V: Thống kê mẫu số liệu không ghép nhóm (18 Bộ đề Online)',
  sidebarLabel: 'Thống kê không ghép nhóm (Toán 10)',
  sidebarMeta: '3 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương V Toán 10 gồm 3 đề luyện tập theo từng bài (Bài 12 – Bài 14, 45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) tích hợp bảng số liệu điểm thi, năng suất, nhiệt độ và đo lường kỹ thuật.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 12, Bài 13 và Bài 14',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 3 bài & tích hợp bảng số liệu điểm thi, năng suất, nhiệt độ, đo lường kỹ thuật',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (tìm tham số từ trung bình/phương sai, phát hiện giá trị ngoại lệ, so sánh hai mẫu)',
  subjectCourseName: 'Toán 10 - Chương V: Các số đặc trưng của mẫu số liệu không ghép nhóm',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán phân tích bảng số liệu thực tế (điểm kiểm tra hai tổ học sinh, năng suất lúa các thửa ruộng, nhiệt độ các ngày trong tháng hoặc sai số đo kích thước chi tiết máy).',
  part3AnswerGuidance:
    'Đáp án phần III là số trung bình, trung vị, tứ phân vị, khoảng tứ phân vị, phương sai, độ lệch chuẩn (làm tròn đến hàng phần chục hoặc hàng phần trăm, tối đa 4 ký tự như "7.25", "1.42", "15") hoặc số giá trị ngoại lệ.',
  latexGuidance: `- Số gần đúng và sai số: $\\overline{a}$, $\\Delta_a = |\\overline{a} - a| \\le d$, $\\delta_a \\le \\frac{d}{|\\overline{a}|}$
   - Xu thế trung tâm: $\\overline{x}$, $M_e$, $Q_1, Q_2, Q_3$, $M_o$
   - Độ phân tán: $R = x_{\\max} - x_{\\min}$, $\\Delta_Q = Q_3 - Q_1$, $s^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\overline{x})^2$, $s = \\sqrt{s^2}$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Toán 10 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Kiểm tra chính xác 100% mọi phép tính trung bình, trung vị, tứ phân vị Q1/Q2/Q3 (đúng quy ước SGK Kết nối tri thức), phương sai s^2 (chia cho n) và độ lệch chuẩn s; dùng LaTeX chuẩn trong $...$ (\\overline{x}, M_e, \\Delta_Q, s^2), escape đúng \\\\ trong JSON.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'thong_ke_10_bai_12',
        code: 'BÀI 12',
        title: 'Bài 12: Số gần đúng và sai số',
        shortTitle: 'Bài 12: Số gần đúng & sai số',
        subtitle: 'Số gần đúng, sai số tuyệt đối, sai số tương đối, độ chính xác d và quy tắc làm tròn',
        topics: [
          'Phân biệt số đúng và số gần đúng trong thực tế đo đạc',
          'Đánh giá sai số tuyệt đối Δ_a = |a ngang - a| <= d và viết chuẩn a = a ngang ± d',
          'Tính ước lượng sai số tương đối δ_a <= d / |a ngang| để so sánh chất lượng hai phép đo',
          'Quy tắc quy tròn số gần đúng theo độ chính xác d cho trước (hàng liền trước hàng của d)',
        ],
        realWorldTheme: 'So sánh độ chính xác phép đo chiều cao tòa nhà, cân khối lượng và đo đường kính chi tiết cơ khí',
      },
      {
        id: 'thong_ke_10_bai_13',
        code: 'BÀI 13',
        title: 'Bài 13: Các số đặc trưng đo xu thế trung tâm',
        shortTitle: 'Bài 13: Xu thế trung tâm',
        subtitle: 'Số trung bình, trung vị, tứ phân vị Q1, Q2, Q3 và mốt của mẫu số liệu',
        topics: [
          'Tính số trung bình x ngang từ mẫu liệt kê và từ bảng phân bố tần số',
          'Sắp xếp mẫu không giảm để tìm trung vị M_e và tứ phân vị Q1, Q2, Q3 đúng quy ước KNTT',
          'Xác định mốt M_o và lựa chọn số đặc trưng đại diện phù hợp khi mẫu có giá trị bất thường',
        ],
        realWorldTheme: 'Phân tích bảng điểm kiểm tra Toán, cỡ giày bán chạy nhất và thu nhập nhân viên công ty',
      },
      {
        id: 'thong_ke_10_bai_14',
        code: 'BÀI 14',
        title: 'Bài 14: Các số đặc trưng đo độ phân tán',
        shortTitle: 'Bài 14: Độ phân tán',
        subtitle: 'Khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn và giá trị ngoại lệ',
        topics: [
          'Tính khoảng biến thiên R = x_max - x_min và khoảng tứ phân vị Δ_Q = Q3 - Q1',
          'Tính phương sai s^2 và độ lệch chuẩn s (theo công thức chia cho n trong SGK KNTT)',
          'Phát hiện giá trị bất thường (ngoại lệ) nằm ngoài đoạn [Q1 - 1,5Δ_Q ; Q3 + 1,5Δ_Q]',
          'So sánh mức độ đồng đều/ổn định của hai mẫu số liệu dựa vào độ lệch chuẩn và khoảng tứ phân vị',
        ],
        realWorldTheme: 'So sánh phong độ ổn định của hai vận động viên bắn cung và biến động nhiệt độ hai thành phố',
      },
    ],
    'Toán 10'
  ),
  tnBlueprints: buildTnBlueprints(
    'thong_ke_10',
    [
      { titleSuffix: 'Điểm kiểm tra hai tổ học sinh & Độ đồng đều', theme: 'So sánh chất lượng học tập và độ ổn định điểm thi giữa Tổ 1 và Tổ 2' },
      { titleSuffix: 'Năng suất nông nghiệp & Tứ phân vị', theme: 'Thống kê năng suất lúa các thửa ruộng và tìm khoảng tứ phân vị' },
      { titleSuffix: 'Nhiệt độ & Lượng mưa các tháng trong năm', theme: 'Phân tích độ chênh lệch khí hậu và phát hiện tháng có lượng mưa bất thường' },
      { titleSuffix: 'Đo lường kỹ thuật & Sai số tương đối', theme: 'Đánh giá chất lượng phép đo kích thước linh kiện cơ khí chính xác' },
      { titleSuffix: 'Doanh thu cửa hàng & Giá trị ngoại lệ', theme: 'Phân tích doanh thu theo ngày và nhận diện ngày khuyến mãi bất thường' },
      { titleSuffix: 'Phong độ vận động viên điền kinh & Độ lệch chuẩn', theme: 'So sánh thành tích chạy 100m của hai vận động viên để chọn thi đấu' },
      { titleSuffix: 'Bảng tần số cỡ áo đồng phục & Mốt M_o', theme: 'Thống kê cỡ áo học sinh và xác định số đặc trưng phục vụ nhập hàng' },
      { titleSuffix: 'Thời gian tự học của học sinh THPT', theme: 'Tính trung bình, trung vị và độ lệch chuẩn thời gian học mỗi tuần' },
      { titleSuffix: 'Chỉ số chất lượng không khí AQI & Khoảng biến thiên', theme: 'Theo dõi chỉ số AQI trong 10 ngày và đánh giá mức độ biến động' },
      { titleSuffix: 'Tổng hợp Chương V & Phân tích dữ liệu thực tiễn', theme: 'So sánh hiệu suất hai dây chuyền đóng gói và kiểm soát sai số cân nặng' },
    ],
    G10_STATS_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('thong_ke_10', [
    {
      subtitle: 'Tìm tham số x trong mẫu số liệu khi biết trung bình/trung vị',
      theme: 'Khôi phục số liệu bị mờ trong bảng điểm khi biết số trung bình và trung vị',
      topics: [...G10_STATS_TOPICS, 'Tìm ẩn số trong mẫu số liệu thỏa mãn điều kiện về x ngang, M_e hoặc Q3'],
    },
    {
      subtitle: 'Tìm tham số khi biết phương sai s^2 hoặc độ lệch chuẩn s',
      theme: 'Xác định giá trị đo còn thiếu dựa vào công thức rút gọn phương sai',
      topics: [...G10_STATS_TOPICS, 'Vận dụng công thức s^2 = (1/n)Σx_i^2 - (x ngang)^2 tìm giá trị chưa biết'],
    },
    {
      subtitle: 'Phát hiện và đánh giá ảnh hưởng của giá trị ngoại lệ',
      theme: 'Phân tích sự thay đổi của trung bình, trung vị và độ lệch chuẩn khi loại bỏ ngoại lệ',
      topics: [...G10_STATS_TOPICS, 'Tìm điều kiện tham số để một giá trị trở thành giá trị ngoại lệ theo Δ_Q'],
    },
    {
      subtitle: 'Biến đổi tuyến tính mẫu số liệu y_i = a·x_i + b',
      theme: 'Đổi đơn vị đo từ độ C sang độ F hoặc cộng điểm thưởng đồng loạt cho cả lớp',
      topics: [...G10_STATS_TOPICS, 'Tính nhanh trung bình, phương sai và độ lệch chuẩn sau phép biến đổi tuyến tính mẫu'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Chương V Thống kê (Chinh phục 9+)',
      theme: 'Ghép hai mẫu số liệu thành mẫu tổng hợp và tính phương sai mẫu gộp',
      topics: [...G10_STATS_TOPICS, 'Tính số trung bình và phương sai của mẫu gộp từ hai nhóm độc lập'],
    },
  ]),
};

// ============================================================================
// 9. TOÁN 10 - CHƯƠNG VIII & IX: ĐẠI SỐ TỔ HỢP VÀ XÁC SUẤT CỔ ĐIỂN
// ============================================================================
const G10_COMBPROB_TOPICS = [
  'Quy tắc cộng, quy tắc nhân và sơ đồ hình cây giải các bài toán đếm phương án thực tế',
  'Hoán vị P_n = n!, chỉnh hợp A_n^k = n! / (n - k)! và tổ hợp C_n^k = n! / [k!(n - k)!], tính chất đối xứng & công thức Pascal',
  'Khai triển Nhị thức Newton (a + b)^n với n = 4, 5 (chuẩn SGK KNTT Toán 10) và tìm hệ số của x^k',
  'Không gian mẫu Ω, số phần tử n(Ω), biến cố A, biến cố đối A ngang và định nghĩa cổ điển của xác suất P(A) = n(A) / n(Ω)',
  'Thực hành tính xác suất cổ điển kết hợp quy tắc đếm, tổ hợp, chỉnh hợp và phương pháp biến cố đối',
];

const grade10CombProbDef: OnlineChapterDefinition = {
  key: 'grade10-combprob',
  grade: 10,
  backTab: 'grade10-hub',
  scoresStorageKey: 'edubot_g10_combprob_scores_v1',
  backLabel: 'Quay lại Lớp 10',
  gradeTag: 'Toán 10 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương VIII & IX · Tổ hợp & Xác suất 10',
  heading: 'Đại số tổ hợp và Xác suất cổ điển (Toán 10)',
  headerTitle: 'Toán 10 (KNTT) - Chương VIII & IX: Đại số tổ hợp và Xác suất cổ điển (20 Bộ đề Online)',
  sidebarLabel: 'Tổ hợp & Xác suất cổ điển (Toán 10)',
  sidebarMeta: '5 đề theo bài · 15 đề TN THPT 90p',
  description:
    'Hệ thống phòng thi Online Chương VIII & IX Toán 10 gồm 5 đề luyện tập theo bài (Bài 23 – Bài 27, 45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm) về quy tắc đếm, hoán vị – chỉnh hợp – tổ hợp, Nhị thức Newton và xác suất cổ điển.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 23 đến Bài 27',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 5 bài & tích hợp lập mật khẩu, xếp lịch, chọn đội hình, hình học tổ hợp và xác suất',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (đếm số có ràng buộc, chia nhóm, hệ số Newton và xác suất kết hợp biến cố đối)',
  subjectCourseName: 'Toán 10 - Chương VIII & IX: Đại số tổ hợp và Xác suất cổ điển',
  part2RealWorldInstruction:
    'Ít nhất 2 câu ở Phần II là bài toán thực tế về lập mã khóa/biển số xe, xếp lịch trực/chọn đội hình thi đấu, đếm hình tam giác/đường chéo đa giác hoặc tính xác suất rút thẻ/chọn ngẫu nhiên sản phẩm.',
  part3AnswerGuidance:
    'Đáp án phần III là số cách chọn/sắp xếp, hệ số trong khai triển Nhị thức Newton (số nguyên tối đa 4 chữ số) hoặc giá trị xác suất làm tròn đến hàng phần trăm/hàng phần nghìn (tối đa 4 ký tự như "0.35", "0.12", "120", "-80").',
  latexGuidance: `- Giai thừa, hoán vị, chỉnh hợp, tổ hợp: $n!$, $P_n = n!$, $A_n^k = \\frac{n!}{(n-k)!}$, $C_n^k = \\frac{n!}{k!(n-k)!}$
   - Nhị thức Newton: $(a+b)^4$, $(a+b)^5$
   - Không gian mẫu và xác suất cổ điển: $\\Omega$, $n(\\Omega)$, $\\overline{A}$, $P(A) = \\frac{n(A)}{n(\\Omega)}$, $P(\\overline{A}) = 1 - P(A)$ (TUYỆT ĐỐI dùng \\frac, escape đúng \\\\ trong JSON).`,
  systemInstruction:
    'Bạn là chuyên gia biên soạn đề thi Toán 10 (GDPT 2018 - SGK Kết nối tri thức với cuộc sống). Chú ý Nhị thức Newton Toán 10 KNTT chỉ khai triển bậc n = 4 và n = 5; kiểm tra chặt chẽ mọi phép đếm hoán vị, chỉnh hợp, tổ hợp và xác suất cổ điển; dùng LaTeX chuẩn trong $...$ (A_n^k, C_n^k, \\Omega, \\overline{A}, \\frac{n(A)}{n(\\Omega)}), escape đúng \\\\ trong JSON.',
  lessonBlueprints: buildLessonBlueprints(
    [
      {
        id: 'to_hop_xac_suat_10_bai_23',
        code: 'BÀI 23',
        title: 'Bài 23: Quy tắc đếm',
        shortTitle: 'Bài 23: Quy tắc đếm',
        subtitle: 'Quy tắc cộng, quy tắc nhân và sơ đồ hình cây trong các bài toán đếm cơ bản',
        topics: [
          'Phân biệt chính xác khi nào dùng quy tắc cộng (chia trường hợp) và quy tắc nhân (chia công đoạn)',
          'Lập mật khẩu, biển số xe, chọn trang phục, chọn lộ trình di chuyển bằng sơ đồ hình cây',
          'Đếm số tự nhiên có 3, 4 chữ số chẵn/lẻ hoặc chia hết cho 5 từ tập chữ số cho trước',
        ],
        realWorldTheme: 'Thiết lập mã PIN điện thoại, chọn thực đơn suất ăn và đếm tuyến đường đi giữa các thành phố',
      },
      {
        id: 'to_hop_xac_suat_10_bai_24',
        code: 'BÀI 24',
        title: 'Bài 24: Hoán vị, chỉnh hợp và tổ hợp',
        shortTitle: 'Bài 24: Hoán vị, chỉnh hợp, tổ hợp',
        subtitle: 'Phân biệt và vận dụng P_n, A_n^k, C_n^k trong bài toán xếp chỗ, chọn đội và hình học tổ hợp',
        topics: [
          'Hoán vị P_n = n! sắp xếp n phần tử khác nhau (xếp hàng ngang, xếp sách lên kệ)',
          'Chỉnh hợp A_n^k chọn có thứ tự (bầu ban cán sự lớp, trao huy chương Vàng–Bạc–Đồng)',
          'Tổ hợp C_n^k chọn không thứ tự (chọn tổ trực nhật, đếm đoạn thẳng, đường chéo, tam giác từ đỉnh đa giác)',
        ],
        realWorldTheme: 'Bầu ban cán sự lớp, xếp vị trí chụp ảnh kỷ yếu và chọn đội hình bóng chuyền',
      },
      {
        id: 'to_hop_xac_suat_10_bai_25',
        code: 'BÀI 25',
        title: 'Bài 25: Nhị thức Newton',
        shortTitle: 'Bài 25: Nhị thức Newton',
        subtitle: 'Khai triển (a + b)^n với n = 4, 5, tam giác Pascal và tìm hệ số của số hạng chứa x^k',
        topics: [
          'Công thức khai triển (a + b)^4 và (a + b)^5 sử dụng hệ số tổ hợp C_4^k, C_5^k và tam giác Pascal',
          'Tìm hệ số và số hạng chứa x^k trong khai triển dạng (px + q)^4, (px + q)^5, (x + a/x)^4',
          'Tính tổng các hệ số trong khai triển bằng cách chọn x = 1 hoặc x = -1',
        ],
        realWorldTheme: 'Tính nhanh giá trị gần đúng lãi kép (1 + r)^4, (1 + r)^5 và kiểm chứng tổng tổ hợp',
      },
      {
        id: 'to_hop_xac_suat_10_bai_26',
        code: 'BÀI 26',
        title: 'Bài 26: Biến cố và định nghĩa cổ điển của xác suất',
        shortTitle: 'Bài 26: Biến cố & XS cổ điển',
        subtitle: 'Phép thử ngẫu nhiên, không gian mẫu Ω, biến cố đối và công thức P(A) = n(A) / n(Ω)',
        topics: [
          'Xác định không gian mẫu Ω và số phần tử n(Ω) khi tung đồng xu, gieo xúc xắc, rút thẻ',
          'Xác định tập kết quả thuận lợi của biến cố A và biến cố đối A ngang',
          'Tính xác suất theo định nghĩa cổ điển P(A) = n(A) / n(Ω) và tính chất 0 <= P(A) <= 1',
        ],
        realWorldTheme: 'Gieo xúc xắc, quay vòng quay may mắn và rút thăm trúng thưởng câu lạc bộ',
      },
      {
        id: 'to_hop_xac_suat_10_bai_27',
        code: 'BÀI 27',
        title: 'Bài 27: Thực hành tính xác suất theo định nghĩa cổ điển',
        shortTitle: 'Bài 27: Thực hành tính XS',
        subtitle: 'Tính xác suất bằng tổ hợp – chỉnh hợp, sơ đồ hình cây và phương pháp biến cố đối',
        topics: [
          'Tính xác suất chọn nhóm học sinh, lấy bi nhiều màu bằng tổ hợp C_n^k',
          'Áp dụng biến cố đối P(A) = 1 - P(A ngang) cho bài toán "có ít nhất một..."',
          'Tính xác suất liên quan tới xếp vị trí ngẫu nhiên và chọn số tự nhiên chia hết cho 2, 3, 5',
        ],
        realWorldTheme: 'Chọn ngẫu nhiên đội văn nghệ đủ nam nữ, kiểm tra lô hàng và bốc thăm chia bảng đấu',
      },
    ],
    'Toán 10'
  ),
  tnBlueprints: buildTnBlueprints(
    'to_hop_xac_suat_10',
    [
      { titleSuffix: 'Lập mật khẩu an toàn & Xác suất chọn bi', theme: 'Đếm số mã khóa ký tự/chữ số và xác suất lấy bi khác màu' },
      { titleSuffix: 'Chọn đội hình thi đấu & Nhị thức bậc 4–5', theme: 'Chọn đội tuyển học sinh giỏi đủ khối và khai triển (2x - 1)^5' },
      { titleSuffix: 'Hình học tổ hợp & Xác suất tạo tam giác', theme: 'Đếm tam giác/hình chữ nhật từ lưới điểm và tính xác suất chọn 3 điểm thẳng hàng' },
      { titleSuffix: 'Xếp lịch trực nhật & Biến cố đối', theme: 'Xếp lịch trực tuần và tính xác suất có ít nhất 1 bạn nữ được chọn' },
      { titleSuffix: 'Gieo hai con xúc xắc & Đếm số tự nhiên', theme: 'Xác suất tổng số chấm chia hết cho 3 và đếm số tự nhiên chẵn đôi một khác nhau' },
      { titleSuffix: 'Bốc thăm chia bảng đấu & Kiểm tra sản phẩm', theme: 'Bốc thăm chia đội bóng và tính xác suất lấy được chính phẩm' },
      { titleSuffix: 'Rút thẻ đánh số & Khai triển (x + 2/x)^4', theme: 'Tính xác suất tổng hai số trên thẻ là số chẵn và tìm số hạng không chứa x' },
      { titleSuffix: 'Xếp hàng chụp ảnh & Hoán vị có điều kiện', theme: 'Xếp học sinh đứng xen kẽ hoặc cạnh nhau và tính xác suất tương ứng' },
      { titleSuffix: 'Lập biển số xe & Lãi kép Nhị thức Newton', theme: 'Đếm biển số xe hợp lệ và ước lượng (1,02)^5 bằng Nhị thức Newton' },
      { titleSuffix: 'Tổng hợp Chương VIII & IX — Tư duy tổ hợp ứng dụng', theme: 'Chọn đề thi ngẫu nhiên, xếp chỗ ngồi hội trường và xác suất cổ điển' },
    ],
    G10_COMBPROB_TOPICS
  ),
  reviewBlueprints: buildReviewBlueprints('to_hop_xac_suat_10', [
    {
      subtitle: 'Đếm chữ số có điều kiện ràng buộc (chia hết cho 3, 5, có mặt chữ số)',
      theme: 'Xác suất chọn số tự nhiên chia hết cho 3 hoặc có hai chữ số chẵn không đứng cạnh nhau',
      topics: [...G10_COMBPROB_TOPICS, 'Đếm số tự nhiên nhiều chữ số có ràng buộc vị trí và tính chia hết'],
    },
    {
      subtitle: 'Xếp chỗ có điều kiện (đứng cạnh nhau, không đứng cạnh nhau)',
      theme: 'Kỹ thuật buộc khối và vách ngăn trong bài toán xếp ghế hội trường/bàn tròn',
      topics: [...G10_COMBPROB_TOPICS, 'Phương pháp buộc phần tử và tạo vách ngăn để tính xác suất xếp vị trí'],
    },
    {
      subtitle: 'Chia phần tử vào các nhóm & Bốc thăm chia bảng',
      theme: 'Xác suất hai đội mạnh nằm ở hai bảng đấu khác nhau khi chia bảng ngẫu nhiên',
      topics: [...G10_COMBPROB_TOPICS, 'Bài toán chia tập hợp thành các nhóm bằng nhau và khác nhau'],
    },
    {
      subtitle: 'Hệ số khai triển tích hai Nhị thức bậc 4–5 & Tổng tổ hợp',
      theme: 'Tìm hệ số x^k trong biểu thức dạng (1 + x)^4 + (2 - x)^5 hoặc (1 + 2x)(x - 1)^4',
      topics: [...G10_COMBPROB_TOPICS, 'Tìm hệ số trong tổ hợp tuyến tính và tích các khai triển bậc 4, 5'],
    },
    {
      subtitle: 'Tổng hợp Vận dụng cao Tổ hợp & Xác suất cổ điển (Chinh phục 9+)',
      theme: 'Đếm hình học trên đa giác đều nội tiếp đường tròn và xác suất chọn tam giác tù/vuông',
      topics: [...G10_COMBPROB_TOPICS, 'Hình học tổ hợp nâng cao trên đa giác đều và xác suất kết hợp biến cố đối'],
    },
  ]),
};

export const ONLINE_CHAPTERS_CATALOG: Record<OnlineChapterKey, OnlineChapterDefinition> = {
  'grade12-integrals': grade12IntegralsDef,
  'grade12-oxyz': grade12OxyzDef,
  'grade12-condprob': grade12CondProbDef,
  'grade11-limits': grade11LimitsDef,
  'grade11-perp': grade11PerpDef,
  'grade11-prob': grade11ProbDef,
  'grade11-deriv': grade11DerivDef,
  'grade10-stats': grade10StatsDef,
  'grade10-combprob': grade10CombProbDef,
};

export const ONLINE_CHAPTER_KEYS = Object.keys(ONLINE_CHAPTERS_CATALOG) as OnlineChapterKey[];

export function isOnlineChapterKey(value: unknown): value is OnlineChapterKey {
  return typeof value === 'string' && value in ONLINE_CHAPTERS_CATALOG;
}

export function getOnlineChapterDefinition(key: OnlineChapterKey): OnlineChapterDefinition {
  return ONLINE_CHAPTERS_CATALOG[key];
}

export function findOnlineBlueprintById(
  examId: string,
  chapterKey?: string
): { chapter: OnlineChapterDefinition; blueprint: SpaceVectorBlueprint } | undefined {
  if (chapterKey && isOnlineChapterKey(chapterKey)) {
    const ch = ONLINE_CHAPTERS_CATALOG[chapterKey];
    const all = [...ch.lessonBlueprints, ...ch.tnBlueprints, ...ch.reviewBlueprints];
    const found = all.find((b) => b.id === examId);
    if (found) return { chapter: ch, blueprint: found };
  }

  for (const key of ONLINE_CHAPTER_KEYS) {
    const ch = ONLINE_CHAPTERS_CATALOG[key];
    const all = [...ch.lessonBlueprints, ...ch.tnBlueprints, ...ch.reviewBlueprints];
    const found = all.find((b) => b.id === examId);
    if (found) return { chapter: ch, blueprint: found };
  }
  return undefined;
}

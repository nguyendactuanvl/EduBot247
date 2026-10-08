/**
 * Ngân hàng câu hỏi và chủ đề bài học chuẩn Sách giáo khoa "Kết nối tri thức với cuộc sống"
 * Bao gồm đầy đủ 3 cấp học: Tiểu học (Lớp 1-5), THCS (Lớp 6-9), THPT (Lớp 10-12 & Đề thi THPT)
 * Tuân thủ nghiêm ngặt 100% công thức LaTeX với dấu $...$ và $$...$$, dùng \frac thay cho \dfrac.
 */

export type EducationalTier = 'elementary' | 'middle' | 'high';
export type GradeId = 
  | 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5' 
  | 'grade-6' | 'grade-7' | 'grade-8' | 'grade-9' 
  | 'grade-10' | 'grade-11' | 'grade-12' | 'thpt-exam';

export type SubjectCategory = 'math' | 'literature' | 'science' | 'english';

export interface LessonTopic {
  id: string;
  tier: EducationalTier;
  gradeId: GradeId;
  gradeLabel: string;
  subject: SubjectCategory;
  subjectLabel: string;
  topicName: string;
  lessonName: string;
  keySummary: string; // Tóm tắt kiến thức trọng tâm SGK KNTT
  questionCount: number;
}

export interface PracticeQuestion {
  id: string;
  tier: EducationalTier;
  gradeId: GradeId;
  gradeLabel: string;
  subject: SubjectCategory;
  subjectLabel: string;
  topicId: string;
  topicName: string;
  lessonName: string;
  difficulty: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

// ==========================================
// DANH MỤC CÁC KHỐI LỚP & CẤP HỌC
// ==========================================
export const GRADE_TIERS = [
  {
    tier: 'elementary' as EducationalTier,
    label: 'Cấp 1 - Tiểu học',
    desc: 'Lớp 1 đến Lớp 5 (SGK Kết nối tri thức)',
    grades: [
      { id: 'grade-1' as GradeId, label: 'Lớp 1', icon: '🌱' },
      { id: 'grade-2' as GradeId, label: 'Lớp 2', icon: '🌿' },
      { id: 'grade-3' as GradeId, label: 'Lớp 3', icon: '🍀' },
      { id: 'grade-4' as GradeId, label: 'Lớp 4', icon: '🌸' },
      { id: 'grade-5' as GradeId, label: 'Lớp 5', icon: '⭐' },
    ]
  },
  {
    tier: 'middle' as EducationalTier,
    label: 'Cấp 2 - THCS',
    desc: 'Lớp 6 đến Lớp 9 (SGK Kết nối tri thức)',
    grades: [
      { id: 'grade-6' as GradeId, label: 'Lớp 6', icon: '📘' },
      { id: 'grade-7' as GradeId, label: 'Lớp 7', icon: '📙' },
      { id: 'grade-8' as GradeId, label: 'Lớp 8', icon: '📗' },
      { id: 'grade-9' as GradeId, label: 'Lớp 9', icon: '📕' },
    ]
  },
  {
    tier: 'high' as EducationalTier,
    label: 'Cấp 3 - THPT & Thi Tốt nghiệp',
    desc: 'Lớp 10 đến Lớp 12 & Luyện thi THPT Quốc gia',
    grades: [
      { id: 'grade-10' as GradeId, label: 'Lớp 10', icon: '🎯' },
      { id: 'grade-11' as GradeId, label: 'Lớp 11', icon: '🚀' },
      { id: 'grade-12' as GradeId, label: 'Lớp 12', icon: '🏆' },
      { id: 'thpt-exam' as GradeId, label: 'Đề thi THPT', icon: '🎓' },
    ]
  }
];

// ==========================================
// CÁC MÔN HỌC
// ==========================================
export const SUBJECT_OPTIONS = [
  { id: 'math' as SubjectCategory, label: 'Toán học', icon: '📐', color: 'blue' },
  { id: 'science' as SubjectCategory, label: 'Khoa học / KHTN / Lý - Hóa - Sinh', icon: '🔬', color: 'emerald' },
  { id: 'literature' as SubjectCategory, label: 'Tiếng Việt / Ngữ văn', icon: '📖', color: 'amber' },
  { id: 'english' as SubjectCategory, label: 'Tiếng Anh', icon: '🌍', color: 'purple' },
];

// ==========================================
// DANH SÁCH CHỦ ĐỀ BÀI HỌC THEO SGK KẾT NỐI TRI THỨC
// ==========================================
export const KNTT_LESSON_TOPICS: LessonTopic[] = [
  // --- TIỂU HỌC: LỚP 1 ---
  {
    id: 'topic-g1-math-1',
    tier: 'elementary',
    gradeId: 'grade-1',
    gradeLabel: 'Lớp 1',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Các số từ 0 đến 10 và so sánh số',
    lessonName: 'Bài 1: Làm quen với chữ số và so sánh',
    keySummary: 'Ghi nhớ thứ tự các số tự nhiên từ $0$ đến $10$: $0 < 1 < 2 < 3 < 4 < 5 < 6 < 7 < 8 < 9 < 10$. Dấu lớn hơn ($>$), dấu bé hơn ($<$), dấu bằng ($=$).',
    questionCount: 4
  },
  {
    id: 'topic-g1-math-2',
    tier: 'elementary',
    gradeId: 'grade-1',
    gradeLabel: 'Lớp 1',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Phép cộng và phép trừ trong phạm vi 10',
    lessonName: 'Bài 2: Bảng cộng trừ trong phạm vi 10',
    keySummary: 'Phép cộng là thêm vào ($+$), phép trừ là bớt đi ($-$). Số nào cộng với $0$ cũng bằng chính số đó: $a + 0 = a$.',
    questionCount: 4
  },

  // --- TIỂU HỌC: LỚP 2 ---
  {
    id: 'topic-g2-math-1',
    tier: 'elementary',
    gradeId: 'grade-2',
    gradeLabel: 'Lớp 2',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Phép cộng, trừ có nhớ trong phạm vi 100',
    lessonName: 'Bài 1: Phép cộng có nhớ dạng $28 + 5, 47 + 25$',
    keySummary: 'Cộng hàng đơn vị trước: nếu tổng lớn hơn hoặc bằng $10$ thì nhớ $1$ sang hàng chục. Phép trừ: nếu hàng đơn vị không trừ được thì mượn $1$ chục ở hàng chục.',
    questionCount: 4
  },
  {
    id: 'topic-g2-math-2',
    tier: 'elementary',
    gradeId: 'grade-2',
    gradeLabel: 'Lớp 2',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Phép nhân và phép chia với 2 và 5',
    lessonName: 'Bài 2: Bảng nhân 2, bảng nhân 5 và bảng chia',
    keySummary: 'Bảng nhân $2$: $2 \\times 1 = 2, 2 \\times 2 = 4, \\dots, 2 \\times 10 = 20$. Bảng nhân $5$: $5 \\times 1 = 5, 5 \\times 2 = 10, \\dots, 5 \\times 10 = 50$.',
    questionCount: 4
  },

  // --- TIỂU HỌC: LỚP 3 ---
  {
    id: 'topic-g3-math-1',
    tier: 'elementary',
    gradeId: 'grade-3',
    gradeLabel: 'Lớp 3',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Bảng nhân, bảng chia từ 6 đến 9',
    lessonName: 'Bài 1: Bảng nhân 6, 7, 8, 9 và phép chia tương ứng',
    keySummary: 'Ghi nhớ: $6 \\times 7 = 42, 7 \\times 8 = 56, 8 \\times 9 = 72, 9 \\times 9 = 81$. Mối quan hệ giữa nhân và chia: nếu $a \\times b = c$ thì $c : a = b$.',
    questionCount: 4
  },
  {
    id: 'topic-g3-math-2',
    tier: 'elementary',
    gradeId: 'grade-3',
    gradeLabel: 'Lớp 3',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Chu vi và diện tích hình chữ nhật, hình vuông',
    lessonName: 'Bài 2: Tính chu vi và diện tích cơ bản',
    keySummary: 'Chu vi hình vuông cạnh $a$: $P = 4 \\times a$. Chu vi hình chữ nhật chiều dài $a$, chiều rộng $b$: $P = (a + b) \\times 2$. Diện tích hình chữ nhật: $S = a \\times b$. Diện tích hình vuông: $S = a \\times a$.',
    questionCount: 4
  },

  // --- TIỂU HỌC: LỚP 4 ---
  {
    id: 'topic-g4-math-1',
    tier: 'elementary',
    gradeId: 'grade-4',
    gradeLabel: 'Lớp 4',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Khái niệm phân số và rút gọn phân số',
    lessonName: 'Bài 1: Phân số bằng nhau và tính chất cơ bản',
    keySummary: 'Phân số có dạng $\\frac{a}{b}$ với tử số $a$ và mẫu số $b \\neq 0$. Khi cùng nhân hoặc cùng chia cả tử số và mẫu số của phân số với một số tự nhiên khác $0$, ta được phân số mới bằng phân số đã cho.',
    questionCount: 4
  },
  {
    id: 'topic-g4-math-2',
    tier: 'elementary',
    gradeId: 'grade-4',
    gradeLabel: 'Lớp 4',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Các phép tính với phân số (Cộng, trừ, nhân, chia)',
    lessonName: 'Bài 2: Cộng, trừ khác mẫu số và nhân chia phân số',
    keySummary: 'Cộng phân số khác mẫu: Quy đồng mẫu số rồi cộng tử số: $\\frac{a}{b} + \\frac{c}{d} = \\frac{a \\times d + c \\times b}{b \\times d}$. Phép nhân: $\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$. Phép chia: $\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}$.',
    questionCount: 4
  },

  // --- TIỂU HỌC: LỚP 5 ---
  {
    id: 'topic-g5-math-1',
    tier: 'elementary',
    gradeId: 'grade-5',
    gradeLabel: 'Lớp 5',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Số thập phân và các phép tính số thập phân',
    lessonName: 'Bài 1: Cộng, trừ, nhân, chia số thập phân',
    keySummary: 'Muốn nhân một số thập phân với $10, 100, 1000, \\dots$ ta chỉ việc chuyển dấu phẩy sang bên phải lần lượt $1, 2, 3, \\dots$ chữ số. Muốn chia cho $10, 100, 1000$ ta chuyển dấu phẩy sang bên trái.',
    questionCount: 4
  },
  {
    id: 'topic-g5-math-2',
    tier: 'elementary',
    gradeId: 'grade-5',
    gradeLabel: 'Lớp 5',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Tỉ số phần trăm và toán chuyển động đều',
    lessonName: 'Bài 2: Công thức $s = v \\times t$ và tỉ số phần trăm',
    keySummary: 'Công thức chuyển động đều: Quãng đường $s = v \\times t$, vận tốc $v = \\frac{s}{t}$, thời gian $t = \\frac{s}{v}$. Tìm $p\\%$ của số $A$: lấy $A \\times \\frac{p}{100}$.',
    questionCount: 4
  },

  // --- THCS: LỚP 6 ---
  {
    id: 'topic-g6-math-1',
    tier: 'middle',
    gradeId: 'grade-6',
    gradeLabel: 'Lớp 6',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Tập hợp số tự nhiên và tính chất chia hết',
    lessonName: 'Bài 1: Tập hợp $\\mathbb{N}$, lũy thừa và ƯCLN - BCNN',
    keySummary: 'Lũy thừa: $a^m \\cdot a^n = a^{m+n}; a^m : a^n = a^{m-n} \\; (a \\neq 0, m \\ge n)$. Dấu hiệu chia hết cho $2, 3, 5, 9$. Tìm $\\text{ƯCLN}$ chọn thừa số nguyên tố chung với số mũ nhỏ nhất; tìm $\\text{BCNN}$ chọn thừa số nguyên tố chung và riêng với số mũ lớn nhất.',
    questionCount: 4
  },
  {
    id: 'topic-g6-math-2',
    tier: 'middle',
    gradeId: 'grade-6',
    gradeLabel: 'Lớp 6',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Tập hợp số nguyên $\\mathbb{Z}$ và quy tắc dấu',
    lessonName: 'Bài 2: Phép cộng, trừ, nhân, chia số nguyên',
    keySummary: 'Tập hợp $\\mathbb{Z} = \\{\\dots, -3, -2, -1, 0, 1, 2, 3, \\dots\\}$. Quy tắc dấu phép nhân: $(+) \\cdot (+) = (+); (-) \\cdot (-) = (+); (+) \\cdot (-) = (-)$. Quy tắc bỏ dấu ngoặc có dấu trừ đằng trước: đổi dấu mọi số hạng trong ngoặc.',
    questionCount: 4
  },

  // --- THCS: LỚP 7 ---
  {
    id: 'topic-g7-math-1',
    tier: 'middle',
    gradeId: 'grade-7',
    gradeLabel: 'Lớp 7',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Số hữu tỉ $\\mathbb{Q}$ và số thực $\\mathbb{R}$',
    lessonName: 'Bài 1: Các phép tính số hữu tỉ, căn bậc hai số học',
    keySummary: 'Số hữu tỉ là số viết được dưới dạng phân số $\\frac{a}{b}$ với $a, b \\in \\mathbb{Z}, b \\neq 0$. Căn bậc hai số học của số $a \\ge 0$ là số $x \\ge 0$ sao cho $x^2 = a$, kí hiệu $\\sqrt{a}$.',
    questionCount: 4
  },
  {
    id: 'topic-g7-math-2',
    tier: 'middle',
    gradeId: 'grade-7',
    gradeLabel: 'Lớp 7',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Góc, đường thẳng song song và tam giác bằng nhau',
    lessonName: 'Bài 2: Tiên đề Euclid và các trường hợp bằng nhau của tam giác',
    keySummary: 'Hai đường thẳng song song bị cắt bởi một cát tuyến thì các cặp góc so le trong bằng nhau, các cặp góc đồng vị bằng nhau. Ba trường hợp bằng nhau của tam giác: c-c-c (cạnh - cạnh - cạnh), c-g-c (cạnh - góc - cạnh), g-c-g (góc - cạnh - góc).',
    questionCount: 4
  },

  // --- THCS: LỚP 8 ---
  {
    id: 'topic-g8-math-1',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Đa thức và 7 Hằng đẳng thức đáng nhớ',
    lessonName: 'Bài 1: Bảy hằng đẳng thức và phân tích thành nhân tử',
    keySummary: '$$(a \\pm b)^2 = a^2 \\pm 2ab + b^2, \\quad a^2 - b^2 = (a - b)(a + b), \\quad (a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3, \\quad a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$$',
    questionCount: 4
  },
  {
    id: 'topic-g8-math-2',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Phân thức đại số và Định lí Thalès',
    lessonName: 'Bài 2: Tính chất phân thức và định lí Thalès trong tam giác',
    keySummary: 'Định lí Thalès: Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ: $\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}$.',
    questionCount: 4
  },

  // --- THCS: LỚP 9 ---
  {
    id: 'topic-g9-math-1',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Hệ hai phương trình bậc nhất hai ẩn và Căn thức',
    lessonName: 'Bài 1: Giải hệ phương trình và biến đổi căn bậc hai',
    keySummary: 'Hệ phương trình bậc nhất hai ẩn giải bằng phương pháp cộng đại số hoặc phương pháp thế. Căn thức bậc hai: $\\sqrt{A^2} = |A|$; $\\sqrt{A \\cdot B} = \\sqrt{A} \\cdot \\sqrt{B}$ ($A, B \\ge 0$).',
    questionCount: 4
  },
  {
    id: 'topic-g9-math-2',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Phương trình bậc hai một ẩn và Hệ thức lượng',
    lessonName: 'Bài 2: Công thức nghiệm $\\Delta$ và định lí Vi-ét',
    keySummary: 'Phương trình $ax^2 + bx + c = 0 \\; (a \\neq 0)$. Biệt thức $\\Delta = b^2 - 4ac$. Nếu $\\Delta > 0$, phương trình có hai nghiệm phân biệt $x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$. Định lí Vi-ét: $x_1 + x_2 = -\\frac{b}{a}, \\; x_1 x_2 = \\frac{c}{a}$.',
    questionCount: 4
  },

  // --- THPT: LỚP 10 ---
  {
    id: 'topic-g10-math-1',
    tier: 'high',
    gradeId: 'grade-10',
    gradeLabel: 'Lớp 10',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Mệnh đề, Tập hợp và Bất phương trình bậc nhất',
    lessonName: 'Bài 1: Phép toán tập hợp ($A \\cap B, A \\cup B, A \\setminus B$)',
    keySummary: 'Giao: $A \\cap B = \\{x \\mid x \\in A \\text{ và } x \\in B\\}$. Hợp: $A \\cup B = \\{x \\mid x \\in A \\text{ hoặc } x \\in B\\}$. Hiệu: $A \\setminus B = \\{x \\mid x \\in A \\text{ và } x \\notin B\\}$.',
    questionCount: 4
  },
  {
    id: 'topic-g10-math-2',
    tier: 'high',
    gradeId: 'grade-10',
    gradeLabel: 'Lớp 10',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Hệ thức lượng trong tam giác và Vectơ',
    lessonName: 'Bài 2: Định lí Côsin, Định lí Sin và tích vô hướng vectơ',
    keySummary: 'Định lí Côsin: $a^2 = b^2 + c^2 - 2bc\\cos A$. Định lí Sin: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$. Tích vô hướng: $\\vec{u} \\cdot \\vec{v} = |\\vec{u}| |\\vec{v}| \\cos(\\vec{u}, \\vec{v})$.',
    questionCount: 4
  },

  // --- THPT: LỚP 11 ---
  {
    id: 'topic-g11-math-1',
    tier: 'high',
    gradeId: 'grade-11',
    gradeLabel: 'Lớp 11',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Hàm số lượng giác và Phương trình lượng giác',
    lessonName: 'Bài 1: Phương trình $\\sin x = m, \\cos x = m, \\tan x = m, \\cot x = m$',
    keySummary: 'Công thức nghiệm: $\\sin x = \\sin \\alpha \\Leftrightarrow \\begin{bmatrix} x = \\alpha + k2\\pi \\\\ x = \\pi - \\alpha + k2\\pi \\end{bmatrix} \\; (k \\in \\mathbb{Z})$. Điều kiện có nghiệm của $\\sin x = m$ và $\\cos x = m$ là $-1 \\le m \\le 1$.',
    questionCount: 4
  },
  {
    id: 'topic-g11-math-2',
    tier: 'high',
    gradeId: 'grade-11',
    gradeLabel: 'Lớp 11',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Dãy số, Cấp số cộng, Cấp số nhân và Đạo hàm',
    lessonName: 'Bài 2: Công thức $u_n, S_n$ và đạo hàm hàm hợp',
    keySummary: 'Cấp số cộng: $u_n = u_1 + (n-1)d, \\; S_n = \\frac{n(u_1 + u_n)}{2}$. Cấp số nhân: $u_n = u_1 \\cdot q^{n-1}$. Đạo hàm hàm hợp: $(f(u))\' = u\' \\cdot f\'(u)$.',
    questionCount: 4
  },

  // --- THPT: LỚP 12 ---
  {
    id: 'topic-g12-math-1',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 1: Khảo sát hàm số & Tiệm cận xiên (SGK KNTT mới)',
    lessonName: 'Bài 1: Đơn điệu, cực trị và đường tiệm cận xiên $y = ax + b$',
    keySummary: 'Hàm số $y = f(x)$ đồng biến trên khoảng $K \\Leftrightarrow f\'(x) \\ge 0, \\forall x \\in K$. Tiệm cận xiên $y = ax + b$ với $a = \\lim_{x \\to \\pm\\infty} \\frac{f(x)}{x}, \\; b = \\lim_{x \\to \\pm\\infty} [f(x) - ax]$. Phân thức $y = \\frac{P(x)}{Q(x)} = mx + n + \\frac{r}{Q(x)} \\Rightarrow y = mx + n$.',
    questionCount: 5
  },
  {
    id: 'topic-g12-math-2',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 2: Vectơ và Hệ tọa độ Oxyz trong không gian',
    lessonName: 'Bài 2: Tọa độ vectơ, phương trình mặt phẳng và mặt cầu',
    keySummary: 'Mặt cầu tâm $I(a; b; c)$, bán kính $R$: $(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$. Mặt phẳng qua $M(x_0; y_0; z_0)$ có vectơ pháp tuyến $\\vec{n} = (A; B; C)$: $A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$.',
    questionCount: 5
  },
  {
    id: 'topic-g12-math-3',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicName: 'Chủ đề 3: Nguyên hàm, Tích phân và Ứng dụng hình học',
    lessonName: 'Bài 3: Phương pháp tính tích phân và diện tích hình phẳng',
    keySummary: 'Công thức Newton-Leibniz: $\\int_a^b f(x) \\, dx = F(b) - F(a)$. Diện tích hình phẳng giới hạn bởi đồ thị $y = f(x), y = g(x)$ và hai đường thẳng $x = a, x = b$: $S = \\int_a^b |f(x) - g(x)| \\, dx$.',
    questionCount: 5
  },

  // --- KHOA HỌC TỰ NHIÊN / VẬT LÍ / HÓA HỌC ---
  {
    id: 'topic-science-1',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'science',
    subjectLabel: 'KHTN (Lý - Hóa - Sinh)',
    topicName: 'Chủ đề: Phản ứng hóa học và Định luật bảo toàn khối lượng',
    lessonName: 'Bài: Mol, khối lượng mol và định luật bảo toàn khối lượng',
    keySummary: 'Trong một phản ứng hóa học, tổng khối lượng của các chất tham gia bằng tổng khối lượng của các sản phẩm tạo thành: $m_A + m_B = m_C + m_D$. Số mol: $n = \\frac{m}{M} = \\frac{V}{24{,}79}$ (ở điều kiện chuẩn $25^\\circ\\text{C}, 1\\text{ bar}$).',
    questionCount: 4
  },
  {
    id: 'topic-science-2',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'science',
    subjectLabel: 'KHTN (Lý - Hóa - Sinh)',
    topicName: 'Chủ đề: Dao động cơ học và Vật lý nhiệt (KNTT 12)',
    lessonName: 'Bài: Phương trình dao động điều hòa $x = A\\cos(\\omega t + \\varphi)$',
    keySummary: 'Phương trình dao động: $x = A\\cos(\\omega t + \\varphi)$. Vận tốc: $v = x\' = -\\omega A\\sin(\\omega t + \\varphi)$. Gia tốc: $a = v\' = -\\omega^2 x$. Chu kì $T = \\frac{2\\pi}{\\omega}$. Cơ năng bảo toàn: $W = \\frac{1}{2}m\\omega^2 A^2 = \\frac{1}{2}kA^2$.',
    questionCount: 4
  },

  // --- TIẾNG ANH ---
  {
    id: 'topic-english-1',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    topicName: 'Topic: English Tenses & Passive Voice (Global Success)',
    lessonName: 'Unit: Complex sentences and Reported Speech',
    keySummary: 'Thì Hiện tại hoàn thành: $S + \\text{have/has} + V_3/ed$. Câu bị động: $S + \\text{be} + V_3/ed + (\\text{by } O)$. Câu điều kiện loại 1: $\\text{If } S + V_{s/es}, S + \\text{will} + V_0$.',
    questionCount: 4
  },
  {
    id: 'topic-english-2',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    topicName: 'Topic: THPT Exam Preparation - Grammar & Vocabulary',
    lessonName: 'Unit: Inversion, Relative Clauses & Collocations',
    keySummary: 'Đảo ngữ với No sooner: $\\text{No sooner} + \\text{had} + S + V_3/ed + \\text{than} + S + V_2/ed$. Mệnh đề quan hệ rút gọn bằng $V\\text{-ing}$ (chủ động) và $V_3/ed$ (bị động).',
    questionCount: 4
  }
];

// ==========================================
// NGÂN HÀNG CÂU HỎI BÀI HỌC KẾT NỐI TRI THỨC
// ĐẦY ĐỦ CHO TIỂU HỌC, THCS, THPT
// ==========================================
export const KNTT_QUESTION_BANK: PracticeQuestion[] = [
  // =========================================================================
  // 1. TIỂU HỌC - LỚP 1
  // =========================================================================
  {
    id: 'q-g1-m-1',
    tier: 'elementary',
    gradeId: 'grade-1',
    gradeLabel: 'Lớp 1',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g1-math-1',
    topicName: 'Chủ đề 1: Các số từ 0 đến 10 và so sánh số',
    lessonName: 'Bài 1: Làm quen với chữ số và so sánh',
    difficulty: 'Nhận biết',
    content: 'Số thích hợp để điền vào dấu hỏi chấm trong dãy số sau là gì?\n$$3, 4, 5, ?, 7, 8$$',
    options: [
      { id: 'A', text: '$6$' },
      { id: 'B', text: '$2$' },
      { id: 'C', text: '$9$' },
      { id: 'D', text: '$5$' }
    ],
    correctOptionId: 'A',
    explanation: 'Dãy số đếm tiến theo thứ tự từ $0$ đến $10$. Liền sau số $5$ là số $6$, liền trước số $7$ là số $6$. Vậy số cần điền là $6$.'
  },
  {
    id: 'q-g1-m-2',
    tier: 'elementary',
    gradeId: 'grade-1',
    gradeLabel: 'Lớp 1',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g1-math-1',
    topicName: 'Chủ đề 1: Các số từ 0 đến 10 và so sánh số',
    lessonName: 'Bài 1: Làm quen với chữ số và so sánh',
    difficulty: 'Thông hiểu',
    content: 'Dấu thích hợp để điền vào chỗ chấm trong phép so sánh $7 \\dots 9$ là:',
    options: [
      { id: 'A', text: '$<$' },
      { id: 'B', text: '$>$' },
      { id: 'C', text: '$=$' },
      { id: 'D', text: '$+$' }
    ],
    correctOptionId: 'A',
    explanation: 'Trên trục số từ $0$ đến $10$, số $7$ đứng trước số $9$, nên $7$ bé hơn $9$. Kí hiệu toán học là: $7 < 9$.'
  },
  {
    id: 'q-g1-m-3',
    tier: 'elementary',
    gradeId: 'grade-1',
    gradeLabel: 'Lớp 1',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g1-math-2',
    topicName: 'Chủ đề 2: Phép cộng và phép trừ trong phạm vi 10',
    lessonName: 'Bài 2: Bảng cộng trừ trong phạm vi 10',
    difficulty: 'Nhận biết',
    content: 'Kết quả của phép tính $4 + 5 = ?$ là:',
    options: [
      { id: 'A', text: '$8$' },
      { id: 'B', text: '$9$' },
      { id: 'C', text: '$10$' },
      { id: 'D', text: '$7$' }
    ],
    correctOptionId: 'B',
    explanation: 'Ta đếm thêm $5$ đơn vị từ $4$: $4 + 5 = 9$. Kết quả chính xác là $9$.'
  },
  {
    id: 'q-g1-m-4',
    tier: 'elementary',
    gradeId: 'grade-1',
    gradeLabel: 'Lớp 1',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g1-math-2',
    topicName: 'Chủ đề 2: Phép cộng và phép trừ trong phạm vi 10',
    lessonName: 'Bài 2: Bảng cộng trừ trong phạm vi 10',
    difficulty: 'Vận dụng',
    content: 'Bạn An có $8$ viên bi, An cho bạn Bình $3$ viên bi. Hỏi An còn lại bao nhiêu viên bi?',
    options: [
      { id: 'A', text: '$5$ viên bi' },
      { id: 'B', text: '$4$ viên bi' },
      { id: 'C', text: '$11$ viên bi' },
      { id: 'D', text: '$6$ viên bi' }
    ],
    correctOptionId: 'A',
    explanation: 'Số viên bi còn lại của An là hiệu của số ban đầu trừ số đã cho: $8 - 3 = 5$ (viên bi).'
  },

  // =========================================================================
  // 2. TIỂU HỌC - LỚP 2
  // =========================================================================
  {
    id: 'q-g2-m-1',
    tier: 'elementary',
    gradeId: 'grade-2',
    gradeLabel: 'Lớp 2',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g2-math-1',
    topicName: 'Chủ đề 1: Phép cộng, trừ có nhớ trong phạm vi 100',
    lessonName: 'Bài 1: Phép cộng có nhớ dạng $28 + 5, 47 + 25$',
    difficulty: 'Thông hiểu',
    content: 'Tính giá trị của phép tính: $38 + 27 = ?$',
    options: [
      { id: 'A', text: '$65$' },
      { id: 'B', text: '$55$' },
      { id: 'C', text: '$64$' },
      { id: 'D', text: '$75$' }
    ],
    correctOptionId: 'A',
    explanation: 'Thực hiện cộng từ hàng đơn vị sang hàng chục:\n- Hàng đơn vị: $8 + 7 = 15$, viết $5$ nhớ $1$.\n- Hàng chục: $3 + 2 = 5$, thêm $1$ bằng $6$, viết $6$.\nVậy $38 + 27 = 65$.'
  },
  {
    id: 'q-g2-m-2',
    tier: 'elementary',
    gradeId: 'grade-2',
    gradeLabel: 'Lớp 2',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g2-math-1',
    topicName: 'Chủ đề 1: Phép cộng, trừ có nhớ trong phạm vi 100',
    lessonName: 'Bài 1: Phép cộng có nhớ dạng $28 + 5, 47 + 25$',
    difficulty: 'Vận dụng',
    content: 'Tìm $x$ biết: $x - 19 = 45$.',
    options: [
      { id: 'A', text: '$x = 64$' },
      { id: 'B', text: '$x = 26$' },
      { id: 'C', text: '$x = 54$' },
      { id: 'D', text: '$x = 63$' }
    ],
    correctOptionId: 'A',
    explanation: 'Muốn tìm số bị trừ, ta lấy hiệu cộng với số trừ:\n$$x = 45 + 19 = 64$$'
  },
  {
    id: 'q-g2-m-3',
    tier: 'elementary',
    gradeId: 'grade-2',
    gradeLabel: 'Lớp 2',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g2-math-2',
    topicName: 'Chủ đề 2: Phép nhân và phép chia với 2 và 5',
    lessonName: 'Bài 2: Bảng nhân 2, bảng nhân 5 và bảng chia',
    difficulty: 'Nhận biết',
    content: 'Trong bảng nhân $5$, phép tính $5 \\times 7$ cho kết quả bằng:',
    options: [
      { id: 'A', text: '$35$' },
      { id: 'B', text: '$30$' },
      { id: 'C', text: '$40$' },
      { id: 'D', text: '$25$' }
    ],
    correctOptionId: 'A',
    explanation: 'Theo bảng nhân $5$, ta có $5 \\times 7 = 35$.'
  },
  {
    id: 'q-g2-m-4',
    tier: 'elementary',
    gradeId: 'grade-2',
    gradeLabel: 'Lớp 2',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g2-math-2',
    topicName: 'Chủ đề 2: Phép nhân và phép chia với 2 và 5',
    lessonName: 'Bài 2: Bảng nhân 2, bảng nhân 5 và bảng chia',
    difficulty: 'Vận dụng',
    content: 'Có $18$ quả táo chia đều vào $2$ rổ. Hỏi mỗi rổ có bao nhiêu quả táo?',
    options: [
      { id: 'A', text: '$9$ quả' },
      { id: 'B', text: '$8$ quả' },
      { id: 'C', text: '$7$ quả' },
      { id: 'D', text: '$10$ quả' }
    ],
    correctOptionId: 'A',
    explanation: 'Số quả táo trong mỗi rổ là kết quả của phép chia: $18 : 2 = 9$ (quả).'
  },

  // =========================================================================
  // 3. TIỂU HỌC - LỚP 3
  // =========================================================================
  {
    id: 'q-g3-m-1',
    tier: 'elementary',
    gradeId: 'grade-3',
    gradeLabel: 'Lớp 3',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g3-math-1',
    topicName: 'Chủ đề 1: Bảng nhân, bảng chia từ 6 đến 9',
    lessonName: 'Bài 1: Bảng nhân 6, 7, 8, 9 và phép chia tương ứng',
    difficulty: 'Nhận biết',
    content: 'Giá trị của biểu thức $8 \\times 9 - 15$ là:',
    options: [
      { id: 'A', text: '$57$' },
      { id: 'B', text: '$72$' },
      { id: 'C', text: '$67$' },
      { id: 'D', text: '$62$' }
    ],
    correctOptionId: 'A',
    explanation: 'Thực hiện nhân chia trước, cộng trừ sau:\n$$8 \\times 9 - 15 = 72 - 15 = 57$$'
  },
  {
    id: 'q-g3-m-2',
    tier: 'elementary',
    gradeId: 'grade-3',
    gradeLabel: 'Lớp 3',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g3-math-2',
    topicName: 'Chủ đề 2: Chu vi và diện tích hình chữ nhật, hình vuông',
    lessonName: 'Bài 2: Tính chu vi và diện tích cơ bản',
    difficulty: 'Thông hiểu',
    content: 'Một hình chữ nhật có chiều dài là $8\\text{ cm}$ và chiều rộng là $5\\text{ cm}$. Chu vi của hình chữ nhật đó là:',
    options: [
      { id: 'A', text: '$26\\text{ cm}$' },
      { id: 'B', text: '$40\\text{ cm}$' },
      { id: 'C', text: '$13\\text{ cm}$' },
      { id: 'D', text: '$28\\text{ cm}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Chu vi hình chữ nhật bằng chiều dài cộng chiều rộng rồi nhân $2$:\n$$P = (8 + 5) \\times 2 = 13 \\times 2 = 26\\text{ cm}$$'
  },
  {
    id: 'q-g3-m-3',
    tier: 'elementary',
    gradeId: 'grade-3',
    gradeLabel: 'Lớp 3',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g3-math-2',
    topicName: 'Chủ đề 2: Chu vi và diện tích hình chữ nhật, hình vuông',
    lessonName: 'Bài 2: Tính chu vi và diện tích cơ bản',
    difficulty: 'Vận dụng',
    content: 'Một mảnh đất hình vuông có cạnh dài $6\\text{ m}$. Diện tích của mảnh đất đó bằng bao nhiêu?',
    options: [
      { id: 'A', text: '$36\\text{ m}^2$' },
      { id: 'B', text: '$24\\text{ m}^2$' },
      { id: 'C', text: '$12\\text{ m}^2$' },
      { id: 'D', text: '$30\\text{ m}^2$' }
    ],
    correctOptionId: 'A',
    explanation: 'Diện tích hình vuông bằng độ dài cạnh nhân với chính nó:\n$$S = 6 \\times 6 = 36\\text{ m}^2$$'
  },
  {
    id: 'q-g3-m-4',
    tier: 'elementary',
    gradeId: 'grade-3',
    gradeLabel: 'Lớp 3',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g3-math-1',
    topicName: 'Chủ đề 1: Bảng nhân, bảng chia từ 6 đến 9',
    lessonName: 'Bài 1: Bảng nhân 6, 7, 8, 9 và phép chia tương ứng',
    difficulty: 'Vận dụng',
    content: 'Một cửa hàng có $54\\text{ kg}$ gạo chia đều vào $6$ bao. Hỏi $4$ bao gạo như vậy có tất cả bao nhiêu ki-lô-gam gạo?',
    options: [
      { id: 'A', text: '$36\\text{ kg}$' },
      { id: 'B', text: '$32\\text{ kg}$' },
      { id: 'C', text: '$40\\text{ kg}$' },
      { id: 'D', text: '$45\\text{ kg}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Bước 1: Một bao gạo chứa số ki-lô-gam là: $54 : 6 = 9\\text{ kg}$.\nBước 2: Bốn bao gạo chứa: $9 \\times 4 = 36\\text{ kg}$.'
  },

  // =========================================================================
  // 4. TIỂU HỌC - LỚP 4
  // =========================================================================
  {
    id: 'q-g4-m-1',
    tier: 'elementary',
    gradeId: 'grade-4',
    gradeLabel: 'Lớp 4',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g4-math-1',
    topicName: 'Chủ đề 1: Khái niệm phân số và rút gọn phân số',
    lessonName: 'Bài 1: Phân số bằng nhau và tính chất cơ bản',
    difficulty: 'Nhận biết',
    content: 'Rút gọn phân số $\\frac{18}{24}$ về phân số tối giản ta được kết quả là:',
    options: [
      { id: 'A', text: '$\\frac{3}{4}$' },
      { id: 'B', text: '$\\frac{9}{12}$' },
      { id: 'C', text: '$\\frac{2}{3}$' },
      { id: 'D', text: '$\\frac{6}{8}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Cùng chia cả tử số và mẫu số cho ước chung lớn nhất là $6$:\n$$\\frac{18 : 6}{24 : 6} = \\frac{3}{4}$$'
  },
  {
    id: 'q-g4-m-2',
    tier: 'elementary',
    gradeId: 'grade-4',
    gradeLabel: 'Lớp 4',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g4-math-2',
    topicName: 'Chủ đề 2: Các phép tính với phân số (Cộng, trừ, nhân, chia)',
    lessonName: 'Bài 2: Cộng, trừ khác mẫu số và nhân chia phân số',
    difficulty: 'Thông hiểu',
    content: 'Thực hiện phép tính cộng: $\\frac{2}{5} + \\frac{1}{3} = ?$',
    options: [
      { id: 'A', text: '$\\frac{11}{15}$' },
      { id: 'B', text: '$\\frac{3}{8}$' },
      { id: 'C', text: '$\\frac{7}{15}$' },
      { id: 'D', text: '$\\frac{2}{15}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Quy đồng mẫu số chung là $15$:\n$$\\frac{2}{5} = \\frac{6}{15}, \\quad \\frac{1}{3} = \\frac{5}{15} \\implies \\frac{6}{15} + \\frac{5}{15} = \\frac{11}{15}$$'
  },
  {
    id: 'q-g4-m-3',
    tier: 'elementary',
    gradeId: 'grade-4',
    gradeLabel: 'Lớp 4',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g4-math-2',
    topicName: 'Chủ đề 2: Các phép tính với phân số (Cộng, trừ, nhân, chia)',
    lessonName: 'Bài 2: Cộng, trừ khác mẫu số và nhân chia phân số',
    difficulty: 'Vận dụng',
    content: 'Tính giá trị của biểu thức: $\\frac{4}{7} \\times \\frac{14}{5} = ?$',
    options: [
      { id: 'A', text: '$\\frac{8}{5}$' },
      { id: 'B', text: '$\\frac{56}{35}$' },
      { id: 'C', text: '$\\frac{18}{12}$' },
      { id: 'D', text: '$\\frac{7}{5}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Nhân tử với tử, mẫu với mẫu và rút gọn:\n$$\\frac{4 \\times 14}{7 \\times 5} = \\frac{4 \\times (2 \\times 7)}{7 \\times 5} = \\frac{8}{5}$$'
  },
  {
    id: 'q-g4-m-4',
    tier: 'elementary',
    gradeId: 'grade-4',
    gradeLabel: 'Lớp 4',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g4-math-1',
    topicName: 'Chủ đề 1: Khái niệm phân số và rút gọn phân số',
    lessonName: 'Bài 1: Phân số bằng nhau và tính chất cơ bản',
    difficulty: 'Thông hiểu',
    content: 'Một hình bình hành có độ dài đáy là $12\\text{ cm}$ và chiều cao tương ứng là $7\\text{ cm}$. Diện tích của hình bình hành đó là:',
    options: [
      { id: 'A', text: '$84\\text{ cm}^2$' },
      { id: 'B', text: '$42\\text{ cm}^2$' },
      { id: 'C', text: '$38\\text{ cm}^2$' },
      { id: 'D', text: '$96\\text{ cm}^2$' }
    ],
    correctOptionId: 'A',
    explanation: 'Diện tích hình bình hành bằng độ dài đáy nhân với chiều cao:\n$$S = a \\times h = 12 \\times 7 = 84\\text{ cm}^2$$'
  },

  // =========================================================================
  // 5. TIỂU HỌC - LỚP 5
  // =========================================================================
  {
    id: 'q-g5-m-1',
    tier: 'elementary',
    gradeId: 'grade-5',
    gradeLabel: 'Lớp 5',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g5-math-1',
    topicName: 'Chủ đề 1: Số thập phân và các phép tính số thập phân',
    lessonName: 'Bài 1: Cộng, trừ, nhân, chia số thập phân',
    difficulty: 'Nhận biết',
    content: 'Khi nhân số thập phân $3{,}45$ với $100$, ta thu được kết quả bằng:',
    options: [
      { id: 'A', text: '$345$' },
      { id: 'B', text: '$34{,}5$' },
      { id: 'C', text: '$3450$' },
      { id: 'D', text: '$0{,}345$' }
    ],
    correctOptionId: 'A',
    explanation: 'Khi nhân một số thập phân với $100$, ta chuyển dấu phẩy sang bên phải $2$ chữ số: $3{,}45 \\times 100 = 345$.'
  },
  {
    id: 'q-g5-m-2',
    tier: 'elementary',
    gradeId: 'grade-5',
    gradeLabel: 'Lớp 5',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g5-math-1',
    topicName: 'Chủ đề 1: Số thập phân và các phép tính số thập phân',
    lessonName: 'Bài 1: Cộng, trừ, nhân, chia số thập phân',
    difficulty: 'Thông hiểu',
    content: 'Tính giá trị của phép tính: $15{,}6 : 4 = ?$',
    options: [
      { id: 'A', text: '$3{,}9$' },
      { id: 'B', text: '$3{,}8$' },
      { id: 'C', text: '$4{,}1$' },
      { id: 'D', text: '$3{,}6$' }
    ],
    correctOptionId: 'A',
    explanation: 'Thực hiện phép chia: $15 : 4 = 3$ dư $3$, hạ $6$ thành $36$, lấy $36 : 4 = 9$. Vậy $15{,}6 : 4 = 3{,}9$.'
  },
  {
    id: 'q-g5-m-3',
    tier: 'elementary',
    gradeId: 'grade-5',
    gradeLabel: 'Lớp 5',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g5-math-2',
    topicName: 'Chủ đề 2: Tỉ số phần trăm và toán chuyển động đều',
    lessonName: 'Bài 2: Công thức $s = v \\times t$ và tỉ số phần trăm',
    difficulty: 'Thông hiểu',
    content: 'Một hình tròn có bán kính $r = 5\\text{ cm}$. Chu vi của hình tròn đó là (lấy số $\\pi \\approx 3{,}14$):',
    options: [
      { id: 'A', text: '$31{,}4\\text{ cm}$' },
      { id: 'B', text: '$15{,}7\\text{ cm}$' },
      { id: 'C', text: '$78{,}5\\text{ cm}$' },
      { id: 'D', text: '$62{,}8\\text{ cm}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Chu vi hình tròn tính theo công thức:\n$$C = 2 \\times \\pi \\times r = 2 \\times 3{,}14 \\times 5 = 31{,}4\\text{ cm}$$'
  },
  {
    id: 'q-g5-m-4',
    tier: 'elementary',
    gradeId: 'grade-5',
    gradeLabel: 'Lớp 5',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g5-math-2',
    topicName: 'Chủ đề 2: Tỉ số phần trăm và toán chuyển động đều',
    lessonName: 'Bài 2: Công thức $s = v \\times t$ và tỉ số phần trăm',
    difficulty: 'Vận dụng',
    content: 'Một người đi xe máy với vận tốc $v = 42\\text{ km/h}$ trong khoảng thời gian $t = 2{,}5\\text{ giờ}$. Quãng đường $s$ người đó đi được là:',
    options: [
      { id: 'A', text: '$105\\text{ km}$' },
      { id: 'B', text: '$95\\text{ km}$' },
      { id: 'C', text: '$110\\text{ km}$' },
      { id: 'D', text: '$84\\text{ km}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Áp dụng công thức quãng đường $s = v \\times t$:\n$$s = 42 \\times 2{,}5 = 105\\text{ km}$$'
  },

  // =========================================================================
  // 6. THCS - LỚP 6
  // =========================================================================
  {
    id: 'q-g6-m-1',
    tier: 'middle',
    gradeId: 'grade-6',
    gradeLabel: 'Lớp 6',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g6-math-1',
    topicName: 'Chủ đề 1: Tập hợp số tự nhiên và tính chất chia hết',
    lessonName: 'Bài 1: Tập hợp $\\mathbb{N}$, lũy thừa và ƯCLN - BCNN',
    difficulty: 'Nhận biết',
    content: 'Cho tập hợp $M = \\{x \\in \\mathbb{N} \\mid 5 \\le x < 9\\}$. Khẳng định nào sau đây là đúng?',
    options: [
      { id: 'A', text: '$M = \\{5; 6; 7; 8\\}$' },
      { id: 'B', text: '$M = \\{5; 6; 7; 8; 9\\}$' },
      { id: 'C', text: '$M = \\{6; 7; 8\\}$' },
      { id: 'D', text: '$M = \\{6; 7; 8; 9\\}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Điều kiện $5 \\le x < 9$ với $x \\in \\mathbb{N}$ nghĩa là $x$ lấy các giá trị từ $5$ đến $8$. Do đó $M = \\{5; 6; 7; 8\\}$.'
  },
  {
    id: 'q-g6-m-2',
    tier: 'middle',
    gradeId: 'grade-6',
    gradeLabel: 'Lớp 6',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g6-math-1',
    topicName: 'Chủ đề 1: Tập hợp số tự nhiên và tính chất chia hết',
    lessonName: 'Bài 1: Tập hợp $\\mathbb{N}$, lũy thừa và ƯCLN - BCNN',
    difficulty: 'Thông hiểu',
    content: 'Ước chung lớn nhất $\\text{ƯCLN}(24, 36)$ bằng:',
    options: [
      { id: 'A', text: '$12$' },
      { id: 'B', text: '$6$' },
      { id: 'C', text: '$24$' },
      { id: 'D', text: '$72$' }
    ],
    correctOptionId: 'A',
    explanation: 'Phân tích ra thừa số nguyên tố: $24 = 2^3 \\cdot 3$ và $36 = 2^2 \\cdot 3^2$. Do đó $\\text{ƯCLN}(24, 36) = 2^2 \\cdot 3 = 12$.'
  },
  {
    id: 'q-g6-m-3',
    tier: 'middle',
    gradeId: 'grade-6',
    gradeLabel: 'Lớp 6',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g6-math-2',
    topicName: 'Chủ đề 2: Tập hợp số nguyên $\\mathbb{Z}$ và quy tắc dấu',
    lessonName: 'Bài 2: Phép cộng, trừ, nhân, chia số nguyên',
    difficulty: 'Thông hiểu',
    content: 'Tính giá trị của biểu thức: $(-15) + 28 - (-7) = ?$',
    options: [
      { id: 'A', text: '$20$' },
      { id: 'B', text: '$6$' },
      { id: 'C', text: '$36$' },
      { id: 'D', text: '$-20$' }
    ],
    correctOptionId: 'A',
    explanation: 'Áp dụng quy tắc bỏ dấu ngoặc: $(-15) + 28 - (-7) = -15 + 28 + 7 = 13 + 7 = 20$.'
  },
  {
    id: 'q-g6-m-4',
    tier: 'middle',
    gradeId: 'grade-6',
    gradeLabel: 'Lớp 6',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g6-math-2',
    topicName: 'Chủ đề 2: Tập hợp số nguyên $\\mathbb{Z}$ và quy tắc dấu',
    lessonName: 'Bài 2: Phép cộng, trừ, nhân, chia số nguyên',
    difficulty: 'Vận dụng',
    content: 'Tìm số nguyên $x$ biết: $3x - (-5) = 14$.',
    options: [
      { id: 'A', text: '$x = 3$' },
      { id: 'B', text: '$x = 5$' },
      { id: 'C', text: '$x = -3$' },
      { id: 'D', text: '$x = 6$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có $3x - (-5) = 14 \\Leftrightarrow 3x + 5 = 14 \\Leftrightarrow 3x = 14 - 5 = 9 \\Leftrightarrow x = 3$.'
  },

  // =========================================================================
  // 7. THCS - LỚP 7
  // =========================================================================
  {
    id: 'q-g7-m-1',
    tier: 'middle',
    gradeId: 'grade-7',
    gradeLabel: 'Lớp 7',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g7-math-1',
    topicName: 'Chủ đề 1: Số hữu tỉ $\\mathbb{Q}$ và số thực $\\mathbb{R}$',
    lessonName: 'Bài 1: Các phép tính số hữu tỉ, căn bậc hai số học',
    difficulty: 'Nhận biết',
    content: 'Căn bậc hai số học của số $49$ là:',
    options: [
      { id: 'A', text: '$7$' },
      { id: 'B', text: '$-7$' },
      { id: 'C', text: '$\\pm 7$' },
      { id: 'D', text: '$2401$' }
    ],
    correctOptionId: 'A',
    explanation: 'Căn bậc hai số học của một số không âm $a$ là số không âm $x$ sao cho $x^2 = a$. Vì $7 \\ge 0$ và $7^2 = 49$ nên $\\sqrt{49} = 7$.'
  },
  {
    id: 'q-g7-m-2',
    tier: 'middle',
    gradeId: 'grade-7',
    gradeLabel: 'Lớp 7',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g7-math-1',
    topicName: 'Chủ đề 1: Số hữu tỉ $\\mathbb{Q}$ và số thực $\\mathbb{R}$',
    lessonName: 'Bài 1: Các phép tính số hữu tỉ, căn bậc hai số học',
    difficulty: 'Thông hiểu',
    content: 'Tính giá trị của biểu thức: $\\left(\\frac{-1}{2}\\right)^3 + \\frac{5}{8} = ?$',
    options: [
      { id: 'A', text: '$\\frac{1}{2}$' },
      { id: 'B', text: '$\\frac{3}{4}$' },
      { id: 'C', text: '$\\frac{-3}{4}$' },
      { id: 'D', text: '$\\frac{1}{4}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có $\\left(\\frac{-1}{2}\\right)^3 = \\frac{-1}{8}$. Khi đó:\n$$\\frac{-1}{8} + \\frac{5}{8} = \\frac{4}{8} = \\frac{1}{2}$$'
  },
  {
    id: 'q-g7-m-3',
    tier: 'middle',
    gradeId: 'grade-7',
    gradeLabel: 'Lớp 7',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g7-math-2',
    topicName: 'Chủ đề 2: Góc, đường thẳng song song và tam giác bằng nhau',
    lessonName: 'Bài 2: Tiên đề Euclid và các trường hợp bằng nhau của tam giác',
    difficulty: 'Thông hiểu',
    content: 'Cho tam giác $ABC$ có $\\widehat{A} = 65^\\circ$ và $\\widehat{B} = 55^\\circ$. Số đo của góc $\\widehat{C}$ bằng:',
    options: [
      { id: 'A', text: '$60^\\circ$' },
      { id: 'B', text: '$70^\\circ$' },
      { id: 'C', text: '$50^\\circ$' },
      { id: 'D', text: '$80^\\circ$' }
    ],
    correctOptionId: 'A',
    explanation: 'Tổng ba góc trong một tam giác bằng $180^\\circ$:\n$$\\widehat{C} = 180^\\circ - (\\widehat{A} + \\widehat{B}) = 180^\\circ - (65^\\circ + 55^\\circ) = 180^\\circ - 120^\\circ = 60^\\circ$$'
  },
  {
    id: 'q-g7-m-4',
    tier: 'middle',
    gradeId: 'grade-7',
    gradeLabel: 'Lớp 7',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g7-math-2',
    topicName: 'Chủ đề 2: Góc, đường thẳng song song và tam giác bằng nhau',
    lessonName: 'Bài 2: Tiên đề Euclid và các trường hợp bằng nhau của tam giác',
    difficulty: 'Vận dụng',
    content: 'Nghiệm của đa thức một biến $P(x) = 3x - 12$ là:',
    options: [
      { id: 'A', text: '$x = 4$' },
      { id: 'B', text: '$x = -4$' },
      { id: 'C', text: '$x = 3$' },
      { id: 'D', text: '$x = 0$' }
    ],
    correctOptionId: 'A',
    explanation: 'Để tìm nghiệm, ta giải phương trình $P(x) = 0 \\Leftrightarrow 3x - 12 = 0 \\Leftrightarrow 3x = 12 \\Leftrightarrow x = 4$.'
  },

  // =========================================================================
  // 8. THCS - LỚP 8
  // =========================================================================
  {
    id: 'q-g8-m-1',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g8-math-1',
    topicName: 'Chủ đề 1: Đa thức và 7 Hằng đẳng thức đáng nhớ',
    lessonName: 'Bài 1: Bảy hằng đẳng thức và phân tích thành nhân tử',
    difficulty: 'Nhận biết',
    content: 'Khai triển hằng đẳng thức $(x - 3)^2$ ta được kết quả là:',
    options: [
      { id: 'A', text: '$x^2 - 6x + 9$' },
      { id: 'B', text: '$x^2 - 3x + 9$' },
      { id: 'C', text: '$x^2 + 6x + 9$' },
      { id: 'D', text: '$x^2 - 9$' }
    ],
    correctOptionId: 'A',
    explanation: 'Áp dụng hằng đẳng thức bình phương của một hiệu: $(a - b)^2 = a^2 - 2ab + b^2$ với $a = x, b = 3$ ta có:\n$$(x - 3)^2 = x^2 - 2 \\cdot x \\cdot 3 + 3^2 = x^2 - 6x + 9$$'
  },
  {
    id: 'q-g8-m-2',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g8-math-1',
    topicName: 'Chủ đề 1: Đa thức và 7 Hằng đẳng thức đáng nhớ',
    lessonName: 'Bài 1: Bảy hằng đẳng thức và phân tích thành nhân tử',
    difficulty: 'Thông hiểu',
    content: 'Phân tích đa thức $x^2 - 16$ thành nhân tử được kết quả là:',
    options: [
      { id: 'A', text: '$(x - 4)(x + 4)$' },
      { id: 'B', text: '$(x - 4)^2$' },
      { id: 'C', text: '$(x + 4)^2$' },
      { id: 'D', text: '$(x - 8)(x + 8)$' }
    ],
    correctOptionId: 'A',
    explanation: 'Áp dụng hằng đẳng thức hiệu hai bình phương $a^2 - b^2 = (a - b)(a + b)$ với $a = x, b = 4$:\n$$x^2 - 16 = x^2 - 4^2 = (x - 4)(x + 4)$$'
  },
  {
    id: 'q-g8-m-3',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g8-math-2',
    topicName: 'Chủ đề 2: Phân thức đại số và Định lí Thalès',
    lessonName: 'Bài 2: Tính chất phân thức và định lí Thalès trong tam giác',
    difficulty: 'Thông hiểu',
    content: 'Rút gọn phân thức đại số $\\frac{x^2 - 9}{x - 3}$ (với $x \\neq 3$) ta thu được:',
    options: [
      { id: 'A', text: '$x + 3$' },
      { id: 'B', text: '$x - 3$' },
      { id: 'C', text: '$\\frac{1}{x + 3}$' },
      { id: 'D', text: '$x + 9$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có tử số $x^2 - 9 = (x - 3)(x + 3)$. Chia cả tử và mẫu cho $(x - 3)$:\n$$\\frac{(x - 3)(x + 3)}{x - 3} = x + 3$$'
  },
  {
    id: 'q-g8-m-4',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g8-math-2',
    topicName: 'Chủ đề 2: Phân thức đại số và Định lí Thalès',
    lessonName: 'Bài 2: Tính chất phân thức và định lí Thalès trong tam giác',
    difficulty: 'Vận dụng',
    content: 'Cho tam giác $ABC$ có $MN \\parallel BC$ ($M \\in AB, N \\in AC$). Biết $AM = 4\\text{ cm}$, $MB = 2\\text{ cm}$, $AN = 6\\text{ cm}$. Độ dài đoạn thẳng $NC$ bằng:',
    options: [
      { id: 'A', text: '$3\\text{ cm}$' },
      { id: 'B', text: '$4\\text{ cm}$' },
      { id: 'C', text: '$2\\text{ cm}$' },
      { id: 'D', text: '$5\\text{ cm}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Theo định lí Thalès: $\\frac{AM}{MB} = \\frac{AN}{NC} \\Leftrightarrow \\frac{4}{2} = \\frac{6}{NC} \\Leftrightarrow 2 = \\frac{6}{NC} \\Leftrightarrow NC = 3\\text{ cm}$.'
  },

  // =========================================================================
  // 9. THCS - LỚP 9
  // =========================================================================
  {
    id: 'q-g9-m-1',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g9-math-1',
    topicName: 'Chủ đề 1: Hệ hai phương trình bậc nhất hai ẩn và Căn thức',
    lessonName: 'Bài 1: Giải hệ phương trình và biến đổi căn bậc hai',
    difficulty: 'Thông hiểu',
    content: 'Cặp số $(x; y)$ nào sau đây là nghiệm của hệ phương trình:\n$$\\begin{cases} x + y = 7 \\\\ x - y = 3 \\end{cases}$$',
    options: [
      { id: 'A', text: '$(5; 2)$' },
      { id: 'B', text: '$(4; 3)$' },
      { id: 'C', text: '$(6; 1)$' },
      { id: 'D', text: '$(2; 5)$' }
    ],
    correctOptionId: 'A',
    explanation: 'Cộng hai phương trình vế theo vế: $2x = 10 \\Leftrightarrow x = 5$. Thay vào phương trình đầu: $5 + y = 7 \\Leftrightarrow y = 2$. Vậy nghiệm là $(x; y) = (5; 2)$.'
  },
  {
    id: 'q-g9-m-2',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g9-math-2',
    topicName: 'Chủ đề 2: Phương trình bậc hai một ẩn và Hệ thức lượng',
    lessonName: 'Bài 2: Công thức nghiệm $\\Delta$ và định lí Vi-ét',
    difficulty: 'Thông hiểu',
    content: 'Phương trình bậc hai $x^2 - 5x + 6 = 0$ có tập nghiệm $S$ là:',
    options: [
      { id: 'A', text: '$S = \\{2; 3\\}$' },
      { id: 'B', text: '$S = \\{-2; -3\\}$' },
      { id: 'C', text: '$S = \\{1; 6\\}$' },
      { id: 'D', text: '$S = \\{-1; -6\\}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Tính biệt thức $\\Delta = (-5)^2 - 4 \\cdot 1 \\cdot 6 = 25 - 24 = 1 > 0$. Hai nghiệm là:\n$$x_1 = \\frac{5 + 1}{2} = 3, \\quad x_2 = \\frac{5 - 1}{2} = 2$$'
  },
  {
    id: 'q-g9-m-3',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g9-math-2',
    topicName: 'Chủ đề 2: Phương trình bậc hai một ẩn và Hệ thức lượng',
    lessonName: 'Bài 2: Công thức nghiệm $\\Delta$ và định lí Vi-ét',
    difficulty: 'Vận dụng',
    content: 'Cho tam giác $ABC$ vuông tại $A$ có cạnh góc vuông $AB = 3\\text{ cm}$, $AC = 4\\text{ cm}$. Giá trị của $\\sin B$ bằng:',
    options: [
      { id: 'A', text: '$\\frac{4}{5}$' },
      { id: 'B', text: '$\\frac{3}{5}$' },
      { id: 'C', text: '$\\frac{4}{3}$' },
      { id: 'D', text: '$\\frac{3}{4}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Theo định lí Pythagore: $BC = \\sqrt{AB^2 + AC^2} = \\sqrt{3^2 + 4^2} = 5\\text{ cm}$. Khi đó tỉ số lượng giác:\n$$\\sin B = \\frac{\\text{cạnh đối}}{\\text{cạnh huyền}} = \\frac{AC}{BC} = \\frac{4}{5}$$'
  },
  {
    id: 'q-g9-m-4',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g9-math-1',
    topicName: 'Chủ đề 1: Hệ hai phương trình bậc nhất hai ẩn và Căn thức',
    lessonName: 'Bài 1: Giải hệ phương trình và biến đổi căn bậc hai',
    difficulty: 'Thông hiểu',
    content: 'Rút gọn biểu thức $A = \\sqrt{18} - \\sqrt{8} + \\sqrt{2}$ ta được:',
    options: [
      { id: 'A', text: '$2\\sqrt{2}$' },
      { id: 'B', text: '$3\\sqrt{2}$' },
      { id: 'C', text: '$\\sqrt{2}$' },
      { id: 'D', text: '$4\\sqrt{2}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Biến đổi căn thức: $\\sqrt{18} = 3\\sqrt{2}, \\sqrt{8} = 2\\sqrt{2}$. Do đó:\n$$A = 3\\sqrt{2} - 2\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$$'
  },

  // =========================================================================
  // 10. THPT - LỚP 10
  // =========================================================================
  {
    id: 'q-g10-m-1',
    tier: 'high',
    gradeId: 'grade-10',
    gradeLabel: 'Lớp 10',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g10-math-1',
    topicName: 'Chủ đề 1: Mệnh đề, Tập hợp và Bất phương trình bậc nhất',
    lessonName: 'Bài 1: Phép toán tập hợp ($A \\cap B, A \\cup B, A \\setminus B$)',
    difficulty: 'Nhận biết',
    content: 'Cho hai tập hợp $A = \\{1; 2; 3; 4\\}$ và $B = \\{3; 4; 5; 6\\}$. Giao của hai tập hợp $A \\cap B$ là:',
    options: [
      { id: 'A', text: '$\\{3; 4\\}$' },
      { id: 'B', text: '$\\{1; 2; 3; 4; 5; 6\\}$' },
      { id: 'C', text: '$\\{1; 2\\}$' },
      { id: 'D', text: '$\\{5; 6\\}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Giao của hai tập hợp là tập hợp chứa các phần tử thuộc cả $A$ và $B$. Các phần tử chung là $3$ và $4$. Do đó $A \\cap B = \\{3; 4\\}$.'
  },
  {
    id: 'q-g10-m-2',
    tier: 'high',
    gradeId: 'grade-10',
    gradeLabel: 'Lớp 10',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g10-math-2',
    topicName: 'Chủ đề 2: Hệ thức lượng trong tam giác và Vectơ',
    lessonName: 'Bài 2: Định lí Côsin, Định lí Sin và tích vô hướng vectơ',
    difficulty: 'Thông hiểu',
    content: 'Cho tam giác $ABC$ có cạnh $b = 5$, $c = 8$ và góc $\\widehat{A} = 60^\\circ$. Độ dài cạnh $a$ bằng:',
    options: [
      { id: 'A', text: '$7$' },
      { id: 'B', text: '$\\sqrt{49}$' },
      { id: 'C', text: '$\\sqrt{89}$' },
      { id: 'D', text: '$9$' }
    ],
    correctOptionId: 'A',
    explanation: 'Theo định lí Côsin:\n$$a^2 = b^2 + c^2 - 2bc\\cos A = 5^2 + 8^2 - 2 \\cdot 5 \\cdot 8 \\cdot \\cos 60^\\circ = 25 + 64 - 80 \\cdot \\frac{1}{2} = 89 - 40 = 49 \\implies a = 7$$'
  },
  {
    id: 'q-g10-m-3',
    tier: 'high',
    gradeId: 'grade-10',
    gradeLabel: 'Lớp 10',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g10-math-1',
    topicName: 'Chủ đề 1: Mệnh đề, Tập hợp và Bất phương trình bậc nhất',
    lessonName: 'Bài 1: Phép toán tập hợp ($A \\cap B, A \\cup B, A \\setminus B$)',
    difficulty: 'Thông hiểu',
    content: 'Tọa độ đỉnh $I$ của Parabol $(P): y = x^2 - 4x + 3$ là:',
    options: [
      { id: 'A', text: '$I(2; -1)$' },
      { id: 'B', text: '$I(-2; 15)$' },
      { id: 'C', text: '$I(2; 1)$' },
      { id: 'D', text: '$I(-4; 3)$' }
    ],
    correctOptionId: 'A',
    explanation: 'Hoành độ đỉnh $x_I = -\\frac{b}{2a} = -\\frac{-4}{2 \\cdot 1} = 2$. Tung độ đỉnh $y_I = 2^2 - 4 \\cdot 2 + 3 = 4 - 8 + 3 = -1$. Tọa độ đỉnh là $I(2; -1)$.'
  },
  {
    id: 'q-g10-m-4',
    tier: 'high',
    gradeId: 'grade-10',
    gradeLabel: 'Lớp 10',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g10-math-2',
    topicName: 'Chủ đề 2: Hệ thức lượng trong tam giác và Vectơ',
    lessonName: 'Bài 2: Định lí Côsin, Định lí Sin và tích vô hướng vectơ',
    difficulty: 'Vận dụng',
    content: 'Trong mặt phẳng $Oxy$, cho hai vectơ $\\vec{u} = (2; 3)$ và $\\vec{v} = (-1; 4)$. Tích vô hướng $\\vec{u} \\cdot \\vec{v}$ bằng:',
    options: [
      { id: 'A', text: '$10$' },
      { id: 'B', text: '$14$' },
      { id: 'C', text: '$-14$' },
      { id: 'D', text: '$-10$' }
    ],
    correctOptionId: 'A',
    explanation: 'Tích vô hướng theo biểu thức tọa độ: $\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 = 2 \\cdot (-1) + 3 \\cdot 4 = -2 + 12 = 10$.'
  },

  // =========================================================================
  // 11. THPT - LỚP 11
  // =========================================================================
  {
    id: 'q-g11-m-1',
    tier: 'high',
    gradeId: 'grade-11',
    gradeLabel: 'Lớp 11',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g11-math-1',
    topicName: 'Chủ đề 1: Hàm số lượng giác và Phương trình lượng giác',
    lessonName: 'Bài 1: Phương trình $\\sin x = m, \\cos x = m, \\tan x = m, \\cot x = m$',
    difficulty: 'Nhận biết',
    content: 'Tập giá trị của hàm số $y = 3\\sin x - 2$ là:',
    options: [
      { id: 'A', text: '$[-5; 1]$' },
      { id: 'B', text: '$[-3; 3]$' },
      { id: 'C', text: '$[-1; 5]$' },
      { id: 'D', text: '$\\mathbb{R}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Vì $-1 \\le \\sin x \\le 1$ với mọi $x \\in \\mathbb{R}$, nhân $3$ ta có $-3 \\le 3\\sin x \\le 3$. Trừ đi $2$ ta được $-5 \\le 3\\sin x - 2 \\le 1$. Do đó tập giá trị là $[-5; 1]$.'
  },
  {
    id: 'q-g11-m-2',
    tier: 'high',
    gradeId: 'grade-11',
    gradeLabel: 'Lớp 11',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g11-math-1',
    topicName: 'Chủ đề 1: Hàm số lượng giác và Phương trình lượng giác',
    lessonName: 'Bài 1: Phương trình $\\sin x = m, \\cos x = m, \\tan x = m, \\cot x = m$',
    difficulty: 'Thông hiểu',
    content: 'Phương trình lượng giác $\\cos x = \\frac{1}{2}$ có tập nghiệm là:',
    options: [
      { id: 'A', text: '$x = \\pm \\frac{\\pi}{3} + k2\\pi \\; (k \\in \\mathbb{Z})$' },
      { id: 'B', text: '$x = \\pm \\frac{\\pi}{6} + k2\\pi \\; (k \\in \\mathbb{Z})$' },
      { id: 'C', text: '$x = \\frac{\\pi}{3} + k\\pi \\; (k \\in \\mathbb{Z})$' },
      { id: 'D', text: '$x = \\pm \\frac{2\\pi}{3} + k2\\pi \\; (k \\in \\mathbb{Z})$' }
    ],
    correctOptionId: 'A',
    explanation: 'Vì $\\cos\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}$, phương trình $\\cos x = \\cos\\left(\\frac{\\pi}{3}\\right)$ có nghiệm chuẩn là $x = \\pm \\frac{\\pi}{3} + k2\\pi \\; (k \\in \\mathbb{Z})$.'
  },
  {
    id: 'q-g11-m-3',
    tier: 'high',
    gradeId: 'grade-11',
    gradeLabel: 'Lớp 11',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g11-math-2',
    topicName: 'Chủ đề 2: Dãy số, Cấp số cộng, Cấp số nhân và Đạo hàm',
    lessonName: 'Bài 2: Công thức $u_n, S_n$ và đạo hàm hàm hợp',
    difficulty: 'Thông hiểu',
    content: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 3$ và công sai $d = 4$. Số hạng thứ năm $u_5$ bằng:',
    options: [
      { id: 'A', text: '$19$' },
      { id: 'B', text: '$23$' },
      { id: 'C', text: '$15$' },
      { id: 'D', text: '$16$' }
    ],
    correctOptionId: 'A',
    explanation: 'Áp dụng công thức số hạng tổng quát của cấp số cộng: $u_n = u_1 + (n - 1)d$. Với $n = 5$ ta có:\n$$u_5 = 3 + (5 - 1) \\cdot 4 = 3 + 16 = 19$$'
  },
  {
    id: 'q-g11-m-4',
    tier: 'high',
    gradeId: 'grade-11',
    gradeLabel: 'Lớp 11',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g11-math-2',
    topicName: 'Chủ đề 2: Dãy số, Cấp số cộng, Cấp số nhân và Đạo hàm',
    lessonName: 'Bài 2: Công thức $u_n, S_n$ và đạo hàm hàm hợp',
    difficulty: 'Vận dụng',
    content: 'Đạo hàm của hàm số $y = x^4 - 2x^2 + 5$ tại điểm $x = 2$ bằng:',
    options: [
      { id: 'A', text: '$24$' },
      { id: 'B', text: '$32$' },
      { id: 'C', text: '$16$' },
      { id: 'D', text: '$28$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có đạo hàm: $y\' = 4x^3 - 4x$. Thay $x = 2$ vào ta được: $y\'(2) = 4 \\cdot (2^3) - 4 \\cdot 2 = 32 - 8 = 24$.'
  },

  // =========================================================================
  // 12. THPT - LỚP 12 (SGK KẾT NỐI TRI THỨC MỚI)
  // =========================================================================
  {
    id: 'q-g12-m-1',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g12-math-1',
    topicName: 'Chủ đề 1: Khảo sát hàm số & Tiệm cận xiên (SGK KNTT mới)',
    lessonName: 'Bài 1: Đơn điệu, cực trị và đường tiệm cận xiên $y = ax + b$',
    difficulty: 'Thông hiểu',
    content: 'Đường tiệm cận xiên của đồ thị hàm số $y = \\frac{2x^2 - 3x + 5}{x - 1}$ có phương trình là:',
    options: [
      { id: 'A', text: '$y = 2x - 1$' },
      { id: 'B', text: '$y = 2x + 1$' },
      { id: 'C', text: '$y = 2x - 3$' },
      { id: 'D', text: '$y = x - 1$' }
    ],
    correctOptionId: 'A',
    explanation: 'Chia đa thức tử cho mẫu:\n$$y = \\frac{2x(x - 1) - (x - 1) + 4}{x - 1} = 2x - 1 + \\frac{4}{x - 1}$$\nVì $\\lim_{x \\to \\pm\\infty} \\frac{4}{x - 1} = 0$, nên đường thẳng $y = 2x - 1$ là tiệm cận xiên của đồ thị.'
  },
  {
    id: 'q-g12-m-2',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g12-math-1',
    topicName: 'Chủ đề 1: Khảo sát hàm số & Tiệm cận xiên (SGK KNTT mới)',
    lessonName: 'Bài 1: Đơn điệu, cực trị và đường tiệm cận xiên $y = ax + b$',
    difficulty: 'Nhận biết',
    content: 'Cho hàm số $y = \\frac{3x - 1}{x + 2}$. Đường tiệm cận ngang của đồ thị hàm số có phương trình là:',
    options: [
      { id: 'A', text: '$y = 3$' },
      { id: 'B', text: '$x = -2$' },
      { id: 'C', text: '$y = -2$' },
      { id: 'D', text: '$x = 3$' }
    ],
    correctOptionId: 'A',
    explanation: 'Ta có $\\lim_{x \\to \\pm\\infty} \\frac{3x - 1}{x + 2} = 3$, do đó đường tiệm cận ngang là $y = 3$. Tiệm cận đứng là $x = -2$.'
  },
  {
    id: 'q-g12-m-3',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g12-math-2',
    topicName: 'Chủ đề 2: Vectơ và Hệ tọa độ Oxyz trong không gian',
    lessonName: 'Bài 2: Tọa độ vectơ, phương trình mặt phẳng và mặt cầu',
    difficulty: 'Nhận biết',
    content: 'Trong không gian $Oxyz$, mặt cầu $(S): (x - 2)^2 + (y + 1)^2 + (z - 4)^2 = 25$ có tọa độ tâm $I$ và bán kính $R$ là:',
    options: [
      { id: 'A', text: '$I(2; -1; 4)$ và $R = 5$' },
      { id: 'B', text: '$I(-2; 1; -4)$ và $R = 5$' },
      { id: 'C', text: '$I(2; -1; 4)$ và $R = 25$' },
      { id: 'D', text: '$I(-2; 1; -4)$ và $R = 25$' }
    ],
    correctOptionId: 'A',
    explanation: 'Phương trình chuẩn $(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$ có tâm $I(a; b; c)$ và bán kính $R$. Ở đây $a = 2, b = -1, c = 4$ và $R = \\sqrt{25} = 5$.'
  },
  {
    id: 'q-g12-m-4',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g12-math-3',
    topicName: 'Chủ đề 3: Nguyên hàm, Tích phân và Ứng dụng hình học',
    lessonName: 'Bài 3: Phương pháp tính tích phân và diện tích hình phẳng',
    difficulty: 'Thông hiểu',
    content: 'Tính giá trị của tích phân $I = \\int_0^1 (3x^2 + 2x) \\, dx$:',
    options: [
      { id: 'A', text: '$2$' },
      { id: 'B', text: '$3$' },
      { id: 'C', text: '$1$' },
      { id: 'D', text: '$5$' }
    ],
    correctOptionId: 'A',
    explanation: 'Nguyên hàm của $3x^2 + 2x$ là $x^3 + x^2$. Theo công thức Newton-Leibniz:\n$$I = [x^3 + x^2]_0^1 = (1^3 + 1^2) - (0^3 + 0^2) = 2$$'
  },
  {
    id: 'q-g12-m-5',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'math',
    subjectLabel: 'Toán học',
    topicId: 'topic-g12-math-2',
    topicName: 'Chủ đề 2: Vectơ và Hệ tọa độ Oxyz trong không gian',
    lessonName: 'Bài 2: Tọa độ vectơ, phương trình mặt phẳng và mặt cầu',
    difficulty: 'Vận dụng',
    content: 'Trong không gian $Oxyz$, mặt phẳng đi qua điểm $M(1; 2; -3)$ và vuông góc với vectơ $\\vec{n} = (2; -1; 3)$ có phương trình là:',
    options: [
      { id: 'A', text: '$2x - y + 3z + 9 = 0$' },
      { id: 'B', text: '$2x - y + 3z - 9 = 0$' },
      { id: 'C', text: '$2x + y + 3z + 9 = 0$' },
      { id: 'D', text: '$x + 2y - 3z - 9 = 0$' }
    ],
    correctOptionId: 'A',
    explanation: 'Phương trình mặt phẳng:\n$$2(x - 1) - 1(y - 2) + 3(z - (-3)) = 0 \\Leftrightarrow 2x - 2 - y + 2 + 3z + 9 = 0 \\Leftrightarrow 2x - y + 3z + 9 = 0$$'
  },

  // =========================================================================
  // 13. KHOA HỌC TỰ NHIÊN / LÝ / HÓA
  // =========================================================================
  {
    id: 'q-sci-1',
    tier: 'middle',
    gradeId: 'grade-8',
    gradeLabel: 'Lớp 8',
    subject: 'science',
    subjectLabel: 'Khoa học tự nhiên',
    topicId: 'topic-science-1',
    topicName: 'Chủ đề: Phản ứng hóa học và Định luật bảo toàn khối lượng',
    lessonName: 'Bài: Mol, khối lượng mol và định luật bảo toàn khối lượng',
    difficulty: 'Thông hiểu',
    content: 'Nung $10\\text{ g}$ đá vôi ($\\text{CaCO}_3$) sinh ra $5{,}6\\text{ g}$ vôi sống ($\\text{CaO}$) và khí carbon dioxide ($\\text{CO}_2$). Khối lượng khí $\\text{CO}_2$ thoát ra là:',
    options: [
      { id: 'A', text: '$4{,}4\\text{ g}$' },
      { id: 'B', text: '$5{,}6\\text{ g}$' },
      { id: 'C', text: '$15{,}6\\text{ g}$' },
      { id: 'D', text: '$4{,}0\\text{ g}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Theo định luật bảo toàn khối lượng: $m_{\\text{CaCO}_3} = m_{\\text{CaO}} + m_{\\text{CO}_2} \\implies m_{\\text{CO}_2} = 10 - 5{,}6 = 4{,}4\\text{ g}$.'
  },
  {
    id: 'q-sci-2',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'science',
    subjectLabel: 'Khoa học tự nhiên',
    topicId: 'topic-science-2',
    topicName: 'Chủ đề: Dao động cơ học và Vật lý nhiệt (KNTT 12)',
    lessonName: 'Bài: Phương trình dao động điều hòa $x = A\\cos(\\omega t + \\varphi)$',
    difficulty: 'Nhận biết',
    content: 'Một vật dao động điều hòa theo phương trình $x = 6\\cos(4\\pi t + \\frac{\\pi}{3})\\text{ cm}$. Biên độ dao động $A$ và tần số góc $\\omega$ của vật là:',
    options: [
      { id: 'A', text: '$A = 6\\text{ cm}, \\omega = 4\\pi\\text{ rad/s}$' },
      { id: 'B', text: '$A = 6\\text{ cm}, \\omega = 2\\pi\\text{ rad/s}$' },
      { id: 'C', text: '$A = 3\\text{ cm}, \\omega = 4\\pi\\text{ rad/s}$' },
      { id: 'D', text: '$A = 12\\text{ cm}, \\omega = 4\\pi\\text{ rad/s}$' }
    ],
    correctOptionId: 'A',
    explanation: 'Đối chiếu phương trình chuẩn $x = A\\cos(\\omega t + \\varphi)$, ta có biên độ $A = 6\\text{ cm}$, tần số góc $\\omega = 4\\pi\\text{ rad/s}$ và pha ban đầu $\\varphi = \\frac{\\pi}{3}\\text{ rad}$.'
  },

  // =========================================================================
  // 14. TIẾNG ANH (GLOBAL SUCCESS / KẾT NỐI TRI THỨC)
  // =========================================================================
  {
    id: 'q-eng-1',
    tier: 'middle',
    gradeId: 'grade-9',
    gradeLabel: 'Lớp 9',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    topicId: 'topic-english-1',
    topicName: 'Topic: English Tenses & Passive Voice (Global Success)',
    lessonName: 'Unit: Complex sentences and Reported Speech',
    difficulty: 'Thông hiểu',
    content: 'Choose the best option to complete the sentence: "If it rains tomorrow, we _______ the picnic."',
    options: [
      { id: 'A', text: 'will cancel' },
      { id: 'B', text: 'cancel' },
      { id: 'C', text: 'would cancel' },
      { id: 'D', text: 'cancelled' }
    ],
    correctOptionId: 'A',
    explanation: 'Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai: $\\text{If} + S + V_{\\text{hiện tại đơn}}, S + \\text{will} + V_{\\text{nguyên thể}}$. Do đó chọn "will cancel".'
  },
  {
    id: 'q-eng-2',
    tier: 'high',
    gradeId: 'grade-12',
    gradeLabel: 'Lớp 12',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    topicId: 'topic-english-2',
    topicName: 'Topic: THPT Exam Preparation - Grammar & Vocabulary',
    lessonName: 'Unit: Inversion, Relative Clauses & Collocations',
    difficulty: 'Vận dụng',
    content: 'Identify the correct option: "The man _______ next to the director is our new head of curriculum."',
    options: [
      { id: 'A', text: 'standing' },
      { id: 'B', text: 'stood' },
      { id: 'C', text: 'stands' },
      { id: 'D', text: 'who standing' }
    ],
    correctOptionId: 'A',
    explanation: 'Rút gọn mệnh đề quan hệ chủ động bằng dạng $V\\text{-ing}$: "The man who is standing..." rút gọn thành "The man standing...".'
  }
];

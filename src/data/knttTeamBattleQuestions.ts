export type BattleGrade = 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
export type BattleSubject = 'Toán' | 'Vật lý' | 'Hóa học' | 'Sinh học' | 'Tiếng Anh';

export interface KNTTTopic {
  id: string;
  grade: BattleGrade;
  subject: BattleSubject;
  topicName: string;
}

export interface KNTTBattleQuestion {
  id: string;
  grade: BattleGrade;
  subject: BattleSubject;
  topicId: string;
  topicName: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// 1. TOPICS LIST - KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
export const KNTT_TOPICS: KNTTTopic[] = [
  // LỚP 10
  { id: 't10-math-1', grade: 'Lớp 10', subject: 'Toán', topicName: 'Chương 1: Mệnh đề & Tập hợp' },
  { id: 't10-math-2', grade: 'Lớp 10', subject: 'Toán', topicName: 'Chương 2: Bất phương trình & Hệ BPT bậc nhất 2 ẩn' },
  { id: 't10-math-3', grade: 'Lớp 10', subject: 'Toán', topicName: 'Chương 3: Hàm số bậc hai & Đồ thị' },
  { id: 't10-phy-1', grade: 'Lớp 10', subject: 'Vật lý', topicName: 'Chương 1: Mở đầu & Mô tả chuyển động (Động học)' },
  { id: 't10-phy-2', grade: 'Lớp 10', subject: 'Vật lý', topicName: 'Chương 2: Lực & Động lực học (Định luật Newton)' },
  { id: 't10-chem-1', grade: 'Lớp 10', subject: 'Hóa học', topicName: 'Chương 1: Cấu tạo nguyên tử' },
  { id: 't10-chem-2', grade: 'Lớp 10', subject: 'Hóa học', topicName: 'Chương 2: Bảng tuần hoàn & Quy tắc Octet' },
  { id: 't10-bio-1', grade: 'Lớp 10', subject: 'Sinh học', topicName: 'Chương 1: Thành phần hóa học của tế bào' },
  { id: 't10-eng-1', grade: 'Lớp 10', subject: 'Tiếng Anh', topicName: 'Unit 1: Family Life & Grammar' },

  // LỚP 11
  { id: 't11-math-1', grade: 'Lớp 11', subject: 'Toán', topicName: 'Chương 1: Hàm số lượng giác & Phương trình lượng giác' },
  { id: 't11-math-2', grade: 'Lớp 11', subject: 'Toán', topicName: 'Chương 2: Dãy số, Cấp số cộng & Cấp số nhân' },
  { id: 't11-math-3', grade: 'Lớp 11', subject: 'Toán', topicName: 'Chương 3: Giới hạn & Hàm số liên tục' },
  { id: 't11-phy-1', grade: 'Lớp 11', subject: 'Vật lý', topicName: 'Chương 1: Dao động điều hòa & Đồ thị' },
  { id: 't11-phy-2', grade: 'Lớp 11', subject: 'Vật lý', topicName: 'Chương 2: Sóng cơ, Sóng âm & Giao thoa sóng' },
  { id: 't11-chem-1', grade: 'Lớp 11', subject: 'Hóa học', topicName: 'Chương 1: Cân bằng hóa học & pH dung dịch' },
  { id: 't11-chem-2', grade: 'Lớp 11', subject: 'Hóa học', topicName: 'Chương 2: Nitrogen & Sulfur' },
  { id: 't11-bio-1', grade: 'Lớp 11', subject: 'Sinh học', topicName: 'Chương 1: Trao đổi chất & Chuyển hóa năng lượng' },
  { id: 't11-eng-1', grade: 'Lớp 11', subject: 'Tiếng Anh', topicName: 'Unit 1: A Long and Healthy Life' },

  // LỚP 12
  { id: 't12-math-1', grade: 'Lớp 12', subject: 'Toán', topicName: 'Chương 1: Ứng dụng đạo hàm khảo sát hàm số' },
  { id: 't12-math-2', grade: 'Lớp 12', subject: 'Toán', topicName: 'Chương 2: Tọa độ Vectơ trong không gian Oxyz' },
  { id: 't12-math-3', grade: 'Lớp 12', subject: 'Toán', topicName: 'Chương 3: Nguyên hàm & Tích phân' },
  { id: 't12-phy-1', grade: 'Lớp 12', subject: 'Vật lý', topicName: 'Chương 1: Vật lý nhiệt & Chuyển thể' },
  { id: 't12-phy-2', grade: 'Lớp 12', subject: 'Vật lý', topicName: 'Chương 2: Khí lý tưởng & Phương trình trạng thái' },
  { id: 't12-chem-1', grade: 'Lớp 12', subject: 'Hóa học', topicName: 'Chương 1: Ester - Lipid' },
  { id: 't12-chem-2', grade: 'Lớp 12', subject: 'Hóa học', topicName: 'Chương 2: Carbohydrate (Glucose, Fructose, Saccharose, Tinh bột)' },
  { id: 't12-chem-3', grade: 'Lớp 12', subject: 'Hóa học', topicName: 'Chương 3: Hợp chất chứa Nitrogen (Amine, Amino Acid, Peptide)' },
  { id: 't12-bio-1', grade: 'Lớp 12', subject: 'Sinh học', topicName: 'Chương 1: Cơ sở di truyền cấp phân tử & Tế bào' },
  { id: 't12-bio-2', grade: 'Lớp 12', subject: 'Sinh học', topicName: 'Chương 2: Quy luật di truyền Mendel & Mở rộng' },
  { id: 't12-eng-1', grade: 'Lớp 12', subject: 'Tiếng Anh', topicName: 'Unit 1: Life Stories & Paraphrasing' }
];

// 2. COMPREHENSIVE QUESTION BANK - KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
export const KNTT_QUESTION_BANK: KNTTBattleQuestion[] = [
  // ================= LỚP 10 =================
  {
    id: 'q10-m1',
    grade: 'Lớp 10',
    subject: 'Toán',
    topicId: 't10-math-1',
    topicName: 'Chương 1: Mệnh đề & Tập hợp',
    question: 'Cho hai tập hợp $A = [-2; 3)$ và $B = (1; 5]$. Tìm tập hợp giao $A \\cap B$.',
    options: ['$A \\cap B = (1; 3)$', '$A \\cap B = [-2; 5]$', '$A \\cap B = (1; 3]$', '$A \\cap B = [-2; 1)$'],
    correctAnswer: 0,
    explanation: 'Giao của hai khoảng là phần phần tử chung nằm trong cả hai tập: $x \\in [-2; 3)$ và $x \\in (1; 5] \\Rightarrow x \\in (1; 3)$.'
  },
  {
    id: 'q10-p1',
    grade: 'Lớp 10',
    subject: 'Vật lý',
    topicId: 't10-phy-1',
    topicName: 'Chương 1: Động học',
    question: 'Một vật chuyển động thẳng biến đổi đều với vận tốc ban đầu $v_0 = 2\\text{ m/s}$ và gia tốc $a = 1\\text{ m/s}^2$. Tính quãng đường vật đi được sau $4\\text{ s}$.',
    options: ['$s = 16\\text{ m}$', '$s = 8\\text{ m}$', '$s = 12\\text{ m}$', '$s = 20\\text{ m}$'],
    correctAnswer: 0,
    explanation: 'Công thức quãng đường: $s = v_0 t + \\frac{1}{2}a t^2 = 2(4) + \\frac{1}{2}(1)(4)^2 = 8 + 8 = 16\\text{ m}$.'
  },
  {
    id: 'q10-c1',
    grade: 'Lớp 10',
    subject: 'Hóa học',
    topicId: 't10-chem-1',
    topicName: 'Chương 1: Cấu tạo nguyên tử',
    question: 'Nguyên tử của nguyên tố $X$ có $17$ proton trong hạt nhân. Cấu hình electron của nguyên tử $X$ ở trạng thái cơ bản là:',
    options: ['$1s^2 2s^2 2p^6 3s^2 3p^5$', '$1s^2 2s^2 2p^6 3s^2 3p^6$', '$1s^2 2s^2 2p^6 3s^1 3p^6$', '$1s^2 2s^2 2p^6 3s^2 3p^4$'],
    correctAnswer: 0,
    explanation: 'Số proton = số electron = $17$. Phân bố electron vào các phân lớp theo thứ tự năng lượng tăng dần thu được $1s^2 2s^2 2p^6 3s^2 3p^5$ (Nguyên tố Clo - Chlorine).'
  },
  {
    id: 'q10-b1',
    grade: 'Lớp 10',
    subject: 'Sinh học',
    topicId: 't10-bio-1',
    topicName: 'Chương 1: Thành phần hóa học tế bào',
    question: 'Các nguyên tố hóa học đại lượng chiếm tỷ lệ lớn trong cơ thể sống gồm có:',
    options: ['$\\text{C}, \\text{H}, \\text{O}, \\text{N}$', '$\\text{Fe}, \\text{Cu}, \\text{Zn}, \\text{I}$', '$\\text{Mg}, \\text{Ca}, \\text{Fe}, \\text{Mo}$', '$\\text{Cl}, \\text{Na}, \\text{Mn}, \\text{Co}$'],
    correctAnswer: 0,
    explanation: 'Bốn nguyên tố $\\text{C}, \\text{H}, \\text{O}, \\text{N}$ chiếm hơn $96\\%$ khối lượng cơ thể sống và là thành phần cấu tạo chính của protein, lipid, carbohydrate và nucleic acid.'
  },

  // ================= LỚP 11 =================
  {
    id: 'q11-m1',
    grade: 'Lớp 11',
    subject: 'Toán',
    topicId: 't11-math-1',
    topicName: 'Chương 1: Phương trình lượng giác',
    question: 'Nghiệm của phương trình lượng giác $\\sin x = 0$ là:',
    options: ['$x = k\\pi\\ (k \\in \\mathbb{Z})$', '$x = \\frac{\\pi}{2} + k\\pi\\ (k \\in \\mathbb{Z})$', '$x = k2\\pi\\ (k \\in \\mathbb{Z})$', '$x = \\frac{\\pi}{2} + k2\\pi\\ (k \\in \\mathbb{Z})$'],
    correctAnswer: 0,
    explanation: 'Trên đường tròn lượng giác, điểm có tung độ bằng $0$ là hai điểm ứng với góc $0$ và $\\pi$. Do đó $x = k\\pi\\ (k \\in \\mathbb{Z})$.'
  },
  {
    id: 'q11-p1',
    grade: 'Lớp 11',
    subject: 'Vật lý',
    topicId: 't11-phy-1',
    topicName: 'Chương 1: Dao động điều hòa',
    question: 'Một chất điểm dao động điều hòa theo phương trình $x = 6\\cos(4\\pi t + \\frac{\\pi}{3})$ cm. Tần số góc $\\omega$ và chu kỳ $T$ của dao động lần lượt là:',
    options: ['$\\omega = 4\\pi\\text{ rad/s}, T = 0,5\\text{ s}$', '$\\omega = 4\\pi\\text{ rad/s}, T = 2\\text{ s}$', '$\\omega = 2\\pi\\text{ rad/s}, T = 1\\text{ s}$', '$\\omega = 6\\text{ rad/s}, T = 0,5\\text{ s}$'],
    correctAnswer: 0,
    explanation: 'Từ phương trình suy ra $\\omega = 4\\pi\\text{ rad/s}$. Chu kỳ $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{4\\pi} = 0,5\\text{ s}$.'
  },
  {
    id: 'q11-c1',
    grade: 'Lớp 11',
    subject: 'Hóa học',
    topicId: 't11-chem-1',
    topicName: 'Chương 1: Cân bằng hóa học & pH',
    question: 'Dung dịch có nồng độ $[\\text{H}^+] = 10^{-3}\\text{ M}$ thì giá trị $\\text{pH}$ và môi trường của dung dịch là:',
    options: ['$\\text{pH} = 3$, môi trường axit', '$\\text{pH} = 11$, môi trường bazơ', '$\\text{pH} = 3$, môi trường bazơ', '$\\text{pH} = 7$, môi trường trung tính'],
    correctAnswer: 0,
    explanation: '$\\text{pH} = -\\lg[\\text{H}^+] = -\\lg(10^{-3}) = 3 < 7$, do đó dung dịch có môi trường axit.'
  },
  {
    id: 'q11-b1',
    grade: 'Lớp 11',
    subject: 'Sinh học',
    topicId: 't11-bio-1',
    topicName: 'Chương 1: Trao đổi chất',
    question: 'Sản phẩm đầu tiên cố định $\\text{CO}_2$ trong con đường quang hợp ở thực vật $\\text{C}_3$ là:',
    options: ['Hợp chất $3$ carbon (APG)', 'Hợp chất $4$ carbon (AOA)', 'Glucose', 'Acid pyruvic'],
    correctAnswer: 0,
    explanation: 'Ở thực vật $\\text{C}_3$, chất nhận $\\text{CO}_2$ đầu tiên là Ribulose-1,5-bisphosphate ($\text{RuBP}$) tạo ra sản phẩm ổn định đầu tiên là $3$-phosphoglyceric acid (APG - hợp chất $3$ carbon).'
  },

  // ================= LỚP 12 =================
  {
    id: 'q12-m1',
    grade: 'Lớp 12',
    subject: 'Toán',
    topicId: 't12-math-1',
    topicName: 'Chương 1: Ứng dụng đạo hàm',
    question: 'Giá trị cực đại của hàm số $y = x^3 - 3x + 2$ bằng bao nhiêu?',
    options: ['$y_{CD} = 4$', '$y_{CD} = 0$', '$y_{CD} = 2$', '$y_{CD} = -1$'],
    correctAnswer: 0,
    explanation: 'Ta có $y\' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Vì $y\'\' = 6x \\Rightarrow y\'\'(-1) = -6 < 0$ nên $x = -1$ là điểm cực đại $\\Rightarrow y_{CD} = y(-1) = (-1)^3 - 3(-1) + 2 = 4$.'
  },
  {
    id: 'q12-m2',
    grade: 'Lớp 12',
    subject: 'Toán',
    topicId: 't12-math-2',
    topicName: 'Chương 2: Vectơ Oxyz',
    question: 'Trong không gian $Oxyz$, cho hai điểm $A(1; 2; -1)$ và $B(3; 0; 3)$. Trung điểm $I$ của đoạn thẳng $AB$ có tọa độ là:',
    options: ['$I(2; 1; 1)$', '$I(4; 2; 2)$', '$I(1; -1; 2)$', '$I(2; 1; 2)$'],
    correctAnswer: 0,
    explanation: 'Tọa độ trung điểm $I = (\\frac{x_A + x_B}{2}; \\frac{y_A + y_B}{2}; \\frac{z_A + z_B}{2}) = (\\frac{1+3}{2}; \\frac{2+0}{2}; \\frac{-1+3}{2}) = (2; 1; 1)$.'
  },
  {
    id: 'q12-p1',
    grade: 'Lớp 12',
    subject: 'Vật lý',
    topicId: 't12-phy-1',
    topicName: 'Chương 1: Vật lý nhiệt',
    question: 'Đơn vị đo nhiệt độ trong hệ đo lường quốc tế (SI) là:',
    options: ['Kelvin (K)', 'Độ Celsius ($^\\circ\\text{C}$)', 'Độ Fahrenheit ($^\\circ\\text{F}$)', 'Joule (J)'],
    correctAnswer: 0,
    explanation: 'Trong hệ SI, đơn vị đo nhiệt độ tuyệt đối là Kelvin (K), với $T(\\text{K}) = t(^\\circ\\text{C}) + 273,15$.'
  },
  {
    id: 'q12-c1',
    grade: 'Lớp 12',
    subject: 'Hóa học',
    topicId: 't12-chem-1',
    topicName: 'Chương 1: Ester - Lipid',
    question: 'Thuỷ phân ethyl acetate ($\text{CH}_3\text{COOC}_2\text{H}_5$) trong dung dịch $\text{NaOH}$ đun nóng thu được các sản phẩm là:',
    options: ['$\\text{CH}_3\\text{COONa}$ và $\\text{C}_2\\text{H}_5\\text{OH}$', '$\\text{CH}_3\\text{COOH}$ và $\\text{C}_2\\text{H}_5\\text{ONa}$', '$\\text{HCOONa}$ và $\\text{C}_3\\text{H}_7\\text{OH}$', '$\\text{CH}_3\\text{COONa}$ và $\\text{CH}_3\\text{OH}$'],
    correctAnswer: 0,
    explanation: 'Phản ứng xà phòng hóa ester: $\\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{NaOH} \\xrightarrow{t^\\circ} \\text{CH}_3\\text{COONa} + \\text{C}_2\\text{H}_5\\text{OH}$.'
  },
  {
    id: 'q12-b1',
    grade: 'Lớp 12',
    subject: 'Sinh học',
    topicId: 't12-bio-1',
    topicName: 'Chương 1: Di truyền cấp phân tử',
    question: 'Quá trình tái bản ADN diễn ra theo các nguyên tắc chính nào?',
    options: ['Nguyên tắc bổ sung và Nguyên tắc bán bảo tồn', 'Nguyên tắc bổ sung và Nguyên tắc gián đoạn', 'Nguyên tắc liên tục và Bán bảo toàn', 'Nguyên tắc bảo tồn hoàn toàn'],
    correctAnswer: 0,
    explanation: 'Tái bản ADN luôn tuân theo nguyên tắc bổ sung ($A-T, G-C$) và nguyên tắc bán bảo tồn (mỗi ADN con sinh ra chứa $1$ mạch cũ từ ADN mẹ và $1$ mạch mới tổng hợp).'
  },
  {
    id: 'q12-e1',
    grade: 'Lớp 12',
    subject: 'Tiếng Anh',
    topicId: 't12-eng-1',
    topicName: 'Unit 1: Life Stories',
    question: 'Choose the best paraphrase: "Although he was very tired, he completed the project on time."',
    options: [
      'In spite of being very tired, he completed the project on time.',
      'Because he was very tired, he completed the project on time.',
      'He was too tired to complete the project on time.',
      'Unless he was tired, he would complete the project on time.'
    ],
    correctAnswer: 0,
    explanation: '"In spite of + V-ing" đồng nghĩa với "Although + S + V" chỉ sự nhượng bộ.'
  }
];

import React, { useState } from 'react';
import { X, BookOpen, Play, Compass, Layers, CheckCircle2, Info } from 'lucide-react';

interface RubikGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDemoFormula: (formula: string, label: string) => void;
}

type CubeGuideId = '3x3' | '2x2' | '4x4' | 'pyraminx' | 'skewb_mirror';

interface FormulaItem {
  name: string;
  formula: string;
  usage: string;
  canDemo3d?: boolean;
}

interface GuideStep {
  stepNumber: number;
  title: string;
  goal: string;
  tips: string;
  formulas?: FormulaItem[];
}

interface CubeGuideData {
  id: CubeGuideId;
  shortLabel: string;
  fullName: string;
  difficulty: string;
  methodName: string;
  summary: string;
  notationNote: string;
  steps: GuideStep[];
}

const CUBE_GUIDES: CubeGuideData[] = [
  {
    id: '3x3',
    shortLabel: 'Rubik 3×3×3',
    fullName: 'Rubik 3×3×3 Chuẩn WCA (Phương pháp Từng Tầng - Layer by Layer)',
    difficulty: 'Phổ biến nhất · Dễ học',
    methodName: 'LBL 7 bước (Nền tảng lên CFOP)',
    summary:
      'Giải tuần tự từ tầng đáy (Trắng) lên tầng giữa rồi hoàn thiện tầng đỉnh (Vàng). Các viên tâm luôn cố định vị trí đối diện nhau: Trắng–Vàng, Xanh lá–Xanh dương, Đỏ–Cam.',
    notationNote:
      'Chữ cái thường (U, D, R, L, F, B) xoay 90° thuận chiều kim đồng hồ khi nhìn thẳng vào mặt đó; có dấu phẩy (\') là xoay ngược chiều; số 2 (như R2, U2) là xoay 180°.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tạo chữ thập trắng (White Cross)',
        goal: 'Đưa 4 viên cạnh có màu Trắng về xung quanh tâm Trắng (mặt đáy D), đồng thời màu còn lại của mỗi viên cạnh phải trùng đúng màu tâm ở 4 mặt bên.',
        tips: 'Mẹo cho người mới: Đưa 4 cạnh trắng lên quanh tâm Vàng trước (hình bông hoa cúc), xoay tầng U để màu bên trùng tâm, sau đó xoay mặt bên 180° (F2) để đưa xuống mặt đáy Trắng.',
      },
      {
        stepNumber: 2,
        title: 'Hoàn thiện 4 góc tầng 1 (Mặt Trắng)',
        goal: 'Đưa 4 viên góc chứa màu Trắng vào đúng vị trí giữa 3 tâm tương ứng để hoàn thiện toàn bộ tầng 1.',
        tips: 'Giữ mặt Trắng ở đáy (D). Đặt viên góc trắng cần đưa xuống nằm ở góc trên–phải–trước (U-R-F) rồi lặp lại "Công thức tay phải" (Sexy Move) từ 1 đến 5 lần cho tới khi góc khớp đúng màu.',
        formulas: [
          {
            name: 'Công thức tay phải (Sexy Move)',
            formula: "R U R' U'",
            usage: 'Lặp lại 1–5 lần để chèn góc trắng tầng 1 và dùng lại ở bước lật góc tầng 3.',
            canDemo3d: true,
          },
          {
            name: 'Công thức tay trái (Left Sexy)',
            formula: "L' U' L U",
            usage: 'Dùng tương tự khi viên góc nằm ở góc trên–trái–trước.',
            canDemo3d: true,
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Giải 4 viên cạnh tầng 2 (F2L cơ bản)',
        goal: 'Đưa 4 viên cạnh không có màu Vàng từ tầng trên (U) xuống đúng 4 khe cạnh của tầng giữa.',
        tips: 'Xoay tầng U sao cho màu mặt trước của viên cạnh trùng màu tâm mặt F (tạo chữ T ngược). Xem màu mặt trên của viên cạnh cần rẽ sang phải hay sang trái để chọn công thức tương ứng.',
        formulas: [
          {
            name: 'Đưa cạnh tầng 2 sang PHẢI',
            formula: "U R U' R' U' F' U F",
            usage: 'Khi màu mặt trên của viên cạnh trùng màu tâm mặt bên Phải (R).',
            canDemo3d: true,
          },
          {
            name: 'Đưa cạnh tầng 2 sang TRÁI',
            formula: "U' L' U L U F U' F'",
            usage: 'Khi màu mặt trên của viên cạnh trùng màu tâm mặt bên Trái (L).',
            canDemo3d: true,
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Tạo chữ thập vàng (Yellow Cross)',
        goal: 'Lật 4 viên cạnh mặt trên (U) sao cho tạo thành dấu cộng (+) màu Vàng.',
        tips: 'Tùy hình dáng màu vàng trên mặt U: nếu là chấm tâm → làm 1 lần ra chữ L; đặt chữ L ở góc 9 giờ – 12 giờ → làm 1 lần ra đường thẳng ngang; đặt đường thẳng nằm ngang (trái–phải) → làm 1 lần ra chữ thập vàng.',
        formulas: [
          {
            name: 'Tạo dấu cộng vàng (FRUR\'U\'F\')',
            formula: "F R U R' U' F'",
            usage: 'Đặt chữ L ở góc trên–trái hoặc thanh ngang song song với bạn rồi xoay.',
            canDemo3d: true,
          },
        ],
      },
      {
        stepNumber: 5,
        title: 'Phủ kín mặt Vàng (OLL – Công thức Con Cá / Sune)',
        goal: 'Xoay lật toàn bộ mặt trên (U) thành màu Vàng đồng nhất.',
        tips: 'Dùng duy nhất công thức Sune: nếu thấy hình con cá (1 góc vàng + chữ thập), đặt đầu con cá hướng về góc dưới–trái (gần tay trái); nếu có 0 hoặc 2 góc vàng, đặt 1 sticker vàng ở mặt L phía góc trước–trái rồi thực hiện Sune.',
        formulas: [
          {
            name: 'Công thức Sune (Con Cá)',
            formula: "R U R' U R U2 R'",
            usage: 'Lặp 1–3 lần là phủ kín 100% mặt Vàng.',
            canDemo3d: true,
          },
        ],
      },
      {
        stepNumber: 6,
        title: 'Hoán vị 4 góc tầng 3 (PLL Góc)',
        goal: 'Đưa 4 viên góc tầng trên về đúng cặp màu của 2 mặt bên (tạo "đèn pha" 2 góc cùng màu ở mỗi mặt).',
        tips: 'Tìm mặt đã có 2 góc cùng màu ("đèn pha") và xoay mặt đó ra phía sau (B) hoặc bên trái (L tùy biến thể). Với công thức dưới đây, đặt cặp đèn pha ở mặt TRÁI (L) rồi xoay.',
        formulas: [
          {
            name: 'Hoán vị 2 góc phải (T-Perm rút gọn)',
            formula: "R U R' U' R' F R2 U' R' U' R U R' F'",
            usage: 'Đặt 2 góc đã cùng màu ở bên Trái (L); nếu chưa có mặt nào giống nhau thì xoay 1 lần trước.',
            canDemo3d: true,
          },
        ],
      },
      {
        stepNumber: 7,
        title: 'Hoán vị 3 cạnh cuối (Hoàn thành khối Rubik)',
        goal: 'Đổi vòng tròn 3 viên cạnh cuối cùng của tầng trên về đúng màu mặt bên.',
        tips: 'Đặt mặt đã hoàn thành đủ 3 ô (mặt hoàn chỉnh) ra phía SAU (B). Nếu chưa có mặt nào hoàn chỉnh, xoay công thức 1 lần bất kỳ sẽ xuất hiện 1 mặt hoàn chỉnh.',
        formulas: [
          {
            name: 'Xoay 3 cạnh thuận kim đồng hồ (Ua-Perm)',
            formula: "R U' R U R U R U' R' U' R2",
            usage: 'Đặt mặt đã giải xong ra phía sau (B). Nếu chưa xong sau 1 lần thì làm thêm 1 lần nữa.',
            canDemo3d: true,
          },
          {
            name: 'Xoay 3 cạnh ngược kim đồng hồ (Ub-Perm)',
            formula: "R2 U R U R' U' R' U' R' U R'",
            usage: 'Dùng khi cạnh mặt trước cần chạy sang phải để giải chỉ trong 1 lượt.',
            canDemo3d: true,
          },
        ],
      },
    ],
  },
  {
    id: '2x2',
    shortLabel: 'Rubik 2×2×2',
    fullName: 'Rubik 2×2×2 (Pocket Cube – Phương pháp Cơ bản & Ortega)',
    difficulty: 'Rất dễ · Giải nhanh dưới 15 giây',
    methodName: '3 bước siêu tốc (Không có viên cạnh & viên tâm)',
    summary:
      'Rubik 2×2×2 thực chất chính là 8 viên góc của khối 3×3×3. Bạn không có tâm cố định, nên hãy nhớ quy ước màu đối diện chuẩn: Trắng đối Vàng, Xanh lá đối Xanh dương, Đỏ đối Cam.',
    notationNote:
      'Chỉ cần dùng 3 mặt chính R, U, F (cùng R\', U\', F\', R2, U2, F2). Không cần nhớ công thức cạnh tầng 2.',
    steps: [
      {
        stepNumber: 1,
        title: 'Hoàn thiện tầng 1 (Mặt Trắng + 4 cạnh bên trùng màu)',
        goal: 'Ghép 4 viên góc Trắng ở đáy sao cho 2 viên góc liền kề nhau trên mỗi mặt bên cùng màu.',
        tips: 'Chọn 1 viên góc Trắng làm gốc ở góc trước–trái–dưới. Đưa từng viên góc Trắng tiếp theo lên vị trí ngay phía trên chỗ cần chèn rồi lặp R U R\' U\'.',
        formulas: [
          {
            name: 'Chèn góc tầng 1',
            formula: "R U R' U'",
            usage: 'Lặp 1–5 lần cho tới khi mặt trắng quay xuống đáy và 2 màu bên khớp nhau.',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Phủ kín mặt Vàng phía trên (OLL 2×2)',
        goal: 'Làm cả 4 ô ở mặt trên (U) đều là màu Vàng.',
        tips: 'Nếu bạn mới học, dùng đúng công thức Sune của 3×3 là giải được toàn bộ 7 trường hợp OLL của 2×2. Ngoài ra có thêm công thức nhanh khi có 2 góc vàng chéo hoặc song song.',
        formulas: [
          {
            name: 'Sune (1 góc vàng ở góc dưới–trái)',
            formula: "R U R' U R U2 R'",
            usage: 'Trường hợp phổ biến nhất; các thế khác xoay 1 lần Sune sẽ quy về thế này.',
          },
          {
            name: 'Lật 4 góc (2 cặp hướng ra trước–sau)',
            formula: "R2 U2 R U2 R2",
            usage: 'Cực ngắn khi không có ô vàng nào trên mặt U, 2 ô vàng nhìn về mặt F và 2 ô ở mặt B.',
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Hoán vị tầng 2 (Hoàn thành khối 2×2)',
        goal: 'Đưa 4 góc tầng trên về đúng màu mặt bên.',
        tips: 'Chỉ có đúng 2 khả năng xảy ra: (1) Đã có 1 cặp màu giống nhau ở một mặt bên → đưa cặp đó ra bên TRÁI (L) rồi dùng T-Perm; (2) Không có cặp nào giống nhau (đổi chéo) → dùng Y-Perm.',
        formulas: [
          {
            name: 'Đổi 2 góc kề bên phải (T-Perm)',
            formula: "R U R' U' R' F R2 U' R' U' R U R' F'",
            usage: 'Đặt 2 ô đã cùng màu về mặt Trái (L).',
          },
          {
            name: 'Đổi 2 góc chéo nhau (Y-Perm ngắn)',
            formula: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
            usage: 'Dùng khi 4 mặt bên tầng trên không có cặp góc nào cùng màu.',
          },
        ],
      },
    ],
  },
  {
    id: '4x4',
    shortLabel: 'Rubik 4×4×4',
    fullName: 'Rubik 4×4×4 (Rubik Revenge – Phương pháp Reduction)',
    difficulty: 'Trung bình – Khá · Có lỗi Parity',
    methodName: 'Quy đổi 4×4 về 3×3 + Xử lý Parity',
    summary:
      'Ý tưởng cốt lõi là biến khối 4×4×4 thành một khối 3×3×3 khổng lồ bằng cách ghép 6 khối tâm (2×2) và ghép 12 cặp viên cạnh (2×1), sau đó giải y hệt 3×3×3 và xử lý lỗi Parity nếu gặp.',
    notationNote:
      'Ký hiệu chữ thường (r, l, u, d, f) là xoay RIÊNG lớp trong sát mặt đó; ký hiệu Rw, Uw là xoay CẢ 2 LỚP ngoài cùng một lúc.',
    steps: [
      {
        stepNumber: 1,
        title: 'Ghép 6 khối tâm 2×2 theo đúng thứ tự màu chuẩn',
        goal: 'Tạo thành 6 hình vuông tâm 2×2: Trắng đối Vàng, sau đó lần lượt Xanh lá – Đỏ – Xanh dương – Cam theo chiều kim đồng hồ khi Trắng ở dưới, Vàng ở trên.',
        tips: 'Vì 4×4 không có tâm cố định, hãy đặc biệt chú ý thứ tự màu: khi cầm Trắng ở Đáy (D) và Xanh lá ở Trước (F) thì Đỏ PHẢI ở bên Phải (R). Ghép từng thanh 1×2 rồi ghép 2 thanh lại.',
        formulas: [
          {
            name: 'Đưa thanh tâm 1×2 từ F lên U không phá tâm cũ',
            formula: "Rw U2 Rw'",
            usage: 'Đặt thanh tâm cần ghép thẳng hàng với thanh đã có trên mặt U rồi xoay.',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Ghép 12 cặp viên cạnh (Edge Pairing)',
        goal: 'Ghép 2 viên cạnh giống hệt nhau thành 1 khối cạnh đôi hoàn chỉnh.',
        tips: 'Đưa 2 viên cạnh giống màu về cùng hàng ngang ở mặt Trước (F) (một bên trái, một bên phải, nhưng khác tầng) rồi dùng công thức Flip-Edge để ghép đôi mà không làm vỡ 6 tâm đã ghép.',
        formulas: [
          {
            name: 'Lật tại chỗ 1 cạnh phải trên mặt F (Flipping Algorithm)',
            formula: "R U R' F R' F' R",
            usage: 'Lật đảo chiều 1 cặp cạnh khi 2 viên giống màu đang nằm cùng tầng.',
          },
          {
            name: 'Ghép 2 cạnh cuối (Last 2 Edges)',
            formula: "Uw' R U R' F R' F' R Uw",
            usage: 'Đặt 2 viên cùng màu đối diện ngang hàng ở mặt trước–trái và trước–phải rồi thực hiện.',
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Giải toàn khối như Rubik 3×3×3',
        goal: 'Chỉ xoay các lớp ngoài cùng (R, L, U, D, F, B) và áp dụng đúng 7 bước 3×3×3.',
        tips: 'Tuyệt đối không xoay lớp giữa trong giai đoạn này để giữ nguyên các khối tâm và cặp cạnh đã ghép.',
      },
      {
        stepNumber: 4,
        title: 'Xử lý 2 trường hợp Parity đặc trưng của 4×4×4',
        goal: 'Khắc phục tình huống "bất khả thi trên 3×3" ở tầng cuối (1 cạnh bị lật ngược hoặc chỉ còn 2 cạnh cần đổi chỗ).',
        tips: 'Hai lỗi này xảy ra độc lập với xác suất 50% mỗi loại. Cứ học thuộc 2 công thức dưới đây là bạn giải được 100% mọi trạng thái 4×4×4!',
        formulas: [
          {
            name: 'OLL Parity (Lật ngược 1 cặp cạnh ở mặt U–F)',
            formula: "Rw2 B2 U2 Lw U2 Rw' U2 Rw U2 F2 Rw F2 Lw' B2 Rw2",
            usage: 'Khi mặt Vàng có số cạnh vàng là số lẻ (1 hoặc 3 cạnh). Đặt cặp cạnh lỗi hướng về mặt F.',
          },
          {
            name: 'PLL Parity (Hoán đổi 2 cặp cạnh đối diện ở tầng U)',
            formula: "r2 U2 r2 Uw2 r2 u2",
            usage: 'r2 là xoay riêng lớp trong bên phải 180°, Uw2 xoay 2 lớp trên, u2 xoay riêng lớp trên thứ hai.',
          },
        ],
      },
    ],
  },
  {
    id: 'pyraminx',
    shortLabel: 'Pyraminx',
    fullName: 'Pyraminx (Rubik Tam Giác – Kim Tự Tháp 4 Mặt)',
    difficulty: 'Rất dễ · Học xong trong 10 phút',
    methodName: 'Layer by Layer (Đỉnh → Tâm → Đáy → Tầng trên)',
    summary:
      'Pyraminx có 4 mặt tam giác (Vàng, Xanh lá, Đỏ, Xanh dương), cấu tạo gồm 4 đỉnh chóp nhỏ xoay độc lập, 4 cụm tâm và 6 viên cạnh. Rất thân thiện để thư giãn giữa giờ học.',
    notationNote:
      'Chữ thường (u, l, r, b) là xoay chóp đỉnh nhỏ 120°; chữ IN HOA (U, L, R, B) là xoay cả tầng lớn tương ứng 120°.',
    steps: [
      {
        stepNumber: 1,
        title: 'Chỉnh 4 chóp đỉnh nhỏ trùng màu tâm liền kề',
        goal: 'Xoay 4 đầu chóp nhỏ (tips) sao cho mỗi mặt của đỉnh khớp màu với mảnh tâm ngay dưới nó.',
        tips: 'Mỗi chóp đỉnh chỉ có 3 nấc xoay và hoàn toàn không ảnh hưởng tới các viên khác nên bạn có thể chỉnh bằng mắt ngay lập tức.',
      },
      {
        stepNumber: 2,
        title: 'Gom 3 mảnh tâm cùng màu về mặt Đáy',
        goal: 'Chọn mặt Vàng (hoặc màu bất kỳ) có đủ 3 đỉnh chứa màu đó, rồi xoay các góc lớn để cả 3 mảnh tâm Vàng quay xuống cùng một mặt đáy.',
        tips: 'Mỗi màu chỉ xuất hiện trên đúng 3 trong 4 đỉnh. Xác định đỉnh KHÔNG có màu Vàng — mặt đối diện đỉnh đó chính là mặt đáy Vàng!',
      },
      {
        stepNumber: 3,
        title: 'Chèn 3 viên cạnh của tầng Đáy',
        goal: 'Hoàn thiện hoàn toàn tầng dưới cùng (mặt đáy Vàng và viền 3 màu xung quanh).',
        tips: 'Giữ mặt Vàng ở dưới đáy. Tìm viên cạnh có màu Vàng ở tầng trên, xoay tầng U sao cho mặt còn lại của viên cạnh trùng màu tâm, rồi dùng công thức đưa xuống.',
        formulas: [
          {
            name: 'Đưa cạnh xuống khe PHẢI',
            formula: "L' U' L",
            usage: 'Khi mặt Vàng của viên cạnh đang hướng về phía tay Phải.',
          },
          {
            name: 'Đưa cạnh xuống khe TRÁI',
            formula: "R U R'",
            usage: 'Khi mặt Vàng của viên cạnh đang hướng về phía tay Trái.',
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Hoàn thiện 3 viên cạnh tầng Đỉnh',
        goal: 'Đưa 3 viên cạnh cuối cùng về đúng vị trí và đúng chiều màu.',
        tips: 'Xoay đỉnh trên cùng cho khớp tâm, sau đó chỉ cần nhớ 2 công thức cực ngắn bên dưới.',
        formulas: [
          {
            name: 'Sledgehammer (Lật tại chỗ 2 cạnh mặt trước)',
            formula: "R' L R L' U L' U' L",
            usage: 'Dùng khi 2 viên cạnh phía trước đúng vị trí nhưng bị ngược màu nhau.',
          },
          {
            name: 'Xoay vòng 3 cạnh tầng trên',
            formula: "R U R' U R U R'",
            usage: 'Đổi vòng tròn 3 cạnh tầng trên (nếu cần chiều ngược lại thì dùng R U\' R\' U\' R U\' R\').',
          },
        ],
      },
    ],
  },
  {
    id: 'skewb_mirror',
    shortLabel: 'Skewb & Mirror',
    fullName: 'Skewb (Lập phương cắt chéo) & Mirror Cube 3×3',
    difficulty: 'Sáng tạo · Đổi gió tư duy không gian',
    methodName: '1 công thức Sledgehammer (Skewb) & Đọc hình khối (Mirror)',
    summary:
      'Hai biến thể cực thú vị giúp rèn luyện tư duy hình học không gian: Skewb xoay quanh các góc chéo và chỉ cần đúng 1 công thức để giải; còn Mirror Cube dùng 100% công thức của 3×3×3 nhưng phân biệt bằng kích thước thay vì màu sắc.',
    notationNote:
      'Trên Skewb: R là xoay góc trước–phải–dưới thuận kim đồng hồ; L là xoay góc trước–trái–dưới thuận kim đồng hồ. Trên Mirror Cube: giữ đúng ký hiệu 3×3×3.',
    steps: [
      {
        stepNumber: 1,
        title: '[Skewb] Giải mặt Trắng & 4 góc tầng 1',
        goal: 'Đưa 4 góc trắng ghép quanh tâm trắng sao cho các cặp màu bên cạnh trùng nhau.',
        tips: 'Vì Skewb xoay cả nửa khối quanh trục góc, bạn dễ dàng đưa trực giác 4 góc trắng vào đúng vị trí chỉ sau vài lượt xoay.',
      },
      {
        stepNumber: 2,
        title: '[Skewb] Lật 4 góc mặt Vàng & đưa tâm Vàng lên đỉnh',
        goal: 'Hoàn thiện mặt Vàng phía trên bằng công thức duy nhất Sledgehammer.',
        tips: 'Giữ mặt Trắng ở đáy. Nếu thấy 2 góc vàng đối diện nhau trên 1 cạnh (đèn pha) hướng sang phải, thực hiện Sledgehammer 1 lần sẽ lên mặt vàng. Nếu tâm vàng đang ở mặt trước, đặt nó ở mặt trước (F) rồi làm Sledgehammer.',
        formulas: [
          {
            name: 'Sledgehammer (Công thức vàng cho Skewb)',
            formula: "R' L R L'",
            usage: 'Hạ phải – Hạ trái – Lên phải – Lên trái. Dùng xuyên suốt để lật góc và hoán đổi 3 tâm cuối.',
          },
        ],
      },
      {
        stepNumber: 3,
        title: '[Skewb] Hoán vị 3 tâm cuối (Hoàn thành)',
        goal: 'Đưa 3 viên tâm còn lại ở tầng giữa về đúng giữa 4 góc cùng màu.',
        tips: 'Đặt mặt đã giải xong (hoặc mặt đối diện) ở dưới đáy/sau lưng, thực hiện Sledgehammer → xoay cả khối 180° (y2) → làm lại Sledgehammer thêm 1 lần nữa (tổng 2 lượt Sledgehammer) để hoán đổi vòng tròn 3 tâm.',
      },
      {
        stepNumber: 4,
        title: '[Mirror Cube 3×3] Mẹo giải nhanh bằng kích thước',
        goal: 'Giải khối biến dạng 1 màu (Bạc/Vàng ánh kim) thành hình lập phương phẳng hoàn chỉnh.',
        tips: 'Hãy chọn mặt có viên TÂM DÀY NHẤT (hoặc MỎNG NHẤT) làm "Mặt Trắng" ở đáy! Dùng ngón tay sờ độ phẳng giữa viên cạnh và viên tâm: khi cạnh phẳng lì với tâm nghĩa là đã khớp đúng màu. Toàn bộ công thức giống hệt Rubik 3×3×3.',
        formulas: [
          {
            name: 'Kiểm tra độ phẳng góc (Sexy Move 3×3)',
            formula: "R U R' U'",
            usage: 'Dùng để xoay góc Mirror Cube cho tới khi mặt đáy phẳng tuyệt đối.',
            canDemo3d: true,
          },
          {
            name: 'Phẳng hóa mặt đỉnh Mirror (Sune 3×3)',
            formula: "R U R' U R U2 R'",
            usage: 'Làm toàn bộ 9 mảnh mặt trên phẳng cùng 1 cao độ.',
            canDemo3d: true,
          },
        ],
      },
    ],
  },
];

const NOTATION_REFERENCE = [
  { code: 'U', desc: 'Mặt Trên thuận 90°' },
  { code: "U'", desc: 'Mặt Trên ngược 90°' },
  { code: 'R', desc: 'Mặt Phải thuận 90°' },
  { code: "R'", desc: 'Mặt Phải ngược 90°' },
  { code: 'L', desc: 'Mặt Trái thuận 90°' },
  { code: "L'", desc: 'Mặt Trái ngược 90°' },
  { code: 'F', desc: 'Mặt Trước thuận 90°' },
  { code: "F'", desc: 'Mặt Trước ngược 90°' },
  { code: 'D', desc: 'Mặt Đáy thuận 90°' },
  { code: 'B', desc: 'Mặt Sau thuận 90°' },
  { code: 'R2', desc: 'Xoay mặt Phải 180°' },
  { code: 'Rw', desc: 'Xoay 2 lớp Phải (4×4)' },
];

export const RubikGuidesModal: React.FC<RubikGuidesModalProps> = ({
  isOpen,
  onClose,
  onDemoFormula,
}) => {
  const [selectedCube, setSelectedCube] = useState<CubeGuideId>('3x3');
  const [showNotation, setShowNotation] = useState(false);

  if (!isOpen) return null;

  const activeGuide = CUBE_GUIDES.find((g) => g.id === selectedCube) || CUBE_GUIDES[0];

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-5 bg-slate-950/65"
      role="dialog"
      aria-modal="true"
      aria-label="Hướng dẫn giải theo từng loại Rubik"
    >
      <div className="w-full max-w-4xl max-h-[90dvh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-50/80 dark:bg-slate-900">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
                Hướng dẫn cách chơi theo từng loại Rubik
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Tổng hợp lộ trình giải chuẩn WCA · Nhấn &quot;Thử xoay 3D&quot; để xem trực quan công thức 3×3×3
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Đóng hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cube Type Segmented Tabs */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {CUBE_GUIDES.map((cube) => {
              const active = cube.id === selectedCube;
              return (
                <button
                  key={cube.id}
                  type="button"
                  onClick={() => setSelectedCube(cube.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cube.shortLabel}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowNotation((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border whitespace-nowrap inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              showNotation
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {showNotation ? 'Ẩn ký hiệu xoay' : 'Bảng ký hiệu xoay'}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Optional WCA Notation Reference */}
          {showNotation && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Quy ước ký hiệu Singmaster chuẩn WCA</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {NOTATION_REFERENCE.map((item) => (
                  <div
                    key={item.code}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80"
                  >
                    <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400 w-7">
                      {item.code}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Cube Overview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {activeGuide.fullName}
              </h4>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg">
                {activeGuide.difficulty}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeGuide.summary}
            </p>
            <div className="pt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                {activeGuide.methodName}
              </span>
              <span>{activeGuide.notationNote}</span>
            </div>
          </div>

          {/* Step-by-step cards */}
          <div className="space-y-3.5">
            {activeGuide.steps.map((step) => (
              <div
                key={`${activeGuide.id}-${step.stepNumber}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step.stepNumber}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-100">Mục tiêu:</strong>{' '}
                      {step.goal}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      <strong className="text-emerald-700 dark:text-emerald-400">Mẹo thực hành:</strong>{' '}
                      {step.tips}
                    </p>
                  </div>
                </div>

                {step.formulas && step.formulas.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-0 sm:pl-10">
                    {step.formulas.map((f) => (
                      <div
                        key={f.name}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-2"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                              {f.name}
                            </span>
                            {f.canDemo3d && (
                              <button
                                type="button"
                                onClick={() => {
                                  onDemoFormula(f.formula, f.name);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold inline-flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                                title="Xem khối Rubik 3D tự động minh họa công thức này"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                Thử xoay 3D
                              </button>
                            )}
                          </div>
                          <div className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 tracking-wide break-words">
                            {f.formula}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {f.usage}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Mẹo: Học thuộc từng bước một và lặp 3–5 lần trên khối 3D để nhớ tay tự nhiên.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
          >
            Đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};

import { SpaceVectorBlueprint } from './grade12SpaceVectorsCatalog';

export const PARALLEL_SPACE_11_SCORES_KEY = 'edubot_g11_parallel_space_scores_v1';

// Phân hệ 1: Luyện tập theo từng bài học (5 bài, 45 phút/đề, 17 câu: 10 MCQ + 3 Đ/S + 4 TLN)
export const GRADE11_PARALLEL_LESSON_BLUEPRINTS: SpaceVectorBlueprint[] = [
  {
    id: 'quan_he_song_song_11_bai_10',
    code: 'BÀI 10',
    title: 'Bài 10: Đường thẳng và mặt phẳng trong không gian',
    shortTitle: 'Bài 10: Đường thẳng & mặt phẳng',
    subtitle: 'Các tính chất thừa nhận, cách xác định mặt phẳng, hình chóp, hình tứ diện và tìm giao tuyến',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: 'Nhận biết, Thông hiểu và Vận dụng kiến thức Bài 10 (Toán 11 KNTT)',
    topics: [
      'Điểm thuộc mặt phẳng, đường thẳng nằm trong mặt phẳng ($d \\subset (P)$), các tiên đề xác định mặt phẳng',
      'Hình chóp $S.ABCD$, hình tứ diện $ABCD$ và biểu diễn hình học không gian',
      'Tìm giao tuyến của hai mặt phẳng $(P) \\cap (Q) = d$ bằng cách tìm hai điểm chung phân biệt',
      'Tìm giao điểm của đường thẳng và mặt phẳng $d \\cap (P) = \\{M\\}$',
      'Chứng minh ba điểm thẳng hàng và ba đường thẳng đồng quy trong không gian; ứng dụng chân máy ảnh ba chân, khung mái nhà',
    ],
    realWorldTheme: 'Cấu tạo chân máy ảnh 3 chân, khung mái nhà hình chóp và xác định giao tuyến mặt phẳng trong xây dựng',
  },
  {
    id: 'quan_he_song_song_11_bai_11',
    code: 'BÀI 11',
    title: 'Bài 11: Hai đường thẳng song song',
    shortTitle: 'Bài 11: Hai đường thẳng song song',
    subtitle: 'Vị trí tương đối của hai đường thẳng trong không gian, tính chất song song và định lí giao tuyến ba mặt phẳng',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: 'Nhận biết, Thông hiểu và Vận dụng kiến thức Bài 11 (Toán 11 KNTT)',
    topics: [
      'Bốn vị trí tương đối của hai đường thẳng trong không gian: trùng nhau, cắt nhau, song song ($a \\parallel b$), chéo nhau',
      'Tính chất bắc cầu của hai đường thẳng song song trong không gian',
      'Định lí về giao tuyến của ba mặt phẳng đôi một cắt nhau theo ba giao tuyến đồng quy hoặc đôi một song song',
      'Tìm giao tuyến của hai mặt phẳng có chứa hai đường thẳng song song (hình chóp có đáy là hình thang, hình bình hành)',
      'Tính tỉ số đoạn thẳng, độ dài giao tuyến và chu vi thiết diện liên quan đến đường thẳng song song',
    ],
    realWorldTheme: 'Các thanh dầm thép song song và chéo nhau trên cầu vượt, giàn giáo công trình và khung nhà kính',
  },
  {
    id: 'quan_he_song_song_11_bai_12',
    code: 'BÀI 12',
    title: 'Bài 12: Đường thẳng và mặt phẳng song song',
    shortTitle: 'Bài 12: Đường thẳng // mặt phẳng',
    subtitle: 'Vị trí tương đối giữa đường thẳng và mặt phẳng, điều kiện song song và tính chất giao tuyến song song',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: 'Nhận biết, Thông hiểu và Vận dụng kiến thức Bài 12 (Toán 11 KNTT)',
    topics: [
      'Vị trí tương đối của đường thẳng $d$ và mặt phẳng $(P)$: nằm trong, cắt nhau, song song ($d \\parallel (P)$)',
      'Dấu hiệu nhận biết đường thẳng song song với mặt phẳng ($d \\not\\subset (P), d \\parallel a, a \\subset (P)$)',
      'Tính chất: nếu $d \\parallel (P)$ và $(Q) \\supset d$ cắt $(P)$ theo giao tuyến $d\'$ thì $d\' \\parallel d$',
      'Xác định thiết diện của hình chóp cắt bởi mặt phẳng song song với một đường thẳng cho trước',
      'Tính tỉ số đoạn thẳng, diện tích thiết diện (hình thang, hình bình hành) và ứng dụng thanh xà ngang song song mặt sàn',
    ],
    realWorldTheme: 'Lắp đặt hệ thống thanh ray, đường ống song song với trần nhà và cánh cửa mở quay trong kiến trúc',
  },
  {
    id: 'quan_he_song_song_11_bai_13',
    code: 'BÀI 13',
    title: 'Bài 13: Hai mặt phẳng song song',
    shortTitle: 'Bài 13: Hai mặt phẳng song song',
    subtitle: 'Điều kiện song song của hai mặt phẳng, định lí Thales trong không gian, hình lăng trụ và hình hộp',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: 'Nhận biết, Thông hiểu và Vận dụng kiến thức Bài 13 (Toán 11 KNTT)',
    topics: [
      'Định nghĩa và điều kiện để hai mặt phẳng song song ($(P) \\parallel (Q)$)',
      'Tính chất hai mặt phẳng song song bị cắt bởi mặt phẳng thứ ba tạo ra hai giao tuyến song song',
      'Định lí Thales trong không gian: ba mặt phẳng đôi một song song chắn trên hai cát tuyến các đoạn thẳng tương ứng tỉ lệ',
      'Hình lăng trụ $ABC.A\'B\'C\'$, hình hộp $ABCD.A\'B\'C\'D\'$, hình chóp cụt và tính chất các mặt bên, đường chéo',
      'Tính tỉ số đoạn thẳng, diện tích mặt cắt song song với đáy của hình chóp/hình chóp cụt trong thực tế xây dựng',
    ],
    realWorldTheme: 'Các tầng sàn song song của tòa nhà cao tầng, mặt nước trong bể nghiêng và kết cấu tháp hình chóp cụt',
  },
  {
    id: 'quan_he_song_song_11_bai_14',
    code: 'BÀI 14',
    title: 'Bài 14: Phép chiếu song song',
    shortTitle: 'Bài 14: Phép chiếu song song',
    subtitle: 'Định nghĩa phép chiếu song song, tính chất bảo toàn tính song song, tỉ số đoạn thẳng và hình biểu diễn',
    category: 'lesson',
    groupLabel: 'Phân hệ 1 · Luyện tập theo bài (45 phút)',
    durationMinutes: 45,
    part1Count: 10,
    part2Count: 3,
    part3Count: 4,
    totalQuestions: 17,
    maxRawScore: 7.5,
    difficultyFocus: 'Nhận biết, Thông hiểu và Vận dụng kiến thức Bài 14 (Toán 11 KNTT)',
    topics: [
      'Khái niệm phép chiếu song song lên mặt phẳng $(P)$ theo phương chiếu $l$',
      'Tính chất của phép chiếu song song: biến đường thẳng thành đường thẳng, biến hai đường thẳng song song thành song song hoặc trùng nhau',
      'Tính chất bảo toàn thứ tự ba điểm thẳng hàng và bảo toàn tỉ số của hai đoạn thẳng cùng nằm trên một đường thẳng hoặc trên hai đường thẳng song song',
      'Hình biểu diễn của tam giác, hình bình hành, hình thang, hình tròn (elip), hình lập phương, hình lăng trụ trong không gian',
      'Bài toán thực tế về bóng nắng (tia sáng mặt trời song song) của cột cờ, tòa nhà, biển quảng cáo lên mặt sân phẳng',
    ],
    realWorldTheme: 'Bóng của các cột đèn, biển hiệu và khung giàn dưới ánh nắng mặt trời (các tia sáng song song) trên sân phẳng',
  },
];

// Phân hệ 2 - Nhóm A: 10 Đề chuẩn cấu trúc TN THPT của Bộ GD&ĐT (90 phút, 22 câu, 10 điểm)
const GRADE11_PARALLEL_TN_THEMES: Array<{ subtitle: string; theme: string }> = [
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế kiến trúc mái chóp & bóng nắng phép chiếu song song',
    theme: 'Thiết kế mái vòm hình chóp tứ giác đều $S.ABCD$ của nhà bảo tàng và bóng đổ dưới ánh nắng song song',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế tòa nhà nhiều tầng & định lí Thales trong không gian',
    theme: 'Các sàn tầng song song của tòa nhà văn phòng và cầu thang bộ nghiêng chắn giữa các tầng theo định lí Thales',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế giàn giáo thép & giao tuyến mặt phẳng xây dựng',
    theme: 'Hệ khung giàn giáo hình lăng trụ tam giác $ABC.A\'B\'C\'$ và thanh giằng chéo trong thi công xây dựng',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế bóng đổ của khung biển quảng cáo & phép chiếu song song',
    theme: 'Chiếu bóng song song của tấm pano hình chữ nhật và cột chống lên mặt sân quảng trường phẳng',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế nội thất tủ kệ song song & mặt cắt hình hộp',
    theme: 'Thiết kế kệ sách gỗ dạng hình hộp $ABCD.A\'B\'C\'D\'$ với các vách ngăn song song và đường cắt trang trí',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế kết cấu mái hiên & mặt phẳng song song',
    theme: 'Khung mái hiên di động song song mặt đất và thanh chống nghiêng của nhà thi đấu thể thao',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế mặt nước trong bể kính hình hộp & thiết diện',
    theme: 'Mực nước nằm ngang song song đáy trong bể cá hình hộp chữ nhật khi đặt nghiêng trên giá đỡ',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế tháp nước hình chóp cụt & tỉ số đoạn thẳng',
    theme: 'Kết cấu tháp quan sát hình chóp cụt tứ giác đều với các sàn ngắm cảnh song song với mặt đáy',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế vẽ kỹ thuật hình chiếu song song trong cơ khí',
    theme: 'Bản vẽ hình chiếu trục đo song song của chi tiết máy dạng lăng trụ và hình hộp trong xưởng cơ khí',
  },
  {
    subtitle: 'Phủ đều Bài 10–14 · Tích hợp thực tế cầu đi bộ & hệ dầm song song trong không gian',
    theme: 'Hệ thống dầm cầu đi bộ vượt đường song song mặt đường và các cột trụ đỡ phân chia theo tỉ lệ Thales',
  },
];

export const GRADE11_PARALLEL_TN_BLUEPRINTS: SpaceVectorBlueprint[] = GRADE11_PARALLEL_TN_THEMES.map(
  (item, idx) => {
    const numStr = String(idx + 1).padStart(2, '0');
    return {
      id: `quan_he_song_song_11_de_${numStr}`,
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
      difficultyFocus:
        'Chuẩn ma trận đề thi TN THPT Bộ GD&ĐT (40% NB - 30% TH - 20% VD - 10% VDC), phủ đều cả 5 bài (Bài 10 đến Bài 14) và bài toán thực tế kiến trúc/xây dựng/phép chiếu song song',
      topics: [
        'Đường thẳng và mặt phẳng trong không gian, giao tuyến, giao điểm (Bài 10)',
        'Hai đường thẳng song song, chéo nhau và định lí giao tuyến ba mặt phẳng (Bài 11)',
        'Đường thẳng song song với mặt phẳng và thiết diện song song (Bài 12)',
        'Hai mặt phẳng song song, định lí Thales trong không gian, hình lăng trụ và hình hộp (Bài 13)',
        'Phép chiếu song song, bảo toàn tỉ số đoạn thẳng và bài toán thực tế bóng nắng/kiến trúc (Bài 14)',
      ],
      realWorldTheme: item.theme,
    };
  }
);

// Phân hệ 2 - Nhóm B: 5 Đề ôn tập chương tổng hợp (90 phút, 22 câu, 10 điểm, phân hóa VD & VDC)
const GRADE11_PARALLEL_REVIEW_THEMES: Array<{ subtitle: string; theme: string; focus: string }> = [
  {
    subtitle: 'Phân hóa VD–VDC · Giao tuyến, giao điểm và bài toán đồng quy/thẳng hàng trong hình chóp',
    theme: 'Xác định đường cắt và giao tuyến của hệ mái vòm kiến trúc phức hợp dạng hình chóp $S.ABCD$',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): xác định giao tuyến, giao điểm nâng cao, tính tỉ số bằng định lí Menelaus và Thales trong không gian',
  },
  {
    subtitle: 'Phân hóa VD–VDC · Thiết diện song song với đường thẳng & tính chu vi, diện tích thiết diện',
    theme: 'Tính diện tích mặt cắt kính cường lực song song cạnh bên của khối kiến trúc hình chóp tứ giác đều',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): dựng và tính diện tích thiết diện hình thang, hình bình hành, ngũ giác cắt bởi mặt phẳng song song',
  },
  {
    subtitle: 'Phân hóa VD–VDC · Hai mặt phẳng song song, lăng trụ & định lí Thales tính tỉ số đoạn thẳng',
    theme: 'Phân chia các thanh chịu lực trên khối lăng trụ $ABC.A\'B\'C\'$ bằng các mặt phẳng song song theo tỉ lệ thiết kế',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): thiết diện trong lăng trụ và hình hộp, định lí Thales trong không gian và bài toán quỹ tích giao điểm',
  },
  {
    subtitle: 'Phân hóa VD–VDC · Phép chiếu song song, tỉ số diện tích và bài toán cực trị thiết diện',
    theme: 'Tối ưu diện tích bóng râm tạo bởi mái che di động theo phương chiếu nắng song song trong khuôn viên trường',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (35% VD - 20% VDC): bài toán cực trị diện tích thiết diện phụ thuộc tham số $x$, ứng dụng phép chiếu song song bảo toàn tỉ số',
  },
  {
    subtitle: 'Phân hóa VD–VDC · Tổng hợp toàn diện Chương IV chuẩn mục tiêu 9+ học sinh giỏi',
    theme: 'Bài toán tổng hợp thiết kế mô hình kim tự tháp kính và hệ sàn liên tầng song song trong không gian',
    focus: 'Tăng cường Vận dụng & Vận dụng cao (40% VD - 20% VDC): tổng hợp toàn bộ dạng toán khó Chương IV Toán 11 KNTT (giao tuyến, thiết diện, tỉ số Thales, phép chiếu song song)',
  },
];

export const GRADE11_PARALLEL_REVIEW_BLUEPRINTS: SpaceVectorBlueprint[] =
  GRADE11_PARALLEL_REVIEW_THEMES.map((item, idx) => {
    const numStr = String(idx + 1).padStart(2, '0');
    return {
      id: `quan_he_song_song_11_on_tap_${numStr}`,
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
        'Xác định giao tuyến của hai mặt phẳng và giao điểm của đường thẳng với mặt phẳng trong hình chóp, hình lăng trụ',
        'Xác định thiết diện của hình chóp, hình lăng trụ cắt bởi mặt phẳng song song với đường thẳng hoặc mặt phẳng',
        'Tính tỉ số đoạn thẳng bằng định lí Thales trong không gian và tính diện tích thiết diện',
        'Phép chiếu song song và bài toán thực tế kiến trúc, xây dựng mức độ Vận dụng – Vận dụng cao',
      ],
      realWorldTheme: item.theme,
    };
  });

export const ALL_GRADE11_PARALLEL_BLUEPRINTS: SpaceVectorBlueprint[] = [
  ...GRADE11_PARALLEL_LESSON_BLUEPRINTS,
  ...GRADE11_PARALLEL_TN_BLUEPRINTS,
  ...GRADE11_PARALLEL_REVIEW_BLUEPRINTS,
];

export function getGrade11ParallelBlueprintById(examId: string): SpaceVectorBlueprint | undefined {
  return ALL_GRADE11_PARALLEL_BLUEPRINTS.find((bp) => bp.id === examId);
}

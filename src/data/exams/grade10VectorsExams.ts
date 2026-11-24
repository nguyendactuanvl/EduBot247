export type VectorQuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface VectorMCOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface VectorMultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  lessonId: string;
  lessonLabel: string;
  question: string;
  options: VectorMCOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface VectorTFStatement {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface VectorTrueFalseQuestion {
  id: string;
  type: 'true_false';
  lessonId: string;
  lessonLabel: string;
  question: string;
  statements: VectorTFStatement[];
  explanation: string;
}

export interface VectorShortAnswerQuestion {
  id: string;
  type: 'short_answer';
  lessonId: string;
  lessonLabel: string;
  question: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  unit?: string;
  explanation: string;
}

export type VectorQuestion =
  | VectorMultipleChoiceQuestion
  | VectorTrueFalseQuestion
  | VectorShortAnswerQuestion;

export interface VectorExamSet {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  isFullChapter?: boolean;
  multipleChoice: VectorMultipleChoiceQuestion[];
  trueFalse: VectorTrueFalseQuestion[];
  shortAnswer: VectorShortAnswerQuestion[];
}

export const GRADE10_VECTORS_LESSONS: VectorExamSet[] = [
  // =========================================================================
  // BÀI 7: CÁC KHÁI NIỆM MỞ ĐẦU
  // =========================================================================
  {
    id: 'vec-bai-7',
    code: 'Bài 7',
    title: 'Bài 7: Các khái niệm mở đầu',
    subtitle: 'Định nghĩa vectơ, phương, hướng, hai vectơ bằng nhau và độ dài vectơ',
    durationMinutes: 15,
    multipleChoice: [
      {
        id: 'b7-mc-1',
        type: 'multiple_choice',
        lessonId: 'vec-bai-7',
        lessonLabel: 'Bài 7',
        question: 'Vectơ là một đoạn thẳng:',
        options: [
          { id: 'A', text: 'có hướng.' },
          { id: 'B', text: 'có độ dài bằng $1$.' },
          { id: 'C', text: 'không có điểm đầu và điểm cuối.' },
          { id: 'D', text: 'nằm trên một đường thẳng cố định.' },
        ],
        correctOption: 'A',
        explanation:
          'Theo định nghĩa trong SGK Toán 10 (KNTT): **Vectơ là một đoạn thẳng có hướng**, nghĩa là trong hai điểm mút của đoạn thẳng, đã chỉ rõ điểm đầu và điểm cuối.',
      },
      {
        id: 'b7-mc-2',
        type: 'multiple_choice',
        lessonId: 'vec-bai-7',
        lessonLabel: 'Bài 7',
        question:
          'Cho hai điểm phân biệt $A$ và $B$. Số vectơ khác vectơ-không có điểm đầu và điểm cuối là $A$ hoặc $B$ là:',
        options: [
          { id: 'A', text: '$1$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$3$' },
          { id: 'D', text: '$4$' },
        ],
        correctOption: 'B',
        explanation:
          'Từ hai điểm phân biệt $A$ và $B$, ta lập được đúng $2$ vectơ khác $\\overrightarrow{0}$ là $\\overrightarrow{AB}$ và $\\overrightarrow{BA}$.',
      },
      {
        id: 'b7-mc-3',
        type: 'multiple_choice',
        lessonId: 'vec-bai-7',
        lessonLabel: 'Bài 7',
        question: 'Hai vectơ được gọi là bằng nhau nếu chúng:',
        options: [
          { id: 'A', text: 'cùng phương và cùng độ dài.' },
          { id: 'B', text: 'cùng hướng và cùng độ dài.' },
          { id: 'C', text: 'ngược hướng và cùng độ dài.' },
          { id: 'D', text: 'có giá trùng nhau.' },
        ],
        correctOption: 'B',
        explanation:
          'Hai vectơ $\\overrightarrow{a}$ và $\\overrightarrow{b}$ bằng nhau ($\\overrightarrow{a} = \\overrightarrow{b}$) khi và chỉ khi chúng **cùng hướng** và **cùng độ dài**.',
      },
      {
        id: 'b7-mc-4',
        type: 'multiple_choice',
        lessonId: 'vec-bai-7',
        lessonLabel: 'Bài 7',
        question:
          'Cho lục giác đều $ABCDEF$ tâm $O$. Số vectơ khác vectơ-không cùng phương với $\\overrightarrow{OC}$ có điểm đầu và điểm cuối là các đỉnh của lục giác là:',
        options: [
          { id: 'A', text: '$4$' },
          { id: 'B', text: '$6$' },
          { id: 'C', text: '$7$' },
          { id: 'D', text: '$8$' },
        ],
        correctOption: 'B',
        explanation:
          'Trong lục giác đều $ABCDEF$ tâm $O$, các đường thẳng đi qua các đỉnh và song song hoặc trùng với đường thẳng $OC$ gồm: đường chéo $FC$ và hai cạnh đối $AB, ED$. Trên mỗi đường thẳng đó có $2$ vectơ ngược hướng nhau:\n- Trên $FC$: $\\overrightarrow{FC}, \\overrightarrow{CF}$.\n- Trên $AB$: $\\overrightarrow{AB}, \\overrightarrow{BA}$.\n- Trên $ED$: $\\overrightarrow{ED}, \\overrightarrow{DE}$.\n\nTổng cộng có $6$ vectơ thỏa mãn yêu cầu.',
      },
    ],
    trueFalse: [
      {
        id: 'b7-tf-5',
        type: 'true_false',
        lessonId: 'vec-bai-7',
        lessonLabel: 'Bài 7',
        question:
          'Cho hình bình hành $ABCD$ có tâm $O$. Xét tính đúng, sai của các khẳng định sau:',
        statements: [
          {
            id: 'a',
            text: '$\\overrightarrow{AB} = \\overrightarrow{CD}$.',
            isCorrect: false,
            explanation:
              'Sai. Trong hình bình hành $ABCD$, hai vectơ $\\overrightarrow{AB}$ và $\\overrightarrow{CD}$ có cùng độ dài nhưng **ngược hướng**. Đẳng thức đúng phải là $\\overrightarrow{AB} = \\overrightarrow{DC}$.',
          },
          {
            id: 'b',
            text: '$\\overrightarrow{AD}$ và $\\overrightarrow{BC}$ là hai vectơ cùng hướng.',
            isCorrect: true,
            explanation:
              'Đúng. Hai cạnh đối $AD$ và $BC$ song song và cùng chiều từ $A \\to D$ tương ứng $B \\to C$, nên $\\overrightarrow{AD}$ và $\\overrightarrow{BC}$ cùng hướng (thậm chí bằng nhau).',
          },
          {
            id: 'c',
            text: '$|\\overrightarrow{OA}| = |\\overrightarrow{OC}|$.',
            isCorrect: true,
            explanation:
              'Đúng. Tâm $O$ là trung điểm của đường chéo $AC$ nên $OA = OC$, suy ra $|\\overrightarrow{OA}| = |\\overrightarrow{OC}|$.',
          },
          {
            id: 'd',
            text: '$\\overrightarrow{OB} = \\overrightarrow{DO}$.',
            isCorrect: true,
            explanation:
              'Đúng. Vì $O$ là trung điểm của $BD$ nên $DO = OB$ và hai vectơ $\\overrightarrow{DO}, \\overrightarrow{OB}$ cùng hướng theo chiều từ $D$ đến $B$, do đó $\\overrightarrow{OB} = \\overrightarrow{DO}$.',
          },
        ],
        explanation:
          'Sử dụng tính chất cạnh đối song song, bằng nhau và hai đường chéo cắt nhau tại trung điểm $O$ của hình bình hành $ABCD$: a) Sai, b) Đúng, c) Đúng, d) Đúng.',
      },
    ],
    shortAnswer: [
      {
        id: 'b7-sa-6',
        type: 'short_answer',
        lessonId: 'vec-bai-7',
        lessonLabel: 'Bài 7',
        question:
          'Cho hình vuông $ABCD$ có cạnh bằng $2$. Tính độ dài của vectơ $\\overrightarrow{AC}$ (kết quả làm tròn đến hàng phần trăm).',
        correctAnswer: '2.83',
        acceptableAnswers: ['2.83', '2,83'],
        explanation:
          'Độ dài vectơ $\\overrightarrow{AC}$ chính là độ dài đường chéo $AC$ của hình vuông $ABCD$ cạnh $a = 2$.\nÁp dụng định lí Pytago cho tam giác vuông $ABC$:\n$$|\\overrightarrow{AC}| = AC = \\sqrt{AB^2 + BC^2} = \\sqrt{2^2 + 2^2} = \\sqrt{8} = 2\\sqrt{2} \\approx 2{,}8284 \\approx 2{,}83.$$',
      },
    ],
  },

  // =========================================================================
  // BÀI 8: TỔNG VÀ HIỆU CỦA HAI VECTƠ
  // =========================================================================
  {
    id: 'vec-bai-8',
    code: 'Bài 8',
    title: 'Bài 8: Tổng và hiệu của hai vectơ',
    subtitle: 'Quy tắc ba điểm, quy tắc hình bình hành, quy tắc hiệu và ứng dụng hợp lực',
    durationMinutes: 15,
    multipleChoice: [
      {
        id: 'b8-mc-1',
        type: 'multiple_choice',
        lessonId: 'vec-bai-8',
        lessonLabel: 'Bài 8',
        question: 'Với ba điểm bất kì $A, B, C$, khẳng định nào sau đây đúng?',
        options: [
          { id: 'A', text: '$\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}$' },
          { id: 'B', text: '$\\overrightarrow{AB} - \\overrightarrow{BC} = \\overrightarrow{AC}$' },
          { id: 'C', text: '$\\overrightarrow{AB} + \\overrightarrow{AC} = \\overrightarrow{BC}$' },
          { id: 'D', text: '$\\overrightarrow{CA} - \\overrightarrow{BA} = \\overrightarrow{BC}$' },
        ],
        correctOption: 'A',
        explanation:
          'Theo **quy tắc ba điểm** với ba điểm bất kì $A, B, C$, ta luôn có $\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}$.',
      },
      {
        id: 'b8-mc-2',
        type: 'multiple_choice',
        lessonId: 'vec-bai-8',
        lessonLabel: 'Bài 8',
        question: 'Cho hình bình hành $ABCD$. Đẳng thức nào sau đây đúng?',
        options: [
          { id: 'A', text: '$\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{BD}$' },
          { id: 'B', text: '$\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{AC}$' },
          { id: 'C', text: '$\\overrightarrow{AB} - \\overrightarrow{AD} = \\overrightarrow{AC}$' },
          { id: 'D', text: '$\\overrightarrow{BA} + \\overrightarrow{BC} = \\overrightarrow{DB}$' },
        ],
        correctOption: 'B',
        explanation:
          'Theo **quy tắc hình bình hành**: nếu $ABCD$ là hình bình hành thì $\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{AC}$.',
      },
      {
        id: 'b8-mc-3',
        type: 'multiple_choice',
        lessonId: 'vec-bai-8',
        lessonLabel: 'Bài 8',
        question:
          'Cho $I$ là trung điểm của đoạn thẳng $AB$ và $M$ là một điểm tùy ý. Khẳng định nào sau đây **sai**?',
        options: [
          { id: 'A', text: '$\\overrightarrow{IA} + \\overrightarrow{IB} = \\overrightarrow{0}$' },
          { id: 'B', text: '$\\overrightarrow{AI} - \\overrightarrow{BI} = \\overrightarrow{0}$' },
          { id: 'C', text: '$\\overrightarrow{MA} + \\overrightarrow{MB} = \\overrightarrow{MI} + \\overrightarrow{MI}$' },
          { id: 'D', text: '$\\overrightarrow{AB} - \\overrightarrow{AI} = \\overrightarrow{IB}$' },
        ],
        correctOption: 'B',
        explanation:
          'Xét đáp án B: $\\overrightarrow{AI} - \\overrightarrow{BI} = \\overrightarrow{AI} + \\overrightarrow{IB} = \\overrightarrow{AB} \\neq \\overrightarrow{0}$ (vì $A, B$ là hai đầu mút đoạn thẳng). Các khẳng định A, C, D đều đúng.',
      },
      {
        id: 'b8-mc-4',
        type: 'multiple_choice',
        lessonId: 'vec-bai-8',
        lessonLabel: 'Bài 8',
        question:
          'Cho tam giác đều $ABC$ có cạnh bằng $a$. Độ dài của vectơ $\\overrightarrow{AB} + \\overrightarrow{AC}$ bằng:',
        options: [
          { id: 'A', text: '$a\\sqrt{3}$' },
          { id: 'B', text: '$\\frac{a\\sqrt{3}}{2}$' },
          { id: 'C', text: '$2a$' },
          { id: 'D', text: '$a$' },
        ],
        correctOption: 'A',
        explanation:
          'Gọi $M$ là trung điểm của $BC$ và dựng hình bình hành $ABDC$. Theo quy tắc hình bình hành, $\\overrightarrow{AB} + \\overrightarrow{AC} = \\overrightarrow{AD}$ và $AD = 2AM$.\nVì tam giác $ABC$ đều cạnh $a$ nên đường cao $AM = \\frac{a\\sqrt{3}}{2}$.\nDo đó $|\\overrightarrow{AB} + \\overrightarrow{AC}| = 2 \\cdot \\frac{a\\sqrt{3}}{2} = a\\sqrt{3}$.',
      },
    ],
    trueFalse: [
      {
        id: 'b8-tf-5',
        type: 'true_false',
        lessonId: 'vec-bai-8',
        lessonLabel: 'Bài 8',
        question:
          'Cho tam giác $ABC$ vuông tại $A$ có $AB = 3$, $AC = 4$ và $M$ là trung điểm của $BC$. Xét tính đúng, sai của các khẳng định sau:',
        statements: [
          {
            id: 'a',
            text: '$|\\overrightarrow{AB} + \\overrightarrow{AC}| = 5$.',
            isCorrect: true,
            explanation:
              'Đúng. Dựng hình chữ nhật $ABDC$, ta có $\\overrightarrow{AB} + \\overrightarrow{AC} = \\overrightarrow{AD}$ nên $|\\overrightarrow{AB} + \\overrightarrow{AC}| = AD = BC = \\sqrt{3^2 + 4^2} = 5$.',
          },
          {
            id: 'b',
            text: '$|\\overrightarrow{AB} - \\overrightarrow{AC}| = 5$.',
            isCorrect: true,
            explanation:
              'Đúng. Theo quy tắc hiệu: $\\overrightarrow{AB} - \\overrightarrow{AC} = \\overrightarrow{CB}$, suy ra $|\\overrightarrow{AB} - \\overrightarrow{AC}| = CB = 5$.',
          },
          {
            id: 'c',
            text: '$|\\overrightarrow{MB} + \\overrightarrow{MC}| = 0$.',
            isCorrect: true,
            explanation:
              'Đúng. Vì $M$ là trung điểm của $BC$ nên $\\overrightarrow{MB} + \\overrightarrow{MC} = \\overrightarrow{0}$, suy ra $|\\overrightarrow{MB} + \\overrightarrow{MC}| = 0$.',
          },
          {
            id: 'd',
            text: '$|\\overrightarrow{CA} - \\overrightarrow{CB}| = 3$.',
            isCorrect: true,
            explanation:
              'Đúng. Ta có $\\overrightarrow{CA} - \\overrightarrow{CB} = \\overrightarrow{BA}$, suy ra $|\\overrightarrow{CA} - \\overrightarrow{CB}| = BA = AB = 3$.',
          },
        ],
        explanation:
          'Tam giác $ABC$ vuông tại $A$ có $BC = \\sqrt{3^2 + 4^2} = 5$. Cả 4 khẳng định a, b, c, d đều Đúng.',
      },
    ],
    shortAnswer: [
      {
        id: 'b8-sa-6',
        type: 'short_answer',
        lessonId: 'vec-bai-8',
        lessonLabel: 'Bài 8',
        question:
          'Hai lực $\\overrightarrow{F_1}, \\overrightarrow{F_2}$ cùng tác động vào một chất điểm $O$ và tạo với nhau một góc $60^\\circ$. Biết cường độ của hai lực đều bằng $10\\text{ N}$. Tính cường độ của hợp lực $\\overrightarrow{F} = \\overrightarrow{F_1} + \\overrightarrow{F_2}$ (đơn vị: N, làm tròn đến hàng phần mười).',
        correctAnswer: '17.3',
        acceptableAnswers: ['17.3', '17,3'],
        unit: 'N',
        explanation:
          'Dựng hình thoi $OACB$ có $OA = OB = 10$ và $\\widehat{AOB} = 60^\\circ$. Khi đó $\\overrightarrow{F} = \\overrightarrow{OA} + \\overrightarrow{OB} = \\overrightarrow{OC}$.\nCường độ hợp lực là độ dài đường chéo $OC$:\n$$F = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos 60^\\circ} = \\sqrt{10^2 + 10^2 + 2 \\cdot 10 \\cdot 10 \\cdot \\frac{1}{2}} = \\sqrt{300} = 10\\sqrt{3} \\approx 17{,}32 \\approx 17{,}3\\text{ N}.$$',
      },
    ],
  },

  // =========================================================================
  // BÀI 9: TÍCH CỦA MỘT VECTƠ VỚI MỘT SỐ
  // =========================================================================
  {
    id: 'vec-bai-9',
    code: 'Bài 9',
    title: 'Bài 9: Tích của một vectơ với một số',
    subtitle: 'Định nghĩa, tính chất trung điểm, trọng tâm và điều kiện 3 điểm thẳng hàng',
    durationMinutes: 15,
    multipleChoice: [
      {
        id: 'b9-mc-1',
        type: 'multiple_choice',
        lessonId: 'vec-bai-9',
        lessonLabel: 'Bài 9',
        question: 'Cho vectơ $\\overrightarrow{a} \\neq \\overrightarrow{0}$ và số thực $k < 0$. Khẳng định nào sau đây đúng?',
        options: [
          { id: 'A', text: 'Vectơ $k\\overrightarrow{a}$ cùng hướng với vectơ $\\overrightarrow{a}$.' },
          { id: 'B', text: 'Vectơ $k\\overrightarrow{a}$ ngược hướng với vectơ $\\overrightarrow{a}$.' },
          { id: 'C', text: 'Độ dài vectơ $k\\overrightarrow{a}$ bằng $k|\\overrightarrow{a}|$.' },
          { id: 'D', text: 'Vectơ $k\\overrightarrow{a}$ không cùng phương với vectơ $\\overrightarrow{a}$.' },
        ],
        correctOption: 'B',
        explanation:
          'Với $k < 0$ và $\\overrightarrow{a} \\neq \\overrightarrow{0}$, vectơ $k\\overrightarrow{a}$ **ngược hướng** với $\\overrightarrow{a}$ và có độ dài bằng $|k|\\cdot|\\overrightarrow{a}| = -k|\\overrightarrow{a}|$.',
      },
      {
        id: 'b9-mc-2',
        type: 'multiple_choice',
        lessonId: 'vec-bai-9',
        lessonLabel: 'Bài 9',
        question: 'Cho $G$ là trọng tâm tam giác $ABC$ và $M$ là trung điểm của $BC$. Đẳng thức nào sau đây đúng?',
        options: [
          { id: 'A', text: '$\\overrightarrow{AG} = 2\\overrightarrow{GM}$' },
          { id: 'B', text: '$\\overrightarrow{GA} = 2\\overrightarrow{GM}$' },
          { id: 'C', text: '$\\overrightarrow{AG} = \\frac{3}{2}\\overrightarrow{AM}$' },
          { id: 'D', text: '$\\overrightarrow{GB} + \\overrightarrow{GC} = \\overrightarrow{GA}$' },
        ],
        correctOption: 'A',
        explanation:
          'Trọng tâm $G$ nằm trên đường trung tuyến $AM$ sao cho $AG = 2GM$, đồng thời $\\overrightarrow{AG}$ và $\\overrightarrow{GM}$ cùng hướng (từ $A$ đến $M$). Vậy $\\overrightarrow{AG} = 2\\overrightarrow{GM}$.',
      },
      {
        id: 'b9-mc-3',
        type: 'multiple_choice',
        lessonId: 'vec-bai-9',
        lessonLabel: 'Bài 9',
        question:
          'Cho đoạn thẳng $AB$ và điểm $M$ thuộc đoạn $AB$ sao cho $AM = \\frac{2}{5}AB$. Khẳng định nào sau đây đúng?',
        options: [
          { id: 'A', text: '$\\overrightarrow{AM} = \\frac{2}{3}\\overrightarrow{MB}$' },
          { id: 'B', text: '$\\overrightarrow{AM} = -\\frac{2}{3}\\overrightarrow{MB}$' },
          { id: 'C', text: '$\\overrightarrow{MA} = \\frac{2}{5}\\overrightarrow{AB}$' },
          { id: 'D', text: '$\\overrightarrow{BM} = \\frac{3}{5}\\overrightarrow{AB}$' },
        ],
        correctOption: 'A',
        explanation:
          'Vì $M$ nằm giữa $A$ và $B$ với $AM = \\frac{2}{5}AB$, ta có $MB = AB - AM = \\frac{3}{5}AB$, suy ra $\\frac{AM}{MB} = \\frac{2}{3}$. Hai vectơ $\\overrightarrow{AM}$ và $\\overrightarrow{MB}$ cùng hướng nên $\\overrightarrow{AM} = \\frac{2}{3}\\overrightarrow{MB}$.',
      },
      {
        id: 'b9-mc-4',
        type: 'multiple_choice',
        lessonId: 'vec-bai-9',
        lessonLabel: 'Bài 9',
        question:
          'Điều kiện cần và đủ để ba điểm phân biệt $A, B, C$ thẳng hàng là tồn tại số thực $k \\neq 0$ sao cho:',
        options: [
          { id: 'A', text: '$\\overrightarrow{AB} = k\\overrightarrow{AC}$' },
          { id: 'B', text: '$|\\overrightarrow{AB}| = k|\\overrightarrow{AC}|$' },
          { id: 'C', text: '$\\overrightarrow{AB} + \\overrightarrow{AC} = k\\overrightarrow{BC}$' },
          { id: 'D', text: '$\\overrightarrow{AB} = k\\overrightarrow{AB}$' },
        ],
        correctOption: 'A',
        explanation:
          'Ba điểm phân biệt $A, B, C$ thẳng hàng khi và chỉ khi hai vectơ $\\overrightarrow{AB}$ và $\\overrightarrow{AC}$ cùng phương, tức là tồn tại số thực $k \\neq 0$ sao cho $\\overrightarrow{AB} = k\\overrightarrow{AC}$.',
      },
    ],
    trueFalse: [
      {
        id: 'b9-tf-5',
        type: 'true_false',
        lessonId: 'vec-bai-9',
        lessonLabel: 'Bài 9',
        question:
          'Cho tam giác $ABC$ có $M, N$ lần lượt là trung điểm của $AB, AC$ và $G$ là trọng tâm tam giác. Xét tính đúng, sai của các khẳng định sau:',
        statements: [
          {
            id: 'a',
            text: '$\\overrightarrow{MN} = \\frac{1}{2}\\overrightarrow{BC}$.',
            isCorrect: true,
            explanation:
              'Đúng. $MN$ là đường trung bình của tam giác $ABC$ nên $MN \\parallel BC$, $MN = \\frac{1}{2}BC$ và cùng hướng từ trái sang phải ($M \\to N$ và $B \\to C$).',
          },
          {
            id: 'b',
            text: '$\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} = \\overrightarrow{0}$.',
            isCorrect: true,
            explanation:
              'Đúng. Đây là hệ thức vectơ đặc trưng của trọng tâm $G$ trong tam giác $ABC$.',
          },
          {
            id: 'c',
            text: 'Với điểm $O$ bất kì, $\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} = 3\\overrightarrow{OG}$.',
            isCorrect: true,
            explanation:
              'Đúng. Chèn điểm $G$ vào vế trái: $3\\overrightarrow{OG} + (\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC}) = 3\\overrightarrow{OG} + \\overrightarrow{0} = 3\\overrightarrow{OG}$.',
          },
          {
            id: 'd',
            text: '$\\overrightarrow{AN} = \\frac{1}{2}\\overrightarrow{AB} + \\frac{1}{2}\\overrightarrow{AC}$.',
            isCorrect: false,
            explanation:
              'Sai. Vì $N$ là trung điểm của $AC$ nên $\\overrightarrow{AN} = \\frac{1}{2}\\overrightarrow{AC}$. Biểu thức $\\frac{1}{2}\\overrightarrow{AB} + \\frac{1}{2}\\overrightarrow{AC}$ là vectơ trung tuyến kẻ từ $A$ đến trung điểm $BC$.',
          },
        ],
        explanation:
          'Áp dụng tính chất đường trung bình và trọng tâm tam giác: a) Đúng, b) Đúng, c) Đúng, d) Sai.',
      },
    ],
    shortAnswer: [
      {
        id: 'b9-sa-6',
        type: 'short_answer',
        lessonId: 'vec-bai-9',
        lessonLabel: 'Bài 9',
        question:
          'Cho tam giác $ABC$. Điểm $I$ thỏa mãn $\\overrightarrow{IA} + 2\\overrightarrow{IB} = \\overrightarrow{0}$ và điểm $J$ thỏa mãn $\\overrightarrow{JA} + 2\\overrightarrow{JB} + 3\\overrightarrow{JC} = \\overrightarrow{0}$. Biết rằng đường thẳng $IJ$ luôn đi qua một điểm cố định $C$ và $\\overrightarrow{JC} = k\\overrightarrow{JI}$. Tìm giá trị của $k$.',
        correctAnswer: '-1',
        acceptableAnswers: ['-1'],
        explanation:
          'Chèn điểm $I$ vào hệ thức $\\overrightarrow{JA} + 2\\overrightarrow{JB} + 3\\overrightarrow{JC} = \\overrightarrow{0}$:\n$$(\\overrightarrow{JI} + \\overrightarrow{IA}) + 2(\\overrightarrow{JI} + \\overrightarrow{IB}) + 3\\overrightarrow{JC} = \\overrightarrow{0}$$\n$$\\Leftrightarrow 3\\overrightarrow{JI} + (\\overrightarrow{IA} + 2\\overrightarrow{IB}) + 3\\overrightarrow{JC} = \\overrightarrow{0}.$$\nVì $\\overrightarrow{IA} + 2\\overrightarrow{IB} = \\overrightarrow{0}$ nên $3\\overrightarrow{JI} + 3\\overrightarrow{JC} = \\overrightarrow{0} \\Leftrightarrow \\overrightarrow{JC} = -\\overrightarrow{JI}$.\nSuy ra $k = -1$.',
      },
    ],
  },

  // =========================================================================
  // BÀI 10: VECTƠ TRONG MẶT PHẲNG TỌA ĐỘ
  // =========================================================================
  {
    id: 'vec-bai-10',
    code: 'Bài 10',
    title: 'Bài 10: Vectơ trong mặt phẳng tọa độ',
    subtitle: 'Tọa độ vectơ, tọa độ điểm, công thức trung điểm, trọng tâm và hai vectơ cùng phương',
    durationMinutes: 15,
    multipleChoice: [
      {
        id: 'b10-mc-1',
        type: 'multiple_choice',
        lessonId: 'vec-bai-10',
        lessonLabel: 'Bài 10',
        question: 'Trong mặt phẳng tọa độ $Oxy$, cho $\\overrightarrow{u} = 2\\overrightarrow{i} - 3\\overrightarrow{j}$. Tọa độ của vectơ $\\overrightarrow{u}$ là:',
        options: [
          { id: 'A', text: '$(2; 3)$' },
          { id: 'B', text: '$(-2; 3)$' },
          { id: 'C', text: '$(2; -3)$' },
          { id: 'D', text: '$(-3; 2)$' },
        ],
        correctOption: 'C',
        explanation:
          'Vectơ $\\overrightarrow{u} = x\\overrightarrow{i} + y\\overrightarrow{j}$ có tọa độ là $(x; y)$. Với $\\overrightarrow{u} = 2\\overrightarrow{i} - 3\\overrightarrow{j}$, ta có $\\overrightarrow{u} = (2; -3)$.',
      },
      {
        id: 'b10-mc-2',
        type: 'multiple_choice',
        lessonId: 'vec-bai-10',
        lessonLabel: 'Bài 10',
        question: 'Trong mặt phẳng $Oxy$, cho hai điểm $A(1; -2)$ và $B(4; 3)$. Tọa độ của vectơ $\\overrightarrow{AB}$ là:',
        options: [
          { id: 'A', text: '$(3; 5)$' },
          { id: 'B', text: '$(-3; -5)$' },
          { id: 'C', text: '$(5; 1)$' },
          { id: 'D', text: '$(3; 1)$' },
        ],
        correctOption: 'A',
        explanation:
          'Áp dụng công thức $\\overrightarrow{AB} = (x_B - x_A; y_B - y_A)$:\n$$\\overrightarrow{AB} = (4 - 1;\\; 3 - (-2)) = (3; 5).$$',
      },
      {
        id: 'b10-mc-3',
        type: 'multiple_choice',
        lessonId: 'vec-bai-10',
        lessonLabel: 'Bài 10',
        question: 'Cho $\\overrightarrow{a} = (1; -2)$ và $\\overrightarrow{b} = (3; 4)$. Tọa độ của vectơ $\\overrightarrow{c} = 2\\overrightarrow{a} - \\overrightarrow{b}$ là:',
        options: [
          { id: 'A', text: '$(-1; 0)$' },
          { id: 'B', text: '$(-1; -8)$' },
          { id: 'C', text: '$(5; 0)$' },
          { id: 'D', text: '$(1; -8)$' },
        ],
        correctOption: 'B',
        explanation:
          'Ta có $2\\overrightarrow{a} = (2; -4)$. Suy ra:\n$$\\overrightarrow{c} = 2\\overrightarrow{a} - \\overrightarrow{b} = (2 - 3;\\; -4 - 4) = (-1; -8).$$',
      },
      {
        id: 'b10-mc-4',
        type: 'multiple_choice',
        lessonId: 'vec-bai-10',
        lessonLabel: 'Bài 10',
        question:
          'Trong mặt phẳng $Oxy$, cho tam giác $ABC$ với $A(1; 2)$, $B(-3; 0)$, $C(5; 4)$. Tọa độ trọng tâm $G$ của tam giác $ABC$ là:',
        options: [
          { id: 'A', text: '$(3; 6)$' },
          { id: 'B', text: '$(1; 2)$' },
          { id: 'C', text: '$(1; 3)$' },
          { id: 'D', text: '$(-1; 2)$' },
        ],
        correctOption: 'B',
        explanation:
          'Áp dụng công thức tọa độ trọng tâm $G$:\n$$x_G = \\frac{1 + (-3) + 5}{3} = 1, \\quad y_G = \\frac{2 + 0 + 4}{3} = 2 \\implies G(1; 2).$$',
      },
    ],
    trueFalse: [
      {
        id: 'b10-tf-5',
        type: 'true_false',
        lessonId: 'vec-bai-10',
        lessonLabel: 'Bài 10',
        question:
          'Trong mặt phẳng $Oxy$, cho ba điểm $A(1; 1)$, $B(3; 5)$, $C(-1; 3)$. Xét tính đúng, sai của các khẳng định sau:',
        statements: [
          {
            id: 'a',
            text: '$\\overrightarrow{AB} = (2; 4)$.',
            isCorrect: true,
            explanation:
              'Đúng. Ta có $\\overrightarrow{AB} = (3 - 1;\\; 5 - 1) = (2; 4)$.',
          },
          {
            id: 'b',
            text: 'Trung điểm $I$ của đoạn thẳng $AC$ có tọa độ là $(0; 2)$.',
            isCorrect: true,
            explanation:
              'Đúng. $x_I = \\frac{1 + (-1)}{2} = 0$, $y_I = \\frac{1 + 3}{2} = 2 \\implies I(0; 2)$.',
          },
          {
            id: 'c',
            text: 'Ba điểm $A, B, C$ thẳng hàng.',
            isCorrect: false,
            explanation:
              'Sai. Ta có $\\overrightarrow{AB} = (2; 4)$ và $\\overrightarrow{AC} = (-2; 2)$. Vì $\\frac{2}{-2} \\neq \\frac{4}{2}$ nên hai vectơ không cùng phương, do đó $A, B, C$ không thẳng hàng.',
          },
          {
            id: 'd',
            text: 'Điểm $D(-3; -1)$ là đỉnh thứ tư của hình bình hành $ABCD$.',
            isCorrect: true,
            explanation:
              'Đúng. $ABCD$ là hình bình hành $\\Leftrightarrow \\overrightarrow{AB} = \\overrightarrow{DC} \\Leftrightarrow (2; 4) = (-1 - x_D;\\; 3 - y_D) \\Leftrightarrow x_D = -3, y_D = -1$.',
          },
        ],
        explanation:
          'Tính trực tiếp tọa độ các vectơ và kiểm tra điều kiện cùng phương, hình bình hành: a) Đúng, b) Đúng, c) Sai, d) Đúng.',
      },
    ],
    shortAnswer: [
      {
        id: 'b10-sa-6',
        type: 'short_answer',
        lessonId: 'vec-bai-10',
        lessonLabel: 'Bài 10',
        question:
          'Trong mặt phẳng $Oxy$, cho $\\overrightarrow{u} = (m - 1; 4)$ và $\\overrightarrow{v} = (2; m + 1)$. Tìm tổng tất cả các giá trị của tham số $m$ để hai vectơ $\\overrightarrow{u}$ và $\\overrightarrow{v}$ cùng phương.',
        correctAnswer: '0',
        acceptableAnswers: ['0'],
        explanation:
          'Hai vectơ $\\overrightarrow{u} = (m - 1; 4)$ và $\\overrightarrow{v} = (2; m + 1)$ cùng phương khi và chỉ khi:\n$$(m - 1)(m + 1) - 4 \\cdot 2 = 0 \\Leftrightarrow m^2 - 1 - 8 = 0 \\Leftrightarrow m^2 = 9 \\Leftrightarrow m = 3 \\text{ hoặc } m = -3.$$\nTổng tất cả các giá trị của $m$ là $3 + (-3) = 0$.',
      },
    ],
  },

  // =========================================================================
  // BÀI 11: TÍCH VÔ HƯỚNG CỦA HAI VECTƠ
  // =========================================================================
  {
    id: 'vec-bai-11',
    code: 'Bài 11',
    title: 'Bài 11: Tích vô hướng của hai vectơ',
    subtitle: 'Định nghĩa, biểu thức tọa độ, điều kiện vuông góc, góc giữa hai vectơ và công cơ học',
    durationMinutes: 15,
    multipleChoice: [
      {
        id: 'b11-mc-1',
        type: 'multiple_choice',
        lessonId: 'vec-bai-11',
        lessonLabel: 'Bài 11',
        question:
          'Cho hai vectơ $\\overrightarrow{a}$ và $\\overrightarrow{b}$ đều khác $\\overrightarrow{0}$. Khẳng định nào sau đây đúng?',
        options: [
          { id: 'A', text: '$\\overrightarrow{a} \\cdot \\overrightarrow{b} = |\\overrightarrow{a}| \\cdot |\\overrightarrow{b}| \\cdot \\sin(\\overrightarrow{a}, \\overrightarrow{b})$' },
          { id: 'B', text: '$\\overrightarrow{a} \\cdot \\overrightarrow{b} = |\\overrightarrow{a}| \\cdot |\\overrightarrow{b}| \\cdot \\cos(\\overrightarrow{a}, \\overrightarrow{b})$' },
          { id: 'C', text: '$\\overrightarrow{a} \\cdot \\overrightarrow{b} = -|\\overrightarrow{a}| \\cdot |\\overrightarrow{b}| \\cdot \\cos(\\overrightarrow{a}, \\overrightarrow{b})$' },
          { id: 'D', text: '$\\overrightarrow{a} \\cdot \\overrightarrow{b} = |\\overrightarrow{a} \\cdot \\overrightarrow{b}|$' },
        ],
        correctOption: 'B',
        explanation:
          'Theo định nghĩa tích vô hướng của hai vectơ khác $\\overrightarrow{0}$:\n$$\\overrightarrow{a} \\cdot \\overrightarrow{b} = |\\overrightarrow{a}| \\cdot |\\overrightarrow{b}| \\cdot \\cos(\\overrightarrow{a}, \\overrightarrow{b}).$$',
      },
      {
        id: 'b11-mc-2',
        type: 'multiple_choice',
        lessonId: 'vec-bai-11',
        lessonLabel: 'Bài 11',
        question:
          'Trong mặt phẳng $Oxy$, cho $\\overrightarrow{a} = (2; -1)$ và $\\overrightarrow{b} = (3; 4)$. Tích vô hướng $\\overrightarrow{a} \\cdot \\overrightarrow{b}$ bằng:',
        options: [
          { id: 'A', text: '$2$' },
          { id: 'B', text: '$10$' },
          { id: 'C', text: '$-2$' },
          { id: 'D', text: '$11$' },
        ],
        correctOption: 'A',
        explanation:
          'Áp dụng biểu thức tọa độ của tích vô hướng:\n$$\\overrightarrow{a} \\cdot \\overrightarrow{b} = 2 \\cdot 3 + (-1) \\cdot 4 = 6 - 4 = 2.$$',
      },
      {
        id: 'b11-mc-3',
        type: 'multiple_choice',
        lessonId: 'vec-bai-11',
        lessonLabel: 'Bài 11',
        question: 'Cho tam giác đều $ABC$ có cạnh bằng $4$. Giá trị của $\\overrightarrow{AB} \\cdot \\overrightarrow{AC}$ bằng:',
        options: [
          { id: 'A', text: '$8$' },
          { id: 'B', text: '$-8$' },
          { id: 'C', text: '$8\\sqrt{3}$' },
          { id: 'D', text: '$16$' },
        ],
        correctOption: 'A',
        explanation:
          'Vì tam giác $ABC$ đều cạnh $4$ nên $AB = AC = 4$ và $(\\overrightarrow{AB}, \\overrightarrow{AC}) = \\widehat{BAC} = 60^\\circ$.\nDo đó:\n$$\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = AB \\cdot AC \\cdot \\cos 60^\\circ = 4 \\cdot 4 \\cdot \\frac{1}{2} = 8.$$',
      },
      {
        id: 'b11-mc-4',
        type: 'multiple_choice',
        lessonId: 'vec-bai-11',
        lessonLabel: 'Bài 11',
        question:
          'Trong mặt phẳng $Oxy$, cho $\\overrightarrow{u} = (1; 2)$ và $\\overrightarrow{v} = (m; -3)$. Giá trị của $m$ để $\\overrightarrow{u} \\perp \\overrightarrow{v}$ là:',
        options: [
          { id: 'A', text: '$m = 6$' },
          { id: 'B', text: '$m = -6$' },
          { id: 'C', text: '$m = \\frac{3}{2}$' },
          { id: 'D', text: '$m = -\\frac{3}{2}$' },
        ],
        correctOption: 'A',
        explanation:
          'Hai vectơ vuông góc khi và chỉ khi tích vô hướng của chúng bằng $0$:\n$$\\overrightarrow{u} \\perp \\overrightarrow{v} \\Leftrightarrow 1 \\cdot m + 2 \\cdot (-3) = 0 \\Leftrightarrow m - 6 = 0 \\Leftrightarrow m = 6.$$',
      },
    ],
    trueFalse: [
      {
        id: 'b11-tf-5',
        type: 'true_false',
        lessonId: 'vec-bai-11',
        lessonLabel: 'Bài 11',
        question:
          'Trong mặt phẳng $Oxy$, cho hai vectơ $\\overrightarrow{a} = (1; -3)$ và $\\overrightarrow{b} = (2; 1)$. Xét tính đúng, sai của các khẳng định sau:',
        statements: [
          {
            id: 'a',
            text: '$|\\overrightarrow{a}| = \\sqrt{10}$.',
            isCorrect: true,
            explanation:
              'Đúng. Ta có $|\\overrightarrow{a}| = \\sqrt{1^2 + (-3)^2} = \\sqrt{1 + 9} = \\sqrt{10}$.',
          },
          {
            id: 'b',
            text: '$\\overrightarrow{a} \\cdot \\overrightarrow{b} = -1$.',
            isCorrect: true,
            explanation:
              'Đúng. Ta có $\\overrightarrow{a} \\cdot \\overrightarrow{b} = 1 \\cdot 2 + (-3) \\cdot 1 = 2 - 3 = -1$.',
          },
          {
            id: 'c',
            text: 'Góc giữa hai vectơ $\\overrightarrow{a}$ và $\\overrightarrow{b}$ là góc nhọn.',
            isCorrect: false,
            explanation:
              'Sai. Vì $\\overrightarrow{a} \\cdot \\overrightarrow{b} = -1 < 0$ nên $\\cos(\\overrightarrow{a}, \\overrightarrow{b}) < 0$, suy ra góc giữa hai vectơ là **góc tù**.',
          },
          {
            id: 'd',
            text: '$(\\overrightarrow{a} + \\overrightarrow{b})^2 = 13$.',
            isCorrect: true,
            explanation:
              'Đúng. Ta có $\\overrightarrow{a} + \\overrightarrow{b} = (1 + 2;\\; -3 + 1) = (3; -2)$, nên $(\\overrightarrow{a} + \\overrightarrow{b})^2 = |\\overrightarrow{a} + \\overrightarrow{b}|^2 = 3^2 + (-2)^2 = 13$.',
          },
        ],
        explanation:
          'Dùng biểu thức tọa độ độ dài và tích vô hướng: a) Đúng, b) Đúng, c) Sai, d) Đúng.',
      },
    ],
    shortAnswer: [
      {
        id: 'b11-sa-6',
        type: 'short_answer',
        lessonId: 'vec-bai-11',
        lessonLabel: 'Bài 11',
        question:
          'Một người kéo một thùng hàng trên mặt sàn nằm ngang bằng một sợi dây hợp với phương ngang một góc $30^\\circ$. Lực kéo có độ lớn $80\\text{ N}$ và thùng hàng dịch chuyển được một quãng đường $5\\text{ m}$. Tính công cơ học sinh ra bởi lực kéo đó (đơn vị: Jun, làm tròn đến hàng đơn vị).',
        correctAnswer: '346',
        acceptableAnswers: ['346'],
        unit: 'J',
        explanation:
          'Công cơ học sinh ra bởi lực $\\overrightarrow{F}$ làm vật dịch chuyển một độ dời $\\overrightarrow{d}$ được tính bằng tích vô hướng:\n$$A = \\overrightarrow{F} \\cdot \\overrightarrow{d} = F \\cdot s \\cdot \\cos 30^\\circ = 80 \\cdot 5 \\cdot \\frac{\\sqrt{3}}{2} = 200\\sqrt{3} \\approx 346{,}41 \\approx 346\\text{ (J)}.$$',
      },
    ],
  },
];

export const FULL_CHAPTER4_VECTORS_EXAM: VectorExamSet = {
  id: 'vec-chuong-4-full',
  code: 'Tổng ôn Chương IV',
  title: 'Tổng ôn Chương IV: Vectơ (30 câu - 45 phút)',
  subtitle: 'Tổng hợp toàn bộ 5 bài (Bài 7 – Bài 11) theo cấu trúc 3 phần chuẩn Bộ GD&ĐT',
  durationMinutes: 45,
  isFullChapter: true,
  multipleChoice: GRADE10_VECTORS_LESSONS.flatMap((l) => l.multipleChoice),
  trueFalse: GRADE10_VECTORS_LESSONS.flatMap((l) => l.trueFalse),
  shortAnswer: GRADE10_VECTORS_LESSONS.flatMap((l) => l.shortAnswer),
};

/**
 * Normalize a student's short-answer input:
 * trim spaces, strip internal spaces, convert comma ',' to dot '.'.
 */
export function normalizeShortAnswer(input: string): string {
  return input.trim().replace(/\s+/g, '').replace(/,/g, '.');
}

export function isShortAnswerCorrect(
  userInput: string,
  question: VectorShortAnswerQuestion,
): boolean {
  const normUser = normalizeShortAnswer(userInput);
  if (!normUser) return false;

  const normalizedAccepted = [
    question.correctAnswer,
    ...question.acceptableAnswers,
  ].map(normalizeShortAnswer);

  if (normalizedAccepted.includes(normUser)) {
    return true;
  }

  const userNum = Number(normUser);
  const targetNum = Number(normalizeShortAnswer(question.correctAnswer));
  if (!Number.isNaN(userNum) && !Number.isNaN(targetNum)) {
    return Math.abs(userNum - targetNum) < 1e-6;
  }

  return false;
}

/**
 * Official Ministry of Education (Bộ GD&ĐT) True/False partial scoring rule:
 * 1 correct = 0.10, 2 correct = 0.25, 3 correct = 0.50, 4 correct = 1.00.
 */
export function scoreTrueFalseCount(correctCount: number): number {
  switch (correctCount) {
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

export interface VectorExamScoreRecord {
  bestRawScore: number;
  lastRawScore?: number;
  maxRawScore: number;
  bestScale10?: number;
  lastScale10?: number;
  answeredCount?: number;
  totalQuestions?: number;
  completionPercent?: number;
  attempts: number;
  lastAttemptAt?: string;
}

export type VectorSavedScoreMap = Record<string, VectorExamScoreRecord>;

export const VECTOR_SCORES_STORAGE_KEY = 'edubot_g10_vectors_scores_v1';
export const VECTOR_PROGRESS_EVENT = 'edubot_vectors_progress_updated';

export function loadVectorScores(): VectorSavedScoreMap {
  try {
    const raw = localStorage.getItem(VECTOR_SCORES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VectorSavedScoreMap) : {};
  } catch {
    return {};
  }
}

export function saveVectorScores(data: VectorSavedScoreMap): void {
  try {
    localStorage.setItem(VECTOR_SCORES_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(VECTOR_PROGRESS_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}


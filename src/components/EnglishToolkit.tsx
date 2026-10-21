import React, { useState, useMemo } from 'react';
import { 
  Languages, 
  Search, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  Repeat,
  ArrowRight,
  ShieldCheck,
  FileText,
  Zap,
  GraduationCap,
  ListFilter,
  Award
} from 'lucide-react';

interface VerbItem {
  v1: string;
  v2: string;
  v3: string;
  meaning: string;
}

const IRREGULAR_VERBS: VerbItem[] = [
  { v1: 'be', v2: 'was/were', v3: 'been', meaning: 'thì, là, ở' },
  { v1: 'become', v2: 'became', v3: 'become', meaning: 'trở nên, trở thành' },
  { v1: 'begin', v2: 'began', v3: 'begun', meaning: 'bắt đầu' },
  { v1: 'break', v2: 'broke', v3: 'broken', meaning: 'làm vỡ, bẻ gãy' },
  { v1: 'bring', v2: 'brought', v3: 'brought', meaning: 'mang lại, đem đến' },
  { v1: 'build', v2: 'built', v3: 'built', meaning: 'xây dựng' },
  { v1: 'buy', v2: 'bought', v3: 'bought', meaning: 'mua' },
  { v1: 'choose', v2: 'chose', v3: 'chosen', meaning: 'chọn lựa' },
  { v1: 'come', v2: 'came', v3: 'come', meaning: 'đến, đi đến' },
  { v1: 'do', v2: 'did', v3: 'done', meaning: 'làm' },
  { v1: 'drink', v2: 'drank', v3: 'drunk', meaning: 'uống' },
  { v1: 'drive', v2: 'drove', v3: 'driven', meaning: 'lái xe' },
  { v1: 'eat', v2: 'ate', v3: 'eaten', meaning: 'ăn' },
  { v1: 'fall', v2: 'fell', v3: 'fallen', meaning: 'rơi, ngã' },
  { v1: 'feel', v2: 'felt', v3: 'felt', meaning: 'cảm thấy' },
  { v1: 'find', v2: 'found', v3: 'found', meaning: 'tìm thấy' },
  { v1: 'fly', v2: 'flew', v3: 'flown', meaning: 'bay' },
  { v1: 'forget', v2: 'forgot', v3: 'forgotten', meaning: 'quên' },
  { v1: 'get', v2: 'got', v3: 'got/gotten', meaning: 'có được, nhận được' },
  { v1: 'give', v2: 'gave', v3: 'given', meaning: 'cho, tặng' },
  { v1: 'go', v2: 'went', v3: 'gone', meaning: 'đi' },
  { v1: 'grow', v2: 'grew', v3: 'grown', meaning: 'lớn lên, phát triển' },
  { v1: 'have', v2: 'had', v3: 'had', meaning: 'có' },
  { v1: 'hear', v2: 'heard', v3: 'heard', meaning: 'nghe' },
  { v1: 'keep', v2: 'kept', v3: 'kept', meaning: 'giữ, giữ gìn' },
  { v1: 'know', v2: 'knew', v3: 'known', meaning: 'biết' },
  { v1: 'lead', v2: 'led', v3: 'led', meaning: 'dẫn dắt, lãnh đạo' },
  { v1: 'learn', v2: 'learnt/learned', v3: 'learnt/learned', meaning: 'học' },
  { v1: 'leave', v2: 'left', v3: 'left', meaning: 'rời khỏi, để lại' },
  { v1: 'make', v2: 'made', v3: 'made', meaning: 'chế tạo, làm' },
  { v1: 'meet', v2: 'met', v3: 'met', meaning: 'gặp gỡ' },
  { v1: 'pay', v2: 'paid', v3: 'paid', meaning: 'trả tiền' },
  { v1: 'read', v2: 'read', v3: 'read', meaning: 'đọc' },
  { v1: 'run', v2: 'ran', v3: 'run', meaning: 'chạy' },
  { v1: 'say', v2: 'said', v3: 'said', meaning: 'nói' },
  { v1: 'see', v2: 'saw', v3: 'seen', meaning: 'nhìn thấy' },
  { v1: 'sell', v2: 'sold', v3: 'sold', meaning: 'bán' },
  { v1: 'send', v2: 'sent', v3: 'sent', meaning: 'gửi' },
  { v1: 'sing', v2: 'sang', v3: 'sung', meaning: 'hát' },
  { v1: 'sit', v2: 'sat', v3: 'sat', meaning: 'ngồi' },
  { v1: 'speak', v2: 'spoke', v3: 'spoken', meaning: 'nói' },
  { v1: 'spend', v2: 'spent', v3: 'spent', meaning: 'tiêu xài, dành thời gian' },
  { v1: 'stand', v2: 'stood', v3: 'stood', meaning: 'đứng' },
  { v1: 'take', v2: 'took', v3: 'taken', meaning: 'cầm, lấy' },
  { v1: 'teach', v2: 'taught', v3: 'taught', meaning: 'dạy học' },
  { v1: 'tell', v2: 'told', v3: 'told', meaning: 'kể, bảo' },
  { v1: 'think', v2: 'thought', v3: 'thought', meaning: 'suy nghĩ' },
  { v1: 'understand', v2: 'understood', v3: 'understood', meaning: 'thấu hiểu' },
  { v1: 'wear', v2: 'wore', v3: 'worn', meaning: 'mặc, mang' },
  { v1: 'win', v2: 'won', v3: 'won', meaning: 'chiến thắng' },
  { v1: 'write', v2: 'wrote', v3: 'written', meaning: 'viết' }
];

export function EnglishToolkit() {
  const [activeSubTab, setActiveSubTab] = useState<'tenses' | 'passive' | 'conditionals' | 'reported' | 'paraphrase' | 'verbs'>('tenses');

  // TTS Speech Handler
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- 1. DATA 12 THÌ TIẾNG ANH ---
  const tensesData = [
    {
      id: 'present_simple',
      name: '1. Hiện tại đơn (Present Simple)',
      group: 'Hiện tại',
      formula: 'S + V(s/es)',
      negative: 'S + do/does not + V(bare)',
      question: 'Do/Does + S + V(bare)?',
      signals: 'always, usually, often, sometimes, never, every day/week, once a week...',
      example: 'She studies English every morning.',
      usage: 'Diễn tả thói quen, hành động lặp đi lặp lại hoặc sự thật hiển nhiên, chân lý.'
    },
    {
      id: 'present_continuous',
      name: '2. Hiện tại tiếp diễn (Present Continuous)',
      group: 'Hiện tại',
      formula: 'S + am/is/are + V-ing',
      negative: 'S + am/is/are not + V-ing',
      question: 'Am/Is/Are + S + V-ing?',
      signals: 'now, right now, at the moment, at present, Look!, Listen!, Be quiet!...',
      example: 'The students are preparing for the graduation exam at the moment.',
      usage: 'Diễn tả hành động đang xảy ra tại thời điểm nói hoặc kế hoạch đã lên lịch sẵn.'
    },
    {
      id: 'present_perfect',
      name: '3. Hiện tại hoàn thành (Present Perfect)',
      group: 'Hiện tại',
      formula: 'S + have/has + V3/V-ed',
      negative: 'S + have/has not + V3/V-ed',
      question: 'Have/Has + S + V3/V-ed?',
      signals: 'already, yet, just, ever, never, since, for, recently, so far, up to now...',
      example: 'I have learned 500 new vocabulary words this month.',
      usage: 'Diễn tả hành động đã xảy ra trong quá khứ kéo dài đến hiện tại hoặc kết quả còn ảnh hưởng.'
    },
    {
      id: 'present_perfect_continuous',
      name: '4. Hiện tại hoàn thành tiếp diễn (Present Perfect Cont.)',
      group: 'Hiện tại',
      formula: 'S + have/has been + V-ing',
      negative: 'S + have/has not been + V-ing',
      question: 'Have/Has + S + been + V-ing?',
      signals: 'for + time, since + time, all day/morning, how long...',
      example: 'He has been studying for three hours continuously.',
      usage: 'Nhấn mạnh tính liên tục của hành động bắt đầu ở quá khứ và vẫn tiếp diễn ở hiện tại.'
    },
    {
      id: 'past_simple',
      name: '5. Quá khứ đơn (Past Simple)',
      group: 'Quá khứ',
      formula: 'S + V2/V-ed',
      negative: 'S + did not + V(bare)',
      question: 'Did + S + V(bare)?',
      signals: 'yesterday, last night/week/year, ago, in 2020, when I was young...',
      example: 'He passed the national graduation exam with flying colors last year.',
      usage: 'Diễn tả hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ tại thời điểm xác định.'
    },
    {
      id: 'past_continuous',
      name: '6. Quá khứ tiếp diễn (Past Continuous)',
      group: 'Quá khứ',
      formula: 'S + was/were + V-ing',
      negative: 'S + was/were not + V-ing',
      question: 'Was/Were + S + V-ing?',
      signals: 'at 8 p.m. yesterday, at this time last year, while, when...',
      example: 'I was revising my lessons when the phone rang.',
      usage: 'Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.'
    },
    {
      id: 'past_perfect',
      name: '7. Quá khứ hoàn thành (Past Perfect)',
      group: 'Quá khứ',
      formula: 'S + had + V3/V-ed',
      negative: 'S + had not (hadn\'t) + V3/V-ed',
      question: 'Had + S + V3/V-ed?',
      signals: 'by the time, before, after, as soon as, by 2022...',
      example: 'By the time the teacher arrived, we had finished the mock test.',
      usage: 'Diễn tả hành động xảy ra và hoàn thành trước một hành động khác trong quá khứ.'
    },
    {
      id: 'past_perfect_continuous',
      name: '8. Quá khứ hoàn thành tiếp diễn (Past Perfect Cont.)',
      group: 'Quá khứ',
      formula: 'S + had been + V-ing',
      negative: 'S + had not been + V-ing',
      question: 'Had + S + been + V-ing?',
      signals: 'until then, by the time, for hours before...',
      example: 'They had been waiting for two hours before the bus finally came.',
      usage: 'Nhấn mạnh quãng thời gian liên tục của một hành động trước một mốc thời điểm quá khứ.'
    },
    {
      id: 'future_simple',
      name: '9. Tương lai đơn (Future Simple)',
      group: 'Tương lai',
      formula: 'S + will + V(bare)',
      negative: 'S + will not (won\'t) + V(bare)',
      question: 'Will + S + V(bare)?',
      signals: 'tomorrow, next week/year, in the future, soon, I think/promise/hope...',
      example: 'We will achieve high scores in the university entrance exam.',
      usage: 'Diễn tả quyết định tức thời tại thời điểm nói hoặc dự đoán không có căn cứ trước.'
    },
    {
      id: 'future_continuous',
      name: '10. Tương lai tiếp diễn (Future Continuous)',
      group: 'Tương lai',
      formula: 'S + will be + V-ing',
      negative: 'S + will not be + V-ing',
      question: 'Will + S + be + V-ing?',
      signals: 'at 9 a.m. tomorrow, at this time next week, when S + V(hiện tại)...',
      example: 'At 9 o\'clock tomorrow morning, we will be taking the English exam.',
      usage: 'Diễn tả hành động sẽ đang diễn ra tại một thời điểm cụ thể trong tương lai.'
    },
    {
      id: 'future_perfect',
      name: '11. Tương lai hoàn thành (Future Perfect)',
      group: 'Tương lai',
      formula: 'S + will have + V3/V-ed',
      negative: 'S + will not have + V3/V-ed',
      question: 'Will + S + have + V3/V-ed?',
      signals: 'by tomorrow, by next month, by the end of this year...',
      example: 'By the end of June, I will have completed the entire THPT English syllabus.',
      usage: 'Diễn tả hành động sẽ hoàn thành trước một thời điểm hoặc hành động khác trong tương lai.'
    },
    {
      id: 'future_perfect_continuous',
      name: '12. Tương lai hoàn thành tiếp diễn (Future Perfect Cont.)',
      group: 'Tương lai',
      formula: 'S + will have been + V-ing',
      negative: 'S + will not have been + V-ing',
      question: 'Will + S + have been + V-ing?',
      signals: 'by next year... for [duration], by the time...',
      example: 'By next month, my teacher will have been teaching here for 10 years.',
      usage: 'Nhấn mạnh khoảng thời gian kéo dài liên tục của hành động tính đến thời điểm tương lai.'
    }
  ];

  const [selectedTenseId, setSelectedTenseId] = useState(tensesData[0].id);
  const currentTense = tensesData.find(t => t.id === selectedTenseId) || tensesData[0];

  // --- 2. DATA THỂ BỊ ĐỘNG (PASSIVE VOICE - ĐẦY ĐỦ) ---
  const passiveTenses = [
    { tense: 'Hiện tại đơn', active: 'S + V(s/es) + O', passive: 'S + am/is/are + V3/V-ed (+ by O)', exActive: 'People speak English all over the world.', exPassive: 'English is spoken all over the world.' },
    { tense: 'Hiện tại tiếp diễn', active: 'S + am/is/are + V-ing + O', passive: 'S + am/is/are + being + V3/V-ed', exActive: 'They are building a new library.', exPassive: 'A new library is being built.' },
    { tense: 'Hiện tại hoàn thành', active: 'S + have/has + V3 + O', passive: 'S + have/has + been + V3/V-ed', exActive: 'He has finished the project.', exPassive: 'The project has been finished.' },
    { tense: 'Quá khứ đơn', active: 'S + V2/V-ed + O', passive: 'S + was/were + V3/V-ed', exActive: 'Shakespeare wrote Hamlet.', exPassive: 'Hamlet was written by Shakespeare.' },
    { tense: 'Quá khứ tiếp diễn', active: 'S + was/were + V-ing + O', passive: 'S + was/were + being + V3/V-ed', exActive: 'She was preparing dinner at 6 p.m.', exPassive: 'Dinner was being prepared at 6 p.m.' },
    { tense: 'Quá khứ hoàn thành', active: 'S + had + V3 + O', passive: 'S + had + been + V3/V-ed', exActive: 'They had cancelled the flight before we arrived.', exPassive: 'The flight had been cancelled before we arrived.' },
    { tense: 'Tương lai đơn', active: 'S + will + V + O', passive: 'S + will + be + V3/V-ed', exActive: 'The company will release a new app.', exPassive: 'A new app will be released by the company.' },
    { tense: 'Động từ khuyết thiếu (Modals)', active: 'S + modal (can/must/should) + V + O', passive: 'S + modal + be + V3/V-ed', exActive: 'You must sign these documents.', exPassive: 'These documents must be signed.' }
  ];

  const passiveSpecialRules = [
    {
      title: '1. Bị động với Động từ Tường thuật / Ý kiến (It is said that...)',
      formula: 'Active: People say that S + V...\nPassive 1: It is + V3(said/thought/believed) + that S + V...\nPassive 2: S + be + V3(said/thought) + to V (hoặc to have V3 nếu khác thì)',
      example: 'Active: People think that he is a brilliant doctor.\n-> Passive 1: It is thought that he is a brilliant doctor.\n-> Passive 2: He is thought to be a brilliant doctor.'
    },
    {
      title: '2. Bị động Cầu khiến / Nhờ bảo (Causative Passive)',
      formula: 'Have: S + have + O(vật) + V3/V-ed (+ by O_người)\nGet: S + get + O(vật) + V3/V-ed (+ by O_người)',
      example: 'Active: I had the mechanic repair my bike.\n-> Passive: I had my bike repaired by the mechanic.\nActive: She got him to cut her hair.\n-> Passive: She got her hair cut.'
    },
    {
      title: '3. Bị động với 2 Tân ngữ (Give, send, buy, offer, show, lend...)',
      formula: 'Tân ngữ người làm chủ ngữ: S(người) + be + V3 + O(vật)\nTân ngữ vật làm chủ ngữ: S(vật) + be + V3 + to/for + O(người)',
      example: 'Active: My father gave me a new laptop.\n-> Passive 1: I was given a new laptop by my father.\n-> Passive 2: A new laptop was given to me by my father.'
    },
    {
      title: '4. Bị động với Động từ Tri giác (See, hear, watch, notice...)',
      formula: 'Thấy toàn bộ hành động: S + be + seen/heard + to-V\nThấy hành động dở dang: S + be + seen/heard + V-ing',
      example: 'Active: I saw him cross the street.\n-> Passive: He was seen to cross the street.\nActive: They heard her singing in the room.\n-> Passive: She was heard singing in the room.'
    },
    {
      title: '5. Bị động của V-ing và To-Infinitive',
      formula: 'To-Infinitive: S + want/hope/need + to be + V3\nGerund (V-ing): S + enjoy/like/hate + being + V3',
      example: 'Active: I want you to respect me. -> Passive: I want to be respected.\nActive: She hates people laughing at her. -> Passive: She hates being laughed at.'
    }
  ];

  // --- 3. DATA CÂU ĐIỀU KIỆN & ĐẢO NGỮ (CONDITIONALS) ---
  const conditionalTypes = [
    {
      type: 'Loại 0 (Zero Conditional)',
      usage: 'Diễn tả sự thật hiển nhiên, quy luật tự nhiên, hiện tượng khoa học.',
      ifClause: 'If + S + V(hiện tại đơn)',
      mainClause: 'S + V(hiện tại đơn)',
      example: 'If you heat ice, it melts.',
      inversion: 'N/A'
    },
    {
      type: 'Loại 1 (Type 1 Conditional)',
      usage: 'Diễn tả điều kiện có thể xảy ra ở hiện tại hoặc tương lai.',
      ifClause: 'If + S + V(hiện tại đơn)',
      mainClause: 'S + will / can / may + V(bare)',
      example: 'If you study hard, you will pass the national graduation exam.',
      inversion: 'Should + S + V(bare), S + will / can + V(bare)'
    },
    {
      type: 'Loại 2 (Type 2 Conditional)',
      usage: 'Diễn tả điều kiện không có thật / trái ngược với hiện tại.',
      ifClause: 'If + S + V2/ed (be -> were)',
      mainClause: 'S + would / could + V(bare)',
      example: 'If I were rich, I would buy a modern study tablet.',
      inversion: 'Were + S + (to V)..., S + would + V(bare)'
    },
    {
      type: 'Loại 3 (Type 3 Conditional)',
      usage: 'Diễn tả điều kiện không có thật / trái ngược với quá khứ.',
      ifClause: 'If + S + had + V3/ed',
      mainClause: 'S + would / could + have + V3/ed',
      example: 'If he had prepared carefully, he would have scored 10 points.',
      inversion: 'Had + S + V3/ed, S + would + have + V3/ed'
    },
    {
      type: 'Điều kiện Hỗn hợp 3 - 2 (Mixed 3-2)',
      usage: 'Giả định trái quá khứ -> Dẫn đến kết quả ở hiện tại.',
      ifClause: 'If + S + had + V3/ed (Quá khứ)',
      mainClause: 'S + would + V(bare) + NOW (Hiện tại)',
      example: 'If I had slept early last night, I would not feel tired now.',
      inversion: 'Had + S + V3/ed, S + would + V(bare)'
    }
  ];

  // --- 4. DATA CÂU TƯỜNG THUẬT (REPORTED SPEECH) ---
  const reportedRules = [
    {
      title: '1. Quy tắc Lùi thì (Tense Shift Rules)',
      rules: [
        { direct: 'Present Simple (Hiện tại đơn)', indirect: 'Past Simple (Quá khứ đơn)' },
        { direct: 'Present Continuous (Hiện tại tiếp diễn)', indirect: 'Past Continuous (Quá khứ tiếp diễn)' },
        { direct: 'Present Perfect (Hiện tại hoàn thành)', indirect: 'Past Perfect (Quá khứ hoàn thành)' },
        { direct: 'Past Simple (Quá khứ đơn)', indirect: 'Past Perfect (Quá khứ hoàn thành)' },
        { direct: 'Will / Can / May', indirect: 'Would / Could / Might' },
        { direct: 'Must / Have to', indirect: 'Had to' }
      ]
    },
    {
      title: '2. Quy tắc Đổi Trạng từ Thời gian & Nơi chốn',
      rules: [
        { direct: 'now', indirect: 'then / at that time' },
        { direct: 'here', indirect: 'there' },
        { direct: 'today / tonight', indirect: 'that day / that night' },
        { direct: 'yesterday', indirect: 'the day before / the previous day' },
        { direct: 'tomorrow', indirect: 'the next day / the following day' },
        { direct: 'ago', indirect: 'before' },
        { direct: 'this / these', indirect: 'that / those' }
      ]
    }
  ];

  const reportedTypes = [
    {
      category: 'Câu Trần thuật (Statements)',
      formula: 'S + said (that) + S + V(lùi thì)\nS + told + O + (that) + S + V(lùi thì)',
      example: 'Direct: "I am learning English," Mary said.\n-> Indirect: Mary said that she was learning English.'
    },
    {
      category: 'Câu hỏi Yes/No Questions',
      formula: 'S + asked / wanted to know + if / whether + S + V(lùi thì)',
      example: 'Direct: "Do you like pop music?" he asked me.\n-> Indirect: He asked me if I liked pop music.'
    },
    {
      category: 'Câu hỏi Wh- Questions',
      formula: 'S + asked / inquired + Wh-word + S + V(lùi thì)',
      example: 'Direct: "Where do you live?" she asked.\n-> Indirect: She asked me where I lived.'
    },
    {
      category: 'Câu Mệnh lệnh & Yêu cầu (Commands / Requests)',
      formula: 'S + told / asked / ordered + O + (not) to + V(bare)',
      example: 'Direct: "Close the book, please," the teacher said.\n-> Indirect: The teacher asked us to close the book.'
    },
    {
      category: 'Động từ Tường thuật Đặc biệt (Reporting Verbs)',
      formula: '• V + to-V: agree, decide, offer, promise, refuse, threaten\n• V + O + to-V: advise, allow, encourage, invite, remind, warn\n• V + V-ing: admit, deny, suggest, recommend\n• V + prep + V-ing: accuse O of, apologize for, congratulate O on, insist on, warn O against',
      example: 'Direct: "I\'m sorry I arrived late," Tom said.\n-> Indirect: Tom apologized for arriving late.'
    }
  ];

  // --- 5. DATA PARAPHRASE & MỆNH ĐỀ QUAN HỆ ---
  const paraphraseRules = [
    {
      concept: '1. So...that / Such...that (Quá... đến mức mà)',
      formula: 'S + be/V + so + Adj/Adv + that + S + V\nS + be/V + such + (a/an) + Adj + N + that + S + V\n-> S + be/V + too + Adj/Adv + (for O) + to V',
      example: 'The exam was so difficult that no student could finish it.\n= It was such a difficult exam that no student could finish it.\n= The exam was too difficult for students to finish.'
    },
    {
      concept: '2. Biến đổi Mối quan hệ Nhượng bộ (Concession)',
      formula: 'Although / Even though / Though + S + V\n= Despite / In spite of + N / V-ing / the fact that + S + V',
      example: 'Although it rained heavily, we went to school on time.\n= Despite the heavy rain, we went to school on time.'
    },
    {
      concept: '3. Nguyên nhân & Kết quả (Reason)',
      formula: 'Because / Since / As + S + V\n= Because of / Due to / Owing to + N / V-ing',
      example: 'Because he worked hard, he passed the exam.\n= Because of working hard, he passed the exam.'
    },
    {
      concept: '4. Cấu trúc Vừa mới... thì đã... (Hardly / No sooner)',
      formula: 'No sooner + had + S + V3 + THAN + S + V2\nHardly / Scarcely + had + S + V3 + WHEN + S + V2',
      example: 'No sooner had I arrived home than it started to rain.\n= Hardly had I arrived home when it started to rain.'
    },
    {
      concept: '5. Mệnh đề Quan hệ Rút gọn (Reduced Relative Clauses)',
      formula: '• Chủ động -> V-ing\n• Bị động -> V3/V-ed\n• Đầu câu có So sánh nhất / The first, last, only -> To-V',
      example: '• Active: The girl who sits next to me is intelligent. -> The girl sitting next to me is intelligent.\n• Passive: The book which was bought yesterday is interesting. -> The book bought yesterday is interesting.\n• First/Only: He was the first man who reached the peak. -> He was the first man to reach the peak.'
    }
  ];

  // --- 6. SUBTAB VERBS SEARCH FILTER ---
  const [verbSearch, setVerbSearch] = useState('');
  const filteredVerbs = useMemo(() => {
    return IRREGULAR_VERBS.filter(v => 
      v.v1.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.v2.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.v3.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.meaning.toLowerCase().includes(verbSearch.toLowerCase())
    );
  }, [verbSearch]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
            <Languages className="w-4 h-4 text-purple-200" />
            <span>Chương trình GDPT 2018 • Tiếng Anh THPT 10, 11, 12</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Bộ Cẩm nang Ngữ pháp & Cấu trúc Tiếng Anh THPT GDPT 2018
          </h2>
          
          <p className="text-xs sm:text-sm text-violet-100 max-w-3xl leading-relaxed">
            Phủ toàn bộ $100\%$ chủ điểm trọng tâm thi Tốt nghiệp THPT & Đánh giá năng lực: $12$ thì, Thể Bị động toàn diện, Câu điều kiện & Đảo ngữ, Câu tường thuật, Paraphrase viết lại câu và Bảng động từ bất quy tắc có phát âm chuẩn quốc tế.
          </p>
        </div>
      </div>

      {/* PRIMARY SUB-TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {[
          { id: 'tenses', label: '12 Thì Tiếng Anh', icon: Clock },
          { id: 'passive', label: 'Thể Bị động (Passive)', icon: Repeat },
          { id: 'conditionals', label: 'Câu Điều kiện & Đảo ngữ', icon: Zap },
          { id: 'reported', label: 'Câu Tường thuật (Reported)', icon: FileText },
          { id: 'paraphrase', label: 'Mệnh đề Quan hệ & Rewrite', icon: ArrowRight },
          { id: 'verbs', label: 'Động từ Bất quy tắc (TTS)', icon: BookOpen },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUBTAB 1: 12 THÌ TIẾNG ANH (FULL 12 TENSES)
          ========================================================================= */}
      {activeSubTab === 'tenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 4 Cols: Tenses List Grouped */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Danh sách 12 Thì cốt lõi</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">12/12</span>
            </h3>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {tensesData.map((t) => {
                const isSelected = selectedTenseId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTenseId(t.id)}
                    className={`w-full p-3 rounded-2xl text-left text-xs font-extrabold transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {t.group}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 8 Cols: Detailed Tense Specification Card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  Cấu trúc & Dấu hiệu nhận biết
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {currentTense.name}
                </h3>
              </div>

              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
                Nhóm: {currentTense.group}
              </span>
            </div>

            {/* Formulas Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-200/60 dark:border-purple-900/40 space-y-1">
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">Khẳng định (+):</span>
                <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">{currentTense.formula}</p>
              </div>

              <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 block">Phủ định (-):</span>
                <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">{currentTense.negative}</p>
              </div>

              <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">Nghi vấn (?):</span>
                <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">{currentTense.question}</p>
              </div>
            </div>

            {/* Signal Words Badge Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Dấu hiệu nhận biết cốt lõi trong đề thi THPT:
              </span>
              <p className="text-xs text-purple-600 dark:text-purple-300 font-bold font-mono leading-relaxed">
                {currentTense.signals}
              </p>
            </div>

            {/* Practical Exam Example & TTS Button */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/70 dark:border-emerald-900/40 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Ví dụ minh họa thực tế:
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white italic">
                  "{currentTense.example}"
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <span className="font-bold">Cách dùng:</span> {currentTense.usage}
                </p>
              </div>

              <button
                onClick={() => speakWord(currentTense.example)}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all shrink-0 active:scale-95"
                title="Nghe phát âm chuẩn bản ngữ"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: THỂ BỊ ĐỘNG TOÀN DIỆN (PASSIVE VOICE COMPLETE & ADVANCED)
          ========================================================================= */}
      {activeSubTab === 'passive' && (
        <div className="space-y-6">
          
          {/* Section 1: Passive Voice Across 12 Tenses */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Repeat className="w-5 h-5 text-purple-600" />
                <span>1. Bảng chuyển đổi Thể Bị động theo 12 Thì & Động từ Khuyết thiếu</span>
              </h3>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold">Active → Passive</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <th className="p-3 font-extrabold">Thì ngữ pháp</th>
                    <th className="p-3 font-extrabold">Công thức Bị động (Passive)</th>
                    <th className="p-3 font-extrabold">Ví dụ Chủ động (Active)</th>
                    <th className="p-3 font-extrabold text-purple-600 dark:text-purple-400">Ví dụ Bị động (Passive)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {passiveTenses.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans font-bold text-slate-800 dark:text-slate-200">{p.tense}</td>
                      <td className="p-3 font-bold text-purple-600 dark:text-purple-400">{p.passive}</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400 italic">{p.exActive}</td>
                      <td className="p-3 font-sans font-bold text-emerald-600 dark:text-emerald-400">{p.exPassive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Special & Advanced Passive Structures */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>2. Các Dạng Câu Bị Động Đặc Biệt Thi THPT & ĐGNL</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passiveSpecialRules.map((rule, idx) => (
                <div key={idx} className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <h4 className="font-extrabold text-sm text-purple-700 dark:text-purple-300">{rule.title}</h4>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed">
                    {rule.formula}
                  </div>
                  <div className="p-2.5 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Ví dụ:</span>
                    {rule.example}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: CÂU ĐIỀU KIỆN & ĐẢO NGỮ (CONDITIONALS & INVERSIONS)
          ========================================================================= */}
      {activeSubTab === 'conditionals' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Tổng hợp Câu Điều Kiện (Loại 0, 1, 2, 3, Hỗn hợp) & Đảo ngữ</span>
              </h3>
            </div>

            <div className="space-y-4">
              {conditionalTypes.map((c, idx) => (
                <div key={idx} className="p-5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-black text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>{c.type}</span>
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">{c.usage}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] font-sans font-bold text-slate-500 block mb-1">Mệnh đề IF:</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">{c.ifClause}</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] font-sans font-bold text-slate-500 block mb-1">Mệnh đề Chính (Main):</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{c.mainClause}</span>
                    </div>
                  </div>

                  {c.inversion !== 'N/A' && (
                    <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs">
                      <span className="font-extrabold text-amber-700 dark:text-amber-400 uppercase text-[10px] block mb-1">Cấu trúc Đảo ngữ (Inversion):</span>
                      <code className="font-mono font-bold text-slate-900 dark:text-white">{c.inversion}</code>
                    </div>
                  )}

                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span><span className="font-bold text-emerald-700 dark:text-emerald-400">Ví dụ:</span> "{c.example}"</span>
                    <button
                      onClick={() => speakWord(c.example)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg shrink-0 ml-2"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: CÂU TƯỜNG THUẬT (REPORTED SPEECH COMPLETE)
          ========================================================================= */}
      {activeSubTab === 'reported' && (
        <div className="space-y-6">
          
          {/* Rules Section: Tense Shifting & Adverbs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportedRules.map((group, gIdx) => (
              <div key={gIdx} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="font-extrabold text-sm text-purple-700 dark:text-purple-300 pb-2 border-b border-slate-100 dark:border-slate-800">
                  {group.title}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500">
                        <th className="p-2 font-bold">Trực tiếp (Direct)</th>
                        <th className="p-2 font-bold text-purple-600">Gián tiếp (Indirect)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {group.rules.map((r, rIdx) => (
                        <tr key={rIdx}>
                          <td className="p-2 text-slate-700 dark:text-slate-300">{r.direct}</td>
                          <td className="p-2 font-bold text-purple-600 dark:text-purple-400">{r.indirect}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Categories Section: Statements, Questions, Imperatives, Special Verbs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>Phân loại Các Dạng Câu Tường Thuật Thi THPT</span>
            </h3>

            <div className="space-y-4">
              {reportedTypes.map((rt, idx) => (
                <div key={idx} className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <h4 className="font-black text-sm text-indigo-600 dark:text-indigo-400">{rt.category}</h4>
                  
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono whitespace-pre-line text-purple-600 dark:text-purple-300 font-bold leading-relaxed">
                    {rt.formula}
                  </div>

                  <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-xl text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">Ví dụ chuyển đổi:</span>
                    {rt.example}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SUBTAB 5: MỆNH ĐỀ QUAN HỆ & CẤU TRÚC PARAPHRASE THI THPT
          ========================================================================= */}
      {activeSubTab === 'paraphrase' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-emerald-500" />
                <span>Các Cấu Trúc Viết Lại Câu (Paraphrase) & Mệnh Đề Quan Hệ Thường Gặp</span>
              </h3>
            </div>

            <div className="space-y-4">
              {paraphraseRules.map((rule, idx) => (
                <div key={idx} className="p-5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                  <h4 className="font-black text-sm text-emerald-700 dark:text-emerald-400">{rule.concept}</h4>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono whitespace-pre-line font-bold text-purple-600 dark:text-purple-300 leading-relaxed">
                    {rule.formula}
                  </div>

                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Ví dụ trắc nghiệm/viết lại câu:</span>
                    {rule.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 6: ĐỘNG TỪ BẤT QUY TẮC & PHÁT ÂM (IRREGULAR VERBS)
          ========================================================================= */}
      {activeSubTab === 'verbs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <Search className="w-5 h-5 text-purple-500" />
            <input
              type="text"
              placeholder="Tra cứu nhanh động từ (ví dụ: become, went, written), hoặc nghĩa tiếng Việt..."
              value={verbSearch}
              onChange={(e) => setVerbSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 dark:text-slate-100 font-medium"
            />
            {verbSearch && (
              <button 
                onClick={() => setVerbSearch('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center justify-between">
              <span>Danh sách Động từ Bất Quy tắc ({filteredVerbs.length} từ)</span>
              <span>🔊 Bấm loa để nghe phát âm cả 3 cột (V1, V2, V3)</span>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                    <th className="p-3.5 font-black">V1 (Infinitive)</th>
                    <th className="p-3.5 font-black">V2 (Past Simple)</th>
                    <th className="p-3.5 font-black">V3 (Past Participle)</th>
                    <th className="p-3.5 font-black">Nghĩa tiếng Việt</th>
                    <th className="p-3.5 font-black text-center">Phát âm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredVerbs.map((v, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">{v.v1}</td>
                      <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{v.v2}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{v.v3}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{v.meaning}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => speakWord(`${v.v1}, ${v.v2}, ${v.v3}`)}
                          className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/60 rounded-xl transition-all inline-flex active:scale-95"
                          title="Nghe phát âm V1, V2, V3"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

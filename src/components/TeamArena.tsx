import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Flame, 
  Sparkles, 
  Swords, 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Check, 
  Award, 
  Crown, 
  Zap, 
  Search,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MathView } from './MathView';
import { 
  KNTT_TOPICS, 
  KNTT_QUESTION_BANK, 
  BattleGrade, 
  BattleSubject, 
  KNTTBattleQuestion 
} from '../data/knttTeamBattleQuestions';

// Rank types
export type TeamRank = 'Tân thủ' | 'Chuyên gia' | 'Cao thủ' | 'Đại cao thủ' | 'Siêu cấp bá khí';

export interface TeamMember {
  id: string;
  name: string;
  role: 'Trưởng đội' | 'Thành viên';
  avatar: string;
  contributionXP: number;
}

export interface Team {
  id: string;
  name: string;
  slogan: string;
  joinCode: string; // Unique join code, e.g. "EDU-7X9K2"
  sizeLimit: 2 | 3 | 4 | 5;
  members: TeamMember[];
  totalXP: number;
  rank: TeamRank;
  wins: number;
  matchesPlayed: number;
}

export interface TeamBattleQuestion {
  id: string;
  subject: 'Toán' | 'Vật lý' | 'Hóa học' | 'Sinh học';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Siêu Chiến Binh KNTT',
    slogan: 'Quyết tâm thủ khoa GDPT 2018!',
    joinCode: 'EDU-KNTT1',
    sizeLimit: 5,
    members: [
      { id: 'm1', name: 'Nguyễn Văn Minh', role: 'Trưởng đội', avatar: '👨‍🎓', contributionXP: 2400 },
      { id: 'm2', name: 'Trần Thị Thu hà', role: 'Thành viên', avatar: '👩‍🎓', contributionXP: 2100 },
      { id: 'm3', name: 'Lê Hoàng Nam', role: 'Thành viên', avatar: '🧑‍💻', contributionXP: 1800 },
      { id: 'm4', name: 'Phạm Bảo Ngọc', role: 'Thành viên', avatar: '👩‍🔬', contributionXP: 1500 },
      { id: 'm5', name: 'Vũ Đức Anh', role: 'Thành viên', avatar: '🚀', contributionXP: 1200 },
    ],
    totalXP: 9000,
    rank: 'Siêu cấp bá khí',
    wins: 48,
    matchesPlayed: 50,
  },
  {
    id: 'team-2',
    name: 'Liên Minh Bát Tử Octet',
    slogan: 'Hóa học THPT trong tầm tay',
    joinCode: 'EDU-OCTET',
    sizeLimit: 4,
    members: [
      { id: 'm6', name: 'Đặng Tuấn Kiệt', role: 'Trưởng đội', avatar: '🧪', contributionXP: 1500 },
      { id: 'm7', name: 'Hoàng Phương Thảo', role: 'Thành viên', avatar: '🧬', contributionXP: 1400 },
      { id: 'm8', name: 'Bùi Gia Huy', role: 'Thành viên', avatar: '🔬', contributionXP: 1200 },
      { id: 'm9', name: 'Đỗ Khánh Linh', role: 'Thành viên', avatar: '📐', contributionXP: 1100 },
    ],
    totalXP: 5200,
    rank: 'Đại cao thủ',
    wins: 32,
    matchesPlayed: 38,
  },
  {
    id: 'team-3',
    name: 'Fresnel Quantum Squad',
    slogan: 'Xoay vectơ, giải nhanh Vật lý',
    joinCode: 'EDU-WAVE3',
    sizeLimit: 3,
    members: [
      { id: 'm10', name: 'Trịnh Thanh Tùng', role: 'Trưởng đội', avatar: '⚡', contributionXP: 900 },
      { id: 'm11', name: 'Ngô Hải Yến', role: 'Thành viên', avatar: '🌟', contributionXP: 850 },
      { id: 'm12', name: 'Phan Quốc Việt', role: 'Thành viên', avatar: '🔥', contributionXP: 750 },
    ],
    totalXP: 2500,
    rank: 'Cao thủ',
    wins: 18,
    matchesPlayed: 22,
  },
  {
    id: 'team-4',
    name: 'Đội Mendel Di Truyền',
    slogan: 'Bảng Punnett không sợ sai',
    joinCode: 'EDU-BIO99',
    sizeLimit: 2,
    members: [
      { id: 'm13', name: 'Mai Như Quỳnh', role: 'Trưởng đội', avatar: '🌱', contributionXP: 400 },
      { id: 'm14', name: 'Cao Thế Vinh', role: 'Thành viên', avatar: '🍀', contributionXP: 380 },
    ],
    totalXP: 780,
    rank: 'Chuyên gia',
    wins: 8,
    matchesPlayed: 10,
  }
];

const BATTLE_QUESTIONS: TeamBattleQuestion[] = [
  {
    id: 'q1',
    subject: 'Toán',
    question: 'Tính giá trị cực đại của hàm số $y = -x^3 + 3x^2 + 1$.',
    options: ['$y_{CD} = 5$', '$y_{CD} = 1$', '$y_{CD} = 3$', '$y_{CD} = 0$'],
    correctAnswer: 0,
    explanation: 'Ta có $y\' = -3x^2 + 6x = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Do $a = -3 < 0$ nên $x = 2$ là điểm cực đại $\\Rightarrow y(2) = -(2)^3 + 3(2)^2 + 1 = -8 + 12 + 1 = 5$.'
  },
  {
    id: 'q2',
    subject: 'Vật lý',
    question: 'Tổng hợp hai dao động điều hòa cùng phương $x_1 = 3\\cos(10\\pi t)$ cm và $x_2 = 4\\cos(10\\pi t + \\frac{\\pi}{2})$ cm thu được biên độ tổng hợp $A$ là bao nhiêu?',
    options: ['$A = 7$ cm', '$A = 1$ cm', '$A = 5$ cm', '$A = 12$ cm'],
    correctAnswer: 2,
    explanation: 'Hai dao động vuông pha (độ lệch pha $\\Delta\\varphi = \\frac{\\pi}{2}$), do đó biên độ tổng hợp $A = \\sqrt{A_1^2 + A_2^2} = \\sqrt{3^2 + 4^2} = 5$ cm.'
  },
  {
    id: 'q3',
    subject: 'Hóa học',
    question: 'Số liên kết $\\sigma$ và liên kết $\\pi$ trong phân tử etilen ($\text{C}_2\text{H}_4$) lần lượt là:',
    options: ['$5$ liên kết $\\sigma$ và $1$ liên kết $\\pi$', '$4$ liên kết $\\sigma$ và $2$ liên kết $\\pi$', '$3$ liên kết $\\sigma$ và $1$ liên kết $\\pi$', '$6$ liên kết $\\sigma$ và $0$ liên kết $\\pi$'],
    correctAnswer: 0,
    explanation: 'Cấu tạo $\\text{H}_2\\text{C}=\\text{CH}_2$ gồm $4$ liên kết đơn $\\text{C}-\\text{H}$ (đều là $\\sigma$) và $1$ liên kết đôi $\\text{C}=\\text{C}$ (gồm $1\\sigma + 1\\pi$). Tổng cộng $5\\sigma + 1\\pi$.'
  },
  {
    id: 'q4',
    subject: 'Sinh học',
    question: 'Phép lai $AaBb \\times AaBb$ với các gen phân ly độc lập, tính trạng trội hoàn toàn thu được tỷ lệ kiểu hình thuần chủng lặn hai tính trạng ($aabb$) ở $F_1$ là:',
    options: ['$\\frac{9}{16}$', '$\\frac{3}{16}$', '$\\frac{1}{16}$', '$\\frac{1}{4}$'],
    correctAnswer: 2,
    explanation: 'Tỷ lệ $aa = \\frac{1}{4}$, tỷ lệ $bb = \\frac{1}{4}$. Do phân ly độc lập nên tỷ lệ $aabb = \\frac{1}{4} \\times \\frac{1}{4} = \\frac{1}{16} = 6,25\\%$.'
  }
];

export function TeamArena() {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('edubot_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [myTeam, setMyTeam] = useState<Team | null>(() => {
    const saved = localStorage.getItem('edubot_my_team');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal create/edit team state
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newSlogan, setNewSlogan] = useState('');
  const [newSize, setNewSize] = useState<2 | 3 | 4 | 5>(4);
  const [leaderName, setLeaderName] = useState('Tôi (Trưởng Đội)');

  // Battle Arena mode state
  const [inBattle, setInBattle] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [battleScore, setBattleScore] = useState(0);
  const [battleFinished, setBattleFinished] = useState(false);

  // Match configuration states (Grade, Subject, Topic KNTT)
  const [selectedGrade, setSelectedGrade] = useState<BattleGrade>('Lớp 12');
  const [selectedSubject, setSelectedSubject] = useState<'Đa môn' | BattleSubject>('Đa môn');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [isBattleConfigOpen, setIsBattleConfigOpen] = useState(false);
  const [activeBattleQuestions, setActiveBattleQuestions] = useState<KNTTBattleQuestion[]>([]);

  // Join code states
  const [isJoiningCodeOpen, setIsJoiningCodeOpen] = useState(false);
  const [inputJoinCode, setInputJoinCode] = useState('');
  const [copiedJoinCode, setCopiedJoinCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('edubot_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    if (myTeam) {
      localStorage.setItem('edubot_my_team', JSON.stringify(myTeam));
    }
  }, [myTeam]);

  // Determine rank based on total XP
  const getRankBadge = (rank: TeamRank) => {
    switch (rank) {
      case 'Siêu cấp bá khí':
        return { label: '🔥 Siêu cấp bá khí', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: Crown };
      case 'Đại cao thủ':
        return { label: '👑 Đại cao thủ', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: Trophy };
      case 'Cao thủ':
        return { label: '⚡ Cao thủ', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Zap };
      case 'Chuyên gia':
        return { label: '🎓 Chuyên gia', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: Award };
      default:
        return { label: '🌱 Tân thủ', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: ShieldCheck };
    }
  };

  const computeRank = (xp: number): TeamRank => {
    if (xp >= 7000) return 'Siêu cấp bá khí';
    if (xp >= 3500) return 'Đại cao thủ';
    if (xp >= 1500) return 'Cao thủ';
    if (xp >= 500) return 'Chuyên gia';
    return 'Tân thủ';
  };

  const generateJoinCode = () => {
    return `EDU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const generatedCode = generateJoinCode();

    const created: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName.trim(),
      slogan: newSlogan.trim() || 'Cùng nhau chinh phục kỳ thi GDPT 2018!',
      joinCode: generatedCode,
      sizeLimit: newSize,
      members: [
        { id: `m-${Date.now()}-1`, name: leaderName.trim() || 'Trưởng Đội', role: 'Trưởng đội', avatar: '👑', contributionXP: 500 }
      ],
      totalXP: 500,
      rank: computeRank(500),
      wins: 1,
      matchesPlayed: 1,
    };

    setTeams(prev => [created, ...prev]);
    setMyTeam(created);
    setIsCreating(false);
    setNewTeamName('');
    setNewSlogan('');
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputJoinCode.trim().toUpperCase();
    if (!code) return;

    const targetTeam = teams.find(t => t.joinCode.toUpperCase() === code);
    if (!targetTeam) {
      alert(`Khồng tìm thấy Team với mã Join Code: "${code}". Vui lòng kiểm tra lại!`);
      return;
    }

    if (targetTeam.members.length >= targetTeam.sizeLimit) {
      alert(`Team "${targetTeam.name}" đã đủ số lượng tối đa ${targetTeam.sizeLimit} người!`);
      return;
    }

    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: 'Tôi (Thành viên Mới)',
      role: 'Thành viên',
      avatar: '🚀',
      contributionXP: 300,
    };

    const updatedMembers = [...targetTeam.members, newMember];
    const updatedXP = targetTeam.totalXP + 300;
    const updatedTeam: Team = {
      ...targetTeam,
      members: updatedMembers,
      totalXP: updatedXP,
      rank: computeRank(updatedXP),
    };

    setMyTeam(updatedTeam);
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    setIsJoiningCodeOpen(false);
    setInputJoinCode('');
  };

  const handleCopyJoinCode = () => {
    if (!myTeam) return;
    navigator.clipboard.writeText(myTeam.joinCode);
    setCopiedJoinCode(true);
    setTimeout(() => setCopiedJoinCode(false), 2000);
  };

  const handleAddDemoMember = () => {
    if (!myTeam) return;
    if (myTeam.members.length >= myTeam.sizeLimit) {
      alert(`Đội đã đạt giới hạn tối đa ${myTeam.sizeLimit} thành viên!`);
      return;
    }

    const demoNames = ['Phạm Minh Khôi', 'Nguyễn Thị Hoa', 'Đỗ Hoàng Long', 'Trần Bảo Anh'];
    const randomName = demoNames[myTeam.members.length % demoNames.length];
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: randomName,
      role: 'Thành viên',
      avatar: ['🚀', '🧬', '⚡', '📐'][myTeam.members.length % 4],
      contributionXP: 300,
    };

    const updatedMembers = [...myTeam.members, newMember];
    const updatedTotalXP = myTeam.totalXP + 300;
    const updatedTeam: Team = {
      ...myTeam,
      members: updatedMembers,
      totalXP: updatedTotalXP,
      rank: computeRank(updatedTotalXP),
    };

    setMyTeam(updatedTeam);
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  };

  const handleStartBattle = () => {
    setIsBattleConfigOpen(true);
  };

  const handleConfirmStartBattle = () => {
    let filtered = KNTT_QUESTION_BANK.filter(q => q.grade === selectedGrade);

    if (selectedSubject !== 'Đa môn') {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }

    if (selectedTopicId !== 'all') {
      filtered = filtered.filter(q => q.topicId === selectedTopicId);
    }

    if (filtered.length === 0) {
      filtered = KNTT_QUESTION_BANK.filter(q => q.grade === selectedGrade);
    }

    setActiveBattleQuestions(filtered);
    setIsBattleConfigOpen(false);
    setInBattle(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setBattleScore(0);
    setBattleFinished(false);
  };

  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null || activeBattleQuestions.length === 0) return;
    setSelectedAnswer(idx);
    const q = activeBattleQuestions[currentQuestionIdx];
    if (idx === q.correctAnswer) {
      setBattleScore(prev => prev + 250);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeBattleQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setBattleFinished(true);
      if (myTeam) {
        const bonusXP = battleScore + 200;
        const newXP = myTeam.totalXP + bonusXP;
        const updatedTeam: Team = {
          ...myTeam,
          totalXP: newXP,
          rank: computeRank(newXP),
          wins: battleScore > 300 ? myTeam.wins + 1 : myTeam.wins,
          matchesPlayed: myTeam.matchesPlayed + 1,
        };
        setMyTeam(updatedTeam);
        setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
      }
    }
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.slogan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-600/20 border border-purple-500/40 rounded-2xl">
                <Swords className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">Giải đấu Đội nhóm THPT GDPT 2018</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Team Arena - Thi Đua Giải Bài Đồng Đội</h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsJoiningCodeOpen(true)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/50 font-bold text-xs rounded-2xl transition-all flex items-center space-x-1.5 active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Nhập Mã Join Code Vô Team</span>
              </button>

              <button
                onClick={() => setIsCreating(true)}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center space-x-2 active:scale-95"
              >
                <UserPlus className="w-5 h-5 text-purple-200" />
                <span>Thành lập Team Mới</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Lập nhóm thi đấu <span className="font-bold text-purple-300">2 người, 3 người, 4 người hoặc 5 người</span>. Tự đặt tên Team độc lạ, thi đấu trắc nghiệm Toán - Lý - Hóa - Sinh tích điểm XP chung để thăng hạng từ <span className="font-bold text-emerald-400">Tân thủ</span> đến <span className="font-bold text-rose-400">Siêu cấp bá khí 🔥</span>!
          </p>

          {/* Rank Progression Path */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {[
              { title: 'Tân thủ', xp: '0 - 499 XP', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300' },
              { title: 'Chuyên gia', xp: '500 - 1499 XP', color: 'border-blue-500/30 bg-blue-950/20 text-blue-300' },
              { title: 'Cao thủ', xp: '1500 - 3499 XP', color: 'border-amber-500/30 bg-amber-950/20 text-amber-300' },
              { title: 'Đại cao thủ', xp: '3500 - 6999 XP', color: 'border-purple-500/30 bg-purple-950/20 text-purple-300' },
              { title: 'Siêu cấp bá khí', xp: '7000+ XP', color: 'border-rose-500/30 bg-rose-950/20 text-rose-300' },
            ].map((r, i) => (
              <div key={i} className={`p-2.5 rounded-2xl border text-center text-xs ${r.color}`}>
                <span className="font-black block">{r.title}</span>
                <span className="text-[10px] font-mono text-slate-400">{r.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current User Team Status Banner */}
      {myTeam ? (
        <div className="bg-slate-900 border border-purple-800/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-black text-white">{myTeam.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRankBadge(myTeam.rank).bg}`}>
                      {getRankBadge(myTeam.rank).label}
                    </span>
                  </div>
                  <p className="text-xs text-purple-300 font-medium italic">"{myTeam.slogan}"</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs pt-1 text-slate-300">
                <button
                  onClick={handleCopyJoinCode}
                  className="font-mono bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-700/60 text-purple-300 font-bold hover:bg-purple-900 transition-colors flex items-center space-x-1.5"
                  title="Bấm để sao chép mã Join Code gửi cho bạn bè"
                >
                  <span>Mã Join Code: <strong className="text-amber-400">{myTeam.joinCode}</strong></span>
                  {copiedJoinCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5 text-purple-400" />}
                </button>
                <span className="font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  Thành viên: <strong className="text-purple-400">{myTeam.members.length}/{myTeam.sizeLimit} người</strong>
                </span>
                <span className="font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  Tổng XP: <strong className="text-amber-400">{myTeam.totalXP} XP</strong>
                </span>
                <span className="font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  Thắng/Đấu: <strong className="text-emerald-400">{myTeam.wins}/{myTeam.matchesPlayed} trận</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {myTeam.members.length < myTeam.sizeLimit && (
                <button
                  onClick={handleAddDemoMember}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/50 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <span>Mời Đồng Đội (+1)</span>
                </button>
              )}

              <button
                onClick={handleStartBattle}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center space-x-2 active:scale-95"
              >
                <Play className="w-5 h-5 text-emerald-200 fill-emerald-200" />
                <span>Vào Đấu Tranh Cúp Đồng Đội</span>
              </button>
            </div>

          </div>

          {/* Members List */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Danh sách thành viên ({myTeam.members.length}/{myTeam.sizeLimit} người):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {myTeam.members.map((m) => (
                <div key={m.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center space-x-3">
                  <span className="text-2xl">{m.avatar}</span>
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs text-slate-200 truncate block">{m.name}</span>
                    <span className="text-[10px] text-purple-400 font-mono block">{m.role} • {m.contributionXP} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
          <Users className="w-10 h-10 text-purple-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Bạn chưa gia nhập hoặc tạo Team nào!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Hãy bấm <strong className="text-purple-300">"Thành lập Team Mới"</strong> hoặc chọn một Team trong bảng xếp hạng dưới đây để tham gia thi đấu cùng các bạn học sinh khác trên toàn quốc.
          </p>
        </div>
      )}

      {/* Battle Arena Modal / View */}
      {inBattle && activeBattleQuestions.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-800/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
            
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs">
                  {activeBattleQuestions[currentQuestionIdx]?.grade || selectedGrade}
                </span>
                <span className="px-2.5 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/40 rounded-xl font-bold text-xs">
                  {activeBattleQuestions[currentQuestionIdx]?.subject || selectedSubject}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Câu {currentQuestionIdx + 1}/{activeBattleQuestions.length}
                </span>
              </div>

              <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950/50 px-3 py-1 rounded-full border border-amber-800">
                Điểm Đội: +{battleScore} XP
              </span>
            </div>

            {!battleFinished ? (
              <div className="space-y-6">
                <div className="text-xs text-slate-400 font-medium italic">
                  Chủ đề: {activeBattleQuestions[currentQuestionIdx]?.topicName}
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-sm leading-relaxed">
                  <MathView content={activeBattleQuestions[currentQuestionIdx]?.question || ''} />
                </div>

                <div className="space-y-3">
                  {activeBattleQuestions[currentQuestionIdx]?.options.map((opt, i) => {
                    let btnClass = "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200";
                    if (selectedAnswer !== null) {
                      if (i === activeBattleQuestions[currentQuestionIdx].correctAnswer) {
                        btnClass = "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold";
                      } else if (i === selectedAnswer) {
                        btnClass = "bg-rose-950/80 border-rose-500 text-rose-300";
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleSelectAnswer(i)}
                        className={`w-full p-4 text-left rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <MathView inline content={`**${String.fromCharCode(65 + i)}.** ${opt}`} />
                        {selectedAnswer !== null && i === activeBattleQuestions[currentQuestionIdx].correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className="p-4 bg-purple-950/40 border border-purple-800/60 rounded-2xl text-xs space-y-2">
                    <span className="font-bold text-purple-300 block">Lời giải chi tiết KNTT:</span>
                    <MathView content={activeBattleQuestions[currentQuestionIdx]?.explanation || ''} />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl transition-all"
                  >
                    {currentQuestionIdx < activeBattleQuestions.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành Đấu trường'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-2xl font-black text-white">Chúc mừng {myTeam?.name || 'Đội bạn'}!</h3>
                  <p className="text-sm text-purple-300 mt-1">
                    Đã hoàn thành xuất sắc trận đấu KNTT ({selectedGrade} - {selectedSubject}) và cộng vào quỹ XP Team:
                  </p>
                  <span className="text-3xl font-black font-mono text-amber-400 block mt-2">
                    +{battleScore + 200} XP 🔥
                  </span>
                </div>

                <button
                  onClick={() => setInBattle(false)}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl transition-all"
                >
                  Trở về Bảng Xếp Hạng Team
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modal Create Team */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTeam} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <span>Tạo Đội Nhóm Thi Đấu Mới</span>
              </h3>
              <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Team của bạn (Custom Team Name):</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Siêu Bát Tử 2026, Biệt Đội Tích Phân..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Khẩu hiệu (Slogan):</label>
                <input
                  type="text"
                  placeholder="VD: Quyết tâm 29+ điểm THPT!"
                  value={newSlogan}
                  onChange={(e) => setNewSlogan(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Số lượng thành viên tối đa:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewSize(num as 2 | 3 | 4 | 5)}
                      className={`py-2.5 rounded-xl font-bold border transition-all ${
                        newSize === num
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Team {num} người
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Trưởng Đội:</label>
                <input
                  type="text"
                  required
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Tạo Team Ngay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Join Team via Code */}
      {isJoiningCodeOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleJoinByCode} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Nhập Mã Join Code Vô Team</span>
              </h3>
              <button type="button" onClick={() => setIsJoiningCodeOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Nhập mã Join Code (Ví dụ: <span className="font-mono text-amber-300 font-bold">EDU-OCTET</span>) được bạn bè chia sẻ để tham gia thi đấu cùng đội.
            </p>

            <div>
              <label className="block text-slate-300 font-bold text-xs mb-1">Mã Join Code:</label>
              <input
                type="text"
                required
                placeholder="VD: EDU-7X9K2"
                value={inputJoinCode}
                onChange={(e) => setInputJoinCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsJoiningCodeOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Vào Team
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Match Configuration (Grade, Subject & Topic KNTT Selection) */}
      {isBattleConfigOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-800/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Swords className="w-5 h-5 text-purple-400" />
                <span>Cấu hình Trận đấu KNTT</span>
              </h3>
              <button type="button" onClick={() => setIsBattleConfigOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Lựa chọn <strong className="text-amber-300">Khối Lớp</strong>, <strong className="text-purple-300">Môn học</strong> và <strong className="text-emerald-300">Chủ đề SGK Kết Nối Tri Thức</strong> để học sinh không bị gặp câu hỏi chưa học!
            </p>

            <div className="space-y-4 text-xs">
              
              {/* 1. Chọn Lớp */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">1. Chọn Lớp đang học (Tránh câu hỏi lớp trên):</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Lớp 10', 'Lớp 11', 'Lớp 12'] as BattleGrade[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(g);
                        setSelectedTopicId('all');
                      }}
                      className={`py-2.5 rounded-xl font-bold border transition-all ${
                        selectedGrade === g
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Chọn Môn học */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">2. Chọn Môn thi đấu:</label>
                <div className="flex flex-wrap gap-2">
                  {(['Đa môn', 'Toán', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(s);
                        setSelectedTopicId('all');
                      }}
                      className={`px-3 py-2 rounded-xl font-bold border transition-all text-xs ${
                        selectedSubject === s
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {s === 'Đa môn' ? '🌐 Đa môn (KNTT)' : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Chọn Chủ đề / Chương bài KNTT */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">3. Chủ đề / Bài học SGK Kết Nối Tri Thức:</label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  <option value="all">📚 Tất cả các Chủ đề chương trình {selectedGrade}</option>
                  {KNTT_TOPICS.filter(t => t.grade === selectedGrade && (selectedSubject === 'Đa môn' || t.subject === selectedSubject)).map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.subject}] {t.topicName}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBattleConfigOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmStartBattle}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center space-x-1.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu Đấu trường KNTT →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Bảng Xếp Hạng Toàn Quốc</span>
            <h3 className="text-xl font-black text-white">Top Team Đấu Trường GDPT 2018</h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên Team..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredTeams.map((team, index) => {
            const rankBadge = getRankBadge(team.rank);
            return (
              <div 
                key={team.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  myTeam?.id === team.id
                    ? 'bg-purple-950/40 border-purple-600 shadow-md'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`w-8 h-8 rounded-xl font-black font-mono flex items-center justify-center text-sm ${
                    index === 0 ? 'bg-amber-400 text-slate-950' :
                    index === 1 ? 'bg-slate-300 text-slate-950' :
                    index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{index + 1}
                  </span>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{team.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${rankBadge.bg}`}>
                        {rankBadge.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">"{team.slogan}"</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Quy mô</span>
                    <span className="font-mono font-bold text-slate-300">{team.members.length}/{team.sizeLimit} người</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Thống kê</span>
                    <span className="font-mono font-bold text-emerald-400">{team.wins} thắng ({team.matchesPlayed} trận)</span>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Tổng Điểm</span>
                    <span className="font-mono font-black text-amber-400 text-sm">{team.totalXP} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

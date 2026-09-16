import React, { useState, useEffect } from 'react';
import { Gamepad2, UserPlus, Users, Trophy } from 'lucide-react';

export function ClassGames() {
  const [students, setStudents] = useState<string[]>(() => {
    const saved = localStorage.getItem('edubot-students');
    return saved ? JSON.parse(saved) : ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
  });
  const [newStudent, setNewStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    localStorage.setItem('edubot-students', JSON.stringify(students));
  }, [students]);

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.trim() && !students.includes(newStudent.trim())) {
      setStudents([...students, newStudent.trim()]);
      setNewStudent('');
    }
  };

  const removeStudent = (name: string) => {
    setStudents(students.filter(s => s !== name));
  };

  const pickRandom = () => {
    if (students.length === 0) return;
    setIsSpinning(true);
    setSelectedStudent(null);
    
    let count = 0;
    const interval = setInterval(() => {
      setSelectedStudent(students[Math.floor(Math.random() * students.length)]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsSpinning(false);
        // Final pick
        const finalPick = students[Math.floor(Math.random() * students.length)];
        setSelectedStudent(finalPick);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-fuchsia-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Trò chơi Lớp học</h2>
          <p className="text-slate-500 text-sm">Công cụ gọi tên ngẫu nhiên và tương tác vui nhộn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-fuchsia-500" />
            Danh sách lớp ({students.length})
          </h3>
          <form onSubmit={addStudent} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newStudent}
              onChange={e => setNewStudent(e.target.value)}
              placeholder="Nhập tên học sinh..."
              className="flex-1 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-fuchsia-500 text-sm"
            />
            <button type="submit" className="p-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors">
              <UserPlus className="w-5 h-5" />
            </button>
          </form>
          
          <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
            {students.map((student, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-sm">
                <span className="font-medium text-slate-700">{student}</span>
                <button onClick={() => removeStudent(student)} className="text-red-400 hover:text-red-600 font-bold px-2">&times;</button>
              </div>
            ))}
            {students.length === 0 && <p className="text-slate-400 text-sm text-center">Chưa có học sinh nào</p>}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-fuchsia-50/50 p-6 rounded-2xl border border-fuchsia-100 min-h-[300px]">
          <Trophy className="w-16 h-16 text-yellow-400 mb-6 drop-shadow-md" />
          
          <div className="h-24 flex items-center justify-center w-full mb-8">
            {selectedStudent ? (
              <div className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 text-center transition-all ${isSpinning ? 'scale-90 opacity-70' : 'scale-110 drop-shadow-sm'}`}>
                {selectedStudent}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">Nhấn nút bên dưới để chọn ngẫu nhiên</div>
            )}
          </div>

          <button 
            onClick={pickRandom}
            disabled={isSpinning || students.length === 0}
            className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none"
          >
            {isSpinning ? 'Đang chọn...' : 'Gọi Tên Ngẫu Nhiên'}
          </button>
        </div>
      </div>
    </div>
  );
}

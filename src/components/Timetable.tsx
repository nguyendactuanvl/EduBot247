import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';

interface ClassSession {
  id: string;
  subject: string;
  room: string;
  time: string;
}

type TimetableData = Record<string, ClassSession[]>;

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export function Timetable() {
  const [schedule, setSchedule] = useState<TimetableData>(() => {
    const saved = localStorage.getItem('edubot-timetable');
    if (saved) return JSON.parse(saved);
    const initial: TimetableData = {};
    DAYS.forEach(d => initial[d] = []);
    return initial;
  });

  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    localStorage.setItem('edubot-timetable', JSON.stringify(schedule));
  }, [schedule]);

  const handleAdd = () => {
    if (!editingDay || !newSubject) return;
    const newSession: ClassSession = {
      id: Date.now().toString(),
      subject: newSubject,
      room: newRoom,
      time: newTime
    };
    
    setSchedule(prev => ({
      ...prev,
      [editingDay]: [...prev[editingDay], newSession]
    }));
    
    setNewSubject('');
    setNewRoom('');
    setNewTime('');
    setEditingDay(null);
  };

  const handleRemove = (day: string, id: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(s => s.id !== id)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Thời khóa biểu</h2>
          <p className="text-slate-500 text-sm">Quản lý lịch học hàng tuần chuyên nghiệp</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DAYS.map(day => (
          <div key={day} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
              {day}
              <button 
                onClick={() => setEditingDay(day)}
                className="p-1 hover:bg-white rounded text-violet-600 transition-colors"
                title="Thêm môn học"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-3 flex-1 flex flex-col gap-2">
              {schedule[day]?.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-4 italic">Trống</div>
              )}
              {schedule[day]?.map(session => (
                <div key={session.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                  <div className="font-bold text-slate-800">{session.subject}</div>
                  <div className="text-xs text-slate-500 flex justify-between mt-1">
                    <span>{session.time || 'Cả ngày'}</span>
                    <span>{session.room}</span>
                  </div>
                  <button 
                    onClick={() => handleRemove(day, session.id)}
                    className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {editingDay === day && (
                <div className="bg-white p-3 rounded-lg border-2 border-violet-200 shadow-sm mt-2 flex flex-col gap-2">
                  <input 
                    autoFocus
                    placeholder="Tên môn học (VD: Toán)"
                    className="w-full text-sm p-1.5 border-b border-slate-200 outline-none focus:border-violet-500"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input 
                      placeholder="Giờ (VD: 7h30)"
                      className="w-1/2 text-xs p-1.5 border-b border-slate-200 outline-none focus:border-violet-500"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                    />
                    <input 
                      placeholder="Phòng (VD: P102)"
                      className="w-1/2 text-xs p-1.5 border-b border-slate-200 outline-none focus:border-violet-500"
                      value={newRoom}
                      onChange={e => setNewRoom(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={handleAdd} className="flex-1 py-1.5 bg-violet-600 text-white text-xs font-medium rounded hover:bg-violet-700">Lưu</button>
                    <button onClick={() => setEditingDay(null)} className="flex-1 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded hover:bg-slate-200">Hủy</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

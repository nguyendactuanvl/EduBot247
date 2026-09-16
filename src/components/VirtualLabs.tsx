import React, { useState } from 'react';
import { Beaker, Atom, PlayCircle, X, Maximize2, ExternalLink, Zap, Droplets, Activity, Orbit, RefreshCw, Layers } from 'lucide-react';

type Subject = 'all' | 'physics' | 'chemistry';

interface Lab {
  id: string;
  title: string;
  subject: Subject;
  url: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const LABS: Lab[] = [
  // HÓA HỌC
  {
    id: 'build-an-atom',
    title: 'Xây dựng Nguyên tử',
    subject: 'chemistry',
    url: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_vi.html',
    description: 'Thêm các proton, nơtron và electron để tạo nên nguyên tử. Xác định nguyên tố, điện tích và khối lượng.',
    icon: <Orbit className="w-8 h-8 text-white" />,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'balancing-chemical-equations',
    title: 'Cân bằng Phương trình Hóa học',
    subject: 'chemistry',
    url: 'https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_vi.html',
    description: 'Thực hành cân bằng các phương trình phản ứng hóa học thông qua các mô hình trực quan sinh động.',
    icon: <RefreshCw className="w-8 h-8 text-white" />,
    color: 'from-fuchsia-500 to-purple-500'
  },
  {
    id: 'concentration',
    title: 'Nồng độ Dung dịch',
    subject: 'chemistry',
    url: 'https://phet.colorado.edu/sims/html/concentration/latest/concentration_vi.html',
    description: 'Quan sát sự thay đổi màu sắc và đo nồng độ khi pha trộn các hóa chất khác nhau với nước.',
    icon: <Droplets className="w-8 h-8 text-white" />,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'states-of-matter',
    title: 'Trạng thái Vật chất',
    subject: 'chemistry',
    url: 'https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_vi.html',
    description: 'Đun nóng, làm lạnh và nén các nguyên tử/phân tử để quan sát sự chuyển đổi giữa thể Rắn, Lỏng và Khí.',
    icon: <Layers className="w-8 h-8 text-white" />,
    color: 'from-violet-500 to-indigo-500'
  },
  {
    id: 'acid-base-solutions',
    title: 'Dung dịch Axit - Bazơ',
    subject: 'chemistry',
    url: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_vi.html',
    description: 'Đo độ pH và độ dẫn điện của các dung dịch axit và bazơ mạnh, yếu khác nhau ở cấp độ vi mô.',
    icon: <Beaker className="w-8 h-8 text-white" />,
    color: 'from-emerald-500 to-teal-500'
  },
  
  // VẬT LÝ
  {
    id: 'pendulum-lab',
    title: 'Con lắc Đơn',
    subject: 'physics',
    url: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_vi.html',
    description: 'Khám phá chu kỳ dao động, năng lượng và ma sát của con lắc đơn trong các môi trường trọng lực khác nhau.',
    icon: <Activity className="w-8 h-8 text-white" />,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'ohms-law',
    title: 'Định luật Ohm',
    subject: 'physics',
    url: 'https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_vi.html',
    description: 'Xem phương trình của định luật Ohm biến đổi tương tác như thế nào khi bạn điều chỉnh điện áp (V) và điện trở (R).',
    icon: <Zap className="w-8 h-8 text-white" />,
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'forces-and-motion',
    title: 'Lực và Chuyển động',
    subject: 'physics',
    url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_vi.html',
    description: 'Nghiên cứu về lực đẩy, lực kéo, ma sát và gia tốc với bài kiểm tra kéo co vui nhộn.',
    icon: <Atom className="w-8 h-8 text-white" />,
    color: 'from-red-500 to-rose-600'
  },
  {
    id: 'bending-light',
    title: 'Khúc xạ Ánh sáng',
    subject: 'physics',
    url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_vi.html',
    description: 'Tìm hiểu định luật Snell bằng cách chiếu tia laser qua lăng kính, nước, thủy tinh và nhiều môi trường khác.',
    icon: <PlayCircle className="w-8 h-8 text-white" />,
    color: 'from-yellow-400 to-amber-500'
  },
  {
    id: 'energy-skate-park',
    title: 'Năng lượng Ván trượt',
    subject: 'physics',
    url: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_vi.html',
    description: 'Quan sát sự chuyển hóa giữa động năng và thế năng thông qua mô phỏng sân trượt ván.',
    icon: <Maximize2 className="w-8 h-8 text-white" />,
    color: 'from-lime-500 to-green-600'
  }
];

export function VirtualLabs() {
  const [filter, setFilter] = useState<Subject>('all');
  const [activeLab, setActiveLab] = useState<Lab | null>(null);

  const filteredLabs = LABS.filter(lab => filter === 'all' || lab.subject === filter);

  if (activeLab) {
    return (
      <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeLab.color} flex items-center justify-center`}>
              {activeLab.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{activeLab.title}</h3>
              <p className="text-slate-400 text-xs">PhET Interactive Simulations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={activeLab.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium text-white"
              title="Mở trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Mở toàn màn hình</span>
            </a>
            <button 
              onClick={() => setActiveLab(null)}
              className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors text-white"
              title="Đóng thí nghiệm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full bg-black relative">
          <iframe 
            src={activeLab.url}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            title={activeLab.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Beaker className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Thí Nghiệm Ảo (Virtual Labs)</h2>
          <p className="text-slate-500 text-sm">Mô phỏng tương tác trực quan Vật lý & Hóa học (Nguồn: PhET)</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-1.5 rounded-xl inline-flex">
        <button 
          onClick={() => setFilter('all')} 
          className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          Tất cả
        </button>
        <button 
          onClick={() => setFilter('chemistry')} 
          className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${filter === 'chemistry' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <Beaker className="w-4 h-4" />
          Hóa học
        </button>
        <button 
          onClick={() => setFilter('physics')} 
          className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${filter === 'physics' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          <Atom className="w-4 h-4" />
          Vật lý
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLabs.map(lab => (
          <div key={lab.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
            <div className={`h-32 bg-gradient-to-br ${lab.color} flex items-center justify-center relative overflow-hidden`}>
              {/* Abstract pattern background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="transform group-hover:scale-110 transition-transform duration-500 z-10">
                {lab.icon}
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${lab.subject === 'chemistry' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-amber-100 text-amber-700'}`}>
                  {lab.subject === 'chemistry' ? 'Hóa học' : 'Vật lý'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{lab.title}</h3>
              <p className="text-slate-500 text-sm flex-1 mb-6 line-clamp-3">{lab.description}</p>
              
              <button 
                onClick={() => setActiveLab(lab)}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-blue-50 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200 hover:border-blue-200 group-hover:bg-blue-600 group-hover:text-white"
              >
                <PlayCircle className="w-5 h-5" />
                Mở Thí nghiệm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

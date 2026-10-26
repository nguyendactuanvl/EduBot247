import React from 'react';
import { ExternalLink, Orbit } from 'lucide-react';

export interface Lab {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function LabCard({ lab, onClick }: { lab: Lab; onClick: (lab: Lab) => void }) {
  return (
    <button
      onClick={() => onClick(lab)}
      className="group p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all text-left space-y-3 w-full"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lab.color} flex items-center justify-center shadow-sm`}>
        {lab.icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100">{lab.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{lab.description}</p>
      </div>
      <div className="pt-2 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
        Trải nghiệm ngay <ExternalLink className="w-3 h-3 ml-1" />
      </div>
    </button>
  );
}

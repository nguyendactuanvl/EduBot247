import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface StepByStepProps {
  result: CalculationResult;
}

export function StepByStep({ result }: StepByStepProps) {
  const round = (num: number) => Math.round(num * 100) / 100;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
      <div className="p-6 border-b border-slate-100 bg-slate-50 print:bg-transparent print:border-b-2 print:border-slate-800">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Lời giải chi tiết
        </h2>
      </div>
      <div className="divide-y divide-slate-100 print:divide-none">
        <Accordion title="1. Tính số trung bình (x̄)">
          <div className="space-y-4 text-slate-700">
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm">
              <p className="font-semibold text-blue-900 mb-1">Công thức:</p>
              <div className="font-mono text-base text-blue-800">
                x̄ = (m<sub>1</sub>x<sub>1</sub> + m<sub>2</sub>x<sub>2</sub> + ... + m<sub>k</sub>x<sub>k</sub>) / n
              </div>
              <p className="text-blue-700/80 mt-2 italic text-xs">Trong đó x<sub>i</sub> là giá trị đại diện của nhóm thứ i, m<sub>i</sub> là tần số tương ứng.</p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm overflow-x-auto print:bg-white print:border print:border-slate-300">
              x̄ = ({result.intervals.map((i, idx) => `${i.frequency}×${result.classMarks[idx]}`).join(' + ')}) / {result.n}
              <br />
              x̄ = {round(result.mean)}
            </div>
          </div>
        </Accordion>

        <Accordion title="2. Tính phương sai (s²) và độ lệch chuẩn (s)">
          <div className="space-y-4 text-slate-700">
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm">
              <p className="font-semibold text-blue-900 mb-1">Công thức phương sai:</p>
              <div className="font-mono text-base text-blue-800">
                s² = [m<sub>1</sub>(x<sub>1</sub> - x̄)² + ... + m<sub>k</sub>(x<sub>k</sub> - x̄)²] / n
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm overflow-x-auto whitespace-nowrap print:bg-white print:border print:border-slate-300 print:whitespace-normal">
              s² = [
              {result.intervals.map((i, idx) => `${i.frequency}×(${result.classMarks[idx]} - ${round(result.mean)})²`).join(' + ')}
              ] / {result.n}
              <br />
              <span className="font-semibold text-blue-600 mt-2 block text-lg">s² = {round(result.variance)}</span>
            </div>
            
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 text-sm mt-6">
              <p className="font-semibold text-emerald-900 mb-1">Công thức độ lệch chuẩn:</p>
              <div className="font-mono text-base text-emerald-800">
                s = √s²
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm print:bg-white print:border print:border-slate-300">
              s = √{round(result.variance)}
              <br />
              <span className="font-semibold text-emerald-600 mt-2 block text-lg">s ≈ {round(result.stdDev)}</span>
            </div>
          </div>
        </Accordion>

        <Accordion title="3. Tìm các tứ phân vị (Q₁, Q₂, Q₃)">
          <div className="space-y-8 text-slate-700">
            <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 text-sm">
              <p className="font-semibold text-amber-900 mb-1">Công thức tổng quát Tứ phân vị thứ r (r = 1, 2, 3):</p>
              <div className="font-mono text-base text-amber-800 flex items-center gap-2">
                <span>Q<sub>r</sub> = a<sub>p</sub> + </span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-amber-800 pb-1">r·n/4 - cf<sub>p-1</sub></span>
                  <span className="pt-1">m<sub>p</sub></span>
                </span>
                <span> × (a<sub>p+1</sub> - a<sub>p</sub>)</span>
              </div>
              <ul className="text-amber-800/80 mt-3 text-xs list-disc pl-4 space-y-1">
                <li>[a<sub>p</sub>; a<sub>p+1</sub>): Nhóm chứa tứ phân vị thứ r</li>
                <li>m<sub>p</sub>: Tần số của nhóm chứa tứ phân vị</li>
                <li>cf<sub>p-1</sub>: Tần số tích lũy của nhóm <strong>ngay trước</strong> nhóm chứa tứ phân vị</li>
                <li>n: Tổng số liệu (Cỡ mẫu) = {result.n}</li>
              </ul>
            </div>
            
            {/* Q1 */}
            <div className="relative pl-4 border-l-2 border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Tứ phân vị thứ nhất (Q₁)</h4>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-sm">
                <li>Vị trí: 1 × {result.n} / 4 = {result.q1Steps.pos}</li>
                <li>Dựa vào bảng tần số tích lũy, nhóm chứa Q₁ là: [{result.intervals[result.q1Steps.groupIndex]?.start}; {result.intervals[result.q1Steps.groupIndex]?.end})</li>
              </ul>
              <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm overflow-x-auto print:bg-white print:border print:border-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <span>Q₁ = {result.intervals[result.q1Steps.groupIndex]?.start} + </span>
                  <span className="inline-flex flex-col text-center">
                    <span className="border-b border-slate-400 pb-1">{result.q1Steps.pos} - {result.q1Steps.groupIndex > 0 ? result.cumulativeFrequencies[result.q1Steps.groupIndex - 1] : 0}</span>
                    <span className="pt-1">{result.intervals[result.q1Steps.groupIndex]?.frequency}</span>
                  </span>
                  <span> × ({result.intervals[result.q1Steps.groupIndex]?.end} - {result.intervals[result.q1Steps.groupIndex]?.start})</span>
                </div>
                <span className="font-semibold text-blue-600 mt-2 block text-lg">Q₁ = {round(result.q1)}</span>
              </div>
            </div>

            {/* Q2 */}
            <div className="relative pl-4 border-l-2 border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Tứ phân vị thứ hai / Trung vị (Q₂)</h4>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-sm">
                <li>Vị trí: 2 × {result.n} / 4 = {result.q2Steps.pos}</li>
                <li>Nhóm chứa Q₂ là: [{result.intervals[result.q2Steps.groupIndex]?.start}; {result.intervals[result.q2Steps.groupIndex]?.end})</li>
              </ul>
              <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm overflow-x-auto print:bg-white print:border print:border-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <span>Q₂ = {result.intervals[result.q2Steps.groupIndex]?.start} + </span>
                  <span className="inline-flex flex-col text-center">
                    <span className="border-b border-slate-400 pb-1">{result.q2Steps.pos} - {result.q2Steps.groupIndex > 0 ? result.cumulativeFrequencies[result.q2Steps.groupIndex - 1] : 0}</span>
                    <span className="pt-1">{result.intervals[result.q2Steps.groupIndex]?.frequency}</span>
                  </span>
                  <span> × ({result.intervals[result.q2Steps.groupIndex]?.end} - {result.intervals[result.q2Steps.groupIndex]?.start})</span>
                </div>
                <span className="font-semibold text-blue-600 mt-2 block text-lg">Q₂ = {round(result.q2)}</span>
              </div>
            </div>

            {/* Q3 */}
            <div className="relative pl-4 border-l-2 border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Tứ phân vị thứ ba (Q₃)</h4>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-sm">
                <li>Vị trí: 3 × {result.n} / 4 = {result.q3Steps.pos}</li>
                <li>Nhóm chứa Q₃ là: [{result.intervals[result.q3Steps.groupIndex]?.start}; {result.intervals[result.q3Steps.groupIndex]?.end})</li>
              </ul>
              <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm overflow-x-auto print:bg-white print:border print:border-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <span>Q₃ = {result.intervals[result.q3Steps.groupIndex]?.start} + </span>
                  <span className="inline-flex flex-col text-center">
                    <span className="border-b border-slate-400 pb-1">{result.q3Steps.pos} - {result.q3Steps.groupIndex > 0 ? result.cumulativeFrequencies[result.q3Steps.groupIndex - 1] : 0}</span>
                    <span className="pt-1">{result.intervals[result.q3Steps.groupIndex]?.frequency}</span>
                  </span>
                  <span> × ({result.intervals[result.q3Steps.groupIndex]?.end} - {result.intervals[result.q3Steps.groupIndex]?.start})</span>
                </div>
                <span className="font-semibold text-blue-600 mt-2 block text-lg">Q₃ = {round(result.q3)}</span>
              </div>
            </div>

            <div className="relative pl-4 border-l-2 border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Khoảng tứ phân vị (∆Q)</h4>
              <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm print:bg-white print:border print:border-slate-300">
                <div className="mb-2">∆Q = Q₃ - Q₁ = {round(result.q3)} - {round(result.q1)}</div>
                <span className="font-semibold text-indigo-600 block text-lg">∆Q = {round(result.iqr)}</span>
              </div>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true); // Open by default for printing
  return (
    <div className="p-6 print:p-2 print:pb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-medium text-slate-800 hover:text-blue-600 transition-colors print:hidden"
      >
        <span className="text-lg">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <div className="hidden print:block text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">
        {title}
      </div>
      {isOpen && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200 print:mt-2">
          {children}
        </div>
      )}
    </div>
  );
}

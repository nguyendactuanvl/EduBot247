import React, { useRef, useState } from 'react';
import { CalculationResult } from '../types';
import { StepByStep } from './StepByStep';
import { Printer, Presentation } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { SlideshowModal } from './SlideshowModal';

interface ResultViewProps {
  result: CalculationResult;
}

export function ResultView({ result }: ResultViewProps) {
  const round = (num: number) => Math.round(num * 100) / 100;
  const contentRef = useRef<HTMLDivElement>(null);
  const [showSlideshow, setShowSlideshow] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'Loi-Giai-Toan-Thong-Ke-12',
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Kết quả tính toán</h2>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button 
              onClick={() => reactToPrintFn()}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Xuất PDF</span>
            </button>
            <button 
              onClick={() => setShowSlideshow(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm border border-blue-200"
            >
              <Presentation className="w-4 h-4" />
              <span>Trình chiếu</span>
            </button>
          </div>
        </div>

        {/* Content to be printed */}
        <div ref={contentRef} className="print:p-8 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 hidden print:block">Kết quả tính toán - Thống kê 12</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <MetricCard label="Cỡ mẫu (n)" value={result.n} />
              <MetricCard label="Trung bình (x̄)" value={round(result.mean)} />
              <MetricCard label="Phương sai (s²)" value={round(result.variance)} />
              <MetricCard label="Độ lệch chuẩn (s)" value={round(result.stdDev)} />
              <MetricCard label="Khoảng biến thiên (R)" value={round(result.range)} />
              <MetricCard label="Tứ phân vị 1 (Q₁)" value={round(result.q1)} />
              <MetricCard label="Trung vị (Q₂)" value={round(result.q2)} />
              <MetricCard label="Tứ phân vị 3 (Q₃)" value={round(result.q3)} />
              <MetricCard label="Khoảng tứ phân vị (∆Q)" value={round(result.iqr)} className="col-span-2 md:col-span-4" />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 text-slate-800">Bảng tần số tích lũy</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm print:text-base print:border print:border-slate-300">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 print:border-slate-300 print:bg-slate-100">
                      <th className="p-3 font-medium text-slate-600 print:border-r print:border-slate-300">Nhóm</th>
                      <th className="p-3 font-medium text-slate-600 print:border-r print:border-slate-300">Giá trị đại diện (xᵢ)</th>
                      <th className="p-3 font-medium text-slate-600 print:border-r print:border-slate-300">Tần số (mᵢ)</th>
                      <th className="p-3 font-medium text-slate-600">Tần số tích lũy (cf)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.intervals.map((interval, idx) => (
                      <tr key={interval.id} className="border-b border-slate-100 last:border-0 print:border-slate-300">
                        <td className="p-3 font-mono print:border-r print:border-slate-300">[{interval.start}; {interval.end})</td>
                        <td className="p-3 print:border-r print:border-slate-300">{result.classMarks[idx]}</td>
                        <td className="p-3 print:border-r print:border-slate-300">{interval.frequency}</td>
                        <td className="p-3 font-medium text-blue-600 print:text-black">{result.cumulativeFrequencies[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-medium print:border-slate-300 print:bg-slate-100">
                    <tr>
                      <td className="p-3 print:border-r print:border-slate-300">Tổng</td>
                      <td className="p-3 print:border-r print:border-slate-300"></td>
                      <td className="p-3 print:border-r print:border-slate-300">{result.n}</td>
                      <td className="p-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="print:break-before-page">
            <StepByStep result={result} />
          </div>
        </div>
      </div>
      
      {showSlideshow && (
        <SlideshowModal 
          result={result} 
          onClose={() => setShowSlideshow(false)} 
        />
      )}
    </>
  );
}

function MetricCard({ label, value, className = "" }: { label: string; value: number | string; className?: string }) {
  return (
    <div className={`bg-slate-50 p-4 rounded-lg border border-slate-100 ${className}`}>
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-slate-800">{value}</div>
    </div>
  );
}

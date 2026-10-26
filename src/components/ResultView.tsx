import React, { useRef, useState } from 'react';
import { CalculationResult } from '../types';
import { StepByStep } from './StepByStep';
import { 
  Printer, 
  Presentation, 
  Download, 
  BookOpen, 
  Loader2, 
  Hash, 
  TrendingUp, 
  Activity, 
  Gauge, 
  Maximize2, 
  PieChart, 
  Sliders, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { SlideshowModal } from './SlideshowModal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { StatisticsCharts } from './StatisticsCharts';

interface ResultViewProps {
  result: CalculationResult;
}

export function ResultView({ result }: ResultViewProps) {
  const round = (num: number) => Math.round(num * 100) / 100;
  const contentRef = useRef<HTMLDivElement>(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);
  const [practiceContent, setPracticeContent] = useState('');

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'Loi-Giai-Toan-Thong-Ke-12',
  });

  const exportToPDF = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ket-qua-thong-ke.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generatePractice = async () => {
    setIsGeneratingPractice(true);
    setPracticeContent('');
    
    try {
      const intervalsStr = result.intervals.map(i => `[${i.start}; ${i.end}): tần số ${i.frequency}`).join(', ');
      
      const prompt = `Tôi có mẫu số liệu ghép nhóm sau: ${intervalsStr}.
Hãy đóng vai một giáo viên Toán lớp 12, sinh ra 3 bài tập luyện tập tương tự liên quan đến mẫu số liệu ghép nhóm (tìm khoảng tứ phân vị, phương sai, độ lệch chuẩn, số trung bình, trung vị...).
Yêu cầu:
- Viết rõ ràng bằng tiếng Việt.
- Sử dụng format Markdown và LaTeX cho công thức toán.
- Mỗi bài tập nên có hoàn cảnh thực tế (ví dụ: điểm kiểm tra, chiều cao, thời gian...)
- Mỗi bài cần có bảng số liệu và yêu cầu tính toán cụ thể.`;
      
      const apiKey = localStorage.getItem('edubot-api-key');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, userApiKey: apiKey })
      });
      
      const data = await response.json();
      setPracticeContent(data.text);
    } catch (e) {
      setPracticeContent('Có lỗi xảy ra khi tạo bài tập luyện tập. Vui lòng thử lại sau.');
    } finally {
      setIsGeneratingPractice(false);
    }
  };

  // Re-trigger entrance animations on new result calculations
  const animKey = `${result.n}-${result.mean}-${result.stdDev}-${result.intervals.length}`;

  const metricsData = [
    { label: "Cỡ mẫu (n)", value: result.n, icon: Hash, badge: "Tổng thể", delayMs: 40 },
    { label: "Trung bình (x̄)", value: round(result.mean), icon: TrendingUp, badge: "Đại diện", delayMs: 80 },
    { label: "Phương sai (s²)", value: round(result.variance), icon: Activity, delayMs: 120 },
    { label: "Độ lệch chuẩn (s)", value: round(result.stdDev), icon: Gauge, badge: "Độ tán xạ", delayMs: 160 },
    { label: "Khoảng biến thiên (R)", value: round(result.range), icon: Maximize2, delayMs: 200 },
    { label: "Tứ phân vị 1 (Q₁)", value: round(result.q1), icon: PieChart, delayMs: 240 },
    { label: "Trung vị (Q₂)", value: round(result.q2), icon: Sliders, badge: "Trung tâm", delayMs: 280 },
    { label: "Tứ phân vị 3 (Q₃)", value: round(result.q3), icon: PieChart, delayMs: 320 },
    { label: "Khoảng tứ phân vị (∆Q)", value: round(result.iqr), icon: Layers, badge: "Độ biến động 50%", className: "col-span-2 md:col-span-4", delayMs: 360 },
  ];

  return (
    <>
      <div key={animKey} className="space-y-6">
        {/* Top Header Controls - Animated */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-result-fade">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Kết quả tính toán Thống kê</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Các đặc trưng đo xu thế trung tâm & độ đo thâm nhập ghép nhóm</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <button 
              onClick={() => reactToPrintFn()}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all font-medium text-sm shadow-xs active:scale-95 cursor-pointer"
              title="In kết quả"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In kết quả</span>
            </button>
            <button 
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-all font-medium text-sm border border-emerald-200 dark:border-emerald-800 disabled:opacity-50 shadow-xs active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang tạo PDF...' : 'Tải PDF'}</span>
            </button>
            <button 
              onClick={() => setShowSlideshow(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-all font-medium text-sm border border-blue-200 dark:border-blue-800 shadow-xs active:scale-95 cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              <span>Trình chiếu</span>
            </button>
          </div>
        </div>

        {/* Content to be printed */}
        <div ref={contentRef} className="print:p-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100 hidden print:block">Kết quả tính toán - Thống kê 12</h2>
            
            {/* Staggered Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {metricsData.map((m) => (
                <MetricCard 
                  key={m.label}
                  label={m.label}
                  value={m.value}
                  icon={m.icon}
                  badge={m.badge}
                  className={m.className}
                  delayMs={m.delayMs}
                />
              ))}
            </div>

            {/* Trực quan hóa Biểu đồ Thống kê Recharts với Animation */}
            <div className="mt-6 mb-8 animate-result-fade" style={{ animationDelay: '340ms' }}>
              <StatisticsCharts result={result} />
            </div>

            {/* Bảng tần số tích lũy với Animation */}
            <div className="mt-8 animate-result-fade" style={{ animationDelay: '420ms' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>Bảng tần số tích lũy ghép nhóm</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-mono">({result.intervals.length} nhóm)</span>
                </h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <table className="w-full text-left border-collapse text-sm print:text-base print:border print:border-slate-300">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700 print:border-slate-300 print:bg-slate-100">
                      <th className="p-3.5 font-semibold text-slate-700 dark:text-slate-300 print:border-r print:border-slate-300">Nhóm</th>
                      <th className="p-3.5 font-semibold text-slate-700 dark:text-slate-300 print:border-r print:border-slate-300">Giá trị đại diện ($x_i$)</th>
                      <th className="p-3.5 font-semibold text-slate-700 dark:text-slate-300 print:border-r print:border-slate-300">Tần số ($m_i$)</th>
                      <th className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">Tần số tích lũy ($cf$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.intervals.map((interval, idx) => (
                      <tr 
                        key={interval.id} 
                        className="border-b border-slate-100 dark:border-slate-700/60 last:border-0 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors duration-150 animate-result-card"
                        style={{ animationDelay: `${460 + idx * 40}ms` }}
                      >
                        <td className="p-3.5 font-mono font-medium text-slate-800 dark:text-slate-200 print:border-r print:border-slate-300">
                          [{interval.start}; {interval.end})
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 print:border-r print:border-slate-300 font-mono">
                          {result.classMarks[idx]}
                        </td>
                        <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 print:border-r print:border-slate-300 font-mono">
                          {interval.frequency}
                        </td>
                        <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400 print:text-black font-mono">
                          {result.cumulativeFrequencies[idx]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-700 font-semibold print:border-slate-300 print:bg-slate-100">
                    <tr>
                      <td className="p-3.5 text-slate-800 dark:text-slate-200 print:border-r print:border-slate-300">Tổng cộng</td>
                      <td className="p-3.5 print:border-r print:border-slate-300"></td>
                      <td className="p-3.5 text-slate-900 dark:text-slate-100 print:border-r print:border-slate-300 font-mono font-black text-base">
                        {result.n}
                      </td>
                      <td className="p-3.5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Bước giải chi tiết - StepByStep */}
          <div className="print:break-before-page animate-result-fade" style={{ animationDelay: '520ms' }}>
            <StepByStep result={result} />
          </div>
        </div>
        
        {/* Luyện tập thêm - Animated practice section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mt-6 print:hidden animate-result-fade" style={{ animationDelay: '600ms' }}>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                   <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                   <span>Luyện tập thêm</span>
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tạo 3 bài tập tương tự mẫu số liệu vừa nhập để thực hành</p>
              </div>
              <button
                onClick={generatePractice}
                disabled={isGeneratingPractice}
                className="mt-4 sm:mt-0 flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium text-sm shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingPractice ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
                <span>{isGeneratingPractice ? 'Đang tạo bài tập...' : 'Tạo bài tập'}</span>
              </button>
           </div>
           
           {practiceContent && (
             <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/60 markdown-body prose prose-slate dark:prose-invert max-w-none [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>h1]:font-bold [&>h1]:text-2xl [&>h2]:font-bold [&>h2]:text-xl [&>h3]:font-bold [&>h3]:text-lg animate-result-fade">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {practiceContent}
                </ReactMarkdown>
             </div>
           )}
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

function MetricCard({ 
  label, 
  value, 
  icon: Icon,
  badge,
  className = "",
  delayMs = 0
}: { 
  label: string; 
  value: number | string; 
  icon?: React.ElementType;
  badge?: string;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div 
      className={`bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 animate-result-card group ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200" />}
          <span>{label}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {badge}
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-tight">{value}</div>
    </div>
  );
}

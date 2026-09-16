import React, { useRef, useState } from 'react';
import { CalculationResult } from '../types';
import { StepByStep } from './StepByStep';
import { Printer, Presentation, Download, BookOpen, Loader2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { SlideshowModal } from './SlideshowModal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Kết quả tính toán</h2>
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <button 
              onClick={() => reactToPrintFn()}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
              title="In kết quả"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In kết quả</span>
            </button>
            <button 
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium text-sm border border-green-200 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang tạo PDF...' : 'Tải PDF'}</span>
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
        
        {/* Luyện tập thêm */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6 print:hidden">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                 <h2 className="text-xl font-semibold text-slate-800">Luyện tập thêm</h2>
                 <p className="text-slate-500 text-sm mt-1">Tạo 3 bài tập tương tự mẫu số liệu vừa nhập để thực hành</p>
              </div>
              <button
                onClick={generatePractice}
                disabled={isGeneratingPractice}
                className="mt-4 sm:mt-0 flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors font-medium text-sm shadow-sm disabled:opacity-50"
              >
                {isGeneratingPractice ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
                <span>{isGeneratingPractice ? 'Đang tạo bài tập...' : 'Tạo bài tập'}</span>
              </button>
           </div>
           
           {practiceContent && (
             <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 markdown-body prose prose-slate max-w-none [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>h1]:font-bold [&>h1]:text-2xl [&>h2]:font-bold [&>h2]:text-xl [&>h3]:font-bold [&>h3]:text-lg">
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

function MetricCard({ label, value, className = "" }: { label: string; value: number | string; className?: string }) {
  return (
    <div className={`bg-slate-50 p-4 rounded-lg border border-slate-100 ${className}`}>
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-slate-800">{value}</div>
    </div>
  );
}

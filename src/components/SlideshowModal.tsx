import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { StepByStep } from './StepByStep';

interface SlideshowModalProps {
  result: CalculationResult;
  onClose: () => void;
}

export function SlideshowModal({ result, onClose }: SlideshowModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const round = (num: number) => Math.round(num * 100) / 100;

  const slides = [
    {
      title: "1. Bảng Tần Số Tích Lũy",
      content: (
        <div className="w-full max-w-3xl mx-auto mt-8">
          <table className="w-full text-left border-collapse text-lg bg-white shadow-sm rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4">Nhóm</th>
                <th className="p-4">Giá trị đại diện (xᵢ)</th>
                <th className="p-4">Tần số (mᵢ)</th>
                <th className="p-4">Tần số tích lũy (cf)</th>
              </tr>
            </thead>
            <tbody>
              {result.intervals.map((interval, idx) => (
                <tr key={interval.id} className="border-b border-slate-100">
                  <td className="p-4 font-mono">[{interval.start}; {interval.end})</td>
                  <td className="p-4">{result.classMarks[idx]}</td>
                  <td className="p-4">{interval.frequency}</td>
                  <td className="p-4 font-medium text-blue-600">{result.cumulativeFrequencies[idx]}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-slate-700 border-t-2 border-slate-200">
              <tr>
                <td className="p-4">Tổng</td>
                <td className="p-4"></td>
                <td className="p-4">n = {result.n}</td>
                <td className="p-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )
    },
    {
      title: "2. Số Trung Bình (x̄)",
      content: (
        <div className="w-full max-w-3xl mx-auto mt-8 space-y-6 text-xl text-slate-700">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
            <p className="font-semibold text-blue-800 mb-2">Công thức tính:</p>
            <p className="font-mono text-2xl">
              x̄ = (m<sub>1</sub>x<sub>1</sub> + m<sub>2</sub>x<sub>2</sub> + ... + m<sub>k</sub>x<sub>k</sub>) / n
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 font-mono text-center">
            x̄ = ({result.intervals.map((i, idx) => `${i.frequency}×${result.classMarks[idx]}`).join(' + ')}) / {result.n}
            <div className="mt-4 text-3xl font-bold text-blue-600">
              x̄ = {round(result.mean)}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. Phương Sai & Độ Lệch Chuẩn",
      content: (
        <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 text-xl text-slate-700">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <p className="font-semibold text-blue-800 mb-2 text-center">Phương sai (s²)</p>
              <p className="font-mono text-lg text-center break-words">
                s² = [m<sub>1</sub>(x<sub>1</sub> - x̄)² + ... + m<sub>k</sub>(x<sub>k</sub> - x̄)²] / n
              </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <p className="font-semibold text-emerald-800 mb-2 text-center">Độ lệch chuẩn (s)</p>
              <p className="font-mono text-lg text-center">
                s = √s²
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 font-mono text-center overflow-auto">
            s² = [
            {result.intervals.map((i, idx) => `${i.frequency}×(${result.classMarks[idx]} - ${round(result.mean)})²`).join(' + ')}
            ] / {result.n}
            <div className="mt-4 text-3xl font-bold text-blue-600">
              s² = {round(result.variance)}
            </div>
            <div className="mt-6 text-3xl font-bold text-emerald-600">
              s = √{round(result.variance)} ≈ {round(result.stdDev)}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "4. Các Tứ Phân Vị (Q₁, Q₂, Q₃)",
      content: (
        <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 text-xl text-slate-700">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
            <p className="font-semibold text-blue-800 mb-2">Công thức Tứ phân vị thứ r (với r = 1, 2, 3):</p>
            <p className="font-mono text-2xl">
              Q<sub>r</sub> = a<sub>p</sub> + <span className="inline-block align-middle"><span className="block border-b border-blue-800">r·n/4 - cf<sub>p-1</sub></span><span className="block">m<sub>p</sub></span></span> × (a<sub>p+1</sub> - a<sub>p</sub>)
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="font-semibold text-slate-800">Q₁ (Vị trí: 1×{result.n}/4 = {result.q1Steps.pos})</p>
              <p className="font-mono text-lg text-slate-600 mt-2">
                Nhóm chứa Q₁: [{result.intervals[result.q1Steps.groupIndex]?.start}; {result.intervals[result.q1Steps.groupIndex]?.end})
              </p>
              <p className="font-mono text-2xl font-bold text-blue-600 mt-2">Q₁ = {round(result.q1)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="font-semibold text-slate-800">Q₂ / Trung vị (Vị trí: 2×{result.n}/4 = {result.q2Steps.pos})</p>
              <p className="font-mono text-lg text-slate-600 mt-2">
                Nhóm chứa Q₂: [{result.intervals[result.q2Steps.groupIndex]?.start}; {result.intervals[result.q2Steps.groupIndex]?.end})
              </p>
              <p className="font-mono text-2xl font-bold text-blue-600 mt-2">Q₂ = {round(result.q2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="font-semibold text-slate-800">Q₃ (Vị trí: 3×{result.n}/4 = {result.q3Steps.pos})</p>
              <p className="font-mono text-lg text-slate-600 mt-2">
                Nhóm chứa Q₃: [{result.intervals[result.q3Steps.groupIndex]?.start}; {result.intervals[result.q3Steps.groupIndex]?.end})
              </p>
              <p className="font-mono text-2xl font-bold text-blue-600 mt-2">Q₃ = {round(result.q3)}</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4">
      {/* Header Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <div className="bg-slate-800 text-slate-300 px-4 py-2 rounded-full font-medium">
          Slide {currentSlide + 1} / {slides.length}
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl h-[80vh] flex flex-col justify-center items-center relative px-16">
        <h1 className="text-4xl font-bold text-white mb-8">
          {slides[currentSlide].title}
        </h1>
        
        <div className="w-full flex-1 overflow-y-auto pb-12 flex flex-col justify-center">
          {slides[currentSlide].content}
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-slate-400 hover:text-white disabled:opacity-0 transition-opacity"
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
        <button 
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-slate-400 hover:text-white disabled:opacity-0 transition-opacity"
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-8 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentSlide ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

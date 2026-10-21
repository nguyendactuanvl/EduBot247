import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Line, 
  ComposedChart, 
  Area,
  ReferenceLine
} from 'recharts';
import { CalculationResult } from '../types';
import { BarChart3, TrendingUp, Layers, Eye, Info } from 'lucide-react';

interface StatisticsChartsProps {
  result: CalculationResult;
}

export function StatisticsCharts({ result }: StatisticsChartsProps) {
  const [chartType, setChartType] = useState<'bar' | 'cumulative' | 'combined'>('bar');
  const [showValuesOnBar, setShowValuesOnBar] = useState(true);
  const [displayMode, setDisplayMode] = useState<'count' | 'percent'>('count');

  // Chuẩn bị dữ liệu cho biểu đồ từ mẫu số liệu ghép nhóm
  const chartData = result.intervals.map((interval, idx) => {
    const freq = typeof interval.frequency === 'number' ? interval.frequency : 0;
    const percent = result.n > 0 ? Number(((freq / result.n) * 100).toFixed(1)) : 0;
    const cumFreq = result.cumulativeFrequencies[idx] ?? 0;
    const cumPercent = result.n > 0 ? Number(((cumFreq / result.n) * 100).toFixed(1)) : 0;
    const classMark = result.classMarks[idx] ?? (Number(interval.start) + Number(interval.end)) / 2;
    const label = `[${interval.start}; ${interval.end})`;

    return {
      label,
      start: interval.start,
      end: interval.end,
      classMark,
      frequency: freq,
      percent,
      cumulativeFrequency: cumFreq,
      cumulativePercent: cumPercent,
    };
  });

  const round = (num: number) => Math.round(num * 100) / 100;

  // Custom Tooltip cho Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center justify-between">
            <span>Nhóm: {data.label}</span>
            <span className="text-slate-500 font-normal">x̄ đại diện: {data.classMark}</span>
          </div>
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-semibold">
            <span>Tần số (mᵢ):</span>
            <span className="text-sm">{data.frequency}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Tần suất tương đối:</span>
            <span>{data.percent}%</span>
          </div>
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Tần số tích lũy (cf):</span>
            <span>{data.cumulativeFrequency} ({data.cumulativePercent}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Trực quan hóa Phân bố Dữ liệu ghép nhóm
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-10">
            Biểu đồ tần số theo chuẩn Chương trình GDPT 2018 (Toán lớp 11 & 12)
          </p>
        </div>

        {/* Chart View Toggle Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1 text-xs font-semibold">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cột tần số</span>
            </button>

            <button
              onClick={() => setChartType('cumulative')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                chartType === 'cumulative'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tích lũy (Ogive)</span>
            </button>

            <button
              onClick={() => setChartType('combined')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                chartType === 'combined'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kết hợp</span>
            </button>
          </div>

          {/* Unit Toggle: Count vs Percent */}
          {chartType === 'bar' && (
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1 text-xs">
              <button
                onClick={() => setDisplayMode('count')}
                className={`px-2.5 py-1.5 rounded-lg transition-all font-medium ${
                  displayMode === 'count'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Tần số (mᵢ)
              </button>
              <button
                onClick={() => setDisplayMode('percent')}
                className={`px-2.5 py-1.5 rounded-lg transition-all font-medium ${
                  displayMode === 'percent'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Tần suất (%)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recharts Canvas Container */}
      <div className="h-[340px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                dy={8}
                label={{ value: 'Nhóm số liệu ghép nhóm [aᵢ; aᵢ₊₁)', position: 'insideBottom', offset: -16, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit={displayMode === 'percent' ? '%' : ''}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar 
                dataKey={displayMode === 'count' ? 'frequency' : 'percent'} 
                name={displayMode === 'count' ? 'Tần số (mᵢ)' : 'Tần suất (%)'} 
                fill="#6366f1" 
                radius={[6, 6, 0, 0]}
                label={showValuesOnBar ? { position: 'top', fill: '#4f46e5', fontSize: 11, fontWeight: 'bold' } : false}
              />
            </BarChart>
          ) : chartType === 'cumulative' ? (
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                dy={8}
                label={{ value: 'Nhóm số liệu', position: 'insideBottom', offset: -16, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={[0, result.n]}
                label={{ value: 'Tần số tích lũy', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Area 
                type="monotone" 
                dataKey="cumulativeFrequency" 
                name="Miền tích lũy (cf)" 
                fill="#10b981" 
                stroke="#059669" 
                fillOpacity={0.15} 
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeFrequency" 
                name="Đường tần số tích lũy" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#10b981' }}
                activeDot={{ r: 7 }}
              />
              {/* Reference line at n/2 for median identification */}
              <ReferenceLine 
                y={result.n / 2} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                label={{ value: `Vị trí trung vị n/2 = ${result.n / 2}`, position: 'right', fill: '#d97706', fontSize: 10 }} 
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                dy={8}
              />
              <YAxis 
                yAxisId="left" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Tần số mᵢ', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6366f1' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, result.n]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Tích lũy cf', angle: 90, position: 'insideRight', fontSize: 11, fill: '#10b981' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar 
                yAxisId="left" 
                dataKey="frequency" 
                name="Tần số từng nhóm (mᵢ)" 
                fill="#6366f1" 
                radius={[6, 6, 0, 0]}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="cumulativeFrequency" 
                name="Tần số tích lũy (cf)" 
                stroke="#10b981" 
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981' }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Educational Statistical Reference Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Trung bình (x̄):</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{round(result.mean)}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Trung vị (Q₂):</span>
          <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{round(result.q2)}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Độ lệch chuẩn (s):</span>
          <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{round(result.stdDev)}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Khoảng tứ phân vị:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{round(result.iqr)}</span>
        </div>
      </div>
    </div>
  );
}

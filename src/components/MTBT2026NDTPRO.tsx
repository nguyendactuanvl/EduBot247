import React, { useState } from 'react';
import * as math from 'mathjs';
import { Monitor, Layers, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export function MTBT2026NDTPRO() {
  const [mode, setMode] = useState<'COMP' | 'EQN' | 'CALC' | 'TRI' | 'STAT'>('COMP');
  
  // COMP State
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);

  // EQN State
  const [eqnDegree, setEqnDegree] = useState(2);
  const [eqnCoefs, setEqnCoefs] = useState({ a: '', b: '', c: '', d: '', e: '' });

  // CALC State
  const [calcType, setCalcType] = useState<'deriv' | 'integ'>('deriv');
  const [calcFunc, setCalcFunc] = useState('');
  const [calcVal, setCalcVal] = useState({ x: '', a: '', b: '' });

  // TRI State
  const [triVals, setTriVals] = useState({ a: '', b: '', c: '', A: '', B: '', C: '' });

  // STAT State
  const [statData, setStatData] = useState('');

  // AI State
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSolveAI = async (promptStr: string) => {
    setIsLoading(true);
    setAiResult('');
    try {
      const apiKey = localStorage.getItem('edubot-api-key');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptStr, userApiKey: apiKey })
      });
      const data = await response.json();
      setAiResult(data.text);
    } catch(e) {
      setAiResult('Lỗi kết nối. Vui lòng kiểm tra API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  const solveEQN = () => {
    const { a, b, c, d, e } = eqnCoefs;
    if (!a) return;
    let eqStr = '';
    if (eqnDegree === 2) eqStr = `${a}x^2 + ${b||0}x + ${c||0} = 0`;
    if (eqnDegree === 3) eqStr = `${a}x^3 + ${b||0}x^2 + ${c||0}x + ${d||0} = 0`;
    if (eqnDegree === 4) eqStr = `${a}x^4 + ${b||0}x^3 + ${c||0}x^2 + ${d||0}x + ${e||0} = 0`;
    handleSolveAI(`Giải chi tiết phương trình sau: $${eqStr}$. Trình bày các bước và kết luận nghiệm (kể cả nghiệm phức nếu có) bằng Markdown và LaTeX. Nếu có nhiều nghiệm, hãy liệt kê rõ ràng.`);
  };

  const solveCALC = () => {
    if (!calcFunc) return;
    let prompt = '';
    if (calcType === 'deriv') {
      prompt = `Tính đạo hàm của hàm số $f(x) = ${calcFunc}$ ${calcVal.x ? `tại điểm $x = ${calcVal.x}$` : '(đạo hàm tổng quát)'}. Trình bày các bước giải chi tiết bằng Markdown và LaTeX.`;
    } else {
      if (calcVal.a && calcVal.b) {
        prompt = `Tính tích phân xác định của hàm số $f(x) = ${calcFunc}$ từ $a = ${calcVal.a}$ đến $b = ${calcVal.b}$. Trình bày các bước giải chi tiết bằng Markdown và LaTeX.`;
      } else {
        prompt = `Tìm nguyên hàm của hàm số $f(x) = ${calcFunc}$. Trình bày các bước giải chi tiết bằng Markdown và LaTeX.`;
      }
    }
    handleSolveAI(prompt);
  };

  const solveTRI = () => {
    const { a, b, c, A, B, C } = triVals;
    const prompt = `Giải tam giác với các dữ kiện: ${[
      a && `cạnh a=${a}`, b && `cạnh b=${b}`, c && `cạnh c=${c}`,
      A && `góc A=${A}^\\circ`, B && `góc B=${B}^\\circ`, C && `góc C=${C}^\\circ`
    ].filter(Boolean).join(', ')}. Hãy tính các cạnh, góc còn lại, chu vi, diện tích và bán kính đường tròn nội/ngoại tiếp. Trình bày các bước giải chi tiết bằng định dạng Markdown và LaTeX.`;
    handleSolveAI(prompt);
  };

  const solveSTAT = () => {
    if (!statData) return;
    const prompt = `Cho mẫu số liệu không ghép nhóm sau: ${statData}. Hãy tính các đặc trưng thống kê: số trung bình, trung vị, các tứ phân vị, khoảng biến thiên, khoảng tứ phân vị, phương sai và độ lệch chuẩn. Trình bày chi tiết từng bước bằng Markdown và LaTeX.`;
    handleSolveAI(prompt);
  };

  // --- COMP LOGIC ---
  const appendToExpression = (displayChar: string, evalChar: string) => {
    setDisplay(prev => prev + displayChar);
    setExpression(prev => prev + evalChar);
    setIsShift(false);
    setIsAlpha(false);
  };

  const handleClear = () => {
    setDisplay('');
    setExpression('');
    setResult('');
    setIsShift(false);
    setIsAlpha(false);
  };

  const handleDelete = () => {
    setDisplay(prev => prev.slice(0, -1));
    setExpression(prev => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    try {
      if (!expression) return;
      let finalExpr = expression;
      const openCount = (finalExpr.match(/\(/g) || []).length;
      const closeCount = (finalExpr.match(/\)/g) || []).length;
      for (let i = 0; i < openCount - closeCount; i++) {
        finalExpr += ')';
      }
      const res = math.evaluate(finalExpr);
      const formatted = math.format(res, { precision: 10 });
      setResult(formatted);
    } catch (error) {
      setResult('Math ERROR');
    }
  };

  const handleAns = () => {
    if (result && result !== 'Math ERROR' && result !== 'Syntax ERROR') {
      appendToExpression('Ans', result);
    }
  };

  const btnClass = "h-10 md:h-12 rounded-lg font-medium text-sm md:text-base flex items-center justify-center shadow-sm active:translate-y-0.5 active:shadow-none transition-all select-none cursor-pointer";
  const numClass = `${btnClass} bg-slate-100 hover:bg-slate-200 text-slate-800 border-b-4 border-slate-300`;
  const funcClass = `${btnClass} bg-slate-800 hover:bg-slate-700 text-white border-b-4 border-slate-950`;
  const opClass = `${btnClass} bg-blue-100 hover:bg-blue-200 text-blue-900 border-b-4 border-blue-300`;
  const delAcClass = `${btnClass} bg-red-500 hover:bg-red-600 text-white border-b-4 border-red-700`;
  const shiftClass = `${btnClass} bg-yellow-500 hover:bg-yellow-600 text-yellow-950 border-b-4 border-yellow-700`;
  const alphaClass = `${btnClass} bg-rose-500 hover:bg-rose-600 text-white border-b-4 border-rose-700`;
  const equalClass = `${btnClass} bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800`;

  return (
    <div className="max-w-6xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Máy Tính Đa Năng MTBT2026NDTPRO</h2>
          <p className="text-slate-500 text-sm">Hỗ trợ tính toán cơ bản, phương trình, vi tích phân, lượng giác và thống kê</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-2 rounded-xl">
        <button onClick={() => setMode('COMP')} className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${mode === 'COMP' ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>1: COMP (Cơ bản)</button>
        <button onClick={() => setMode('EQN')} className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${mode === 'EQN' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>2: EQN (Phương trình)</button>
        <button onClick={() => setMode('CALC')} className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${mode === 'CALC' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>3: CALC (Vi tích phân)</button>
        <button onClick={() => setMode('TRI')} className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${mode === 'TRI' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>4: TRI (Tam giác)</button>
        <button onClick={() => setMode('STAT')} className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${mode === 'STAT' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>5: STAT (Thống kê)</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Standard Calc or Advanced Form */}
        <div className={`w-full ${mode === 'COMP' ? 'max-w-md mx-auto' : 'lg:w-[450px]'} shrink-0`}>
          {mode === 'COMP' ? (
            <div className="bg-slate-900 p-4 md:p-6 rounded-[2rem] shadow-2xl border-4 border-slate-800 relative flex flex-col">
              <div className="flex justify-between items-end mb-4 px-2">
                <div className="text-white font-bold tracking-widest text-lg">MTBT2026NDTPRO</div>
                <div className="text-slate-400 text-[10px] tracking-widest">NATURAL-V.P.A.M.</div>
              </div>

              <div className="bg-[#9EA792] p-3 rounded-lg shadow-inner mb-6 border-4 border-slate-700 min-h-[100px] flex flex-col font-mono relative overflow-hidden">
                <div className="text-[10px] text-slate-800/70 h-4 flex gap-2 font-bold mb-1">
                  <span className={isShift ? 'text-black' : 'opacity-0'}>S</span>
                  <span className={isAlpha ? 'text-black' : 'opacity-0'}>A</span>
                  <span>M</span>
                  <span>D</span>
                  <span>Math</span>
                </div>
                
                <div className="text-slate-900 text-lg sm:text-xl font-medium tracking-wider text-left break-all min-h-[28px] leading-tight">
                  {display || ' '}
                </div>
                <div className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-wider text-right mt-auto break-all">
                  {result}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-5 gap-2">
                  <button className={shiftClass} onClick={() => setIsShift(!isShift)}>SHIFT</button>
                  <button className={alphaClass} onClick={() => setIsAlpha(!isAlpha)}>ALPHA</button>
                  <button className={funcClass} onClick={() => appendToExpression('◀', '')}>◀</button>
                  <button className={funcClass} onClick={() => appendToExpression('▶', '')}>▶</button>
                  <button className={funcClass} onClick={handleClear}>ON</button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  <button className={funcClass} onClick={() => appendToExpression('(', '(')}>(</button>
                  <button className={funcClass} onClick={() => appendToExpression(')', ')')}>)</button>
                  <button className={funcClass} onClick={() => appendToExpression('√(', 'sqrt(')}>√</button>
                  <button className={funcClass} onClick={() => appendToExpression('²', '^2')}>x²</button>
                  <button className={funcClass} onClick={() => appendToExpression('^', '^')}>xⁿ</button>
                  <button className={funcClass} onClick={() => appendToExpression('log(', 'log10(')}>log</button>

                  <button className={funcClass} onClick={() => appendToExpression('ln(', 'log(')}>ln</button>
                  <button className={funcClass} onClick={() => appendToExpression('sin(', 'sin(')}>sin</button>
                  <button className={funcClass} onClick={() => appendToExpression('cos(', 'cos(')}>cos</button>
                  <button className={funcClass} onClick={() => appendToExpression('tan(', 'tan(')}>tan</button>
                  <button className={funcClass} onClick={() => appendToExpression('π', 'pi')}>π</button>
                  <button className={funcClass} onClick={() => appendToExpression('e', 'e')}>e</button>
                </div>

                <div className="h-2 border-b border-slate-700/50 my-1"></div>

                <div className="grid grid-cols-5 gap-2">
                  <button className={numClass} onClick={() => appendToExpression('7', '7')}>7</button>
                  <button className={numClass} onClick={() => appendToExpression('8', '8')}>8</button>
                  <button className={numClass} onClick={() => appendToExpression('9', '9')}>9</button>
                  <button className={delAcClass} onClick={handleDelete}>DEL</button>
                  <button className={delAcClass} onClick={handleClear}>AC</button>

                  <button className={numClass} onClick={() => appendToExpression('4', '4')}>4</button>
                  <button className={numClass} onClick={() => appendToExpression('5', '5')}>5</button>
                  <button className={numClass} onClick={() => appendToExpression('6', '6')}>6</button>
                  <button className={opClass} onClick={() => appendToExpression('×', '*')}>×</button>
                  <button className={opClass} onClick={() => appendToExpression('÷', '/')}>÷</button>

                  <button className={numClass} onClick={() => appendToExpression('1', '1')}>1</button>
                  <button className={numClass} onClick={() => appendToExpression('2', '2')}>2</button>
                  <button className={numClass} onClick={() => appendToExpression('3', '3')}>3</button>
                  <button className={opClass} onClick={() => appendToExpression('+', '+')}>+</button>
                  <button className={opClass} onClick={() => appendToExpression('-', '-')}>-</button>

                  <button className={numClass} onClick={() => appendToExpression('0', '0')}>0</button>
                  <button className={numClass} onClick={() => appendToExpression('.', '.')}>.</button>
                  <button className={numClass} onClick={() => appendToExpression('×10^', '*10^')}>x10ⁿ</button>
                  <button className={numClass} onClick={handleAns}>Ans</button>
                  <button className={equalClass} onClick={handleEvaluate}>=</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {mode === 'EQN' && (
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl shadow-sm h-full flex flex-col">
                  <h3 className="text-lg font-bold text-indigo-900 mb-6">Giải Phương Trình Đa Thức</h3>
                  <div className="space-y-5 flex-1">
                    <div>
                      <label className="block text-sm font-bold text-indigo-800 mb-2">Chọn bậc phương trình</label>
                      <select value={eqnDegree} onChange={e => setEqnDegree(Number(e.target.value))} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium">
                        <option value={2}>Bậc 2 (ax² + bx + c = 0)</option>
                        <option value={3}>Bậc 3 (ax³ + bx² + cx + d = 0)</option>
                        <option value={4}>Bậc 4 (ax⁴ + bx³ + cx² + dx + e = 0)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-indigo-800 mb-1">Hệ số a</label>
                        <input type="number" placeholder="a" value={eqnCoefs.a} onChange={e => setEqnCoefs({...eqnCoefs, a: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:border-indigo-500 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-indigo-800 mb-1">Hệ số b</label>
                        <input type="number" placeholder="b" value={eqnCoefs.b} onChange={e => setEqnCoefs({...eqnCoefs, b: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:border-indigo-500 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-indigo-800 mb-1">Hệ số c</label>
                        <input type="number" placeholder="c" value={eqnCoefs.c} onChange={e => setEqnCoefs({...eqnCoefs, c: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:border-indigo-500 font-medium" />
                      </div>
                      {eqnDegree >= 3 && (
                        <div>
                          <label className="block text-xs font-bold text-indigo-800 mb-1">Hệ số d</label>
                          <input type="number" placeholder="d" value={eqnCoefs.d} onChange={e => setEqnCoefs({...eqnCoefs, d: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:border-indigo-500 font-medium" />
                        </div>
                      )}
                      {eqnDegree >= 4 && (
                        <div>
                          <label className="block text-xs font-bold text-indigo-800 mb-1">Hệ số e</label>
                          <input type="number" placeholder="e" value={eqnCoefs.e} onChange={e => setEqnCoefs({...eqnCoefs, e: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:border-indigo-500 font-medium" />
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={solveEQN} disabled={isLoading || !eqnCoefs.a} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-6 disabled:opacity-50 transition-colors">Giải phương trình</button>
                </div>
              )}

              {mode === 'CALC' && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm h-full flex flex-col">
                  <h3 className="text-lg font-bold text-emerald-900 mb-6">Vi Tích Phân</h3>
                  <div className="space-y-5 flex-1">
                    <div className="flex gap-2">
                      <button onClick={() => setCalcType('deriv')} className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${calcType === 'deriv' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>Đạo hàm</button>
                      <button onClick={() => setCalcType('integ')} className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${calcType === 'integ' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>Tích phân / Nguyên hàm</button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-emerald-800 mb-2">Hàm số f(x)</label>
                      <input placeholder="VD: x^2 + 2x, sin(x), e^x..." value={calcFunc} onChange={e => setCalcFunc(e.target.value)} className="w-full p-3 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-medium" />
                    </div>
                    
                    {calcType === 'deriv' && (
                      <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-2">Tại điểm x₀ (Để trống nếu tính đạo hàm tổng quát y')</label>
                        <input placeholder="VD: 2, pi/2..." value={calcVal.x} onChange={e => setCalcVal({...calcVal, x: e.target.value})} className="w-full p-3 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-medium" />
                      </div>
                    )}
                    
                    {calcType === 'integ' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-emerald-800 mb-2">Cận dưới (a)</label>
                          <input placeholder="Trống = Nguyên hàm" value={calcVal.a} onChange={e => setCalcVal({...calcVal, a: e.target.value})} className="w-full p-3 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-emerald-800 mb-2">Cận trên (b)</label>
                          <input placeholder="Trống = Nguyên hàm" value={calcVal.b} onChange={e => setCalcVal({...calcVal, b: e.target.value})} className="w-full p-3 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-medium" />
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={solveCALC} disabled={isLoading || !calcFunc} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-6 disabled:opacity-50 transition-colors">Bắt đầu tính toán</button>
                </div>
              )}

              {mode === 'TRI' && (
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl shadow-sm h-full flex flex-col">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Hệ Thức Lượng & Giải Tam Giác</h3>
                  <p className="text-sm text-amber-700 mb-6 font-medium">Nhập ít nhất 3 dữ kiện (có ít nhất 1 cạnh) để giải tam giác.</p>
                  <div className="space-y-5 flex-1">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-amber-800 mb-1">Cạnh a</label>
                        <input type="number" placeholder="Độ dài" value={triVals.a} onChange={e => setTriVals({...triVals, a: e.target.value})} className="w-full p-2.5 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-800 mb-1">Cạnh b</label>
                        <input type="number" placeholder="Độ dài" value={triVals.b} onChange={e => setTriVals({...triVals, b: e.target.value})} className="w-full p-2.5 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-800 mb-1">Cạnh c</label>
                        <input type="number" placeholder="Độ dài" value={triVals.c} onChange={e => setTriVals({...triVals, c: e.target.value})} className="w-full p-2.5 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-800 mb-1">Góc A (°)</label>
                        <input type="number" placeholder="Độ" value={triVals.A} onChange={e => setTriVals({...triVals, A: e.target.value})} className="w-full p-2.5 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-800 mb-1">Góc B (°)</label>
                        <input type="number" placeholder="Độ" value={triVals.B} onChange={e => setTriVals({...triVals, B: e.target.value})} className="w-full p-2.5 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-800 mb-1">Góc C (°)</label>
                        <input type="number" placeholder="Độ" value={triVals.C} onChange={e => setTriVals({...triVals, C: e.target.value})} className="w-full p-2.5 rounded-lg border border-amber-200 outline-none focus:border-amber-500 font-medium" />
                      </div>
                    </div>
                  </div>
                  <button onClick={solveTRI} disabled={isLoading} className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl mt-6 disabled:opacity-50 transition-colors">Giải tam giác</button>
                </div>
              )}

              {mode === 'STAT' && (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl shadow-sm h-full flex flex-col">
                  <h3 className="text-lg font-bold text-rose-900 mb-2">Tính Toán Thống Kê</h3>
                  <p className="text-sm text-rose-700 mb-6 font-medium">Phân tích số liệu thống kê cho mẫu số liệu không ghép nhóm.</p>
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm font-bold text-rose-800 mb-2">Nhập mẫu số liệu (cách nhau bởi dấu phẩy)</label>
                      <textarea 
                        placeholder="VD: 5, 7, 8, 5, 9, 10..." 
                        value={statData} 
                        onChange={e => setStatData(e.target.value)} 
                        className="w-full p-4 rounded-xl border border-rose-200 outline-none focus:border-rose-500 h-40 resize-none font-medium" 
                      />
                    </div>
                  </div>
                  <button onClick={solveSTAT} disabled={isLoading || !statData} className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl mt-6 disabled:opacity-50 transition-colors">Phân tích số liệu</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side: AI Result Display (only for advanced modes) */}
        {mode !== 'COMP' && (
          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col min-h-[500px]">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-500"/>
              Bảng kết quả chi tiết
            </h3>
            <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-inner relative">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-500 bg-white/80 backdrop-blur-sm rounded-xl">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="font-medium text-lg text-slate-700">Đang thực hiện tính toán...</p>
                </div>
              ) : aiResult ? (
                <div className="markdown-body prose prose-slate max-w-none [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>h1]:text-xl [&>h1]:font-bold [&>h2]:text-lg [&>h2]:font-bold">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {aiResult}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center">
                  <div>
                    <Monitor className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                    Nhập dữ liệu bên trái và nhấn nút "Giải ngay"<br/>để xem các bước tính toán và kết quả chi tiết.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

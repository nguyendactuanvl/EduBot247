import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Crop } from 'lucide-react';

export function PhotoIDMaker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [size, setSize] = useState<'3x4' | '4x6'>('3x4');
  const [bgColor, setBgColor] = useState<'blue' | 'white'>('blue');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `anh-the-${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const processImage = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imageSrc) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Kích thước chuẩn (px) với DPI 300
    // 3x4 cm = 354 x 472 px
    // 4x6 cm = 472 x 709 px
    const targetWidth = size === '3x4' ? 354 : 472;
    const targetHeight = size === '3x4' ? 472 : 709;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Fill background
    ctx.fillStyle = bgColor === 'blue' ? '#0055A4' : '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Tính toán cắt ảnh (crop center)
    const imgAspect = img.width / img.height;
    const targetAspect = targetWidth / targetHeight;

    let drawWidth = img.width;
    let drawHeight = img.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > targetAspect) {
      drawHeight = targetHeight;
      drawWidth = img.width * (targetHeight / img.height);
      offsetX = (targetWidth - drawWidth) / 2;
    } else {
      drawWidth = targetWidth;
      drawHeight = img.height * (targetWidth / img.width);
      offsetY = (targetHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tạo Ảnh Thẻ (3x4, 4x6)</h2>
          <p className="text-slate-500 text-sm">Cắt và định dạng ảnh theo chuẩn kích thước thẻ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <label className="block w-full p-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-cyan-500 hover:bg-cyan-50 transition-colors cursor-pointer text-center">
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <span className="text-sm font-medium text-slate-600">Tải ảnh chân dung của bạn lên</span>
            <p className="text-xs text-slate-400 mt-1">Nên chọn ảnh có phông nền trơn hoặc tương phản tốt</p>
          </label>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kích thước</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSize('3x4')}
                  className={`flex-1 py-2 rounded-xl font-medium border ${size === '3x4' ? 'bg-cyan-50 border-cyan-500 text-cyan-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >3 x 4 cm</button>
                <button 
                  onClick={() => setSize('4x6')}
                  className={`flex-1 py-2 rounded-xl font-medium border ${size === '4x6' ? 'bg-cyan-50 border-cyan-500 text-cyan-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >4 x 6 cm</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phông nền</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setBgColor('blue')}
                  className={`flex-1 py-2 rounded-xl font-medium border flex items-center justify-center gap-2 ${bgColor === 'blue' ? 'bg-slate-50 border-cyan-500 text-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#0055A4]"></div>
                  Xanh dương
                </button>
                <button 
                  onClick={() => setBgColor('white')}
                  className={`flex-1 py-2 rounded-xl font-medium border flex items-center justify-center gap-2 ${bgColor === 'white' ? 'bg-slate-50 border-cyan-500 text-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white border border-slate-300"></div>
                  Trắng
                </button>
              </div>
            </div>
          </div>
          
          {imageSrc && (
            <button
              onClick={processImage}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors"
            >
              <Crop className="w-5 h-5" />
              Tạo ảnh thẻ
            </button>
          )}
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px]">
          {imageSrc && (
            <img 
              ref={imgRef} 
              src={imageSrc} 
              alt="Original" 
              className="hidden" 
              onLoad={processImage}
            />
          )}
          
          <canvas 
            ref={canvasRef} 
            className="max-w-full shadow-lg rounded object-contain bg-white"
            style={{ maxHeight: '350px' }}
          />

          {imageSrc && (
             <button
               onClick={handleDownload}
               className="mt-6 flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium shadow-sm transition-colors"
             >
               <Download className="w-4 h-4" />
               Tải ảnh về máy
             </button>
          )}
          {!imageSrc && (
             <div className="text-slate-400 text-center">
               Khu vực xem trước ảnh thẻ
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

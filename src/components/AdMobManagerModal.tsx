import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Smartphone, 
  Globe, 
  Code2, 
  Play, 
  ShieldCheck, 
  FileText,
  HelpCircle,
  Layers,
  Award
} from 'lucide-react';
import { ADMOB_CONFIG, ANDROID_MANIFEST_SNIPPET, ANDROID_GRADLE_SNIPPET, SPLASH_ACTIVITY_KOTLIN_SNIPPET, AdUnitConfig } from '../config/admob';

interface AdMobManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestAdUnit?: (adUnitKey: any) => void;
}

export function AdMobManagerModal({ isOpen, onClose, onTestAdUnit }: AdMobManagerModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'units' | 'android' | 'web' | 'adsTxt'>('units');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full h-[90vh] max-h-[800px] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Cấu hình Google AdMob (6 Đơn vị quảng cáo)
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Chuẩn Google 100%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mã nhà xuất bản: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{ADMOB_CONFIG.publisherId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900 overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'units'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>6 Đơn vị quảng cáo & Test</span>
          </button>
          
          <button
            onClick={() => setActiveTab('android')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'android'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Cấu hình Android (App ID)</span>
          </button>

          <button
            onClick={() => setActiveTab('web')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'web'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Web & PWA Tags</span>
          </button>

          <button
            onClick={() => setActiveTab('adsTxt')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'adsTxt'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xác thực app-ads.txt</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: 6 AD UNITS */}
          {activeTab === 'units' && (
            <div className="space-y-4">
              {/* App ID Banner (Như ảnh 2) */}
              <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-200 dark:border-indigo-800/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      ID Ứng dụng AdMob (App ID - Ảnh 2)
                    </span>
                    <p className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 break-all select-all">
                      {ADMOB_CONFIG.appId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(ADMOB_CONFIG.appId, 'app-id')}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  {copiedKey === 'app-id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'app-id' ? 'Đã sao chép' : 'Sao chép App ID'}</span>
                </button>
              </div>

              {/* 6 Ad Units Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ADMOB_CONFIG.adUnits.map((unit, idx) => (
                  <div
                    key={unit.key}
                    className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                            {unit.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {unit.formatNameVi.split('(')[0]}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {unit.description}
                      </p>

                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <code className="text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all select-all">
                          {unit.unitId}
                        </code>
                        <button
                          onClick={() => copyToClipboard(unit.unitId, unit.key)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                          title="Sao chép Ad Unit ID"
                        >
                          {copiedKey === unit.key ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="font-semibold text-slate-500">Vị trí:</span>
                        <span>{unit.recommendedPosition}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã cấu hình
                      </span>

                      {onTestAdUnit && (
                        <button
                          onClick={() => onTestAdUnit(unit.key)}
                          className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
                          <span>Chạy thử định dạng</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID CONFIGURATION */}
          {activeTab === 'android' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                  <p className="font-semibold text-sm">
                    Hướng dẫn tích hợp Google Mobile Ads SDK & TWA (Mã gói: app.vercel.edubot247.twa)
                  </p>
                  <p>
                    Khai báo App ID <code className="font-bold text-amber-900 dark:text-amber-100">{ADMOB_CONFIG.appId}</code> vào <code className="font-bold">AndroidManifest.xml</code> và khởi chạy Quảng cáo Mở ứng dụng (Ads 2: <code className="font-bold">ca-app-pub-5320880447374751/7345879147</code>) trước khi TWA mở trang <code className="font-bold">https://edubot247.vercel.app</code>.
                  </p>
                </div>
              </div>

              {/* Step 1: AndroidManifest.xml */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" /> Bước 1: Khai báo LauncherActivity trong AndroidManifest.xml
                  </span>
                  <button
                    onClick={() => copyToClipboard(ANDROID_MANIFEST_SNIPPET, 'android-manifest')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'android-manifest' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'android-manifest' ? 'Đã sao chép' : 'Sao chép đoạn mã'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-60 scrollbar-thin">
                  {ANDROID_MANIFEST_SNIPPET}
                </pre>
              </div>

              {/* Step 2: SplashActivity.kt (App Open Ad - Ads 2) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" /> Bước 2: SplashActivity.kt (Quảng cáo mở ứng dụng - Ads 2)
                  </span>
                  <button
                    onClick={() => copyToClipboard(SPLASH_ACTIVITY_KOTLIN_SNIPPET, 'splash-activity')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'splash-activity' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'splash-activity' ? 'Đã sao chép' : 'Sao chép mã Kotlin'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-60 scrollbar-thin">
                  {SPLASH_ACTIVITY_KOTLIN_SNIPPET}
                </pre>
              </div>

              {/* Step 3: build.gradle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" /> Bước 3: Khai báo Thư viện trong app/build.gradle
                  </span>
                  <button
                    onClick={() => copyToClipboard(ANDROID_GRADLE_SNIPPET, 'android-gradle')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'android-gradle' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'android-gradle' ? 'Đã sao chép' : 'Sao chép đoạn mã'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  {ANDROID_GRADLE_SNIPPET}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: WEB & PWA TAGS */}
          {activeTab === 'web' && (
            <div className="space-y-5">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <p className="font-semibold text-sm">
                    Tích hợp Web, PWA & Google AdSense Account
                  </p>
                  <p>
                    Các thẻ meta và script đã được cài đặt tự động trong tệp <code className="font-bold">index.html</code> để liên kết tài khoản nhà xuất bản <code className="font-bold">{ADMOB_CONFIG.publisherId}</code> và App ID <code className="font-bold">{ADMOB_CONFIG.appId}</code>.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" /> Các thẻ đã chèn vào &lt;head&gt; của index.html:
                </span>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
{`<meta name="google-adsense-account" content="ca-pub-5320880447374751" />
<meta name="google-admob-app-id" content="ca-app-pub-5320880447374751~3167851635" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5320880447374751" crossorigin="anonymous"></script>`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: APP-ADS.TXT VERIFICATION */}
          {activeTab === 'adsTxt' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                  <p className="font-semibold text-sm">
                    Trạng thái xác thực tệp app-ads.txt: HOÀN TẤT & SẴN SÀNG
                  </p>
                  <p>
                    Google AdMob và Google AdSense quét tệp này ở thư mục gốc của tên miền ứng dụng để xác thực bạn là chủ sở hữu hợp pháp của đơn vị quảng cáo.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Nội dung tệp /app-ads.txt và /ads.txt:
                </span>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <code className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 select-all">
                    {ADMOB_CONFIG.appAdsTxtEntry}
                  </code>
                  <button
                    onClick={() => copyToClipboard(ADMOB_CONFIG.appAdsTxtEntry, 'ads-txt')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    {copiedKey === 'ads-txt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ads-txt' ? 'Đã sao chép' : 'Sao chép dòng'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="/app-ads.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-all shadow-xs"
                >
                  <span>Xem trực tiếp /app-ads.txt</span>
                  <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </a>

                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-all shadow-xs"
                >
                  <span>Xem trực tiếp /ads.txt</span>
                  <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Hỗ trợ AdMob Mobile SDK & Web Ads
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}

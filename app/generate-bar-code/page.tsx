"use client";
import React, { useState, useEffect, useRef } from 'react';
import Barcode from 'react-barcode';

const barcodeFormats = [
  { value: 'CODE128', label: 'CODE128 - Alphanumeric (Most Versatile)' },
  { value: 'CODE128A', label: 'CODE128A - Uppercase + Control' },
  { value: 'CODE128B', label: 'CODE128B - Standard ASCII' },
  { value: 'CODE128C', label: 'CODE128C - Digits Only (High Density)' },
  { value: 'EAN13', label: 'EAN-13 - International Products' },
  { value: 'EAN8', label: 'EAN-8 - Small Products' },
  { value: 'UPC', label: 'UPC-A - US Products' },
  { value: 'UPCE', label: 'UPC-E - Compressed' },
  { value: 'ITF14', label: 'ITF-14 - Shipping Cartons' },
  { value: 'codabar', label: 'Codabar - Libraries & Blood Banks' },
  { value: 'pharmacode', label: 'Pharmacode - Pharmaceuticals' },
  { value: 'MSI', label: 'MSI - Inventory' },
  { value: 'MSI10', label: 'MSI10' },
  { value: 'MSI11', label: 'MSI11' },
  { value: 'MSI1010', label: 'MSI1010' },
  { value: 'MSI1110', label: 'MSI1110' },
];

const formatExamples: Record<string, string> = {
  CODE128: 'QRCallMe-2025',
  CODE128A: 'CODE128A',
  CODE128B: 'Code128B',
  CODE128C: '1234567890',
  EAN13: '5901234123457',
  EAN8: '96385074',
  UPC: '012345678905',
  UPCE: '01234565',
  ITF14: '01234567890123',
  codabar: 'A40156B',
  pharmacode: '831',
  MSI: '123456',
};

const faqs = [
  {
    q: 'What is a barcode and where can it be used?',
    a: 'A barcode is a machine-readable code that stores data in visual patterns. It can be used on products (retail, inventory), tickets, shipping labels, library books, medical wristbands, business cards, advertisements, and anywhere you need quick scanning.',
  },
  {
    q: 'Why are barcodes useful?',
    a: 'Barcodes enable fast, accurate data entry via scanners — reducing errors, speeding up checkout, tracking inventory, managing shipments, and simplifying processes in retail, logistics, healthcare, events, and more.',
  },
  {
    q: 'Who can use this barcode generator?',
    a: 'Anyone! Individuals, small businesses, retailers, warehouses, event organizers, libraries, developers — everyone is welcome to use it freely.',
  },
  {
    q: 'Is there any charge or subscription required?',
    a: 'Completely free! No signup, no subscription, no hidden fees. Use it as much as you want.',
  },
  {
    q: 'Are there any usage limits?',
    a: 'No limits at all. Generate as many barcodes as you need, anytime, anywhere.',
  },
  {
    q: 'Do generated barcodes expire?',
    a: 'No — these are static barcodes. Once generated, they never expire and will always scan to the same data.',
  },
  {
    q: 'Can I use these barcodes commercially?',
    a: 'Yes! Feel free to use them for personal or commercial purposes with no restrictions.',
  },
];

export default function BarcodeGenerator() {
  const [text, setText] = useState('QRCallMe-2025');
  const [format, setFormat] = useState('CODE128');
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!text.trim() || text === 'QRCallMe-2025' || Object.values(formatExamples).includes(text)) {
      setText(formatExamples[format] || '1234567890');
    }
  }, [format]);

  const getValidationError = (fmt: string, value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter data to encode';

    switch (fmt) {
      case 'EAN13':
        if (!/^\d{12,13}$/.test(trimmed)) return 'EAN-13 requires 12 or 13 digits only';
        break;
      case 'EAN8':
        if (!/^\d{7,8}$/.test(trimmed)) return 'EAN-8 requires 7 or 8 digits only';
        break;
      case 'UPC':
        if (!/^\d{12}$/.test(trimmed)) return 'UPC-A requires exactly 12 digits';
        break;
      case 'CODE128C':
        if (!/^\d+$/.test(trimmed) || trimmed.length % 2 !== 0) return 'CODE128C requires an even number of digits';
        break;
      case 'pharmacode':
        const num = Number(trimmed);
        if (isNaN(num) || num < 3 || num > 131070) return 'Pharmacode must be a number between 3 and 131070';
        break;
      case 'codabar':
        if (!/^[A-Da-d][0-9\-\:\$\+\.\/]*[A-Da-d]$/.test(trimmed)) return 'Codabar must start/end with A-D and contain valid chars';
        break;
      default:
        break;
    }
    return null;
  };

  const validationError = getValidationError(format, text);

  const downloadPNG = () => {
    const svg = barcodeRef.current;
    if (!svg || validationError) return;

    const size = { width: 2048, height: 1024 };
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size.width, size.height);

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const scale = Math.min(size.width / img.width, size.height / img.height) * 0.9;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      ctx.drawImage(img, (size.width - scaledWidth) / 2, (size.height - scaledHeight) / 2, scaledWidth, scaledHeight);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `barcode-${format}-${text || 'qrcallme'}.png`;
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadSVG = () => {
    const svg = barcodeRef.current;
    if (!svg || validationError) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${format}-${text || 'qrcallme'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <section className="text-center py-20 px-6">
          <h1 className="text-4xl md:text-6xl font-red mb-6">
            Barcode Generator{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pro
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-3xl mx-auto">
            Create professional barcodes in all standard formats — instantly, free, and beautiful.
          </p>
        </section>

        {/* Generator Card */}
        <div className="px-6 mb-20">
          <div className="bg-white/90 backdrop-blur-xl p-10 md:p-16 rounded-[50px] shadow-2xl border border-white/50">
            <div className="space-y-8">
              {/* Format Selector */}
              <div>
                <label className="block text-sm font-black text-purple-600 uppercase tracking-widest mb-3">
                  Barcode Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-6 bg-white/60 border-2 border-transparent rounded-3xl focus:border-purple-500 focus:bg-white outline-none text-slate-900 font-bold text-lg transition-all shadow-sm"
                >
                  {barcodeFormats.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Input */}
              <div>
                <label className="block text-sm font-black text-purple-600 uppercase tracking-widest mb-3">
                  Data to Encode
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={formatExamples[format] || 'Enter text or numbers'}
                  className="w-full p-6 bg-white/60 border-2 border-transparent rounded-3xl focus:border-purple-500 focus:bg-white outline-none text-slate-900 font-bold text-lg transition-all shadow-sm"
                />
              </div>

              {/* Preview */}
              <div className="bg-white p-12 rounded-3xl shadow-2xl border-8 border-slate-100">
                <div className="flex flex-col items-center">
                  {!validationError ? (
                    <>
                      <Barcode
                        ref={barcodeRef}
                        value={text.trim() || ' '}
                        format={format as any}
                        width={5}
                        height={160}
                        displayValue={true}
                        fontSize={28}
                        fontColor="#000000"
                        lineColor="#000000"
                        background="#ffffff"
                        margin={30}
                        textMargin={15}
                        fontOptions="bold"
                      />
                      <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-widest">
                        {format} • Generated with ❤️ by QRCallMe
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-2xl font-black text-red-600 mb-4">⚠️ Invalid Data</p>
                      <p className="text-lg text-slate-700">{validationError}</p>
                      <p className="text-sm text-slate-500 mt-4">Try the suggested example above</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={downloadPNG}
                  disabled={!!validationError}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-6 rounded-3xl hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  <span>⬇️</span> Download PNG (HD 2048px)
                </button>
                <button
                  onClick={downloadSVG}
                  disabled={!!validationError}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-6 rounded-3xl hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  <span>⬇️</span> Download SVG (Vector)
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-8 mt-10">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">All Standard Formats</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">HD & Vector Export</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">No Watermark</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <section className="px-6 mb-20">
          <h2 className="text-4xl font-black text-center mb-12 text-slate-800">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-white/50 overflow-hidden"
              >
                <summary className="px-8 py-6 text-lg font-black text-slate-800 cursor-pointer flex items-center justify-between hover:bg-white/60 transition-all">
                  {faq.q}
                  <span className="text-2xl text-purple-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-8 pb-8 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="text-center pb-12">
          <a href="/" className="text-slate-500 font-bold hover:text-purple-600 transition-colors flex items-center justify-center gap-2 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Return to Hub
          </a>
        </div>
      </div>
    </div>
  );
}
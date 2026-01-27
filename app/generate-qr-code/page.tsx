"use client";
import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function FreeQRGenerator() {
  const [url, setUrl] = useState("https://qrcallme.com");
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadSVG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(svgBlob);
    downloadLink.download = "qrcallme-free-qr.svg";
    downloadLink.click();
  };

  const downloadPNG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 1024; // High resolution
      canvas.height = 1024;
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcallme-free-qr.png";
      downloadLink.click();
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Free QR Code Generator</h1>
        <p className="text-gray-500 mb-8">Create high-definition QR codes for any URL instantly.</p>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your link (e.g., https://google.com)"
            className="w-full p-4 border-2 border-blue-50 rounded-2xl mb-8 focus:border-blue-500 outline-none text-black text-lg"
          />

          <div className="flex justify-center mb-8 bg-blue-50 p-6 rounded-2xl">
            <QRCodeSVG 
              ref={qrRef}
              value={url || "https://qrcallme.com"} 
              size={256} 
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={downloadPNG} className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">
              Download PNG
            </button>
            <button onClick={downloadSVG} className="bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-all">
              Download SVG
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-400">High resolution • No watermark • 100% Free</p>
        </div>

        <a href="/" className="mt-8 inline-block text-blue-600 font-semibold hover:underline">
          ← Back to QRCallMe Home
        </a>
      </div>
    </div>
  );
}
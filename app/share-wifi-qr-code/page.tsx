"use client";
import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function WifiQRGenerator() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const qrRef = useRef<SVGSVGElement>(null);

  // This is the special format for WiFi QR codes
  const wifiValue = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

  const downloadSVG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(svgBlob);
    downloadLink.download = "wifi-qr.svg";
    downloadLink.click();
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">WiFi QR Code Generator</h1>
        <p className="text-gray-500 mb-8">Share your WiFi without giving out your password manually.</p>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-left">
          <label className="block text-sm font-bold text-gray-700 mb-2">Network Name (SSID)</label>
          <input 
            type="text" 
            placeholder="e.g. Home_WiFi"
            className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-4 text-black outline-none focus:border-blue-500"
            onChange={(e) => setSsid(e.target.value)}
          />

          <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            placeholder="WiFi Password"
            className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-6 text-black outline-none focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-center mb-8 bg-white border-4 border-dashed border-gray-100 p-6 rounded-2xl">
            <QRCodeSVG ref={qrRef} value={wifiValue} size={200} level="H" includeMargin={true} />
          </div>

          <button onClick={downloadSVG} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all">
            Download WiFi Sticker
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useState } from 'react';
import Barcode from 'react-barcode';

export default function BarcodeGenerator() {
  const [text, setText] = useState("QRCallMe-123");

  const downloadBarcode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "barcode.png";
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Free Barcode Generator</h1>
        <p className="text-gray-500 mb-8">Create standard barcodes for retail, inventory, or personal use.</p>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or numbers"
            className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-8 focus:border-blue-500 outline-none text-black text-lg"
          />

          <div className="flex justify-center mb-8 bg-white p-6 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden">
            <Barcode 
              value={text || "Empty"} 
              format="CODE128"
              renderer="canvas"
              width={2}
              height={100}
            />
          </div>

          <button 
            onClick={downloadBarcode} 
            className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all"
          >
            Download PNG Barcode
          </button>
          
          <p className="mt-6 text-sm text-gray-400">Standard Code128 Format • High Definition</p>
        </div>

        <a href="/" className="mt-8 inline-block text-blue-600 font-semibold hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
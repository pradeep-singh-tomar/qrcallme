"use client";
import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function WifiQRGenerator() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const qrRef = useRef<SVGSVGElement>(null);

  const wifiValue = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

  const downloadPNG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const canvas = document.createElement("canvas");
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        const link = document.createElement("a");
        link.download = `QRCallMe-WiFi-${ssid || 'setup'}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-900 pb-20">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-lime-400 via-emerald-500 to-cyan-600 pt-24 pb-40 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-md mb-4">
          Smart WiFi Connect
        </h1>
        <p className="text-white/90 font-bold text-lg max-w-2xl mx-auto uppercase tracking-[0.2em] text-[12px]">
          Privacy-Protected • No Password Sharing Needed
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Input Fields */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-white">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
             <span className="p-2 bg-lime-100 rounded-lg text-lime-600">📶</span> Network Details
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">WiFi Name (SSID)</label>
              <input type="text" placeholder="e.g. Starbucks_Free_WiFi" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all"
                onChange={(e) => setSsid(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all"
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Security Type</label>
                <select className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all"
                  onChange={(e) => setEncryption(e.target.value)}>
                  <option value="WPA">WPA/WPA2 (Standard)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">No Password (Open)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Marketing/SEO Section below inputs */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-10 border-slate-50">
            {[
              { title: "Hotels", desc: "Perfect for guest rooms and lobbies.", icon: "🏨" },
              { title: "Restaurants", desc: "Menu and WiFi on one table sticker.", icon: "🍽️" },
              { title: "Taxis", desc: "Keep passengers happy with easy data.", icon: "🚕" }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-2xl mb-1">{item.icon}</div>
                <h4 className="font-black text-xs uppercase mb-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl sticky top-8 flex flex-col items-center">
            <div className="bg-white p-6 rounded-[32px] shadow-xl border-[12px] border-slate-800/50 mb-10 relative">
              <QRCodeSVG 
                ref={qrRef}
                value={wifiValue} 
                size={260} 
                level="H" 
                includeMargin={true}
                imageSettings={{
                  src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0id2hpdGUiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJib2xkLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMDY1ZmY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDQUxMPC90ZXh0Pjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1mYW1pbHk9ImJvbGQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiMwNjVmZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1FPC90ZXh0Pjwvc3ZnPg==",
                  height: 50,
                  width: 50,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full space-y-4">
              <button onClick={downloadPNG} className="w-full bg-lime-400 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-lime-900/20 hover:scale-[1.02] transition-all uppercase tracking-widest text-sm">
                Download WiFi Kit (PNG)
              </button>
              <p className="text-white/40 text-[10px] text-center font-bold tracking-[0.3em] uppercase">Scan to Join Network</p>
            </div>
          </div>
        </div>

      </div>

      {/* FAQ Bottom Section */}
      <section className="max-w-4xl mx-auto px-6 mt-20">
        <h3 className="text-3xl font-black text-center mb-10 tracking-tighter text-slate-900">Why use WiFi QR?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-black mb-3">Is it private?</h4>
            <p className="text-slate-500 text-sm">Yes. The QR code never sends your password to our servers. All generation happens locally in your browser. It simply tells the phone "Here is the network info," and the phone connects securely.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-black mb-3">Where should I use this?</h4>
            <p className="text-slate-500 text-sm">Restaurants use them on menus to stop waiters from constantly repeating the password. Hotels use them on room cards. Homeowners put them in the guest room for easy access.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
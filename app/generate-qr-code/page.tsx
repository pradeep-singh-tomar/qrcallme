"use client";
import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ALL_TYPES = [
  { id: 'url', label: 'URL', icon: '🔗', schema: 'https://' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'vcard', label: 'VCard', icon: '📇' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'sms', label: 'SMS', icon: '💬' },
  // Others dropdown
  { id: 'mecard', label: 'MeCard', icon: '👤' },
  { id: 'location', label: 'Location', icon: '📍' },
  { id: 'facebook', label: 'Facebook', icon: '👥' },
  { id: 'twitter', label: 'Twitter', icon: '🐦' },
  { id: 'youtube', label: 'YouTube', icon: '📺' },
  { id: 'event', label: 'Event', icon: '📅' },
  { id: 'bitcoin', label: 'Bitcoin', icon: '₿' },
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'appstore', label: 'App Store', icon: '🍎' },
  { id: 'feedback', label: 'Feedback', icon: '⭐' },
];

export default function ProQRGenerator() {
  const [activeTab, setActiveTab] = useState('url');
  const [formData, setFormData] = useState<any>({
    url: 'https://qrcallme.com',
  });

  const qrRef = useRef<SVGSVGElement>(null);


  // Dynamic SEO
  useEffect(() => {
    const currentType = ALL_TYPES.find(t => t.id === activeTab);
    if (currentType) {
      document.title = `Free ${currentType.label} QR Code Generator - Instant, High-Quality & No Signup | QRCallMe Pro`;

      let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.name = 'description';
        document.head.appendChild(descMeta);
      }
      descMeta.content = `Create professional ${currentType.label.toLowerCase()} QR codes instantly for free. High-resolution downloads (PNG & SVG), no watermark, no signup required. Perfect for ${currentType.label.toLowerCase()} sharing.`;

      let keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.name = 'keywords';
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.content = `${currentType.label} qr code, free ${currentType.label.toLowerCase()} qr code generator, online ${currentType.label.toLowerCase()} qr, ${currentType.label.toLowerCase()} qr code maker, qr code ${currentType.label.toLowerCase()}, dynamic qr code`;
    }
  }, [activeTab]);

 // Branding logo embedded in QR (appears in preview + both downloads)
  const logoSvg = `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="white"/>
    <circle cx="60" cy="60" r="54" stroke="#2563eb" stroke-width="4" fill="white"/>
    <text x="60" y="46" font-size="36" font-weight="900" fill="#2563eb" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, sans-serif">QR</text>
    <text x="60" y="80" font-size="24" font-weight="900" fill="#2563eb" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, sans-serif">CallMe</text>
  </svg>`;
  
  const logoSrc = `data:image/svg+xml,${encodeURIComponent(logoSvg)}`;

  const getQRValue = () => {
    const d = formData;
    switch (activeTab) {
      case 'url':
        return d.url || 'https://qrcallme.com';
      case 'text':
        return d.text || '';
      case 'wifi':
        let encType = d.enc || 'WPA';
        if (encType === 'none') encType = 'nopass';
        return `WIFI:S:${d.ssid || ''};T:${encType};P:${d.pass || ''};H:false;;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${d.name || ''}\nTEL:${d.phone || ''}\nEMAIL:${d.email || ''}\nURL:${d.website || ''}\nEND:VCARD`;
      case 'mecard':
        return `MECARD:N:${d.name || ''};TEL:${d.phone || ''};EMAIL:${d.email || ''};URL:${d.website || ''};;`;
      case 'location':
        return `geo:${d.lat || '0'},${d.lng || '0'}`;
      case 'email':
        let mailto = `mailto:${d.emailTo || ''}`;
        const params = [];
        if (d.emailSubject) params.push(`subject=${encodeURIComponent(d.emailSubject)}`);
        if (d.emailBody) params.push(`body=${encodeURIComponent(d.emailBody)}`);
        if (params.length > 0) mailto += `?${params.join('&')}`;
        return mailto;
      case 'sms':
        return `SMSTO:${d.smsPhone || ''}:${encodeURIComponent(d.smsMsg || '')}`;
      case 'event':
        let cal = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
        if (d.eventTitle) cal += `SUMMARY:${d.eventTitle}\n`;
        if (d.eventStart) cal += `DTSTART:${d.eventStart.replace(/[-:]/g, '')}\n`;
        if (d.eventEnd) cal += `DTEND:${d.eventEnd.replace(/[-:]/g, '')}\n`;
        if (d.eventLocation) cal += `LOCATION:${d.eventLocation}\n`;
        if (d.eventDesc) cal += `DESCRIPTION:${d.eventDesc.replace(/\n/g, '\\n')}\n`;
        cal += 'END:VEVENT\nEND:VCALENDAR';
        return cal;
      case 'bitcoin':
        let btc = `bitcoin:${d.btcAddress || ''}`;
        const btcParams = [];
        if (d.btcAmount) btcParams.push(`amount=${d.btcAmount}`);
        if (d.btcLabel) btcParams.push(`label=${encodeURIComponent(d.btcLabel)}`);
        if (d.btcMessage) btcParams.push(`message=${encodeURIComponent(d.btcMessage)}`);
        if (btcParams.length > 0) btc += `?${btcParams.join('&')}`;
        return btc;
      case 'facebook':
      case 'twitter':
      case 'youtube':
      case 'social':
      case 'appstore':
      case 'feedback':
        return d[activeTab] || '';
      default:
        return 'https://qrcallme.com';
    }
  };

  const downloadPNG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `qrcallme-${activeTab}.png`;
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadSVG = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcallme-${activeTab}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-slate-900">
          QR Generator{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Pro
          </span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: CONTENT & OPTIONS */}
          <div className="lg:col-span-8 space-y-6">
		  
            {/* Tab Navigation */}
            {/* All Tabs Navigation - Full Grid Layout */}
<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 bg-white/80 backdrop-blur p-4 rounded-[32px] shadow-lg border border-white/50 mb-8">
  {ALL_TYPES.map((t) => (
    <button
      key={t.id}
      onClick={() => setActiveTab(t.id)}
      className={`group px-2 py-4 rounded-2xl font-black text-[10px] md:text-xs transition-all flex flex-col items-center justify-center gap-2 border-2 ${
        activeTab === t.id
          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg border-transparent scale-105'
          : 'bg-white/40 text-slate-600 border-transparent hover:bg-white hover:border-blue-100 hover:shadow-md'
      }`}
    >
      <span className={`text-2xl transition-transform group-hover:scale-110 ${
        activeTab === t.id ? 'scale-110' : ''
      }`}>
        {t.icon}
      </span>
      <span className="text-center leading-tight uppercase tracking-tighter">
        {t.label}
      </span>
    </button>
  ))}
</div>

            {/* Input Panel */}
            <div className="bg-white/90 backdrop-blur p-8 md:p-12 rounded-[40px] shadow-xl border border-white/50">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-slate-800">
                <span className="text-4xl">{ALL_TYPES.find(t => t.id === activeTab)?.icon}</span>
                Configure {ALL_TYPES.find(t => t.id === activeTab)?.label}
              </h2>

              <div className="space-y-6">
                {(() => {
                  const inputClass =
                    'w-full p-6 bg-white/60 border-2 border-transparent rounded-3xl focus:border-purple-400 focus:bg-white outline-none text-slate-900 font-medium transition-all shadow-sm';
                  const labelClass = 'block text-sm font-bold text-slate-700 mb-2';

                  if (
                    activeTab === 'url' ||
                    ['facebook', 'twitter', 'youtube', 'social', 'appstore', 'feedback'].includes(activeTab)
                  ) {
                    const placeholders: Record<string, string> = {
                      url: 'https://example.com',
                      facebook: 'https://www.facebook.com/yourprofile-or-page',
                      twitter: 'https://x.com/yourusername',
                      youtube: 'https://www.youtube.com/@channel or video URL',
                      social: 'https://instagram.com/username or any social link',
                      appstore: 'https://apps.apple.com/app/id... (or Google Play URL)',
                      feedback: 'https://forms.gle/... or review/feedback link',
                    };
                    const key = activeTab === 'url' ? 'url' : activeTab;
                    const defaultValue = activeTab === 'url' ? 'https://qrcallme.com' : '';
                    return (
                      <div>
                        <label className={labelClass}>
                          Enter {ALL_TYPES.find(t => t.id === activeTab)?.label} Link
                        </label>
                        <input
                          type="url"
                          className={inputClass}
                          placeholder={placeholders[activeTab]}
                          value={formData[key] ?? defaultValue}
                          onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                        />
                      </div>
                    );
                  }

                  if (activeTab === 'text') {
                    return (
                      <div>
                        <label className={labelClass}>Enter Text</label>
                        <textarea
                          rows={8}
                          className={`${inputClass} resize-none`}
                          placeholder="Type any text you want to encode..."
                          value={formData.text || ''}
                          onChange={e => setFormData({ ...formData, text: e.target.value })}
                        />
                      </div>
                    );
                  }

                  if (activeTab === 'wifi') {
                    return (
                      <>
                        <div>
                          <label className={labelClass}>Network Name (SSID)</label>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="MyHomeWiFi"
                            value={formData.ssid || ''}
                            onChange={e => setFormData({ ...formData, ssid: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Password</label>
                          <input
                            type="password"
                            className={inputClass}
                            placeholder="Leave blank for open network"
                            value={formData.pass || ''}
                            onChange={e => setFormData({ ...formData, pass: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Encryption Type</label>
                          <select
                            className={inputClass}
                            value={formData.enc || 'WPA'}
                            onChange={e => setFormData({ ...formData, enc: e.target.value })}
                          >
                            <option value="WPA">WPA/WPA2/WPA3</option>
                            <option value="WEP">WEP</option>
                            <option value="none">None (Open)</option>
                          </select>
                        </div>
                      </>
                    );
                  }

                  if (activeTab === 'vcard' || activeTab === 'mecard') {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <label className={labelClass}>Full Name</label>
                            <input
                              className={inputClass}
                              placeholder="John Doe"
                              value={formData.name || ''}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Phone Number</label>
                            <input
                              type="tel"
                              className={inputClass}
                              placeholder="+1234567890"
                              value={formData.phone || ''}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Email</label>
                            <input
                              type="email"
                              className={inputClass}
                              placeholder="john@example.com"
                              value={formData.email || ''}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className={labelClass}>Website (optional)</label>
                            <input
                              type="url"
                              className={inputClass}
                              placeholder="https://example.com"
                              value={formData.website || ''}
                              onChange={e => setFormData({ ...formData, website: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'email') {
                    return (
                      <>
                        <div>
                          <label className={labelClass}>Recipient Email</label>
                          <input
                            type="email"
                            className={inputClass}
                            placeholder="example@email.com"
                            value={formData.emailTo || ''}
                            onChange={e => setFormData({ ...formData, emailTo: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Subject (optional)</label>
                          <input
                            className={inputClass}
                            placeholder="Hello there"
                            value={formData.emailSubject || ''}
                            onChange={e => setFormData({ ...formData, emailSubject: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Message Body (optional)</label>
                          <textarea
                            rows={5}
                            className={`${inputClass} resize-none`}
                            placeholder="Write your message..."
                            value={formData.emailBody || ''}
                            onChange={e => setFormData({ ...formData, emailBody: e.target.value })}
                          />
                        </div>
                      </>
                    );
                  }

                  if (activeTab === 'sms') {
                    return (
                      <>
                        <div>
                          <label className={labelClass}>Phone Number</label>
                          <input
                            type="tel"
                            className={inputClass}
                            placeholder="+1234567890"
                            value={formData.smsPhone || ''}
                            onChange={e => setFormData({ ...formData, smsPhone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Message (optional)</label>
                          <textarea
                            rows={5}
                            className={`${inputClass} resize-none`}
                            placeholder="Your pre-filled SMS message"
                            value={formData.smsMsg || ''}
                            onChange={e => setFormData({ ...formData, smsMsg: e.target.value })}
                          />
                        </div>
                      </>
                    );
                  }

                  if (activeTab === 'location') {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className={labelClass}>Latitude</label>
                          <input
                            type="number"
                            step="any"
                            className={inputClass}
                            placeholder="40.7128"
                            value={formData.lat || ''}
                            onChange={e => setFormData({ ...formData, lat: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Longitude</label>
                          <input
                            type="number"
                            step="any"
                            className={inputClass}
                            placeholder="-74.0060"
                            value={formData.lng || ''}
                            onChange={e => setFormData({ ...formData, lng: e.target.value })}
                          />
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'event') {
                    return (
                      <>
                        <div>
                          <label className={labelClass}>Event Title</label>
                          <input
                            className={inputClass}
                            placeholder="Team Meeting"
                            value={formData.eventTitle || ''}
                            onChange={e => setFormData({ ...formData, eventTitle: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className={labelClass}>Start Date & Time</label>
                            <input
                              type="datetime-local"
                              className={inputClass}
                              value={formData.eventStart || ''}
                              onChange={e => setFormData({ ...formData, eventStart: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>End Date & Time</label>
                            <input
                              type="datetime-local"
                              className={inputClass}
                              value={formData.eventEnd || ''}
                              onChange={e => setFormData({ ...formData, eventEnd: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Location (optional)</label>
                          <input
                            className={inputClass}
                            placeholder="Conference Room 1"
                            value={formData.eventLocation || ''}
                            onChange={e => setFormData({ ...formData, eventLocation: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Description (optional)</label>
                          <textarea
                            rows={4}
                            className={`${inputClass} resize-none`}
                            value={formData.eventDesc || ''}
                            onChange={e => setFormData({ ...formData, eventDesc: e.target.value })}
                          />
                        </div>
                      </>
                    );
                  }

                  if (activeTab === 'bitcoin') {
                    return (
                      <>
                        <div>
                          <label className={labelClass}>Bitcoin Address</label>
                          <input
                            className={inputClass}
                            placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                            value={formData.btcAddress || ''}
                            onChange={e => setFormData({ ...formData, btcAddress: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Amount (optional)</label>
                          <input
                            type="number"
                            step="any"
                            className={inputClass}
                            placeholder="0.001"
                            value={formData.btcAmount || ''}
                            onChange={e => setFormData({ ...formData, btcAmount: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Label (optional)</label>
                          <input
                            className={inputClass}
                            placeholder="Donation"
                            value={formData.btcLabel || ''}
                            onChange={e => setFormData({ ...formData, btcLabel: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Message (optional)</label>
                          <input
                            className={inputClass}
                            placeholder="Thank you!"
                            value={formData.btcMessage || ''}
                            onChange={e => setFormData({ ...formData, btcMessage: e.target.value })}
                          />
                        </div>
                      </>
                    );
                  }

                  return null;
                })()}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur p-10 rounded-[50px] shadow-2xl border border-white/50 flex flex-col items-center sticky top-8">
              <div className="bg-white p-8 rounded-3xl shadow-inner border-8 border-slate-50/50 mb-10">
                <QRCodeSVG
                  ref={qrRef}
                  value={getQRValue()}
                  size={260}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: logoSrc,
                    height: 52,
                    width: 52,
                    excavate: true,
                  }}
                />
              </div>
              <div className="w-full space-y-4">
                <button
                  onClick={downloadPNG}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-6 rounded-3xl hover:scale-105 transition-all shadow-xl shadow-blue-300/50 flex items-center justify-center gap-3 text-lg"
                >
                  <span>⬇️</span> Download PNG (1024px)
                </button>
                <button
                  onClick={downloadSVG}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-6 rounded-3xl hover:scale-105 transition-all shadow-xl shadow-purple-300/50 flex items-center justify-center gap-3 text-lg"
                >
                  <span>⬇️</span> Download SVG (Vector)
                </button>
              </div>
              <div className="mt-10 flex flex-col items-center gap-2 opacity-40">
                <span className="text-xs font-black tracking-widest uppercase text-blue-600">HD Quality • No Watermark</span>
                <span className="text-xs font-black tracking-widest uppercase text-purple-600">Branded with ❤️ QRCallMe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
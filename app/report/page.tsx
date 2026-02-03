"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ReportAbuse() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('reports').insert([{
      qr_url: formData.get('qr_url'),
      reason: formData.get('reason'),
      details: formData.get('details'),
    }]);

    setLoading(false);
    if (!error) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-40 px-6 text-center">
        <div className="bg-green-50 text-green-700 p-8 rounded-3xl border border-green-100">
          <h2 className="text-2xl font-black mb-2">Report Received</h2>
          <p className="text-sm">Thank you for keeping QRCallMe safe. Our team will investigate this code immediately.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-black tracking-tighter mb-4">Report <span className="text-red-600">Abuse</span></h1>
      <p className="text-slate-500 mb-10 font-medium">Help us remove malicious, illegal, or phishing QR codes from our platform.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">QR Code URL / Content</label>
          <input name="qr_url" required type="text" placeholder="Paste the link the QR points to" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all" />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Reason for Report</label>
          <select name="reason" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
            <option>Phishing / Scam</option>
            <option>Malware / Virus</option>
            <option>Illegal Content</option>
            <option>Harassment</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Additional Details</label>
          <textarea name="details" rows={4} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="Anything else we should know?" />
        </div>

        <button disabled={loading} className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
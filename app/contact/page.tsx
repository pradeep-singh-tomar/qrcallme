"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase.from('site_pages').select('*').eq('slug', 'contact').single();
      if (data) setPageData(data);
    }
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Sending your message...' });

    const { error } = await supabase.from('contact_messages').insert([formData]);

    if (error) {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' });
    } else {
      setStatus({ type: 'success', msg: 'High five! Message sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Dynamic Colorful Header */}
      <section className="w-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 py-24 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-xl tracking-tighter">
            {pageData?.title || "Contact Support"}
          </h1>
          <p className="text-xl opacity-90 font-medium max-w-xl mx-auto leading-relaxed">
            {pageData?.content || "We're here to help you get the most out of your QR codes."}
          </p>
        </div>
      </section>

      {/* Contact Form Card */}
      <div className="max-w-2xl w-full px-6 -mt-16 mb-24">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-gray-50 relative z-10">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" required placeholder="John Doe"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-pink-400 focus:bg-white outline-none transition-all text-black"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" required placeholder="john@example.com"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-pink-400 focus:bg-white outline-none transition-all text-black"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
              <input 
                type="text" placeholder="How can we help?"
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-pink-400 focus:bg-white outline-none transition-all text-black"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
              <textarea 
                rows={5} required placeholder="Write your message here..."
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-pink-400 focus:bg-white outline-none transition-all text-black resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={status.type === 'loading'}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {status.type === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {status.msg && (
              <div className={`mt-4 p-4 rounded-2xl text-center font-bold text-sm ${
                status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {status.msg}
              </div>
            )}
          </form>

          {/* Social Proof / Support Info */}
          <div className="mt-12 pt-8 border-t border-gray-50 grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Fast Response</p>
              <p className="text-sm font-bold text-slate-700">Under 2 Hours</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Availability</p>
              <p className="text-sm font-bold text-slate-700">Mon - Fri, 9am - 5pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
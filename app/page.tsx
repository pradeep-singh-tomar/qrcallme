"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function HomePage() {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
      if (data) setFaqs(data);
    };
    fetchFaqs();

    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    if (ref) {
      localStorage.setItem('referral_id', ref);
      console.log("Referral ID captured and saved:", ref);
    }
  }, []);

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-50 text-blue-600 rounded-full border border-blue-100">
            Privacy-First QR Technology
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            The World's Safest <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">QR Code Suite.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium mb-12 leading-relaxed">
            Generate secure QR tags for your pets, vehicles, and babies. No subscriptions, no tracking, just 100% privacy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/generate-qr-code" className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-200 hover:scale-105 transition-all">
              Create Your Free QR
            </Link>
            <Link href="/parking-qr-code" className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:scale-105 transition-all">
              Vehicle Protection
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES GRID - Now Linked to Pages */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Vehicle QR', desc: 'Contact owners without revealing phone numbers.', icon: '🚗', href: '/parking-qr-code' },
              { title: 'Pet Security', desc: 'Smart ID tags that notify you when scanned.', icon: '🐕', href: '/pets-qr-code' },
              { title: 'Baby Safety', desc: 'Secure QR tags for strollers and backpacks.', icon: '👶', href: '/baby-qr-code' },
              { title: 'Instant WiFi', desc: 'Share your network safely without passwords.', icon: '📡', href: '/share-wifi-qr-code' },
              { title: 'Barcodes', desc: 'Professional barcode generator for products.', icon: '🏷️', href: '/generate-bar-code' },
              { title: 'Contact Card', desc: 'Digital QR Business Cards for instant sharing.', icon: '📇', href: '/generate-qr-code' },
            ].map((feature, i) => (
              <Link key={i} href={feature.href} className="group">
                <div className="bg-white h-full p-10 rounded-[40px] border border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all flex flex-col items-start text-left">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-6">{feature.desc}</p>
                  <span className="mt-auto text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Start Now <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC FAQ SECTION */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Common Questions</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Everything you need to know about QRCallMe</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white border border-slate-100 rounded-[24px] p-6 hover:border-blue-200 transition-all cursor-pointer">
              <summary className="list-none flex justify-between items-center font-black text-lg">
                {faq.question}
                <span className="text-blue-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 text-slate-600 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[60px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to secure your world?</h2>
          <p className="text-xl opacity-90 mb-12 max-w-xl mx-auto">Join thousands of users protecting their privacy with QRCallMe smart tags.</p>
          <Link href="/generate-qr-code" className="inline-block bg-white text-blue-600 px-12 py-6 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">
            Get Started For Free
          </Link>
        </div>
      </section>

    </div>
  );
}
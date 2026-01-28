"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaqs() {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (data) setFaqs(data);
      setLoading(false);
    }
    fetchFaqs();
  }, []);

  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-24">
      {/* Dynamic Header */}
      <section className="bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 pt-32 pb-48 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
            Support Center
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter drop-shadow-lg">
            Common Questions
          </h1>
          <p className="text-xl opacity-90 font-medium">Everything you need to know about QRCallMe.</p>
        </div>
      </section>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-6 -mt-32">
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div 
              key={item.id} 
              className={`group bg-white rounded-[32px] border transition-all duration-300 ${
                openIndex === index 
                ? 'border-teal-200 shadow-xl shadow-teal-900/5 ring-4 ring-teal-50' 
                : 'border-slate-100 hover:border-teal-100 shadow-sm'
              } overflow-hidden`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-7 md:p-9 font-bold flex justify-between items-center text-slate-900 group-hover:text-teal-600 transition-colors"
              >
                <span className="text-lg md:text-xl pr-8 leading-tight">{item.question}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  openIndex === index ? 'bg-teal-500 text-white rotate-180' : 'bg-slate-50 text-slate-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-9 pb-9 text-slate-500 text-lg leading-relaxed border-t border-slate-50 pt-6">
                  {item.answer}
                  {item.category && (
                    <div className="mt-6 flex gap-2">
                       <span className="text-[10px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-400 tracking-widest">
                         Category: {item.category}
                       </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-slate-900 rounded-[40px] p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 blur-[120px] opacity-20 -mr-32 -mt-32"></div>
          <h3 className="text-2xl font-black mb-2 relative z-10 text-white">Still have questions?</h3>
          <p className="text-slate-400 mb-8 relative z-10">Our support team is ready to assist you 24/7.</p>
          <a href="/contact" className="inline-block bg-teal-400 text-slate-900 font-black px-10 py-4 rounded-2xl hover:bg-teal-300 transition-all relative z-10 uppercase tracking-widest text-sm">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
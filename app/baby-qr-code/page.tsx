"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BabyPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPageContent() {
      const { data } = await supabase
        .from('site_pages')
        .select('*')
        .eq('slug', 'baby-qr-code')
        .single();
      
      if (data) setPageData(data);
      setLoading(false);
    }
    fetchPageContent();
  }, []);

  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero Section - Upgraded to Gradient */}
      <section className="bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 py-24 px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-md">
          {pageData?.title || "Baby Safety QR Tags"}
        </h1>
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          {pageData?.content || "Keep your little one's essentials safe."}
        </p>
        <a href="/user-dashboard" className="bg-white text-pink-600 font-black px-12 py-5 rounded-full text-xl shadow-2xl hover:scale-105 transition-all inline-block">
          Secure Your Gear →
        </a>
      </section>

      {/* Features with Hover Effects */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="p-8 rounded-3xl hover:bg-pink-50 transition-colors group">
            <div className="text-6xl mb-6 group-hover:bounce transition-transform">🧸</div>
            <h3 className="text-2xl font-bold mb-3 text-black">Never Lose a Toy</h3>
            <p className="text-gray-500 leading-relaxed">Attach a tiny QR sticker to that "must-have" teddy bear so it always finds its way home.</p>
          </div>
          
          <div className="p-8 rounded-3xl hover:bg-purple-50 transition-colors group">
            <div className="text-6xl mb-6">🍼</div>
            <h3 className="text-2xl font-bold mb-3 text-black">Stroller Protection</h3>
            <p className="text-gray-500 leading-relaxed">If you leave your stroller at a park or airport, finders can contact you instantly and safely.</p>
          </div>

          <div className="p-8 rounded-3xl hover:bg-pink-50 transition-colors group">
            <div className="text-6xl mb-6">🛡️</div>
            <h3 className="text-2xl font-bold mb-3 text-black">Privacy First</h3>
            <p className="text-gray-500 leading-relaxed">Share only the contact details you choose. Your personal mobile number stays hidden.</p>
          </div>
        </div>
      </section>

      {/* Colorful Trial Banner */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-20 px-6 text-center border-y border-pink-100">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                60 Days Free Trial
            </h2>
            <p className="text-gray-700 text-lg mb-8 font-medium">Try the smart baby tags for 2 months. Then just $1/month to keep the connection alive.</p>
            <a href="/user-dashboard" className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-700 transition-all shadow-lg">
                Start My Free Trial
            </a>
        </div>
      </section>
    </div>
  );
}
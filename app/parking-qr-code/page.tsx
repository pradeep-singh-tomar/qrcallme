"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ParkingPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPageContent() {
      const { data } = await supabase
        .from('site_pages')
        .select('*')
        .eq('slug', 'parking-qr-code')
        .single();
      
      if (data) setPageData(data);
      setLoading(false);
    }
    fetchPageContent();
  }, []);

  // If the database hasn't loaded yet, we show a clean loading state
  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-600 py-20 px-6 text-center text-white">
        {/* EDIT: Title now comes from DB */}
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          {pageData?.title || "Smart Parking QR Tags"}
        </h1>
        
        {/* EDIT: Description/Content now comes from DB */}
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto whitespace-pre-line">
          {pageData?.content || "The safest way for someone to reach you..."}
        </p>

        <a href="/user-dashboard" className="bg-white text-blue-600 font-black px-10 py-4 rounded-full text-xl shadow-xl hover:bg-gray-100 transition-all">
          Get Your Parking Tag →
        </a>
      </section>

      {/* Features - Keeping static for now, or you can add columns to DB for these too */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2 text-black">Privacy First</h3>
            <p className="text-gray-500 text-sm">People can call you through our system. They never see your actual mobile number.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-black">Instant Alerts</h3>
            <p className="text-gray-500 text-sm">Get notified immediately if someone scans your tag in a parking emergency.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2 text-black">Avoid Fines</h3>
            <p className="text-gray-500 text-sm">Give people a chance to ask you to move your car before they call a tow truck.</p>
          </div>
        </div>
      </section>

      {/* Trial Banner */}
      <section className="bg-gray-50 py-16 px-6 text-center border-y border-gray-100">
        <h2 className="text-3xl font-bold mb-4 text-black">60 Days Free Trial</h2>
        <p className="text-gray-600 mb-8">Try the smart parking tag for 2 months. Then just $1/month.</p>
        <a href="/user-dashboard" className="text-blue-600 font-bold underline text-lg">Create your free account today</a>
      </section>
    </div>
  );
}
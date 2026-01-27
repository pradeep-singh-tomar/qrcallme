"use client";
import React from 'react';

export default function PetsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero Section - Warm Orange/Yellow theme */}
      <section className="bg-orange-500 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">Smart Pet ID Tags</h1>
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto text-white">
          A digital passport for your best friend. Update your contact info anytime without buying a new tag.
        </p>
        <a href="/dashboard" className="bg-white text-orange-600 font-black px-10 py-4 rounded-full text-xl shadow-xl hover:bg-gray-100 transition-all">
          Protect Your Pet →
        </a>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl mb-4 text-black">🐕‍🦺</div>
            <h3 className="text-xl font-bold mb-2 text-black">Dynamic Info</h3>
            <p className="text-gray-500 text-sm">Traveling? Changing numbers? Update your tag online instantly. No re-engraving needed.</p>
          </div>
          <div>
            <div className="text-5xl mb-4 text-black">📍</div>
            <h3 className="text-xl font-bold mb-2 text-black">Scan Alerts</h3>
            <p className="text-gray-500 text-sm">Get notified the moment someone scans your pet's tag, helping you find them faster.</p>
          </div>
          <div>
            <div className="text-5xl mb-4 text-black">🦴</div>
            <h3 className="text-xl font-bold mb-2 text-black">Medical Notes</h3>
            <p className="text-gray-500 text-sm">Add allergies or "Needs Medication" notes so the finder knows how to care for them.</p>
          </div>
        </div>
      </section>

      {/* Trial Banner */}
      <section className="bg-orange-50 py-16 px-6 text-center border-y border-orange-100">
        <h2 className="text-3xl font-bold mb-4 text-black">60 Days Free Trial</h2>
        <p className="text-gray-600 mb-8">Keep your pet safe for $0 today. Just $1/month after 2 months.</p>
        <a href="/dashboard" className="text-orange-600 font-bold underline text-lg">Start your 60-day trial</a>
      </section>
    </div>
  );
}
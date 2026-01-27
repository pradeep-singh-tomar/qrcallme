"use client";
import React from 'react';

export default function BabyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero Section - Soft Pink/Purple theme */}
      <section className="bg-pink-500 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">Baby Safety QR Tags</h1>
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
          Keep your little one's essentials safe. Perfect for strollers, diaper bags, and favorite toys.
        </p>
        <a href="/dashboard" className="bg-white text-pink-600 font-black px-10 py-4 rounded-full text-xl shadow-xl hover:bg-gray-100 transition-all">
          Secure Your Gear →
        </a>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl mb-4 text-black">🧸</div>
            <h3 className="text-xl font-bold mb-2 text-black">Never Lose a Toy</h3>
            <p className="text-gray-500 text-sm">Attach a tiny QR sticker to that "must-have" teddy bear so it always finds its way home.</p>
          </div>
          <div>
            <div className="text-5xl mb-4 text-black">🍼</div>
            <h3 className="text-xl font-bold mb-2 text-black">Stroller Protection</h3>
            <p className="text-gray-500 text-sm">If you leave your stroller at a park or airport, finders can contact you instantly and safely.</p>
          </div>
          <div>
            <div className="text-5xl mb-4 text-black">🛡️</div>
            <h3 className="text-xl font-bold mb-2 text-black">Privacy First</h3>
            <p className="text-gray-500 text-sm">Share only the contact details you choose. Your personal mobile number stays hidden.</p>
          </div>
        </div>
      </section>

      {/* Trial Banner */}
      <section className="bg-pink-50 py-16 px-6 text-center border-y border-pink-100">
        <h2 className="text-3xl font-bold mb-4 text-black">60 Days Free Trial</h2>
        <p className="text-gray-600 mb-8">Try the smart baby tags for 2 months. Then just $1/month.</p>
        <a href="/dashboard" className="text-pink-600 font-bold underline text-lg">Create your free account today</a>
      </section>
    </div>
  );
}
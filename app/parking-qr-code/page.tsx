"use client";
import React from 'react';

export default function ParkingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-600 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-black mb-6">Smart Parking QR Tags</h1>
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
          The safest way for someone to reach you if your car is blocking the way or in an emergency—without showing your phone number.
        </p>
        <a href="/dashboard" className="bg-white text-blue-600 font-black px-10 py-4 rounded-full text-xl shadow-xl hover:bg-gray-100 transition-all">
          Get Your Parking Tag →
        </a>
      </section>

      {/* Features */}
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
        <a href="/dashboard" className="text-blue-600 font-bold underline text-lg">Create your free account today</a>
      </section>
    </div>
  );
}
"use client";
import React, { useState } from 'react';

const faqData = [
  { q: "How does the 60-day trial work?", a: "You get full access to all privacy features for 60 days. No credit card is required to start. After that, it's just $1/month." },
  { q: "Can I update my phone number later?", a: "Yes! You can log in to your dashboard and change your contact details anytime. The QR code stays the same." },
  { q: "Is my personal data safe?", a: "Absolutely. We never show your mobile number to the person scanning the code. They only see a secure 'Call Owner' button." }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-center mb-10 text-black">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 font-bold flex justify-between items-center text-black"
              >
                {item.q}
                <span>{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="p-6 pt-0 text-gray-600 border-t border-gray-50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
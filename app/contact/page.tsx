"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const { error } = await supabase.from('contact_messages').insert([formData]);

    if (error) {
      setStatus('Error sending message. Please try again.');
    } else {
      setStatus('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-black mb-2">Contact Support</h1>
        <p className="text-gray-500 mb-8">Have a question about your QR tags? We are here to help.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Your Name" required
            className="w-full p-4 border rounded-xl text-black outline-none focus:border-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-4 border rounded-xl text-black outline-none focus:border-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="text" placeholder="Subject"
            className="w-full p-4 border rounded-xl text-black outline-none focus:border-blue-500"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
          <textarea 
            placeholder="How can we help?" rows={5} required
            className="w-full p-4 border rounded-xl text-black outline-none focus:border-blue-500"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">
            Send Message
          </button>
          {status && <p className="text-center text-sm font-semibold mt-4 text-blue-600">{status}</p>}
        </form>
      </div>
    </div>
  );
}
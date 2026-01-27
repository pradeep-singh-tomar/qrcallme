"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (data) setMessages(data);
    }
    fetchMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-white p-10 text-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black">Support Inbox</h1>
          {/* Updated Link below */}
          <Link href="/admin-dashboard" className="text-blue-600 font-bold hover:underline">
            ← Back to Admin
          </Link>
        </div>

        <div className="grid gap-6">
          {messages.length === 0 ? <p className="text-gray-400">No messages yet.</p> : messages.map((msg) => (
            <div key={msg.id} className="p-6 border-2 border-gray-50 rounded-3xl relative">
              <button 
                onClick={() => deleteMessage(msg.id)}
                className="absolute top-6 right-6 text-red-500 font-bold text-xs"
              >
                DELETE
              </button>
              <h2 className="text-lg font-bold">{msg.name} <span className="text-gray-400 font-normal">({msg.email})</span></h2>
              <p className="mt-4 p-4 bg-gray-50 rounded-xl italic">"{msg.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
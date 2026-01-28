"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserDashboard() {
  const [tagName, setTagName] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState<any[]>([]);

  // 1. Load existing tags
  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('user_tags').select('*').eq('user_id', user.id);
      if (data) setTags(data);
    }
  }

  // 2. Create a new tag
  const createTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('user_tags').insert([
        { tag_name: tagName, phone_number: phone, user_id: user.id }
      ]);
      if (!error) {
        setTagName('');
        setPhone('');
        fetchTags();
      }
    }
  };

  // 3. Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Redirect to home page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Title and Logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-black">My QR Tags</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-100 transition-all uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>

        {/* Form to add new tag */}
        <form onSubmit={createTag} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-tight">Tag Name (e.g. Car Windshield)</label>
            <input type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none text-black outline-none focus:ring-2 ring-blue-500" placeholder="My Tesla" required />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-tight">Emergency Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-none text-black outline-none focus:ring-2 ring-blue-500" placeholder="+1..." required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">Create Tag</button>
        </form>

        {/* List of Tags */}
        <div className="grid gap-4">
          {tags.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No tags registered yet.</p>
          ) : (
            tags.map(tag => (
              <div key={tag.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm hover:border-blue-100 transition-all">
                <div>
                  <h3 className="font-bold text-black text-lg">{tag.tag_name}</h3>
                  <p className="text-gray-500 text-sm">Target Phone: <span className="text-black font-medium">{tag.phone_number}</span></p>
                  <code className="text-blue-600 text-xs mt-2 block bg-blue-50 inline-block px-2 py-1 rounded">qrcallme.com/call/{tag.id}</code>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
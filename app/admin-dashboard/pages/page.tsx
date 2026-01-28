"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminPageEditor() {
  const [pages, setPages] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => { fetchPages(); }, []);

  async function fetchPages() {
    const { data } = await supabase.from('site_pages').select('*');
    if (data) setPages(data);
  }

  async function saveUpdate() {
    await supabase.from('site_pages').update({ 
      title: editing.title, 
      content: editing.content 
    }).eq('id', editing.id);
    setEditing(null);
    fetchPages();
  }

  return (
    <div className="p-10 text-black">
      <h1 className="text-3xl font-black mb-8">Edit Marketing Pages</h1>
      
      <div className="grid gap-4">
        {pages.map(p => (
          <div key={p.id} className="p-4 border rounded-2xl flex justify-between items-center">
            <span className="font-bold">/{p.slug}</span>
            <button onClick={() => setEditing(p)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Edit Content</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-3xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Editing: {editing.slug}</h2>
            <input 
              value={editing.title} 
              onChange={e => setEditing({...editing, title: e.target.value})}
              className="w-full p-3 border rounded-xl mb-4"
              placeholder="Page Title"
            />
            <textarea 
              value={editing.content} 
              onChange={e => setEditing({...editing, content: e.target.value})}
              className="w-full p-3 border rounded-xl h-64 mb-4"
              placeholder="HTML or Text Content"
            />
            <div className="flex gap-4">
              <button onClick={saveUpdate} className="bg-green-600 text-white px-6 py-2 rounded-xl">Save Changes</button>
              <button onClick={() => setEditing(null)} className="text-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminBlogManager() {
  const [post, setPost] = useState({ title: '', category: 'Tips', content: '' });
  const [status, setStatus] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Publishing...');

    const slug = post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const { error } = await supabase.from('posts').insert([{ ...post, slug }]);

    if (error) {
      setStatus('Error: ' + error.message);
    } else {
      setStatus('Post Published Successfully!');
      setPost({ title: '', category: 'Tips', content: '' });
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-black">Create New Blog Post</h1>
          {/* Updated Link below */}
          <Link href="/admin-dashboard" className="text-gray-500 hover:text-black font-bold">
            ← Back to Admin
          </Link>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          <input 
            type="text" placeholder="Post Title" required
            className="w-full p-4 border-2 border-gray-100 rounded-2xl text-black"
            value={post.title}
            onChange={(e) => setPost({...post, title: e.target.value})}
          />
          <select 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl text-black"
            value={post.category}
            onChange={(e) => setPost({...post, category: e.target.value})}
          >
            <option>Tips</option>
            <option>Safety</option>
            <option>Product News</option>
          </select>
          <textarea 
            rows={10} placeholder="Write your content here..." required
            className="w-full p-4 border-2 border-gray-100 rounded-2xl text-black"
            value={post.content}
            onChange={(e) => setPost({...post, content: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all">
            Publish Post
          </button>
          {status && <p className="text-center font-bold text-blue-600 mt-4">{status}</p>}
        </form>
      </div>
    </div>
  );
}
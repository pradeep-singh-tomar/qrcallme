"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-black mb-10">QRCallMe Blog</h1>
        <div className="grid gap-8">
          {posts.length === 0 ? <p className="text-gray-400">No posts yet. Check back soon!</p> : posts.map((post) => (
            <div key={post.id} className="border-b pb-8">
              <span className="text-blue-600 font-bold text-sm uppercase tracking-wide">{post.category}</span>
              <h2 className="text-2xl font-bold mt-2 mb-3 text-black">{post.title}</h2>
              <p className="text-gray-600 line-clamp-2">{post.content.substring(0, 150)}...</p>
              <button className="mt-4 text-black font-semibold hover:underline">Read More →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-24 px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 drop-shadow-xl">QR Insights</h1>
        <p className="text-xl opacity-90 font-medium max-w-2xl mx-auto">Latest news, privacy tips, and smart QR strategies.</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-24">
        {!selectedPost ? (
          /* BLOG GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)}
                className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 cursor-pointer"
              >
                <div className="h-56 bg-slate-200 overflow-hidden relative">
                  <img src={post.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {post.category}
                  </span>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-black mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between border-t pt-6 border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">By {post.author_name}</span>
                    <button className="text-indigo-600 font-black text-xs uppercase tracking-widest">Read Article →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* SINGLE POST VIEW */
          <SinglePostView post={selectedPost} onBack={() => setSelectedPost(null)} />
        )}
      </div>
    </div>
  );
}

/* SUB-COMPONENT: SINGLE POST VIEW */
function SinglePostView({ post, onBack }: { post: any, onBack: () => void }) {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  async function fetchComments() {
    const { data } = await supabase.from('blog_comments').select('*').eq('post_id', post.id).order('created_at', { ascending: false });
    if (data) setComments(data);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('blog_comments').insert([{ post_id: post.id, user_name: name, comment: comment }]);
    setComment(""); setName("");
    fetchComments();
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-50">
      <button onClick={onBack} className="absolute top-10 left-10 z-50 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-indigo-600 transition-all">
        ← Back
      </button>
      <img src={post.image_url} className="w-full h-[400px] object-cover" />
      <div className="p-10 md:p-16">
        <div className="flex gap-4 mb-6">
          <button onClick={share} className="bg-slate-100 p-2 rounded-lg text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all">🔗 Share</button>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">{post.title}</h1>
        <div className="prose prose-lg max-w-none text-slate-600 whitespace-pre-line leading-relaxed">
          {post.content}
        </div>

        {/* COMMENT SECTION */}
        <div className="mt-20 border-t pt-16">
          <h3 className="text-2xl font-black mb-10">Reader Discussions ({comments.length})</h3>
          
          <form onSubmit={submitComment} className="mb-12 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" rows={4} required />
            <button className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Post Comment</button>
          </form>

          <div className="space-y-6">
            {comments.map((c: any) => (
              <div key={c.id} className="bg-slate-50 p-6 rounded-[24px]">
                <p className="font-black text-sm mb-2 text-indigo-600">{c.user_name}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, messages: 0, posts: 0, tags: 0 });

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (data?.is_admin) {
          setIsAdmin(true);
          // Fetch counts for the dashboard
          const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const { count: msgCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });
          const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
          const { count: tagCount } = await supabase.from('user_tags').select('*', { count: 'exact', head: true });
          
          setStats({ 
            users: userCount || 0, 
            messages: msgCount || 0, 
            posts: postCount || 0,
            tags: tagCount || 0
          });
        }
      }
      setLoading(false);
    }
    checkAdmin();
  }, []);

  if (loading) return <div className="p-10 text-black font-medium">Verifying Credentials...</div>;
  if (!isAdmin) return <div className="p-10 text-red-600 font-bold">Access Denied. Admins Only.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Updated with new paths */}
      <div className="w-64 bg-black text-white p-8 flex flex-col">
        <h2 className="text-xl font-black mb-10 tracking-tighter">QR ADMIN</h2>
        <nav className="space-y-6 flex-1">
          <Link href="/admin-dashboard" className="block text-blue-400 font-bold">Overview</Link>
          <Link href="/admin-dashboard/blog" className="block text-gray-400 hover:text-white transition-colors">Manage Blog</Link>
          <Link href="/admin-dashboard/messages" className="block text-gray-400 hover:text-white transition-colors">Support Inbox</Link>
        </nav>
        <div className="pt-6 border-t border-gray-800">
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Exit Admin</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-black">Dashboard</h1>
          <p className="text-gray-500 mt-2">Here is what is happening with QRCallMe today.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.users} color="text-black" />
          <StatCard title="Active Tags" value={stats.tags} color="text-blue-600" />
          <StatCard title="Inbound Messages" value={stats.messages} color="text-orange-500" />
          <StatCard title="Blog Posts" value={stats.posts} color="text-green-600" />
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin-dashboard/blog" className="block w-full text-center py-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-black transition-all">Write New Article</Link>
              <Link href="/admin-dashboard/messages" className="block w-full text-center py-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-black transition-all">Check Inbox</Link>
            </div>
          </div>
          
          <div className="bg-blue-600 p-8 rounded-[32px] text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2">Business Growth</h3>
            <p className="opacity-80">Your platform currently has {stats.tags} active privacy tags protecting users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small reusable component for the Stat Cards
function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">{title}</p>
      <p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
  );
}
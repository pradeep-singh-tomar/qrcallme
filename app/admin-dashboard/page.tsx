"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, messages: 0, users: 0, visits: '840k' });
  const [loading, setLoading] = useState(false);

  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [notification, setNotification] = useState<string | null>(null);

  // ---------------------------------------------------------
  // 1. DATA FETCHING
  // ---------------------------------------------------------
  const fetchData = async (tab: string) => {
    setLoading(true);
    let query = supabase.from(tab);

    if (tab === 'posts' || tab === 'contact_messages') {
      query = query.select('*').order('created_at', { ascending: false });
    } else if (tab === 'faqs') {
      query = query.select('*').order('display_order', { ascending: true });
    } else {
      query = query.select('*');
    }

    const { data: result, error } = await query;
    if (error) console.error("Error fetching:", error);
    setData(result || []);
    setLoading(false);
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [{ count: postCount }, { count: messageCount }, { count: userCount }] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        posts: postCount || 0,
        messages: messageCount || 0,
        users: userCount || 0,
        visits: '840k', // Replace with real analytics if you integrate one
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    } else {
      fetchData(activeTab);
    }
  }, [activeTab]);

  // ---------------------------------------------------------
  // 2. CRUD OPERATIONS
  // ---------------------------------------------------------
  const openModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification("Saving...");

    let result;
    if (editingItem?.id) {
      result = await supabase.from(activeTab).update(formData).eq('id', editingItem.id);
    } else {
      result = await supabase.from(activeTab).insert([formData]);
    }

    if (result.error) {
      setNotification("Error saving data.");
    } else {
      setNotification("Success! Data saved.");
      setIsModalOpen(false);
      activeTab === 'stats' ? fetchStats() : fetchData(activeTab);
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    const { error } = await supabase.from(activeTab).delete().eq('id', id);
    if (!error) {
      setNotification("Item deleted.");
      activeTab === 'stats' ? fetchStats() : fetchData(activeTab);
    } else {
      setNotification("Error deleting item.");
    }
    setTimeout(() => setNotification(null), 3000);
  };

  // ---------------------------------------------------------
  // 3. DYNAMIC FORM RENDERER
  // ---------------------------------------------------------
  const renderFormFields = () => {
    const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mb-4";
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

    switch (activeTab) {
      case 'posts':
        return (
          <>
            <label className={labelClass}>Title</label>
            <input name="title" value={formData.title || ''} onChange={handleInputChange} className={inputClass} placeholder="Blog Post Title" />

            <label className={labelClass}>Category</label>
            <input name="category" value={formData.category || ''} onChange={handleInputChange} className={inputClass} placeholder="Tech, News, Tips..." />

            <label className={labelClass}>Image URL</label>
            <input name="image_url" value={formData.image_url || ''} onChange={handleInputChange} className={inputClass} placeholder="https://..." />

            <label className={labelClass}>Content</label>
            <textarea name="content" rows={6} value={formData.content || ''} onChange={handleInputChange} className={inputClass} placeholder="Write your article here..." />
          </>
        );
      case 'faqs':
        return (
          <>
            <label className={labelClass}>Question</label>
            <input name="question" value={formData.question || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Answer</label>
            <textarea name="answer" rows={4} value={formData.answer || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Display Order</label>
            <input name="display_order" type="number" value={formData.display_order || 0} onChange={handleInputChange} className={inputClass} />
          </>
        );
      case 'site_pages':
        return (
          <>
            <label className={labelClass}>Page Slug (URL)</label>
            <input name="slug" value={formData.slug || ''} onChange={handleInputChange} className={inputClass} placeholder="e.g. contact" />

            <label className={labelClass}>Page Title</label>
            <input name="title" value={formData.title || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Hero Content</label>
            <textarea name="content" rows={4} value={formData.content || ''} onChange={handleInputChange} className={inputClass} />
          </>
        );
      case 'site_settings':
        return (
          <>
            <label className={labelClass}>Site Name</label>
            <input name="site_name" value={formData.site_name || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Support Email</label>
            <input name="contact_email" value={formData.contact_email || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Primary Color (Hex)</label>
            <input name="primary_color" type="color" value={formData.primary_color || '#000000'} onChange={handleInputChange} className="w-full h-12 rounded-xl mb-4" />
          </>
        );
      case 'profiles':
        return (
          <>
            <label className={labelClass}>Username</label>
            <input name="username" value={formData.username || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Full Name</label>
            <input name="full_name" value={formData.full_name || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Avatar URL</label>
            <input name="avatar_url" value={formData.avatar_url || ''} onChange={handleInputChange} className={inputClass} />

            <label className={labelClass}>Role</label>
            <input name="role" value={formData.role || 'user'} onChange={handleInputChange} className={inputClass} />
          </>
        );
      default:
        return <p>No form configuration for this tab.</p>;
    }
  };

  // ---------------------------------------------------------
  // 4. UI RENDER
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce">
          {notification}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-6 flex flex-col sticky top-0 h-screen">
        <div className="mb-12 px-2">
          <h1 className="text-3xl font-black tracking-tighter text-blue-400">QRCallMe</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Command Center</p>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {[
            { id: 'stats', label: 'Overview', icon: '📊' },
            { id: 'posts', label: 'Blog Posts', icon: '✍️' },
            { id: 'faqs', label: 'Manage FAQs', icon: '❓' },
            { id: 'contact_messages', label: 'Inbox', icon: '📩' },
            { id: 'site_pages', label: 'Pages & SEO', icon: '📄' },
            { id: 'site_settings', label: 'Global Settings', icon: '⚙️' },
            { id: 'profiles', label: 'Manage Users', icon: '👥' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-2'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Log Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black capitalize text-slate-800 tracking-tight">{activeTab.replace('_', ' ')}</h2>
            <p className="text-slate-400 font-medium">Manage your {activeTab.replace('_', ' ')} details here.</p>
          </div>

          {activeTab !== 'stats' && activeTab !== 'contact_messages' && activeTab !== 'site_settings' && (
            <button onClick={() => openModal()} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-2">
              <span>+</span> Add New
            </button>
          )}
        </header>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white rounded-3xl w-full" />)}
          </div>
        ) : (
          <>
            {activeTab === 'stats' ? (
              <StatsOverview stats={stats} />
            ) : activeTab === 'site_settings' ? (
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-12">
                {data.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-slate-400 text-lg mb-8">No site settings found. Create one to get started.</p>
                    <button onClick={() => openModal()} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl">
                      Create Settings
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-end mb-8">
                      <button onClick={() => openModal(data[0])} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl">
                        Edit Settings
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Site Name</p>
                        <p className="text-2xl font-bold text-slate-800">{data[0].site_name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Support Email</p>
                        <p className="text-2xl font-bold text-slate-800">{data[0].contact_email || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Primary Color</p>
                        <div className="w-32 h-32 rounded-xl shadow-inner border border-slate-200" style={{ backgroundColor: data[0].primary_color || '#000000' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                {data.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 italic">No data found in this section.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Main Info</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Details</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {data.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <p className="font-bold text-lg text-slate-800">
                              {item.title || item.question || item.slug || item.site_name || item.name || item.username || item.full_name || 'Untitled'}
                            </p>
                            <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mt-1">
                              {item.category || item.email || item.role || ''}
                            </p>
                          </td>
                          <td className="px-8 py-6 max-w-md">
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                              {item.content || item.answer || item.message || "No preview available"}
                            </p>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {activeTab !== 'contact_messages' && (
                                <button onClick={() => openModal(item)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-100 hover:text-blue-600 transition-all">Edit</button>
                              )}
                              <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-100 hover:text-red-600 transition-all">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">{editingItem ? 'Edit Item' : 'Create New'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-2xl">×</button>
            </div>

            <form onSubmit={handleSave} className="p-8 max-h-[70vh] overflow-y-auto">
              {renderFormFields()}
              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                  {editingItem ? 'Save Changes' : 'Create Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// STATS OVERVIEW SUB-COMPONENT
function StatsOverview({ stats }: { stats: any }) {
  const cards = [
    { label: 'Total Visits', value: stats.visits, bg: 'bg-gradient-to-br from-blue-500 to-blue-600', icon: '📈' },
    { label: 'Blog Posts', value: stats.posts, bg: 'bg-gradient-to-br from-purple-500 to-purple-600', icon: '📝' },
    { label: 'Messages', value: stats.messages, bg: 'bg-gradient-to-br from-orange-400 to-pink-500', icon: '💬' },
    { label: 'Users', value: stats.users, bg: 'bg-slate-800', icon: '👥' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((c, i) => (
        <div key={i} className={`${c.bg} p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500`}>
          <div className="absolute -right-6 -top-6 text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-700">{c.icon}</div>
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">{c.label}</p>
          <p className="text-5xl font-black">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
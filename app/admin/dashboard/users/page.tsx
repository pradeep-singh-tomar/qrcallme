"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
  }

  async function toggleAdmin(id: string, currentStatus: boolean) {
    await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('id', id);
    fetchUsers();
  }

  async function deleteUser(id: string) {
    if(confirm("Warning: This only deletes the profile. You must delete the Auth User in Supabase Dashboard for full removal.")) {
      await supabase.from('profiles').delete().eq('id', id);
      fetchUsers();
    }
  }

  return (
    <div className="p-10 bg-white min-h-screen text-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black">User Management</h1>
          <Link href="/admin-dashboard" className="text-blue-600 font-bold">← Back</Link>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-400 text-sm">
              <th className="pb-4">Email/ID</th>
              <th className="pb-4">Admin Status</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id}>
                <td className="py-4 text-sm font-medium">{u.id}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.is_admin ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {u.is_admin ? "ADMIN" : "USER"}
                  </span>
                </td>
                <td className="py-4 text-right space-x-4">
                  <button onClick={() => toggleAdmin(u.id, u.is_admin)} className="text-blue-600 text-xs font-bold underline">Toggle Admin</button>
                  <button onClick={() => deleteUser(u.id)} className="text-red-500 text-xs font-bold underline">Remove Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
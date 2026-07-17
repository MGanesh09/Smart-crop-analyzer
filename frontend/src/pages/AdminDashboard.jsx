import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Sprout, 
  MessageSquare, 
  Database, 
  Trash2, 
  ShieldAlert, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  const ADMIN_API = API_URL.replace('/auth', '/admin');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const resUsers = await axios.get(`${ADMIN_API}/users`);
      const resStats = await axios.get(`${ADMIN_API}/stats`);
      
      if (resUsers.data.success && resStats.data.success) {
        setUsers(resUsers.data.data);
        setStats(resStats.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load administrative console data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    setError('');
    setSuccess('');
    try {
      const res = await axios.put(`${ADMIN_API}/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setSuccess(`User role updated to ${newRole} successfully.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    setError('');
    setSuccess('');
    if (!window.confirm('Are you sure you want to delete this user? This removes all active profiles.')) return;

    try {
      const res = await axios.delete(`${ADMIN_API}/users/${userId}`);
      if (res.data.success) {
        setSuccess('User deleted successfully.');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-8 animate-card">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Admin Console
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Adjust user clearance profiles, manage system aggregates, and review platform telemetry logs.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-950/30 border border-rose-500/20 p-4 text-sm text-rose-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 p-4 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Aggregate Stats Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Platform Users</span>
              <Users className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{stats.usersCount}</h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Farm Mapped Nodes</span>
              <Sprout className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{stats.farmsCount}</h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Forum Discussion Posts</span>
              <MessageSquare className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{stats.postsCount}</h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Calculations Run</span>
              <Database className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{stats.logsCount}</h3>
          </div>
        </div>
      )}

      {/* Users Management Grid */}
      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-4">User Administration Database</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Current Role</th>
                  <th className="py-3 px-2 text-right">Delete Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5">
                    <td className="py-3.5 px-2 font-bold text-white">{item.name}</td>
                    <td className="py-3.5 px-2 font-mono text-[10px]">{item.email}</td>
                    <td className="py-3.5 px-2">
                      <select
                        value={item.role}
                        onChange={(e) => handleUpdateRole(item._id, e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/50 p-1 text-[11px] text-white outline-none focus:border-emerald-500 capitalize"
                      >
                        <option value="farmer">Farmer</option>
                        <option value="expert">Expert</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => handleDeleteUser(item._id)}
                        className="rounded-lg p-1.5 bg-slate-950/50 border border-white/10 hover:border-rose-500/35 text-slate-400 hover:text-rose-400 transition"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Droplets, Activity, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total_users: 0, total_donors: 0, total_requests: 0, total_donations: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/stats')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${id}/status?active=${!currentStatus}`);
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const toggleVerification = async (id, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${id}/verify?verified=${!currentStatus}`);
      fetchData();
    } catch (err) {
      console.error('Failed to verify user', err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-20"><Activity className="animate-spin text-red-600" size={48} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShieldCheck className="text-red-600" /> Admin Control Panel
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Users /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{stats.total_users}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-600"><Droplets /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Donors</p>
            <p className="text-2xl font-bold">{stats.total_donors}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-xl text-orange-600"><Activity /></div>
          <div>
            <p className="text-gray-500 text-sm">Blood Requests</p>
            <p className="text-2xl font-bold">{stats.total_requests}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle /></div>
          <div>
            <p className="text-gray-500 text-sm">Donations</p>
            <p className="text-2xl font-bold">{stats.total_donations}</p>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">User Management</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-100 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-xs">{u.id}</td>
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-500">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'DONOR' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.active ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <XCircle size={14} /> Banned
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {u.verified ? (
                      <span className="text-blue-600 flex items-center gap-1 font-medium">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1">
                        <ShieldAlert size={14} /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleVerification(u.id, u.verified)}
                        className={`p-2 rounded-lg transition-colors ${u.verified ? 'text-gray-400 hover:bg-gray-100' : 'text-blue-600 hover:bg-blue-50'}`}
                        title={u.verified ? "Revoke Verification" : "Verify User"}
                      >
                        <ShieldCheck size={18} />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u.id, u.active)}
                        className={`p-2 rounded-lg transition-colors ${u.active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={u.active ? "Ban User" : "Activate User"}
                      >
                        {u.active ? <ShieldAlert size={18} /> : <CheckCircle size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
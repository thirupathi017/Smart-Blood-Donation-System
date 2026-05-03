import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, LogOut, User, Search, PlusCircle, ShieldCheck, UserMinus } from 'lucide-react';
import useAuthStore from '../store/authStore';

import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout, deleteAccount } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const success = await deleteAccount();
      if (success) {
        navigate('/login');
      }
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
        <Droplets size={28} fill="currentColor" />
        <span>BloodLink</span>
      </Link>

      <div className="flex items-center gap-6">
        {(!user || user.role !== 'DONOR') && (
          <Link to="/search" className="text-slate-600 hover:text-primary-600 flex items-center gap-1">
            <Search size={18} />
            <span>Find Donors</span>
          </Link>
        )}
        
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-slate-600 hover:text-primary-600 flex items-center gap-1">
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
              </Link>
            )}
            {user.role === 'DONOR' && (
              <Link to="/donor-dashboard" className="text-slate-600 hover:text-primary-600 flex items-center gap-1">
                <Droplets size={18} />
                <span>My Dashboard</span>
              </Link>
            )}
            {user.role === 'RECEIVER' && (
              <Link to="/receiver-dashboard" className="text-slate-600 hover:text-primary-600 flex items-center gap-1">
                <PlusCircle size={18} />
                <span>My Dashboard</span>
              </Link>
            )}
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <NotificationBell />
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <div className="flex gap-1 border-l pl-4 border-slate-200 ml-2">
                <button onClick={handleDeleteAccount} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete Account">
                  <UserMinus size={20} />
                </button>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-medium hover:text-primary-600">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

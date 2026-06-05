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

  const getRoleBadge = (role) => {
    if (!role) return null;
    return <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-primary-50 text-primary-600 border border-primary-100 uppercase tracking-wider">{role.toLowerCase()}</span>;
  };

  const getHoverClass = (isActive = false) => {
    return isActive ? 'text-primary-600 font-bold' : 'text-slate-600 hover:text-primary-600';
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm/50">
      <Link to="/" className="flex items-center gap-2 font-black text-xl transition-colors duration-300 text-primary-600">
        <Droplets size={28} fill="currentColor" className="drop-shadow-sm" />
        <span className="tracking-tight">BloodLink</span>
      </Link>

      <div className="flex items-center gap-6">
        {(!user || user.role !== 'DONOR') && (
          <Link to="/search" className={`flex items-center gap-1 font-medium transition-colors ${getHoverClass()}`}>
            <Search size={18} />
            <span>Find Donors</span>
          </Link>
        )}
        
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className={`flex items-center gap-1 font-medium transition-colors ${getHoverClass()}`}>
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
              </Link>
            )}
            {user.role === 'DONOR' && (
              <Link to="/donor-dashboard" className={`flex items-center gap-1 font-medium transition-colors ${getHoverClass(true)}`}>
                <Droplets size={18} />
                <span>My Dashboard</span>
              </Link>
            )}
            {user.role === 'RECEIVER' && (
              <Link to="/receiver-dashboard" className={`flex items-center gap-1 font-medium transition-colors ${getHoverClass(true)}`}>
                <PlusCircle size={18} />
                <span>My Dashboard</span>
              </Link>
            )}
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <NotificationBell />
              <div className="text-right flex flex-col items-end gap-0.5">
                <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                <div className="mt-0.5">{getRoleBadge(user.role)}</div>
              </div>
              <div className="flex gap-1 border-l pl-4 border-slate-200 ml-2">
                <button onClick={handleDeleteAccount} className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer" title="Delete Account">
                  <UserMinus size={20} />
                </button>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-primary-600 transition-colors cursor-pointer" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-bold hover:text-primary-600 transition-colors text-sm">Login</Link>
            <Link to="/register" className="btn-primary py-2.5 px-6 rounded-xl font-bold cursor-pointer transition-all shadow-md">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

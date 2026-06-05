import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Heart, Phone, Mail, Shield, Clock, Users } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Build quick links based on auth state
  const quickLinks = [
    { label: 'Home', to: '/' },
    ...(user
      ? [
          user.role === 'DONOR'
            ? { label: 'My Dashboard', to: '/donor-dashboard' }
            : user.role === 'RECEIVER'
            ? { label: 'My Dashboard', to: '/receiver-dashboard' }
            : null,
          user.role === 'RECEIVER' || user.role === 'ADMIN'
            ? { label: 'Find Donors', to: '/search' }
            : null,
          user.role === 'ADMIN'
            ? { label: 'Admin Panel', to: '/admin' }
            : null,
        ].filter(Boolean)
      : [
          { label: 'Find Donors', to: '/search' },
          { label: 'Register as Donor', to: '/register?role=DONOR' },
          { label: 'Register as Receiver', to: '/register?role=RECEIVER' },
          { label: 'Login', to: '/login' },
        ]),
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Top CTA Banner — only for logged-out users */}
      {!user && (
        <div className="bg-gradient-to-r from-primary-600 via-red-600 to-primary-700 py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                <Droplets size={20} fill="currentColor" />
              </div>
              <div>
                <p className="font-extrabold text-lg leading-tight">Every second counts in an emergency.</p>
                <p className="text-primary-100 text-sm">Join thousands of heroes who donate blood across India.</p>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                to="/register?role=DONOR"
                className="px-6 py-2.5 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-md text-sm"
              >
                Register as Donor
              </Link>
              <Link
                to="/register?role=RECEIVER"
                className="px-6 py-2.5 bg-white/15 border border-white/30 text-white font-bold rounded-xl hover:bg-white/25 transition-colors text-sm"
              >
                Register as Receiver
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand Column */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-2xl mb-4 hover:text-primary-400 transition-colors">
            <Droplets size={30} fill="currentColor" className="text-primary-500" />
            <span className="tracking-tight">BloodLink</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            A smart blood donation platform connecting donors and receivers using real-time geolocation and AI-based smart matching for faster emergency response.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Heart size={14} className="text-primary-500 fill-primary-500 flex-shrink-0" />
            <span>Built with love to save lives</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {quickLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-slate-600 group-hover:bg-primary-500 rounded-full transition-colors flex-shrink-0"></span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform Stats */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Platform</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
              <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-primary-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">2,400+ Donors</p>
                <p className="text-xs text-slate-500">Registered and active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
              <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart size={16} className="text-primary-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">850+ Lives Saved</p>
                <p className="text-xs text-slate-500">Through BloodLink requests</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">24/7 Available</p>
                <p className="text-xs text-slate-500">Emergency alerts anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Emergency Contact</h4>
          <div className="space-y-4">
            <button
              onClick={() => { window.location.href = 'tel:104'; }}
              className="w-full flex items-center gap-3 p-3 bg-primary-600/10 border border-primary-500/20 rounded-xl hover:bg-primary-600/20 transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/30 transition-colors">
                <Phone size={16} className="text-primary-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Blood Bank Helpline</p>
                <p className="text-primary-300 font-extrabold text-lg leading-none">104</p>
              </div>
            </button>

            <button
              onClick={() => { window.location.href = 'tel:108'; }}
              className="w-full flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Ambulance</p>
                <p className="text-red-300 font-extrabold text-lg leading-none">108</p>
              </div>
            </button>

            <a
              href="mailto:support@bloodlink.in"
              className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
            >
              <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-primary-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Email Support</p>
                <p className="text-xs text-slate-400">support@bloodlink.in</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {currentYear} <span className="text-slate-300 font-semibold">BloodLink Platform</span>. All rights reserved. Made with <Heart size={12} className="inline text-primary-500 fill-primary-500 mx-0.5" /> in India.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

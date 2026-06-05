import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Droplets, ShieldCheck, Zap, Heart, MapPin, Users, ArrowRight, Siren, Search, Star, Clock, Bell } from 'lucide-react';
import useAuthStore from '../store/authStore';

/* ─── role-specific content ─────────────────────────────────────── */
const DONOR_CONTENT = {
  badge: { icon: <Heart size={16} fill="currentColor" />, text: 'Donor Portal — Thank you for giving life!', color: 'text-primary-600 border-primary-100 bg-primary-50' },
  bgBlobs: ['bg-primary-100', 'bg-primary-50'],
  headline: (
    <>
      Your Blood. <span className="text-primary-600">Their Life.</span>{' '}
      <span className="text-slate-400">Your Legacy.</span>
    </>
  ),
  quote: '"A single donation can save up to 3 lives. Every time you give, you become someone\'s hero without even knowing it."',
  ctaTo: '/donor-dashboard',
  ctaLabel: 'Go to Donor Dashboard',
  ctaClass: 'bg-primary-600 hover:bg-primary-700 shadow-primary-200',
  accentGlow: 'from-primary-100 to-red-50',
  features: [
    {
      icon: <Zap size={32} />,
      iconBg: 'bg-primary-100 text-primary-600',
      shadow: 'hover:shadow-primary-100',
      title: 'Instant Alerts',
      desc: 'Get notified the moment a receiver near you needs your blood group. Respond fast, save a life.',
    },
    {
      icon: <ShieldCheck size={32} />,
      iconBg: 'bg-slate-100 text-slate-600',
      shadow: 'hover:shadow-slate-100',
      title: 'Verified & Safe',
      desc: 'Your profile is verified by admins. Donors with high reputation scores get priority matches.',
    },
    {
      icon: <Star size={32} />,
      iconBg: 'bg-amber-100 text-amber-600',
      shadow: 'hover:shadow-amber-100',
      title: 'Reputation Score',
      desc: 'Build your score with every successful donation. Top-rated donors are shown first in searches.',
    },
  ],
};

const RECEIVER_CONTENT = {
  badge: { icon: <Siren size={16} />, text: 'Receiver Portal — Help is just a click away', color: 'text-primary-600 border-primary-100 bg-primary-50' },
  bgBlobs: ['bg-primary-100', 'bg-primary-50'],
  headline: (
    <>
      Find Blood. <span className="text-primary-600">Fast.</span>{' '}
      <span className="text-slate-400">When It Matters Most.</span>
    </>
  ),
  quote: '"Hope is the only thing stronger than fear. BloodLink puts that hope into action — connecting you to donors in minutes, not hours."',
  ctaTo: '/receiver-dashboard',
  ctaLabel: 'Go to Receiver Dashboard',
  ctaClass: 'bg-primary-600 hover:bg-primary-700 shadow-primary-200',
  accentGlow: 'from-primary-100 to-primary-50',
  features: [
    {
      icon: <Search size={32} />,
      iconBg: 'bg-primary-100 text-primary-600',
      shadow: 'hover:shadow-primary-100',
      title: 'Smart Search',
      desc: 'AI ranks nearby donors by distance, availability, and reliability so you always find the best match first.',
    },
    {
      icon: <Bell size={32} />,
      iconBg: 'bg-primary-100 text-primary-600',
      shadow: 'hover:shadow-primary-100',
      title: 'Emergency Broadcast',
      desc: 'Send a one-tap emergency alert to all matching donors in your city when every second counts.',
    },
    {
      icon: <Clock size={32} />,
      iconBg: 'bg-teal-100 text-teal-600',
      shadow: 'hover:shadow-teal-100',
      title: 'Real-Time Status',
      desc: 'Track your blood request status live — from OPEN to FULFILLED — with instant donor responses.',
    },
  ],
};

const GUEST_CONTENT = {
  badge: { icon: <Zap size={16} fill="currentColor" />, text: 'Fastest Emergency Response Network', color: 'text-primary-600 border-slate-200 bg-white' },
  bgBlobs: ['bg-primary-50', 'bg-primary-50'],
  headline: (
    <>
      Every Drop <span className="text-primary-600">Saves</span> a Life. Every Second{' '}
      <span className="text-slate-500">Counts.</span>
    </>
  ),
  quote: null,
  accentGlow: 'from-primary-100 to-primary-100',
};
/* ─────────────────────────────────────────────────────────────────── */

const Home = () => {
  const { user } = useAuthStore();

  if (user && user.role === 'ADMIN') return <Navigate to="/admin" />;

  const isDonor = user?.role === 'DONOR';
  const isReceiver = user?.role === 'RECEIVER';
  const content = isDonor ? DONOR_CONTENT : isReceiver ? RECEIVER_CONTENT : GUEST_CONTENT;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
        <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 ${content.bgBlobs[0]} rounded-full blur-3xl opacity-60 animate-pulse`}></div>
        <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 ${content.bgBlobs[1]} rounded-full blur-3xl opacity-50`}></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center gap-10">
            <div>
              {/* Role badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 shadow-sm animate-bounce ${content.badge.color}`}>
                {content.badge.icon}
                <span>{content.badge.text}</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                {content.headline}
              </h1>

              {/* Role-specific quote */}
              {content.quote && (
                <blockquote className="text-base text-slate-500 italic mb-8 border-l-4 border-slate-200 pl-4 leading-relaxed mx-auto max-w-xl text-left">
                  {content.quote}
                </blockquote>
              )}

              {/* Generic description for guests */}
              {!user && (
                <p className="text-xl text-slate-600 mb-10 leading-relaxed mx-auto max-w-2xl">
                  BloodLink is a smart-matching platform that connects blood donors with receivers instantly using real-time geolocation and AI-based ranking.
                </p>
              )}

              {/* CTA buttons */}
              {!user ? (
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/register?role=DONOR" className="px-10 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl shadow-primary-200 flex items-center gap-2">
                    Register as Donor <ArrowRight size={20} />
                  </Link>
                  <Link to="/register?role=RECEIVER" className="px-10 py-4 bg-white text-slate-800 font-bold rounded-2xl hover:bg-slate-100 transition-all border border-slate-200">
                    Register as Receiver
                  </Link>
                </div>
              ) : (
                <Link
                  to={content.ctaTo}
                  className={`px-10 py-4 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 inline-flex ${content.ctaClass}`}
                >
                  {content.ctaLabel} <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              {isDonor
                ? 'Why Donors Love BloodLink'
                : isReceiver
                ? 'How BloodLink Helps You Find Blood'
                : 'Why Choose BloodLink?'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              {isDonor
                ? 'We make giving blood effortless, recognised, and impactful. Every donation you make is tracked, celebrated, and life-changing.'
                : isReceiver
                ? 'From the moment you raise a request to the moment blood arrives — BloodLink keeps you connected, informed, and safe.'
                : "We've built the most advanced platform to ensure that when an emergency happens, technology bridges the gap between those who can give and those who need."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Role-specific feature cards for logged-in users */}
            {(isDonor || isReceiver) && content.features ? (
              content.features.map((f) => (
                <div key={f.title} className={`p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl ${f.shadow} transition-all group`}>
                  <div className={`w-16 h-16 ${f.iconBg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))
            ) : (
              /* Default guest feature cards */
              <>
                <div className="p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary-100 transition-all group">
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <MapPin size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Live Tracking</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Find donors exactly where they are. Our geolocation system calculates real-time distances to find the closest match.
                  </p>
                </div>
                <div className="p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary-100 transition-all group">
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Verified Donors</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Security is our priority. Every donor profile is verified by our admins to ensure reliability and safety.
                  </p>
                </div>
                <div className="p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary-100 transition-all group">
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Reputation Score</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Donors earn scores based on their responsiveness and successful donations, ensuring the best stay at the top.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

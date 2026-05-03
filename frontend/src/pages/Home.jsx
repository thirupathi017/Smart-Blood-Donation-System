import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Droplets, ShieldCheck, Zap, Heart, MapPin, Users, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Home = () => {
  const { user } = useAuthStore();

  if (user && user.role === 'ADMIN') return <Navigate to="/admin" />;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-bold text-red-600 mb-8 shadow-sm animate-bounce">
                <Zap size={16} fill="currentColor" />
                <span>Fastest Emergency Response Network</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                Every Drop <span className="text-red-600">Saves</span> a Life. Every Second <span className="text-slate-500">Counts.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                BloodLink is a smart-matching platform that connects blood donors with receivers instantly using real-time geolocation and AI-based ranking.
              </p>
              
              {!user ? (
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link to="/register" className="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl shadow-red-200 flex items-center gap-2">
                    Start Saving Lives <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="px-10 py-4 bg-white text-slate-800 font-bold rounded-2xl hover:bg-slate-100 transition-all border border-slate-200">
                    Sign In
                  </Link>
                </div>
              ) : (
                <Link 
                  to={user.role === 'DONOR' ? '/donor-dashboard' : user.role === 'RECEIVER' ? '/receiver-dashboard' : '/admin'} 
                  className="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl shadow-red-200 flex items-center gap-2 inline-flex"
                >
                  Go to Dashboard <ArrowRight size={20} />
                </Link>
              )}
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-red-50 rounded-3xl text-center">
                        <Droplets size={40} className="text-red-600 mx-auto mb-4" />
                        <h3 className="text-3xl font-extrabold text-slate-900">2.4k</h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Donors</p>
                     </div>
                     <div className="p-6 bg-blue-50 rounded-3xl text-center">
                        <Users size={40} className="text-blue-600 mx-auto mb-4" />
                        <h3 className="text-3xl font-extrabold text-slate-900">850+</h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Lives Saved</p>
                     </div>
                     <div className="col-span-2 p-6 bg-slate-900 rounded-3xl text-white flex items-center justify-between">
                        <div>
                           <p className="text-slate-400 text-xs font-bold uppercase mb-1">Recent Activity</p>
                           <p className="text-lg font-bold">O+ Needed in Coimbatore</p>
                        </div>
                        <div className="animate-ping w-4 h-4 bg-red-500 rounded-full"></div>
                     </div>
                  </div>
               </div>
               {/* Decorative elements */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-red-100 to-blue-100 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Why Choose BloodLink?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              We've built the most advanced platform to ensure that when an emergency happens, technology bridges the gap between those who can give and those who need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-red-100 transition-all group">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MapPin size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Live Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Find donors exactly where they are. Our geolocation system calculates real-time distances to find the closest match.
              </p>
            </div>
            
            <div className="p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Verified Donors</h3>
              <p className="text-slate-600 leading-relaxed">
                Security is our priority. Every donor profile is verified by our admins to ensure reliability and safety.
              </p>
            </div>

            <div className="p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-red-100 transition-all group">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Reputation Score</h3>
              <p className="text-slate-600 leading-relaxed">
                Donors earn scores based on their responsiveness and successful donations, ensuring the best stay at the top.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-600 rounded-[50px] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-red-200">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-8">Ready to make a difference?</h2>
              <p className="text-red-100 text-xl mb-12 max-w-2xl mx-auto">
                Join thousands of others who are already part of the BloodLink mission. Registration is free and takes less than a minute.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/register" className="px-12 py-5 bg-white text-red-600 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl">
                  Register as Donor
                </Link>
                <Link to="/register" className="px-12 py-5 bg-red-800/30 text-white font-bold rounded-2xl border border-red-400 hover:bg-red-800/40 transition-all backdrop-blur-sm">
                  Register as Receiver
                </Link>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-700 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 text-red-600 font-extrabold text-2xl">
            <Droplets size={32} fill="currentColor" />
            <span>BloodLink</span>
          </div>
          <div className="flex gap-8 text-slate-500 font-medium">
            <a href="#" className="hover:text-red-600 transition-colors">About Us</a>
            <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-600 transition-colors">Contact</a>
          </div>
          <p className="text-slate-400 text-sm">© 2026 BloodLink Platform. Developed with ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

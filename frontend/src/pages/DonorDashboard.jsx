import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Droplets, MapPin, Clock, CheckCircle, ShieldCheck, ToggleLeft, ToggleRight, Loader2, AlertCircle, Heart, MessageCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import DashboardNotifications from '../components/DashboardNotifications';
import ChatWindow from '../components/ChatWindow';
import useSocket from '../store/useSocket';

const DonorDashboard = () => {
  const { user } = useAuthStore();
  const { notifications } = useSocket();
  const [profile, setProfile] = useState(null);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  useEffect(() => {
    // Listen for new emergency notifications to update the list in real-time
    const lastNotif = notifications[0];
    if (lastNotif && lastNotif.isEmergency && profile) {
      // Check if it matches donor's criteria
      if (lastNotif.bloodGroup === profile.bloodGroup) {
        // Avoid duplicates
        setNearbyRequests(prev => {
          const exists = prev.find(r => r.message === lastNotif.message);
          if (exists) return prev;
          
          const newReq = {
            id: Date.now(), // Temp ID for UI
            bloodGroup: lastNotif.bloodGroup,
            city: lastNotif.city,
            message: lastNotif.message,
            requesterName: 'Urgent Request',
            status: 'OPEN',
            createdAt: new Date().toISOString()
          };
          return [newReq, ...prev];
        });
      }
    }
  }, [notifications, profile]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const profRes = await axios.get(`/api/donors/profile/${user.id}`);
        setProfile(profRes.data);
        
        // Fetch nearby requests based on donor's blood group and location
        const reqRes = await axios.get('/api/requests/nearby', {
          params: { 
            bloodGroup: profRes.data.bloodGroup,
            latitude: profRes.data.latitude,
            longitude: profRes.data.longitude
          }
        });
        setNearbyRequests(reqRes.data);
      } catch (err) {
        console.error('Failed to fetch donor data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!profile) return;
    setToggling(true);
    try {
      await axios.put(`/api/donors/availability/${user.id}?available=${!profile.availability}`);
      setProfile(prev => ({ ...prev, availability: !prev.availability }));
    } catch (err) {
      console.error('Failed to toggle availability', err);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <AlertCircle size={64} className="mx-auto mb-6 text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Donor Profile Found</h2>
        <p className="text-slate-500 mb-8">It looks like your donor profile hasn't been created yet. Please contact admin or re-register as a donor.</p>
      </div>
    );
  }

  const parseDate = (dateData) => {
    if (!dateData) return null;
    if (Array.isArray(dateData)) {
      // Handle [yyyy, mm, dd] format from Jackson
      return new Date(dateData[0], dateData[1] - 1, dateData[2]);
    }
    return new Date(dateData);
  };

  const lastDonationDate = parseDate(profile.lastDonationDate);
  const daysSinceDonation = lastDonationDate 
    ? Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isEligible = daysSinceDonation === null || daysSinceDonation >= 90;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Donor Dashboard</h1>
        <p className="text-slate-500">Manage your profile, track your donations, and save lives.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Droplets size={40} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-red-100 flex items-center gap-2 mt-1">
                    <MapPin size={16} /> {profile.city}
                    {user.verified && (
                      <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Blood Group</p>
                <p className="text-3xl font-extrabold text-red-600">{profile.bloodGroup}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</p>
                <p className={`text-lg font-bold ${profile.availability ? 'text-green-600' : 'text-slate-400'}`}>
                  {profile.availability ? '🟢 Available' : '🔴 Unavailable'}
                </p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Eligibility</p>
                <p className={`text-lg font-bold ${isEligible ? 'text-green-600' : 'text-orange-500'}`}>
                  {isEligible ? '✅ Eligible' : '⏳ Cooldown'}
                </p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reputation</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-bold text-slate-800">{profile.rating?.toFixed(1) || '5.0'}</span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Availability Status</h3>
                <p className="text-sm text-slate-500">
                  {profile.availability 
                    ? 'You are currently visible to receivers searching for donors.' 
                    : 'You are hidden from search results. Toggle to become available.'}
                </p>
                {!profile.feelingHealthy && (
                  <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 p-2 rounded-lg inline-block">
                    ⚠️ Marked unavailable because you reported feeling unwell.
                  </p>
                )}
                {profile.recentSurgeryTattoo && (
                  <p className="text-xs text-orange-500 mt-2 font-medium bg-orange-50 p-2 rounded-lg inline-block">
                    ⚠️ Marked unavailable due to recent surgery/tattoo cooldown.
                  </p>
                )}
              </div>
              <button 
                onClick={handleToggleAvailability}
                disabled={toggling || !profile.feelingHealthy || profile.recentSurgeryTattoo || !isEligible}
                className="flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {toggling ? (
                  <Loader2 className="animate-spin text-slate-400" size={40} />
                ) : profile.availability ? (
                  <ToggleRight size={52} className="text-green-500 hover:text-green-600 transition-colors" />
                ) : (
                  <ToggleLeft size={52} className="text-slate-300 hover:text-slate-400 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Last Donation Info */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-red-500" /> Donation History
            </h3>
            {profile.lastDonationDate ? (
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                  <Heart size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Last Donation</p>
                  <p className="text-sm text-slate-500">
                    {lastDonationDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {daysSinceDonation !== null && (
                      <span className="ml-2 text-slate-400">({daysSinceDonation} days ago)</span>
                    )}
                  </p>
                  {!isEligible && (
                    <p className="text-xs text-orange-500 font-medium mt-1">
                      ⏳ You can donate again in {90 - daysSinceDonation} days
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400">
                <Heart size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No donation records yet. Your first donation will appear here.</p>
              </div>
            )}
          </div>

          {/* Nearby Requests */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-red-50/30 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" /> Emergency Requests Near You
              </h3>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                {nearbyRequests.length} MATCHES
              </span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
              {nearbyRequests.length > 0 ? (
                nearbyRequests.map(request => (
                  <div key={request.id} className="p-8 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold">
                          {request.bloodGroup}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Request from {request.requesterName}</p>
                          <p className="text-xs text-slate-500">{request.city}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded uppercase tracking-wider">
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {request.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-slate-400 font-medium">
                        Posted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <button 
                        onClick={() => setActiveChatUser({ id: request.requesterId, name: request.requesterName })}
                        className="text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100 flex items-center gap-2"
                      >
                        <MessageCircle size={14} /> Respond Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <CheckCircle size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="text-sm">No urgent requests for your blood group in your area. Good job!</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ToggleRight size={20} className="text-slate-500" /> Health & Preferences
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">Health Declaration</p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Feeling healthy today?</p>
                    <p className="text-xs text-slate-500">Update this if you are feeling unwell.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const newStatus = !profile.feelingHealthy;
                        await axios.put(`/api/donors/settings/${user.id}`, { ...profile, feelingHealthy: newStatus });
                        setProfile({ ...profile, feelingHealthy: newStatus });
                      } catch (e) { console.error(e); }
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${profile.feelingHealthy ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {profile.feelingHealthy ? 'Yes, Healthy' : 'No, Unwell'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Recent surgery/tattoo (last 6 mo)?</p>
                    <p className="text-xs text-slate-500">Requires 6 months cooldown.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const newStatus = !profile.recentSurgeryTattoo;
                        await axios.put(`/api/donors/settings/${user.id}`, { ...profile, recentSurgeryTattoo: newStatus });
                        setProfile({ ...profile, recentSurgeryTattoo: newStatus });
                      } catch (e) { console.error(e); }
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${profile.recentSurgeryTattoo ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {profile.recentSurgeryTattoo ? 'Yes (Cooldown)' : 'No'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DashboardNotifications />
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Total Donations</span>
                <span className="text-sm font-bold text-slate-900">{profile.totalDonations || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="text-sm text-red-600 font-bold">Lives Impacted</span>
                <span className="text-sm font-bold text-red-700">{profile.livesImpacted || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Location</span>
                <span className="text-sm font-bold text-slate-900">{profile.city}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Coordinates</span>
                <span className="text-xs font-mono text-slate-500">{profile.latitude?.toFixed(2)}, {profile.longitude?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Account</span>
                <span className="text-sm font-bold text-green-600">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white">
            <h3 className="font-bold text-lg mb-3">💡 Did you know?</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              One unit of blood can save up to 3 lives. By staying available on BloodLink, you're part of an emergency response network that helps save thousands.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-white/10 rounded-xl text-center">
                <p className="text-2xl font-bold">3</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Lives per unit</p>
              </div>
              <div className="flex-1 p-3 bg-white/10 rounded-xl text-center">
                <p className="text-2xl font-bold">90</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Day cooldown</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeChatUser && (
        <ChatWindow 
          targetUser={activeChatUser} 
          onClose={() => setActiveChatUser(null)} 
        />
      )}
    </div>
  );
};

export default DonorDashboard;

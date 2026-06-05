import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Droplets, MapPin, Clock, CheckCircle, ShieldCheck, ToggleLeft, ToggleRight, Loader2, AlertCircle, Heart, MessageCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import DashboardNotifications from '../components/DashboardNotifications';
import useSocket from '../store/useSocket';

const DonorDashboard = () => {
  const { user } = useAuthStore();
  const { notifications, setActiveChatUser } = useSocket();
  const [profile, setProfile] = useState(null);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    // Listen for new emergency notifications to update the list in real-time
    const lastNotif = notifications[0];
    if (lastNotif && (lastNotif.type === 'EMERGENCY' || lastNotif.isEmergency) && profile && user) {
      // Just re-fetch the list from the server to ensure we get accurate data including ID and sender info
      axios.get('/api/requests/nearby', {
        params: { 
          donorUserId: user.id,
          bloodGroup: profile.bloodGroup,
          latitude: profile.latitude,
          longitude: profile.longitude
        }
      }).then(res => setNearbyRequests(res.data)).catch(console.error);
    }
  }, [notifications, profile, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const profRes = await axios.get(`/api/donors/profile/${user.id}`);
        setProfile(profRes.data);
        
        // Fetch nearby requests based on donor's blood group and location
        const reqRes = await axios.get('/api/requests/nearby', {
          params: { 
            donorUserId: user.id,
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

  const handleAcceptRequest = async (request) => {
    if (window.confirm("Are you sure you want to officially accept this blood request? The receiver will be notified.")) {
      try {
        await axios.post(`/api/requests/${request.id}/accept`, null, {
          params: {
            donorId: user.id,
            requesterId: request.requesterId,
            donorName: user.name
          }
        });
        // Remove from nearby list or update status
        setNearbyRequests(prev => prev.filter(r => r.id !== request.id));
        alert('✅ Request accepted successfully! Please chat with the receiver to coordinate.');
        setActiveChatUser({ id: request.requesterId, name: request.requesterName });
      } catch (err) {
        console.error('Failed to accept request', err);
        alert('Failed to accept request. It may have already been accepted by another donor.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20 animate-in">
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
    <div className="max-w-6xl mx-auto p-6 animate-in">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Donor Dashboard</h1>
        <p className="text-slate-500">Manage your profile, track your donations, and save lives.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transform hover:-translate-y-0.5 transition-all duration-300">
            <div className="bg-gradient-to-r from-primary-500 via-red-600 to-red-700 p-8 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <Droplets size={40} className="text-white drop-shadow" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
                  <p className="text-primary-100 flex items-center gap-2 mt-1 font-medium">
                    <MapPin size={16} /> {profile.city}
                    {user.verified && (
                      <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
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
                <p className="text-3xl font-black text-primary-600">{profile.bloodGroup}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</p>
                <p className={`text-sm font-bold flex items-center justify-center gap-1.5 ${(profile.availability && isEligible) ? 'text-green-600' : 'text-slate-400'}`}>
                  {(profile.availability && isEligible) ? '🟢 Available' : '🔴 Busy'}
                </p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Eligibility</p>
                <p className={`text-sm font-bold flex items-center justify-center gap-1.5 ${isEligible ? 'text-green-600' : 'text-orange-500'}`}>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Availability Status</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {(profile.availability && isEligible)
                    ? 'You are currently visible to receivers searching for donors.' 
                    : 'You are hidden from search results. Toggle to become available.'}
                </p>
                {!isEligible && (
                  <p className="text-xs text-orange-600 mt-2 font-semibold bg-orange-50 px-3 py-1.5 rounded-xl inline-block border border-orange-100">
                    ⚠️ Marked unavailable because you are on a 90-day cooldown.
                  </p>
                )}
                {!profile.feelingHealthy && (
                  <p className="text-xs text-primary-600 mt-2 font-semibold bg-primary-50 px-3 py-1.5 rounded-xl inline-block border border-primary-100">
                    ⚠️ Marked unavailable because you reported feeling unwell.
                  </p>
                )}
                {profile.recentSurgeryTattoo && (
                  <p className="text-xs text-orange-600 mt-2 font-semibold bg-orange-50 px-3 py-1.5 rounded-xl inline-block border border-orange-100">
                    ⚠️ Marked unavailable due to recent surgery/tattoo cooldown.
                  </p>
                )}
              </div>
              <button 
                onClick={handleToggleAvailability}
                disabled={toggling || !profile.feelingHealthy || profile.recentSurgeryTattoo || !isEligible}
                className="flex items-center gap-2 cursor-pointer disabled:opacity-50 self-end sm:self-auto"
              >
                {toggling ? (
                  <Loader2 className="animate-spin text-slate-400" size={40} />
                ) : (profile.availability && isEligible) ? (
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
              <Clock size={20} className="text-primary-500" /> Donation History
            </h3>
            {profile.lastDonationDate ? (
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100">
                  <Heart size={24} className="text-primary-500" />
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
                    <p className="text-xs text-orange-500 font-semibold mt-1">
                      ⏳ You can donate again in {90 - daysSinceDonation} days
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400 border border-slate-100 border-dashed">
                <Heart size={32} className="mx-auto mb-2 opacity-30 text-primary-400" />
                <p className="text-sm font-medium">No donation records yet. Your first donation will appear here.</p>
              </div>
            )}
          </div>

          {/* Nearby Requests */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-primary-50/20 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle size={20} className="text-primary-600" /> Emergency Requests Near You
              </h3>
              {(isEligible && profile.availability) && (
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold border border-primary-200">
                  {nearbyRequests.length} MATCHES
                </span>
              )}
            </div>
            
            {(!isEligible || !profile.availability) ? (
              <div className="p-12 text-center text-slate-500">
                <AlertCircle size={48} className="mx-auto mb-4 opacity-30 text-orange-500" />
                <p className="text-sm font-medium text-slate-600">
                  {!isEligible 
                    ? "You are currently on a cooldown period and cannot accept emergency requests."
                    : "Your status is set to Busy. Turn on your availability to view and accept requests."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
                {nearbyRequests.length > 0 ? (
                  nearbyRequests.map(request => (
                    <div key={request.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-primary-200">
                            {request.bloodGroup}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Request from {request.requesterName}</p>
                            <p className="text-xs text-slate-500 font-medium">{request.city}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg border border-primary-100 uppercase tracking-wider">
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {request.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] text-slate-400 font-medium">
                          Posted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setActiveChatUser({ id: request.requesterId, name: request.requesterName })}
                            className="text-xs font-bold text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all border border-primary-100 hover:border-primary-200 flex items-center gap-2 cursor-pointer shadow-sm bg-white"
                          >
                            <MessageCircle size={14} /> Chat
                          </button>
                          <button 
                            onClick={() => handleAcceptRequest(request)}
                            className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-primary-200"
                          >
                            <Heart size={14} /> Accept Request
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-20 text-primary-500" />
                    <p className="text-sm font-medium">No urgent requests for your blood group in your area. Good job!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ToggleRight size={20} className="text-slate-500" /> Health & Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">Health Declaration</p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-3 border border-slate-100">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Feeling healthy today?</p>
                    <p className="text-xs text-slate-500">Update this if you are feeling unwell.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const newStatus = !profile.feelingHealthy;
                        await axios.put(`/api/donors/settings/${user.id}`, { ...profile, feelingHealthy: newStatus });
                        // Re-fetch profile to get updated availability from backend
                        const profRes = await axios.get(`/api/donors/profile/${user.id}`);
                        setProfile(profRes.data);
                      } catch (e) { console.error(e); }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${profile.feelingHealthy ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                  >
                    {profile.feelingHealthy ? 'Yes, Healthy' : 'No, Unwell'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Recent surgery/tattoo (last 6 mo)?</p>
                    <p className="text-xs text-slate-500">Requires 6 months cooldown.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const newStatus = !profile.recentSurgeryTattoo;
                        await axios.put(`/api/donors/settings/${user.id}`, { ...profile, recentSurgeryTattoo: newStatus });
                        // Re-fetch profile to get updated availability from backend
                        const profRes = await axios.get(`/api/donors/profile/${user.id}`);
                        setProfile(profRes.data);
                      } catch (e) { console.error(e); }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${profile.recentSurgeryTattoo ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
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
                <span className="text-sm text-slate-600 font-medium">Total Donations</span>
                <span className="text-sm font-bold text-slate-900">{profile.totalDonations || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary-50 rounded-xl border border-primary-100 shadow-sm">
                <span className="text-sm text-primary-700 font-bold">Lives Impacted</span>
                <span className="text-sm font-bold text-primary-800">{profile.livesImpacted || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600 font-medium">Location</span>
                <span className="text-sm font-bold text-slate-900">{profile.city}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600 font-medium">Coordinates</span>
                <span className="text-xs font-mono text-slate-500">{profile.latitude?.toFixed(2)}, {profile.longitude?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600 font-medium">Account</span>
                <span className="text-xs font-bold text-green-600 uppercase bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-3">💡 Did you know?</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              One unit of blood can save up to 3 lives. By staying available on BloodLink, you're part of an emergency response network that helps save thousands.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-white/10 rounded-2xl text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary-300">3</p>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Lives per unit</p>
              </div>
              <div className="flex-1 p-3 bg-white/10 rounded-2xl text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary-300">90</p>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Day cooldown</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;

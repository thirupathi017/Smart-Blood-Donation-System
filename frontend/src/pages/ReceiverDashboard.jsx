import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2, MapPin, Trash2, MessageCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import DashboardNotifications from '../components/DashboardNotifications';
import useSocket from '../store/useSocket';

const ReceiverDashboard = () => {
  const { user } = useAuthStore();
  const { setActiveChatUser } = useSocket();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emergencyBloodGroup, setEmergencyBloodGroup] = useState('');
  const [emergencyCity, setEmergencyCity] = useState('');
  const [emergencySending, setEmergencySending] = useState(false);

  const handleEmergencyRequest = async () => {
    if (!emergencyBloodGroup) return alert('Please select a blood group');
    if (!emergencyCity) return alert('Please enter your city');

    setEmergencySending(true);
    const sendRequest = (lat, lng) => {
      axios.post('/api/requests', {
        requesterId: user.id,
        bloodGroup: emergencyBloodGroup,
        city: emergencyCity,
        latitude: lat,
        longitude: lng,
        message: `🚨 EMERGENCY: ${emergencyBloodGroup} blood needed urgently in ${emergencyCity}!`,
        status: 'OPEN'
      }).then(async () => {
        alert('✅ Emergency alert sent! Nearby donors will be notified.');
        setEmergencyBloodGroup('');
        setEmergencyCity('');
        const response = await axios.get('/api/requests/my', { params: { requesterId: user.id } });
        setRequests(response.data);
      }).catch(err => {
        console.error('Emergency request failed', err);
        alert('Failed to send emergency alert.');
      }).finally(() => {
        setEmergencySending(false);
      });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => sendRequest(pos.coords.latitude, pos.coords.longitude),
      () => {
        console.warn("Geolocation failed, using default");
        sendRequest(11.0168, 76.9558); // Default to Coimbatore
      }
    );
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const response = await axios.get('/api/requests/my', {
          params: { requesterId: user.id }
        });
        setRequests(response.data);
      } catch (err) {
        console.error('Failed to fetch requests', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const handleDeleteRequest = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(`/api/requests/${id}`);
        setRequests(prev => prev.filter(req => req.id !== id));
      } catch (err) {
        console.error('Failed to delete request', err);
        alert('Failed to delete request');
      }
    }
  };

  const handleCompleteRequest = async (id, donorId) => {
    if (window.confirm("Verify that this donor has completed the blood donation? This will close the request and update the donor's stats.")) {
      try {
        await axios.post(`/api/requests/${id}/complete`, null, {
          params: { donorId }
        });
        setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: 'COMPLETED' } : req
        ));
        alert('✅ Donation verified! Thank you for updating the status.');
      } catch (err) {
        console.error('Failed to complete request', err);
        alert('Failed to verify donation.');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <Clock className="text-primary-500" size={18} />;
      case 'ACCEPTED': return <Clock className="text-primary-600" size={18} />;
      case 'CLOSED': return <CheckCircle className="text-teal-500" size={18} />;
      case 'COMPLETED': return <CheckCircle className="text-green-600" size={18} />;
      case 'CANCELLED': return <XCircle className="text-slate-400" size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-primary-50 text-primary-600 border-primary-100';
      case 'ACCEPTED': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'CLOSED': return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-slate-50 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in">
      {/* Premium Header Card */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 p-8 text-white rounded-3xl shadow-xl mb-10 overflow-hidden relative transform hover:-translate-y-0.5 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Receiver Dashboard</h1>
            <p className="text-primary-100 font-medium">Manage your blood requests, locate donors, and track emergency alerts in real-time.</p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-sm self-start sm:self-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              👤
            </div>
            <div>
              <p className="text-xs text-primary-200 font-bold uppercase tracking-wider">Account Type</p>
              <p className="text-sm font-bold">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-extrabold text-lg text-slate-800">Your Blood Requests</h2>
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                {requests.length} REQUESTS
              </span>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-slate-50/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-50 text-primary-600 border border-primary-100 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                          {request.bloodGroup}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">Blood Group {request.bloodGroup}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                            <MapPin size={14} className="text-primary-400" /> {request.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${getStatusClass(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </div>
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete Request"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-3 leading-relaxed">
                      {request.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-400 font-medium ml-1">
                        Requested on {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                      </p>
                      {request.donorId && (
                        <button
                          onClick={() => setActiveChatUser({ id: request.donorId, name: request.donorName || 'Donor' })}
                          className="text-xs font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-xl transition-all border border-primary-100 hover:border-primary-200 flex items-center gap-1.5 cursor-pointer shadow-sm bg-white"
                        >
                          <MessageCircle size={13} /> Chat with Donor
                        </button>
                      )}
                      
                      {request.donorId && request.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCompleteRequest(request.id, request.donorId)}
                          className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-green-100 ml-2"
                        >
                          <CheckCircle size={13} /> Verify Donation
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center text-slate-400">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-20 text-primary-400" />
                  <p className="font-semibold text-slate-600 mb-1">No requests made yet.</p>
                  <p className="text-sm text-slate-400 mb-6">Need blood? You can find registered, active donors nearby.</p>
                  <a href="/search" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary-500/10 inline-block cursor-pointer">
                    Find Donors Now
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">🛡️ Safety Guidelines</h3>
            <ul className="space-y-3.5 text-sm text-slate-600">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Always verify the medical records of the donor.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Prefer donations in registered blood banks or hospitals.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Report any suspicious activity or requests for payment.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
              <MapPin size={18} className="text-primary-500" /> Find Specific Donor
            </h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Search for specific donors near you and request them directly for a faster response.
            </p>
            <a 
              href="/search" 
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              Search & Filter Donors
            </a>
          </div>

          <DashboardNotifications />
          
          {/* Emergency Alert Box Restyled to Premium Indigo/Teal */}
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            <h3 className="font-bold text-xl mb-2 flex items-center gap-2 relative z-10">🚨 Emergency Alert</h3>
            <p className="text-primary-100 text-xs mb-5 leading-relaxed relative z-10">
              Instantly broadcast a push notification to all matching donors in your city. Use this only in genuine emergencies.
            </p>
            
            <div className="space-y-3 mb-5 relative z-10">
              <select 
                value={emergencyBloodGroup}
                onChange={(e) => setEmergencyBloodGroup(e.target.value)}
                className="w-full py-2.5 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium cursor-pointer"
              >
                <option value="" className="text-slate-900">Select Blood Group</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                  <option key={bg} value={bg} className="text-slate-900">{bg}</option>
                ))}
              </select>
              <select 
                value={emergencyCity}
                onChange={(e) => setEmergencyCity(e.target.value)}
                className="w-full py-2.5 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium cursor-pointer"
              >
                <option value="" className="text-slate-900">Select City</option>
                {['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Nagercoil', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Kolkata'].map(city => (
                  <option key={city} value={city} className="text-slate-900">{city}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleEmergencyRequest}
              disabled={emergencySending}
              className="w-full py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {emergencySending ? <Loader2 className="animate-spin text-primary-700" size={18} /> : '🚨'} 
              {emergencySending ? 'Sending Alert...' : 'Send Emergency Alert'}
            </button>

            <div className="mt-4 pt-4 border-t border-white/20 relative z-10">
              <button 
                onClick={() => window.location.href = 'tel:104'}
                className="w-full py-2.5 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/15 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                📞 Call Blood Bank Helpline (104)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;

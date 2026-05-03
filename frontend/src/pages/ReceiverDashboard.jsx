import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';
import useAuthStore from '../store/authStore';
import DashboardNotifications from '../components/DashboardNotifications';

const ReceiverDashboard = () => {
  const { user } = useAuthStore();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <Clock className="text-blue-500" size={18} />;
      case 'CLOSED': return <CheckCircle className="text-green-500" size={18} />;
      case 'CANCELLED': return <XCircle className="text-slate-400" size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'CLOSED': return 'bg-green-50 text-green-600 border-green-100';
      case 'CANCELLED': return 'bg-slate-50 text-slate-500 border-slate-100';
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Receiver Dashboard</h1>
        <p className="text-slate-500">Manage your blood requests and track their status in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-900">Your Blood Requests</h2>
              <span className="text-sm text-slate-500">{requests.length} total</span>
            </div>
            
            <div className="divide-y divide-slate-50">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                          {request.bloodGroup}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Blood Group {request.bloodGroup}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {request.city}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${getStatusClass(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mb-2">
                      {request.message}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Requested on {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-10" />
                  <p>You haven't made any requests yet.</p>
                  <a href="/search" className="text-primary-600 font-semibold text-sm hover:underline mt-2 inline-block">Find Donors Now</a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" /> Find Specific Donor
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Search for specific donors near you and request them directly for a faster response.
            </p>
            <a 
              href="/search" 
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Search & Filter Donors
            </a>
          </div>

          <DashboardNotifications />
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-lg shadow-red-200">
            <h3 className="font-bold text-xl mb-2 flex items-center gap-2">🚨 Emergency Request</h3>
            <p className="text-red-100 text-sm mb-5 leading-relaxed">
              Instantly alert all nearby donors matching your blood type. Use this only in genuine emergencies.
            </p>
            
            <div className="space-y-3 mb-5">
              <select 
                value={emergencyBloodGroup}
                onChange={(e) => setEmergencyBloodGroup(e.target.value)}
                className="w-full py-2.5 px-4 bg-white/15 border border-white/20 rounded-xl text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
              >
                <option value="" className="text-slate-900">Select Blood Group</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                  <option key={bg} value={bg} className="text-slate-900">{bg}</option>
                ))}
              </select>
              <input
                type="text"
                value={emergencyCity}
                onChange={(e) => setEmergencyCity(e.target.value)}
                placeholder="Your city (e.g. Chennai)"
                className="w-full py-2.5 px-4 bg-white/15 border border-white/20 rounded-xl text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <button 
              onClick={handleEmergencyRequest}
              disabled={emergencySending}
              className="w-full py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {emergencySending ? <Loader2 className="animate-spin" size={18} /> : '🚨'} 
              {emergencySending ? 'Sending Alert...' : 'Send Emergency Alert'}
            </button>

            <div className="mt-4 pt-4 border-t border-white/20">
              <a 
                href="tel:104" 
                className="w-full py-2.5 bg-white/15 border border-white/20 rounded-xl font-bold hover:bg-white/25 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                📞 Call Blood Bank Helpline (104)
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Safety Tips</h3>
            <ul className="space-y-3 text-sm text-slate-600">
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
      </div>
    </div>
  );
};

export default ReceiverDashboard;

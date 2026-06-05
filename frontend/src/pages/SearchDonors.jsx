import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Droplets, Star, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import useSocket from '../store/useSocket';

const SearchDonors = () => {
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [city, setCity] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestedDonors, setRequestedDonors] = useState(new Set());
  const { setActiveChatUser } = useSocket();

  const cityCoordinates = {
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 },
    'Madurai': { lat: 9.9252, lng: 78.1198 },
    'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
    'Salem': { lat: 11.6643, lng: 78.1460 },
    'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
    'Erode': { lat: 11.3410, lng: 77.7172 },
    'Vellore': { lat: 12.9165, lng: 79.1325 },
    'Thoothukudi': { lat: 8.8049, lng: 78.1348 },
    'Nagercoil': { lat: 8.1833, lng: 77.4119 },
    'Bengaluru': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 }
  };

  const performSearch = async (lat, lng) => {
    try {
      const response = await axios.get('/api/donors/search', {
        params: { bloodGroup, lat, lng }
      });
      // Sort results by distance (nearest first), then by score as tiebreaker
      const sorted = response.data.sort((a, b) => {
        const distDiff = a.distance - b.distance;
        if (Math.abs(distDiff) > 0.01) return distDiff; // nearest first
        return b.score - a.score; // higher score first for same distance
      });
      setDonors(sorted);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // If a city is selected, use its coordinates
    if (city && cityCoordinates[city]) {
      const { lat, lng } = cityCoordinates[city];
      performSearch(lat, lng);
      return;
    }

    // Otherwise use browser geolocation, with Coimbatore fallback
    navigator.geolocation.getCurrentPosition(
      (position) => performSearch(position.coords.latitude, position.coords.longitude),
      () => {
        console.warn("Geolocation failed, using default coordinates (Coimbatore)");
        performSearch(11.0168, 76.9558);
      }
    );
  };

  const handleRequestContact = async (donor) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert("Please login first");
    
    if (requestedDonors.has(donor.user.id)) return;

    try {
      await axios.post('/api/requests', {
        requesterId: user.id,
        donorId: donor.user.id, // Target specific donor
        bloodGroup: donor.profile.bloodGroup,
        city: donor.profile.city,
        latitude: donor.profile.latitude,
        longitude: donor.profile.longitude,
        message: `Contact request for donor: ${donor.user.name}`,
        status: 'OPEN'
      });
      
      setRequestedDonors(prev => new Set([...prev, donor.user.id]));
      alert("Contact request sent successfully!");
    } catch (err) {
      console.error('Request failed', err);
      alert("Failed to send request");
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 text-gradient">AI-Powered Smart Matching</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Ranking donors based on distance, eligibility, and reliability to ensure you find the best match instantly.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Required Blood Group</label>
            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={18} />
              <select 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-200 appearance-none cursor-pointer"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▾</div>
            </div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-slate-700 mb-2">City / Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={18} />
              <select
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-200 appearance-none cursor-pointer"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">All Cities (Auto-detect)</option>
                {Object.keys(cityCoordinates).sort().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▾</div>
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto bg-red-600 text-white font-bold py-3 px-10 rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg shadow-red-200 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Search size={20} /> Smart Search</>}
          </button>
        </form>
      </div>

      {donors.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-900">Cant find a perfect match?</h3>
              <p className="text-red-700 text-sm">Send an emergency alert to all {donors.length} matching donors in this area.</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              const user = JSON.parse(localStorage.getItem('user'));
              if (!user) return alert("Please login first");
              
              if (!window.confirm(`This will notify all ${donors.length} matching donors. Continue?`)) return;

              try {
                setLoading(true);
                await axios.post('/api/requests', {
                  requesterId: user.id,
                  bloodGroup: bloodGroup,
                  city: city || 'Current Location',
                  latitude: donors[0].profile.latitude, // Use first donor's approx location if needed
                  longitude: donors[0].profile.longitude,
                  message: `🚨 BROADCAST: Urgent ${bloodGroup} blood needed!`,
                  status: 'OPEN'
                });
                alert("✅ Emergency alert broadcasted successfully!");
              } catch (err) {
                console.error(err);
                alert("Failed to send broadcast");
              } finally {
                setLoading(false);
              }
            }}
            className="whitespace-nowrap bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-all shadow-md flex items-center gap-2"
          >
            <Droplets size={18} /> Broadcast to All
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {donors.map((donor, index) => (
          <div key={donor.profile.id} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-50 relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full border border-red-100 flex items-center gap-1">
                <Star size={14} fill="currentColor" />
                {Math.round(donor.score)}% Match
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <Droplets size={28} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{donor.user.name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin size={14} className="text-red-400" /> {donor.profile.city} ({donor.distance} km away)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-8">
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">Group</p>
                <p className="font-extrabold text-red-600 text-lg">{donor.profile.bloodGroup}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">Status</p>
                <p className={`font-bold ${donor.profile.availability ? 'text-green-600' : 'text-slate-400'}`}>
                  {donor.profile.availability ? 'AVAILABLE' : 'BUSY'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleRequestContact(donor)}
                disabled={requestedDonors.has(donor.user.id)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  requestedDonors.has(donor.user.id) 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {requestedDonors.has(donor.user.id) ? 'Requested' : 'Request'}
              </button>
              <button 
                onClick={() => setActiveChatUser(donor.user)}
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                title="Start Chat"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        ))}

        {!loading && donors.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>No donors found. Try a different blood group or location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;

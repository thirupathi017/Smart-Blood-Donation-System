import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Phone, Loader2, Droplets, Calendar, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DONOR',
    bloodGroup: 'A+',
    city: '',
    phone: '',
    latitude: 28.6139,
    longitude: 77.2090,
    lastDonationDate: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstTimeDonor, setIsFirstTimeDonor] = useState(false);

  // Re-sync role whenever the ?role= URL param changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'DONOR' || roleParam === 'RECEIVER' || roleParam === 'ADMIN') {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const cityCoordinates = {
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 },
    'Madurai': { lat: 9.9252, lng: 78.1198 },
    'Trichy': { lat: 10.7905, lng: 78.7047 },
    'Salem': { lat: 11.6643, lng: 78.1460 },
    'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
    'Erode': { lat: 11.3410, lng: 77.7172 },
    'Vellore': { lat: 12.9165, lng: 79.1325 },
    'Thoothukudi': { lat: 8.8049, lng: 78.1348 },
    'Nagercoil': { lat: 8.1833, lng: 77.4119 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' && cityCoordinates[value]) {
      setFormData({ 
        ...formData, 
        city: value,
        latitude: cityCoordinates[value].lat,
        longitude: cityCoordinates[value].lng
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (isFirstTimeDonor || !payload.lastDonationDate) {
      payload.lastDonationDate = null;
    }
    const success = await register(payload);
    if (success) navigate('/login');
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50/50">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          <div className="bg-primary-600 md:w-1/3 p-10 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <Droplets className="absolute -top-10 -left-10 text-white rotate-45" size={200} />
            </div>
            <div className="relative z-10">
              <Droplets className="mb-6" size={48} fill="currentColor" />
              <h2 className="text-3xl font-bold mb-4">Join Us</h2>
              <p className="text-primary-100 text-sm leading-relaxed opacity-90">
                Become part of a network dedicated to saving lives through smart technology.
              </p>
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Smart Matching</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Real-time Alerts</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Easy Dashboard</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 md:w-2/3">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm mb-8">Fill in your details to get started</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Account Type</label>
                <div className="flex gap-4">
                  {['DONOR', 'RECEIVER', 'ADMIN'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({...formData, role})}
                      className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${formData.role === role ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input name="name" className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input type="email" name="email" className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} className="w-full pl-11 pr-12 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" onChange={handleChange} required />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-slate-400 hover:text-primary-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input type="tel" name="phone" value={formData.phone} className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 text-slate-400" size={18} />
                    <select 
                      name="city" 
                      value={formData.city} 
                      className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all bg-white appearance-none" 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select your city</option>
                      {['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Nagercoil', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Kolkata'].sort().map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      name="age" 
                      value={formData.age} 
                      min={formData.role === 'DONOR' ? "18" : "1"} 
                      max="100" 
                      className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  {formData.role === 'DONOR' && (
                    <p className="text-[10px] text-slate-400 ml-2">Must be 18 or older.</p>
                  )}
                </div>

                {formData.role === 'DONOR' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Weight (kg)</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3 text-slate-400" size={18} />
                        <input type="number" name="weight" min="50" max="250" className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" onChange={handleChange} required />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-2">Must be 50kg or above.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Blood Group</label>
                      <select name="bloodGroup" className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all bg-white" onChange={handleChange}>
                        {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-3">Self-Declaration Health Check</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-slate-600 mb-2">Are you feeling healthy today?</p>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="radio" name="feelingHealthy" value="true" className="text-primary-600 focus:ring-primary-500" onChange={(e) => setFormData({...formData, feelingHealthy: true})} defaultChecked /> Yes
                              </label>
                              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="radio" name="feelingHealthy" value="false" className="text-primary-600 focus:ring-primary-500" onChange={(e) => setFormData({...formData, feelingHealthy: false})} /> No
                              </label>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-slate-600 mb-2">Any recent surgery, tattoo, or vaccination in the last 6 months?</p>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="radio" name="recentSurgeryTattoo" value="true" className="text-primary-600 focus:ring-primary-500" onChange={(e) => setFormData({...formData, recentSurgeryTattoo: true})} /> Yes
                              </label>
                              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="radio" name="recentSurgeryTattoo" value="false" className="text-primary-600 focus:ring-primary-500" onChange={(e) => setFormData({...formData, recentSurgeryTattoo: false})} defaultChecked /> No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Donation Date</label>
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                            checked={isFirstTimeDonor}
                            onChange={(e) => {
                              setIsFirstTimeDonor(e.target.checked);
                              if (e.target.checked) {
                                setFormData({...formData, lastDonationDate: ''});
                              }
                            }}
                          />
                          I am a first-time donor
                        </label>
                      </div>
                      <div className={`relative transition-opacity ${isFirstTimeDonor ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Calendar className="absolute left-4 top-3 text-slate-400" size={18} />
                        <input 
                          type="date" 
                          name="lastDonationDate" 
                          value={formData.lastDonationDate}
                          className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all bg-white" 
                          onChange={handleChange} 
                          disabled={isFirstTimeDonor}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Create Your Account'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already a member?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

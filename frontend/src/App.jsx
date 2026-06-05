import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchDonors from './pages/SearchDonors';
import ReceiverDashboard from './pages/ReceiverDashboard';
import useAuthStore from './store/authStore';

import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import useSocket from './store/useSocket';
import ChatWindow from './components/ChatWindow';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const App = () => {
  const { user } = useAuthStore();
  const { activeChatUser, setActiveChatUser } = useSocket();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            <Route path="/search" element={
              <ProtectedRoute allowedRoles={['RECEIVER', 'ADMIN']}>
                <SearchDonors />
              </ProtectedRoute>
            } />
            
            <Route path="/receiver-dashboard" element={
              <ProtectedRoute allowedRoles={['RECEIVER', 'ADMIN']}>
                <ReceiverDashboard />
              </ProtectedRoute>
            } />

            <Route path="/donor-dashboard" element={
              <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
                <DonorDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Global Chat Window */}
      {activeChatUser && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="pointer-events-auto">
            <ChatWindow 
              targetUser={activeChatUser} 
              onClose={() => setActiveChatUser(null)} 
            />
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchDonors from './pages/SearchDonors';
import ReceiverDashboard from './pages/ReceiverDashboard';
import useAuthStore from './store/authStore';

import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const App = () => {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
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
      </div>
    </Router>
  );
};

export default App;

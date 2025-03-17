import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import { authService } from './services/api';
import './App.css';
import RestaurantDashboard from './components/RestaurantDashboard';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return (
    <>
      <Navbar />
      <div className="main-content dark-theme">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App dark-theme">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurants/:restaurantId/dashboard" 
            element={
              <ProtectedRoute>
                <RestaurantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reservations" 
            element={
              <ProtectedRoute>
                <div className="placeholder-page">Reservations Page (Coming Soon)</div>
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

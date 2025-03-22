import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import { authService } from './services/api';
import './App.css';
import RestaurantDashboard from './components/RestaurantDashboard';
import ReservationsPage from './components/ReservationsPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App dark-theme">
        {/* Navbar will only show if user is authenticated */}
        {authService.isAuthenticated() && <Navbar />}
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/signin" 
              element={
                authService.isAuthenticated() ? 
                <Navigate to="/dashboard" replace /> : 
                <SignIn />
              } 
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <ReservationsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/restaurants/:restaurantId/reservations/:reservationId"
              element={
                <ProtectedRoute>
                  {/* Reservation Details Component - you'll need to create this */}
                  <div>Reservation Details Page</div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/restaurants/:restaurantId/reservations/:reservationId/edit"
              element={
                <ProtectedRoute>
                  {/* Reservation Edit Component - you'll need to create this */}
                  <div>Edit Reservation Page</div>
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
            
            {/* Redirect root to dashboard if authenticated, otherwise to signin */}
            <Route
              path="/"
              element={
                <Navigate 
                  to={authService.isAuthenticated() ? "/dashboard" : "/signin"} 
                  replace 
                />
              }
            />
            
            {/* Catch all route - redirect to dashboard if authenticated */}
            <Route
              path="*"
              element={
                <Navigate 
                  to={authService.isAuthenticated() ? "/dashboard" : "/signin"} 
                  replace 
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

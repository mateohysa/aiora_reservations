import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/api';
import './Dashboard.css';

// Mock data for development until the API is ready
const mockRestaurants = [
  {
    restaurantId: 1,
    name: "The Grand Dining",
    restaurantType: "FINE_DINING",
    defaultCapacity: 50,
    maxCapacity: 75,
    location: "Main Building, 1st Floor",
    description: "Elegant fine dining experience",
    roomOnly: true
  },
  {
    restaurantId: 2,
    name: "Casual Corner",
    restaurantType: "CASUAL",
    defaultCapacity: 30,
    maxCapacity: 40,
    location: "East Wing, Ground Floor",
    description: "Relaxed casual dining",
    roomOnly: false
  },
  {
    restaurantId: 3,
    name: "Sunset Lounge",
    restaurantType: "LOUNGE",
    defaultCapacity: 25,
    maxCapacity: 35,
    location: "West Wing, Top Floor",
    description: "Scenic rooftop dining",
    roomOnly: false
  }
];

const mockReservationStats = {
  1: { pending: 0, confirmed: 0, total: 0 },
  2: { pending: 2, confirmed: 4, total: 6 },
  3: { pending: 3, confirmed: 5, total: 8 }
};

// Add mock recent reservations data
const mockRecentReservations = [
  {
    id: 1,
    restaurantId: 2,
    restaurantName: "Casual Corner",
    guestName: "John Smith",
    date: "2023-11-15T19:00:00",
    status: "CONFIRMED",
    guestCount: 2,
    isHotelGuest: true,
    roomNumber: "304"
  },
  {
    id: 2,
    restaurantId: 3,
    restaurantName: "Sunset Lounge",
    guestName: "Maria Garcia",
    date: "2023-11-16T20:30:00",
    status: "PENDING",
    guestCount: 4,
    isHotelGuest: false,
    roomNumber: null
  },
  {
    id: 3,
    restaurantId: 2,
    restaurantName: "Casual Corner",
    guestName: "Robert Johnson",
    date: "2023-11-17T18:00:00",
    status: "CONFIRMED",
    guestCount: 3,
    isHotelGuest: true,
    roomNumber: "215"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [reservationStats, setReservationStats] = useState({});
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Use the existing endpoint to fetch all restaurants
        const restaurantsResponse = await fetchWithAuth('/restaurants');
        setRestaurants(restaurantsResponse);
        
        // For now, we'll keep using the mock data for reservations
        // until we implement the reservation endpoints
        setReservationStats(mockReservationStats);
        setRecentReservations(mockRecentReservations);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewAll = (restaurantId, type) => {
    navigate(`/restaurants/${restaurantId}/reservations?status=${type}`);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Restaurants</h1>
      </div>
      
      <div className="stats-container">
        {restaurants.map(restaurant => (
          <div key={restaurant.restaurantId} className="stats-card">
            <div className="stats-header">
              <h2>{restaurant.name}</h2>
              {restaurant.roomOnly && <span className="room-only-badge">Guest Only</span>}
            </div>
            
            <div className="stats-grid">
              <div className="stat-box pending">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Pending Reservations</h3>
                  <p className="stat-number">{reservationStats[restaurant.restaurantId]?.pending || 0}</p>
                  {!restaurant.roomOnly && (
                    <button 
                      className="view-all-btn" 
                      onClick={() => handleViewAll(restaurant.restaurantId, 'PENDING')}
                    >
                      View all
                    </button>
                  )}
                </div>
              </div>
              
              <div className="stat-box confirmed">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.4 14.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Confirmed Reservations</h3>
                  <p className="stat-number">{reservationStats[restaurant.restaurantId]?.confirmed || 0}</p>
                  {!restaurant.roomOnly && (
                    <button 
                      className="view-all-btn" 
                      onClick={() => handleViewAll(restaurant.restaurantId, 'CONFIRMED')}
                    >
                      View all
                    </button>
                  )}
                </div>
              </div>
              
              {/* Total Reservations section removed */}
            </div>
          </div>
        ))}
      </div>
      
      <div className="recent-reservations">
        <h2>Recent Reservations</h2>
        {recentReservations.length > 0 ? (
          <div className="reservation-list">
            {recentReservations.map(reservation => (
              <div key={reservation.id} className="reservation-item">
                <div className="reservation-header">
                  <h3>{reservation.restaurantName}</h3>
                  <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                    {reservation.status}
                  </span>
                </div>
                <div className="reservation-details">
                  <div className="detail-group">
                    <span className="detail-label">Guest:</span>
                    <span className="detail-value">{reservation.guestName}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(reservation.date).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Party Size:</span>
                    <span className="detail-value">{reservation.guestCount} guests</span>
                  </div>
                  {reservation.isHotelGuest && reservation.roomNumber && (
                    <div className="detail-group">
                      <span className="detail-label">Room:</span>
                      <span className="detail-value">{reservation.roomNumber}</span>
                    </div>
                  )}
                </div>
                <button 
                  className="view-details-btn"
                  onClick={() => navigate(`/restaurants/${reservation.restaurantId}/reservations/${reservation.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="placeholder-message">
            No recent reservations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
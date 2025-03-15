import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/api';
import './Dashboard.css';





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
        
        // Fetch all restaurants
        const restaurantsResponse = await fetchWithAuth('/restaurants');
        setRestaurants(restaurantsResponse);
        
        // Initialize stats object
        const stats = {};
        // Initialize allRecentReservations OUTSIDE the loop
        const allRecentReservations = [];
        
        // Fetch reservation stats and recent reservations for each restaurant
        for (const restaurant of restaurantsResponse) {
          const restaurantId = restaurant.restaurantId;
          
          // Fetch reservation stats - FIX THE URL PREFIX
          try {
            const statsResponse = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/stats`);
            stats[restaurantId] = {
              pending: statsResponse.pendingReservations || 0,
              confirmed: statsResponse.confirmedReservations || 0,
              total: statsResponse.totalReservations || 0
            };
          } catch (err) {
            console.error(`Failed to fetch stats for restaurant ${restaurantId}:`, err);
            stats[restaurantId] = { pending: 0, confirmed: 0, total: 0 };
          }
          
          // Get recent reservations for restaurant 2 and 3
          if (restaurantId === 2 || restaurantId === 3) {
            try {
              console.log(`Fetching reservations for restaurant ${restaurantId}`);
              const recentResponse = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/recent`);
              
              if (recentResponse.reservations && recentResponse.reservations.length > 0) {
                const formattedReservations = recentResponse.reservations.map(res => ({
                  id: res.reservationId,
                  restaurantId: res.restaurantId,
                  restaurantName: res.restaurantName,
                  guestName: res.guestName,
                  date: res.reservationDate,
                  status: res.reservationStatus,
                  guestCount: res.guestCount,
                  isHotelGuest: res.isHotelGuest,
                  roomNumber: res.roomNumber
                }));
                
                // Add to our collection of all reservations
                allRecentReservations.push(...formattedReservations);
              }
            } catch (err) {
              console.error(`Failed to fetch recent reservations for restaurant ${restaurantId}:`, err);
            }
          }
        }
        
        // At the end of the loop, set all reservations collected from both restaurants
        setRecentReservations(allRecentReservations);
        setReservationStats(stats);
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
                <div className="header-buttons">
                  {restaurant.roomOnly && (
                    <>
                  <span className="room-only-badge">Guest Only</span>
                  <button 
                    className="more-button"
                    onClick={() => console.log(`Search in ${restaurant.name}`)}
                  >
                    Search
                  </button>
                  </>
                  )}
        {!restaurant.roomOnly && (
      <button 
        className="more-button"
        onClick={() => console.log(`More options for ${restaurant.name}`)}
      >
        More
      </button>
    )}
  </div>
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
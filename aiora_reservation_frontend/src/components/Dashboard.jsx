import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/api';
import './Dashboard.css';
import ReservationModal from './ReservationModal';
import SpotlightSearch from './SpotlightSearch';

const Dashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [reservationStats, setReservationStats] = useState({});
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

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
          
          // Fetch reservation stats
          try {
            const statsResponse = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/stats/today`);
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
              // Add pagination parameters to the API call
              const recentResponse = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/recent?page=${currentPage}&size=10`);
              
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
              
              // Store pagination metadata
              if (recentResponse.totalPages) {
                setTotalPages(recentResponse.totalPages);
              }
              if (recentResponse.currentPage !== undefined) {
                setCurrentPage(recentResponse.currentPage);
              }
            } catch (err) {
              console.error(`Failed to fetch recent reservations for restaurant ${restaurantId}:`, err);
            }
          }
        }
        
        // Sort the combined list of reservations
        allRecentReservations.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        
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

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Re-fetch data with the new page
    const fetchPagedData = async () => {
      try {
        setLoading(true);
        
        // Initialize allRecentReservations
        const allRecentReservations = [];
        
        // Fetch only the reservations for the new page
        for (const restaurant of restaurants) {
          const restaurantId = restaurant.restaurantId;
          
          if (restaurantId === 2 || restaurantId === 3) {
            try {
              const recentResponse = await fetchWithAuth(
                `/restaurants/${restaurantId}/reservations/recent?page=${newPage}&size=10`
              );
              
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
                
                allRecentReservations.push(...formattedReservations);
              }
              
              // Update pagination metadata if available
              if (recentResponse.totalPages) {
                setTotalPages(recentResponse.totalPages);
              }
            } catch (err) {
              console.error(`Failed to fetch recent reservations for restaurant ${restaurantId}:`, err);
            }
          }
        }
        
        // Sort the new reservations
        allRecentReservations.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        
        // Update the state with the new reservations
        setRecentReservations(allRecentReservations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching paged data:', err);
        setLoading(false);
      }
    };
    
    fetchPagedData();
  };

  const handleViewReservation = (reservation) => {
    setSelectedReservation({
      reservationId: reservation.id,
      restaurantId: reservation.restaurantId,
      restaurantName: reservation.restaurantName
    });
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation({
      reservationId: reservation.id,
      restaurantId: reservation.restaurantId,
      restaurantName: reservation.restaurantName
    });
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData, mode) => {
    if (mode === 'view') {
      // Switch to edit mode when "Edit" is clicked in view mode
      setModalMode('edit');
      return;
    }
    
    try {
      // For edit mode, update the reservation
      await fetchWithAuth(`/restaurants/${selectedReservation.restaurantId}/reservations/${selectedReservation.reservationId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      setModalOpen(false);
      
      // Refresh the data to show updated reservation
      const fetchPagedData = async () => {
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
            
            // Fetch reservation stats
            try {
              const statsResponse = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/stats/today`);
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
                // Add pagination parameters to the API call
                const recentResponse = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/recent?page=${currentPage}&size=10`);
                
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
                
                // Store pagination metadata
                if (recentResponse.totalPages) {
                  setTotalPages(recentResponse.totalPages);
                }
                if (recentResponse.currentPage !== undefined) {
                  setCurrentPage(recentResponse.currentPage);
                }
              } catch (err) {
                console.error(`Failed to fetch recent reservations for restaurant ${restaurantId}:`, err);
              }
            }
          }
          
          // Sort the combined list of reservations
          allRecentReservations.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          
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
      
      fetchPagedData();
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  const handleSelectReservation = (reservation) => {
    setSelectedReservation({
      reservationId: reservation.reservationId,
      restaurantId: reservation.restaurantId,
      restaurantName: reservation.restaurantName
    });
    setModalMode('view');
    setModalOpen(true);
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
                        onClick={() => setSearchOpen(true)}
                      >
                        Search
                      </button>
                    </>
                  )}
                  {!restaurant.roomOnly && (
                    <button 
                      className="more-button"
                      onClick={() => navigate(`/restaurants/${restaurant.restaurantId}/dashboard`)}
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
                    
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="recent-reservations">
        <h2>Recent Reservations</h2>
        {recentReservations.length > 0 ? (
          <div className="reservations-table-container">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Restaurant</th>
                  <th>Guest</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Party Size</th>
                  <th>Room</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td>{reservation.id}</td>
                    <td>{reservation.restaurantName}</td>
                    <td>{reservation.guestName}</td>
                    <td>{new Date(reservation.date).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>{reservation.guestCount}</td>
                    <td>{reservation.isHotelGuest ? reservation.roomNumber : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="view-btn"
                          onClick={() => handleViewReservation(reservation)}
                        >
                          View
                        </button>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditReservation(reservation)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="placeholder-message">
            No recent reservations found.
          </div>
        )}
        
        {/* Pagination Controls */}
        {recentReservations.length > 0 && (
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              disabled={currentPage <= 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button 
              className="pagination-btn"
              disabled={currentPage >= totalPages - 1 || totalPages <= 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {modalOpen && (
        <ReservationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          reservationId={selectedReservation?.reservationId}
          restaurantId={selectedReservation?.restaurantId}
          restaurantName={selectedReservation?.restaurantName}
          mode={modalMode}
          onSubmit={handleModalSubmit}
        />
      )}
      <SpotlightSearch 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onSelectReservation={handleSelectReservation}
      />
    </div>
  );
};

export default Dashboard;
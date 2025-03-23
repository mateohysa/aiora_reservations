import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/api';
import ReservationForm from './ReservationForm';
import ReservationModal from './ReservationModal';
import './Dashboard.css'; // Reuse existing styles
import './RestaurantDashboard.css'; // Add new styles for tables

// TableGrid component will be imported later
// import TableGrid from './TableGrid';

const RestaurantDashboard = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [reservationStats, setReservationStats] = useState({});
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [viewEditModalOpen, setViewEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId, currentPage]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurant details
      const restaurantResponse = await fetchWithAuth(`/restaurants/${restaurantId}`);
      setRestaurant(restaurantResponse);
      
      // Fetch reservation stats
      try {
        const statsResponse = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/stats`);
        setReservationStats({
          pending: statsResponse.pendingReservations || 0,
          confirmed: statsResponse.confirmedReservations || 0,
          total: statsResponse.totalReservations || 0
        });
      } catch (err) {
        console.error(`Failed to fetch stats for restaurant ${restaurantId}:`, err);
        setReservationStats({ pending: 0, confirmed: 0, total: 0 });
      }
      
      // Fetch recent reservations
      try {
        const recentResponse = await fetchWithAuth(
          `/restaurants/${restaurantId}/reservations/recent?page=${currentPage}&size=10`
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
          
          setRecentReservations(formattedReservations);
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
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching restaurant data:', err);
      setError('Failed to load restaurant data. Please try again later.');
      setLoading(false);
    }
  };

  const handleNewReservation = () => {
    setShowReservationForm(true);
    setFormError(null); // Clear any previous errors
  };
  
  const handleTableClick = (tableNumber) => {
    // Tables are just visual - clicking any table opens the reservation form
    setShowReservationForm(true);
    setFormError(null); // Clear any previous errors
  };
  
  const handleCloseReservationForm = () => {
    setShowReservationForm(false);
    setFormError(null);
  };
  
  const handleCreateReservation = async (reservationData) => {
    try {
      setFormError(null);
      
      const response = await fetchWithAuth(`/restaurants/${restaurantId}/reservations`, {
        method: 'POST',
        body: JSON.stringify(reservationData)
      });
      
      // Close the form and refresh data
      setShowReservationForm(false);
      
      // Refetch data to show the new reservation
      fetchRestaurantData();
    } catch (error) {
      console.error('Error creating reservation:', error);
      setFormError(error.message || 'Failed to create reservation. Please try again.');
    }
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // useEffect will refetch data when currentPage changes
  };

  // Generate table layout based on restaurant capacity
  const generateTables = () => {
    // Always generate 60 tables for both restaurants
    const tableCount = 60;
    
    return Array.from({ length: tableCount }, (_, i) => (
      <div 
        key={i}
        className="table-item"
        onClick={() => handleTableClick(i + 1)}
      >
        <span className="table-number">Table {i + 1}</span>
      </div>
    ));
  };

  const handleViewReservation = (reservation, e) => {
    // Prevent any default navigation
    if (e) {
      e.preventDefault();
      e.stopPropagation(); 
    }
    
    console.log("Opening view modal for reservation:", reservation.id);
    setSelectedReservation({
      reservationId: reservation.id,
      restaurantId: reservation.restaurantId,
      restaurantName: reservation.restaurantName
    });
    setModalMode('view');
    setViewEditModalOpen(true);
  };

  const handleEditReservation = (reservation, e) => {
    // Prevent any default navigation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Opening edit modal for reservation:", reservation.id);
    setSelectedReservation({
      reservationId: reservation.id,
      restaurantId: reservation.restaurantId,
      restaurantName: reservation.restaurantName
    });
    setModalMode('edit');
    setViewEditModalOpen(true);
  };

  const handleModalSubmit = async (formData, mode) => {
    console.log("Modal submit with mode:", mode, "and data:", formData);
    
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
      
      setViewEditModalOpen(false);
      
      // Refresh the data
      fetchRestaurantData();
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading restaurant data...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!restaurant) {
    return <div className="dashboard-error">Restaurant not found</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{restaurant.name} - Tables</h1>
        <div className="header-buttons">
          <button 
            className="action-button"
            onClick={() => console.log('Search button clicked')}
          >
            Search
          </button>
          <button 
            className="action-button blue-button"
            onClick={handleNewReservation}
          >
            New Reservation
          </button>
        </div>
      </div>
      
      {/* Table Grid Section */}
      <div className="tables-container">
        <h2>Floor Plan</h2>
        <p className="tables-info">Click on any table to create a new reservation</p>
        <div className="tables-grid">
          {generateTables()}
        </div>
      </div>
      
      {/* Recent Reservations Section */}
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
                <div className="reservation-actions">
                  <button 
                    className="view-details-btn"
                    onClick={(e) => handleViewReservation(reservation, e)}
                  >
                    View Details
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={(e) => handleEditReservation(reservation, e)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
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
      
      {/* Reservation Form Modal */}
      {showReservationForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New Reservation at {restaurant.name}</h2>
              <button className="close-modal" onClick={handleCloseReservationForm}>×</button>
            </div>
            
            {formError && <div className="form-error">{formError}</div>}
            
            <ReservationForm 
              restaurantId={restaurantId}
              onSubmit={handleCreateReservation}
              onCancel={handleCloseReservationForm}
            />
          </div>
        </div>
      )}
      
      {/* View/Edit Reservation Modal */}
      {viewEditModalOpen && (
        <ReservationModal
          isOpen={viewEditModalOpen}
          onClose={() => setViewEditModalOpen(false)}
          reservationId={selectedReservation?.reservationId}
          restaurantId={selectedReservation?.restaurantId}
          restaurantName={selectedReservation?.restaurantName}
          mode={modalMode}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default RestaurantDashboard; 
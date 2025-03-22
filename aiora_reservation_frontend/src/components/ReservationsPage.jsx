import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/api';
import './ReservationsPage.css';

const ReservationsPage = () => {
  const navigate = useNavigate();
  // State for reservations data
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    restaurantId: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    roomNumber: ''
  });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // State for restaurants dropdown
  const [restaurants, setRestaurants] = useState([]);

  // Load restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetchWithAuth('/restaurants');
        // Filter out the main restaurant (assuming it's restaurant with ID 1)
        const filteredRestaurants = response.filter(restaurant => restaurant.restaurantId !== 1);
        setRestaurants(filteredRestaurants);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
      }
    };
    
    fetchRestaurants();
  }, []);

  // Fetch reservations based on current filters and pagination
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        
        // Build the API endpoint based on filters
        let endpoint = '/reservations';
        const queryParams = [];
        
        // Add restaurant filter if selected
        if (filters.restaurantId) {
          endpoint = `/restaurants/${filters.restaurantId}/reservations`;
        }
        
        // Add date range filter if both dates are selected
        if (filters.dateFrom && filters.dateTo) {
          // Format dates for API
          const formattedDateFrom = new Date(filters.dateFrom).toISOString();
          const formattedDateTo = new Date(filters.dateTo).toISOString();
          
          // Append endpoint for date range
          endpoint += '/date-range';
          queryParams.push(`startDate=${formattedDateFrom}`);
          queryParams.push(`endDate=${formattedDateTo}`);
        }
        
        // Add room number filter if provided
        if (filters.roomNumber) {
          // Use the global endpoint for room filtering
          endpoint = `/reservations/room/${filters.roomNumber}`;
        }
        
        // Add pagination parameters
        queryParams.push(`page=${currentPage}`);
        queryParams.push(`size=${pageSize}`);
        
        // Sort by date descending when no filters are applied
        if (!filters.restaurantId && !filters.dateFrom && !filters.dateTo && !filters.status && !filters.roomNumber) {
          queryParams.push('sort=reservationDate,desc');
        }
        
        // Build the final URL
        let url = endpoint;
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        console.log('Fetching from URL:', url);
        
        // Fetch the data
        const response = await fetchWithAuth(url);
        
        // Handle different response formats (paginated vs. non-paginated)
        if (response.reservations) {
          // Paginated response
          let filteredReservations = response.reservations;
          
          // Apply status filter if selected (client-side filtering)
          if (filters.status) {
            filteredReservations = filteredReservations.filter(
              r => r.reservationStatus === filters.status
            );
          }
          
          setReservations(filteredReservations);
          setTotalPages(response.totalPages || 1);
          setCurrentPage(response.currentPage || 0);
        } else {
          // Non-paginated response
          let filteredReservations = response;
          
          // Apply status filter if selected (client-side filtering)
          if (filters.status) {
            filteredReservations = filteredReservations.filter(
              r => r.reservationStatus === filters.status
            );
          }
          
          // If no filters are applied and the API doesn't provide sorted data,
          // sort reservations by date in descending order (most recent first)
          if (!filters.restaurantId && !filters.dateFrom && !filters.dateTo && !filters.status && !filters.roomNumber) {
            filteredReservations.sort((a, b) => 
              new Date(b.reservationDate) - new Date(a.reservationDate)
            );
          }
          
          setReservations(filteredReservations);
          setTotalPages(1);
          setCurrentPage(0);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load reservations. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [filters, currentPage, pageSize]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset to first page when filters change
    setCurrentPage(0);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      restaurantId: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      roomNumber: ''
    });
    setCurrentPage(0);
  };

  // View reservation details
  const handleViewReservation = (restaurantId, reservationId) => {
    navigate(`/restaurants/${restaurantId}/reservations/${reservationId}`);
  };

  // Edit reservation
  const handleEditReservation = (restaurantId, reservationId) => {
    navigate(`/restaurants/${restaurantId}/reservations/${reservationId}/edit`);
  };

  if (loading && reservations.length === 0) {
    return <div className="loading-message">Loading reservations...</div>;
  }

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h1>Reservations</h1>
      </div>
      
      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="restaurantId">Restaurant</label>
            <select 
              id="restaurantId"
              name="restaurantId"
              value={filters.restaurantId}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Restaurants</option>
              {restaurants.map(restaurant => (
                <option key={restaurant.restaurantId} value={restaurant.restaurantId}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="dateFrom">From Date</label>
            <input 
              type="datetime-local"
              id="dateFrom"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="dateTo">To Date</label>
            <input 
              type="datetime-local"
              id="dateTo"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="roomNumber">Room Number</label>
            <input 
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={filters.roomNumber}
              onChange={handleFilterChange}
              placeholder="Enter room number"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Error display */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Reservations Table */}
      <div className="reservations-table-container">
        {reservations.length > 0 ? (
          <>
            <div className="table-responsive">
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
                  {reservations.map(reservation => (
                    <tr key={reservation.reservationId}>
                      <td>{reservation.reservationId}</td>
                      <td>{reservation.restaurantName}</td>
                      <td>{reservation.guestName}</td>
                      <td>{new Date(reservation.reservationDate).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${reservation.reservationStatus.toLowerCase()}`}>
                          {reservation.reservationStatus}
                        </span>
                      </td>
                      <td>{reservation.guestCount}</td>
                      <td>{reservation.isHotelGuest ? reservation.roomNumber : 'N/A'}</td>
                      <td className="action-buttons">
                        <button 
                          className="view-btn"
                          onClick={() => handleViewReservation(reservation.restaurantId, reservation.reservationId)}
                        >
                          View
                        </button>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditReservation(reservation.restaurantId, reservation.reservationId)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
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
                disabled={currentPage >= totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="no-reservations-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <p>No reservations found</p>
            <span>Try adjusting your filter criteria</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage; 
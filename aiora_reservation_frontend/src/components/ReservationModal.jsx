import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import './ReservationModal.css';

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  reservationId, 
  restaurantId, 
  mode, // 'view', 'edit', or 'create'
  onSubmit,
  restaurantName 
}) => {
  console.log(`ReservationModal opened with mode: ${mode}, reservationId: ${reservationId}`);

  const [formData, setFormData] = useState({
    guestName: '',
    guestCount: 2,
    reservationDate: '',
    isHotelGuest: false,
    roomNumber: '',
    mealDeducted: false,
    userId: 1,
    reservationStatus: 'PENDING'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch reservation data if in edit or view mode
  useEffect(() => {
    if (!isOpen || mode === 'create' || !reservationId || !restaurantId) return;
    
    const fetchReservationData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching reservation data for ID: ${reservationId}`);
        const data = await fetchWithAuth(`/restaurants/${restaurantId}/reservations/${reservationId}`);
        console.log("Received reservation data:", data);
        
        // Format date for input
        const reservationDate = new Date(data.reservationDate);
        const formattedDate = reservationDate.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm
        
        setFormData({
          guestName: data.guestName,
          guestCount: data.guestCount,
          reservationDate: formattedDate,
          isHotelGuest: data.isHotelGuest,
          roomNumber: data.roomNumber || '',
          mealDeducted: data.mealDeducted,
          userId: data.userId,
          reservationStatus: data.reservationStatus
        });
        
        console.log("Form data set with status:", data.reservationStatus);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reservation:', err);
        setError('Failed to load reservation details');
        setLoading(false);
      }
    };
    
    fetchReservationData();
  }, [isOpen, mode, reservationId, restaurantId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (mode === 'view') return; // No edits in view mode
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const handleStatusChange = (status) => {
    if (mode === 'view') return;
    
    console.log(`Changing status from ${formData.reservationStatus} to ${status}`);
    
    setFormData({
      ...formData,
      reservationStatus: status
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.guestName.trim()) {
      errors.guestName = 'Guest name is required';
    }
    
    if (!formData.reservationDate) {
      errors.reservationDate = 'Date and time are required';
    }
    
    if (formData.guestCount < 1) {
      errors.guestCount = 'At least 1 guest is required';
    }
    
    if (formData.isHotelGuest && !formData.roomNumber.trim()) {
      errors.roomNumber = 'Room number is required for hotel guests';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'view') {
      // In view mode, we want to switch to edit mode
      onSubmit(formData, 'view');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    console.log('Submitting form with status:', formData.reservationStatus);
    
    // Ensure we're explicitly including the reservation status
    const submitData = {
      ...formData,
      // Make sure the status is explicitly set 
      reservationStatus: formData.reservationStatus
    };
    
    // Call the onSubmit handler with form data and mode
    onSubmit(submitData, mode);
  };
  
  if (!isOpen) return null;
  
  const getDefaultTime = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1); // Tomorrow
    defaultDate.setHours(18, 0, 0, 0); // 6:00 PM
    return defaultDate.toISOString().slice(0, 16);
  };
  
  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return `New Reservation at ${restaurantName}`;
      case 'edit':
        return `Edit Reservation at ${restaurantName}`;
      case 'view':
        return `Reservation Details at ${restaurantName}`;
      default:
        return 'Reservation';
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">{getModalTitle()}</h2>
        
        {loading ? (
          <div className="modal-loading">Loading reservation details...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="reservation-form">
            {/* Only show status in edit/view mode */}
            {mode !== 'create' && (
              <div className="status-selection">
                <div className="status-label">Reservation Status:</div>
                <div className="status-buttons">
                  <button 
                    type="button"
                    className={`status-btn ${formData.reservationStatus === 'PENDING' ? 'active pending' : ''}`}
                    onClick={() => handleStatusChange('PENDING')}
                    disabled={mode === 'view'}
                  >
                    Pending
                  </button>
                  <button 
                    type="button"
                    className={`status-btn ${formData.reservationStatus === 'CONFIRMED' ? 'active confirmed' : ''}`}
                    onClick={() => handleStatusChange('CONFIRMED')}
                    disabled={mode === 'view'}
                  >
                    Confirmed
                  </button>
                  <button 
                    type="button"
                    className={`status-btn ${formData.reservationStatus === 'CANCELLED' ? 'active cancelled' : ''}`}
                    onClick={() => handleStatusChange('CANCELLED')}
                    disabled={mode === 'view'}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            )}
            
            {/* Guest Name */}
            <div className="form-field">
              <label htmlFor="guestName"></label>
              <input
                type="text"
                id="guestName"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                className={formErrors.guestName ? 'input-error' : ''}
                placeholder={mode === 'view' || formData.guestName ? '' : "Enter guest name"}
                disabled={mode === 'view'}
              />
              {formErrors.guestName && <div className="error-message">{formErrors.guestName}</div>}
            </div>
            
            {/* Party Size */}
            <div className="form-field">
              <label htmlFor="guestCount">Party Size</label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                min="1"
                value={formData.guestCount}
                onChange={handleChange}
                className={formErrors.guestCount ? 'input-error' : ''}
                placeholder={mode === 'view' ? '' : ""}
                disabled={mode === 'view'}
              />
              {formErrors.guestCount && <div className="error-message">{formErrors.guestCount}</div>}
            </div>
            
            {/* Date & Time */}
            <div className="form-field">
              
              <input
                type="datetime-local"
                id="reservationDate"
                name="reservationDate"
                value={formData.reservationDate || getDefaultTime()}
                onChange={handleChange}
                className={formErrors.reservationDate ? 'input-error' : ''}
                placeholder=""
                disabled={mode === 'view'}
              />
              {formErrors.reservationDate && <div className="error-message">{formErrors.reservationDate}</div>}
            </div>
            
            {/* Hotel Guest Toggle */}
            <div className="toggle-section">
              <div className="switch-field">
                <span className="switch-label">Hotel Guest</span>
                <label className="switch">
                  <input 
                    type="checkbox"
                    name="isHotelGuest"
                    checked={formData.isHotelGuest}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              {/* Meal Deducted Toggle */}
              <div className="switch-field">
                <span className="switch-label">Meal Deducted</span>
                <label className="switch">
                  <input 
                    type="checkbox"
                    name="mealDeducted"
                    checked={formData.mealDeducted}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            {/* Room Number (conditional) */}
            {formData.isHotelGuest && (
              <div className="form-field room-number-field">
                <label htmlFor="roomNumber">Room Number</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className={formErrors.roomNumber ? 'input-error' : ''}
                  placeholder="Enter room number"
                  disabled={mode === 'view'}
                />
                {formErrors.roomNumber && <div className="error-message">{formErrors.roomNumber}</div>}
              </div>
            )}
            
            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              {mode === 'view' ? (
                <button type="button" className="edit-btn" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit(formData, 'view');
                }}>
                  Edit
                </button>
              ) : (
                <button type="submit" className="save-btn">
                  {mode === 'create' ? 'Create Reservation' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReservationModal; 
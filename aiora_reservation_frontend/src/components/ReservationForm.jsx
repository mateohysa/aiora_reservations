import React, { useState } from 'react';

const ReservationForm = ({ restaurantId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestCount: 2,
    reservationDate: '',
    isHotelGuest: false,
    roomNumber: '',
    specialRequests: '',
    userId: 1 // Default user ID, you might want to get this from context/store
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when it's changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    
    if (!formData.reservationDate) {
      newErrors.reservationDate = 'Date and time are required';
    }
    
    if (formData.guestCount < 1) {
      newErrors.guestCount = 'Guest count must be at least 1';
    }
    
    if (formData.isHotelGuest && !formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required for hotel guests';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        restaurantId
      });
    }
  };
  
  // Calculate min date-time (now + 30 minutes, rounded to nearest hour/half-hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    now.setMinutes(now.getMinutes() >= 30 ? 30 : 0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };
  
  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <div className="form-group">
        <label>Guest Name</label>
        <input 
          type="text"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          className={errors.guestName ? 'error' : ''}
        />
        {errors.guestName && <div className="error-message">{errors.guestName}</div>}
      </div>
      
      <div className="form-group">
        <label>Number of Guests</label>
        <input 
          type="number"
          name="guestCount"
          min="1"
          max="20"
          value={formData.guestCount}
          onChange={handleChange}
          className={errors.guestCount ? 'error' : ''}
        />
        {errors.guestCount && <div className="error-message">{errors.guestCount}</div>}
      </div>
      
      <div className="form-group">
        <label>Date and Time</label>
        <input 
          type="datetime-local"
          name="reservationDate"
          min={getMinDateTime()}
          value={formData.reservationDate}
          onChange={handleChange}
          className={errors.reservationDate ? 'error' : ''}
        />
        {errors.reservationDate && <div className="error-message">{errors.reservationDate}</div>}
      </div>
      
      <div className="form-group checkbox">
        <label>
          <input 
            type="checkbox"
            name="isHotelGuest"
            checked={formData.isHotelGuest}
            onChange={handleChange}
          />
          Hotel Guest
        </label>
      </div>
      
      {formData.isHotelGuest && (
        <div className="form-group">
          <label>Room Number</label>
          <input 
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className={errors.roomNumber ? 'error' : ''}
          />
          {errors.roomNumber && <div className="error-message">{errors.roomNumber}</div>}
        </div>
      )}
      
      <div className="form-group">
        <label>Special Requests</label>
        <textarea 
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>
      
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Create Reservation
        </button>
      </div>
    </form>
  );
};

export default ReservationForm; 
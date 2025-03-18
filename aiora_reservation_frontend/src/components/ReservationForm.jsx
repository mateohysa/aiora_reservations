import React, { useState } from 'react';
import './ReservationForm.css';

const ReservationForm = ({ restaurantId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestCount: 2,
    reservationDate: '',
    isHotelGuest: false,
    roomNumber: '',
    mealDeducted: false,
    userId: 1 // Default user ID, would typically come from authentication context
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
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
      newErrors.guestName = 'Name is required';
    }
    
    if (!formData.reservationDate) {
      newErrors.reservationDate = 'Date and time are required';
    }
    
    if (formData.guestCount < 1) {
      newErrors.guestCount = 'At least 1 guest required';
    }
    
    if (formData.isHotelGuest && !formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number required for hotel guests';
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
  
  // Calculate min date-time (today at 6pm)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(18, 0, 0, 0); // Set to 6:00 PM
    
    // If it's already past 6pm, set to tomorrow at 6pm
    if (new Date() > now) {
      now.setDate(now.getDate() + 1);
    }
    
    return now.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };
  
  // For default time value, set to 6:00 PM
  const getDefaultTime = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1); // Tomorrow
    defaultDate.setHours(18, 0, 0, 0); // 6:00 PM
    return defaultDate.toISOString().slice(0, 16);
  };
  
  return (
    <form onSubmit={handleSubmit} className="shadcn-form">
      <div className="form-field">
        <label htmlFor="guestName" className="field-label">Guest Name</label>
        <input 
          type="text"
          id="guestName"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          className={errors.guestName ? 'input-error' : ''}
          placeholder="Enter guest name"
        />
        {errors.guestName && <div className="error-message">{errors.guestName}</div>}
      </div>
      
      <div className="form-field">
        <label htmlFor="guestCount" className="field-label">Number of Guests</label>
        <input 
          type="number"
          id="guestCount"
          name="guestCount"
          min="1"
          max="20"
          value={formData.guestCount}
          onChange={handleChange}
          className={errors.guestCount ? 'input-error' : ''}
        />
        {errors.guestCount && <div className="error-message">{errors.guestCount}</div>}
      </div>
      
      <div className="form-field">
        <label htmlFor="reservationDate" className="field-label">Date & Time</label>
        <input 
          type="datetime-local"
          id="reservationDate"
          name="reservationDate"
          min={getMinDateTime()}
          value={formData.reservationDate || getDefaultTime()}
          onChange={handleChange}
          className={`date-picker ${errors.reservationDate ? 'input-error' : ''}`}
        />
        {errors.reservationDate && <div className="error-message">{errors.reservationDate}</div>}
      </div>
      
      <div className="toggle-section">
        <div className="switch-field">
          <span className="switch-label">Hotel Guest</span>
          <label className="switch">
            <input 
              type="checkbox"
              name="isHotelGuest"
              checked={formData.isHotelGuest}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="switch-field">
          <span className="switch-label">Meal Deducted</span>
          <label className="switch">
            <input 
              type="checkbox"
              name="mealDeducted"
              checked={formData.mealDeducted}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      {formData.isHotelGuest && (
        <div className="form-field room-number-field">
          <label htmlFor="roomNumber" className="field-label">Room Number</label>
          <input 
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className={errors.roomNumber ? 'input-error' : ''}
            placeholder="Enter room number"
          />
          {errors.roomNumber && <div className="error-message">{errors.roomNumber}</div>}
        </div>
      )}
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary blue-button">
          Create Reservation
        </button>
      </div>
    </form>
  );
};

export default ReservationForm; 
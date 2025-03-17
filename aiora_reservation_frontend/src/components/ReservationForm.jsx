import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="modern-form">
      <div className="form-field">
        <input 
          type="text"
          id="guestName"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          className={errors.guestName ? 'error' : ''}
          placeholder=" "
          required
        />
        <label htmlFor="guestName">Guest Name</label>
        {errors.guestName && <div className="field-error">{errors.guestName}</div>}
      </div>
      
      <div className="form-group">
        <div className="form-field half-width">
          <input 
            type="number"
            id="guestCount"
            name="guestCount"
            min="1"
            max="20"
            value={formData.guestCount}
            onChange={handleChange}
            className={errors.guestCount ? 'error' : ''}
            placeholder=" "
            required
          />
          <label htmlFor="guestCount">Guest Count</label>
          {errors.guestCount && <div className="field-error">{errors.guestCount}</div>}
        </div>
        
        <div className="form-field half-width">
          <input 
            type="datetime-local"
            id="reservationDate"
            name="reservationDate"
            min={getMinDateTime()}
            value={formData.reservationDate}
            onChange={handleChange}
            className={errors.reservationDate ? 'error' : ''}
            required
          />
          <label htmlFor="reservationDate" className="active">Date & Time</label>
          {errors.reservationDate && <div className="field-error">{errors.reservationDate}</div>}
        </div>
      </div>
      
      <div className="form-toggles">
        <div className="toggle-field">
          <label className="toggle">
            <input 
              type="checkbox"
              name="isHotelGuest"
              checked={formData.isHotelGuest}
              onChange={handleChange}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Hotel Guest</span>
          </label>
        </div>
        
        <div className="toggle-field">
          <label className="toggle">
            <input 
              type="checkbox"
              name="mealDeducted"
              checked={formData.mealDeducted}
              onChange={handleChange}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Meal Deducted</span>
          </label>
        </div>
      </div>
      
      {formData.isHotelGuest && (
        <div className="form-field">
          <input 
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className={errors.roomNumber ? 'error' : ''}
            placeholder=" "
          />
          <label htmlFor="roomNumber">Room Number</label>
          {errors.roomNumber && <div className="field-error">{errors.roomNumber}</div>}
        </div>
      )}
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          Confirm Reservation
        </button>
      </div>
    </form>
  );
};

export default ReservationForm; 
import React, { useState, useEffect, useRef } from 'react';
import { fetchWithAuth } from '../services/api';
import './SpotlightSearch.css';

const SpotlightSearch = ({ isOpen, onClose, onSelectReservation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  const performSearch = async (query) => {
    setIsLoading(true);
    try {
      // Call the API endpoint with encodeURIComponent to handle special characters
      const results = await fetchWithAuth(`/reservations/search?query=${encodeURIComponent(query)}`);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (reservation) => {
    if (onSelectReservation) {
      onSelectReservation(reservation);
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="spotlight-backdrop">
      <div className="spotlight-container" ref={searchRef}>
        <div className="spotlight-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search reservations, guests, room numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="spotlight-input"
            autoFocus
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="spotlight-loading">
            <div className="spinner"></div>
            <span>Searching...</span>
          </div>
        )}
        
        {!isLoading && searchResults.length > 0 && (
          <div className="spotlight-results">
            <div className="results-section">
              <h3>Reservations</h3>
              {searchResults.map(result => (
                <div 
                  key={result.reservationId} 
                  className="result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-icon">
                    {result.reservationStatus === 'CONFIRMED' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="20" height="20">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9800" width="20" height="20">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                    )}
                  </div>
                  <div className="result-content">
                    <div className="result-title">{result.guestName}</div>
                    <div className="result-details">
                      <span>{result.restaurantName}</span>
                      <span>•</span>
                      <span>{new Date(result.reservationDate).toLocaleString()}</span>
                      {result.roomNumber && (
                        <>
                          <span>•</span>
                          <span>Room {result.roomNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="result-status">
                    <span className={`status-badge ${result.reservationStatus.toLowerCase()}`}>
                      {result.reservationStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
          <div className="no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotlightSearch;
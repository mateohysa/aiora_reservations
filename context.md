# Restaurant-Specific Dashboard Design

## Restaurant Dashboard Overview

The restaurant-specific dashboard will have three main sections:

1. **Header Section**: Restaurant name with "Tables" label
2. **Tables Grid**: Visual representation of tables in the restaurant
3. **Recent Reservations**: List of reservations specific to that restaurant

## Required Components

### 1. New React Components

- `RestaurantDashboard.jsx`: The main component for the restaurant-specific dashboard
- `TableGrid.jsx`: Component to display the grid of tables
- `TableItem.jsx`: Individual table component with status indicators
- `ReservationForm.jsx`: Modal form for creating new reservations
- `RestaurantReservationsList.jsx`: List of reservations for the specific restaurant

### 2. New Route

We'll need to add a new route in `App.jsx`:

```jsx
<Route 
  path="/restaurants/:restaurantId/dashboard" 
  element={
    <ProtectedRoute>
      <RestaurantDashboard />
    </ProtectedRoute>
  } 
/>
```

### 3. CSS Classes

Building on your existing Dashboard CSS, we'll need:

- Table grid layout classes
- Table item styling for different states (available, reserved, selected)
- Modal styling for the reservation form
- Responsive adjustments for the table layout

### 4. API Endpoints

From what I can see, you already have most of the needed API endpoints:

- Restaurant details: `GET /restaurants/:restaurantId`
- Recent reservations: `GET /restaurants/:restaurantId/reservations/recent`
- Create reservation: `POST /restaurants/:restaurantId/reservations`

We might need additional endpoints for:
- Table data: `GET /restaurants/:restaurantId/tables` (if you want to represent actual tables)
- Table availability: `GET /restaurants/:restaurantId/availability` (to show which tables are available)

## TableGrid Component Design

The TableGrid will be a key new component. Here's how it could be structured:

```jsx
<div className="tables-container">
  <div className="tables-header">
    <h2>{restaurantName} - Tables</h2>
    <button className="new-reservation-btn">New Reservation</button>
  </div>
  
  <div className="tables-grid">
    {tables.map(table => (
      <TableItem
        key={table.id}
        table={table}
        onClick={() => handleTableClick(table)}
      />
    ))}
  </div>
</div>
```

Each `TableItem` could represent a table with:
- Table number
- Status indicator (available, reserved, etc.)
- Capacity information
- Visual styling to indicate status

## Data Flow

1. `RestaurantDashboard` loads restaurant data and passes to child components
2. Clicking a table or the "New Reservation" button opens the reservation form modal
3. Submitting the form creates a new reservation and updates the UI
4. Recent reservations are loaded and displayed in a list

## Implementation Considerations

1. **Table Representation**: Since you mentioned you're not tracking specific table numbers for reservations, we could:
   - Create virtual tables (e.g., 20 tables of varying sizes)
   - Show them as available/unavailable based on total reservations and capacity
   - Use them as a visual way to initiate the reservation process

2. **State Management**: Consider using React Context or a state management library if the state gets complex

3. **Responsive Design**: The table grid should adapt to different screen sizes

-- Sample Users
INSERT INTO users (username, email, password, first_name, last_name, user_role) VALUES
('john_doe', 'john@example.com', 'hashedpassword123', 'John', 'Doe', 'GUEST'),
('jane_smith', 'jane@example.com', 'hashedpassword456', 'Jane', 'Smith', 'GUEST'),
('admin_user', 'admin@aiora.com', 'hashedpassword789', 'Admin', 'User', 'ADMIN'),
('receptionist1', 'reception@aiora.com', 'hashedpassword101', 'Front', 'Desk', 'RECEPTIONIST');

-- Sample Restaurants
INSERT INTO restaurants (name, restaurant_type, default_capacity, max_capacity, location, description) VALUES
('The Grand Dining', 'FINE_DINING', 50, 75, 'Main Building, 1st Floor', 'Elegant fine dining experience'),
('Casual Corner', 'CASUAL', 30, 40, 'East Wing, Ground Floor', 'Relaxed casual dining'),
('Sunset Lounge', 'LOUNGE', 25, 35, 'West Wing, Top Floor', 'Scenic rooftop dining');

-- Sample Reservations
INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_status, reservation_type, meal_deducted, payment_amount, room_number) VALUES
(1, 1, '2024-03-20 19:00:00', 'CONFIRMED', 'HOTEL_GUEST', true, 150.00, 'A101'),
(2, 2, '2024-03-21 18:30:00', 'PENDING', 'EXTERNAL_GUEST', false, 75.00, null),
(1, 3, '2024-03-22 20:00:00', 'CONFIRMED', 'HOTEL_GUEST', false, 100.00, 'B205');

-- Sample Users (simplified for internal staff)
INSERT INTO users (username, password, first_name, last_name) VALUES
('john_staff', 'hashedpassword123', 'John', 'Smith'),
('mary_host', 'hashedpassword456', 'Mary', 'Johnson'),
('tom_manager', 'hashedpassword789', 'Tom', 'Wilson');

-- Sample Restaurants
INSERT INTO restaurants (name, restaurant_type, default_capacity, max_capacity, location, description) VALUES
('Main Restaurant', 'ROOM_ONLY', 60, 80, 'Main Building, Ground Floor', 'Hotel''s primary restaurant'),
('Poolside Cafe', 'MIXED', 40, 50, 'Pool Area', 'Casual dining by the pool');

-- Sample Reservations
INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_status, payment_amount, room_number) VALUES
(1, 1, '2024-03-20 19:00:00', 'CONFIRMED', 200.00, 'A101'),
(2, 2, '2024-03-20 18:30:00', 'CONFIRMED', 150.00, 'B202'),
(3, 1, '2024-03-21 20:00:00', 'PENDING', 180.00, 'C303');
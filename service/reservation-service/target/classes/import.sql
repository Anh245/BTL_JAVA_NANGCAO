-- Seed data for Restaurant Tables
-- Window Tables (3 tables, 2-4 guests)
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (1, 'W1 - City View', 'window', 2, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (2, 'W2 - Garden View', 'window', 4, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (3, 'W3 - Sunset Corner', 'window', 2, true);

-- VIP Room Tables (3 tables, 4-8 guests)
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (4, 'VIP1 - Ruby Room', 'vip_room', 6, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (5, 'VIP2 - Sapphire Room', 'vip_room', 8, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (6, 'VIP3 - Emerald Room', 'vip_room', 4, true);

-- Terrace Tables (4 tables, 2-6 guests)
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (7, 'T1 - Starlight', 'terrace', 2, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (8, 'T2 - Moonrise', 'terrace', 4, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (9, 'T3 - Breeze', 'terrace', 6, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (10, 'T4 - Twilight', 'terrace', 2, true);

-- Main Hall Tables (5 tables, 2-6 guests)
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (11, 'M1 - Orchestra', 'main_hall', 4, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (12, 'M2 - Fountain', 'main_hall', 6, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (13, 'M3 - Chandelier', 'main_hall', 2, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (14, 'M4 - Gallery', 'main_hall', 4, true);
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (15, 'M5 - Atrium', 'main_hall', 6, true);

-- Private Dining (1 large table, 6-12 guests)
INSERT INTO restaurant_table (id, label, zone, capacity, is_available) VALUES (16, 'PD1 - Grand Private', 'private_dining', 12, true);

-- Reset sequence
ALTER SEQUENCE restaurant_table_seq RESTART WITH 17;

-- Sample Guests
INSERT INTO guest (id, name, email, phone, notes, created_date) VALUES (1, 'Nguyen Van A', 'nguyenvana@gmail.com', '0901234567', 'Regular customer', NOW());
INSERT INTO guest (id, name, email, phone, notes, created_date) VALUES (2, 'Tran Thi B', 'tranthib@gmail.com', '0912345678', 'Prefers window seat', NOW());
INSERT INTO guest (id, name, email, phone, notes, created_date) VALUES (3, 'Le Van C', 'levanc@gmail.com', '0923456789', NULL, NOW());

ALTER SEQUENCE guest_seq RESTART WITH 4;

-- Sample Reservations
INSERT INTO reservation (id, guest_id, table_id, reservation_date, reservation_time, party_size, occasion, special_requests, status, created_date) VALUES (1, 1, 1, '2026-05-20', '19:00', 2, 'anniversary', 'Candle on table please', 'confirmed', NOW());
INSERT INTO reservation (id, guest_id, table_id, reservation_date, reservation_time, party_size, occasion, special_requests, status, created_date) VALUES (2, 2, 4, '2026-05-20', '20:00', 4, 'birthday', 'Birthday cake at 21:00', 'pending', NOW());
INSERT INTO reservation (id, guest_id, table_id, reservation_date, reservation_time, party_size, occasion, special_requests, status, created_date) VALUES (3, 3, 11, '2026-05-21', '18:30', 6, 'business', NULL, 'confirmed', NOW());
INSERT INTO reservation (id, guest_id, table_id, reservation_date, reservation_time, party_size, occasion, special_requests, status, created_date) VALUES (4, 1, 7, '2026-05-22', '19:30', 2, 'none', NULL, 'pending', NOW());
INSERT INTO reservation (id, guest_id, table_id, reservation_date, reservation_time, party_size, occasion, special_requests, status, created_date) VALUES (5, 2, 12, '2026-05-22', '20:30', 3, 'none', 'Vegetarian menu', 'cancelled', NOW());

ALTER SEQUENCE reservation_seq RESTART WITH 6;

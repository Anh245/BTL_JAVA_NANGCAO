-- Seed admin user
-- Password: admin123 (SHA-256 hashed)
INSERT INTO app_user (id, email, full_name, role, password_hash, created_by, created_on, updated_on)
VALUES (1, 'admin@aurelian.com', 'Admin Aurelian', 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'system', CURRENT_DATE, CURRENT_DATE);

ALTER SEQUENCE app_user_seq RESTART WITH 2;
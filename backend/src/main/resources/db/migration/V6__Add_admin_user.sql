-- V6__Add_admin_user.sql
-- Add ADMIN role and create admin user

-- H2 Database: Drop and recreate the role constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_chk_1;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS constraint_4d4;

-- Add new CHECK constraint that includes ADMIN role
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('PATIENT', 'DOCTOR', 'ADMIN'));

-- Insert admin user
-- Email: admin@healthatlas.com
-- Password: Admin123! (BCrypt hash - same as Password123! for testing)
INSERT INTO users (email, password, role, is_active) VALUES
('admin@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'ADMIN', true);

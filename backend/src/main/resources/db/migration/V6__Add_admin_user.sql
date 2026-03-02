-- V6__Add_admin_user.sql
-- Create admin user (ADMIN role already in V1)

-- Insert admin user
-- Email: admin@healthatlas.com
-- Password: Admin123! (BCrypt hash)
INSERT INTO users (email, password, role, is_active) VALUES
('admin@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'ADMIN', true);

-- V7__Add_multiple_admin_users.sql
-- Add 4 additional admin users: Sanjay, Thanishq, Vamshi, Srinidhi

-- Insert admin users
-- All passwords are: Password123! (BCrypt hash)
INSERT INTO users (email, password, role, is_active) VALUES
('sanjay.admin@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'ADMIN', true),
('thanishq.admin@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'ADMIN', true),
('vamshi.admin@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'ADMIN', true),
('srinidhi.admin@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'ADMIN', true);

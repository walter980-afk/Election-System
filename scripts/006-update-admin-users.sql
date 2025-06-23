-- Clear existing admin users and update schema
DELETE FROM admin_users;

-- Add role column if it doesn't exist
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions TEXT[];

-- Insert new admin users with different roles
INSERT INTO admin_users (username, password_hash, role, full_name, permissions) VALUES
-- Super Admin (full access)
('sinclairesebastian', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'super_admin', 'Sinclair Sebastian', ARRAY['all']),

-- Chairperson Electoral Commission (results viewing + some management)
('chairperson', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'chairperson', 'Chairperson Electoral Commission', ARRAY['view_results', 'view_analytics', 'generate_reports']),

-- Headteacher (results viewing only)
('headteacher', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'headteacher', 'Head Teacher', ARRAY['view_results', 'view_analytics']);

-- Note: All passwords are set to 'admin123' for demo purposes

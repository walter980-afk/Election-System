-- Insert sample election
INSERT INTO elections (title, description, start_date, end_date, is_active) VALUES
('2024 Student Government Election', 'Annual student government election for all positions', NOW(), NOW() + INTERVAL '7 days', true);

-- Get the election ID for reference
DO $$
DECLARE
    election_uuid UUID;
    president_post_uuid UUID;
    vp_post_uuid UUID;
    secretary_post_uuid UUID;
BEGIN
    SELECT id INTO election_uuid FROM elections WHERE title = '2024 Student Government Election';
    
    -- Insert posts
    INSERT INTO posts (election_id, title, description, order_index) VALUES
    (election_uuid, 'President', 'Student Government President', 1),
    (election_uuid, 'Vice President', 'Student Government Vice President', 2),
    (election_uuid, 'Secretary', 'Student Government Secretary', 3);
    
    -- Get post IDs
    SELECT id INTO president_post_uuid FROM posts WHERE title = 'President' AND election_id = election_uuid;
    SELECT id INTO vp_post_uuid FROM posts WHERE title = 'Vice President' AND election_id = election_uuid;
    SELECT id INTO secretary_post_uuid FROM posts WHERE title = 'Secretary' AND election_id = election_uuid;
    
    -- Insert candidates
    INSERT INTO candidates (post_id, name, party, bio) VALUES
    (president_post_uuid, 'John Smith', 'Progressive Party', 'Experienced leader with vision for change'),
    (president_post_uuid, 'Sarah Johnson', 'Unity Party', 'Bringing students together for a better tomorrow'),
    (vp_post_uuid, 'Mike Davis', 'Progressive Party', 'Supporting innovation and student rights'),
    (vp_post_uuid, 'Lisa Chen', 'Unity Party', 'Dedicated to student welfare and academic excellence'),
    (secretary_post_uuid, 'Alex Rodriguez', 'Independent', 'Organized and detail-oriented leader'),
    (secretary_post_uuid, 'Emma Wilson', 'Progressive Party', 'Committed to transparency and communication');
    
    -- Insert sample voters
    INSERT INTO voters (voter_id, name, email) VALUES
    ('V001', 'Alice Brown', 'alice@example.com'),
    ('V002', 'Bob Green', 'bob@example.com'),
    ('V003', 'Carol White', 'carol@example.com'),
    ('V004', 'David Black', 'david@example.com'),
    ('V005', 'Eva Gray', 'eva@example.com');
    
    -- Insert admin user (password: admin123)
    INSERT INTO admin_users (username, password_hash) VALUES
    ('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq');
END $$;

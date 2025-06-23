-- Insert prefectorial election positions
DO $$
DECLARE
    election_uuid UUID;
BEGIN
    SELECT id INTO election_uuid FROM elections WHERE title = '2024 Student Government Election';
    
    -- Update election title
    UPDATE elections SET 
        title = '2024 Prefectorial Elections',
        description = 'Annual prefectorial elections for all leadership positions'
    WHERE id = election_uuid;
    
    -- Insert prefectorial positions
    INSERT INTO posts (election_id, title, description, category, order_index) VALUES
    -- Senior Leadership
    (election_uuid, 'Head Prefect', 'Overall student leadership and coordination', 'Senior Leadership', 1),
    (election_uuid, 'Head Boy', 'Male student leadership representative', 'Senior Leadership', 2),
    (election_uuid, 'Head Girl', 'Female student leadership representative', 'Senior Leadership', 3),
    
    -- Entertainment
    (election_uuid, 'Entertainment Prefect', 'Organizing school events and activities', 'Entertainment', 4),
    (election_uuid, 'Assistant Entertainment Prefect', 'Supporting entertainment activities', 'Entertainment', 5),
    
    -- Uniform
    (election_uuid, 'Uniform Prefect', 'Maintaining school dress code standards', 'Uniform', 6),
    (election_uuid, 'Assistant Uniform Prefect', 'Supporting uniform compliance', 'Uniform', 7),
    
    -- Mess/Dining
    (election_uuid, 'Mess Prefect', 'Overseeing dining hall operations', 'Mess', 8),
    (election_uuid, 'Assistant Mess Prefect (O-Level Boy)', 'Supporting mess operations - O-Level male students', 'Mess', 9),
    (election_uuid, 'Assistant Mess Prefect (O-Level Girl)', 'Supporting mess operations - O-Level female students', 'Mess', 10),
    (election_uuid, 'Assistant Mess Prefect (A-Level Boy)', 'Supporting mess operations - A-Level male students', 'Mess', 11),
    (election_uuid, 'Assistant Mess Prefect (A-Level Girl)', 'Supporting mess operations - A-Level female students', 'Mess', 12),
    
    -- Information
    (election_uuid, 'Information Prefect', 'Managing school communications and announcements', 'Information', 13),
    (election_uuid, 'Assistant Information Prefect', 'Supporting information dissemination', 'Information', 14),
    
    -- Games and Sports
    (election_uuid, 'Games and Sports Prefect', 'Organizing sports activities and competitions', 'Games and Sports', 15),
    (election_uuid, 'Assistant Games and Sports Prefect', 'Supporting sports programs', 'Games and Sports', 16);
END $$;

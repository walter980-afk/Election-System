-- Insert sample candidates for prefectorial positions
DO $$
DECLARE
    head_prefect_uuid UUID;
    head_boy_uuid UUID;
    head_girl_uuid UUID;
    entertainment_uuid UUID;
    asst_entertainment_uuid UUID;
    uniform_uuid UUID;
    asst_uniform_uuid UUID;
    mess_uuid UUID;
    asst_mess_ol_boy_uuid UUID;
    asst_mess_ol_girl_uuid UUID;
    asst_mess_al_boy_uuid UUID;
    asst_mess_al_girl_uuid UUID;
    information_uuid UUID;
    asst_information_uuid UUID;
    games_uuid UUID;
    asst_games_uuid UUID;
BEGIN
    -- Get post IDs
    SELECT id INTO head_prefect_uuid FROM posts WHERE title = 'Head Prefect';
    SELECT id INTO head_boy_uuid FROM posts WHERE title = 'Head Boy';
    SELECT id INTO head_girl_uuid FROM posts WHERE title = 'Head Girl';
    SELECT id INTO entertainment_uuid FROM posts WHERE title = 'Entertainment Prefect';
    SELECT id INTO asst_entertainment_uuid FROM posts WHERE title = 'Assistant Entertainment Prefect';
    SELECT id INTO uniform_uuid FROM posts WHERE title = 'Uniform Prefect';
    SELECT id INTO asst_uniform_uuid FROM posts WHERE title = 'Assistant Uniform Prefect';
    SELECT id INTO mess_uuid FROM posts WHERE title = 'Mess Prefect';
    SELECT id INTO asst_mess_ol_boy_uuid FROM posts WHERE title = 'Assistant Mess Prefect (O-Level Boy)';
    SELECT id INTO asst_mess_ol_girl_uuid FROM posts WHERE title = 'Assistant Mess Prefect (O-Level Girl)';
    SELECT id INTO asst_mess_al_boy_uuid FROM posts WHERE title = 'Assistant Mess Prefect (A-Level Boy)';
    SELECT id INTO asst_mess_al_girl_uuid FROM posts WHERE title = 'Assistant Mess Prefect (A-Level Girl)';
    SELECT id INTO information_uuid FROM posts WHERE title = 'Information Prefect';
    SELECT id INTO asst_information_uuid FROM posts WHERE title = 'Assistant Information Prefect';
    SELECT id INTO games_uuid FROM posts WHERE title = 'Games and Sports Prefect';
    SELECT id INTO asst_games_uuid FROM posts WHERE title = 'Assistant Games and Sports Prefect';
    
    -- Insert candidates
    INSERT INTO candidates (post_id, name, gender) VALUES
    -- Head Prefect
    (head_prefect_uuid, 'Alexander Thompson', 'Male'),
    (head_prefect_uuid, 'Sarah Mitchell', 'Female'),
    (head_prefect_uuid, 'David Chen', 'Male'),
    
    -- Head Boy
    (head_boy_uuid, 'James Wilson', 'Male'),
    (head_boy_uuid, 'Michael Brown', 'Male'),
    
    -- Head Girl
    (head_girl_uuid, 'Emma Johnson', 'Female'),
    (head_girl_uuid, 'Olivia Davis', 'Female'),
    
    -- Entertainment Prefect
    (entertainment_uuid, 'Lucas Martinez', 'Male'),
    (entertainment_uuid, 'Sophia Garcia', 'Female'),
    (entertainment_uuid, 'Ryan Taylor', 'Male'),
    
    -- Assistant Entertainment Prefect
    (asst_entertainment_uuid, 'Isabella Rodriguez', 'Female'),
    (asst_entertainment_uuid, 'Noah Anderson', 'Male'),
    
    -- Uniform Prefect
    (uniform_uuid, 'Ethan White', 'Male'),
    (uniform_uuid, 'Ava Thomas', 'Female'),
    
    -- Assistant Uniform Prefect
    (asst_uniform_uuid, 'Mason Jackson', 'Male'),
    (asst_uniform_uuid, 'Mia Harris', 'Female'),
    
    -- Mess Prefect
    (mess_uuid, 'William Clark', 'Male'),
    (mess_uuid, 'Charlotte Lewis', 'Female'),
    
    -- Assistant Mess Prefects
    (asst_mess_ol_boy_uuid, 'Benjamin Walker', 'Male'),
    (asst_mess_ol_boy_uuid, 'Jacob Hall', 'Male'),
    
    (asst_mess_ol_girl_uuid, 'Amelia Young', 'Female'),
    (asst_mess_ol_girl_uuid, 'Harper King', 'Female'),
    
    (asst_mess_al_boy_uuid, 'Daniel Wright', 'Male'),
    (asst_mess_al_boy_uuid, 'Matthew Lopez', 'Male'),
    
    (asst_mess_al_girl_uuid, 'Evelyn Hill', 'Female'),
    (asst_mess_al_girl_uuid, 'Abigail Green', 'Female'),
    
    -- Information Prefect
    (information_uuid, 'Henry Adams', 'Male'),
    (information_uuid, 'Grace Baker', 'Female'),
    
    -- Assistant Information Prefect
    (asst_information_uuid, 'Samuel Nelson', 'Male'),
    (asst_information_uuid, 'Chloe Carter', 'Female'),
    
    -- Games and Sports Prefect
    (games_uuid, 'Jack Mitchell', 'Male'),
    (games_uuid, 'Lily Roberts', 'Female'),
    
    -- Assistant Games and Sports Prefect
    (asst_games_uuid, 'Owen Turner', 'Male'),
    (asst_games_uuid, 'Zoe Phillips', 'Female');
END $$;

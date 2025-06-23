-- Remove party and bio columns from candidates table
ALTER TABLE candidates DROP COLUMN IF EXISTS party;
ALTER TABLE candidates DROP COLUMN IF EXISTS bio;
ALTER TABLE candidates DROP COLUMN IF EXISTS image_url;

-- Add gender column to candidates for gender-specific positions
ALTER TABLE candidates ADD COLUMN gender VARCHAR(10);

-- Add category column to posts for grouping positions
ALTER TABLE posts ADD COLUMN category VARCHAR(100);

-- Clear existing data to start fresh
DELETE FROM votes;
DELETE FROM candidates;
DELETE FROM posts;
UPDATE voters SET has_voted = false, voted_at = null;

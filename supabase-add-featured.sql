-- Add is_featured column to listings table
ALTER TABLE listings 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX idx_listings_is_featured ON listings(is_featured);

-- Update RLS policies to allow reading featured status
-- (No changes needed as existing policies already allow reading all columns)

-- Example: Mark some listings as featured
-- UPDATE listings SET is_featured = true WHERE id = 'some-uuid';

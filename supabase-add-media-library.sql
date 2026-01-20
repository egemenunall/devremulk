-- Create media_library table for reusable images
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX idx_media_library_created_at ON media_library(created_at DESC);

-- Enable RLS
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read media
CREATE POLICY "Anyone can view media"
  ON media_library FOR SELECT
  TO PUBLIC
  USING (true);

-- Only authenticated users can insert (admin will use service role)
CREATE POLICY "Service role can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can delete (admin will use service role)
CREATE POLICY "Service role can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (true);

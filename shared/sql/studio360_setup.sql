-- ==============================================================================
-- WeDRIVE - Studio 360 AI Database Setup
-- Run this script in the Supabase SQL Editor
-- ==============================================================================

-- 1. Create the storage bucket for 360 frames
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-360-frames', 'car-360-frames', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Storage Policies for 'car-360-frames'
-- Allow public read access to all frames
CREATE POLICY "Public Access for 360 Frames" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'car-360-frames');

-- Allow authenticated users to upload and update frames
CREATE POLICY "Auth Upload for 360 Frames" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'car-360-frames' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Update for 360 Frames" 
ON storage.objects FOR UPDATE 
WITH CHECK (bucket_id = 'car-360-frames' AND auth.role() = 'authenticated');

-- 3. Add column to cars table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cars' AND column_name='exterior_frames') THEN
        ALTER TABLE public.cars ADD COLUMN exterior_frames JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cars' AND column_name='has_360') THEN
        ALTER TABLE public.cars ADD COLUMN has_360 BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Done!

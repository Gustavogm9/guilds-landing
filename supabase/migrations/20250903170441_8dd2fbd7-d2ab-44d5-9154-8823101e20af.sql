-- Add new fields to team_members table for curriculum functionality
ALTER TABLE public.team_members 
ADD COLUMN curriculum_slug text UNIQUE,
ADD COLUMN curriculum_content text,
ADD COLUMN curriculum_is_public boolean NOT NULL DEFAULT false;

-- Create index on curriculum_slug for better performance
CREATE INDEX idx_team_members_curriculum_slug ON public.team_members(curriculum_slug) WHERE curriculum_slug IS NOT NULL;

-- Update RLS policies to allow public access to curriculum when public
CREATE POLICY "Public curriculum access" 
ON public.team_members 
FOR SELECT 
USING (
  is_active = true AND 
  curriculum_is_public = true AND 
  curriculum_slug IS NOT NULL
);
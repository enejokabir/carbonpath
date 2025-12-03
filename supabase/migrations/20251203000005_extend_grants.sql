-- Migration: Extend Grants Table
-- Add additional fields for better grant management

-- Add new columns to grants table
ALTER TABLE public.grants
  ADD COLUMN amount_description TEXT,
  ADD COLUMN grant_type TEXT,
  ADD COLUMN sectors TEXT[] DEFAULT '{}',
  ADD COLUMN deadline TEXT,
  ADD COLUMN whats_covered TEXT[] DEFAULT '{}',
  ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Create index for active grants
CREATE INDEX idx_grants_active ON public.grants(is_active);

-- Update RLS policy to only show active grants
DROP POLICY IF EXISTS "Authenticated users can view grants" ON public.grants;
CREATE POLICY "Users can view active grants"
  ON public.grants FOR SELECT
  TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

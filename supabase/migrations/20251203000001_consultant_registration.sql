-- Migration: Extend Consultants for Self-Registration
-- Adds status tracking, user linking, and additional profile fields

-- Add consultant status enum
CREATE TYPE public.consultant_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Add consultant role to app_role enum
ALTER TYPE public.app_role ADD VALUE 'consultant';

-- Extend consultants table with new columns
ALTER TABLE public.consultants
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN status consultant_status NOT NULL DEFAULT 'pending',
  ADD COLUMN verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN company_website TEXT,
  ADD COLUMN years_experience INTEGER,
  ADD COLUMN certifications TEXT[] DEFAULT '{}',
  ADD COLUMN portfolio_url TEXT,
  ADD COLUMN fee_type TEXT,
  ADD COLUMN rejection_reason TEXT,
  ADD COLUMN approved_at TIMESTAMPTZ,
  ADD COLUMN approved_by UUID REFERENCES auth.users(id);

-- Create indexes for common queries
CREATE INDEX idx_consultants_status ON public.consultants(status);
CREATE INDEX idx_consultants_user_id ON public.consultants(user_id);

-- Update RLS policy to allow consultants to manage their own profile
CREATE POLICY "Consultants can view and update their own profile"
  ON public.consultants FOR ALL
  USING (user_id = auth.uid());

-- Update existing policy to only show approved consultants to regular users
DROP POLICY IF EXISTS "Authenticated users can view consultants" ON public.consultants;
CREATE POLICY "Users can view approved consultants"
  ON public.consultants FOR SELECT
  TO authenticated
  USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at on consultants (if not exists)
DROP TRIGGER IF EXISTS update_consultants_updated_at ON public.consultants;
CREATE TRIGGER update_consultants_updated_at
  BEFORE UPDATE ON public.consultants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

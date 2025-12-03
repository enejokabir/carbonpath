-- Migration: Subsidies Table
-- Stores government subsidies, tax relief, and other financial support schemes

-- Create subsidy type enum
CREATE TYPE public.subsidy_type AS ENUM ('tax_relief', 'rate_reduction', 'loan', 'voucher', 'rebate', 'other');

-- Create subsidies table
CREATE TABLE public.subsidies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  subsidy_type subsidy_type NOT NULL,
  eligibility_text TEXT NOT NULL,
  business_types public.business_type[] NOT NULL DEFAULT '{}',
  location_scope TEXT[] NOT NULL DEFAULT '{}',
  min_employees INTEGER,
  max_employees INTEGER,
  value_description TEXT,
  application_link TEXT,
  deadline DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subsidies_type ON public.subsidies(subsidy_type);
CREATE INDEX idx_subsidies_active ON public.subsidies(is_active);

-- Enable Row Level Security
ALTER TABLE public.subsidies ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Authenticated users can view active subsidies
CREATE POLICY "Users can view active subsidies"
  ON public.subsidies FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can manage all subsidies
CREATE POLICY "Admins can manage subsidies"
  ON public.subsidies FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_subsidies_updated_at
  BEFORE UPDATE ON public.subsidies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

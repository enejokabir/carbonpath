-- Calculator Leads Table
-- Stores lead information captured before users start the carbon calculator

CREATE TABLE IF NOT EXISTS public.calculator_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  postcode TEXT NOT NULL,
  company_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_calculator_leads_email ON public.calculator_leads(email);

-- Create index on created_at for analytics
CREATE INDEX IF NOT EXISTS idx_calculator_leads_created_at ON public.calculator_leads(created_at);

-- Enable RLS
ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for lead capture)
CREATE POLICY "Anyone can insert leads" ON public.calculator_leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view all leads
CREATE POLICY "Admins can view all leads" ON public.calculator_leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Users can view their own leads (by email match after signup)
CREATE POLICY "Users can view own leads" ON public.calculator_leads
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Admins can update leads
CREATE POLICY "Admins can update leads" ON public.calculator_leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Add comment
COMMENT ON TABLE public.calculator_leads IS 'Stores lead information captured before carbon calculator usage';

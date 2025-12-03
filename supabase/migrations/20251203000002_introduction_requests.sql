-- Migration: Introduction Requests Table
-- Stores requests from SMEs to connect with consultants

-- Create status enum for introduction requests
CREATE TYPE public.intro_request_status AS ENUM ('pending', 'viewed', 'responded', 'declined');

-- Create introduction_requests table
CREATE TABLE public.introduction_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status intro_request_status NOT NULL DEFAULT 'pending',
  consultant_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_intro_requests_user_id ON public.introduction_requests(user_id);
CREATE INDEX idx_intro_requests_consultant_id ON public.introduction_requests(consultant_id);
CREATE INDEX idx_intro_requests_status ON public.introduction_requests(status);

-- Enable Row Level Security
ALTER TABLE public.introduction_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own requests
CREATE POLICY "Users can view their own intro requests"
  ON public.introduction_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Consultants can view requests sent to them
CREATE POLICY "Consultants can view requests for them"
  ON public.introduction_requests FOR SELECT
  USING (
    consultant_id IN (
      SELECT id FROM public.consultants WHERE user_id = auth.uid()
    )
  );

-- Users can create introduction requests
CREATE POLICY "Users can create intro requests"
  ON public.introduction_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Consultants can update status of requests sent to them
CREATE POLICY "Consultants can update their requests"
  ON public.introduction_requests FOR UPDATE
  USING (
    consultant_id IN (
      SELECT id FROM public.consultants WHERE user_id = auth.uid()
    )
  );

-- Admins can manage all requests
CREATE POLICY "Admins can manage all intro requests"
  ON public.introduction_requests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_introduction_requests_updated_at
  BEFORE UPDATE ON public.introduction_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

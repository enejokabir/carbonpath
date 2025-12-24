-- Carbon Path Workspace Tables Migration
-- Transforms the platform from user-based to workspace-based architecture

-- Create enum for workspace member roles
CREATE TYPE public.workspace_role AS ENUM ('owner', 'manager', 'member', 'viewer');

-- Create enum for evidence categories
CREATE TYPE public.evidence_category AS ENUM (
  'environmental_policy',
  'energy_management',
  'waste_management',
  'supply_chain',
  'transport_logistics',
  'certifications',
  'training_records',
  'utility_bills',
  'audit_reports',
  'other'
);

-- Create enum for obligation frequency
CREATE TYPE public.obligation_frequency AS ENUM (
  'one_time',
  'monthly',
  'quarterly',
  'annually',
  'biannually'
);

-- Create enum for evidence status
CREATE TYPE public.evidence_status AS ENUM (
  'current',
  'expiring_soon',
  'expired',
  'needs_review'
);

-- Create workspaces table (company accounts)
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry business_type NOT NULL,
  employee_count INTEGER,
  location TEXT,
  postcode TEXT,
  website TEXT,
  description TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create workspace_members table (multi-user support)
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role workspace_role NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Create evidence_items table (evidence locker)
CREATE TABLE public.evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  category evidence_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,

  -- Metadata for freshness tracking
  document_date DATE,
  valid_from DATE,
  valid_until DATE,
  review_date DATE,

  -- Status tracking
  status evidence_status DEFAULT 'current',
  last_reviewed_at TIMESTAMPTZ,
  last_reviewed_by UUID REFERENCES auth.users(id),

  -- Audit trail
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create obligations table (compliance calendar)
CREATE TABLE public.obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,

  -- Obligation details
  title TEXT NOT NULL,
  description TEXT,
  category evidence_category,

  -- Scheduling
  frequency obligation_frequency NOT NULL,
  due_date DATE NOT NULL,
  reminder_days INTEGER DEFAULT 14,

  -- Recurring logic
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_end_date DATE,

  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  linked_evidence_id UUID REFERENCES public.evidence_items(id),

  -- Metadata
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create industry_checklists table (templates)
CREATE TABLE public.industry_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry business_type NOT NULL,
  category evidence_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  typical_frequency obligation_frequency,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create workspace_checklist_items table (completed checklist items)
CREATE TABLE public.workspace_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  checklist_item_id UUID REFERENCES public.industry_checklists(id) ON DELETE CASCADE NOT NULL,

  is_applicable BOOLEAN DEFAULT TRUE,
  is_completed BOOLEAN DEFAULT FALSE,
  linked_evidence_id UUID REFERENCES public.evidence_items(id),
  notes TEXT,

  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(workspace_id, checklist_item_id)
);

-- Create readiness_scores table (cached scores)
CREATE TABLE public.readiness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Overall score
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),

  -- Category breakdown
  evidence_score INTEGER CHECK (evidence_score >= 0 AND evidence_score <= 100),
  freshness_score INTEGER CHECK (freshness_score >= 0 AND freshness_score <= 100),
  checklist_score INTEGER CHECK (checklist_score >= 0 AND checklist_score <= 100),
  obligations_score INTEGER CHECK (obligations_score >= 0 AND obligations_score <= 100),

  -- Counts for dashboard
  total_evidence_items INTEGER DEFAULT 0,
  current_evidence_items INTEGER DEFAULT 0,
  expiring_evidence_items INTEGER DEFAULT 0,
  expired_evidence_items INTEGER DEFAULT 0,

  total_obligations INTEGER DEFAULT 0,
  overdue_obligations INTEGER DEFAULT 0,
  upcoming_obligations INTEGER DEFAULT 0,

  total_checklist_items INTEGER DEFAULT 0,
  completed_checklist_items INTEGER DEFAULT 0,

  -- Calculation metadata
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add workspace reference to profiles
ALTER TABLE public.profiles
ADD COLUMN current_workspace_id UUID REFERENCES public.workspaces(id),
ADD COLUMN full_name TEXT;

-- Enable Row Level Security on new tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_scores ENABLE ROW LEVEL SECURITY;

-- Helper function to check workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id UUID, _workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE user_id = _user_id
      AND workspace_id = _workspace_id
  )
$$;

-- Helper function to check workspace role
CREATE OR REPLACE FUNCTION public.has_workspace_role(_user_id UUID, _workspace_id UUID, _role workspace_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE user_id = _user_id
      AND workspace_id = _workspace_id
      AND role = _role
  )
$$;

-- RLS Policies for workspaces
CREATE POLICY "Users can view workspaces they belong to"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(auth.uid(), id));

CREATE POLICY "Users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and managers can update workspace"
  ON public.workspaces FOR UPDATE
  USING (
    public.has_workspace_role(auth.uid(), id, 'owner') OR
    public.has_workspace_role(auth.uid(), id, 'manager')
  );

CREATE POLICY "Only owners can delete workspace"
  ON public.workspaces FOR DELETE
  USING (public.has_workspace_role(auth.uid(), id, 'owner'));

-- RLS Policies for workspace_members
CREATE POLICY "Members can view workspace members"
  ON public.workspace_members FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Owners and managers can add members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager') OR
    -- Allow users to add themselves when creating workspace
    (auth.uid() = user_id)
  );

CREATE POLICY "Owners and managers can update members"
  ON public.workspace_members FOR UPDATE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

CREATE POLICY "Owners can remove members"
  ON public.workspace_members FOR DELETE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    -- Users can remove themselves
    auth.uid() = user_id
  );

-- RLS Policies for evidence_items
CREATE POLICY "Members can view evidence"
  ON public.evidence_items FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Members can upload evidence"
  ON public.evidence_items FOR INSERT
  WITH CHECK (
    public.is_workspace_member(auth.uid(), workspace_id) AND
    auth.uid() = uploaded_by
  );

CREATE POLICY "Uploaders, owners, managers can update evidence"
  ON public.evidence_items FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

CREATE POLICY "Owners and managers can delete evidence"
  ON public.evidence_items FOR DELETE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

-- RLS Policies for obligations
CREATE POLICY "Members can view obligations"
  ON public.obligations FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Members can create obligations"
  ON public.obligations FOR INSERT
  WITH CHECK (
    public.is_workspace_member(auth.uid(), workspace_id) AND
    auth.uid() = created_by
  );

CREATE POLICY "Creators, owners, managers can update obligations"
  ON public.obligations FOR UPDATE
  USING (
    created_by = auth.uid() OR
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

CREATE POLICY "Owners and managers can delete obligations"
  ON public.obligations FOR DELETE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

-- RLS Policies for industry_checklists (public read)
CREATE POLICY "Anyone can view industry checklists"
  ON public.industry_checklists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage industry checklists"
  ON public.industry_checklists FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workspace_checklist_items
CREATE POLICY "Members can view checklist items"
  ON public.workspace_checklist_items FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Members can create checklist items"
  ON public.workspace_checklist_items FOR INSERT
  WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Members can update checklist items"
  ON public.workspace_checklist_items FOR UPDATE
  USING (public.is_workspace_member(auth.uid(), workspace_id));

-- RLS Policies for readiness_scores
CREATE POLICY "Members can view readiness scores"
  ON public.readiness_scores FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "System can insert/update readiness scores"
  ON public.readiness_scores FOR ALL
  USING (public.is_workspace_member(auth.uid(), workspace_id));

-- Create updated_at triggers for new tables
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_evidence_items_updated_at
  BEFORE UPDATE ON public.evidence_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_obligations_updated_at
  BEFORE UPDATE ON public.obligations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_workspace_checklist_items_updated_at
  BEFORE UPDATE ON public.workspace_checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_readiness_scores_updated_at
  BEFORE UPDATE ON public.readiness_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for performance
CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX idx_evidence_items_workspace ON public.evidence_items(workspace_id);
CREATE INDEX idx_evidence_items_category ON public.evidence_items(category);
CREATE INDEX idx_evidence_items_status ON public.evidence_items(status);
CREATE INDEX idx_obligations_workspace ON public.obligations(workspace_id);
CREATE INDEX idx_obligations_due_date ON public.obligations(due_date);
CREATE INDEX idx_industry_checklists_industry ON public.industry_checklists(industry);
CREATE INDEX idx_workspace_checklist_items_workspace ON public.workspace_checklist_items(workspace_id);

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for evidence bucket
CREATE POLICY "Users can upload to their workspace folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view evidence from their workspaces"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence' AND
    auth.uid() IS NOT NULL
  );

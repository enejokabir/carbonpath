-- =============================================================================
-- CARBON PATH - COMPLETE DATABASE SETUP
-- =============================================================================
-- Run this entire file in Supabase SQL Editor to set up all tables
-- =============================================================================

-- =============================================================================
-- PART 1: ENUMS
-- =============================================================================

-- Business/Industry types
DO $$ BEGIN
  CREATE TYPE public.business_type AS ENUM (
    'manufacturing', 'retail', 'services', 'technology',
    'hospitality', 'construction', 'agriculture',
    'logistics', 'healthcare', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- User roles
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('user', 'consultant', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Workspace member roles
DO $$ BEGIN
  CREATE TYPE public.workspace_role AS ENUM ('owner', 'manager', 'member', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Evidence categories
DO $$ BEGIN
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
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Obligation frequency
DO $$ BEGIN
  CREATE TYPE public.obligation_frequency AS ENUM (
    'one_time',
    'monthly',
    'quarterly',
    'annually',
    'biannually'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Evidence status
DO $$ BEGIN
  CREATE TYPE public.evidence_status AS ENUM (
    'current',
    'expiring_soon',
    'expired',
    'needs_review'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Consultant status
DO $$ BEGIN
  CREATE TYPE public.consultant_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- PART 2: HELPER FUNCTIONS
-- =============================================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PART 3: PROFILES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  business_type business_type,
  employees INTEGER,
  location TEXT,
  postcode TEXT,
  role user_role DEFAULT 'user',
  current_workspace_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Has role helper
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================================================
-- PART 4: WORKSPACES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
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

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Add foreign key to profiles after workspaces exists
DO $$ BEGIN
  ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_current_workspace_fkey
  FOREIGN KEY (current_workspace_id) REFERENCES public.workspaces(id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- PART 5: WORKSPACE MEMBERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.workspace_members (
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

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 6: WORKSPACE HELPER FUNCTIONS
-- =============================================================================

-- Check if user is workspace member
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

-- Check workspace role
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

-- =============================================================================
-- PART 7: EVIDENCE ITEMS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  category evidence_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  document_date DATE,
  valid_from DATE,
  valid_until DATE,
  review_date DATE,
  status evidence_status DEFAULT 'current',
  last_reviewed_at TIMESTAMPTZ,
  last_reviewed_by UUID REFERENCES auth.users(id),
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 8: OBLIGATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category evidence_category,
  frequency obligation_frequency NOT NULL,
  due_date DATE NOT NULL,
  reminder_days INTEGER DEFAULT 14,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_end_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  linked_evidence_id UUID REFERENCES public.evidence_items(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 9: CHECKLIST TABLES
-- =============================================================================

-- Industry checklist templates
CREATE TABLE IF NOT EXISTS public.industry_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry business_type NOT NULL,
  category evidence_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  help_text TEXT,
  help_link TEXT,
  typical_frequency obligation_frequency,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.industry_checklists ENABLE ROW LEVEL SECURITY;

-- Workspace checklist items (user progress)
CREATE TABLE IF NOT EXISTS public.workspace_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  checklist_item_id UUID REFERENCES public.industry_checklists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category evidence_category NOT NULL,
  is_required BOOLEAN DEFAULT FALSE,
  help_text TEXT,
  help_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_applicable BOOLEAN DEFAULT TRUE,
  is_completed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  linked_evidence_id UUID REFERENCES public.evidence_items(id),
  assigned_to UUID REFERENCES auth.users(id),
  assigned_by UUID REFERENCES auth.users(id),
  due_date DATE,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.workspace_checklist_items ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 10: READINESS SCORES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.readiness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL UNIQUE,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  evidence_score INTEGER CHECK (evidence_score >= 0 AND evidence_score <= 100),
  freshness_score INTEGER CHECK (freshness_score >= 0 AND freshness_score <= 100),
  checklist_score INTEGER CHECK (checklist_score >= 0 AND checklist_score <= 100),
  obligations_score INTEGER CHECK (obligations_score >= 0 AND obligations_score <= 100),
  total_evidence_items INTEGER DEFAULT 0,
  current_evidence_items INTEGER DEFAULT 0,
  expiring_evidence_items INTEGER DEFAULT 0,
  expired_evidence_items INTEGER DEFAULT 0,
  total_obligations INTEGER DEFAULT 0,
  overdue_obligations INTEGER DEFAULT 0,
  upcoming_obligations INTEGER DEFAULT 0,
  total_checklist_items INTEGER DEFAULT 0,
  completed_checklist_items INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.readiness_scores ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 11: CONSULTANTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  specialty TEXT NOT NULL,
  region TEXT NOT NULL,
  bio TEXT,
  expertise_areas TEXT[],
  years_experience INTEGER,
  fee_type TEXT,
  website TEXT,
  linkedin TEXT,
  status consultant_status DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 12: GRANTS AND SUBSIDIES TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_min INTEGER,
  amount_max INTEGER,
  deadline DATE,
  eligibility TEXT[],
  sectors TEXT[],
  regions TEXT[],
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.subsidies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT NOT NULL,
  benefit_type TEXT NOT NULL,
  benefit_value TEXT,
  eligibility TEXT[],
  sectors TEXT[],
  regions TEXT[],
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subsidies ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 13: ACTIVITY LOG TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  target_title TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PART 14: ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Workspaces policies
DROP POLICY IF EXISTS "Users can view workspaces they belong to" ON public.workspaces;
CREATE POLICY "Users can view workspaces they belong to"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(auth.uid(), id));

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Owners and managers can update workspace" ON public.workspaces;
CREATE POLICY "Owners and managers can update workspace"
  ON public.workspaces FOR UPDATE
  USING (
    public.has_workspace_role(auth.uid(), id, 'owner') OR
    public.has_workspace_role(auth.uid(), id, 'manager')
  );

DROP POLICY IF EXISTS "Only owners can delete workspace" ON public.workspaces;
CREATE POLICY "Only owners can delete workspace"
  ON public.workspaces FOR DELETE
  USING (public.has_workspace_role(auth.uid(), id, 'owner'));

-- Workspace members policies
DROP POLICY IF EXISTS "Members can view workspace members" ON public.workspace_members;
CREATE POLICY "Members can view workspace members"
  ON public.workspace_members FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can add themselves or managers can add members" ON public.workspace_members;
CREATE POLICY "Users can add themselves or managers can add members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

DROP POLICY IF EXISTS "Owners and managers can update members" ON public.workspace_members;
CREATE POLICY "Owners and managers can update members"
  ON public.workspace_members FOR UPDATE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

DROP POLICY IF EXISTS "Owners can remove members or users can leave" ON public.workspace_members;
CREATE POLICY "Owners can remove members or users can leave"
  ON public.workspace_members FOR DELETE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    auth.uid() = user_id
  );

-- Evidence items policies
DROP POLICY IF EXISTS "Members can view evidence" ON public.evidence_items;
CREATE POLICY "Members can view evidence"
  ON public.evidence_items FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Members can upload evidence" ON public.evidence_items;
CREATE POLICY "Members can upload evidence"
  ON public.evidence_items FOR INSERT
  WITH CHECK (
    public.is_workspace_member(auth.uid(), workspace_id) AND
    auth.uid() = uploaded_by
  );

DROP POLICY IF EXISTS "Uploaders and managers can update evidence" ON public.evidence_items;
CREATE POLICY "Uploaders and managers can update evidence"
  ON public.evidence_items FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

DROP POLICY IF EXISTS "Owners and managers can delete evidence" ON public.evidence_items;
CREATE POLICY "Owners and managers can delete evidence"
  ON public.evidence_items FOR DELETE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

-- Obligations policies
DROP POLICY IF EXISTS "Members can view obligations" ON public.obligations;
CREATE POLICY "Members can view obligations"
  ON public.obligations FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Members can create obligations" ON public.obligations;
CREATE POLICY "Members can create obligations"
  ON public.obligations FOR INSERT
  WITH CHECK (
    public.is_workspace_member(auth.uid(), workspace_id) AND
    auth.uid() = created_by
  );

DROP POLICY IF EXISTS "Creators and managers can update obligations" ON public.obligations;
CREATE POLICY "Creators and managers can update obligations"
  ON public.obligations FOR UPDATE
  USING (
    created_by = auth.uid() OR
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

DROP POLICY IF EXISTS "Owners and managers can delete obligations" ON public.obligations;
CREATE POLICY "Owners and managers can delete obligations"
  ON public.obligations FOR DELETE
  USING (
    public.has_workspace_role(auth.uid(), workspace_id, 'owner') OR
    public.has_workspace_role(auth.uid(), workspace_id, 'manager')
  );

-- Industry checklists (public read)
DROP POLICY IF EXISTS "Anyone can view industry checklists" ON public.industry_checklists;
CREATE POLICY "Anyone can view industry checklists"
  ON public.industry_checklists FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage industry checklists" ON public.industry_checklists;
CREATE POLICY "Admins can manage industry checklists"
  ON public.industry_checklists FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Workspace checklist items
DROP POLICY IF EXISTS "Members can view checklist items" ON public.workspace_checklist_items;
CREATE POLICY "Members can view checklist items"
  ON public.workspace_checklist_items FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Members can manage checklist items" ON public.workspace_checklist_items;
CREATE POLICY "Members can manage checklist items"
  ON public.workspace_checklist_items FOR ALL
  USING (public.is_workspace_member(auth.uid(), workspace_id));

-- Readiness scores
DROP POLICY IF EXISTS "Members can view readiness scores" ON public.readiness_scores;
CREATE POLICY "Members can view readiness scores"
  ON public.readiness_scores FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Members can manage readiness scores" ON public.readiness_scores;
CREATE POLICY "Members can manage readiness scores"
  ON public.readiness_scores FOR ALL
  USING (public.is_workspace_member(auth.uid(), workspace_id));

-- Consultants (public read for approved)
DROP POLICY IF EXISTS "Anyone can view approved consultants" ON public.consultants;
CREATE POLICY "Anyone can view approved consultants"
  ON public.consultants FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create consultant profile" ON public.consultants;
CREATE POLICY "Users can create consultant profile"
  ON public.consultants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own consultant profile" ON public.consultants;
CREATE POLICY "Users can update own consultant profile"
  ON public.consultants FOR UPDATE
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Grants (public read)
DROP POLICY IF EXISTS "Anyone can view active grants" ON public.grants;
CREATE POLICY "Anyone can view active grants"
  ON public.grants FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage grants" ON public.grants;
CREATE POLICY "Admins can manage grants"
  ON public.grants FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Subsidies (public read)
DROP POLICY IF EXISTS "Anyone can view active subsidies" ON public.subsidies;
CREATE POLICY "Anyone can view active subsidies"
  ON public.subsidies FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage subsidies" ON public.subsidies;
CREATE POLICY "Admins can manage subsidies"
  ON public.subsidies FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Activity log
DROP POLICY IF EXISTS "Members can view activity" ON public.activity_log;
CREATE POLICY "Members can view activity"
  ON public.activity_log FOR SELECT
  USING (public.is_workspace_member(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Members can log activity" ON public.activity_log;
CREATE POLICY "Members can log activity"
  ON public.activity_log FOR INSERT
  WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));

-- =============================================================================
-- PART 15: TRIGGERS
-- =============================================================================

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_workspaces_updated_at ON public.workspaces;
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_evidence_items_updated_at ON public.evidence_items;
CREATE TRIGGER update_evidence_items_updated_at
  BEFORE UPDATE ON public.evidence_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_obligations_updated_at ON public.obligations;
CREATE TRIGGER update_obligations_updated_at
  BEFORE UPDATE ON public.obligations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_workspace_checklist_items_updated_at ON public.workspace_checklist_items;
CREATE TRIGGER update_workspace_checklist_items_updated_at
  BEFORE UPDATE ON public.workspace_checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_readiness_scores_updated_at ON public.readiness_scores;
CREATE TRIGGER update_readiness_scores_updated_at
  BEFORE UPDATE ON public.readiness_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_consultants_updated_at ON public.consultants;
CREATE TRIGGER update_consultants_updated_at
  BEFORE UPDATE ON public.consultants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_grants_updated_at ON public.grants;
CREATE TRIGGER update_grants_updated_at
  BEFORE UPDATE ON public.grants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_subsidies_updated_at ON public.subsidies;
CREATE TRIGGER update_subsidies_updated_at
  BEFORE UPDATE ON public.subsidies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =============================================================================
-- PART 16: INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_workspace ON public.profiles(current_workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_evidence_items_workspace ON public.evidence_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_evidence_items_category ON public.evidence_items(category);
CREATE INDEX IF NOT EXISTS idx_evidence_items_status ON public.evidence_items(status);
CREATE INDEX IF NOT EXISTS idx_obligations_workspace ON public.obligations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_obligations_due_date ON public.obligations(due_date);
CREATE INDEX IF NOT EXISTS idx_industry_checklists_industry ON public.industry_checklists(industry);
CREATE INDEX IF NOT EXISTS idx_workspace_checklist_workspace ON public.workspace_checklist_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_consultants_status ON public.consultants(status);
CREATE INDEX IF NOT EXISTS idx_grants_active ON public.grants(is_active);
CREATE INDEX IF NOT EXISTS idx_subsidies_active ON public.subsidies(is_active);
CREATE INDEX IF NOT EXISTS idx_activity_log_workspace ON public.activity_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON public.activity_log(created_at DESC);

-- =============================================================================
-- PART 17: STORAGE BUCKET
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Users can upload to evidence bucket" ON storage.objects;
CREATE POLICY "Users can upload to evidence bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence' AND
    auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can view evidence files" ON storage.objects;
CREATE POLICY "Users can view evidence files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence' AND
    auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can delete evidence files" ON storage.objects;
CREATE POLICY "Users can delete evidence files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence' AND
    auth.uid() IS NOT NULL
  );

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================
-- Your Carbon Path database is now ready.
-- Tables created:
--   - profiles (user profiles)
--   - workspaces (company accounts)
--   - workspace_members (team members)
--   - evidence_items (evidence locker)
--   - obligations (compliance calendar)
--   - industry_checklists (templates)
--   - workspace_checklist_items (user checklists)
--   - readiness_scores (dashboard scores)
--   - consultants (consultant directory)
--   - grants (funding opportunities)
--   - subsidies (tax incentives)
--   - activity_log (team activity)
-- =============================================================================

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'sme');

-- Create enum for business types
CREATE TYPE public.business_type AS ENUM (
  'manufacturing',
  'retail',
  'services',
  'technology',
  'hospitality',
  'construction',
  'agriculture',
  'other'
);

-- Create enum for answer types
CREATE TYPE public.answer_type AS ENUM ('yes_no', 'dropdown', 'number', 'text');

-- Create enum for score categories
CREATE TYPE public.score_category AS ENUM ('good', 'average', 'needs_improvement');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type business_type NOT NULL,
  employees INTEGER,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create questionnaire_items table
CREATE TABLE public.questionnaire_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  business_types business_type[] NOT NULL DEFAULT '{}',
  answer_type answer_type NOT NULL,
  options JSONB,
  weight INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create questionnaire_answers table
CREATE TABLE public.questionnaire_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questionnaire_items(id) ON DELETE CASCADE NOT NULL,
  answer_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create carbon_scores table
CREATE TABLE public.carbon_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  category score_category NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create grants table
CREATE TABLE public.grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility_text TEXT NOT NULL,
  business_types business_type[] NOT NULL DEFAULT '{}',
  location_scope TEXT[] NOT NULL DEFAULT '{}',
  min_score_required INTEGER CHECK (min_score_required >= 0 AND min_score_required <= 100),
  category score_category,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create consultants table
CREATE TABLE public.consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  region TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  bio TEXT,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for questionnaire_items
CREATE POLICY "Authenticated users can view questionnaire items"
  ON public.questionnaire_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage questionnaire items"
  ON public.questionnaire_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for questionnaire_answers
CREATE POLICY "Users can view their own answers"
  ON public.questionnaire_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers"
  ON public.questionnaire_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
  ON public.questionnaire_answers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all answers"
  ON public.questionnaire_answers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for carbon_scores
CREATE POLICY "Users can view their own score"
  ON public.carbon_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own score"
  ON public.carbon_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own score"
  ON public.carbon_scores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all scores"
  ON public.carbon_scores FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for grants
CREATE POLICY "Authenticated users can view grants"
  ON public.grants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage grants"
  ON public.grants FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for consultants
CREATE POLICY "Authenticated users can view consultants"
  ON public.consultants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage consultants"
  ON public.consultants FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, business_name, business_type, employees, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    COALESCE((NEW.raw_user_meta_data->>'business_type')::business_type, 'other'),
    COALESCE((NEW.raw_user_meta_data->>'employees')::INTEGER, 0),
    COALESCE(NEW.raw_user_meta_data->>'location', '')
  );
  
  -- By default, new users are SMEs
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'sme');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_questionnaire_items_updated_at
  BEFORE UPDATE ON public.questionnaire_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_questionnaire_answers_updated_at
  BEFORE UPDATE ON public.questionnaire_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_carbon_scores_updated_at
  BEFORE UPDATE ON public.carbon_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_grants_updated_at
  BEFORE UPDATE ON public.grants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_consultants_updated_at
  BEFORE UPDATE ON public.consultants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
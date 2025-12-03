-- Migration: Carbon Emissions Tables
-- Stores emission factors, user carbon footprints, and sector benchmarks

-- =====================================================
-- UK Emission Factors Table (Admin-managed reference data)
-- =====================================================
CREATE TABLE public.emission_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  unit TEXT NOT NULL,
  factor_value DECIMAL(10, 6) NOT NULL,
  scope INTEGER NOT NULL CHECK (scope IN (1, 2, 3)),
  source TEXT NOT NULL DEFAULT 'UK Government GHG Conversion Factors',
  year INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category, subcategory, year)
);

-- Create index for lookups
CREATE INDEX idx_emission_factors_category ON public.emission_factors(category);
CREATE INDEX idx_emission_factors_year ON public.emission_factors(year);

-- =====================================================
-- User Carbon Footprints Table
-- =====================================================
CREATE TABLE public.carbon_footprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Scope 1: Direct emissions (fuel combustion, company vehicles, refrigerants)
  scope1_natural_gas_kwh DECIMAL(12, 2) DEFAULT 0,
  scope1_lpg_litres DECIMAL(12, 2) DEFAULT 0,
  scope1_heating_oil_litres DECIMAL(12, 2) DEFAULT 0,
  scope1_company_vehicles_petrol_litres DECIMAL(12, 2) DEFAULT 0,
  scope1_company_vehicles_diesel_litres DECIMAL(12, 2) DEFAULT 0,
  scope1_company_vehicles_ev_kwh DECIMAL(12, 2) DEFAULT 0,
  scope1_refrigerants_kg DECIMAL(12, 2) DEFAULT 0,
  scope1_total_kg_co2e DECIMAL(12, 2) DEFAULT 0,

  -- Scope 2: Indirect energy emissions (purchased electricity, heat)
  scope2_electricity_kwh DECIMAL(12, 2) DEFAULT 0,
  scope2_district_heating_kwh DECIMAL(12, 2) DEFAULT 0,
  scope2_total_kg_co2e DECIMAL(12, 2) DEFAULT 0,

  -- Scope 3: Other indirect emissions (travel, waste, water, supply chain)
  scope3_business_travel_air_km DECIMAL(12, 2) DEFAULT 0,
  scope3_business_travel_rail_km DECIMAL(12, 2) DEFAULT 0,
  scope3_business_travel_car_km DECIMAL(12, 2) DEFAULT 0,
  scope3_employee_commuting_km DECIMAL(12, 2) DEFAULT 0,
  scope3_waste_general_tonnes DECIMAL(12, 4) DEFAULT 0,
  scope3_waste_recycling_tonnes DECIMAL(12, 4) DEFAULT 0,
  scope3_water_cubic_metres DECIMAL(12, 2) DEFAULT 0,
  scope3_purchased_goods_gbp DECIMAL(12, 2) DEFAULT 0,
  scope3_total_kg_co2e DECIMAL(12, 2) DEFAULT 0,

  -- Totals
  total_kg_co2e DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_tonnes_co2e DECIMAL(12, 4) GENERATED ALWAYS AS (total_kg_co2e / 1000) STORED,

  -- Per-unit metrics
  employees_count INTEGER,
  floor_area_sqm DECIMAL(12, 2),
  kg_co2e_per_employee DECIMAL(12, 2),
  kg_co2e_per_sqm DECIMAL(12, 2),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_carbon_footprints_user_id ON public.carbon_footprints(user_id);
CREATE INDEX idx_carbon_footprints_date ON public.carbon_footprints(calculation_date);

-- =====================================================
-- Sector Benchmarks Table
-- =====================================================
CREATE TABLE public.sector_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_type public.business_type NOT NULL,
  employee_range TEXT NOT NULL,
  avg_kg_co2e_per_employee DECIMAL(12, 2) NOT NULL,
  good_threshold_kg DECIMAL(12, 2) NOT NULL,
  average_threshold_kg DECIMAL(12, 2) NOT NULL,
  source TEXT,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_type, employee_range, year)
);

-- Create index
CREATE INDEX idx_sector_benchmarks_type ON public.sector_benchmarks(business_type);

-- =====================================================
-- Enable Row Level Security
-- =====================================================
ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_footprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_benchmarks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for emission_factors (read-only for users)
-- =====================================================
CREATE POLICY "Anyone can view emission factors"
  ON public.emission_factors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage emission factors"
  ON public.emission_factors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS Policies for carbon_footprints
-- =====================================================
CREATE POLICY "Users can view their own footprints"
  ON public.carbon_footprints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own footprints"
  ON public.carbon_footprints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own footprints"
  ON public.carbon_footprints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own footprints"
  ON public.carbon_footprints FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all footprints"
  ON public.carbon_footprints FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS Policies for sector_benchmarks
-- =====================================================
CREATE POLICY "Anyone can view benchmarks"
  ON public.sector_benchmarks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage benchmarks"
  ON public.sector_benchmarks FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- Triggers for updated_at
-- =====================================================
CREATE TRIGGER update_emission_factors_updated_at
  BEFORE UPDATE ON public.emission_factors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_carbon_footprints_updated_at
  BEFORE UPDATE ON public.carbon_footprints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

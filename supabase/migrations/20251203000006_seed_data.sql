-- Migration: Seed Data
-- Populates reference data for emission factors, benchmarks, grants, subsidies, and consultants

-- =====================================================
-- UK Government Emission Factors 2024
-- Source: UK Government GHG Conversion Factors for Company Reporting
-- =====================================================

INSERT INTO public.emission_factors (category, subcategory, unit, factor_value, scope, year, notes) VALUES
  -- Scope 1: Fuels
  ('Natural Gas', 'Gross CV', 'kWh', 0.18293, 1, 2024, 'Natural gas combustion'),
  ('LPG', 'Standard', 'litres', 1.55537, 1, 2024, 'Liquefied petroleum gas'),
  ('Heating Oil', 'Gas Oil', 'litres', 2.75776, 1, 2024, 'Also known as red diesel'),
  ('Heating Oil', 'Kerosene', 'litres', 2.54031, 1, 2024, 'Burning oil'),

  -- Scope 1: Transport Fuels
  ('Petrol', 'Average biofuel blend', 'litres', 2.19397, 1, 2024, 'Average car petrol'),
  ('Diesel', 'Average biofuel blend', 'litres', 2.51233, 1, 2024, 'Average car diesel'),

  -- Scope 1: Refrigerants (common ones)
  ('Refrigerant', 'R410A', 'kg', 2088.0, 1, 2024, 'Common AC refrigerant'),
  ('Refrigerant', 'R134a', 'kg', 1430.0, 1, 2024, 'Vehicle AC refrigerant'),

  -- Scope 2: Electricity
  ('Electricity', 'UK Grid Average', 'kWh', 0.20707, 2, 2024, 'Location-based factor'),
  ('Electricity', 'UK Grid T&D Losses', 'kWh', 0.01879, 2, 2024, 'Transmission & distribution losses'),

  -- Scope 2: Heat
  ('District Heat', 'Steam', 'kWh', 0.17063, 2, 2024, 'District heating steam'),
  ('District Heat', 'Hot Water', 'kWh', 0.16617, 2, 2024, 'District heating hot water'),

  -- Scope 3: Business Travel
  ('Business Travel', 'Domestic Flight', 'passenger-km', 0.24587, 3, 2024, 'UK domestic flights'),
  ('Business Travel', 'Short-haul Flight', 'passenger-km', 0.15353, 3, 2024, 'European flights'),
  ('Business Travel', 'Long-haul Flight', 'passenger-km', 0.19309, 3, 2024, 'International flights'),
  ('Business Travel', 'National Rail', 'passenger-km', 0.03549, 3, 2024, 'UK rail travel'),
  ('Business Travel', 'Average Car', 'km', 0.17141, 3, 2024, 'Average car for business travel'),

  -- Scope 3: Employee Commuting
  ('Commuting', 'Average Car', 'km', 0.17141, 3, 2024, 'Employee commuting by car'),
  ('Commuting', 'Bus', 'km', 0.10312, 3, 2024, 'Employee commuting by bus'),
  ('Commuting', 'National Rail', 'km', 0.03549, 3, 2024, 'Employee commuting by rail'),

  -- Scope 3: Waste
  ('Waste', 'General Waste to Landfill', 'tonnes', 446.24, 3, 2024, 'Mixed commercial waste'),
  ('Waste', 'Mixed Recycling', 'tonnes', 21.29, 3, 2024, 'Recycled materials'),
  ('Waste', 'Paper/Cardboard Recycling', 'tonnes', 21.29, 3, 2024, 'Paper and cardboard'),
  ('Waste', 'Organic Waste Composted', 'tonnes', 10.20, 3, 2024, 'Food and garden waste'),

  -- Scope 3: Water
  ('Water', 'Supply', 'cubic metres', 0.149, 3, 2024, 'Mains water supply'),
  ('Water', 'Treatment', 'cubic metres', 0.272, 3, 2024, 'Wastewater treatment'),

  -- Scope 3: Purchased Goods (approximate spend-based factors)
  ('Purchased Goods', 'Average', 'GBP', 0.00023, 3, 2024, 'Approximate factor per GBP spent');

-- =====================================================
-- Sector Benchmarks
-- Average kg CO2e per employee by sector and size
-- =====================================================

INSERT INTO public.sector_benchmarks (business_type, employee_range, avg_kg_co2e_per_employee, good_threshold_kg, average_threshold_kg, year, source) VALUES
  -- Manufacturing (high energy intensity)
  ('manufacturing', '1-9', 8500, 6000, 10000, 2024, 'UK SME Carbon Benchmarks'),
  ('manufacturing', '10-49', 7500, 5000, 9000, 2024, 'UK SME Carbon Benchmarks'),
  ('manufacturing', '50-249', 6500, 4500, 8000, 2024, 'UK SME Carbon Benchmarks'),

  -- Retail
  ('retail', '1-9', 4500, 3000, 5500, 2024, 'UK SME Carbon Benchmarks'),
  ('retail', '10-49', 4000, 2500, 5000, 2024, 'UK SME Carbon Benchmarks'),
  ('retail', '50-249', 3500, 2200, 4500, 2024, 'UK SME Carbon Benchmarks'),

  -- Services (office-based)
  ('services', '1-9', 3000, 2000, 4000, 2024, 'UK SME Carbon Benchmarks'),
  ('services', '10-49', 2800, 1800, 3500, 2024, 'UK SME Carbon Benchmarks'),
  ('services', '50-249', 2500, 1500, 3200, 2024, 'UK SME Carbon Benchmarks'),

  -- Technology (lower intensity, mostly office)
  ('technology', '1-9', 2500, 1500, 3500, 2024, 'UK SME Carbon Benchmarks'),
  ('technology', '10-49', 2200, 1200, 3000, 2024, 'UK SME Carbon Benchmarks'),
  ('technology', '50-249', 2000, 1000, 2800, 2024, 'UK SME Carbon Benchmarks'),

  -- Hospitality (moderate intensity)
  ('hospitality', '1-9', 5500, 4000, 7000, 2024, 'UK SME Carbon Benchmarks'),
  ('hospitality', '10-49', 5000, 3500, 6500, 2024, 'UK SME Carbon Benchmarks'),
  ('hospitality', '50-249', 4500, 3000, 6000, 2024, 'UK SME Carbon Benchmarks'),

  -- Construction (variable, often high)
  ('construction', '1-9', 9000, 6500, 11000, 2024, 'UK SME Carbon Benchmarks'),
  ('construction', '10-49', 8000, 5500, 10000, 2024, 'UK SME Carbon Benchmarks'),
  ('construction', '50-249', 7000, 5000, 9000, 2024, 'UK SME Carbon Benchmarks'),

  -- Agriculture (often high due to machinery and livestock)
  ('agriculture', '1-9', 12000, 8000, 15000, 2024, 'UK SME Carbon Benchmarks'),
  ('agriculture', '10-49', 10000, 7000, 13000, 2024, 'UK SME Carbon Benchmarks'),
  ('agriculture', '50-249', 9000, 6000, 12000, 2024, 'UK SME Carbon Benchmarks'),

  -- Other (average across sectors)
  ('other', '1-9', 4000, 2500, 5000, 2024, 'UK SME Carbon Benchmarks'),
  ('other', '10-49', 3500, 2200, 4500, 2024, 'UK SME Carbon Benchmarks'),
  ('other', '50-249', 3000, 2000, 4000, 2024, 'UK SME Carbon Benchmarks');

-- =====================================================
-- Sample Grants
-- =====================================================

INSERT INTO public.grants (name, description, eligibility_text, business_types, location_scope, amount_description, grant_type, sectors, deadline, whats_covered, link, is_active) VALUES
  (
    'Low Carbon Business Support Programme',
    'Grants for SMEs to reduce energy costs and carbon emissions through energy audits, equipment upgrades, and efficiency improvements. Includes free energy assessments and match-funded grants.',
    'SME (fewer than 250 employees), Based in East Midlands, Trading for at least 12 months, Not received previous LCBSP funding',
    '{manufacturing,retail,hospitality,services,construction}',
    '{East Midlands,Derbyshire,Nottinghamshire,Leicestershire}',
    'Up to £20,000',
    'Energy Efficiency',
    '{Manufacturing,Logistics,Retail,Hospitality}',
    'Open - Rolling applications',
    '{Energy audits,LED lighting upgrades,HVAC improvements,Insulation,Solar PV installation,Equipment upgrades}',
    'https://www.emcarbonhub.co.uk/',
    true
  ),
  (
    'Green Business Grant Scheme',
    'Capital grants for small businesses investing in renewable energy installations, LED lighting, or building insulation improvements to reduce carbon footprint.',
    'Based in Derby City Council area, Fewer than 50 employees, Annual turnover under £10m, Private sector business',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{Derby City,Derby}',
    'Up to £10,000',
    'Decarbonisation',
    '{All Sectors}',
    'March 2025',
    '{Solar panels,Battery storage,LED lighting,Insulation,Heat pumps,Double glazing}',
    'https://www.derby.gov.uk/business/',
    true
  ),
  (
    'Industrial Energy Transformation Fund (IETF)',
    'For energy-intensive industries to invest in equipment upgrades, process improvements, and fuel switching to reduce carbon emissions.',
    'Energy-intensive industry sector, UK registered business, Project reduces emissions by at least 20%, Match funding available',
    '{manufacturing}',
    '{UK-wide,England,Scotland,Wales,Northern Ireland}',
    '£100,000 to £30 million',
    'Industrial',
    '{Manufacturing,Industrial}',
    'Phased - check website',
    '{Process efficiency,Fuel switching,Heat recovery,CCS readiness,Hydrogen deployment}',
    'https://www.gov.uk/government/collections/industrial-energy-transformation-fund',
    true
  ),
  (
    'East Midlands Net Zero Hub Grant',
    'Supporting businesses to develop and implement carbon reduction plans with funded consultancy support and implementation grants.',
    'SME based in East Midlands region, No previous sustainability assessment, Committed to developing a carbon reduction plan',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{East Midlands}',
    'Up to £5,000',
    'Consultancy',
    '{All Sectors}',
    'Open',
    '{Carbon audit,Net Zero roadmap,Energy management plan,Staff training,Certification support}',
    'https://www.emcarbonhub.co.uk/',
    true
  ),
  (
    'Workplace Charging Scheme',
    'Government voucher-based scheme covering up to 75% of costs to install electric vehicle charge points for staff and fleet vehicles.',
    'UK registered business, Off-street parking available, Chargers must be for staff and fleet use (not public)',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{UK-wide}',
    '£350 per socket (up to 40 sockets)',
    'Transport',
    '{All Sectors}',
    'Ongoing',
    '{EV charging points,Installation costs,Electrical upgrades}',
    'https://www.gov.uk/guidance/workplace-charging-scheme-guidance-for-applicants',
    true
  ),
  (
    'SME Climate Hub Support Fund',
    'Funding to help SMEs commit to and achieve net zero emissions, including carbon footprint measurement and reduction planning.',
    'UK SME with fewer than 250 employees, Willing to commit to SME Climate Hub, First-time applicants',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{UK-wide}',
    'Up to £2,500',
    'Consultancy',
    '{All Sectors}',
    'Open',
    '{Carbon footprint measurement,Net zero commitment,Action planning,Supplier engagement}',
    'https://smeclimatehub.org/',
    true
  );

-- =====================================================
-- Sample Subsidies
-- =====================================================

INSERT INTO public.subsidies (name, description, subsidy_type, eligibility_text, business_types, location_scope, value_description, application_link, is_active) VALUES
  (
    'Enhanced Capital Allowances (ECA)',
    'Claim 100% first-year capital allowances on qualifying energy-efficient equipment purchases. Reduces taxable profits by the full cost of equipment in year one.',
    'tax_relief',
    'UK business purchasing new qualifying energy-efficient equipment from the Energy Technology List',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{UK-wide}',
    '100% first-year tax relief on qualifying expenditure',
    'https://www.gov.uk/capital-allowances/business-cars',
    true
  ),
  (
    'Annual Investment Allowance (AIA)',
    'Deduct the full value of qualifying plant and machinery from profits before tax, up to £1 million per year.',
    'tax_relief',
    'All UK businesses investing in plant and machinery',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{UK-wide}',
    'Up to £1,000,000 per year at 100% relief',
    'https://www.gov.uk/capital-allowances/annual-investment-allowance',
    true
  ),
  (
    'R&D Tax Relief for Sustainability Projects',
    'Enhanced tax relief for R&D expenditure on projects developing sustainable products, processes, or services.',
    'tax_relief',
    'UK company undertaking qualifying R&D activities related to sustainability innovation',
    '{manufacturing,services,technology,construction,agriculture,other}',
    '{UK-wide}',
    'Up to 27% tax credit for SMEs on qualifying R&D spend',
    'https://www.gov.uk/guidance/corporation-tax-research-and-development-rd-relief',
    true
  ),
  (
    'Business Rates Relief - Green Improvements',
    'Exemption from business rates increases following eligible green improvements to commercial properties.',
    'rate_reduction',
    'Properties in England with qualifying green improvements installed after April 2023',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{England}',
    '100% exemption from rates increase for 12 months',
    'https://www.gov.uk/apply-for-business-rate-relief',
    true
  ),
  (
    'Carbon Trust Green Business Fund',
    'Interest-free loans for energy efficiency improvements. No fees or early repayment charges.',
    'loan',
    'SMEs in England and Wales with fewer than 250 employees',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{England,Wales}',
    'Interest-free loans from £1,000 to £100,000',
    'https://www.carbontrust.com/what-we-do/green-business-fund',
    true
  ),
  (
    'Electric Vehicle Salary Sacrifice Scheme',
    'Employees can lease EVs through salary sacrifice with significant tax savings. Employers save on NI contributions.',
    'tax_relief',
    'UK employers offering salary sacrifice schemes. Employees must be UK taxpayers.',
    '{manufacturing,retail,services,technology,hospitality,construction,agriculture,other}',
    '{UK-wide}',
    '2% Benefit-in-Kind rate for EVs (vs up to 37% for petrol/diesel)',
    'https://www.gov.uk/expenses-and-benefits-company-cars',
    true
  ),
  (
    'Boiler Upgrade Scheme',
    'Grants towards heat pump installations replacing gas/oil boilers in commercial properties.',
    'voucher',
    'Properties in England and Wales replacing fossil fuel heating with heat pumps',
    '{services,hospitality,retail,other}',
    '{England,Wales}',
    'Up to £7,500 for air source, £5,000 for ground source heat pumps',
    'https://www.gov.uk/apply-boiler-upgrade-scheme',
    true
  );

-- =====================================================
-- Sample Approved Consultants
-- =====================================================

INSERT INTO public.consultants (name, specialty, region, contact_email, bio, expertise_areas, status, verified, fee_type, years_experience) VALUES
  (
    'GreenPath Consulting',
    'Grant Applications',
    'East Midlands',
    'info@greenpath-consulting.example.com',
    'Specialists in ERDF and local authority grant applications for manufacturing SMEs. We have an 85% success rate on applications and have secured over £2m in funding for East Midlands businesses.',
    '{Grant Applications,Energy Audits,Funding Strategy}',
    'approved',
    true,
    'Success-based (% of grant secured)',
    8
  ),
  (
    'Carbon Count Ltd',
    'Carbon Reporting',
    'UK-wide (remote)',
    'hello@carboncount.example.com',
    'Helping SMEs measure, report and reduce their carbon footprint. ISO 14064 certified assessors with expertise in Scope 1, 2, and 3 emissions. We make carbon accounting simple.',
    '{Carbon Reporting,Strategy,ISO Certification}',
    'approved',
    true,
    'Fixed fee packages',
    6
  ),
  (
    'Smith & Partners Accountants',
    'Tax Specialists',
    'Derby & Nottingham',
    'sustainability@smithpartners.example.com',
    'Chartered accountants specialising in R&D tax credits and capital allowances for green investments. We help businesses maximise tax relief on sustainability expenditure.',
    '{Tax Specialists,R&D Tax Credits,Capital Allowances}',
    'approved',
    true,
    'Fixed fee + hourly rate',
    15
  ),
  (
    'Midlands Energy Solutions',
    'Energy Audits',
    'East Midlands',
    'enquiries@midlandsenergy.example.com',
    'Full-service energy consultancy offering audits, recommendations, and installation management for energy efficiency measures. From assessment to implementation.',
    '{Energy Audits,Retrofit Installation,Project Management}',
    'approved',
    true,
    'Fixed fee packages',
    12
  ),
  (
    'Net Zero Advisors',
    'Strategy',
    'UK-wide',
    'contact@netzeroadvisors.example.com',
    'Strategic sustainability consultants helping businesses develop and implement Net Zero roadmaps. We work with boards and leadership teams to embed sustainability.',
    '{Strategy,Carbon Reporting,Board Advisory}',
    'approved',
    true,
    'Project-based',
    10
  ),
  (
    'EcoGrant Services',
    'Grant Applications',
    'Midlands',
    'team@ecogrant.example.com',
    'Dedicated grant funding specialists with expertise in environmental and energy efficiency schemes. No win, no fee model - we only succeed when you do.',
    '{Grant Applications,Bid Writing,Funding Research}',
    'approved',
    true,
    'Success-based (no win, no fee)',
    5
  );

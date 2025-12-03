// Real UK Grants and Subsidies Data - 2024/2025
// Sources: gov.uk, Carbon Trust, UK Business Climate Hub, regional authorities

export interface RealGrant {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount_min: number | null;
  amount_max: number | null;
  amount_description: string;
  grant_type: 'government' | 'local_authority' | 'bank_scheme' | 'utility' | 'regional';
  eligibility_text: string;
  business_types: string[];
  location_scope: string[];
  sectors: string[];
  deadline: string | null;
  application_link: string;
  whats_covered: string[];
  is_active: boolean;
  funding_percentage?: number;
}

export interface RealSubsidy {
  id: string;
  name: string;
  description: string;
  subsidy_type: 'tax_relief' | 'rate_reduction' | 'loan' | 'voucher' | 'rebate' | 'capital_allowance';
  eligibility_text: string;
  business_types: string[];
  location_scope: string[];
  min_employees: number | null;
  max_employees: number | null;
  value_description: string;
  application_link: string;
  deadline: string | null;
  is_active: boolean;
}

export const realGrants: RealGrant[] = [
  {
    id: "ietf-2024",
    name: "Industrial Energy Transformation Fund (IETF)",
    provider: "Department for Energy Security and Net Zero",
    description: "Supports businesses with high energy use to invest in energy efficiency and low carbon technologies. The fund helps decrease energy bills and carbon emissions through capital investment in equipment and processes.",
    amount_min: 100000,
    amount_max: 14000000,
    amount_description: "£100k - £14m (up to 50% of project costs)",
    grant_type: "government",
    eligibility_text: "Businesses with high energy consumption in manufacturing, industrial processes, or data centres. Must demonstrate significant energy savings potential.",
    business_types: ["Manufacturing", "Technology", "Construction"],
    location_scope: ["England", "Wales", "Northern Ireland"],
    sectors: ["Industrial", "Manufacturing", "Energy-intensive"],
    deadline: "2028-03-31",
    application_link: "https://www.gov.uk/government/collections/industrial-energy-transformation-fund",
    whats_covered: ["Energy efficiency equipment", "Heat recovery systems", "Industrial process upgrades", "Low carbon technology"],
    is_active: true,
    funding_percentage: 50
  },
  {
    id: "boiler-upgrade-2024",
    name: "Boiler Upgrade Scheme",
    provider: "Ofgem / UK Government",
    description: "Provides upfront capital grants to help property owners install low carbon heating systems such as heat pumps, replacing existing fossil fuel heating systems.",
    amount_min: 5000,
    amount_max: 7500,
    amount_description: "£7,500 for heat pumps, £5,000 for biomass boilers",
    grant_type: "government",
    eligibility_text: "Property owners in England and Wales with valid EPC. Must replace existing fossil fuel heating. Property must not be a new build.",
    business_types: ["All"],
    location_scope: ["England", "Wales"],
    sectors: ["All"],
    deadline: "2028-03-31",
    application_link: "https://www.gov.uk/apply-boiler-upgrade-scheme",
    whats_covered: ["Air source heat pumps", "Ground source heat pumps", "Biomass boilers"],
    is_active: true
  },
  {
    id: "workplace-charging-2024",
    name: "Workplace Charging Scheme",
    provider: "Office for Zero Emission Vehicles (OZEV)",
    description: "Voucher-based scheme supporting businesses, charities and public sector organisations to install electric vehicle charge points for staff and fleet vehicles.",
    amount_min: null,
    amount_max: 350,
    amount_description: "Up to £350 per socket (max 40 sockets)",
    grant_type: "government",
    eligibility_text: "Registered UK businesses, charities, or public sector organisations. Must have dedicated off-street parking. Charge points must be new and meet OZEV technical specifications.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://www.gov.uk/government/collections/government-grants-for-low-emission-vehicles",
    whats_covered: ["EV charge point hardware", "Installation costs"],
    is_active: true
  },
  {
    id: "scotland-sme-loan-2024",
    name: "Scotland SME Loan Scheme",
    provider: "Energy Saving Trust Scotland",
    description: "Interest-free loans and cashback grants to help Scottish businesses install energy efficient systems and reduce operational costs.",
    amount_min: 1000,
    amount_max: 100000,
    amount_description: "Up to £100k loan + up to £30k cashback grant",
    grant_type: "regional",
    eligibility_text: "SMEs based in Scotland with fewer than 250 employees. Must demonstrate energy saving potential of proposed measures.",
    business_types: ["All"],
    location_scope: ["Scotland"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://energysavingtrust.org.uk/grants-and-loans/business-loans-scotland/",
    whats_covered: ["Heat pumps", "Biomass boilers", "LED lighting", "Building insulation", "HVAC upgrades"],
    is_active: true,
    funding_percentage: 30
  },
  {
    id: "wales-green-loan-2024",
    name: "Green Business Loan Scheme Wales",
    provider: "Development Bank of Wales",
    description: "Incentivised funding to support Welsh businesses investing in green technologies and sustainable operations.",
    amount_min: 1000,
    amount_max: 1500000,
    amount_description: "£1,000 - £1.5m at reduced rates",
    grant_type: "regional",
    eligibility_text: "Businesses based in Wales investing in environmental improvements, renewable energy, or sustainable practices.",
    business_types: ["All"],
    location_scope: ["Wales"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://developmentbank.wales/business-loans/green-business-loan",
    whats_covered: ["Renewable energy", "Energy efficiency", "Sustainable equipment", "Green technology"],
    is_active: true
  },
  {
    id: "gm-energy-efficiency-2024",
    name: "Greater Manchester Energy Efficiency Grant",
    provider: "Green Economy / Greater Manchester Combined Authority",
    description: "Grants for SMEs in Greater Manchester to fund energy efficiency improvements and reduce operating costs.",
    amount_min: 1000,
    amount_max: 5000,
    amount_description: "50% of costs up to £5,000",
    grant_type: "local_authority",
    eligibility_text: "SMEs based in Greater Manchester with fewer than 250 employees. Must demonstrate clear energy efficiency improvements.",
    business_types: ["All"],
    location_scope: ["North West"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://gmgreencity.com/green-economy/",
    whats_covered: ["LED lighting", "Heating upgrades", "Insulation", "Smart controls"],
    is_active: true,
    funding_percentage: 50
  },
  {
    id: "coventry-warwick-green-2024",
    name: "Coventry & Warwickshire Green Business Programme",
    provider: "Coventry City Council / CWLEP",
    description: "Substantial grants to help businesses in the region install energy efficiency measures and renewable technologies.",
    amount_min: 1000,
    amount_max: 50000,
    amount_description: "£1,000 - £50,000 (up to 40% of costs)",
    grant_type: "local_authority",
    eligibility_text: "Businesses located in Coventry or Warwickshire. Must be investing in eligible energy efficiency or renewable energy measures.",
    business_types: ["Manufacturing", "Retail", "Hospitality", "Professional Services"],
    location_scope: ["West Midlands"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://www.cwgrowthhub.co.uk/green-business-programme",
    whats_covered: ["LED lighting", "Heating systems", "Solar PV", "Building fabric improvements", "Renewable technologies"],
    is_active: true,
    funding_percentage: 40
  },
  {
    id: "hsbc-green-sme-2024",
    name: "HSBC UK Green SME Fund",
    provider: "HSBC UK",
    description: "£500 million lending pool to help small businesses transition to greener operations with cashback incentive.",
    amount_min: 1000,
    amount_max: 250000,
    amount_description: "From £1,000 with 1% cashback",
    grant_type: "bank_scheme",
    eligibility_text: "UK businesses with turnover under £25 million. Must be investing in eligible green improvements.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://www.business.hsbc.uk/en-gb/financing-and-credit/green-lending",
    whats_covered: ["Solar panels", "Electric vehicles", "Energy efficient equipment", "Building improvements"],
    is_active: true
  },
  {
    id: "barclays-green-loan-2024",
    name: "Barclays Green Loan",
    provider: "Barclays Business",
    description: "Dedicated financing for SMEs to fund sustainable green projects with flexible repayment terms.",
    amount_min: 25000,
    amount_max: 5000000,
    amount_description: "£25k - £5m with competitive rates",
    grant_type: "bank_scheme",
    eligibility_text: "UK registered businesses with viable green project plans. Subject to credit approval.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://www.barclays.co.uk/business-banking/borrow/green-loans/",
    whats_covered: ["Solar and wind energy", "EPC improvements", "Eco-friendly machinery", "Electric fleet"],
    is_active: true
  },
  {
    id: "natwest-green-loan-2024",
    name: "NatWest Green Loan",
    provider: "NatWest Business",
    description: "Financing to help businesses meet sustainability goals through funding for eco-friendly projects.",
    amount_min: 25001,
    amount_max: 10000000,
    amount_description: "£25k+ with green rate discount",
    grant_type: "bank_scheme",
    eligibility_text: "NatWest business customers with qualifying green projects. Credit assessment required.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://www.natwest.com/business/loans/green-loans.html",
    whats_covered: ["Solar panels", "Electric vehicles", "Heat pumps", "Energy efficient equipment"],
    is_active: true
  },
  {
    id: "hammersmith-energy-2024",
    name: "Hammersmith & Fulham Energy Efficiency Grant",
    provider: "London Borough of Hammersmith & Fulham",
    description: "Local grants for SMEs to implement energy efficiency measures from LED lighting to heat pump installations.",
    amount_min: 1000,
    amount_max: 5000,
    amount_description: "£1,000 for small measures, up to £5,000 for major upgrades",
    grant_type: "local_authority",
    eligibility_text: "Businesses located in Hammersmith & Fulham. Priority given to retail, hospitality, and community businesses.",
    business_types: ["Retail", "Hospitality", "Professional Services"],
    location_scope: ["London"],
    sectors: ["Retail", "Hospitality", "Services"],
    deadline: null,
    application_link: "https://www.lbhf.gov.uk/business/energy-efficiency-grants-smes",
    whats_covered: ["LED lightbulbs", "Draught proofing", "Double glazing", "Heat pumps"],
    is_active: true
  },
  {
    id: "low-carbon-east-mids-2024",
    name: "Low Carbon Business Support Programme",
    provider: "East Midlands Chamber",
    description: "Comprehensive support for East Midlands SMEs including energy audits, carbon reduction planning, and capital grants.",
    amount_min: 1000,
    amount_max: 20000,
    amount_description: "Up to £20,000 (40% of eligible costs)",
    grant_type: "regional",
    eligibility_text: "SMEs in East Midlands (Derbyshire, Nottinghamshire, Leicestershire, Lincolnshire, Northamptonshire). Must employ fewer than 250 staff.",
    business_types: ["Manufacturing", "Retail", "Professional Services", "Hospitality"],
    location_scope: ["East Midlands"],
    sectors: ["All"],
    deadline: null,
    application_link: "https://www.emc-dnl.co.uk/low-carbon-business-support",
    whats_covered: ["Energy audits", "LED lighting", "Heating upgrades", "Renewable energy", "Process improvements"],
    is_active: true,
    funding_percentage: 40
  }
];

export const realSubsidies: RealSubsidy[] = [
  {
    id: "rd-tax-credits-2024",
    name: "R&D Tax Credits (Merged Scheme)",
    description: "Tax relief for companies conducting qualifying research and development activities, including green technology innovation, recyclable materials development, and energy efficiency solutions.",
    subsidy_type: "tax_relief",
    eligibility_text: "UK companies undertaking qualifying R&D activities. From April 2024, a single merged scheme offers 20% credit on qualifying R&D spend.",
    business_types: ["Technology", "Manufacturing", "Construction", "Professional Services"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "20% credit on qualifying spend (15-16.2% after tax)",
    application_link: "https://www.gov.uk/guidance/corporation-tax-research-and-development-rd-relief",
    deadline: null,
    is_active: true
  },
  {
    id: "full-expensing-2024",
    name: "Full Expensing - 100% Capital Allowances",
    description: "Claim 100% of qualifying plant and machinery costs in the year of purchase, including solar panels, electric vehicles, heat pumps, and energy efficient equipment.",
    subsidy_type: "capital_allowance",
    eligibility_text: "Companies paying corporation tax. Equipment must be new and unused. Includes most plant and machinery used for business purposes.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "100% first year deduction on qualifying assets",
    application_link: "https://www.gov.uk/guidance/capital-allowances-and-full-expensing",
    deadline: null,
    is_active: true
  },
  {
    id: "zero-emission-vehicles-2024",
    name: "Zero-Emission Vehicle Allowances",
    description: "100% first-year capital allowance for electric and zero-emission cars, vans, and workplace charging points.",
    subsidy_type: "capital_allowance",
    eligibility_text: "Businesses purchasing new zero-emission vehicles or installing workplace charge points. Available until 31 March 2026.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "100% first year allowance",
    application_link: "https://www.gov.uk/capital-allowances/first-year-allowances",
    deadline: "2026-03-31",
    is_active: true
  },
  {
    id: "annual-investment-allowance-2024",
    name: "Annual Investment Allowance (AIA)",
    description: "100% first-year relief on qualifying capital expenditure up to £1 million per year, covering most plant and machinery including energy efficient equipment.",
    subsidy_type: "capital_allowance",
    eligibility_text: "All UK businesses regardless of size. Permanent allowance of £1 million per year. Shared between associated businesses.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "100% relief on first £1m of capital spend annually",
    application_link: "https://www.gov.uk/capital-allowances/annual-investment-allowance",
    deadline: null,
    is_active: true
  },
  {
    id: "vat-energy-saving-2024",
    name: "Zero-Rate VAT on Energy Saving Materials",
    description: "Zero-rated VAT on installations of heat pumps, insulation, solar panels, and similar energy-saving materials in residential and charitable buildings.",
    subsidy_type: "tax_relief",
    eligibility_text: "Residential properties and buildings used by charities. Installation must be carried out by VAT-registered businesses.",
    business_types: ["Construction", "Professional Services"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "0% VAT (saving 20%)",
    application_link: "https://www.gov.uk/guidance/vat-on-energy-saving-materials-and-heating-equipment-notice-7086",
    deadline: "2027-03-31",
    is_active: true
  },
  {
    id: "climate-change-agreements-2024",
    name: "Climate Change Agreements (CCA)",
    description: "Voluntary agreements between UK industry and the Environment Agency to reduce energy use and carbon emissions in exchange for reduced Climate Change Levy.",
    subsidy_type: "rate_reduction",
    eligibility_text: "Energy-intensive businesses in eligible sectors including manufacturing, hospitality, and agriculture. Must commit to energy efficiency targets.",
    business_types: ["Manufacturing", "Hospitality", "Agriculture"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "Up to 92% discount on Climate Change Levy",
    application_link: "https://www.gov.uk/guidance/climate-change-agreements--2",
    deadline: null,
    is_active: true
  },
  {
    id: "enhanced-capital-allowances-2024",
    name: "Enhanced Capital Allowances (Energy Technology List)",
    description: "100% first-year tax relief for investments in approved energy-efficient equipment listed on the Energy Technology List.",
    subsidy_type: "capital_allowance",
    eligibility_text: "Businesses investing in equipment on the government's Energy Technology List including LED lighting, efficient motors, and heat recovery systems.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "100% first year allowance",
    application_link: "https://www.gov.uk/guidance/energy-technology-list",
    deadline: null,
    is_active: true
  },
  {
    id: "land-remediation-relief-2024",
    name: "Land Remediation Relief",
    description: "Additional corporation tax deduction for companies remediating contaminated or derelict land, encouraging sustainable site development.",
    subsidy_type: "tax_relief",
    eligibility_text: "UK companies incurring qualifying expenditure on cleaning up contaminated land acquired from an unconnected party. Land must have been contaminated by previous owners.",
    business_types: ["Construction", "Manufacturing", "Professional Services"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "150% tax deduction on qualifying costs",
    application_link: "https://www.gov.uk/guidance/corporation-tax-land-remediation-relief",
    deadline: null,
    is_active: true
  },
  {
    id: "structures-buildings-allowance-2024",
    name: "Structures and Buildings Allowance",
    description: "Tax relief for constructing or renovating commercial buildings, including those with energy efficiency improvements.",
    subsidy_type: "capital_allowance",
    eligibility_text: "UK businesses constructing or renovating non-residential structures and buildings. Applies to construction costs including sustainable building features.",
    business_types: ["All"],
    location_scope: ["UK-wide"],
    min_employees: null,
    max_employees: null,
    value_description: "3% annual relief over 33+ years",
    application_link: "https://www.gov.uk/guidance/structures-and-buildings-allowance",
    deadline: null,
    is_active: true
  }
];

// Industry-specific emission factors and questions
export const industryEmissionFactors = {
  manufacturing: {
    label: "Manufacturing",
    description: "Factories, production facilities, industrial processes",
    specificQuestions: [
      { id: "production_energy", label: "Production machinery energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "compressed_air", label: "Compressed air systems (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "industrial_gas", label: "Industrial gas usage (m³)", unit: "m³", factor: 2.02, scope: 1 },
      { id: "process_heat", label: "Process heating fuel (kWh)", unit: "kWh", factor: 0.184, scope: 1 },
      { id: "raw_materials_tonnes", label: "Raw materials processed (tonnes)", unit: "tonnes", factor: 50, scope: 3 },
    ],
    avgEmissionsPerEmployee: 8500, // kg CO2e
    benchmarkGood: 6000,
    benchmarkAverage: 10000,
  },
  retail: {
    label: "Retail",
    description: "Shops, stores, retail outlets",
    specificQuestions: [
      { id: "refrigeration", label: "Refrigeration/cooling (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "display_lighting", label: "Display and store lighting (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "deliveries_received", label: "Delivery truck visits per month", unit: "visits", factor: 25, scope: 3 },
      { id: "packaging_tonnes", label: "Packaging materials (tonnes)", unit: "tonnes", factor: 920, scope: 3 },
    ],
    avgEmissionsPerEmployee: 4200,
    benchmarkGood: 3000,
    benchmarkAverage: 5500,
  },
  hospitality: {
    label: "Hospitality",
    description: "Hotels, restaurants, cafes, pubs",
    specificQuestions: [
      { id: "commercial_cooking", label: "Commercial cooking gas (kWh)", unit: "kWh", factor: 0.184, scope: 1 },
      { id: "food_refrigeration", label: "Food refrigeration (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "laundry_water", label: "Laundry water usage (m³)", unit: "m³", factor: 0.344, scope: 3 },
      { id: "food_waste_tonnes", label: "Food waste (tonnes/year)", unit: "tonnes", factor: 580, scope: 3 },
      { id: "guest_nights", label: "Guest nights per year (hotels)", unit: "nights", factor: 15, scope: 3 },
    ],
    avgEmissionsPerEmployee: 5800,
    benchmarkGood: 4000,
    benchmarkAverage: 7500,
  },
  professional_services: {
    label: "Professional Services",
    description: "Offices, consultancies, legal, accounting",
    specificQuestions: [
      { id: "it_equipment", label: "IT equipment energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "data_storage", label: "Cloud/data centre usage (GB)", unit: "GB", factor: 0.0002, scope: 3 },
      { id: "paper_usage", label: "Paper usage (kg)", unit: "kg", factor: 0.919, scope: 3 },
      { id: "client_meetings_km", label: "Client travel (km/year)", unit: "km", factor: 0.171, scope: 3 },
    ],
    avgEmissionsPerEmployee: 2800,
    benchmarkGood: 2000,
    benchmarkAverage: 4000,
  },
  construction: {
    label: "Construction",
    description: "Building, civil engineering, trades",
    specificQuestions: [
      { id: "diesel_equipment", label: "Diesel equipment/machinery (litres)", unit: "litres", factor: 2.68, scope: 1 },
      { id: "concrete_tonnes", label: "Concrete used (tonnes)", unit: "tonnes", factor: 130, scope: 3 },
      { id: "steel_tonnes", label: "Steel used (tonnes)", unit: "tonnes", factor: 1850, scope: 3 },
      { id: "site_generator", label: "Site generator fuel (litres)", unit: "litres", factor: 2.68, scope: 1 },
      { id: "waste_skips", label: "Waste skips per year", unit: "skips", factor: 250, scope: 3 },
    ],
    avgEmissionsPerEmployee: 12000,
    benchmarkGood: 8000,
    benchmarkAverage: 15000,
  },
  transportation: {
    label: "Transportation & Logistics",
    description: "Haulage, delivery, logistics, transport services",
    specificQuestions: [
      { id: "hgv_diesel", label: "HGV diesel (litres)", unit: "litres", factor: 2.68, scope: 1 },
      { id: "van_diesel", label: "Van/LCV diesel (litres)", unit: "litres", factor: 2.68, scope: 1 },
      { id: "total_km_travelled", label: "Total fleet km per year", unit: "km", factor: 0.8, scope: 1 },
      { id: "warehouse_energy", label: "Warehouse energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
    ],
    avgEmissionsPerEmployee: 18000,
    benchmarkGood: 12000,
    benchmarkAverage: 22000,
  },
  healthcare: {
    label: "Healthcare",
    description: "Clinics, care homes, medical practices",
    specificQuestions: [
      { id: "medical_equipment", label: "Medical equipment energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "hvac_systems", label: "HVAC/climate control (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "medical_waste", label: "Clinical waste (kg)", unit: "kg", factor: 0.88, scope: 3 },
      { id: "sterilisation", label: "Sterilisation energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
    ],
    avgEmissionsPerEmployee: 6500,
    benchmarkGood: 4500,
    benchmarkAverage: 8500,
  },
  technology: {
    label: "Technology",
    description: "IT, software, digital services, data centres",
    specificQuestions: [
      { id: "server_energy", label: "Server/computing energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "cooling_systems", label: "Data centre cooling (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "employee_devices", label: "Employee devices (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "cloud_services", label: "Cloud service usage (TB)", unit: "TB", factor: 200, scope: 3 },
    ],
    avgEmissionsPerEmployee: 3500,
    benchmarkGood: 2500,
    benchmarkAverage: 5000,
  },
  agriculture: {
    label: "Agriculture",
    description: "Farming, livestock, horticulture",
    specificQuestions: [
      { id: "tractor_diesel", label: "Tractor/machinery diesel (litres)", unit: "litres", factor: 2.68, scope: 1 },
      { id: "livestock_count", label: "Cattle/livestock count", unit: "heads", factor: 2800, scope: 1 },
      { id: "fertiliser_tonnes", label: "Fertiliser used (tonnes)", unit: "tonnes", factor: 4650, scope: 3 },
      { id: "irrigation_energy", label: "Irrigation energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
    ],
    avgEmissionsPerEmployee: 35000,
    benchmarkGood: 25000,
    benchmarkAverage: 45000,
  },
  other: {
    label: "Other",
    description: "Other business types",
    specificQuestions: [
      { id: "general_equipment", label: "General equipment energy (kWh)", unit: "kWh", factor: 0.233, scope: 2 },
      { id: "supplies_spend", label: "Supplies spending (£)", unit: "£", factor: 0.5, scope: 3 },
    ],
    avgEmissionsPerEmployee: 4000,
    benchmarkGood: 3000,
    benchmarkAverage: 5500,
  }
};

// Common questions for all industries (Scope 1, 2, and basic Scope 3)
export const commonEmissionQuestions = {
  scope1: [
    { id: "natural_gas_kwh", label: "Natural gas consumption", unit: "kWh", factor: 0.184, description: "Gas for heating and hot water" },
    { id: "heating_oil_litres", label: "Heating oil", unit: "litres", factor: 2.96, description: "Oil for heating systems" },
    { id: "company_petrol_litres", label: "Company vehicle petrol", unit: "litres", factor: 2.31, description: "Petrol for owned/leased vehicles" },
    { id: "company_diesel_litres", label: "Company vehicle diesel", unit: "litres", factor: 2.68, description: "Diesel for owned/leased vehicles" },
  ],
  scope2: [
    { id: "electricity_kwh", label: "Electricity consumption", unit: "kWh", factor: 0.233, description: "Grid electricity usage" },
  ],
  scope3: [
    { id: "employee_commuting_km", label: "Employee commuting", unit: "km/year total", factor: 0.171, description: "Staff travel to work" },
    { id: "business_travel_km", label: "Business travel by car", unit: "km", factor: 0.171, description: "Client visits, meetings" },
    { id: "flights_short_haul", label: "Short-haul flights", unit: "flights", factor: 255, description: "UK/Europe flights" },
    { id: "flights_long_haul", label: "Long-haul flights", unit: "flights", factor: 1950, description: "International flights" },
    { id: "waste_general_kg", label: "General waste", unit: "kg", factor: 0.446, description: "Non-recycled waste" },
    { id: "water_m3", label: "Water consumption", unit: "m³", factor: 0.344, description: "Mains water usage" },
  ]
};

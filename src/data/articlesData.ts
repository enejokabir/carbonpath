// Comprehensive article content for the Learn hub
// Covers UK sustainability compliance, grants guidance, and practical tips

export interface ArticleContent {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  content: string;
  relatedArticles: string[];
  lastUpdated?: string;
}

export const articlesContent: Record<string, ArticleContent> = {
  // ==========================================
  // COMPLIANCE BASICS
  // ==========================================

  "what-is-sustainability-compliance": {
    slug: "what-is-sustainability-compliance",
    title: "What is Sustainability Compliance for UK SMEs?",
    category: "Compliance Basics",
    readTime: "6 min read",
    lastUpdated: "2024-12",
    content: `## Understanding Sustainability Compliance

Sustainability compliance refers to meeting the environmental regulations, reporting requirements, and standards that apply to your business. For UK SMEs, this increasingly means demonstrating your environmental credentials to customers, suppliers, and regulators.

### Why It Matters Now

The landscape has shifted dramatically. What was once voluntary is becoming mandatory:

- **Large customers are requiring it**: Major corporations must report on their entire supply chain emissions (Scope 3). They're pushing requirements down to suppliers - that's you.
- **Regulation is expanding**: The UK government is progressively lowering thresholds, bringing more SMEs into mandatory reporting.
- **Finance is linked to sustainability**: Banks and investors increasingly factor environmental performance into lending decisions.
- **Customers are choosing sustainable suppliers**: 73% of UK consumers say they would change their purchasing habits to reduce environmental impact.

### What Compliance Actually Means

For most SMEs, sustainability compliance involves:

**1. Understanding Your Obligations**
Different businesses have different requirements based on:
- Annual turnover and balance sheet size
- Employee numbers
- Industry sector
- Customer requirements

**2. Measuring What Matters**
At minimum, you should understand:
- Energy consumption (electricity, gas, fuel)
- Waste generation and disposal
- Business travel emissions
- Key environmental impacts of your operations

**3. Documenting Your Position**
This includes:
- Environmental policy statement
- Evidence of energy consumption
- Waste transfer notes
- Supply chain information

**4. Reporting and Disclosure**
Depending on your size and sector:
- Annual reports may need environmental sections
- Customers may require completed sustainability questionnaires
- Tender submissions increasingly include environmental criteria

### The Business Case

Beyond compliance, there are real business benefits:

- **Cost savings**: Energy efficiency measures typically pay back within 2-5 years
- **Competitive advantage**: Stand out in tenders and win contracts
- **Risk management**: Prepare for tightening regulations
- **Access to finance**: Green loans often have preferential rates
- **Talent attraction**: Employees increasingly want to work for sustainable businesses

### Getting Started

Don't try to do everything at once. Start with:

1. **Complete a readiness assessment** to understand your current position
2. **Gather your energy data** - utility bills are the starting point
3. **Document what you're already doing** - you're probably further along than you think
4. **Identify quick wins** - LED lighting, smart heating controls, waste reduction
5. **Build an evidence locker** - organised documentation makes everything easier

The key is to start. Perfect is the enemy of good in sustainability - progress matters more than perfection.`,
    relatedArticles: ["why-it-matters-for-smes", "evidence-locker-explained", "compliance-checklist"],
  },

  "why-it-matters-for-smes": {
    slug: "why-it-matters-for-smes",
    title: "Why Sustainability Matters for SMEs",
    category: "Compliance Basics",
    readTime: "5 min read",
    lastUpdated: "2024-12",
    content: `## The SME Sustainability Imperative

If you're running an SME, you might wonder why sustainability should be on your radar when you're focused on day-to-day operations. The short answer: it's increasingly affecting your ability to win work, access finance, and stay competitive.

### The Supply Chain Effect

Large companies now face mandatory Scope 3 reporting - they must measure and report emissions from their entire supply chain. This has a direct impact on SMEs:

- **Questionnaires are multiplying**: Expect sustainability surveys from major customers
- **Tender requirements are changing**: Environmental criteria now feature in procurement decisions
- **Preferred supplier lists**: Companies are curating lists of "sustainable suppliers"

A 2024 survey found that 68% of large UK companies plan to require sustainability data from suppliers within the next two years.

### Financial Incentives Are Real

Banks and financial institutions are building sustainability into lending:

- **Green loans**: Lower interest rates for sustainable businesses
- **Sustainability-linked facilities**: Rates tied to environmental performance
- **Grant eligibility**: Many grants require baseline sustainability credentials
- **Insurance considerations**: Some insurers offer discounts for sustainable operations

### The Cost of Inaction

Failing to address sustainability carries risks:

- **Lost contracts**: Being excluded from tenders due to missing credentials
- **Higher costs**: Missing out on energy efficiency savings
- **Regulatory risk**: Being caught out when thresholds lower
- **Reputation damage**: Customers increasingly choosing sustainable alternatives

### What SMEs Should Focus On

You don't need to transform overnight. Focus on:

**Energy Management**
- Understand your consumption patterns
- Identify efficiency opportunities
- Consider renewable energy options

**Evidence Collection**
- Utility bills and smart meter data
- Waste transfer documentation
- Policy documents and procedures

**Quick Wins**
- LED lighting (often 50%+ energy savings)
- Smart heating controls
- Staff awareness and behaviour change
- Waste reduction and recycling

**Communication**
- Environmental policy statement
- Customer-facing sustainability information
- Supply chain engagement

### The Opportunity

SMEs that get ahead of sustainability requirements are finding real advantages:

- Winning contracts others can't compete for
- Accessing preferential finance rates
- Reducing operating costs
- Attracting motivated employees
- Building resilient businesses

The businesses that thrive will be those that see sustainability not as a burden, but as a business opportunity.`,
    relatedArticles: ["what-is-sustainability-compliance", "types-of-grants", "uk-sustainability-regulations"],
  },

  "evidence-locker-explained": {
    slug: "evidence-locker-explained",
    title: "Building Your Evidence Locker: A Practical Guide",
    category: "Compliance Basics",
    readTime: "7 min read",
    lastUpdated: "2024-12",
    content: `## What is an Evidence Locker?

An evidence locker is your organised collection of sustainability-related documents and data. Think of it as your compliance toolkit - everything you need to demonstrate your environmental credentials, respond to customer requests, and track your progress.

### Why You Need One

**Responding to Requests**
When a major customer sends a sustainability questionnaire, you need quick access to:
- Energy consumption data
- Policy documents
- Certifications
- Waste management records

**Tender Submissions**
Environmental criteria in tenders require evidence. Having documents ready means you can respond quickly and completely.

**Tracking Progress**
You can't improve what you don't measure. An organised evidence locker helps you see trends and demonstrate improvement.

**Regulatory Compliance**
As reporting requirements expand, having your data organised makes compliance straightforward.

### What to Include

**Essential Documents**

| Category | Documents to Collect |
|----------|---------------------|
| Energy | Utility bills (12+ months), Smart meter data, DEC certificates |
| Environmental Policy | Policy statement, Environmental objectives, Review dates |
| Waste | Waste transfer notes, Recycling records, Hazardous waste consignments |
| Supply Chain | Supplier sustainability statements, Key supplier certifications |
| Training | Environmental training records, Induction materials |
| Certifications | ISO 14001, Industry certifications, Accreditations |

**Nice to Have**
- Carbon footprint calculations
- Energy audits or assessments
- Improvement project documentation
- Staff engagement evidence
- Customer sustainability reports

### Organising Your Evidence

**By Category**
Create clear folders for each evidence type:
- Energy Management
- Waste Management
- Environmental Policy
- Supply Chain
- Certifications
- Training Records
- Audit Reports

**By Time Period**
Maintain historical records:
- Current year (most detailed)
- Previous 2-3 years (annual summaries)
- Archive (keep for audit purposes)

**By Status**
Track document validity:
- Current (valid and up to date)
- Expiring Soon (needs renewal within 90 days)
- Expired (needs updating)
- Needs Review (requires attention)

### Keeping It Current

Set reminders for:
- **Monthly**: Upload utility bills, update consumption data
- **Quarterly**: Review expiring documents, check compliance status
- **Annually**: Policy reviews, certification renewals, year-end summaries

### Common Mistakes to Avoid

- **Scattered storage**: Documents across emails, drives, and paper files
- **Outdated information**: Old policies or expired certifications
- **Missing context**: Data without explanation or methodology
- **Poor naming**: Files named "Document1" or "Final_v3_updated"
- **No backup**: Single point of failure for important records

### Getting Started

1. **Audit what you have**: Gather existing documents from across the business
2. **Identify gaps**: What's missing from the essential list?
3. **Set up structure**: Create logical folders and naming conventions
4. **Assign ownership**: Who is responsible for each category?
5. **Schedule reviews**: Calendar reminders for updates and renewals

Your evidence locker doesn't need to be perfect from day one. Start with what you have, build good habits, and improve over time.`,
    relatedArticles: ["compliance-checklist", "what-is-sustainability-compliance", "preparing-grant-applications"],
  },

  "compliance-checklist": {
    slug: "compliance-checklist",
    title: "SME Sustainability Compliance Checklist",
    category: "Compliance Basics",
    readTime: "8 min read",
    lastUpdated: "2024-12",
    content: `## Your Sustainability Compliance Checklist

Use this checklist to assess your current position and identify gaps. Not everything will apply to your business - focus on what's relevant to your size, sector, and customer requirements.

### Foundational Requirements

**Environmental Policy**
- [ ] Written environmental policy statement
- [ ] Policy approved by senior management
- [ ] Policy communicated to all staff
- [ ] Annual review date scheduled
- [ ] Policy accessible to customers/stakeholders

**Energy Management**
- [ ] 12 months of utility data collected
- [ ] Energy consumption tracked by type (electricity, gas, fuel)
- [ ] Major energy uses identified
- [ ] Energy efficiency measures documented
- [ ] Smart meters installed (where applicable)

**Waste Management**
- [ ] Waste transfer notes retained (3 years minimum)
- [ ] Hazardous waste consignment notes (if applicable)
- [ ] Recycling arrangements documented
- [ ] Waste contractor certifications on file
- [ ] Waste reduction initiatives documented

### Regulatory Requirements

**SECR (Streamlined Energy and Carbon Reporting)**
Applies if your company meets 2 of 3 criteria:
- More than 250 employees
- Annual turnover over £36 million
- Balance sheet over £18 million

If applicable:
- [ ] Energy consumption data for reporting
- [ ] Methodology for calculations documented
- [ ] Intensity ratio calculated
- [ ] Energy efficiency actions described
- [ ] Director's report includes required disclosures

**ESOS (Energy Savings Opportunity Scheme)**
Applies to large undertakings (250+ employees or £44m turnover):
- [ ] ESOS assessment completed
- [ ] Lead assessor appointed
- [ ] Energy audits conducted
- [ ] Recommendations documented
- [ ] Board sign-off obtained

### Customer Requirements

**Supply Chain Requests**
- [ ] Standard sustainability questionnaire responses ready
- [ ] Carbon footprint data available (if requested)
- [ ] Modern slavery statement (if applicable)
- [ ] Supplier code of conduct signed
- [ ] Key certifications current

**Tender Preparation**
- [ ] Environmental questions answered in template format
- [ ] Case studies of environmental initiatives
- [ ] Quantified environmental achievements
- [ ] Relevant certifications and accreditations
- [ ] References for environmental performance

### Optional but Recommended

**Certifications**
- [ ] ISO 14001 (Environmental Management System)
- [ ] ISO 50001 (Energy Management)
- [ ] Industry-specific certifications
- [ ] Carbon neutral certification

**Carbon Footprint**
- [ ] Scope 1 emissions calculated (direct)
- [ ] Scope 2 emissions calculated (electricity)
- [ ] Key Scope 3 emissions estimated
- [ ] Reduction targets set
- [ ] Progress tracked annually

**Staff Engagement**
- [ ] Environmental training provided
- [ ] Staff suggestions scheme
- [ ] Environmental champions appointed
- [ ] Regular communications on progress

### Quick Assessment

Score yourself:
- **Foundational complete**: You have the basics covered
- **Regulatory compliant**: You meet legal requirements
- **Customer-ready**: You can respond to supply chain requests
- **Leading practice**: You're ahead of requirements

### Next Steps by Score

**Just Starting (0-5 items)**
Focus on foundational requirements first. Get your policy written, start collecting energy data, and organise your waste documentation.

**Building (6-12 items)**
Good progress. Focus on completing the foundational section and preparing for customer requests. Consider your regulatory position.

**Established (13-20 items)**
Strong position. Look at optional certifications and leading practices. Consider carbon footprint measurement.

**Leading (20+ items)**
Excellent. Focus on continuous improvement, setting targets, and using your position as a competitive advantage.

### Getting Help

If you're unsure about requirements:
- Use our readiness assessment to get a personalised view
- Connect with a sustainability consultant for expert guidance
- Check gov.uk for official regulatory guidance
- Join industry associations for sector-specific support`,
    relatedArticles: ["evidence-locker-explained", "uk-sustainability-regulations", "current-legislation"],
  },

  // ==========================================
  // UK POLICY LANDSCAPE
  // ==========================================

  "uk-sustainability-regulations": {
    slug: "uk-sustainability-regulations",
    title: "UK Sustainability Regulations: What SMEs Need to Know",
    category: "UK Policy Landscape",
    readTime: "9 min read",
    lastUpdated: "2024-12",
    content: `## The UK Regulatory Landscape

The UK's approach to business sustainability is evolving rapidly. What was once the domain of large corporations is progressively affecting SMEs through direct regulation, supply chain requirements, and financial sector expectations.

### Key Regulatory Frameworks

**SECR - Streamlined Energy and Carbon Reporting**

SECR requires qualifying companies to report energy use and carbon emissions in their annual reports.

*Current thresholds (must meet 2 of 3):*
- More than 250 employees
- Annual turnover over £36 million
- Annual balance sheet over £18 million

*What you must report:*
- UK energy use (electricity, gas, transport fuel)
- Associated greenhouse gas emissions
- At least one intensity ratio
- Energy efficiency actions taken

*Why SMEs should care:*
Even if below thresholds, many SMEs choose to report voluntarily for:
- Customer requirements
- Tender eligibility
- Demonstrating leadership
- Preparation for lowering thresholds

**ESOS - Energy Savings Opportunity Scheme**

ESOS requires large undertakings to conduct energy audits every 4 years.

*Current thresholds:*
- 250+ employees, OR
- Annual turnover exceeding £44 million AND balance sheet exceeding £38 million

*Requirements:*
- Measure total energy consumption
- Conduct energy audits of buildings, processes, and transport
- Identify energy saving opportunities
- Board-level sign-off

**Climate-Related Financial Disclosures**

From 2022, large companies must make climate-related disclosures aligned with TCFD recommendations. This is cascading to SMEs through:
- Supply chain questionnaires
- Lending requirements
- Insurance assessments

### Sector-Specific Regulations

**Construction**
- PAS 2080 for infrastructure carbon management
- Building Regulations Part L (energy efficiency)
- Procurement requirements for Scope 3 reporting

**Manufacturing**
- Industrial Emissions Directive (for larger operations)
- Producer responsibility regulations
- Packaging waste regulations

**Transport & Logistics**
- Clean Air Zones in major cities
- Fleet reporting requirements
- Zero emission vehicle mandates

**Retail & Hospitality**
- Packaging waste regulations
- Food waste reporting (coming)
- Display Energy Certificates

### The Direction of Travel

Expect regulations to:
- **Lower thresholds**: More SMEs brought into scope
- **Expand scope**: More emissions categories required
- **Increase rigour**: More verification and assurance
- **Accelerate timelines**: Faster implementation of requirements

### Practical Steps for SMEs

**Understand Your Position**
- Check if you meet current thresholds
- Identify which supply chain requirements apply
- Assess customer expectations

**Prepare for the Future**
- Start measuring now (even if not required)
- Build your evidence locker
- Develop internal capability

**Leverage Support**
- Government grants for energy efficiency
- Subsidised energy audits
- Tax incentives for sustainable investment

### Key Resources

- gov.uk/guidance/energy-and-carbon-reporting
- Environment Agency guidance
- Trade association resources
- Carbon Path readiness assessment`,
    relatedArticles: ["current-legislation", "upcoming-regulations", "compliance-checklist"],
  },

  "current-legislation": {
    slug: "current-legislation",
    title: "Current UK Sustainability Legislation",
    category: "UK Policy Landscape",
    readTime: "7 min read",
    lastUpdated: "2024-12",
    content: `## Current Legislation Affecting UK Businesses

This guide covers the main environmental legislation currently in force that may affect your business. Requirements vary by size, sector, and activities.

### Energy and Carbon

**Climate Change Act 2008 (as amended)**
- Legally binding target: net zero emissions by 2050
- Carbon budgets setting interim targets
- Drives all subsequent climate policy

**SECR Regulations 2019**
- Mandatory energy and carbon reporting for qualifying companies
- Included in Directors' Report
- Applies to quoted companies and large unquoted companies

**ESOS Regulations 2014**
- Energy audits for large undertakings
- 4-year compliance cycles
- Phase 3 deadline: December 2023

**Energy Performance of Buildings**
- EPCs required for commercial property transactions
- Minimum EPC ratings for lettings (currently E, rising to C)
- Display Energy Certificates for public buildings

### Waste and Resources

**Environmental Protection Act 1990**
- Duty of Care for waste
- Waste transfer notes required
- Hazardous waste controls

**Producer Responsibility Regulations**
- Packaging waste obligations
- WEEE (electrical waste) requirements
- Battery regulations

**Landfill Tax**
- £102.10 per tonne (standard rate, 2024)
- Incentive to reduce, reuse, recycle

### Pollution and Emissions

**Environmental Permitting Regulations**
- Permits for certain industrial activities
- Water discharge consents
- Air quality requirements

**Clean Air Zones**
- Daily charges for non-compliant vehicles
- Expanding to more UK cities
- Affects fleet operations

**F-Gas Regulations**
- Controls on fluorinated gases
- Affects refrigeration and air conditioning
- Phase-down of high-GWP gases

### Coming Into Force

**Environment Act 2021**
- Extended Producer Responsibility (2024+)
- Deposit Return Scheme (Scotland live, England delayed)
- Biodiversity Net Gain for development

**Energy Bill**
- Building performance standards
- Heat network regulation
- Smart meter rollout

### How This Affects SMEs

**Direct Requirements**
Many SMEs fall below direct regulatory thresholds but may still be affected through:
- Landlord requirements (EPC minimums)
- Customer supply chain requirements
- Tender eligibility criteria

**Indirect Requirements**
Large company regulations cascade to SMEs:
- Scope 3 reporting drives supplier questionnaires
- Climate disclosure requirements affect lending
- Investor expectations influence financing

### Compliance Checklist

For most SMEs, focus on:
- [ ] Waste duty of care compliance
- [ ] Energy performance (if property owner/tenant)
- [ ] Vehicle emissions (if fleet operations)
- [ ] Customer-driven requirements
- [ ] Sector-specific obligations

### Staying Updated

Regulations change frequently. Stay informed through:
- gov.uk environmental guidance
- Trade association updates
- Professional body briefings
- Carbon Path news and updates`,
    relatedArticles: ["uk-sustainability-regulations", "upcoming-regulations", "types-of-grants"],
  },

  "upcoming-regulations": {
    slug: "upcoming-regulations",
    title: "Upcoming UK Sustainability Regulations",
    category: "UK Policy Landscape",
    readTime: "6 min read",
    lastUpdated: "2024-12",
    content: `## What's Coming: Future UK Regulations

Sustainability regulations are evolving rapidly. Here's what SMEs should prepare for in the coming years.

### Confirmed Changes

**Extended Producer Responsibility (EPR)**
*Coming: 2024-2025*
- Packaging producers pay full disposal costs
- Applies to businesses handling 50+ tonnes of packaging
- Modulated fees based on recyclability
- Reporting requirements from 2024

**Deposit Return Scheme**
*Scotland: Live | England: Delayed to 2027*
- Deposits on drinks containers
- Affects retailers and producers
- Return infrastructure requirements

**Plastic Packaging Tax**
*In force, expanding*
- £210.82 per tonne (2024)
- Applies to plastic packaging <30% recycled content
- Threshold: 10+ tonnes per year

**Building Energy Performance**
*Phased implementation*
- Minimum EPC C for commercial lettings (target 2027-2028)
- Non-domestic building performance standards
- Heat pump rollout requirements

### Expected Developments

**SECR Threshold Reduction**
- Current lobbying to lower thresholds
- More SMEs likely to be captured
- Prepare now even if below current limits

**Scope 3 Reporting Expansion**
- Large companies' requirements cascade to suppliers
- Expect more detailed supply chain requests
- Data requirements becoming more specific

**Climate Risk Disclosure**
- TCFD-aligned reporting expanding
- Banks requiring climate risk assessments
- Insurance pricing reflecting climate exposure

**Nature and Biodiversity**
- Biodiversity Net Gain for development
- Nature-related financial disclosures (TNFD)
- Supply chain deforestation requirements

### Sector-Specific Outlook

**Construction**
- Whole life carbon assessments becoming standard
- Material passport requirements
- Circular economy obligations

**Manufacturing**
- Product carbon footprint requirements
- Right to repair legislation
- Sustainable product design rules

**Transport**
- Zero emission vehicle mandates
- Clean Air Zone expansion
- Alternative fuel infrastructure

**Food & Agriculture**
- Food waste reporting requirements
- Scope 3 emissions focus
- Deforestation-free supply chains

### How to Prepare

**Start Measuring Now**
Even if not required, building data capability now means:
- Easier compliance when regulations arrive
- Competitive advantage in tenders
- Better cost management

**Engage Your Supply Chain**
- Understand supplier sustainability positions
- Identify risks and dependencies
- Build collaborative relationships

**Build Internal Capability**
- Train key staff
- Establish processes
- Invest in systems

**Watch the Signals**
- Monitor government consultations
- Track industry body responses
- Engage with trade associations

### Timeline Summary

| Timeframe | Expected Change |
|-----------|----------------|
| 2024 | EPR reporting starts, Building regs tighten |
| 2025 | EPR fees apply, Scope 3 pressure increases |
| 2026-27 | SECR thresholds may lower, EPC C target |
| 2028+ | Net zero acceleration, comprehensive requirements |

The direction is clear: requirements will expand, thresholds will lower, and expectations will increase. The businesses that prepare now will be best positioned.`,
    relatedArticles: ["current-legislation", "uk-sustainability-regulations", "types-of-grants"],
  },

  // ==========================================
  // FINANCIAL OPPORTUNITIES
  // ==========================================

  "types-of-grants": {
    slug: "types-of-grants",
    title: "Types of Sustainability Grants for UK SMEs",
    category: "Financial Opportunities",
    readTime: "8 min read",
    lastUpdated: "2024-12",
    content: `## Understanding Sustainability Grants

Grants are funding that doesn't need to be repaid - essentially free money to invest in your business's sustainability. The UK offers various grants for SMEs looking to reduce emissions, improve efficiency, or develop sustainable products.

### Grant Categories

**Energy Efficiency Grants**
Help with reducing energy consumption through:
- Lighting upgrades (LED conversions)
- Heating system improvements
- Insulation and building fabric
- Energy management systems
- Process efficiency improvements

*Examples:*
- Local authority energy grants
- Energy efficiency voucher schemes
- Utility company funded programmes

**Renewable Energy Grants**
Support for generating your own clean energy:
- Solar PV installation
- Battery storage
- Small-scale wind
- Heat pumps and biomass

*Examples:*
- Boiler Upgrade Scheme (heat pumps)
- Local renewable energy grants
- Community energy funding

**Electric Vehicle Grants**
Transition to zero-emission transport:
- Vehicle purchase grants
- Charging infrastructure
- Fleet transition support

*Examples:*
- Workplace Charging Scheme
- Local authority EV grants
- Fleet transition programmes

**Innovation Grants**
Develop new sustainable products or processes:
- R&D funding
- Prototype development
- Market testing
- Technology demonstration

*Examples:*
- Innovate UK funding
- Net Zero Innovation Portfolio
- Catapult centre programmes

**Decarbonisation Grants**
Large-scale carbon reduction projects:
- Industrial process changes
- Fuel switching
- Carbon capture readiness

*Examples:*
- Industrial Energy Transformation Fund
- Industrial Decarbonisation Challenge
- Sector-specific funds

### How Grants Work

**Match Funding**
Most grants require you to contribute:
- Typically 30-70% of project cost
- Your contribution can be cash or in-kind
- Some grants cover higher percentages for smaller businesses

**Eligible Costs**
Usually covers:
- Equipment and installation
- Professional fees (surveys, design)
- Project management
- Some operational costs during implementation

**Typical Process**
1. Check eligibility criteria
2. Gather required information
3. Submit application (often competitive)
4. Assessment and decision
5. Grant offer and acceptance
6. Project delivery
7. Claim and verification

### Finding Grants

**National Programmes**
- gov.uk/business-finance-support
- Innovate UK funding finder
- Carbon Trust programmes

**Regional Funds**
- Local Enterprise Partnerships
- Combined Authority programmes
- Local authority schemes

**Sector-Specific**
- Trade association programmes
- Industry-led initiatives
- Supply chain funded schemes

**Utility Companies**
- Obligation-funded schemes
- Energy company programmes
- Distribution network funding

### Application Tips

**Before Applying**
- Ensure you meet all eligibility criteria
- Have your evidence ready (accounts, energy data)
- Understand match funding requirements
- Check deadlines and timelines

**Strong Applications**
- Clear project description
- Quantified benefits (energy savings, carbon reduction)
- Realistic costs and timelines
- Evidence of capability to deliver

**Common Mistakes**
- Missing eligibility criteria
- Incomplete applications
- Unrealistic projections
- Missing deadlines
- Not demonstrating need

### Getting Help

Many SMEs benefit from support with applications:
- Grant writing consultants
- Accountants familiar with grants
- Trade associations
- Local Growth Hubs

Use Carbon Path's consultant directory to find grant application specialists in your area.`,
    relatedArticles: ["tax-incentives-overview", "preparing-grant-applications", "why-it-matters-for-smes"],
  },

  "tax-incentives-overview": {
    slug: "tax-incentives-overview",
    title: "Tax Incentives for Sustainable Business Investment",
    category: "Financial Opportunities",
    readTime: "7 min read",
    lastUpdated: "2024-12",
    content: `## Tax Relief for Sustainability Investments

Beyond grants, the UK tax system offers significant incentives for businesses investing in sustainability. These can dramatically reduce the effective cost of energy efficiency, renewable energy, and low-emission vehicles.

### Capital Allowances

**Full Expensing (100% First-Year Allowance)**
*For companies only*
- 100% deduction in year of purchase
- Applies to new main rate plant and machinery
- Includes most energy efficiency equipment
- Permanent from April 2023

*Example:* £100,000 solar installation = £25,000 tax saving (at 25% corporation tax)

**Annual Investment Allowance (AIA)**
*For all businesses*
- 100% deduction up to £1 million per year
- Covers plant and machinery
- Includes most sustainability investments
- Available to sole traders and partnerships

**Energy Technology List (ETL)**
*Enhanced capital allowances for qualifying technologies*
- Products meeting efficiency criteria
- Heat pumps, LED lighting, motors, etc.
- Check gov.uk/energy-technology-list

### Zero Emission Vehicles

**100% First Year Allowance**
- New zero emission cars
- Electric vans and trucks
- Charging infrastructure

**Reduced Benefit-in-Kind**
- 2% BIK rate for zero emission cars (2024-25)
- vs. up to 37% for traditional vehicles
- Significant employee tax savings

**Vehicle Excise Duty**
- Zero VED for electric vehicles
- No company car supplement

### R&D Tax Credits

For companies developing sustainable innovations:

**SME Scheme**
- Enhanced deduction of 86% (from April 2023)
- Additional 10% credit for loss-making R&D intensive companies

**R&D Expenditure Credit (RDEC)**
- For larger companies or subcontracted R&D
- 20% credit on qualifying expenditure

*Qualifying sustainability R&D includes:*
- Energy efficiency innovations
- Sustainable product development
- Process improvements reducing emissions
- Material substitution research

### Land Remediation Relief

**150% Deduction**
- Cleaning up contaminated land
- Removing derelict buildings
- Preparing brownfield sites

*Supports sustainable development on previously used land*

### Reduced VAT Rates

**5% Reduced Rate**
- Energy saving materials (insulation, solar, heat pumps)
- When installed in residential property
- Some conditions apply

**Zero Rate**
- Solar panels on residential property (temporary)
- Check current rules for applicability

### Practical Considerations

**Timing Matters**
- Full expensing requires spending in accounting period
- AIA limits are per accounting period
- Plan major investments around tax years

**Documentation Required**
- Evidence of purchase and installation
- Proof of energy efficiency ratings (where relevant)
- R&D projects need contemporaneous records

**Stacking Benefits**
In some cases, you can combine:
- Grants (may reduce eligible costs)
- Tax relief on net investment
- Operational savings from efficiency

### Working With Your Accountant

These reliefs can be complex. Discuss with your accountant:
- Which reliefs apply to your situation
- Optimal timing for investments
- Documentation requirements
- Interaction with grants received

*Always seek professional tax advice for your specific circumstances.*

### Key Resources

- HMRC capital allowances guidance
- Energy Technology List (gov.uk)
- R&D tax relief guidance
- Professional body resources`,
    relatedArticles: ["types-of-grants", "preparing-grant-applications", "current-legislation"],
  },

  "preparing-grant-applications": {
    slug: "preparing-grant-applications",
    title: "Preparing Strong Grant Applications",
    category: "Financial Opportunities",
    readTime: "9 min read",
    lastUpdated: "2024-12",
    content: `## How to Write Winning Grant Applications

Grant funding is competitive. A well-prepared application significantly increases your chances of success. This guide covers what funders look for and how to present your case effectively.

### Before You Apply

**Check Eligibility Thoroughly**
Before investing time in an application:
- Business size and type requirements
- Geographic eligibility
- Sector restrictions
- Project type specifications
- Timing requirements (some need pre-approval)

**Gather Essential Information**
Have ready:
- Latest accounts (usually 2-3 years)
- Energy consumption data
- Current environmental baseline
- Project quotes from suppliers
- Evidence of match funding

**Understand the Funder's Priorities**
Different funders have different focuses:
- Carbon reduction (tonnes CO2e saved)
- Energy efficiency (kWh reduced)
- Job creation or safeguarding
- Innovation and demonstration
- Regional economic benefit

### Building Your Application

**Project Description**
Clearly explain:
- What you're doing
- Why you're doing it
- How it will be delivered
- Who will be involved
- When key milestones occur

*Keep it clear and jargon-free. Assessors may not be technical experts.*

**The Problem and Solution**
Articulate:
- Current situation and its limitations
- Why change is needed now
- How your project addresses the problem
- Why this approach is appropriate

**Benefits and Outcomes**
Quantify where possible:

| Benefit Type | How to Express |
|--------------|----------------|
| Energy savings | kWh per year, £ saved |
| Carbon reduction | Tonnes CO2e per year |
| Cost savings | £ per year, payback period |
| Other benefits | Jobs, skills, wider impact |

**Costs and Value for Money**
- Detailed, realistic budget
- Quotes from reputable suppliers
- Justification for major items
- Contingency where appropriate

**Delivery Capability**
Demonstrate you can deliver:
- Relevant experience
- Project management approach
- Key personnel involved
- Risk management

**Sustainability of Benefits**
Show long-term thinking:
- How benefits will be maintained
- Plans beyond the funded period
- Wider organisational commitment

### Common Mistakes to Avoid

**Eligibility Errors**
- Not meeting basic criteria
- Applying for ineligible costs
- Wrong business type or size

**Weak Cases**
- Vague project descriptions
- Unsubstantiated claims
- Missing baseline data
- Unrealistic projections

**Poor Presentation**
- Not answering the question asked
- Exceeding word limits
- Missing attachments
- Late submission

**Financial Issues**
- Inadequate match funding evidence
- Unrealistic or unjustified costs
- Missing quotes or estimates

### Strengthening Your Application

**Get the Basics Right**
- Answer every question fully
- Stay within word limits
- Include all required documents
- Submit before the deadline

**Show, Don't Just Tell**
- Provide evidence for claims
- Include relevant data
- Reference previous achievements
- Attach supporting documents

**Demonstrate Commitment**
- Board/management support
- Match funding secured
- Staff time allocated
- Long-term sustainability plans

**Consider Getting Help**
- Grant writing consultants
- Accountants with grant experience
- Trade associations
- Local Growth Hubs

### After Submission

**Track Progress**
- Note acknowledgement of receipt
- Monitor assessment timeline
- Respond promptly to queries

**If Unsuccessful**
- Request feedback
- Understand reasons for rejection
- Consider reapplication
- Look for alternative funding

**If Successful**
- Review terms carefully
- Understand reporting requirements
- Set up project tracking
- Plan claim process

### Building Long-Term Success

The best grant applicants:
- Build relationships with funders
- Maintain excellent records
- Deliver projects well
- Share learning and outcomes
- Apply learning to future applications

Success with one grant often leads to others. Build your track record and reputation as a reliable delivery partner.`,
    relatedArticles: ["types-of-grants", "tax-incentives-overview", "evidence-locker-explained"],
  },
};

// Helper function to get article by slug
export const getArticleBySlug = (slug: string): ArticleContent | undefined => {
  return articlesContent[slug];
};

// Get all articles
export const getAllArticles = (): ArticleContent[] => {
  return Object.values(articlesContent);
};

// Get articles by category
export const getArticlesByCategory = (category: string): ArticleContent[] => {
  return Object.values(articlesContent).filter(
    (article) => article.category === category
  );
};

// Get related articles for a given article
export const getRelatedArticles = (slug: string): ArticleContent[] => {
  const article = articlesContent[slug];
  if (!article) return [];

  return article.relatedArticles
    .map((relatedSlug) => articlesContent[relatedSlug])
    .filter((a): a is ArticleContent => a !== undefined);
};

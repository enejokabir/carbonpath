import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { articlesContent, getRelatedArticles } from "@/data/articlesData";

// Legacy article content - kept for backwards compatibility
const legacyArticlesContent: Record<string, {
  title: string;
  category: string;
  readTime: string;
  content: string;
  relatedArticles: string[];
}> = {
  "what-is-net-zero": {
    title: "What is Net Zero?",
    category: "Net Zero Basics",
    readTime: "3 min",
    content: `
## What Net Zero Means

**Net Zero** means achieving a balance between the greenhouse gases put into the atmosphere and those taken out. In simple terms, it's when the amount of carbon dioxide (CO2) and other greenhouse gases we release is equal to the amount we remove.

Think of it like a bathtub: Net Zero is when the water going in equals the water draining out, keeping the level stable.

## Why Net Zero Matters

Climate change is driven by the accumulation of greenhouse gases in our atmosphere. These gases trap heat, causing global temperatures to rise. The consequences include:

- More extreme weather events
- Rising sea levels
- Disruption to ecosystems and agriculture
- Economic impacts across all sectors

By achieving Net Zero, we can stop adding to this problem and stabilise global temperatures.

## The UK's Commitment

The UK was the first major economy to pass a **Net Zero law** in 2019, committing to reach Net Zero emissions by **2050**. Key milestones include:

- **2030**: Reduce emissions by 68% compared to 1990 levels
- **2035**: Reduce emissions by 78% compared to 1990 levels
- **2050**: Achieve Net Zero emissions

These targets are legally binding, meaning the government must take action to meet them.

## What This Means for Businesses

While there's currently no universal "carbon compliance" requirement for most SMEs, the direction of travel is clear:

1. **Supply chain pressure**: Large companies are increasingly requiring their suppliers to demonstrate sustainability credentials
2. **Customer expectations**: Consumers are choosing businesses with strong environmental practices
3. **Financial incentives**: Government grants, tax relief, and funding are increasingly tied to sustainability
4. **Future regulations**: Requirements are likely to tighten over time

Starting your sustainability journey now positions your business ahead of the curve.

## Key Terms to Know

**Carbon footprint**: The total amount of greenhouse gases produced by your business activities, measured in tonnes of CO2 equivalent (tCO2e).

**Greenhouse gases (GHGs)**: Gases that trap heat in the atmosphere, including carbon dioxide (CO2), methane (CH4), and nitrous oxide (N2O).

**Carbon offsetting**: Compensating for your emissions by funding projects that reduce or remove carbon elsewhere (e.g., tree planting, renewable energy).

**Decarbonisation**: The process of reducing carbon emissions from your operations.
    `,
    relatedArticles: ["why-it-matters-for-smes", "carbon-footprint-explained", "scope-1-2-3-simplified"]
  },
  "why-it-matters-for-smes": {
    title: "Why Net Zero Matters for SMEs",
    category: "Net Zero Basics",
    readTime: "4 min",
    content: `
## The Business Case for Sustainability

Sustainability isn't just about the environment—it's increasingly about business survival and growth. Here's why Net Zero matters for SMEs:

## 1. Supply Chain Requirements

Large companies are under pressure to reduce emissions across their entire value chain. This means they're increasingly:

- Asking suppliers for carbon footprint data
- Setting sustainability requirements in procurement
- Favouring suppliers who can demonstrate environmental commitment

**If you supply to larger businesses, sustainability credentials may soon be essential to keep those contracts.**

## 2. Customer Expectations

Consumer behaviour is shifting. Research shows:

- 73% of UK consumers are willing to change their purchasing habits to reduce environmental impact
- 66% consider sustainability when making purchasing decisions
- B2B buyers are also prioritising sustainable suppliers

Demonstrating your commitment to sustainability can be a competitive advantage.

## 3. Cost Savings

Reducing your environmental impact often means reducing costs:

- **Energy efficiency** improvements cut utility bills
- **Waste reduction** lowers disposal costs
- **Resource efficiency** reduces material costs
- Many improvements pay for themselves within 2-3 years

## 4. Access to Finance

The financial landscape is changing:

- Banks are increasingly considering environmental factors in lending decisions
- Green loans often come with better interest rates
- Investors are prioritising businesses with strong ESG (Environmental, Social, Governance) credentials
- Government grants are specifically targeting sustainability improvements

## 5. Talent Attraction

Younger workers particularly value working for sustainable businesses:

- 64% of millennials won't take a job with a company that doesn't have strong CSR practices
- Sustainability can help attract and retain talent
- Employee engagement often increases when companies demonstrate environmental commitment

## 6. Future-Proofing

Regulations are only going to tighten. Starting now means:

- Spreading costs over time rather than rushing to comply later
- Building expertise and systems gradually
- Avoiding potential penalties or restrictions
- Being prepared for new requirements

## Getting Started

The good news is that taking the first steps doesn't have to be complicated or expensive:

1. **Understand your baseline**: What energy do you use? Where do emissions come from?
2. **Identify quick wins**: LED lighting, heating controls, reducing waste
3. **Look for funding**: Grants and tax incentives can offset costs
4. **Get expert help**: Consultants can guide you through the process

The key is to start—even small steps matter and build momentum.
    `,
    relatedArticles: ["what-is-net-zero", "types-of-grants", "carbon-footprint-explained"]
  },
  "carbon-footprint-explained": {
    title: "Carbon Footprint Explained",
    category: "Net Zero Basics",
    readTime: "5 min",
    content: `
## What is a Carbon Footprint?

Your **carbon footprint** is the total amount of greenhouse gas emissions caused by your business activities. It's measured in tonnes of carbon dioxide equivalent (tCO2e).

"CO2 equivalent" is used because different gases have different warming effects. Methane, for example, is about 80 times more potent than CO2 over 20 years, so we convert everything to a common unit.

## What Contributes to Your Footprint?

For most SMEs, the main sources of emissions are:

### Energy Use
- Electricity for lighting, equipment, computers
- Gas or oil for heating
- Fuel for company vehicles

### Business Operations
- Manufacturing processes
- Refrigeration and air conditioning
- Waste disposal

### Travel
- Employee commuting
- Business travel
- Deliveries and logistics

### Supply Chain
- Products and materials you buy
- Services you use
- Packaging

## How Big is a Typical SME Footprint?

This varies enormously by sector:

| Business Type | Typical Annual Emissions |
|---------------|-------------------------|
| Small office (10 people) | 15-30 tCO2e |
| Retail shop | 20-50 tCO2e |
| Small manufacturer | 100-500 tCO2e |
| Logistics company | 200-1000+ tCO2e |

These are rough guides—your actual footprint depends on many factors.

## Why Measure Your Footprint?

You can't manage what you don't measure. Understanding your carbon footprint helps you:

1. **Identify hotspots**: Where are your biggest sources of emissions?
2. **Prioritise actions**: Focus on changes that will have the most impact
3. **Track progress**: See whether your efforts are working
4. **Report accurately**: Meet customer or regulatory requirements
5. **Set targets**: Create realistic reduction goals

## How to Measure Your Footprint

### DIY Approach
For a basic estimate, you can use:
- Utility bills (electricity, gas)
- Fuel receipts
- Travel records
- Online carbon calculators

### Professional Assessment
For a more accurate picture, consider:
- Energy audits
- Carbon footprint consultants
- Certified assessment tools

The right approach depends on your needs. A rough estimate is better than no estimate at all.

## What's a "Good" Footprint?

There's no universal answer, but you can:
- Compare to industry benchmarks
- Track improvement over time
- Set science-based targets aligned with Net Zero goals

The goal isn't perfection—it's progress.
    `,
    relatedArticles: ["scope-1-2-3-simplified", "what-is-net-zero", "why-it-matters-for-smes"]
  },
  "scope-1-2-3-simplified": {
    title: "Scope 1, 2, 3 Emissions Simplified",
    category: "Net Zero Basics",
    readTime: "4 min",
    content: `
## What are Scope 1, 2, and 3?

When measuring carbon emissions, they're divided into three "scopes". This framework helps businesses understand where their emissions come from and what they can control.

## Scope 1: Direct Emissions

**What it is**: Emissions from sources you own or control directly.

**Examples**:
- Burning gas for heating in your premises
- Fuel used in company-owned vehicles
- Emissions from manufacturing processes you operate
- Refrigerant leaks from cooling systems

**Why it matters**: These are emissions you have direct control over. Changes here often have immediate impact.

## Scope 2: Indirect Energy Emissions

**What it is**: Emissions from the electricity, heat, or steam you purchase.

**Examples**:
- Electricity used to power your office, factory, or shop
- Purchased heating or cooling
- Electricity used by equipment, lighting, computers

**Why it matters**: While you don't directly create these emissions, your purchasing decisions influence them. Switching to renewable energy can significantly reduce Scope 2.

## Scope 3: Everything Else

**What it is**: All other indirect emissions in your value chain.

**Examples**:
- Products and services you buy
- Employee commuting and business travel
- Transportation of your products
- Waste disposal
- Use of products you sell
- Investments

**Why it matters**: For many businesses, Scope 3 is the largest portion of total emissions—often 70-90%. It's also the hardest to measure and influence.

## Which Scopes Should SMEs Focus On?

### Start with Scope 1 and 2
- Easier to measure accurately
- More direct control over changes
- Often where quick wins are found

### Consider Scope 3 Later
- Start with major suppliers
- Focus on categories relevant to your business
- Perfect data isn't necessary—estimates are acceptable

## Practical Examples

### Small Office
| Scope | Examples | Typical % |
|-------|----------|-----------|
| Scope 1 | Gas heating | 20% |
| Scope 2 | Electricity | 30% |
| Scope 3 | Commuting, supplies, services | 50% |

### Manufacturer
| Scope | Examples | Typical % |
|-------|----------|-----------|
| Scope 1 | Gas, company vehicles, processes | 30% |
| Scope 2 | Electricity for machinery | 20% |
| Scope 3 | Raw materials, shipping, product use | 50% |

## Key Takeaway

Don't let the complexity of Scope 3 stop you from starting. Beginning with Scope 1 and 2 gives you actionable data and demonstrates commitment. You can expand your measurement over time.
    `,
    relatedArticles: ["carbon-footprint-explained", "what-is-net-zero", "current-legislation"]
  },
  "uk-net-zero-targets": {
    title: "UK Government Net Zero Targets",
    category: "UK Policy Landscape",
    readTime: "4 min",
    content: `
## The UK's Net Zero Journey

The UK has set legally binding targets to reach Net Zero greenhouse gas emissions. Understanding these targets helps you see where policy is heading and what might affect your business.

## Key Milestones

### 2030: 68% Reduction
- Compared to 1990 levels
- One of the most ambitious targets globally
- Drives near-term policy and investment

### 2035: 78% Reduction
- Includes international aviation and shipping for the first time
- Represents the sixth Carbon Budget
- Major transition point for many sectors

### 2050: Net Zero
- The final target
- All sectors must reach near-zero emissions
- Any remaining emissions must be offset

## What's Driving These Targets?

### Climate Change Act 2008 (amended 2019)
- Legal framework for UK climate action
- Requires government to set Carbon Budgets
- Independent Climate Change Committee advises on progress

### International Commitments
- Paris Agreement obligations
- COP26 host country leadership
- Trade and diplomatic considerations

## Sector-Specific Implications

### Energy
- Coal phase-out by 2024 (achieved)
- 95% low-carbon electricity by 2030
- Hydrogen strategy development

### Transport
- Ban on new petrol/diesel cars from 2035
- EV charging infrastructure expansion
- Zero emission buses and trucks

### Buildings
- No new gas boilers from 2035
- Building efficiency standards tightening
- Heat pump rollout

### Industry
- Carbon pricing through UK ETS
- Industrial decarbonisation strategy
- Hydrogen and CCS for heavy industry

## What This Means for SMEs

### Now
- Voluntary action rewarded through grants and incentives
- Supply chain pressure increasing
- Early movers gaining competitive advantage

### Coming Soon
- Mandatory emissions reporting expanding
- Building efficiency requirements tightening
- Product standards changing

### Longer Term
- Carbon costs likely to increase
- Low-carbon requirements becoming standard
- High-carbon options becoming more expensive

## Staying Informed

Policy evolves. Key sources for updates:
- GOV.UK Net Zero pages
- Department for Energy Security and Net Zero
- Industry associations and trade bodies
- Carbon Path Learn Hub (we'll keep you updated)
    `,
    relatedArticles: ["current-legislation", "what-is-net-zero", "why-it-matters-for-smes"]
  },
  "current-legislation": {
    title: "Current Legislation Affecting SMEs",
    category: "UK Policy Landscape",
    readTime: "6 min",
    content: `
## What's Actually Required of SMEs Today?

Good news: most SMEs don't currently face mandatory carbon reporting requirements. However, some regulations do apply, and understanding them helps you stay compliant and prepared.

## Mandatory Schemes (Large Companies Only)

These don't apply to most SMEs but are worth knowing about:

### SECR (Streamlined Energy and Carbon Reporting)
- **Who**: Large companies and LLPs
- **Threshold**: >250 employees OR >£36m turnover AND >£18m assets
- **Requires**: Report energy use, emissions, and intensity metrics annually

### ESOS (Energy Savings Opportunity Scheme)
- **Who**: Large enterprises
- **Threshold**: >250 employees OR >€50m turnover AND >€43m balance sheet
- **Requires**: Energy audits every 4 years

### UK ETS (Emissions Trading Scheme)
- **Who**: Energy-intensive industries
- **Sectors**: Power, heavy industry, aviation
- **Requires**: Purchase allowances for emissions

## Regulations That May Affect SMEs

### Energy Performance Certificates (EPCs)
- **Commercial properties**: Must have EPC when sold or leased
- **Minimum standards**: Grade E minimum for rentals (Grade C proposed for 2027-2030)
- **Action needed**: If you own or lease property, check your EPC rating

### Building Regulations
- **New builds and major renovations**: Must meet current energy standards
- **Part L**: Sets energy efficiency requirements
- **Action needed**: Ensure any building work meets requirements

### Waste Regulations
- **Duty of care**: Must dispose of business waste responsibly
- **Segregation**: Some areas require recycling separation
- **Hazardous waste**: Special requirements apply

### F-Gas Regulations
- **Refrigeration and air conditioning**: Restrictions on high-GWP refrigerants
- **Phase-down**: HFC availability reducing over time
- **Action needed**: Plan for equipment replacement

## Voluntary But Increasingly Expected

### Supply Chain Requirements
Not law, but increasingly contractual:
- Carbon footprint disclosure
- Sustainability policies
- Environmental certifications

### Tender Requirements
Public sector and large corporates often require:
- Environmental management systems
- Sustainability commitments
- Carbon data

## What's Coming?

### Extended Producer Responsibility
- Packaging waste responsibilities expanding
- Coming into full effect 2024-2025

### Potential SME Reporting
- Government has consulted on extending reporting to smaller businesses
- Thresholds and timing unclear
- Likely to be simplified if introduced

## Key Takeaway

Most SMEs don't face mandatory carbon reporting today, but:
- Some regulations do apply (EPCs, waste, building regs)
- Supply chain requirements are increasing
- Voluntary action now positions you well for future changes
- Starting early spreads costs and builds capability
    `,
    relatedArticles: ["uk-net-zero-targets", "why-it-matters-for-smes", "types-of-grants"]
  },
  "types-of-grants": {
    title: "Types of Grants Available",
    category: "Financial Opportunities",
    readTime: "5 min",
    content: `
## Funding Your Sustainability Journey

There's significant funding available to help SMEs reduce their environmental impact. Understanding the different types helps you identify what's right for your business.

## Grant Types

### Capital Grants
**What they fund**: Physical assets and equipment
- LED lighting upgrades
- Heating system improvements
- Solar panels and renewables
- Insulation and building fabric
- Electric vehicles and chargers

**Typical amounts**: £1,000 - £50,000+
**Usually require**: Matched funding (you pay a percentage)

### Revenue Grants
**What they fund**: Services and support
- Energy audits
- Carbon footprint assessments
- Consultancy and advice
- Training and skills development

**Typical amounts**: Often fully funded or heavily subsidised
**Usually require**: Time commitment, follow-through on recommendations

### Loan Schemes
**What they offer**: Low or zero-interest finance
- Spread costs over time
- Better rates than commercial loans
- Often linked to specific improvements

**Typical amounts**: £5,000 - £500,000+
**Usually require**: Demonstration of repayment ability

## Where Funding Comes From

### National Government
- Administered through various departments
- Often larger amounts
- More competitive

### Local Authorities
- Derby City, county councils
- Often easier to access
- Local eligibility requirements

### Combined Authorities
- East Midlands regional schemes
- Economic development focus
- Business growth requirements

### Utilities and Energy Companies
- ECO4 and other obligation schemes
- Often delivered through contractors
- Focus on specific measures

## Common Eligibility Requirements

Most schemes require:
- **SME status**: Fewer than 250 employees
- **Location**: Based in the relevant area
- **Sector**: Some schemes target specific industries
- **Trading history**: Usually 12+ months
- **Financial health**: Not in administration or serious difficulty

Some schemes also consider:
- Current energy use or emissions
- Type of premises (owned/leased)
- Previous grant history

## How to Find Grants

### Carbon Path Grants Directory
Browse our curated list of current opportunities, filtered by:
- Your location
- Your sector
- Grant type and amount

### Other Sources
- GOV.UK business support finder
- Local authority websites
- Trade associations
- Accountants and business advisors

## Application Tips

1. **Read eligibility carefully**: Don't waste time on schemes you don't qualify for
2. **Gather documents early**: Accounts, quotes, property details
3. **Get multiple quotes**: Most schemes require competitive quotes
4. **Don't start work early**: Many schemes require approval before you begin
5. **Consider professional help**: Grant consultants can improve success rates

## Next Steps

1. Check your eligibility for current schemes
2. Identify priority improvements for your business
3. Gather necessary documentation
4. Apply early—many schemes are first-come-first-served
5. Consider getting professional support for larger applications
    `,
    relatedArticles: ["tax-incentives-overview", "preparing-grant-applications", "why-it-matters-for-smes"]
  },
  "tax-incentives-overview": {
    title: "Tax Incentives for Sustainability",
    category: "Financial Opportunities",
    readTime: "5 min",
    content: `
## Tax Benefits for Green Investment

Beyond grants, there are significant tax advantages for businesses investing in sustainability. These can substantially reduce the effective cost of improvements.

## Capital Allowances

### Full Expensing (Temporary - until March 2026)
- **What**: 100% first-year deduction for qualifying plant and machinery
- **Benefit**: Immediate tax relief on the full cost
- **Applies to**: Most new equipment, including energy-efficient assets

### Annual Investment Allowance (AIA)
- **What**: 100% relief up to £1 million per year
- **Benefit**: Full deduction in the year of purchase
- **Applies to**: Plant and machinery, vehicles, equipment

### Enhanced Capital Allowances (ECAs)
- **What**: Accelerated relief for energy-efficient equipment
- **Benefit**: 100% first-year relief
- **Qualifying items**: Listed on the Energy Technology List (ETL)
  - High-efficiency boilers
  - LED lighting
  - Motors and drives
  - Refrigeration equipment
  - Solar thermal systems

## R&D Tax Relief

If your sustainability work involves innovation:

### SME R&D Relief
- **What**: Enhanced deduction for qualifying R&D spending
- **Benefit**: Additional 86% deduction (from April 2023)
- **Or**: Cash credit of up to 10% for loss-making companies

### Examples of Qualifying R&D
- Developing new low-carbon products
- Innovating manufacturing processes
- Creating new energy-efficient systems
- Testing and prototyping sustainable solutions

## Structures and Buildings Allowance (SBA)

For building improvements:
- **Rate**: 3% per year
- **Applies to**: Construction, renovation, conversion
- **Includes**: Energy efficiency improvements to buildings

## Electric Vehicle Benefits

### Company Cars
- **BIK Rate**: 2% for EVs (2024/25)
- **Compared to**: Up to 37% for high-emission vehicles
- **Saving**: Significant for employees and employers

### Capital Allowances on EVs
- 100% first-year allowance for zero-emission vehicles
- Includes cars, vans, trucks
- Charging equipment also qualifies

## How Much Could You Save?

### Example: LED Lighting Upgrade
- **Cost**: £10,000
- **AIA Relief**: £10,000 x 19% (corporation tax) = £1,900 tax saving
- **Plus**: Energy savings of £2,000+ per year
- **Effective payback**: Often under 2 years

### Example: Electric Company Car
- **EV BIK**: 2% x £40,000 = £800 taxable
- **Petrol equivalent**: 30% x £40,000 = £12,000 taxable
- **Employee saving**: Potentially thousands per year

## Important Notes

- **Get professional advice**: Tax rules are complex and change frequently
- **Keep records**: You'll need evidence of expenditure and purpose
- **Timing matters**: Some reliefs have specific timing requirements
- **Not all improvements qualify**: Check eligibility before assuming relief

## Combining Benefits

You can often combine:
- Grants (reduce upfront cost)
- Capital allowances (reduce tax)
- Energy savings (ongoing benefit)

This "stacking" can make sustainability investments very attractive financially.

## Next Steps

1. Talk to your accountant about applicable reliefs
2. Check the Energy Technology List for qualifying equipment
3. Consider timing of investments for optimal tax benefit
4. Keep detailed records of sustainability spending
    `,
    relatedArticles: ["types-of-grants", "preparing-grant-applications", "why-it-matters-for-smes"]
  },
  "preparing-grant-applications": {
    title: "How to Prepare for Grant Applications",
    category: "Financial Opportunities",
    readTime: "6 min",
    content: `
## Setting Yourself Up for Success

Grant applications can be competitive. Proper preparation significantly improves your chances of success.

## Before You Apply

### 1. Check Eligibility Thoroughly
Don't waste time on applications you don't qualify for:
- Business size and structure
- Location requirements
- Sector restrictions
- Trading history
- Property ownership/lease terms

### 2. Understand What's Funded
Be clear on:
- Eligible costs (equipment, installation, consultancy)
- Excluded costs (VAT, internal staff time, retrospective costs)
- Funding percentages (rarely 100%)
- Minimum and maximum amounts

### 3. Gather Essential Documents

**Business Documents**
- Company accounts (usually 2 years)
- Bank statements
- VAT registration (if applicable)
- Companies House registration

**Property Documents**
- Lease agreement
- Landlord permission letter (if leasing)
- Planning permissions (if required)

**Project Documents**
- Quotes from suppliers (usually 2-3)
- Technical specifications
- Installation timelines

## Writing Your Application

### Be Clear and Specific
- State exactly what you want to do
- Explain why it's needed
- Quantify expected benefits

### Demonstrate Need
- Current energy costs/usage
- Business impact of high costs
- Why you can't fund this yourself

### Show Readiness
- Confirm you can proceed quickly
- Demonstrate matched funding availability
- Show relevant permissions are in place

### Highlight Benefits
- Energy/carbon savings (quantified)
- Cost savings (with calculations)
- Jobs created or safeguarded
- Wider community benefits

## Common Mistakes to Avoid

### 1. Starting Work Early
Most grants require approval before you begin. Starting early can disqualify you entirely.

### 2. Missing Deadlines
Many schemes have strict deadlines. Submit well before closing dates.

### 3. Incomplete Applications
Missing documents cause delays or rejection. Use checklists.

### 4. Unrealistic Projections
Exaggerated savings claims undermine credibility. Be realistic.

### 5. Ignoring Terms
Grant conditions persist after award. Understand ongoing requirements.

## After Submission

### Be Responsive
- Answer queries quickly
- Provide additional information promptly
- Keep contact details updated

### Plan for Success
- Line up contractors
- Arrange matched funding
- Prepare for inspections/verification

## Using Professional Support

Consider grant consultants for:
- Complex applications
- Large funding amounts
- Schemes with high competition
- When you lack time internally

**Fee structures vary**:
- Fixed fee
- Success-based (percentage of grant)
- Hourly rate

Success-based fees mean no win, no fee—reducing your risk.

## Grant Application Checklist

**Eligibility**
- [ ] Business size meets requirements
- [ ] Location is eligible
- [ ] Sector is included
- [ ] Trading history sufficient
- [ ] Not previously funded for same work

**Documents**
- [ ] Accounts (2 years)
- [ ] Bank statements
- [ ] Company registration
- [ ] Property lease/ownership proof
- [ ] Landlord permission (if applicable)
- [ ] Competitive quotes (2-3)

**Application Content**
- [ ] Clear project description
- [ ] Quantified benefits
- [ ] Realistic timeline
- [ ] Evidence of matched funding
- [ ] Supporting calculations

**Before Submitting**
- [ ] Proofread everything
- [ ] All attachments included
- [ ] Signed where required
- [ ] Copy saved for records
    `,
    relatedArticles: ["types-of-grants", "tax-incentives-overview", "why-it-matters-for-smes"]
  }
};

export default function LearnArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check new articles first, then fall back to legacy content
  const article = slug
    ? (articlesContent[slug] || legacyArticlesContent[slug])
    : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
        <Header user={user} />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/learn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Learn Hub
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let currentTable: string[][] = [];
    let inTable = false;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 ml-4">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushTable = () => {
      if (currentTable.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {currentTable[0]?.map((cell, i) => (
                    <th key={i} className="border border-border px-4 py-2 bg-muted text-left font-semibold">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTable.slice(2).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-border px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTable = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Table detection
      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        flushList();
        const cells = trimmedLine.split('|').filter(c => c.trim()).map(c => c.trim());
        if (cells.some(c => c.match(/^-+$/))) {
          // Separator row, skip
          inTable = true;
        } else {
          currentTable.push(cells);
          inTable = true;
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Headers
      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }
      // List items
      else if (trimmedLine.startsWith('- ')) {
        currentList.push(trimmedLine.replace('- ', ''));
      }
      // Numbered list
      else if (trimmedLine.match(/^\d+\.\s/)) {
        flushList();
        elements.push(
          <p key={index} className="mb-2 ml-4">
            {trimmedLine}
          </p>
        );
      }
      // Checkboxes
      else if (trimmedLine.startsWith('- [ ]')) {
        elements.push(
          <p key={index} className="mb-1 ml-4 flex items-center gap-2">
            <span className="w-4 h-4 border border-border rounded" />
            {trimmedLine.replace('- [ ]', '')}
          </p>
        );
      }
      // Bold paragraph
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold mb-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      }
      // Regular paragraph
      else if (trimmedLine.length > 0) {
        flushList();
        // Handle inline bold
        const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/g);
        elements.push(
          <p key={index} className="mb-4 leading-relaxed">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.replace(/\*\*/g, '')}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
    });

    flushList();
    flushTable();

    return elements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/learn"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learn
          </Link>

          {/* Article header */}
          <div className="mb-8">
            <p className="text-primary font-medium mb-2">{article.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} read</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main content */}
            <article className="lg:col-span-3 prose prose-slate max-w-none">
              {renderContent(article.content)}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Related articles */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Related Articles
                    </h4>
                    <ul className="space-y-3">
                      {article.relatedArticles.map((relatedSlug) => {
                        const related = articlesContent[relatedSlug];
                        if (!related) return null;
                        return (
                          <li key={relatedSlug}>
                            <Link
                              to={`/learn/${relatedSlug}`}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-start gap-2"
                            >
                              <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                              {related.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>

          {/* CTA */}
          <Card className="mt-12 border-2 border-primary/20">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to take action?</h3>
              <p className="text-muted-foreground mb-6">
                See how this applies to your business with our free assessment
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild>
                  <Link to="/assessment">
                    Take Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/grants">Browse Grants</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Calculator,
  Building2,
  Car,
  Lightbulb,
  PoundSterling,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const taxBenefits = [
  {
    id: "full-expensing",
    name: "Full Expensing",
    type: "Capital Allowance",
    benefit: "100% first-year deduction",
    deadline: "Until March 2026",
    description: "Deduct the full cost of qualifying plant and machinery from profits in the year of purchase.",
    eligible: [
      "New plant and machinery",
      "Energy-efficient equipment",
      "Manufacturing equipment",
      "IT equipment"
    ],
    example: "A £50,000 piece of equipment could save £9,500 in corporation tax (at 19%)",
    icon: Calculator
  },
  {
    id: "aia",
    name: "Annual Investment Allowance (AIA)",
    type: "Capital Allowance",
    benefit: "100% relief up to £1m/year",
    deadline: "Permanent",
    description: "Claim 100% tax relief on qualifying plant and machinery investments up to £1 million per year.",
    eligible: [
      "Most plant and machinery",
      "Vehicles (except cars)",
      "Equipment and tools",
      "Fixtures and fittings"
    ],
    example: "Investing £100,000 in equipment could save £19,000-£25,000 in tax",
    icon: PoundSterling
  },
  {
    id: "eca",
    name: "Enhanced Capital Allowances",
    type: "Energy Efficiency",
    benefit: "100% first-year allowance",
    deadline: "Ongoing",
    description: "Accelerated tax relief for energy-saving and water-efficient equipment listed on the Energy Technology List.",
    eligible: [
      "High-efficiency boilers",
      "LED lighting systems",
      "Motors and drives",
      "Refrigeration equipment",
      "Solar thermal systems",
      "Heat pumps"
    ],
    example: "Check the Energy Technology List (ETL) to see if your equipment qualifies",
    icon: Lightbulb
  },
  {
    id: "rd-tax-relief",
    name: "R&D Tax Relief",
    type: "Innovation",
    benefit: "Enhanced deduction + cash credit",
    deadline: "Ongoing",
    description: "Additional tax relief for companies undertaking qualifying research and development in sustainability.",
    eligible: [
      "Developing new low-carbon products",
      "Innovating manufacturing processes",
      "Creating energy-efficient systems",
      "Testing sustainable materials",
      "Environmental technology R&D"
    ],
    example: "SME R&D relief provides an additional 86% deduction on qualifying costs",
    icon: Lightbulb
  },
  {
    id: "sba",
    name: "Structures and Buildings Allowance",
    type: "Property",
    benefit: "3% annual relief",
    deadline: "Ongoing",
    description: "Tax relief on the cost of constructing or renovating commercial buildings, including energy efficiency improvements.",
    eligible: [
      "New building construction",
      "Building renovations",
      "Extensions and conversions",
      "Energy efficiency retrofits"
    ],
    example: "A £200,000 renovation could provide £6,000 tax relief per year for 33 years",
    icon: Building2
  },
  {
    id: "ev-benefits",
    name: "Electric Vehicle Benefits",
    type: "Transport",
    benefit: "2% BIK + 100% FYA",
    deadline: "2024/25 rates",
    description: "Significant tax advantages for businesses and employees using electric vehicles.",
    eligible: [
      "Zero-emission company cars",
      "Electric vans and trucks",
      "EV charging equipment",
      "Salary sacrifice schemes"
    ],
    example: "An EV with P11D of £40,000 has BIK of just £800 vs £12,000+ for petrol equivalent",
    icon: Car
  }
];

export default function TaxBenefits() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-mint-fresh/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tax Benefits for Sustainability</h1>
            <p className="text-xl text-muted-foreground">
              Discover tax incentives that can significantly reduce the cost of your green investments
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-6 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> This page provides general information only and does not constitute tax advice.
              Tax rules are complex and change frequently. Always consult a qualified accountant or tax advisor before
              making decisions based on tax incentives.
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {taxBenefits.map((benefit) => (
              <Card key={benefit.id} className="border hover:border-primary/50 transition-all hover:shadow-elevated">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline">{benefit.type}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-4">{benefit.name}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm font-medium text-primary">{benefit.benefit}</p>
                    <p className="text-xs text-muted-foreground">{benefit.deadline}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">What qualifies:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {benefit.eligible.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 mt-1 text-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      {benefit.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Claim */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">How to Claim These Benefits</h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Identify Qualifying Expenditure</h3>
                      <p className="text-muted-foreground text-sm">
                        Review your planned or recent sustainability investments. Check if equipment is listed on the
                        Energy Technology List (ETL) for enhanced allowances.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Keep Detailed Records</h3>
                      <p className="text-muted-foreground text-sm">
                        Maintain invoices, receipts, and documentation showing the nature of expenditure.
                        Note the environmental/efficiency purpose of purchases.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Consult Your Accountant</h3>
                      <p className="text-muted-foreground text-sm">
                        Discuss with your accountant before making major purchases. They can advise on timing,
                        which reliefs apply, and how to maximise your benefit.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Claim on Your Tax Return</h3>
                      <p className="text-muted-foreground text-sm">
                        Capital allowances and other reliefs are claimed through your corporation tax return.
                        Your accountant will include these in your annual filing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Combining Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Combining Benefits for Maximum Savings</h2>
            <p className="text-center text-muted-foreground mb-8">
              You can often stack multiple benefits to significantly reduce the effective cost of sustainability investments.
            </p>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Example: LED Lighting Upgrade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Project cost:</div>
                    <div className="font-semibold">£10,000</div>

                    <div>Grant received (50%):</div>
                    <div className="font-semibold text-green-600">-£5,000</div>

                    <div>Net cost to business:</div>
                    <div className="font-semibold">£5,000</div>

                    <div>AIA tax relief (25% of £5,000):</div>
                    <div className="font-semibold text-green-600">-£1,250</div>

                    <div className="font-bold border-t pt-2">Effective cost:</div>
                    <div className="font-bold border-t pt-2 text-primary">£3,750</div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Plus:</strong> Annual energy savings of £2,000+ means payback in under 2 years,
                      then ongoing savings for 10+ years.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-mint-fresh/10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold">Need Help Navigating Tax Benefits?</h2>
            <p className="text-muted-foreground">
              Connect with qualified tax specialists who understand sustainability incentives
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/consultants">
                  Find Tax Specialists <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/grants">Browse Grants</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

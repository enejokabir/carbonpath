import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  BookOpen,
  Scale,
  PoundSterling,
  Lightbulb,
  Factory,
  Building2,
  Truck,
  Briefcase,
  Cpu,
  HeartPulse,
  GraduationCap,
  ChevronRight,
  Clock,
  Leaf
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Article data - in a real app this would come from a CMS or database
const articles = {
  basics: [
    {
      slug: "what-is-sustainability-compliance",
      title: "What is Sustainability Compliance?",
      description: "A plain-English explanation of what compliance means and why it matters",
      readTime: "3 min",
      icon: Lightbulb
    },
    {
      slug: "why-it-matters-for-smes",
      title: "Why it matters for SMEs",
      description: "How sustainability affects your customers, suppliers and bottom line",
      readTime: "4 min",
      icon: Building2
    },
    {
      slug: "evidence-locker-explained",
      title: "Building Your Evidence Locker",
      description: "What documents you need and how to organise them effectively",
      readTime: "5 min",
      icon: Leaf
    },
    {
      slug: "compliance-checklist",
      title: "Your Compliance Checklist",
      description: "Key documents and certifications for sustainability readiness",
      readTime: "4 min",
      icon: BookOpen
    }
  ],
  policy: [
    {
      slug: "uk-sustainability-regulations",
      title: "UK Sustainability Regulations",
      description: "Current requirements and what they mean for UK businesses",
      readTime: "4 min",
      icon: Scale
    },
    {
      slug: "current-legislation",
      title: "Current Legislation Affecting SMEs",
      description: "What's actually required of you right now",
      readTime: "6 min",
      icon: BookOpen
    },
    {
      slug: "upcoming-regulations",
      title: "Upcoming Regulations to Watch",
      description: "What's coming down the line and how to prepare",
      readTime: "5 min",
      icon: Clock
    }
  ],
  financial: [
    {
      slug: "types-of-grants",
      title: "Types of Grants Available",
      description: "An overview of funding options for sustainability projects",
      readTime: "5 min",
      icon: PoundSterling
    },
    {
      slug: "tax-incentives-overview",
      title: "Tax Incentives Overview",
      description: "Capital allowances, R&D relief and other tax benefits for green investment",
      readTime: "5 min",
      icon: PoundSterling
    },
    {
      slug: "preparing-grant-applications",
      title: "How to Prepare for Applications",
      description: "What you need before applying for sustainability funding",
      readTime: "6 min",
      icon: BookOpen
    }
  ]
};

const sectors = [
  { name: "Manufacturing", icon: Factory, slug: "manufacturing" },
  { name: "Retail", icon: Building2, slug: "retail" },
  { name: "Logistics", icon: Truck, slug: "logistics" },
  { name: "Professional Services", icon: Briefcase, slug: "professional-services" },
  { name: "Tech", icon: Cpu, slug: "tech" },
  { name: "Healthcare", icon: HeartPulse, slug: "healthcare" },
  { name: "Education", icon: GraduationCap, slug: "education" }
];

export default function Learn() {
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

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-mint-fresh/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn</h1>
            <p className="text-xl text-muted-foreground">
              Everything UK SMEs need to know about sustainability compliance — in plain English
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            <a
              href="#basics"
              className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
            >
              Compliance Basics
            </a>
            <a
              href="#policy"
              className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
            >
              UK Regulations
            </a>
            <a
              href="#financial"
              className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
            >
              Funding & Grants
            </a>
            <a
              href="#sectors"
              className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
            >
              By Sector
            </a>
          </div>
        </div>
      </section>

      {/* Compliance Basics Section */}
      <section id="basics" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Compliance Basics</h2>
              <p className="text-muted-foreground mt-1">Start here if you're new to sustainability compliance</p>
            </div>
            <Link
              to="/learn/basics"
              className="hidden md:inline-flex items-center text-primary font-medium hover:underline"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.basics.map((article) => (
              <Card
                key={article.slug}
                className="border hover:border-primary/50 transition-all hover:shadow-elevated group cursor-pointer"
              >
                <Link to={`/learn/${article.slug}`}>
                  <CardHeader className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <article.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {article.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {article.readTime} read
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>

          <Link
            to="/learn/basics"
            className="md:hidden inline-flex items-center text-primary font-medium hover:underline mt-6"
          >
            View All Basics <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* UK Policy Landscape Section */}
      <section id="policy" className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">UK Policy Landscape</h2>
              <p className="text-muted-foreground mt-1">Regulations, targets, and what they mean for you</p>
            </div>
            <Link
              to="/learn/policy"
              className="hidden md:inline-flex items-center text-primary font-medium hover:underline"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.policy.map((article) => (
              <Card
                key={article.slug}
                className="border hover:border-primary/50 transition-all hover:shadow-elevated group cursor-pointer"
              >
                <Link to={`/learn/${article.slug}`}>
                  <CardHeader className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <article.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {article.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {article.readTime} read
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>

          {/* Sector Pills */}
          <div id="sectors" className="pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">By Your Sector</h3>
            <div className="flex flex-wrap gap-3">
              {sectors.map((sector) => (
                <Link
                  key={sector.slug}
                  to={`/learn/sectors/${sector.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <sector.icon className="w-4 h-4 text-primary" />
                  <span className="font-medium">{sector.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Financial Opportunities Section */}
      <section id="financial" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Financial Opportunities</h2>
              <p className="text-muted-foreground mt-1">Grants, tax benefits, and how to access them</p>
            </div>
            <Link
              to="/learn/financial"
              className="hidden md:inline-flex items-center text-primary font-medium hover:underline"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.financial.map((article) => (
              <Card
                key={article.slug}
                className="border hover:border-primary/50 transition-all hover:shadow-elevated group cursor-pointer"
              >
                <Link to={`/learn/${article.slug}`}>
                  <CardHeader className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <article.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {article.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {article.readTime} read
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-mint-fresh/10 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to see what applies to your business?</h2>
            <p className="text-muted-foreground">
              Take our free assessment to get personalised recommendations
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="shadow-glow">
                <Link to="/assessment">
                  Take the Assessment <ArrowRight className="ml-2 w-5 h-5" />
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

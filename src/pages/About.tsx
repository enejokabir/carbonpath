import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Target,
  Users,
  Heart,
  Lightbulb,
  MapPin
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function About() {
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
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Carbon Path</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're building the platform we wished existed when we started helping SMEs with sustainability—a single place to understand Net Zero, find funding, and connect with trusted experts.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              SMEs make up 99% of UK businesses, yet most don't know where to start with Net Zero. Information is scattered across government websites, industry bodies, and consultants. Funding opportunities come and go. Finding trustworthy help is difficult.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              <strong className="text-foreground">Carbon Path exists to change that.</strong> We're creating a single platform where any UK SME can:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">1</span>
                </span>
                <span><strong>Learn</strong> what Net Zero means for their business—in plain English, without jargon</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">2</span>
                </span>
                <span><strong>Discover</strong> grants, tax incentives, and financial support they might be missing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">3</span>
                </span>
                <span><strong>Connect</strong> with trusted consultants who can help them take action</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Why We Built This</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Working with SMEs in the East Midlands, we kept hearing the same frustrations:
            </p>
            <div className="space-y-4 mb-8">
              <Card>
                <CardContent className="py-4">
                  <p className="italic">"I know sustainability is important, but I don't even know where to start."</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="italic">"There might be grants out there, but I don't have time to research them all."</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="italic">"How do I know which consultants are actually any good?"</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Carbon Path is our answer. We're not trying to replace expert consultants—we're making it easier for businesses to understand their options and find the right help.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Our Approach</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Honest, Not Salesy</h3>
                  <p className="text-muted-foreground text-sm">
                    We don't create fake "compliance scores" or pressure you with fear. We provide clear information and let you decide what's right for your business.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Plain English</h3>
                  <p className="text-muted-foreground text-sm">
                    Sustainability is full of jargon. We translate complex policies and regulations into language anyone can understand.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Practical Focus</h3>
                  <p className="text-muted-foreground text-sm">
                    We focus on what matters to SMEs: saving money, accessing funding, meeting customer requirements, and future-proofing your business.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Trusted Connections</h3>
                  <p className="text-muted-foreground text-sm">
                    We vet the consultants in our directory. We're not just listing anyone—we want you to have good experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Focus */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Starting in the East Midlands</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We're based in Derby and starting with a focus on the East Midlands region. This means:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Deep knowledge of local and regional grant schemes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Consultants who know the local business landscape</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Understanding of key regional industries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Ability to provide hands-on support</span>
              </li>
            </ul>
            <p className="text-lg text-muted-foreground leading-relaxed">
              As we grow, we'll expand to serve SMEs across the UK—but we believe in building deep, quality relationships locally before scaling.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Who We Are</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Carbon Path is a small team passionate about making sustainability accessible for SMEs. We combine backgrounds in business support, technology, and sustainability consulting.
            </p>
            <Card className="border-2 border-primary/20">
              <CardContent className="py-8 text-center">
                <p className="text-lg mb-4">Want to get in touch?</p>
                <Button asChild>
                  <Link to="/contact">
                    Contact Us <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-mint-fresh/10 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Take our free assessment to understand your business's sustainability position
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/assessment">
                  Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/learn">Explore Learn Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

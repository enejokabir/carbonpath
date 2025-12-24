import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  PoundSterling,
  Users,
  HelpCircle,
  Building2,
  Factory,
  Truck,
  Briefcase,
  Cpu,
  ChevronRight,
  Target,
  Award,
  BarChart3,
  Shield,
  Zap
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FadeIn, StaggerContainer, StaggerItem, SlideIn, ScaleIn, Floating } from "@/components/ui/page-transition";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

      <main id="main-content">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-mint-fresh/10" />
        <div className="absolute inset-0 overflow-hidden">
          <Floating>
            <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </Floating>
          <Floating>
            <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
          </Floating>
          <motion.div
            className="absolute top-1/3 right-[20%] w-2 h-2 bg-primary/40 rounded-full"
            animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 left-[25%] w-3 h-3 bg-sage/40 rounded-full"
            animate={{ y: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-[15%] w-1.5 h-1.5 bg-mint-fresh/50 rounded-full"
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <FadeIn>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">SME Compliance Readiness Workspace</span>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block">Be Sustainability Ready</span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-sage-dark to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    In Practice, Not Just Theory
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-sage rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Organise evidence. Track obligations. Access matched grants. Connect with vetted consultants.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" asChild className="shadow-glow text-base px-8 py-6 text-lg group">
                    <Link to="/assessment">
                      <Target className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Check Your Readiness
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 text-lg">
                    <Link to="/grants">
                      Find Matched Grants <ChevronRight className="ml-1 w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </FadeIn>

            {/* Features */}
            <FadeIn delay={0.5}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto pt-12">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    Free
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Readiness Assessment</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    UK
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Grants & Funding</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    Expert
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Consultant Network</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* The Challenge Section */}
      <section className="py-20 bg-card/50 border-y border-border relative overflow-hidden">
        <motion.div
          className="absolute -left-20 top-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="container mx-auto px-4 relative">
          <SlideIn direction="up">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <p className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-6 text-left max-w-2xl mx-auto">
                "SMEs don't fail because they're unwilling to act on sustainability. They fail because requirements arrive before they're operationally prepared."
              </p>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StaggerItem>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
                    className="flex flex-col items-center p-8 rounded-2xl bg-background border border-border transition-all"
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center mb-4"
                    >
                      <HelpCircle className="w-8 h-8 text-destructive" />
                    </motion.div>
                    <p className="font-semibold text-center text-lg">Evidence is fragmented</p>
                    <p className="text-sm text-muted-foreground mt-2 text-center">Documents scattered across emails, spreadsheets, and staff</p>
                  </motion.div>
                </StaggerItem>

                <StaggerItem>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
                    className="flex flex-col items-center p-8 rounded-2xl bg-background border border-border transition-all"
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-earth-warm/30 to-earth-warm/10 flex items-center justify-center mb-4"
                    >
                      <PoundSterling className="w-8 h-8 text-earth-warm" />
                    </motion.div>
                    <p className="font-semibold text-center text-lg">No readiness system</p>
                    <p className="text-sm text-muted-foreground mt-2 text-center">No clear view of what's in place, missing, or outdated</p>
                  </motion.div>
                </StaggerItem>

                <StaggerItem>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
                    className="flex flex-col items-center p-8 rounded-2xl bg-background border border-border transition-all"
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage/20 to-sage/10 flex items-center justify-center mb-4"
                    >
                      <Users className="w-8 h-8 text-sage-dark" />
                    </motion.div>
                    <p className="font-semibold text-center text-lg">Help is reactive & costly</p>
                    <p className="text-sm text-muted-foreground mt-2 text-center">Consultants sought only when deadlines loom</p>
                  </motion.div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Readiness Assessment Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-sage/5" />
        <Floating>
          <div className="absolute top-10 right-[20%] w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        </Floating>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <SlideIn direction="left">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    Takes just 5 minutes
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Check Your Sustainability Readiness
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Answer one simple question: "If asked for sustainability evidence today, how ready are you?" Our assessment shows you exactly where you stand.
                  </p>

                  <ul className="space-y-4">
                    {[
                      { icon: Target, text: "Industry-specific compliance checklist" },
                      { icon: BarChart3, text: "Clear readiness score dashboard" },
                      { icon: Award, text: "Matched grants based on your profile" },
                      { icon: Shield, text: "Evidence organisation system" },
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" asChild className="shadow-glow mt-4">
                      <Link to="/assessment">
                        <Target className="mr-2 w-5 h-5" />
                        Start Readiness Check
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </SlideIn>

              <SlideIn direction="right">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-card to-card/80 rounded-3xl border-2 border-primary/20 p-8 shadow-elevated">
                    {/* Mock readiness preview */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">Your Readiness Score</p>
                          <p className="text-sm text-muted-foreground">Based on your profile</p>
                        </div>
                      </div>

                      <div className="text-center py-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.3 }}
                          viewport={{ once: true }}
                          className="text-6xl font-bold text-primary"
                        >
                          <AnimatedCounter value={72} duration={2} />
                          <span className="text-2xl ml-1">%</span>
                        </motion.div>
                        <p className="text-muted-foreground mt-2">Compliance Ready</p>
                      </div>

                      <div className="space-y-3">
                        {[
                          { label: "Evidence Organised", value: 80, color: "bg-primary" },
                          { label: "Obligations Tracked", value: 65, color: "bg-sage" },
                          { label: "Documents Current", value: 70, color: "bg-mint-fresh" },
                        ].map((scope, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{scope.label}</span>
                              <span className="font-medium">{scope.value}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${scope.color} rounded-full`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${scope.value}%` }}
                                transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                                viewport={{ once: true }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* How Carbon Path Helps Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Your Compliance Readiness Workspace</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Organise, track, and respond to sustainability requirements with confidence
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StaggerItem>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-elevated group h-full">
                  <CardHeader className="space-y-4 p-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center shadow-soft"
                    >
                      <Shield className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <CardTitle className="text-2xl">Organise</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Store policies, bills, logs and records in one place. Time-stamped, structured, always ready.
                    </CardDescription>
                    <Link
                      to="/assessment"
                      className="inline-flex items-center text-primary font-medium hover:underline group-hover:gap-2 gap-1 transition-all"
                    >
                      Start Assessment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-elevated group h-full">
                  <CardHeader className="space-y-4 p-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center shadow-soft"
                    >
                      <PoundSterling className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <CardTitle className="text-2xl">Match</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Get personalised grant recommendations based on your profile and readiness status.
                    </CardDescription>
                    <Link
                      to="/grants"
                      className="inline-flex items-center text-primary font-medium hover:underline group-hover:gap-2 gap-1 transition-all"
                    >
                      Find Grants <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-elevated group h-full">
                  <CardHeader className="space-y-4 p-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center shadow-soft"
                    >
                      <Users className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <CardTitle className="text-2xl">Connect</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Access vetted consultants for tax, grants, and full compliance support when you need it.
                    </CardDescription>
                    <Link
                      to="/consultants"
                      className="inline-flex items-center text-primary font-medium hover:underline group-hover:gap-2 gap-1 transition-all"
                    >
                      Find Experts <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Built for UK SMEs</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                For businesses that need to demonstrate sustainability to win contracts, access grants, and satisfy supply chain requirements
              </p>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            {/* Sectors */}
            <StaggerContainer className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: Factory, label: "Manufacturing" },
                { icon: Building2, label: "Retail" },
                { icon: Truck, label: "Logistics" },
                { icon: Briefcase, label: "Professional Services" },
                { icon: Cpu, label: "Tech" },
              ].map((sector, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border hover:border-primary/50 hover:shadow-soft transition-all cursor-default"
                  >
                    <sector.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{sector.label}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Business Sizes */}
            <FadeIn delay={0.3}>
              <div className="flex justify-center gap-6 text-muted-foreground">
                <span>Micro (1-9)</span>
                <span className="text-primary">•</span>
                <span>Small (10-49)</span>
                <span className="text-primary">•</span>
                <span>Medium (50-249)</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sage/5 to-mint-fresh/10" />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative">
          <ScaleIn>
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring" }}
                viewport={{ once: true }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center mx-auto shadow-glow"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Be Compliance Ready?
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop scrambling when sustainability requests arrive. Get your workspace set up and be ready to respond with confidence.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button size="lg" asChild className="shadow-glow text-lg px-10 py-6">
                  <Link to="/assessment">
                    <Target className="mr-2 w-5 h-5" />
                    Check Your Readiness
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              <p className="text-sm text-muted-foreground">
                Free assessment • No credit card required • Results in 5 minutes
              </p>
            </div>
          </ScaleIn>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}

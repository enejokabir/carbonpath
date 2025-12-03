import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  MapPin,
  FileText,
  BarChart3,
  Zap,
  Wrench,
  Calculator,
  Target,
  ArrowRight,
  Lock,
  Users,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Mail,
  Loader2,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { demoConsultants } from "@/data/realGrantsData";

// Consultant categories with icons
const categories = [
  {
    id: "grant_applications",
    name: "Grant Applications",
    description: "Help writing and submitting funding bids",
    icon: FileText
  },
  {
    id: "energy_audits",
    name: "Energy Audits",
    description: "Assess your energy use and find savings",
    icon: Zap
  },
  {
    id: "carbon_reporting",
    name: "Carbon Reporting",
    description: "Measure and report your emissions",
    icon: BarChart3
  },
  {
    id: "retrofit",
    name: "Retrofit Installation",
    description: "Install solar, insulation, heat pumps",
    icon: Wrench
  },
  {
    id: "tax_specialists",
    name: "Tax Specialists",
    description: "Claim R&D relief and capital allowances",
    icon: Calculator
  },
  {
    id: "strategy",
    name: "Strategy Consultants",
    description: "Develop your Net Zero roadmap",
    icon: Target
  }
];

interface Consultant {
  id: string;
  name: string;
  specialty: string;
  region: string;
  contact_email: string;
  contact_phone?: string | null;
  bio?: string | null;
  expertise_areas: string[];
  status: string;
  verified: boolean;
  fee_type?: string | null;
  years_experience?: number | null;
}

const regions = ["All Regions", "East Midlands", "Derby & Nottingham", "Midlands", "UK-wide", "UK-wide (remote)"];
const specialties = ["All Specialties", "Grant Applications", "Energy Audits", "Carbon Reporting", "Retrofit Installation", "Tax Specialists", "Strategy"];
const feeTypes = ["All Fee Types", "Fixed fee", "Hourly rate", "Success-based", "Project-based"];

export default function Consultants() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedFeeType, setSelectedFeeType] = useState("All Fee Types");
  const [savedConsultants, setSavedConsultants] = useState<string[]>([]);
  const [introDialogOpen, setIntroDialogOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [introMessage, setIntroMessage] = useState("");
  const [sendingIntro, setSendingIntro] = useState(false);

  // Load user and profile
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileData) setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    // Load saved consultants from localStorage
    const saved = localStorage.getItem("savedConsultants");
    if (saved) {
      setSavedConsultants(JSON.parse(saved));
    }

    return () => subscription.unsubscribe();
  }, []);

  // Load consultants from Supabase or use demo data
  useEffect(() => {
    const loadConsultants = async () => {
      setLoading(true);

      // If Supabase is not configured, use demo data
      if (!isSupabaseConfigured) {
        setConsultants(demoConsultants as Consultant[]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .eq("status", "approved")
        .order("verified", { ascending: false })
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading consultants:", error);
        // Fallback to demo data
        setConsultants(demoConsultants as Consultant[]);
      } else if (data && data.length > 0) {
        setConsultants(data as Consultant[]);
      } else {
        // No data from Supabase, use demo data
        setConsultants(demoConsultants as Consultant[]);
      }
      setLoading(false);
    };

    loadConsultants();
  }, []);

  const toggleSaveConsultant = (consultantId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to save consultants");
      return;
    }

    const newSavedConsultants = savedConsultants.includes(consultantId)
      ? savedConsultants.filter(id => id !== consultantId)
      : [...savedConsultants, consultantId];

    setSavedConsultants(newSavedConsultants);
    localStorage.setItem("savedConsultants", JSON.stringify(newSavedConsultants));

    toast.success(
      newSavedConsultants.includes(consultantId)
        ? "Consultant saved to your dashboard"
        : "Consultant removed from saved"
    );
  };

  const isConsultantSaved = (consultantId: string) => savedConsultants.includes(consultantId);

  const openIntroDialog = (consultant: Consultant, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to request introductions");
      return;
    }

    setSelectedConsultant(consultant);
    setIntroMessage("");
    setIntroDialogOpen(true);
  };

  const sendIntroRequest = async () => {
    if (!selectedConsultant || !user) return;

    setSendingIntro(true);

    try {
      // Save introduction request to database
      const { error } = await supabase.from("introduction_requests").insert({
        user_id: user.id,
        consultant_id: selectedConsultant.id,
        message: introMessage || null,
        status: "pending",
      });

      if (error) throw error;

      toast.success(`Introduction request sent to ${selectedConsultant.name}. They will contact you soon.`);
      setIntroDialogOpen(false);
      setSelectedConsultant(null);
      setIntroMessage("");
    } catch (error: any) {
      console.error("Error sending intro request:", error);
      toast.error("Failed to send introduction request: " + error.message);
    } finally {
      setSendingIntro(false);
    }
  };

  // Map expertise_areas to specialties for filtering
  const getSpecialties = (consultant: Consultant): string[] => {
    return consultant.expertise_areas || [consultant.specialty];
  };

  const filteredConsultants = consultants.filter((consultant) => {
    const specialtiesList = getSpecialties(consultant);

    const matchesRegion = selectedRegion === "All Regions" ||
      consultant.region.toLowerCase().includes(selectedRegion.toLowerCase().replace(" (remote)", ""));

    const matchesSpecialty = selectedSpecialty === "All Specialties" ||
      specialtiesList.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    const matchesFeeType = selectedFeeType === "All Fee Types" ||
      (consultant.fee_type && consultant.fee_type.toLowerCase().includes(selectedFeeType.toLowerCase()));

    const matchesCategory = !selectedCategory ||
      specialtiesList.some(s =>
        categories.find(c => c.id === selectedCategory)?.name.toLowerCase() === s.toLowerCase()
      );

    return matchesRegion && matchesSpecialty && matchesFeeType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-mint-fresh/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find a Consultant</h1>
            <p className="text-xl text-muted-foreground">
              Connect with trusted experts to guide your sustainability journey
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">What help do you need?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                  selectedCategory === category.id
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : ""
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <CardHeader className="p-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Not Logged In - Teaser View */}
      {!user ? (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Register to Browse Consultants</CardTitle>
                <CardDescription className="text-base">
                  Create a free account to view consultant profiles and request introductions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-left space-y-4">
                  <h3 className="font-semibold">How it works:</h3>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-semibold text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Browse</p>
                        <p className="text-sm text-muted-foreground">View consultant profiles and specialities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-semibold text-primary">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Request</p>
                        <p className="text-sm text-muted-foreground">Send an intro request through Carbon Path</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-semibold text-primary">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Connect</p>
                        <p className="text-sm text-muted-foreground">Consultant contacts you directly to discuss your needs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <Button size="lg" asChild className="w-full md:w-auto">
                    <Link to="/auth">
                      Register Free <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/auth" className="text-primary hover:underline">Sign in</Link>
                  </p>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <p className="text-sm font-medium">Are you a sustainability consultant?</p>
                  <Button variant="outline" asChild>
                    <Link to="/consultant/register">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Apply to Join Our Network
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Note: Any services are arranged directly between you and the consultant.
                    Carbon Path facilitates introductions only.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        /* Logged In - Full Consultant List */
        <>
          {/* Filters Section */}
          <section className="py-6 border-b border-border bg-card/50">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-3">
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[180px]">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFeeType} onValueChange={setSelectedFeeType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeTypes.map((feeType) => (
                      <SelectItem key={feeType} value={feeType}>{feeType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Showing {filteredConsultants.length} consultant{filteredConsultants.length !== 1 ? "s" : ""}
              </p>
            </div>
          </section>

          {/* Consultants Grid */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConsultants.map((consultant) => (
                    <Card key={consultant.id} className="border hover:border-primary/50 transition-all hover:shadow-elevated">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-mint-fresh/20 flex items-center justify-center shrink-0">
                            <Users className="w-7 h-7 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <CardTitle className="text-lg truncate">{consultant.name}</CardTitle>
                                {consultant.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 -mr-2"
                                onClick={(e) => toggleSaveConsultant(consultant.id, e)}
                              >
                                {isConsultantSaved(consultant.id) ? (
                                  <BookmarkCheck className="w-5 h-5 text-primary" />
                                ) : (
                                  <Bookmark className="w-5 h-5" />
                                )}
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {getSpecialties(consultant).slice(0, 3).map((specialty) => (
                                <Badge key={specialty} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {consultant.region}
                        </div>
                        <p className="text-sm line-clamp-3">{consultant.bio || "Sustainability consultant"}</p>
                        {consultant.fee_type && (
                          <div className="text-sm">
                            <span className="font-medium">Fee: </span>
                            <span className="text-muted-foreground">{consultant.fee_type}</span>
                          </div>
                        )}
                        {consultant.years_experience && (
                          <div className="text-sm text-muted-foreground">
                            {consultant.years_experience}+ years experience
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant={isConsultantSaved(consultant.id) ? "secondary" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={(e) => toggleSaveConsultant(consultant.id, e)}
                          >
                            {isConsultantSaved(consultant.id) ? (
                              <>
                                <BookmarkCheck className="w-4 h-4 mr-1" />
                                Saved
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-4 h-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                          <Button size="sm" className="flex-1" onClick={(e) => openIntroDialog(consultant, e)}>
                            <Mail className="w-4 h-4 mr-1" />
                            Request Intro
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && filteredConsultants.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No consultants match your current filters</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedRegion("All Regions");
                        setSelectedSpecialty("All Specialties");
                        setSelectedFeeType("All Fee Types");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Become a Consultant CTA */}
          <section className="py-8 border-t border-border">
            <div className="container mx-auto px-4">
              <Card className="max-w-2xl mx-auto text-center bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Are you a sustainability consultant?</h3>
                  <p className="text-muted-foreground mb-4">
                    Join our network to connect with UK SMEs looking for expert guidance
                  </p>
                  <Button asChild>
                    <Link to="/consultant/register">
                      Apply to Join <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      )}

      {/* Disclaimer */}
      <section className="py-8 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> Consultants are independent professionals.
              Any engagement is directly between you and the consultant.
              Carbon Path is not responsible for the quality or outcome of their services.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Intro Request Dialog */}
      <Dialog open={introDialogOpen} onOpenChange={setIntroDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Introduction</DialogTitle>
            <DialogDescription>
              Send an introduction request to {selectedConsultant?.name}. They will receive your contact details and message.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedConsultant && (
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedConsultant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {getSpecialties(selectedConsultant).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message (optional)</label>
              <Textarea
                placeholder="Briefly describe what help you're looking for..."
                value={introMessage}
                onChange={(e) => setIntroMessage(e.target.value)}
                rows={4}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The consultant will receive your name, email, and business details from your profile.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIntroDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendIntroRequest} disabled={sendingIntro}>
              {sendingIntro ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

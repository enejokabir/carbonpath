import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const expertiseOptions = [
  { id: "grant_applications", label: "Grant Applications" },
  { id: "energy_audits", label: "Energy Audits" },
  { id: "carbon_reporting", label: "Carbon Reporting" },
  { id: "retrofit", label: "Retrofit Installation" },
  { id: "tax_specialists", label: "Tax Specialists" },
  { id: "strategy", label: "Strategy Consulting" },
  { id: "iso_certification", label: "ISO Certification" },
  { id: "funding_strategy", label: "Funding Strategy" },
];

const regionOptions = [
  "East Midlands",
  "West Midlands",
  "Derby & Nottingham",
  "Midlands",
  "North East",
  "North West",
  "Yorkshire",
  "South East",
  "South West",
  "London",
  "Scotland",
  "Wales",
  "Northern Ireland",
  "UK-wide",
  "UK-wide (remote)",
];

const feeTypeOptions = [
  "Fixed fee packages",
  "Hourly rate",
  "Success-based (% of grant secured)",
  "Project-based",
  "Retainer",
  "No win, no fee",
];

export default function ConsultantRegister() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    region: "",
    specialty: "",
    bio: "",
    expertiseAreas: [] as string[],
    feeType: "",
    yearsExperience: "",
    companyWebsite: "",
    certifications: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setFormData(prev => ({
          ...prev,
          contactEmail: session.user.email || "",
        }));

        // Check if user already has an application
        const { data: existingConsultant } = await supabase
          .from("consultants")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (existingConsultant) {
          setExistingApplication(existingConsultant);
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          contactEmail: session.user.email || "",
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleExpertise = (id: string) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(id)
        ? prev.expertiseAreas.filter(e => e !== id)
        : [...prev.expertiseAreas, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to submit your application");
      return;
    }

    if (!formData.name || !formData.region || !formData.specialty || !formData.bio) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.expertiseAreas.length === 0) {
      toast.error("Please select at least one area of expertise");
      return;
    }

    setSubmitting(true);

    try {
      const expertiseLabels = formData.expertiseAreas.map(id =>
        expertiseOptions.find(e => e.id === id)?.label || id
      );

      const { error } = await supabase.from("consultants").insert({
        user_id: user.id,
        name: formData.name,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        region: formData.region,
        specialty: formData.specialty,
        bio: formData.bio,
        expertise_areas: expertiseLabels,
        fee_type: formData.feeType || null,
        years_experience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
        company_website: formData.companyWebsite || null,
        certifications: formData.certifications ? formData.certifications.split(",").map(s => s.trim()) : [],
        status: "pending",
        verified: false,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll review it shortly.");
      navigate("/consultant/dashboard");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show existing application status
  if (existingApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sage-light/30 to-white">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              {existingApplication.status === "pending" ? (
                <>
                  <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Application Under Review</CardTitle>
                  <CardDescription className="text-base">
                    Your consultant application is being reviewed by our team.
                    We'll notify you once it's been processed.
                  </CardDescription>
                </>
              ) : existingApplication.status === "approved" ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Application Approved!</CardTitle>
                  <CardDescription className="text-base">
                    Congratulations! Your profile is now live on Carbon Path.
                  </CardDescription>
                </>
              ) : (
                <>
                  <CardTitle className="text-2xl">Application Status: {existingApplication.status}</CardTitle>
                  {existingApplication.rejection_reason && (
                    <CardDescription className="text-base">
                      Reason: {existingApplication.rejection_reason}
                    </CardDescription>
                  )}
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-left p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Your Application Details:</h4>
                <p><strong>Name:</strong> {existingApplication.name}</p>
                <p><strong>Region:</strong> {existingApplication.region}</p>
                <p><strong>Specialty:</strong> {existingApplication.specialty}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/consultants">Browse Consultants</Link>
                </Button>
                {existingApplication.status === "approved" && (
                  <Button asChild>
                    <Link to="/consultant/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sage-light/30 to-white">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Join Our Consultant Network</CardTitle>
              <CardDescription className="text-base">
                Please sign in or create an account to apply as a consultant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/auth">
                  Sign In / Register <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                After signing in, you'll be able to complete your consultant application.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-light/30 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/consultants">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Consultants
            </Link>
          </Button>
          <div className="text-center">
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Join Our Consultant Network</h1>
            <p className="text-muted-foreground">
              Connect with UK SMEs looking for sustainability expertise
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Consultant Application</CardTitle>
            <CardDescription>
              Fill in your details below. All applications are reviewed by our team before being listed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company / Consultant Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., GreenPath Consulting"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Service Details</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Primary Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData({ ...formData, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regionOptions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Primary Specialty *</Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {expertiseOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.label}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Areas of Expertise *</Label>
                  <p className="text-sm text-muted-foreground mb-2">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-3">
                    {expertiseOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={formData.expertiseAreas.includes(option.id)}
                          onCheckedChange={() => toggleExpertise(option.id)}
                        />
                        <label
                          htmlFor={option.id}
                          className="text-sm cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Your Services *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Describe your experience, services offered, and what makes you stand out..."
                    rows={5}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feeType">Fee Structure</Label>
                    <Select
                      value={formData.feeType}
                      onValueChange={(value) => setFormData({ ...formData, feeType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeTypeOptions.map((fee) => (
                          <SelectItem key={fee} value={fee}>{fee}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    placeholder="e.g., ISO 14064, IEMA, ESOS (comma-separated)"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t space-y-4">
                <p className="text-sm text-muted-foreground">
                  By submitting this application, you agree to our terms of service.
                  Your profile will be reviewed before being listed on Carbon Path.
                </p>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  AlertTriangle,
  Lightbulb,
  Check,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const TOTAL_STEPS = 4;

const sectors = [
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "logistics", label: "Logistics" },
  { value: "professional_services", label: "Professional Services" },
  { value: "tech", label: "Tech" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" }
];

const barriers = [
  { id: "cost", label: "Cost or lack of funding" },
  { id: "knowledge", label: "Don't know what documents are needed" },
  { id: "data", label: "Difficulty gathering evidence" },
  { id: "time", label: "Limited staff time" },
  { id: "pressure", label: "No customer or supply chain pressure yet" },
  { id: "roi", label: "Uncertain return on investment" },
  { id: "grants", label: "Not aware of available grants" },
  { id: "trust", label: "Hard to find trusted consultants" }
];

const consultantTypes = [
  { id: "grant_support", label: "Grant application support" },
  { id: "carbon_reporting", label: "Carbon reporting / compliance specialists" },
  { id: "energy_auditors", label: "Energy auditors" },
  { id: "retrofit", label: "Retrofit / installation contractors" },
  { id: "tax_specialists", label: "Chartered accountants / tax specialists" }
];

const featureRatings = [
  { id: "evidence_locker", label: "A secure place to store and organise compliance documents" },
  { id: "readiness_score", label: "A readiness score showing how prepared you are" },
  { id: "grant_matching", label: "Matching to grants, subsidies and funding" },
  { id: "consultant_access", label: "Access to vetted consultants for compliance support" },
  { id: "tax_info", label: "Information on tax incentives for sustainability" }
];

export default function Assessment() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Business Profile
    employeeCount: "",
    sector: "",
    postcode: "",
    trackingStatus: "",

    // Step 2: Challenges
    selectedBarriers: [] as string[],
    grantAwareness: "",
    previousApplications: "",

    // Step 3: Support Interests
    featureRatings: {} as Record<string, number>,
    selectedConsultants: [] as string[],
    feePreference: "",
    taxInterest: "",

    // Step 4: Contact (optional)
    name: "",
    email: "",
    businessName: "",
    consentContact: false
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const progress = (step / TOTAL_STEPS) * 100;

  const handleBarrierToggle = (barrierId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedBarriers: prev.selectedBarriers.includes(barrierId)
        ? prev.selectedBarriers.filter(id => id !== barrierId)
        : [...prev.selectedBarriers, barrierId]
    }));
  };

  const handleConsultantToggle = (consultantId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedConsultants: prev.selectedConsultants.includes(consultantId)
        ? prev.selectedConsultants.filter(id => id !== consultantId)
        : [...prev.selectedConsultants, consultantId]
    }));
  };

  const handleFeatureRating = (featureId: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      featureRatings: {
        ...prev.featureRatings,
        [featureId]: value[0]
      }
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.employeeCount && formData.sector && formData.postcode && formData.trackingStatus;
      case 2:
        return formData.selectedBarriers.length > 0 && formData.grantAwareness;
      case 3:
        return Object.keys(formData.featureRatings).length >= 3;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Save assessment data to localStorage for retrieval
      localStorage.setItem("assessment_completed", JSON.stringify({
        ...formData,
        completed_at: new Date().toISOString(),
      }));

      toast.success("Assessment completed!");

      // If user is not logged in, redirect to auth with assessment data
      if (!user) {
        // Store in session storage to retrieve after auth
        sessionStorage.setItem("assessmentData", JSON.stringify(formData));
        navigate("/auth?from=assessment");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      {/* Minimal Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Carbon Path" className="w-6 h-6 object-contain" />
            <span className="font-semibold text-lg">Carbon Path</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <X className="w-4 h-4 mr-2" />
              Save & Exit
            </Link>
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">

          {/* Step 1: Business Profile */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">About Your Business</h1>
                <p className="text-muted-foreground">
                  Let's start with some basics. This helps us understand your context.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-3">
                    <Label>How many employees does your business have?</Label>
                    <RadioGroup
                      value={formData.employeeCount}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, employeeCount: value }))}
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="micro" id="micro" />
                        <Label htmlFor="micro" className="flex-1 cursor-pointer">Micro (1 to 9)</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small" className="flex-1 cursor-pointer">Small (10 to 49)</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="flex-1 cursor-pointer">Medium (50 to 249)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>What is your industry or sector?</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector.value} value={sector.value}>
                            {sector.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="postcode">Business postcode</Label>
                    <Input
                      id="postcode"
                      placeholder="e.g. DE1 2QY"
                      value={formData.postcode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                    />
                    <p className="text-sm text-muted-foreground">
                      We use this to show relevant local grants
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Do you have sustainability documentation in place?</Label>
                    <RadioGroup
                      value={formData.trackingStatus}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, trackingStatus: value }))}
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="comprehensive" id="comprehensive" />
                        <Label htmlFor="comprehensive" className="flex-1 cursor-pointer">Yes, well organised</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="partial" id="partial" />
                        <Label htmlFor="partial" className="flex-1 cursor-pointer">Yes, but scattered across files</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="planning" id="planning" />
                        <Label htmlFor="planning" className="flex-1 cursor-pointer">No, but planning to start</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="flex-1 cursor-pointer">No, not sure what's needed</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Challenges */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">Your Challenges</h1>
                <p className="text-muted-foreground">
                  Understanding what's holding you back helps us point you to the right support.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-3">
                    <Label>What barriers do you face in becoming sustainability compliant?</Label>
                    <p className="text-sm text-muted-foreground">Select all that apply</p>
                    <div className="space-y-2">
                      {barriers.map((barrier) => (
                        <div
                          key={barrier.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => handleBarrierToggle(barrier.id)}
                        >
                          <Checkbox
                            id={barrier.id}
                            checked={formData.selectedBarriers.includes(barrier.id)}
                            onCheckedChange={() => handleBarrierToggle(barrier.id)}
                          />
                          <Label htmlFor={barrier.id} className="flex-1 cursor-pointer">
                            {barrier.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Are you aware of any grants for sustainability or compliance improvements?</Label>
                    <RadioGroup
                      value={formData.grantAwareness}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, grantAwareness: value }))}
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="applied" id="applied" />
                        <Label htmlFor="applied" className="flex-1 cursor-pointer">Yes, and we have applied</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="aware_not_applied" id="aware_not_applied" />
                        <Label htmlFor="aware_not_applied" className="flex-1 cursor-pointer">Yes, but have not applied</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="unsure" id="unsure" />
                        <Label htmlFor="unsure" className="flex-1 cursor-pointer">Aware, but unsure of the details</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="not_aware" id="not_aware" />
                        <Label htmlFor="not_aware" className="flex-1 cursor-pointer">Not aware of any</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Support Interests */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">What Support Would Help?</h1>
                <p className="text-muted-foreground">
                  This helps us recommend the right resources and consultants.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <Label>How valuable would these features be for your business?</Label>
                    {featureRatings.map((feature) => (
                      <div key={feature.id} className="space-y-2 p-4 rounded-lg border">
                        <Label className="text-sm">{feature.label}</Label>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground w-16">Not useful</span>
                          <Slider
                            value={[formData.featureRatings[feature.id] || 3]}
                            onValueChange={(value) => handleFeatureRating(feature.id, value)}
                            max={5}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs text-muted-foreground w-16 text-right">Very useful</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label>Which consultant types would be most useful?</Label>
                    <p className="text-sm text-muted-foreground">Select all that apply</p>
                    <div className="space-y-2">
                      {consultantTypes.map((consultant) => (
                        <div
                          key={consultant.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => handleConsultantToggle(consultant.id)}
                        >
                          <Checkbox
                            id={consultant.id}
                            checked={formData.selectedConsultants.includes(consultant.id)}
                            onCheckedChange={() => handleConsultantToggle(consultant.id)}
                          />
                          <Label htmlFor={consultant.id} className="flex-1 cursor-pointer">
                            {consultant.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Would you be interested in guidance on tax incentives for sustainability?</Label>
                    <RadioGroup
                      value={formData.taxInterest}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, taxInterest: value }))}
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="yes" id="tax_yes" />
                        <Label htmlFor="tax_yes" className="flex-1 cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="maybe" id="tax_maybe" />
                        <Label htmlFor="tax_maybe" className="flex-1 cursor-pointer">Maybe</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="no" id="tax_no" />
                        <Label htmlFor="tax_no" className="flex-1 cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Complete / Results */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">Thanks for completing the assessment</h1>
                <p className="text-muted-foreground">
                  Based on your responses, here's what we can help with
                </p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center p-4">
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="font-semibold capitalize">{formData.sector.replace("_", " ")}</p>
                </Card>
                <Card className="text-center p-4">
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="font-semibold">East Midlands</p>
                </Card>
                <Card className="text-center p-4">
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-semibold capitalize">{formData.employeeCount}</p>
                </Card>
              </div>

              {/* Challenges Identified */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Challenges You Identified</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formData.selectedBarriers.map((barrierId) => {
                      const barrier = barriers.find(b => b.id === barrierId);
                      return barrier ? (
                        <li key={barrierId} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {barrier.label}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommended Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    to="/grants"
                    className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <span className="text-2xl">💰</span>
                    <span>Browse grants available for your sector and region</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                  <Link
                    to="/consultants"
                    className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <span className="text-2xl">🤝</span>
                    <span>Connect with grant application consultants</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                  <Link
                    to="/learn/tax-incentives-overview"
                    className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <span className="text-2xl">📚</span>
                    <span>Read: Tax incentives for sustainability improvements</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </CardContent>
              </Card>

              {/* Create Account CTA */}
              {!user && (
                <Card className="border-2 border-primary/20">
                  <CardHeader className="text-center">
                    <CardTitle>Save Your Results</CardTitle>
                    <CardDescription>
                      Create a free account to save your assessment and access full grant details and consultant profiles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup_email">Email</Label>
                      <Input
                        id="signup_email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup_business">Business name</Label>
                      <Input
                        id="signup_business"
                        placeholder="Your Business Ltd"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="consent"
                        checked={formData.consentContact}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, consentContact: checked as boolean }))
                        }
                      />
                      <Label htmlFor="consent" className="text-sm text-muted-foreground">
                        I agree to be contacted about Carbon Path updates
                      </Label>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account & View Results"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/auth" className="text-primary hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(prev => prev - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                onClick={() => setStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : user ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Go to Dashboard"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

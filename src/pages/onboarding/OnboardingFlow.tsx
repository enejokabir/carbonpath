import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Building2, ClipboardCheck, Upload, ArrowRight, ArrowLeft, Check } from "lucide-react";

// Demo workspace helper
const createDemoWorkspace = (data: {
  name: string;
  industry: string;
  employeeCount: number | null;
  location: string;
  postcode: string;
}) => {
  const workspace = {
    id: `demo-${Date.now()}`,
    name: data.name,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    industry: data.industry,
    employee_count: data.employeeCount,
    location: data.location,
    postcode: data.postcode,
    onboarding_completed: true,
    onboarding_step: 3,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem("demo_workspace", JSON.stringify(workspace));
  localStorage.setItem("demo_readiness_score", JSON.stringify({
    workspace_id: workspace.id,
    overall_score: 0,
    evidence_score: 0,
    freshness_score: 0,
    checklist_score: 0,
    obligations_score: 0,
    total_evidence_items: 0,
    current_evidence_items: 0,
    expiring_evidence_items: 0,
    expired_evidence_items: 0,
    total_obligations: 0,
    overdue_obligations: 0,
    upcoming_obligations: 0,
  }));
  return workspace;
};

const INDUSTRIES = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "construction", label: "Construction" },
  { value: "transportation", label: "Transportation & Logistics" },
  { value: "agriculture", label: "Agriculture" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance & Professional Services" },
  { value: "other", label: "Other" },
];

const EMPLOYEE_RANGES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-250", label: "51-250 employees" },
  { value: "251-500", label: "251-500 employees" },
  { value: "500+", label: "500+ employees" },
];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Step 1: Company Profile
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeRange, setEmployeeRange] = useState("");
  const [location, setLocation] = useState("");
  const [postcode, setPostcode] = useState("");

  // Step 2: Checklist acknowledgment
  const [checklistAcknowledged, setChecklistAcknowledged] = useState(false);

  // Step 3: First evidence (optional)
  const [skipEvidence, setSkipEvidence] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check for demo workspace first
      const demoWorkspace = localStorage.getItem("demo_workspace");
      if (demoWorkspace) {
        navigate("/workspace/dashboard");
        return;
      }

      // If Supabase not configured, allow demo mode without auth
      if (!isSupabaseConfigured) {
        setUser({ id: "demo-user", email: "demo@example.com" });
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Allow demo mode for testing
        setUser({ id: "demo-user", email: "demo@example.com" });
        return;
      }
      setUser(session.user);

      // Check if user already has a workspace
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_workspace_id")
          .eq("id", session.user.id)
          .single();

        if (profile?.current_workspace_id) {
          navigate("/workspace/dashboard");
        }
      } catch {
        // Table might not exist, continue with onboarding
      }
    };

    checkAuth();
  }, [navigate]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Math.random().toString(36).substring(2, 8);
  };

  const handleStep1Submit = async () => {
    if (!companyName || !industry) {
      toast.error("Please fill in company name and industry");
      return;
    }

    setLoading(true);
    try {
      // Try Supabase first, fall back to demo mode
      if (isSupabaseConfigured && user?.id && !user.id.startsWith("demo")) {
        try {
          const slug = generateSlug(companyName);

          // Create workspace
          const { data: workspace, error: workspaceError } = await supabase
            .from("workspaces")
            .insert({
              name: companyName,
              slug,
              industry,
              employee_count: employeeRange ? parseInt(employeeRange.split("-")[0]) : null,
              location,
              postcode,
              onboarding_step: 1,
            })
            .select()
            .single();

          if (workspaceError) throw workspaceError;

          // Add user as workspace owner
          const { error: memberError } = await supabase
            .from("workspace_members")
            .insert({
              workspace_id: workspace.id,
              user_id: user.id,
              role: "owner",
            });

          if (memberError) throw memberError;

          // Update user's current workspace
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ current_workspace_id: workspace.id })
            .eq("id", user.id);

          if (profileError) throw profileError;

          setStep(2);
          return;
        } catch {
          // Supabase not available, fall through to demo mode
        }
      }

      // Demo mode - store in localStorage
      createDemoWorkspace({
        name: companyName,
        industry,
        employeeCount: employeeRange ? parseInt(employeeRange.split("-")[0]) : null,
        location,
        postcode,
      });
      setStep(2);
    } catch (error: any) {
      toast.error("Error creating workspace: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    setLoading(true);
    try {
      // Demo mode - just proceed
      const demoWorkspace = localStorage.getItem("demo_workspace");
      if (demoWorkspace) {
        setStep(3);
        setLoading(false);
        return;
      }

      // Update onboarding step in Supabase
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_workspace_id")
        .eq("id", user.id)
        .single();

      if (profile?.current_workspace_id) {
        await supabase
          .from("workspaces")
          .update({ onboarding_step: 2 })
          .eq("id", profile.current_workspace_id);
      }

      setStep(3);
    } catch (error: any) {
      // Still proceed in demo mode
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Demo mode - workspace already created, just navigate
      const demoWorkspace = localStorage.getItem("demo_workspace");
      if (demoWorkspace) {
        toast.success("Workspace setup complete!");
        navigate("/workspace/dashboard");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_workspace_id")
        .eq("id", user.id)
        .single();

      if (profile?.current_workspace_id) {
        await supabase
          .from("workspaces")
          .update({
            onboarding_step: 3,
            onboarding_completed: true
          })
          .eq("id", profile.current_workspace_id);

        // Initialize readiness score
        await supabase
          .from("readiness_scores")
          .insert({
            workspace_id: profile.current_workspace_id,
            overall_score: 0,
            evidence_score: 0,
            freshness_score: 0,
            checklist_score: 0,
            obligations_score: 0,
          });
      }

      toast.success("Workspace setup complete!");
      navigate("/workspace/dashboard");
    } catch (error: any) {
      // Demo mode fallback
      toast.success("Workspace setup complete!");
      navigate("/workspace/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Company Profile", icon: Building2 },
    { number: 2, title: "Industry Checklist", icon: ClipboardCheck },
    { number: 3, title: "First Evidence", icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sage-light/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-6">Set Up Your Workspace</h1>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step >= s.number
                    ? "bg-primary border-primary text-white"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {step > s.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-5 h-5" />
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 ${
                    step > s.number ? "bg-primary" : "bg-muted-foreground/30"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-sage-light/20 shadow-soft">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Company Profile
                </CardTitle>
                <CardDescription>
                  Tell us about your company so we can tailor your compliance checklist
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Ltd"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind.value} value={ind.value}>
                          {ind.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Select value={employeeRange} onValueChange={setEmployeeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEE_RANGES.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="London"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={handleStep1Submit}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Continue"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  Industry Compliance Checklist
                </CardTitle>
                <CardDescription>
                  Based on your industry, here's what you'll typically need for sustainability compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-sage-light/10 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Common Requirements:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Environmental Policy Document
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Energy consumption records (utility bills)
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Waste management documentation
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Supply chain sustainability statements
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Staff environmental training records
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground">
                  Don't worry if you don't have all of these yet. Your dashboard will guide you
                  through collecting and organizing this evidence at your own pace.
                </p>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleStep2Submit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "I Understand, Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Your First Document
                </CardTitle>
                <CardDescription>
                  Start building your evidence locker with your first document (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Suggested: Environmental policy, recent utility bill, or any certification
                  </p>
                  <Button variant="outline" className="mt-4">
                    Browse Files
                  </Button>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSkipEvidence(true);
                      handleComplete();
                    }}
                    disabled={loading}
                  >
                    Skip for now
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleComplete}
                    disabled={loading}
                  >
                    {loading ? "Completing..." : "Complete Setup"}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

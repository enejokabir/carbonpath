import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  Plane,
  Calculator,
  TrendingDown,
  Award,
  Info,
  Building2,
  PoundSterling,
  Users,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Mail,
  User,
  MapPin,
  Shield,
  Clock,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  calculateEmissions,
  getDefaultInputs,
  formatEmissions,
  getEmployeeRange,
  calculateScore,
  getCategoryFromBenchmark,
  type EmissionInputs,
  type CarbonFootprint,
  type SectorBenchmark,
} from "@/lib/carbonCalculator";
import { industryEmissionFactors, commonEmissionQuestions, realGrants, realSubsidies } from "@/data/realGrantsData";
import { AnimatedCounter, AnimatedProgress } from "@/components/ui/animated-counter";
import { LeafLoader } from "@/components/ui/loading";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/page-transition";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const TOTAL_STEPS = 6; // Lead capture + business selection + 4 calculation steps

const businessTypes = Object.entries(industryEmissionFactors).map(([value, data]) => ({
  value,
  label: data.label,
  description: data.description,
}));

const SCOPE_COLORS = {
  scope1: "#ef4444",
  scope2: "#f59e0b",
  scope3: "#3b82f6",
};

interface LeadInfo {
  name: string;
  email: string;
  postcode: string;
  companyName: string;
}

export default function CarbonCalculator() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [step, setStep] = useState(-1); // Start at step -1 for lead capture
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [benchmark, setBenchmark] = useState<SectorBenchmark | null>(null);
  const [result, setResult] = useState<CarbonFootprint | null>(null);
  const [industryInputs, setIndustryInputs] = useState<Record<string, number>>({});

  const [inputs, setInputs] = useState<EmissionInputs>(getDefaultInputs());
  const [businessType, setBusinessType] = useState("");

  // Lead capture info
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "",
    email: "",
    postcode: "",
    companyName: "",
  });
  const [leadErrors, setLeadErrors] = useState<Partial<LeadInfo>>({});

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

        if (profileData) {
          setProfile(profileData);
          if (profileData.business_type) {
            setBusinessType(profileData.business_type.toLowerCase().replace(" ", "_"));
          }
          setInputs(prev => ({
            ...prev,
            employeesCount: profileData.employees || 1,
          }));
        }
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load benchmark when business type changes
  useEffect(() => {
    const loadBenchmark = async () => {
      if (!businessType || !inputs.employeesCount) return;

      const industryData = industryEmissionFactors[businessType as keyof typeof industryEmissionFactors];
      if (industryData) {
        setBenchmark({
          businessType,
          employeeRange: getEmployeeRange(inputs.employeesCount),
          avgKgCo2ePerEmployee: industryData.avgEmissionsPerEmployee,
          goodThresholdKg: industryData.benchmarkGood,
          averageThresholdKg: industryData.benchmarkAverage,
        });
      }
    };

    loadBenchmark();
  }, [businessType, inputs.employeesCount]);

  const updateScope1 = (field: keyof EmissionInputs["scope1"], value: number) => {
    setInputs(prev => ({
      ...prev,
      scope1: { ...prev.scope1, [field]: value },
    }));
  };

  const updateScope2 = (field: keyof EmissionInputs["scope2"], value: number) => {
    setInputs(prev => ({
      ...prev,
      scope2: { ...prev.scope2, [field]: value },
    }));
  };

  const updateScope3 = (field: keyof EmissionInputs["scope3"], value: number) => {
    setInputs(prev => ({
      ...prev,
      scope3: { ...prev.scope3, [field]: value },
    }));
  };

  const calculateIndustryEmissions = () => {
    const industryData = industryEmissionFactors[businessType as keyof typeof industryEmissionFactors];
    if (!industryData) return 0;

    let total = 0;
    industryData.specificQuestions.forEach(q => {
      const value = industryInputs[q.id] || 0;
      total += value * q.factor;
    });
    return total;
  };

  const handleCalculate = () => {
    const baseResult = calculateEmissions(inputs);
    const industryEmissions = calculateIndustryEmissions();

    // Add industry-specific emissions to appropriate scopes
    const industryData = industryEmissionFactors[businessType as keyof typeof industryEmissionFactors];
    let additionalScope1 = 0;
    let additionalScope2 = 0;
    let additionalScope3 = 0;

    if (industryData) {
      industryData.specificQuestions.forEach(q => {
        const value = industryInputs[q.id] || 0;
        const emissions = value * q.factor;
        if (q.scope === 1) additionalScope1 += emissions;
        else if (q.scope === 2) additionalScope2 += emissions;
        else additionalScope3 += emissions;
      });
    }

    const enhancedResult: CarbonFootprint = {
      ...baseResult,
      scope1TotalKgCo2e: baseResult.scope1TotalKgCo2e + additionalScope1,
      scope2TotalKgCo2e: baseResult.scope2TotalKgCo2e + additionalScope2,
      scope3TotalKgCo2e: baseResult.scope3TotalKgCo2e + additionalScope3,
      totalKgCo2e: baseResult.totalKgCo2e + industryEmissions,
      totalTonnesCo2e: (baseResult.totalKgCo2e + industryEmissions) / 1000,
      kgCo2ePerEmployee: (baseResult.totalKgCo2e + industryEmissions) / (inputs.employeesCount || 1),
    };

    setResult(enhancedResult);
    setStep(5);
  };

  const handleSave = async () => {
    if (!user || !result) {
      toast.error("Please sign in to save your calculation");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: footprintError } = await supabase.from("carbon_footprints").insert({
        user_id: user.id,
        period_start: inputs.periodStart.toISOString().split("T")[0],
        period_end: inputs.periodEnd.toISOString().split("T")[0],
        scope1_natural_gas_kwh: inputs.scope1.naturalGasKwh,
        scope1_heating_oil_litres: inputs.scope1.heatingOilLitres,
        scope1_company_vehicles_petrol_litres: inputs.scope1.companyVehiclesPetrolLitres,
        scope1_company_vehicles_diesel_litres: inputs.scope1.companyVehiclesDieselLitres,
        scope1_total_kg_co2e: result.scope1TotalKgCo2e,
        scope2_electricity_kwh: inputs.scope2.electricityKwh,
        scope2_total_kg_co2e: result.scope2TotalKgCo2e,
        scope3_business_travel_km: inputs.scope3.businessTravelCarKm,
        scope3_waste_tonnes: inputs.scope3.wasteGeneralTonnes,
        scope3_water_cubic_metres: inputs.scope3.waterCubicMetres,
        scope3_total_kg_co2e: result.scope3TotalKgCo2e,
        total_kg_co2e: result.totalKgCo2e,
        kg_co2e_per_employee: result.kgCo2ePerEmployee,
      });

      if (footprintError) throw footprintError;

      if (benchmark) {
        const score = calculateScore(result.kgCo2ePerEmployee, benchmark);
        const category = getCategoryFromBenchmark(result.kgCo2ePerEmployee, benchmark);

        const { error: scoreError } = await supabase.from("carbon_scores").upsert({
          user_id: user.id,
          score,
          category,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        });

        if (scoreError) throw scoreError;
      }

      toast.success("Carbon footprint saved successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving calculation:", error);
      toast.error("Failed to save calculation: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = (step / TOTAL_STEPS) * 100;

  // Get recommended grants based on business type and location
  const getRecommendedGrants = () => {
    const location = profile?.location || "";
    return realGrants
      .filter(grant => {
        const matchesType = grant.business_types.includes("All") ||
          grant.business_types.some(t => t.toLowerCase().includes(businessType));
        const matchesLocation = grant.location_scope.includes("UK-wide") ||
          grant.location_scope.some(l => location.toLowerCase().includes(l.toLowerCase()));
        return matchesType && matchesLocation && grant.is_active;
      })
      .slice(0, 4);
  };

  const getRecommendedSubsidies = () => {
    return realSubsidies
      .filter(s => {
        const matchesType = s.business_types.length === 0 ||
          s.business_types.some(t => t.toLowerCase().includes(businessType));
        return matchesType && s.is_active;
      })
      .slice(0, 3);
  };

  // Validate lead info
  const validateLeadInfo = (): boolean => {
    const errors: Partial<LeadInfo> = {};

    if (!leadInfo.name.trim()) {
      errors.name = "Name is required";
    }

    if (!leadInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadInfo.email)) {
      errors.email = "Please enter a valid email";
    }

    // Postcode is optional, but validate format if provided
    if (leadInfo.postcode.trim() && !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(leadInfo.postcode.replace(/\s/g, ''))) {
      errors.postcode = "Please enter a valid UK postcode";
    }

    setLeadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save lead info to database
  const saveLeadInfo = async () => {
    try {
      const { error } = await supabase.from("calculator_leads").insert({
        name: leadInfo.name.trim(),
        email: leadInfo.email.trim().toLowerCase(),
        postcode: leadInfo.postcode.trim().toUpperCase(),
        company_name: leadInfo.companyName.trim() || null,
      });

      if (error) {
        // If table doesn't exist yet, just log it
        console.log("Lead capture note:", error.message);
      }
    } catch (err) {
      console.log("Lead capture:", err);
    }
  };

  // Handle lead form submission
  const handleLeadSubmit = async () => {
    if (!validateLeadInfo()) return;

    await saveLeadInfo();
    setStep(0); // Move to business selection
  };

  // Step -1: Lead Capture
  const renderLeadCapture = () => (
    <FadeIn>
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-sage to-mint-fresh" />
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center"
          >
            <Calculator className="w-10 h-10 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl">Free Carbon Footprint Calculator</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            Get your personalized carbon footprint report with recommendations for grants and subsidies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-w-md mx-auto">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3 py-4"
          >
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">5 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">100% Free</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">UK Compliant</p>
            </div>
          </motion.div>

          {/* Form */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Your Name *
              </Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={leadInfo.name}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, name: e.target.value }))}
                className={leadErrors.name ? "border-red-500" : ""}
              />
              {leadErrors.name && (
                <p className="text-xs text-red-500">{leadErrors.name}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.co.uk"
                value={leadInfo.email}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, email: e.target.value }))}
                className={leadErrors.email ? "border-red-500" : ""}
              />
              {leadErrors.email && (
                <p className="text-xs text-red-500">{leadErrors.email}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Company Name (optional)
              </Label>
              <Input
                id="companyName"
                placeholder="Acme Ltd"
                value={leadInfo.companyName}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="postcode" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Business Postcode (optional)
              </Label>
              <Input
                id="postcode"
                placeholder="SW1A 1AA"
                value={leadInfo.postcode}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
                className={leadErrors.postcode ? "border-red-500" : ""}
              />
              {leadErrors.postcode && (
                <p className="text-xs text-red-500">{leadErrors.postcode}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Helps us match you with regional grants and support
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <Button
              onClick={handleLeadSubmit}
              className="w-full bg-gradient-to-r from-primary to-sage hover:opacity-90 py-6 text-lg"
            >
              Start Free Calculator
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-center text-muted-foreground"
          >
            By continuing, you agree to receive your results and relevant sustainability information.
            We respect your privacy and won't spam you.
          </motion.p>
        </CardContent>
      </Card>
    </FadeIn>
  );

  // Step 0: Business Selection
  const renderStep0 = () => (
    <FadeIn>
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center"
          >
            <Building2 className="w-10 h-10 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl">Let's Start Your Assessment</CardTitle>
          <CardDescription className="text-base">
            Tell us about your business to get a personalized carbon footprint calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">What type of business do you run?</Label>
            <div className="grid md:grid-cols-2 gap-3">
              {businessTypes.map((type, index) => (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setBusinessType(type.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${
                      businessType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {businessType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid md:grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  placeholder="e.g., 25"
                  value={inputs.employeesCount || ""}
                  onChange={(e) => setInputs(prev => ({ ...prev, employeesCount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorArea">Office/Premises Size (m²)</Label>
                <Input
                  id="floorArea"
                  type="number"
                  placeholder="e.g., 500"
                  value={inputs.floorAreaSqm || ""}
                  onChange={(e) => setInputs(prev => ({ ...prev, floorAreaSqm: Number(e.target.value) }))}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );

  // Step 1: Scope 1
  const renderStep1 = () => (
    <FadeIn>
      <Card className="border-sage-light overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-red-400 to-red-600" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center"
            >
              <Flame className="w-6 h-6 text-red-600" />
            </motion.div>
            <div>
              <CardTitle>Scope 1: Direct Emissions</CardTitle>
              <CardDescription>
                Fuel combustion, company vehicles, and on-site processes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {commonEmissionQuestions.scope1.map((question, index) => (
              <StaggerItem key={question.id}>
                <div className="space-y-2">
                  <Label htmlFor={question.id}>{question.label} ({question.unit})</Label>
                  <Input
                    id={question.id}
                    type="number"
                    placeholder={`Enter ${question.unit}`}
                    value={inputs.scope1[question.id.replace("_", "") as keyof typeof inputs.scope1] || ""}
                    onChange={(e) => {
                      const field = question.id === "natural_gas_kwh" ? "naturalGasKwh" :
                        question.id === "heating_oil_litres" ? "heatingOilLitres" :
                        question.id === "company_petrol_litres" ? "companyVehiclesPetrolLitres" :
                        question.id === "company_diesel_litres" ? "companyVehiclesDieselLitres" : null;
                      if (field) updateScope1(field as any, Number(e.target.value));
                    }}
                  />
                  <p className="text-xs text-muted-foreground">{question.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </CardContent>
      </Card>
    </FadeIn>
  );

  // Step 2: Scope 2
  const renderStep2 = () => (
    <FadeIn>
      <Card className="border-sage-light overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-amber-600" />
            </motion.div>
            <div>
              <CardTitle>Scope 2: Energy Emissions</CardTitle>
              <CardDescription>
                Purchased electricity and heating
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="electricity">Electricity (kWh/year)</Label>
              <Input
                id="electricity"
                type="number"
                placeholder="e.g., 25000"
                value={inputs.scope2.electricityKwh || ""}
                onChange={(e) => updateScope2("electricityKwh", Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Check your electricity bills for annual usage</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="districtHeating">District Heating (kWh/year)</Label>
              <Input
                id="districtHeating"
                type="number"
                placeholder="e.g., 5000"
                value={inputs.scope2.districtHeatingKwh || ""}
                onChange={(e) => updateScope2("districtHeatingKwh", Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">If connected to a district heating network</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl flex gap-3 border border-amber-200"
          >
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Finding your electricity usage</p>
              <p className="mt-1">
                Your annual electricity usage in kWh can be found on your bills or supplier's online account.
                A typical small office uses 10,000-25,000 kWh per year.
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </FadeIn>
  );

  // Step 3: Scope 3
  const renderStep3 = () => (
    <FadeIn>
      <Card className="border-sage-light overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"
            >
              <Plane className="w-6 h-6 text-blue-600" />
            </motion.div>
            <div>
              <CardTitle>Scope 3: Indirect Emissions</CardTitle>
              <CardDescription>
                Business travel, commuting, waste, and supply chain
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Plane className="w-4 h-4" /> Business Travel
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Car Travel (km/year)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 10000"
                  value={inputs.scope3.businessTravelCarKm || ""}
                  onChange={(e) => updateScope3("businessTravelCarKm", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Rail Travel (km/year)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 3000"
                  value={inputs.scope3.businessTravelRailKm || ""}
                  onChange={(e) => updateScope3("businessTravelRailKm", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Short-haul Flights (km/year)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={inputs.scope3.businessTravelAirShortHaulKm || ""}
                  onChange={(e) => updateScope3("businessTravelAirShortHaulKm", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Long-haul Flights (km/year)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 20000"
                  value={inputs.scope3.businessTravelAirLongHaulKm || ""}
                  onChange={(e) => updateScope3("businessTravelAirLongHaulKm", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Waste & Water</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>General Waste (tonnes)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  value={inputs.scope3.wasteGeneralTonnes || ""}
                  onChange={(e) => updateScope3("wasteGeneralTonnes", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Recycling (tonnes)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  value={inputs.scope3.wasteRecyclingTonnes || ""}
                  onChange={(e) => updateScope3("wasteRecyclingTonnes", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Water (cubic metres)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 200"
                  value={inputs.scope3.waterCubicMetres || ""}
                  onChange={(e) => updateScope3("waterCubicMetres", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );

  // Step 4: Industry-specific questions
  const renderStep4 = () => {
    const industryData = industryEmissionFactors[businessType as keyof typeof industryEmissionFactors];
    if (!industryData) return null;

    return (
      <FadeIn>
        <Card className="border-sage-light overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-sage" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <CardTitle>{industryData.label}-Specific Questions</CardTitle>
                <CardDescription>
                  These questions help us calculate emissions specific to your industry
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {industryData.specificQuestions.map((question) => (
                <StaggerItem key={question.id}>
                  <div className="space-y-2">
                    <Label htmlFor={question.id}>
                      {question.label}
                      <Badge variant="outline" className="ml-2 text-xs">
                        Scope {question.scope}
                      </Badge>
                    </Label>
                    <Input
                      id={question.id}
                      type="number"
                      placeholder={`Enter ${question.unit}`}
                      value={industryInputs[question.id] || ""}
                      onChange={(e) => setIndustryInputs(prev => ({
                        ...prev,
                        [question.id]: Number(e.target.value)
                      }))}
                    />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-muted/50 rounded-xl"
            >
              <p className="text-sm text-muted-foreground">
                <Info className="w-4 h-4 inline mr-1" />
                Don't worry if you don't have exact figures - estimates are fine. You can always update your calculation later.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </FadeIn>
    );
  };

  // Step 5: Results with recommendations
  const renderStep5 = () => {
    if (!result) return <LeafLoader text="Calculating your footprint..." />;

    const pieData = [
      { name: "Scope 1", value: result.scope1TotalKgCo2e, color: SCOPE_COLORS.scope1 },
      { name: "Scope 2", value: result.scope2TotalKgCo2e, color: SCOPE_COLORS.scope2 },
      { name: "Scope 3", value: result.scope3TotalKgCo2e, color: SCOPE_COLORS.scope3 },
    ].filter(d => d.value > 0);

    const category = benchmark ? getCategoryFromBenchmark(result.kgCo2ePerEmployee, benchmark) : null;
    const score = benchmark ? calculateScore(result.kgCo2ePerEmployee, benchmark) : 50;

    const recommendedGrants = getRecommendedGrants();
    const recommendedSubsidies = getRecommendedSubsidies();

    return (
      <div className="space-y-6">
        {/* Hero Result Card */}
        <ScaleIn>
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-sage/10 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-sage to-mint-fresh" />
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center"
                >
                  <Leaf className="w-12 h-12 text-primary" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-muted-foreground mb-2">Your Annual Carbon Footprint</p>
                  <h2 className="text-5xl font-bold text-primary mb-1">
                    <AnimatedCounter value={result.totalTonnesCo2e} decimals={1} suffix=" tCO₂e" />
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {result.kgCo2ePerEmployee.toFixed(0)} kg per employee
                  </p>
                </motion.div>

                {benchmark && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Award className={`w-6 h-6 ${
                        category === 'good' ? 'text-green-500' :
                        category === 'average' ? 'text-amber-500' : 'text-red-500'
                      }`} />
                      <span className={`text-xl font-bold ${
                        category === 'good' ? 'text-green-600' :
                        category === 'average' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        Score: {score}/100
                      </span>
                    </div>
                    <AnimatedProgress
                      value={score}
                      color={category === 'good' ? 'bg-green-500' : category === 'average' ? 'bg-amber-500' : 'bg-red-500'}
                      className="max-w-xs mx-auto"
                    />
                    <p className={`mt-2 text-sm font-medium ${
                      category === 'good' ? 'text-green-600' :
                      category === 'average' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {category === 'good' ? 'Better than sector average!' :
                       category === 'average' ? 'Around sector average' : 'Above sector average - room for improvement'}
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </ScaleIn>

        {/* Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emissions Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {pieData.length > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatEmissions(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-red-50">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      Scope 1 (Direct)
                    </span>
                    <span className="font-semibold">{formatEmissions(result.scope1TotalKgCo2e)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      Scope 2 (Energy)
                    </span>
                    <span className="font-semibold">{formatEmissions(result.scope2TotalKgCo2e)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      Scope 3 (Indirect)
                    </span>
                    <span className="font-semibold">{formatEmissions(result.scope3TotalKgCo2e)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  Quick Wins to Reduce Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.scope2TotalKgCo2e > result.scope1TotalKgCo2e && (
                    <li className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">Switch to a 100% renewable energy tariff to cut Scope 2 emissions</span>
                    </li>
                  )}
                  {result.scope1TotalKgCo2e > 0 && (
                    <li className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">Consider heat pump installation - grants up to £7,500 available</span>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">LED lighting upgrade can reduce electricity use by 50-75%</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">Transition fleet to EVs - 100% tax relief available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Recommended Grants */}
        {recommendedGrants.length > 0 && (
          <FadeIn delay={0.4}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <PoundSterling className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Recommended Grants for You</CardTitle>
                      <CardDescription>Based on your business type and location</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/grants">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <StaggerContainer className="grid md:grid-cols-2 gap-4">
                  {recommendedGrants.map((grant) => (
                    <StaggerItem key={grant.id}>
                      <div className="p-4 border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium line-clamp-1">{grant.name}</h4>
                          <Badge variant="secondary" className="shrink-0 ml-2">
                            {grant.amount_description}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {grant.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{grant.provider}</span>
                          {grant.application_link && (
                            <a
                              href={grant.application_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              Apply <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Recommended Subsidies */}
        {recommendedSubsidies.length > 0 && (
          <FadeIn delay={0.5}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Tax Relief & Subsidies</CardTitle>
                    <CardDescription>Claim these to offset your green investments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedSubsidies.map((subsidy) => (
                    <div key={subsidy.id} className="p-4 border rounded-xl">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{subsidy.name}</h4>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          {subsidy.value_description}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{subsidy.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Find Consultants CTA */}
        <FadeIn delay={0.6}>
          <Card className="bg-gradient-to-r from-primary/10 to-sage/10 border-primary/20">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Need Help Reducing Your Footprint?</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with verified sustainability consultants who can help
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/consultants">
                    Find Consultants <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sage-light/30 to-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-sage shadow-lg mb-4"
            >
              <Calculator className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold">Carbon Footprint Calculator</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Calculate your business's annual carbon emissions using official UK Government conversion factors
            </p>
          </div>
        </FadeIn>

        {/* Progress */}
        {step > 0 && step < 5 && (
          <FadeIn>
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {step} of 4</span>
                <span>{Math.round((step / 4) * 100)}% complete</span>
              </div>
              <AnimatedProgress value={(step / 4) * 100} />
              <div className="flex justify-between mt-2 text-xs">
                <span className={step >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>Scope 1</span>
                <span className={step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>Scope 2</span>
                <span className={step >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>Scope 3</span>
                <span className={step >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>Industry</span>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === -1 && renderLeadCapture()}
            {step === 0 && renderStep0()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between mt-8"
          >
            {step > 0 && step < 5 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : step === 0 ? (
              <Button variant="outline" onClick={() => setStep(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : step === 5 ? (
              <Button variant="outline" onClick={() => setStep(-1)}>
                Start Over
              </Button>
            ) : (
              <div />
            )}

            {step === 0 && businessType && inputs.employeesCount > 0 && (
              <Button onClick={() => setStep(1)} className="bg-gradient-to-r from-primary to-sage hover:opacity-90">
                Begin Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {step > 0 && step < 4 && (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {step === 4 && (
              <Button onClick={handleCalculate} className="bg-gradient-to-r from-primary to-sage hover:opacity-90">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate My Footprint
              </Button>
            )}

            {step === 5 && (
              <div className="flex gap-3">
                {user ? (
                  <Button onClick={handleSave} disabled={isSubmitting} className="bg-gradient-to-r from-primary to-sage">
                    {isSubmitting ? "Saving..." : "Save to Dashboard"}
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-primary to-sage">
                    Sign In to Save Results
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

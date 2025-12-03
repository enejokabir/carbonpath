import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  PoundSterling,
  Users,
  ArrowRight,
  Building2,
  MapPin,
  Briefcase,
  BookOpen,
  ClipboardList,
  Bookmark,
  ChevronRight,
  RefreshCw,
  Leaf,
  Calculator,
  TrendingDown,
  Coins,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { matchGrantsToProfile, matchSubsidiesToProfile, matchConsultantsToNeeds, getRecommendedConsultantTypes } from "@/lib/matchingService";
import type { ExtendedGrant, Subsidy, Consultant } from "@/lib/matchingService";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [carbonScore, setCarbonScore] = useState<any>(null);
  const [latestFootprint, setLatestFootprint] = useState<any>(null);
  const [introRequests, setIntroRequests] = useState<any[]>([]);
  const [recommendedGrants, setRecommendedGrants] = useState<ExtendedGrant[]>([]);
  const [recommendedSubsidies, setRecommendedSubsidies] = useState<Subsidy[]>([]);
  const [recommendedConsultants, setRecommendedConsultants] = useState<Consultant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        toast.error("Error loading profile: " + profileError.message);
      } else {
        setProfile(profileData);
      }

      // Fetch carbon score
      const { data: scoreData } = await supabase
        .from('carbon_scores')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (scoreData) {
        setCarbonScore(scoreData);
      }

      // Fetch latest carbon footprint
      const { data: footprintData } = await supabase
        .from('carbon_footprints')
        .select('*')
        .eq('user_id', session.user.id)
        .order('calculation_date', { ascending: false })
        .limit(1)
        .single();

      if (footprintData) {
        setLatestFootprint(footprintData);
      }

      // Fetch introduction requests
      const { data: introData } = await supabase
        .from('introduction_requests')
        .select(`
          *,
          consultants:consultant_id (
            name,
            specialty
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (introData) {
        setIntroRequests(introData);
      }

      // Fetch grants for recommendations
      const { data: grantsData } = await supabase
        .from('grants')
        .select('*')
        .eq('is_active', true);

      if (grantsData && profileData) {
        const matched = matchGrantsToProfile(grantsData as ExtendedGrant[], profileData, profileData?.location);
        setRecommendedGrants(matched.slice(0, 3));
      }

      // Fetch subsidies for recommendations
      const { data: subsidiesData } = await supabase
        .from('subsidies')
        .select('*')
        .eq('is_active', true);

      if (subsidiesData && profileData) {
        const matched = matchSubsidiesToProfile(subsidiesData as Subsidy[], profileData, profileData?.employees);
        setRecommendedSubsidies(matched.slice(0, 2));
      }

      // Fetch consultants for recommendations
      const { data: consultantsData } = await supabase
        .from('consultants')
        .select('*')
        .eq('status', 'approved');

      // Check for assessment data in session storage (from assessment flow)
      const storedAssessment = sessionStorage.getItem("assessmentData");
      let parsedAssessment = null;
      if (storedAssessment) {
        parsedAssessment = JSON.parse(storedAssessment);
        setAssessmentData(parsedAssessment);
      }

      if (consultantsData) {
        const recommendedTypes = getRecommendedConsultantTypes(parsedAssessment || {});
        const matched = matchConsultantsToNeeds(
          consultantsData as Consultant[],
          recommendedTypes.length > 0 ? recommendedTypes : ['Grant Applications', 'Carbon Reporting'],
          profileData?.location
        );
        setRecommendedConsultants(matched.slice(0, 3));
      }

      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-emerald-500';
      case 'average': return 'text-amber-500';
      case 'needs_improvement': return 'text-orange-500';
      case 'poor': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'average': return 'Average';
      case 'needs_improvement': return 'Needs Improvement';
      case 'poor': return 'Poor';
      default: return 'Not calculated';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {profile?.business_name || profile?.full_name || "there"}
          </h1>
          <p className="text-lg text-muted-foreground">
            Your sustainability hub
          </p>
        </div>

        {/* Top Row: Carbon Score + Profile */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Carbon Footprint Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Your Carbon Footprint</CardTitle>
                    <CardDescription>
                      {latestFootprint
                        ? `Last calculated: ${new Date(latestFootprint.calculation_date).toLocaleDateString("en-GB")}`
                        : "Start tracking your emissions"}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {latestFootprint ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">
                        {(latestFootprint.total_kg_co2e / 1000).toFixed(1)}
                        <span className="text-lg font-normal text-muted-foreground ml-1">tCO2e</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {latestFootprint.kg_co2e_per_employee?.toFixed(0)} kg per employee
                      </p>
                    </div>
                    {carbonScore && (
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getCategoryColor(carbonScore.category)}`}>
                          {carbonScore.score}/100
                        </p>
                        <p className={`text-sm ${getCategoryColor(carbonScore.category)}`}>
                          {getCategoryLabel(carbonScore.category)}
                        </p>
                      </div>
                    )}
                  </div>

                  {carbonScore && (
                    <Progress value={carbonScore.score} className="h-2" />
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-background/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Scope 1</p>
                      <p className="font-semibold text-sm">
                        {((latestFootprint.scope1_total_kg_co2e || 0) / 1000).toFixed(1)}t
                      </p>
                    </div>
                    <div className="p-2 bg-background/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Scope 2</p>
                      <p className="font-semibold text-sm">
                        {((latestFootprint.scope2_total_kg_co2e || 0) / 1000).toFixed(1)}t
                      </p>
                    </div>
                    <div className="p-2 bg-background/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Scope 3</p>
                      <p className="font-semibold text-sm">
                        {((latestFootprint.scope3_total_kg_co2e || 0) / 1000).toFixed(1)}t
                      </p>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link to="/calculator">
                      <Calculator className="w-4 h-4 mr-2" />
                      Update Calculation
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    Calculate your carbon footprint to get personalized recommendations
                  </p>
                  <Button asChild>
                    <Link to="/calculator">
                      <Calculator className="w-4 h-4 mr-2" />
                      Start Calculator
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Profile Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Your Business Profile</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile/edit">Edit</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="font-medium capitalize">
                      {profile?.business_type?.replace('_', ' ') || assessmentData?.sector?.replace('_', ' ') || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Employees</p>
                    <p className="font-medium capitalize">
                      {profile?.employees || assessmentData?.employeeCount || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {profile?.location || assessmentData?.postcode || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Assessment</p>
                    <p className="font-medium capitalize">
                      {assessmentData ? "Completed" : "Not done"}
                    </p>
                  </div>
                </div>
              </div>

              {!assessmentData && (
                <div className="mt-4 pt-4 border-t">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/assessment">
                      Complete Assessment <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended For You Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>

          {/* Grants & Subsidies */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Grants */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <PoundSterling className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Matching Grants</CardTitle>
                  </div>
                  <Link
                    to="/grants"
                    className="text-primary font-medium text-sm hover:underline flex items-center"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recommendedGrants.length > 0 ? (
                  <div className="space-y-3">
                    {recommendedGrants.map((grant) => (
                      <Link
                        key={grant.id}
                        to="/grants"
                        className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{grant.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {grant.amount_description || (grant.amount_max ? `Up to £${grant.amount_max.toLocaleString()}` : "Varies")}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {(grant as any).matchScore || 50}%
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No grants available yet</p>
                )}
              </CardContent>
            </Card>

            {/* Subsidies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg">Tax Relief & Subsidies</CardTitle>
                  </div>
                  <Link
                    to="/grants?tab=subsidies"
                    className="text-primary font-medium text-sm hover:underline flex items-center"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recommendedSubsidies.length > 0 ? (
                  <div className="space-y-3">
                    {recommendedSubsidies.map((subsidy) => (
                      <Link
                        key={subsidy.id}
                        to="/grants?tab=subsidies"
                        className="flex items-center justify-between p-3 rounded-lg border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{subsidy.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {subsidy.value_description || subsidy.subsidy_type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {(subsidy as any).matchScore || 50}%
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No subsidies available yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Consultants */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Consultants Who Can Help</CardTitle>
                </div>
                <Link
                  to="/consultants"
                  className="text-primary font-medium text-sm hover:underline flex items-center"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recommendedConsultants.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendedConsultants.map((consultant) => (
                    <Link
                      key={consultant.id}
                      to="/consultants"
                      className="flex flex-col p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <p className="font-medium">{consultant.name}</p>
                      <Badge variant="outline" className="mt-1 w-fit">{consultant.specialty}</Badge>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {consultant.region}
                      </div>
                      {consultant.verified && (
                        <Badge className="mt-2 w-fit bg-blue-500">Verified</Badge>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No consultants available yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Introduction Requests */}
        {introRequests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Your Introduction Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {introRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{request.consultants?.name}</p>
                      <p className="text-sm text-muted-foreground">{request.consultants?.specialty}</p>
                    </div>
                    <Badge
                      variant={
                        request.status === "responded" ? "default" :
                        request.status === "declined" ? "destructive" :
                        "secondary"
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Reading */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Recommended Reading</CardTitle>
              </div>
              <Link
                to="/learn"
                className="text-primary font-medium text-sm hover:underline flex items-center"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Tax incentives for sustainability improvements",
                "How to prepare a grant application",
                "Energy efficiency basics for your sector"
              ].map((article, index) => (
                <li key={index}>
                  <Link
                    to="/learn"
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {article}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Carbon Calculator
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/grants">
              <PoundSterling className="w-4 h-4 mr-2" />
              Browse Grants & Subsidies
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/consultants">
              <Users className="w-4 h-4 mr-2" />
              Find Consultants
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/learn">
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Learn Hub
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

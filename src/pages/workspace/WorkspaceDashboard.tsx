import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Lightbulb,
  BookOpen,
  Target,
  Sparkles,
  PoundSterling,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityFeed, getStoredActivities } from "@/components/workspace/ActivityFeed";
import type { ActivityItem } from "@/types";

interface ReadinessScore {
  overall_score: number;
  evidence_score: number;
  freshness_score: number;
  checklist_score: number;
  obligations_score: number;
  total_evidence_items: number;
  current_evidence_items: number;
  expiring_evidence_items: number;
  expired_evidence_items: number;
  total_obligations: number;
  overdue_obligations: number;
  upcoming_obligations: number;
  total_checklist_items: number;
  completed_checklist_items: number;
}

interface Workspace {
  id: string;
  name: string;
  industry: string;
  employee_count: number | null;
  location: string | null;
}

export default function WorkspaceDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [readinessScore, setReadinessScore] = useState<ReadinessScore | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const loadWorkspace = async () => {
      // Check for demo workspace first
      const demoWorkspaceData = localStorage.getItem("demo_workspace");
      const demoScoreData = localStorage.getItem("demo_readiness_score");

      if (demoWorkspaceData) {
        const demoWorkspace = JSON.parse(demoWorkspaceData);
        setWorkspace(demoWorkspace);

        if (demoScoreData) {
          setReadinessScore(JSON.parse(demoScoreData));
        }

        setMemberCount(1);
        // Load activities from localStorage
        setActivities(getStoredActivities());
        setLoading(false);
        return;
      }

      // If no demo workspace and Supabase not configured, redirect to onboarding
      if (!isSupabaseConfigured) {
        navigate("/onboarding");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/onboarding");
        return;
      }

      try {
        // Get user's current workspace
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_workspace_id")
          .eq("id", session.user.id)
          .single();

        if (!profile?.current_workspace_id) {
          navigate("/onboarding");
          return;
        }

        // Load workspace details
        const { data: workspaceData } = await supabase
          .from("workspaces")
          .select("*")
          .eq("id", profile.current_workspace_id)
          .single();

        if (workspaceData) {
          setWorkspace(workspaceData);

          // Check if onboarding completed
          if (!workspaceData.onboarding_completed) {
            navigate("/onboarding");
            return;
          }
        }

        // Load readiness score
        const { data: scoreData } = await supabase
          .from("readiness_scores")
          .select("*")
          .eq("workspace_id", profile.current_workspace_id)
          .single();

        if (scoreData) {
          setReadinessScore(scoreData);
        }

        // Get member count
        const { count } = await supabase
          .from("workspace_members")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", profile.current_workspace_id);

        setMemberCount(count || 1);
      } catch {
        navigate("/onboarding");
        return;
      }

      setLoading(false);
    };

    loadWorkspace();
  }, [navigate]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Getting Started";
  };

  if (loading) {
    return (
      <WorkspaceLayout title="Dashboard" description="Loading your workspace...">
          {/* Skeleton for header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>

          {/* Skeleton for score card */}
          <Card className="mb-8 border-sage-light/20">
            <div className="flex flex-col md:flex-row">
              <div className="bg-gradient-to-br from-sage-light/10 to-primary/5 p-8 flex flex-col items-center justify-center md:w-64">
                <Skeleton className="w-32 h-32 rounded-full" />
                <Skeleton className="h-5 w-20 mt-4" />
              </div>
              <div className="flex-1 p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Skeleton for quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-sage-light/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <div>
                      <Skeleton className="h-8 w-12 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skeleton for quick actions */}
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-sage-light/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
      </WorkspaceLayout>
    );
  }

  const score = readinessScore?.overall_score ?? 0;

  return (
    <WorkspaceLayout
      title={workspace?.name || "Dashboard"}
      description={workspace?.industry ? `${workspace.industry} workspace` : "Your workspace dashboard"}
    >
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold">{workspace?.name}</h1>
            </div>
            <p className="text-muted-foreground">
              {workspace?.industry && (
                <Badge variant="secondary" className="mr-2 capitalize">
                  {workspace.industry}
                </Badge>
              )}
              {workspace?.location}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/workspace/settings">
                <Users className="w-4 h-4 mr-2" />
                {memberCount} {memberCount === 1 ? "Member" : "Members"}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/workspace/evidence">
                <Upload className="w-4 h-4 mr-2" />
                Upload Evidence
              </Link>
            </Button>
          </div>
        </div>

        {/* Readiness Score Card */}
        <Card className="mb-8 border-sage-light/20 shadow-soft overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Score Circle */}
            <div className="bg-gradient-to-br from-sage-light/10 to-primary/5 p-8 flex flex-col items-center justify-center md:w-64">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(score / 100) * 352} 352`}
                    strokeLinecap="round"
                    className={getScoreColor(score)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                  <span className="text-xs text-muted-foreground">Ready</span>
                </div>
              </div>
              <p className={`mt-4 font-medium ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="flex-1 p-6">
              <h3 className="font-semibold mb-4">Readiness Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Evidence Coverage</span>
                    <span className="font-medium">{readinessScore?.evidence_score ?? 0}%</span>
                  </div>
                  <Progress value={readinessScore?.evidence_score ?? 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Document Freshness</span>
                    <span className="font-medium">{readinessScore?.freshness_score ?? 0}%</span>
                  </div>
                  <Progress value={readinessScore?.freshness_score ?? 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Checklist Progress</span>
                    <span className="font-medium">{readinessScore?.checklist_score ?? 0}%</span>
                  </div>
                  <Progress value={readinessScore?.checklist_score ?? 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Obligations Met</span>
                    <span className="font-medium">{readinessScore?.obligations_score ?? 0}%</span>
                  </div>
                  <Progress value={readinessScore?.obligations_score ?? 0} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-sage-light/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{readinessScore?.total_evidence_items ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Evidence Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-light/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{readinessScore?.current_evidence_items ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-light/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{readinessScore?.expiring_evidence_items ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Expiring Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-light/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(readinessScore?.expired_evidence_items ?? 0) + (readinessScore?.overdue_obligations ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Need Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guidance Cards - Next Steps and Getting Started */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Next Steps Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Next Steps
              </CardTitle>
              <CardDescription>
                Recommended actions to improve your readiness score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {score < 30 && (
                <Link
                  to="/workspace/evidence"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:border-primary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Upload your first document</p>
                    <p className="text-xs text-muted-foreground">Start building your evidence locker</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              )}
              {(readinessScore?.evidence_score ?? 0) < 50 && (
                <Link
                  to="/workspace/evidence"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:border-primary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Add utility bills</p>
                    <p className="text-xs text-muted-foreground">Upload 12 months of energy data</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              )}
              {(readinessScore?.obligations_score ?? 0) < 50 && (
                <Link
                  to="/workspace/calendar"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:border-primary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Set up compliance reminders</p>
                    <p className="text-xs text-muted-foreground">Never miss important deadlines</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              )}
              <Link
                to="/grants"
                className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:border-primary/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <PoundSterling className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Check funding opportunities</p>
                  <p className="text-xs text-muted-foreground">Grants matched to your profile</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          {/* Quick Wins Card */}
          <Card className="border-sage-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Quick Wins
              </CardTitle>
              <CardDescription>
                Easy actions to boost your sustainability credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Write an environmental policy</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A simple 1-page statement shows commitment. Include your objectives and how you'll achieve them.
                  </p>
                  <Link to="/learn/what-is-sustainability-compliance" className="text-xs text-primary hover:underline mt-2 inline-block">
                    Learn how
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Collect your energy bills</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gather 12 months of electricity and gas bills. This is the foundation for understanding your footprint.
                  </p>
                  <Link to="/learn/evidence-locker-explained" className="text-xs text-primary hover:underline mt-2 inline-block">
                    Learn more
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Check your waste documentation</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ensure you have waste transfer notes - they're legally required and often forgotten.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions + Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid md:grid-cols-3 gap-6">
            <Card className="border-sage-light/20 shadow-soft hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  Evidence Locker
                </CardTitle>
                <CardDescription>
                  Store and organize your compliance documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/workspace/evidence">
                    Manage Evidence
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-sage-light/20 shadow-soft hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Compliance Calendar
                </CardTitle>
                <CardDescription>
                  Track deadlines and recurring obligations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/workspace/calendar">
                    View Calendar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-sage-light/20 shadow-soft hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Matched Grants
                </CardTitle>
                <CardDescription>
                  Funding opportunities matched to your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/grants">
                    View Grants
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} maxItems={5} />
          </div>
        </div>

        {/* Help Resources */}
        <Card className="border-sage-light/20 bg-muted/30">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Need guidance?</p>
                  <p className="text-sm text-muted-foreground">
                    Visit our Learn Hub for articles on compliance, grants, and sustainability best practices
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/learn">
                  Explore Learn Hub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
    </WorkspaceLayout>
  );
}

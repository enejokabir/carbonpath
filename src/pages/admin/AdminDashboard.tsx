import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Coins, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Stats {
  totalGrants: number;
  activeGrants: number;
  totalSubsidies: number;
  activeSubsidies: number;
  totalConsultants: number;
  pendingConsultants: number;
  approvedConsultants: number;
  totalUsers: number;
  introRequests: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalGrants: 0,
    activeGrants: 0,
    totalSubsidies: 0,
    activeSubsidies: 0,
    totalConsultants: 0,
    pendingConsultants: 0,
    approvedConsultants: 0,
    totalUsers: 0,
    introRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentConsultants, setRecentConsultants] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Grants stats
        const { count: totalGrants } = await supabase
          .from("grants")
          .select("*", { count: "exact", head: true });

        const { count: activeGrants } = await supabase
          .from("grants")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        // Subsidies stats
        const { count: totalSubsidies } = await supabase
          .from("subsidies")
          .select("*", { count: "exact", head: true });

        const { count: activeSubsidies } = await supabase
          .from("subsidies")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        // Consultants stats
        const { count: totalConsultants } = await supabase
          .from("consultants")
          .select("*", { count: "exact", head: true });

        const { count: pendingConsultants } = await supabase
          .from("consultants")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        const { count: approvedConsultants } = await supabase
          .from("consultants")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved");

        // Users stats
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Intro requests
        const { count: introRequests } = await supabase
          .from("introduction_requests")
          .select("*", { count: "exact", head: true });

        setStats({
          totalGrants: totalGrants || 0,
          activeGrants: activeGrants || 0,
          totalSubsidies: totalSubsidies || 0,
          activeSubsidies: activeSubsidies || 0,
          totalConsultants: totalConsultants || 0,
          pendingConsultants: pendingConsultants || 0,
          approvedConsultants: approvedConsultants || 0,
          totalUsers: totalUsers || 0,
          introRequests: introRequests || 0,
        });

        // Load recent pending consultants
        const { data: recent } = await supabase
          .from("consultants")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5);

        setRecentConsultants(recent || []);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of Carbon Path platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Grants</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGrants}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeGrants} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subsidies</CardTitle>
            <Coins className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubsidies}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubsidies} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultants</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConsultants}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedConsultants} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingConsultants}</div>
            <p className="text-xs text-muted-foreground">
              consultants awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              SME profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Introduction Requests</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.introRequests}</div>
            <p className="text-xs text-muted-foreground">
              total connections made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              all systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Consultants */}
      {stats.pendingConsultants > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Consultant Applications</CardTitle>
                <CardDescription>
                  Review and approve new consultant registrations
                </CardDescription>
              </div>
              <Button asChild>
                <Link to="/admin/consultants">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConsultants.map((consultant) => (
                <div
                  key={consultant.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{consultant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {consultant.specialty} • {consultant.region}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(consultant.created_at).toLocaleDateString("en-GB")}
                    </span>
                    <Button size="sm" asChild>
                      <Link to="/admin/consultants">Review</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/admin/grants">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Manage Grants
              </CardTitle>
              <CardDescription>
                Add, edit, or remove grant listings
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/admin/subsidies">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Manage Subsidies
              </CardTitle>
              <CardDescription>
                Add, edit, or remove subsidy listings
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/admin/consultants">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Manage Consultants
              </CardTitle>
              <CardDescription>
                Review applications and manage listings
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}

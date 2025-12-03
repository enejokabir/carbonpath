import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const sectors = [
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "logistics", label: "Logistics" },
  { value: "professional_services", label: "Professional Services" },
  { value: "tech", label: "Tech" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "construction", label: "Construction" },
  { value: "agriculture", label: "Agriculture" },
  { value: "other", label: "Other" }
];

const employeeCounts = [
  { value: "1-9", label: "Micro (1-9 employees)" },
  { value: "10-49", label: "Small (10-49 employees)" },
  { value: "50-249", label: "Medium (50-249 employees)" }
];

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    employees: "",
    location: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast.error("Error loading profile");
      } else if (profile) {
        setFormData({
          businessName: profile.business_name || "",
          businessType: profile.business_type || "",
          employees: profile.employees || "",
          location: profile.location || ""
        });
      }

      setLoading(false);
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: formData.businessName,
        business_type: formData.businessType,
        employees: formData.employees,
        location: formData.location,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Error saving profile: " + error.message);
    } else {
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
        <Header user={user} />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header user={user} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Edit Business Profile</CardTitle>
              <CardDescription>
                Update your business information to get more relevant recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your Company Ltd"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Industry / Sector</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}
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

              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Select
                  value={formData.employees}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employees: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee count" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeCounts.map((count) => (
                      <SelectItem key={count.value} value={count.value}>
                        {count.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Business Postcode</Label>
                <Input
                  id="location"
                  placeholder="e.g. DE1 2QY"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Used to show relevant local grants and consultants
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

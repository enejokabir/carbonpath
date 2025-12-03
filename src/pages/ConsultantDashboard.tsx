import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Award,
  Loader2,
  Calendar,
  Send,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConsultantProfile {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string | null;
  region: string;
  specialty: string;
  bio: string | null;
  expertise_areas: string[];
  fee_type: string | null;
  years_experience: number | null;
  company_website: string | null;
  certifications: string[];
  status: string;
  verified: boolean;
  created_at: string;
}

interface IntroductionRequest {
  id: string;
  user_id: string;
  message: string | null;
  status: string;
  consultant_response: string | null;
  responded_at: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    business_type: string;
    location: string | null;
  } | null;
}

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

export default function ConsultantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [introRequests, setIntroRequests] = useState<IntroductionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<IntroductionRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    region: "",
    specialty: "",
    bio: "",
    fee_type: "",
    years_experience: "",
    company_website: "",
    certifications: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await loadConsultantProfile(session.user.id);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadConsultantProfile = async (userId: string) => {
    try {
      const { data: consultant, error } = await supabase
        .from("consultants")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No consultant profile found
          navigate("/consultant/register");
          return;
        }
        throw error;
      }

      setProfile(consultant);
      setEditForm({
        name: consultant.name || "",
        contact_email: consultant.contact_email || "",
        contact_phone: consultant.contact_phone || "",
        region: consultant.region || "",
        specialty: consultant.specialty || "",
        bio: consultant.bio || "",
        fee_type: consultant.fee_type || "",
        years_experience: consultant.years_experience?.toString() || "",
        company_website: consultant.company_website || "",
        certifications: consultant.certifications?.join(", ") || "",
      });

      // Load introduction requests if approved
      if (consultant.status === "approved") {
        await loadIntroRequests(consultant.id);
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const loadIntroRequests = async (consultantId: string) => {
    try {
      const { data, error } = await supabase
        .from("introduction_requests")
        .select(`
          *,
          profiles:user_id (
            full_name,
            business_type,
            location
          )
        `)
        .eq("consultant_id", consultantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntroRequests(data || []);
    } catch (error: any) {
      console.error("Error loading intro requests:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("consultants")
        .update({
          name: editForm.name,
          contact_email: editForm.contact_email,
          contact_phone: editForm.contact_phone || null,
          region: editForm.region,
          specialty: editForm.specialty,
          bio: editForm.bio,
          fee_type: editForm.fee_type || null,
          years_experience: editForm.years_experience ? parseInt(editForm.years_experience) : null,
          company_website: editForm.company_website || null,
          certifications: editForm.certifications ? editForm.certifications.split(",").map(s => s.trim()) : [],
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      await loadConsultantProfile(user.id);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkViewed = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("introduction_requests")
        .update({ status: "viewed" })
        .eq("id", requestId)
        .eq("status", "pending");

      if (error) throw error;

      setIntroRequests(prev =>
        prev.map(r => r.id === requestId && r.status === "pending" ? { ...r, status: "viewed" } : r)
      );
    } catch (error: any) {
      console.error("Error marking as viewed:", error);
    }
  };

  const handleRespond = async (requestId: string, action: "responded" | "declined") => {
    if (action === "responded" && !responseText.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    setRespondingTo(requestId);
    try {
      const { error } = await supabase
        .from("introduction_requests")
        .update({
          status: action,
          consultant_response: action === "responded" ? responseText : null,
          responded_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      toast.success(action === "responded" ? "Response sent!" : "Request declined");
      setSelectedRequest(null);
      setResponseText("");
      if (profile) {
        await loadIntroRequests(profile.id);
      }
    } catch (error: any) {
      console.error("Error responding:", error);
      toast.error("Failed to respond: " + error.message);
    } finally {
      setRespondingTo(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "suspended":
        return <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">New</Badge>;
      case "viewed":
        return <Badge variant="outline"><Eye className="w-3 h-3 mr-1" />Viewed</Badge>;
      case "responded":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Responded</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const pendingRequests = introRequests.filter(r => r.status === "pending" || r.status === "viewed");
  const respondedRequests = introRequests.filter(r => r.status === "responded" || r.status === "declined");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-light/30 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Consultant Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile and respond to introduction requests
          </p>
        </div>

        {/* Status Banner */}
        {profile.status !== "approved" && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">
                    {profile.status === "pending"
                      ? "Your application is under review"
                      : profile.status === "rejected"
                      ? "Your application was not approved"
                      : "Your account is suspended"}
                  </p>
                  <p className="text-sm text-amber-700">
                    {profile.status === "pending"
                      ? "We'll notify you once it's been processed. This usually takes 1-2 business days."
                      : "Please contact support for more information."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Profile Status</CardTitle>
                  {getStatusBadge(profile.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.specialty}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {profile.region}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {profile.contact_email}
                  </div>
                  {profile.contact_phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {profile.contact_phone}
                    </div>
                  )}
                  {profile.company_website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <a href={profile.company_website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {profile.verified && (
                  <div className="flex items-center gap-2 text-green-600 pt-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Consultant</span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Member since</p>
                  <p className="text-sm">
                    {new Date(profile.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            {profile.status === "approved" && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Introduction Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">{pendingRequests.length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{respondedRequests.length}</p>
                      <p className="text-xs text-muted-foreground">Responded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={profile.status === "approved" ? "requests" : "profile"}>
              <TabsList className="mb-4">
                {profile.status === "approved" && (
                  <TabsTrigger value="requests" className="relative">
                    Requests
                    {pendingRequests.length > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingRequests.length}
                      </span>
                    )}
                  </TabsTrigger>
                )}
                <TabsTrigger value="profile">Edit Profile</TabsTrigger>
              </TabsList>

              {/* Introduction Requests Tab */}
              {profile.status === "approved" && (
                <TabsContent value="requests">
                  <Card>
                    <CardHeader>
                      <CardTitle>Introduction Requests</CardTitle>
                      <CardDescription>
                        SMEs interested in your services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {introRequests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No introduction requests yet</p>
                          <p className="text-sm">
                            When businesses request an introduction, they'll appear here
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {introRequests.map((request) => (
                            <div
                              key={request.id}
                              className={`p-4 border rounded-lg ${
                                request.status === "pending" ? "bg-amber-50 border-amber-200" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {request.profiles?.full_name || "Anonymous User"}
                                  </span>
                                  {getRequestStatusBadge(request.status)}
                                </div>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(request.created_at).toLocaleDateString("en-GB")}
                                </span>
                              </div>

                              {request.profiles && (
                                <div className="text-sm text-muted-foreground mb-2">
                                  <span className="mr-3">{request.profiles.business_type}</span>
                                  {request.profiles.location && (
                                    <span>• {request.profiles.location}</span>
                                  )}
                                </div>
                              )}

                              {request.message && (
                                <p className="text-sm bg-white p-3 rounded border mb-3">
                                  "{request.message}"
                                </p>
                              )}

                              {request.consultant_response && (
                                <div className="text-sm bg-green-50 p-3 rounded border border-green-200 mb-3">
                                  <p className="text-xs text-green-600 mb-1">Your response:</p>
                                  <p>{request.consultant_response}</p>
                                </div>
                              )}

                              {(request.status === "pending" || request.status === "viewed") && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      handleMarkViewed(request.id);
                                    }}
                                  >
                                    <Send className="w-4 h-4 mr-1" />
                                    Respond
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRespond(request.id, "declined")}
                                    disabled={respondingTo === request.id}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Edit Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your consultant profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Company / Consultant Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact_email">Contact Email</Label>
                          <Input
                            id="contact_email"
                            type="email"
                            value={editForm.contact_email}
                            onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_phone">Phone Number</Label>
                          <Input
                            id="contact_phone"
                            type="tel"
                            value={editForm.contact_phone}
                            onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company_website">Website</Label>
                          <Input
                            id="company_website"
                            type="url"
                            value={editForm.company_website}
                            onChange={(e) => setEditForm({ ...editForm, company_website: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="region">Primary Region</Label>
                          <Select
                            value={editForm.region}
                            onValueChange={(value) => setEditForm({ ...editForm, region: value })}
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
                          <Label htmlFor="fee_type">Fee Structure</Label>
                          <Select
                            value={editForm.fee_type}
                            onValueChange={(value) => setEditForm({ ...editForm, fee_type: value })}
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
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="years_experience">Years of Experience</Label>
                          <Input
                            id="years_experience"
                            type="number"
                            min="0"
                            value={editForm.years_experience}
                            onChange={(e) => setEditForm({ ...editForm, years_experience: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certifications">Certifications</Label>
                          <Input
                            id="certifications"
                            value={editForm.certifications}
                            onChange={(e) => setEditForm({ ...editForm, certifications: e.target.value })}
                            placeholder="Comma-separated (e.g., ISO 14064, IEMA)"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">About Your Services</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={5}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      {/* Response Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Introduction Request</DialogTitle>
            <DialogDescription>
              Send a message to {selectedRequest?.profiles?.full_name || "this business"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedRequest?.message && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Their message:</p>
                <p className="text-sm">"{selectedRequest.message}"</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Introduce yourself and explain how you can help..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedRequest && handleRespond(selectedRequest.id, "responded")}
              disabled={respondingTo === selectedRequest?.id}
            >
              {respondingTo === selectedRequest?.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Eye,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Consultant {
  id: string;
  user_id: string | null;
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
  rejection_reason: string | null;
  created_at: string;
  approved_at: string | null;
}

export default function AdminConsultants() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [viewConsultant, setViewConsultant] = useState<Consultant | null>(null);
  const [rejectDialog, setRejectDialog] = useState<Consultant | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  useEffect(() => {
    loadConsultants();
  }, []);

  const loadConsultants = async () => {
    try {
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultants(data || []);
    } catch (error: any) {
      console.error("Error loading consultants:", error);
      toast.error("Failed to load consultants");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (consultant: Consultant) => {
    setProcessing(consultant.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { error } = await supabase
        .from("consultants")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: session?.user?.id,
          rejection_reason: null,
        })
        .eq("id", consultant.id);

      if (error) throw error;
      toast.success(`${consultant.name} has been approved`);
      await loadConsultants();
    } catch (error: any) {
      console.error("Error approving consultant:", error);
      toast.error("Failed to approve consultant: " + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog) return;

    setProcessing(rejectDialog.id);
    try {
      const { error } = await supabase
        .from("consultants")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason || null,
        })
        .eq("id", rejectDialog.id);

      if (error) throw error;
      toast.success(`${rejectDialog.name} has been rejected`);
      setRejectDialog(null);
      setRejectionReason("");
      await loadConsultants();
    } catch (error: any) {
      console.error("Error rejecting consultant:", error);
      toast.error("Failed to reject consultant: " + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleSuspend = async (consultant: Consultant) => {
    setProcessing(consultant.id);
    try {
      const { error } = await supabase
        .from("consultants")
        .update({ status: "suspended" })
        .eq("id", consultant.id);

      if (error) throw error;
      toast.success(`${consultant.name} has been suspended`);
      await loadConsultants();
    } catch (error: any) {
      console.error("Error suspending consultant:", error);
      toast.error("Failed to suspend consultant: " + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleVerified = async (consultant: Consultant) => {
    setProcessing(consultant.id);
    try {
      const { error } = await supabase
        .from("consultants")
        .update({ verified: !consultant.verified })
        .eq("id", consultant.id);

      if (error) throw error;
      toast.success(
        consultant.verified
          ? `Removed verified badge from ${consultant.name}`
          : `${consultant.name} is now verified`
      );
      await loadConsultants();
    } catch (error: any) {
      console.error("Error updating verified status:", error);
      toast.error("Failed to update verified status: " + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "suspended":
        return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredConsultants = consultants.filter(c => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  const pendingCount = consultants.filter(c => c.status === "pending").length;
  const approvedCount = consultants.filter(c => c.status === "approved").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Consultants</h1>
          <p className="text-muted-foreground">
            Review and manage consultant applications
          </p>
        </div>
        <div className="flex items-center gap-4">
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-sm py-1 px-3">
              {pendingCount} pending review
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingCount > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No consultants found with status "{statusFilter}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredConsultants.map((consultant) => (
                  <TableRow key={consultant.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{consultant.name}</span>
                        {consultant.verified && (
                          <Award className="w-4 h-4 text-blue-500" title="Verified" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{consultant.contact_email}</span>
                    </TableCell>
                    <TableCell>{consultant.specialty}</TableCell>
                    <TableCell>{consultant.region}</TableCell>
                    <TableCell>{getStatusBadge(consultant.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(consultant.created_at).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewConsultant(consultant)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {consultant.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(consultant)}
                              disabled={processing === consultant.id}
                            >
                              {processing === consultant.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setRejectDialog(consultant)}
                              disabled={processing === consultant.id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        {consultant.status === "approved" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleVerified(consultant)}
                              disabled={processing === consultant.id}
                            >
                              <Award className="w-4 h-4 mr-1" />
                              {consultant.verified ? "Unverify" : "Verify"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-amber-600"
                              onClick={() => handleSuspend(consultant)}
                              disabled={processing === consultant.id}
                            >
                              Suspend
                            </Button>
                          </>
                        )}

                        {(consultant.status === "rejected" || consultant.status === "suspended") && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(consultant)}
                            disabled={processing === consultant.id}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Consultant Dialog */}
      <Dialog open={!!viewConsultant} onOpenChange={() => setViewConsultant(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewConsultant?.name}
              {viewConsultant?.verified && <Award className="w-5 h-5 text-blue-500" />}
            </DialogTitle>
            <DialogDescription>
              {viewConsultant && getStatusBadge(viewConsultant.status)}
            </DialogDescription>
          </DialogHeader>

          {viewConsultant && (
            <div className="space-y-6 py-4">
              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${viewConsultant.contact_email}`} className="hover:underline">
                    {viewConsultant.contact_email}
                  </a>
                </div>
                {viewConsultant.contact_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {viewConsultant.contact_phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {viewConsultant.region}
                </div>
                {viewConsultant.company_website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={viewConsultant.company_website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Specialty</Label>
                  <p className="font-medium">{viewConsultant.specialty}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Bio</Label>
                  <p className="text-sm">{viewConsultant.bio || "No bio provided"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Expertise Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewConsultant.expertise_areas?.map((area) => (
                      <Badge key={area} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Fee Type</Label>
                    <p className="text-sm">{viewConsultant.fee_type || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Years Experience</Label>
                    <p className="text-sm">{viewConsultant.years_experience || "Not specified"}</p>
                  </div>
                </div>

                {viewConsultant.certifications && viewConsultant.certifications.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Certifications</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {viewConsultant.certifications.map((cert) => (
                        <Badge key={cert} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {viewConsultant.rejection_reason && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <Label className="text-red-600">Rejection Reason</Label>
                    <p className="text-sm text-red-700">{viewConsultant.rejection_reason}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Applied on {new Date(viewConsultant.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewConsultant(null)}>
              Close
            </Button>
            {viewConsultant?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setRejectDialog(viewConsultant);
                    setViewConsultant(null);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(viewConsultant);
                    setViewConsultant(null);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Reject {rejectDialog?.name}'s consultant application. You can optionally provide a reason.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="rejection_reason">Rejection Reason (optional)</Label>
            <Textarea
              id="rejection_reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why the application is being rejected..."
              rows={3}
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing === rejectDialog?.id}
            >
              {processing === rejectDialog?.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

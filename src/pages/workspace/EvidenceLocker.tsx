import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  Search,
  FileText,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Calendar,
  Pencil,
} from "lucide-react";

const EVIDENCE_CATEGORIES = [
  { value: "environmental_policy", label: "Environmental Policy" },
  { value: "energy_management", label: "Energy Management" },
  { value: "waste_management", label: "Waste Management" },
  { value: "supply_chain", label: "Supply Chain" },
  { value: "transport_logistics", label: "Transport & Logistics" },
  { value: "certifications", label: "Certifications" },
  { value: "training_records", label: "Training Records" },
  { value: "utility_bills", label: "Utility Bills" },
  { value: "audit_reports", label: "Audit Reports" },
  { value: "other", label: "Other" },
];

interface EvidenceItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  file_name: string | null;
  file_type: string | null;
  document_date: string | null;
  valid_until: string | null;
  status: string;
  created_at: string;
}

export default function EvidenceLocker() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadValidUntil, setUploadValidUntil] = useState("");

  // View/Edit/Delete state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editValidUntil, setEditValidUntil] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    const loadEvidence = async () => {
      // Check for demo workspace first
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        const demoWorkspace = JSON.parse(demoWorkspaceData);
        setWorkspaceId(demoWorkspace.id);

        // Load demo evidence from localStorage
        const demoEvidenceData = localStorage.getItem("demo_evidence_items");
        if (demoEvidenceData) {
          setEvidence(JSON.parse(demoEvidenceData));
        }

        setLoading(false);
        return;
      }

      // If no demo workspace and Supabase not configured, redirect
      if (!isSupabaseConfigured) {
        navigate("/onboarding");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_workspace_id")
        .eq("id", session.user.id)
        .single();

      if (!profile?.current_workspace_id) {
        navigate("/onboarding");
        return;
      }

      setWorkspaceId(profile.current_workspace_id);

      const { data: evidenceData, error } = await supabase
        .from("evidence_items")
        .select("*")
        .eq("workspace_id", profile.current_workspace_id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error loading evidence: " + error.message);
      } else {
        setEvidence(evidenceData || []);
      }

      setLoading(false);
    };

    loadEvidence();
  }, [navigate]);

  const handleUpload = async () => {
    if (!uploadTitle || !uploadCategory) {
      toast.error("Please fill in title and category");
      return;
    }

    if (!workspaceId) return;

    setUploading(true);
    try {
      // Check if we're in demo mode
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        // Demo mode - save to localStorage
        const newEvidence: EvidenceItem = {
          id: `demo-evidence-${Date.now()}`,
          category: uploadCategory,
          title: uploadTitle,
          description: uploadDescription || null,
          file_name: uploadFile?.name || null,
          file_type: uploadFile?.type || null,
          document_date: new Date().toISOString().split("T")[0],
          valid_until: uploadValidUntil || null,
          status: "current",
          created_at: new Date().toISOString(),
        };

        const updatedEvidence = [newEvidence, ...evidence];
        setEvidence(updatedEvidence);
        localStorage.setItem("demo_evidence_items", JSON.stringify(updatedEvidence));

        // Update readiness score
        const demoScoreData = localStorage.getItem("demo_readiness_score");
        if (demoScoreData) {
          const score = JSON.parse(demoScoreData);
          score.total_evidence_items = updatedEvidence.length;
          score.current_evidence_items = updatedEvidence.filter(e => e.status === "current").length;
          score.evidence_score = Math.min(100, updatedEvidence.length * 10);
          score.overall_score = Math.round(
            (score.evidence_score * 0.25 + score.freshness_score * 0.25 +
             score.checklist_score * 0.30 + score.obligations_score * 0.20)
          );
          localStorage.setItem("demo_readiness_score", JSON.stringify(score));
        }

        toast.success("Evidence uploaded successfully");

        // Reset form
        setUploadTitle("");
        setUploadCategory("");
        setUploadDescription("");
        setUploadFile(null);
        setUploadValidUntil("");
        setUploadDialogOpen(false);
        setUploading(false);
        return;
      }

      // Supabase mode
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      let filePath = null;
      let fileName = null;
      let fileSize = null;
      let fileType = null;

      // Upload file if provided
      if (uploadFile) {
        const fileExt = uploadFile.name.split(".").pop();
        const uniqueFileName = `${workspaceId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(uniqueFileName, uploadFile);

        if (uploadError) throw uploadError;

        filePath = uniqueFileName;
        fileName = uploadFile.name;
        fileSize = uploadFile.size;
        fileType = uploadFile.type;
      }

      // Create evidence record
      const { data: newEvidence, error } = await supabase
        .from("evidence_items")
        .insert({
          workspace_id: workspaceId,
          title: uploadTitle,
          category: uploadCategory,
          description: uploadDescription || null,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          valid_until: uploadValidUntil || null,
          uploaded_by: session.user.id,
          status: "current",
        })
        .select()
        .single();

      if (error) throw error;

      setEvidence([newEvidence, ...evidence]);
      toast.success("Evidence uploaded successfully");

      // Reset form
      setUploadTitle("");
      setUploadCategory("");
      setUploadDescription("");
      setUploadFile(null);
      setUploadValidUntil("");
      setUploadDialogOpen(false);
    } catch (error: any) {
      toast.error("Error uploading: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleViewEvidence = (item: EvidenceItem) => {
    setSelectedEvidence(item);
    setViewDialogOpen(true);
  };

  const handleEditEvidence = (item: EvidenceItem) => {
    setSelectedEvidence(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditDescription(item.description || "");
    setEditValidUntil(item.valid_until || "");
    setEditStatus(item.status);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEvidence || !editTitle || !editCategory) {
      toast.error("Please fill in title and category");
      return;
    }

    setUploading(true);
    try {
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        const updatedEvidence = evidence.map(e =>
          e.id === selectedEvidence.id
            ? {
                ...e,
                title: editTitle,
                category: editCategory,
                description: editDescription || null,
                valid_until: editValidUntil || null,
                status: editStatus,
              }
            : e
        );

        setEvidence(updatedEvidence);
        localStorage.setItem("demo_evidence_items", JSON.stringify(updatedEvidence));
        toast.success("Evidence updated");
        setEditDialogOpen(false);
        setSelectedEvidence(null);
        setUploading(false);
        return;
      }

      // Supabase mode
      const { error } = await supabase
        .from("evidence_items")
        .update({
          title: editTitle,
          category: editCategory,
          description: editDescription || null,
          valid_until: editValidUntil || null,
          status: editStatus,
        })
        .eq("id", selectedEvidence.id);

      if (error) throw error;

      setEvidence(evidence.map(e =>
        e.id === selectedEvidence.id
          ? {
              ...e,
              title: editTitle,
              category: editCategory,
              description: editDescription || null,
              valid_until: editValidUntil || null,
              status: editStatus,
            }
          : e
      ));

      toast.success("Evidence updated");
      setEditDialogOpen(false);
      setSelectedEvidence(null);
    } catch (error: any) {
      toast.error("Error updating: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (item: EvidenceItem) => {
    // For demo mode, show a message since we don't have actual files
    const demoWorkspaceData = localStorage.getItem("demo_workspace");
    if (demoWorkspaceData) {
      toast.info(`In demo mode: "${item.file_name}" would download here. In production, this downloads the actual file.`);
      return;
    }

    // For Supabase mode, get signed URL and download
    if (item.file_name) {
      // In production, this would use supabase.storage.from('evidence').download()
      toast.success(`Downloading ${item.file_name}...`);
    }
  };

  const handleDeleteEvidence = async () => {
    if (!selectedEvidence) return;

    try {
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        const updatedEvidence = evidence.filter(e => e.id !== selectedEvidence.id);
        setEvidence(updatedEvidence);
        localStorage.setItem("demo_evidence_items", JSON.stringify(updatedEvidence));

        // Update readiness score
        const demoScoreData = localStorage.getItem("demo_readiness_score");
        if (demoScoreData) {
          const score = JSON.parse(demoScoreData);
          score.total_evidence_items = updatedEvidence.length;
          score.current_evidence_items = updatedEvidence.filter(e => e.status === "current").length;
          score.expiring_evidence_items = updatedEvidence.filter(e => e.status === "expiring_soon").length;
          score.expired_evidence_items = updatedEvidence.filter(e => e.status === "expired").length;
          localStorage.setItem("demo_readiness_score", JSON.stringify(score));
        }

        toast.success("Evidence deleted");
        setDeleteDialogOpen(false);
        setSelectedEvidence(null);
        return;
      }

      // Supabase mode - delete file from storage first if exists
      // Then delete record
      const { error } = await supabase
        .from("evidence_items")
        .delete()
        .eq("id", selectedEvidence.id);

      if (error) throw error;

      setEvidence(evidence.filter(e => e.id !== selectedEvidence.id));
      toast.success("Evidence deleted");
      setDeleteDialogOpen(false);
      setSelectedEvidence(null);
    } catch (error: any) {
      toast.error("Error deleting: " + error.message);
    }
  };

  const filteredEvidence = evidence.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "expiring_soon":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "expired":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "needs_review":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return <Badge variant="default" className="bg-green-100 text-green-700">Current</Badge>;
      case "expiring_soon":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-700">Expiring Soon</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "needs_review":
        return <Badge variant="default" className="bg-orange-100 text-orange-700">Needs Review</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryLabel = (value: string) => {
    return EVIDENCE_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <WorkspaceLayout
      title="Evidence Locker"
      description="Store and organize your compliance documents"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Evidence Locker
          </h1>
          <p className="text-muted-foreground">
            Store and organize your compliance documents
          </p>
        </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Evidence
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Evidence</DialogTitle>
                <DialogDescription>
                  Add a new document to your evidence locker
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g., Environmental Policy 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={uploadCategory} onValueChange={setUploadCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVIDENCE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Brief description of this document..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={uploadValidUntil}
                    onChange={(e) => setUploadValidUntil(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-sage-light/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search evidence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {EVIDENCE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Evidence List */}
        {filteredEvidence.length === 0 ? (
          <Card className="border-sage-light/20 shadow-soft">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No evidence found</h3>
              <p className="text-muted-foreground mb-4">
                {evidence.length === 0
                  ? "Start building your evidence locker by uploading your first document"
                  : "No documents match your current filters"}
              </p>
              {evidence.length === 0 && (
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredEvidence.map((item) => (
              <Card key={item.id} className="border-sage-light/20 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-muted rounded-lg">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{item.title}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getCategoryLabel(item.category)}
                        </p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {item.file_name && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {item.file_name}
                            </span>
                          )}
                          {item.valid_until && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Valid until: {new Date(item.valid_until).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewEvidence(item)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {item.file_name && (
                          <DropdownMenuItem onClick={() => handleDownload(item)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEditEvidence(item)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedEvidence(item);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Evidence Details</DialogTitle>
          </DialogHeader>
          {selectedEvidence && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {getStatusIcon(selectedEvidence.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedEvidence.title}</h3>
                  <p className="text-sm text-muted-foreground">{getCategoryLabel(selectedEvidence.category)}</p>
                </div>
                {getStatusBadge(selectedEvidence.status)}
              </div>

              {selectedEvidence.description && (
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="text-sm mt-1">{selectedEvidence.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedEvidence.file_name && (
                  <div>
                    <Label className="text-muted-foreground text-xs">File</Label>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {selectedEvidence.file_name}
                    </p>
                  </div>
                )}
                {selectedEvidence.document_date && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Document Date</Label>
                    <p className="text-sm mt-1">{new Date(selectedEvidence.document_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedEvidence.valid_until && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Valid Until</Label>
                    <p className="text-sm mt-1">{new Date(selectedEvidence.valid_until).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground text-xs">Uploaded</Label>
                  <p className="text-sm mt-1">{new Date(selectedEvidence.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            {selectedEvidence?.file_name && (
              <Button variant="outline" onClick={() => selectedEvidence && handleDownload(selectedEvidence)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              if (selectedEvidence) handleEditEvidence(selectedEvidence);
            }}>
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Evidence</DialogTitle>
            <DialogDescription>
              Update this evidence item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EVIDENCE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-validUntil">Valid Until</Label>
              <Input
                id="edit-validUntil"
                type="date"
                value={editValidUntil}
                onChange={(e) => setEditValidUntil(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={uploading}>
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evidence</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedEvidence?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvidence}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WorkspaceLayout>
  );
}

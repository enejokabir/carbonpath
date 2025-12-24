import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  Repeat,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const FREQUENCIES = [
  { value: "one_time", label: "One Time" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannually", label: "Every 6 Months" },
  { value: "annually", label: "Annually" },
];

const CATEGORIES = [
  { value: "environmental_policy", label: "Environmental Policy" },
  { value: "energy_management", label: "Energy Management" },
  { value: "waste_management", label: "Waste Management" },
  { value: "certifications", label: "Certifications" },
  { value: "audit_reports", label: "Audit Reports" },
  { value: "other", label: "Other" },
];

interface Obligation {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  frequency: string;
  due_date: string;
  is_recurring: boolean;
  is_completed: boolean;
  completed_at: string | null;
}

export default function ComplianceCalendar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Current view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // View/Edit/Delete state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);

  // Add form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newFrequency, setNewFrequency] = useState("one_time");
  const [newDueDate, setNewDueDate] = useState("");
  const [newIsRecurring, setNewIsRecurring] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFrequency, setEditFrequency] = useState("one_time");
  const [editDueDate, setEditDueDate] = useState("");
  const [editIsRecurring, setEditIsRecurring] = useState(false);

  useEffect(() => {
    const loadObligations = async () => {
      // Check for demo workspace first
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        const demoWorkspace = JSON.parse(demoWorkspaceData);
        setWorkspaceId(demoWorkspace.id);

        // Load demo obligations from localStorage
        const demoObligationsData = localStorage.getItem("demo_obligations");
        if (demoObligationsData) {
          setObligations(JSON.parse(demoObligationsData));
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

      const { data, error } = await supabase
        .from("obligations")
        .select("*")
        .eq("workspace_id", profile.current_workspace_id)
        .order("due_date", { ascending: true });

      if (error) {
        toast.error("Error loading obligations: " + error.message);
      } else {
        setObligations(data || []);
      }

      setLoading(false);
    };

    loadObligations();
  }, [navigate]);

  const handleAddObligation = async () => {
    if (!newTitle || !newDueDate) {
      toast.error("Please fill in title and due date");
      return;
    }

    if (!workspaceId) return;

    setSaving(true);
    try {
      // Check if we're in demo mode
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        // Demo mode - save to localStorage
        const newObligation: Obligation = {
          id: `demo-obligation-${Date.now()}`,
          title: newTitle,
          description: newDescription || null,
          category: newCategory || null,
          frequency: newFrequency,
          due_date: newDueDate,
          is_recurring: newIsRecurring,
          is_completed: false,
          completed_at: null,
        };

        const updatedObligations = [...obligations, newObligation].sort((a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        );
        setObligations(updatedObligations);
        localStorage.setItem("demo_obligations", JSON.stringify(updatedObligations));

        // Update readiness score
        const demoScoreData = localStorage.getItem("demo_readiness_score");
        if (demoScoreData) {
          const score = JSON.parse(demoScoreData);
          const upcoming = updatedObligations.filter(o => !o.is_completed);
          const overdue = upcoming.filter(o => new Date(o.due_date) < new Date()).length;
          score.total_obligations = updatedObligations.length;
          score.overdue_obligations = overdue;
          score.upcoming_obligations = upcoming.length - overdue;
          score.obligations_score = updatedObligations.length === 0 ? 100 :
            Math.round(((updatedObligations.length - overdue) / updatedObligations.length) * 100);
          score.overall_score = Math.round(
            (score.evidence_score * 0.25 + score.freshness_score * 0.25 +
             score.checklist_score * 0.30 + score.obligations_score * 0.20)
          );
          localStorage.setItem("demo_readiness_score", JSON.stringify(score));
        }

        toast.success("Obligation added");

        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewCategory("");
        setNewFrequency("one_time");
        setNewDueDate("");
        setNewIsRecurring(false);
        setAddDialogOpen(false);
        setSaving(false);
        return;
      }

      // Supabase mode
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("obligations")
        .insert({
          workspace_id: workspaceId,
          title: newTitle,
          description: newDescription || null,
          category: newCategory || null,
          frequency: newFrequency,
          due_date: newDueDate,
          is_recurring: newIsRecurring,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setObligations([...obligations, data].sort((a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ));
      toast.success("Obligation added");

      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewCategory("");
      setNewFrequency("one_time");
      setNewDueDate("");
      setNewIsRecurring(false);
      setAddDialogOpen(false);
    } catch (error: any) {
      toast.error("Error adding obligation: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (obligation: Obligation) => {
    try {
      const newCompleted = !obligation.is_completed;

      // Check if we're in demo mode
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        // Demo mode - update localStorage
        const updatedObligations = obligations.map(o =>
          o.id === obligation.id
            ? { ...o, is_completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
            : o
        );
        setObligations(updatedObligations);
        localStorage.setItem("demo_obligations", JSON.stringify(updatedObligations));

        // Update readiness score
        const demoScoreData = localStorage.getItem("demo_readiness_score");
        if (demoScoreData) {
          const score = JSON.parse(demoScoreData);
          const upcoming = updatedObligations.filter(o => !o.is_completed);
          const overdue = upcoming.filter(o => new Date(o.due_date) < new Date()).length;
          score.overdue_obligations = overdue;
          score.upcoming_obligations = upcoming.length - overdue;
          score.obligations_score = updatedObligations.length === 0 ? 100 :
            Math.round(((updatedObligations.length - overdue) / updatedObligations.length) * 100);
          score.overall_score = Math.round(
            (score.evidence_score * 0.25 + score.freshness_score * 0.25 +
             score.checklist_score * 0.30 + score.obligations_score * 0.20)
          );
          localStorage.setItem("demo_readiness_score", JSON.stringify(score));
        }

        toast.success(newCompleted ? "Marked complete" : "Marked incomplete");
        return;
      }

      // Supabase mode
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("obligations")
        .update({
          is_completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
          completed_by: newCompleted ? session.user.id : null,
        })
        .eq("id", obligation.id);

      if (error) throw error;

      setObligations(obligations.map(o =>
        o.id === obligation.id
          ? { ...o, is_completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
          : o
      ));

      toast.success(newCompleted ? "Marked complete" : "Marked incomplete");
    } catch (error: any) {
      toast.error("Error updating: " + error.message);
    }
  };

  const handleViewObligation = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setViewDialogOpen(true);
  };

  const handleEditObligation = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setEditTitle(obligation.title);
    setEditDescription(obligation.description || "");
    setEditCategory(obligation.category || "");
    setEditFrequency(obligation.frequency);
    setEditDueDate(obligation.due_date);
    setEditIsRecurring(obligation.is_recurring);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedObligation || !editTitle || !editDueDate) {
      toast.error("Please fill in title and due date");
      return;
    }

    setSaving(true);
    try {
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        const updatedObligations = obligations.map(o =>
          o.id === selectedObligation.id
            ? {
                ...o,
                title: editTitle,
                description: editDescription || null,
                category: editCategory || null,
                frequency: editFrequency,
                due_date: editDueDate,
                is_recurring: editIsRecurring,
              }
            : o
        ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

        setObligations(updatedObligations);
        localStorage.setItem("demo_obligations", JSON.stringify(updatedObligations));
        toast.success("Obligation updated");
        setEditDialogOpen(false);
        setSelectedObligation(null);
        setSaving(false);
        return;
      }

      // Supabase mode
      const { error } = await supabase
        .from("obligations")
        .update({
          title: editTitle,
          description: editDescription || null,
          category: editCategory || null,
          frequency: editFrequency,
          due_date: editDueDate,
          is_recurring: editIsRecurring,
        })
        .eq("id", selectedObligation.id);

      if (error) throw error;

      setObligations(obligations.map(o =>
        o.id === selectedObligation.id
          ? {
              ...o,
              title: editTitle,
              description: editDescription || null,
              category: editCategory || null,
              frequency: editFrequency,
              due_date: editDueDate,
              is_recurring: editIsRecurring,
            }
          : o
      ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));

      toast.success("Obligation updated");
      setEditDialogOpen(false);
      setSelectedObligation(null);
    } catch (error: any) {
      toast.error("Error updating: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteObligation = async () => {
    if (!selectedObligation) return;

    try {
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        const updatedObligations = obligations.filter(o => o.id !== selectedObligation.id);
        setObligations(updatedObligations);
        localStorage.setItem("demo_obligations", JSON.stringify(updatedObligations));

        // Update readiness score
        const demoScoreData = localStorage.getItem("demo_readiness_score");
        if (demoScoreData) {
          const score = JSON.parse(demoScoreData);
          const upcoming = updatedObligations.filter(o => !o.is_completed);
          const overdue = upcoming.filter(o => new Date(o.due_date) < new Date()).length;
          score.total_obligations = updatedObligations.length;
          score.overdue_obligations = overdue;
          score.upcoming_obligations = upcoming.length - overdue;
          localStorage.setItem("demo_readiness_score", JSON.stringify(score));
        }

        toast.success("Obligation deleted");
        setDeleteDialogOpen(false);
        setSelectedObligation(null);
        return;
      }

      // Supabase mode
      const { error } = await supabase
        .from("obligations")
        .delete()
        .eq("id", selectedObligation.id);

      if (error) throw error;

      setObligations(obligations.filter(o => o.id !== selectedObligation.id));
      toast.success("Obligation deleted");
      setDeleteDialogOpen(false);
      setSelectedObligation(null);
    } catch (error: any) {
      toast.error("Error deleting: " + error.message);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !obligations.find(o => o.due_date === dueDate)?.is_completed;
  };

  const getStatusBadge = (obligation: Obligation) => {
    if (obligation.is_completed) {
      return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
    }
    const dueDate = new Date(obligation.due_date);
    const today = new Date();
    const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (daysUntil <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-700">Due Soon</Badge>;
    }
    return <Badge variant="secondary">Upcoming</Badge>;
  };

  const upcomingObligations = obligations.filter(o => !o.is_completed);
  const completedObligations = obligations.filter(o => o.is_completed);
  const overdueCount = upcomingObligations.filter(o => new Date(o.due_date) < new Date()).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <WorkspaceLayout
      title="Compliance Calendar"
      description="Track deadlines and recurring obligations"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Compliance Calendar
          </h1>
          <p className="text-muted-foreground">
            Track deadlines and recurring obligations
          </p>
        </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Obligation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Obligation</DialogTitle>
                <DialogDescription>
                  Create a new compliance obligation or deadline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Annual Energy Audit"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={newFrequency} onValueChange={setNewFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={newIsRecurring}
                    onCheckedChange={(checked) => setNewIsRecurring(checked === true)}
                  />
                  <Label htmlFor="recurring" className="text-sm font-normal">
                    Auto-create next occurrence when completed
                  </Label>
                </div>
                <div>
                  <Label htmlFor="description">Notes</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Additional details..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddObligation} disabled={saving}>
                  {saving ? "Saving..." : "Add Obligation"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-sage-light/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingObligations.length}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-sage-light/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueCount}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-sage-light/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedObligations.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Obligations List */}
        {obligations.length === 0 ? (
          <Card className="border-sage-light/20 shadow-soft">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No obligations yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first compliance deadline or recurring obligation
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Obligation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Upcoming */}
            {upcomingObligations.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Upcoming Obligations
                </h3>
                <div className="space-y-3">
                  {upcomingObligations.map((obligation) => (
                    <Card key={obligation.id} className="border-sage-light/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={obligation.is_completed}
                            onCheckedChange={() => handleToggleComplete(obligation)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium">{obligation.title}</h4>
                              {getStatusBadge(obligation)}
                              {obligation.is_recurring && (
                                <Badge variant="outline" className="text-xs">
                                  <Repeat className="w-3 h-3 mr-1" />
                                  {FREQUENCIES.find(f => f.value === obligation.frequency)?.label}
                                </Badge>
                              )}
                            </div>
                            {obligation.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {obligation.description}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              Due: {new Date(obligation.due_date).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewObligation(obligation)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditObligation(obligation)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedObligation(obligation);
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
              </div>
            )}

            {/* Completed */}
            {completedObligations.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed ({completedObligations.length})
                </h3>
                <div className="space-y-3">
                  {completedObligations.slice(0, 5).map((obligation) => (
                    <Card key={obligation.id} className="border-sage-light/20 opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={obligation.is_completed}
                            onCheckedChange={() => handleToggleComplete(obligation)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium line-through text-muted-foreground">
                              {obligation.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed {obligation.completed_at && new Date(obligation.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewObligation(obligation)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditObligation(obligation)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedObligation(obligation);
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
              </div>
            )}
          </div>
        )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Obligation Details</DialogTitle>
          </DialogHeader>
          {selectedObligation && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground text-xs">Title</Label>
                <p className="font-medium">{selectedObligation.title}</p>
              </div>
              {selectedObligation.description && (
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="text-sm">{selectedObligation.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Category</Label>
                  <p className="text-sm">{CATEGORIES.find(c => c.value === selectedObligation.category)?.label || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Frequency</Label>
                  <p className="text-sm">{FREQUENCIES.find(f => f.value === selectedObligation.frequency)?.label}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Due Date</Label>
                  <p className="text-sm">{new Date(selectedObligation.due_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedObligation)}</div>
                </div>
              </div>
              {selectedObligation.is_completed && selectedObligation.completed_at && (
                <div>
                  <Label className="text-muted-foreground text-xs">Completed On</Label>
                  <p className="text-sm">{new Date(selectedObligation.completed_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedObligation.is_recurring} disabled />
                <Label className="text-sm font-normal">Auto-create next occurrence when completed</Label>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              if (selectedObligation) handleEditObligation(selectedObligation);
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
            <DialogTitle>Edit Obligation</DialogTitle>
            <DialogDescription>
              Update this compliance obligation
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
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-dueDate">Due Date *</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-frequency">Frequency</Label>
              <Select value={editFrequency} onValueChange={setEditFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-recurring"
                checked={editIsRecurring}
                onCheckedChange={(checked) => setEditIsRecurring(checked === true)}
              />
              <Label htmlFor="edit-recurring" className="text-sm font-normal">
                Auto-create next occurrence when completed
              </Label>
            </div>
            <div>
              <Label htmlFor="edit-description">Notes</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Obligation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedObligation?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteObligation}
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

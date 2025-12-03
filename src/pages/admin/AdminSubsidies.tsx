import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subsidy {
  id: string;
  name: string;
  description: string;
  subsidy_type: string;
  eligibility_text: string;
  business_types: string[];
  location_scope: string[];
  min_employees: number | null;
  max_employees: number | null;
  value_description: string | null;
  application_link: string | null;
  deadline: string | null;
  is_active: boolean;
  created_at: string;
}

const businessTypeOptions = [
  "Manufacturing",
  "Retail",
  "Professional Services",
  "Hospitality",
  "Construction",
  "Transportation",
  "Healthcare",
  "Technology",
  "Agriculture",
  "Other",
];

const regionOptions = [
  "UK-wide",
  "England",
  "Scotland",
  "Wales",
  "Northern Ireland",
  "East Midlands",
  "West Midlands",
  "North East",
  "North West",
  "Yorkshire",
  "South East",
  "South West",
  "London",
];

const subsidyTypeOptions = [
  { value: "tax_relief", label: "Tax Relief" },
  { value: "rate_reduction", label: "Rate Reduction" },
  { value: "loan", label: "Loan" },
  { value: "voucher", label: "Voucher" },
  { value: "rebate", label: "Rebate" },
  { value: "other", label: "Other" },
];

const emptySubsidy = {
  name: "",
  description: "",
  subsidy_type: "",
  eligibility_text: "",
  business_types: [] as string[],
  location_scope: [] as string[],
  min_employees: "",
  max_employees: "",
  value_description: "",
  application_link: "",
  deadline: "",
  is_active: true,
};

export default function AdminSubsidies() {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubsidy, setEditingSubsidy] = useState<Subsidy | null>(null);
  const [formData, setFormData] = useState(emptySubsidy);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadSubsidies();
  }, []);

  const loadSubsidies = async () => {
    try {
      const { data, error } = await supabase
        .from("subsidies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubsidies(data || []);
    } catch (error: any) {
      console.error("Error loading subsidies:", error);
      toast.error("Failed to load subsidies");
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingSubsidy(null);
    setFormData(emptySubsidy);
    setDialogOpen(true);
  };

  const openEditDialog = (subsidy: Subsidy) => {
    setEditingSubsidy(subsidy);
    setFormData({
      name: subsidy.name,
      description: subsidy.description,
      subsidy_type: subsidy.subsidy_type,
      eligibility_text: subsidy.eligibility_text,
      business_types: subsidy.business_types || [],
      location_scope: subsidy.location_scope || [],
      min_employees: subsidy.min_employees?.toString() || "",
      max_employees: subsidy.max_employees?.toString() || "",
      value_description: subsidy.value_description || "",
      application_link: subsidy.application_link || "",
      deadline: subsidy.deadline || "",
      is_active: subsidy.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.subsidy_type) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const subsidyData = {
        name: formData.name,
        description: formData.description,
        subsidy_type: formData.subsidy_type,
        eligibility_text: formData.eligibility_text,
        business_types: formData.business_types,
        location_scope: formData.location_scope,
        min_employees: formData.min_employees ? parseInt(formData.min_employees) : null,
        max_employees: formData.max_employees ? parseInt(formData.max_employees) : null,
        value_description: formData.value_description || null,
        application_link: formData.application_link || null,
        deadline: formData.deadline || null,
        is_active: formData.is_active,
      };

      if (editingSubsidy) {
        const { error } = await supabase
          .from("subsidies")
          .update(subsidyData)
          .eq("id", editingSubsidy.id);

        if (error) throw error;
        toast.success("Subsidy updated successfully");
      } else {
        const { error } = await supabase
          .from("subsidies")
          .insert(subsidyData);

        if (error) throw error;
        toast.success("Subsidy created successfully");
      }

      setDialogOpen(false);
      await loadSubsidies();
    } catch (error: any) {
      console.error("Error saving subsidy:", error);
      toast.error("Failed to save subsidy: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subsidies")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Subsidy deleted successfully");
      setDeleteConfirm(null);
      await loadSubsidies();
    } catch (error: any) {
      console.error("Error deleting subsidy:", error);
      toast.error("Failed to delete subsidy: " + error.message);
    }
  };

  const toggleBusinessType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      business_types: prev.business_types.includes(type)
        ? prev.business_types.filter(t => t !== type)
        : [...prev.business_types, type],
    }));
  };

  const toggleRegion = (region: string) => {
    setFormData(prev => ({
      ...prev,
      location_scope: prev.location_scope.includes(region)
        ? prev.location_scope.filter(r => r !== region)
        : [...prev.location_scope, region],
    }));
  };

  const getSubsidyTypeLabel = (type: string) => {
    return subsidyTypeOptions.find(t => t.value === type)?.label || type;
  };

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
          <h1 className="text-3xl font-bold">Subsidies</h1>
          <p className="text-muted-foreground">
            Manage subsidy and tax relief listings
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Subsidy
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subsidies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No subsidies yet. Click "Add Subsidy" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                subsidies.map((subsidy) => (
                  <TableRow key={subsidy.id}>
                    <TableCell className="font-medium">{subsidy.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getSubsidyTypeLabel(subsidy.subsidy_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{subsidy.value_description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {subsidy.location_scope?.slice(0, 2).map((region) => (
                          <Badge key={region} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                        {(subsidy.location_scope?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(subsidy.location_scope?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subsidy.is_active ? "default" : "secondary"}>
                        {subsidy.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {subsidy.application_link && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => window.open(subsidy.application_link!, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(subsidy)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteConfirm(subsidy.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSubsidy ? "Edit Subsidy" : "Add New Subsidy"}</DialogTitle>
            <DialogDescription>
              {editingSubsidy ? "Update the subsidy details below" : "Fill in the subsidy details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subsidy Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., R&D Tax Credits"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subsidy_type">Type *</Label>
                <Select
                  value={formData.subsidy_type}
                  onValueChange={(value) => setFormData({ ...formData, subsidy_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {subsidyTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Value and Link */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value_description">Value Description</Label>
                <Input
                  id="value_description"
                  value={formData.value_description}
                  onChange={(e) => setFormData({ ...formData, value_description: e.target.value })}
                  placeholder="e.g., Up to 33% tax relief"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_link">Application Link</Label>
              <Input
                id="application_link"
                type="url"
                value={formData.application_link}
                onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Eligibility */}
            <div className="space-y-2">
              <Label htmlFor="eligibility_text">Eligibility Requirements</Label>
              <Textarea
                id="eligibility_text"
                value={formData.eligibility_text}
                onChange={(e) => setFormData({ ...formData, eligibility_text: e.target.value })}
                rows={2}
              />
            </div>

            {/* Employee Requirements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_employees">Min Employees</Label>
                <Input
                  id="min_employees"
                  type="number"
                  value={formData.min_employees}
                  onChange={(e) => setFormData({ ...formData, min_employees: e.target.value })}
                  placeholder="Leave blank if no minimum"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_employees">Max Employees</Label>
                <Input
                  id="max_employees"
                  type="number"
                  value={formData.max_employees}
                  onChange={(e) => setFormData({ ...formData, max_employees: e.target.value })}
                  placeholder="Leave blank if no maximum"
                />
              </div>
            </div>

            {/* Business Types */}
            <div className="space-y-2">
              <Label>Eligible Business Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {businessTypeOptions.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`bt-${type}`}
                      checked={formData.business_types.includes(type)}
                      onCheckedChange={() => toggleBusinessType(type)}
                    />
                    <label htmlFor={`bt-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div className="space-y-2">
              <Label>Location Scope</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {regionOptions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={formData.location_scope.includes(region)}
                      onCheckedChange={() => toggleRegion(region)}
                    />
                    <label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                      {region}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
              />
              <label htmlFor="is_active" className="text-sm cursor-pointer">
                Active (visible on the platform)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingSubsidy ? "Save Changes" : "Create Subsidy"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subsidy</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subsidy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

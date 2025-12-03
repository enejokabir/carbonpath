import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Grant {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount_min: number | null;
  amount_max: number | null;
  amount_description: string | null;
  grant_type: string | null;
  eligibility_text: string;
  business_types: string[];
  location_scope: string[];
  sectors: string[] | null;
  deadline: string | null;
  application_link: string | null;
  whats_covered: string[] | null;
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

const grantTypeOptions = [
  "Government",
  "Local Authority",
  "EU Funded",
  "Private Foundation",
  "Industry Body",
];

const emptyGrant = {
  name: "",
  provider: "",
  description: "",
  amount_min: "",
  amount_max: "",
  amount_description: "",
  grant_type: "",
  eligibility_text: "",
  business_types: [] as string[],
  location_scope: [] as string[],
  sectors: "",
  deadline: "",
  application_link: "",
  whats_covered: "",
  is_active: true,
};

export default function AdminGrants() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [formData, setFormData] = useState(emptyGrant);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      const { data, error } = await supabase
        .from("grants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGrants(data || []);
    } catch (error: any) {
      console.error("Error loading grants:", error);
      toast.error("Failed to load grants");
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingGrant(null);
    setFormData(emptyGrant);
    setDialogOpen(true);
  };

  const openEditDialog = (grant: Grant) => {
    setEditingGrant(grant);
    setFormData({
      name: grant.name,
      provider: grant.provider,
      description: grant.description,
      amount_min: grant.amount_min?.toString() || "",
      amount_max: grant.amount_max?.toString() || "",
      amount_description: grant.amount_description || "",
      grant_type: grant.grant_type || "",
      eligibility_text: grant.eligibility_text,
      business_types: grant.business_types || [],
      location_scope: grant.location_scope || [],
      sectors: grant.sectors?.join(", ") || "",
      deadline: grant.deadline || "",
      application_link: grant.application_link || "",
      whats_covered: grant.whats_covered?.join(", ") || "",
      is_active: grant.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.provider || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const grantData = {
        name: formData.name,
        provider: formData.provider,
        description: formData.description,
        amount_min: formData.amount_min ? parseInt(formData.amount_min) : null,
        amount_max: formData.amount_max ? parseInt(formData.amount_max) : null,
        amount_description: formData.amount_description || null,
        grant_type: formData.grant_type || null,
        eligibility_text: formData.eligibility_text,
        business_types: formData.business_types,
        location_scope: formData.location_scope,
        sectors: formData.sectors ? formData.sectors.split(",").map(s => s.trim()) : null,
        deadline: formData.deadline || null,
        application_link: formData.application_link || null,
        whats_covered: formData.whats_covered ? formData.whats_covered.split(",").map(s => s.trim()) : null,
        is_active: formData.is_active,
      };

      if (editingGrant) {
        const { error } = await supabase
          .from("grants")
          .update(grantData)
          .eq("id", editingGrant.id);

        if (error) throw error;
        toast.success("Grant updated successfully");
      } else {
        const { error } = await supabase
          .from("grants")
          .insert(grantData);

        if (error) throw error;
        toast.success("Grant created successfully");
      }

      setDialogOpen(false);
      await loadGrants();
    } catch (error: any) {
      console.error("Error saving grant:", error);
      toast.error("Failed to save grant: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("grants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Grant deleted successfully");
      setDeleteConfirm(null);
      await loadGrants();
    } catch (error: any) {
      console.error("Error deleting grant:", error);
      toast.error("Failed to delete grant: " + error.message);
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
          <h1 className="text-3xl font-bold">Grants</h1>
          <p className="text-muted-foreground">
            Manage grant listings on the platform
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Grant
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No grants yet. Click "Add Grant" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                grants.map((grant) => (
                  <TableRow key={grant.id}>
                    <TableCell className="font-medium">{grant.name}</TableCell>
                    <TableCell>{grant.provider}</TableCell>
                    <TableCell>
                      {grant.amount_description ||
                        (grant.amount_min && grant.amount_max
                          ? `£${grant.amount_min.toLocaleString()} - £${grant.amount_max.toLocaleString()}`
                          : grant.amount_max
                          ? `Up to £${grant.amount_max.toLocaleString()}`
                          : "Varies")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {grant.location_scope?.slice(0, 2).map((region) => (
                          <Badge key={region} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                        {(grant.location_scope?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(grant.location_scope?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={grant.is_active ? "default" : "secondary"}>
                        {grant.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {grant.application_link && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => window.open(grant.application_link!, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(grant)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteConfirm(grant.id)}
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
            <DialogTitle>{editingGrant ? "Edit Grant" : "Add New Grant"}</DialogTitle>
            <DialogDescription>
              {editingGrant ? "Update the grant details below" : "Fill in the grant details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Grant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Green Business Fund"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="e.g., BEIS"
                />
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

            {/* Amount */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_min">Min Amount (£)</Label>
                <Input
                  id="amount_min"
                  type="number"
                  value={formData.amount_min}
                  onChange={(e) => setFormData({ ...formData, amount_min: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount_max">Max Amount (£)</Label>
                <Input
                  id="amount_max"
                  type="number"
                  value={formData.amount_max}
                  onChange={(e) => setFormData({ ...formData, amount_max: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount_description">Amount Text</Label>
                <Input
                  id="amount_description"
                  value={formData.amount_description}
                  onChange={(e) => setFormData({ ...formData, amount_description: e.target.value })}
                  placeholder="e.g., Up to 50% of costs"
                />
              </div>
            </div>

            {/* Type and Link */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grant_type">Grant Type</Label>
                <Select
                  value={formData.grant_type}
                  onValueChange={(value) => setFormData({ ...formData, grant_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {grantTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {/* Additional */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sectors">Sectors (comma-separated)</Label>
                <Input
                  id="sectors"
                  value={formData.sectors}
                  onChange={(e) => setFormData({ ...formData, sectors: e.target.value })}
                  placeholder="e.g., Energy, Manufacturing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whats_covered">What's Covered (comma-separated)</Label>
                <Input
                  id="whats_covered"
                  value={formData.whats_covered}
                  onChange={(e) => setFormData({ ...formData, whats_covered: e.target.value })}
                  placeholder="e.g., Equipment, Consultancy"
                />
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
                editingGrant ? "Save Changes" : "Create Grant"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Grant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this grant? This action cannot be undone.
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

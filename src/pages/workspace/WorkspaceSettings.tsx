import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Settings,
  Users,
  Building2,
  UserPlus,
  Mail,
  Shield,
  Crown,
  User,
  Eye,
  Trash2,
} from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  industry: string;
  employee_count: number | null;
  location: string | null;
  postcode: string | null;
  website: string | null;
  description: string | null;
}

interface WorkspaceMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

const ROLES = [
  { value: "owner", label: "Owner", description: "Full access, can delete workspace", icon: Crown },
  { value: "manager", label: "Manager", description: "Can manage team and evidence", icon: Shield },
  { value: "member", label: "Member", description: "Can upload and view evidence", icon: User },
  { value: "viewer", label: "Viewer", description: "Can only view evidence", icon: Eye },
];

export default function WorkspaceSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPostcode, setEditPostcode] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const loadWorkspace = async () => {
      // Check for demo workspace first
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        const demoWorkspace = JSON.parse(demoWorkspaceData);
        setWorkspace(demoWorkspace);
        setEditName(demoWorkspace.name);
        setEditLocation(demoWorkspace.location || "");
        setEditPostcode(demoWorkspace.postcode || "");
        setEditWebsite(demoWorkspace.website || "");
        setEditDescription(demoWorkspace.description || "");

        // Demo mode - single user as owner
        setMembers([{
          id: "demo-member-1",
          user_id: "demo-user",
          role: "owner",
          joined_at: demoWorkspace.created_at,
          profiles: {
            email: "you@example.com",
            full_name: "You (Demo User)",
          },
        }]);
        setCurrentUserRole("owner");

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

      // Load workspace
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", profile.current_workspace_id)
        .single();

      if (workspaceError) {
        toast.error("Error loading workspace");
        return;
      }

      setWorkspace(workspaceData);
      setEditName(workspaceData.name);
      setEditLocation(workspaceData.location || "");
      setEditPostcode(workspaceData.postcode || "");
      setEditWebsite(workspaceData.website || "");
      setEditDescription(workspaceData.description || "");

      // Load members
      const { data: membersData } = await supabase
        .from("workspace_members")
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .eq("workspace_id", profile.current_workspace_id);

      if (membersData) {
        setMembers(membersData as any);
        const currentMember = membersData.find(m => m.user_id === session.user.id);
        setCurrentUserRole(currentMember?.role || null);
      }

      setLoading(false);
    };

    loadWorkspace();
  }, [navigate]);

  const handleSaveWorkspace = async () => {
    if (!workspace) return;

    setSaving(true);
    try {
      // Check if we're in demo mode
      const demoWorkspaceData = localStorage.getItem("demo_workspace");

      if (demoWorkspaceData) {
        // Demo mode - save to localStorage
        const updatedWorkspace = {
          ...workspace,
          name: editName,
          location: editLocation || null,
          postcode: editPostcode || null,
          website: editWebsite || null,
          description: editDescription || null,
        };

        localStorage.setItem("demo_workspace", JSON.stringify(updatedWorkspace));
        setWorkspace(updatedWorkspace);
        toast.success("Workspace updated");
        setSaving(false);
        return;
      }

      // Supabase mode
      const { error } = await supabase
        .from("workspaces")
        .update({
          name: editName,
          location: editLocation || null,
          postcode: editPostcode || null,
          website: editWebsite || null,
          description: editDescription || null,
        })
        .eq("id", workspace.id);

      if (error) throw error;

      setWorkspace({
        ...workspace,
        name: editName,
        location: editLocation || null,
        postcode: editPostcode || null,
        website: editWebsite || null,
        description: editDescription || null,
      });

      toast.success("Workspace updated");
    } catch (error: any) {
      toast.error("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !workspace) {
      toast.error("Please enter an email address");
      return;
    }

    toast.info("Team invitations will be available soon. For now, share the workspace directly.");
    setInviteDialogOpen(false);
    setInviteEmail("");
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (userId === session?.user.id) {
      toast.error("You cannot remove yourself");
      return;
    }

    try {
      const { error } = await supabase
        .from("workspace_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      setMembers(members.filter(m => m.id !== memberId));
      toast.success("Member removed");
    } catch (error: any) {
      toast.error("Error removing member: " + error.message);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleConfig = ROLES.find(r => r.value === role);
    return roleConfig ? roleConfig.icon : User;
  };

  const canManageTeam = currentUserRole === "owner" || currentUserRole === "manager";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <WorkspaceLayout
      title="Workspace Settings"
      description="Manage your workspace and team members"
    >
      {/* Page Header */}
      <div className="mb-8 hidden lg:block">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Workspace Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your workspace and team members
        </p>
      </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Building2 className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="border-sage-light/20">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={!canManageTeam}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="London"
                      disabled={!canManageTeam}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={editPostcode}
                      onChange={(e) => setEditPostcode(e.target.value)}
                      placeholder="SW1A 1AA"
                      disabled={!canManageTeam}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="https://example.com"
                    disabled={!canManageTeam}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Brief company description"
                    disabled={!canManageTeam}
                  />
                </div>

                {canManageTeam && (
                  <Button onClick={handleSaveWorkspace} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Industry:</strong> {workspace?.industry}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Workspace ID:</strong> {workspace?.slug}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Settings */}
          <TabsContent value="team">
            <Card className="border-sage-light/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    {members.length} member{members.length !== 1 ? "s" : ""} in this workspace
                  </CardDescription>
                </div>
                {canManageTeam && (
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                          Send an invitation to join this workspace
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="colleague@company.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.filter(r => r.value !== "owner").map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  <div className="flex items-center gap-2">
                                    <role.icon className="w-4 h-4" />
                                    {role.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ROLES.find(r => r.value === inviteRole)?.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleInvite}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Invite
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member) => {
                    const RoleIcon = getRoleIcon(member.role);
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <RoleIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.profiles?.full_name || member.profiles?.email || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.profiles?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {member.role}
                          </Badge>
                          {canManageTeam && member.role !== "owner" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMember(member.id, member.user_id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Role Legend */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Role Permissions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <div key={role.value} className="flex items-start gap-2 text-xs">
                        <role.icon className="w-3 h-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{role.label}:</span>{" "}
                          <span className="text-muted-foreground">{role.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </WorkspaceLayout>
  );
}

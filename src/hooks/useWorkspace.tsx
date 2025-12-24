import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  onboarding_completed: boolean;
  onboarding_step: number;
}

interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: "owner" | "manager" | "member" | "viewer";
  joined_at: string;
}

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
  calculated_at: string;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  membership: WorkspaceMember | null;
  members: WorkspaceMember[];
  readinessScore: ReadinessScore | null;
  loading: boolean;
  error: string | null;
  isOwner: boolean;
  isManager: boolean;
  canManage: boolean;
  canUpload: boolean;
  refreshWorkspace: () => Promise<void>;
  refreshScore: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [membership, setMembership] = useState<WorkspaceMember | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [readinessScore, setReadinessScore] = useState<ReadinessScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setWorkspace(null);
        setMembership(null);
        setReadinessScore(null);
        return;
      }

      // Get user's current workspace ID from profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("current_workspace_id")
        .eq("id", session.user.id)
        .single();

      if (profileError || !profile?.current_workspace_id) {
        setWorkspace(null);
        setMembership(null);
        setReadinessScore(null);
        return;
      }

      // Load workspace
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", profile.current_workspace_id)
        .single();

      if (workspaceError) {
        throw workspaceError;
      }

      setWorkspace(workspaceData);

      // Load membership
      const { data: membershipData } = await supabase
        .from("workspace_members")
        .select("*")
        .eq("workspace_id", profile.current_workspace_id)
        .eq("user_id", session.user.id)
        .single();

      setMembership(membershipData);

      // Load all members
      const { data: membersData } = await supabase
        .from("workspace_members")
        .select("*")
        .eq("workspace_id", profile.current_workspace_id);

      setMembers(membersData || []);

      // Load readiness score
      const { data: scoreData } = await supabase
        .from("readiness_scores")
        .select("*")
        .eq("workspace_id", profile.current_workspace_id)
        .single();

      setReadinessScore(scoreData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshWorkspace = async () => {
    await loadWorkspace();
  };

  const refreshScore = async () => {
    if (!workspace) return;

    const { data } = await supabase
      .from("readiness_scores")
      .select("*")
      .eq("workspace_id", workspace.id)
      .single();

    setReadinessScore(data);
  };

  useEffect(() => {
    loadWorkspace();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadWorkspace();
    });

    return () => subscription.unsubscribe();
  }, []);

  const isOwner = membership?.role === "owner";
  const isManager = membership?.role === "manager";
  const canManage = isOwner || isManager;
  const canUpload = membership?.role !== "viewer";

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        membership,
        members,
        readinessScore,
        loading,
        error,
        isOwner,
        isManager,
        canManage,
        canUpload,
        refreshWorkspace,
        refreshScore,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);

  // If used outside provider, return demo data from localStorage
  if (context === undefined) {
    const demoWorkspaceData = localStorage.getItem("demo_workspace");
    const demoScoreData = localStorage.getItem("demo_readiness_score");

    return {
      workspace: demoWorkspaceData ? JSON.parse(demoWorkspaceData) : null,
      membership: null,
      members: [],
      readinessScore: demoScoreData ? JSON.parse(demoScoreData) : null,
      loading: false,
      error: null,
      isOwner: true,
      isManager: true,
      canManage: true,
      canUpload: true,
      refreshWorkspace: async () => {},
      refreshScore: async () => {},
    };
  }
  return context;
}

// Hook to check if user has a workspace and redirect accordingly
export function useRequireWorkspace() {
  const { workspace, loading } = useWorkspace();
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!workspace) {
        setShouldRedirect("/onboarding");
      } else if (!workspace.onboarding_completed) {
        setShouldRedirect("/onboarding");
      } else {
        setShouldRedirect(null);
      }
    }
  }, [workspace, loading]);

  return { shouldRedirect, loading };
}

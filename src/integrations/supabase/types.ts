export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      carbon_scores: {
        Row: {
          category: Database["public"]["Enums"]["score_category"]
          completed_at: string
          id: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["score_category"]
          completed_at?: string
          id?: string
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["score_category"]
          completed_at?: string
          id?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultants: {
        Row: {
          bio: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          expertise_areas: string[]
          id: string
          name: string
          region: string
          specialty: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          expertise_areas?: string[]
          id?: string
          name: string
          region: string
          specialty: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          expertise_areas?: string[]
          id?: string
          name?: string
          region?: string
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
      grants: {
        Row: {
          business_types: Database["public"]["Enums"]["business_type"][]
          category: Database["public"]["Enums"]["score_category"] | null
          created_at: string
          description: string
          eligibility_text: string
          id: string
          link: string | null
          location_scope: string[]
          min_score_required: number | null
          name: string
          updated_at: string
        }
        Insert: {
          business_types?: Database["public"]["Enums"]["business_type"][]
          category?: Database["public"]["Enums"]["score_category"] | null
          created_at?: string
          description: string
          eligibility_text: string
          id?: string
          link?: string | null
          location_scope?: string[]
          min_score_required?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          business_types?: Database["public"]["Enums"]["business_type"][]
          category?: Database["public"]["Enums"]["score_category"] | null
          created_at?: string
          description?: string
          eligibility_text?: string
          id?: string
          link?: string | null
          location_scope?: string[]
          min_score_required?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string
          employees: number | null
          id: string
          location: string | null
          updated_at: string
          current_workspace_id: string | null
          full_name: string | null
          email: string | null
        }
        Insert: {
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string
          employees?: number | null
          id: string
          location?: string | null
          updated_at?: string
          current_workspace_id?: string | null
          full_name?: string | null
          email?: string | null
        }
        Update: {
          business_name?: string
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string
          employees?: number | null
          id?: string
          location?: string | null
          updated_at?: string
          current_workspace_id?: string | null
          full_name?: string | null
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_workspace_id_fkey"
            columns: ["current_workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      questionnaire_answers: {
        Row: {
          answer_value: string
          created_at: string
          id: string
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer_value: string
          created_at?: string
          id?: string
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer_value?: string
          created_at?: string
          id?: string
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_items"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_items: {
        Row: {
          answer_type: Database["public"]["Enums"]["answer_type"]
          business_types: Database["public"]["Enums"]["business_type"][]
          created_at: string
          id: string
          options: Json | null
          order_index: number
          question_text: string
          updated_at: string
          weight: number
        }
        Insert: {
          answer_type: Database["public"]["Enums"]["answer_type"]
          business_types?: Database["public"]["Enums"]["business_type"][]
          created_at?: string
          id?: string
          options?: Json | null
          order_index?: number
          question_text: string
          updated_at?: string
          weight?: number
        }
        Update: {
          answer_type?: Database["public"]["Enums"]["answer_type"]
          business_types?: Database["public"]["Enums"]["business_type"][]
          created_at?: string
          id?: string
          options?: Json | null
          order_index?: number
          question_text?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          industry: Database["public"]["Enums"]["business_type"]
          employee_count: number | null
          location: string | null
          postcode: string | null
          website: string | null
          description: string | null
          onboarding_completed: boolean
          onboarding_step: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          industry: Database["public"]["Enums"]["business_type"]
          employee_count?: number | null
          location?: string | null
          postcode?: string | null
          website?: string | null
          description?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          industry?: Database["public"]["Enums"]["business_type"]
          employee_count?: number | null
          location?: string | null
          postcode?: string | null
          website?: string | null
          description?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: Database["public"]["Enums"]["workspace_role"]
          invited_by: string | null
          invited_at: string | null
          joined_at: string
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: Database["public"]["Enums"]["workspace_role"]
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      evidence_items: {
        Row: {
          id: string
          workspace_id: string
          category: Database["public"]["Enums"]["evidence_category"]
          title: string
          description: string | null
          file_path: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          document_date: string | null
          valid_from: string | null
          valid_until: string | null
          review_date: string | null
          status: Database["public"]["Enums"]["evidence_status"]
          last_reviewed_at: string | null
          last_reviewed_by: string | null
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          category: Database["public"]["Enums"]["evidence_category"]
          title: string
          description?: string | null
          file_path?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          document_date?: string | null
          valid_from?: string | null
          valid_until?: string | null
          review_date?: string | null
          status?: Database["public"]["Enums"]["evidence_status"]
          last_reviewed_at?: string | null
          last_reviewed_by?: string | null
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          category?: Database["public"]["Enums"]["evidence_category"]
          title?: string
          description?: string | null
          file_path?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          document_date?: string | null
          valid_from?: string | null
          valid_until?: string | null
          review_date?: string | null
          status?: Database["public"]["Enums"]["evidence_status"]
          last_reviewed_at?: string | null
          last_reviewed_by?: string | null
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      obligations: {
        Row: {
          id: string
          workspace_id: string
          title: string
          description: string | null
          category: Database["public"]["Enums"]["evidence_category"] | null
          frequency: Database["public"]["Enums"]["obligation_frequency"]
          due_date: string
          reminder_days: number
          is_recurring: boolean
          recurrence_end_date: string | null
          is_completed: boolean
          completed_at: string | null
          completed_by: string | null
          linked_evidence_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          description?: string | null
          category?: Database["public"]["Enums"]["evidence_category"] | null
          frequency: Database["public"]["Enums"]["obligation_frequency"]
          due_date: string
          reminder_days?: number
          is_recurring?: boolean
          recurrence_end_date?: string | null
          is_completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          linked_evidence_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          description?: string | null
          category?: Database["public"]["Enums"]["evidence_category"] | null
          frequency?: Database["public"]["Enums"]["obligation_frequency"]
          due_date?: string
          reminder_days?: number
          is_recurring?: boolean
          recurrence_end_date?: string | null
          is_completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          linked_evidence_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "obligations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      readiness_scores: {
        Row: {
          id: string
          workspace_id: string
          overall_score: number | null
          evidence_score: number | null
          freshness_score: number | null
          checklist_score: number | null
          obligations_score: number | null
          total_evidence_items: number
          current_evidence_items: number
          expiring_evidence_items: number
          expired_evidence_items: number
          total_obligations: number
          overdue_obligations: number
          upcoming_obligations: number
          total_checklist_items: number
          completed_checklist_items: number
          calculated_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          overall_score?: number | null
          evidence_score?: number | null
          freshness_score?: number | null
          checklist_score?: number | null
          obligations_score?: number | null
          total_evidence_items?: number
          current_evidence_items?: number
          expiring_evidence_items?: number
          expired_evidence_items?: number
          total_obligations?: number
          overdue_obligations?: number
          upcoming_obligations?: number
          total_checklist_items?: number
          completed_checklist_items?: number
          calculated_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          overall_score?: number | null
          evidence_score?: number | null
          freshness_score?: number | null
          checklist_score?: number | null
          obligations_score?: number | null
          total_evidence_items?: number
          current_evidence_items?: number
          expiring_evidence_items?: number
          expired_evidence_items?: number
          total_obligations?: number
          overdue_obligations?: number
          upcoming_obligations?: number
          total_checklist_items?: number
          completed_checklist_items?: number
          calculated_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "readiness_scores_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      answer_type: "yes_no" | "dropdown" | "number" | "text"
      app_role: "admin" | "sme"
      business_type:
        | "manufacturing"
        | "retail"
        | "services"
        | "technology"
        | "hospitality"
        | "construction"
        | "agriculture"
        | "other"
      score_category: "good" | "average" | "needs_improvement"
      workspace_role: "owner" | "manager" | "member" | "viewer"
      evidence_category:
        | "environmental_policy"
        | "energy_management"
        | "waste_management"
        | "supply_chain"
        | "transport_logistics"
        | "certifications"
        | "training_records"
        | "utility_bills"
        | "audit_reports"
        | "other"
      obligation_frequency: "one_time" | "monthly" | "quarterly" | "annually" | "biannually"
      evidence_status: "current" | "expiring_soon" | "expired" | "needs_review"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      answer_type: ["yes_no", "dropdown", "number", "text"],
      app_role: ["admin", "sme"],
      business_type: [
        "manufacturing",
        "retail",
        "services",
        "technology",
        "hospitality",
        "construction",
        "agriculture",
        "other",
      ],
      score_category: ["good", "average", "needs_improvement"],
      workspace_role: ["owner", "manager", "member", "viewer"],
      evidence_category: [
        "environmental_policy",
        "energy_management",
        "waste_management",
        "supply_chain",
        "transport_logistics",
        "certifications",
        "training_records",
        "utility_bills",
        "audit_reports",
        "other",
      ],
      obligation_frequency: ["one_time", "monthly", "quarterly", "annually", "biannually"],
      evidence_status: ["current", "expiring_soon", "expired", "needs_review"],
    },
  },
} as const

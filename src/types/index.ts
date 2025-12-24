/**
 * Central type definitions for Carbon Path
 * Keep all shared types here for consistency and maintainability
 */

// =============================================================================
// USER & AUTH TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    business_name?: string;
    business_type?: string;
    employees?: number;
    location?: string;
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  business_type: string | null;
  employees: number | null;
  location: string | null;
  postcode: string | null;
  current_workspace_id: string | null;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'user' | 'consultant' | 'admin';

// =============================================================================
// WORKSPACE TYPES
// =============================================================================

export interface Workspace {
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
  created_at: string;
  updated_at?: string;
}

export interface WorkspaceMember {
  id: string;
  user_id: string;
  workspace_id: string;
  role: 'owner' | 'manager' | 'member' | 'viewer';
  joined_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

// =============================================================================
// EVIDENCE TYPES
// =============================================================================

export interface EvidenceItem {
  id: string;
  workspace_id: string;
  category: EvidenceCategory;
  title: string;
  description: string | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  document_date: string | null;
  valid_until: string | null;
  status: EvidenceStatus;
  uploaded_by: string;
  created_at: string;
}

export type EvidenceCategory =
  | 'environmental_policy'
  | 'energy_management'
  | 'waste_management'
  | 'supply_chain'
  | 'transport_logistics'
  | 'certifications'
  | 'training_records'
  | 'utility_bills'
  | 'audit_reports'
  | 'other';

export type EvidenceStatus =
  | 'current'
  | 'expiring_soon'
  | 'expired'
  | 'needs_review';

export const EVIDENCE_CATEGORIES: { value: EvidenceCategory; label: string }[] = [
  { value: 'environmental_policy', label: 'Environmental Policy' },
  { value: 'energy_management', label: 'Energy Management' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'supply_chain', label: 'Supply Chain' },
  { value: 'transport_logistics', label: 'Transport & Logistics' },
  { value: 'certifications', label: 'Certifications' },
  { value: 'training_records', label: 'Training Records' },
  { value: 'utility_bills', label: 'Utility Bills' },
  { value: 'audit_reports', label: 'Audit Reports' },
  { value: 'other', label: 'Other' },
];

// =============================================================================
// OBLIGATION TYPES
// =============================================================================

export interface Obligation {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  category: string | null;
  frequency: ObligationFrequency;
  due_date: string;
  is_recurring: boolean;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  created_by: string;
  created_at: string;
}

export type ObligationFrequency =
  | 'one_time'
  | 'monthly'
  | 'quarterly'
  | 'biannually'
  | 'annually';

export const OBLIGATION_FREQUENCIES: { value: ObligationFrequency; label: string }[] = [
  { value: 'one_time', label: 'One Time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'biannually', label: 'Every 6 Months' },
  { value: 'annually', label: 'Annually' },
];

// =============================================================================
// READINESS SCORE TYPES
// =============================================================================

export interface ReadinessScore {
  workspace_id: string;
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

// =============================================================================
// GRANT & SUBSIDY TYPES
// =============================================================================

export interface Grant {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount_min: number | null;
  amount_max: number | null;
  deadline: string | null;
  eligibility: string[];
  sectors: string[];
  regions: string[];
  application_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Subsidy {
  id: string;
  name: string;
  provider: string;
  description: string;
  benefit_type: string;
  benefit_value: string | null;
  eligibility: string[];
  sectors: string[];
  regions: string[];
  application_url: string | null;
  is_active: boolean;
  created_at: string;
}

// =============================================================================
// CONSULTANT TYPES
// =============================================================================

export interface Consultant {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  specialty: string;
  region: string;
  bio: string | null;
  expertise_areas: ConsultantExpertise[];
  years_experience: number | null;
  fee_type: string | null;
  website: string | null;
  linkedin: string | null;
  status: ConsultantStatus;
  verified: boolean;
  created_at: string;
}

export type ConsultantExpertise =
  | 'carbon_reporting'
  | 'energy_audits'
  | 'grant_applications'
  | 'retrofit'
  | 'strategy'
  | 'tax_specialists';

export type ConsultantStatus = 'pending' | 'approved' | 'rejected';

export const CONSULTANT_EXPERTISE: { value: ConsultantExpertise; label: string }[] = [
  { value: 'carbon_reporting', label: 'Carbon Reporting & SECR' },
  { value: 'energy_audits', label: 'Energy Audits' },
  { value: 'grant_applications', label: 'Grant Applications' },
  { value: 'retrofit', label: 'Retrofit & Installation' },
  { value: 'strategy', label: 'Sustainability Strategy' },
  { value: 'tax_specialists', label: 'Tax Relief Specialists' },
];

// =============================================================================
// FORM TYPES
// =============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  businessName: string;
  subject: string;
  message: string;
}

export interface AssessmentFormData {
  sector: string;
  employees: string;
  hasPolicy: string;
  barriers: string[];
  currentActions: string[];
  interests: string[];
  timeline: string;
  contact: {
    email: string;
    name: string;
    company: string;
  };
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}

// =============================================================================
// INDUSTRY TYPES
// =============================================================================

export type Industry =
  | 'manufacturing'
  | 'retail'
  | 'services'
  | 'technology'
  | 'hospitality'
  | 'construction'
  | 'agriculture'
  | 'logistics'
  | 'healthcare'
  | 'other';

export const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'services', label: 'Professional Services' },
  { value: 'technology', label: 'Technology' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'construction', label: 'Construction' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'logistics', label: 'Logistics & Transport' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'other', label: 'Other' },
];

// =============================================================================
// UK REGIONS
// =============================================================================

export const UK_REGIONS = [
  'London',
  'South East',
  'South West',
  'East of England',
  'East Midlands',
  'West Midlands',
  'North West',
  'North East',
  'Yorkshire and the Humber',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'UK-wide',
] as const;

export type UKRegion = typeof UK_REGIONS[number];

// =============================================================================
// ACTIVITY FEED TYPES
// =============================================================================

export interface ActivityItem {
  id: string;
  workspace_id: string;
  user_id: string;
  user_name: string;
  action: ActivityAction;
  target_type: ActivityTargetType;
  target_id: string;
  target_title: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export type ActivityAction =
  | 'uploaded'
  | 'updated'
  | 'deleted'
  | 'completed'
  | 'assigned'
  | 'unassigned'
  | 'commented'
  | 'invited'
  | 'joined'
  | 'created';

export type ActivityTargetType =
  | 'evidence'
  | 'checklist'
  | 'obligation'
  | 'member'
  | 'workspace';

export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  uploaded: 'uploaded',
  updated: 'updated',
  deleted: 'deleted',
  completed: 'completed',
  assigned: 'assigned',
  unassigned: 'unassigned',
  commented: 'commented on',
  invited: 'invited',
  joined: 'joined',
  created: 'created',
};

// =============================================================================
// CHECKLIST TYPES
// =============================================================================

export interface ChecklistItem {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  category: ChecklistCategory;
  status: ChecklistStatus;
  assigned_to: string | null;
  assigned_by: string | null;
  due_date: string | null;
  completed_at: string | null;
  completed_by: string | null;
  order: number;
  is_required: boolean;
  help_text: string | null;
  help_link: string | null;
  created_at: string;
}

export type ChecklistCategory =
  | 'documents'
  | 'energy'
  | 'waste'
  | 'supply_chain'
  | 'training'
  | 'compliance'
  | 'reporting';

export type ChecklistStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export const CHECKLIST_CATEGORIES: { value: ChecklistCategory; label: string; description: string }[] = [
  { value: 'documents', label: 'Documentation', description: 'Policies and key documents' },
  { value: 'energy', label: 'Energy Management', description: 'Energy tracking and efficiency' },
  { value: 'waste', label: 'Waste Management', description: 'Waste reduction and recycling' },
  { value: 'supply_chain', label: 'Supply Chain', description: 'Supplier sustainability' },
  { value: 'training', label: 'Training', description: 'Staff awareness and training' },
  { value: 'compliance', label: 'Compliance', description: 'Regulatory requirements' },
  { value: 'reporting', label: 'Reporting', description: 'Data collection and reporting' },
];

// =============================================================================
// TASK ASSIGNMENT TYPES
// =============================================================================

export interface TaskAssignment {
  id: string;
  workspace_id: string;
  checklist_item_id: string;
  assigned_to: string;
  assigned_by: string;
  assigned_at: string;
  due_date: string | null;
  notes: string | null;
  status: 'pending' | 'completed';
  completed_at: string | null;
}

// =============================================================================
// GUIDANCE TYPES
// =============================================================================

export interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  action_label: string;
  action_link: string;
  priority: number;
  category: 'getting_started' | 'next_steps' | 'improvement';
  condition?: (score: ReadinessScore) => boolean;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  due_date: string;
  type: 'expiring_document' | 'upcoming_obligation' | 'overdue_task' | 'milestone';
  target_id: string;
  target_type: ActivityTargetType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

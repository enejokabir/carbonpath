// Comprehensive demo data for the demo@carbonpath.com account
// This creates a fully populated workspace to demonstrate all platform features

import { defaultChecklistItems } from './checklistItems';

export const DEMO_EMAIL = 'demo@carbonpath.com';

// Check if we should initialize demo data
export function shouldInitializeDemoData(email: string): boolean {
  return email.toLowerCase() === DEMO_EMAIL;
}

// Create all demo data for the showcase account
export function initializeDemoAccountData() {
  const workspaceId = 'demo-showcase-workspace';
  const now = new Date();

  // Helper for dates
  const daysAgo = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };

  const daysFromNow = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // 1. Create Workspace
  const workspace = {
    id: workspaceId,
    name: 'GreenTech Manufacturing Ltd',
    slug: 'greentech-manufacturing',
    industry: 'manufacturing',
    employee_count: 85,
    location: 'Manchester',
    postcode: 'M1 4BT',
    website: 'https://greentechmfg.co.uk',
    description: 'Sustainable manufacturing solutions for a greener future',
    onboarding_completed: true,
    onboarding_step: 3,
    created_at: daysAgo(180),
  };

  // 2. Create Team Members
  const members = [
    {
      id: 'member-1',
      workspace_id: workspaceId,
      user_id: 'demo-user-1',
      role: 'owner',
      joined_at: daysAgo(180),
      profiles: {
        email: 'demo@carbonpath.com',
        full_name: 'Sarah Mitchell',
      },
    },
    {
      id: 'member-2',
      workspace_id: workspaceId,
      user_id: 'demo-user-2',
      role: 'manager',
      joined_at: daysAgo(150),
      profiles: {
        email: 'james.wong@greentechmfg.co.uk',
        full_name: 'James Wong',
      },
    },
    {
      id: 'member-3',
      workspace_id: workspaceId,
      user_id: 'demo-user-3',
      role: 'member',
      joined_at: daysAgo(120),
      profiles: {
        email: 'emily.chen@greentechmfg.co.uk',
        full_name: 'Emily Chen',
      },
    },
    {
      id: 'member-4',
      workspace_id: workspaceId,
      user_id: 'demo-user-4',
      role: 'member',
      joined_at: daysAgo(90),
      profiles: {
        email: 'marcus.johnson@greentechmfg.co.uk',
        full_name: 'Marcus Johnson',
      },
    },
    {
      id: 'member-5',
      workspace_id: workspaceId,
      user_id: 'demo-user-5',
      role: 'viewer',
      joined_at: daysAgo(30),
      profiles: {
        email: 'board@greentechmfg.co.uk',
        full_name: 'Board Review Account',
      },
    },
  ];

  // 3. Create Evidence Items
  const evidenceItems = [
    {
      id: 'evidence-1',
      workspace_id: workspaceId,
      category: 'environmental_policy',
      title: 'Environmental Policy Statement 2024',
      description: 'Company-wide environmental policy signed by CEO, outlining commitment to net zero by 2035',
      file_name: 'Environmental_Policy_2024.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(60),
      valid_until: daysFromNow(305),
      status: 'current',
      created_at: daysAgo(60),
    },
    {
      id: 'evidence-2',
      workspace_id: workspaceId,
      category: 'certifications',
      title: 'ISO 14001:2015 Certificate',
      description: 'Environmental Management System certification from BSI',
      file_name: 'ISO_14001_Certificate.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(90),
      valid_until: daysFromNow(275),
      status: 'current',
      created_at: daysAgo(90),
    },
    {
      id: 'evidence-3',
      workspace_id: workspaceId,
      category: 'energy_management',
      title: 'Electricity Bills Q1-Q4 2024',
      description: 'Consolidated electricity consumption records for all sites',
      file_name: 'Electricity_Bills_2024.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      document_date: daysAgo(30),
      valid_until: null,
      status: 'current',
      created_at: daysAgo(30),
    },
    {
      id: 'evidence-4',
      workspace_id: workspaceId,
      category: 'energy_management',
      title: 'Gas Bills Q1-Q4 2024',
      description: 'Natural gas consumption for heating and processes',
      file_name: 'Gas_Bills_2024.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      document_date: daysAgo(30),
      valid_until: null,
      status: 'current',
      created_at: daysAgo(30),
    },
    {
      id: 'evidence-5',
      workspace_id: workspaceId,
      category: 'waste_management',
      title: 'Waste Transfer Notes 2024',
      description: 'All waste transfer documentation for general and hazardous waste',
      file_name: 'WTN_2024_Bundle.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(15),
      valid_until: null,
      status: 'current',
      created_at: daysAgo(15),
    },
    {
      id: 'evidence-6',
      workspace_id: workspaceId,
      category: 'audit_reports',
      title: 'Carbon Footprint Report 2023',
      description: 'Third-party verified Scope 1 & 2 emissions report',
      file_name: 'Carbon_Footprint_2023.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(120),
      valid_until: daysFromNow(60),
      status: 'expiring_soon',
      created_at: daysAgo(120),
    },
    {
      id: 'evidence-7',
      workspace_id: workspaceId,
      category: 'training_records',
      title: 'Environmental Awareness Training Records',
      description: 'Staff training completion records for sustainability awareness program',
      file_name: 'Training_Records_Q4_2024.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      document_date: daysAgo(20),
      valid_until: null,
      status: 'current',
      created_at: daysAgo(20),
    },
    {
      id: 'evidence-8',
      workspace_id: workspaceId,
      category: 'supply_chain',
      title: 'Supplier Sustainability Assessment Results',
      description: 'Environmental survey responses from top 20 suppliers',
      file_name: 'Supplier_Assessment_2024.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(45),
      valid_until: null,
      status: 'current',
      created_at: daysAgo(45),
    },
    {
      id: 'evidence-9',
      workspace_id: workspaceId,
      category: 'certifications',
      title: 'EPC Certificate - Main Factory',
      description: 'Energy Performance Certificate rating B for main manufacturing facility',
      file_name: 'EPC_MainFactory.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(200),
      valid_until: daysFromNow(165),
      status: 'current',
      created_at: daysAgo(200),
    },
    {
      id: 'evidence-10',
      workspace_id: workspaceId,
      category: 'transport_logistics',
      title: 'Fleet Fuel Consumption Report 2024',
      description: 'Monthly fuel usage and mileage data for company vehicles',
      file_name: 'Fleet_Report_2024.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      document_date: daysAgo(7),
      valid_until: null,
      status: 'current',
      created_at: daysAgo(7),
    },
    {
      id: 'evidence-11',
      workspace_id: workspaceId,
      category: 'audit_reports',
      title: 'SECR Energy Report 2023',
      description: 'Streamlined Energy & Carbon Reporting submission',
      file_name: 'SECR_Report_2023.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(180),
      valid_until: null,
      status: 'current',
      created_at: daysAgo(180),
    },
    {
      id: 'evidence-12',
      workspace_id: workspaceId,
      category: 'waste_management',
      title: 'Recycling Contract Agreement',
      description: 'Agreement with licensed recycling contractor',
      file_name: 'Recycling_Contract_2024.pdf',
      file_type: 'application/pdf',
      document_date: daysAgo(300),
      valid_until: daysFromNow(65),
      status: 'current',
      created_at: daysAgo(300),
    },
  ];

  // 4. Create Obligations
  const obligations = [
    {
      id: 'obligation-1',
      workspace_id: workspaceId,
      title: 'Annual SECR Report Submission',
      description: 'Submit Streamlined Energy & Carbon Report with annual accounts',
      category: 'audit_reports',
      frequency: 'annually',
      due_date: daysFromNow(90),
      is_recurring: true,
      is_completed: false,
      completed_at: null,
    },
    {
      id: 'obligation-2',
      workspace_id: workspaceId,
      title: 'ISO 14001 Surveillance Audit',
      description: 'Annual surveillance audit by BSI to maintain certification',
      category: 'certifications',
      frequency: 'annually',
      due_date: daysFromNow(60),
      is_recurring: true,
      is_completed: false,
      completed_at: null,
    },
    {
      id: 'obligation-3',
      workspace_id: workspaceId,
      title: 'Quarterly Energy Review',
      description: 'Review energy consumption and progress against targets',
      category: 'energy_management',
      frequency: 'quarterly',
      due_date: daysFromNow(30),
      is_recurring: true,
      is_completed: false,
      completed_at: null,
    },
    {
      id: 'obligation-4',
      workspace_id: workspaceId,
      title: 'Hazardous Waste Return',
      description: 'Submit annual hazardous waste return to Environment Agency',
      category: 'waste_management',
      frequency: 'annually',
      due_date: daysFromNow(120),
      is_recurring: true,
      is_completed: false,
      completed_at: null,
    },
    {
      id: 'obligation-5',
      workspace_id: workspaceId,
      title: 'Supplier Sustainability Survey',
      description: 'Annual sustainability assessment of key suppliers',
      category: 'other',
      frequency: 'annually',
      due_date: daysFromNow(180),
      is_recurring: true,
      is_completed: false,
      completed_at: null,
    },
    {
      id: 'obligation-6',
      workspace_id: workspaceId,
      title: 'Staff Environmental Training',
      description: 'Quarterly environmental awareness training session',
      category: 'training_records',
      frequency: 'quarterly',
      due_date: daysAgo(5).split('T')[0],
      is_recurring: true,
      is_completed: true,
      completed_at: daysAgo(7),
    },
    {
      id: 'obligation-7',
      workspace_id: workspaceId,
      title: 'Carbon Footprint Calculation',
      description: 'Calculate and verify annual carbon footprint',
      category: 'audit_reports',
      frequency: 'annually',
      due_date: daysFromNow(45),
      is_recurring: true,
      is_completed: false,
      completed_at: null,
    },
    {
      id: 'obligation-8',
      workspace_id: workspaceId,
      title: 'EPC Renewal Assessment',
      description: 'Review EPC ratings and plan for 2027 requirements',
      category: 'certifications',
      frequency: 'one_time',
      due_date: daysFromNow(200),
      is_recurring: false,
      is_completed: false,
      completed_at: null,
    },
  ];

  // 5. Create Checklist Items (all completed for demo)
  const checklistItems = defaultChecklistItems.map((item, index) => ({
    id: `checklist-${index + 1}`,
    workspace_id: workspaceId,
    title: item.title,
    description: item.description,
    category: item.category,
    status: 'completed' as const,
    assigned_to: members[index % 4].user_id,
    due_date: null,
    order: item.order,
    is_required: item.is_required,
    help_text: item.help_text,
    help_link: item.help_link || null,
    created_at: daysAgo(180 - index * 5),
    completed_at: daysAgo(170 - index * 5),
  }));

  // 6. Create Activity Feed
  const activities = [
    {
      id: 'activity-1',
      workspace_id: workspaceId,
      user_id: 'demo-user-1',
      user_name: 'Sarah Mitchell',
      action: 'uploaded' as const,
      target_type: 'evidence' as const,
      target_id: 'evidence-10',
      target_title: 'Fleet Fuel Consumption Report 2024',
      created_at: daysAgo(7),
    },
    {
      id: 'activity-2',
      workspace_id: workspaceId,
      user_id: 'demo-user-3',
      user_name: 'Emily Chen',
      action: 'completed' as const,
      target_type: 'obligation' as const,
      target_id: 'obligation-6',
      target_title: 'Staff Environmental Training',
      created_at: daysAgo(7),
    },
    {
      id: 'activity-3',
      workspace_id: workspaceId,
      user_id: 'demo-user-2',
      user_name: 'James Wong',
      action: 'uploaded' as const,
      target_type: 'evidence' as const,
      target_id: 'evidence-5',
      target_title: 'Waste Transfer Notes 2024',
      created_at: daysAgo(15),
    },
    {
      id: 'activity-4',
      workspace_id: workspaceId,
      user_id: 'demo-user-4',
      user_name: 'Marcus Johnson',
      action: 'completed' as const,
      target_type: 'checklist' as const,
      target_id: 'checklist-17',
      target_title: 'Set up data collection routine',
      created_at: daysAgo(20),
    },
    {
      id: 'activity-5',
      workspace_id: workspaceId,
      user_id: 'demo-user-1',
      user_name: 'Sarah Mitchell',
      action: 'invited' as const,
      target_type: 'member' as const,
      target_id: 'member-5',
      target_title: 'Board Review Account',
      created_at: daysAgo(30),
    },
    {
      id: 'activity-6',
      workspace_id: workspaceId,
      user_id: 'demo-user-3',
      user_name: 'Emily Chen',
      action: 'uploaded' as const,
      target_type: 'evidence' as const,
      target_id: 'evidence-7',
      target_title: 'Environmental Awareness Training Records',
      created_at: daysAgo(20),
    },
    {
      id: 'activity-7',
      workspace_id: workspaceId,
      user_id: 'demo-user-2',
      user_name: 'James Wong',
      action: 'updated' as const,
      target_type: 'evidence' as const,
      target_id: 'evidence-3',
      target_title: 'Electricity Bills Q1-Q4 2024',
      created_at: daysAgo(30),
    },
    {
      id: 'activity-8',
      workspace_id: workspaceId,
      user_id: 'demo-user-1',
      user_name: 'Sarah Mitchell',
      action: 'uploaded' as const,
      target_type: 'evidence' as const,
      target_id: 'evidence-8',
      target_title: 'Supplier Sustainability Assessment Results',
      created_at: daysAgo(45),
    },
  ];

  // 7. Create Engaged Consultants
  const engagedConsultants = [
    {
      id: 'engagement-1',
      consultant_id: 'consultant-1',
      consultant_name: 'Dr. Helen Greenwood',
      consultant_company: 'Sustainable Solutions UK',
      specialization: 'ISO 14001 Implementation',
      status: 'completed',
      started_at: daysAgo(150),
      completed_at: daysAgo(90),
      notes: 'Successfully implemented ISO 14001 EMS. Excellent support throughout the certification process.',
      rating: 5,
    },
    {
      id: 'engagement-2',
      consultant_id: 'consultant-2',
      consultant_name: 'Michael Foster',
      consultant_company: 'Carbon Advisory Group',
      specialization: 'Carbon Footprint Assessment',
      status: 'active',
      started_at: daysAgo(30),
      completed_at: null,
      notes: 'Currently conducting Scope 3 emissions analysis for supply chain.',
      rating: null,
    },
    {
      id: 'engagement-3',
      consultant_id: 'consultant-3',
      consultant_name: 'Sarah Thompson',
      consultant_company: 'GreenGrant Advisors',
      specialization: 'Grant Applications',
      status: 'completed',
      started_at: daysAgo(120),
      completed_at: daysAgo(80),
      notes: 'Helped secure £45,000 Industrial Energy Transformation Fund grant for LED lighting upgrade.',
      rating: 5,
    },
  ];

  // 8. Create Readiness Score (high score for demo)
  const readinessScore = {
    workspace_id: workspaceId,
    overall_score: 92,
    evidence_score: 95,
    freshness_score: 88,
    checklist_score: 100,
    obligations_score: 85,
    total_evidence_items: evidenceItems.length,
    current_evidence_items: evidenceItems.filter(e => e.status === 'current').length,
    expiring_evidence_items: evidenceItems.filter(e => e.status === 'expiring_soon').length,
    expired_evidence_items: 0,
    total_obligations: obligations.length,
    overdue_obligations: 0,
    upcoming_obligations: obligations.filter(o => !o.is_completed).length,
    total_checklist_items: checklistItems.length,
    completed_checklist_items: checklistItems.filter(c => c.status === 'completed').length,
    calculated_at: now.toISOString(),
  };

  // Save all data to localStorage
  localStorage.setItem('demo_workspace', JSON.stringify(workspace));
  localStorage.setItem('demo_workspace_members', JSON.stringify(members));
  localStorage.setItem('demo_evidence_items', JSON.stringify(evidenceItems));
  localStorage.setItem('demo_obligations', JSON.stringify(obligations));
  localStorage.setItem('demo_checklist_items', JSON.stringify(checklistItems));
  localStorage.setItem('demo_activities', JSON.stringify(activities));
  localStorage.setItem('demo_engaged_consultants', JSON.stringify(engagedConsultants));
  localStorage.setItem('demo_readiness_score', JSON.stringify(readinessScore));

  return {
    workspace,
    members,
    evidenceItems,
    obligations,
    checklistItems,
    activities,
    engagedConsultants,
    readinessScore,
  };
}

// Initialize checklist for regular users who don't have one
export function initializeUserChecklist(workspaceId: string, industry: string) {
  const existingChecklist = localStorage.getItem('demo_checklist_items');
  if (existingChecklist) {
    const items = JSON.parse(existingChecklist);
    if (items.length > 0) return items;
  }

  const checklistItems = defaultChecklistItems.map((item, index) => ({
    id: `checklist-${workspaceId}-${index + 1}`,
    workspace_id: workspaceId,
    title: item.title,
    description: item.description,
    category: item.category,
    status: 'pending' as const,
    assigned_to: null,
    due_date: null,
    order: item.order,
    is_required: item.is_required,
    help_text: item.help_text,
    help_link: item.help_link || null,
    created_at: new Date().toISOString(),
    completed_at: null,
  }));

  localStorage.setItem('demo_checklist_items', JSON.stringify(checklistItems));

  // Update readiness score
  const scoreData = localStorage.getItem('demo_readiness_score');
  if (scoreData) {
    const score = JSON.parse(scoreData);
    score.total_checklist_items = checklistItems.length;
    score.completed_checklist_items = 0;
    score.checklist_score = 0;
    localStorage.setItem('demo_readiness_score', JSON.stringify(score));
  }

  return checklistItems;
}

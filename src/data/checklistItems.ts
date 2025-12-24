import type { ChecklistCategory, ChecklistItem } from '@/types';

// Default checklist items for new workspaces
// These provide guidance on sustainability compliance readiness

export interface ChecklistTemplate {
  title: string;
  description: string;
  category: ChecklistCategory;
  is_required: boolean;
  help_text: string;
  help_link?: string;
  order: number;
}

export const defaultChecklistItems: ChecklistTemplate[] = [
  // Documentation
  {
    title: 'Create Environmental Policy',
    description: 'Write a statement outlining your environmental commitment and objectives',
    category: 'documents',
    is_required: true,
    help_text: 'Your environmental policy should state your commitment to reducing environmental impact, comply with regulations, and continually improve. Keep it concise (1-2 pages) and get it signed by senior management.',
    help_link: '/learn/what-is-sustainability-compliance',
    order: 1,
  },
  {
    title: 'Document current sustainability actions',
    description: 'List what you already do to reduce environmental impact',
    category: 'documents',
    is_required: false,
    help_text: 'You may already be doing more than you think - recycling, energy-efficient equipment, remote working policies. Documenting these is the first step to building your evidence base.',
    order: 2,
  },
  {
    title: 'Gather company registration documents',
    description: 'Have your company information ready for grant applications',
    category: 'documents',
    is_required: false,
    help_text: 'Grant applications typically require: company registration number, VAT number, latest accounts, and proof of address.',
    order: 3,
  },

  // Energy Management
  {
    title: 'Collect 12 months of utility bills',
    description: 'Gather electricity and gas bills for baseline measurement',
    category: 'energy',
    is_required: true,
    help_text: 'Utility bills are essential for understanding your energy footprint. If you have smart meters, export the data. Otherwise, gather paper or PDF bills from your energy supplier.',
    help_link: '/learn/evidence-locker-explained',
    order: 4,
  },
  {
    title: 'Identify your biggest energy uses',
    description: 'List the main energy-consuming activities in your business',
    category: 'energy',
    is_required: false,
    help_text: 'Common energy uses include: heating/cooling, lighting, computers and servers, manufacturing equipment, refrigeration, and transport. Understanding where energy goes helps prioritise improvements.',
    order: 5,
  },
  {
    title: 'Check for quick energy wins',
    description: 'Identify easy improvements like LED lighting or smart controls',
    category: 'energy',
    is_required: false,
    help_text: 'Quick wins often include: switching to LED lighting (50%+ savings), installing smart thermostats, turning equipment off when not in use, and draught-proofing.',
    order: 6,
  },

  // Waste Management
  {
    title: 'Collect waste transfer notes',
    description: 'Gather documentation for waste disposal (required by law)',
    category: 'waste',
    is_required: true,
    help_text: 'By law, you must keep waste transfer notes for at least 2 years (3 years for hazardous waste). These show you have a duty of care for your waste.',
    order: 7,
  },
  {
    title: 'Document recycling arrangements',
    description: 'Record what you recycle and your waste contractor details',
    category: 'waste',
    is_required: false,
    help_text: 'Note what materials you recycle, who collects them, and approximately how much. This helps demonstrate waste reduction efforts.',
    order: 8,
  },
  {
    title: 'Check hazardous waste compliance',
    description: 'If applicable, ensure hazardous waste is properly managed',
    category: 'waste',
    is_required: false,
    help_text: 'Hazardous waste includes: chemicals, batteries, fluorescent tubes, and some electrical equipment. These require special disposal and consignment notes.',
    order: 9,
  },

  // Supply Chain
  {
    title: 'List key suppliers',
    description: 'Identify your most significant suppliers for sustainability assessment',
    category: 'supply_chain',
    is_required: false,
    help_text: 'Focus on your top 10-20 suppliers by spend. You may need to ask them about their sustainability practices to answer customer questionnaires.',
    order: 10,
  },
  {
    title: 'Gather supplier sustainability info',
    description: 'Request environmental policies or certifications from key suppliers',
    category: 'supply_chain',
    is_required: false,
    help_text: 'Ask suppliers if they have: environmental policies, ISO 14001 certification, or carbon reduction targets. This information may be needed for your own reporting.',
    order: 11,
  },

  // Training
  {
    title: 'Plan staff environmental awareness',
    description: 'Consider how to engage staff in sustainability efforts',
    category: 'training',
    is_required: false,
    help_text: 'Staff engagement can be as simple as a team meeting or notice board updates. Appointing environmental champions can help drive grassroots improvements.',
    order: 12,
  },
  {
    title: 'Document any environmental training',
    description: 'Record training provided to staff on environmental topics',
    category: 'training',
    is_required: false,
    help_text: 'Even informal training counts. Record dates, topics, and attendees. This demonstrates commitment to continuous improvement.',
    order: 13,
  },

  // Compliance
  {
    title: 'Check regulatory requirements',
    description: 'Understand which environmental regulations apply to your business',
    category: 'compliance',
    is_required: true,
    help_text: 'Requirements depend on your size and sector. Most SMEs need to comply with waste duty of care. Larger businesses may need SECR or ESOS compliance.',
    help_link: '/learn/uk-sustainability-regulations',
    order: 14,
  },
  {
    title: 'Review EPC ratings (if applicable)',
    description: 'Check Energy Performance Certificates for your premises',
    category: 'compliance',
    is_required: false,
    help_text: 'If you own or lease commercial property, you need a valid EPC. Minimum standards are tightening - currently E, with C expected by 2027-28.',
    order: 15,
  },

  // Reporting
  {
    title: 'Prepare for customer questionnaires',
    description: 'Have key sustainability information ready to respond to requests',
    category: 'reporting',
    is_required: false,
    help_text: 'Large customers increasingly send sustainability questionnaires. Having your evidence locker organised makes responding quick and complete.',
    order: 16,
  },
  {
    title: 'Set up data collection routine',
    description: 'Establish a regular process for gathering environmental data',
    category: 'reporting',
    is_required: false,
    help_text: 'Set a monthly reminder to collect utility bills and update your records. Consistent data makes reporting easier and more accurate.',
    order: 17,
  },
];

// Get checklist items for a specific industry with customisation
export function getChecklistForIndustry(industry: string): ChecklistTemplate[] {
  // Start with default items
  const items = [...defaultChecklistItems];

  // Add industry-specific items
  const industryItems = industrySpecificItems[industry.toLowerCase()] || [];

  return [...items, ...industryItems].sort((a, b) => a.order - b.order);
}

// Industry-specific additional checklist items
const industrySpecificItems: Record<string, ChecklistTemplate[]> = {
  manufacturing: [
    {
      title: 'Document production energy use',
      description: 'Track energy consumption of manufacturing equipment',
      category: 'energy',
      is_required: false,
      help_text: 'Understanding energy use per product or process helps identify efficiency opportunities and is often requested by customers.',
      order: 20,
    },
    {
      title: 'Review process waste streams',
      description: 'Identify waste generated by manufacturing processes',
      category: 'waste',
      is_required: false,
      help_text: 'Manufacturing waste may have value as recycled material or energy recovery. Mapping waste streams can reveal cost savings.',
      order: 21,
    },
  ],
  retail: [
    {
      title: 'Assess refrigeration efficiency',
      description: 'Review refrigeration equipment and consider upgrades',
      category: 'energy',
      is_required: false,
      help_text: 'Refrigeration can account for 40-60% of retail energy use. Door covers, regular maintenance, and modern units can significantly reduce costs.',
      order: 20,
    },
    {
      title: 'Review packaging practices',
      description: 'Assess packaging materials and reduction opportunities',
      category: 'waste',
      is_required: false,
      help_text: 'Extended Producer Responsibility is increasing packaging costs. Reducing packaging saves money and appeals to customers.',
      order: 21,
    },
  ],
  logistics: [
    {
      title: 'Document fleet fuel consumption',
      description: 'Track fuel use by vehicle for emissions reporting',
      category: 'energy',
      is_required: true,
      help_text: 'Fleet fuel is typically the largest carbon source for logistics. Recording mileage and fuel use by vehicle enables efficiency tracking.',
      order: 20,
    },
    {
      title: 'Assess route efficiency',
      description: 'Review delivery routes for optimisation opportunities',
      category: 'energy',
      is_required: false,
      help_text: 'Route optimisation can reduce fuel use by 10-20%. Consider telematics, route planning software, or driver training.',
      order: 21,
    },
    {
      title: 'Plan EV transition',
      description: 'Assess opportunities to electrify your fleet',
      category: 'compliance',
      is_required: false,
      help_text: 'Electric vehicles are becoming cost-effective for many applications. Clean Air Zones are expanding, making EVs increasingly necessary.',
      order: 22,
    },
  ],
  hospitality: [
    {
      title: 'Track food waste',
      description: 'Measure and monitor food waste to identify reduction opportunities',
      category: 'waste',
      is_required: false,
      help_text: 'Food waste costs the hospitality sector billions annually. Tracking it is the first step to reduction.',
      order: 20,
    },
    {
      title: 'Review kitchen equipment efficiency',
      description: 'Assess commercial kitchen equipment for energy efficiency',
      category: 'energy',
      is_required: false,
      help_text: 'Commercial kitchens use significant energy. Equipment upgrades, induction hobs, and smart controls can deliver major savings.',
      order: 21,
    },
  ],
};

// Helper to create checklist items for a new workspace
export function createWorkspaceChecklist(
  workspaceId: string,
  industry: string
): Omit<ChecklistItem, 'id' | 'created_at'>[] {
  const templates = getChecklistForIndustry(industry);

  return templates.map((template) => ({
    workspace_id: workspaceId,
    title: template.title,
    description: template.description,
    category: template.category,
    status: 'pending' as const,
    assigned_to: null,
    assigned_by: null,
    due_date: null,
    completed_at: null,
    completed_by: null,
    order: template.order,
    is_required: template.is_required,
    help_text: template.help_text,
    help_link: template.help_link || null,
  }));
}

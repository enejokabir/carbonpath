// Matching Service
// Matches grants, subsidies, and consultants to user profiles

import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Grant = Database['public']['Tables']['grants']['Row'];

// Extended Grant type with additional fields from our migration
export interface ExtendedGrant extends Grant {
  amount_description?: string | null;
  grant_type?: string | null;
  sectors?: string[] | null;
  deadline?: string | null;
  whats_covered?: string[] | null;
  is_active?: boolean;
}

export interface Subsidy {
  id: string;
  name: string;
  description: string;
  subsidy_type: 'tax_relief' | 'rate_reduction' | 'loan' | 'voucher' | 'rebate' | 'other';
  eligibility_text: string;
  business_types: string[];
  location_scope: string[];
  min_employees?: number | null;
  max_employees?: number | null;
  value_description?: string | null;
  application_link?: string | null;
  deadline?: string | null;
  is_active: boolean;
}

export interface Consultant {
  id: string;
  name: string;
  specialty: string;
  region: string;
  contact_email: string;
  contact_phone?: string | null;
  bio?: string | null;
  expertise_areas: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verified: boolean;
  fee_type?: string | null;
  years_experience?: number | null;
}

export interface MatchedGrant extends ExtendedGrant {
  matchScore: number;
  matchReasons: string[];
}

export interface MatchedSubsidy extends Subsidy {
  matchScore: number;
  matchReasons: string[];
}

export interface MatchedConsultant extends Consultant {
  matchScore: number;
  matchReasons: string[];
}

/**
 * Calculate match score for a grant based on user profile
 */
export function matchGrantToProfile(
  grant: ExtendedGrant,
  profile: Profile | null,
  userLocation?: string
): MatchedGrant {
  const matchReasons: string[] = [];
  let matchScore = 50; // Base score

  if (!profile) {
    return { ...grant, matchScore, matchReasons: ['Sign in to see personalized match scores'] };
  }

  // Business type match
  if (grant.business_types && grant.business_types.length > 0) {
    if (grant.business_types.includes(profile.business_type)) {
      matchScore += 25;
      matchReasons.push(`Matches your industry: ${profile.business_type}`);
    } else {
      matchScore -= 10;
    }
  } else {
    matchScore += 10; // Open to all business types
    matchReasons.push('Open to all business types');
  }

  // Location match
  const location = userLocation || profile.location || '';
  if (grant.location_scope && grant.location_scope.length > 0) {
    const locationMatch = grant.location_scope.some(scope => {
      const scopeLower = scope.toLowerCase();
      const locationLower = location.toLowerCase();
      return (
        scopeLower === 'uk-wide' ||
        scopeLower.includes('uk') ||
        locationLower.includes(scopeLower) ||
        scopeLower.includes(locationLower)
      );
    });

    if (locationMatch) {
      matchScore += 20;
      matchReasons.push('Available in your region');
    } else {
      matchScore -= 15;
      matchReasons.push('May not be available in your region');
    }
  }

  // Employee count match (if grant has employee requirements)
  if (profile.employees) {
    // Most grants target SMEs (< 250 employees)
    if (profile.employees < 250) {
      matchScore += 5;
    }
  }

  // Ensure score is within bounds
  matchScore = Math.max(0, Math.min(100, matchScore));

  return {
    ...grant,
    matchScore,
    matchReasons,
  };
}

/**
 * Match all grants to a user profile and sort by relevance
 */
export function matchGrantsToProfile(
  grants: ExtendedGrant[],
  profile: Profile | null,
  userLocation?: string
): MatchedGrant[] {
  const matched = grants.map(grant => matchGrantToProfile(grant, profile, userLocation));
  return matched.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Calculate match score for a subsidy based on user profile
 */
export function matchSubsidyToProfile(
  subsidy: Subsidy,
  profile: Profile | null,
  employeeCount?: number
): MatchedSubsidy {
  const matchReasons: string[] = [];
  let matchScore = 50;

  if (!profile) {
    return { ...subsidy, matchScore, matchReasons: ['Sign in to see personalized match scores'] };
  }

  // Business type match
  if (subsidy.business_types && subsidy.business_types.length > 0) {
    if (subsidy.business_types.includes(profile.business_type)) {
      matchScore += 25;
      matchReasons.push(`Available for ${profile.business_type} businesses`);
    }
  } else {
    matchScore += 15;
    matchReasons.push('Available for all business types');
  }

  // Location match
  const location = profile.location || '';
  if (subsidy.location_scope && subsidy.location_scope.length > 0) {
    const locationMatch = subsidy.location_scope.some(scope => {
      const scopeLower = scope.toLowerCase();
      return (
        scopeLower === 'uk-wide' ||
        scopeLower.includes('uk') ||
        location.toLowerCase().includes(scopeLower)
      );
    });

    if (locationMatch) {
      matchScore += 15;
      matchReasons.push('Available in your location');
    }
  }

  // Employee count match
  const employees = employeeCount || profile.employees || 0;
  if (subsidy.min_employees && employees < subsidy.min_employees) {
    matchScore -= 20;
    matchReasons.push(`Requires minimum ${subsidy.min_employees} employees`);
  }
  if (subsidy.max_employees && employees > subsidy.max_employees) {
    matchScore -= 20;
    matchReasons.push(`Maximum ${subsidy.max_employees} employees`);
  }

  // Tax relief type bonus for certain business types
  if (subsidy.subsidy_type === 'tax_relief') {
    matchReasons.push('Tax relief - consult your accountant');
  }

  matchScore = Math.max(0, Math.min(100, matchScore));

  return {
    ...subsidy,
    matchScore,
    matchReasons,
  };
}

/**
 * Match all subsidies to a user profile and sort by relevance
 */
export function matchSubsidiesToProfile(
  subsidies: Subsidy[],
  profile: Profile | null,
  employeeCount?: number
): MatchedSubsidy[] {
  const matched = subsidies.map(subsidy => matchSubsidyToProfile(subsidy, profile, employeeCount));
  return matched.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Match consultant to user needs
 */
export function matchConsultantToNeeds(
  consultant: Consultant,
  userNeeds: string[],
  userLocation?: string
): MatchedConsultant {
  const matchReasons: string[] = [];
  let matchScore = 50;

  // Expertise match
  const expertiseMatch = consultant.expertise_areas.filter(area =>
    userNeeds.some(need => area.toLowerCase().includes(need.toLowerCase()) || need.toLowerCase().includes(area.toLowerCase()))
  );

  if (expertiseMatch.length > 0) {
    matchScore += expertiseMatch.length * 15;
    matchReasons.push(`Expertise in: ${expertiseMatch.join(', ')}`);
  }

  // Location match
  if (userLocation) {
    const regionLower = consultant.region.toLowerCase();
    const locationLower = userLocation.toLowerCase();

    if (
      regionLower.includes('uk-wide') ||
      regionLower.includes('remote') ||
      regionLower.includes(locationLower) ||
      locationLower.includes(regionLower.replace(' (remote)', ''))
    ) {
      matchScore += 10;
      matchReasons.push('Serves your area');
    }
  }

  // Verified bonus
  if (consultant.verified) {
    matchScore += 10;
    matchReasons.push('Verified consultant');
  }

  // Experience bonus
  if (consultant.years_experience && consultant.years_experience >= 5) {
    matchScore += 5;
    matchReasons.push(`${consultant.years_experience}+ years experience`);
  }

  matchScore = Math.max(0, Math.min(100, matchScore));

  return {
    ...consultant,
    matchScore,
    matchReasons,
  };
}

/**
 * Match consultants to user needs and sort by relevance
 */
export function matchConsultantsToNeeds(
  consultants: Consultant[],
  userNeeds: string[],
  userLocation?: string
): MatchedConsultant[] {
  const matched = consultants.map(consultant =>
    matchConsultantToNeeds(consultant, userNeeds, userLocation)
  );
  return matched.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Get recommended consultant types based on assessment data
 */
export function getRecommendedConsultantTypes(assessmentData: {
  selectedBarriers?: string[];
  selectedConsultants?: string[];
  grantAwareness?: string;
  taxInterest?: string;
}): string[] {
  const recommendations: string[] = [];

  // Based on barriers
  if (assessmentData.selectedBarriers?.includes('grant_awareness')) {
    recommendations.push('Grant Applications');
  }
  if (assessmentData.selectedBarriers?.includes('technical_knowledge')) {
    recommendations.push('Energy Audits', 'Carbon Reporting');
  }
  if (assessmentData.selectedBarriers?.includes('cost_funding')) {
    recommendations.push('Grant Applications');
  }

  // Based on explicit consultant selections
  if (assessmentData.selectedConsultants) {
    recommendations.push(...assessmentData.selectedConsultants);
  }

  // Tax interest
  if (assessmentData.taxInterest === 'yes') {
    recommendations.push('Tax Specialists');
  }

  // Grant awareness
  if (assessmentData.grantAwareness === 'not_aware' || assessmentData.grantAwareness === 'unsure') {
    recommendations.push('Grant Applications');
  }

  // Deduplicate
  return [...new Set(recommendations)];
}

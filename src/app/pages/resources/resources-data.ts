/**
 * Community resources for Orange County — public links and contact info.
 * External sites; verify URLs periodically.
 */

export type ResourceCategory = 'safety' | 'roads' | 'emergency' | 'social';

export interface CommunityResource {
  id: string;
  category: ResourceCategory;
  title: string;
  description: string;
  websiteUrl: string;
  /** Optional; shown with external-link style */
  phone?: string;
}

export const COMMUNITY_RESOURCES: CommunityResource[] = [
  {
    id: 'oc-crime-stoppers',
    category: 'safety',
    title: 'OC Crime Stoppers',
    description: 'Anonymous tip submission for reporting local crimes.',
    websiteUrl: 'https://occrimestoppers.org/',
    phone: '1-855-847-6227',
  },
  {
    id: 'oc-sheriff-nonemergency',
    category: 'safety',
    title: 'OC Sheriff Non-Emergency',
    description:
      'For reporting non-urgent police matters and neighborhood concerns.',
    websiteUrl: 'https://www.ocsheriff.gov/',
    phone: '(714) 647-7000',
  },
  {
    id: 'oc-public-works-oes',
    category: 'roads',
    title: 'OC Public Works (myOCeServices)',
    description: 'Report road damage, graffiti, and public right-of-way issues.',
    websiteUrl: 'https://www.ocgov.com/departments/public-works',
  },
  {
    id: 'oc-pw-file-report',
    category: 'roads',
    title: 'OC Public Works — File a Report',
    description: 'General county issue reporting hub for residents.',
    websiteUrl: 'https://www.ocgov.com/',
  },
  {
    id: 'caltrans-cust',
    category: 'roads',
    title: 'Caltrans Customer Service',
    description: 'Report freeway potholes, debris, and damaged signs.',
    websiteUrl: 'https://dot.ca.gov/contact-us',
    phone: '1-800-675-6357',
  },
  {
    id: 'caltrans-quickmap',
    category: 'roads',
    title: 'Caltrans QuickMap',
    description: 'Real-time freeway traffic and road conditions map.',
    websiteUrl: 'https://quickmap.dot.ca.gov/',
  },
  {
    id: 'ready-oc',
    category: 'emergency',
    title: 'ReadyOC',
    description: "Orange County's primary emergency preparedness hub.",
    websiteUrl: 'https://www.ReadyOC.org',
  },
  {
    id: 'ocfa',
    category: 'emergency',
    title: 'OC Fire Authority (OCFA)',
    description: 'Official fire authority information and non-emergency contacts.',
    websiteUrl: 'https://www.ocfa.org/',
  },
  {
    id: '211oc',
    category: 'social',
    title: '211 OC',
    description: 'Housing, food, financial aid, health, and crisis resources.',
    websiteUrl: 'https://www.211oc.org/',
    phone: 'Dial 2-1-1',
  },
  {
    id: 'oc-human-relations',
    category: 'safety',
    title: 'OC Human Relations',
    description:
      'Dedicated resources for reporting hate crimes and discrimination.',
    websiteUrl: 'https://oc-human.org/',
    phone: '(714) 480-6580',
  },
];

const CATEGORY_LABEL: Record<ResourceCategory, string> = {
  safety: 'SAFETY',
  roads: 'ROADS & INFRASTRUCTURE',
  emergency: 'EMERGENCY',
  social: 'SOCIAL SERVICES',
};

export function getCategoryLabel(c: ResourceCategory): string {
  return CATEGORY_LABEL[c];
}

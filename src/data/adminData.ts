import { 
  OrganizerApplication, 
  OrganizerReviewRecord, 
  EventReviewRecord, 
  AdminPlatformMetrics,
  OrganizerEvent
} from '../types';

export const INITIAL_ADMIN_METRICS: AdminPlatformMetrics = {
  totalCustomers: 1420,
  totalOrganizers: 18,
  totalEvents: 24,
  publishedEvents: 19,
  pendingEventApprovals: 3,
  pendingOrganizers: 2,
  grossTicketSalesMWK: 74250000
};

export const INITIAL_PENDING_APPLICATIONS: OrganizerApplication[] = [
  {
    id: 'app-01',
    organizationName: 'Zomba Heritage & Arts Trust',
    legalName: 'Zomba Cultural Heritage Trust Ltd',
    organizationType: 'Cultural Trust / NGO',
    registrationNumber: 'MWR-2024-99120',
    email: 'contact@zombaheritage.mw',
    phone: '+265 999 554 433',
    physicalAddress: 'Old Parliament Buildings, Zomba Boma',
    city: 'Zomba',
    website: 'https://zombaheritage.mw',
    socialLinks: {
      facebook: 'facebook.com/zombaheritage',
      instagram: '@zombaheritage_mw'
    },
    description: 'Non-profit trust dedicated to preserving indigenous Malawian acoustic instruments and historical plateau walks.',
    documents: [
      {
        id: 'doc-z1',
        name: 'NGO_Board_Certificate_Zomba.pdf',
        size: '1.4 MB',
        type: 'PDF Document',
        uploadedAt: '01 Nov 2026',
        fileUrl: '#'
      },
      {
        id: 'doc-z2',
        name: 'Trust_Deed_Registration_2024.pdf',
        size: '3.1 MB',
        type: 'PDF Document',
        uploadedAt: '01 Nov 2026',
        fileUrl: '#'
      },
      {
        id: 'doc-z3',
        name: 'Board_Chairman_National_ID.jpg',
        size: '1.8 MB',
        type: 'Image (JPG)',
        uploadedAt: '01 Nov 2026',
        fileUrl: '#'
      }
    ],
    status: 'submitted',
    submittedAt: '01 Nov 2026'
  },
  {
    id: 'app-02',
    organizationName: 'Nyasa Urban Beats Productions',
    legalName: 'Urban Beats Entertainment MW Ltd',
    organizationType: 'Promoter / Entertainment',
    registrationNumber: 'MBR-98442-2023',
    email: 'info@urbanbeats.mw',
    phone: '+265 888 332 211',
    physicalAddress: 'Area 47 Sector 3, Lilongwe',
    city: 'Lilongwe',
    website: 'https://urbanbeats.mw',
    socialLinks: {
      instagram: '@urbanbeats_mw',
      twitter: '@urbanbeatsmw'
    },
    description: 'Urban music agency organizing arena hip-hop and amapiano concerts across Lilongwe and Blantyre.',
    documents: [
      {
        id: 'doc-u1',
        name: 'Company_Registration_UrbanBeats.pdf',
        size: '2.2 MB',
        type: 'PDF Document',
        uploadedAt: '30 Oct 2026',
        fileUrl: '#'
      },
      {
        id: 'doc-u2',
        name: 'MRA_TIN_Certificate_2026.pdf',
        size: '890 KB',
        type: 'PDF Document',
        uploadedAt: '30 Oct 2026',
        fileUrl: '#'
      }
    ],
    status: 'under_review',
    submittedAt: '30 Oct 2026'
  }
];

export const INITIAL_APPLICATION_REVIEWS_HISTORY: OrganizerReviewRecord[] = [
  {
    id: 'rev-01',
    applicationId: 'app-00',
    organizationName: 'Mandala Live Collective',
    reviewerName: 'Thokozani Phiri (Admin)',
    status: 'approved',
    reason: 'Verified MRA Tax Clearance and valid Blantyre City Council event premises agreement.',
    reviewedAt: '14 Oct 2024'
  },
  {
    id: 'rev-02',
    applicationId: 'app-prev-01',
    organizationName: 'Viphya Rhythms Entertainment',
    reviewerName: 'Grace Chiwambo (Admin)',
    status: 'rejected',
    reason: 'Incomplete business registration certificate. Missing certified copy of Director ID.',
    reviewedAt: '22 Sep 2026'
  }
];

export const INITIAL_EVENT_REVIEWS_HISTORY: EventReviewRecord[] = [
  {
    id: 'erev-01',
    eventId: 'org-evt-01',
    eventTitle: 'Blantyre Sunset Afro-Jazz Live',
    organizerName: 'Mandala Live Collective',
    reviewerName: 'Thokozani Phiri (Admin)',
    status: 'approved',
    reason: 'Robins Park Amphitheatre safety clearance verified and ticket tier quotas compliant.',
    reviewedAt: '15 Sep 2026'
  },
  {
    id: 'erev-02',
    eventId: 'org-evt-05',
    eventTitle: 'Zomba Mountain Campfire Beats',
    organizerName: 'Mandala Live Collective',
    reviewerName: 'Grace Chiwambo (Admin)',
    status: 'rejected',
    reason: 'Forest Reserve environmental clearance missing. Please attach the Department of Forestry permit and resubmit.',
    reviewedAt: '12 Sep 2026'
  }
];

export const INITIAL_ADMIN_ACTIVITY_LOG = [
  {
    id: 'aact-01',
    title: 'New Organiser Application Submitted',
    description: 'Zomba Heritage & Arts Trust submitted registration dossier for platform review.',
    timestamp: '25 mins ago',
    type: 'organizer' as const
  },
  {
    id: 'aact-02',
    title: 'Event Submitted for Approval',
    description: 'Lake Malawi Reggae & Roots Fest (Sunbird Nkopola) was submitted for compliance verification.',
    timestamp: '2 hours ago',
    type: 'event' as const
  },
  {
    id: 'aact-03',
    title: 'Ticket Reservation Created',
    description: 'Chikondi Banda reserved 2x passes for Lake of Stars (Ref #NYASA-2026-8942A).',
    timestamp: '3 hours ago',
    type: 'customer' as const
  },
  {
    id: 'aact-04',
    title: 'Organiser Application Approved',
    description: 'Mandala Live Collective verified as Tier 1 accredited promoter.',
    timestamp: 'Yesterday',
    type: 'moderation' as const
  }
];

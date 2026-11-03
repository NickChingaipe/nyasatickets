import { 
  OrganizerEvent, 
  OrganizerTicketTier, 
  Venue, 
  OrganizerApplication, 
  EventStaffMember, 
  AttendeeRecord 
} from '../types';

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'ven-01',
    name: 'Robins Park Amphitheatre',
    city: 'Blantyre',
    address: 'Robins Park Grounds, Kamuzu Highway',
    capacity: 650,
    contactPerson: 'Kondwani Phiri',
    contactPhone: '+265 888 234 567',
    isOnline: false
  },
  {
    id: 'ven-02',
    name: 'Bingu International Convention Centre (BICC)',
    city: 'Lilongwe',
    address: 'Presidential Way, City Centre',
    capacity: 1200,
    contactPerson: 'Ephraim Banda',
    contactPhone: '+265 999 345 678',
    isOnline: false
  },
  {
    id: 'ven-03',
    name: 'Civo Stadium Arena',
    city: 'Lilongwe',
    address: 'Area 9, Off Paul Kagame Road',
    capacity: 5000,
    contactPerson: 'Mayamiko Chiwambo',
    contactPhone: '+265 881 456 789',
    isOnline: false
  },
  {
    id: 'ven-04',
    name: 'Sunbird Nkopola Beach Resort',
    city: 'Mangochi',
    address: 'Monkey Bay Road, Mangochi Peninsula',
    capacity: 2500,
    contactPerson: 'Grace Mhone',
    contactPhone: '+265 994 567 890',
    isOnline: false
  },
  {
    id: 'ven-05',
    name: 'Nyasa Virtual Live Stream (Online)',
    city: 'Lilongwe',
    address: 'Global High-Bitrate CDN Stream',
    capacity: 10000,
    contactPerson: 'Technical Operations',
    contactPhone: '+265 888 000 111',
    isOnline: true
  }
];

export const INITIAL_ORGANIZER_EVENTS: OrganizerEvent[] = [
  {
    id: 'org-evt-01',
    organizationId: 'org-mandala-music',
    title: 'Blantyre Sunset Afro-Jazz Live',
    tagline: 'An intimate evening of soulful horn lines, Malawian folk fusion, and live acoustic mastery',
    description: 'Premier live acoustic jazz festival showcasing Malawi jazz virtuosos under the amber lights of Robins Park Amphitheatre.',
    category: 'music',
    city: 'Blantyre',
    venueId: 'ven-01',
    venueName: 'Robins Park Amphitheatre',
    startDate: '2026-11-14',
    startTime: '18:30',
    endDate: '2026-11-14',
    endTime: '23:30',
    doorsOpen: '17:30 CAT',
    ageRestriction: '18+ Recommended',
    status: 'published',
    image: '/src/assets/images/event_blantyre_jazz_1793689057469.jpg',
    ticketsSold: 216,
    capacity: 420,
    grossRevenueMWK: 5320000,
    createdAt: '2026-09-01',
    updatedAt: '2026-10-15',
    tiers: [
      {
        id: 'tier-bj-1',
        eventId: 'org-evt-01',
        name: 'General Admission',
        description: 'Unreserved seating in the open-air amphitheatre with acoustic sightlines.',
        priceMWK: 20000,
        currency: 'MWK',
        totalQuantity: 400,
        soldQuantity: 210,
        reservedQuantity: 15,
        minPerOrder: 1,
        maxPerOrder: 6,
        salesStartDate: '2026-09-10',
        salesEndDate: '2026-11-14',
        active: true
      },
      {
        id: 'tier-bj-2',
        eventId: 'org-evt-01',
        name: 'Reserved Front Table (4 Persons)',
        description: 'Front-row candlelit table with wine & Malawian tapas platter.',
        priceMWK: 95000,
        currency: 'MWK',
        totalQuantity: 20,
        soldQuantity: 6,
        reservedQuantity: 2,
        minPerOrder: 1,
        maxPerOrder: 2,
        salesStartDate: '2026-09-10',
        salesEndDate: '2026-11-13',
        active: true
      }
    ]
  },
  {
    id: 'org-evt-02',
    organizationId: 'org-mandala-music',
    title: 'Lilongwe Acoustic Rooftop Session',
    tagline: 'Stripped-back vocals and sunset views over the capital city',
    description: 'A curated evening of indie folk, poetry, and acoustic guitar melodies overlooking the capital skyline.',
    category: 'music',
    city: 'Lilongwe',
    venueId: 'ven-02',
    venueName: 'BICC Skylight Terrace',
    startDate: '2026-11-27',
    startTime: '19:00',
    endDate: '2026-11-27',
    endTime: '23:00',
    doorsOpen: '18:00 CAT',
    ageRestriction: 'All Ages Welcome',
    status: 'published',
    image: '/src/assets/images/hero_lake_of_stars_1793689056299.jpg',
    ticketsSold: 140,
    capacity: 150,
    grossRevenueMWK: 2800000,
    createdAt: '2026-09-20',
    updatedAt: '2026-10-22',
    tiers: [
      {
        id: 'tier-lr-1',
        eventId: 'org-evt-02',
        name: 'Rooftop Lounge Pass',
        description: 'Entry and complimentary craft cider on arrival.',
        priceMWK: 20000,
        currency: 'MWK',
        totalQuantity: 150,
        soldQuantity: 140,
        reservedQuantity: 4,
        minPerOrder: 1,
        maxPerOrder: 4,
        salesStartDate: '2026-10-01',
        salesEndDate: '2026-11-27',
        active: true
      }
    ]
  },
  {
    id: 'org-evt-03',
    organizationId: 'org-mandala-music',
    title: 'Lake Malawi Reggae & Roots Fest',
    tagline: 'Three days of roots reggae, dub sound systems, and beach fires along the lake',
    description: 'Celebrating Malawian reggae heritage on the sand with live horn sections, dreadlock culture, and eco-friendly camping.',
    category: 'cultural',
    city: 'Mangochi',
    venueId: 'ven-04',
    venueName: 'Sunbird Nkopola Beach Resort',
    startDate: '2026-12-19',
    startTime: '13:00',
    endDate: '2026-12-21',
    endTime: '18:00',
    doorsOpen: '11:00 CAT',
    ageRestriction: 'Family Friendly',
    status: 'pending_approval',
    statusNotes: 'Submitted for administrative compliance and safety permit verification with Mangochi District Council.',
    image: '/src/assets/images/event_sand_music_fest_1793689058956.jpg',
    ticketsSold: 0,
    capacity: 1200,
    grossRevenueMWK: 0,
    createdAt: '2026-10-25',
    updatedAt: '2026-10-25',
    tiers: [
      {
        id: 'tier-rr-1',
        eventId: 'org-evt-03',
        name: '3-Day Beach Pass',
        description: 'Full festival and camping access.',
        priceMWK: 30000,
        currency: 'MWK',
        totalQuantity: 1000,
        soldQuantity: 0,
        reservedQuantity: 0,
        minPerOrder: 1,
        maxPerOrder: 8,
        salesStartDate: '2026-11-01',
        salesEndDate: '2026-12-19',
        active: false
      }
    ]
  },
  {
    id: 'org-evt-04',
    organizationId: 'org-mandala-music',
    title: 'Nyasa Comedy All-Stars Gala',
    tagline: 'Top stand-up comedians from Lilongwe and Blantyre for an uncensored laughter feast',
    description: 'An evening of political satire, cultural wit, and hilarious observation from Malawi premier comedy icons.',
    category: 'theatre',
    city: 'Lilongwe',
    venueId: 'ven-02',
    venueName: 'BICC Auditorium',
    startDate: '2027-01-09',
    startTime: '19:30',
    endDate: '2027-01-09',
    endTime: '22:30',
    doorsOpen: '18:30 CAT',
    ageRestriction: '18+ Mature Themes',
    status: 'draft',
    statusNotes: 'Draft mode: Finalizing performer contracts before submitting for platform approval.',
    image: '/src/assets/images/event_arts_theatre_1793689058353.jpg',
    ticketsSold: 0,
    capacity: 600,
    grossRevenueMWK: 0,
    createdAt: '2026-10-28',
    updatedAt: '2026-10-28',
    tiers: [
      {
        id: 'tier-nc-1',
        eventId: 'org-evt-04',
        name: 'Standard Seat',
        description: 'Tiered auditorium seating.',
        priceMWK: 15000,
        currency: 'MWK',
        totalQuantity: 500,
        soldQuantity: 0,
        reservedQuantity: 0,
        minPerOrder: 1,
        maxPerOrder: 6,
        salesStartDate: '2026-11-15',
        salesEndDate: '2027-01-09',
        active: false
      }
    ]
  },
  {
    id: 'org-evt-05',
    organizationId: 'org-mandala-music',
    title: 'Zomba Mountain Campfire Beats',
    tagline: 'High-elevation chillout session and pine forest acoustic sets',
    description: 'Acoustic jam in Zomba Plateau forest reserve.',
    category: 'music',
    city: 'Zomba',
    venueId: 'ven-01',
    venueName: 'Zomba Plateau Sunbird Grounds',
    startDate: '2026-10-10',
    startTime: '16:00',
    endDate: '2026-10-10',
    endTime: '23:00',
    doorsOpen: '15:00 CAT',
    ageRestriction: '18+ Only',
    status: 'rejected',
    statusNotes: 'Forest Reserve environmental clearance missing. Please attach the Department of Forestry permit and resubmit.',
    image: '/src/assets/images/event_lilongwe_urban_1793689058032.jpg',
    ticketsSold: 0,
    capacity: 250,
    grossRevenueMWK: 0,
    createdAt: '2026-09-05',
    updatedAt: '2026-09-12',
    tiers: []
  }
];

export const INITIAL_APPLICATION: OrganizerApplication = {
  organizationName: 'Mandala Live Collective',
  legalName: 'Mandala Creative Productions Ltd',
  organizationType: 'Promoter / Entertainment',
  registrationNumber: 'MBR-104928-2022',
  email: 'director@mandalalive.mw',
  phone: '+265 999 456 789',
  physicalAddress: 'Plot 44, Mandala Heritage Way',
  city: 'Blantyre',
  website: 'https://mandalalive.mw',
  socialLinks: {
    instagram: '@mandalalive_mw',
    facebook: 'facebook.com/mandalalivemalawi',
    twitter: '@mandalalive'
  },
  description: 'Independent cultural curation house in Blantyre promoting Malawian live music, acoustic ensembles, and visual arts since 2022.',
  documents: [
    {
      id: 'doc-01',
      name: 'Certificate_of_Incorporation_Malawi.pdf',
      size: '1.8 MB',
      type: 'PDF Document',
      uploadedAt: '12 Oct 2024'
    },
    {
      id: 'doc-02',
      name: 'MRA_Tax_Clearance_2026.pdf',
      size: '940 KB',
      type: 'PDF Document',
      uploadedAt: '12 Oct 2024'
    },
    {
      id: 'doc-03',
      name: 'Managing_Director_National_ID.jpg',
      size: '2.4 MB',
      type: 'Image (JPG)',
      uploadedAt: '12 Oct 2024'
    }
  ],
  status: 'approved',
  submittedAt: '12 Oct 2024',
  reviewedAt: '14 Oct 2024',
  reviewFeedback: 'Application verified and approved by NyasaTickets Compliance Team. Full tier management and event publishing enabled.'
};

export const INITIAL_STAFF_MEMBERS: EventStaffMember[] = [
  {
    id: 'stf-01',
    name: 'Tamandani Gondwe',
    email: 'tamandani@mandalalive.mw',
    phone: '+265 991 112 233',
    role: 'event_manager',
    assignedEventIds: ['org-evt-01', 'org-evt-02'],
    status: 'active',
    addedAt: '15 Sep 2026'
  },
  {
    id: 'stf-02',
    name: 'Kelvin Chirwa',
    email: 'kchirwa@gatecrew.mw',
    phone: '+265 888 776 554',
    role: 'scanner',
    assignedEventIds: ['org-evt-01'],
    status: 'active',
    addedAt: '01 Oct 2026'
  },
  {
    id: 'stf-03',
    name: 'Thoko Mwale',
    email: 'thoko.mwale@gatecrew.mw',
    phone: '+265 993 445 566',
    role: 'scanner',
    assignedEventIds: ['org-evt-01'],
    status: 'invited',
    addedAt: '18 Oct 2026'
  },
  {
    id: 'stf-04',
    name: 'Memory Kachere',
    email: 'finance@mandalalive.mw',
    phone: '+265 884 990 011',
    role: 'finance_viewer',
    assignedEventIds: ['org-evt-01', 'org-evt-02', 'org-evt-03'],
    status: 'active',
    addedAt: '20 Sep 2026'
  }
];

export const INITIAL_ATTENDEES: AttendeeRecord[] = [
  {
    id: 'att-01',
    orderReference: 'NYASA-2026-8942A',
    eventId: 'org-evt-01',
    eventTitle: 'Blantyre Sunset Afro-Jazz Live',
    customerName: 'Chikondi Banda',
    customerEmail: 'chikondi.banda@nyasamail.mw',
    customerPhone: '+265 99 123 4567',
    ticketType: 'General Admission',
    quantity: 1,
    totalMWK: 21000,
    ticketStatus: 'confirmed',
    purchaseDate: '01 Nov 2026'
  },
  {
    id: 'att-02',
    orderReference: 'NYASA-2026-4412K',
    eventId: 'org-evt-01',
    eventTitle: 'Blantyre Sunset Afro-Jazz Live',
    customerName: 'Alinane Phiri',
    customerEmail: 'alinane.p@gmail.com',
    customerPhone: '+265 888 654 321',
    ticketType: 'Reserved Front Table (4 Persons)',
    quantity: 1,
    totalMWK: 96500,
    ticketStatus: 'confirmed',
    purchaseDate: '29 Oct 2026'
  },
  {
    id: 'att-03',
    orderReference: 'NYASA-2026-7819M',
    eventId: 'org-evt-01',
    eventTitle: 'Blantyre Sunset Afro-Jazz Live',
    customerName: 'Dumisan Chome',
    customerEmail: 'dchome@corp.mw',
    customerPhone: '+265 994 112 334',
    ticketType: 'General Admission',
    quantity: 3,
    totalMWK: 61500,
    ticketStatus: 'confirmed',
    purchaseDate: '25 Oct 2026'
  },
  {
    id: 'att-04',
    orderReference: 'NYASA-2026-9021X',
    eventId: 'org-evt-02',
    eventTitle: 'Lilongwe Acoustic Rooftop Session',
    customerName: 'Kondwani Mtambo',
    customerEmail: 'kmtambo@capital.mw',
    customerPhone: '+265 882 334 455',
    ticketType: 'Rooftop Lounge Pass',
    quantity: 2,
    totalMWK: 41500,
    ticketStatus: 'confirmed',
    purchaseDate: '20 Oct 2026'
  },
  {
    id: 'att-05',
    orderReference: 'NYASA-2026-1184Z',
    eventId: 'org-evt-01',
    eventTitle: 'Blantyre Sunset Afro-Jazz Live',
    customerName: 'Wongani Nyirenda',
    customerEmail: 'wongani.n@yahoo.com',
    customerPhone: '+265 999 887 766',
    ticketType: 'General Admission',
    quantity: 2,
    totalMWK: 41500,
    ticketStatus: 'reserved',
    purchaseDate: '02 Nov 2026'
  }
];

export const INITIAL_ACTIVITY_LOG = [
  {
    id: 'act-01',
    title: 'Ticket Reservation Confirmed',
    description: 'Chikondi Banda reserved 1x General Admission for Blantyre Sunset Afro-Jazz Live.',
    timestamp: '15 mins ago',
    type: 'sale'
  },
  {
    id: 'act-02',
    title: 'Event Submitted for Approval',
    description: 'Lake Malawi Reggae & Roots Fest was submitted for administrative compliance review.',
    timestamp: '2 hours ago',
    type: 'event'
  },
  {
    id: 'act-03',
    title: 'Staff Member Invited',
    description: 'Thoko Mwale was invited as Gate Scanner for Robins Park turnstiles.',
    timestamp: 'Yesterday at 16:45',
    type: 'staff'
  },
  {
    id: 'act-04',
    title: 'Rooftop Lounge Pass 90% Sold Out',
    description: 'Lilongwe Acoustic Rooftop Session reached 140 of 150 ticket capacity.',
    timestamp: '01 Nov 2026',
    type: 'inventory'
  }
];

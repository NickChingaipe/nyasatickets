import { EventItem } from '../types';

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-los-2026',
    title: 'Lake of Stars Discovery Festival',
    tagline: "Malawi's premier global arts and music gathering on the golden shores of Lake Malawi",
    description: 'Set against the shimmering sunset of Lake Malawi, Lake of Stars unites international musical icons with the finest Malawian talent. Experience three unforgettable days of live afro-fusion, spoken word, beach sports, dawn yoga, artisan craft villages, and traditional Malawian culinary experiences right on the water.',
    category: 'cultural',
    categoryLabel: 'Cultural & Festivals',
    city: 'Mangochi',
    venue: 'Sunbird Nkopola Beach Resort',
    dateDisplay: 'Fri, 25 Sep – Sun, 27 Sep 2026',
    timeDisplay: '14:00 onwards',
    dateTimestamp: 1790344800000,
    doorsOpen: '12:00 CAT daily',
    ageRestriction: 'All Ages Welcome (Under 12s free with adult)',
    lineup: ['Faith Mussa', 'Tay Grin', 'Sauti Sol Guest Tribute', 'Lawi', 'George Kalukusha', 'Mafilika Percussion'],
    termsAndConditions: [
      'Official digital booking reference or printed confirmation required at the main registration gate.',
      'No outside glassware, weapons, or unauthorized drones allowed within resort festival grounds.',
      'Wristbands must be worn continuously across the 3 days; tampered wristbands will be voided.',
      'Camping permits must be presented alongside 3-Day passes at campsite check-in.'
    ],
    priceMWK: 45000,
    priceDisplay: 'MWK 45,000',
    image: '/src/assets/images/hero_lake_of_stars_1793689056299.jpg',
    status: 'selling_fast',
    featured: true,
    organizer: {
      id: 'org-los-team',
      name: 'Lake of Stars International',
      verified: true,
      contactEmail: 'info@lakeofstars.org',
      contactPhone: '+265 888 123 456',
      bio: 'Leading cultural production outfit championing Malawian creative arts on the world stage since 2004.'
    },
    tiers: [
      {
        id: 'tier-early-bird',
        name: '3-Day Standard Pass',
        priceMWK: 45000,
        description: 'Full festival access across all 3 days, beach activities and main stage arena entry.',
        perks: ['All 3 days festival access', 'Beach stage & main stage entry', 'Standard camping access'],
        remaining: 140,
        capacity: 1000
      },
      {
        id: 'tier-vip-lake',
        name: 'VIP Golden Sands Pass',
        priceMWK: 110000,
        description: 'Exclusive raised viewing deck, dedicated VIP bar, private beach cabana and express entry.',
        perks: ['Express VIP gate check-in', 'Private raised VIP viewing platform', 'Dedicated cash & card bar', 'Complimentary welcome drink & gift bag', 'VIP parking pass'],
        remaining: 28,
        capacity: 150
      }
    ]
  },
  {
    id: 'evt-blantyre-jazz',
    title: 'Blantyre Sunset Afro-Jazz Live',
    tagline: 'An intimate evening of soulful horn lines, Malawian folk fusion, and live acoustic mastery',
    description: 'Join renowned saxophonists and acoustic guitar virtuosos for an acoustic feast under the amber lights of Robins Park. Features live collaborations with traditional Malawian percussionists and local wine pairings.',
    category: 'music',
    categoryLabel: 'Music & Concerts',
    city: 'Blantyre',
    venue: 'Robins Park Amphitheatre',
    dateDisplay: 'Sat, 14 Nov 2026',
    timeDisplay: '18:30 – 23:30',
    dateTimestamp: 1794681000000,
    doorsOpen: '17:30 CAT',
    ageRestriction: '18+ Recommended (Smart Casual Dress)',
    lineup: ['Peter Mawanga & Amaravi Band', 'Erik Paliani Trio', 'Waliko Makhala', 'Chitukuko Brass Ensemble'],
    termsAndConditions: [
      'Reserved tables are held until 19:30 CAT before being released for general seating.',
      'Strictly smart casual dress code enforced at the main amphitheatre portal.',
      'Professional photography equipment requires prior media accreditation from Mandala Live Collective.'
    ],
    priceMWK: 20000,
    priceDisplay: 'MWK 20,000',
    image: '/src/assets/images/event_blantyre_jazz_1793689057469.jpg',
    status: 'upcoming',
    featured: true,
    organizer: {
      id: 'org-mandala-music',
      name: 'Mandala Live Collective',
      verified: true,
      contactEmail: 'bookings@mandalalive.mw',
      contactPhone: '+265 999 456 789',
      bio: 'Blantyre-based music curation collective creating premium, intimate live performance spaces for African jazz and acoustic folk.'
    },
    tiers: [
      {
        id: 'tier-jazz-gen',
        name: 'General Admission',
        priceMWK: 20000,
        description: 'Unreserved seating in the open-air amphitheatre with full acoustic line of sight.',
        perks: ['Amphitheatre seating', 'Food & craft drink market access'],
        remaining: 210,
        capacity: 400
      },
      {
        id: 'tier-jazz-table',
        name: 'Reserved Front Table (4 Persons)',
        priceMWK: 95000,
        description: 'Front-row candlelit table for four with complimentary platter and vintage wine bottle.',
        perks: ['Seating for 4 guests', 'Complimentary Malawian tapas platter', 'Bottle of South African vintage wine', 'Dedicated table waitstaff'],
        remaining: 6,
        capacity: 20
      }
    ]
  },
  {
    id: 'evt-lilongwe-fest',
    title: 'Lilongwe Urban Summer Jam 2026',
    tagline: "The capital's largest hip-hop, afro-beats and amapiano arena explosion",
    description: 'The definitive sound of modern urban Malawi. Featuring high-energy performances from top chart-toppers, international guest DJs, massive laser displays, and an electric crowd across Civo Stadium.',
    category: 'music',
    categoryLabel: 'Music & Concerts',
    city: 'Lilongwe',
    venue: 'Civo Stadium Arena',
    dateDisplay: 'Sat, 05 Dec 2026',
    timeDisplay: '16:00 – Late',
    dateTimestamp: 1796486400000,
    doorsOpen: '15:00 CAT',
    ageRestriction: '16+ (Valid student or national ID required at turnstiles)',
    lineup: ['Eli Njuchi', 'Gwamba', 'Hayze Engolah', 'Phyzix', 'DJ Nathan Tunes', 'Special South African Amapiano Headliner'],
    termsAndConditions: [
      'Rigorous security search at all stadium turnstiles. No contraband, glass bottles, or fireworks.',
      'Re-entry is strictly prohibited once turnstile ticket is scanned.',
      'Pitch tickets do not provide access to covered grandstand seating.'
    ],
    priceMWK: 15000,
    priceDisplay: 'MWK 15,000',
    image: '/src/assets/images/event_lilongwe_urban_1793689058032.jpg',
    status: 'selling_fast',
    featured: false,
    organizer: {
      id: 'org-capital-hype',
      name: 'Capital Pulse Productions',
      verified: true,
      contactEmail: 'contact@capitalpulse.mw',
      contactPhone: '+265 881 999 111',
      bio: "Malawi's premier concert and festival production team specializing in mega youth entertainment."
    },
    tiers: [
      {
        id: 'tier-civo-arena',
        name: 'Regular Arena Standing',
        priceMWK: 15000,
        description: 'Standard pitch floor admission closest to the main stage energy.',
        perks: ['Pitch entry', 'Standard concessions access'],
        remaining: 450,
        capacity: 2500
      },
      {
        id: 'tier-civo-grandstand',
        name: 'Grandstand Covered Seating',
        priceMWK: 25000,
        description: 'Elevated covered stadium seating with superior panoramic audio and visuals.',
        perks: ['Guaranteed covered seat', 'Priority stadium turnstile entry'],
        remaining: 180,
        capacity: 800
      },
      {
        id: 'tier-civo-vip',
        name: 'Backstage VVIP Lounge',
        priceMWK: 75000,
        description: 'Access to the artist lounge, private bar, and raised side-stage platform.',
        perks: ['Side-stage viewing deck', 'Complimentary cocktail hour', 'Artist meet & photo spot'],
        remaining: 14,
        capacity: 80
      }
    ]
  },
  {
    id: 'evt-sand-music',
    title: 'Sand Music Festival XIV',
    tagline: 'Sun, sand, and southern African rhythms along the crystalline Lake shores',
    description: 'Sand Music Festival returns for its 14th edition celebrating African heritage, coastal rhythms, reggaeton, and dancehall. An unforgettable weekend getaway for music lovers and families along the Salima beaches.',
    category: 'cultural',
    categoryLabel: 'Cultural & Festivals',
    city: 'Salima',
    venue: 'Kambiri Beach Resort & Grounds',
    dateDisplay: 'Fri, 02 Oct – Sun, 04 Oct 2026',
    timeDisplay: '12:00 – Late',
    dateTimestamp: 1790942400000,
    doorsOpen: '10:00 CAT',
    ageRestriction: 'Family Friendly (All ages welcome)',
    lineup: ['Lucius Banda Legacy Band', 'Wendy Harawa', 'Skeffa Chimoto', 'Driemo', 'Samba percussionists'],
    termsAndConditions: [
      'Tickets admit one guest for the specified pass duration.',
      'Parking available in designated resort lots with security personnel on duty.',
      'Children under 10 enter free with accompanied ticket-holding guardian.'
    ],
    priceMWK: 35000,
    priceDisplay: 'MWK 35,000',
    image: '/src/assets/images/event_sand_music_fest_1793689058956.jpg',
    status: 'upcoming',
    featured: false,
    organizer: {
      id: 'org-impact-events',
      name: 'Impact Events Africa',
      verified: true,
      contactEmail: 'events@impactafrica.mw',
      contactPhone: '+265 994 332 211',
      bio: 'Pioneers of coastal festival entertainment and tourism promotion along Lake Malawi.'
    },
    tiers: [
      {
        id: 'tier-sand-weekend',
        name: 'Full Weekend Pass',
        priceMWK: 35000,
        description: 'Entry to all day and night sessions across the 3 festival days.',
        perks: ['3-day pass', 'Beach access', 'Free shuttle from Salima Boma'],
        remaining: 320,
        capacity: 1500
      },
      {
        id: 'tier-sand-vip',
        name: 'Lake View VIP Pass',
        priceMWK: 85000,
        description: 'Private cabana lounge with premium lake view and exclusive hospitality tent.',
        perks: ['VIP hospitality lounge', 'Shaded beach cabana seating', 'Complimentary lunch buffet'],
        remaining: 30,
        capacity: 100
      }
    ]
  },
  {
    id: 'evt-arts-theatre',
    title: 'National Contemporary Theatre Festival',
    tagline: 'Bold narratives, Malawian folklore re-imagined, and dynamic physical choreography',
    description: 'Showcasing the highest caliber of Malawian stage drama, poetry and contemporary African dance. Four headline performances exploring identity, heritage, and modern aspirations inside BICC auditorium.',
    category: 'theatre',
    categoryLabel: 'Arts & Theatre',
    city: 'Lilongwe',
    venue: 'Bingu International Convention Centre (BICC)',
    dateDisplay: 'Fri, 20 Nov 2026',
    timeDisplay: '19:00 – 22:30',
    dateTimestamp: 1795198800000,
    doorsOpen: '18:15 CAT',
    ageRestriction: 'Ages 12+ (PG-13 theatrical themes)',
    lineup: ['Chancellor College Drama Troupe', 'Nanzikambe Arts', 'Solomonic Peacemakers Poetry Ensemble', 'Kwathu Physical Theatre'],
    termsAndConditions: [
      'Doors will be closed strictly at 19:00 during performances; late arrivals seated at intermission.',
      'Mobile phones must be silenced inside the auditorium.',
      'Photography with flash is prohibited.'
    ],
    priceMWK: 18000,
    priceDisplay: 'MWK 18,000',
    image: '/src/assets/images/event_arts_theatre_1793689058353.jpg',
    status: 'upcoming',
    featured: false,
    organizer: {
      id: 'org-malawi-theatre-assoc',
      name: 'Malawi Performing Arts Guild',
      verified: true,
      contactEmail: 'theatre@guild.org.mw',
      contactPhone: '+265 888 777 666',
      bio: 'National association committed to uplifting professional playwrights, actors, and choreographers across Malawi.'
    },
    tiers: [
      {
        id: 'tier-theatre-standard',
        name: 'Standard Auditorium Seat',
        priceMWK: 18000,
        description: 'Tiered auditorium seating with pristine acoustics.',
        perks: ['Auditorium seat', 'Souvenir program pamphlet'],
        remaining: 165,
        capacity: 500
      },
      {
        id: 'tier-theatre-patron',
        name: 'Patron Circle & Cocktail Reception',
        priceMWK: 40000,
        description: 'Center orchestra seats plus invitation to the post-gala cast reception.',
        perks: ['Prime central orchestra seat', 'Post-show wine & canapes reception', 'Cast meet & greet'],
        remaining: 22,
        capacity: 60
      }
    ]
  },
  {
    id: 'evt-mzuzu-derby',
    title: 'Northern Highlands Trail & Mountain Half Marathon',
    tagline: 'Challenge the steep pine ridges and lush highland trails of Viphya and Mzuzu',
    description: 'A test of endurance and spirit through breathtaking indigenous mountain forests and high plateau ridges. Distances include 10km fun run and 21km trail half-marathon, followed by an outdoor braai festival in Mzuzu.',
    category: 'sports',
    categoryLabel: 'Sports & Outdoors',
    city: 'Mzuzu',
    venue: 'Viphya Forest Reserve Gateway, Mzuzu',
    dateDisplay: 'Sat, 17 Oct 2026',
    timeDisplay: '06:00 – 14:00',
    dateTimestamp: 1792213200000,
    doorsOpen: '05:00 CAT (Runner Bib Collection)',
    ageRestriction: 'All Runners (Under 18s require parent signed disclaimer)',
    lineup: ['Elite Marathoners', 'Regional Athletic Clubs', 'Outdoor Trail Guide Marshals'],
    termsAndConditions: [
      'Race bibs and timing chips must be collected before 05:45 CAT on race morning.',
      'Trail marshals reserve the right to divert runners for safety in sudden mountain mist.',
      'Medals awarded to all registered finishers completing within the 4-hour cutoff.'
    ],
    priceMWK: 12000,
    priceDisplay: 'MWK 12,000',
    image: '/src/assets/images/event_sand_music_fest_1793689058956.jpg',
    status: 'upcoming',
    featured: false,
    organizer: {
      id: 'org-highland-runners',
      name: 'Mzuzu Athletics Club',
      verified: true,
      contactEmail: 'mzuzu.athletics@club.mw',
      contactPhone: '+265 991 888 222',
      bio: 'Northern region premier distance running organization promoting active mountain recreation.'
    },
    tiers: [
      {
        id: 'tier-run-10k',
        name: '10KM Mountain Trail Run',
        priceMWK: 12000,
        description: 'Timed chip entry, trail hydration stations, and official finisher medal.',
        perks: ['Bib & timing chip', 'Hydration points', 'Finisher bronze medal', 'Post-race braai voucher'],
        remaining: 85,
        capacity: 300
      },
      {
        id: 'tier-run-21k',
        name: '21KM Half Marathon Challenge',
        priceMWK: 18000,
        description: 'Challenging high-elevation trail with official timing and podium prize eligibility.',
        perks: ['Professional chip timing', 'Trail medical support', 'Finisher silver medal', 'Technical running vest'],
        remaining: 42,
        capacity: 200
      }
    ]
  }
];

export const MOCK_ORGANIZER_STATS = {
  totalRevenueMWK: 18450000,
  activeEventsCount: 4,
  attendeesCount: 1840,
  checkinRate: 92
};

export type EventCategory = 
  | 'music' 
  | 'cultural' 
  | 'theatre' 
  | 'nightlife' 
  | 'sports' 
  | 'conferences';

export type EventStatus = 'upcoming' | 'selling_fast' | 'sold_out' | 'past';

export interface TicketTier {
  id: string;
  name: string;
  priceMWK: number;
  description: string;
  perks: string[];
  remaining: number;
  capacity: number;
}

export interface Organizer {
  id: string;
  name: string;
  verified: boolean;
  avatarUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  bio?: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: EventCategory;
  categoryLabel: string;
  city: 'Lilongwe' | 'Blantyre' | 'Mzuzu' | 'Mangochi' | 'Zomba' | 'Salima';
  venue: string;
  dateDisplay: string;
  timeDisplay: string;
  dateTimestamp: number;
  doorsOpen?: string;
  ageRestriction?: string;
  lineup?: string[];
  termsAndConditions?: string[];
  priceMWK: number;
  priceDisplay: string;
  image: string;
  status: EventStatus;
  featured?: boolean;
  organizer: Organizer;
  tiers: TicketTier[];
}

export interface CategoryInfo {
  id: EventCategory;
  name: string;
  iconName: string;
  description: string;
}

export type BookingStatus = 'confirmed' | 'pending_payment' | 'used' | 'cancelled';

export interface TicketBooking {
  id: string;
  referenceNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  tierName: string;
  quantity: number;
  unitPriceMWK: number;
  serviceFeeMWK: number;
  totalMWK: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: BookingStatus;
  purchaseDate: string;
  image: string;
  gateInstructions?: string;
  paymentNotice?: string;
}

export type AppRole = 'customer' | 'organizer' | 'admin' | 'super_admin';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  role: AppRole;
  isOrganizer: boolean;
  isAdmin: boolean;
  bio?: string;
  notificationEmail: boolean;
  notificationSms: boolean;
  savedEventIds: string[];
  preferredPayment: 'airtel_money' | 'tnm_mpamba' | 'card';
}

// --------------------------------------------------------------------------------
// Phase 3 & 4: Organizer & Administration Types
// --------------------------------------------------------------------------------

export type OrganizerEventStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'approved' 
  | 'published' 
  | 'rejected' 
  | 'cancelled';

export interface OrganizerTicketTier {
  id: string;
  eventId: string;
  name: string;
  description: string;
  priceMWK: number;
  currency: 'MWK';
  totalQuantity: number;
  soldQuantity: number;
  reservedQuantity: number;
  minPerOrder: number;
  maxPerOrder: number;
  salesStartDate: string;
  salesEndDate: string;
  active: boolean;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  contactPerson: string;
  contactPhone: string;
  isOnline: boolean;
}

export interface OrganizerEvent {
  id: string;
  organizationId: string;
  title: string;
  tagline: string;
  description: string;
  category: EventCategory;
  city: string;
  venueId: string;
  venueName: string;
  venueAddress?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  doorsOpen: string;
  ageRestriction: string;
  status: OrganizerEventStatus;
  statusNotes?: string;
  image: string;
  ticketsSold: number;
  capacity: number;
  grossRevenueMWK: number;
  tiers: OrganizerTicketTier[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface OrganizerApplication {
  id?: string;
  organizationName: string;
  legalName: string;
  organizationType: string;
  registrationNumber: string;
  email: string;
  phone: string;
  physicalAddress: string;
  city: string;
  website: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  description: string;
  documents: {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
    fileUrl?: string;
  }[];
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewFeedback?: string;
  reviewedBy?: string;
}

export type StaffRole = 'event_manager' | 'scanner' | 'finance_viewer';

export interface EventStaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  assignedEventIds: string[];
  status: 'active' | 'invited';
  addedAt: string;
}

export interface AttendeeRecord {
  id: string;
  orderReference: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketType: string;
  quantity: number;
  totalMWK: number;
  ticketStatus: 'confirmed' | 'checked_in' | 'reserved' | 'refunded';
  purchaseDate: string;
  checkedInAt?: string;
}

// --------------------------------------------------------------------------------
// Phase 4: Admin Moderation & Review Types
// --------------------------------------------------------------------------------

export interface OrganizerReviewRecord {
  id: string;
  applicationId: string;
  organizationName: string;
  reviewerName: string;
  status: 'approved' | 'rejected';
  reason: string;
  reviewedAt: string;
}

export interface EventReviewRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  organizerName: string;
  reviewerName: string;
  status: 'approved' | 'rejected';
  reason: string;
  reviewedAt: string;
}

export interface AdminPlatformMetrics {
  totalCustomers: number;
  totalOrganizers: number;
  totalEvents: number;
  publishedEvents: number;
  pendingEventApprovals: number;
  pendingOrganizers: number;
  grossTicketSalesMWK: number;
}

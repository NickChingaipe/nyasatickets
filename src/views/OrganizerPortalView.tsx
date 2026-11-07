import React, { useEffect, useState } from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Ticket, 
  Users, 
  BarChart3, 
  Building2, 
  Plus, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  OrganizerEvent, 
  OrganizerTicketTier, 
  Venue, 
  OrganizerApplication, 
  EventStaffMember, 
  AttendeeRecord,
  EventItem,
  UserProfile
} from '../types';
import { OrganizerDashboardSection } from './organizer/OrganizerDashboardSection';
import { OrganizerEventsSection } from './organizer/OrganizerEventsSection';
import { OrganizerTicketsSection } from './organizer/OrganizerTicketsSection';
import { OrganizerAttendeesStaffSection } from './organizer/OrganizerAttendeesStaffSection';
import { OrganizerAnalyticsSection } from './organizer/OrganizerAnalyticsSection';
import { OrganizerRegistrationSection } from './organizer/OrganizerRegistrationSection';
import { EventCreationWizard } from '../components/organizer/EventCreationWizard';
import { VenueManagerModal } from '../components/organizer/VenueManagerModal';
import { TicketTierModal } from '../components/organizer/TicketTierModal';
import { StaffInviteModal } from '../components/organizer/StaffInviteModal';
import { Button } from '../components/common/Button';
import { supabaseService } from '../lib/supabase';

interface OrganizerPortalViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  currentUser: UserProfile;
}

export type OrganizerPortalTab = 
  | 'dashboard' 
  | 'events' 
  | 'tickets' 
  | 'attendees' 
  | 'analytics' 
  | 'registration';

const relation = (value: any) => Array.isArray(value) ? value[0] || {} : value || {};

const dateInputValue = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Blantyre' }).format(date);
};

const timeInputValue = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Blantyre',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(date);
};

const mapTicketTier = (row: any): OrganizerTicketTier => ({
  id: String(row.id),
  eventId: String(row.event_id),
  name: row.name || '',
  description: row.description || '',
  priceMWK: Number(row.price ?? row.price_mwk ?? 0),
  currency: 'MWK',
  totalQuantity: Number(row.quantity_total ?? row.quantity ?? 0),
  soldQuantity: Number(row.quantity_sold ?? row.sold_quantity ?? 0),
  reservedQuantity: Number(row.quantity_reserved ?? row.reserved_quantity ?? 0),
  minPerOrder: Number(row.min_per_order || 1),
  maxPerOrder: Number(row.max_per_order || 10),
  salesStartDate: dateInputValue(row.sales_start_at || row.sales_start_date),
  salesEndDate: dateInputValue(row.sales_end_at || row.sales_end_date),
  active: row.is_active ?? row.active ?? true
});

const mapOrganizerEvent = (row: any): OrganizerEvent => {
  const venue = relation(row.venues);
  const category = relation(row.event_categories);
  const tiers = (row.event_ticket_types || []).map((tier: any): OrganizerTicketTier => ({
    id: String(tier.id),
    eventId: String(tier.event_id || row.id),
    name: tier.name || '',
    description: tier.description || '',
    priceMWK: Number(tier.price ?? tier.price_mwk ?? 0),
    currency: 'MWK',
    totalQuantity: Number(tier.quantity_total ?? tier.quantity ?? 0),
    soldQuantity: Number(tier.quantity_sold ?? tier.sold_quantity ?? 0),
    reservedQuantity: Number(tier.quantity_reserved ?? tier.reserved_quantity ?? 0),
    minPerOrder: Number(tier.min_per_order || 1),
    maxPerOrder: Number(tier.max_per_order || 10),
    salesStartDate: dateInputValue(tier.sales_start_at || tier.sales_start_date),
    salesEndDate: dateInputValue(tier.sales_end_at || tier.sales_end_date),
    active: tier.is_active ?? tier.active ?? true
  }));
  const status = ['draft', 'pending_approval', 'approved', 'published', 'rejected', 'cancelled'].includes(row.status)
    ? row.status
    : 'draft';

  return {
    id: String(row.id),
    organizationId: String(row.organizer_id || ''),
    title: row.title || '',
    tagline: row.tagline || '',
    description: row.description || '',
    category: (category.slug || category.name || row.category || 'music').toLowerCase(),
    city: venue.city || row.city || '',
    venueId: String(row.venue_id || venue.id || ''),
    venueName: venue.name || row.venue_name || '',
    startDate: dateInputValue(row.starts_at || row.start_date),
    startTime: timeInputValue(row.starts_at) || row.start_time || '',
    endDate: dateInputValue(row.ends_at || row.end_date),
    endTime: timeInputValue(row.ends_at) || row.end_time || '',
    doorsOpen: timeInputValue(row.doors_open_at) || row.doors_open || '',
    ageRestriction: row.age_restriction ? `${row.age_restriction}+` : '',
    status,
    statusNotes: row.status_notes || row.review_feedback || '',
    image: row.cover_image_path || row.image_url || '',
    ticketsSold: Number(row.tickets_sold || tiers.reduce((sum: number, tier: OrganizerTicketTier) => sum + tier.soldQuantity, 0)),
    capacity: Number(row.capacity || tiers.reduce((sum: number, tier: OrganizerTicketTier) => sum + tier.totalQuantity, 0)),
    grossRevenueMWK: Number(row.gross_revenue_mwk || 0),
    tiers,
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || ''
  };
};

const mapVenue = (row: any): Venue => ({
  id: String(row.id),
  name: row.name || '',
  city: row.city || '',
  address: row.address || '',
  capacity: Number(row.capacity || 0),
  contactPerson: '',
  contactPhone: '',
  isOnline: false
});

const mapApplication = (row: any): OrganizerApplication => ({
  id: String(row.id),
  organizationName: row.display_name || '',
  legalName: row.legal_name || '',
  organizationType: row.organizer_type || '',
  registrationNumber: row.registration_number || '',
  email: row.contact_email || '',
  phone: row.contact_phone || '',
  physicalAddress: row.address || '',
  city: '',
  website: row.website || '',
  socialLinks: row.social_links || {},
  description: row.description || '',
  documents: [],
  status: row.status || 'draft',
  submittedAt: row.created_at || '',
  reviewedAt: row.reviewed_at || undefined,
  reviewFeedback: row.admin_notes || undefined,
  reviewedBy: row.reviewed_by || undefined
});

const mapAttendee = (row: any): AttendeeRecord => {
  const event = relation(row.events);
  const item = relation(row.order_items);
  const status = row.status === 'checked_in' || row.status === 'used'
    ? 'checked_in'
    : row.status === 'refunded' || row.status === 'cancelled'
      ? 'refunded'
      : row.status === 'confirmed' || row.status === 'paid'
        ? 'confirmed'
        : 'reserved';
  return {
    id: String(row.id),
    orderReference: String(row.order_number || row.reference_number || row.reference || row.id),
    eventId: String(item.event_id || row.event_id || event.id || ''),
    eventTitle: event.title || '',
    customerName: row.customer_name || '',
    customerEmail: row.customer_email || '',
    customerPhone: row.customer_phone || '',
    ticketType: item.ticket_name || '',
    quantity: Number(item.quantity || 0),
    totalMWK: Number(row.total || row.total_mwk || row.total_amount || 0),
    ticketStatus: status,
    purchaseDate: row.created_at || '',
    checkedInAt: row.checked_in_at || undefined
  };
};

const mapStaff = (row: any): EventStaffMember => ({
  id: String(row.id),
  name: row.name || '',
  email: row.email || '',
  phone: row.phone || '',
  role: row.role || 'scanner',
  assignedEventIds: row.event_id ? [String(row.event_id)] : [],
  status: row.status === 'active' ? 'active' : 'invited',
  addedAt: row.created_at || ''
});

export const OrganizerPortalView: React.FC<OrganizerPortalViewProps> = ({
  events: publicEvents,
  onSelectEvent,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<OrganizerPortalTab>('dashboard');

  // State collections
  const [organizerEvents, setOrganizerEvents] = useState<OrganizerEvent[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [staffMembers, setStaffMembers] = useState<EventStaffMember[]>([]);
  const [attendees, setAttendees] = useState<AttendeeRecord[]>([]);
  const [application, setApplication] = useState<OrganizerApplication>({
    organizationName: '', legalName: '', organizationType: '', registrationNumber: '',
    email: '', phone: '', physicalAddress: '', city: '', website: '', socialLinks: {},
    description: '', documents: [], status: 'draft', submittedAt: ''
  });
  const [activityLog, setActivityLog] = useState<any[]>([]);

  // Modals state
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [editingEvent, setEditingEvent] = useState<OrganizerEvent | null>(null);
  const [showVenueManager, setShowVenueManager] = useState(false);
  const [showStaffInvite, setShowStaffInvite] = useState(false);
  const [ticketTierModalData, setTicketTierModalData] = useState<{
    event: OrganizerEvent;
    tier?: OrganizerTicketTier | null;
  } | null>(null);

  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser.id) {
      setLoadError('Sign in to load organizer data.');
      return;
    }
    let active = true;
    const loadWorkspace = async () => {
      const [eventResult, venueResult, applicationResult, attendeeResult, staffResult] = await Promise.all([
        supabaseService.fetchOrganizerEvents(currentUser.id!),
        supabaseService.fetchOrganizerVenues(currentUser.id!),
        supabaseService.fetchOrganizerApplication(),
        supabaseService.fetchOrganizerAttendees(currentUser.id!),
        supabaseService.fetchOrganizerStaff(currentUser.id!)
      ]);
      if (!active) return;
      if (!eventResult.success || !venueResult.success || !applicationResult.success || !attendeeResult.success || !staffResult.success) {
        const error = eventResult.error || venueResult.error || applicationResult.error || attendeeResult.error || staffResult.error;
        setLoadError(error || 'Organizer workspace data could not be loaded.');
        return;
      }
      setOrganizerEvents((eventResult.data || []).map(mapOrganizerEvent));
      setVenues((venueResult.data || []).map(mapVenue));
      setAttendees((attendeeResult.data || []).map(mapAttendee));
      setStaffMembers((staffResult.data || []).map(mapStaff));
      if (applicationResult.data) setApplication(mapApplication(applicationResult.data));
      setLoadError(null);
    };
    void loadWorkspace();
    return () => { active = false; };
  }, [currentUser.id]);

  const showNotification = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const canManageEvents = currentUser.role === 'organizer' || currentUser.isOrganizer;

  // Event creation handler from 6-step wizard
  const handleEventCreated = async (eventData: Partial<OrganizerEvent>, submitForApproval: boolean): Promise<boolean> => {
    if (!currentUser.id) {
      showNotification('Sign in to create events.');
      return false;
    }
    if (!canManageEvents) {
      showNotification('Organizer verification is required before managing events.');
      return false;
    }
    const eventRow = {
      title: eventData.title,
      tagline: eventData.tagline,
      description: eventData.description,
      category: eventData.category,
      city: eventData.city,
      venue_id: eventData.venueId && eventData.venueId !== 'custom' ? eventData.venueId : null,
      venue_name: eventData.venueName,
      start_date: eventData.startDate,
      start_time: eventData.startTime,
      end_date: eventData.endDate,
      end_time: eventData.endTime,
      doors_open: eventData.doorsOpen,
      age_restriction: eventData.ageRestriction,
      image_url: eventData.image,
      capacity: eventData.capacity,
      status_notes: submitForApproval ? 'Submitted for review.' : 'Saved as draft.'
    };
    if (eventData.venueId === 'custom') {
      const venueResult = await supabaseService.createOrganizerVenue(currentUser.id, {
        name: eventData.venueName || '',
        city: eventData.city || '',
        address: eventData.venueAddress || '',
        capacity: eventData.capacity || 0,
        contact_person: '',
        contact_phone: '',
        is_online: false
      });
      if (!venueResult.success || !venueResult.data) {
        showNotification(venueResult.error || 'Could not save the custom venue.');
        return false;
      }
      eventRow.venue_id = venueResult.data.id;
      setVenues(prev => [...prev, mapVenue(venueResult.data)]);
    }
    let created: any;
    if (eventData.id) {
      const updateResult = await supabaseService.updateOrganizerEvent(eventData.id, eventRow);
      if (!updateResult.success) {
        showNotification(updateResult.error || 'Could not update event.');
        return false;
      }
      for (const tier of eventData.tiers || []) {
        const tierResult = await supabaseService.saveOrganizerTicketTier(tier);
        if (!tierResult.success) {
          showNotification(tierResult.error || 'Event saved, but a ticket tier could not be updated.');
          return false;
        }
      }
      const refreshed = await supabaseService.fetchOrganizerEvents(currentUser.id);
      if (!refreshed.success || !refreshed.data) {
        showNotification(refreshed.error || 'Event saved, but the refreshed list could not be loaded.');
        return true;
      }
      const mappedEvents = refreshed.data.map(mapOrganizerEvent);
      setOrganizerEvents(mappedEvents);
      created = refreshed.data.find((event: any) => String(event.id) === eventData.id);
    } else {
      const result = await supabaseService.createOrganizerEvent(currentUser.id, {
        ...eventRow,
        tiers: eventData.tiers || []
      });
      if (!result.success || !result.data) {
        showNotification(result.error || 'Could not create event.');
        return false;
      }
      created = result.data;
    }
    if (submitForApproval) {
      const submitResult = await supabaseService.submitEventForReview(String(created.id));
      if (!submitResult.success) {
        showNotification(`Draft saved, but submission failed: ${submitResult.error || 'Unknown error'}`);
      } else {
        created = { ...created, status: 'pending_approval' };
      }
    }
    if (!eventData.id) {
      const refreshed = await supabaseService.fetchOrganizerEvents(currentUser.id);
      if (!refreshed.success || !refreshed.data) {
        showNotification(refreshed.error || 'Event saved, but the updated list could not be loaded.');
        return true;
      }
      setOrganizerEvents(refreshed.data.map(mapOrganizerEvent));
    } else if (submitForApproval && created.status === 'pending_approval') {
      setOrganizerEvents(prev => prev.map(event => event.id === eventData.id ? { ...event, status: 'pending_approval' } : event));
    }
    showNotification(submitForApproval && created.status === 'pending_approval' ? 'Event submitted for review.' : 'Event draft created.');
    return true;
  };

  // Submit existing event for approval
  const handleSubmitForApproval = async (eventId: string) => {
    if (!canManageEvents) return showNotification('Organizer verification is required before submitting events.');
    const result = await supabaseService.submitEventForReview(eventId);
    if (!result.success) {
      showNotification(result.error || 'Could not submit event for review.');
      return;
    }
    setOrganizerEvents(prev => prev.map(event => event.id === eventId ? { ...event, status: 'pending_approval' } : event));
    showNotification('Event submitted for compliance review.');
  };

  // Venue added handler
  const handleAddVenue = async (venue: Venue): Promise<boolean> => {
    if (!currentUser.id) {
      showNotification('Sign in to manage venues.');
      return false;
    }
    if (!canManageEvents) {
      showNotification('Organizer verification is required before managing venues.');
      return false;
    }
    const result = await supabaseService.createOrganizerVenue(currentUser.id, {
      name: venue.name,
      city: venue.city,
      address: venue.address,
      capacity: venue.capacity,
      contact_person: venue.contactPerson,
      contact_phone: venue.contactPhone,
      is_online: venue.isOnline
    });
    if (!result.success || !result.data) {
      showNotification(result.error || 'Could not save venue.');
      return false;
    }
    setVenues(prev => [...prev, mapVenue(result.data)]);
    showNotification(`Venue "${venue.name}" saved.`);
    return true;
  };

  // Staff added handler
  const handleAddStaff = async (staff: EventStaffMember): Promise<boolean> => {
    if (!currentUser.id) {
      showNotification('Sign in to invite event staff.');
      return false;
    }
    if (!canManageEvents) {
      showNotification('Organizer verification is required before inviting staff.');
      return false;
    }
    const result = await supabaseService.inviteOrganizerStaff(currentUser.id, {
      ...staff,
      assignedEventId: staff.assignedEventIds[0] || ''
    });
    if (!result.success || !result.data) {
      showNotification(result.error || 'Could not invite staff member.');
      return false;
    }
    setStaffMembers(prev => [mapStaff(result.data), ...prev]);
    showNotification(`Invitation sent to ${staff.email}.`);
    return true;
  };

  // Ticket tier saved handler
  const handleSaveTier = async (tier: OrganizerTicketTier): Promise<boolean> => {
    if (!canManageEvents) {
      showNotification('Organizer verification is required before managing ticket tiers.');
      return false;
    }
    const event = organizerEvents.find(item => item.id === tier.eventId);
    const isExisting = event?.tiers.some(item => item.id === tier.id) || false;
    const result = await supabaseService.saveOrganizerTicketTier({ ...tier, id: isExisting ? tier.id : '' });
    if (!result.success || !result.data) {
      showNotification(result.error || 'Could not save ticket tier.');
      return false;
    }
    const savedTier = mapTicketTier(result.data);
    setOrganizerEvents(prev => prev.map(item => item.id === tier.eventId ? {
      ...item,
      tiers: isExisting
        ? item.tiers.map(existing => existing.id === savedTier.id ? savedTier : existing)
        : [...item.tiers, savedTier],
      capacity: (isExisting
        ? item.tiers.map(existing => existing.id === savedTier.id ? savedTier : existing)
        : [...item.tiers, savedTier]
      ).reduce((total, existing) => total + existing.totalQuantity, 0)
    } : item));
    setTicketTierModalData(null);
    showNotification(`Ticket tier "${tier.name}" saved.`);
    return true;
  };

  const handleToggleTierActive = async (eventId: string, tierId: string) => {
    if (!canManageEvents) return showNotification('Organizer verification is required before managing ticket tiers.');
    const tier = organizerEvents.find(event => event.id === eventId)?.tiers.find(item => item.id === tierId);
    if (!tier) return;
    const result = await supabaseService.setOrganizerTicketTierActive(tierId, !tier.active);
    if (!result.success) return showNotification(result.error || 'Could not update ticket availability.');
    setOrganizerEvents(prev => prev.map(event => event.id === eventId ? {
      ...event,
      tiers: event.tiers.map(item => item.id === tierId ? { ...item, active: !item.active } : item)
    } : event));
    showNotification('Ticket availability updated.');
  };

  const tabs = [
    { id: 'dashboard' as OrganizerPortalTab, label: 'Overview', icon: LayoutGrid },
    { id: 'events' as OrganizerPortalTab, label: 'Events & Venues', icon: Calendar },
    { id: 'tickets' as OrganizerPortalTab, label: 'Tickets & Pricing', icon: Ticket },
    { id: 'attendees' as OrganizerPortalTab, label: 'Attendees & Staff', icon: Users },
    { id: 'analytics' as OrganizerPortalTab, label: 'Analytics', icon: BarChart3 },
    { id: 'registration' as OrganizerPortalTab, label: 'Registration & Verification', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastNotice && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-[#1d0b25] border border-[#8b7bff]/80 text-white shadow-2xl flex items-center gap-3 animate-fadeIn max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold flex-1">{toastNotice}</p>
        </div>
      )}
      {loadError && (
        <p role="alert" className="rounded-xl border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">{loadError}</p>
      )}

      {/* Organizer Portal Sub-navigation Bar */}
      <div className="p-1.5 rounded-2xl bg-[#150718] border border-[#34143e] flex items-center gap-1 overflow-x-auto shadow-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#3e347d] to-[#50135d] text-white shadow-md border border-[#8b7bff]/40'
                  : 'text-[#9c89a7] hover:text-white hover:bg-[#200c28]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#a78bfa]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'dashboard' && (
          <OrganizerDashboardSection
            events={organizerEvents}
            activityLog={activityLog}
            onOpenCreateWizard={() => { setEditingEvent(null); setShowCreateWizard(true); }}
            onNavigateToTab={(t) => setActiveTab(t as any)}
            onSelectEvent={(evt) => {
              // Switch to events tab
              setActiveTab('events');
            }}
          />
        )}

        {activeTab === 'events' && (
          <OrganizerEventsSection
            events={organizerEvents}
            onOpenCreateWizard={() => { setEditingEvent(null); setShowCreateWizard(true); }}
            onOpenVenueManager={() => setShowVenueManager(true)}
            onEditEvent={(evt) => {
              setEditingEvent(evt);
              setShowCreateWizard(true);
            }}
            onSubmitForApproval={handleSubmitForApproval}
            onManageTickets={(evt) => {
              setActiveTab('tickets');
            }}
          />
        )}

        {activeTab === 'tickets' && (
          <OrganizerTicketsSection
            events={organizerEvents}
            onOpenAddTier={(evt) => setTicketTierModalData({ event: evt, tier: null })}
            onEditTier={(evt, tier) => setTicketTierModalData({ event: evt, tier })}
            onToggleTierActive={handleToggleTierActive}
          />
        )}

        {activeTab === 'attendees' && (
          <OrganizerAttendeesStaffSection
            attendees={attendees}
            staffMembers={staffMembers}
            events={organizerEvents}
            onOpenInviteStaff={() => setShowStaffInvite(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <OrganizerAnalyticsSection
            events={organizerEvents}
          />
        )}

        {activeTab === 'registration' && (
          <OrganizerRegistrationSection
            application={application}
            userId={currentUser.id}
            onUpdateApplication={async (updated) => {
              if (!currentUser.id) {
                showNotification('Sign in to submit an organizer application.');
                return false;
              }
              const result = await supabaseService.submitOrganizerApplication({
                display_name: updated.organizationName,
                legal_name: updated.legalName,
                organizer_type: updated.organizationType,
                registration_number: updated.registrationNumber || null,
                contact_email: updated.email,
                contact_phone: updated.phone,
                address: updated.physicalAddress || null,
                website: updated.website,
                social_links: updated.socialLinks || {},
                description: updated.description || null
              });
              if (!result.success || !result.data) {
                showNotification(result.error || 'Could not submit organizer application.');
                return false;
              }
              setApplication(mapApplication(result.data));
              showNotification('Organizer application submitted.');
              return true;
            }}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateWizard && (
        <EventCreationWizard
          venues={venues}
          initialEvent={editingEvent || undefined}
          onClose={() => { setShowCreateWizard(false); setEditingEvent(null); }}
          onSubmitEvent={handleEventCreated}
        />
      )}

      {showVenueManager && (
        <VenueManagerModal
          venues={venues}
          onClose={() => setShowVenueManager(false)}
          onAddVenue={handleAddVenue}
        />
      )}

      {showStaffInvite && (
        <StaffInviteModal
          events={organizerEvents}
          onClose={() => setShowStaffInvite(false)}
          onAddStaff={handleAddStaff}
        />
      )}

      {ticketTierModalData && (
        <TicketTierModal
          tier={ticketTierModalData.tier}
          eventId={ticketTierModalData.event.id}
          eventTitle={ticketTierModalData.event.title}
          onClose={() => setTicketTierModalData(null)}
          onSaveTier={handleSaveTier}
        />
      )}
    </div>
  );
};

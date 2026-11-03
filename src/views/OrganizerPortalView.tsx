import React, { useState } from 'react';
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
  EventItem 
} from '../types';
import { 
  INITIAL_ORGANIZER_EVENTS, 
  INITIAL_VENUES, 
  INITIAL_APPLICATION, 
  INITIAL_STAFF_MEMBERS, 
  INITIAL_ATTENDEES, 
  INITIAL_ACTIVITY_LOG 
} from '../data/organizerData';
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

interface OrganizerPortalViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export type OrganizerPortalTab = 
  | 'dashboard' 
  | 'events' 
  | 'tickets' 
  | 'attendees' 
  | 'analytics' 
  | 'registration';

export const OrganizerPortalView: React.FC<OrganizerPortalViewProps> = ({
  events: publicEvents,
  onSelectEvent
}) => {
  const [activeTab, setActiveTab] = useState<OrganizerPortalTab>('dashboard');

  // State collections
  const [organizerEvents, setOrganizerEvents] = useState<OrganizerEvent[]>(INITIAL_ORGANIZER_EVENTS);
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [staffMembers, setStaffMembers] = useState<EventStaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [attendees, setAttendees] = useState<AttendeeRecord[]>(INITIAL_ATTENDEES);
  const [application, setApplication] = useState<OrganizerApplication>(INITIAL_APPLICATION);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITY_LOG);

  // Modals state
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showVenueManager, setShowVenueManager] = useState(false);
  const [showStaffInvite, setShowStaffInvite] = useState(false);
  const [ticketTierModalData, setTicketTierModalData] = useState<{
    event: OrganizerEvent;
    tier?: OrganizerTicketTier | null;
  } | null>(null);

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Event creation handler from 6-step wizard
  const handleEventCreated = (eventData: Partial<OrganizerEvent>, submitForApproval: boolean) => {
    const newEvent: OrganizerEvent = {
      id: `org-evt-${Date.now()}`,
      organizationId: 'org-mandala-music',
      title: eventData.title || 'Untitled Production',
      tagline: eventData.tagline || '',
      description: eventData.description || '',
      category: eventData.category || 'music',
      city: eventData.city || 'Lilongwe',
      venueId: eventData.venueId || 'ven-01',
      venueName: eventData.venueName || 'Selected Venue',
      startDate: eventData.startDate || '2026-12-01',
      startTime: eventData.startTime || '18:00',
      endDate: eventData.endDate || '2026-12-01',
      endTime: eventData.endTime || '23:00',
      doorsOpen: eventData.doorsOpen || '17:00 CAT',
      ageRestriction: eventData.ageRestriction || 'All Ages Welcome',
      status: submitForApproval ? 'pending_approval' : 'draft',
      statusNotes: submitForApproval 
        ? 'Submitted for compliance review and regulatory clearance.'
        : 'Saved as draft in your organiser dashboard.',
      image: eventData.image || '/src/assets/images/event_blantyre_jazz_1793689057469.jpg',
      ticketsSold: 0,
      capacity: eventData.capacity || 500,
      grossRevenueMWK: 0,
      tiers: eventData.tiers || [],
      createdAt: new Date().toLocaleDateString('en-GB'),
      updatedAt: new Date().toLocaleDateString('en-GB')
    };

    setOrganizerEvents([newEvent, ...organizerEvents]);

    // Prepend to activity log
    const newLog = {
      id: `act-${Date.now()}`,
      title: submitForApproval ? 'Event Submitted for Review' : 'Event Draft Created',
      description: `"${newEvent.title}" was ${submitForApproval ? 'submitted for verification' : 'saved as draft'}.`,
      timestamp: 'Just now',
      type: 'event'
    };
    setActivityLog([newLog, ...activityLog]);

    showNotification(
      submitForApproval 
        ? `"${newEvent.title}" submitted for platform compliance review!`
        : `"${newEvent.title}" saved to your drafts.`
    );
  };

  // Submit existing event for approval
  const handleSubmitForApproval = (eventId: string) => {
    setOrganizerEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'pending_approval',
          statusNotes: 'Submitted for administrative compliance review.'
        };
      }
      return evt;
    }));

    showNotification('Event submitted for compliance review.');
  };

  // Venue added handler
  const handleAddVenue = (venue: Venue) => {
    setVenues([...venues, venue]);
    showNotification(`Venue "${venue.name}" successfully added to your organisation.`);
  };

  // Staff added handler
  const handleAddStaff = (staff: EventStaffMember) => {
    setStaffMembers([staff, ...staffMembers]);
    showNotification(`Staff invitation sent to ${staff.name} (${staff.role.replace('_', ' ')}).`);
  };

  // Ticket tier saved handler
  const handleSaveTier = (tierPayload: OrganizerTicketTier) => {
    setOrganizerEvents(prev => prev.map(evt => {
      if (evt.id === tierPayload.eventId) {
        const existingIdx = evt.tiers.findIndex(t => t.id === tierPayload.id);
        let updatedTiers: OrganizerTicketTier[];
        if (existingIdx >= 0) {
          updatedTiers = [...evt.tiers];
          updatedTiers[existingIdx] = tierPayload;
        } else {
          updatedTiers = [...evt.tiers, tierPayload];
        }

        const totalCap = updatedTiers.reduce((s, t) => s + Number(t.totalQuantity || 0), 0);
        return {
          ...evt,
          tiers: updatedTiers,
          capacity: totalCap > 0 ? totalCap : evt.capacity
        };
      }
      return evt;
    }));

    showNotification(`Ticket tier "${tierPayload.name}" successfully saved.`);
  };

  const handleToggleTierActive = (eventId: string, tierId: string) => {
    setOrganizerEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const updatedTiers = evt.tiers.map(t => {
          if (t.id === tierId) {
            return { ...t, active: !t.active };
          }
          return t;
        });
        return { ...evt, tiers: updatedTiers };
      }
      return evt;
    }));

    showNotification('Ticket tier availability toggled.');
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
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-[#1d0b25] border border-[#f43f5e]/80 text-white shadow-2xl flex items-center gap-3 animate-fadeIn max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold flex-1">{toastNotice}</p>
        </div>
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
                  ? 'bg-gradient-to-r from-[#831843] to-[#50135d] text-white shadow-md border border-[#f43f5e]/40'
                  : 'text-[#9c89a7] hover:text-white hover:bg-[#200c28]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#f472b6]' : ''}`} />
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
            onOpenCreateWizard={() => setShowCreateWizard(true)}
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
            onOpenCreateWizard={() => setShowCreateWizard(true)}
            onOpenVenueManager={() => setShowVenueManager(true)}
            onEditEvent={(evt) => {
              showNotification(`Opening event editor for "${evt.title}".`);
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
            onUpdateApplication={(updated) => {
              setApplication(updated);
              showNotification('Organiser registration profile updated.');
            }}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateWizard && (
        <EventCreationWizard
          venues={venues}
          onClose={() => setShowCreateWizard(false)}
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

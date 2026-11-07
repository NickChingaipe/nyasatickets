/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { DesktopSidebar, NavTab } from './components/layout/DesktopSidebar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { Header } from './components/layout/Header';
import { OverviewView } from './views/OverviewView';
import { DiscoverView } from './views/DiscoverView';
import { TicketsView } from './views/TicketsView';
import { ProfileView } from './views/ProfileView';
import { OrganizerPortalView } from './views/OrganizerPortalView';
import { AdminPortalView } from './views/admin/AdminPortalView';
import { EventDetailsView } from './views/EventDetailsView';
import { ScanQrCodeView } from './views/ScanQrCodeView';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { LegalModal } from './components/modals/LegalModal';
import { AuthModal } from './components/auth/AuthModal';
import { isSupabaseConfigured, supabaseService } from './lib/supabase';
import { EventItem, EventCategory, TicketBooking, TicketTier, UserProfile } from './types';
import { CheckCircle2, X } from 'lucide-react';

const mapEventRow = (row: Record<string, any>): EventItem => {
  const venue = Array.isArray(row.venues) ? row.venues[0] : row.venues;
  const category = Array.isArray(row.event_categories) ? row.event_categories[0] : row.event_categories;
  const ticketRows = row.event_ticket_types || [];
  const startDate = new Date(row.starts_at || row.start_date || row.startDate);
  const dateTimestamp = startDate.getTime();
  const tiers: TicketTier[] = ticketRows.map((ticket: Record<string, any>) => {
    const capacity = Number(ticket.quantity_total ?? ticket.quantity ?? ticket.capacity ?? 0);
    const sold = Number(ticket.quantity_sold ?? ticket.sold_quantity ?? 0);
    const reserved = Number(ticket.quantity_reserved ?? ticket.reserved_quantity ?? 0);
    return {
      id: String(ticket.id),
      name: ticket.name || ticket.title || 'General Admission',
      priceMWK: Number(ticket.price ?? ticket.price_mwk ?? 0),
      description: ticket.description || '',
      perks: ticket.perks || [],
      remaining: Math.max(0, capacity - sold - reserved),
      capacity
    };
  });
  const priceMWK = tiers.length
    ? Math.min(...tiers.map(tier => tier.priceMWK))
    : Number(row.price_mwk ?? row.price ?? 0);
  const dateDisplay = Number.isNaN(dateTimestamp)
    ? String(row.starts_at || row.start_date || row.startDate || '')
    : new Intl.DateTimeFormat('en-MW', { dateStyle: 'medium' }).format(startDate);
  const terms = typeof row.terms_and_conditions === 'string'
    ? row.terms_and_conditions.split('\n').filter(Boolean)
    : row.terms_and_conditions || [];

  return {
    id: String(row.id),
    title: row.title || row.name || '',
    tagline: row.short_description || row.tagline || '',
    description: row.description || '',
    category: (category?.slug || category?.name || row.category || 'music').toLowerCase(),
    categoryLabel: category?.name || row.category || 'Events',
    city: venue?.city || row.city || '',
    venue: venue?.name || row.venue_name || row.venue || '',
    dateDisplay,
    timeDisplay: row.starts_at
      ? new Intl.DateTimeFormat('en-MW', { timeZone: 'Africa/Blantyre', hour: '2-digit', minute: '2-digit' }).format(startDate)
      : row.start_time || row.startTime || '',
    dateTimestamp: Number.isNaN(dateTimestamp) ? 0 : dateTimestamp,
    doorsOpen: row.doors_open_at || row.doors_open || row.doorsOpen,
    ageRestriction: row.age_restriction || row.ageRestriction,
    lineup: row.lineup || [],
    termsAndConditions: terms,
    priceMWK,
    priceDisplay: `MWK ${priceMWK.toLocaleString()}`,
    image: row.cover_image_path || row.image_url || row.image || '',
    status: dateTimestamp && dateTimestamp < Date.now()
      ? 'past'
      : tiers.length > 0 && tiers.every(tier => tier.remaining === 0)
        ? 'sold_out'
        : 'upcoming',
    featured: Boolean(row.featured),
    organizer: {
      id: String(row.organizer_id || ''),
      name: row.organizer_name || '',
      verified: false
    },
    tiers
  };
};

const mapOrderRow = (
  row: Record<string, any>,
  customer: Pick<UserProfile, 'name' | 'email' | 'phone'> = { name: '', email: '', phone: '' }
): TicketBooking => {
  const event = Array.isArray(row.events) ? row.events[0] : row.events || {};
  const venue = Array.isArray(event.venues) ? event.venues[0] : event.venues || {};
  const itemRows = row.order_items || [];
  const item = Array.isArray(itemRows) ? itemRows[0] || {} : itemRows;
  const createdAt = row.created_at ? new Date(row.created_at) : new Date();
  const status = row.status === 'confirmed' || row.status === 'paid'
    ? 'confirmed'
    : row.status === 'used' || row.status === 'checked_in'
      ? 'used'
      : row.status === 'cancelled' || row.status === 'refunded'
        ? 'cancelled'
        : 'pending_payment';

  return {
    id: String(row.id),
    referenceNumber: String(row.order_number || row.reference_number || row.reference || row.id),
    eventId: String(row.event_id || event.id || ''),
    eventTitle: event.title || event.name || '',
    eventDate: event.starts_at
      ? new Intl.DateTimeFormat('en-MW', { timeZone: 'Africa/Blantyre', dateStyle: 'medium' }).format(new Date(event.starts_at))
      : event.start_date ? new Intl.DateTimeFormat('en-MW', { dateStyle: 'medium' }).format(new Date(event.start_date)) : '',
    eventTime: event.starts_at
      ? new Intl.DateTimeFormat('en-MW', { timeZone: 'Africa/Blantyre', hour: '2-digit', minute: '2-digit' }).format(new Date(event.starts_at))
      : event.start_time || '',
    venue: venue.name || event.venue_name || '',
    city: venue.city || event.city || '',
    tierName: item.ticket_name || item.name || row.ticket_type_name || '',
    quantity: Number(item.quantity ?? row.quantity ?? 0),
    unitPriceMWK: Number(item.unit_price ?? row.unit_price_mwk ?? 0),
    serviceFeeMWK: Number(row.fees ?? row.service_fee_mwk ?? 0),
    totalMWK: Number(row.total ?? row.total_mwk ?? row.total_amount ?? 0),
    customerName: row.customer_name || customer.name,
    customerEmail: row.customer_email || customer.email,
    customerPhone: row.customer_phone || customer.phone,
    status,
    purchaseDate: new Intl.DateTimeFormat('en-MW', { dateStyle: 'medium' }).format(createdAt),
    image: event.cover_image_path || event.image_url || event.image || ''
  };
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dedicated Event Details Page state
  const [activeEventDetails, setActiveEventDetails] = useState<EventItem | null>(null);

  // Ticket Checkout Interface state
  const [checkoutData, setCheckoutData] = useState<{ event: EventItem; tier?: TicketTier } | null>(null);

  // Legal Modal
  const [legalModalType, setLegalModalType] = useState<'help' | 'terms' | 'privacy' | null>(null);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoadError, setEventsLoadError] = useState<string | null>(null);

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<
    { type: 'tab'; tab: NavTab } | { type: 'checkout'; event: EventItem; initialTier?: TicketTier } | null
  >(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '', email: '', phone: '', city: '', avatar: '', role: 'customer',
    isOrganizer: false, isAdmin: false, notificationEmail: true, notificationSms: true,
    savedEventIds: [], preferredPayment: 'airtel_money'
  });
  const [userTickets, setUserTickets] = useState<TicketBooking[]>([]);
  const [ticketsLoadError, setTicketsLoadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const activeTicketCount = userTickets.filter(ticket => ticket.status === 'confirmed' || ticket.status === 'pending_payment').length;
  const savedEventsList = events.filter(event => userProfile.savedEventIds.includes(event.id));

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSaveEvent = async (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!userProfile.id) {
      showToast('Sign in to save events.');
      return;
    }
    const isSaved = userProfile.savedEventIds.includes(eventId);
    const savedEventIds = isSaved
      ? userProfile.savedEventIds.filter(id => id !== eventId)
      : [...userProfile.savedEventIds, eventId];
    const result = await supabaseService.updateProfile(userProfile.id, {
      full_name: userProfile.name,
      phone: userProfile.phone,
      city: userProfile.city,
      bio: userProfile.bio || '',
      notification_email: userProfile.notificationEmail,
      notification_sms: userProfile.notificationSms,
      saved_event_ids: savedEventIds
    });
    if (!result.success) {
      showToast(result.error || 'Could not save this event.');
      return;
    }
    setUserProfile(prev => ({ ...prev, savedEventIds }));
    showToast(result.warning || (isSaved ? 'Removed from saved events' : 'Event saved to your profile'));
  };

  const handleSelectEvent = (event: EventItem) => {
    setActiveEventDetails(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCheckout = (event: EventItem, initialTier?: TicketTier) => {
    if (!userProfile.id) {
      setPendingAuthAction({ type: 'checkout', event, initialTier });
      setIsAuthModalOpen(true);
      return;
    }
    setCheckoutData({ event, tier: initialTier });
  };

  const handleSelectTab = (tab: NavTab) => {
    if (!userProfile.id && ['tickets', 'profile', 'organizer', 'admin'].includes(tab)) {
      setPendingAuthAction({ type: 'tab', tab });
      setIsAuthModalOpen(true);
      return;
    }
    setActiveEventDetails(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadCustomerTickets = async (
    userId: string,
    customer: Pick<UserProfile, 'name' | 'email' | 'phone'> = userProfile
  ) => {
    const result = await supabaseService.fetchCustomerOrders(userId);
    if (!result.success || !result.data) {
      setTicketsLoadError(result.error || 'Could not load your orders.');
      return;
    }
    setUserTickets(result.data.map((row: Record<string, any>) => mapOrderRow(row, customer)));
    setTicketsLoadError(null);
  };

  const handleOrderConfirmed = (booking: TicketBooking) => {
    setUserTickets(prev => [booking, ...prev]);
    if (userProfile.id) void loadCustomerTickets(userProfile.id);
    setActiveEventDetails(null);
    setCurrentTab('tickets');
    showToast(booking.paymentNotice?.startsWith('Order created, but')
      ? booking.paymentNotice
      : `Order created! Reservation ref #${booking.referenceNumber} is in My Tickets`);
  };

  const handleNavigateToDiscover = (category?: EventCategory, city?: string) => {
    setActiveEventDetails(null);
    if (category) setFilterCategory(category);
    if (city) setFilterCity(city);
    setCurrentTab('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = () => {
    setActiveEventDetails(null);
    setCurrentTab('discover');
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (!userProfile.id) return false;
    const nextProfile = { ...userProfile, ...updated };
    const result = await supabaseService.updateProfile(userProfile.id, {
      full_name: nextProfile.name,
      phone: nextProfile.phone,
      city: nextProfile.city,
      bio: nextProfile.bio || '',
      notification_email: nextProfile.notificationEmail,
      notification_sms: nextProfile.notificationSms,
      saved_event_ids: nextProfile.savedEventIds
    });
    if (!result.success) {
      showToast(result.error || 'Could not update your profile.');
      return false;
    }
    setUserProfile(nextProfile);
    if (result.warning) showToast(result.warning);
    return true;
  };

  const handleChangeEmail = (email: string) => supabaseService.updateAuthEmail(email);

  const handleLogout = async () => {
    const result = await supabaseService.signOut();
    if (!result.success) {
      showToast(result.error || 'Could not sign out.');
      return;
    }
    setUserProfile({
      name: '', email: '', phone: '', city: '', avatar: '', role: 'customer',
      isOrganizer: false, isAdmin: false, notificationEmail: true, notificationSms: true,
      savedEventIds: [], preferredPayment: 'airtel_money'
    });
    setUserTickets([]);
    setActiveEventDetails(null);
    setCurrentTab('overview');
    showToast('You have been logged out.');
  };

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      if (!isSupabaseConfigured) {
        setEventsLoadError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load events.');
        return;
      }
      const session = await supabaseService.getCurrentSession();
      if (session?.user && active) {
        const profile = await supabaseService.getProfile(session.user.id);
        const row = profile || {};
        const role = await supabaseService.getUserRole(session.user.id) || 'customer';
        const metadata = session.user.user_metadata || {};
        const name = row.display_name || row.full_name || row.name || metadata.full_name || metadata.name || '';
        const loggedInProfile: UserProfile = {
          id: session.user.id,
          name,
          email: session.user.email || '',
          phone: row.phone || metadata.phone || '',
          city: row.city || metadata.city || '',
          avatar: name.substring(0, 2).toUpperCase(),
          role,
          isOrganizer: role === 'organizer',
          isAdmin: role === 'admin' || role === 'super_admin',
          bio: row.bio || '',
          notificationEmail: row.notification_email ?? true,
          notificationSms: row.notification_sms ?? false,
          savedEventIds: row.saved_event_ids || [],
          preferredPayment: row.preferred_payment || 'airtel_money'
        };
        setUserProfile(loggedInProfile);
        void loadCustomerTickets(session.user.id, loggedInProfile);
      }
      const rows = await supabaseService.fetchEvents();
      if (!active) return;
      if (!rows) setEventsLoadError('Events could not be loaded from Supabase.');
      else setEvents(rows.map(mapEventRow));
    };
    void loadEvents();
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0510] text-[#fbf9fd] flex">
      {/* 1. Desktop Persistent & Collapsible Sidebar */}
      <DesktopSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenLegal={(type) => setLegalModalType(type)}
        activeTicketCount={activeTicketCount}
        currentUser={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Dynamic Page Views Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 md:pb-12">
          {eventsLoadError && (
            <div role="status" className="max-w-7xl mx-auto mb-4 rounded-xl border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
              {eventsLoadError}
            </div>
          )}
          {/* If an event is selected, render dedicated EventDetailsView */}
          {activeEventDetails ? (
            <EventDetailsView
              event={activeEventDetails}
              onBack={() => setActiveEventDetails(null)}
              onStartCheckout={handleStartCheckout}
              isSaved={userProfile.savedEventIds.includes(activeEventDetails.id)}
              onToggleSave={handleToggleSaveEvent}
            />
          ) : (
            <>
              {currentTab === 'overview' && (
                <OverviewView
                  events={events}
                  onSelectEvent={handleSelectEvent}
                  onNavigateToDiscover={handleNavigateToDiscover}
                  savedEventIds={userProfile.savedEventIds}
                  onToggleSaveEvent={handleToggleSaveEvent}
                />
              )}

              {currentTab === 'discover' && (
                <DiscoverView
                  events={events}
                  onSelectEvent={handleSelectEvent}
                  initialCategory={filterCategory}
                  initialCity={filterCity}
                  initialSearchQuery={searchQuery}
                  savedEventIds={userProfile.savedEventIds}
                  onToggleSaveEvent={handleToggleSaveEvent}
                />
              )}

              {currentTab === 'tickets' && (
                <TicketsView
                  tickets={userTickets}
                  onNavigateToDiscover={() => handleNavigateToDiscover()}
                  loadError={ticketsLoadError}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileView
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onChangeEmail={handleChangeEmail}
                  savedEvents={savedEventsList}
                  onSelectEvent={handleSelectEvent}
                  onToggleSaveEvent={handleToggleSaveEvent}
                  onLogout={handleLogout}
                />
              )}

              {currentTab === 'scan' && <ScanQrCodeView />}

              {currentTab === 'organizer' && (
                <OrganizerPortalView
                  events={events}
                  onSelectEvent={handleSelectEvent}
                  currentUser={userProfile}
                />
              )}

              {currentTab === 'admin' && (
                <AdminPortalView
                  currentUser={userProfile}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. Floating Mobile Bottom Navigation */}
      <MobileNavigation
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        activeTicketCount={activeTicketCount}
      />

      {/* 4. Ticket Purchasing & Checkout Interface */}
      {checkoutData && (
        <CheckoutModal
          event={checkoutData.event}
          initialTier={checkoutData.tier}
          onClose={() => setCheckoutData(null)}
          onOrderConfirmed={handleOrderConfirmed}
          customerProfileName={userProfile.name}
          customerProfileEmail={userProfile.email}
          customerProfilePhone={userProfile.phone}
        />
      )}

      {/* 5. Authentication & Quick Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAuthAction(null);
        }}
        onLoginSuccess={async (profile) => {
          const action = pendingAuthAction;
          setPendingAuthAction(null);
          setUserProfile(profile);
          if (profile.id) await loadCustomerTickets(profile.id);
          if (action?.type === 'checkout') {
            setCheckoutData({ event: action.event, tier: action.initialTier });
          } else if (action?.type === 'tab') {
            setActiveEventDetails(null);
            setCurrentTab(action.tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (profile.role === 'admin' || profile.role === 'super_admin') {
            setCurrentTab('admin');
          } else if (profile.role === 'organizer') {
            setCurrentTab('organizer');
          }
        }}
        onShowToast={showToast}
      />

      {/* 6. Legal & Customer Support Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-[#1b0b21] border border-[#8b7bff]/60 text-white shadow-2xl flex items-center gap-3 animate-fadeIn max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold flex-1">{toastMessage}</p>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-[#9e8aa7] hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { LegalModal } from './components/modals/LegalModal';
import { AuthModal, DEMO_PROFILES } from './components/auth/AuthModal';
import { MOCK_EVENTS } from './data/events';
import { INITIAL_USER_TICKETS } from './data/mockTickets';
import { EventItem, EventCategory, TicketBooking, TicketTier, UserProfile } from './types';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dedicated Event Details Page state
  const [activeEventDetails, setActiveEventDetails] = useState<EventItem | null>(null);

  // Ticket Checkout Interface state
  const [checkoutData, setCheckoutData] = useState<{
    event: EventItem;
    tier?: TicketTier;
  } | null>(null);

  // Legal Modal
  const [legalModalType, setLegalModalType] = useState<'help' | 'terms' | 'privacy' | null>(null);

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Customer Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Chikondi Banda',
    email: 'chikondi.banda@nyasamail.mw',
    phone: '+265 99 123 4567',
    city: 'Blantyre',
    avatar: 'CB',
    role: 'customer',
    isOrganizer: false,
    isAdmin: false,
    bio: 'Malawian live music enthusiast, Lake of Stars patron, and cultural arts supporter.',
    notificationEmail: true,
    notificationSms: true,
    savedEventIds: ['evt-los-2026', 'evt-blantyre-jazz'],
    preferredPayment: 'airtel_money'
  });

  const handleSwitchToAdminRole = () => {
    setUserProfile(DEMO_PROFILES[2].profile);
    showToast('Switched to Super Admin (Thokozani Phiri) - Authority granted.');
  };

  // User Tickets State
  const [userTickets, setUserTickets] = useState<TicketBooking[]>(INITIAL_USER_TICKETS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter state for navigation handoff
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');
  const [filterCity, setFilterCity] = useState<string>('all');

  const activeTicketCount = userTickets.filter(t => t.status === 'confirmed' || t.status === 'pending_payment').length;
  const savedEventsList = MOCK_EVENTS.filter(e => userProfile.savedEventIds.includes(e.id));

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSaveEvent = (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUserProfile(prev => {
      const isSaved = prev.savedEventIds.includes(eventId);
      const nextSaved = isSaved 
        ? prev.savedEventIds.filter(id => id !== eventId) 
        : [...prev.savedEventIds, eventId];
      
      showToast(isSaved ? 'Removed from saved events' : 'Event saved to your profile');
      return { ...prev, savedEventIds: nextSaved };
    });
  };

  const handleSelectEvent = (event: EventItem) => {
    setActiveEventDetails(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCheckout = (event: EventItem, initialTier?: TicketTier) => {
    setCheckoutData({ event, tier: initialTier });
  };

  const handleOrderConfirmed = (booking: TicketBooking) => {
    setUserTickets(prev => [booking, ...prev]);
    setActiveEventDetails(null);
    setCurrentTab('tickets');
    showToast(`Order created! Reservation ref #${booking.referenceNumber} is in My Tickets`);
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

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updated }));
  };

  const handleLogout = () => {
    setUserProfile(prev => ({
      ...prev,
      name: 'Guest User',
      email: 'guest@nyasatickets.mw',
      phone: '+265 00 000 0000',
      bio: ''
    }));
    setActiveEventDetails(null);
    setCurrentTab('overview');
    showToast('You have been logged out. Browsing as Guest.');
  };

  return (
    <div className="min-h-screen bg-[#0d0510] text-[#fbf9fd] flex">
      {/* 1. Desktop Persistent & Collapsible Sidebar */}
      <DesktopSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveEventDetails(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenLegal={(type) => setLegalModalType(type)}
        activeTicketCount={activeTicketCount}
        currentUser={userProfile}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setActiveEventDetails(null);
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeTicketCount={activeTicketCount}
          currentUser={userProfile}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Dynamic Page Views Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 md:pb-12">
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
                  events={MOCK_EVENTS}
                  onSelectEvent={handleSelectEvent}
                  onNavigateToDiscover={handleNavigateToDiscover}
                  savedEventIds={userProfile.savedEventIds}
                  onToggleSaveEvent={handleToggleSaveEvent}
                />
              )}

              {currentTab === 'discover' && (
                <DiscoverView
                  events={MOCK_EVENTS}
                  onSelectEvent={handleSelectEvent}
                  initialCategory={filterCategory}
                  initialCity={filterCity}
                  savedEventIds={userProfile.savedEventIds}
                  onToggleSaveEvent={handleToggleSaveEvent}
                />
              )}

              {currentTab === 'tickets' && (
                <TicketsView
                  tickets={userTickets}
                  onNavigateToDiscover={() => handleNavigateToDiscover()}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileView
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  savedEvents={savedEventsList}
                  onSelectEvent={handleSelectEvent}
                  onNavigateToOrganizer={() => setCurrentTab('organizer')}
                  onNavigateToAdmin={() => setCurrentTab('admin')}
                  onToggleSaveEvent={handleToggleSaveEvent}
                  onLogout={handleLogout}
                />
              )}

              {currentTab === 'organizer' && (
                <OrganizerPortalView
                  events={MOCK_EVENTS}
                  onSelectEvent={handleSelectEvent}
                />
              )}

              {currentTab === 'admin' && (
                <AdminPortalView
                  currentUser={userProfile}
                  onSwitchToAdminRole={handleSwitchToAdminRole}
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
        onSelectTab={(tab) => {
          setActiveEventDetails(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={userProfile}
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          if (profile.role === 'admin' || profile.role === 'super_admin') {
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
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-[#1b0b21] border border-[#f43f5e]/60 text-white shadow-2xl flex items-center gap-3 animate-fadeIn max-w-sm">
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

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  X, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  Ticket, 
  User, 
  BriefcaseBusiness, 
  LogOut, 
  Settings,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from './DesktopSidebar';
import { Logo } from '../common/Logo';
import { UserProfile } from '../../types';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  activeTicketCount: number;
  currentUser?: UserProfile;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isSidebarCollapsed,
  onToggleSidebar,
  activeTicketCount,
  currentUser,
  onOpenAuth
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'Overview';
      case 'discover':
        return 'Discover Events';
      case 'tickets':
        return 'My Tickets';
      case 'profile':
        return 'My Profile';
      case 'organizer':
        return 'Organizer Workspace';
      case 'admin':
        return 'Administration & Moderation';
      default:
        return 'Overview';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-[#0e0612]/85 border-b border-[#260e2b] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Brand / Page Title */}
      <div className="flex items-center gap-3">
        {/* On Mobile: Display Mini Logo */}
        <div className="md:hidden">
          <Logo collapsed={true} onClick={() => onSelectTab('overview')} />
        </div>

        {/* Desktop Breadcrumb Title */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-[#9f8ca7]">
            <span 
              onClick={() => onSelectTab('overview')} 
              className="hover:text-white cursor-pointer transition-colors"
            >
              NyasaTickets
            </span>
            <span className="text-[#644f6f]">/</span>
            <span className="text-[#f5edf8] font-medium">{getBreadcrumbTitle()}</span>
          </div>
          <h1 className="text-lg font-display font-bold text-white tracking-tight -mt-0.5">
            {getBreadcrumbTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Prominent Search Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e7a98] group-focus-within:text-[#f43f5e] transition-colors">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search events, artists, venues..."
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-[#1b0b21]/90 border border-[#3b1746] text-white placeholder-[#85718f] focus:outline-none focus:border-[#f43f5e] focus:ring-1 focus:ring-[#f43f5e] transition-all"
          />

          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9583a0] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden lg:flex absolute inset-y-0 right-0 pr-3 items-center pointer-events-none">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2a1133] text-[#9a86a6] border border-[#431952]">
                ↵
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Notifications & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setUnreadNotifications(0);
            }}
            className="relative p-2 rounded-xl text-[#ad9cb4] hover:text-white hover:bg-[#230d2b] border border-transparent hover:border-[#381643] transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f43f5e] ring-2 ring-[#0e0612]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#170a1c] border border-[#3f184e] shadow-2xl p-4 z-50 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#2d1237]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-display font-bold text-white">Notifications</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#831843]/60 text-[#fca5a5] border border-[#f43f5e]/30">
                    Live updates
                  </span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#9f8ea8] hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="divide-y divide-[#270f30] mt-1 max-h-72 overflow-y-auto">
                <div className="py-3 flex gap-3 hover:bg-[#210c28]/60 p-2 rounded-xl transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#831843]/40 border border-[#f43f5e]/30 flex items-center justify-center text-[#f43f5e] shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Lake of Stars Tickets Confirmed</p>
                    <p className="text-[#a492ae] mt-0.5">Your 2 VIP passes are saved in My Tickets with quick QR pass.</p>
                    <span className="text-[10px] text-[#786481] mt-1 block">15 minutes ago</span>
                  </div>
                </div>

                <div className="py-3 flex gap-3 hover:bg-[#210c28]/60 p-2 rounded-xl transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#581c87]/40 border border-[#c084fc]/30 flex items-center justify-center text-[#c084fc] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Blantyre Jazz Festival Early Bird</p>
                    <p className="text-[#a492ae] mt-0.5">Exclusive front tables are 70% booked for next Saturday.</p>
                    <span className="text-[10px] text-[#786481] mt-1 block">2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-[#2d1237] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTab('tickets');
                  }}
                  className="text-xs text-[#f43f5e] hover:text-[#fb7185] font-medium cursor-pointer"
                >
                  View My Tickets & Passes →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#1b0b21] hover:bg-[#270f2f] border border-[#3b1746] transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#9f1239] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xs shadow-md">
              {currentUser?.avatar || 'CB'}
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-white max-w-[110px] truncate">
              {currentUser?.name ? currentUser.name.split(' ')[0] : 'Chikondi'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9a86a3] group-hover:text-white transition-colors" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#16081b] border border-[#3d184b] shadow-2xl p-2 z-50">
              {/* Profile Card Header */}
              <div className="p-3 rounded-xl bg-[#220d2b] border border-[#441a54] mb-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-display font-bold text-white truncate">
                    {currentUser?.name || 'Chikondi Banda'}
                  </p>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#831843] text-white">
                    {currentUser?.role || 'customer'}
                  </span>
                </div>
                <p className="text-xs text-[#9c89a6] truncate">{currentUser?.email || 'chikondi.banda@nyasamail.mw'}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#c9b7d3]">
                  <span>Active Passes:</span>
                  <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#831843]/60 text-[#fca5a5]">
                    {activeTicketCount}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectTab('profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#d3c3dc] hover:text-white hover:bg-[#270f30] transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-[#f43f5e]" />
                  <span>My Profile & Payment Methods</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectTab('tickets');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#d3c3dc] hover:text-white hover:bg-[#270f30] transition-colors cursor-pointer text-left"
                >
                  <Ticket className="w-4 h-4 text-[#c084fc]" />
                  <span>My Tickets ({activeTicketCount})</span>
                </button>

                <div className="my-1 border-t border-[#2d1237]" />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectTab('organizer');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-white bg-gradient-to-r from-[#50135d] to-[#340c3d] border border-[#7a228e]/50 hover:border-[#f43f5e]/80 transition-all cursor-pointer text-left font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <BriefcaseBusiness className="w-4 h-4 text-[#f472b6]" />
                    <span>Organizer Portal</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#f472b6]">PRO</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectTab('admin');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-white bg-gradient-to-r from-[#5a0c28] to-[#38083a] border border-[#831843] hover:border-[#f43f5e] transition-all cursor-pointer text-left font-medium mt-1"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Admin Console</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-white bg-[#831843] px-1 rounded">ADMIN</span>
                </button>

                <div className="my-1 border-t border-[#2d1237]" />

                {onOpenAuth && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#c084fc] hover:text-white hover:bg-[#270f30] transition-colors cursor-pointer text-left font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Switch Role / Sign In</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectTab('overview');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#9f8ca7] hover:text-white hover:bg-[#270f30] transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

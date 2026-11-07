import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  X,
  User
} from 'lucide-react';
import { NavTab } from './DesktopSidebar';
import { Logo } from '../common/Logo';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifications = 0;

  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
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
      case 'scan':
        return 'Scan QR Code';
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
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e7a98] group-focus-within:text-[#a78bfa] transition-colors">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search events, artists, venues..."
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-[#1b0b21]/90 border border-[#3b1746] text-white placeholder-[#85718f] focus:outline-none focus:border-[#8b7bff] focus:ring-1 focus:ring-[#8b7bff] transition-all"
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

      {/* Right Controls: Notifications */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#ad9cb4] hover:text-white hover:bg-[#230d2b] border border-transparent hover:border-[#381643] transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8b7bff] ring-2 ring-[#0e0612]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#170a1c] border border-[#3f184e] shadow-2xl p-4 z-50 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#2d1237]">
                <h4 className="text-sm font-display font-bold text-white">Notifications</h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#9f8ea8] hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="py-8 text-center">
                <Bell className="w-6 h-6 mx-auto text-[#705c7c]" />
                <p className="mt-2 text-xs text-[#9f8ea8]">You're all caught up. No notifications yet.</p>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => onSelectTab('profile')}
          className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
            currentTab === 'profile'
              ? 'text-white bg-[#230d2b] border-[#8b7bff]/50'
              : 'text-[#ad9cb4] hover:text-white hover:bg-[#230d2b] border-transparent hover:border-[#381643]'
          }`}
          title="My Profile"
          aria-label="My Profile"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

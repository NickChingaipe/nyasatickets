import React from 'react';
import { 
  LayoutGrid, 
  Compass, 
  Ticket, 
  User 
} from 'lucide-react';
import { NavTab } from './DesktopSidebar';

interface MobileNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeTicketCount: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentTab,
  onSelectTab,
  activeTicketCount
}) => {
  const tabs = [
    {
      id: 'overview' as NavTab,
      label: 'Home',
      icon: LayoutGrid,
      badge: null
    },
    {
      id: 'discover' as NavTab,
      label: 'Explore',
      icon: Compass,
      badge: null
    },
    {
      id: 'tickets' as NavTab,
      label: 'Tickets',
      icon: Ticket,
      badge: activeTicketCount > 0 ? activeTicketCount : null
    },
    {
      id: 'profile' as NavTab,
      label: 'Profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-4 inset-x-4 z-40 max-w-md mx-auto"
    >
      <div className="relative rounded-2xl backdrop-blur-xl bg-[#16081b]/92 border border-[#441852]/80 shadow-[0_12px_32px_rgba(0,0,0,0.6)] px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === 'profile' && (currentTab === 'organizer' || currentTab === 'admin'));

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-[#9c89a6] hover:text-[#e4d7ec]'
              }`}
            >
              {/* Active Indicator Glow/Pill Background */}
              {isActive && (
                <span className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-gradient-to-r from-[#831843]/50 to-[#4a044e]/50 border border-[#f43f5e]/30 -z-10" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'text-[#f43f5e] scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 text-[9px] font-bold rounded-full bg-[#f43f5e] text-white flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'font-semibold text-white' : 'text-[#a290ab]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

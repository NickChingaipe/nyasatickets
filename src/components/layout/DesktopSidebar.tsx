import React from 'react';
import { 
  Compass, 
  Ticket, 
  User, 
  BriefcaseBusiness, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { Badge } from '../common/Badge';
import { UserProfile } from '../../types';

export type NavTab = 'overview' | 'discover' | 'tickets' | 'profile' | 'organizer' | 'admin';

interface DesktopSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenLegal: (type: 'help' | 'terms' | 'privacy') => void;
  activeTicketCount: number;
  currentUser?: UserProfile;
  pendingApprovalsCount?: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenLegal,
  activeTicketCount,
  currentUser,
  pendingApprovalsCount = 5
}) => {
  const mainNavItems = [
    {
      id: 'overview' as NavTab,
      label: 'Overview',
      icon: LayoutGrid,
      badge: null
    },
    {
      id: 'discover' as NavTab,
      label: 'Discover Events',
      icon: Compass,
      badge: null
    },
    {
      id: 'tickets' as NavTab,
      label: 'My Tickets',
      icon: Ticket,
      badge: activeTicketCount > 0 ? `${activeTicketCount}` : null
    },
    {
      id: 'profile' as NavTab,
      label: 'My Profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 bg-[#120716] border-r border-[#260e2b] transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-[76px] px-2.5' : 'w-[250px] px-4'
      } py-5`}
    >
      {/* Top Brand & Toggle */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-2 border-b border-[#240d2a]">
          <Logo 
            collapsed={isCollapsed} 
            onClick={() => onSelectTab('overview')} 
          />
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#9988a3] hover:text-white hover:bg-[#270f2f] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Customer Main Navigation */}
        <div className="space-y-1">
          <div className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#796783] ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Main Menu'}
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#831843]/80 to-[#4a044e]/70 text-white shadow-md shadow-[#831843]/15 border border-[#be185d]/30'
                    : 'text-[#ab9bb3] hover:text-[#f8f4fa] hover:bg-[#200c27]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-150 ${isActive ? 'text-[#f43f5e]' : 'group-hover:scale-105'}`} />
                
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#f43f5e] text-white">
                    {item.badge}
                  </span>
                )}

                {isCollapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f43f5e]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Separator to Organizer Portal */}
        <div className="my-5 pt-4 border-t border-[#240d2a]">
          {!isCollapsed && (
            <div className="px-2 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#796783]">
              <span>Management</span>
              <span className="text-[10px] text-[#f43f5e] font-medium tracking-normal">Portal</span>
            </div>
          )}

          {/* Differentiated Organizer Portal Link */}
          <button
            onClick={() => onSelectTab('organizer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border group relative ${
              currentTab === 'organizer'
                ? 'bg-[#3b1245] text-white border-[#f43f5e] shadow-lg shadow-[#831843]/20'
                : 'bg-[#1b0b21] text-[#e0d2e8] border-[#431751]/80 hover:bg-[#270f2f] hover:border-[#f43f5e]/50'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={isCollapsed ? 'Organizer Portal' : undefined}
          >
            <div className="w-6 h-6 rounded-lg bg-[#53175c] flex items-center justify-center shrink-0 text-[#f472b6] group-hover:scale-105 transition-transform">
              <BriefcaseBusiness className="w-3.5 h-3.5" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs tracking-tight">Organizer Portal</span>
                </div>
                <p className="text-[10px] text-[#9b8aa3] truncate">Manage events & sales</p>
              </div>
            )}

            {!isCollapsed && (
              <Badge variant="plum" className="text-[10px] py-0 px-1.5 uppercase font-semibold">
                PRO
              </Badge>
            )}
          </button>

          {/* Dedicated Admin Portal Link */}
          <button
            onClick={() => onSelectTab('admin')}
            className={`w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border group relative ${
              currentTab === 'admin'
                ? 'bg-gradient-to-r from-[#5c0e2b] to-[#3a083f] text-white border-[#f43f5e] shadow-lg shadow-[#831843]/30'
                : 'bg-[#18081c] text-[#f2e6f5] border-[#4f1839]/80 hover:bg-[#2a0e2a] hover:border-[#f43f5e]/60'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={isCollapsed ? 'Administration Portal' : undefined}
          >
            <div className="w-6 h-6 rounded-lg bg-[#831843] flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs tracking-tight">Admin Portal</span>
                </div>
                <p className="text-[10px] text-[#bda8c5] truncate">Verification & moderation</p>
              </div>
            )}

            {!isCollapsed && (
              <Badge variant="neutral" className="bg-[#831843]/80 text-white text-[9px] py-0 px-1.5 font-bold uppercase border-[#f43f5e]/40">
                ADMIN
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Area: User Account & Legal Links */}
      <div className="pt-4 border-t border-[#240d2a] space-y-3">
        {/* User Account Bar */}
        <div 
          onClick={() => onSelectTab('profile')}
          className={`flex items-center gap-3 p-2 rounded-xl bg-[#190a1e] hover:bg-[#260f2e] border border-[#2e1236] transition-colors cursor-pointer group ${
            isCollapsed ? 'justify-center p-2' : ''
          }`}
          title={isCollapsed ? `${currentUser?.name || 'Chikondi Banda'} (My Profile)` : undefined}
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9f1239] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xs shadow-md">
              {currentUser?.avatar || 'CB'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#120716]" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate group-hover:text-[#f43f5e] transition-colors">
                  {currentUser?.name || 'Chikondi Banda'}
                </p>
              </div>
              <p className="text-[11px] text-[#9f8ea7] truncate">
                {currentUser?.city ? `${currentUser.city}, MW` : 'Malawi'}
              </p>
            </div>
          )}
        </div>

        {/* Legal & Support Links */}
        {!isCollapsed ? (
          <div className="space-y-1.5 pt-2 text-[11px] text-[#86758f]">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <button 
                onClick={() => onOpenLegal('help')}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3 text-[#9f8ea7]" />
                Help & Support
              </button>
              <button 
                onClick={() => onOpenLegal('terms')}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <FileText className="w-3 h-3 text-[#9f8ea7]" />
                Terms
              </button>
              <button 
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-[#9f8ea7]" />
                Privacy
              </button>
            </div>
            <p className="text-[10px] text-[#6b5b73] pt-1">
              © 2026 NyasaTickets Malawi Ltd.
            </p>
          </div>
        ) : (
          <div className="flex justify-center pt-1 text-[#6b5b73]">
            <span className="text-[9px] font-mono">MW</span>
          </div>
        )}
      </div>
    </aside>
  );
};

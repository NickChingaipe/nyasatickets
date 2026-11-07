import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building, 
  FileCheck, 
  Activity, 
  Database, 
  Lock, 
  UserCheck, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { AdminOverviewSection } from './AdminOverviewSection';
import { AdminOrganizerVerificationSection } from './AdminOrganizerVerificationSection';
import { AdminEventModerationSection } from './AdminEventModerationSection';
import { 
  AdminPlatformMetrics, 
  OrganizerApplication, 
  OrganizerReviewRecord, 
  EventReviewRecord, 
  OrganizerEvent,
  UserProfile,
} from '../../types';
import { isSupabaseConfigured, supabaseService } from '../../lib/supabase';

interface AdminPortalViewProps {
  currentUser: UserProfile;
  onSwitchToAdminRole?: () => void;
  onShowToast: (message: string) => void;
}

export type AdminTab = 'overview' | 'organizers' | 'events';

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentUser,
  onSwitchToAdminRole,
  onShowToast
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  
  // Data State
  const [metrics, setMetrics] = useState<AdminPlatformMetrics>({
    totalCustomers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    publishedEvents: 0,
    pendingEventApprovals: 0,
    pendingOrganizers: 0,
    grossTicketSalesMWK: 0
  });
  const [applications, setApplications] = useState<OrganizerApplication[]>([]);
  const [organizerReviewHistory, setOrganizerReviewHistory] = useState<OrganizerReviewRecord[]>([]);
  const [moderationEvents, setModerationEvents] = useState<OrganizerEvent[]>([]);
  const [eventReviewHistory, setEventReviewHistory] = useState<EventReviewRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  const isAdminUser = currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.isAdmin;

  // Handle Application Approval
  const handleApproveApplication = (applicationId: string, notes?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'approved',
          reviewedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          reviewFeedback: notes || ''
        };
      }
      return app;
    }));
    onShowToast('Organizer application approved.');
  };

  // Handle Application Rejection
  const handleRejectApplication = (applicationId: string, reason: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'rejected',
          reviewedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          reviewFeedback: reason
        };
      }
      return app;
    }));
    onShowToast('Organizer application rejected.');
  };

  // Handle Event Approval & Publishing
  const handleApproveEvent = (eventId: string, notes?: string) => {
    setModerationEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'published',
          statusNotes: notes || ''
        };
      }
      return evt;
    }));

    onShowToast('Event approved and published.');
  };

  // Handle Event Rejection
  const handleRejectEvent = (eventId: string, reason: string) => {
    setModerationEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'rejected',
          statusNotes: reason
        };
      }
      return evt;
    }));

    onShowToast('Event rejected.');
  };

  // If user is not admin, show permission gate
  if (!isAdminUser) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#3e347d]/30 border border-[#8b7bff]/40 flex items-center justify-center text-[#8b7bff] mx-auto shadow-2xl">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Restricted Administration Area
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Authorised Access Only
          </h2>
          <p className="text-xs sm:text-sm text-[#ab9ab5] max-w-lg mx-auto">
            You are currently signed in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role}). Access to platform moderation, organiser verification, and financial telemetry requires elevated credentials enforced by Supabase security function <code className="text-[#8b7bff] font-mono">private.has_role('admin')</code>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#190a1e] border border-[#381643] text-left max-w-md mx-auto space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#8c7a95]">
            <span>Required Backend Role:</span>
            <span className="font-mono text-white font-bold">admin | super_admin</span>
          </div>
          <div className="flex items-center justify-between text-[#8c7a95]">
            <span>Supabase Instance:</span>
            <span className="font-mono text-[#a78bfa] text-[11px] truncate max-w-[200px]">
              {isSupabaseConfigured ? 'Configured' : 'Not configured'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Admin Navigation & Backend Health Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#170a1c] border border-[#34143d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3e347d] to-[#4a044e] flex items-center justify-center text-white border border-[#6255b7]/40 shadow-md">
            <ShieldCheck className="w-5 h-5 text-[#8b7bff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-white">
                NyasaTickets Administration
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-[#9d8ba6]">
              Logged in as <strong className="text-white">{currentUser.name}</strong> • Lilongwe HQ Authority
            </p>
          </div>
        </div>

        {/* Backend Status Chip */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1d0b23] border border-[#3c1747] text-xs">
            <Database className="w-3.5 h-3.5 text-[#c084fc]" />
            <span className="text-[#a491ae]">Supabase:</span>
            <span className="flex items-center gap-1.5 font-mono text-white text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
              {isSupabaseConfigured ? 'Configured' : 'Not configured'}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#2d1237] pb-2 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            currentTab === 'overview'
              ? 'bg-[#3e347d] text-white shadow-md border border-[#6255b7]/40'
              : 'text-[#9c89a7] hover:text-white hover:bg-[#1a0a20]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setCurrentTab('organizers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            currentTab === 'organizers'
              ? 'bg-[#3e347d] text-white shadow-md border border-[#6255b7]/40'
              : 'text-[#9c89a7] hover:text-white hover:bg-[#1a0a20]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Organiser Verification</span>
          {metrics.pendingOrganizers > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#8b7bff] text-white font-mono">
              {metrics.pendingOrganizers}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            currentTab === 'events'
              ? 'bg-[#3e347d] text-white shadow-md border border-[#6255b7]/40'
              : 'text-[#9c89a7] hover:text-white hover:bg-[#1a0a20]'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Event Moderation</span>
          {metrics.pendingEventApprovals > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#8b7bff] text-white font-mono">
              {metrics.pendingEventApprovals}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      {currentTab === 'overview' && (
        <AdminOverviewSection
          metrics={metrics}
          recentActivity={activityLogs}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
        />
      )}

      {currentTab === 'organizers' && (
        <AdminOrganizerVerificationSection
          applications={applications}
          reviewHistory={organizerReviewHistory}
          onApproveApplication={handleApproveApplication}
          onRejectApplication={handleRejectApplication}
        />
      )}

      {currentTab === 'events' && (
        <AdminEventModerationSection
          events={moderationEvents}
          eventReviewHistory={eventReviewHistory}
          onApproveEvent={handleApproveEvent}
          onRejectEvent={handleRejectEvent}
        />
      )}
    </div>
  );
};

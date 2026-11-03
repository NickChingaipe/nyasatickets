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
  RefreshCw,
  Sparkles
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
  AppRole
} from '../../types';
import { 
  INITIAL_ADMIN_METRICS, 
  INITIAL_PENDING_APPLICATIONS, 
  INITIAL_APPLICATION_REVIEWS_HISTORY, 
  INITIAL_EVENT_REVIEWS_HISTORY,
  INITIAL_ADMIN_ACTIVITY_LOG 
} from '../../data/adminData';
import { INITIAL_ORGANIZER_EVENTS } from '../../data/organizerData';
import { isSupabaseConfigured, supabaseService } from '../../lib/supabase';
import { Button } from '../../components/common/Button';

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
  const [metrics, setMetrics] = useState<AdminPlatformMetrics>(INITIAL_ADMIN_METRICS);
  const [applications, setApplications] = useState<OrganizerApplication[]>(INITIAL_PENDING_APPLICATIONS);
  const [organizerReviewHistory, setOrganizerReviewHistory] = useState<OrganizerReviewRecord[]>(INITIAL_APPLICATION_REVIEWS_HISTORY);
  const [moderationEvents, setModerationEvents] = useState<OrganizerEvent[]>(INITIAL_ORGANIZER_EVENTS);
  const [eventReviewHistory, setEventReviewHistory] = useState<EventReviewRecord[]>(INITIAL_EVENT_REVIEWS_HISTORY);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ADMIN_ACTIVITY_LOG);

  const isAdminUser = currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.isAdmin;

  // Handle Application Approval
  const handleApproveApplication = (applicationId: string, notes?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'approved',
          reviewedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          reviewFeedback: notes || 'Approved by NyasaTickets Admin',
          reviewedBy: currentUser.name
        };
      }
      return app;
    }));

    const approvedApp = applications.find(a => a.id === applicationId);
    const orgName = approvedApp?.organizationName || 'Promoter Organization';

    // Record review in history
    const newRecord: OrganizerReviewRecord = {
      id: `rev-${Date.now()}`,
      applicationId,
      organizationName: orgName,
      reviewerName: `${currentUser.name} (Admin)`,
      status: 'approved',
      reason: notes || 'Verified credentials and compliance certificates.',
      reviewedAt: 'Today'
    };
    setOrganizerReviewHistory(prev => [newRecord, ...prev]);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      pendingOrganizers: Math.max(0, prev.pendingOrganizers - 1),
      totalOrganizers: prev.totalOrganizers + 1
    }));

    // Add activity log
    setActivityLogs(prev => [
      {
        id: `act-${Date.now()}`,
        title: 'Organiser Accredited',
        description: `${orgName} was officially approved for platform ticket sales.`,
        timestamp: 'Just now',
        type: 'moderation'
      },
      ...prev
    ]);

    onShowToast(`Accreditation granted: ${orgName} is now authorized to create events.`);
  };

  // Handle Application Rejection
  const handleRejectApplication = (applicationId: string, reason: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'rejected',
          reviewedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          reviewFeedback: reason,
          reviewedBy: currentUser.name
        };
      }
      return app;
    }));

    const rejectedApp = applications.find(a => a.id === applicationId);
    const orgName = rejectedApp?.organizationName || 'Promoter Organization';

    // Record review in history
    const newRecord: OrganizerReviewRecord = {
      id: `rev-${Date.now()}`,
      applicationId,
      organizationName: orgName,
      reviewerName: `${currentUser.name} (Admin)`,
      status: 'rejected',
      reason,
      reviewedAt: 'Today'
    };
    setOrganizerReviewHistory(prev => [newRecord, ...prev]);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      pendingOrganizers: Math.max(0, prev.pendingOrganizers - 1)
    }));

    setActivityLogs(prev => [
      {
        id: `act-${Date.now()}`,
        title: 'Application Rejected',
        description: `${orgName} application was rejected: ${reason}`,
        timestamp: 'Just now',
        type: 'moderation'
      },
      ...prev
    ]);

    onShowToast(`Application rejected: ${orgName}. Rejection feedback stored.`);
  };

  // Handle Event Approval & Publishing
  const handleApproveEvent = (eventId: string, notes?: string) => {
    setModerationEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'published',
          statusNotes: 'Approved and published to public catalog.'
        };
      }
      return evt;
    }));

    const approvedEvt = moderationEvents.find(e => e.id === eventId);
    const evtTitle = approvedEvt?.title || 'Event Submission';

    // Record review in history
    const newRecord: EventReviewRecord = {
      id: `erev-${Date.now()}`,
      eventId,
      eventTitle: evtTitle,
      organizerName: 'Mandala Live Collective',
      reviewerName: `${currentUser.name} (Admin)`,
      status: 'approved',
      reason: notes || 'Verified venue capacity and ticket quotas.',
      reviewedAt: 'Today'
    };
    setEventReviewHistory(prev => [newRecord, ...prev]);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      pendingEventApprovals: Math.max(0, prev.pendingEventApprovals - 1),
      publishedEvents: prev.publishedEvents + 1
    }));

    setActivityLogs(prev => [
      {
        id: `act-${Date.now()}`,
        title: 'Event Approved & Published',
        description: `${evtTitle} cleared compliance and is now live on NyasaTickets.`,
        timestamp: 'Just now',
        type: 'event'
      },
      ...prev
    ]);

    onShowToast(`Event published! ${evtTitle} is live on discover.`);
  };

  // Handle Event Rejection
  const handleRejectEvent = (eventId: string, reason: string) => {
    setModerationEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'rejected',
          statusNotes: `Moderation rejected: ${reason}`
        };
      }
      return evt;
    }));

    const rejectedEvt = moderationEvents.find(e => e.id === eventId);
    const evtTitle = rejectedEvt?.title || 'Event Submission';

    // Record review in history
    const newRecord: EventReviewRecord = {
      id: `erev-${Date.now()}`,
      eventId,
      eventTitle: evtTitle,
      organizerName: 'Mandala Live Collective',
      reviewerName: `${currentUser.name} (Admin)`,
      status: 'rejected',
      reason,
      reviewedAt: 'Today'
    };
    setEventReviewHistory(prev => [newRecord, ...prev]);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      pendingEventApprovals: Math.max(0, prev.pendingEventApprovals - 1)
    }));

    setActivityLogs(prev => [
      {
        id: `act-${Date.now()}`,
        title: 'Event Moderation Rejected',
        description: `${evtTitle} was rejected: ${reason}`,
        timestamp: 'Just now',
        type: 'moderation'
      },
      ...prev
    ]);

    onShowToast(`Event rejected: ${evtTitle}. Reason returned to promoter.`);
  };

  // If user is not admin, show permission gate
  if (!isAdminUser) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#831843]/30 border border-[#f43f5e]/40 flex items-center justify-center text-[#f43f5e] mx-auto shadow-2xl">
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
            You are currently signed in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role}). Access to platform moderation, organiser verification, and financial telemetry requires elevated credentials enforced by Supabase security function <code className="text-[#f43f5e] font-mono">private.has_role('admin')</code>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#190a1e] border border-[#381643] text-left max-w-md mx-auto space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#8c7a95]">
            <span>Required Backend Role:</span>
            <span className="font-mono text-white font-bold">admin | super_admin</span>
          </div>
          <div className="flex items-center justify-between text-[#8c7a95]">
            <span>Supabase Instance:</span>
            <span className="font-mono text-[#f472b6] text-[11px] truncate max-w-[200px]">
              ozykoejzeozdlqsyuuqv
            </span>
          </div>
        </div>

        {onSwitchToAdminRole && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onSwitchToAdminRole}
              leftIcon={<ShieldCheck className="w-5 h-5 text-white" />}
            >
              Switch to Super Admin Profile (Thokozani Phiri)
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Admin Navigation & Backend Health Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#170a1c] border border-[#34143d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#831843] to-[#4a044e] flex items-center justify-center text-white border border-[#be185d]/40 shadow-md">
            <ShieldCheck className="w-5 h-5 text-[#f43f5e]" />
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
              {isSupabaseConfigured ? 'Connected (ozykoejze)' : 'Live Demo Client'}
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
              ? 'bg-[#831843] text-white shadow-md border border-[#be185d]/40'
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
              ? 'bg-[#831843] text-white shadow-md border border-[#be185d]/40'
              : 'text-[#9c89a7] hover:text-white hover:bg-[#1a0a20]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Organiser Verification</span>
          {metrics.pendingOrganizers > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f43f5e] text-white font-mono">
              {metrics.pendingOrganizers}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            currentTab === 'events'
              ? 'bg-[#831843] text-white shadow-md border border-[#be185d]/40'
              : 'text-[#9c89a7] hover:text-white hover:bg-[#1a0a20]'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Event Moderation</span>
          {metrics.pendingEventApprovals > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f43f5e] text-white font-mono">
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

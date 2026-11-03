import React from 'react';
import { 
  Users, 
  Building, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { AdminPlatformMetrics } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface AdminOverviewSectionProps {
  metrics: AdminPlatformMetrics;
  recentActivity: { id: string; title: string; description: string; timestamp: string; type: string }[];
  onNavigateToTab: (tab: 'overview' | 'organizers' | 'events') => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  metrics,
  recentActivity,
  onNavigateToTab
}) => {
  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#290d2f] via-[#1f0923] to-[#120516] border border-[#52195f] shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#831843] text-white border border-[#f43f5e]/50 shadow-sm">
                Super Administrator Console
              </span>
              <span className="text-xs text-[#a28fa8] font-mono">NyasaTickets Authority</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Platform Administration & Moderation
            </h2>

            <p className="text-xs sm:text-sm text-[#cebedb] max-w-xl">
              Oversee nationwide ticketing operations across Malawi. Verify promoter registration compliance, review live event submissions, and monitor platform activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigateToTab('organizers')}
              leftIcon={<Building className="w-4 h-4 text-[#c084fc]" />}
            >
              Review Organisers ({metrics.pendingOrganizers})
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigateToTab('events')}
              leftIcon={<FileCheck className="w-4 h-4" />}
            >
              Moderate Events ({metrics.pendingEventApprovals})
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Customers */}
        <div className="p-4 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Customers</span>
            <Users className="w-4 h-4 text-[#f43f5e]" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {metrics.totalCustomers.toLocaleString()}
          </p>
          <span className="text-[10px] text-[#8e7a96] block">Registered users</span>
        </div>

        {/* Organizers */}
        <div className="p-4 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Organisers</span>
            <Building className="w-4 h-4 text-[#c084fc]" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {metrics.totalOrganizers}
          </p>
          <span className="text-[10px] text-[#8e7a96] block">Accredited hosts</span>
        </div>

        {/* Total Events */}
        <div className="p-4 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Total Events</span>
            <Calendar className="w-4 h-4 text-pink-300" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {metrics.totalEvents}
          </p>
          <span className="text-[10px] text-[#8e7a96] block">Across all statuses</span>
        </div>

        {/* Published */}
        <div className="p-4 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {metrics.publishedEvents}
          </p>
          <span className="text-[10px] text-emerald-400 block font-medium">Live on marketplace</span>
        </div>

        {/* Pending Approval */}
        <div className="p-4 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Pending Events</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {metrics.pendingEventApprovals}
          </p>
          <span className="text-[10px] text-amber-400 block font-medium">Awaiting moderation</span>
        </div>

        {/* Platform Gross Sales */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Platform Sales</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            MWK {(metrics.grossTicketSalesMWK / 1000000).toFixed(1)}M
          </p>
          <span className="text-[10px] text-[#8e7a96] block font-mono">Gross tickets booked</span>
        </div>
      </div>

      {/* 3. Action Quick-Queue Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pending Organisers Queue */}
        <div className="p-5 rounded-3xl bg-[#1c0a22] border border-[#3a1645] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#f472b6]">Accreditation Queue</span>
            <h3 className="font-bold text-white text-base">
              {metrics.pendingOrganizers} Organiser Applications Pending
            </h3>
            <p className="text-xs text-[#a997b4]">Review Malawi business registration and MRA tax clearance dossiers.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('organizers')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Review Queue
          </Button>
        </div>

        {/* Pending Events Queue */}
        <div className="p-5 rounded-3xl bg-[#1c0a22] border border-[#3a1645] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#f472b6]">Event Moderation Queue</span>
            <h3 className="font-bold text-white text-base">
              {metrics.pendingEventApprovals} Events Awaiting Approval
            </h3>
            <p className="text-xs text-[#a997b4]">Verify venue contracts, capacity caps, and age restrictions.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateToTab('events')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Moderate Now
          </Button>
        </div>
      </div>

      {/* 4. Recent Platform Activity Stream */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#32133b] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#f43f5e]" />
            <h3 className="text-base font-display font-bold text-white">Recent Platform Activity</h3>
          </div>
          <span className="text-xs text-[#9f8fa9]">System-wide audit trail</span>
        </div>

        <div className="divide-y divide-[#260f2d]">
          {recentActivity.map((log) => (
            <div key={log.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{log.title}</span>
                  <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                    log.type === 'moderation' 
                      ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                      : log.type === 'organizer' 
                        ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {log.type}
                  </span>
                </div>
                <p className="text-[#a491ae] text-[11px]">{log.description}</p>
              </div>
              <span className="text-[10px] text-[#7d6c85] font-mono shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Building,
  DollarSign,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { OrganizerEvent, AttendeeRecord } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface OrganizerDashboardSectionProps {
  events: OrganizerEvent[];
  activityLog: { id: string; title: string; description: string; timestamp: string; type: string }[];
  onOpenCreateWizard: () => void;
  onNavigateToTab: (tab: string) => void;
  onSelectEvent: (event: OrganizerEvent) => void;
}

export const OrganizerDashboardSection: React.FC<OrganizerDashboardSectionProps> = ({
  events,
  activityLog,
  onOpenCreateWizard,
  onNavigateToTab,
  onSelectEvent
}) => {
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'published').length;
  const pendingApprovals = events.filter(e => e.status === 'pending_approval').length;
  const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);
  const totalRevenueMWK = events.reduce((sum, e) => sum + e.grossRevenueMWK, 0);

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#2c0e38] via-[#210c2b] to-[#15071a] border border-[#551d69] shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#581763] text-[#f4d1fd] border border-[#83269c]/70">
                Organizer Workspace
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Organiser Management Dashboard
            </h2>

            <p className="text-xs sm:text-sm text-[#cebedb] max-w-xl">
              Track event ticket performance, gate capacities, attendee check-in readiness, and revenue across your Malawian productions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigateToTab('events')}
            >
              View All Events
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onOpenCreateWizard}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Events */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Total Events</span>
            <Layers className="w-4 h-4 text-[#c084fc]" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {totalEvents}
          </p>
          <span className="text-[10px] text-[#8e7a96] block">In your organisation portfolio</span>
        </div>

        {/* Published Events */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Published Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {publishedEvents}
          </p>
          <span className="text-[10px] text-emerald-400 block font-medium">Public on marketplace</span>
        </div>

        {/* Pending Approval */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {pendingApprovals}
          </p>
          <span className="text-[10px] text-amber-400 block font-medium">Awaiting platform verification</span>
        </div>

        {/* Total Tickets Sold */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Tickets Sold</span>
            <Users className="w-4 h-4 text-[#8b7bff]" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            {totalTicketsSold.toLocaleString()}
          </p>
          <span className="text-[10px] text-[#8e7a96] block">Confirmed attendee passes</span>
        </div>

        {/* Gross Revenue */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9c89a7]">Total Sales (MWK)</span>
            <TrendingUp className="w-4 h-4 text-[#a78bfa]" />
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
            MWK {(totalRevenueMWK / 1000000).toFixed(1)}M
          </p>
          <span className="text-[10px] text-[#8e7a96] block font-mono">MWK {totalRevenueMWK.toLocaleString()}</span>
        </div>
      </div>

      {/* 3. Real vs Placeholder Data Integrity Notice */}
      <div className="p-4 rounded-2xl bg-[#1f0c26] border border-[#481c56] flex items-start gap-3 text-xs text-[#d1bedb]">
        <Activity className="w-5 h-5 text-[#a78bfa] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white block">Backend data status</span>
          <p className="text-[11px] text-[#a997b4] mt-0.5 leading-relaxed">
            Ticket sales, attendees, and analytics will appear here when the corresponding Supabase data is available.
          </p>
        </div>
      </div>

      {/* 4. Weekly Sales Chart & Upcoming Events Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Responsive Weekly Sales Trend Chart */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#32133b] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-bold text-white">7-Day Ticket Sales Velocity</h3>
              <p className="text-xs text-[#9f8fa9]">Daily passes booked across all active events</p>
            </div>
            <span className="text-xs text-[#9f8fa9]">No sales analytics loaded</span>
          </div>

          {/* Responsive SVG Bar & Area Chart */}
          <div className="h-48 flex items-center justify-center border-b border-[#2d1235] text-sm text-[#8e7a96]">
            Sales data will appear when available.
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming Event Snapshots */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#32133b] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-bold text-white">Upcoming Events</h3>
            <button
              onClick={() => onNavigateToTab('events')}
              className="text-xs text-[#a78bfa] hover:underline cursor-pointer"
            >
              View all ({events.length})
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 3).map((event) => {
              const percentSold = Math.round((event.ticketsSold / event.capacity) * 100);

              return (
                <div 
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="p-3.5 rounded-2xl bg-[#1f0c26] border border-[#35143e] hover:border-[#521f5f] transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-white group-hover:text-[#fce7f3] transition-colors truncate block">
                        {event.title}
                      </span>
                      <p className="text-[11px] text-[#9a87a3] truncate mt-0.5">
                        {event.venueName} · {event.startDate}
                      </p>
                    </div>

                    <span className="shrink-0">
                      {event.status === 'published' && <Badge variant="success" className="text-[9px]">Live</Badge>}
                      {event.status === 'pending_approval' && <Badge variant="warning" className="text-[9px]">Pending</Badge>}
                      {event.status === 'draft' && <Badge variant="neutral" className="text-[9px]">Draft</Badge>}
                      {event.status === 'rejected' && <Badge variant="danger" className="text-[9px]">Rejected</Badge>}
                    </span>
                  </div>

                  {/* Capacity progress */}
                  <div>
                    <div className="flex justify-between text-[10px] text-[#8e7a96] mb-1 font-mono">
                      <span>{event.ticketsSold} of {event.capacity} sold</span>
                      <span>{percentSold}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#290d2f] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4c1d95] to-[#c084fc] rounded-full"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Log */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#32133b] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#8b7bff]" />
            <h3 className="text-base font-display font-bold text-white">Recent Activity</h3>
          </div>
          <span className="text-xs text-[#9f8fa9]">Live event management logs</span>
        </div>

        <div className="divide-y divide-[#260f2d]">
          {activityLog.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-white">{log.title}</p>
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

import React, { useState } from 'react';
import { 
  Plus, 
  Building, 
  Search, 
  Calendar, 
  MapPin, 
  Edit3, 
  Ticket, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send,
  MoreVertical,
  XCircle,
  Eye
} from 'lucide-react';
import { OrganizerEvent, OrganizerEventStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface OrganizerEventsSectionProps {
  events: OrganizerEvent[];
  onOpenCreateWizard: () => void;
  onOpenVenueManager: () => void;
  onEditEvent: (event: OrganizerEvent) => void;
  onSubmitForApproval: (eventId: string) => void;
  onManageTickets: (event: OrganizerEvent) => void;
}

export const OrganizerEventsSection: React.FC<OrganizerEventsSectionProps> = ({
  events,
  onOpenCreateWizard,
  onOpenVenueManager,
  onEditEvent,
  onSubmitForApproval,
  onManageTickets
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(e => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchSearch = searchQuery === '' || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: OrganizerEventStatus) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published Live</Badge>;
      case 'pending_approval':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="info">Approved (Ready to Publish)</Badge>;
      case 'draft':
        return <Badge variant="neutral">Draft Mode</Badge>;
      case 'rejected':
        return <Badge variant="danger">Action Required (Rejected)</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="plum">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions Strip */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#f472b6]">
            Event Portfolio Management
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
            Organised Events
          </h2>
          <p className="text-xs text-[#9f8fa9] mt-0.5">
            Create, schedule, submit for compliance review, and manage venues across Malawi
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            onClick={onOpenVenueManager}
            leftIcon={<Building className="w-4 h-4 text-[#c084fc]" />}
          >
            Manage Venues
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onOpenCreateWizard}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Event
          </Button>
        </div>
      </div>

      {/* 2. Search & Status Filter Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1a0820] border border-[#32133b] overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === 'all' ? 'bg-[#831843] text-white shadow-sm' : 'text-[#a28fa8] hover:text-white'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === 'published' ? 'bg-[#831843] text-white shadow-sm' : 'text-[#a28fa8] hover:text-white'
              }`}
            >
              Published ({events.filter(e => e.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending_approval')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === 'pending_approval' ? 'bg-[#831843] text-white shadow-sm' : 'text-[#a28fa8] hover:text-white'
              }`}
            >
              Pending Approval ({events.filter(e => e.status === 'pending_approval').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === 'draft' ? 'bg-[#831843] text-white shadow-sm' : 'text-[#a28fa8] hover:text-white'
              }`}
            >
              Drafts ({events.filter(e => e.status === 'draft').length})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === 'rejected' ? 'bg-[#831843] text-white shadow-sm' : 'text-[#a28fa8] hover:text-white'
              }`}
            >
              Action Required ({events.filter(e => e.status === 'rejected').length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7895]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by event title or city..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#1b0b21] border border-[#3b1747] text-xs text-white focus:outline-none focus:border-[#f43f5e]"
            />
          </div>
        </div>
      </div>

      {/* 3. Events List Cards / Table */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const percentSold = Math.round((event.ticketsSold / event.capacity) * 100);

            return (
              <div 
                key={event.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#2f1338] hover:border-[#4d1e59] transition-all space-y-4 shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Event Thumbnail & Metadata */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#240e2b] overflow-hidden shrink-0 border border-[#3c1746]">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(event.status)}
                        <span className="text-[11px] font-semibold text-[#f472b6]">
                          {event.category.toUpperCase()} · {event.city}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-display font-bold text-white truncate">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#a997b2]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#f43f5e]" />
                          {event.startDate} ({event.startTime})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#f43f5e]" />
                          {event.venueName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Capacity Metrics */}
                  <div className="flex items-center md:items-end gap-6 justify-between md:justify-end border-t md:border-t-0 border-[#260f2c] pt-3 md:pt-0 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#8e7a96] block uppercase font-bold">Gross Revenue</span>
                      <span className="text-sm sm:text-base font-mono font-bold text-white tabular-nums">
                        MWK {event.grossRevenueMWK.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right min-w-[130px]">
                      <span className="text-[10px] text-[#8e7a96] block uppercase font-bold">
                        Sales ({event.ticketsSold}/{event.capacity})
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 h-2 rounded-full bg-[#2a1032] overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#9f1239] to-[#c084fc] rounded-full"
                            style={{ width: `${percentSold}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-white">{percentSold}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Notes Banner (for Rejected / Pending review feedback) */}
                {event.statusNotes && (
                  <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    event.status === 'rejected'
                      ? 'bg-rose-950/70 border-rose-800/60 text-rose-200'
                      : 'bg-[#210c28] border-[#441852] text-[#d6bfe3]'
                  }`}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Compliance & Status Update:</span>
                      <p className="text-[11px] mt-0.5 leading-relaxed">{event.statusNotes}</p>
                    </div>
                  </div>
                )}

                {/* Event Actions Footer Strip */}
                <div className="pt-3 border-t border-[#260e2c] flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-[#a08ea9]">
                    <span>{event.tiers.length} Ticket Tiers Active</span>
                    <span>·</span>
                    <span>Age: {event.ageRestriction}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* If Draft or Rejected: Submit for Approval Action */}
                    {(event.status === 'draft' || event.status === 'rejected') && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onSubmitForApproval(event.id)}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Submit for Approval
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onManageTickets(event)}
                      leftIcon={<Ticket className="w-3.5 h-3.5" />}
                    >
                      Manage Tiers
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEvent(event)}
                      leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    >
                      Edit Event
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-[#16081c] border border-[#2d1235] space-y-3">
          <p className="text-sm text-[#9f8fa9]">No events found matching status "{statusFilter}".</p>
          <Button variant="secondary" size="sm" onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

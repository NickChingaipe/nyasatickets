import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Eye, 
  AlertTriangle, 
  FileCheck, 
  Sparkles, 
  Tag, 
  Users, 
  ShieldAlert, 
  X,
  History,
  Check,
  Building
} from 'lucide-react';
import { 
  OrganizerEvent, 
  EventReviewRecord, 
  OrganizerEventStatus 
} from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { supabaseService } from '../../lib/supabase';

interface AdminEventModerationSectionProps {
  events: OrganizerEvent[];
  eventReviewHistory: EventReviewRecord[];
  onApproveEvent: (eventId: string, notes?: string) => void;
  onRejectEvent: (eventId: string, reason: string) => void;
}

export const AdminEventModerationSection: React.FC<AdminEventModerationSectionProps> = ({
  events,
  eventReviewHistory,
  onApproveEvent,
  onRejectEvent
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [filterStatus, setFilterStatus] = useState<'all' | OrganizerEventStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected event for detailed modal inspection
  const [selectedEvent, setSelectedEvent] = useState<OrganizerEvent | null>(null);

  // Rejection modal state
  const [rejectionTarget, setRejectionTarget] = useState<OrganizerEvent | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || evt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingEventsCount = events.filter(e => e.status === 'pending_approval').length;

  const handleApprove = async (event: OrganizerEvent) => {
    setIsSubmitting(true);
    try {
      await supabaseService.reviewEvent(event.id, 'approved', 'Approved by NyasaTickets Admin');
      await supabaseService.publishEvent(event.id);
      onApproveEvent(event.id, 'Event approved and published to live marketplace.');
      if (selectedEvent?.id === event.id) {
        setSelectedEvent(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Please provide a specific rejection reason for the organiser.');
      return;
    }

    if (!rejectionTarget) return;

    setIsSubmitting(true);
    try {
      await supabaseService.reviewEvent(rejectionTarget.id, 'rejected', rejectionReason.trim());
      onRejectEvent(rejectionTarget.id, rejectionReason.trim());
      setRejectionTarget(null);
      setRejectionReason('');
      setRejectionError('');
      if (selectedEvent?.id === rejectionTarget.id) {
        setSelectedEvent(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: OrganizerEventStatus) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="warning" className="bg-amber-950/80 text-amber-300 border-amber-800">Pending Review</Badge>;
      case 'published':
        return <Badge variant="success">Published Live</Badge>;
      case 'approved':
        return <Badge variant="plum">Approved (Unpublished)</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'draft':
        return <Badge variant="neutral">Draft</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d1237]">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-[#f43f5e]" />
            Event Moderation & Compliance
          </h2>
          <p className="text-xs sm:text-sm text-[#9f8ea7] mt-1">
            Enforce safety compliance, venue capacity verification, and pricing policies before events go live.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#180a1e] border border-[#381643] shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'queue'
                ? 'bg-[#831843] text-white shadow-md'
                : 'text-[#9c89a7] hover:text-white'
            }`}
          >
            <span>Moderation Queue</span>
            {pendingEventsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f43f5e] text-white font-mono">
                {pendingEventsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#831843] text-white shadow-md'
                : 'text-[#9c89a7] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Review History ({eventReviewHistory.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <>
          {/* 2. Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
              <input
                type="text"
                placeholder="Search events by title, venue, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#180a1e] border border-[#35143f] text-white text-xs placeholder-[#7c6987] focus:outline-none focus:border-[#f43f5e]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'pending_approval', 'published', 'draft', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize shrink-0 transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-[#4a1354] text-white border border-[#9d24b6]/50 shadow-sm'
                      : 'bg-[#180a1e] text-[#9c89a7] border border-[#2f1137] hover:text-white'
                  }`}
                >
                  {status === 'pending_approval' ? 'Pending' : status}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Event Cards Moderation Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#16081b] border border-[#2d1237] space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/80 mx-auto" />
              <h3 className="text-base font-bold text-white">No Events in Moderation Queue</h3>
              <p className="text-xs text-[#9f8ea7] max-w-md mx-auto">
                All submitted events have been reviewed. When organizers submit events via Supabase RPC, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-3xl bg-[#170a1c] border border-[#361440] overflow-hidden hover:border-[#671d7a] transition-all shadow-md flex flex-col justify-between"
                >
                  {/* Top Banner & Header */}
                  <div>
                    <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-[#240d2d]">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#170a1c] via-[#170a1c]/60 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {getStatusBadge(event.status)}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-[#e6d8ed] backdrop-blur-md border border-white/10">
                          {event.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-base font-display font-bold text-white line-clamp-1 drop-shadow-md">
                            {event.title}
                          </h3>
                          <p className="text-xs text-[#d8c7e2] line-clamp-1 drop-shadow-sm">
                            {event.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Event Logistics & Quota Specs */}
                    <div className="p-5 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#cebdd9] bg-[#1d0b23] p-3 rounded-2xl border border-[#33133c]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#f43f5e] shrink-0" />
                          <span className="truncate">{event.startDate} • {event.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
                          <span className="truncate">{event.venueName}, {event.city}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-[#2a0e30]">
                          <Users className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span>Venue Cap: <strong>{event.capacity.toLocaleString()}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-[#2a0e30]">
                          <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Tiers: <strong>{event.tiers.length} Tiers</strong></span>
                        </div>
                      </div>

                      {event.statusNotes && (
                        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200/90 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <p className="line-clamp-2">{event.statusNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-[#270e2d] pt-3">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-3 py-1.5 rounded-xl bg-[#250d2d] hover:bg-[#34133e] text-[#e5d6ec] border border-[#441852] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#c084fc]" />
                      Review Details
                    </button>

                    <div className="flex items-center gap-2">
                      {event.status === 'pending_approval' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setRejectionTarget(event);
                              setRejectionReason('');
                              setRejectionError('');
                            }}
                            className="text-xs text-rose-300 border-rose-900/60 hover:bg-rose-950/40"
                            leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-400" />}
                          >
                            Reject
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(event)}
                            disabled={isSubmitting}
                            className="text-xs bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                          >
                            Approve & Publish
                          </Button>
                        </>
                      )}

                      {event.status === 'published' && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Live in Malawi
                        </span>
                      )}

                      {event.status === 'draft' && (
                        <span className="text-xs text-[#9f8ea7]">Awaiting Organizer Submission</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* 4. Historical Event Moderation Audit Log */
        <div className="rounded-3xl bg-[#170a1c] border border-[#32133b] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2d1237]">
            <div>
              <h3 className="font-display font-bold text-white text-base">Event Moderation Decisions</h3>
              <p className="text-xs text-[#9f8ea7]">Audit history of approved and rejected public event submissions.</p>
            </div>
            <span className="text-xs font-mono text-[#8e7a96]">{eventReviewHistory.length} Recorded Reviews</span>
          </div>

          <div className="divide-y divide-[#280e2f]">
            {eventReviewHistory.map((record) => (
              <div key={record.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-sm">{record.eventTitle}</span>
                    <Badge variant={record.status === 'approved' ? 'success' : 'danger'}>
                      {record.status === 'approved' ? 'Approved & Published' : 'Rejected'}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-[#8a7793]">{record.reviewedAt}</span>
                </div>

                <div className="text-xs text-[#cebdd9] bg-[#1d0b23] p-3 rounded-xl border border-[#32133b] space-y-1">
                  <p><strong className="text-white">Organiser:</strong> {record.organizerName}</p>
                  <p><strong className="text-white">Moderator Ruling:</strong> {record.reason}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8e7a96]">
                  <span>Moderator: <strong className="text-[#d8c7e2]">{record.reviewerName}</strong></span>
                  <span className="font-mono">Supabase RPC: review_event & publish_event</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Event Inspection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#17091c] border border-[#441852] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#31133a]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-bold text-white">
                    {selectedEvent.title}
                  </h3>
                  {getStatusBadge(selectedEvent.status)}
                </div>
                <p className="text-xs text-[#b8a7c2] mt-0.5">{selectedEvent.tagline}</p>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-[#9a86a3] hover:text-white hover:bg-[#2c0f33] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Banner */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-[#3d1847]">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-white font-medium">
                  {selectedEvent.venueName} • {selectedEvent.city}, Malawi
                </span>
              </div>
            </div>

            {/* Event Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#1f0b27] border border-[#381643]">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold block">Date</span>
                <span className="font-semibold text-white">{selectedEvent.startDate}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1f0b27] border border-[#381643]">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold block">Show Time</span>
                <span className="font-semibold text-white">{selectedEvent.startTime} CAT</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1f0b27] border border-[#381643]">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold block">Doors Open</span>
                <span className="font-semibold text-white">{selectedEvent.doorsOpen || 'TBA'}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1f0b27] border border-[#381643]">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold block">Age Restriction</span>
                <span className="font-semibold text-amber-300">{selectedEvent.ageRestriction}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Event Description & Program</span>
              <p className="text-xs text-[#cebedb] p-3.5 rounded-2xl bg-[#1e0b25] border border-[#34133d] leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* Ticket Tiers Inspection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#f43f5e]" />
                  Configured Ticket Tiers ({selectedEvent.tiers.length})
                </span>
                <span className="text-xs text-[#a28fa8] font-mono">
                  Capacity: {selectedEvent.capacity.toLocaleString()} seats
                </span>
              </div>

              <div className="space-y-2">
                {selectedEvent.tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-3 rounded-xl bg-[#1f0c27] border border-[#3c1747] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{tier.name}</p>
                      <p className="text-[10px] text-[#9c89a7]">{tier.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-[#f43f5e] text-sm">
                        MWK {tier.priceMWK.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#8e7a96]">
                        Allocation: {tier.totalQuantity} passes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#31133a] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#9f8ea7] hover:text-white transition-colors cursor-pointer"
              >
                Close Preview
              </button>

              <div className="flex items-center gap-2.5">
                {selectedEvent.status === 'pending_approval' && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setRejectionTarget(selectedEvent);
                        setRejectionReason('');
                        setRejectionError('');
                      }}
                      className="text-xs text-rose-300 border-rose-900/60"
                    >
                      Reject Event
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(selectedEvent)}
                      disabled={isSubmitting}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
                      leftIcon={<Check className="w-4 h-4" />}
                    >
                      Approve & Publish to NyasaTickets
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Event Rejection Modal */}
      {rejectionTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#17081b] border border-[#501625] shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#3a121e]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950/70 border border-rose-800 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Reject Event Submission</h3>
                  <p className="text-xs text-[#a997b4]">{rejectionTarget.title}</p>
                </div>
              </div>

              <button
                onClick={() => setRejectionTarget(null)}
                className="text-[#9a86a3] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#cebdd9]">
              Please state why this event cannot be approved in its current state (e.g. venue permit missing, pricing discrepancy, or quota exceeds venue fire limit). Organiser will be notified via Supabase RPC <code className="text-[#f43f5e] font-mono">review_event</code>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white block">
                Rejection Grounds & Required Changes <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectionError('');
                }}
                placeholder="e.g. Total ticket tier allocation exceeds verified venue fire safety capacity. Please adjust tier numbers or attach City Council overflow clearance."
                className="w-full p-3 rounded-xl bg-[#200a16] border border-[#4a1725] text-xs text-white placeholder-[#7e5d66] focus:outline-none focus:border-rose-500"
              />
              {rejectionError && (
                <p className="text-xs text-rose-400">{rejectionError}</p>
              )}
            </div>

            <div className="pt-3 border-t border-[#3a121e] flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRejectionTarget(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#9c89a7] hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                disabled={isSubmitting}
                className="text-xs"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

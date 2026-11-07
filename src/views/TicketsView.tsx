import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Download, 
  CheckCircle2, 
  X,
  FileText,
  Clock,
  Printer,
  ChevronRight
} from 'lucide-react';
import { TicketBooking } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { TicketDetailModal } from '../components/tickets/TicketDetailModal';

interface TicketsViewProps {
  tickets: TicketBooking[];
  onNavigateToDiscover: () => void;
  loadError?: string | null;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  onNavigateToDiscover,
  loadError
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<TicketBooking | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const upcomingTickets = tickets.filter(t => t.status === 'confirmed' || t.status === 'pending_payment');
  const pastTickets = tickets.filter(t => t.status === 'used' || t.status === 'cancelled');

  const displayedTickets = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  const handlePrint = (ref: string) => {
    setFeedbackNotice(`Ticket confirmation #${ref} prepared for printing / PDF export.`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" className="text-[10px]">Confirmed Pass</Badge>;
      case 'pending_payment':
        return <Badge variant="warning" className="text-[10px]">Reservation (Pending)</Badge>;
      case 'used':
        return <Badge variant="neutral" className="text-[10px]">Attended / Archived</Badge>;
      case 'cancelled':
        return <Badge variant="danger" className="text-[10px]">Cancelled</Badge>;
      default:
        return <Badge variant="plum" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            My Tickets Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#9f8fa9] mt-1">
            Track confirmed passes, order references, and event check-in details
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#200c28] border border-[#3c1748]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#3e347d] text-white shadow-sm'
                : 'text-[#9e8aa5] hover:text-white'
            }`}
          >
            Upcoming Passes ({upcomingTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'past'
                ? 'bg-[#3e347d] text-white shadow-sm'
                : 'text-[#9e8aa5] hover:text-white'
            }`}
          >
            Past Events ({pastTickets.length})
          </button>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
          {loadError}
        </p>
      )}

      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackNotice}</span>
          </div>
          <button onClick={() => setFeedbackNotice(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tickets List */}
      {displayedTickets.length > 0 ? (
        <div className="space-y-4">
          {displayedTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="group relative rounded-3xl bg-[#170a1c] border border-[#2f1338] hover:border-[#521f5f] transition-all overflow-hidden p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 cursor-pointer hover:bg-[#1d0b24]"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#260f2d] overflow-hidden shrink-0 border border-[#3c1746]">
                  <img
                    src={ticket.image}
                    alt={ticket.eventTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(ticket.status)}
                    <span className="text-[11px] font-mono text-[#d6bfe3]">
                      Ref: {ticket.referenceNumber}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-[#fce7f3] transition-colors truncate">
                    {ticket.eventTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#a997b2]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8b7bff]" />
                      {ticket.eventDate} ({ticket.eventTime})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8b7bff]" />
                      {ticket.venue}, {ticket.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <span className="text-[#a78bfa] font-semibold">{ticket.tierName}</span>
                    <span className="text-[#594264]">·</span>
                    <span className="text-[#d7c4e0] font-mono font-medium">
                      Qty: {ticket.quantity} · Total: MWK {ticket.totalMWK.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 md:flex-col sm:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-[#270f2f] pt-4 md:pt-0 md:pl-6 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTicket(ticket);
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  View Details
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrint(ticket.referenceNumber);
                  }}
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  className="w-full sm:w-auto"
                >
                  Print / Export
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Ticket className="w-6 h-6" />}
          title={activeTab === 'upcoming' ? "No upcoming tickets found" : "No past events recorded"}
          description={
            activeTab === 'upcoming' 
              ? "Discover concerts, festivals, theatre, and sports across Malawi and secure your passes now."
              : "Events you attend will be recorded here for your personal memories."
          }
          actionText="Discover Events"
          onActionClick={onNavigateToDiscover}
          className="my-8"
        />
      )}

      {/* Dedicated Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onPrintNotice={handlePrint}
        />
      )}
    </div>
  );
};

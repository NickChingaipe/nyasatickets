import React from 'react';
import { BarChart3, DollarSign, Users, Calendar } from 'lucide-react';
import { OrganizerEvent } from '../../types';

interface OrganizerAnalyticsSectionProps {
  events: OrganizerEvent[];
}

export const OrganizerAnalyticsSection: React.FC<OrganizerAnalyticsSectionProps> = ({
  events
}) => {
  const totalRevenueMWK = events.reduce((total, event) => total + event.grossRevenueMWK, 0);
  const totalTicketsSold = events.reduce((total, event) => total + event.ticketsSold, 0);
  const ticketTiers = events.flatMap(event => event.tiers.map(tier => ({ ...tier, eventTitle: event.title })));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
          Performance Intelligence
        </span>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
          Organiser Analytics & Revenue Trends
        </h2>
        <p className="text-xs text-[#9f8fa9] mt-0.5">
          Ticket and revenue totals from your organizer records
        </p>
      </div>

      {/* 1. Monthly Revenue & Sales Growth Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#170a1c] border border-[#32133b]">
          <div className="flex items-center gap-2 text-[#a491ad]"><DollarSign className="w-4 h-4" />Gross revenue</div>
          <p className="mt-3 text-2xl font-mono font-bold text-white">MWK {totalRevenueMWK.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#170a1c] border border-[#32133b]">
          <div className="flex items-center gap-2 text-[#a491ad]"><Users className="w-4 h-4" />Tickets sold</div>
          <p className="mt-3 text-2xl font-mono font-bold text-white">{totalTicketsSold.toLocaleString()}</p>
        </div>
      </div>

      <section className="p-5 sm:p-6 rounded-2xl bg-[#170a1c] border border-[#32133b] space-y-4">
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#a78bfa]" /><h3 className="font-semibold text-white">Ticket tiers</h3></div>
        {ticketTiers.length ? ticketTiers.map(tier => (
          <div key={tier.id} className="flex items-center justify-between gap-4 border-t border-[#2d1235] pt-3 text-sm">
            <div><p className="text-white">{tier.name}</p><p className="text-xs text-[#9f8fa9]">{tier.eventTitle}</p></div>
            <span className="font-mono text-[#d8c3e4]">{tier.soldQuantity} sold</span>
          </div>
        )) : <p className="text-sm text-[#9f8fa9]">No ticket analytics are available.</p>}
      </section>
    </div>
  );
};

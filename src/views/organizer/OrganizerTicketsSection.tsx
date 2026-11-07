import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Lock, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Layers
} from 'lucide-react';
import { OrganizerEvent, OrganizerTicketTier } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface OrganizerTicketsSectionProps {
  events: OrganizerEvent[];
  onOpenAddTier: (event: OrganizerEvent) => void;
  onEditTier: (event: OrganizerEvent, tier: OrganizerTicketTier) => void;
  onToggleTierActive: (eventId: string, tierId: string) => void;
}

export const OrganizerTicketsSection: React.FC<OrganizerTicketsSectionProps> = ({
  events,
  onOpenAddTier,
  onEditTier,
  onToggleTierActive
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
            Inventory & Tier Pricing
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
            Ticket Type Management
          </h2>
          <p className="text-xs text-[#9f8fa9] mt-0.5">
            Configure sales dates, pricing in MWK, order purchase limits, and monitor live inventory
          </p>
        </div>

        {activeEvent && (
          <Button
            variant="primary"
            size="md"
            onClick={() => onOpenAddTier(activeEvent)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Ticket Tier
          </Button>
        )}
      </div>

      {/* Event Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {events.map((evt) => (
          <button
            key={evt.id}
            onClick={() => setSelectedEventId(evt.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              activeEvent?.id === evt.id
                ? 'bg-[#3e347d] text-white border-[#8b7bff] shadow-md'
                : 'bg-[#1a0820] text-[#a997b2] border-[#311339] hover:border-[#4d1f5b]'
            }`}
          >
            {evt.title} ({evt.tiers.length} Tiers)
          </button>
        ))}
      </div>

      {/* Active Event Ticket Tiers List */}
      {activeEvent ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-[#9c89a7]">
            <span>
              Showing tiers for <strong className="text-white">{activeEvent.title}</strong> · {activeEvent.city}
            </span>
            <span className="font-mono text-[#d6bfe3]">
              Venue Capacity: {activeEvent.capacity.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeEvent.tiers.map((tier) => {
              const remaining = tier.totalQuantity - tier.soldQuantity - tier.reservedQuantity;
              const percentSold = Math.round((tier.soldQuantity / tier.totalQuantity) * 100);

              return (
                <div 
                  key={tier.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#2f1338] space-y-4 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base sm:text-lg">{tier.name}</h3>
                        <Badge variant={tier.active ? 'success' : 'neutral'} className="text-[10px]">
                          {tier.active ? 'Active on Market' : 'Hidden / Paused'}
                        </Badge>
                      </div>

                      <p className="text-xs text-[#baa7c3] leading-relaxed max-w-xl">
                        {tier.description || 'Standard gate pass entitlements.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#8e7a96] pt-1">
                        <span>Sales: <strong className="text-white">{tier.salesStartDate}</strong> to <strong className="text-white">{tier.salesEndDate}</strong></span>
                        <span>·</span>
                        <span>Per Order: <strong>{tier.minPerOrder} min</strong> / <strong>{tier.maxPerOrder} max</strong></span>
                      </div>
                    </div>

                    {/* Price and Protected Quantities Strip */}
                    <div className="flex items-center md:items-end justify-between md:justify-end gap-6 border-t md:border-t-0 border-[#260f2d] pt-3 md:pt-0 shrink-0">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8e7a96] block">Unit Price</span>
                        <span className="text-base sm:text-lg font-mono font-bold text-white tabular-nums">
                          MWK {tier.priceMWK.toLocaleString()}
                        </span>
                      </div>

                      {/* Read-Only Protected Sold Quantities per Phase 3 Rule */}
                      <div className="p-2.5 rounded-xl bg-[#200d27] border border-[#3c1748] text-right space-y-0.5">
                        <div className="flex items-center gap-1.5 justify-end text-[10px] font-bold text-amber-400">
                          <Lock className="w-3 h-3" />
                          <span>Protected Count</span>
                        </div>
                        <div className="font-mono text-xs text-white">
                          <span className="text-emerald-400 font-bold">{tier.soldQuantity} Sold</span>
                          <span className="text-[#624f69] mx-1">/</span>
                          <span className="text-amber-300 font-bold">{tier.reservedQuantity} Res</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Progress Bar */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#a28fa8] mb-1.5">
                      <span>Inventory: <strong className="text-white">{remaining} available</strong> of {tier.totalQuantity} total cap</span>
                      <span className="text-white font-bold">{percentSold}% sold</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#2a1032] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4c1d95] via-[#3e347d] to-[#c084fc] rounded-full"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>

                  {/* Tier Controls */}
                  <div className="pt-3 border-t border-[#260f2c] flex items-center justify-between">
                    <button
                      onClick={() => onToggleTierActive(activeEvent.id, tier.id)}
                      className={`text-xs font-medium cursor-pointer transition-colors ${
                        tier.active ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                    >
                      {tier.active ? 'Pause Sales for this Tier' : 'Resume Public Sales'}
                    </button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEditTier(activeEvent, tier)}
                      leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    >
                      Configure Tier
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-[#16081c] border border-[#2d1235] text-xs text-[#9f8fa9]">
          No events available. Create an event first to add ticket tiers.
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Ticket, 
  Share2, 
  Bookmark, 
  Users, 
  AlertCircle, 
  FileText, 
  Phone, 
  Mail,
  ChevronRight,
  Info
} from 'lucide-react';
import { EventItem, TicketTier } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface EventDetailsViewProps {
  event: EventItem;
  onBack: () => void;
  onStartCheckout: (event: EventItem, initialTier?: TicketTier) => void;
  isSaved?: boolean;
  onToggleSave?: (eventId: string, e: React.MouseEvent) => void;
}

export const EventDetailsView: React.FC<EventDetailsViewProps> = ({
  event,
  onBack,
  onStartCheckout,
  isSaved = false,
  onToggleSave
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedTierForPreview, setSelectedTierForPreview] = useState<string>(event.tiers[0]?.id || '');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const selectedTier = event.tiers.find(t => t.id === selectedTierForPreview) || event.tiers[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* 1. Breadcrumb & Quick Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c8b4d4] hover:text-white transition-colors cursor-pointer group py-1"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Event Discovery</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b0b21] hover:bg-[#270f2f] border border-[#3b1747] text-xs text-[#cfbed8] hover:text-white transition-all cursor-pointer"
            title="Share this event"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={(e) => onToggleSave?.(event.id, e)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#3e347d] border-[#8b7bff] text-white'
                : 'bg-[#1b0b21] hover:bg-[#270f2f] border-[#3b1747] text-[#cfbed8] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save Event'}</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Media Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-[#16081c] border border-[#3b1747] shadow-2xl">
        <div className="relative w-full aspect-[21/9] min-h-[280px] sm:min-h-[380px] max-h-[460px] bg-[#220d2b]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          {/* Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0512] via-[#0e0512]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0512]/70 via-transparent to-transparent hidden md:block" />

          {/* Top Floating Category & Age Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#3e347d]/90 text-white border border-[#8b7bff]/40 shadow-lg backdrop-blur-md">
              {event.categoryLabel}
            </span>

            {event.ageRestriction && (
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#1a0822]/90 text-[#e9d5ff] border border-[#581c87]/70 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#a78bfa]" />
                {event.ageRestriction}
              </span>
            )}
          </div>

          {/* Headline on Banner */}
          <div className="absolute bottom-5 inset-x-5 sm:bottom-8 sm:inset-x-8 max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight drop-shadow-md">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base text-[#ded0e6] max-w-2xl leading-relaxed drop-shadow-sm font-medium">
              {event.tagline}
            </p>
          </div>
        </div>

        {/* 3. Essential Event Fact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 bg-[#140718] border-t border-[#290e2f]">
          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#280e30] border border-[#481c56] flex items-center justify-center text-[#8b7bff] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8b7794] tracking-wider block">Date</span>
              <p className="text-xs sm:text-sm font-semibold text-white">{event.dateDisplay}</p>
              <span className="text-[11px] text-[#a491ad]">{event.timeDisplay}</span>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#280e30] border border-[#481c56] flex items-center justify-center text-[#8b7bff] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8b7794] tracking-wider block">Venue</span>
              <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px]">{event.venue}</p>
              <span className="text-[11px] text-[#a491ad]">{event.city}, Malawi</span>
            </div>
          </div>

          {/* Doors Open / Age */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#280e30] border border-[#481c56] flex items-center justify-center text-[#c084fc] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8b7794] tracking-wider block">Doors Opening</span>
              <p className="text-xs sm:text-sm font-semibold text-white">{event.doorsOpen || 'Early arrival recommended'}</p>
              <span className="text-[11px] text-[#a491ad]">Gate turnstile admission</span>
            </div>
          </div>

          {/* Pricing starting from */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#280e30] border border-[#481c56] flex items-center justify-center text-emerald-400 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8b7794] tracking-wider block">Pricing</span>
              <p className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">{event.priceDisplay}</p>
              <span className="text-[11px] text-emerald-400 font-medium">Official Gate Tiers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Layout: Details on Left, Ticket Purchase Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Description, Lineup, Terms, Organizer */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Event */}
          <section className="p-6 sm:p-7 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-3">
            <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
              About This Event
            </h2>
            <p className="text-sm text-[#baa8c4] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </section>

          {/* Lineup / Performers */}
          {event.lineup && event.lineup.length > 0 && (
            <section className="p-6 sm:p-7 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#8b7bff]" />
                  <span>Headliners & Featured Artists</span>
                </h2>
                <span className="text-xs text-[#9f8ca7] font-medium font-mono tabular-nums">
                  {event.lineup.length} Acts Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {event.lineup.map((artist, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#200d27] border border-[#35143e] flex items-center gap-2 text-xs font-semibold text-white"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b7bff]" />
                    <span className="truncate">{artist}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Event Terms & Conditions */}
          <section className="p-6 sm:p-7 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#a78bfa]" />
              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                Event Terms & Gate Policies
              </h2>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#bcaac5]">
              {(event.termsAndConditions || [
                'Valid booking reference must be presented at the gate.',
                'Security search will be conducted at turnstiles.',
                'Organizers reserve the right to refuse admission to intoxicated guests.'
              ]).map((term, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#290e2f] border border-[#481c56] flex items-center justify-center text-[10px] font-bold text-[#8b7bff] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Organizer Information */}
          <section className="p-6 sm:p-7 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                Presented By
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Organizer
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#200d27] border border-[#381643]">
              <div className="space-y-1">
                <h3 className="text-base font-display font-bold text-white">
                  {event.organizer.name}
                </h3>
                <p className="text-xs text-[#a997b3] max-w-md">
                  {event.organizer.bio || 'Official event promoter verified on NyasaTickets platform.'}
                </p>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-[#b8a6c2] space-y-1 shrink-0">
                {event.organizer.contactEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8b7bff]" />
                    {event.organizer.contactEmail}
                  </span>
                )}
                {event.organizer.contactPhone && (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#8b7bff]" />
                    {event.organizer.contactPhone}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Ticket Tier Selection & Buy Action */}
        <div className="lg:col-span-4 sticky top-24 space-y-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#3a1645] shadow-xl space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa] block">
                Official Tickets
              </span>
              <h3 className="text-lg font-display font-bold text-white">
                Select Your Ticket Type
              </h3>
              <p className="text-xs text-[#9f8ca7] mt-0.5">
                Prices in Malawian Kwacha (MWK)
              </p>
            </div>

            {/* Available Ticket Types */}
            <div className="space-y-3">
              {event.tiers.map((tier) => {
                const isSelected = tier.id === selectedTierForPreview;
                const percentRemaining = Math.round((tier.remaining / tier.capacity) * 100);

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierForPreview(tier.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#32103d] to-[#200927] border-[#8b7bff] shadow-md shadow-[#3e347d]/15'
                        : 'bg-[#1e0c25] border-[#311339] hover:border-[#4d1f5b]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-sm text-white block">
                          {tier.name}
                        </span>
                        <p className="text-xs text-[#a28fa7] mt-0.5 line-clamp-1">
                          {tier.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-sm text-white tabular-nums">
                          MWK {tier.priceMWK.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Remaining availability progress */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[10px] text-[#917e99] mb-1">
                        <span>Availability</span>
                        <span className="font-mono text-[#e4d2ee] font-medium">
                          {tier.remaining} of {tier.capacity} left
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#2a1032] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            tier.remaining < 30 ? 'bg-amber-500' : 'bg-gradient-to-r from-[#4c1d95] to-[#c084fc]'
                          }`}
                          style={{ width: `${percentRemaining}%` }}
                        />
                      </div>
                    </div>

                    {/* Perks breakdown */}
                    <div className="space-y-1 pt-1 text-[11px] text-[#d6bfe3]">
                      {tier.perks.slice(0, 2).map((perk, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#8b7bff] shrink-0" />
                          <span className="truncate">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal Preview & Primary CTA */}
            <div className="pt-3 border-t border-[#2d1235] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#93809b] uppercase font-bold block">Selected</span>
                  <span className="text-xs font-semibold text-white">{selectedTier.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-mono font-bold text-white tabular-nums">
                    MWK {selectedTier.priceMWK.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => onStartCheckout(event, selectedTier)}
                className="w-full shadow-lg shadow-[#3e347d]/20"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#927f9b]">
                <Info className="w-3.5 h-3.5" />
                <span>Instant reservation with zero hidden charges</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Mobile Sticky Bottom CTA Bar */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-30 p-3 bg-[#130718]/95 backdrop-blur-md border-t border-[#3b1747] flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-[#9c89a5] block uppercase font-bold">From</span>
          <span className="text-base font-mono font-bold text-white tabular-nums">
            {event.priceDisplay}
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onStartCheckout(event, selectedTier)}
          className="flex-1 max-w-[200px]"
        >
          Get Tickets
        </Button>
      </div>
    </div>
  );
};

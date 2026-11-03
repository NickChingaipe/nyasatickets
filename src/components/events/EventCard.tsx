import React, { useState } from 'react';
import { MapPin, Calendar, Bookmark, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { EventItem } from '../../types';
import { Badge } from '../common/Badge';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  isSaved?: boolean;
  onToggleSave?: (eventId: string, e: React.MouseEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  isSaved = false,
  onToggleSave
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const getStatusBadge = () => {
    switch (event.status) {
      case 'selling_fast':
        return <Badge variant="warning" className="text-[11px]">Selling Fast</Badge>;
      case 'sold_out':
        return <Badge variant="danger" className="text-[11px]">Sold Out</Badge>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative rounded-2xl bg-[#170a1b] hover:bg-[#1f0e25] border border-[#2e1336] hover:border-[#521f5f] transition-all duration-200 flex flex-col overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-[#200826]/40 hover:-translate-y-0.5"
    >
      {/* Visual Asset Container (4:3 ratio) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-[#240e2b]">
        {!imageFailed && event.image ? (
          <img
            src={event.image}
            alt={event.title}
            onError={() => setImageFailed(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Zero-Broken-Image Policy Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#2c0e35] via-[#1d0923] to-[#120516] text-[#b498c3]">
            <Ticket className="w-10 h-10 text-[#d8a8ed]/50 mb-2" />
            <span className="text-xs font-semibold text-center text-[#e7d2f3] line-clamp-1">{event.title}</span>
            <span className="text-[10px] text-[#9a7fa7]">{event.venue}</span>
          </div>
        )}

        {/* Gradient Contrast Scrim for Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#170a1b] via-[#170a1b]/20 to-transparent pointer-events-none" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <div>
            {getStatusBadge()}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(event.id, e);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#f43f5e] text-white shadow-md'
                : 'bg-[#120716]/75 text-[#d2bedb] hover:text-white hover:bg-[#120716]'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save event'}
            aria-label="Save event"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom City & Date Tag over Scrim */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-[#eedcf5] font-medium pointer-events-none">
          <span className="flex items-center gap-1.5 drop-shadow-sm truncate max-w-[60%]">
            <MapPin className="w-3.5 h-3.5 text-[#f43f5e] shrink-0" />
            <span className="truncate">{event.city}, Malawi</span>
          </span>
          <span className="drop-shadow-sm tabular-nums text-[#cfbed8] text-[11px] shrink-0">
            {event.dateDisplay.split('–')[0]}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#a591b0] mb-1.5 font-medium flex-wrap">
            <span className="text-[#f472b6] font-semibold">{event.categoryLabel}</span>
            <span aria-hidden="true" className="text-[#5b4465]">·</span>
            <span className="truncate">{event.venue}</span>
            <span aria-hidden="true" className="text-[#5b4465]">·</span>
            <span className="text-[#c4b1ce]">{event.timeDisplay}</span>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-display font-bold text-white group-hover:text-[#fbcfe8] transition-colors line-clamp-1 mb-1.5">
            {event.title}
          </h3>

          {/* Tagline / Excerpt */}
          <p className="text-xs text-[#9f8ba8] line-clamp-2 leading-relaxed">
            {event.tagline}
          </p>
        </div>

        {/* Pricing & CTA Row */}
        <div className="mt-4 pt-3 border-t border-[#2a1133] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#7e6988] block">
              From
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">
              {event.priceDisplay}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2b1034] group-hover:bg-gradient-to-r group-hover:from-[#9f1239] group-hover:to-[#701a75] text-[#eedbf5] group-hover:text-white border border-[#481c56] group-hover:border-[#f43f5e]/40 transition-all cursor-pointer shrink-0"
          >
            <span>Tickets</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

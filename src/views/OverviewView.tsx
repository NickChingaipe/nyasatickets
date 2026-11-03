import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Music, 
  Theater, 
  Wine, 
  Trophy, 
  Briefcase, 
  Ticket,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { EVENT_CATEGORIES } from '../data/categories';
import { EventCard } from '../components/events/EventCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface OverviewViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onNavigateToDiscover: (category?: EventCategory, city?: string) => void;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string, e: React.MouseEvent) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  events,
  onSelectEvent,
  onNavigateToDiscover,
  savedEventIds,
  onToggleSaveEvent
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedCityQuick, setSelectedCityQuick] = useState<string>('all');

  const featuredEvent = events.find(e => e.featured) || events[0];

  const categoryIcons: Record<string, React.ReactNode> = {
    Music: <Music className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    Theater: <Theater className="w-5 h-5" />,
    Wine: <Wine className="w-5 h-5" />,
    Trophy: <Trophy className="w-5 h-5" />,
    Briefcase: <Briefcase className="w-5 h-5" />
  };

  const cities = [
    { id: 'all', label: 'All Malawi' },
    { id: 'Lilongwe', label: 'Lilongwe' },
    { id: 'Blantyre', label: 'Blantyre' },
    { id: 'Mzuzu', label: 'Mzuzu' },
    { id: 'Mangochi', label: 'Lake Malawi' }
  ];

  // Filtered upcoming events
  const filteredEvents = events.filter(e => {
    const matchCategory = activeCategoryFilter === 'all' || e.category === activeCategoryFilter;
    const matchCity = selectedCityQuick === 'all' || e.city === selectedCityQuick;
    return matchCategory && matchCity;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 1. Welcome Section & Regional Quick Filter */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#200929] via-[#1a0821] to-[#120516] border border-[#3b1747] overflow-hidden shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#9f1239]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#581c87]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#361342]/80 border border-[#5d2273]/80 text-[#f3d9fd] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#f43f5e]" />
            <span>Moni! Welcome to NyasaTickets</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
            Discover Malawi's Most <span className="bg-gradient-to-r from-[#fb7185] via-[#f43f5e] to-[#c084fc] bg-clip-text text-transparent">Exciting Live Experiences</span>
          </h1>

          <p className="text-sm sm:text-base text-[#b4a0be] mt-2.5 max-w-xl leading-relaxed">
            From the shores of Lake of Stars to vibrant concerts in Blantyre and Lilongwe. Secure your digital pass instantly via Airtel Money, TNM Mpamba, or card.
          </p>

          {/* City Quick Segmented Filter */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#8b7796] mr-1">Region:</span>
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCityQuick(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedCityQuick === city.id
                    ? 'bg-[#831843] text-white shadow-sm border border-[#f43f5e]'
                    : 'bg-[#250e2d]/80 text-[#baaad1] hover:text-white hover:bg-[#341440] border border-[#431853]'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Featured Event Spotlight Hero */}
      {featuredEvent && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                Featured Spotlight
              </h2>
            </div>
            <button
              onClick={() => onNavigateToDiscover()}
              className="text-xs font-semibold text-[#f472b6] hover:text-[#fb7185] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Explore all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            onClick={() => onSelectEvent(featuredEvent)}
            className="group relative rounded-3xl bg-[#19091f] border border-[#3b1747] hover:border-[#68247d] overflow-hidden transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[#2a0b33]/60 grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Left 7 Columns: Big Hero Image */}
            <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:h-[400px] overflow-hidden bg-[#240e2b]">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#19091f]/40 to-[#19091f]" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#831843]/90 text-white border border-[#f43f5e]/40 shadow-lg">
                  Headliner Event
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Event Info & Action */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Clean Unboxed Metadata */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f472b6]">
                  <span>{featuredEvent.categoryLabel}</span>
                  <span aria-hidden="true" className="text-[#5b4465]">·</span>
                  <span className="text-[#d8c3e4]">{featuredEvent.city}, Malawi</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight group-hover:text-[#fce7f3] transition-colors">
                  {featuredEvent.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#ab97b4] leading-relaxed line-clamp-3">
                  {featuredEvent.description}
                </p>

                {/* Key Event Details */}
                <div className="space-y-2 pt-2 text-xs text-[#cfbee0]">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#f43f5e] shrink-0" />
                    <span>{featuredEvent.dateDisplay} ({featuredEvent.timeDisplay})</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#f43f5e] shrink-0" />
                    <span className="truncate">{featuredEvent.venue}</span>
                  </div>
                </div>
              </div>

              {/* Price & Booking Trigger */}
              <div className="mt-6 pt-5 border-t border-[#2d1236] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#8a7696] block">
                    Tickets starting from
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-white tabular-nums">
                    {featuredEvent.priceDisplay}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Book Tickets
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Event Discovery Categories */}
      <section>
        <SectionHeader
          title="Browse by Category"
          subtitle="Explore live performances, cultural festivals, theatre, and sports across the Warm Heart of Africa"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigateToDiscover(cat.id)}
              className="p-4 rounded-2xl bg-[#170a1c] hover:bg-[#250e2d] border border-[#2e1335] hover:border-[#602374] text-left transition-all duration-200 cursor-pointer group flex flex-col justify-between h-32 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#270f2f] group-hover:bg-[#831843] border border-[#481c56] flex items-center justify-center text-[#d7bfe4] group-hover:text-white transition-colors">
                {categoryIcons[cat.iconName] || <Ticket className="w-5 h-5" />}
              </div>

              <div>
                <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#fbcfe8] transition-colors leading-snug">
                  {cat.name}
                </p>
                <span className="text-[11px] text-[#8e7a98] font-mono tabular-nums">
                  {cat.count} events
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Upcoming Events Section with Filter Bar */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Upcoming Live Events
            </h2>
            <p className="text-xs sm:text-sm text-[#9f8fa9] mt-1">
              Confirmed dates and ticket tiers available for direct reservation
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#19091e] border border-[#301337] overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-[#831843] text-white shadow-sm'
                  : 'text-[#a28fa9] hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setActiveCategoryFilter('music')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === 'music'
                  ? 'bg-[#831843] text-white shadow-sm'
                  : 'text-[#a28fa9] hover:text-white'
              }`}
            >
              Concerts
            </button>
            <button
              onClick={() => setActiveCategoryFilter('cultural')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === 'cultural'
                  ? 'bg-[#831843] text-white shadow-sm'
                  : 'text-[#a28fa9] hover:text-white'
              }`}
            >
              Festivals
            </button>
            <button
              onClick={() => setActiveCategoryFilter('theatre')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === 'theatre'
                  ? 'bg-[#831843] text-white shadow-sm'
                  : 'text-[#a28fa9] hover:text-white'
              }`}
            >
              Theatre
            </button>
            <button
              onClick={() => setActiveCategoryFilter('sports')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === 'sports'
                  ? 'bg-[#831843] text-white shadow-sm'
                  : 'text-[#a28fa9] hover:text-white'
              }`}
            >
              Sports
            </button>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={onSelectEvent}
                isSaved={savedEventIds.includes(event.id)}
                onToggleSave={onToggleSaveEvent}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[#16081b] border border-[#2d1235]">
            <p className="text-sm text-[#9f8ba8]">No events found in this category for {selectedCityQuick === 'all' ? 'Malawi' : selectedCityQuick}.</p>
            <button 
              onClick={() => { setActiveCategoryFilter('all'); setSelectedCityQuick('all'); }}
              className="mt-3 text-xs font-semibold text-[#f43f5e] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* 5. Recommended & Trust Section */}
      <section className="rounded-3xl p-6 sm:p-8 bg-[#17091e] border border-[#32143b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f472b6]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Gate Entry</span>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-white">
            Official Ticketing Partner for Malawi's Premier Venues
          </h3>
          <p className="text-xs sm:text-sm text-[#a491ae] leading-relaxed">
            All tickets purchased on NyasaTickets feature cryptographically unique QR passes that work seamlessly with gate stewards even in low network areas.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigateToDiscover()}
          >
            Explore All Events
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigateToDiscover('cultural')}
          >
            Lake Festivals
          </Button>
        </div>
      </section>
    </div>
  );
};

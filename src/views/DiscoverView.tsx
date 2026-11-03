import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  X, 
  SlidersHorizontal,
  Compass,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { EVENT_CATEGORIES } from '../data/categories';
import { EventCard } from '../components/events/EventCard';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

interface DiscoverViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  initialCategory?: EventCategory | 'all';
  initialCity?: string;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string, e: React.MouseEvent) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  events,
  onSelectEvent,
  initialCategory = 'all',
  initialCity = 'all',
  savedEventIds,
  onToggleSaveEvent
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedDateRange, setSelectedDateRange] = useState<'all' | 'weekend' | 'month' | 'upcoming'>('all');
  const [priceSort, setPriceSort] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  const cities = ['All Cities', 'Lilongwe', 'Blantyre', 'Mzuzu', 'Mangochi', 'Salima', 'Zomba'];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const query = searchFilter.toLowerCase().trim();
      const matchSearch = query === '' || 
        e.title.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query) ||
        e.city.toLowerCase().includes(query) ||
        e.tagline.toLowerCase().includes(query) ||
        (e.lineup && e.lineup.some(artist => artist.toLowerCase().includes(query)));

      const matchCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchCity = selectedCity === 'All Cities' || selectedCity === 'all' || e.city === selectedCity;

      let matchDate = true;
      if (selectedDateRange === 'weekend') {
        // Events mentioning Sat or Sun
        matchDate = e.dateDisplay.toLowerCase().includes('sat') || e.dateDisplay.toLowerCase().includes('sun');
      } else if (selectedDateRange === 'month') {
        // Next 30 days
        matchDate = e.dateTimestamp > Date.now() && e.dateTimestamp < Date.now() + 30 * 24 * 3600 * 1000 * 30;
      }

      return matchSearch && matchCategory && matchCity && matchDate;
    }).sort((a, b) => {
      if (priceSort === 'price_asc') return a.priceMWK - b.priceMWK;
      if (priceSort === 'price_desc') return b.priceMWK - a.priceMWK;
      return 0;
    });
  }, [events, searchFilter, selectedCategory, selectedCity, selectedDateRange, priceSort]);

  const hasActiveFilters = searchFilter !== '' || 
    selectedCategory !== 'all' || 
    (selectedCity !== 'All Cities' && selectedCity !== 'all') ||
    selectedDateRange !== 'all';

  const resetFilters = () => {
    setSearchFilter('');
    setSelectedCategory('all');
    setSelectedCity('All Cities');
    setSelectedDateRange('all');
    setPriceSort('featured');
  };

  // Featured event that matches criteria
  const featuredItem = filteredEvents.find(e => e.featured);
  const remainingEvents = featuredItem ? filteredEvents.filter(e => e.id !== featuredItem.id) : filteredEvents;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header & Controls Strip */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl space-y-5">
        <div>
          <h1 className="text-xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Discover Live Events in Malawi
          </h1>
          <p className="text-xs sm:text-sm text-[#9f8fa9] mt-1">
            Search concerts, cultural festivals, theatre, sports, and outdoor gatherings
          </p>
        </div>

        {/* Search Input and Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Main Search Input */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e7a98]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by event, artist, venue or city..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-xs sm:text-sm text-white placeholder-[#877292] focus:outline-none focus:border-[#f43f5e] transition-all"
            />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e7a98] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location / City Filter */}
          <div className="sm:col-span-3 relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e7a98]" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-xs sm:text-sm text-white focus:outline-none focus:border-[#f43f5e] transition-all cursor-pointer appearance-none"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="bg-[#1f0c26] text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="sm:col-span-3 relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e7a98]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value as any)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-xs sm:text-sm text-white focus:outline-none focus:border-[#f43f5e] transition-all cursor-pointer appearance-none"
            >
              <option value="all" className="bg-[#1f0c26]">All Dates</option>
              <option value="weekend" className="bg-[#1f0c26]">This Weekend</option>
              <option value="month" className="bg-[#1f0c26]">Next 30 Days</option>
              <option value="upcoming" className="bg-[#1f0c26]">2026/2027 Calendar</option>
            </select>
          </div>

          {/* Price Sort */}
          <div className="sm:col-span-2">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-xs sm:text-sm text-white focus:outline-none focus:border-[#f43f5e] transition-all cursor-pointer appearance-none"
            >
              <option value="featured" className="bg-[#1f0c26]">Featured</option>
              <option value="price_asc" className="bg-[#1f0c26]">Price: Low</option>
              <option value="price_desc" className="bg-[#1f0c26]">Price: High</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#831843] text-white border border-[#f43f5e]'
                : 'bg-[#220d2b] text-[#ab99b4] hover:text-white border border-[#3a1645]'
            }`}
          >
            All Categories
          </button>

          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#831843] text-white border border-[#f43f5e]'
                  : 'bg-[#220d2b] text-[#ab99b4] hover:text-white border border-[#3a1645]'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#f43f5e] hover:bg-[#831843]/20 transition-colors ml-auto whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-[#9f8ea7] px-1 font-medium">
        <span>
          Showing <span className="font-bold text-white font-mono tabular-nums">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'} matching criteria
        </span>
        {hasActiveFilters && (
          <span className="text-[#e2cfee]">Active filters applied</span>
        )}
      </div>

      {/* 2. Featured Event Spotlight Section (when applicable) */}
      {featuredItem && !hasActiveFilters && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f43f5e]" />
            <h2 className="text-base font-display font-bold text-white">
              Featured Festival Spotlight
            </h2>
          </div>

          <div
            onClick={() => onSelectEvent(featuredItem)}
            className="group relative rounded-3xl bg-[#19091f] border border-[#3b1747] hover:border-[#68247d] overflow-hidden transition-all duration-300 cursor-pointer shadow-xl grid grid-cols-1 md:grid-cols-12 gap-0"
          >
            <div className="md:col-span-7 relative aspect-[16/9] md:aspect-auto md:h-72 overflow-hidden bg-[#240e2b]">
              <img
                src={featuredItem.image}
                alt={featuredItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#19091f]/40 to-[#19091f]" />
            </div>

            <div className="md:col-span-5 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#f472b6]">
                  {featuredItem.categoryLabel} · {featuredItem.city}, Malawi
                </span>
                <h3 className="text-xl font-display font-bold text-white leading-tight group-hover:text-[#fce7f3] transition-colors">
                  {featuredItem.title}
                </h3>
                <p className="text-xs text-[#ab97b4] line-clamp-2 leading-relaxed">
                  {featuredItem.tagline}
                </p>
                <div className="text-xs text-[#cfbee0] space-y-1 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#f43f5e]" />
                    {featuredItem.dateDisplay} ({featuredItem.timeDisplay})
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#f43f5e]" />
                    {featuredItem.venue}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2d1236] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8e7a96] block uppercase font-bold">Tickets from</span>
                  <span className="text-base font-mono font-bold text-white tabular-nums">
                    {featuredItem.priceDisplay}
                  </span>
                </div>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Events Grid or Empty State */}
      {filteredEvents.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-white">
              Upcoming Events Calendar
            </h2>
          </div>

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
        </section>
      ) : (
        <EmptyState
          icon={<Compass className="w-7 h-7" />}
          title="No events match your search criteria"
          description={`We couldn't find any events matching "${searchFilter || selectedCity || selectedCategory}". Try removing filters or searching for another artist or city.`}
          actionText="Reset All Filters"
          onActionClick={resetFilters}
          className="my-12"
        />
      )}
    </div>
  );
};

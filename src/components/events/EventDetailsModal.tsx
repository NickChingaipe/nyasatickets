import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Minus, 
  Plus, 
  Ticket, 
  CreditCard, 
  Smartphone,
  Share2,
  Bookmark
} from 'lucide-react';
import { EventItem, TicketTier } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
  onBookSuccess: (bookingDetails: {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    venue: string;
    city: string;
    tierName: string;
    quantity: number;
    totalMWK: number;
    image: string;
  }) => void;
  isSaved?: boolean;
  onToggleSave?: (eventId: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onBookSuccess,
  isSaved = false,
  onToggleSave
}) => {
  if (!event) return null;

  const [selectedTierId, setSelectedTierId] = useState<string>(event.tiers[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPayment, setSelectedPayment] = useState<'airtel' | 'mpamba' | 'card'>('airtel');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedTier = event.tiers.find(t => t.id === selectedTierId) || event.tiers[0];
  const totalAmountMWK = (selectedTier?.priceMWK || event.priceMWK) * quantity;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onBookSuccess({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.dateDisplay,
        eventTime: event.timeDisplay,
        venue: event.venue,
        city: event.city,
        tierName: selectedTier?.name || 'Standard Pass',
        quantity,
        totalMWK: totalAmountMWK,
        image: event.image
      });
      onClose();
    }, 700);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-[#140819] border border-[#3b1747] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative w-full h-56 sm:h-72 bg-[#220d2a] shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140819] via-[#140819]/40 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#120716]/80 backdrop-blur-md text-[#f5d0fe] border border-[#521c64]">
              {event.categoryLabel}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-[#120716]/80 hover:bg-[#120716] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-[#3e164d]"
                title="Share event link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onToggleSave?.(event.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-[#3e164d] ${
                  isSaved ? 'bg-[#8b7bff] text-white' : 'bg-[#120716]/80 text-[#d3bedc] hover:text-white'
                }`}
                title="Save event"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#120716]/80 hover:bg-[#120716] text-[#dfcbe7] hover:text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-[#3e164d]"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Event Title over Image */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-6">
            <h2 className="text-xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#d4bedf] mt-1 line-clamp-1">
              {event.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Date, Venue, Organizer Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#1c0b24] border border-[#32133c]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2e1038] border border-[#4d1a5e] flex items-center justify-center text-[#a78bfa] shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-[#8e7b98] block">Date & Time</span>
                <p className="text-xs font-semibold text-white truncate">{event.dateDisplay}</p>
                <p className="text-[11px] text-[#a491ae]">{event.timeDisplay}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2e1038] border border-[#4d1a5e] flex items-center justify-center text-[#8b7bff] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-[#8e7b98] block">Location</span>
                <p className="text-xs font-semibold text-white truncate">{event.venue}</p>
                <p className="text-[11px] text-[#a491ae]">{event.city}, Malawi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2e1038] border border-[#4d1a5e] flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-[#8e7b98] block">Organizer</span>
                <p className="text-xs font-semibold text-white truncate">{event.organizer.name}</p>
                <p className="text-[11px] text-emerald-400 font-medium">Verified Partner</p>
              </div>
            </div>
          </div>

          {/* About Event */}
          <div>
            <h4 className="text-sm font-display font-bold text-white mb-2">About This Event</h4>
            <p className="text-xs sm:text-sm text-[#b29fb9] leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Ticket Tiers Selection */}
          <div>
            <h4 className="text-sm font-display font-bold text-white mb-3 flex items-center justify-between">
              <span>Select Ticket Tier</span>
              <span className="text-xs font-normal text-[#9d8aa5]">Pricing in Malawian Kwacha (MWK)</span>
            </h4>

            <div className="space-y-2.5">
              {event.tiers.map((tier) => {
                const isSelected = tier.id === selectedTierId;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#32103d] to-[#220a2a] border-[#8b7bff] shadow-md shadow-[#3e347d]/15'
                        : 'bg-[#18091e] border-[#2e1236] hover:border-[#4b1d58]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{tier.name}</span>
                        {isSelected && (
                          <Badge variant="plum" className="text-[10px] py-0">Selected</Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#a390ab]">{tier.description}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-[#d6bfe3]">
                        {tier.perks.map((perk, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-[#8b7bff]" />
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-base sm:text-lg font-mono font-bold text-white tabular-nums">
                        MWK {tier.priceMWK.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-[#8e7a96]">
                        {tier.remaining} remaining of {tier.capacity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quantity and Payment Method Strip */}
          <div className="p-4 rounded-2xl bg-[#18091e] border border-[#2f1338] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs font-semibold text-white">Quantity:</span>
              <div className="flex items-center border border-[#431752] rounded-xl bg-[#230d2d] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#d1bedb] hover:text-white hover:bg-[#341342] transition-colors cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center font-mono font-bold text-sm text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#d1bedb] hover:text-white hover:bg-[#341342] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Malawi Payment Method Selector */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedPayment('airtel')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedPayment === 'airtel'
                    ? 'bg-[#3e347d] text-white border-[#8b7bff]'
                    : 'bg-[#230d2d] text-[#b5a2bf] border-[#3d174b] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-[#8b7bff]" />
                <span>Airtel Money</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPayment('mpamba')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedPayment === 'mpamba'
                    ? 'bg-[#15803d] text-white border-[#4ade80]'
                    : 'bg-[#230d2d] text-[#b5a2bf] border-[#3d174b] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>TNM Mpamba</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPayment('card')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedPayment === 'card'
                    ? 'bg-[#4338ca] text-white border-[#818cf8]'
                    : 'bg-[#230d2d] text-[#b5a2bf] border-[#3d174b] hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-300" />
                <span>Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Checkout Bar */}
        <div className="p-4 sm:p-5 bg-[#17091e] border-t border-[#34143e] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-[#9a86a3] block">
              Total ({quantity} {quantity === 1 ? 'ticket' : 'tickets'}):
            </span>
            <span className="text-lg sm:text-xl font-mono font-bold text-white tabular-nums">
              MWK {totalAmountMWK.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              isLoading={isProcessing}
              onClick={handleCheckout}
              leftIcon={<Ticket className="w-4 h-4" />}
            >
              Get {quantity} Ticket{quantity > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

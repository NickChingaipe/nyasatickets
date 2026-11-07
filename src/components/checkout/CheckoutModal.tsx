import React, { useState } from 'react';
import { 
  X, 
  Minus, 
  Plus, 
  Ticket, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  CreditCard, 
  Smartphone,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { EventItem, TicketTier, TicketBooking } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { supabaseService } from '../../lib/supabase';

interface CheckoutModalProps {
  event: EventItem;
  initialTier?: TicketTier;
  onClose: () => void;
  onOrderConfirmed: (booking: TicketBooking) => void;
  customerProfileName?: string;
  customerProfileEmail?: string;
  customerProfilePhone?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  event,
  initialTier,
  onClose,
  onOrderConfirmed,
  customerProfileName = '',
  customerProfileEmail = '',
  customerProfilePhone = ''
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTier?.id || event.tiers[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentProvider, setPaymentProvider] = useState<'paychangu' | 'airtel' | 'mpamba'>('airtel');

  // Customer contact form
  const [fullName, setFullName] = useState<string>(customerProfileName);
  const [email, setEmail] = useState<string>(customerProfileEmail);
  const [phone, setPhone] = useState<string>(customerProfilePhone);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTier = event.tiers.find(t => t.id === selectedTierId) || event.tiers[0];
  const unitPrice = selectedTier?.priceMWK || event.priceMWK;
  const subtotalMWK = unitPrice * quantity;
  const serviceFeeMWK = 1500; // Fixed transparent processing fee in MWK
  const totalMWK = subtotalMWK + serviceFeeMWK;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full legal name';
    if (!email.trim() || !email.includes('@')) errors.email = 'Please provide a valid email address';
    if (!phone.trim() || phone.length < 9) errors.phone = 'Please provide a valid phone number (+265 format)';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedTier) return;

    setIsSubmitting(true);
    setFormErrors({});
    try {
      const result = await supabaseService.createTicketOrder({
        eventId: event.id,
        tierId: selectedTier.id,
        quantity,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone
      });
      if (!result.success) throw new Error(result.error || 'Supabase could not create the order.');
      const order = Array.isArray(result.data) ? result.data[0] : result.data;
      const orderId = order?.order_id || order?.id;
      const referenceNumber = order?.order_number || order?.reference_number || order?.reference;
      if (!orderId || !referenceNumber) throw new Error('The backend did not return an order id and reference.');
      const actualUnitPrice = Number(order.unit_price_mwk ?? order.unit_price ?? unitPrice);
      const actualServiceFee = Number(order.fees ?? order.service_fee_mwk ?? order.service_fee ?? serviceFeeMWK);
      const actualTotal = Number(order.total ?? order.total_mwk ?? order.total_amount ?? totalMWK);
      const paymentResult = await supabaseService.createPaymentAttempt(String(orderId), paymentProvider, actualTotal);
      const paymentData = Array.isArray(paymentResult.data) ? paymentResult.data[0] : paymentResult.data;
      const newBooking: TicketBooking = {
        id: String(orderId),
        referenceNumber: String(referenceNumber),
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.dateDisplay,
        eventTime: event.timeDisplay,
        venue: event.venue,
        city: event.city,
        tierName: selectedTier.name,
        quantity,
        unitPriceMWK: actualUnitPrice,
        serviceFeeMWK: actualServiceFee,
        totalMWK: actualTotal,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        status: 'pending_payment',
        purchaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        image: event.image,
        gateInstructions: `Present this order reference at ${event.venue} on ${event.dateDisplay}.`,
        paymentNotice: paymentResult.success
          ? 'Payment has been initiated. Complete the provider prompt to confirm your tickets.'
          : `Order created, but payment could not be started: ${paymentResult.error || 'provider unavailable'}`
      };
      onOrderConfirmed(newBooking);
      const checkoutUrl = paymentData?.checkout_url || paymentData?.payment_url;
      if (checkoutUrl) window.location.assign(checkoutUrl);
      onClose();
    } catch (error) {
      setFormErrors({ server: error instanceof Error ? error.message : 'Order creation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#140819] border border-[#3f184e] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                Secure Checkout
              </span>
              <span className="text-[#5f4969]">·</span>
              <span className="text-xs text-[#a997b3]">Phase 2 Customer Experience</span>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5">
              Review & Reserve Tickets
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9f8fa9] hover:text-white hover:bg-[#250d2e] transition-colors cursor-pointer"
            title="Cancel checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <form onSubmit={handleConfirmReservation} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. Event Summary Banner */}
          <div className="p-4 rounded-2xl bg-[#1d0b24] border border-[#34143e] flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#240e2b] shrink-0 border border-[#431752]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#a78bfa]">
                {event.categoryLabel}
              </span>
              <h3 className="text-sm sm:text-base font-display font-bold text-white truncate">
                {event.title}
              </h3>
              <p className="text-[#a997b2] flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#8b7bff] shrink-0" />
                <span>{event.venue}, {event.city}</span>
              </p>
              <p className="text-[#a997b2] flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-[#8b7bff] shrink-0" />
                <span>{event.dateDisplay} · {event.timeDisplay}</span>
              </p>
            </div>
          </div>

          {/* 2. Select Ticket Type */}
          <div>
            <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              1. Choose Ticket Type
            </label>
            <div className="space-y-2">
              {event.tiers.map((tier) => {
                const isSelected = tier.id === selectedTierId;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#2e0e37] border-[#8b7bff] text-white shadow-sm'
                        : 'bg-[#1b0a21] border-[#2e1236] text-[#bcaac6] hover:border-[#4b1d58]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{tier.name}</span>
                        {isSelected && (
                          <Badge variant="plum" className="text-[9px] py-0">Selected</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-[#9a87a3] mt-0.5">{tier.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-sm text-white tabular-nums">
                        MWK {tier.priceMWK.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-[#86738f]">{tier.remaining} remaining</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Choose Quantity */}
          <div className="p-4 rounded-2xl bg-[#1b0a21] border border-[#2f1338] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white text-xs block">2. Select Ticket Quantity</span>
              <p className="text-[11px] text-[#9c89a7]">Maximum 10 tickets per order reservation</p>
            </div>

            <div className="flex items-center border border-[#431752] rounded-xl bg-[#230d2d] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#d1bedb] hover:text-white hover:bg-[#341342] transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono font-bold text-sm text-white tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#d1bedb] hover:text-white hover:bg-[#341342] transition-colors cursor-pointer"
                disabled={quantity >= 10 || quantity >= selectedTier.remaining}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Customer Contact Information */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              3. Attendee & Gate Notification Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border text-white focus:outline-none transition-all ${
                    formErrors.fullName ? 'border-rose-500' : 'border-[#3d174b] focus:border-[#8b7bff]'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.mw"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border text-white focus:outline-none transition-all ${
                    formErrors.email ? 'border-rose-500' : 'border-[#3d174b] focus:border-[#8b7bff]'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Malawi Mobile Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+265 99 123 4567"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border text-white focus:outline-none transition-all ${
                  formErrors.phone ? 'border-rose-500' : 'border-[#3d174b] focus:border-[#8b7bff]'
                }`}
              />
              {formErrors.phone && (
                <p className="text-[11px] text-rose-400 mt-1">{formErrors.phone}</p>
              )}
              <span className="text-[10px] text-[#86738f] mt-1 block">
                Required for gate turnstile SMS pass delivery and upcoming mobile money settlement.
              </span>
            </div>
          </div>

          {/* 5. Clear Order Summary Breakdown */}
          <div className="p-4 rounded-2xl bg-[#1d0b24] border border-[#34143e] space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider pb-1 border-b border-[#2c1135]">
              Order Summary
            </h4>

            <div className="flex justify-between text-[#bba9c4]">
              <span>
                {selectedTier.name} × {quantity}
              </span>
              <span className="font-mono text-white tabular-nums">
                MWK {subtotalMWK.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[#bba9c4]">
              <span className="flex items-center gap-1">
                Ticketing & SMS Gate Service Fee
                <Info className="w-3 h-3 text-[#8b7794]" />
              </span>
              <span className="font-mono text-white tabular-nums">
                MWK {serviceFeeMWK.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-[#2c1135] flex justify-between items-center text-sm font-bold text-white">
              <span>Total Amount</span>
              <span className="text-base font-mono text-[#a78bfa] tabular-nums">
                MWK {totalMWK.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="checkout-payment-provider" className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              Payment method
            </label>
            <select
              id="checkout-payment-provider"
              value={paymentProvider}
              onChange={(e) => setPaymentProvider(e.target.value as typeof paymentProvider)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3d174b] text-white focus:outline-none focus:border-[#8b7bff]"
            >
              <option value="airtel">Airtel Money</option>
              <option value="mpamba">TNM Mpamba</option>
              <option value="paychangu">Card / PayChangu</option>
            </select>
          </div>

          {/* 6. Explicit Payment Integration Placeholder Notice (Phase 2 Rule) */}
          {formErrors.server && (
            <p role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 px-4 py-3 text-xs text-rose-200">{formErrors.server}</p>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Order Reservation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Download, 
  Info, 
  ShieldCheck, 
  QrCode, 
  Lock,
  Printer
} from 'lucide-react';
import { TicketBooking } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface TicketDetailModalProps {
  ticket: TicketBooking | null;
  onClose: () => void;
  onPrintNotice?: (ref: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onPrintNotice
}) => {
  if (!ticket) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed Pass</Badge>;
      case 'pending_payment':
        return <Badge variant="warning">Reservation (Payment Pending)</Badge>;
      case 'used':
        return <Badge variant="neutral">Used / Archived</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="plum">{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#140819] border border-[#3f184e] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="p-5 sm:p-6 border-b border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                Ticket Pass Detail
              </span>
              <span className="text-[#5f4969]">·</span>
              <span className="text-xs font-mono text-[#d6bfe3]">{ticket.referenceNumber}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5 truncate">
              {ticket.eventTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9f8fa9] hover:text-white hover:bg-[#250d2e] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Status & Reference Header */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1d0b24] border border-[#34143e]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#897694] block">Ticket Status</span>
              <div className="mt-1">{getStatusBadge(ticket.status)}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#897694] block">Booked On</span>
              <span className="text-xs text-white font-medium">{ticket.purchaseDate}</span>
            </div>
          </div>

          {/* FUTURE QR CODE INTEGRATION PLACEHOLDER (Phase 2 Rule: No fake QR codes) */}
          <div className="p-6 rounded-2xl bg-[#1c0a22] border-2 border-dashed border-[#4c1c5c] text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#2a0e33] border border-[#581f6c] flex items-center justify-center text-[#a78bfa] mx-auto shadow-inner">
              <QrCode className="w-7 h-7" />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#381343] text-[#f4d1fd] text-[10px] font-bold uppercase tracking-wider">
                <Lock className="w-3 h-3 text-[#8b7bff]" />
                Digital Gate Pass QR — System Placeholder
              </div>

              <h4 className="text-sm font-semibold text-white pt-1">
                Encrypted QR Code Issuance Ready
              </h4>

              <p className="text-[11px] text-[#aa98b2] leading-relaxed">
                Official turnstile scannable QR credentials will be automatically generated upon payment gateway connection in Phase 3.
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#270d2f] text-[#eedbf5] font-mono font-bold text-xs border border-[#3f164d]">
                REF: {ticket.referenceNumber}
              </span>
            </div>
          </div>

          {/* Event Venue & Date */}
          <div className="p-4 rounded-2xl bg-[#1b0a21] border border-[#2e1236] space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider border-b border-[#2a1031] pb-1">
              Event Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#bba9c4]">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#8b7bff] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">{ticket.eventDate}</span>
                  <span className="text-[11px] text-[#93809c]">{ticket.eventTime}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8b7bff] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">{ticket.venue}</span>
                  <span className="text-[11px] text-[#93809c]">{ticket.city}, Malawi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendee Details */}
          <div className="p-4 rounded-2xl bg-[#1b0a21] border border-[#2e1236] space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider border-b border-[#2a1031] pb-1">
              Registered Attendee
            </h4>
            <div className="space-y-1.5 text-[#bcaac5]">
              <div className="flex justify-between">
                <span className="text-[#8c7895]">Attendee Name:</span>
                <span className="text-white font-semibold">{ticket.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c7895]">Email:</span>
                <span className="text-white">{ticket.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c7895]">Phone (SMS Pass):</span>
                <span className="font-mono text-white">{ticket.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-2xl bg-[#1b0a21] border border-[#2e1236] space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider border-b border-[#2a1031] pb-1">
              Payment & Tier Breakdown
            </h4>
            <div className="flex justify-between text-[#bcaac5]">
              <span>Tier:</span>
              <span className="text-[#a78bfa] font-semibold">{ticket.tierName}</span>
            </div>
            <div className="flex justify-between text-[#bcaac5]">
              <span>Quantity:</span>
              <span className="text-white font-mono">{ticket.quantity} person(s)</span>
            </div>
            <div className="flex justify-between text-[#bcaac5]">
              <span>Unit Price:</span>
              <span className="text-white font-mono">MWK {ticket.unitPriceMWK.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#bcaac5]">
              <span>Service & Gate Processing:</span>
              <span className="text-white font-mono">MWK {ticket.serviceFeeMWK.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-[#2a1031] flex justify-between font-bold text-white text-sm">
              <span>Total:</span>
              <span className="text-[#a78bfa] font-mono tabular-nums">
                MWK {ticket.totalMWK.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Gate Instructions */}
          {ticket.gateInstructions && (
            <div className="p-3.5 rounded-xl bg-[#200d27] border border-[#35143e] text-[#cfbed8] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#a78bfa]">Venue Instructions:</span>
              <p className="text-[11px]">{ticket.gateInstructions}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onPrintNotice?.(ticket.referenceNumber)}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
};

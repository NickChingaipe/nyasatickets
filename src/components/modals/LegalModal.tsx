import React from 'react';
import { X, HelpCircle, FileText, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../common/Button';

interface LegalModalProps {
  type: 'help' | 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#140819] border border-[#3b1747] shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[85vh] text-[#ded3e6]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#9f8fa9] hover:text-white hover:bg-[#250d2e] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'help' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#2c1135]">
              <div className="w-10 h-10 rounded-xl bg-[#3e347d]/40 border border-[#8b7bff]/40 flex items-center justify-center text-[#8b7bff]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Help & Support Desk</h3>
                <p className="text-xs text-[#9c89a7]">NyasaTickets Customer Care Malawi</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#bcaac6] leading-relaxed">
              <p>
                Need assistance with a ticket purchase, digital QR gate pass, or event listing? Our support team is available 7 days a week.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#1d0b24] border border-[#33133d] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#a78bfa]">Direct Phone & WhatsApp</span>
                  <p className="text-sm font-semibold text-white">+265 (0) 99 900 1234</p>
                  <p className="text-xs text-[#9f8da9]">Mon–Sun: 08:00 – 22:00 CAT</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1d0b24] border border-[#33133d] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#a78bfa]">Support Email</span>
                  <p className="text-sm font-semibold text-white">support@nyasatickets.mw</p>
                  <p className="text-xs text-[#9f8da9]">Guaranteed response within 2 hours</p>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="font-semibold text-white text-sm mb-2">Frequently Asked Questions</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#1b0a22] border border-[#2b1034]">
                    <p className="font-semibold text-white text-xs">How do I access my tickets at the gate?</p>
                    <p className="text-xs text-[#9f8ca7] mt-0.5">Simply open the 'My Tickets' tab on your phone. Gate stewards scan the secure QR code directly from your screen or printed pass.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1b0a22] border border-[#2b1034]">
                    <p className="font-semibold text-white text-xs">Which payment options are supported?</p>
                    <p className="text-xs text-[#9f8ca7] mt-0.5">We support Airtel Money, TNM Mpamba, and Visa/Mastercard credit and debit cards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#2c1135]">
              <div className="w-10 h-10 rounded-xl bg-[#3e347d]/40 border border-[#8b7bff]/40 flex items-center justify-center text-[#8b7bff]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Terms & Conditions</h3>
                <p className="text-xs text-[#9c89a7]">Last updated: October 2026</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#bcaac6] leading-relaxed max-h-96 overflow-y-auto pr-2">
              <h4 className="font-semibold text-white">1. Ticketing Services</h4>
              <p>NyasaTickets acts as an authorized ticketing platform and discovery service for event organizers in Malawi. All tickets purchased are non-transferable unless permitted via the official in-app transfer feature.</p>

              <h4 className="font-semibold text-white">2. Currency & Payments</h4>
              <p>All ticket prices are listed and charged in Malawian Kwacha (MWK). All transactions conducted through mobile money (Airtel Money, TNM Mpamba) or card networks are encrypted end-to-end.</p>

              <h4 className="font-semibold text-white">3. Refunds & Event Postponements</h4>
              <p>Refund policies are defined by the designated event organizer. In the case of event cancellation, ticketholders are entitled to full refund processing minus payment network handling fees.</p>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#2c1135]">
              <div className="w-10 h-10 rounded-xl bg-[#3e347d]/40 border border-[#8b7bff]/40 flex items-center justify-center text-[#8b7bff]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Privacy Policy</h3>
                <p className="text-xs text-[#9c89a7]">Data protection & confidentiality</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#bcaac6] leading-relaxed max-h-96 overflow-y-auto pr-2">
              <h4 className="font-semibold text-white">1. Information We Collect</h4>
              <p>We collect essential information required to deliver your event passes: full name, phone number (for Airtel Money / Mpamba ticket verification), and email address.</p>

              <h4 className="font-semibold text-white">2. Gate Scan Verification</h4>
              <p>When entering an event venue, our scan protocol validates ticket tokens against our real-time attendance database to prevent duplicate entry attempts.</p>

              <h4 className="font-semibold text-white">3. Zero Selling of Data</h4>
              <p>NyasaTickets never sells or distributes your personal contact information to third-party telemarketers.</p>
            </div>
          </div>
        )}

        <div className="pt-4 mt-6 border-t border-[#2c1135] flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
};

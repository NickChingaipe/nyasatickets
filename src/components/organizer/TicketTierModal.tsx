import React, { useState } from 'react';
import { X, Lock, Ticket, AlertCircle, Info, Calendar, DollarSign } from 'lucide-react';
import { OrganizerTicketTier } from '../../types';
import { Button } from '../common/Button';

interface TicketTierModalProps {
  tier?: OrganizerTicketTier | null;
  eventId: string;
  eventTitle: string;
  onClose: () => void;
  onSaveTier: (tier: OrganizerTicketTier) => boolean | Promise<boolean>;
}

export const TicketTierModal: React.FC<TicketTierModalProps> = ({
  tier,
  eventId,
  eventTitle,
  onClose,
  onSaveTier
}) => {
  const isEditing = Boolean(tier);

  const [name, setName] = useState(tier?.name || '');
  const [description, setDescription] = useState(tier?.description || '');
  const [priceMWK, setPriceMWK] = useState<number>(tier?.priceMWK || 0);
  const [totalQuantity, setTotalQuantity] = useState<number>(tier?.totalQuantity || 0);
  const [minPerOrder, setMinPerOrder] = useState<number>(tier?.minPerOrder || 1);
  const [maxPerOrder, setMaxPerOrder] = useState<number>(tier?.maxPerOrder || 6);
  const [salesStartDate, setSalesStartDate] = useState(tier?.salesStartDate || '');
  const [salesEndDate, setSalesEndDate] = useState(tier?.salesEndDate || '');
  const [active, setActive] = useState<boolean>(tier ? tier.active : true);

  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Sold and reserved values (strictly read-only per rule!)
  const soldQuantity = tier?.soldQuantity || 0;
  const reservedQuantity = tier?.reservedQuantity || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorNotice('Please provide a ticket tier name');
      return;
    }
    if (priceMWK <= 0 || totalQuantity <= 0 || minPerOrder < 1 || maxPerOrder < minPerOrder) {
      setErrorNotice('Enter a positive price and quantity with valid per-order limits.');
      return;
    }
    if (totalQuantity < (soldQuantity + reservedQuantity)) {
      setErrorNotice(`Total capacity cannot be set lower than existing sold and reserved tickets (${soldQuantity + reservedQuantity})`);
      return;
    }

    const payload: OrganizerTicketTier = {
      id: tier?.id || `tier-${Date.now()}`,
      eventId,
      name,
      description,
      priceMWK,
      currency: 'MWK',
      totalQuantity,
      soldQuantity,
      reservedQuantity,
      minPerOrder,
      maxPerOrder,
      salesStartDate,
      salesEndDate,
      active
    };

    const saved = await onSaveTier(payload);
    if (!saved) {
      setErrorNotice('Ticket tier could not be saved. Check the organizer notification for details.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#140819] border border-[#3f184e] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
              Ticket Type Management · {eventTitle}
            </span>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5">
              {isEditing ? `Edit ${tier?.name}` : 'Create New Ticket Type'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9f8fa9] hover:text-white hover:bg-[#250d2e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {errorNotice && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Sold / Reserved Read-Only Banner (Enforces Phase 3 Rule) */}
          {isEditing && (
            <div className="p-3.5 rounded-2xl bg-[#1f0c26] border border-[#391543] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Protected Inventory Allocation</span>
                  <p className="text-[10px] text-[#9b87a4]">Sold and reserved quantities are locked for attendee integrity.</p>
                </div>
              </div>

              <div className="text-right font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">{soldQuantity} Sold</span>
                <span className="text-[#6d5b74] mx-1.5">/</span>
                <span className="text-amber-300 font-bold">{reservedQuantity} Reserved</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[#a491ae] mb-1 font-medium">Ticket Type Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Golden Pass, Early Bird Standing"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
            />
          </div>

          <div>
            <label className="block text-[#a491ae] mb-1 font-medium">Description & Gate Entitlements</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Express gate entry, access to raised VIP deck"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Price in Malawian Kwacha (MWK) *</label>
              <input
                type="number"
                value={priceMWK}
                onChange={(e) => setPriceMWK(Number(e.target.value))}
                min={0}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Total Quantity (Cap) *</label>
              <input
                type="number"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Number(e.target.value))}
                min={soldQuantity + reservedQuantity}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Min Tickets Per Order</label>
              <input
                type="number"
                value={minPerOrder}
                onChange={(e) => setMinPerOrder(Number(e.target.value))}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Max Tickets Per Order</label>
              <input
                type="number"
                value={maxPerOrder}
                onChange={(e) => setMaxPerOrder(Number(e.target.value))}
                min={minPerOrder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Sales Start Date</label>
              <input
                type="date"
                value={salesStartDate}
                onChange={(e) => setSalesStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
              />
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Sales End Date</label>
              <input
                type="date"
                value={salesEndDate}
                onChange={(e) => setSalesEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1f0c26] border border-[#391543] cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded text-[#8b7bff] focus:ring-[#8b7bff] w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-white font-semibold block">Tier is Active for Customer Purchase</span>
                <span className="text-[10px] text-[#9f8ba8]">Inactive tiers are hidden from customer event pages.</span>
              </div>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#2d1235]">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {isEditing ? 'Save Changes' : 'Create Tier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

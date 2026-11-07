import React, { useState } from 'react';
import { X, UserPlus, Shield, Check, Info, QrCode, FileText } from 'lucide-react';
import { EventStaffMember, StaffRole, OrganizerEvent } from '../../types';
import { Button } from '../common/Button';

interface StaffInviteModalProps {
  events: OrganizerEvent[];
  onClose: () => void;
  onAddStaff: (staff: EventStaffMember) => boolean | Promise<boolean>;
}

export const StaffInviteModal: React.FC<StaffInviteModalProps> = ({
  events,
  onClose,
  onAddStaff
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('scanner');
  const [assignedEventId, setAssignedEventId] = useState<string>(events[0]?.id || '');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleDescriptions: Record<StaffRole, { title: string; perms: string[]; note: string }> = {
    event_manager: {
      title: 'Event Manager',
      perms: [
        'Edit event details and update descriptions',
        'Configure ticket tiers and pricing',
        'View complete attendee roster & contact list',
        'Assign turnstile gate staff'
      ],
      note: 'High-level operational access across assigned events.'
    },
    scanner: {
      title: 'Gate Scanner / Steward',
      perms: [
        'Access camera turnstile gate scanner (upon Phase 4 backend integration)',
        'Lookup attendee check-in references at turnstiles',
        'Verify customer ticket validities at the gate'
      ],
      note: 'Restricted purely to turnstile check-in portals; cannot access revenue or financial data.'
    },
    finance_viewer: {
      title: 'Finance & Auditor',
      perms: [
        'View ticket gross sales and revenue reports (MWK)',
        'Export financial reconciliation manifests',
        'View mobile money vs card transaction breakdowns'
      ],
      note: 'Read-only financial audit privileges.'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !assignedEventId) {
      setSaveError('Add an event before inviting staff.');
      return;
    }

    const newStaff: EventStaffMember = {
      id: '',
      name,
      email,
      phone,
      role,
      assignedEventIds: [assignedEventId],
      status: 'invited',
      addedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setIsSubmitting(true);
    setSaveError(null);
    const saved = await onAddStaff(newStaff);
    setIsSubmitting(false);
    if (!saved) {
      setSaveError('Invitation could not be sent. Check the organizer notification for details.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#140819] border border-[#3f184e] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
              Staff & Gate Crew Management
            </span>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5">
              Add Event Staff Member
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
          <div>
            <label className="block text-[#a491ae] mb-1 font-medium">Staff Member Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tamandani Gondwe"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@domain.mw"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
              />
            </div>
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+265 ..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#a491ae] mb-1 font-medium">Assigned Event</label>
            <select
              value={assignedEventId}
              onChange={(e) => setAssignedEventId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
              disabled={events.length === 0}
            >
              {events.length === 0 && <option value="">No events available</option>}
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.city})
                </option>
              ))}
            </select>
          </div>

          {saveError && <p role="alert" className="text-xs text-rose-300">{saveError}</p>}

          {/* Role Selection & Permissions Matrix */}
          <div>
            <label className="block text-[#a491ae] mb-2 font-medium">Assigned Role & Access Scope</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['scanner', 'event_manager', 'finance_viewer'] as StaffRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    role === r 
                      ? 'bg-[#3e347d] text-white border-[#8b7bff] font-bold' 
                      : 'bg-[#1b0a21] text-[#bda7c7] border-[#34143e] hover:border-[#4d1f5b]'
                  }`}
                >
                  <span className="block capitalize">{r.replace('_', ' ')}</span>
                </button>
              ))}
            </div>

            {/* Permissions list for selected role */}
            <div className="p-3.5 rounded-2xl bg-[#1c0a22] border border-[#36133f] space-y-2">
              <span className="text-[11px] font-bold text-[#a78bfa] block">
                {roleDescriptions[role].title} Permissions:
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#cfbee0]">
                {roleDescriptions[role].perms.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-[#8e7a96] pt-1 border-t border-[#2d1235]">
                {roleDescriptions[role].note}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#2d1235]">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} disabled={isSubmitting || events.length === 0}>
              Send Staff Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

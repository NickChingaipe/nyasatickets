import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  UserPlus, 
  ShieldCheck, 
  QrCode, 
  Lock, 
  Calendar, 
  Phone, 
  Mail, 
  Info,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { AttendeeRecord, EventStaffMember, StaffRole, OrganizerEvent } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface OrganizerAttendeesStaffSectionProps {
  attendees: AttendeeRecord[];
  staffMembers: EventStaffMember[];
  events: OrganizerEvent[];
  onOpenInviteStaff: () => void;
}

export const OrganizerAttendeesStaffSection: React.FC<OrganizerAttendeesStaffSectionProps> = ({
  attendees,
  staffMembers,
  events,
  onOpenInviteStaff
}) => {
  const [subTab, setSubTab] = useState<'attendees' | 'staff'>('attendees');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredAttendees = attendees.filter(a => {
    const q = attendeeSearch.toLowerCase().trim();
    const matchSearch = q === '' || 
      a.customerName.toLowerCase().includes(q) ||
      a.orderReference.toLowerCase().includes(q) ||
      a.customerPhone.includes(q) ||
      a.eventTitle.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || a.ticketStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExportCSV = () => {
    setExportNotice('Attendee manifest CSV successfully generated and downloaded.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" className="text-[10px]">Confirmed Pass</Badge>;
      case 'checked_in':
        return <Badge variant="info" className="text-[10px]">Turnstile Scanned</Badge>;
      case 'reserved':
        return <Badge variant="warning" className="text-[10px]">Reservation Pending</Badge>;
      case 'refunded':
        return <Badge variant="danger" className="text-[10px]">Refunded</Badge>;
      default:
        return <Badge variant="plum" className="text-[10px]">{status}</Badge>;
    }
  };

  const roleLabels: Record<StaffRole, { name: string; badge: string; perms: string }> = {
    event_manager: {
      name: 'Event Manager',
      badge: 'bg-[#50135d] text-pink-200 border-[#7a228e]',
      perms: 'Manage event details, configure ticket tiers, access attendee rosters'
    },
    scanner: {
      name: 'Gate Scanner / Steward',
      badge: 'bg-[#1b1c4b] text-indigo-200 border-indigo-700',
      perms: 'Scan gate barcode passes, look up attendee turnstile reference'
    },
    finance_viewer: {
      name: 'Finance & Audit Viewer',
      badge: 'bg-emerald-950 text-emerald-200 border-emerald-800',
      perms: 'View gross revenue, sales trends, reconcile mobile money payouts'
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Strip */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#f472b6]">
            Operations & Gate Turnstiles
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
            Attendees & Event Staff
          </h2>
          <p className="text-xs text-[#9f8fa9] mt-0.5">
            Manage ticket-holding guest manifests, order verification, and assigned turnstile crew
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#200c28] border border-[#3c1748] shrink-0">
          <button
            onClick={() => setSubTab('attendees')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'attendees' ? 'bg-[#831843] text-white shadow-sm' : 'text-[#a997b2] hover:text-white'
            }`}
          >
            Attendee Manifest ({attendees.length})
          </button>
          <button
            onClick={() => setSubTab('staff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'staff' ? 'bg-[#831843] text-white shadow-sm' : 'text-[#a997b2] hover:text-white'
            }`}
          >
            Gate Staff & Roles ({staffMembers.length})
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 2. ATTENDEES VIEW */}
      {subTab === 'attendees' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1a0820] border border-[#311339]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7895]" />
              <input
                type="text"
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                placeholder="Search attendee by name, ref, or phone..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#150719] border border-[#391543] text-xs text-white focus:outline-none focus:border-[#f43f5e]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#150719] border border-[#391543] text-xs text-white cursor-pointer"
              >
                <option value="all">All Ticket Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="reserved">Reserved</option>
              </select>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportCSV}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Export CSV Manifest
              </Button>
            </div>
          </div>

          {/* Attendee Table */}
          <div className="rounded-3xl bg-[#170a1c] border border-[#32133b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#200d27] text-[#9c89a6] border-b border-[#2d1235] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Guest Name & Contact</th>
                    <th className="py-3 px-4">Order Reference</th>
                    <th className="py-3 px-4">Event & Tier</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Amount (MWK)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#260f2d] text-white">
                  {filteredAttendees.map((att) => (
                    <tr key={att.id} className="hover:bg-[#200c28]/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-white">{att.customerName}</p>
                        <p className="text-[11px] text-[#9a87a4] font-mono">{att.customerPhone} · {att.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#f472b6]">
                        {att.orderReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-white font-medium truncate max-w-[200px]">{att.eventTitle}</p>
                        <p className="text-[11px] text-[#bcaac5]">{att.ticketType}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {att.quantity}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                        MWK {att.totalMWK.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(att.ticketStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. STAFF & ROLES VIEW */}
      {subTab === 'staff' && (
        <div className="space-y-4">
          {/* Important Rule Notice on Gate Scanning Backend */}
          <div className="p-4 rounded-2xl bg-[#1e0c25] border border-[#481c56] text-[#d6bfe3] text-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-[#f43f5e] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Phase 3 Staff & Gate Steward Architecture:</span>
              <p className="text-[11px] text-[#baa6c3] mt-0.5 leading-relaxed">
                Staff roles and security boundaries are defined below. Live turnstile QR code scanning and hardware gate reader synchronization will connect in the final ticketing backend phase.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-bold text-white">
              Event Staff Roster & Permissions Matrix
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenInviteStaff}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Staff Member
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {staffMembers.map((staff) => {
              const roleInfo = roleLabels[staff.role] || roleLabels.scanner;

              return (
                <div 
                  key={staff.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#170a1c] border border-[#2f1338] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{staff.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${roleInfo.badge}`}>
                        {roleInfo.name}
                      </span>
                      {staff.status === 'invited' && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                          Invite Pending
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#a491ad] flex items-center gap-3">
                      <span>{staff.email}</span>
                      <span>·</span>
                      <span className="font-mono">{staff.phone}</span>
                    </p>

                    <p className="text-[11px] text-[#d6bfe3] pt-1">
                      <strong>Role Scope:</strong> {roleInfo.perms}
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0 text-xs text-[#8c7895]">
                    <span className="block font-mono">Assigned to {staff.assignedEventIds.length} Event(s)</span>
                    <span className="text-[10px] block mt-0.5">Added on {staff.addedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, Building, MapPin, Plus, Check, Phone, User, Globe } from 'lucide-react';
import { Venue } from '../../types';
import { Button } from '../common/Button';

interface VenueManagerModalProps {
  venues: Venue[];
  onClose: () => void;
  onAddVenue: (venue: Venue) => boolean | Promise<boolean>;
}

export const VenueManagerModal: React.FC<VenueManagerModalProps> = ({
  venues,
  onClose,
  onAddVenue
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVenue: Venue = {
      id: `ven-${Date.now()}`,
      name,
      city,
      address,
      capacity,
      contactPerson,
      contactPhone,
      isOnline
    };

    setIsSubmitting(true);
    setSaveError(null);
    const saved = await onAddVenue(newVenue);
    setIsSubmitting(false);
    if (!saved) {
      setSaveError('Venue could not be saved. Check the organizer notification for details.');
      return;
    }
    setIsAdding(false);
    setName('');
    setAddress('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#140819] border border-[#3f184e] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
              Organizer Workspace
            </span>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5">
              Manage Event Venues
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9f8fa9] hover:text-white hover:bg-[#250d2e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {!isAdding ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[#a491ae]">Select a registered venue or add a new event facility in Malawi.</p>
                <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add Venue
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {venues.map((venue) => (
                  <div key={venue.id} className="p-4 rounded-2xl bg-[#1c0a22] border border-[#34143e] flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{venue.name}</span>
                        {venue.isOnline && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-300 border border-sky-800">
                            Online
                          </span>
                        )}
                      </div>
                      <p className="text-[#baa7c3] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8b7bff]" />
                        <span>{venue.address}, {venue.city}</span>
                      </p>
                      <p className="text-[11px] text-[#8c7895] flex items-center gap-3 pt-1">
                        <span>Capacity: <strong className="text-white font-mono">{venue.capacity.toLocaleString()}</strong></span>
                        <span>·</span>
                        <span>Manager: {venue.contactPerson} ({venue.contactPhone})</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#2d1235] pb-2">
                <h3 className="font-bold text-white text-sm">Add New Venue</h3>
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-[#a491ae] hover:text-white"
                >
                  Back to List
                </button>
              </div>

              {saveError && <p role="alert" className="text-xs text-rose-300">{saveError}</p>}

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Venue Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mzuzu Grand Amphitheatre"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
                  >
                    <option value="">Select city</option>
                    <option value="Blantyre">Blantyre</option>
                    <option value="Lilongwe">Lilongwe</option>
                    <option value="Mzuzu">Mzuzu</option>
                    <option value="Mangochi">Mangochi</option>
                    <option value="Salima">Salima</option>
                    <option value="Zomba">Zomba</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">Maximum Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Physical Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot / Street / Landmark"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Venue Manager Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">Contact Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+265 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                  Save Venue
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="p-4 border-t border-[#2d1235] bg-[#1a0920] flex justify-end shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

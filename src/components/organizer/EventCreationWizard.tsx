import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar, 
  MapPin, 
  Clock, 
  FileText, 
  Ticket, 
  AlertCircle, 
  DollarSign,
  Plus,
  Trash2,
  Building,
  Upload
} from 'lucide-react';
import { OrganizerEvent, OrganizerTicketTier, Venue, EventCategory } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface EventCreationWizardProps {
  venues: Venue[];
  initialEvent?: OrganizerEvent;
  onClose: () => void;
  onSubmitEvent: (event: Partial<OrganizerEvent>, submitForApproval: boolean) => boolean | Promise<boolean>;
}

export const EventCreationWizard: React.FC<EventCreationWizardProps> = ({
  venues,
  initialEvent,
  onClose,
  onSubmitEvent
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Basic Info
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category || 'music');
  const [city, setCity] = useState(initialEvent?.city || '');
  const [ageRestriction, setAgeRestriction] = useState(initialEvent?.ageRestriction || '');

  // Step 2: Description & Media
  const [tagline, setTagline] = useState(initialEvent?.tagline || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [selectedImage, setSelectedImage] = useState(initialEvent?.image || '');

  // Step 3: Date & Time
  const [startDate, setStartDate] = useState(initialEvent?.startDate || '');
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '');
  const [endDate, setEndDate] = useState(initialEvent?.endDate || '');
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '');
  const [doorsOpen, setDoorsOpen] = useState(initialEvent?.doorsOpen || '');

  // Step 4: Venue Details
  const [selectedVenueId, setSelectedVenueId] = useState<string>(initialEvent?.venueId || venues[0]?.id || '');
  const [customVenueName, setCustomVenueName] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [venueCapacity, setVenueCapacity] = useState<number>(initialEvent?.capacity || 0);

  // Step 5: Ticket Tiers
  const [tiers, setTiers] = useState<OrganizerTicketTier[]>(initialEvent?.tiers || []);
  const [isSaving, setIsSaving] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedVenue = venues.find(v => v.id === selectedVenueId);

  // Step navigation validation
  const handleNext = () => {
    setValidationError(null);
    if (currentStep === 1) {
      if (!title.trim()) {
        setValidationError('Please enter an event title');
        return;
      }
      if (!city) {
        setValidationError('Please select an event city.');
        return;
      }
    } else if (currentStep === 2) {
      if (!tagline.trim() || !description.trim()) {
        setValidationError('Please provide both a short tagline and a full description');
        return;
      }
    } else if (currentStep === 3) {
      if (!startDate) {
        setValidationError('Please select the event start date');
        return;
      }
    } else if (currentStep === 4) {
      if (!selectedVenueId || (selectedVenueId === 'custom' && (!customVenueName.trim() || !customAddress.trim()))) {
        setValidationError('Select a venue or provide a custom venue name and address.');
        return;
      }
    } else if (currentStep === 5) {
      if (tiers.length === 0) {
        setValidationError('Please add at least one ticket tier');
        return;
      }
    }
    setCurrentStep(prev => Math.min(6, prev + 1));
  };

  const handleAddTier = () => {
    const newTier: OrganizerTicketTier = {
      id: '',
      eventId: initialEvent?.id || '',
      name: '',
      description: '',
      priceMWK: 0,
      currency: 'MWK',
      totalQuantity: 0,
      soldQuantity: 0,
      reservedQuantity: 0,
      minPerOrder: 1,
      maxPerOrder: 4,
      salesStartDate: startDate,
      salesEndDate: endDate,
      active: true
    };
    setTiers([...tiers, newTier]);
  };

  const handleRemoveTier = (index: number) => {
    setTiers(tiers.filter((_, idx) => idx !== index));
  };

  const handleUpdateTier = (index: number, field: keyof OrganizerTicketTier, val: any) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: val };
    setTiers(updated);
  };

  const handleFinalSubmit = async (submitForApproval: boolean) => {
    const venueName = selectedVenueId === 'custom' ? customVenueName : selectedVenue?.name || 'Selected Venue';
    if (tiers.some(tier => !tier.name.trim() || tier.priceMWK <= 0 || tier.totalQuantity <= 0 || tier.maxPerOrder < tier.minPerOrder)) {
      setValidationError('Each ticket tier needs a name, positive price and quantity, and valid order limits.');
      return;
    }
    const totalCap = tiers.reduce((sum, t) => sum + Number(t.totalQuantity || 0), 0) || venueCapacity;

    const eventPayload: Partial<OrganizerEvent> = {
      title,
      tagline,
      description,
      category,
      city,
      venueId: selectedVenueId,
      venueName,
      id: initialEvent?.id,
      venueAddress: selectedVenueId === 'custom' ? customAddress : selectedVenue?.address,
      startDate,
      startTime,
      endDate: endDate || startDate,
      endTime,
      doorsOpen,
      ageRestriction,
      image: selectedImage,
      capacity: totalCap,
      ticketsSold: 0,
      grossRevenueMWK: 0,
      status: submitForApproval ? 'pending_approval' : 'draft',
      statusNotes: submitForApproval 
        ? 'Submitted for platform verification and safety review.'
        : 'Saved as draft. Not visible on the public ticket marketplace.',
      tiers
    };

    setIsSaving(true);
    setValidationError(null);
    try {
      const saved = await onSubmitEvent(eventPayload, submitForApproval);
      if (!saved) {
        setValidationError('The event could not be saved. Check the organizer notification for details.');
        return;
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Description' },
    { number: 3, title: 'Date & Time' },
    { number: 4, title: 'Venue' },
    { number: 5, title: 'Tickets' },
    { number: 6, title: 'Review' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-[#140819] border border-[#3f184e] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wizard Header */}
        <div className="p-5 sm:p-6 border-b border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
              Organizer Workspace · Step {currentStep} of 6
            </span>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5">
              Create New Event Listing
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9f8fa9] hover:text-white hover:bg-[#250d2e] transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-[#120616] px-6 py-2.5 border-b border-[#240d2b] flex items-center justify-between gap-2 overflow-x-auto">
          {steps.map((s) => (
            <div 
              key={s.number}
              className={`flex items-center gap-1.5 shrink-0 ${
                currentStep === s.number 
                  ? 'text-[#a78bfa] font-semibold' 
                  : currentStep > s.number 
                    ? 'text-emerald-400' 
                    : 'text-[#6e5d77]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === s.number 
                  ? 'bg-[#3e347d] text-white ring-2 ring-[#8b7bff]' 
                  : currentStep > s.number 
                    ? 'bg-emerald-950 text-emerald-300' 
                    : 'bg-[#220d29] text-[#7d6c85]'
              }`}>
                {currentStep > s.number ? <Check className="w-3 h-3" /> : s.number}
              </span>
              <span className="text-xs hidden sm:inline">{s.title}</span>
              {s.number < 6 && <span className="text-[#3b1747] mx-1">›</span>}
            </div>
          ))}
        </div>

        {/* Wizard Step Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-200 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Event Basics</h3>
                <p className="text-[#a491ae]">Provide the public event title, category, and target audience.</p>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Blantyre Food & Music Fiesta 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                  >
                    <option value="music">Music & Concerts</option>
                    <option value="cultural">Cultural & Festivals</option>
                    <option value="theatre">Arts & Theatre</option>
                    <option value="nightlife">Nightlife & Parties</option>
                    <option value="sports">Sports & Outdoors</option>
                    <option value="conferences">Tech & Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">Primary City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                  >
                    <option value="Lilongwe">Lilongwe</option>
                    <option value="Blantyre">Blantyre</option>
                    <option value="Mzuzu">Mzuzu</option>
                    <option value="Mangochi">Mangochi</option>
                    <option value="Salima">Salima</option>
                    <option value="Zomba">Zomba</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Age Restriction / Guidance</label>
                <select
                  value={ageRestriction}
                  onChange={(e) => setAgeRestriction(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                >
                  <option value="All Ages Welcome">All Ages Welcome</option>
                  <option value="18+ Only">18+ Only (Alcohol served)</option>
                  <option value="16+ (Student ID required)">16+ (Student or national ID required)</option>
                  <option value="Family Friendly (Kids under 10 free)">Family Friendly (Kids under 10 free)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Description and Images */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Event Description & Cover Visual</h3>
                <p className="text-[#a491ae]">Hook attendees with an engaging tagline and detailed overview.</p>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Short Tagline * (Appears on Event Cards)</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. A sunset celebration of Malawian acoustic mastery and culinary heritage"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                />
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Detailed Event Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the schedule, guest artists, food stalls, transport details, and atmosphere..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                />
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Cover Image URL</label>
                <input
                  type="url"
                  value={selectedImage}
                  onChange={(e) => setSelectedImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Date & Time Schedule</h3>
                <p className="text-[#a491ae]">Ensure attendees and gate stewards know exact arrival timelines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                  />
                </div>

                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">Start Time *</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                  />
                </div>

                <div>
                  <label className="block text-[#a491ae] mb-1 font-medium">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Doors Opening Notice</label>
                <input
                  type="text"
                  value={doorsOpen}
                  onChange={(e) => setDoorsOpen(e.target.value)}
                  placeholder="e.g. 17:00 CAT (Turnstiles open 1 hr prior)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Venue Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Venue or Online Event Details</h3>
                <p className="text-[#a491ae]">Select a verified Malawian venue or specify custom grounds.</p>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Select Venue</label>
                <select
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3f184e] text-white focus:outline-none focus:border-[#8b7bff]"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city}) — Capacity: {v.capacity.toLocaleString()}
                    </option>
                  ))}
                  <option value="custom">+ Specify Other Custom Venue / Grounds</option>
                </select>
              </div>

              {selectedVenueId === 'custom' && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#1a0821] border border-[#36133f]">
                  <div>
                    <label className="block text-[#a491ae] mb-1 font-medium">Venue Name *</label>
                    <input
                      type="text"
                      value={customVenueName}
                      onChange={(e) => setCustomVenueName(e.target.value)}
                      placeholder="e.g. Mandala Sports Grounds"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3f184e] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a491ae] mb-1 font-medium">Physical Address *</label>
                    <input
                      type="text"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="Street, Landmark, City"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3f184e] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a491ae] mb-1 font-medium">Estimated Capacity</label>
                    <input
                      type="number"
                      value={venueCapacity}
                      onChange={(e) => setVenueCapacity(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3f184e] text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedVenue && selectedVenueId !== 'custom' && (
                <div className="p-4 rounded-2xl bg-[#1b0a21] border border-[#301337] space-y-1.5 text-xs text-[#baa7c2]">
                  <p className="font-semibold text-white">{selectedVenue.name}</p>
                  <p>{selectedVenue.address}, {selectedVenue.city}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-[#a78bfa]">
                    <span>Capacity: {selectedVenue.capacity.toLocaleString()} guests</span>
                    <span>·</span>
                    <span>Manager: {selectedVenue.contactPerson} ({selectedVenue.contactPhone})</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Ticket Types and Pricing */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Ticket Types & Pricing (MWK)</h3>
                  <p className="text-[#a491ae]">Define inventory tiers. Sold ticket quantities cannot be edited later.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleAddTier} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add Tier
                </Button>
              </div>

              <div className="space-y-3">
                {tiers.map((tier, idx) => (
                  <div key={tier.id} className="p-4 rounded-2xl bg-[#1c0a22] border border-[#36133f] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs">Tier {idx + 1}</span>
                      {tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTier(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                          title="Remove tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#a491ae] mb-1 font-medium">Tier Name *</label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleUpdateTier(idx, 'name', e.target.value)}
                          placeholder="e.g. Early Bird Pass"
                          className="w-full px-3 py-2 rounded-xl bg-[#230d2d] border border-[#3f184e] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[#a491ae] mb-1 font-medium">Price (MWK) *</label>
                        <input
                          type="number"
                          value={tier.priceMWK}
                          onChange={(e) => handleUpdateTier(idx, 'priceMWK', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#230d2d] border border-[#3f184e] text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[#a491ae] mb-1 font-medium">Inventory Quantity *</label>
                        <input
                          type="number"
                          value={tier.totalQuantity}
                          onChange={(e) => handleUpdateTier(idx, 'totalQuantity', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#230d2d] border border-[#3f184e] text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#a491ae] mb-1 font-medium">Description & Inclusions</label>
                        <input
                          type="text"
                          value={tier.description}
                          onChange={(e) => handleUpdateTier(idx, 'description', e.target.value)}
                          placeholder="What does this ticket include?"
                          className="w-full px-3 py-2 rounded-xl bg-[#230d2d] border border-[#3f184e] text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-[#d3bedc]">
                          <input
                            type="checkbox"
                            checked={tier.active}
                            onChange={(e) => handleUpdateTier(idx, 'active', e.target.checked)}
                            className="rounded text-[#8b7bff] w-4 h-4"
                          />
                          <span>Tier Active on Launch</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Review and Submission */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Review & Submit Event</h3>
                <p className="text-[#a491ae]">Carefully verify your event parameters before submission.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1b0a21] border border-[#301337] space-y-3">
                <div className="flex items-start justify-between border-b border-[#2d1235] pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#a78bfa]">{category} · {city}</span>
                    <h4 className="text-base font-bold text-white">{title || 'Untitled Event'}</h4>
                    <p className="text-[#a491ae] mt-0.5">{tagline}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#381444] text-[#f4d1fd]">
                    {ageRestriction}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#b8a6c2]">
                  <p><strong>Date:</strong> {startDate || 'Pending'} ({startTime} – {endTime})</p>
                  <p><strong>Venue:</strong> {selectedVenueId === 'custom' ? customVenueName : selectedVenue?.name}</p>
                  <p><strong>Doors Open:</strong> {doorsOpen}</p>
                  <p><strong>Ticket Tiers:</strong> {tiers.length} configured ({tiers.reduce((s, t) => s + Number(t.totalQuantity || 0), 0)} total tickets)</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#240e2b] border border-[#481c56] text-[#cebeda] text-[11px] leading-relaxed">
                <p className="font-semibold text-white mb-1">Approval & Compliance Notice:</p>
                Submission status and reviewer feedback will appear in the organizer workspace.
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#2d1235] bg-[#1a0920] flex items-center justify-between gap-3 shrink-0">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(prev => prev - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              disabled={isSaving}
            >
              Previous
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleFinalSubmit(false)}
                  disabled={isSaving}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleFinalSubmit(true)}
                  leftIcon={<Check className="w-4 h-4" />}
                  isLoading={isSaving}
                >
                  Submit for Approval
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

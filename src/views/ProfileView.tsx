import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Bookmark, 
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { EventItem, UserProfile } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EventCard } from '../components/events/EventCard';
import { supabaseService } from '../lib/supabase';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<boolean>;
  onChangeEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  savedEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onToggleSaveEvent: (eventId: string, e: React.MouseEvent) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onChangeEmail,
  savedEvents,
  onSelectEvent,
  onToggleSaveEvent,
  onLogout
}) => {
  // Form states
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [city, setCity] = useState(userProfile.city);
  const [bio, setBio] = useState(userProfile.bio || '');

  // Notification states
  const [notifyEmail, setNotifyEmail] = useState(userProfile.notificationEmail);
  const [notifySms, setNotifySms] = useState(userProfile.notificationSms);

  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    let emailNotice = '';
    if (email !== userProfile.email) {
      const emailResult = await onChangeEmail(email);
      if (!emailResult.success) {
        setFeedbackNotice(emailResult.error || 'Email update failed.');
        return;
      }
      emailNotice = ' Check your inbox to confirm the new email address.';
    }
    const saved = await onUpdateProfile({
      name,
      phone,
      city,
      bio,
      notificationEmail: notifyEmail,
      notificationSms: notifySms
    });

    if (!saved) {
      setFeedbackNotice('Sign in to update your profile.');
      return;
    }
    setFeedbackNotice(`Profile details successfully updated.${emailNotice}`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Profile Identity Hero */}
      <div className="rounded-3xl p-5 sm:p-6 bg-[#170a1c] border border-[#301337]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#4c1d95] to-[#7c3aed] flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-xl border border-[#8b7bff]/30">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-[#140618]" title="Active Account" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                  {name}
                </h1>
                <Badge variant="plum" className="text-[10px]">{userProfile.role.replace('_', ' ')}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-[#9f8fa9] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8b7bff]" />
                {city ? `${city}, Malawi` : 'Profile details'}
              </p>
              <p className="text-xs text-[#c9b5d3] font-mono">{email} · {phone}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={onLogout}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* 2. Personal Information & Preferences */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-5">
          <div className="border-b border-[#291030] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-display font-bold text-white">Personal Information</h2>
              <p className="text-xs text-[#9f8fa9]">Update your contact details and preferences.</p>
            </div>
            <User className="w-5 h-5 text-[#8b7bff]" />
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#8b7bff] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#8b7bff] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Malawi Mobile Phone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+265 99 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#8b7bff] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Primary City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#8b7bff] transition-all"
                >
                  <option value="Blantyre">Blantyre</option>
                  <option value="Lilongwe">Lilongwe</option>
                  <option value="Mzuzu">Mzuzu</option>
                  <option value="Zomba">Zomba</option>
                  <option value="Mangochi">Mangochi</option>
                  <option value="Salima">Salima</option>
                </select>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Attendee Bio / Interests</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Afro-Jazz, Lake Festivals"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#8b7bff] transition-all"
                />
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="pt-3 border-t border-[#291030] space-y-2.5">
              <span className="text-[11px] uppercase font-bold text-[#a78bfa] block">
                Notification Preferences
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#200d27] border border-[#35143e] cursor-pointer">
                <div>
                  <span className="text-white font-medium block">SMS Gate Pass Delivery</span>
                  <span className="text-[10px] text-[#93809c]">Receive ticket order confirmations and gate entrance notices via SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded text-[#8b7bff] focus:ring-[#8b7bff] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#200d27] border border-[#35143e] cursor-pointer">
                <div>
                  <span className="text-white font-medium block">Email Ticket Receipts</span>
                  <span className="text-[10px] text-[#93809c]">Receive printable ticket confirmations and event lineup drops</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded text-[#8b7bff] focus:ring-[#8b7bff] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="sm" type="submit">
                Save Personal Profile
              </Button>
            </div>
          </form>
      </div>

      {/* 3. Saved / Bookmarked Events Collection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#8b7bff]" />
            <h2 className="text-lg font-display font-bold text-white">
              My Saved Events ({savedEvents.length})
            </h2>
          </div>
        </div>

        {savedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={onSelectEvent}
                isSaved={true}
                onToggleSave={onToggleSaveEvent}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[#170a1c] border border-[#2e1336]">
            <p className="text-xs text-[#a28fa8]">
              You haven't bookmarked any events yet. Click the bookmark ribbon on any event card to save it here for fast checkout.
            </p>
          </div>
        )}
      </section>

    </div>
  );
};

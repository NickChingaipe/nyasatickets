import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Bookmark, 
  BriefcaseBusiness, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Bell,
  Lock,
  LogOut,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { EventItem, UserProfile } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EventCard } from '../components/events/EventCard';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  savedEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onNavigateToOrganizer: () => void;
  onNavigateToAdmin?: () => void;
  onToggleSaveEvent: (eventId: string, e: React.MouseEvent) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  savedEvents,
  onSelectEvent,
  onNavigateToOrganizer,
  onNavigateToAdmin,
  onToggleSaveEvent,
  onLogout
}) => {
  // Form states
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [city, setCity] = useState(userProfile.city);
  const [bio, setBio] = useState(userProfile.bio || 'Malawian live music and festival enthusiast.');

  // Notification states
  const [notifyEmail, setNotifyEmail] = useState(userProfile.notificationEmail);
  const [notifySms, setNotifySms] = useState(userProfile.notificationSms);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  // Modals & Feedback
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phone,
      city,
      bio,
      notificationEmail: notifyEmail,
      notificationSms: notifySms
    });

    setFeedbackNotice('Profile details successfully updated.');
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordNotice('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordNotice('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice('New passwords do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordNotice(null);
    setFeedbackNotice('Password updated securely.');
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Profile Identity Hero */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#200929] via-[#1a0822] to-[#140618] border border-[#3b1747] overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#9f1239] to-[#7c3aed] flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-xl border border-[#f43f5e]/30">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CB'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-[#140618]" title="Active Account" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                  {name}
                </h1>
                <Badge variant="plum" className="text-[10px]">Verified Customer</Badge>
              </div>
              <p className="text-xs sm:text-sm text-[#9f8fa9] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f43f5e]" />
                {city}, Malawi · Member since 2024
              </p>
              <p className="text-xs text-[#c9b5d3] font-mono">{email} · {phone}</p>
            </div>
          </div>

          {/* Portal Switchers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#260e2f]/80 border border-[#481c58] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#f472b6] tracking-wider block">
                  Event Host?
                </span>
                <p className="text-xs text-[#cfbee0] font-medium">Organizer Workspace</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onNavigateToOrganizer}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Portal
              </Button>
            </div>

            {onNavigateToAdmin && (
              <div className="p-3.5 rounded-2xl bg-[#2b0c1e]/80 border border-[#831843]/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider block">
                    Authority
                  </span>
                  <p className="text-xs text-[#ebd9e4] font-medium">Admin & Moderation</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onNavigateToAdmin}
                  className="bg-[#831843] hover:bg-[#9f1239] border-[#f43f5e]/40"
                  rightIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  Admin
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* 2. Personal Information & Preferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Personal Details */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-5">
          <div className="border-b border-[#291030] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-display font-bold text-white">Personal Information</h2>
              <p className="text-xs text-[#9f8fa9]">Update details used for gate check-in manifests and SMS pass delivery</p>
            </div>
            <User className="w-5 h-5 text-[#f43f5e]" />
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e] transition-all"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e] transition-all"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Primary City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e] transition-all"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e] transition-all"
                />
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="pt-3 border-t border-[#291030] space-y-2.5">
              <span className="text-[11px] uppercase font-bold text-[#f472b6] block">
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
                  className="rounded text-[#f43f5e] focus:ring-[#f43f5e] w-4 h-4 cursor-pointer"
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
                  className="rounded text-[#f43f5e] focus:ring-[#f43f5e] w-4 h-4 cursor-pointer"
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

        {/* Right Column (5 cols): Account Settings & Security */}
        <div className="lg:col-span-5 space-y-6">
          {/* Security & Password Settings */}
          <div className="p-6 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-5">
            <div className="border-b border-[#291030] pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-bold text-white">Security & Password</h2>
                <p className="text-xs text-[#9f8fa9]">Keep your NyasaTickets account credentials secure</p>
              </div>
              <KeyRound className="w-5 h-5 text-[#c084fc]" />
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7895] hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e]"
                />
              </div>

              <div>
                <label className="block text-[#a491ae] mb-1 font-medium">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#200d27] border border-[#3b1747] text-white focus:outline-none focus:border-[#f43f5e]"
                />
              </div>

              {passwordNotice && (
                <p className="text-[11px] text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{passwordNotice}</span>
                </p>
              )}

              <Button variant="secondary" size="sm" type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </div>

          {/* Account Sessions & Sign Out */}
          <div className="p-6 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-4">
            <h2 className="text-base font-display font-bold text-white">Account Session</h2>
            <div className="p-3 rounded-xl bg-[#200d27] border border-[#35143e] text-xs text-[#ab98b3] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Current Web Session</span>
                <span className="text-[10px] text-emerald-400 font-medium">Active</span>
              </div>
              <p className="text-[11px]">Chrome on Desktop / Mobile · Blantyre, MW</p>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowLogoutModal(true)}
              leftIcon={<LogOut className="w-4 h-4" />}
              className="w-full"
            >
              Log Out of Account
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Saved / Bookmarked Events Collection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#f43f5e]" />
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-sm rounded-3xl bg-[#140819] border border-[#3f184e] shadow-2xl p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-white">
                Log Out of NyasaTickets?
              </h3>
              <p className="text-xs text-[#9f8fa8] leading-relaxed">
                You will be signed out on this device. Your booked tickets and saved events will remain safely in your account.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowLogoutModal(false)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="w-full"
              >
                Yes, Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

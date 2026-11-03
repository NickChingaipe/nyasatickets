import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Building, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UserProfile, AppRole } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (profile: UserProfile) => void;
  onShowToast: (message: string) => void;
}

export const DEMO_PROFILES: { label: string; role: AppRole; roleDescription: string; profile: UserProfile }[] = [
  {
    label: 'Chikondi Banda (Customer)',
    role: 'customer',
    roleDescription: 'Browse Malawian events, reserve ticket passes, view digital QR pass',
    profile: {
      id: 'usr-customer-01',
      name: 'Chikondi Banda',
      email: 'chikondi.banda@nyasamail.mw',
      phone: '+265 99 123 4567',
      city: 'Blantyre',
      avatar: 'CB',
      role: 'customer',
      isOrganizer: false,
      isAdmin: false,
      bio: 'Live music and cultural festival enthusiast in Blantyre.',
      notificationEmail: true,
      notificationSms: true,
      savedEventIds: ['evt-los-2026', 'evt-blantyre-jazz'],
      preferredPayment: 'airtel_money'
    }
  },
  {
    label: 'Mandala Live Collective (Organiser)',
    role: 'organizer',
    roleDescription: 'Create events, configure ticket tiers & quotas, invite gate scanners',
    profile: {
      id: 'usr-org-01',
      name: 'Mandala Live Collective',
      email: 'promoter@mandalamusic.mw',
      phone: '+265 88 823 4567',
      city: 'Blantyre',
      avatar: 'ML',
      role: 'organizer',
      isOrganizer: true,
      isAdmin: false,
      bio: 'Accredited Malawian music promoter and festival production agency.',
      notificationEmail: true,
      notificationSms: true,
      savedEventIds: [],
      preferredPayment: 'card'
    }
  },
  {
    label: 'Thokozani Phiri (Super Admin)',
    role: 'super_admin',
    roleDescription: 'Approve organiser licenses, moderate live events, view financial audit',
    profile: {
      id: 'usr-admin-01',
      name: 'Thokozani Phiri',
      email: 'thokozani.phiri@nyasatickets.mw',
      phone: '+265 99 900 1122',
      city: 'Lilongwe',
      avatar: 'TP',
      role: 'super_admin',
      isOrganizer: false,
      isAdmin: true,
      bio: 'Head of Event Compliance & Platform Moderation, NyasaTickets Malawi.',
      notificationEmail: true,
      notificationSms: true,
      savedEventIds: [],
      preferredPayment: 'card'
    }
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onShowToast
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lilongwe');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'organizer'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        if (!email || !password) {
          setErrorMsg('Please enter both your email address and password.');
          setIsLoading(false);
          return;
        }

        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
        }

        // Determine profile
        const matchedDemo = DEMO_PROFILES.find(p => p.profile.email.toLowerCase() === email.toLowerCase());
        const loggedProfile: UserProfile = matchedDemo ? matchedDemo.profile : {
          name: email.split('@')[0],
          email,
          phone: '+265 99 000 0000',
          city: 'Lilongwe',
          avatar: email.substring(0, 2).toUpperCase(),
          role: 'customer',
          isOrganizer: false,
          isAdmin: false,
          notificationEmail: true,
          notificationSms: false,
          savedEventIds: [],
          preferredPayment: 'airtel_money'
        };

        onLoginSuccess(loggedProfile);
        onShowToast(`Welcome back, ${loggedProfile.name}!`);
        onClose();
      } else {
        // Sign Up
        if (!email || !password || !name) {
          setErrorMsg('Please complete all required fields.');
          setIsLoading(false);
          return;
        }

        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                city,
                role: selectedRole
              }
            }
          });
          if (error) throw error;
        }

        const newProfile: UserProfile = {
          name,
          email,
          phone: phone || '+265 88 123 4567',
          city,
          avatar: name.substring(0, 2).toUpperCase(),
          role: selectedRole === 'organizer' ? 'organizer' : 'customer',
          isOrganizer: selectedRole === 'organizer',
          isAdmin: false,
          notificationEmail: true,
          notificationSms: true,
          savedEventIds: [],
          preferredPayment: 'airtel_money'
        };

        onLoginSuccess(newProfile);
        onShowToast(`Account created for ${name}!`);
        onClose();
      }
    } catch (err: any) {
      console.warn('Auth action error:', err);
      // In development or when using mock keys, provide helpful message and allow local fallback
      setErrorMsg(err.message || 'Authentication error. You can also select a demo profile below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (profile: UserProfile) => {
    onLoginSuccess(profile);
    onShowToast(`Switched active session to: ${profile.name} (${profile.role.toUpperCase()})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#17091c] border border-[#441852] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#31133a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#831843] text-white">
                Supabase Auth
              </span>
              <h3 className="text-xl font-display font-bold text-white">
                {mode === 'signin' ? 'Sign In to NyasaTickets' : 'Create an Account'}
              </h3>
            </div>
            <p className="text-xs text-[#9f8ea7] mt-1">
              Secure authentication for Malawian event discovery, ticketing, and promoter access.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9a86a3] hover:text-white hover:bg-[#2c0f33] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-[#1f0b27] p-1 border border-[#381643]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#831843] text-white shadow-md'
                : 'text-[#9c89a7] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#831843] text-white shadow-md'
                : 'text-[#9c89a7] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="flex-1">{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Full Name / Organization Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kondwani Phiri or Nyasa Sounds Ltd"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#200b27] border border-[#3c1747] text-white text-xs placeholder-[#7c6987] focus:outline-none focus:border-[#f43f5e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Phone Number (Airtel Money / TNM Mpamba)
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+265 99 123 4567"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#200b27] border border-[#3c1747] text-white text-xs placeholder-[#7c6987] focus:outline-none focus:border-[#f43f5e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">City in Malawi</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#200b27] border border-[#3c1747] text-white text-xs focus:outline-none focus:border-[#f43f5e]"
                  >
                    <option value="Lilongwe">Lilongwe</option>
                    <option value="Blantyre">Blantyre</option>
                    <option value="Mzuzu">Mzuzu</option>
                    <option value="Mangochi">Mangochi</option>
                    <option value="Zomba">Zomba</option>
                    <option value="Salima">Salima</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Account Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#200b27] border border-[#3c1747] text-white text-xs focus:outline-none focus:border-[#f43f5e]"
                  >
                    <option value="customer">Event Attendee (Customer)</option>
                    <option value="organizer">Event Promoter (Organiser)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-white block mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.mw"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#200b27] border border-[#3c1747] text-white text-xs placeholder-[#7c6987] focus:outline-none focus:border-[#f43f5e]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-white block mb-1">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#200b27] border border-[#3c1747] text-white text-xs placeholder-[#7c6987] focus:outline-none focus:border-[#f43f5e]"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Authenticating with Supabase...' : mode === 'signin' ? 'Sign In to Account' : 'Register Account'}
          </Button>
        </form>

        {/* Quick Demo Switcher Section */}
        <div className="pt-4 border-t border-[#31133a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#b8a7c2] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
              Fast-Switch Demo Session
            </span>
            <span className="text-[10px] text-[#8e7a96]">One-click role testing</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {DEMO_PROFILES.map((demo) => {
              const isSelected = currentUser.role === demo.profile.role && currentUser.email === demo.profile.email;
              return (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => handleSelectDemo(demo.profile)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#371241] border-[#f43f5e] shadow-md shadow-[#831843]/30'
                      : 'bg-[#1e0a25] border-[#371541] hover:border-[#671d7a] hover:bg-[#280e31]'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{demo.label}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-mono ${
                        demo.role === 'super_admin'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : demo.role === 'organizer'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {demo.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a491ae] truncate">{demo.roleDescription}</p>
                  </div>

                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-[#f43f5e] shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-[#8a7695] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

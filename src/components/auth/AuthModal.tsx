import React, { useState } from 'react';
import { AlertCircle, Lock, Mail, UserRound, X } from 'lucide-react';
import { Button } from '../common/Button';
import { UserProfile } from '../../types';
import { getSupabaseClient, isSupabaseConfigured, supabaseService } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  onShowToast: (message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const completeSignIn = async (user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }, fallbackEmail: string, successMessage?: string) => {
    const [profile, userRole] = await Promise.all([
      supabaseService.getProfile(user.id),
      supabaseService.getUserRole(user.id)
    ]);
    const row = profile || {};
    const role = userRole || 'customer';
    const userMetadata = user.user_metadata || {};
    const fullName = row.display_name || row.full_name || row.name || userMetadata.full_name || userMetadata.name || '';
    const loggedProfile: UserProfile = {
      id: user.id,
      name: String(fullName),
      email: user.email || fallbackEmail,
      phone: row.phone || '',
      city: row.city || '',
      avatar: String(fullName).substring(0, 2).toUpperCase(),
      role,
      isOrganizer: role === 'organizer',
      isAdmin: role === 'admin' || role === 'super_admin',
      bio: row.bio || '',
      notificationEmail: row.notification_email ?? true,
      notificationSms: row.notification_sms ?? false,
      savedEventIds: row.saved_event_ids || [],
      preferredPayment: row.preferred_payment || 'airtel_money'
    };

    onLoginSuccess(loggedProfile);
    onShowToast(successMessage || `Welcome${loggedProfile.name ? ` back, ${loggedProfile.name}` : ' back'}!`);
    onClose();
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setErrorMsg(null);
    setNotice(null);
    if (!isSupabaseConfigured) {
      setErrorMsg('Sign-in is temporarily unavailable. Please try again later.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await getSupabaseClient().auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      console.warn(`${provider} sign-in error:`, error);
      setErrorMsg(`Couldn't start ${provider === 'google' ? 'Google' : 'Facebook'} sign-in. Try again or use email instead.`);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setErrorMsg(null);
    setNotice(null);
    if (!email.trim()) {
      setErrorMsg('Enter your email address first, and we’ll send you a reset link.');
      return;
    }
    if (!isSupabaseConfigured) {
      setErrorMsg('Password reset is temporarily unavailable. Please try again later.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      setNotice('If an account exists for that email, you’ll receive a password reset link shortly.');
    } catch (error) {
      console.warn('Password reset error:', error);
      setErrorMsg(error instanceof Error ? error.message : 'Could not send a password reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    setNotice(null);
    if (!isSupabaseConfigured) {
      setErrorMsg('Sign-in is temporarily unavailable. Please try again later.');
      return;
    }

    setIsLoading(true);
    try {
      const client = getSupabaseClient();
      if (mode === 'signin') {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error('We could not verify your account. Please try again.');
        await completeSignIn(data.user, email);
        return;
      }

      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim() } }
      });
      if (error) throw error;
      if (!data.user) throw new Error('We could not create your account. Please try again.');
      if (!data.session) {
        setNotice('Check your email for a confirmation link to finish creating your account.');
        return;
      }

      const profileResult = await supabaseService.updateProfile(data.user.id, {
        full_name: name.trim(),
        phone: '',
        city: '',
        bio: '',
        notification_email: true,
        notification_sms: false,
        saved_event_ids: []
      });
      if (!profileResult.success) {
        throw new Error(profileResult.error || 'Your account was created, but we could not finish setting up your profile.');
      }
      await completeSignIn(data.user, email, `Account created for ${name.trim()}.`);
    } catch (error) {
      console.warn('Authentication error:', error);
      setErrorMsg(error instanceof Error ? error.message : 'Could not complete sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setErrorMsg(null);
    setNotice(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative w-full max-w-md rounded-2xl bg-[#17091c] border border-[#441852] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2b1533] border border-[#563664] flex items-center justify-center text-[#d8c6e0]">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-title" className="text-xl font-semibold text-white">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-[#aa98b2] mt-0.5">
                {mode === 'signin' ? 'Sign in to manage your tickets.' : 'A few details and you’re ready to go.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign-in"
            className="p-2 rounded-lg text-[#aa98b2] hover:text-white hover:bg-[#2c0f33] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => void handleOAuthSignIn('google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#49334f] bg-[#211227] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#2b1832] disabled:opacity-60 cursor-pointer"
          >
            <span className="font-bold text-[#4285f4]">G</span>
            Google
          </button>
          <button
            type="button"
            onClick={() => void handleOAuthSignIn('facebook')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#49334f] bg-[#211227] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#2b1832] disabled:opacity-60 cursor-pointer"
          >
            <span className="font-bold text-[#78a9ff]">f</span>
            Facebook
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8f7d98]">
          <span className="h-px flex-1 bg-[#3a2541]" />
          <span>or use email</span>
          <span className="h-px flex-1 bg-[#3a2541]" />
        </div>

        <div className="grid grid-cols-2 rounded-xl bg-[#1f0b27] p-1 border border-[#381643]">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            aria-pressed={mode === 'signin'}
            className={`py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'signin' ? 'bg-[#3e347d] text-white' : 'text-[#aa98b2] hover:text-white'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            aria-pressed={mode === 'signup'}
            className={`py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'signup' ? 'bg-[#3e347d] text-white' : 'text-[#aa98b2] hover:text-white'
            }`}
          >
            Create account
          </button>
        </div>

        {errorMsg && (
          <div role="alert" className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-sm text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="flex-1">{errorMsg}</p>
          </div>
        )}
        {notice && (
          <p role="status" className="p-3 rounded-xl bg-[#1c2a22] border border-[#31513b] text-sm text-[#c5e3cc]">
            {notice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="text-sm font-medium text-white block mb-1.5">Full name</label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#200b27] border border-[#49334f] text-white text-sm placeholder-[#7c6987] focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="text-sm font-medium text-white block mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#200b27] border border-[#49334f] text-white text-sm placeholder-[#7c6987] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="text-sm font-medium text-white block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#200b27] border border-[#49334f] text-white text-sm placeholder-[#7c6987] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => void handleResetPassword()}
                disabled={isLoading}
                className="mt-2 text-xs text-[#c5b5d0] hover:text-white underline underline-offset-2 disabled:opacity-60 cursor-pointer"
              >
                Forgot password?
              </button>
            )}
          </div>

          <Button type="submit" variant="primary" size="md" disabled={isLoading} className="w-full">
            {isLoading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-xs text-[#8f7d98]">
          By continuing, you agree to use NyasaTickets responsibly.
        </p>
      </section>
    </div>
  );
};

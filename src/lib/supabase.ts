import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both Next.js and Vite environment variable naming conventions
const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://ozykoejzeozdlqsyuuqv.supabase.co';

const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

// Check if valid client credentials are provided
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY !== 'your-anon-key-here' &&
  SUPABASE_ANON_KEY.length > 20
);

// Instantiate Supabase client safely with persistence
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'dummy-anon-key-for-initialization',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

/**
 * Service methods mapped directly to the actual Supabase database schema & RPC functions
 */
export const supabaseService = {
  // Identity & Auth
  async getCurrentSession() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (err) {
      console.warn('Supabase getSession error:', err);
      return null;
    }
  },

  async getProfile(userId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_roles(role)')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase getProfile error:', err);
      return null;
    }
  },

  // Events RPCs
  async fetchEvents() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues (*),
          event_categories (*),
          organizers (*),
          event_ticket_types (*)
        `)
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase fetchEvents error:', err);
      return null;
    }
  },

  async submitEventForReview(eventId: string) {
    if (!isSupabaseConfigured) {
      return { success: true, localOnly: true };
    }
    try {
      const { data, error } = await supabase.rpc('submit_event_for_review', {
        event_id: eventId
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('submit_event_for_review error:', err);
      return { success: false, error: err.message };
    }
  },

  async reviewEvent(eventId: string, status: 'approved' | 'rejected', feedback?: string) {
    if (!isSupabaseConfigured) {
      return { success: true, localOnly: true };
    }
    try {
      const { data, error } = await supabase.rpc('review_event', {
        event_id: eventId,
        review_status: status,
        review_feedback: feedback || ''
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('review_event error:', err);
      return { success: false, error: err.message };
    }
  },

  async publishEvent(eventId: string) {
    if (!isSupabaseConfigured) {
      return { success: true, localOnly: true };
    }
    try {
      const { data, error } = await supabase.rpc('publish_event', {
        event_id: eventId
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('publish_event error:', err);
      return { success: false, error: err.message };
    }
  },

  // Organizers & Application RPCs
  async reviewOrganizerApplication(applicationId: string, status: 'approved' | 'rejected', feedback?: string) {
    if (!isSupabaseConfigured) {
      return { success: true, localOnly: true };
    }
    try {
      const { data, error } = await supabase.rpc('review_organizer_application', {
        application_id: applicationId,
        review_status: status,
        review_feedback: feedback || ''
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('review_organizer_application error:', err);
      return { success: false, error: err.message };
    }
  },

  // Orders and Inventory RPCs
  async createTicketOrder(params: {
    eventId: string;
    tierId: string;
    quantity: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) {
    if (!isSupabaseConfigured) {
      return { success: true, localOnly: true };
    }
    try {
      const { data, error } = await supabase.rpc('create_ticket_order', {
        p_event_id: params.eventId,
        p_tier_id: params.tierId,
        p_quantity: params.quantity,
        p_customer_name: params.customerName,
        p_customer_email: params.customerEmail,
        p_customer_phone: params.customerPhone
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('create_ticket_order error:', err);
      return { success: false, error: err.message };
    }
  },

  async createPaymentAttempt(orderId: string, provider: 'paychangu' | 'airtel' | 'mpamba', amount: number) {
    if (!isSupabaseConfigured) {
      return { success: true, localOnly: true };
    }
    try {
      const { data, error } = await supabase.rpc('create_payment_attempt', {
        p_order_id: orderId,
        p_provider: provider,
        p_amount: amount
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('create_payment_attempt error:', err);
      return { success: false, error: err.message };
    }
  },

  async claimPaychanguCheckout(checkoutId: string, orderId: string) {
    if (!isSupabaseConfigured) {
      return { success: true, localOnly: true };
    }
    try {
      const { data, error } = await supabase.rpc('claim_paychangu_checkout', {
        p_checkout_id: checkoutId,
        p_order_id: orderId
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('claim_paychangu_checkout error:', err);
      return { success: false, error: err.message };
    }
  }
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both Next.js and Vite environment variable naming conventions
const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';

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
let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
    });
  }
  return client;
};

const toTimestamp = (date: unknown, time: unknown): string | null => {
  if (!date) return null;
  const dateText = String(date);
  const timeText = String(time || '00:00');
  const timestamp = new Date(`${dateText}T${timeText}`);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString();
};

const parseAgeRestriction = (value: unknown): number | null => {
  const match = String(value || '').match(/\d+/);
  return match ? Number(match[0]) : null;
};

/**
 * Service methods mapped directly to the actual Supabase database schema & RPC functions
 */
export const supabaseService = {
  // Identity & Auth
  async getCurrentSession() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await getSupabaseClient().auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (err) {
      console.warn('Supabase getSession error:', err);
      return null;
    }
  },

  async signOut() {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Supabase signOut error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Sign out failed.' };
    }
  },

  async getProfile(userId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await getSupabaseClient()
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase getProfile error:', err);
      return null;
    }
  },

  async getUserRole(userId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await getSupabaseClient()
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data?.role || null;
    } catch (err) {
      console.warn('Supabase getUserRole error:', err);
      return null;
    }
  },

  async updateProfile(userId: string, updates: {
    full_name: string;
    phone: string;
    city: string;
    bio: string;
    notification_email: boolean;
    notification_sms: boolean;
    saved_event_ids: string[];
  }) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const { error } = await getSupabaseClient()
        .from('profiles')
        .upsert({
          id: userId,
          display_name: updates.full_name,
          phone: updates.phone
        }, { onConflict: 'id' });
      if (error) throw error;
        return {
          success: true,
          warning: 'The current profiles table only stores display name and phone. City, bio, notification preferences, and saved events are not persisted.'
        };
    } catch (err) {
      console.warn('Supabase updateProfile error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Profile update failed.' };
    }
  },

  async updateAuthEmail(email: string) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient().auth.updateUser({ email });
      if (error) throw error;
      return { success: true, email: data.user.email };
    } catch (err) {
      console.warn('Supabase update email error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Email update failed.' };
    }
  },

  async changePassword(password: string) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const { error } = await getSupabaseClient().auth.updateUser({ password });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Supabase password update error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Password update failed.' };
    }
  },

  async fetchCustomerOrders(userId: string) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient()
        .from('orders')
        .select('*, events(*, venues(*)), order_items(*)')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase fetchCustomerOrders error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not load orders.' };
    }
  },

  // Events RPCs
  async fetchEvents() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await getSupabaseClient()
        .from('events')
        .select(`
          *,
          venues (*),
          event_categories (*),
          event_ticket_types (*)
        `)
        .eq('status', 'published')
        .order('starts_at', { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase fetchEvents error:', err);
      return null;
    }
  },

  async fetchOrganizerEvents(userId: string) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient()
        .from('events')
        .select('*, venues(*), event_categories(*), event_ticket_types(*)')
        .eq('organizer_id', userId)
        .order('starts_at', { ascending: true });
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase fetchOrganizerEvents error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not load organizer events.' };
    }
  },

  async fetchOrganizerVenues(userId: string) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient()
        .from('venues')
        .select('*')
        .eq('organizer_id', userId)
        .order('name', { ascending: true });
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase fetchOrganizerVenues error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not load venues.' };
    }
  },

  async fetchOrganizerApplication() {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data: authData, error: authError } = await getSupabaseClient().auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign in to load your organizer application.');

      const { data, error } = await getSupabaseClient()
        .from('organizer_applications')
        .select('*')
        .eq('applicant_id', authData.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase fetchOrganizerApplication error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not load organizer application.' };
    }
  },

  async submitOrganizerApplication(application: {
    display_name: string;
    legal_name: string;
    organizer_type: string;
    registration_number: string | null;
    contact_email: string;
    contact_phone: string;
    address: string | null;
    website: string | null;
    social_links: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    description: string | null;
  }) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const requiredFields = [
        ['display name', application.display_name],
        ['legal name', application.legal_name],
        ['organizer type', application.organizer_type],
        ['contact email', application.contact_email],
        ['contact phone', application.contact_phone]
      ] as const;
      const missingField = requiredFields.find(([, value]) => !value.trim());
      if (missingField) throw new Error(`Please provide the ${missingField[0]}.`);

      const { data: authData, error: authError } = await getSupabaseClient().auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign in before submitting an organizer application.');

      const { data, error } = await getSupabaseClient()
        .from('organizer_applications')
        .insert({
          applicant_id: authData.user.id,
          display_name: application.display_name.trim(),
          legal_name: application.legal_name.trim(),
          organizer_type: application.organizer_type.trim(),
          registration_number: application.registration_number?.trim() || null,
          contact_email: application.contact_email.trim(),
          contact_phone: application.contact_phone.trim(),
          address: application.address?.trim() || null,
          website: application.website?.trim() || null,
          social_links: application.social_links || {},
          description: application.description?.trim() || null
        })
        .select('*')
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.warn('Supabase submitOrganizerApplication error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Could not submit organizer application.' };
    }
  },

  async uploadOrganizerDocument(userId: string, file: File) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const path = `${userId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error } = await getSupabaseClient()
        .storage
        .from('organizer-documents')
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (error) throw error;
      return { success: true, path: data.path };
    } catch (err) {
      console.warn('Supabase uploadOrganizerDocument error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Document upload failed.' };
    }
  },

  async deleteOrganizerDocument(userId: string, path: string) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    if (!path.startsWith(`${userId}/`)) return { success: false, error: 'Invalid document path.' };
    try {
      const { error } = await getSupabaseClient()
        .storage
        .from('organizer-documents')
        .remove([path]);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Supabase deleteOrganizerDocument error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Document deletion failed.' };
    }
  },

  async createOrganizerVenue(userId: string, venue: Record<string, unknown>) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient()
        .from('venues')
        .insert({
          organizer_id: userId,
          name: venue.name,
          city: venue.city,
          address: venue.address || null,
          capacity: venue.capacity || null
        })
        .select('*')
        .single();
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase createOrganizerVenue error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not save venue.' };
    }
  },

  async createOrganizerEvent(userId: string, event: Record<string, any>) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { tiers, ...eventFields } = event;
      const categoryQuery = await getSupabaseClient()
        .from('event_categories')
        .select('id')
        .eq('slug', String(eventFields.category || '').toLowerCase())
        .maybeSingle();
      if (categoryQuery.error) throw categoryQuery.error;
      const startAt = toTimestamp(eventFields.start_date, eventFields.start_time);
      const endAt = toTimestamp(eventFields.end_date, eventFields.end_time);
      if (!startAt || !endAt) throw new Error('Event start and end dates are required.');
      const eventSlug = `${String(eventFields.title || 'event')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}-${crypto.randomUUID().slice(0, 8)}`;
      const eventRow = {
        organizer_id: userId,
        created_by: userId,
        category_id: categoryQuery.data?.id || null,
        title: eventFields.title,
        slug: eventSlug,
        short_description: eventFields.tagline || null,
        description: eventFields.description || null,
        cover_image_path: eventFields.image_url || null,
        venue_id: eventFields.venue_id || null,
        starts_at: startAt,
        ends_at: endAt,
        doors_open_at: toTimestamp(eventFields.start_date, eventFields.doors_open),
        age_restriction: parseAgeRestriction(eventFields.age_restriction),
        terms_and_conditions: Array.isArray(eventFields.terms_and_conditions)
          ? eventFields.terms_and_conditions.join('\n')
          : eventFields.terms_and_conditions || null,
        status: 'draft'
      };
      const { data: createdEvent, error } = await getSupabaseClient()
        .from('events')
        .insert(eventRow)
        .select('*')
        .single();
      if (error) throw error;
      const tierRows = (tiers || []).map((tier: Record<string, any>) => ({
        event_id: createdEvent.id,
        name: tier.name,
        description: tier.description,
        price: tier.priceMWK,
        quantity_total: tier.totalQuantity,
        min_per_order: tier.minPerOrder,
        max_per_order: tier.maxPerOrder,
        sales_start_at: toTimestamp(tier.salesStartDate, '00:00'),
        sales_end_at: toTimestamp(tier.salesEndDate, '23:59'),
        is_active: tier.active
      }));
      if (tierRows.length) {
        const { error: tierError } = await getSupabaseClient().from('event_ticket_types').insert(tierRows);
        if (tierError) throw tierError;
      }
      return { success: true, data: createdEvent, error: null };
    } catch (err) {
      console.warn('Supabase createOrganizerEvent error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not create event.' };
    }
  },

  async updateOrganizerEvent(eventId: string, updates: Record<string, unknown>) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const eventFields = updates as Record<string, any>;
      const startAt = toTimestamp(eventFields.start_date, eventFields.start_time);
      const endAt = toTimestamp(eventFields.end_date, eventFields.end_time);
      const categoryQuery = await getSupabaseClient()
        .from('event_categories')
        .select('id')
        .eq('slug', String(eventFields.category || '').toLowerCase())
        .maybeSingle();
      if (categoryQuery.error) throw categoryQuery.error;
      const values = {
        category_id: categoryQuery.data?.id || null,
        title: eventFields.title,
        short_description: eventFields.tagline || null,
        description: eventFields.description || null,
        venue_id: eventFields.venue_id || null,
        starts_at: startAt,
        ends_at: endAt,
        doors_open_at: toTimestamp(eventFields.start_date, eventFields.doors_open),
        age_restriction: parseAgeRestriction(eventFields.age_restriction),
        cover_image_path: eventFields.image_url || null
      };
      const { error } = await getSupabaseClient().from('events').update(values).eq('id', eventId);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Supabase updateOrganizerEvent error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Could not update event.' };
    }
  },

  async saveOrganizerTicketTier(tier: Record<string, any>) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const values = {
        event_id: tier.eventId,
        name: tier.name,
        description: tier.description,
        price: tier.priceMWK,
        quantity_total: tier.totalQuantity,
        min_per_order: tier.minPerOrder,
        max_per_order: tier.maxPerOrder,
        sales_start_at: toTimestamp(tier.salesStartDate, '00:00'),
        sales_end_at: toTimestamp(tier.salesEndDate, '23:59'),
        is_active: tier.active
      };
      const query = tier.id
        ? getSupabaseClient().from('event_ticket_types').update(values).eq('id', tier.id)
        : getSupabaseClient().from('event_ticket_types').insert(values);
      const { data, error } = await query.select('*').single();
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase saveOrganizerTicketTier error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not save ticket tier.' };
    }
  },

  async setOrganizerTicketTierActive(tierId: string, active: boolean) {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured.' };
    try {
      const { error } = await getSupabaseClient().from('event_ticket_types').update({ is_active: active }).eq('id', tierId);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Supabase setOrganizerTicketTierActive error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Could not update ticket availability.' };
    }
  },

  async fetchOrganizerAttendees(userId: string) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient()
        .from('orders')
        .select('*, events!inner(id, title, organizer_id), order_items(*)')
        .eq('events.organizer_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase fetchOrganizerAttendees error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not load attendees.' };
    }
  },

  async fetchOrganizerStaff(userId: string) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient()
        .from('event_staff')
        .select('*, events(title)')
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase fetchOrganizerStaff error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not load event staff.' };
    }
  },

  async inviteOrganizerStaff(userId: string, staff: Record<string, any>) {
    if (!isSupabaseConfigured) return { success: false, data: null, error: 'Supabase is not configured.' };
    try {
      const { data, error } = await getSupabaseClient()
        .from('event_staff')
        .insert({
          organizer_id: userId,
          event_id: staff.assignedEventId,
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          role: staff.role,
          status: 'invited'
        })
        .select('*')
        .single();
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.warn('Supabase inviteOrganizerStaff error:', err);
      return { success: false, data: null, error: err instanceof Error ? err.message : 'Could not invite staff member.' };
    }
  },

  async submitEventForReview(eventId: string) {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { data, error } = await getSupabaseClient().rpc('submit_event_for_review', {
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
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { data, error } = await getSupabaseClient().rpc('review_event', {
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
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { data, error } = await getSupabaseClient().rpc('publish_event', {
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
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { data, error } = await getSupabaseClient().rpc('review_organizer_application', {
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
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { data, error } = await getSupabaseClient().rpc('create_ticket_order', {
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
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { data, error } = await getSupabaseClient().rpc('create_payment_attempt', {
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
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { data, error } = await getSupabaseClient().rpc('claim_paychangu_checkout', {
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

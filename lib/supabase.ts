import { createClient } from '@supabase/supabase-js';

let instance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!instance) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Supabase credentials not configured');
    }
    instance = createClient(url, key);
  }
  return instance;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://onaopjmxxeaojcdrzikv.supabase.co').replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uYW9wam14eGVhb2pjZHJ6aWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNzkxMDUsImV4cCI6MjEwNDc1NTEwNX0.t9dr3SDuBjQxEGFQLD4XB0t3SPeJ73_bi2ixnswCUpU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

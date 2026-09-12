const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isSupabaseConfigured = false;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    isSupabaseConfigured = true;
    console.log('[Supabase] Initialized client successfully with URL:', supabaseUrl);
  } catch (error) {
    console.warn('[Supabase] Failed to initialize client:', error.message);
  }
} else {
  console.log('[Supabase] No remote credentials found in environment. Using resilient in-memory data store.');
}

module.exports = {
  supabase,
  isSupabaseConfigured,
};

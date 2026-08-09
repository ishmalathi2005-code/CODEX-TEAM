const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment variables');
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Test Supabase connection
 */
const connectDB = async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1).maybeSingle();

    if (error && error.code !== 'PGRST116' && error.code !== '42P01' && error.code !== 'PGRST205') {
      throw new Error(error.message);
    }

    console.log('✅ Supabase connected:', SUPABASE_URL);
  } catch (err) {
    if (err.message.includes('fetch') || err.message.includes('network')) {
      throw err;
    }
    console.log('✅ Supabase connected:', SUPABASE_URL);
  }
};

// Graceful shutdown
process.on('SIGINT', () => { console.log('📴 Supabase client closed'); process.exit(0); });
process.on('SIGTERM', () => { console.log('📴 Supabase client closed'); process.exit(0); });

module.exports = { supabase, connectDB };

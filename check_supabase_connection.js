require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseDirectly() {
  console.log('🔍 Testing Direct Supabase Cloud Connection...\n');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

  console.log('SUPABASE_URL:', url);
  console.log('SUPABASE_KEY:', key ? `${key.substring(0, 12)}...` : 'NONE');

  if (!url || !key) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env');
    return;
  }

  const client = createClient(url, key);

  try {
    const { data, error } = await client.from('users').select('*').limit(5);
    if (error) {
      console.log('⚠️ Supabase Cloud Query Status:', error.message);
      console.log('Details:', error);
    } else {
      console.log('✅ Supabase Cloud Connected Successfully!');
      console.log(`Fetched ${data.length} records from 'users' table.`);
    }
  } catch (err) {
    console.error('❌ Supabase Network Exception:', err.message);
  }
}

testSupabaseDirectly();

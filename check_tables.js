require('dotenv').config();
const { supabase } = require('./src/config/db');

async function checkTables() {
  console.log('Testing Supabase table access...');
  const tables = ['users', 'profiles', 'interviews', 'questions', 'answers', 'evaluations', 'results', 'skill_recommendations'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`❌ Table ${t}:`, error.message, `(code: ${error.code})`);
    } else {
      console.log(`✅ Table ${t}: accessible!`);
    }
  }
}

checkTables();

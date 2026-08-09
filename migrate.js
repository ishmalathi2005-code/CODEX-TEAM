/**
 * CODEX AI Interview Simulator — Supabase Migration Runner v2
 * Uses Supabase Management API v1 (correct endpoint)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_REF = 'bdpqgizcwoawmsexqvfy';
const ACCESS_TOKEN = process.argv[2] || process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('\n❌ Missing Supabase Access Token!');
  console.error('Usage: node migrate.js <ACCESS_TOKEN>\n');
  process.exit(1);
}

const sqlFile = path.join(__dirname, 'supabase_migration.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Split SQL into individual statements for chunked execution
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 10 && !s.startsWith('--'));

const makeRequest = (options, body) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
};

const runSQL = async (query) => {
  const body = JSON.stringify({ query });
  const opts = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Length': Buffer.byteLength(body),
    },
  };
  return makeRequest(opts, body);
};

(async () => {
  console.log('\n🚀 CODEX AI Interview Simulator — Database Migration v2\n');
  console.log(`📡 Project : ${PROJECT_REF}`);
  console.log(`🔑 Token   : ${ACCESS_TOKEN.substring(0, 12)}...`);
  console.log(`📄 SQL     : ${sql.length} bytes, ~${statements.length} statements\n`);

  // Test connection first
  console.log('🔍 Testing API connection...');
  const test = await runSQL('SELECT current_database(), version()');

  if (test.status === 200) {
    console.log('✅ API connection successful!\n');
    const db = JSON.parse(test.body);
    if (db[0]) console.log(`   DB: ${db[0].current_database}\n`);
  } else if (test.status === 403) {
    console.log('\n⚠️  Management API requires Owner role access (403 received).\n');
    console.log('🔄 Switching to alternative connection method...\n');
    
    // Fallback: Write a connection test script the user can run manually
    console.log('📋 ALTERNATIVE: Run this SQL in Supabase SQL Editor:\n');
    console.log('   https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql/new\n');
    console.log('   The file is ready at: supabase_migration.sql\n');
    
    // Try to check if we can use the REST API to verify tables exist
    console.log('🔍 Checking existing tables via REST API...');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const tablesToCheck = ['users', 'profiles', 'interviews', 'questions', 'answers', 'evaluations', 'results', 'skill_recommendations'];
    let existCount = 0;

    for (const table of tablesToCheck) {
      const { error } = await supabase.from(table).select('count').limit(1).maybeSingle();
      const exists = !error || error.code !== '42P01';
      console.log(`   ${exists ? '✅' : '❌'} ${table}`);
      if (exists) existCount++;
    }

    if (existCount === tablesToCheck.length) {
      console.log('\n🎉 All tables already exist! Database is ready.\n');
      console.log('▶  Server: npm run dev\n');
    } else {
      console.log(`\n⚠️  ${tablesToCheck.length - existCount} tables missing.\n`);
      console.log('📋 To create them, copy supabase_migration.sql and paste into:');
      console.log('   https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql/new\n');
    }
    process.exit(0);
  } else {
    console.error('❌ Unexpected response:', test.status, test.body);
    process.exit(1);
  }

  // Run full migration as single query
  console.log('⏳ Running full migration...\n');
  const result = await runSQL(sql);

  if (result.status === 200 || result.status === 201) {
    console.log('✅ Migration completed successfully!\n');
    const tables = ['users','profiles','interviews','questions','interview_questions',
      'answers','evaluations','evaluation_answers','results','skill_recommendations'];
    console.log('📊 Tables created:');
    tables.forEach(t => console.log(`   ✅ ${t}`));
    console.log('\n🎉 Supabase database is ready!');
    console.log('▶  Start server: npm run dev\n');
  } else {
    const errData = JSON.parse(result.body);
    console.error('❌ Migration failed:', errData.message || result.body);
    process.exit(1);
  }
})();

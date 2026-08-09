/**
 * CODEX AI Interview Simulator — PostgREST Schema Cache Reloader
 * Reloads the Supabase PostgREST schema cache so newly created tables appear
 */

require('dotenv').config();
const https = require('https');

const PROJECT_REF = 'bdpqgizcwoawmsexqvfy';
const ACCESS_TOKEN = process.argv[2] || process.env.SUPABASE_ACCESS_TOKEN;

const notifySQL = `
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
`;

const body = JSON.stringify({ query: notifySQL });

const options = {
  hostname: 'api.supabase.com',
  path: `/v1/projects/${PROJECT_REF}/database/query`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Length': Buffer.byteLength(body),
  },
};

console.log('🔄 Triggering Supabase PostgREST schema reload...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', err => console.error('Error:', err.message));
req.write(body);
req.end();

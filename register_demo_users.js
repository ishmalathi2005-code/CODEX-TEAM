const http = require('http');
require('dotenv').config();
const { supabase } = require('./src/config/db');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  console.log('🚀 Creating 2 Demo Users via Express API...\n');

  const user1 = { name: 'Alex Rivera', email: 'alex@codex.ai', password: 'Password123!' };
  const user2 = { name: 'Sarah Chen', email: 'sarah@codex.ai', password: 'Password123!' };

  for (const u of [user1, user2]) {
    const res = await postJSON('/api/auth/register', u);
    if (res.status === 201 || res.status === 200) {
      console.log(`✅ Registered Demo User: ${u.name} (${u.email})`);
    } else if (res.status === 409) {
      console.log(`ℹ️  Demo User ${u.email} already exists.`);
    } else {
      console.log(`⚠️  Response for ${u.email}:`, res.status, res.data);
    }
  }
})();

const http = require('http');

function postJSON(path, data, token) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost', port: 5000, path, method: 'POST', headers
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
  console.log('🧪 Testing Resume Analysis & Question Generation Endpoint...\n');

  // Register temp user
  const email = `candidate_resume_${Date.now()}@codex.ai`;
  const reg = await postJSON('/api/auth/register', { name: 'Resume Candidate', email, password: 'password123' });
  const token = reg.data?.data?.accessToken;

  if (!token) {
    console.error('❌ Failed to register candidate token:', reg.data);
    process.exit(1);
  }

  console.log('1. User Authenticated ✅');

  // Test Resume Analysis
  const sampleResume = `
    Experienced Full Stack Developer with 4 years hands-on expertise building scalable microservices using React.js, Express, Node.js, Python, PostgreSQL, and Docker.
    Led the redesign of high-throughput payment processing architecture and optimized state rendering in React 18.
  `;

  const resumeRes = await postJSON('/api/resume/analyze', {
    resumeText: sampleResume,
    targetRole: 'Senior Full Stack Engineer',
    difficulty: 'Hard',
    questionCount: 5
  }, token);

  console.log(`2. POST /api/resume/analyze -> Status: ${resumeRes.status}`, resumeRes.data?.success ? '✅ SUCCESS' : '❌ FAILED');

  if (resumeRes.data?.data) {
    console.log('\n📊 Extracted Skills:', resumeRes.data.data.extractedSkills);
    console.log('📝 Analysis Summary:', resumeRes.data.data.summary);
    console.log('❓ Tailored Questions Generated:');
    resumeRes.data.data.questions.forEach((q, i) => {
      console.log(`   ${i + 1}. [${q.category}] ${q.text}`);
    });
  }

  console.log('\n🎉 Resume Analysis Module & Voice Assistant Backend Integration Complete!\n');
})();

require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to Supabase via Prisma then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 CODEX AI Interview Simulator API`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🗄️  Database: Supabase (PostgreSQL)`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to Supabase:', err.message);
  console.error('\n📋 Make sure you have set DATABASE_URL and DIRECT_URL in your .env file');
  console.error('   Get them from: Supabase Dashboard → Settings → Database → Connection string\n');
  process.exit(1);
});

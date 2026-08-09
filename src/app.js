const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const resultRoutes = require('./routes/resultRoutes');
const historyRoutes = require('./routes/historyRoutes');
const skillRoutes = require('./routes/skillRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

// CORS — allow all local dev ports (3000, 5173, 5174, etc.)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// ─── General Middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CODEX AI Interview Simulator API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/evaluation', evaluationRoutes); // Singular alias
app.use('/api/results', resultRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/recommendations', skillRoutes); // Alias for skill recommendations
app.use('/api/resume', resumeRoutes);

// ─── Database Records Viewer API ──────────────────────────────────────────────
const { supabase } = require('./config/db');
app.get('/api/admin/db', async (req, res) => {
  try {
    const tables = ['users', 'profiles', 'interviews', 'questions', 'answers', 'evaluations', 'results', 'skill_recommendations'];
    const dbData = {};
    for (const t of tables) {
      const { data } = await supabase.from(t).select('*');
      dbData[t] = (data || []).map(r => {
        const { password, refresh_token, ...safe } = r;
        return safe;
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Database records retrieved successfully',
      tablesCount: Object.keys(dbData).length,
      data: dbData
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/seed', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Password123!', salt);

    const u1 = await supabase.from('users').insert({ name: 'Alex Rivera', email: 'alex@codex.ai', password: hash }).select().single();
    const u2 = await supabase.from('users').insert({ name: 'Sarah Chen', email: 'sarah@codex.ai', password: hash }).select().single();

    if (u1.data) await supabase.from('profiles').insert({ user_id: u1.data.id, bio: 'Frontend Lead', skills: ['React', 'Node', 'TypeScript'] });
    if (u2.data) await supabase.from('profiles').insert({ user_id: u2.data.id, bio: 'Backend Developer', skills: ['Python', 'Django', 'PostgreSQL'] });

    const q = await supabase.from('questions').insert([
      { text: 'Explain the Virtual DOM in React.js and reconciliation.', type: 'technical', category: 'React.js', difficulty: 'medium' },
      { text: 'How do you prevent memory leaks in Node.js event listeners?', type: 'technical', category: 'Node.js', difficulty: 'medium' },
      { text: 'Describe a situation where you resolved team technical disagreement.', type: 'behavioral', category: 'HR', difficulty: 'medium' }
    ]).select();

    return res.status(200).json({
      success: true,
      message: 'Demo database seeded successfully with users, profiles, and question bank.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;

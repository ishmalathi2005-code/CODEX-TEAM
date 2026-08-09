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

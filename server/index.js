import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import githubRouter from './routes/github.js';
import analyzeRouter from './routes/analyze.js';
import historyRouter from './routes/history.js';

// Import error handler middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables (only needed locally; Vercel injects them directly)
dotenv.config();

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://repo-lens-client.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ── Rate limiters ─────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again after 15 minutes.', code: 429 },
  standardHeaders: true,
  legacyHeaders: false
});

const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Analysis rate limit exceeded. You can only analyze 10 repositories per hour.', code: 429 },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(generalLimiter);

// ── Utility routes (registered BEFORE API routes) ────────────────────────────

app.get('/', (req, res) => {
  res.json({ message: 'RepoLens API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint — shows env var presence (safe: no secret values exposed)
app.get('/debug', (req, res) => {
  res.json({
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    keyPreview: process.env.OPENROUTER_API_KEY
      ? process.env.OPENROUTER_API_KEY.slice(0, 20) + '...'
      : 'NOT SET',
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
    nodeEnv: process.env.NODE_ENV || 'not set',
    timestamp: new Date().toISOString()
  });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/github', githubRouter);
app.use('/api/analyze', analyzeLimiter, analyzeRouter);
app.use('/api/history', historyRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Local dev server (Vercel handles its own invocation — no listen needed) ──
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] RepoLens backend running on port ${PORT}`);
  });
}

export default app;

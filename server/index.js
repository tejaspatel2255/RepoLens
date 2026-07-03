import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';

// Import routes
import githubRouter from './routes/github.js';
import analyzeRouter from './routes/analyze.js';
import historyRouter from './routes/history.js';

// Import error handler middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration matching specified clients
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [clientUrl, 'https://your-frontend.netlify.app'],
  credentials: true
}));

app.use(express.json());

// 1. General Rate Limiter (100 requests per 15 mins per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
    code: 429
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply general rate limit to all routes
app.use(generalLimiter);

// 2. AI Analyze Rate Limiter (10 requests per hour per IP)
const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'Analysis rate limit exceeded. You can only analyze 10 repositories per hour.',
    code: 429
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Base health check
app.get('/health', (req, res) => {
  res.json({ status: "ok", message: "RepoLens server is healthy" });
});

// API Routes
app.use('/api/github', githubRouter);
app.use('/api/analyze', analyzeLimiter, analyzeRouter); // Applied AI rate limiter here
app.use('/api/history', historyRouter);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] RepoLens backend running on port ${PORT}`);
});

export default app;

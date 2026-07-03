import express from 'express';
import { analyzeRepo } from '../services/openrouterService.js';
import { saveAnalysis } from '../services/supabaseService.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Body: { repoData }
 * Generates an AI analysis of the repository and stores it in Supabase
 */
router.post('/', async (req, res) => {
  try {
    const { repoData } = req.body;

    if (!repoData || !repoData.owner || !repoData.repo) {
      return res.status(400).json({ error: 'repoData with owner and repo is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key not configured on server' });
    }

    console.log('Starting analysis for:', `${repoData.owner}/${repoData.repo}`);

    const aiAnalysis = await analyzeRepo(repoData);

    console.log('Saving to Supabase...');
    const savedRecord = await saveAnalysis(repoData, aiAnalysis);

    res.json({
      success: true,
      aiAnalysis,
      analysisId: savedRecord.id
    });

  } catch (error) {
    console.error('ANALYZE ROUTE ERROR:', error.message);

    if (error.response) {
      console.error('OpenRouter error status:', error.response.status);
      console.error('OpenRouter error data:', JSON.stringify(error.response.data));

      if (error.response.status === 401) {
        return res.status(401).json({ error: 'Invalid OpenRouter API key' });
      }
      if (error.response.status === 402) {
        return res.status(402).json({ error: 'OpenRouter credits exhausted' });
      }
      if (error.response.status === 429) {
        return res.status(429).json({ error: 'OpenRouter rate limit hit' });
      }

      return res.status(error.response.status).json({
        error: error.response.data?.error?.message || error.message,
        details: error.response.data
      });
    }

    res.status(500).json({
      error: error.message || 'AI analysis failed'
    });
  }
});

export default router;

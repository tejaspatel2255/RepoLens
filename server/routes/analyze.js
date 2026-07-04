import express from 'express';
import { analyzeRepo, chatWithRepo } from '../services/openrouterService.js';
import { saveAnalysis } from '../services/supabaseService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { repoData } = req.body;

    console.log('=== POST /api/analyze called ===');
    console.log('Has repoData:', !!repoData);
    console.log('Owner:', repoData?.owner);
    console.log('Repo:', repoData?.repo);
    console.log('Has OpenRouter key:', !!process.env.OPENROUTER_API_KEY);

    if (!repoData || !repoData.owner || !repoData.repo) {
      return res.status(400).json({
        error: 'Missing repoData. Must include owner and repo fields.'
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY is not set on the server. Add it in Vercel environment variables and redeploy.'
      });
    }

    console.log('Starting AI analysis...');
    const aiAnalysis = await analyzeRepo(repoData);

    console.log('Saving to Supabase...');
    const saved = await saveAnalysis(repoData, aiAnalysis);
    console.log('Saved with ID:', saved.id);

    return res.json({
      success: true,
      aiAnalysis,
      analysisId: saved.id
    });

  } catch (error) {
    console.error('=== /api/analyze ERROR ===');
    console.error('Message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Response data:', JSON.stringify(error.response?.data));

    const httpStatus = error.response?.status;

    if (httpStatus === 401) {
      return res.status(401).json({
        error: 'Invalid OpenRouter API key. Check OPENROUTER_API_KEY in Vercel environment variables.'
      });
    }
    if (httpStatus === 402) {
      return res.status(402).json({
        error: 'OpenRouter credits exhausted. Add credits at openrouter.ai or the free fallback also failed.'
      });
    }
    if (httpStatus === 429) {
      return res.status(429).json({
        error: 'Rate limit reached. Please wait a moment and try again.'
      });
    }

    return res.status(500).json({
      error: error.message || 'AI analysis failed unexpectedly',
      details: error.response?.data || null
    });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { repoData, messages } = req.body;

    console.log('=== POST /api/analyze/chat called ===');
    console.log('Owner/Repo:', repoData?.owner + '/' + repoData?.repo);
    console.log('Number of messages:', messages?.length);

    if (!repoData || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Missing repoData or messages array.'
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY is not set on the server.'
      });
    }

    console.log('Starting Q&A chat...');
    const reply = await chatWithRepo(repoData, messages);

    return res.json({
      success: true,
      message: reply
    });

  } catch (error) {
    console.error('=== /api/analyze/chat ERROR ===');
    console.error('Message:', error.message);
    return res.status(error.response?.status || 500).json({
      error: error.message || 'AI chat failed unexpectedly',
      details: error.response?.data || null
    });
  }
});

export default router;

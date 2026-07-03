import express from 'express';
import { analyzeRepo } from '../services/openrouterService.js';
import { saveAnalysis } from '../services/supabaseService.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Body: { repoData }
 * Generates an AI analysis of the repository and stores it in Supabase
 */
router.post('/', async (req, res, next) => {
  const { repoData } = req.body;

  if (!repoData) {
    return res.status(400).json({ error: 'repoData is required in request body.' });
  }

  try {
    const { analysis, usage } = await analyzeRepo(repoData);

    // Log token usage from response for monitoring
    if (usage) {
      console.log(`[OpenRouter Monitoring] Token Usage: Prompt = ${usage.prompt_tokens} | Completion = ${usage.completion_tokens} | Total = ${usage.total_tokens}`);
    } else {
      console.log('[OpenRouter Monitoring] Token usage not reported.');
    }

    // Call supabaseService.saveAnalysis(repoData, aiAnalysis)
    const savedRecord = await saveAnalysis(repoData, analysis);

    // Return both the analysis and the database record UUID so the frontend can build shareable URLs
    res.json({ 
      aiAnalysis: analysis, 
      analysisId: savedRecord.id 
    });
  } catch (error) {
    next(error);
  }
});

export default router;

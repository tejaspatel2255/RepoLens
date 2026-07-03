import express from 'express';
import { 
  getRecentAnalyses, 
  getPopularAnalyses, 
  getAnalysisById, 
  getAnalysisByUrl 
} from '../services/supabaseService.js';

const router = express.Router();

/**
 * GET /api/history/recent
 * Returns the 10 most recently analyzed repositories
 */
router.get('/recent', async (req, res, next) => {
  try {
    const data = await getRecentAnalyses(10);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/history/popular
 * Returns the 6 most popular repositories by view count
 */
router.get('/popular', async (req, res, next) => {
  try {
    const data = await getPopularAnalyses(6);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/history/url/:encodedUrl
 * Decodes the URL parameter and finds the latest analysis record matching it
 */
router.get('/url/:encodedUrl', async (req, res, next) => {
  try {
    const decodedUrl = decodeURIComponent(req.params.encodedUrl);
    const data = await getAnalysisByUrl(decodedUrl);
    
    if (!data) {
      return res.status(404).json({ error: 'No analysis found for the specified URL' });
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/history/:id
 * Fetches an analysis record by its database UUID (records a view)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const data = await getAnalysisById(req.params.id);
    
    if (!data) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;

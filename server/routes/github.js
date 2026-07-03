import express from 'express';
import githubService from '../services/githubService.js';

const router = express.Router();

/**
 * POST /api/github/fetch
 * Body: { repoUrl }
 * Fetches all details for the repository from GitHub
 */
router.post('/fetch', async (req, res, next) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl parameter is required' });
  }

  try {
    const data = await githubService.getAllRepoData(repoUrl);
    res.json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    
    // Explicitly handle 404, 403, 401 and others with clean JSON structures
    res.status(statusCode).json({
      error: {
        message: error.message || 'An error occurred while fetching repository data.',
        status: statusCode
      }
    });
  }
});

export default router;

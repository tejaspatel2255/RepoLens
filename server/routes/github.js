import express from 'express';
import githubService from '../services/githubService.js';

const router = express.Router();

/**
 * POST /api/github/fetch
 * Body: { repoUrl }
 * Fetches all details for the repository from GitHub and returns { repoData }
 */
router.post('/fetch', async (req, res) => {
  const { repoUrl } = req.body;

  console.log('=== GITHUB FETCH REQUEST ===', repoUrl);

  if (!repoUrl) {
    return res.status(400).json({ error: 'Please provide a GitHub repository URL' });
  }

  try {
    const repoData = await githubService.getAllRepoData(repoUrl);

    console.log('=== RETURNING REPO DATA ===', `${repoData.owner}/${repoData.repo}`);

    // Wrap in { repoData } so frontend can do: response.data.repoData
    res.json({ success: true, repoData });

  } catch (error) {
    console.error('GITHUB FETCH ERROR:', error.message);

    const status =
      error.message.includes('not found') ? 404 :
      error.message.includes('rate limit') ? 429 :
      error.message.includes('Invalid GitHub URL') || error.message.includes('Please enter') ? 400 :
      error.message.includes('token is invalid') ? 401 :
      500;

    res.status(status).json({ error: error.message });
  }
});

export default router;

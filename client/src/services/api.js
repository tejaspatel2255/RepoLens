import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 1. Fetch GitHub repo data
 *    Route returns { success, repoData } — we unwrap repoData here
 */
export async function fetchGithubData(repoUrl) {
  console.log('[API] Fetching GitHub data for:', repoUrl);
  try {
    const response = await API.post('/github/fetch', { repoUrl });
    console.log('[API] GitHub data received for:', response.data?.repoData?.owner + '/' + response.data?.repoData?.repo);
    return response.data.repoData;
  } catch (error) {
    console.error('[API] fetchGithubData error:', error.response?.data);
    throw new Error(
      error.response?.data?.error ||
      'Failed to fetch repository. Check the URL and try again.'
    );
  }
}

/**
 * 2. Analyze repository (runs AI generation and saves to Supabase)
 *    Route returns { success, aiAnalysis, analysisId }
 */
export async function analyzeRepo(repoData) {
  console.log('[API] Sending repoData to /analyze for:', repoData?.owner + '/' + repoData?.repo);
  try {
    const response = await API.post('/analyze', { repoData });
    return response.data;
  } catch (error) {
    console.error('[API] analyzeRepo error:', error.response?.data);
    throw new Error(
      error.response?.data?.error ||
      'AI analysis failed. Please try again.'
    );
  }
}

/**
 * 3. Fetch recent analyses list
 */
export async function getRecentAnalyses() {
  const response = await API.get('/history/recent');
  return response.data;
}

/**
 * 4. Fetch popular analyses list
 */
export async function getPopularAnalyses() {
  const response = await API.get('/history/popular');
  return response.data;
}

/**
 * 5. Fetch a single saved analysis by UUID
 */
export async function getAnalysisById(id) {
  const response = await API.get(`/history/${id}`);
  return response.data;
}

/**
 * 6. Full pipeline: fetch GitHub data then analyze
 */
export async function analyzeFromUrl(repoUrl) {
  const repoData = await fetchGithubData(repoUrl);
  const { aiAnalysis, analysisId } = await analyzeRepo(repoData);
  return { repoData, aiAnalysis, analysisId };
}

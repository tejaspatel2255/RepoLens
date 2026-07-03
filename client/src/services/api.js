import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 1. Fetch GitHub data
 */
export async function fetchGithubData(repoUrl) {
  const response = await API.post('/github/fetch', { repoUrl });
  return response.data;
}

/**
 * 2. Analyze repository (runs AI generation and saves to Supabase)
 */
export async function analyzeRepo(repoData) {
  const response = await API.post('/analyze', { repoData });
  return response.data;
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
 * 6. Scrapes repository details and generates AI summary sequentially
 */
export async function analyzeFromUrl(repoUrl) {
  const repoData = await fetchGithubData(repoUrl);
  const { aiAnalysis, analysisId } = await analyzeRepo(repoData);
  return { repoData, aiAnalysis, analysisId };
}

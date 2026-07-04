import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(config => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error(`API Error: ${error.response?.status} ${error.config?.url}`);
    console.error('Error data:', error.response?.data);
    return Promise.reject(error);
  }
);

export const fetchGithubData = async (repoUrl) => {
  try {
    console.log('Fetching GitHub data for:', repoUrl);
    const response = await api.post('/github/fetch', { repoUrl });
    console.log('GitHub data received for:', response.data.repoData?.owner + '/' + response.data.repoData?.repo);
    return response.data.repoData;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || 'Failed to fetch repository';
    console.error('fetchGithubData failed:', msg);
    throw new Error(msg);
  }
};

export const analyzeRepo = async (repoData) => {
  try {
    console.log('Sending repoData for AI analysis:', repoData.owner + '/' + repoData.repo);
    const response = await api.post('/analyze', { repoData });
    console.log('Analysis received, ID:', response.data.analysisId);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || 'AI analysis failed';
    console.error('analyzeRepo failed:', msg);
    throw new Error(msg);
  }
};

export const getAnalysisById = async (id) => {
  try {
    const response = await api.get(`/history/${id}`);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || 'Analysis not found';
    throw new Error(msg);
  }
};

export const getRecentAnalyses = async () => {
  try {
    const response = await api.get('/history/recent');
    return response.data;
  } catch (error) {
    console.error('getRecentAnalyses failed:', error.message);
    return [];
  }
};

export const getPopularAnalyses = async () => {
  try {
    const response = await api.get('/history/popular');
    return response.data;
  } catch (error) {
    console.error('getPopularAnalyses failed:', error.message);
    return [];
  }
};

export const analyzeFromUrl = async (repoUrl) => {
  console.log('=== FULL ANALYSIS STARTED ===');
  console.log('URL:', repoUrl);

  const repoData = await fetchGithubData(repoUrl);
  console.log('Step 1 done: GitHub data fetched');

  const result = await analyzeRepo(repoData);
  console.log('Step 2 done: AI analysis complete');

  return result;
};

export const chatWithRepo = async (repoData, messages) => {
  try {
    const response = await api.post('/analyze/chat', { repoData, messages });
    return response.data.message;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || 'Failed to chat with AI';
    throw new Error(msg);
  }
};

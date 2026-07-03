export const errorHandler = (err, req, res, next) => {
  // Log complete error details to the backend terminal
  console.error('[Express Global Error]:', {
    message: err.message || err,
    status: err.response?.status || err.statusCode,
    data: err.response?.data || err.details,
    stack: err.stack
  });

  let statusCode = err.statusCode || err.response?.status || 500;
  let message = err.message || 'An unexpected internal server error occurred.';

  const messageLower = message.toLowerCase();

  // 1. Special handling for GitHub rate limits (403 Forbidden)
  if (statusCode === 403 || messageLower.includes('rate limit') || messageLower.includes('403')) {
    statusCode = 403;
    message = 'GitHub API rate limit exceeded. Please set up a GITHUB_TOKEN in your environment variables to increase request limits.';
  }
  // 2. Special handling for resources/repos not found (404)
  else if (statusCode === 404 || messageLower.includes('not found') || messageLower.includes('404')) {
    statusCode = 404;
    message = 'The requested GitHub repository or resource could not be found. Verify the URL or slug format.';
  }
  // 3. Special handling for OpenRouter/Gemini Flash AI service failures (502 Bad Gateway)
  else if (
    messageLower.includes('openrouter') || 
    messageLower.includes('gemini') || 
    messageLower.includes('ai analysis') ||
    messageLower.includes('api key')
  ) {
    statusCode = 502;
    message = 'AI Repository Analyzer was unable to generate a review. Verify that OPENROUTER_API_KEY is configured correctly.';
  }

  // Return the standardized JSON structure requested
  res.status(statusCode).json({
    error: message,
    code: statusCode
  });
};

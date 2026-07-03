import React from 'react';

function ErrorCard({ error, onRetry }) {
  let title = 'An Error Occurred';
  let subtitle = '';
  let iconClass = 'fa-solid fa-triangle-exclamation';
  let colorVar = 'var(--accent-orange)';

  const rawMessage = typeof error === 'string' ? error : error?.message || '';
  const errMessage = rawMessage.toLowerCase();
  const statusCode = error?.status || error?.statusCode;

  if (errMessage.includes('rate limit') || errMessage.includes('403') || statusCode === 403) {
    title = 'Rate Limit Exceeded';
    subtitle = 'GitHub API rate limit was reached. Set up a GITHUB_TOKEN in your environment variables to support up to 5,000 requests per hour.';
    iconClass = 'fa-solid fa-hourglass-end';
    colorVar = 'var(--accent-yellow)';
  } else if (errMessage.includes('not found') || errMessage.includes('404') || statusCode === 404) {
    title = 'Repository Not Found';
    subtitle = 'We could not find that repository on GitHub. Please check the spelling, slug format, or verify if it is public.';
    iconClass = 'fa-solid fa-folder-open';
    colorVar = 'var(--accent-blue)';
  } else if (errMessage.includes('network') || errMessage.includes('refused') || errMessage.includes('connrefused')) {
    title = 'Network Connection Error';
    subtitle = 'Unable to connect to the backend API server. Make sure the Node.js Express server is started and running on port 5000.';
    iconClass = 'fa-solid fa-wifi';
    colorVar = 'var(--accent-orange)';
  } else if (errMessage.includes('ai') || errMessage.includes('openrouter') || errMessage.includes('gemini') || errMessage.includes('openai')) {
    title = 'AI Generation Failed';
    subtitle = 'OpenRouter or Gemini Flash encountered an issue compiling the executive summary. Verify your OPENROUTER_API_KEY settings.';
    iconClass = 'fa-solid fa-robot';
    colorVar = 'var(--accent-purple)';
  } else {
    subtitle = rawMessage || 'Something went wrong while executing the requested action.';
  }

  return (
    <div className="error-card-wrapper animate-fade">
      <div className="error-box card">
        <div className="error-icon" style={{ color: colorVar, backgroundColor: `rgba(from ${colorVar} r g b / 0.1)` }}>
          <i className={iconClass}></i>
        </div>
        
        <h3 className="error-title">{title}</h3>
        <p className="error-subtitle">{subtitle}</p>

        {rawMessage && (
          <div className="error-details">
            <strong>Error Details:</strong>
            <p>{rawMessage}</p>
          </div>
        )}

        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary error-retry-btn">
            <i className="fa-solid fa-rotate-right"></i> Try Again
          </button>
        )}
      </div>

      <style>{`
        .error-card-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
        }

        .error-box {
          max-width: 460px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 30px;
          border-radius: var(--radius-lg);
          border-color: var(--border);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .error-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-bottom: 24px;
        }

        .error-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .error-subtitle {
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .error-details {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px;
          margin-bottom: 24px;
          text-align: left;
          font-size: 0.8rem;
          color: var(--text-secondary);
          word-break: break-word;
        }

        .error-details strong {
          color: var(--text-primary);
          display: block;
          margin-bottom: 4px;
        }

        .error-details p {
          margin: 0;
          font-family: monospace;
        }

        .error-retry-btn {
          font-size: 0.95rem;
          padding: 10px 24px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}

export default ErrorCard;

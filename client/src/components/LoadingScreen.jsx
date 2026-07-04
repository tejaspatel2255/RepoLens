import React from 'react';

function LoadingScreen({ steps = [], currentStep = 0 }) {
  // Default steps fallback if not provided
  const stepsList = steps.length > 0 ? steps : [
    "🔍 Fetching repository info",
    "📁 Reading codebase structure",
    "🤖 AI is analyzing...",
    "💾 Saving your report",
    "✨ Almost ready!"
  ];

  const progressPercentage = ((currentStep + 1) / stepsList.length) * 100;

  return (
    <div className="loading-overlay">
      <div className="loading-box card animate-fade">
        <div className="logo-pulse-wrapper">
          <div className="logo-pulse-avatar">
            <img src="/logo.svg" alt="RepoLens Logo" className="loading-logo-img" />
          </div>
          <div className="pulse-ripple-1"></div>
          <div className="pulse-ripple-2"></div>
        </div>

        <h3 className="loading-card-title">Analyzing Repository</h3>
        <p className="loading-subtitle">Deconstructs files and initiates AI overview...</p>

        <div className="loading-checklist">
          {stepsList.map((stepText, idx) => {
            let status = 'pending';
            let icon = <i className="fa-regular fa-circle step-icon-pending"></i>;

            if (idx < currentStep) {
              status = 'done';
              icon = <i className="fa-solid fa-circle-check step-icon-done"></i>;
            } else if (idx === currentStep) {
              status = 'active';
              icon = <i className="fa-solid fa-circle-notch fa-spin step-icon-active"></i>;
            }

            return (
              <div key={idx} className={`checklist-item status-${status}`}>
                {icon}
                <span className="checklist-text">{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar at the bottom */}
        <div className="loading-progress-container">
          <div 
            className="loading-progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background: rgba(13, 17, 23, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .loading-box {
          max-width: 480px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 30px;
          border-radius: var(--radius-lg);
          border-color: var(--border);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .logo-pulse-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-pulse-avatar {
          width: 60px;
          height: 60px;
          background-color: var(--bg-secondary);
          border: 2px solid var(--border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          padding: 10px;
        }

        .loading-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(56, 189, 248, 0.2));
        }

        .pulse-ripple-1, .pulse-ripple-2 {
          position: absolute;
          border: 1.5px solid var(--accent-blue);
          border-radius: 50%;
          inset: 0;
          opacity: 0;
          z-index: 1;
          animation: ripple 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .pulse-ripple-2 {
          animation-delay: 1s;
        }

        @keyframes ripple {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .loading-card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .loading-subtitle {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-bottom: 30px;
        }

        .loading-checklist {
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 30px;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }

        .checklist-text {
          font-weight: 500;
        }

        /* Color configurations based on status */
        .status-pending {
          color: var(--text-secondary);
          opacity: 0.5;
        }
        .step-icon-pending {
          color: var(--text-secondary);
        }

        .status-active {
          color: var(--accent-blue);
          font-weight: 700;
        }
        .step-icon-active {
          color: var(--accent-blue);
        }

        .status-done {
          color: var(--accent-green);
        }
        .step-icon-done {
          color: var(--accent-green);
        }

        /* Progress track */
        .loading-progress-container {
          width: 100%;
          height: 6px;
          background-color: var(--bg-secondary);
          border-radius: 10px;
          overflow: hidden;
        }

        .loading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
          border-radius: 10px;
          transition: width 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;

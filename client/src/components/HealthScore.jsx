import React from 'react';

function HealthScore({ healthScore }) {
  if (!healthScore) return null;

  const {
    hasReadme,
    hasTests,
    hasCICD,
    hasDocker,
    hasLicense,
    recentlyUpdated,
    score,
    rating
  } = healthScore;

  // Extract numeric score out of "X/6" or default to 0
  const scoreNum = score ? parseInt(score.split('/')[0]) : 0;
  const maxScore = 6;
  const percentage = (scoreNum / maxScore) * 100;
  
  // Calculate SVG circle properties
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Get color for rating
  const getRatingColor = (rat) => {
    switch (rat?.toLowerCase()) {
      case 'excellent': return '#2ea043';
      case 'good': return '#e3b341';
      case 'needs work': return '#f78166';
      default: return '#8b949e';
    }
  };

  const ringColor = getRatingColor(rating);

  const indicators = [
    { label: 'Has README', value: hasReadme, emoji: '📄' },
    { label: 'Has Tests', value: hasTests, emoji: '🧪' },
    { label: 'Has CI/CD', value: hasCICD, emoji: '⚙️' },
    { label: 'Has Docker', value: hasDocker, emoji: '🐳' },
    { label: 'Has License', value: hasLicense, emoji: '⚖️' },
    { label: 'Recently Updated', value: recentlyUpdated, emoji: '🕒' }
  ];

  return (
    <div className="health-score-card card">
      <h3 className="section-title-clean">🏥 Project Health Score</h3>

      <div className="health-content">
        {/* Big Ring Score Display */}
        <div className="ring-container">
          <svg className="progress-ring" width="100" height="100">
            <circle
              className="progress-ring-bg"
              stroke="#21262d"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className="progress-ring-fill"
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <div className="score-text-overlay">
            <span className="score-num">{score || '0/6'}</span>
            <span className="score-rating-label" style={{ color: ringColor }}>{rating || 'Unknown'}</span>
          </div>
        </div>

        {/* Indicators List */}
        <div className="indicators-grid">
          {indicators.map((ind, idx) => (
            <div key={idx} className={`indicator-pill ${ind.value ? 'pill-pass' : 'pill-fail'}`}>
              <span className="ind-icon">{ind.value ? '✅' : '❌'}</span>
              <span className="ind-emoji">{ind.emoji}</span>
              <span className="ind-label">{ind.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .health-score-card {
          background-color: var(--bg-card);
          padding: 24px;
        }

        .health-content {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-top: 16px;
        }

        .ring-container {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }

        .progress-ring {
          transform: rotate(-90deg);
        }

        .progress-ring-fill {
          transition: stroke-dashoffset 0.35s;
          transform-origin: 50% 50%;
        }

        .score-text-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .score-num {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .score-rating-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .indicators-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          flex-grow: 1;
        }

        .indicator-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid transparent;
        }

        .pill-pass {
          background-color: rgba(46, 160, 67, 0.08);
          border-color: rgba(46, 160, 67, 0.2);
          color: var(--text-primary);
        }

        .pill-fail {
          background-color: rgba(247, 129, 102, 0.08);
          border-color: rgba(247, 129, 102, 0.2);
          color: var(--text-secondary);
        }

        .ind-icon {
          font-size: 0.85rem;
        }

        .ind-emoji {
          font-size: 1.05rem;
        }

        .ind-label {
          font-size: 0.85rem;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .health-content {
            flex-direction: column;
            gap: 24px;
            align-items: center;
          }
          .indicators-grid {
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .indicators-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default HealthScore;

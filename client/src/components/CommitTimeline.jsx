import React from 'react';

// Format date into a relative string
function getRelativeTime(dateString) {
  if (!dateString) return 'some time ago';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  if (isNaN(diffMs)) return 'recently';

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    if (diffMins <= 0) return 'just now';
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Truncate text helper
function truncateText(str, max = 80) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

function CommitTimeline({ commits = [] }) {
  if (!commits || commits.length === 0) return null;

  // Build coordinate points for the 800x100 Sparkline
  const points = commits.map((c, idx) => {
    // Distribute X coordinates evenly from 20 to 780
    const x = (idx / Math.max(commits.length - 1, 1)) * 760 + 20;
    
    // Generate a deterministic Y coordinate based on SHA hash values
    const charCodeSum = c.sha.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const y = (charCodeSum % 60) + 20; // values between 20 and 80
    
    return { x, y };
  });

  // Assemble path string for SVG
  const pathD = points.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="commit-timeline-card card animate-fade">
      <h3 className="timeline-heading">Recent Activity</h3>

      {/* SVG Sparkline */}
      <div className="sparkline-container">
        <svg viewBox="0 0 800 100" className="sparkline-svg" width="100%" height="100">
          <defs>
            <linearGradient id="sparkline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-blue)" />
              <stop offset="50%" stopColor="var(--accent-purple)" />
              <stop offset="100%" stopColor="var(--accent-orange)" />
            </linearGradient>
          </defs>

          {/* Sparkline path */}
          {points.length > 1 && (
            <path 
              d={pathD} 
              fill="none" 
              stroke="url(#sparkline-grad)" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots on nodes */}
          {points.map((p, idx) => {
            // Colors from blue to purple to orange based on recency (index)
            const pct = idx / Math.max(points.length - 1, 1);
            let color = 'var(--accent-blue)';
            if (pct > 0.4 && pct <= 0.8) color = 'var(--accent-purple)';
            else if (pct > 0.8) color = 'var(--accent-orange)';

            return (
              <circle 
                key={idx} 
                cx={p.x} 
                cy={p.y} 
                r="5" 
                fill={color} 
                stroke="var(--bg-card)" 
                strokeWidth="2.5"
                className="sparkline-dot"
              >
                <title>{commits[idx].message}</title>
              </circle>
            );
          })}
        </svg>
      </div>

      {/* Commits list */}
      <div className="commits-list">
        {commits.map((c, idx) => (
          <div key={idx} className="commit-row">
            <span className="commit-meta-time">
              {getRelativeTime(c.date)}
            </span>
            <a 
              href={c.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="commit-sha-link"
            >
              {c.sha}
            </a>
            <span className="commit-author-tag">{c.author}</span>
            <span className="commit-divider">—</span>
            <span className="commit-msg-text" title={c.message}>
              {truncateText(c.message, 80)}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .commit-timeline-card {
          background-color: var(--bg-card);
          padding: 24px;
        }

        .timeline-heading {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .sparkline-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px 8px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .sparkline-svg {
          display: block;
          overflow: visible;
        }

        .sparkline-dot {
          cursor: pointer;
          transition: r 0.2s ease;
        }
        .sparkline-dot:hover {
          r: 7.5;
        }

        /* Commits list styling */
        .commits-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .commit-row {
          display: flex;
          align-items: center;
          font-size: 0.88rem;
          line-height: 1.4;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-secondary);
          border: 1px solid transparent;
          transition: border-color 0.2s;
          flex-wrap: wrap;
          gap: 8px;
        }
        .commit-row:hover {
          border-color: var(--border);
        }

        .commit-meta-time {
          color: var(--text-secondary);
          font-size: 0.8rem;
          min-width: 90px;
          font-weight: 500;
        }

        .commit-sha-link {
          font-family: monospace;
          color: var(--accent-blue);
          text-decoration: none;
          background-color: rgba(88, 166, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.8rem;
          transition: background-color 0.2s;
        }
        .commit-sha-link:hover {
          background-color: rgba(88, 166, 255, 0.2);
        }

        .commit-author-tag {
          font-weight: 700;
          color: var(--text-primary);
        }

        .commit-divider {
          color: var(--border);
        }

        .commit-msg-text {
          color: var(--text-secondary);
          flex: 1;
          min-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .commit-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 12px;
          }
          .commit-meta-time {
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}

export default CommitTimeline;

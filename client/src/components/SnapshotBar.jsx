import React from 'react';

// Format numbers (e.g. 52341 -> 52.3K)
function formatNum(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

// Format byte size (e.g. 4022KB -> 3.9 MB)
function formatSize(kb) {
  if (!kb) return '0 KB';
  if (kb >= 1024) {
    return (kb / 1024).toFixed(1).replace(/\.0$/, '') + ' MB';
  }
  return kb.toLocaleString() + ' KB';
}

// Format date (e.g. ISO string -> Nov 20, 2023)
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function SnapshotBar({ info }) {
  if (!info) return null;

  const stats = [
    {
      label: 'Stars',
      value: formatNum(info.stars),
      icon: 'fa-solid fa-star',
      colorClass: 'color-yellow'
    },
    {
      label: 'Forks',
      value: formatNum(info.forks),
      icon: 'fa-solid fa-code-fork',
      colorClass: 'color-blue'
    },
    {
      label: 'Watchers',
      value: formatNum(info.watchers),
      icon: 'fa-solid fa-eye',
      colorClass: 'color-purple'
    },
    {
      label: 'Open Issues',
      value: formatNum(info.openIssues),
      icon: 'fa-solid fa-circle-exclamation',
      colorClass: 'color-orange'
    },
    {
      label: 'Size',
      value: formatSize(info.size),
      icon: 'fa-solid fa-database',
      colorClass: 'color-green'
    },
    {
      label: 'Created',
      value: formatDate(info.createdAt),
      icon: 'fa-solid fa-calendar-plus',
      colorClass: 'color-blue-light'
    },
    {
      label: 'Last Push',
      value: formatDate(info.pushedAt),
      icon: 'fa-solid fa-clock-rotate-left',
      colorClass: 'color-purple-light'
    }
  ];

  return (
    <div className="snapshot-bar-wrapper">
      <div className="snapshot-scroll-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="snapshot-card card">
            <div className={`snapshot-icon-box ${stat.colorClass}`}>
              <i className={stat.icon}></i>
            </div>
            <div className="snapshot-info">
              <span className="snapshot-value">{stat.value}</span>
              <span className="snapshot-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .snapshot-bar-wrapper {
          width: 100%;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .snapshot-scroll-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 8px 4px 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .snapshot-card {
          flex: 0 0 180px;
          scroll-snap-align: start;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background-color: var(--bg-card);
        }
        .snapshot-card:hover {
          border-color: var(--text-secondary);
        }

        .snapshot-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        /* Color configurations */
        .color-yellow {
          background-color: rgba(227, 179, 65, 0.1);
          color: var(--accent-yellow);
        }
        .color-blue {
          background-color: rgba(88, 166, 255, 0.1);
          color: var(--accent-blue);
        }
        .color-purple {
          background-color: rgba(188, 140, 255, 0.1);
          color: var(--accent-purple);
        }
        .color-orange {
          background-color: rgba(247, 129, 102, 0.1);
          color: var(--accent-orange);
        }
        .color-green {
          background-color: rgba(63, 185, 80, 0.1);
          color: var(--accent-green);
        }
        .color-blue-light {
          background-color: rgba(88, 166, 255, 0.08);
          color: #79b8ff;
        }
        .color-purple-light {
          background-color: rgba(188, 140, 255, 0.08);
          color: #c8a2ff;
        }

        .snapshot-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .snapshot-value {
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .snapshot-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default SnapshotBar;

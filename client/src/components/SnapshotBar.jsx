import React from 'react';

// Format numbers (e.g. 52341 -> 52.3K)
function formatNum(num) {
  if (num === null || num === undefined) return '0';
  const n = Number(num);
  if (isNaN(n)) return num.toString();
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return n.toString();
}

// Format byte size (e.g. 4022KB -> 3.9 MB)
function formatSize(kb) {
  if (kb === null || kb === undefined || kb === 0 || kb === '0') return 'N/A';
  const val = Number(kb);
  if (isNaN(val) || val <= 0) return 'N/A';
  if (val >= 1024) {
    return (val / 1024).toFixed(1).replace(/\.0$/, '') + ' MB';
  }
  return val.toLocaleString() + ' KB';
}

// Format date (e.g. ISO string -> Nov 20, 2023)
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Format created date (e.g. ISO string -> Jan 2020)
function formatCreatedDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
}

function SnapshotBar({ info }) {
  if (!info) return null;

  const stats = [
    {
      label: 'Stars',
      value: formatNum(info.stars),
      icon: 'fa-solid fa-star',
      colorClass: 'color-yellow',
      cardClass: 'stars-card'
    },
    {
      label: 'Forks',
      value: formatNum(info.forks),
      icon: 'fa-solid fa-code-fork',
      colorClass: 'color-blue',
      cardClass: 'forks-card'
    },
    {
      label: 'Watchers',
      value: formatNum(info.watchers),
      icon: 'fa-solid fa-eye',
      colorClass: 'color-purple',
      cardClass: 'watchers-card'
    },
    {
      label: 'Open Issues',
      value: formatNum(info.openIssues),
      icon: 'fa-solid fa-circle-exclamation',
      colorClass: 'color-orange',
      cardClass: 'issues-card'
    },
    {
      label: 'Size',
      value: formatSize(info.size),
      icon: 'fa-solid fa-database',
      colorClass: 'color-green',
      cardClass: 'size-card'
    },
    {
      label: 'Created',
      value: formatCreatedDate(info.createdAt),
      icon: 'fa-solid fa-calendar-plus',
      colorClass: 'color-blue-light',
      cardClass: 'created-card'
    },
    {
      label: 'Last Push',
      value: formatDate(info.pushedAt),
      icon: 'fa-solid fa-clock-rotate-left',
      colorClass: 'color-purple-light',
      cardClass: 'pushed-card'
    }
  ];

  return (
    <div className="snapshot-bar-wrapper">
      <div className="snapshot-scroll-row">
        {stats.map((stat, idx) => (
          <div key={idx} className={`snapshot-card card ${stat.cardClass}`}>
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
          flex: 0 0 190px;
          scroll-snap-align: start;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background-color: var(--bg-card);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          border-radius: var(--radius-md);
        }

        /* Specific gradient backgrounds */
        .snapshot-card.stars-card {
          background: linear-gradient(135deg, rgba(227, 179, 65, 0.12), rgba(227, 179, 65, 0.02) 80%);
          border-color: rgba(227, 179, 65, 0.15);
        }
        .snapshot-card.forks-card {
          background: linear-gradient(135deg, rgba(88, 166, 255, 0.12), rgba(88, 166, 255, 0.02) 80%);
          border-color: rgba(88, 166, 255, 0.15);
        }
        .snapshot-card.watchers-card {
          background: linear-gradient(135deg, rgba(188, 140, 255, 0.12), rgba(188, 140, 255, 0.02) 80%);
          border-color: rgba(188, 140, 255, 0.15);
        }
        .snapshot-card.issues-card {
          background: linear-gradient(135deg, rgba(247, 129, 102, 0.08), rgba(247, 129, 102, 0.02) 80%);
          border-color: rgba(247, 129, 102, 0.1);
        }
        .snapshot-card.size-card {
          background: linear-gradient(135deg, rgba(63, 185, 80, 0.08), rgba(63, 185, 80, 0.02) 80%);
          border-color: rgba(63, 185, 80, 0.1);
        }
        .snapshot-card.created-card {
          background: linear-gradient(135deg, rgba(88, 166, 255, 0.08), rgba(88, 166, 255, 0.02) 80%);
          border-color: rgba(88, 166, 255, 0.1);
        }
        .snapshot-card.pushed-card {
          background: linear-gradient(135deg, rgba(188, 140, 255, 0.08), rgba(188, 140, 255, 0.02) 80%);
          border-color: rgba(188, 140, 255, 0.1);
        }

        /* Subtle animated glow on hover */
        .snapshot-card:hover {
          transform: translateY(-3px);
        }
        .snapshot-card.stars-card:hover {
          box-shadow: 0 8px 24px rgba(227, 179, 65, 0.2);
          border-color: rgba(227, 179, 65, 0.4);
        }
        .snapshot-card.forks-card:hover {
          box-shadow: 0 8px 24px rgba(88, 166, 255, 0.2);
          border-color: rgba(88, 166, 255, 0.4);
        }
        .snapshot-card.watchers-card:hover {
          box-shadow: 0 8px 24px rgba(188, 140, 255, 0.2);
          border-color: rgba(188, 140, 255, 0.4);
        }
        .snapshot-card.issues-card:hover {
          box-shadow: 0 8px 24px rgba(247, 129, 102, 0.15);
          border-color: rgba(247, 129, 102, 0.3);
        }
        .snapshot-card.size-card:hover {
          box-shadow: 0 8px 24px rgba(63, 185, 80, 0.15);
          border-color: rgba(63, 185, 80, 0.3);
        }
        .snapshot-card.created-card:hover {
          box-shadow: 0 8px 24px rgba(88, 166, 255, 0.15);
          border-color: rgba(88, 166, 255, 0.3);
        }
        .snapshot-card.pushed-card:hover {
          box-shadow: 0 8px 24px rgba(188, 140, 255, 0.15);
          border-color: rgba(188, 140, 255, 0.3);
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
          font-weight: 800;
          font-size: 1.4rem;
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

import React from 'react';

function Contributors({ contributors = [] }) {
  if (!contributors || contributors.length === 0) return null;

  return (
    <div className="contributors-card glass-card">
      <div className="card-header">
        <i className="fa-solid fa-users-gears users-icon"></i>
        <h3>The People Behind It</h3>
      </div>

      <div className="contributors-grid">
        {contributors.map((contrib, index) => (
          <a 
            key={index} 
            href={contrib.profileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contributor-item"
          >
            <div className="avatar-wrapper">
              <img 
                src={contrib.avatarUrl} 
                alt={contrib.login} 
                className="contributor-avatar" 
                loading="lazy"
              />
              <div className="contrib-badge">
                {contrib.contributions}
              </div>
            </div>
            <span className="contributor-name">{contrib.login}</span>
            <span className="contributor-subtext">contributions</span>
          </a>
        ))}
      </div>

      <style>{`
        .contributors-card {
          padding: 24px;
          height: 100%;
        }

        .users-icon {
          color: var(--accent-purple);
          font-size: 1.25rem;
          margin-right: 8px;
        }

        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .contributors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 16px;
          margin-top: 10px;
        }

        .contributor-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          padding: 16px 8px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.25s ease, 
                      box-shadow 0.25s ease;
        }
        
        /* Hover scale up and glow */
        .contributor-item:hover {
          transform: scale(1.05);
          border-color: var(--accent-purple);
          box-shadow: 0 0 15px rgba(188, 140, 255, 0.25);
        }

        .avatar-wrapper {
          position: relative;
          width: 56px;
          height: 56px;
        }

        .contributor-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid var(--border);
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: border-color 0.2s ease;
        }
        .contributor-item:hover .contributor-avatar {
          border-color: var(--accent-purple);
        }

        .contrib-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%);
          color: var(--bg-primary);
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 10px;
          border: 1px solid var(--bg-card);
        }

        .contributor-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .contributor-subtext {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default Contributors;

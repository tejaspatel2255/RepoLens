import React from 'react';
import { Link } from 'react-router-dom';

function RecentRepos({ repos = [], loading }) {
  if (loading) {
    return (
      <div className="recent-section">
        <h2 className="recent-title"><i className="fa-solid fa-clock-rotate-left"></i> Recently Scanned</h2>
        <div className="recent-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="recent-card-skeleton glass-card">
              <div className="skeleton-line-title"></div>
              <div className="skeleton-line-desc"></div>
              <div className="skeleton-line-footer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return null; // Don't show if empty history
  }

  return (
    <div className="recent-section">
      <h2 className="recent-title">
        <i className="fa-solid fa-clock-rotate-left"></i> Recently Scanned
      </h2>
      
      <div className="recent-grid">
        {repos.map((repo) => (
          <Link 
            key={repo.id} 
            to={`/report/${repo.id}`} 
            className="recent-card glass-card"
          >
            <div className="recent-card-header">
              <div className="recent-avatar">
                <i className="fa-brands fa-github"></i>
              </div>
              <div className="recent-info">
                <span className="recent-owner">{repo.owner}</span>
                <span className="recent-repo">{repo.repo_name}</span>
              </div>
            </div>
            
            <p className="recent-desc">{repo.description || 'No description provided.'}</p>
            
            <div className="recent-footer">
              {repo.primary_language && (
                <span className="recent-lang">
                  <i className="fa-solid fa-circle lang-dot"></i> {repo.primary_language}
                </span>
              )}
              {repo.stars > 0 && (
                <span className="recent-stars">
                  <i className="fa-solid fa-star"></i> {repo.stars.toLocaleString()}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .recent-section {
          padding: 40px 24px 80px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .recent-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .recent-title i {
          color: hsl(var(--accent));
        }

        .recent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .recent-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-radius: var(--radius-md);
        }
        .recent-card:hover {
          transform: translateY(-4px);
          border-color: hsl(var(--primary) / 0.3);
        }

        .recent-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .recent-avatar {
          width: 38px;
          height: 38px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: hsl(var(--text-secondary));
        }

        .recent-info {
          display: flex;
          flex-direction: column;
        }

        .recent-owner {
          font-size: 0.8rem;
          color: hsl(var(--text-muted));
          font-weight: 500;
        }

        .recent-repo {
          font-size: 1.1rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .recent-desc {
          font-size: 0.88rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .recent-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 12px;
          margin-top: 4px;
        }

        .recent-lang {
          color: hsl(var(--text-secondary));
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .lang-dot {
          font-size: 0.5rem;
          color: hsl(var(--primary));
        }

        .recent-stars {
          color: #eab308;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Skeleton Loading styles */
        .recent-card-skeleton {
          padding: 24px;
          height: 170px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-line-title, .skeleton-line-desc, .skeleton-line-footer {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 75%);
          background-size: 200% 100%;
          animation: loadingShimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-line-title {
          height: 24px;
          width: 60%;
        }

        .skeleton-line-desc {
          height: 35px;
          width: 100%;
        }

        .skeleton-line-footer {
          height: 16px;
          width: 40%;
          margin-top: auto;
        }

        @keyframes loadingShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export default RecentRepos;

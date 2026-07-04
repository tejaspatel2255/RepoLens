import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const userJson = localStorage.getItem('repolens_user');
  let user = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (e) {
      console.error(e);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('repolens_token');
    localStorage.removeItem('repolens_user');
    window.location.reload();
  };

  return (
    <nav className="navbar-fixed">
      <div className="navbar-wrapper">
        <Link to="/" className="navbar-logo-group">
          <div className="navbar-brand">
            <img src="/logo.svg" alt="RepoLens Logo" className="navbar-logo-img" />
            <span className="navbar-logo">RepoLens</span>
          </div>
          <span className="navbar-subtitle">GitHub for Everyone</span>
        </Link>
        
        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user-control">
              <span className="navbar-user-greet">
                <i className="fa-solid fa-user-check"></i> Hi, {user.name}
              </span>
              <button onClick={handleLogout} className="navbar-logout-btn">
                <i className="fa-solid fa-right-from-bracket"></i> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn">
              Sign In
            </Link>
          )}

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="navbar-github-link"
            title="GitHub"
          >
            <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </div>

      <style>{`
        .navbar-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(13, 17, 23, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
          height: 64px;
          display: flex;
          align-items: center;
        }

        .navbar-wrapper {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo-group {
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .navbar-logo-img {
          width: 28px;
          height: 28px;
          filter: drop-shadow(0 2px 8px rgba(56, 189, 248, 0.3));
        }

        .navbar-logo {
          background: linear-gradient(90deg, #38bdf8 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          font-size: 1.35rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .navbar-subtitle {
          color: var(--text-secondary);
          font-size: 0.72rem;
          font-weight: 500;
          margin-top: 2px;
          padding-left: 38px;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .navbar-user-control {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navbar-user-greet {
          font-size: 0.88rem;
          color: var(--text-primary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .navbar-logout-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .navbar-logout-btn:hover {
          border-color: var(--accent-orange);
          color: var(--accent-orange);
          background: rgba(247, 129, 102, 0.05);
        }

        .navbar-login-btn {
          color: var(--accent-blue);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          border: 1px solid var(--accent-blue);
          padding: 6px 16px;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }

        .navbar-login-btn:hover {
          background: rgba(88, 166, 255, 0.1);
        }

        .navbar-github-link {
          color: var(--text-secondary);
          font-size: 1.5rem;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
        }
        .navbar-github-link:hover {
          color: var(--text-primary);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;

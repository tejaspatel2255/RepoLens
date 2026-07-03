import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar-fixed">
      <div className="navbar-wrapper">
        <Link to="/" className="navbar-logo-group">
          <span className="navbar-logo">🔍 RepoLens</span>
          <span className="navbar-subtitle">GitHub for Everyone</span>
        </Link>
        
        <div className="navbar-actions">
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

        .navbar-logo {
          color: var(--text-primary);
          font-weight: 800;
          font-size: 1.3rem;
          line-height: 1.2;
        }

        .navbar-subtitle {
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
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

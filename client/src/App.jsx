import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';
import Auth from './pages/Auth.jsx';

/**
 * 404 - Page Not Found Fallback component
 */
function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-box card animate-fade">
        <div className="notfound-icon">🛸</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-desc">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>
        <Link to="/" className="btn btn-primary notfound-home-btn">
          <i className="fa-solid fa-house"></i> Go Back Home
        </Link>
      </div>

      <style>{`
        .notfound-container {
          min-height: calc(100vh - 64px);
          margin-top: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .notfound-box {
          max-width: 440px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 48px 32px;
          border-radius: var(--radius-lg);
          border-color: var(--border);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .notfound-icon {
          font-size: 3rem;
          margin-bottom: 24px;
          line-height: 1;
        }

        .notfound-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .notfound-desc {
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--text-secondary);
          margin-bottom: 30px;
        }

        .notfound-home-btn {
          font-size: 0.95rem;
          padding: 10px 24px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('repolens_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/report/:id" element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

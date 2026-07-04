import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { loginUser, registerUser } from '../services/api.js';

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after logging in successfully
  const from = location.state?.from?.pathname || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
        setSuccess('Welcome back! Logging you in...');
        setTimeout(() => {
          navigate(from, { replace: true });
          window.location.reload();
        }, 1000);
      } else {
        await registerUser(email, password, name);
        setSuccess('Registration successful! Logging you in...');
        setTimeout(() => {
          navigate(from, { replace: true });
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-page-container">
      <Navbar />

      <div className="auth-card-wrapper">
        <div className="auth-card card glassmorphic">
          <div className="auth-logo-area">
            <span className="auth-logo-icon">🔍</span>
            <h2 className="auth-logo-title">RepoLens</h2>
          </div>

          <div className="auth-tabs">
            <button 
              type="button" 
              className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button 
              type="button" 
              className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h3 className="auth-form-title">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="auth-form-subtitle">
              {isLogin 
                ? 'Sign in to analyze repositories and track your session'
                : 'Join RepoLens to start index audits and codebase chats'
              }
            </p>

            {error && <div className="auth-error-banner"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}
            {success && <div className="auth-success-banner"><i className="fa-solid fa-circle-check"></i> {success}</div>}

            {!isLogin && (
              <div className="auth-input-group">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <i className="fa-solid fa-user input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="auth-input" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="auth-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-lock input-icon"></i>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="auth-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Loading...</>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer-toggle">
            {isLogin ? (
              <p>Don't have an account? <span onClick={toggleMode}>Register now</span></p>
            ) : (
              <p>Already have an account? <span onClick={toggleMode}>Sign in</span></p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .auth-card-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .auth-card {
          max-width: 450px;
          width: 100%;
          padding: 40px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }

        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
        }

        .auth-logo-area {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .auth-logo-icon {
          font-size: 1.8rem;
        }

        .auth-logo-title {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--accent-blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          margin-bottom: 30px;
        }

        .auth-tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 600;
          padding: 12px;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .auth-tab-btn:hover {
          color: var(--text-primary);
        }

        .auth-tab-btn.active {
          color: var(--accent-blue);
        }

        .auth-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--accent-blue);
        }

        .auth-form-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .auth-form-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.4;
        }

        .auth-input-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .auth-input {
          width: 100%;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 12px 14px 12px 42px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .auth-input:focus {
          border-color: var(--accent-blue);
          box-shadow: 0 0 10px rgba(88, 166, 255, 0.15);
        }

        .auth-submit-btn {
          width: 100%;
          padding: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .auth-error-banner {
          background-color: rgba(247, 129, 102, 0.1);
          border: 1px solid rgba(247, 129, 102, 0.25);
          color: var(--accent-orange);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 20px;
          line-height: 1.4;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .auth-success-banner {
          background-color: rgba(63, 185, 80, 0.1);
          border: 1px solid rgba(63, 185, 80, 0.25);
          color: var(--accent-green);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 20px;
          line-height: 1.4;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .auth-footer-toggle {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .auth-footer-toggle span {
          color: var(--accent-blue);
          cursor: pointer;
          font-weight: 600;
        }

        .auth-footer-toggle span:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default Auth;

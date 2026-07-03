import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Hero({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'popular'
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const canvasRef = useRef(null);

  // Canvas Starfield Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = [];
    const starsCount = 120;

    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.4 + 0.05
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(139, 148, 158, 0.4)';

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch recent and popular history on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const [recentRes, popularRes] = await Promise.all([
          axios.get('/api/history/recent'),
          axios.get('/api/history/popular')
        ]);
        setRecent(recentRes.data || []);
        setPopular(popularRes.data || []);
      } catch (err) {
        console.error('Failed to load analysis history:', err);
      } finally {
        setHistoryLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url);
  };

  const handleChipClick = (repoSlug) => {
    setUrl(`https://github.com/${repoSlug}`);
  };

  // Pre-fill input when clicking a history card
  const handleCardClick = (item) => {
    const fullUrl = item.repo_url || `https://github.com/${item.owner}/${item.repo_name}`;
    setUrl(fullUrl);
    
    // Smooth scroll to top search bar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentList = activeTab === 'recent' ? recent : popular;

  return (
    <section className="hero-viewport">
      <canvas ref={canvasRef} className="hero-canvas"></canvas>
      
      <div className="hero-container">
        <div className="hero-main">
          <h1 className="hero-headline animate-fade">
            Understand Any <span className="gradient-text">GitHub Repo</span>
          </h1>
          
          <p className="hero-subheadline animate-slide">
            Paste a link. Get a plain-English breakdown — no coding knowledge needed.
          </p>

          <form onSubmit={handleSubmit} className="hero-form animate-slide">
            <input 
              type="text" 
              className="hero-input-field" 
              placeholder="Paste GitHub URL or owner/repo slug..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn btn-primary hero-btn-submit"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Analyzing...
                </>
              ) : (
                <>
                  Analyze Repository <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="hero-chips animate-slide">
            <span className="chips-label">Try these:</span>
            <button onClick={() => handleChipClick('facebook/react')} className="chip">
              facebook/react
            </button>
            <button onClick={() => handleChipClick('microsoft/vscode')} className="chip">
              microsoft/vscode
            </button>
            <button onClick={() => handleChipClick('vercel/next.js')} className="chip">
              vercel/next.js
            </button>
          </div>
        </div>

        {/* Recent & Popular analyses tabs section */}
        <div className="recent-analyses-block">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              <i className="fa-solid fa-clock-rotate-left"></i> Recent Analyses
            </button>
            <button 
              className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveTab('popular')}
            >
              <i className="fa-solid fa-fire"></i> Popular Repos
            </button>
          </div>
          
          {historyLoading ? (
            <div className="recent-loader">
              <i className="fa-solid fa-circle-notch fa-spin"></i> Loading history...
            </div>
          ) : currentList.length === 0 ? (
            <p className="recent-empty">No analyses found in this section.</p>
          ) : (
            <div className="recent-cards-scroll">
              {currentList.map((item) => (
                <div 
                  key={item.id} 
                  className="recent-history-card"
                  onClick={() => handleCardClick(item)}
                  title="Click to fill input"
                >
                  <div className="card-header-mini">
                    <span className="card-repo-slug">{item.owner}/{item.repo_name}</span>
                    {item.primary_language && (
                      <span className="card-lang-badge">{item.primary_language}</span>
                    )}
                  </div>
                  <p className="card-repo-desc">{item.description || 'No description provided.'}</p>
                  <div className="card-footer-mini">
                    <span>⭐ {item.stars?.toLocaleString() || 0} stars</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hero-viewport {
          position: relative;
          min-height: calc(100vh - 64px);
          margin-top: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          z-index: 1;
          overflow: hidden;
        }

        .hero-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .hero-container {
          max-width: 800px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 60px;
        }

        .hero-main {
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-headline {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
          line-height: 1.15;
        }

        .gradient-text {
          background: linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subheadline {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .hero-form {
          display: flex;
          width: 100%;
          gap: 12px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 8px 8px 8px 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          margin-bottom: 24px;
          animation-delay: 0.1s;
        }
        .hero-form:focus-within {
          border-color: var(--accent-blue);
          animation: glowPulse 2s infinite;
        }

        .hero-input-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1.05rem;
        }
        .hero-input-field::placeholder {
          color: var(--text-secondary);
        }

        .hero-btn-submit {
          padding: 12px 24px;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
        }

        .hero-chips {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          animation-delay: 0.2s;
        }

        .chips-label {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Recent Analyses section & Tabs Header */
        .recent-analyses-block {
          width: 100%;
          border-top: 1px solid var(--border);
          padding-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tabs-header {
          display: flex;
          gap: 16px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: inherit;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          padding: 6px 12px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }
        .tab-btn:hover {
          color: var(--text-primary);
        }
        .tab-btn.active {
          color: var(--text-primary);
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -13px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-purple);
        }

        .recent-loader {
          color: var(--text-secondary);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .recent-empty {
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-align: left;
        }

        .recent-cards-scroll {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
          width: 100%;
        }

        .recent-history-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }
        .recent-history-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-blue);
          box-shadow: 0 4px 12px rgba(88, 166, 255, 0.1);
        }

        .card-header-mini {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .card-repo-slug {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .card-lang-badge {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .card-repo-desc {
          color: var(--text-secondary);
          font-size: 0.8rem;
          line-height: 1.4;
          height: 36px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .card-footer-mini {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.4rem;
          }
          .hero-subheadline {
            font-size: 1rem;
          }
          .hero-form {
            flex-direction: column;
            padding: 14px;
            gap: 14px;
          }
          .hero-input-field {
            text-align: center;
            width: 100%;
          }
          .hero-btn-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;

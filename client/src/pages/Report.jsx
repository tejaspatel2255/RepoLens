import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisById } from '../services/api.js';

import Navbar from '../components/Navbar.jsx';
import SnapshotBar from '../components/SnapshotBar.jsx';
import AISummary from '../components/AISummary.jsx';
import KeyFeatures from '../components/KeyFeatures.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import TechStack from '../components/TechStack.jsx';
import LanguageChart from '../components/LanguageChart.jsx';
import Contributors from '../components/Contributors.jsx';
import CommitTimeline from '../components/CommitTimeline.jsx';
import ErrorCard from '../components/ErrorCard.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

function Report() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch report details on mount
  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);
      try {
        const report = await getAnalysisById(id);
        if (!report) {
          throw new Error('Analysis not found.');
        }
        setData(report);
      } catch (err) {
        console.error(err);
        setError({
          message: err.response?.data?.error?.message || err.message || 'Failed to fetch the requested report.',
          status: err.response?.status || 500
        });
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  // Monitor scroll for Back-to-Top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Share link copied to clipboard!');
  };

  const handleCopyReport = () => {
    if (!data) return;
    const repoName = data.repo_name || '';
    const tagline = data.ai_analysis?.tagline || '';
    const stars = data.stars || 0;
    const forks = data.forks || 0;
    const projectType = data.ai_analysis?.projectType || data.ai_analysis?.project_type || 'Unknown';
    const maturityLevel = data.ai_analysis?.maturityLevel || data.ai_analysis?.maturity_level || 'Unknown';
    
    const whatItDoesText = data.ai_analysis?.whatItDoes || data.ai_analysis?.what_it_does || '';
    const firstParagraph = whatItDoesText.split('\n')[0] || '';
    
    const keyFeatures = data.ai_analysis?.keyFeatures || data.ai_analysis?.key_features || [];
    const featuresList = keyFeatures.map(f => '• ' + f).join('\n');

    const summaryText = `📊 RepoLens Report: ${repoName}
${tagline}
⭐ ${stars} stars | 🍴 ${forks} forks
🔧 ${projectType} | 📈 ${maturityLevel}

What it does: ${firstParagraph}

Key Features:
${featuresList}

View full report: ${window.location.href}
Analyze your own repo at: repolens.app`;

    navigator.clipboard.writeText(summaryText);
    alert('Report summary copied to clipboard!');
  };

  if (loading) {
    return <LoadingScreen steps={["🔍 Loading your saved report...", "📊 Formatting visualizations", "✨ Almost ready!"]} currentStep={1} />;
  }

  if (error) {
    return (
      <div className="report-error-wrapper">
        <Navbar />
        <ErrorCard error={error} onRetry={() => navigate('/')} />
      </div>
    );
  }

  if (!data) return null;

  // Adapter layers to align properties with component expectation inputs
  const infoObject = {
    name: data.repo_name,
    description: data.description,
    stars: data.stars,
    forks: data.forks,
    watchers: data.watchers,
    openIssues: data.openIssues || data.open_issues || 0,
    size: data.size || 0,
    createdAt: data.ai_analysis?.repo_created_at || data.created_at,
    homepage: data.ai_analysis?.homepage || null,
    owner: data.owner,
    repoUrl: data.repo_url,
    pushedAt: data.updated_at || data.pushed_at
  };

  const adaptedContributors = (data.contributors || []).map(c => ({
    login: c.login,
    avatarUrl: c.avatarUrl || c.avatar_url,
    contributions: c.contributions,
    profileUrl: c.profileUrl || c.html_url
  }));

  const adaptedCommits = (data.commits || []).map(c => ({
    sha: c.sha,
    message: c.message,
    author: c.author,
    date: c.date,
    url: c.url || c.html_url
  }));

  const adaptedLanguages = Array.isArray(data.languages) ? data.languages : Object.keys(data.languages || {}).map(k => ({
    name: k,
    percentage: data.languages[k].percentage || 0,
    color: data.languages[k].color || '#8b949e'
  }));

  return (
    <div className="report-layout-wrapper">
      {/* 1. Header Navbar */}
      <Navbar />

      <div className="report-main-content">
        {/* 2. Horizontal statistics snapshots */}
        <SnapshotBar info={infoObject} />

        {/* 3. AI Executive Summaries */}
        <AISummary aiAnalysis={data.ai_analysis} info={infoObject} />

        {/* 4. Who is it for text block section */}
        <div className="who-is-it-for-section card">
          <h3 className="section-title-clean">👥 Who is this project for?</h3>
          <p className="who-text">
            {data.ai_analysis?.whoIsItFor || 'This repository is designed for developers, testers, and engineering learners looking to inspect implementation parameters and dependencies.'}
          </p>
        </div>

        {/* 5. Features Grid */}
        <KeyFeatures features={data.ai_analysis?.keyFeatures || data.ai_analysis?.key_features} />

        {/* 6. How it works flow chart */}
        <HowItWorks steps={data.ai_analysis?.howItWorks || data.ai_analysis?.how_it_works} />

        {/* 7. Technology stack */}
        <TechStack techStack={data.ai_analysis?.techStack || data.ai_analysis?.tech_stack} />

        {/* 8. Split Grid for languages and contributors */}
        <div className="report-side-grid">
          <div className="grid-left-col">
            <LanguageChart languages={adaptedLanguages} />
          </div>
          <div className="grid-right-col">
            <Contributors contributors={adaptedContributors} />
          </div>
        </div>

        {/* 9. Commit activity timelines */}
        <CommitTimeline commits={adaptedCommits} />

        {/* 10. Summary Footers */}
        <footer className="report-footer card">
          <h3 className="footer-title">Share & Explore</h3>
          <div className="footer-actions">
            <a 
              href={data.repo_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary footer-btn"
            >
              <i className="fa-brands fa-github"></i> View on GitHub
            </a>
            
            <button onClick={handleCopyReport} className="btn footer-btn">
              <i className="fa-solid fa-copy"></i> Copy Report Summary
            </button>
            
            <button onClick={() => navigate('/')} className="btn footer-btn">
              <i className="fa-solid fa-arrow-left"></i> Analyze Another Repo
            </button>
          </div>

          <div className="share-url-container">
            <span className="share-url-label">Share Report Link:</span>
            <div className="share-url-box">
              <input 
                type="text" 
                readOnly 
                className="share-url-input"
                value={window.location.href} 
                onClick={(e) => e.target.select()} 
              />
              <button onClick={copyShareLink} className="btn btn-primary share-url-copy-btn">
                Copy URL
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        {showScrollTop && (
          <button 
            onClick={scrollToTop} 
            className="floating-btn btn-top" 
            title="Back to Top"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        )}
        
        <button 
          onClick={copyShareLink} 
          className="floating-btn btn-share" 
          title="Share Report"
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
      </div>

      <style>{`
        .report-layout-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
        }

        .report-main-content {
          max-width: 1200px;
          width: 100%;
          margin: 90px auto 80px;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .report-error-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Who is it for section style */
        .who-is-it-for-section {
          background-color: var(--bg-card);
        }

        .section-title-clean {
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .who-text {
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .report-side-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* Footer styling */
        .report-footer {
          display: flex;
          flex-direction: column;
          gap: 24px;
          background-color: var(--bg-card);
          padding: 30px;
        }

        .footer-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .footer-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-btn {
          font-size: 0.9rem;
          padding: 12px 20px;
        }

        .share-url-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }

        .share-url-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .share-url-box {
          display: flex;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 4px;
          max-width: 600px;
          width: 100%;
        }

        .share-url-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          padding: 0 12px;
          font-size: 0.9rem;
          font-family: inherit;
        }

        .share-url-copy-btn {
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        /* Floating buttons */
        .floating-actions {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 100;
        }

        .floating-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .btn-top {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        .btn-top:hover {
          background-color: var(--border);
          transform: translateY(-2px);
        }

        .btn-share {
          background-color: var(--accent-blue);
          color: var(--bg-primary);
          border-color: var(--accent-blue);
        }
        .btn-share:hover {
          background-color: #79b8ff;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .report-side-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .floating-actions {
            bottom: 20px;
            right: 20px;
          }
          .floating-btn {
            width: 44px;
            height: 44px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Report;

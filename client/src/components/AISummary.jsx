import React from 'react';

function AISummary({ aiAnalysis, info }) {
  if (!aiAnalysis) return null;

  // Split description text into paragraphs if it has newlines, or render as paragraphs
  const renderParagraphs = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((p, index) => (
      <p key={index} className="summary-paragraph">{p}</p>
    ));
  };

  const getProjectTypeBadge = (type) => {
    if (!type) return null;
    let bgClass = 'badge-gray';
    let emoji = '📦';
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('library')) {
      bgClass = 'badge-purple';
      emoji = '📚';
    } else if (typeLower.includes('web app') || typeLower.includes('website')) {
      bgClass = 'badge-blue';
      emoji = '🌐';
    } else if (typeLower.includes('cli tool') || typeLower.includes('command line') || typeLower.includes('cli')) {
      bgClass = 'badge-green';
      emoji = '⚡';
    } else if (typeLower.includes('api')) {
      bgClass = 'badge-orange';
      emoji = '🔌';
    } else if (typeLower.includes('mobile')) {
      bgClass = 'badge-purple';
      emoji = '📱';
    } else if (typeLower.includes('devops')) {
      bgClass = 'badge-blue';
      emoji = '⚙️';
    } else if (typeLower.includes('ai')) {
      bgClass = 'badge-orange';
      emoji = '🤖';
    }
    
    return (
      <span className={`summary-badge ${bgClass}`}>
        <span className="badge-emoji">{emoji}</span> {type}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return null;
    let bgClass = 'badge-gray';
    let emoji = '⚙️';
    const diffLower = difficulty.toLowerCase();
    
    if (diffLower === 'easy') {
      bgClass = 'badge-green';
      emoji = '✅';
    } else if (diffLower === 'moderate') {
      bgClass = 'badge-yellow';
      emoji = '⚠️';
    } else if (diffLower === 'technical') {
      bgClass = 'badge-red';
      emoji = '🚨';
    }
    
    return (
      <span className={`summary-badge ${bgClass}`}>
        <span className="badge-emoji">{emoji}</span> {difficulty}
      </span>
    );
  };

  const getMaturityBadge = (maturity) => {
    if (!maturity) return null;
    let bgClass = 'badge-gray';
    let emoji = '🌱';
    const matLower = maturity.toLowerCase();
    
    if (matLower === 'experimental') {
      bgClass = 'badge-orange';
      emoji = '🧪';
    } else if (matLower === 'active development') {
      bgClass = 'badge-blue';
      emoji = '🔨';
    } else if (matLower === 'stable') {
      bgClass = 'badge-green';
      emoji = '🚀';
    } else if (matLower === 'mature') {
      bgClass = 'badge-teal';
      emoji = '🌳';
    }
    
    return (
      <span className={`summary-badge ${bgClass}`}>
        <span className="badge-emoji">{emoji}</span> {maturity}
      </span>
    );
  };

  const getArchitectureBadge = (arch) => {
    if (!arch) return null;
    let bgClass = 'badge-gray';
    let emoji = '🏗️';
    let tooltipText = 'The structural architecture pattern chosen for organizing the code in this repository.';
    const archLower = arch.toLowerCase();
    
    if (archLower.includes('monolith')) {
      bgClass = 'badge-blue';
      emoji = '🏛️';
      tooltipText = 'Monolith: Single unified codebase containing all application logic and components.';
    } else if (archLower.includes('microservices') || archLower.includes('microservice')) {
      bgClass = 'badge-purple';
      emoji = '🧩';
      tooltipText = 'Microservices: Divided into independent, modular services communicating via APIs.';
    } else if (archLower.includes('serverless')) {
      bgClass = 'badge-orange';
      emoji = '☁️';
      tooltipText = 'Serverless: Built using cloud functions executed on-demand without server management.';
    } else if (archLower.includes('jamstack') || archLower.includes('jam')) {
      bgClass = 'badge-green';
      emoji = '🥞';
      tooltipText = 'JAMstack: Modern web stack based on client-side JavaScript, APIs, and pre-rendered Markup.';
    } else if (archLower.includes('mvc')) {
      bgClass = 'badge-teal';
      emoji = '📐';
      tooltipText = 'MVC: Separates application logic into Model (data), View (UI), and Controller (logic).';
    } else if (archLower.includes('spa') || archLower.includes('single page')) {
      bgClass = 'badge-blue';
      emoji = '📄';
      tooltipText = 'SPA: Single Page Application utilizing client-side routing and rendering.';
    } else if (archLower.includes('rest') || archLower.includes('api')) {
      bgClass = 'badge-orange';
      emoji = '🔌';
      tooltipText = 'REST API: Exposes HTTP endpoints conforming to architectural REST standards.';
    }
    
    return (
      <span 
        className={`summary-badge arch-tooltip-target ${bgClass}`}
        data-tooltip={tooltipText}
      >
        <span className="badge-emoji">{emoji}</span> {arch}
      </span>
    );
  };

  return (
    <div className="ai-summary-card card animate-fade">
      {/* 1. Header & Title details */}
      <div className="summary-header">
        {info?.owner && (
          <div className="repo-owner-label">by {info.owner}</div>
        )}
        <h1 className="repo-title-container">
          <i className="fa-brands fa-github repo-icon"></i>
          <span className="repo-title-text">{info?.name || 'Repository'}</span>
          {info?.stars !== undefined && info?.stars !== null && (
            <span className="star-badge-glow">⭐ {info.stars.toLocaleString()}</span>
          )}
        </h1>
        {aiAnalysis.tagline && (
          <h2 className="repo-tagline">{aiAnalysis.tagline}</h2>
        )}

        {/* Hero link buttons */}
        <div className="hero-buttons-row">
          {info?.repoUrl && (
            <a 
              href={info.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-github-hero"
            >
              🔗 View on GitHub
            </a>
          )}
          {info?.homepage && (
            <a 
              href={info.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-homepage-hero"
            >
              🌐 Visit Homepage
            </a>
          )}
        </div>
      </div>

      {/* 2. Badge Metadata Row */}
      <div className="badge-row">
        {getProjectTypeBadge(aiAnalysis.projectType)}
        {getArchitectureBadge(aiAnalysis.architectureType)}
        {getDifficultyBadge(aiAnalysis.difficultyToUse)}
        {getMaturityBadge(aiAnalysis.maturityLevel)}
      </div>

      {/* 3. SimilarTo Comparison Blockquote */}
      {aiAnalysis.similarTo && (
        <blockquote className="similar-quote">
          <span className="quote-mark">“</span>
          <p className="quote-content">{aiAnalysis.similarTo}</p>
        </blockquote>
      )}

      {/* 4. What does it do Section */}
      <div className="summary-section">
        <h3 className="section-title-clean">What does it do?</h3>
        <div className="summary-body">
          {renderParagraphs(aiAnalysis.whatItDoes)}
        </div>
      </div>

      {/* 5. Callouts for problem solved & real-world use case */}
      <div className="callouts-grid">
        {aiAnalysis.problemItSolves && (
          <div className="callout-box box-yellow">
            <div className="callout-header">
              <span className="callout-icon">💡</span>
              <h4 className="callout-title">Problem it solves</h4>
            </div>
            <p className="callout-text">{aiAnalysis.problemItSolves}</p>
          </div>
        )}

        {aiAnalysis.realWorldUseCase && (
          <div className="callout-box box-green">
            <div className="callout-header">
              <span className="callout-icon">🚀</span>
              <h4 className="callout-title">Real world example</h4>
            </div>
            <p className="callout-text">{aiAnalysis.realWorldUseCase}</p>
          </div>
        )}
      </div>

      {/* 6. Fun Fact at the bottom */}
      {aiAnalysis.funFact && (
        <div className="fun-fact-card">
          <span className="fun-fact-emoji">🎉</span>
          <div className="fun-fact-info">
            <h5 className="fun-fact-title">Fun Fact</h5>
            <p className="fun-fact-text">{aiAnalysis.funFact}</p>
          </div>
        </div>
      )}

      <style>{`
        .ai-summary-card {
          background-color: var(--bg-card);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .summary-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .repo-owner-label {
          font-size: 0.95rem;
          color: #8b949e;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .repo-title-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .repo-title-text {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(to right, #58a6ff, #bc8cff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .repo-icon {
          font-size: 2.2rem;
          color: var(--text-secondary);
        }

        .star-badge-glow {
          display: inline-flex;
          align-items: center;
          background: rgba(227, 179, 65, 0.15);
          color: #e3b341;
          border: 1px solid rgba(227, 179, 65, 0.3);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          -webkit-text-fill-color: initial;
          box-shadow: 0 0 12px rgba(227, 179, 65, 0.3);
          animation: star-pulse 2s infinite ease-in-out;
        }

        @keyframes star-pulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(227, 179, 65, 0.2);
          }
          50% {
            box-shadow: 0 0 16px rgba(227, 179, 65, 0.5);
          }
        }

        .repo-tagline {
          font-size: 1.25rem;
          color: var(--accent-blue);
          font-weight: 600;
          line-height: 1.4;
        }

        .hero-buttons-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .btn-github-hero {
          background-color: #21262d;
          color: #c9d1d9;
          border: 1px solid #30363d;
          padding: 10px 18px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-github-hero:hover {
          background-color: #30363d;
          border-color: #8b949e;
        }

        .btn-homepage-hero {
          background-color: #238636;
          color: #ffffff;
          border: 1px solid rgba(240, 246, 252, 0.1);
          padding: 10px 18px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-homepage-hero:hover {
          background-color: #2ea043;
        }

        /* Badge Row CSS styling */
        .badge-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .summary-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .arch-tooltip-target {
          position: relative;
          cursor: help;
        }

        .arch-tooltip-target::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%) scale(0.9);
          background-color: #161b22;
          color: #c9d1d9;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #30363d;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: normal;
          width: 200px;
          text-align: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 100;
          pointer-events: none;
        }

        .arch-tooltip-target:hover::after {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) scale(1);
        }

        .badge-emoji {
          font-size: 0.9rem;
        }

        .badge-blue {
          background-color: rgba(88, 166, 255, 0.1);
          color: var(--accent-blue);
          border: 1px solid rgba(88, 166, 255, 0.2);
        }
        .badge-green {
          background-color: rgba(63, 185, 80, 0.1);
          color: var(--accent-green);
          border: 1px solid rgba(63, 185, 80, 0.2);
        }
        .badge-yellow {
          background-color: rgba(227, 179, 65, 0.1);
          color: var(--accent-yellow);
          border: 1px solid rgba(227, 179, 65, 0.2);
        }
        .badge-orange {
          background-color: rgba(247, 129, 102, 0.1);
          color: var(--accent-orange);
          border: 1px solid rgba(247, 129, 102, 0.2);
        }
        .badge-purple {
          background-color: rgba(188, 140, 255, 0.1);
          color: var(--accent-purple);
          border: 1px solid rgba(188, 140, 255, 0.2);
        }
        .badge-red {
          background-color: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.2);
        }
        .badge-teal {
          background-color: rgba(46, 196, 182, 0.1);
          color: #2ec4b6;
          border: 1px solid rgba(46, 196, 182, 0.2);
        }
        .badge-gray {
          background-color: rgba(139, 148, 158, 0.1);
          color: var(--text-secondary);
          border: 1px solid rgba(139, 148, 158, 0.2);
        }

        /* SimilarTo blockquote */
        .similar-quote {
          position: relative;
          background-color: #1c2128;
          border-left: 4px solid #58a6ff;
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 24px 24px 24px 48px;
        }

        .quote-mark {
          position: absolute;
          top: -2px;
          left: 12px;
          font-size: 4rem;
          font-family: Georgia, serif;
          color: #58a6ff;
          opacity: 0.3;
          line-height: 1;
          pointer-events: none;
        }

        .quote-content {
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.6;
          color: var(--text-primary);
          font-style: italic;
        }

        /* What does it do Section details */
        .section-title-clean {
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .summary-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .summary-paragraph {
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        /* Callout columns */
        .callouts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .callout-box {
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .box-yellow {
          background-color: rgba(227, 179, 65, 0.03);
          border: 1px solid rgba(227, 179, 65, 0.15);
        }
        .box-yellow .callout-title {
          color: var(--accent-yellow);
        }

        .box-green {
          background-color: rgba(63, 185, 80, 0.03);
          border: 1px solid rgba(63, 185, 80, 0.15);
        }
        .box-green .callout-title {
          color: var(--accent-green);
        }

        .callout-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .callout-icon {
          font-size: 1.2rem;
        }

        .callout-title {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .callout-text {
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        /* Fun Fact bottom panel */
        .fun-fact-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px 20px;
        }

        .fun-fact-emoji {
          font-size: 1.6rem;
        }

        .fun-fact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .fun-fact-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .fun-fact-text {
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .callouts-grid {
            grid-template-columns: 1fr;
          }
          .ai-summary-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default AISummary;

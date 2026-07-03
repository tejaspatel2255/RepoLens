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

  // Helper colors for badges
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'badge-green';
      case 'moderate': return 'badge-yellow';
      case 'technical': return 'badge-orange';
      default: return 'badge-gray';
    }
  };

  const getMaturityColor = (mat) => {
    switch (mat?.toLowerCase()) {
      case 'stable':
      case 'mature': return 'badge-green';
      case 'active development': return 'badge-blue';
      case 'experimental': return 'badge-purple';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="ai-summary-card card animate-fade">
      {/* 1. Header & Title details */}
      <div className="summary-header">
        <h1 className="repo-title">
          <i className="fa-brands fa-github repo-icon"></i> {info?.name || 'Repository'}
        </h1>
        {aiAnalysis.tagline && (
          <h2 className="repo-tagline">{aiAnalysis.tagline}</h2>
        )}
      </div>

      {/* 2. Badge Metadata Row */}
      <div className="badge-row">
        {aiAnalysis.projectType && (
          <span className="summary-badge badge-blue">
            <i className="fa-solid fa-shapes"></i> {aiAnalysis.projectType}
          </span>
        )}
        {aiAnalysis.difficultyToUse && (
          <span className={`summary-badge ${getDifficultyColor(aiAnalysis.difficultyToUse)}`}>
            <i className="fa-solid fa-gauge"></i> {aiAnalysis.difficultyToUse}
          </span>
        )}
        {aiAnalysis.maturityLevel && (
          <span className={`summary-badge ${getMaturityColor(aiAnalysis.maturityLevel)}`}>
            <i className="fa-solid fa-seedling"></i> {aiAnalysis.maturityLevel}
          </span>
        )}
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

        .repo-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
        }

        .repo-icon {
          font-size: 2rem;
          color: var(--text-secondary);
        }

        .repo-tagline {
          font-size: 1.25rem;
          color: var(--accent-blue);
          font-weight: 600;
          line-height: 1.4;
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
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.02em;
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
        .badge-gray {
          background-color: rgba(139, 148, 158, 0.1);
          color: var(--text-secondary);
          border: 1px solid rgba(139, 148, 158, 0.2);
        }

        /* SimilarTo blockquote */
        .similar-quote {
          position: relative;
          background-color: var(--bg-secondary);
          border-left: 4px solid var(--accent-purple);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 20px 24px 20px 48px;
        }

        .quote-mark {
          position: absolute;
          top: -2px;
          left: 12px;
          font-size: 4rem;
          font-family: Georgia, serif;
          color: var(--accent-purple);
          opacity: 0.3;
          line-height: 1;
          pointer-events: none;
        }

        .quote-content {
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.5;
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

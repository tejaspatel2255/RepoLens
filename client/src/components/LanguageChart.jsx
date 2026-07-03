import React, { useState, useEffect } from 'react';

function LanguageChart({ languages = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger transition after mounting
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!languages || languages.length === 0) return null;

  return (
    <div className="language-chart-card card animate-fade">
      <h3 className="chart-title">Codebase Breakdown</h3>

      {/* 1. Stacked Horizontal Rainbow Bar */}
      <div className="stacked-bar-container">
        {languages.map((lang, idx) => (
          <div 
            key={idx}
            className="stacked-bar-segment"
            style={{
              width: mounted ? `${lang.percentage}%` : '0%',
              backgroundColor: lang.color || 'var(--text-secondary)',
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          ></div>
        ))}
      </div>

      {/* 2. Legend Below */}
      <div className="languages-legend">
        {languages.map((lang, idx) => (
          <div key={idx} className="legend-item">
            <span 
              className="legend-dot"
              style={{ backgroundColor: lang.color || 'var(--text-secondary)' }}
            ></span>
            <span className="legend-label">
              <span className="legend-name">{lang.name}</span>
              <span className="legend-pct">{lang.percentage.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>

      {/* 3. Individual Rows with Bars */}
      <div className="languages-breakdown-rows">
        {languages.map((lang, idx) => (
          <div key={idx} className="breakdown-row">
            <div className="row-labels">
              <span className="row-name">{lang.name}</span>
              <span className="row-pct">{lang.percentage.toFixed(1)}%</span>
            </div>
            <div className="row-bar-track">
              <div 
                className="row-bar-fill"
                style={{
                  width: mounted ? `${lang.percentage}%` : '0%',
                  backgroundColor: lang.color || 'var(--text-secondary)',
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .language-chart-card {
          background-color: var(--bg-card);
          padding: 24px;
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        /* Rainbow Stacked Bar */
        .stacked-bar-container {
          display: flex;
          height: 16px;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          background-color: var(--bg-secondary);
          margin-bottom: 24px;
        }

        .stacked-bar-segment {
          height: 100%;
          transition: width 1s ease-out;
        }

        /* Legend */
        .languages-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-label {
          font-size: 0.85rem;
          display: flex;
          gap: 6px;
        }

        .legend-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .legend-pct {
          color: var(--text-secondary);
        }

        /* Detailed rows breakdown */
        .languages-breakdown-rows {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .breakdown-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .row-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .row-name {
          color: var(--text-primary);
        }

        .row-pct {
          color: var(--text-secondary);
        }

        .row-bar-track {
          height: 8px;
          width: 100%;
          background-color: var(--bg-secondary);
          border-radius: 4px;
          overflow: hidden;
        }

        .row-bar-fill {
          height: 100%;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default LanguageChart;

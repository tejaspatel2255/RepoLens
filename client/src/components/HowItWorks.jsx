import React from 'react';

function HowItWorks({ steps = [] }) {
  // Fallback steps if not provided
  const stepsList = steps.length > 0 ? steps : [
    { step: 1, title: 'Extract Code', description: 'Checks files, size, primary languages, and readmes directly from the GitHub API.' },
    { step: 2, title: 'Analyze Metadata', description: 'Examines directories, contributors, and commit logs to build active metrics.' },
    { step: 3, title: 'Run AI Review', description: 'Sends the details to Gemini to generate summaries, use cases, and tech stack details.' },
    { step: 4, title: 'Write Cache', description: 'Saves reports to Supabase to prevent API throttling and enable instant loads.' },
    { step: 5, title: 'Load View', description: 'Renders the details inside a beautiful, readable web dashboard.' }
  ];

  const colors = [
    'var(--accent-blue)',
    'var(--accent-green)',
    'var(--accent-purple)',
    'var(--accent-orange)',
    'var(--accent-yellow)'
  ];

  const isTwoRows = stepsList.length > 4;
  const svgHeight = isTwoRows ? 340 : 160;

  // Calculate coordinates for a step index
  const getCoordinates = (idx) => {
    if (idx < 4) {
      return { x: 100 + idx * 200, y: 70 };
    } else {
      return { x: 100 + (idx - 4) * 200, y: 240 };
    }
  };

  return (
    <div className="how-it-works-section">
      <h2 className="how-it-works-title">
        How It Works <span className="subtitle-explained">(Simply Explained)</span>
      </h2>

      {/* SVG Flow diagram (shown on desktop/tablet) */}
      <div className="svg-container-flow">
        <svg 
          viewBox={`0 0 800 ${svgHeight}`} 
          className="flow-svg"
          width="100%" 
          height="100%"
        >
          {/* Arrow marker definition */}
          <defs>
            <marker 
              id="arrow" 
              viewBox="0 0 10 10" 
              refX="6" 
              refY="5" 
              markerWidth="6" 
              markerHeight="6" 
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--text-secondary)" />
            </marker>
          </defs>

          {/* Draw connecting paths */}
          {stepsList.map((step, idx) => {
            if (idx === stepsList.length - 1) return null;

            const start = getCoordinates(idx);
            const end = getCoordinates(idx + 1);

            // If it is the connector between row 1 and row 2 (from step 4/idx 3 to step 5/idx 4)
            if (idx === 3) {
              return (
                <path 
                  key={`path-${idx}`}
                  d={`M ${start.x} ${start.y + 30} C ${start.x} ${start.y + 100}, ${end.x} ${end.y - 100}, ${end.x} ${end.y - 30}`}
                  fill="none" 
                  stroke="var(--text-secondary)" 
                  strokeWidth="2" 
                  strokeDasharray="6, 5" 
                  className="animated-arrow-line"
                  markerEnd="url(#arrow)"
                />
              );
            }

            // Normal horizontal arrows
            return (
              <line 
                key={`path-${idx}`}
                x1={start.x + 35} 
                y1={start.y} 
                x2={end.x - 35} 
                y2={end.y} 
                stroke="var(--text-secondary)" 
                strokeWidth="2" 
                strokeDasharray="6, 5" 
                className="animated-arrow-line"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Draw circles and labels */}
          {stepsList.map((step, idx) => {
            const pos = getCoordinates(idx);
            const color = colors[idx % colors.length];

            return (
              <g key={`step-${idx}`} className="svg-step-group">
                <title>{step.description}</title>
                
                {/* Outer pulsing ring on hover */}
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r="30" 
                  fill="var(--bg-card)"
                  stroke={color} 
                  strokeWidth="2" 
                  className="step-circle"
                />
                
                {/* Step number */}
                <text 
                  x={pos.x} 
                  y={pos.y + 6} 
                  fill={color} 
                  textAnchor="middle" 
                  className="step-number-text"
                >
                  {step.step}
                </text>

                {/* Step Title */}
                <text 
                  x={pos.x} 
                  y={pos.y + 50} 
                  fill="var(--text-primary)" 
                  textAnchor="middle" 
                  className="step-title-text"
                >
                  {step.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step cards list (shown on mobile instead of SVG) */}
      <div className="mobile-steps-list">
        {stepsList.map((step, idx) => {
          const color = colors[idx % colors.length];
          return (
            <div key={idx} className="mobile-step-card card">
              <div className="mobile-step-header">
                <span className="mobile-step-number" style={{ color, borderColor: color }}>
                  {step.step}
                </span>
                <h4 className="mobile-step-title">{step.title}</h4>
              </div>
              <p className="mobile-step-desc">{step.description}</p>
            </div>
          );
        })}
      </div>

      <style>{`
        .how-it-works-section {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .how-it-works-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 30px;
          color: var(--text-primary);
        }

        .subtitle-explained {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .svg-container-flow {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px 16px;
          display: block;
        }

        .flow-svg {
          display: block;
        }

        .animated-arrow-line {
          animation: dashoffset 1.5s linear infinite;
        }

        @keyframes dashoffset {
          to {
            stroke-dashoffset: -22;
          }
        }

        .svg-step-group {
          cursor: help;
        }

        .step-circle {
          transition: r 0.25s ease, fill 0.25s ease;
        }
        .svg-step-group:hover .step-circle {
          r: 34;
          fill: var(--bg-secondary);
        }

        .step-number-text {
          font-family: inherit;
          font-weight: 800;
          font-size: 1.2rem;
          user-select: none;
        }

        .step-title-text {
          font-family: inherit;
          font-weight: 700;
          font-size: 0.85rem;
          user-select: none;
        }

        .mobile-steps-list {
          display: none;
          flex-direction: column;
          gap: 16px;
        }

        /* Mobile specific layouts */
        @media (max-width: 768px) {
          .svg-container-flow {
            display: none;
          }
          .mobile-steps-list {
            display: flex;
          }
        }

        .mobile-step-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background-color: var(--bg-card);
        }

        .mobile-step-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-step-number {
          width: 32px;
          height: 32px;
          border: 2px solid;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .mobile-step-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mobile-step-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default HowItWorks;

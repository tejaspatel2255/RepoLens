import React from 'react';

function TechStack({ techStack = [] }) {
  if (!techStack || techStack.length === 0) return null;

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'frontend': return 'cat-blue';
      case 'backend': return 'cat-green';
      case 'database': return 'cat-purple';
      case 'devops': return 'cat-orange';
      case 'ai':
      case 'ml':
      case 'ai/ml': return 'cat-pink';
      default: return 'cat-gray';
    }
  };

  return (
    <div className="tech-stack-section">
      <h2 className="tech-stack-heading">Built With</h2>
      
      <div className="tech-stack-grid">
        {techStack.map((tech, idx) => (
          <div key={idx} className="tech-card card">
            <div className="tech-emoji">{tech.icon || '🛠️'}</div>
            <div className="tech-details">
              <h4 className="tech-name">{tech.name}</h4>
              <p className="tech-role">{tech.role}</p>
              {tech.category && (
                <span className={`tech-category-badge ${getCategoryColor(tech.category)}`}>
                  {tech.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .tech-stack-section {
          padding: 10px 0;
        }

        .tech-stack-heading {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .tech-stack-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .tech-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background-color: var(--bg-card);
          border-color: var(--border);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .tech-card:hover {
          transform: translateY(-2px);
          border-color: var(--text-secondary);
        }

        .tech-emoji {
          font-size: 2rem;
          flex-shrink: 0;
          line-height: 1;
        }

        .tech-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .tech-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tech-role {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .tech-category-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 2px;
        }

        /* Color schemes for badges */
        .cat-blue {
          background-color: rgba(88, 166, 255, 0.1);
          color: var(--accent-blue);
        }
        .cat-green {
          background-color: rgba(63, 185, 80, 0.1);
          color: var(--accent-green);
        }
        .cat-purple {
          background-color: rgba(188, 140, 255, 0.1);
          color: var(--accent-purple);
        }
        .cat-orange {
          background-color: rgba(247, 129, 102, 0.1);
          color: var(--accent-orange);
        }
        .cat-pink {
          background-color: rgba(255, 105, 180, 0.1);
          color: #ff69b4;
        }
        .cat-gray {
          background-color: rgba(139, 148, 158, 0.1);
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

export default TechStack;

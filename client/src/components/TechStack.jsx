import React, { useState } from 'react';

function TechStack({ techStack = [] }) {
  if (!techStack || techStack.length === 0) return null;

  const [selectedCategory, setSelectedCategory] = useState('All');

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase().trim()) {
      case 'frontend': return 'cat-blue';
      case 'backend': return 'cat-green';
      case 'database': return 'cat-purple';
      case 'devops': return 'cat-orange';
      case 'testing': return 'cat-teal';
      case 'ai':
      case 'ml':
      case 'ai/ml': return 'cat-pink';
      default: return 'cat-gray';
    }
  };

  // Get unique categories and sort them (excluding null/undefined)
  const categories = [
    'All',
    ...Array.from(new Set(techStack.map(t => t.category?.trim()).filter(Boolean)))
  ];

  const filteredTech = selectedCategory === 'All'
    ? techStack
    : techStack.filter(t => t.category?.trim() === selectedCategory);

  return (
    <div className="tech-stack-section">
      <h2 className="tech-stack-heading">Built With</h2>

      {/* Category filter buttons */}
      {categories.length > 1 && (
        <div className="tech-filter-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn-filter ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
      
      <div className="tech-stack-grid">
        {filteredTech.map((tech, idx) => (
          <div key={idx} className="tech-card card">
            <div className="tech-emoji">{tech.icon || '🛠️'}</div>
            <div className="tech-details">
              <h4 className="tech-name">{tech.name}</h4>
              <p className="tech-role">{tech.role}</p>
              {tech.learnMore && (
                <p className="tech-learn-more">{tech.learnMore}</p>
              )}
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
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .tech-filter-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .btn-filter {
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border);
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-filter:hover {
          background-color: #30363d;
          color: var(--text-primary);
        }

        .btn-filter.active {
          background-color: var(--accent-blue);
          color: #ffffff;
          border-color: var(--accent-blue);
        }

        .tech-stack-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .tech-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background-color: var(--bg-card);
          border-color: var(--border);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .tech-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-blue);
          box-shadow: 0 0 20px rgba(88, 166, 255, 0.1);
        }

        .tech-emoji {
          font-size: 2.2rem;
          flex-shrink: 0;
          line-height: 1;
        }

        .tech-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .tech-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tech-role {
          font-size: 0.88rem;
          color: var(--text-primary);
          line-height: 1.4;
          font-weight: 500;
        }

        .tech-learn-more {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
          font-style: italic;
        }

        .tech-category-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 4px;
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
        .cat-teal {
          background-color: rgba(46, 196, 182, 0.1);
          color: #2ec4b6;
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

import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation.js';

function KeyFeatures({ features = [] }) {
  const { elementRef, isVisible } = useScrollAnimation();
  
  if (!features || features.length === 0) return null;

  return (
    <div 
      ref={elementRef}
      className={`features-section ${isVisible ? 'is-visible' : ''}`}
    >
      <h2 className="features-main-heading">What Can It Do?</h2>
      
      <div className="features-grid">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="feature-card card animate-item"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="feature-icon-wrapper">
              <i className="fa-solid fa-circle-check feature-checkmark"></i>
            </div>
            <p className="feature-text">{feature}</p>
          </div>
        ))}
      </div>

      <style>{`
        .features-section {
          padding: 10px 0;
        }

        .features-main-heading {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .feature-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background-color: var(--bg-card);
          border-color: var(--border);
          opacity: 0;
          transform: translateY(20px);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.3s ease, 
                      box-shadow 0.3s ease;
        }

        /* Hover glows and lifts */
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-blue);
          box-shadow: 0 0 20px rgba(88, 166, 255, 0.15);
        }

        .feature-icon-wrapper {
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feature-checkmark {
          color: var(--accent-green);
        }

        .feature-text {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Scroll Animation Triggers */
        .is-visible .animate-item {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default KeyFeatures;

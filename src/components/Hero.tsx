import React from 'react';

interface HeroProps {
  totalApps: number;
}

export const Hero: React.FC<HeroProps> = ({ totalApps }) => {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-header-row">
          <h1 className="hero-title">
            <span className="hero-subtitle">배움을 탐구로 바꾸는</span>
            <div className="hero-main-line">
              <span className="jazz-interactive-wrapper">
                <span className="jazz-interactive-text">Interactive</span>
                <svg
                  className="fountain-pen-stroke"
                  viewBox="0 0 170 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7.2C38 4.2 92 4.0 166 6.8C125 7.8 62 8.5 24 10.2"
                    stroke="#C86D51"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.88"
                  />
                </svg>
              </span>{' '}
              <span className="hero-highlight">아카이브</span>
            </div>
          </h1>

          <div className="app-count-pill">
            <span className="count-num">{totalApps}</span>
            <span className="count-label">개의 웹앱</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding: 3rem 0 1.75rem 0;
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-light);
        }

        .hero-container {
          display: flex;
          align-items: center;
        }

        .hero-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .hero-title {
          display: flex;
          flex-direction: column;
          margin: 0;
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2.2vw, 1.3rem);
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: -0.01em;
          margin-bottom: 0.35rem;
        }

        .hero-main-line {
          display: inline-flex;
          align-items: baseline;
          gap: 0.45rem;
          font-size: clamp(2.3rem, 5.2vw, 3.5rem);
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
          letter-spacing: -0.035em;
          flex-wrap: wrap;
        }

        /* Jazz & Fountain Pen underline styling for '인터랙티브' */
        .jazz-interactive-wrapper {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }

        .jazz-interactive-text {
          font-family: 'Playfair Display', 'Newsreader', Georgia, serif;
          font-size: 1.14em;
          font-weight: 900;
          font-style: italic;
          display: inline-block;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.1;
          padding-bottom: 6px;
          margin-right: 0.15rem;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .fountain-pen-stroke {
          position: absolute;
          left: -4px;
          right: -4px;
          bottom: -5px;
          width: calc(100% + 8px);
          height: 12px;
          pointer-events: none;
          transform: rotate(-0.5deg);
        }

        .hero-highlight {
          position: relative;
          display: inline-block;
          color: var(--accent-primary);
        }

        .hero-highlight::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 4px;
          width: 100%;
          height: 9px;
          background-color: rgba(26, 54, 54, 0.16);
          border-radius: 4px;
          z-index: -1;
        }

        .app-count-pill {
          display: inline-flex;
          align-items: baseline;
          gap: 0.35rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
          margin-bottom: 0.5rem;
        }

        .count-num {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 1rem;
          color: var(--accent-primary);
        }

        .count-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 2.25rem 0 1.25rem 0;
          }
          .hero-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
};

import React from 'react';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-left">
          <span className="footer-brand">Rocky's Ed-Lab</span>
          <p className="footer-desc">교육용 인터랙티브 웹앱 아카이브</p>
        </div>

        <div className="footer-right">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github-link"
          >
            <GithubIcon size={16} />
            <span>GitHub</span>
          </a>
          <span className="footer-year">© {new Date().getFullYear()} Rocky's Ed-Lab</span>
        </div>
      </div>

      <style>{`
        .site-footer {
          border-top: 1px solid var(--border-light);
          margin-top: 3.5rem;
          padding: 1.75rem 0;
          background-color: var(--bg-surface);
        }

        .footer-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-left {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .footer-brand {
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .footer-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .footer-github-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
          transition: color 0.15s ease;
        }

        .footer-github-link:hover {
          color: var(--text-primary);
        }

        .footer-year {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </footer>
  );
};

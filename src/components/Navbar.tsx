import React from 'react';
import { Plus, LogIn, LogOut } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import type { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenCreate
}) => {
  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Brand */}
        <div className="brand-wrapper">
          <span className="brand-title">Rocky's Ed-Lab</span>
        </div>

        {/* Right actions */}
        <div className="header-actions">
          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-button"
            aria-label="GitHub 저장소"
            title="GitHub 저장소 바로가기"
          >
            <GithubIcon size={18} />
          </a>

          {/* User & Admin controls */}
          {user ? (
            <div className="user-section">
              <button className="btn btn-primary btn-sm" onClick={onOpenCreate}>
                <Plus size={15} />
                <span>새 앱 등록</span>
              </button>

              <div className="user-chip">
                <span className="user-badge">{user.isAdmin ? 'Admin' : 'User'}</span>
                <span className="user-email">{user.email.split('@')[0]}</span>
              </div>

              <button
                className="icon-button logout-btn"
                onClick={onLogout}
                title="로그아웃"
                aria-label="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary btn-sm login-trigger" onClick={onOpenAuth}>
              <LogIn size={15} />
              <span>로그인</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-light);
          height: var(--nav-height);
          display: flex;
          align-items: center;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .brand-title {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .icon-button {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
          background-color: var(--bg-surface);
          transition: all 0.15s ease;
        }

        .icon-button:hover {
          color: var(--text-primary);
          background-color: var(--bg-subtle);
          border-color: var(--border-medium);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.6rem;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
        }

        .user-badge {
          background-color: var(--accent-light);
          color: var(--accent-primary);
          font-weight: 700;
          font-size: 0.7rem;
          padding: 0.1rem 0.35rem;
          border-radius: var(--radius-xs);
        }

        .user-email {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .login-trigger {
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .user-email {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

import React from 'react';
import { ExternalLink, Heart, Play, Edit3, Trash2 } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import type { EducationalApp } from '../types';

interface AppCardProps {
  app: EducationalApp;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectApp: (app: EducationalApp) => void;
  isAdmin: boolean;
  onEditApp: (app: EducationalApp) => void;
  onDeleteApp: (id: string) => void;
  categories?: { id: string; label: string }[];
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  isBookmarked,
  onToggleBookmark,
  onSelectApp,
  isAdmin,
  onEditApp,
  onDeleteApp,
  categories = []
}) => {
  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'math': return 'badge-math';
      case 'science': return 'badge-science';
      case 'coding': return 'badge-coding';
      case 'language': return 'badge-language';
      case 'creative': return 'badge-creative';
      case 'tool': return 'badge-tool';
      default: return 'badge-science';
    }
  };

  const getCategoryName = (cat: string) => {
    const matched = categories.find(c => c.id === cat);
    if (matched) return matched.label;

    switch (cat) {
      case 'math': return '수학·기하';
      case 'science': return '물리·과학';
      case 'coding': return '소프트웨어';
      case 'language': return '어학·어휘';
      case 'creative': return '창의·탐구';
      case 'tool': return '수업 도구';
      default: return cat;
    }
  };

  return (
    <div className="app-card">
      {/* Thumbnail Area */}
      <div className="card-media-wrapper" onClick={() => onSelectApp(app)}>
        <img
          src={app.thumbnailUrl}
          alt={app.title}
          className="card-thumbnail"
          loading="lazy"
          onError={(e) => {
            // Fallback image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="media-overlay">
          <span className="launch-tag">
            <Play size={13} fill="currentColor" />
            <span>실행 & 미리보기</span>
          </span>
        </div>

        {/* Top Badges */}
        <div className="card-floating-badges">
          <span className={`badge ${getCategoryClass(app.category)}`}>
            {getCategoryName(app.category)}
          </span>
          <span className="badge badge-audience">
            {app.targetAudience}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          className={`favorite-btn ${isBookmarked ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(app.id);
          }}
          aria-label={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          <Heart size={16} fill={isBookmarked ? '#C86D51' : 'none'} color={isBookmarked ? '#C86D51' : '#FFFFFF'} />
        </button>
      </div>

      {/* Content Area */}
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title" onClick={() => onSelectApp(app)}>
            {app.title}
          </h3>

          {/* Admin action buttons */}
          {isAdmin && (
            <div className="admin-quick-actions">
              <button
                className="admin-action-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditApp(app);
                }}
                title="앱 수정"
              >
                <Edit3 size={14} />
              </button>
              <button
                className="admin-action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`'${app.title}' 앱을 삭제하시겠습니까?`)) {
                    onDeleteApp(app.id);
                  }
                }}
                title="앱 삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        <p className="card-summary">{app.summary}</p>

        {/* Tags */}
        <div className="card-tags">
          {app.tags.map((tag, idx) => (
            <span key={idx} className="tag-item">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="card-footer">
          <button className="btn btn-secondary btn-sm primary-action-btn" onClick={() => onSelectApp(app)}>
            <span>자세히 보기</span>
          </button>

          <div className="footer-links">
            {app.githubUrl && (
              <a
                href={app.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-btn"
                title="GitHub 소스코드"
              >
                <GithubIcon size={15} />
              </a>
            )}
            <a
              href={app.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-btn"
              title="새 창으로 바로 실행"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .app-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .app-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-medium);
        }

        .card-media-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9.5;
          overflow: hidden;
          background-color: var(--bg-subtle);
          cursor: pointer;
        }

        .card-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .app-card:hover .card-thumbnail {
          transform: scale(1.03);
        }

        .media-overlay {
          position: absolute;
          inset: 0;
          background: rgba(18, 19, 21, 0.3);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }

        .app-card:hover .media-overlay {
          opacity: 1;
        }

        .launch-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: rgba(255, 255, 255, 0.95);
          color: #191918;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-floating-badges {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          z-index: 2;
        }

        .badge-audience {
          background-color: rgba(255, 255, 255, 0.9);
          color: #2D3748;
          font-size: 0.7rem;
          backdrop-filter: blur(4px);
        }

        .favorite-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(18, 19, 21, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .favorite-btn:hover {
          transform: scale(1.1);
          background: rgba(18, 19, 21, 0.75);
        }

        .favorite-btn.active {
          background: #FFFFFF;
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
          cursor: pointer;
        }

        .card-title:hover {
          color: var(--accent-primary);
        }

        .admin-quick-actions {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .admin-action-btn {
          width: 26px;
          height: 26px;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          background: var(--bg-surface);
        }

        .admin-action-btn.edit:hover {
          color: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .admin-action-btn.delete:hover {
          color: #DC2626;
          border-color: #DC2626;
        }

        .card-summary {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1.25rem;
        }

        .tag-item {
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-subtle);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-xs);
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-light);
        }

        .primary-action-btn {
          font-weight: 600;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .external-link-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
          background-color: var(--bg-surface);
          transition: all 0.15s ease;
        }

        .external-link-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-subtle);
          border-color: var(--border-medium);
        }
      `}</style>
    </div>
  );
};

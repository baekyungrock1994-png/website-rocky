import React, { useState } from 'react';
import { X, ExternalLink, Heart, Play, BookOpen, RotateCcw } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import type { EducationalApp } from '../types';

interface AppDetailModalProps {
  app: EducationalApp | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  onClose,
  isBookmarked,
  onToggleBookmark
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'sandbox'>('info');
  const [iframeKey, setIframeKey] = useState(0);

  if (!app) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card detail-modal-card ${activeTab === 'sandbox' ? 'expanded-sandbox' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="detail-modal-header">
          <div className="header-info">
            <div className="header-badges">
              <span className="badge badge-outline">{app.targetAudience}</span>
              <span className="badge badge-category">{app.category.toUpperCase()}</span>
            </div>
            <h2 className="modal-title">{app.title}</h2>
          </div>

          <div className="header-actions">
            <button
              className={`icon-button ${isBookmarked ? 'active-bookmark' : ''}`}
              onClick={() => onToggleBookmark(app.id)}
              aria-label="즐겨찾기"
              title="즐겨찾기"
            >
              <Heart size={18} fill={isBookmarked ? '#C86D51' : 'none'} color={isBookmarked ? '#C86D51' : 'currentColor'} />
            </button>
            <button className="icon-button" onClick={onClose} aria-label="닫기">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <BookOpen size={15} />
            <span>소개 및 학습 가이드</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <Play size={15} fill={activeTab === 'sandbox' ? 'currentColor' : 'none'} />
            <span>웹에서 바로 실행 (미리보기)</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' ? (
          <div className="modal-body-info">
            {/* Banner Media */}
            <div className="detail-banner-wrapper">
              <img src={app.thumbnailUrl} alt={app.title} className="detail-banner-img" />
              <div className="banner-play-overlay">
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab('sandbox')}
                >
                  <Play size={16} fill="currentColor" />
                  <span>인라인 샌드박스로 실행하기</span>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="section-block">
              <h4 className="section-label">한 줄 요약</h4>
              <p className="summary-quote">{app.summary}</p>
            </div>

            {/* Description */}
            <div className="section-block">
              <h4 className="section-label">상세 학습 목표 및 활용법</h4>
              <div className="description-text">
                {app.description.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="section-block">
              <h4 className="section-label">관련 태그</h4>
              <div className="detail-tags">
                {app.tags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Launch Bar */}
            <div className="detail-launch-bar">
              <div className="date-info">등록일: {app.createdAt || '최근'}</div>
              <div className="launch-buttons">
                {app.githubUrl && (
                  <a
                    href={app.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <GithubIcon size={16} />
                    <span>GitHub 코드</span>
                  </a>
                )}
                <a
                  href={app.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <span>새 창에서 전체화면으로 실행</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-body-sandbox">
            {/* Sandbox Toolbar */}
            <div className="sandbox-toolbar">
              <span className="sandbox-url-label">실행 주소: {app.appUrl}</span>
              <div className="sandbox-tools">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIframeKey(k => k + 1)}
                  title="앱 다시 불러오기"
                >
                  <RotateCcw size={13} />
                  <span>새로고침</span>
                </button>
                <a
                  href={app.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  title="새 창으로 이동"
                >
                  <ExternalLink size={13} />
                  <span>새 탭으로 열기</span>
                </a>
              </div>
            </div>

            {/* Iframe View */}
            <div className="sandbox-frame-wrapper">
              <iframe
                key={iframeKey}
                src={app.appUrl}
                title={app.title}
                className="sandbox-iframe"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .detail-modal-card {
          max-width: 780px;
          display: flex;
          flex-direction: column;
          transition: max-width 0.25s ease;
        }

        .detail-modal-card.expanded-sandbox {
          max-width: 1040px;
          height: 88vh;
        }

        .detail-modal-header {
          padding: 1.5rem 1.75rem 1rem 1.75rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-light);
        }

        .header-badges {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.4rem;
        }

        .badge-category {
          background-color: var(--bg-subtle);
          color: var(--accent-primary);
        }

        .modal-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .active-bookmark {
          border-color: rgba(200, 109, 81, 0.3);
          background-color: var(--accent-warm-light);
        }

        .modal-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-light);
          padding: 0 1.75rem;
          background-color: var(--bg-surface);
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.85rem 1rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 2px solid transparent;
          transition: all 0.15s ease;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        .modal-body-info {
          padding: 1.75rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detail-banner-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--bg-subtle);
        }

        .detail-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(18, 19, 21, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-block {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .section-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }

        .summary-quote {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-primary);
          font-weight: 500;
          padding-left: 1rem;
          border-left: 3px solid var(--accent-primary);
        }

        .description-text p {
          margin-bottom: 0.4rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tag-pill {
          font-size: 0.8rem;
          background-color: var(--bg-subtle);
          color: var(--text-secondary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-xs);
        }

        .detail-launch-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-light);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .date-info {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .launch-buttons {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        /* Sandbox Mode Styles */
        .modal-body-sandbox {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 520px;
        }

        .sandbox-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1.25rem;
          background-color: var(--bg-subtle);
          border-bottom: 1px solid var(--border-light);
          font-size: 0.8rem;
        }

        .sandbox-url-label {
          color: var(--text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 60%;
        }

        .sandbox-tools {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sandbox-frame-wrapper {
          flex: 1;
          width: 100%;
          min-height: 480px;
          background-color: #ffffff;
        }

        .sandbox-iframe {
          width: 100%;
          height: 100%;
          border: none;
          min-height: 500px;
        }
      `}</style>
    </div>
  );
};

import React from 'react';
import {
  Search,
  Compass,
  Atom,
  Code,
  BookOpen,
  Sparkles,
  Wrench,
  Layers,
  Heart,
  X,
  Settings,
  Scale,
  MessageSquare,
  Lightbulb,
  Globe,
  Calculator,
  Music,
  Palette
} from 'lucide-react';
import type { AppCategory, CategoryMeta } from '../types';

interface FilterBarProps {
  categories: CategoryMeta[];
  selectedCategory: AppCategory;
  onSelectCategory: (cat: AppCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedAudience: string;
  onSelectAudience: (aud: string) => void;
  onlyBookmarks: boolean;
  onToggleBookmarks: () => void;
  bookmarkCount: number;
  totalFiltered: number;
  isAdmin: boolean;
  onOpenCategoryManager: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedAudience,
  onSelectAudience,
  onlyBookmarks,
  onToggleBookmarks,
  bookmarkCount,
  totalFiltered,
  isAdmin,
  onOpenCategoryManager
}) => {
  const getCategoryIcon = (iconName: string = 'Layers', size = 15) => {
    switch (iconName) {
      case 'Compass': return <Compass size={size} />;
      case 'Atom': return <Atom size={size} />;
      case 'Code': return <Code size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      case 'Heart': return <Heart size={size} />;
      case 'Scale': return <Scale size={size} />;
      case 'MessageSquare': return <MessageSquare size={size} />;
      case 'Lightbulb': return <Lightbulb size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'Calculator': return <Calculator size={size} />;
      case 'Music': return <Music size={size} />;
      case 'Palette': return <Palette size={size} />;
      default: return <Layers size={size} />;
    }
  };

  const audiences = ['전체 대상', '초등', '중등', '고등', '교사용'];

  return (
    <div className="filter-wrapper">
      <div className="container">
        {/* Category Tabs */}
        <div className="category-scroll-container">
          <div className="category-tabs">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  <span className="pill-icon">{getCategoryIcon(cat.iconName)}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* Admin category settings button */}
            {isAdmin && (
              <button
                type="button"
                className="category-pill manage-pill"
                onClick={onOpenCategoryManager}
                title="수업 카테고리 추가 및 수정"
              >
                <Settings size={14} />
                <span>카테고리 관리</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Sub-filters Bar */}
        <div className="search-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="웹앱 이름, 학습 개념, 태그(예: 기하, 알고리즘) 검색..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="검색어 지우기"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            {/* Target Grade Selector */}
            <select
              className="audience-select"
              value={selectedAudience}
              onChange={e => onSelectAudience(e.target.value)}
              aria-label="대상 학년 선택"
            >
              {audiences.map(aud => (
                <option key={aud} value={aud}>{aud}</option>
              ))}
            </select>

            {/* Bookmark filter toggle */}
            <button
              className={`btn btn-sm bookmark-toggle ${onlyBookmarks ? 'active' : ''}`}
              onClick={onToggleBookmarks}
              title="내가 찜한 웹앱만 모아보기"
            >
              <Heart size={14} fill={onlyBookmarks ? 'currentColor' : 'none'} />
              <span>찜한 앱</span>
              <span className="bookmark-counter">{bookmarkCount}</span>
            </button>
          </div>
        </div>

        {/* Results summary & Reset */}
        <div className="results-summary">
          <span className="summary-count">{totalFiltered}개의 웹앱</span>
          {(selectedCategory !== 'all' || searchQuery || selectedAudience !== '전체 대상' || onlyBookmarks) && (
            <button
              className="reset-filters-btn"
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
                onSelectAudience('전체 대상');
                if (onlyBookmarks) onToggleBookmarks();
              }}
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>

      <style>{`
        .filter-wrapper {
          padding: 1.5rem 0 1rem 0;
          border-bottom: 1px solid var(--border-light);
          background-color: var(--bg-surface);
        }

        .category-scroll-container {
          overflow-x: auto;
          scrollbar-width: none;
          margin-bottom: 1.25rem;
          padding-bottom: 2px;
        }

        .category-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .category-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: max-content;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.95rem;
          background-color: var(--bg-main);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.86rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .category-pill:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .category-pill.active {
          background-color: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
        }

        .category-pill.manage-pill {
          background-color: transparent;
          border-style: dashed;
          color: var(--accent-primary);
        }

        .category-pill.manage-pill:hover {
          background-color: var(--accent-light);
          border-color: var(--accent-primary);
        }

        .pill-icon {
          display: flex;
          align-items: center;
        }

        .search-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          flex: 1;
          min-width: 260px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding-left: 2.3rem;
          padding-right: 2rem;
          background-color: var(--bg-main);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }

        .search-clear-btn {
          position: absolute;
          right: 0.6rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .search-clear-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-subtle);
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .audience-select {
          background-color: var(--bg-main);
          border: 1px solid var(--border-light);
          font-size: 0.85rem;
          padding: 0.55rem 0.8rem;
          border-radius: var(--radius-sm);
        }

        .bookmark-toggle {
          background-color: var(--bg-main);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          height: 38px;
          padding: 0 0.85rem;
        }

        .bookmark-toggle:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }

        .bookmark-toggle.active {
          background-color: var(--accent-warm-light);
          color: var(--accent-warm);
          border-color: rgba(200, 109, 81, 0.3);
        }

        .bookmark-counter {
          background-color: var(--bg-subtle);
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .bookmark-toggle.active .bookmark-counter {
          background-color: var(--accent-warm);
          color: #ffffff;
        }

        .results-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.75rem;
        }

        .reset-filters-btn {
          color: var(--accent-primary);
          font-weight: 600;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .search-row {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-controls {
            justify-content: space-between;
          }
          .audience-select {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

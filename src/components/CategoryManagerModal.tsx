import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  Tag,
  Compass,
  Atom,
  Code,
  BookOpen,
  Sparkles,
  Wrench,
  Layers,
  Heart,
  Scale,
  MessageSquare,
  Lightbulb,
  Globe,
  Calculator,
  Music,
  Palette,
  ChevronDown
} from 'lucide-react';
import type { CategoryMeta } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryMeta[];
  onSaveCategories: (updated: CategoryMeta[]) => Promise<void>;
}

const AVAILABLE_ICONS = [
  { name: 'Scale', label: '저울(도덕·정의)' },
  { name: 'Heart', label: '하트(마음·인성)' },
  { name: 'MessageSquare', label: '말풍선(토론·철학)' },
  { name: 'Lightbulb', label: '전구(생각·아이디어)' },
  { name: 'Compass', label: '나침반(수학·기하)' },
  { name: 'Atom', label: '원자(과학·실험)' },
  { name: 'Code', label: '코드(컴퓨팅)' },
  { name: 'BookOpen', label: '책(어학·인문)' },
  { name: 'Globe', label: '지구본(사회·지리)' },
  { name: 'Calculator', label: '계산기(연산)' },
  { name: 'Sparkles', label: '반짝이(창의)' },
  { name: 'Wrench', label: '스패너(수업도구)' },
  { name: 'Music', label: '음표(음악)' },
  { name: 'Palette', label: '팔레트(미술)' },
  { name: 'Layers', label: '레이어(전체·일반)' }
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategories
}) => {
  const [list, setList] = useState<CategoryMeta[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('Scale');
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setList([...categories]);
      setNewLabel('');
      setNewIcon('Scale');
      setActivePickerId(null);
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const renderIcon = (iconName: string = 'Layers', size = 16) => {
    switch (iconName) {
      case 'Scale': return <Scale size={size} />;
      case 'Heart': return <Heart size={size} />;
      case 'MessageSquare': return <MessageSquare size={size} />;
      case 'Lightbulb': return <Lightbulb size={size} />;
      case 'Compass': return <Compass size={size} />;
      case 'Atom': return <Atom size={size} />;
      case 'Code': return <Code size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'Calculator': return <Calculator size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      case 'Music': return <Music size={size} />;
      case 'Palette': return <Palette size={size} />;
      default: return <Layers size={size} />;
    }
  };

  // 라벨 수정
  const handleLabelChange = (id: string, newText: string) => {
    setList(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, label: newText } : cat))
    );
  };

  // 아이콘 수정
  const handleIconChange = (id: string, iconName: string) => {
    setList(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, iconName } : cat))
    );
    setActivePickerId(null);
  };

  // 새 카테고리 추가
  const handleAddCategory = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    const newId = `cat-${Date.now().toString(36)}`;
    const newCat: CategoryMeta = {
      id: newId,
      label: trimmed,
      iconName: newIcon
    };

    setList(prev => [...prev, newCat]);
    setNewLabel('');
  };

  // 카테고리 삭제
  const handleDeleteCategory = (id: string) => {
    if (id === 'all') {
      alert("'전체 보기'는 기본 항목이므로 삭제할 수 없습니다.");
      return;
    }
    setList(prev => prev.filter(cat => cat.id !== id));
  };

  // 저장
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveCategories(list);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card category-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="category-modal-header">
          <div className="title-area">
            <div className="cat-badge">
              <Tag size={15} />
              <span>카테고리 & 아이콘 관리</span>
            </div>
            <h2 className="cat-title">수업 분야(카테고리) 설정</h2>
            <p className="cat-subtitle">
              아이콘과 이름을 클릭해 원하는 수업 분야(도덕, 철학, 토론 등)에 맞게 손쉽게 변경하세요.
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="category-modal-body">
          {/* Add New Category Row */}
          <div className="add-category-wrapper">
            <div className="add-category-box">
              {/* Select Icon for New Category */}
              <button
                type="button"
                className="icon-picker-btn"
                onClick={() => setActivePickerId(activePickerId === 'new' ? null : 'new')}
                title="새 카테고리 아이콘 선택"
              >
                <span className="current-icon">{renderIcon(newIcon, 17)}</span>
                <ChevronDown size={12} />
              </button>

              <input
                type="text"
                placeholder="새 카테고리 이름 입력 (예: 도덕·윤리, 철학·토론)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />

              <button
                type="button"
                className="btn btn-primary btn-sm add-cat-btn"
                onClick={handleAddCategory}
              >
                <Plus size={15} />
                <span>추가</span>
              </button>
            </div>

            {/* Icon Picker Popover for New Category */}
            {activePickerId === 'new' && (
              <div className="icon-picker-grid">
                {AVAILABLE_ICONS.map(ic => (
                  <button
                    key={ic.name}
                    type="button"
                    className={`icon-grid-item ${newIcon === ic.name ? 'selected' : ''}`}
                    onClick={() => {
                      setNewIcon(ic.name);
                      setActivePickerId(null);
                    }}
                    title={ic.label}
                  >
                    {renderIcon(ic.name, 17)}
                    <span className="icon-tip">{ic.label.split('(')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Existing Categories List */}
          <div className="category-items-list">
            <div className="list-heading">현재 등록된 카테고리 목록 ({list.length}개)</div>
            {list.map((cat, index) => (
              <div key={cat.id} className="category-row-item-wrapper">
                <div className="category-row-item">
                  <span className="row-index">{index + 1}</span>

                  {/* Icon Trigger Button */}
                  <button
                    type="button"
                    className="icon-picker-btn row-picker"
                    onClick={() => setActivePickerId(activePickerId === cat.id ? null : cat.id)}
                    title="아이콘 변경"
                  >
                    <span className="current-icon">{renderIcon(cat.iconName || 'Layers', 16)}</span>
                    <ChevronDown size={11} />
                  </button>

                  {/* Label input */}
                  <input
                    type="text"
                    className="cat-label-input"
                    value={cat.label}
                    onChange={e => handleLabelChange(cat.id, e.target.value)}
                    disabled={cat.id === 'all'}
                  />

                  {cat.id === 'all' ? (
                    <span className="fixed-badge">기본</span>
                  ) : (
                    <button
                      type="button"
                      className="delete-cat-btn"
                      onClick={() => handleDeleteCategory(cat.id)}
                      title="이 카테고리 삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {/* Inline Icon Picker for Existing Category */}
                {activePickerId === cat.id && (
                  <div className="icon-picker-grid row-grid">
                    {AVAILABLE_ICONS.map(ic => (
                      <button
                        key={ic.name}
                        type="button"
                        className={`icon-grid-item ${cat.iconName === ic.name ? 'selected' : ''}`}
                        onClick={() => handleIconChange(cat.id, ic.name)}
                        title={ic.label}
                      >
                        {renderIcon(ic.name, 17)}
                        <span className="icon-tip">{ic.label.split('(')[0]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="category-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? '저장 중...' : '카테고리 변경사항 저장'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .category-modal-card {
          max-width: 560px;
        }

        .category-modal-header {
          padding: 1.5rem 1.75rem 1rem 1.75rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-light);
        }

        .cat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-primary);
          background-color: var(--accent-light);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.4rem;
        }

        .cat-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cat-subtitle {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          line-height: 1.45;
        }

        .category-modal-body {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .add-category-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .add-category-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-category-box input {
          flex: 1;
        }

        .add-cat-btn {
          padding: 0 1rem;
        }

        .icon-picker-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          color: var(--accent-primary);
          transition: all 0.15s ease;
        }

        .icon-picker-btn:hover {
          background-color: var(--bg-hover);
          border-color: var(--accent-primary);
        }

        .icon-picker-btn.row-picker {
          padding: 0.35rem 0.5rem;
        }

        .current-icon {
          display: flex;
          align-items: center;
        }

        .icon-picker-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.4rem;
          padding: 0.75rem;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          animation: fadeIn 0.15s ease-out;
        }

        .icon-picker-grid.row-grid {
          margin-top: 0.35rem;
          margin-left: 2rem;
          background-color: var(--bg-surface);
        }

        .icon-grid-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.5rem 0.3rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xs);
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .icon-grid-item:hover {
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          background-color: var(--accent-light);
        }

        .icon-grid-item.selected {
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          background-color: var(--accent-light);
          font-weight: 700;
        }

        .icon-tip {
          font-size: 0.68rem;
        }

        .category-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .list-heading {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.2rem;
        }

        .category-row-item-wrapper {
          display: flex;
          flex-direction: column;
        }

        .category-row-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: var(--bg-subtle);
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
        }

        .row-index {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          width: 18px;
          text-align: center;
        }

        .cat-label-input {
          flex: 1;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 0.4rem 0.65rem;
          font-size: 0.88rem;
        }

        .cat-label-input:disabled {
          background-color: transparent;
          border-color: transparent;
          color: var(--text-secondary);
          cursor: not-allowed;
        }

        .fixed-badge {
          font-size: 0.72rem;
          color: var(--text-muted);
          padding: 0.2rem 0.5rem;
          background-color: var(--bg-surface);
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-light);
        }

        .delete-cat-btn {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.15s ease;
        }

        .delete-cat-btn:hover {
          color: #DC2626;
          background-color: rgba(220, 38, 38, 0.08);
        }

        .category-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.6rem;
          padding: 1rem 1.75rem;
          border-top: 1px solid var(--border-light);
          background-color: var(--bg-surface);
        }
      `}</style>
    </div>
  );
};

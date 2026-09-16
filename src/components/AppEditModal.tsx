import React, { useState, useEffect } from 'react';
import { X, Save, Check } from 'lucide-react';
import type { EducationalApp, AppCategory, CategoryMeta } from '../types';

interface AppEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Omit<EducationalApp, 'id' | 'createdAt'>, id?: string) => Promise<void>;
  editTarget: EducationalApp | null;
  categories: CategoryMeta[];
}

const PRESET_THUMBNAILS = [
  { label: '수학·기하', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80' },
  { label: '코딩·화면', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { label: '물리·실험', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80' },
  { label: '화학·원소', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
  { label: '언어·도서', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80' },
  { label: '교실·활동', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80' }
];

export const AppEditModal: React.FC<AppEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editTarget,
  categories
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AppCategory>('math');
  const [targetAudience, setTargetAudience] = useState('초등');
  const [appUrl, setAppUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const validCategories = categories.filter(c => c.id !== 'all');
    const defaultCatId = validCategories.length > 0 ? validCategories[0].id : 'math';

    if (editTarget) {
      setTitle(editTarget.title);
      setSummary(editTarget.summary);
      setDescription(editTarget.description);
      setCategory(editTarget.category);
      setTargetAudience(editTarget.targetAudience);
      setAppUrl(editTarget.appUrl);
      setGithubUrl(editTarget.githubUrl || '');
      setThumbnailUrl(editTarget.thumbnailUrl);
      setTagsInput(editTarget.tags.join(', '));
      setIsFeatured(Boolean(editTarget.isFeatured));
    } else {
      setTitle('');
      setSummary('');
      setDescription('');
      setCategory(defaultCatId);
      setTargetAudience('중등');
      setAppUrl('');
      setGithubUrl('');
      setThumbnailUrl(PRESET_THUMBNAILS[0].url);
      setTagsInput('수학, 시각화, 개념');
      setIsFeatured(false);
    }
  }, [editTarget, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !appUrl.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      await onSave(
        {
          title: title.trim(),
          summary: summary.trim(),
          description: description.trim(),
          category,
          targetAudience,
          appUrl: appUrl.trim(),
          githubUrl: githubUrl.trim() || undefined,
          thumbnailUrl: thumbnailUrl.trim() || PRESET_THUMBNAILS[0].url,
          tags,
          isFeatured
        },
        editTarget?.id
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card edit-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-modal-header">
          <div>
            <h2 className="edit-modal-title">
              {editTarget ? '교육용 웹앱 정보 수정' : '새로운 교육용 웹앱 등록'}
            </h2>
            <p className="edit-modal-subtitle">
              제작한 웹앱의 링크와 교육적 활용 방법을 정리하여 아카이브에 전시합니다.
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="form-grid">
            {/* Title */}
            <div className="form-group span-2">
              <label>웹앱 이름 *</label>
              <input
                type="text"
                placeholder="예: 이차함수 그래프와 꼭짓점 시뮬레이터"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>학습 분야 (카테고리) *</label>
              <select value={category} onChange={e => setCategory(e.target.value as AppCategory)}>
                {categories
                  .filter(c => c.id !== 'all')
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Target Audience */}
            <div className="form-group">
              <label>대상 연령 / 학년 *</label>
              <input
                type="text"
                placeholder="예: 초등 4~6학년, 중등, 고등, 누구나"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                required
              />
            </div>

            {/* App URL */}
            <div className="form-group span-2">
              <label>웹앱 실행 URL (배포된 웹 주소) *</label>
              <input
                type="url"
                placeholder="https://my-app.vercel.app 또는 https://..."
                value={appUrl}
                onChange={e => setAppUrl(e.target.value)}
                required
              />
            </div>

            {/* GitHub URL */}
            <div className="form-group span-2">
              <label>GitHub 저장소 URL (선택 사항)</label>
              <input
                type="url"
                placeholder="https://github.com/my-account/my-educational-app"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
              />
            </div>

            {/* Summary */}
            <div className="form-group span-2">
              <label>한 줄 소개 (카드에 노출) *</label>
              <input
                type="text"
                placeholder="마우스로 계수를 조절하며 포물선의 축과 꼭짓점 이동을 직관적으로 확인합니다."
                value={summary}
                onChange={e => setSummary(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group span-2">
              <label>상세 학습 목표 및 수업 활용 팁</label>
              <textarea
                rows={4}
                placeholder="어떤 개념을 가르치기 위해 만들었는지, 학생들에게 어떻게 조작해보라고 안내하면 좋을지 적어주세요."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Thumbnail URL & Presets */}
            <div className="form-group span-2">
              <label>대표 이미지 URL</label>
              <input
                type="url"
                placeholder="이미지 웹 주소(URL)를 입력하거나 아래 추천 프리셋을 클릭하세요."
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
              />

              {/* Preset Clickers */}
              <div className="preset-row">
                <span className="preset-label">추천 썸네일 프리셋:</span>
                <div className="preset-buttons">
                  {PRESET_THUMBNAILS.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      className={`preset-chip ${thumbnailUrl === p.url ? 'active' : ''}`}
                      onClick={() => setThumbnailUrl(p.url)}
                    >
                      {thumbnailUrl === p.url && <Check size={12} />}
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="form-group span-2">
              <label>검색 태그 (쉼표로 구분)</label>
              <input
                type="text"
                placeholder="기하, 이차함수, 시각화, 수학교과"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
              />
            </div>

            {/* Featured Checkbox */}
            <div className="form-group span-2 checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                />
                <span>메인 화면 '추천 프로젝트' 뱃지 부여</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="edit-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? '저장 중...' : editTarget ? '수정 완료' : '웹앱 등록하기'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .edit-modal-card {
          max-width: 650px;
        }

        .edit-modal-header {
          padding: 1.5rem 1.75rem 1rem 1.75rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-light);
        }

        .edit-modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .edit-modal-subtitle {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .edit-modal-form {
          padding: 1.5rem 1.75rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .span-2 {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .preset-row {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .preset-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .preset-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          padding: 0.2rem 0.55rem;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xs);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .preset-chip:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }

        .preset-chip.active {
          background-color: var(--accent-light);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          font-weight: 600;
        }

        .checkbox-group {
          padding: 0.5rem 0;
        }

        .checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.88rem;
          color: var(--text-primary);
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: var(--accent-primary);
        }

        .edit-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-light);
        }
      `}</style>
    </div>
  );
};

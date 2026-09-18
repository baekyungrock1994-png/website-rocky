import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Check, Upload, Image as ImageIcon, Link as LinkIcon, Camera, Trash2 } from 'lucide-react';
import type { EducationalApp, AppCategory, CategoryMeta } from '../types';

interface AppEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Omit<EducationalApp, 'id' | 'createdAt'>, id?: string) => Promise<void>;
  editTarget: EducationalApp | null;
  categories: CategoryMeta[];
}

const PRESET_THUMBNAILS = [
  { label: '도덕·사회', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80' },
  { label: '인문·교양', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' },
  { label: '사회·역사', url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80' },
  { label: '수학·기하', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80' },
  { label: '과학·실험', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
  { label: '코딩·화면', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { label: '예술·창의', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80' },
  { label: '교실·도구', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80' }
];

// 스크린샷 및 업로드 이미지 최적화 (Canvas 리사이징 + WebP/JPEG 압축)
const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('이미지 파일(PNG, JPG, WebP 등)만 선택할 수 있습니다.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 750;
        let { width, height } = img;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const webpData = canvas.toDataURL('image/webp', 0.85);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // WebP 미지원 시 JPEG 대체
        }

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('이미지를 불러오는데 실패했습니다.'));
      img.src = result;
    };
    reader.onerror = () => reject(new Error('파일을 읽는데 실패했습니다.'));
    reader.readAsDataURL(file);
  });
};

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

  // 썸네일 업로드 / 드래그 / 붙여넣기 상태
  const [isDragging, setIsDragging] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 처리 핸들러
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      setProcessingImage(true);
      const dataUrl = await processImageFile(file);
      setThumbnailUrl(dataUrl);
    } catch (err: any) {
      alert(err.message || '이미지 처리에 실패했습니다.');
    } finally {
      setProcessingImage(false);
    }
  };

  // 클립보드 이미지 붙여넣기 (Ctrl + V) 리스너
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            try {
              setProcessingImage(true);
              const dataUrl = await processImageFile(file);
              setThumbnailUrl(dataUrl);
            } catch (err: any) {
              alert(err.message || '붙여넣은 이미지 처리에 실패했습니다.');
            } finally {
              setProcessingImage(false);
            }
            return;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

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
      setShowUrlInput(Boolean(editTarget.thumbnailUrl && !editTarget.thumbnailUrl.startsWith('data:')));
    } else {
      setTitle('');
      setSummary('');
      setDescription('');
      setCategory(defaultCatId);
      setTargetAudience('중등');
      setAppUrl('');
      setGithubUrl('');
      setThumbnailUrl(PRESET_THUMBNAILS[0].url);
      setTagsInput('도덕, 수업도구, 인터랙티브');
      setIsFeatured(false);
      setShowUrlInput(false);
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

            {/* Thumbnail Upload & Presets */}
            <div className="form-group span-2">
              <div className="thumbnail-header-row">
                <label>대표 썸네일 이미지</label>
                <button
                  type="button"
                  className="btn-text-toggle"
                  onClick={() => setShowUrlInput(prev => !prev)}
                >
                  <LinkIcon size={12} />
                  <span>{showUrlInput ? '직접 URL 입력 닫기' : '웹 URL 직접 입력'}</span>
                </button>
              </div>

              {/* Drag & Drop / Upload / Preview Box */}
              <div
                className={`thumbnail-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFiles(e.dataTransfer.files);
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleFiles(e.target.files)}
                />

                {/* Left: Thumbnail Preview */}
                <div className="thumbnail-preview-container">
                  {thumbnailUrl ? (
                    <div className="thumbnail-preview-wrapper">
                      <img src={thumbnailUrl} alt="썸네일 미리보기" className="thumbnail-preview-img" />
                      <div className="preview-overlay">
                        <button
                          type="button"
                          className="btn-overlay-action"
                          onClick={() => fileInputRef.current?.click()}
                          title="다른 스크린샷/파일 선택"
                        >
                          <Upload size={13} />
                          <span>변경</span>
                        </button>
                        <button
                          type="button"
                          className="btn-overlay-action danger"
                          onClick={() => setThumbnailUrl('')}
                          title="이미지 삭제"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="thumbnail-empty-placeholder"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={28} className="empty-icon" />
                      <span className="empty-text">이미지 없음</span>
                    </div>
                  )}
                </div>

                {/* Right: Actions & Paste guide */}
                <div className="thumbnail-upload-actions">
                  <div className="action-buttons-row">
                    <button
                      type="button"
                      className="btn-upload-file"
                      disabled={processingImage}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      <span>{processingImage ? '이미지 최적화 중...' : '스크린샷 / 파일 선택'}</span>
                    </button>
                  </div>

                  <div className="paste-hint-box">
                    <div className="paste-hint-pill">
                      <Camera size={13} />
                      <span><b>[Ctrl + V]</b> 화면 캡쳐 후 바로 붙여넣기</span>
                    </div>
                    <span className="drop-hint-text">또는 이미지 파일을 여기로 드래그하세요</span>
                  </div>
                </div>
              </div>

              {/* Optional Direct URL Input */}
              {showUrlInput && (
                <div className="url-input-wrapper">
                  <input
                    type="url"
                    placeholder="이미지 웹 주소(https://...)를 직접 입력하세요"
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                    className="direct-url-input"
                  />
                </div>
              )}

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
                placeholder="도덕, 수업도구, 시각화, 탐구활동"
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

        .thumbnail-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-text-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          padding: 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.15s;
        }

        .btn-text-toggle:hover {
          color: var(--accent-primary);
        }

        .thumbnail-dropzone {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 0.85rem;
          background-color: var(--bg-subtle);
          border: 1.5px dashed var(--border-light);
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }

        .thumbnail-dropzone.dragging {
          border-color: var(--accent-primary);
          background-color: var(--accent-light);
        }

        .thumbnail-preview-container {
          width: 145px;
          height: 92px;
          flex-shrink: 0;
          border-radius: var(--radius-xs);
          overflow: hidden;
          background-color: var(--bg-card);
          border: 1px solid var(--border-light);
          position: relative;
        }

        .thumbnail-preview-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .thumbnail-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .thumbnail-preview-wrapper:hover .preview-overlay {
          opacity: 1;
        }

        .btn-overlay-action {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.3rem 0.5rem;
          font-size: 0.72rem;
          font-weight: 600;
          background: white;
          color: #111;
          border: none;
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: transform 0.1s;
        }

        .btn-overlay-action:hover {
          transform: scale(1.05);
        }

        .btn-overlay-action.danger {
          background: #fee2e2;
          color: #ef4444;
        }

        .thumbnail-empty-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          color: var(--text-muted);
          cursor: pointer;
        }

        .empty-icon {
          opacity: 0.6;
        }

        .empty-text {
          font-size: 0.72rem;
        }

        .thumbnail-upload-actions {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .btn-upload-file {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          background-color: var(--accent-primary);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: opacity 0.15s;
          width: fit-content;
        }

        .btn-upload-file:hover {
          opacity: 0.9;
        }

        .btn-upload-file:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .paste-hint-box {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .paste-hint-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          color: var(--accent-primary);
          background-color: var(--accent-light);
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          width: fit-content;
        }

        .drop-hint-text {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .url-input-wrapper {
          margin-top: 0.35rem;
        }

        .direct-url-input {
          font-size: 0.8rem;
          padding: 0.45rem 0.75rem;
        }

        @media (max-width: 520px) {
          .thumbnail-dropzone {
            flex-direction: column;
            align-items: stretch;
          }
          .thumbnail-preview-container {
            width: 100%;
            height: 130px;
          }
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

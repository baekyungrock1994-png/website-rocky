import React, { useState } from 'react';
import { X, KeyRound, Sparkles } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  if (!isOpen) return null;

  // Supabase Auth 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      // Supabase 미연결 상태일 경우: 로컬 데모 계정으로 자동 로그인
      handleDemoLogin(email.includes('admin'));
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        setSuccessMsg('가입 확인 이메일이 발송되었습니다. 메일함을 확인해주세요.');
        if (data.user) {
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
          onLoginSuccess({
            id: data.user.id,
            email: data.user.email || email,
            isAdmin: Boolean(adminEmail && data.user.email === adminEmail)
          });
          setTimeout(onClose, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
          onLoginSuccess({
            id: data.user.id,
            email: data.user.email || email,
            isAdmin: Boolean(adminEmail && data.user.email === adminEmail)
          });
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || '인증 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth 로그인
  const handleGithubLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      handleDemoLogin(true);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'GitHub 로그인 중 오류가 발생했습니다.');
    }
  };

  // 데모 계정 즉시 로그인 (Supabase 키 세팅 전 테스트용)
  const handleDemoLogin = (asAdmin: boolean) => {
    onLoginSuccess({
      id: asAdmin ? 'demo-admin-id' : 'demo-user-id',
      email: asAdmin ? 'creator@rockylabs.edu' : 'student@rockylabs.edu',
      isAdmin: asAdmin,
      name: asAdmin ? 'Rocky (제작자)' : '체험 학습자'
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card auth-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-badge">
            <KeyRound size={16} />
            <span>{isSignUp ? '계정 생성' : '로그인'}</span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        <div className="auth-modal-body">
          <h2 className="auth-title">
            {isSignUp ? 'Rocky Labs에 오신 것을 환영합니다' : '계정에 로그인하세요'}
          </h2>
          <p className="auth-subtitle">
            로그인하면 관심 있는 교육용 웹앱을 즐겨찾기에 담고, 관리자는 새로운 앱을 등록 및 수정할 수 있습니다.
          </p>

          {/* Notice if Supabase not configured */}
          {!isSupabaseConfigured && (
            <div className="offline-notice">
              <div className="notice-header">
                <Sparkles size={16} className="notice-icon" />
                <span className="notice-title">Supabase 키 입력 전 데모 모드</span>
              </div>
              <p className="notice-desc">
                아직 <code>.env</code> 파일에 Supabase 키를 입력하지 않았어도 데모 계정으로 웹사이트의 모든 기능을 바로 체험해보실 수 있습니다.
              </p>
              <div className="demo-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm demo-btn"
                  onClick={() => handleDemoLogin(true)}
                >
                  제작자(관리자) 모드로 즉시 시작
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm demo-btn"
                  onClick={() => handleDemoLogin(false)}
                >
                  일반 방문자로 시작
                </button>
              </div>
            </div>
          )}

          {/* Social Login Button */}
          <button
            type="button"
            className="btn btn-secondary social-auth-btn"
            onClick={handleGithubLogin}
          >
            <GithubIcon size={18} />
            <span>GitHub 계정으로 계속하기</span>
          </button>

          <div className="auth-divider">
            <span>또는 이메일로 계속하기</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {errorMsg && <div className="auth-message error">{errorMsg}</div>}
            {successMsg && <div className="auth-message success">{successMsg}</div>}

            <div className="form-group">
              <label htmlFor="email">이메일 주소</label>
              <input
                id="email"
                type="email"
                placeholder="teacher@school.kr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                placeholder="6자리 이상 입력"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-auth-btn"
              disabled={loading}
            >
              {loading ? '처리 중...' : isSignUp ? '가입하기' : '로그인'}
            </button>
          </form>

          {/* Toggle SignUp/SignIn */}
          <div className="auth-footer-toggle">
            {isSignUp ? (
              <span>
                이미 계정이 있으신가요?{' '}
                <button type="button" onClick={() => setIsSignUp(false)} className="link-btn">
                  로그인하기
                </button>
              </span>
            ) : (
              <span>
                새로운 계정이 필요하신가요?{' '}
                <button type="button" onClick={() => setIsSignUp(true)} className="link-btn">
                  회원가입하기
                </button>
              </span>
            )}
          </div>

          {/* Supabase Connection Setup Guide Toggle */}
          <div className="guide-toggle-box">
            <button
              type="button"
              className="guide-toggle-btn"
              onClick={() => setShowConfigHelp(v => !v)}
            >
              <span>{showConfigHelp ? '▲ Supabase 연동 가이드 접기' : '▼ 내 Supabase와 연동하는 방법 보기'}</span>
            </button>
            {showConfigHelp && (
              <div className="guide-content">
                <ol>
                  <li><a href="https://supabase.com" target="_blank" rel="noreferrer">Supabase</a>에서 새 프로젝트 생성</li>
                  <li>프로젝트 내 <code>supabase/schema.sql</code> 파일을 SQL Editor에 복사 후 <b>Run</b> 실행</li>
                  <li><code>Project Settings → API</code>에서 <code>Project URL</code>과 <code>anon public key</code> 복사</li>
                  <li>프로젝트 루트의 <code>.env.example</code> 파일을 복사하여 <code>.env</code> 파일 생성 후 값 입력</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .auth-modal-card {
          max-width: 460px;
        }

        .auth-modal-header {
          padding: 1.25rem 1.5rem 0.5rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-primary);
          background-color: var(--accent-light);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .auth-modal-body {
          padding: 1rem 1.5rem 1.75rem 1.5rem;
        }

        .auth-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }

        .auth-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .offline-notice {
          background-color: var(--bg-subtle);
          border: 1px dashed var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 0.9rem;
          margin-bottom: 1.25rem;
        }

        .notice-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .notice-icon {
          color: var(--accent-warm);
        }

        .notice-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 0.75rem;
        }

        .demo-actions {
          display: flex;
          gap: 0.5rem;
        }

        .demo-btn {
          flex: 1;
        }

        .social-auth-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1rem;
          font-weight: 600;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.25rem 0;
          color: var(--text-muted);
          font-size: 0.78rem;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-light);
        }

        .auth-divider span {
          padding: 0 0.75rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .submit-auth-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .auth-message {
          padding: 0.6rem 0.8rem;
          border-radius: var(--radius-xs);
          font-size: 0.82rem;
        }

        .auth-message.error {
          background-color: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
        }

        .auth-message.success {
          background-color: #F0FDF4;
          color: #16A34A;
          border: 1px solid #BBF7D0;
        }

        .auth-footer-toggle {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.84rem;
          color: var(--text-secondary);
        }

        .link-btn {
          color: var(--accent-primary);
          font-weight: 700;
          text-decoration: underline;
        }

        .guide-toggle-box {
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
        }

        .guide-toggle-btn {
          font-size: 0.78rem;
          color: var(--text-muted);
          width: 100%;
          text-align: left;
        }

        .guide-toggle-btn:hover {
          color: var(--text-primary);
        }

        .guide-content {
          margin-top: 0.6rem;
          padding: 0.75rem;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-xs);
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .guide-content ol {
          padding-left: 1.2rem;
          line-height: 1.6;
        }

        .guide-content a {
          color: var(--accent-primary);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

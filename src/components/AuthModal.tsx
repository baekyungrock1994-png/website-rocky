import React, { useState } from 'react';
import { X, KeyRound } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { supabase, isSupabaseConfigured, isUserAdmin } from '../lib/supabase';
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
      setErrorMsg('데이터베이스(Supabase)가 아직 연결되지 않았습니다. 환경 변수 등록 및 재배포 상태를 확인해주세요.');
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
        
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            isAdmin: isUserAdmin(data.user.email || email)
          };
          onLoginSuccess(profile);
          setSuccessMsg('회원가입이 완료되었습니다!');
          setTimeout(onClose, 800);
        } else {
          setSuccessMsg('가입 확인 이메일이 발송되었습니다. 메일함을 확인해주세요.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            isAdmin: isUserAdmin(data.user.email || email)
          };
          onLoginSuccess(profile);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || '인증 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth 로그인
  const handleGithubLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('데이터베이스(Supabase)가 아직 연결되지 않았습니다.');
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
                placeholder="baekyungrock@gmail.com"
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
        </div>
      </div>

      <style>{`
        .auth-modal-card {
          max-width: 440px;
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
      `}</style>
    </div>
  );
};

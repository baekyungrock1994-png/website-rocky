import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { AppCard } from './components/AppCard';
import { AppDetailModal } from './components/AppDetailModal';
import { AuthModal } from './components/AuthModal';
import { AppEditModal } from './components/AppEditModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { Footer } from './components/Footer';
import type { EducationalApp, AppCategory, UserProfile, CategoryMeta } from './types';
import {
  getEducationalApps,
  saveNewApp,
  updateExistingApp,
  removeApp,
  getLocalBookmarks,
  toggleLocalBookmark,
  getCustomCategories,
  updateCategoriesList,
  supabase,
  isSupabaseConfigured,
  isUserAdmin
} from './lib/supabase';
import { CATEGORIES } from './lib/mockData';
import { Plus, Compass } from 'lucide-react';

export const App: React.FC = () => {
  // Data & Auth state
  const [apps, setApps] = useState<EducationalApp[]>([]);
  const [categories, setCategories] = useState<CategoryMeta[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rocky_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Filtering state
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('전체 대상');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  // Modal states
  const [detailApp, setDetailApp] = useState<EducationalApp | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editTargetApp, setEditTargetApp] = useState<EducationalApp | null>(null);

  // Load apps & bookmarks & categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [appList, catList] = await Promise.all([
          getEducationalApps(),
          getCustomCategories()
        ]);
        setApps(appList);
        setCategories(catList);
        setBookmarks(getLocalBookmarks());
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Supabase Auth listener
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: isUserAdmin(session.user.email)
          };
          setUser(profile);
          localStorage.setItem('rocky_current_user', JSON.stringify(profile));
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: isUserAdmin(session.user.email)
          };
          setUser(profile);
          localStorage.setItem('rocky_current_user', JSON.stringify(profile));
        } else {
          setUser(null);
          localStorage.removeItem('rocky_current_user');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Save or Edit App handler
  const handleSaveApp = async (appData: Omit<EducationalApp, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      // Update
      const existing = apps.find(a => a.id === id);
      if (!existing) return;
      const updated: EducationalApp = {
        ...existing,
        ...appData
      };
      await updateExistingApp(updated);
      setApps(prev => prev.map(a => (a.id === id ? updated : a)));
    } else {
      // Create new
      const created = await saveNewApp({
        ...appData,
        authorEmail: user?.email || 'admin@rockylabs.edu'
      });
      setApps(prev => [created, ...prev]);
    }
  };

  // Delete App handler
  const handleDeleteApp = async (id: string) => {
    await removeApp(id);
    setApps(prev => prev.filter(a => a.id !== id));
    if (detailApp?.id === id) setDetailApp(null);
  };

  // Bookmark handler
  const handleToggleBookmark = (id: string) => {
    const updated = toggleLocalBookmark(id);
    setBookmarks(updated);
  };

  // Category save handler
  const handleSaveCategories = async (updated: CategoryMeta[]) => {
    await updateCategoriesList(updated);
    setCategories(updated);
  };

  // Login handler
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('rocky_current_user', JSON.stringify(profile));
  };

  // Logout handler
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('rocky_current_user');
  };

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      // Category filter
      if (selectedCategory !== 'all' && app.category !== selectedCategory) {
        return false;
      }

      // Audience filter
      if (selectedAudience !== '전체 대상' && !app.targetAudience.includes(selectedAudience)) {
        return false;
      }

      // Bookmark filter
      if (onlyBookmarks && !bookmarks.includes(app.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = app.title.toLowerCase().includes(q);
        const matchesSummary = app.summary.toLowerCase().includes(q);
        const matchesTags = app.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [apps, selectedCategory, selectedAudience, onlyBookmarks, bookmarks, searchQuery]);

  return (
    <div className="app-root">
      {/* Navigation */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCreate={() => {
          setEditTargetApp(null);
          setIsEditModalOpen(true);
        }}
      />

      {/* Hero Banner */}
      <Hero
        totalApps={apps.length}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAudience={selectedAudience}
        onSelectAudience={setSelectedAudience}
        onlyBookmarks={onlyBookmarks}
        onToggleBookmarks={() => setOnlyBookmarks(b => !b)}
        bookmarkCount={bookmarks.length}
        totalFiltered={filteredApps.length}
        isAdmin={Boolean(user?.isAdmin)}
        onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
      />

      {/* Main Apps Grid Section */}
      <main className="container main-content-area">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>교육용 웹앱을 불러오는 중입니다...</span>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="apps-grid">
            {filteredApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                isBookmarked={bookmarks.includes(app.id)}
                onToggleBookmark={handleToggleBookmark}
                onSelectApp={setDetailApp}
                isAdmin={Boolean(user?.isAdmin)}
                onEditApp={appToEdit => {
                  setEditTargetApp(appToEdit);
                  setIsEditModalOpen(true);
                }}
                onDeleteApp={handleDeleteApp}
                categories={categories}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Compass size={32} />
            </div>
            <h3 className="empty-title">일치하는 교육용 웹앱이 없습니다</h3>
            <p className="empty-desc">
              선택한 카테고리나 검색어에 맞는 웹앱이 없습니다. 검색어를 변경하거나 필터를 초기화해 보세요.
            </p>
            {user?.isAdmin && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditTargetApp(null);
                  setIsEditModalOpen(true);
                }}
              >
                <Plus size={16} />
                <span>새로운 웹앱 등록하기</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AppDetailModal
        app={detailApp}
        onClose={() => setDetailApp(null)}
        isBookmarked={detailApp ? bookmarks.includes(detailApp.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AppEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditTargetApp(null);
        }}
        onSave={handleSaveApp}
        editTarget={editTargetApp}
        categories={categories}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSaveCategories={handleSaveCategories}
      />

      {/* Footer */}
      <Footer />

      <style>{`
        .app-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content-area {
          flex: 1;
          padding-top: 2.25rem;
          padding-bottom: 2.5rem;
        }

        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.75rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 1rem;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border-medium);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 1.5rem;
          background-color: var(--bg-surface);
          border: 1px dashed var(--border-medium);
          border-radius: var(--radius-md);
          max-width: 580px;
          margin: 2rem auto;
        }

        .empty-state-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--bg-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.2rem;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }

        .empty-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .apps-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;

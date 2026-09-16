import { createClient } from '@supabase/supabase-js';
import type { EducationalApp, CategoryMeta } from '../types';
import { INITIAL_APPS, CATEGORIES } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-ref.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 관리자 이메일 목록 (사용자 지정 이메일 및 환경변수)
export const ADMIN_EMAILS: string[] = [
  'baekyungrock@gmail.com',
  'baekyungrock1994@gmail.com',
  ...(import.meta.env.VITE_ADMIN_EMAIL
    ? import.meta.env.VITE_ADMIN_EMAIL.split(',').map((e: string) => e.trim().toLowerCase())
    : [])
];

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some(admin => admin.toLowerCase() === normalized);
};

const STORAGE_KEY = 'rocky_custom_apps_v1';
const BOOKMARKS_KEY = 'rocky_user_bookmarks_v1';
const CATEGORIES_KEY = 'rocky_custom_categories_v1';

// 로컬 스토리지 헬퍼 (Supabase 미연결 시 오프라인/체험용)
function getLocalApps(): EducationalApp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPS));
      return INITIAL_APPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local apps:', e);
    return INITIAL_APPS;
  }
}

function saveLocalApps(apps: EducationalApp[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

// 앱 목록 가져오기
export async function getEducationalApps(): Promise<EducationalApp[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('educational_apps')
        .select('*')
        .order('order_num', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          description: item.description || '',
          category: item.category,
          targetAudience: item.target_grade || '누구나',
          appUrl: item.app_url,
          githubUrl: item.github_url || '',
          thumbnailUrl: item.thumbnail_url || '',
          tags: item.tags || [],
          isFeatured: item.is_featured || false,
          orderIndex: item.order_num || 0,
          createdAt: item.created_at,
          authorEmail: item.author_email || ''
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local dataset:', err);
    }
  }

  return getLocalApps();
}

// 새 앱 추가
export async function saveNewApp(app: Omit<EducationalApp, 'id' | 'createdAt'>): Promise<EducationalApp> {
  const newApp: EducationalApp = {
    ...app,
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('educational_apps')
        .insert([
          {
            title: newApp.title,
            summary: newApp.summary,
            description: newApp.description,
            category: newApp.category,
            target_grade: newApp.targetAudience,
            app_url: newApp.appUrl,
            github_url: newApp.githubUrl,
            thumbnail_url: newApp.thumbnailUrl,
            tags: newApp.tags,
            is_featured: newApp.isFeatured,
            order_num: newApp.orderIndex || 0,
            author_email: newApp.authorEmail
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          title: data.title,
          summary: data.summary,
          description: data.description || '',
          category: data.category,
          targetAudience: data.target_grade || '누구나',
          appUrl: data.app_url,
          githubUrl: data.github_url || '',
          thumbnailUrl: data.thumbnail_url || '',
          tags: data.tags || [],
          isFeatured: data.is_featured || false,
          orderIndex: data.order_num || 0,
          createdAt: data.created_at,
          authorEmail: data.author_email
        };
      }
    } catch (err) {
      console.error('Supabase insert failed:', err);
    }
  }

  // Fallback / Local
  const localList = getLocalApps();
  const updated = [newApp, ...localList];
  saveLocalApps(updated);
  return newApp;
}

// 앱 수정
export async function updateExistingApp(app: EducationalApp): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('educational_apps')
        .update({
          title: app.title,
          summary: app.summary,
          description: app.description,
          category: app.category,
          target_grade: app.targetAudience,
          app_url: app.appUrl,
          github_url: app.githubUrl,
          thumbnail_url: app.thumbnailUrl,
          tags: app.tags,
          is_featured: app.isFeatured,
          order_num: app.orderIndex || 0
        })
        .eq('id', app.id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase update failed:', err);
    }
  }

  const localList = getLocalApps();
  const updated = localList.map(item => (item.id === app.id ? app : item));
  saveLocalApps(updated);
  return true;
}

// 앱 삭제
export async function removeApp(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('educational_apps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase delete failed:', err);
    }
  }

  const localList = getLocalApps();
  const updated = localList.filter(item => item.id !== id);
  saveLocalApps(updated);
  return true;
}

// 북마크 로컬/원격 관리
export function getLocalBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLocalBookmark(appId: string): string[] {
  const current = getLocalBookmarks();
  let updated: string[];
  if (current.includes(appId)) {
    updated = current.filter(id => id !== appId);
  } else {
    updated = [...current, appId];
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
}

// 카테고리 목록 불러오기 (Supabase 또는 로컬 스토리지)
export async function getCustomCategories(): Promise<CategoryMeta[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('app_categories')
        .select('*')
        .order('order_num', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          label: item.label,
          description: item.description || '',
          iconName: item.icon_name || 'Layers'
        }));
      }
    } catch (e) {
      console.warn('Failed to load categories from Supabase, using local fallback:', e);
    }
  }

  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local categories:', e);
  }

  return CATEGORIES;
}

// 카테고리 목록 업데이트 (선생님/관리자 전용)
export async function updateCategoriesList(categories: CategoryMeta[]): Promise<boolean> {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));

  if (isSupabaseConfigured && supabase) {
    try {
      const rows = categories.map((cat, idx) => ({
        id: cat.id,
        label: cat.label,
        description: cat.description || '',
        icon_name: cat.iconName || 'Layers',
        order_num: idx
      }));

      const { error } = await supabase.from('app_categories').upsert(rows);
      if (error) console.warn('Supabase categories upsert error:', error);
    } catch (e) {
      console.error('Supabase categories update failed:', e);
    }
  }

  return true;
}

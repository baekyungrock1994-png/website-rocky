export type AppCategory = string;

export interface EducationalApp {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: AppCategory;
  targetAudience: string;
  appUrl: string;
  githubUrl?: string;
  thumbnailUrl: string;
  tags: string[];
  isFeatured?: boolean;
  orderIndex?: number;
  createdAt?: string;
  authorEmail?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  isAdmin: boolean;
  name?: string;
}

export interface CategoryMeta {
  id: string;
  label: string;
  description?: string;
  iconName?: string;
}

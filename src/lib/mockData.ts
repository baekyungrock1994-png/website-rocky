import type { EducationalApp, CategoryMeta } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'all', label: '전체 보기', description: '모든 교육용 웹앱을 탐색합니다', iconName: 'Layers' },
  { id: 'math', label: '도덕 수업 프로그램', description: '도덕 수업에서 사용할 수 있는 웹앱 프로그램', iconName: 'BookOpen' },
  { id: 'coding', label: '기타 과목 프로그램', description: '도덕 이외 교과에서 사용할 수 있는 수업 도구', iconName: 'Globe' },
  { id: 'creative', label: '수업 도구', description: '각종 수업에서 사용할 수 있는 편의 도구', iconName: 'Wrench' },
  { id: 'tool', label: '재미있는 프로그램들', description: '수업 이외에 주인장이 만든 재미있는 도구들', iconName: 'Music' }
];

export const INITIAL_APPS: EducationalApp[] = [];


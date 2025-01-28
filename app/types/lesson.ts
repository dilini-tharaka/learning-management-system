export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'Published' | 'Draft';
  updatedDays: number;
}

export type LessonFilters = {
  search: string;
  status: 'all' | 'Published' | 'Draft';
  level: 'all' | 'Beginner' | 'Intermediate' | 'Advanced';
  sort: 'newest' | 'oldest' | 'duration' | 'alpha';
};

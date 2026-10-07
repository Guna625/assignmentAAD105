export type PageId =
  | 'student-form'
  | 'mongodb-guide'
  | 'string-combiner'
  | 'multimedia'
  | 'weather'
  | 'interactive';

export type Version = 'mine' | 'friend';

export interface NavItem {
  id: PageId;
  label: string;
  question: string;
  icon: string;
  description: string;
}

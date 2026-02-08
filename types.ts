
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export enum DocCategory {
  SOP_EVENT = 'SOP Event Kreatif',
  AD_ART = 'AD/ART',
  GBHKO = 'GBHKO',
  LAPORAN = 'Laporan Kerjasama',
  BEST_PRACTICE = 'Best Practices'
}

export interface Document {
  id: string;
  title: string;
  category: DocCategory;
  uploader: string;
  date: string;
  summary: string;
  content: string; // Simulated content for AI context
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ROIStat {
  metric: string;
  before: string;
  after: string;
}

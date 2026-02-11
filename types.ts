
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum DocCategory {
  ALL = 'Semua',
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
  content: string; 
  views: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AnalyticsData {
  name: string;
  value: number;
}


export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum TVETLevel {
  ARTISAN = 'Artisan',
  CERTIFICATE = 'Certificate',
  DIPLOMA = 'Diploma',
  HIGHER_DIPLOMA = 'Higher Diploma'
}

export enum TVETCategory {
  ENGINEERING = 'Engineering',
  BUSINESS = 'Business',
  HOSPITALITY = 'Hospitality',
  ICT = 'ICT',
  AGRICULTURE = 'Agriculture',
  BUILDING = 'Building & Civil'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  institution?: string;
  courseTrack?: TVETCategory;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  price: number;
  sellerId: string;
  sellerName: string;
  category: TVETCategory;
  level: TVETLevel;
  fileType: 'PDF' | 'DOCX' | 'ZIP';
  thumbnailUrl: string;
  rating: number;
  salesCount: number;
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  resourceId: string;
  buyerName: string;
  amount: number;
  date: string;
}

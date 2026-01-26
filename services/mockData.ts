
import { Resource, TVETCategory, TVETLevel } from '../types';

export const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Thermodynamics Engineering Notes',
    description: 'Comprehensive notes covering the first law, second law, and entropy for diploma students.',
    price: 450,
    sellerId: 's1',
    sellerName: 'Eng. Maina',
    category: TVETCategory.ENGINEERING,
    level: TVETLevel.DIPLOMA,
    fileType: 'PDF',
    thumbnailUrl: 'https://picsum.photos/seed/mech/400/300',
    rating: 4.8,
    salesCount: 124,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Financial Accounting I Schemes',
    description: 'Weekly schemes of work for the Certificate in Business Management course.',
    price: 300,
    sellerId: 's2',
    sellerName: 'Zetech Institute',
    category: TVETCategory.BUSINESS,
    level: TVETLevel.CERTIFICATE,
    fileType: 'DOCX',
    thumbnailUrl: 'https://picsum.photos/seed/biz/400/300',
    rating: 4.5,
    salesCount: 89,
    createdAt: '2024-02-10'
  },
  {
    id: '3',
    title: 'Introduction to Networking (Artisan)',
    description: 'Foundational networking concepts simplified for artisan level students.',
    price: 200,
    sellerId: 's3',
    sellerName: 'TechVibe Academy',
    category: TVETCategory.ICT,
    level: TVETLevel.ARTISAN,
    fileType: 'ZIP',
    thumbnailUrl: 'https://picsum.photos/seed/ict/400/300',
    rating: 4.2,
    salesCount: 45,
    createdAt: '2024-03-05'
  },
  {
    id: '4',
    title: 'Advanced Culinary Arts Portfolio',
    description: 'Step-by-step lesson plans for practical cooking and hospitality management.',
    price: 600,
    sellerId: 's4',
    sellerName: 'Chef Otieno',
    category: TVETCategory.HOSPITALITY,
    level: TVETLevel.DIPLOMA,
    fileType: 'PDF',
    thumbnailUrl: 'https://picsum.photos/seed/food/400/300',
    rating: 4.9,
    salesCount: 210,
    createdAt: '2023-12-20'
  },
  {
    id: '5',
    title: 'Farm Machinery Maintenance Guide',
    description: 'Safety protocols and maintenance schedules for tractor components.',
    price: 350,
    sellerId: 's1',
    sellerName: 'Eng. Maina',
    category: TVETCategory.AGRICULTURE,
    level: TVETLevel.CERTIFICATE,
    fileType: 'PDF',
    thumbnailUrl: 'https://picsum.photos/seed/agri/400/300',
    rating: 4.7,
    salesCount: 67,
    createdAt: '2024-04-01'
  }
];

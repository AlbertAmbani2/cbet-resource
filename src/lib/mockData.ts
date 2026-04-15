// Mock data for Phase 1 MVP
// This will be replaced with real API calls in Phase 2+

export type Resource = {
  id: string
  title: string
  description: string
  department: string
  resourceType: 'lesson_plan' | 'notes' | 'scheme_of_work' | 'assessment' | 'activity_guide'
  cbetUnits: string[]
  trainerName: string
  trainerId: string
  downloadCount: number
  rating: number
  reviewCount: number
  approvedDate: string
  isVerified: boolean
}

export type Department = {
  id: string
  name: string
  icon: string
  resourceCount: number
  trainerCount: number
  sampleTopics: string[]
}

export type Trainer = {
  id: string
  name: string
  email: string
  department: string
  bio: string
  verifiedBadge: boolean
  yearsActive: number
  totalUploads: number
  totalDownloads: number
  avgRating: number
}

// ============================================================================
// DEPARTMENTS
// ============================================================================

export const departments: Department[] = [
  {
    id: 'ict',
    name: 'Information & Communication Technology',
    icon: '💻',
    resourceCount: 8,
    trainerCount: 3,
    sampleTopics: ['HTML/CSS', 'Networking', 'Database Design'],
  },
  {
    id: 'business',
    name: 'Business & Entrepreneurship',
    icon: '💼',
    resourceCount: 6,
    trainerCount: 2,
    sampleTopics: ['Accounting', 'Business Planning', 'Finance'],
  },
  {
    id: 'automotive',
    name: 'Automotive Technology',
    icon: '🚗',
    resourceCount: 4,
    trainerCount: 2,
    sampleTopics: ['Engine Mechanics', 'Diagnostics', 'Maintenance'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    icon: '🏨',
    resourceCount: 3,
    trainerCount: 1,
    sampleTopics: ['Front Office', 'Kitchen Operations', 'Customer Service'],
  },
  {
    id: 'construction',
    name: 'Construction & Civil Engineering',
    icon: '🏗️',
    resourceCount: 3,
    trainerCount: 1,
    sampleTopics: ['CAD Design', 'Building Materials', 'Site Management'],
  },
  {
    id: 'cosmetology',
    name: 'Cosmetology & Beauty',
    icon: '💅',
    resourceCount: 2,
    trainerCount: 1,
    sampleTopics: ['Hair Care', 'Skin Care', 'Makeup'],
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Agribusiness',
    icon: '🌾',
    resourceCount: 2,
    trainerCount: 1,
    sampleTopics: ['Crop Farming', 'Animal Husbandry', 'Agribusiness'],
  },
  {
    id: 'health',
    name: 'Health & Social Services',
    icon: '⚕️',
    resourceCount: 2,
    trainerCount: 1,
    sampleTopics: ['First Aid', 'Nursing Basics', 'Health & Safety'],
  },
]

// ============================================================================
// TRAINERS
// ============================================================================

export const trainers: Trainer[] = [
  {
    id: 'trainer_1',
    name: 'Albert Kiprotich',
    email: 'albert.k@tvet.edu',
    department: 'Information & Communication Technology',
    bio: 'Web development and networking specialist with 5 years experience',
    verifiedBadge: true,
    yearsActive: 5,
    totalUploads: 8,
    totalDownloads: 142,
    avgRating: 4.3,
  },
  {
    id: 'trainer_2',
    name: 'Jane Wanjiru',
    email: 'jane.w@business-tvet.ke',
    department: 'Business & Entrepreneurship',
    bio: 'Accounting and business management trainer for 3 years',
    verifiedBadge: true,
    yearsActive: 3,
    totalUploads: 6,
    totalDownloads: 98,
    avgRating: 4.2,
  },
  {
    id: 'trainer_3',
    name: 'Moses Kipchoge',
    email: 'moses.m@auto-tvet.org',
    department: 'Automotive Technology',
    bio: 'Engine mechanics and diagnostics expert with 7 years in the field',
    verifiedBadge: true,
    yearsActive: 7,
    totalUploads: 4,
    totalDownloads: 67,
    avgRating: 4.4,
  },
  {
    id: 'trainer_4',
    name: 'Sarah Mwangi',
    email: 'sarah.m@hospitality-tvet.ke',
    department: 'Hospitality & Tourism',
    bio: 'Front office and customer service specialist',
    verifiedBadge: false,
    yearsActive: 4,
    totalUploads: 3,
    totalDownloads: 45,
    avgRating: 4.0,
  },
  {
    id: 'trainer_5',
    name: 'David Ochieng',
    email: 'david.o@construct-tvet.ke',
    department: 'Construction & Civil Engineering',
    bio: 'CAD and building design trainer',
    verifiedBadge: false,
    yearsActive: 6,
    totalUploads: 3,
    totalDownloads: 38,
    avgRating: 3.9,
  },
]

// ============================================================================
// RESOURCES
// ============================================================================

export const mockResources: Resource[] = [
  // ICT Resources
  {
    id: 'res_001',
    title: 'HTML & CSS Fundamentals - Lesson Plan',
    description: 'Complete lesson plan covering HTML tags, CSS styling, and responsive design for Unit 301. Includes objectives, activities, and assessment.',
    department: 'Information & Communication Technology',
    resourceType: 'lesson_plan',
    cbetUnits: ['Unit 301', 'Unit 302'],
    trainerName: 'Albert Kiprotich',
    trainerId: 'trainer_1',
    downloadCount: 45,
    rating: 4.4,
    reviewCount: 12,
    approvedDate: '2026-04-08',
    isVerified: true,
  },
  {
    id: 'res_002',
    title: 'Networking Basics - Study Notes',
    description: 'Comprehensive notes on OSI model, TCP/IP protocols, and practical networking exercises. Includes detailed diagrams and examples.',
    department: 'Information & Communication Technology',
    resourceType: 'notes',
    cbetUnits: ['Unit 305'],
    trainerName: 'Albert Kiprotich',
    trainerId: 'trainer_1',
    downloadCount: 32,
    rating: 4.3,
    reviewCount: 8,
    approvedDate: '2026-04-07',
    isVerified: true,
  },
  {
    id: 'res_003',
    title: 'Database Management - Scheme of Work',
    description: 'Full term scheme of work for database design and SQL. Includes unit allocations, learning outcomes, and assessment schedule.',
    department: 'Information & Communication Technology',
    resourceType: 'scheme_of_work',
    cbetUnits: ['Unit 307', 'Unit 308'],
    trainerName: 'Albert Kiprotich',
    trainerId: 'trainer_1',
    downloadCount: 28,
    rating: 4.2,
    reviewCount: 7,
    approvedDate: '2026-04-06',
    isVerified: true,
  },
  {
    id: 'res_004',
    title: 'Web Development Assessment - Quiz',
    description: 'Comprehensive quiz covering HTML, CSS, JavaScript, and web design principles. 40 questions with answer key.',
    department: 'Information & Communication Technology',
    resourceType: 'assessment',
    cbetUnits: ['Unit 301', 'Unit 303', 'Unit 304'],
    trainerName: 'Albert Kiprotich',
    trainerId: 'trainer_1',
    downloadCount: 37,
    rating: 4.1,
    reviewCount: 9,
    approvedDate: '2026-04-05',
    isVerified: true,
  },

  // Business Resources
  {
    id: 'res_005',
    title: 'Financial Statements Analysis - Lesson Plan',
    description: 'Teaching materials for analyzing balance sheets, income statements, and cash flow statements. Includes real examples from Kenyan companies.',
    department: 'Business & Entrepreneurship',
    resourceType: 'lesson_plan',
    cbetUnits: ['Unit 201', 'Unit 202'],
    trainerName: 'Jane Wanjiru',
    trainerId: 'trainer_2',
    downloadCount: 38,
    rating: 4.3,
    reviewCount: 10,
    approvedDate: '2026-04-08',
    isVerified: true,
  },
  {
    id: 'res_006',
    title: 'Entrepreneurship & Business Planning - Notes',
    description: 'Detailed study notes on developing business plans, market research, and startup mechanics. Practical examples included.',
    department: 'Business & Entrepreneurship',
    resourceType: 'notes',
    cbetUnits: ['Unit 203'],
    trainerName: 'Jane Wanjiru',
    trainerId: 'trainer_2',
    downloadCount: 25,
    rating: 4.2,
    reviewCount: 6,
    approvedDate: '2026-04-04',
    isVerified: true,
  },
  {
    id: 'res_007',
    title: 'Business Management Assessment',
    description: 'Quiz and practical assessment for evaluating student understanding of business planning, organization, and management concepts.',
    department: 'Business & Entrepreneurship',
    resourceType: 'assessment',
    cbetUnits: ['Unit 205'],
    trainerName: 'Jane Wanjiru',
    trainerId: 'trainer_2',
    downloadCount: 35,
    rating: 4.1,
    reviewCount: 8,
    approvedDate: '2026-04-03',
    isVerified: true,
  },

  // Automotive Resources
  {
    id: 'res_008',
    title: 'Engine Mechanics - Study Notes',
    description: 'Comprehensive notes with detailed diagrams on engine components, combustion process, and troubleshooting common issues.',
    department: 'Automotive Technology',
    resourceType: 'notes',
    cbetUnits: ['Unit 101', 'Unit 102'],
    trainerName: 'Moses Kipchoge',
    trainerId: 'trainer_3',
    downloadCount: 67,
    rating: 4.5,
    reviewCount: 15,
    approvedDate: '2026-04-08',
    isVerified: true,
  },
  {
    id: 'res_009',
    title: 'Engine Diagnostics - Lesson Plan',
    description: 'Lesson plan for teaching engine diagnostics, troubleshooting, and repair procedures. Includes practical activities.',
    department: 'Automotive Technology',
    resourceType: 'lesson_plan',
    cbetUnits: ['Unit 103'],
    trainerName: 'Moses Kipchoge',
    trainerId: 'trainer_3',
    downloadCount: 45,
    rating: 4.4,
    reviewCount: 11,
    approvedDate: '2026-04-02',
    isVerified: true,
  },

  // Hospitality Resources
  {
    id: 'res_010',
    title: 'Front Office Operations - Lesson Plan',
    description: 'Complete lesson plan for front office management, customer service, and hotel operations.',
    department: 'Hospitality & Tourism',
    resourceType: 'lesson_plan',
    cbetUnits: ['Unit 401'],
    trainerName: 'Sarah Mwangi',
    trainerId: 'trainer_4',
    downloadCount: 25,
    rating: 4.0,
    reviewCount: 5,
    approvedDate: '2026-04-01',
    isVerified: false,
  },

  // Construction Resources
  {
    id: 'res_011',
    title: 'CAD Design Fundamentals - Lesson Plan',
    description: 'Introduction to CAD software, drawing tools, and architectural design principles.',
    department: 'Construction & Civil Engineering',
    resourceType: 'lesson_plan',
    cbetUnits: ['Unit 501'],
    trainerName: 'David Ochieng',
    trainerId: 'trainer_5',
    downloadCount: 38,
    rating: 3.9,
    reviewCount: 6,
    approvedDate: '2026-03-31',
    isVerified: false,
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getResourcesByDepartment = (deptId: string): Resource[] => {
  const dept = departments.find(d => d.id === deptId)
  if (!dept) return []
  return mockResources.filter(r => r.department === dept.name)
}

export const searchResources = (query: string): Resource[] => {
  const q = query.toLowerCase()
  return mockResources.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.trainerName.toLowerCase().includes(q) ||
    r.cbetUnits.some(u => u.toLowerCase().includes(q))
  )
}

export const filterResources = (
  dept?: string,
  type?: string,
  minRating?: number
): Resource[] => {
  return mockResources.filter(r => {
    if (dept && r.department !== dept) return false
    if (type && r.resourceType !== type) return false
    if (minRating && r.rating < minRating) return false
    return true
  })
}

export const getTrainerById = (id: string): Trainer | undefined => {
  return trainers.find(t => t.id === id)
}

export const sortResources = (
  resources: Resource[],
  sortBy: 'recent' | 'popular' | 'rating'
): Resource[] => {
  const sorted = [...resources]
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.approvedDate).getTime() - new Date(a.approvedDate).getTime())
    case 'popular':
      return sorted.sort((a, b) => b.downloadCount - a.downloadCount)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    default:
      return sorted
  }
}

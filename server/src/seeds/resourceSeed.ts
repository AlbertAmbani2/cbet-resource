/**
 * Resource Seed Script
 * Populates the resources table with sample data for testing and development
 * Run: npm run seed:resources
 */

import { query } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

interface SeedResource {
  title: string;
  department: string;
  resourceType: 'lesson_plan' | 'notes' | 'scheme_of_work' | 'assessment' | 'other';
  description: string;
  cbetUnits?: string;
  fileUrl: string;
  downloadCount?: number;
  rating?: number;
}

const sampleResources: SeedResource[] = [
  // ICT Resources
  {
    title: 'Introduction to Computer Networks',
    department: 'ICT',
    resourceType: 'lesson_plan',
    description: 'Comprehensive lesson plan covering basics of computer networks, OSI model, and TCP/IP protocol suite.',
    cbetUnits: 'Unit 101: Computer Fundamentals, Unit 102: Networking Basics',
    fileUrl: 'https://example.com/resources/ict-networks.pdf',
    downloadCount: 127,
    rating: 4.5
  },
  {
    title: 'Web Development Fundamentals - HTML & CSS',
    department: 'ICT',
    resourceType: 'notes',
    description: 'Detailed notes on HTML structure, CSS styling, and responsive design principles for modern web development.',
    cbetUnits: 'Unit 201: Web Development',
    fileUrl: 'https://example.com/resources/ict-web-dev.pdf',
    downloadCount: 89,
    rating: 4.8
  },
  {
    title: 'Database Design & SQL Fundamentals',
    department: 'ICT',
    resourceType: 'scheme_of_work',
    description: 'Scheme of work for database design, entity-relationship models, normalization, and SQL query basics.',
    cbetUnits: 'Unit 301: Databases',
    fileUrl: 'https://example.com/resources/ict-databases.pdf',
    downloadCount: 156,
    rating: 4.6
  },
  {
    title: 'Python Programming - Level 1 Assessment',
    department: 'ICT',
    resourceType: 'assessment',
    description: 'Practical assessment exercises for Python programming covering variables, loops, and functions.',
    cbetUnits: 'Unit 401: Programming',
    fileUrl: 'https://example.com/resources/ict-python-l1.pdf',
    downloadCount: 42,
    rating: 4.3
  },

  // Business Resources
  {
    title: 'Financial Statements Analysis',
    department: 'Business',
    resourceType: 'lesson_plan',
    description: 'Lesson plan on interpreting financial statements, ratio analysis, and financial decision-making.',
    cbetUnits: 'Unit 501: Financial Management',
    fileUrl: 'https://example.com/resources/bus-financials.pdf',
    downloadCount: 98,
    rating: 4.4
  },
  {
    title: 'Entrepreneurship & Business Planning',
    department: 'Business',
    resourceType: 'notes',
    description: 'Notes on business plan components, market research, financial projections, and startup strategies.',
    cbetUnits: 'Unit 502: Entrepreneurship',
    fileUrl: 'https://example.com/resources/bus-entrepreneurship.pdf',
    downloadCount: 112,
    rating: 4.7
  },
  {
    title: 'Human Resource Management Practices',
    department: 'Business',
    resourceType: 'scheme_of_work',
    description: 'Comprehensive scheme covering HR planning, recruitment, training, performance management, and employee relations.',
    cbetUnits: 'Unit 503: Human Resources',
    fileUrl: 'https://example.com/resources/bus-hrm.pdf',
    downloadCount: 65,
    rating: 4.2
  },

  // Automotive Resources
  {
    title: 'Engine Mechanics - Stroke & Cycle Operations',
    department: 'Automotive',
    resourceType: 'lesson_plan',
    description: 'Detailed lesson plan on 2-stroke and 4-stroke engine operations, fuel systems, and ignition systems.',
    cbetUnits: 'Unit 601: Engine Theory',
    fileUrl: 'https://example.com/resources/auto-engine.pdf',
    downloadCount: 203,
    rating: 4.6
  },
  {
    title: 'Brake Systems - Troubleshooting Guide',
    department: 'Automotive',
    resourceType: 'notes',
    description: 'Practical troubleshooting guide for hydraulic, pneumatic, and ABS brake system diagnostics and repair.',
    cbetUnits: 'Unit 602: Braking Systems',
    fileUrl: 'https://example.com/resources/auto-brakes.pdf',
    downloadCount: 178,
    rating: 4.5
  },
  {
    title: 'Vehicle Electrical Systems Lab Assessment',
    department: 'Automotive',
    resourceType: 'assessment',
    description: 'Hands-on lab exercises for testing charging systems, starting systems, and lighting circuits.',
    cbetUnits: 'Unit 603: Electrical Systems',
    fileUrl: 'https://example.com/resources/auto-electrical-lab.pdf',
    downloadCount: 54,
    rating: 4.1
  },

  // Hospitality Resources
  {
    title: 'Food Safety & Hygiene Standards',
    department: 'Hospitality',
    resourceType: 'lesson_plan',
    description: 'Comprehensive lesson on HACCP principles, food contamination prevention, and kitchen sanitation protocols.',
    cbetUnits: 'Unit 701: Food Safety',
    fileUrl: 'https://example.com/resources/hosp-food-safety.pdf',
    downloadCount: 87,
    rating: 4.8
  },
  {
    title: 'Customer Service Excellence in Tourism',
    department: 'Hospitality',
    resourceType: 'notes',
    description: 'Best practices for guest relations, complaint handling, and creating memorable hospitality experiences.',
    cbetUnits: 'Unit 702: Customer Service',
    fileUrl: 'https://example.com/resources/hosp-customer-service.pdf',
    downloadCount: 71,
    rating: 4.6
  },

  // Construction Resources
  {
    title: 'Building Codes & Construction Standards',
    department: 'Construction',
    resourceType: 'scheme_of_work',
    description: 'Overview of Kenya building codes, structural engineering basics, and safety regulations on construction sites.',
    cbetUnits: 'Unit 801: Building Standards',
    fileUrl: 'https://example.com/resources/const-building-codes.pdf',
    downloadCount: 134,
    rating: 4.4
  },
  {
    title: 'Concrete & Masonry Techniques',
    department: 'Construction',
    resourceType: 'lesson_plan',
    description: 'Practical guide to concrete mixing, pouring, curing, and masonry construction best practices.',
    cbetUnits: 'Unit 802: Materials & Methods',
    fileUrl: 'https://example.com/resources/const-concrete-masonry.pdf',
    downloadCount: 92,
    rating: 4.3
  },

  // Health Resources
  {
    title: 'First Aid & Emergency Response Protocols',
    department: 'Health',
    resourceType: 'lesson_plan',
    description: 'Training guide for CPR, wound care, shock management, and emergency response procedures.',
    cbetUnits: 'Unit 901: Emergency Care',
    fileUrl: 'https://example.com/resources/health-first-aid.pdf',
    downloadCount: 156,
    rating: 4.9
  },
  {
    title: 'Community Health & Preventive Medicine',
    department: 'Health',
    resourceType: 'notes',
    description: 'Comprehensive notes on disease prevention, health promotion, and community health assessment methods.',
    cbetUnits: 'Unit 902: Public Health',
    fileUrl: 'https://example.com/resources/health-community.pdf',
    downloadCount: 103,
    rating: 4.5
  }
];

async function seedResources() {
  try {
    console.log('Starting resource seed...');

    // Get existing trainers (from seed or previous auth tests)
    const trainersResult = await query('SELECT id FROM trainers LIMIT 5');
    if (trainersResult.rows.length === 0) {
      console.error('❌ No trainers found. Please seed trainers first via auth signup.');
      process.exit(1);
    }

    const trainerIds = trainersResult.rows.map((row: any) => row.id);
    console.log(`✓ Found ${trainerIds.length} trainers to link resources to`);

    let insertedCount = 0;
    for (let i = 0; i < sampleResources.length; i++) {
      const resource = sampleResources[i];
      const trainerId = trainerIds[i % trainerIds.length]; // Distribute across trainers
      const resourceId = uuidv4();

      await query(
        `INSERT INTO resources 
         (id, trainer_id, title, department, resource_type, description, cbet_units, file_url, status, download_count, rating, created_at, approved_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          resourceId,
          trainerId,
          resource.title,
          resource.department,
          resource.resourceType,
          resource.description,
          resource.cbetUnits || null,
          resource.fileUrl,
          'approved', // Mark as approved so visible immediately
          resource.downloadCount || 0,
          resource.rating || null
        ]
      );

      insertedCount++;
      console.log(`  ✓ Inserted: ${resource.title} (${resource.department})`);
    }

    console.log(`\n✅ Successfully seeded ${insertedCount} resources!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seedResources();

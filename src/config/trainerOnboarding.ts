/**
 * Centralized trainer onboarding configuration
 * Single source of truth for all trainer signup messaging and behavior
 */

export interface TrainerOnboardingConfig {
  primaryCTA: {
    label: string
    description: string
    features: string[]
  }
  secondaryCTA: {
    label: string
    description: string
  }
  smallCTA: {
    label: string
  }
  signupModal: {
    title: string
    subtitle: string
    steps: string[]
    fields: string[]
  }
  faq: {
    question: string
    answer: string
  }
}

export const TRAINER_ONBOARDING: TrainerOnboardingConfig = {
  primaryCTA: {
    label: 'Create Trainer Account',
    description: 'Turn your expertise into impact. Upload resources, reach more learners.',
    features: [
      'Upload resources by department',
      'Admin reviews before publishing',
      'Reach verified learners nationwide',
      'Pricing managed by admin'
    ]
  },
  secondaryCTA: {
    label: 'Become a Trainer',
    description: 'Share your expertise with learners across Kenya'
  },
  smallCTA: {
    label: 'Create Trainer Account'
  },
  signupModal: {
    title: 'Create Your Trainer Account',
    subtitle: 'Start uploading CBET resources and reach more learners',
    steps: ['Account Details', 'Department Selection', 'Verification'],
    fields: ['Email', 'Password', 'Full Name', 'Department', 'Years Teaching']
  },
  faq: {
    question: 'How do Trainers upload resources?',
    answer: `Create a Trainer account, select your department, and upload your lesson plans, notes, and schemes of work. Admin reviews all submissions before publishing, and pricing will be added later by admin.`
  }
}

/**
 * Trainer onboarding flow state and actions
 * Used by useTrainerSignup hook
 */
export const TRAINER_SIGNUP_FLOW = {
  steps: ['email', 'password', 'profile', 'department', 'verification'] as const,
  stepLabels: {
    email: 'Email & Password',
    password: 'Secure Password',
    profile: 'Your Profile',
    department: 'Choose Department',
    verification: 'Verify Account'
  },
  departments: [
    'ICT',
    'Business Studies',
    'Automotive',
    'Hospitality',
    'Construction',
    'Cosmetology',
    'Agriculture',
    'Health Sciences'
  ]
}

/**
 * Analytics events for trainer signup tracking
 */
export const TRAINER_SIGNUP_EVENTS = {
  CTA_CLICKED: 'trainer_cta_clicked',
  SIGNUP_STARTED: 'trainer_signup_started',
  SIGNUP_COMPLETED: 'trainer_signup_completed',
  STEP_COMPLETED: 'trainer_signup_step_completed',
  SIGNUP_ABANDONED: 'trainer_signup_abandoned'
} as const

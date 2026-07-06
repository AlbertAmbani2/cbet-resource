/**
 * Shared Constants for Frontend and Backend
 * This file contains API endpoints, validation rules, and other constants used across the application
 */

// ============================================================================
// API Endpoints
// ============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Authentication
  SIGNUP: '/api/trainers/signup',
  SIGNIN: '/api/trainers/signin',

  // Trainer Profile
  TRAINER_PROFILE: (trainerId: string) => `/api/trainers/${trainerId}`,
  TRAINER_ME_PROFILE: '/api/trainers/me/profile',
  TRAINER_UPDATE_PROFILE: (trainerId: string) => `/api/trainers/${trainerId}`,

  // Leaderboard
  TRAINER_LEADERBOARD: '/api/trainers/leaderboard',

  // Resources
  RESOURCE_UPLOAD: '/api/resources/upload',
  TRAINER_RESOURCES: (trainerId: string) => `/api/trainers/${trainerId}/resources`,
  APPROVED_RESOURCES: '/api/resources/approved',
  RESOURCE_BY_ID: (resourceId: string) => `/api/resources/${resourceId}`,

  // Reviews
  RESOURCE_REVIEWS: (resourceId: string) => `/api/resources/${resourceId}/reviews`,
  RESOURCE_REVIEW: (resourceId: string, reviewId: string) => `/api/resources/${resourceId}/reviews/${reviewId}`,
  RESOURCE_RATING: (resourceId: string) => `/api/resources/${resourceId}/rating`,

  // Subscriptions
  SUBSCRIPTION_STATUS: (trainerId: string) => `/api/trainers/${trainerId}/subscription`,
  PAYMENT_PLANS: '/api/payment-plans',
  PAYMENT_HISTORY: (trainerId: string) => `/api/trainers/${trainerId}/payments`,
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    ERROR_MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 255,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    ERROR_MESSAGE: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
    ERROR_MESSAGE: 'Full name must be between 2 and 255 characters',
  },
  BIO: {
    MAX_LENGTH: 1000,
    ERROR_MESSAGE: 'Bio must not exceed 1000 characters',
  },
  INSTITUTION: {
    MAX_LENGTH: 255,
    ERROR_MESSAGE: 'Institution name must not exceed 255 characters',
  },
  RESOURCE_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 120,
    ERROR_MESSAGE: 'Title must be between 3 and 120 characters',
  },
  RESOURCE_DESCRIPTION: {
    MAX_LENGTH: 5000,
    ERROR_MESSAGE: 'Description must not exceed 5000 characters',
  },
} as const;

// ============================================================================
// Department Options
// ============================================================================

export const DEPARTMENTS = [
  'ICT',
  'Business',
  'Automotive',
  'Hospitality',
  'Construction',
  'Tourism',
  'Health',
  'Agriculture',
  'Other',
] as const;

// ============================================================================
// Resource Type Options
// ============================================================================

export const RESOURCE_TYPES = [
  { value: 'lesson_plan', label: 'Lesson Plan' },
  { value: 'notes', label: 'Notes' },
  { value: 'scheme_of_work', label: 'Scheme of Work' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'other', label: 'Other' },
] as const;

// ============================================================================
// Resource Status
// ============================================================================

export const RESOURCE_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const RESOURCE_STATUS_LABELS = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
} as const;

// ============================================================================
// Payment Plans
// ============================================================================

export const PAYMENT_PLANS = {
  FREE: 'free',
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_ANNUAL: 'premium_annual',
} as const;

export const PAYMENT_PLAN_DETAILS = {
  free: {
    name: 'Free',
    amount: 0,
    currency: 'KES',
    features: ['Upload up to 5 resources', 'Basic analytics'],
  },
  premium_monthly: {
    name: 'Premium Monthly',
    amount: 2999,
    currency: 'KES',
    billingInterval: 30,
    features: ['Unlimited uploads', 'Advanced analytics', 'Priority support'],
  },
  premium_annual: {
    name: 'Premium Annual',
    amount: 29990,
    currency: 'KES',
    billingInterval: 365,
    features: ['Unlimited uploads', 'Advanced analytics', 'Priority support', '20% discount'],
  },
} as const;

// ============================================================================
// HTTP Headers
// ============================================================================

export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: 'application/json',
  TRAINER_ID_HEADER: 'x-trainer-id',
  AUTHORIZATION_HEADER: 'Authorization',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
  FORBIDDEN: 'Forbidden. You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  INVALID_EMAIL: 'Email is already registered.',
  INVALID_PASSWORD: 'Email or password is incorrect.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully!',
  SIGNIN_SUCCESS: 'Signed in successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  RESOURCE_UPLOADED: 'Resource uploaded successfully!',
  RESOURCE_DELETED: 'Resource deleted successfully!',
} as const;

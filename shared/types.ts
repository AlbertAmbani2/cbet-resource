/**
 * Shared Types for Frontend and Backend
 * This file contains all TypeScript interfaces and types used across the API boundary
 */

// ============================================================================
// Trainer Types
// ============================================================================

export type TrainerDepartment =
  | 'ICT'
  | 'Business'
  | 'Automotive'
  | 'Hospitality'
  | 'Construction'
  | 'Tourism'
  | 'Health'
  | 'Agriculture'
  | 'Other';

export interface TrainerSignupRequest {
  email: string;
  password: string;
  fullName: string;
  department: TrainerDepartment;
}

export interface TrainerSigninRequest {
  email: string;
  password: string;
}

export interface TrainerResponse {
  id: string;
  email: string;
  fullName: string;
  department: TrainerDepartment;
  createdAt: string;
  isVerified: boolean;
  bio?: string;
  institution?: string;
  contactEmail?: string;
  verificationStatus?: string;
  isAdmin?: boolean;
  totalUploads?: number;
  totalDownloads?: number;
  updatedAt?: string;
}

export interface TrainerProfileUpdate {
  fullName?: string;
  bio?: string;
  institution?: string;
  contactEmail?: string;
  department?: TrainerDepartment;
}

// ============================================================================
// Resource Types
// ============================================================================

export type ResourceType =
  | 'lesson_plan'
  | 'notes'
  | 'scheme_of_work'
  | 'assessment'
  | 'other';

export type ResourceStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected';

export interface Resource {
  id: string;
  trainerId: string;
  title: string;
  department: TrainerDepartment;
  resourceType: ResourceType;
  description?: string;
  cbetUnits?: string;
  fileUrl: string;
  status: ResourceStatus;
  uploadedAt: string;
  approvalDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
  downloadCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceUploadRequest {
  title: string;
  department: TrainerDepartment;
  resourceType: ResourceType;
  description?: string;
  cbetUnits?: string;
}

// ============================================================================
// Subscription & Payment Types
// ============================================================================

export type SubscriptionStatus =
  | 'active'
  | 'inactive'
  | 'cancelled'
  | 'past_due';

export type PlanType =
  | 'free'
  | 'premium_monthly'
  | 'premium_annual';

export interface Subscription {
  id: string;
  trainerId: string;
  subscriptionStatus: SubscriptionStatus;
  planType: PlanType;
  planAmount: number;
  currency: string;
  billingCycleStart?: string;
  billingCycleEnd?: string;
  autoRenew: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  | 'pending'
  | 'success'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'm_pesa'
  | 'card'
  | 'bank_transfer';

export interface PaymentHistoryRecord {
  id: string;
  trainerId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentProviderId?: string;
  receiptUrl?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  planType: PlanType;
  amount: number;
  currency: string;
  billingInterval: number;
  features: string[];
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: string;
  resourceId: string;
  trainerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  trainerName?: string;
  trainerDepartment?: string;
}

export interface ReviewRequest {
  rating: number;
  comment?: string;
}

export interface RatingAggregate {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiError {
  error: string;
  details?: string;
}

export interface ApiSuccess<T> {
  success: boolean;
  data: T;
}

// ============================================================================
// HTTP Request/Response Types
// ============================================================================

export interface HttpResponse<T = any> {
  status: number;
  data?: T;
  error?: string;
}

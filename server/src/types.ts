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

export interface TrainerResponse {
  id: string;
  email: string;
  fullName: string;
  department: TrainerDepartment;
  createdAt: string;
  isVerified: boolean;
}

export interface ApiError {
  error: string;
  details?: string;
}

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import { hashPassword, validatePasswordStrength } from '../passwordHelper';
import { TrainerSignupRequest, TrainerDepartment, ApiError } from '../types';

const VALID_DEPARTMENTS: TrainerDepartment[] = [
  'ICT', 'Business', 'Automotive', 'Hospitality',
  'Construction', 'Tourism', 'Health', 'Agriculture', 'Other'
];

/**
 * Validate trainer signup request
 */
function validateSignupRequest(body: unknown): { valid: boolean; error?: string } {
  const req = body as TrainerSignupRequest;

  if (!req.email || typeof req.email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.email)) {
    return { valid: false, error: 'Email format is invalid' };
  }

  if (!req.password || typeof req.password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  const passwordError = validatePasswordStrength(req.password);
  if (passwordError) {
    return { valid: false, error: passwordError };
  }

  if (!req.fullName || typeof req.fullName !== 'string' || req.fullName.trim().length === 0) {
    return { valid: false, error: 'Full name is required' };
  }

  if (!req.department || !VALID_DEPARTMENTS.includes(req.department)) {
    return { valid: false, error: `Department must be one of: ${VALID_DEPARTMENTS.join(', ')}` };
  }

  return { valid: true };
}

/**
 * POST /api/trainers/signup
 * Create a new trainer account
 */
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    // Validate request body
    const validation = validateSignupRequest(req.body);
    if (!validation.valid) {
      const error: ApiError = { error: validation.error || 'Invalid request' };
      res.status(400).json(error);
      return;
    }

    const { email, password, fullName, department } = req.body as TrainerSignupRequest;

    // Check if email already exists
    const existingTrainer = await query(
      'SELECT id FROM trainers WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingTrainer.rows.length > 0) {
      const error: ApiError = { error: 'Email already registered' };
      res.status(400).json(error);
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate UUID for trainer
    const trainerId = uuidv4();

    // Insert trainer into database
    const result = await query(
      `INSERT INTO trainers (id, email, password, full_name, department, created_at, is_verified)
       VALUES ($1, $2, $3, $4, $5, NOW(), false)
       RETURNING id, email, full_name, department, created_at, is_verified`,
      [trainerId, email.toLowerCase(), hashedPassword, fullName, department]
    );

    const trainer = result.rows[0];

    res.status(201).json({
      id: trainer.id,
      email: trainer.email,
      fullName: trainer.full_name,
      department: trainer.department,
      createdAt: trainer.created_at,
      isVerified: trainer.is_verified
    });
  } catch (error) {
    console.error('[Controller] Signup error:', error);
    const err: ApiError = {
      error: 'Failed to create trainer account',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

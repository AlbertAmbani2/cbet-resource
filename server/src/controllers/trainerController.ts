import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db.js';
import { hashPassword, validatePasswordStrength } from '../passwordHelper.js';
import {
  TrainerSignupRequest,
  TrainerProfileUpdate,
  TrainerDepartment,
  TrainerResponse,
  ApiError
} from '../types.js';

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

function formatTrainerResponse(row: any): TrainerResponse {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    department: row.department,
    createdAt: row.created_at,
    isVerified: row.is_verified,
    bio: row.bio,
    institution: row.institution,
    contactEmail: row.contact_email,
    verificationStatus: row.verification_status,
    isAdmin: row.is_admin,
    totalUploads: row.total_uploads,
    totalDownloads: row.total_downloads,
    updatedAt: row.updated_at
  };
}

function validateProfileUpdate(body: unknown): { valid: boolean; error?: string } {
  const update = body as TrainerProfileUpdate;

  if (update.fullName !== undefined && typeof update.fullName !== 'string') {
    return { valid: false, error: 'fullName must be a string' };
  }

  if (update.bio !== undefined && typeof update.bio !== 'string') {
    return { valid: false, error: 'bio must be a string' };
  }

  if (update.institution !== undefined && typeof update.institution !== 'string') {
    return { valid: false, error: 'institution must be a string' };
  }

  if (update.contactEmail !== undefined) {
    if (typeof update.contactEmail !== 'string') {
      return { valid: false, error: 'contactEmail must be a string' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(update.contactEmail)) {
      return { valid: false, error: 'contactEmail format is invalid' };
    }
  }

  if (update.department !== undefined && !VALID_DEPARTMENTS.includes(update.department)) {
    return { valid: false, error: `Department must be one of: ${VALID_DEPARTMENTS.join(', ')}` };
  }

  return { valid: true };
}

export async function getTrainerProfile(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = req.params.id;

    const result = await query(
      'SELECT id, email, full_name, department, bio, institution, contact_email, verification_status, is_verified, total_uploads, total_downloads, created_at, updated_at FROM trainers WHERE id = $1',
      [trainerId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Trainer not found' });
      return;
    }

    res.status(200).json(formatTrainerResponse(result.rows[0]));
  } catch (error) {
    console.error('[Controller] Get trainer profile error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve trainer profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

export async function updateTrainerProfile(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = req.params.id;
    const validation = validateProfileUpdate(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error ?? 'Invalid profile update' });
      return;
    }

    const update = req.body as TrainerProfileUpdate;
    const result = await query(
      `UPDATE trainers SET
         full_name = COALESCE($1, full_name),
         bio = COALESCE($2, bio),
         institution = COALESCE($3, institution),
         contact_email = COALESCE($4, contact_email),
         department = COALESCE($5, department),
         updated_at = NOW()
       WHERE id = $6
       RETURNING id, email, full_name, department, bio, institution, contact_email, verification_status, is_verified, total_uploads, total_downloads, created_at, updated_at`,
      [update.fullName, update.bio, update.institution, update.contactEmail, update.department, trainerId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Trainer not found' });
      return;
    }

    res.status(200).json(formatTrainerResponse(result.rows[0]));
  } catch (error) {
    console.error('[Controller] Update profile error:', error);
    const err: ApiError = {
      error: 'Failed to update trainer profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

export async function getMyProfile(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = (req as { trainerId?: string }).trainerId;
    if (!trainerId) {
      res.status(401).json({ error: 'Trainer ID is required' });
      return;
    }

    const result = await query(
      'SELECT id, email, full_name, department, bio, institution, contact_email, verification_status, is_verified, total_uploads, total_downloads, created_at, updated_at FROM trainers WHERE id = $1',
      [trainerId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Trainer not found' });
      return;
    }

    res.status(200).json(formatTrainerResponse(result.rows[0]));
  } catch (error) {
    console.error('[Controller] Get my profile error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve current trainer profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * GET /api/trainers/leaderboard
 * Top trainers by download count
 */
export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  try {
    const { limit = '10' } = req.query as { limit?: string };
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));

    const result = await query(
      `SELECT id, full_name, department, bio, institution, verification_status,
              total_uploads, total_downloads, created_at
       FROM trainers
       WHERE total_downloads > 0
       ORDER BY total_downloads DESC
       LIMIT $1`,
      [limitNum]
    );

    const trainers = result.rows.map(row => ({
      id: row.id,
      fullName: row.full_name,
      department: row.department,
      bio: row.bio,
      institution: row.institution,
      verificationStatus: row.verification_status,
      totalUploads: parseInt(row.total_uploads) || 0,
      totalDownloads: parseInt(row.total_downloads) || 0,
      createdAt: row.created_at
    }));

    res.status(200).json({ data: trainers });
  } catch (error) {
    console.error('[Controller] Get leaderboard error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve leaderboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * GET /api/trainers/:id/resources
 * List approved resources for a specific trainer
 */
export async function getTrainerResources(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = req.params.id;
    const { page = '1', limit = '12' } = req.query as { page?: string; limit?: string };

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    const countResult = await query(
      'SELECT COUNT(*) as count FROM resources WHERE trainer_id = $1 AND status = $2',
      [trainerId, 'approved']
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT * FROM resources
       WHERE trainer_id = $1 AND status = $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [trainerId, 'approved', limitNum, offset]
    );

    const resources = result.rows.map((row: any) => ({
      id: row.id,
      trainerId: row.trainer_id,
      title: row.title,
      department: row.department,
      resourceType: row.resource_type,
      description: row.description,
      fileUrl: row.file_url,
      status: row.status,
      downloadCount: row.download_count,
      rating: row.rating,
      createdAt: row.created_at
    }));

    res.status(200).json({
      data: resources,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('[Controller] Get trainer resources error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve trainer resources',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

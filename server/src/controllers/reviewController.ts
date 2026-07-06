import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db.js';
import type { ReviewRequest, Review, RatingAggregate, ApiError } from '../types.js';

const VALID_RATINGS = [1, 2, 3, 4, 5];

function formatReview(row: any): Review {
  return {
    id: row.id,
    resourceId: row.resource_id,
    trainerId: row.trainer_id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    trainerName: row.trainer_name,
    trainerDepartment: row.trainer_department
  };
}

/**
 * POST /api/resources/:resourceId/reviews
 * Create a review for a resource
 */
export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const resourceId = req.params.resourceId;
    const trainerId = req.headers['x-trainer-id'] as string | undefined;

    if (!trainerId) {
      res.status(401).json({ error: 'x-trainer-id header is required' });
      return;
    }

    const { rating, comment } = req.body as ReviewRequest;

    if (!rating || !VALID_RATINGS.includes(rating)) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return;
    }

    if (comment && comment.length > 300) {
      res.status(400).json({ error: 'Comment must not exceed 300 characters' });
      return;
    }

    // Check resource exists
    const resourceCheck = await query('SELECT id FROM resources WHERE id = $1', [resourceId]);
    if (resourceCheck.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Check trainer hasn't already reviewed this resource
    const existingCheck = await query(
      'SELECT id FROM reviews WHERE resource_id = $1 AND trainer_id = $2',
      [resourceId, trainerId]
    );

    if (existingCheck.rows.length > 0) {
      res.status(409).json({ error: 'You have already reviewed this resource' });
      return;
    }

    const reviewId = uuidv4();
    const result = await query(
      `INSERT INTO reviews (id, resource_id, trainer_id, rating, comment, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, resource_id, trainer_id, rating, comment, created_at, updated_at`,
      [reviewId, resourceId, trainerId, rating, comment || null]
    );

    // Update resource average rating
    await updateResourceRating(resourceId);

    res.status(201).json(formatReview(result.rows[0]));
  } catch (error) {
    console.error('[Controller] Create review error:', error);
    const err: ApiError = {
      error: 'Failed to create review',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * GET /api/resources/:resourceId/reviews
 * List reviews for a resource with pagination
 */
export async function listReviews(req: Request, res: Response): Promise<void> {
  try {
    const resourceId = req.params.resourceId;
    const { page = '1', limit = '10' } = req.query as { page?: string; limit?: string };

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as count FROM reviews WHERE resource_id = $1',
      [resourceId]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated reviews with trainer info
    const result = await query(
      `SELECT r.id, r.resource_id, r.trainer_id, r.rating, r.comment, r.created_at, r.updated_at,
              t.full_name as trainer_name, t.department as trainer_department
       FROM reviews r
       JOIN trainers t ON t.id = r.trainer_id
       WHERE r.resource_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [resourceId, limitNum, offset]
    );

    const reviews = result.rows.map(formatReview);

    res.status(200).json({
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('[Controller] List reviews error:', error);
    const err: ApiError = {
      error: 'Failed to list reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * PUT /api/resources/:resourceId/reviews/:reviewId
 * Update a review
 */
export async function updateReview(req: Request, res: Response): Promise<void> {
  try {
    const { resourceId, reviewId } = req.params;
    const trainerId = req.headers['x-trainer-id'] as string | undefined;

    if (!trainerId) {
      res.status(401).json({ error: 'x-trainer-id header is required' });
      return;
    }

    const { rating, comment } = req.body as Partial<ReviewRequest>;

    if (rating !== undefined && !VALID_RATINGS.includes(rating)) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return;
    }

    if (comment !== undefined && comment.length > 300) {
      res.status(400).json({ error: 'Comment must not exceed 300 characters' });
      return;
    }

    // Check review exists and belongs to trainer
    const existingCheck = await query(
      'SELECT id, trainer_id, resource_id FROM reviews WHERE id = $1 AND resource_id = $2',
      [reviewId, resourceId]
    );

    if (existingCheck.rows.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    if (existingCheck.rows[0].trainer_id !== trainerId) {
      res.status(403).json({ error: 'You may only edit your own reviews' });
      return;
    }

    const result = await query(
      `UPDATE reviews SET
         rating = COALESCE($1, rating),
         comment = COALESCE($2, comment),
         updated_at = NOW()
       WHERE id = $3
       RETURNING id, resource_id, trainer_id, rating, comment, created_at, updated_at`,
      [rating || null, comment !== undefined ? comment : null, reviewId]
    );

    await updateResourceRating(resourceId);

    res.status(200).json(formatReview(result.rows[0]));
  } catch (error) {
    console.error('[Controller] Update review error:', error);
    const err: ApiError = {
      error: 'Failed to update review',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * DELETE /api/resources/:resourceId/reviews/:reviewId
 * Delete a review
 */
export async function deleteReview(req: Request, res: Response): Promise<void> {
  try {
    const { resourceId, reviewId } = req.params;
    const trainerId = req.headers['x-trainer-id'] as string | undefined;

    if (!trainerId) {
      res.status(401).json({ error: 'x-trainer-id header is required' });
      return;
    }

    const existingCheck = await query(
      'SELECT id, trainer_id FROM reviews WHERE id = $1 AND resource_id = $2',
      [reviewId, resourceId]
    );

    if (existingCheck.rows.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    if (existingCheck.rows[0].trainer_id !== trainerId) {
      res.status(403).json({ error: 'You may only delete your own reviews' });
      return;
    }

    await query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    await updateResourceRating(resourceId);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('[Controller] Delete review error:', error);
    const err: ApiError = {
      error: 'Failed to delete review',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * GET /api/resources/:resourceId/rating
 * Get aggregate rating for a resource
 */
export async function getResourceRating(req: Request, res: Response): Promise<void> {
  try {
    const resourceId = req.params.resourceId;

    // Check if resource exists
    const resourceCheck = await query('SELECT id, rating FROM resources WHERE id = $1', [resourceId]);
    if (resourceCheck.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Get aggregate stats
    const statsResult = await query(
      `SELECT
         COALESCE(AVG(rating)::numeric(10,2), 0) as average,
         COUNT(*) as count
       FROM reviews WHERE resource_id = $1`,
      [resourceId]
    );

    // Get rating distribution
    const distResult = await query(
      `SELECT rating, COUNT(*) as count
       FROM reviews WHERE resource_id = $1
       GROUP BY rating
       ORDER BY rating DESC`,
      [resourceId]
    );

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of distResult.rows) {
      distribution[row.rating] = parseInt(row.count);
    }

    const aggregate: RatingAggregate = {
      average: parseFloat(statsResult.rows[0].average),
      count: parseInt(statsResult.rows[0].count),
      distribution
    };

    res.status(200).json(aggregate);
  } catch (error) {
    console.error('[Controller] Get resource rating error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve rating',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * Recalculate and update the average rating on the resources table
 */
async function updateResourceRating(resourceId: string): Promise<void> {
  try {
    await query(
      `UPDATE resources
       SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE resource_id = $1), 0)
       WHERE id = $1`,
      [resourceId]
    );
  } catch (error) {
    console.error('[Controller] Update resource rating error:', error);
  }
}

import { Request, Response } from 'express';
import { query } from '../db.js';
import type { Resource, ApiError } from '../types.js';

interface GetResourcesQuery {
  page?: string;
  limit?: string;
  department?: string;
  resourceType?: string;
  trainerId?: string;
  search?: string;
}

function formatResourceResponse(row: any): Resource {
  return {
    id: row.id,
    trainerId: row.trainer_id,
    title: row.title,
    department: row.department,
    resourceType: row.resource_type,
    description: row.description,
    cbetUnits: row.cbet_units,
    fileUrl: row.file_url,
    status: row.status,
    uploadedAt: row.created_at,
    approvalDate: row.approved_at,
    approvedBy: row.approved_by,
    downloadCount: row.download_count,
    rating: row.rating,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * GET /api/resources
 * List all approved resources with pagination and filters
 */
export async function listResources(req: Request, res: Response): Promise<void> {
  try {
    const { page = '1', limit = '12', department, resourceType, search } = req.query as GetResourcesQuery;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    // Build filter clauses
    const filters: string[] = ['status = $1'];
    const params: any[] = ['approved'];

    if (department) {
      filters.push(`department = $${params.length + 1}`);
      params.push(department);
    }

    if (resourceType) {
      filters.push(`resource_type = $${params.length + 1}`);
      params.push(resourceType);
    }

    if (search) {
      filters.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 2})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = filters.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as count FROM resources WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    params.push(limitNum, offset);
    const result = await query(
      `SELECT * FROM resources 
       WHERE ${whereClause}
       ORDER BY approved_at DESC, download_count DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const resources = result.rows.map(formatResourceResponse);

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
    console.error('[Controller] List resources error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve resources',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * GET /api/resources/:id
 * Get a single resource by ID
 */
export async function getResourceById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM resources WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const resource = formatResourceResponse(result.rows[0]);
    res.status(200).json(resource);
  } catch (error) {
    console.error('[Controller] Get resource error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve resource',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * GET /api/resources/stats/:id
 * Get resource statistics (downloads, rating, etc.)
 */
export async function getResourceStats(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, title, download_count, rating, created_at, approved_at, status
       FROM resources WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const row = result.rows[0];
    res.status(200).json({
      id: row.id,
      title: row.title,
      downloadCount: row.download_count,
      rating: row.rating,
      createdAt: row.created_at,
      approvedAt: row.approved_at,
      status: row.status
    });
  } catch (error) {
    console.error('[Controller] Get resource stats error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve resource stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

/**
 * GET /api/resources/departments/coverage
 * Get resource coverage by department
 */
export async function getDepartmentCoverage(req: Request, res: Response): Promise<void> {
  try {
    const result = await query(
      `SELECT department, COUNT(*) as resource_count, COUNT(DISTINCT trainer_id) as trainer_count
       FROM resources WHERE status = 'approved'
       GROUP BY department
       ORDER BY resource_count DESC`
    );

    const coverage = result.rows.map(row => ({
      department: row.department,
      resourceCount: parseInt(row.resource_count),
      trainerCount: parseInt(row.trainer_count)
    }));

    res.status(200).json({ coverage });
  } catch (error) {
    console.error('[Controller] Get department coverage error:', error);
    const err: ApiError = {
      error: 'Failed to retrieve department coverage',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(err);
  }
}

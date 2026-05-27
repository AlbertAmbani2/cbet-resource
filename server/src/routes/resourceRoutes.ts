import { Router } from 'express';
import {
  listResources,
  getResourceById,
  getResourceStats,
  getDepartmentCoverage
} from '../controllers/resourceController.js';

const router = Router();

/**
 * Public Resource Endpoints
 */
router.get('/', listResources);
router.get('/departments/coverage', getDepartmentCoverage);
router.get('/:id', getResourceById);
router.get('/:id/stats', getResourceStats);

export default router;

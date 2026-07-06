import { Router } from 'express';
import {
  signup,
  getTrainerProfile,
  getMyProfile,
  updateTrainerProfile,
  getLeaderboard,
  getTrainerResources
} from '../controllers/trainerController.js';
import { signin } from '../controllers/signinController.js';
import { requireTrainerAuth, requireTrainerOwnership } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Authentication Endpoints
 */
router.post('/signup', signup);
router.post('/signin', signin);

/**
 * Leaderboard
 */
router.get('/leaderboard', getLeaderboard);

/**
 * Trainer Profile Endpoints
 */
router.get('/me/profile', requireTrainerAuth, getMyProfile);
router.get('/:id', getTrainerProfile);
router.get('/:id/resources', getTrainerResources);
router.put('/:id', requireTrainerAuth, requireTrainerOwnership, updateTrainerProfile);

export default router;

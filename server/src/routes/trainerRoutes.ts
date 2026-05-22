import { Router } from 'express';
import {
  signup,
  getTrainerProfile,
  getMyProfile,
  updateTrainerProfile
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
 * Trainer Profile Endpoints
 */
router.get('/me/profile', requireTrainerAuth, getMyProfile);
router.get('/:id', getTrainerProfile);
router.put('/:id', requireTrainerAuth, requireTrainerOwnership, updateTrainerProfile);

export default router;

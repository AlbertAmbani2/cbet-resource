import { Router } from 'express';
import { signup } from '../controllers/trainerController';

const router = Router();

/**
 * POST /api/trainers/signup
 * Create a new trainer account with email, password, name, and department
 */
router.post('/signup', signup);

export default router;

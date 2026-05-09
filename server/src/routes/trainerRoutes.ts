import { Router } from 'express';
import { signup } from '../controllers/trainerController';
import { signin } from '../controllers/signinController';

const router = Router();

/**
 * POST /api/trainers/signup
 * Create a new trainer account with email, password, name, and department
 */
router.post('/signup', signup);

/**
 * POST /api/trainers/signin
 * Authenticate trainer with email and password
 */
router.post('/signin', signin);

export default router;

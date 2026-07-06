import { Router } from 'express';
import {
  createReview,
  listReviews,
  updateReview,
  deleteReview,
  getResourceRating
} from '../controllers/reviewController.js';

const router = Router({ mergeParams: true });

/**
 * Review Endpoints (mounted under /api/resources/:resourceId)
 */
router.post('/reviews', createReview);
router.get('/reviews', listReviews);
router.put('/reviews/:reviewId', updateReview);
router.delete('/reviews/:reviewId', deleteReview);
router.get('/rating', getResourceRating);

export default router;

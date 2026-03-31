import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  createReview,
  updateReview,
  deleteReview,
  listMyReviews,
  getReview,
} from '../controllers/review.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createReview);
router.get('/', listMyReviews);
router.get('/:tmdbId/:mediaType', getReview);
router.patch('/:tmdbId/:mediaType', updateReview);
router.delete('/:tmdbId/:mediaType', deleteReview);

export default router;

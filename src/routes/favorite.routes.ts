import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  addFavorite,
  removeFavorite,
  listFavorites,
  checkFavorite,
} from '../controllers/favorite.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/', addFavorite);
router.get('/', listFavorites);
router.get('/check/:tmdbId/:mediaType', checkFavorite);
router.delete('/:tmdbId/:mediaType', removeFavorite);

export default router;

import { Router } from 'express';
import {
  search,
  movieDetails,
  tvDetails,
  trending,
} from '../controllers/tmdb.controller.js';

const router = Router();

router.get('/search', search);
router.get('/trending', trending);
router.get('/movie/:id', movieDetails);
router.get('/tv/:id', tvDetails);

export default router;

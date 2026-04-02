import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getProfile } from '../controllers/profile.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);

export default router;

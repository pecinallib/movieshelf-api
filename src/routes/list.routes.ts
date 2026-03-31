import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  createList,
  updateList,
  deleteList,
  getMyLists,
  getListById,
  addItem,
  removeItem,
} from '../controllers/list.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createList);
router.get('/', getMyLists);
router.get('/:id', getListById);
router.patch('/:id', updateList);
router.delete('/:id', deleteList);
router.post('/:id/items', addItem);
router.delete('/:id/items/:itemId', removeItem);

export default router;

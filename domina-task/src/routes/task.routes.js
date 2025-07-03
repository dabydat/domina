import { Router } from 'express';
import { create, getAll, update, remove } from '../controllers/task.controller.js';
import { getUserId } from '../middleware/get-user-id.middleware.js';

const router = Router();
router.get('/', getUserId, getAll);
router.post('/', getUserId, create);
router.put('/:id', getUserId, update);
router.delete('/:id', getUserId, remove);

export default router;

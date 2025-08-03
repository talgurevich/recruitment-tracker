import { Router } from 'express';
import { createActionItem, updateActionItem, deleteActionItem } from '../controllers/actionItems';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createActionItem);
router.put('/:id', updateActionItem);
router.delete('/:id', deleteActionItem);

export default router;
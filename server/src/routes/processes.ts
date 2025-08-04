import { Router } from 'express';
import { createProcess, getProcesses, getProcess, updateProcess, deleteProcess, updateExcitementRating } from '../controllers/processes';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createProcess);
router.get('/', getProcesses);
router.get('/:id', getProcess);
router.put('/:id', updateProcess);
router.delete('/:id', deleteProcess);
router.put('/:id/excitement', updateExcitementRating);

export default router;
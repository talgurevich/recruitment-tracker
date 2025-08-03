import { Router } from 'express';
import { createProcess, getProcesses, getProcess, updateProcess, deleteProcess } from '../controllers/processes';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createProcess);
router.get('/', getProcesses);
router.get('/:id', getProcess);
router.put('/:id', updateProcess);
router.delete('/:id', deleteProcess);

export default router;
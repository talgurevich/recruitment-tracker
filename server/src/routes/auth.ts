import { Router } from 'express';
import { register, login, getProfile, updateExcitementWeights, getExcitementWeights } from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/excitement-weights', authenticate, updateExcitementWeights);
router.get('/excitement-weights', authenticate, getExcitementWeights);

export default router;
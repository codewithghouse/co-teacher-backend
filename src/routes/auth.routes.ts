import { Router } from 'express';
import { register, login, getMe, googleLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', getMe);

export default router;

import { Router } from 'express';
import { generateQuizAI, saveQuiz, getQuizzes } from '../controllers/quiz.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(optionalAuthenticate);

router.post('/generate', generateQuizAI);
router.post('/save', saveQuiz);
router.get('/', getQuizzes);

export default router;

import { Router } from 'express';
import { getMetadata, getBoards, getGrades, getSubjects } from '../controllers/curriculum.controller';

const router = Router();

router.get('/metadata', getMetadata);
router.get('/boards', getBoards);
router.get('/grades/:board', getGrades);
router.get('/subjects/:board/:grade', getSubjects);

export default router;

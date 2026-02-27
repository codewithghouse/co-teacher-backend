import { Router } from 'express';
import { getStudentsByClass, getStudentsDetailed, createStudent, updateStudent, deleteStudent } from '../controllers/student.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getStudentsByClass);
router.get('/roster', getStudentsDetailed);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;

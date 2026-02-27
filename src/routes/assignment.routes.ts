import { Router } from 'express';
import { getAssignments, createAssignment, getSubmissions, gradeSubmission, generateAssignmentContent } from '../controllers/assignment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/generate', generateAssignmentContent);
router.get('/', getAssignments);
router.post('/', createAssignment);
router.get('/:assignmentId/submissions', getSubmissions);
router.post('/submissions/:submissionId/grade', gradeSubmission);

export default router;

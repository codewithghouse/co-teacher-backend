import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../lib/firebase';

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const studentSnap = await db.collection('students').where('userId', '==', req.user!.id).get();
        if (studentSnap.empty) return res.status(404).json({ error: 'Student profile not found' });

        const studentDoc = studentSnap.docs[0];
        const student = { id: studentDoc.id, ...studentDoc.data() } as any;

        const [userDoc, attendanceSnap, gradesSnap] = await Promise.all([
            db.collection('users').doc(req.user!.id).get(),
            db.collection('attendance').where('studentId', '==', student.id).limit(30).get(),
            db.collection('assessmentGrades').where('studentId', '==', student.id).orderBy('gradedAt', 'desc').limit(10).get()
        ]);

        const attendance = attendanceSnap.docs.map(doc => doc.data());
        const grades = gradesSnap.docs.map(doc => doc.data());

        // Fetch assignments for the student's grade
        const assignmentsSnap = await db.collection('assignments')
            .where('classId', '==', String(student.grade))
            .orderBy('dueDate', 'asc')
            .limit(5)
            .get();

        const assignments = await Promise.all(assignmentsSnap.docs.map(async (doc) => {
            const data = doc.data();
            const [subjDoc, subSnap] = await Promise.all([
                db.collection('subjects').doc(data.subjectId).get(),
                db.collection('submissions').where('assignmentId', '==', doc.id).where('studentId', '==', student.id).get()
            ]);
            return {
                id: doc.id,
                ...data,
                subject: subjDoc.exists ? subjDoc.data() : null,
                submissions: subSnap.docs.map(s => s.data())
            };
        }));

        // Lessons for the grade
        const lessonsSnap = await db.collection('lessonPlans')
            .where('status', '==', 'PUBLISHED')
            .orderBy('updatedAt', 'desc')
            .limit(5)
            .get();

        const lessons = lessonsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({
            profile: { ...student, user: userDoc.data() },
            assignments,
            lessons,
            stats: {
                lessonsCompleted: 12,
                assignmentsDue: assignments.filter(a => a.submissions.length === 0).length,
                avgScore: grades.length > 0 ? grades.reduce((a: number, b: any) => a + b.score, 0) / grades.length : 0,
                attendanceRate: 98
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch student dashboard' });
    }
};

export const getStudentAssignments = async (req: AuthRequest, res: Response) => {
    try {
        const studentSnap = await db.collection('students').where('userId', '==', req.user!.id).get();
        if (studentSnap.empty) return res.status(404).json({ error: 'Student not found' });
        const student = studentSnap.docs[0];

        const assignmentsSnap = await db.collection('assignments')
            .where('classId', '==', String(student.data().grade))
            .get();

        const assignments = await Promise.all(assignmentsSnap.docs.map(async (doc) => {
            const data = doc.data();
            const subSnap = await db.collection('submissions')
                .where('assignmentId', '==', doc.id)
                .where('studentId', '==', student.id)
                .get();
            return {
                id: doc.id,
                ...data,
                submissions: subSnap.docs.map(s => s.data())
            };
        }));

        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
    const { assignmentId, content, fileUrl } = req.body;
    try {
        const studentSnap = await db.collection('students').where('userId', '==', req.user!.id).get();
        if (studentSnap.empty) return res.status(404).json({ error: 'Student not found' });

        const submissionData = {
            assignmentId,
            studentId: studentSnap.docs[0].id,
            content,
            fileUrl: fileUrl || null,
            submittedAt: new Date().toISOString()
        };

        const docRef = await db.collection('submissions').add(submissionData);
        res.status(201).json({ id: docRef.id, ...submissionData });
    } catch (error) {
        res.status(500).json({ error: 'Submission failed' });
    }
};

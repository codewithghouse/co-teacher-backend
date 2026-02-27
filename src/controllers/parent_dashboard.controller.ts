import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../lib/firebase';

export const getParentDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const parentId = req.user!.id;

        // Find students linked to this parent
        const studentsSnap = await db.collection('students').where('parentId', '==', parentId).get();

        if (studentsSnap.empty) {
            return res.status(404).json({ message: 'No children linked to this parent account.' });
        }

        const students = await Promise.all(studentsSnap.docs.map(async (doc) => {
            const sData = doc.data();
            const [uDoc, aSnap, gSnap, subSnap] = await Promise.all([
                db.collection('users').doc(sData.userId).get(),
                db.collection('attendance').where('studentId', '==', doc.id).orderBy('date', 'desc').limit(10).get(),
                db.collection('assessmentGrades').where('studentId', '==', doc.id).orderBy('gradedAt', 'desc').limit(10).get(),
                db.collection('submissions').where('studentId', '==', doc.id).orderBy('submittedAt', 'desc').limit(5).get()
            ]);

            const submissions = await Promise.all(subSnap.docs.map(async (subDoc) => {
                const subData = subDoc.data();
                const assignDoc = await db.collection('assignments').doc(subData.assignmentId).get();
                return {
                    id: subDoc.id,
                    ...subData,
                    assignment: assignDoc.exists ? { id: assignDoc.id, ...assignDoc.data() } : null
                };
            }));

            return {
                id: doc.id,
                ...sData,
                user: uDoc.exists ? { name: uDoc.data()?.name, email: uDoc.data()?.email } : null,
                attendance: aSnap.docs.map(d => d.data()),
                grades: gSnap.docs.map(d => d.data()),
                submissions
            };
        }));

        const primaryChild = students[0];
        const presentCount = primaryChild.attendance.filter((a: any) => a.status === 'PRESENT').length;
        const totalAttendance = primaryChild.attendance.length;
        const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

        // Recently sent/received messages
        const sentQuery = db.collection('messages').where('senderId', '==', parentId).orderBy('createdAt', 'desc').limit(10).get();
        const receivedQuery = db.collection('messages').where('receiverId', '==', parentId).orderBy('createdAt', 'desc').limit(10).get();

        const [sentSnap, receivedSnap] = await Promise.all([sentQuery, receivedQuery]);
        const messagesData = [...sentSnap.docs, ...receivedSnap.docs].map(doc => ({ id: doc.id, ...doc.data() }));
        messagesData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const messages = await Promise.all(messagesData.slice(0, 10).map(async (msg: any) => {
            const senderDoc = await db.collection('users').doc(msg.senderId).get();
            return { ...msg, sender: { name: senderDoc.data()?.name, role: senderDoc.data()?.role } };
        }));

        res.json({
            children: students,
            stats: {
                attendanceRate: Math.round(attendanceRate),
                avgGrade: primaryChild.grades.length > 0
                    ? Math.round(primaryChild.grades.reduce((a: number, b: any) => a + (b.score / b.maxScore * 100), 0) / primaryChild.grades.length)
                    : 0,
                pendingAssignments: primaryChild.submissions.filter((s: any) => !s.grade).length
            },
            recentMessages: messages
        });
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch parent dashboard data' });
    }
};

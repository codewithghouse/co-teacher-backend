import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../lib/firebase';

export const getStudentsByClass = async (req: AuthRequest, res: Response) => {
    const { grade, section } = req.query;
    try {
        const snapshot = await db.collection('students')
            .where('grade', '==', parseInt(grade as string))
            .where('section', '==', section as string)
            .get();

        if (snapshot.empty) {
            return res.json([]);
        }

        const students = await Promise.all(snapshot.docs.map(async (doc) => {
            const studentData = doc.data();
            const userDoc = await db.collection('users').doc(studentData.userId).get();
            return {
                id: doc.id,
                ...studentData,
                user: { id: userDoc.id, ...userDoc.data() }
            };
        }));

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

export const markAttendance = async (req: AuthRequest, res: Response) => {
    const { date, attendanceData, classId } = req.body;
    try {
        const batch = db.batch();
        const records: any[] = [];

        attendanceData.forEach((record: any) => {
            const attendanceRef = db.collection('attendance').doc();
            const data = {
                date: new Date(date).toISOString(),
                status: record.status,
                studentId: record.studentId,
                teacherId: req.user!.id,
                classId,
                createdAt: new Date().toISOString()
            };
            batch.set(attendanceRef, data);
            records.push({ id: attendanceRef.id, ...data });
        });

        await batch.commit();
        res.status(201).json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save attendance' });
    }
};

export const getAttendanceHistory = async (req: AuthRequest, res: Response) => {
    const { classId, startDate, endDate } = req.query;
    try {
        const snapshot = await db.collection('attendance')
            .where('classId', '==', classId as string)
            .where('date', '>=', new Date(startDate as string).toISOString())
            .where('date', '<=', new Date(endDate as string).toISOString())
            .get();

        const history = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const studentDoc = await db.collection('students').doc(data.studentId).get();
            const studentData = studentDoc.data();
            let userData = {};
            if (studentData?.userId) {
                const userDoc = await db.collection('users').doc(studentData.userId).get();
                userData = userDoc.data() || {};
            }
            return {
                id: doc.id,
                ...data,
                student: {
                    id: studentDoc.id,
                    ...studentData,
                    user: userData
                }
            };
        }));

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

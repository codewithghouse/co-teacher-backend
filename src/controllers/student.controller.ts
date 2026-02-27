import { Request, Response } from 'express';
import { db } from '../lib/firebase';

export const getStudentsByClass = async (req: Request, res: Response) => {
    const { grade, section } = req.query;
    try {
        let query: any = db.collection('students');

        if (grade) query = query.where('grade', '==', parseInt(grade as string));
        if (section) query = query.where('section', '==', section as string);

        const snapshot = await query.get();

        const students = await Promise.all(snapshot.docs.map(async (doc: any) => {
            const data = doc.data();
            const userDoc = await db.collection('users').doc(data.userId).get();
            const userData = userDoc.data();
            return {
                id: doc.id,
                ...data,
                user: { name: userData?.name, email: userData?.email }
            };
        }));

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

export const getStudentsDetailed = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('students').get();

        if (snapshot.empty) {
            // Mock Data for Demo
            return res.json([
                { id: "mj1", name: "Aarav Patel", email: "aarav@example.com", grade: 10, section: "A", avgPerformance: 85, lastAttendance: "PRESENT" },
                { id: "mj2", name: "Vihaan Singh", email: "vihaan@example.com", grade: 10, section: "B", avgPerformance: 92, lastAttendance: "PRESENT" },
                { id: "mj3", name: "Aditya Kumar", email: "aditya@example.com", grade: 9, section: "A", avgPerformance: 78, lastAttendance: "ABSENT" },
                { id: "mj4", name: "Diya Gupta", email: "diya@example.com", grade: 10, section: "A", avgPerformance: 88, lastAttendance: "PRESENT" },
                { id: "mj5", name: "Ananya Reddy", email: "ananya@example.com", grade: 10, section: "C", avgPerformance: 95, lastAttendance: "PRESENT" }
            ]);
        }

        const formatted = await Promise.all(snapshot.docs.map(async (doc) => {
            const s = doc.data();

            const [userDoc, gradesSnap, attendanceSnap] = await Promise.all([
                db.collection('users').doc(s.userId).get(),
                db.collection('assessmentGrades').where('studentId', '==', doc.id).get(),
                db.collection('attendance')
                    .where('studentId', '==', doc.id)
                    .get()
            ]);

            const userData = userDoc.data();
            const grades = gradesSnap.docs.map(g => g.data());
            const attendance = attendanceSnap.docs.map(a => a.data());

            // Sort attendance in memory to avoid index requirements
            attendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const avgScore = grades.length > 0
                ? (grades.reduce((acc, g) => acc + (g.score / g.maxScore), 0) / grades.length) * 100
                : 0;

            return {
                id: doc.id,
                name: userData?.name || 'Unknown',
                email: userData?.email || 'N/A',
                grade: s.grade,
                section: s.section,
                avgPerformance: Math.round(avgScore),
                lastAttendance: attendance[0]?.status || 'N/A'
            };
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch detailed roster' });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    const { name, email, grade, section, rollNo } = req.body;
    try {
        // 1. Create User Account (Placeholder)
        const userRef = await db.collection('users').add({
            name,
            email,
            role: 'STUDENT',
            createdAt: new Date().toISOString()
        });

        // 2. Create Student Profile
        const studentRef = await db.collection('students').add({
            userId: userRef.id,
            grade: parseInt(grade),
            section,
            rollNo: parseInt(rollNo),
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            id: studentRef.id,
            name,
            email,
            grade,
            section,
            avgPerformance: 0,
            lastAttendance: 'N/A'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create student' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, grade, section, rollNo } = req.body;

    try {
        const studentRef = db.collection('students').doc(id as string);
        const studentDoc = await studentRef.get();

        if (!studentDoc.exists) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentData = studentDoc.data();

        // Update Student Profile
        await studentRef.update({
            grade: parseInt(grade),
            section,
            rollNo: parseInt(rollNo)
        });

        // Update User Profile
        if (studentData?.userId) {
            await db.collection('users').doc(studentData.userId).update({
                name,
                email
            });
        }

        res.json({ id, name, email, grade, section, rollNo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update student' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const studentRef = db.collection('students').doc(id as string);
        const studentDoc = await studentRef.get();

        if (!studentDoc.exists) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Optional: Delete linked user account if needed
        // const userId = studentDoc.data()?.userId;
        // if (userId) await db.collection('users').doc(userId).delete();

        await studentRef.delete();
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
};

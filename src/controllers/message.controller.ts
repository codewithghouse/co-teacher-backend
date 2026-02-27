import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../lib/firebase';

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        // Firestore doesn't support OR across different fields easily
        const sentQuery = db.collection('messages').where('senderId', '==', userId).get();
        const receivedQuery = db.collection('messages').where('receiverId', '==', userId).get();

        const [sentSnap, receivedSnap] = await Promise.all([sentQuery, receivedQuery]);

        const messagesData = [...sentSnap.docs, ...receivedSnap.docs].map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort by createdAt descending
        messagesData.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Fetch sender/receiver info
        const messages = await Promise.all(messagesData.map(async (msg: any) => {
            const [sDoc, rDoc] = await Promise.all([
                db.collection('users').doc(msg.senderId).get(),
                db.collection('users').doc(msg.receiverId).get()
            ]);

            const sData = sDoc.data();
            const rData = rDoc.data();

            return {
                ...msg,
                sender: { id: sDoc.id, name: sData?.name, role: sData?.role },
                receiver: { id: rDoc.id, name: rData?.name, role: rData?.role }
            };
        }));

        if (messages.length === 0) {
            // Return mock contacts for demo if no history exists
            return res.json([
                {
                    id: "mock-msg-1",
                    content: "Hello, I wanted to discuss Aarav's progress.",
                    senderId: "mock-parent-1",
                    receiverId: userId,
                    createdAt: new Date().toISOString(),
                    sender: { id: "mock-parent-1", name: "Mrs. Patel (Parent)", role: "PARENT" },
                    receiver: { id: userId, name: "Teacher", role: "TEACHER" }
                }
            ]);
        }

        res.json(messages);
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

import { EmailService } from '../services/email.service';

export const sendEmailToParent = async (req: AuthRequest, res: Response) => {
    const { parentId, customEmail, subject, body } = req.body;

    if ((!parentId && !customEmail) || !subject || !body) {
        return res.status(400).json({ error: "Missing required fields (Recipient, subject, body)" });
    }

    try {
        let recipientEmail: string | undefined = customEmail;
        let recipientName: string = customEmail ? "External Recipient" : "User";

        // Only do DB lookup if customEmail is NOT provided
        if (!customEmail && parentId) {
            // 1. Try fetching direct user (Parent or Teacher)
            const userDoc = await db.collection('users').doc(parentId).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                recipientEmail = userData?.email;
                recipientName = userData?.name || "User";
            } else {
                // 2. Try fetching as student ID and get parentId or student email
                const studentDoc = await db.collection('students').doc(parentId).get();
                if (studentDoc.exists) {
                    const sData = studentDoc.data();

                    // If student has a linked parent, try to get parent's email first
                    if (sData?.parentId) {
                        const parentDoc = await db.collection('users').doc(sData.parentId).get();
                        if (parentDoc.exists) {
                            recipientEmail = parentDoc.data()?.email;
                            recipientName = parentDoc.data()?.name || "Parent";
                        }
                    }

                    // If no parent email found, fall back to student's own email
                    if (!recipientEmail && sData?.userId) {
                        const studentUserDoc = await db.collection('users').doc(sData.userId).get();
                        if (studentUserDoc.exists) {
                            recipientEmail = studentUserDoc.data()?.email;
                            recipientName = studentUserDoc.data()?.name || "Student";
                        }
                    }
                }
            }
        }

        if (!recipientEmail) {
            return res.status(404).json({ error: "No email address found for this recipient. Please ensure the student or parent has an email set up." });
        }

        console.log(`[Email] Resolved recipient: ${recipientName} <${recipientEmail}>`);

        const result = await EmailService.sendEmail(recipientEmail, subject, body);

        if (result.success) {
            const logEntry = {
                senderId: req.user!.id,
                recipientEmail,
                recipientName,
                subject,
                body,
                status: 'SENT',
                sentAt: new Date().toISOString(),
                messageId: result.messageId
            };

            await db.collection('emailLogs').add(logEntry);
            console.log(`[Email] History log created for: ${recipientEmail}`);

            res.json({ success: true, message: `Email sent to ${recipientName} successfully via SMTP` });
        } else {
            res.status(500).json({ success: false, error: result.message });
        }
    } catch (error: any) {
        console.error("[MessageController] Email Error:", error);
        res.status(500).json({ error: "Failed to send email. Check SMTP settings and contact validity." });
    }
};

export const getEmailHistory = async (req: AuthRequest, res: Response) => {
    try {
        const teacherId = req.user!.id;
        console.log(`[EmailHistory] Fetching history for teacher: ${teacherId}`);

        const snapshot = await db.collection('emailLogs')
            .where('senderId', '==', teacherId)
            .limit(50)
            .get();

        const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as any));

        // Sort in-memory to avoid Firestore Index requirement
        history.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

        console.log(`[EmailHistory] Found ${history.length} records.`);
        res.json(history);
    } catch (error: any) {
        console.error("[MessageController] History Fetch Error:", error.message);
        res.status(500).json({ error: "Failed to fetch email history. Internal database error." });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { receiverId, content } = req.body;
    try {
        const messageData = {
            content,
            senderId: req.user!.id,
            receiverId,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        const docRef = await db.collection('messages').add(messageData);
        res.status(201).json({ id: docRef.id, ...messageData });
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const markRead = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const messageRef = db.collection('messages').doc(id as string);
        const doc = await messageRef.get();

        if (!doc.exists || doc.data()?.receiverId !== req.user!.id) {
            return res.status(404).json({ error: 'Message not found or unauthorized' });
        }

        await messageRef.update({ isRead: true });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
};

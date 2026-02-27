import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../lib/firebase';
import { AIService } from '../services/ai.service';

export const generateExamPaper = async (req: AuthRequest, res: Response) => {
    const { subject, grade, marks, difficulty, examType, syllabus } = req.body;
    try {
        if (!subject) return res.status(400).json({ error: 'Subject is required' });

        const paper = await AIService.generateQuestionPaper(subject, grade, marks, difficulty, examType || 'Mid-Term', syllabus || '');
        res.json(paper);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate question paper' });
    }
};

import { Request, Response } from 'express';
import { CURRICULUM_DATA } from '../data/curriculumData';

// 1. Get all Boards
export const getBoards = async (req: Request, res: Response) => {
    const boards = Object.keys(CURRICULUM_DATA);
    res.json(boards);
};

// 2. Get Grades for a Board
export const getGrades = async (req: Request, res: Response) => {
    const { board } = req.params;
    const boardData = CURRICULUM_DATA[board as keyof typeof CURRICULUM_DATA];
    if (!boardData) return res.status(404).json({ error: "Board not found" });

    // Convert keys to numbers and sort
    const grades = Object.keys(boardData).map(Number).sort((a, b) => a - b);
    res.json(grades);
};

// 3. Get Subjects for a Grade
export const getSubjects = async (req: Request, res: Response) => {
    const { board, grade } = req.params;
    console.log(`[DEBUG] getSubjects called for board: ${board}, grade: ${grade}`);
    const boardData = CURRICULUM_DATA[board as keyof typeof CURRICULUM_DATA];
    if (!boardData) return res.status(404).json({ error: "Board not found" });

    const gradeData = boardData[grade as keyof typeof boardData];
    if (!gradeData) return res.status(404).json({ error: "Grade not found" });

    // Format for frontend: { id: "subjectName", name: "subjectName", chapters: [] }
    const subjects = Object.keys(gradeData).map(name => ({
        id: name,
        name: name,
        chapters: [
            { id: `${name}-ch1`, title: "General", topics: (gradeData[name as keyof typeof gradeData] as string[]).map((t: string) => ({ id: t, name: t })) }
        ]
    }));

    res.json(subjects);
};

export const getMetadata = async (req: Request, res: Response) => {
    const { curriculum, class: gradeRaw } = req.query;
    console.log(`[DEBUG] getMetadata called with query:`, req.query);
    // Normalize grade: "Class 2" -> "2", "2" -> "2"
    const grade = (gradeRaw as string || "").replace(/[^0-9]/g, "");

    if (!curriculum || !grade) {
        return res.status(400).json({ error: "Missing curriculum or class query param" });
    }

    const boardData = CURRICULUM_DATA[curriculum as string];
    if (!boardData) {
        return res.status(404).json({ error: "Curriculum not found" });
    }

    const classData = boardData[grade];
    if (!classData) {
        return res.status(404).json({ error: "Class not found" });
    }

    const subjects = Object.keys(classData);
    const topics = classData;

    res.json({ subjects, topics });
};



import { Request, Response } from 'express';
// @ts-ignore
const fs = require('fs');

import cloudinary from '../config/cloudinary';

// Handle general file upload to Cloudinary
export const uploadFile = async (req: Request, res: Response) => {
    try {
        const file = (req as any).file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'co-teacher-uploads',
            resource_type: 'auto'
        });

        // Delete local temporary file
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        res.status(200).json({
            message: 'File uploaded successfully',
            filename: file.filename,
            originalName: file.originalname,
            url: result.secure_url,
            cloudinaryId: result.public_id
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ error: 'Failed to upload to Cloudinary' });
    }
};

// Handle PDF text extraction
export const extractPdfText = async (req: Request, res: Response) => {
    try {
        const file = (req as any).file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // CJS Require
        // @ts-ignore
        const pdfParse = require('pdf-parse');

        const filePath = file.path;
        const dataBuffer = fs.readFileSync(filePath);

        const data = await pdfParse(dataBuffer);

        res.json({ text: data.text });
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        res.status(500).json({ error: 'Failed to extract text from PDF' });
    }
};

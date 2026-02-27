
import { Request, Response, NextFunction } from 'express';
import { OCRService } from '../services/analysis-ocr.service';
import { GroqAnalysisService } from '../services/groq-analysis.service';
import { cleanAndNormalizeText, splitIntoChunks } from '../utils/analysis-utils';
import * as fs from 'fs';

/**
 * Controller for crash-proof PDF analysis
 */
export const handlePdfAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No PDF file uploaded." });
    }

    const filePath = req.file.path;

    try {
        // 1. Extract
        console.log("[ANALYSIS] Extracting text from PDF...");
        let text = await OCRService.extractText(filePath);
        console.log(`[ANALYSIS] Text extracted. Length: ${text.length} characters.`);

        // 2. Normalize
        text = cleanAndNormalizeText(text);
        if (!text || text.length < 20) {
            console.error("[ANALYSIS] Document seems empty or unreadable.");
            throw new Error("Could not extract enough meaningful text to analyze. Make sure the PDF is not encrypted.");
        }

        // 3. Chunk
        const chunks = splitIntoChunks(text, 6000);
        console.log(`[ANALYSIS] Processing ${chunks.length} chunks on Groq...`);

        // 4. Analyze Sequentially
        const chunkResults = [];
        for (let i = 0; i < chunks.length; i++) {
            console.log(`[ANALYSIS] Analyzing chunk ${i + 1}/${chunks.length}...`);
            const result = await GroqAnalysisService.analyzeChunk(chunks[i]);
            if (result) chunkResults.push(result);
        }

        if (chunkResults.length === 0) {
            throw new Error("AI was unable to generate any insights from this document.");
        }

        // 5. Merge
        const finalData = GroqAnalysisService.mergeResults(chunkResults);
        console.log("[ANALYSIS] Merged results successfully.");

        // 6. Structured Flat Response
        return res.status(200).json({
            success: true,
            summary: finalData.summary,
            key_points: finalData.key_points,
            quiz: finalData.quiz
        });

    } catch (error: any) {
        console.error("[CONTROLLER ERROR] PDF Analysis Failed:", error.message);

        // Return structured error instead of falling through to global middleware if possible
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "An unexpected error occurred during PDF analysis.",
            dev_error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        // 6. Safe Cleanup
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("[ANALYSIS] Temporary file deleted.");
        }
    }
};


import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';
import * as fs from 'fs';

/**
 * OCR Service for local Tesseract processing
 */
export class OCRService {
    static async extractFromScannedPdf(filePath: string): Promise<string> {
        const worker = await createWorker('eng');
        try {
            // Note: Tesseract.js normally handles images. 
            // For a production-grade PDF OCR, we'd typically convert PDF pages to images first 
            // (e.g., using pdf-img-convert). 
            // Here we assume basic Tesseract ingestion or 
            // simple fallback for non-textual streams.
            const result = await worker.recognize(filePath);
            return result.data.text;
        } catch (error) {
            console.error("OCR Error:", error);
            throw new Error("OCR processing failed locally.");
        } finally {
            await worker.terminate();
        }
    }

    static async extractText(buffer: Buffer): Promise<string> {
        const data = await pdf(buffer);
        return data.text || "";
    }
}

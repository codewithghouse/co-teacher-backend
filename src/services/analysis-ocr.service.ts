
import pdf from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import * as fs from 'fs';

/**
 * Service to handle PDF text extraction with local OCR fallback
 */
export class OCRService {
    static async extractText(filePath: string): Promise<string> {
        const dataBuffer = fs.readFileSync(filePath);

        try {
            const data = await pdf(dataBuffer);
            let extractedText = data.text || "";

            // Check if PDF is likely scanned (very little text)
            if (extractedText.replace(/\s/g, '').length < 100) {
                console.log("[OCR] Scanned PDF detected. Using local Tesseract...");
                return await this.performLocalOCR(filePath);
            }

            return extractedText;
        } catch (error) {
            console.warn("[OCR] PDF Parse failed, falling back to Tesseract:", error);
            return await this.performLocalOCR(filePath);
        }
    }

    private static async performLocalOCR(filePath: string): Promise<string> {
        const worker = await createWorker('eng');
        try {
            const { data: { text } } = await worker.recognize(filePath);
            return text;
        } catch (error) {
            console.error("[OCR] Tesseract Error:", error);
            throw new Error("Local OCR failed to process document.");
        } finally {
            await worker.terminate();
        }
    }
}

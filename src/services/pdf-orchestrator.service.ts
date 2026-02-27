
import * as fs from 'fs';
import { OCRService } from './ocr.service';
import { GroqAnalysisService } from './groq-analysis.service';
import { cleanText, chunkText } from '../utils/pdf-utils';

export class PDFAnalysisService {
    static async processDocument(filePath: string): Promise<any> {
        let text = "";
        const dataBuffer = fs.readFileSync(filePath);

        // STEP 2: Detect text vs scanned
        try {
            text = await OCRService.extractText(dataBuffer);

            // If less than 100 useful chars, treat as scanned
            if (text.replace(/\s/g, '').length < 100) {
                console.log("Scanned PDF detected, starting OCR...");
                text = await OCRService.extractFromScannedPdf(filePath);
            }
        } catch (e) {
            console.warn("Extraction failed, falling back to OCR...");
            text = await OCRService.extractFromScannedPdf(filePath);
        }

        // STEP 3: Clean text
        text = cleanText(text);

        if (!text) throw new Error("Could not extract any meaningful text from PDF.");

        // STEP 4: Chunking
        const chunks = chunkText(text, 6000);

        // STEP 5: Process chunks
        const results = [];
        for (const chunk of chunks) {
            const res = await GroqAnalysisService.analyzeChunk(chunk);
            if (res) results.push(res);
        }

        // STEP 6: Merge Results
        return await GroqAnalysisService.mergeResults(results);
    }
}


import Groq from "groq-sdk";
import { extractStrictJSON } from "../utils/analysis-utils";

/**
 * Production-ready Groq service for strictly JSON analysis
 */
export class GroqAnalysisService {
    private static getClient() {
        const apiKey = process.env.GROQ_API_KEY;
        console.log("[DEBUG] GROQ_API_KEY loaded:", apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : "MISSING");

        if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey.length < 5) {
            throw new Error("GROQ_API_KEY is missing, invalid, or still at default value in .env.");
        }
        return new Groq({ apiKey });
    }

    static async analyzeChunk(chunk: string, retryCount: number = 1): Promise<any> {
        const groq = this.getClient();

        const systemPrompt = `You are a strict JSON generator. 
Return ONLY valid JSON. No conversational text. No markdown backticks.
The JSON must strictly follow this structure:
{
  "summary": "Full summary text here",
  "key_points": ["point 1", "point 2", "point 3"],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct Option"
    }
  ]
}`;

        try {
            console.log("[GROQ] Sending request to llama-3.3-70b-versatile...");
            const response = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Analyze this content: \n\n${chunk}` }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                response_format: { type: "json_object" }
            });

            const rawContent = response.choices[0]?.message?.content || "";
            console.log("[DEBUG] Raw Groq Response:", rawContent);

            let parsed = null;
            try {
                parsed = extractStrictJSON(rawContent);
            } catch (jsonErr: any) {
                console.error("[GROQ] JSON Extraction failed:", jsonErr.message);
            }

            if (!parsed && retryCount > 0) {
                console.warn("[GROQ] Invalid or null JSON received, retrying once...");
                return await this.analyzeChunk(chunk, retryCount - 1);
            }

            if (!parsed) {
                throw new Error("Groq returned an unparsable response after retries.");
            }

            return parsed;
        } catch (error: any) {
            console.error("[GROQ] Fatal Error:", error.message);
            if (error.status === 401) throw new Error("Invalid Groq API Key.");
            if (error.status === 429) throw new Error("Groq API rate limit exceeded.");
            throw new Error(`AI analysis failed: ${error.message}`);
        }
    }

    static mergeResults(results: any[]): any {
        return {
            summary: results.map(r => r.summary).join(" "),
            key_points: [...new Set(results.flatMap(r => r.key_points || []))],
            quiz: results.flatMap(r => r.quiz || [])
        };
    }
}

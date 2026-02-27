import Groq from "groq-sdk";
import { ImageService } from "./image.service";

const getGroq = () => {
    const key = process.env.GROQ_API_KEY;
    if (!key || key === "your_groq_api_key_here") return null;
    return new Groq({ apiKey: key });
};

const GROQ_MODEL = "llama-3.3-70b-versatile";

export class AIService {
    static async generateWithGroq(prompt: string) {
        const groq = getGroq();
        if (!groq) throw new Error("Groq API Key not configured");

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert educational assistant. Response must be strictly VALID JSON. No markdown backticks."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: GROQ_MODEL,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || "{}";
        try {
            return JSON.parse(content);
        } catch (error) {
            console.error("JSON Parse Error. Content:", content);
            const start = content.indexOf('{');
            const end = content.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                return JSON.parse(content.substring(start, end + 1));
            }
            throw error;
        }
    }

    static async generateLessonPlan(topic: string, grade: string, subject: string, pdfContext: string = "", unitDetails: string = "", duration: string = "45", numSessions: string = "1", curriculum: string = "Standard") {
        const prompt = `Generate a detailed lesson plan for ${topic}, grade ${grade}, subject ${subject}. Curriculum: ${curriculum}. Duration: ${duration}min. Sessions: ${numSessions}. 
        Context: ${pdfContext.substring(0, 2000)}
        Return JSON: {
            "objective": [], "materials": [], "explanation": "", "pedagogy": "", "inquiryBasedLearning": "",
            "activities": [{"time": "", "description": ""}], "homework": "", "questions": [],
            "teachingStrategies": [], "assessmentMethods": [], "differentiation": {"advanced": "", "struggling": ""},
            "estimatedTime": [], "videoSearchQuery": "", "motivationalQuote": ""
        }`;

        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return this.getSimulatedLesson(topic, grade, subject, !!pdfContext);
        }
    }

    static async generatePresentation(topic: string, grade: string, curriculum: string, slides: number) {
        const prompt = `Generate ${slides} PowerPoint slides for ${topic}, grade ${grade}. 
        Return JSON: { "slides": [{"slide_number": 1, "title": "", "subtitle": "", "content": [], "activity": "", "image_keyword": "", "layout_type": ""}] }`;

        try {
            const res = await this.generateWithGroq(prompt);
            const aiSlides = res.slides || [];
            return await Promise.all(aiSlides.map(async (slide: any) => {
                let imageUrl = `https://source.unsplash.com/featured/1600x900?${encodeURIComponent(slide.image_keyword || topic)}`;
                try {
                    const pexelsUrl = await ImageService.getRandomImage(slide.image_keyword || topic);
                    if (pexelsUrl) imageUrl = pexelsUrl;
                } catch (e) { }
                return { ...slide, image_url: imageUrl };
            }));
        } catch (error) {
            return this.getSimulatedPPT(topic, grade, curriculum, slides);
        }
    }

    static async generateDataAnalysis(csvData: string, analysisType: string) {
        const prompt = `Analyze this CSV data (${analysisType}): ${csvData.substring(0, 10000)}. Return detailed JSON analysis.`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { success: false, message: "Analysis failed" };
        }
    }

    static async generateQuiz(topic: string, grade: string, subject: string, questionType: string, bloomLevel: string, count: number = 5) {
        const prompt = `Generate ${count} ${questionType} questions on ${topic} for grade ${grade}. Bloom Level: ${bloomLevel}. 
        Return JSON: { "title": "", "questions": [{"id": 1, "type": "MCQ", "question": "", "options": [], "correctAnswer": "", "explanation": ""}] }`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { title: topic, questions: [] };
        }
    }

    static async generateMaterial(topic: string, type: string, grade?: string, subject?: string) {
        const prompt = `Generate ${type} for ${topic}. Return structured JSON.`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { title: topic, content: "Generated content placeholder" };
        }
    }

    static async generateAssignment(topic: string, grade: string, subject: string, type: string, difficulty: string, count: string) {
        const prompt = `Generate ${type} on ${topic} for grade ${grade}. Difficulty: ${difficulty}. Count: ${count}. Return JSON.`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { title: topic, instructions: [], content: {}, answerKey: {} };
        }
    }

    static async generateQuestionPaper(subject: string, grade: string, marks: number, difficulty: string, examType: string, syllabus: string) {
        const prompt = `Generate ${marks} marks question paper for ${subject}, grade ${grade}. Difficulty: ${difficulty}. 
        Return JSON: { "title": "", "totalMarks": ${marks}, "sections": [{"name": "", "questions": []}], "answerKey": {} }`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { title: examType, totalMarks: marks, sections: [] };
        }
    }

    static async summarizeContent(content: string) {
        const prompt = `Summarize this: ${content.substring(0, 8000)}. 
        Return JSON: { "overview": "", "keyPoints": [], "actionItems": [] }`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { overview: "Summary failed", keyPoints: [], actionItems: [] };
        }
    }

    static async extractVocabulary(text: string) {
        const prompt = `Extract difficult vocabulary from: ${text.substring(0, 3000)}. Return JSON: { "vocabulary": [{"word": "", "definition": "", "example": ""}] }`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { vocabulary: [] };
        }
    }

    static async generateMiniQuiz(text: string) {
        const prompt = `Generate a 3-question mini-quiz. Return JSON: { "questions": [{"id": 1, "question": "", "options": [], "correctAnswer": ""}] }`;
        try {
            return await this.generateWithGroq(prompt);
        } catch (error) {
            return { questions: [] };
        }
    }

    static async summarizeScannedPdf(buffer: Buffer) {
        // Since we want to use Groq, we'd need OCR first. 
        // For now, satisfy the compiler with an error message or basic fallback.
        throw new Error("Scanned PDF processing moved to new analysis route. Please use /api/analysis/pdf for better results.");
    }

    private static getSimulatedLesson(topic: string, grade: string, subject: string, hasPdf: boolean) {
        return { objective: [], materials: [], explanation: "Simulated content", pedagogy: "", activities: [], homework: "", questions: [] };
    }

    private static getSimulatedPPT(topic: string, grade: string, curriculum: string, numSlides: number) {
        return Array.from({ length: numSlides }).map((_, i) => ({ slide_number: i + 1, title: "Slide", content: [] }));
    }
}

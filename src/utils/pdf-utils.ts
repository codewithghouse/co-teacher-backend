
/**
 * Production-Grade Text and JSON Utilities
 */

export const cleanText = (text: string): string => {
    return text
        .replace(/\\t/g, ' ')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\s{3,}/g, ' ')
        .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable special chars
        .trim();
};

export const chunkText = (text: string, chunkSize: number = 6000): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
};

export const safeParseJSON = (content: string): any => {
    try {
        // Attempt clean parse
        const clean = content.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
        return JSON.parse(clean);
    } catch (e) {
        // Fallback: extract using first { and last }
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            try {
                return JSON.parse(content.substring(start, end + 1));
            } catch (innerError) {
                return null;
            }
        }
        return null;
    }
};

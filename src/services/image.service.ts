import axios from 'axios';

const PEXELS_URL = 'https://api.pexels.com/v1/search';

export class ImageService {
    static async getRandomImage(query: string): Promise<string> {
        const apiKey = process.env.PEXELS_API_KEY;

        if (!apiKey || apiKey === 'your_pexels_api_key_here') {
            console.warn("[ImageService] Pexels API Key is missing or default. using fallback.");
            return `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80`;
        }

        try {
            console.log(`[ImageService] Searching Pexels for: ${query}`);
            let response = await axios.get(PEXELS_URL, {
                params: { query, per_page: 1, orientation: 'landscape' },
                headers: { Authorization: apiKey }
            });

            // If no results for specific query, try a simpler version (first two words)
            if (!response.data.photos || response.data.photos.length === 0) {
                const simpleQuery = query.split(' ').slice(0, 2).join(' ');
                console.log(`[ImageService] No results for "${query}", trying simpler: "${simpleQuery}"`);
                response = await axios.get(PEXELS_URL, {
                    params: { query: simpleQuery, per_page: 1, orientation: 'landscape' },
                    headers: { Authorization: apiKey }
                });
            }

            if (response.data.photos && response.data.photos.length > 0) {
                const url = response.data.photos[0].src.large2x;
                console.log(`[ImageService] Success: ${url}`);
                return url;
            }
        } catch (error: any) {
            console.error("[ImageService] Pexels Error:", error.response?.data || error.message);
        }

        return `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1600&q=80`;
    }

    static generateDiagramUrl(description: string): string {
        if (!description) return "";

        // Clean and optimize the prompt for a professional educational diagram
        const cleanPrompt = description
            .replace(/[^\w\s]/gi, '')
            .substring(0, 300);

        const enhancedPrompt = `educational diagram of ${cleanPrompt}, white background, scientific illustration, labeled, textbook style, high quality`;

        // Using flux-pro for better diagrams if available, otherwise standard flux
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&model=flux&nologo=1`;
    }
}

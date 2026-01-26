
import { GoogleGenAI, Type } from "@google/genai";
import { Resource, TVETCategory } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getRecommendations(userInterest: TVETCategory, availableResources: Resource[]): Promise<string[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given a user interested in ${userInterest}, recommend the top 3 IDs from this list: ${JSON.stringify(availableResources.map(r => ({id: r.id, title: r.title, category: r.category})))}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });
      
      const data = JSON.parse(response.text);
      return data.recommendedIds || [];
    } catch (error) {
      console.error("AI Recommendation failed:", error);
      return [];
    }
  }

  async generateResourceDescription(title: string, category: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a compelling 2-sentence marketing description for a TVET resource titled "${title}" in the ${category} category.`,
    });
    return response.text || "High-quality academic resource for TVET excellence.";
  }
}

export const geminiService = new GeminiService();

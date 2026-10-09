import { GoogleGenAI } from "@google/genai";
import { cleanRawAIResponse } from "./cleaner";

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
    if (!geminiClient) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }
        geminiClient = new GoogleGenAI({
            apiKey,
            httpOptions: {
                timeout: 25000,
            },
        });
    }
    return geminiClient;
}

export async function askGemini(prompt: string): Promise<string> {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
            systemInstruction: "You are the FOODFLOW operational reasoning copilot. Provide direct, concise operational advice without any chain-of-thought, reasoning steps, or preamble. When JSON is requested, output valid JSON only.",
        },
    });

    const raw = response.text ?? "";
    return cleanRawAIResponse(raw);
}
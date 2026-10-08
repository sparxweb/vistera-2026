import { GoogleGenAI } from "@google/genai";
import { cleanRawAIResponse } from "./cleaner";

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
        timeout: 25000,
    },
});

export async function askGemini(prompt: string): Promise<string> {
    const response = await gemini.models.generateContent({
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
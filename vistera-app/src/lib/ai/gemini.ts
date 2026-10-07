import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
        timeout: 30000,
    },
});

export async function askGemini(prompt: string): Promise<string> {
    const response = await gemini.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: prompt,
    });

    return response.text ?? "";
}
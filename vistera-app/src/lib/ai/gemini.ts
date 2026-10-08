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
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
            systemInstruction: "You are the FOODFLOW operational reasoning copilot. Provide direct, concise operational advice without any chain-of-thought, reasoning steps, or preamble.",
        },
    });

    const raw = response.text ?? "";
    // If any chain-of-thought preamble leaked through, strip it cleanly
    if (raw.includes("Here's a thinking process") || raw.includes("Here's a thinking")) {
        const parts = raw.split(/\n\n(?=[A-Z])/);
        return parts[parts.length - 1]?.trim() || raw;
    }
    return raw.trim();
}
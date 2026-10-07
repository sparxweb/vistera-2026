import { askGemini } from "./gemini";
import { askNvidia } from "./nvidia";

export type AIProvider = "gemini" | "nvidia";

export async function askAI(
    prompt: string,
    provider: AIProvider = "gemini"
): Promise<string> {
    if (provider === "nvidia") {
        return askNvidia(prompt);
    }

    try {
        return await askGemini(prompt);
    } catch (error) {
        console.error("Gemini failed, switching to NVIDIA:", error);

        return askNvidia(prompt);
    }
}
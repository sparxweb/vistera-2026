import OpenAI from "openai";

const nvidia = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function askNvidia(prompt: string): Promise<string> {
    const response = await nvidia.chat.completions.create({
        model: "nvidia/nemotron-3.5-lightning-30b-a3b",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.2,
        max_tokens: 300,
    });

    return response.choices[0]?.message?.content ?? "";
}
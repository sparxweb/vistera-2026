import OpenAI from "openai";

let nvidiaClient: OpenAI | null = null;

function getNvidiaClient(): OpenAI {
    if (!nvidiaClient) {
        const apiKey = process.env.NVIDIA_API_KEY;
        if (!apiKey) {
            throw new Error("NVIDIA_API_KEY is not configured.");
        }
        nvidiaClient = new OpenAI({
            apiKey,
            baseURL: "https://integrate.api.nvidia.com/v1",
        });
    }
    return nvidiaClient;
}

export async function askNvidia(prompt: string): Promise<string> {
    const client = getNvidiaClient();
    const response = await client.chat.completions.create({
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


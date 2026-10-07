import { NextRequest, NextResponse } from "next/server";
import { askAI, type AIProvider } from "@/lib/ai/router";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const prompt = body?.prompt;
        const provider = body?.provider as AIProvider | undefined;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "A prompt is required." },
                { status: 400 }
            );
        }

        const answer = await askAI(prompt, provider || "gemini");

        return NextResponse.json({
            success: true,
            answer,
            provider: provider || "gemini",
        });
    } catch (error) {
        console.error("AI route error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "AI request failed.",
            },
            { status: 500 }
        );
    }
}
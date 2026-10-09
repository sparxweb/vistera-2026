import { NextRequest, NextResponse } from "next/server";
import { askAI, type AIProvider } from "@/lib/ai/router";

export async function POST(request: NextRequest) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, error: "Malformed or missing JSON body." },
            { status: 400 }
        );
    }

    const prompt = body?.prompt;
    const provider = body?.provider as AIProvider | undefined;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        return NextResponse.json(
            { success: false, error: "A valid non-empty prompt string is required." },
            { status: 400 }
        );
    }

    try {
        const answer = await askAI(prompt, provider || "gemini");

        return NextResponse.json({
            success: true,
            answer,
            provider: provider || "gemini",
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "AI service unavailable.";
        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
            },
            { status: 503 }
        );
    }
}
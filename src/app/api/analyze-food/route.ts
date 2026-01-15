import { NextRequest, NextResponse } from "next/server";
import { getGeminiVisionModel } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const images = formData.getAll("images") as File[];

        if (!images.length) {
            return NextResponse.json(
                { error: "No images provided" },
                { status: 400 }
            );
        }

        const imageParts = await Promise.all(
            images.map(async (image) => {
                const bytes = await image.arrayBuffer();
                const base64 = Buffer.from(bytes).toString("base64");
                return {
                    inlineData: {
                        data: base64,
                        mimeType: image.type,
                    },
                };
            })
        );

        const prompt = `Analyze these food images and extract the user's taste preferences.

Return a JSON object with:
{
  "cuisine": ["list of cuisine types detected, e.g., Japanese, Italian, Mexican"],
  "flavorProfile": ["flavor preferences like spicy, umami, sweet, savory, fresh"],
  "diningStyle": ["casual, fine dining, street food, home-style, etc."],
  "ingredients": ["key ingredients the user seems to enjoy"],
  "confidence": 0.0-1.0 confidence score
}

Be specific and detailed. Only return valid JSON, no markdown.`;

        const result = await getGeminiVisionModel().generateContent([
            prompt,
            ...imageParts,
        ]);

        const response = result.response.text();

        // Clean up markdown code blocks if present
        const cleanedResponse = response
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

        const analysis = JSON.parse(cleanedResponse);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Food analysis error:", error);
        return NextResponse.json(
            { error: "Failed to analyze food images" },
            { status: 500 }
        );
    }
}

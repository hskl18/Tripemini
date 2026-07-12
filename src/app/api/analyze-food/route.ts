import { NextRequest, NextResponse } from "next/server";
import { getGeminiVisionModel } from "@/lib/gemini";
import {
    MAX_IMAGE_REQUEST_BYTES,
    MAX_IMAGE_COUNT,
    MAX_IMAGE_BYTES,
    ALLOWED_IMAGE_TYPES,
    hasContentType,
    PayloadTooLargeError,
    readBoundedRequestBody,
    rejectDeclaredPayloadTooLarge,
    modelRequestGate,
    type ModelRequestGate,
} from "@/lib/api-guards";

type AnalyzeFoodHandlerOptions = {
    generate?: (parts: Array<string | { inlineData: { data: string; mimeType: string } }>) => Promise<string>;
    gate?: ModelRequestGate;
};

async function generateWithGemini(
    parts: Array<string | { inlineData: { data: string; mimeType: string } }>
): Promise<string> {
    const result = await getGeminiVisionModel().generateContent(parts);
    return result.response.text();
}

export function createAnalyzeFoodHandler(
    options: AnalyzeFoodHandlerOptions = {}
) {
    const generate = options.generate ?? generateWithGemini;
    const gate = options.gate ?? modelRequestGate;

    return async function handleAnalyzeFood(request: NextRequest) {
    const tooLarge = rejectDeclaredPayloadTooLarge(
        request,
        MAX_IMAGE_REQUEST_BYTES
    );
    if (tooLarge) return tooLarge;
    if (!hasContentType(request, "multipart/form-data")) {
        return NextResponse.json(
            { error: "Request must use multipart/form-data" },
            { status: 400 }
        );
    }

    try {
        const body = await readBoundedRequestBody(
            request,
            MAX_IMAGE_REQUEST_BYTES
        );
        const bodyBuffer = new ArrayBuffer(body.byteLength);
        new Uint8Array(bodyBuffer).set(body);
        const boundedRequest = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            body: bodyBuffer,
        });
        const formData = await boundedRequest.formData();
        const images = formData.getAll("images") as File[];

        if (images.length < 1 || images.length > MAX_IMAGE_COUNT) {
            return NextResponse.json(
                { error: "Upload between one and four images" },
                { status: 400 }
            );
        }

        if (images.some((image) => !ALLOWED_IMAGE_TYPES.has(image.type))) {
            return NextResponse.json(
                { error: "Images must be JPEG, PNG, or WebP" },
                { status: 400 }
            );
        }

        if (images.some((image) => image.size > MAX_IMAGE_BYTES)) {
            return NextResponse.json(
                { error: "Each image must be 4 MiB or smaller" },
                { status: 413 }
            );
        }

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

        const decision = gate.tryStart(request);
        if (!decision.ok) return decision.response;

        let response: string;
        try {
            const imageParts = await Promise.all(
                images.map(async (image) => {
                    const bytes = await image.arrayBuffer();
                    return {
                        inlineData: {
                            data: Buffer.from(bytes).toString("base64"),
                            mimeType: image.type,
                        },
                    };
                })
            );
            response = await generate([prompt, ...imageParts]);
        } finally {
            decision.release();
        }

        // Clean up markdown code blocks if present
        const cleanedResponse = response
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

        const analysis = JSON.parse(cleanedResponse);

        return NextResponse.json(analysis);
    } catch (error) {
        if (error instanceof PayloadTooLargeError) {
            return NextResponse.json(
                { error: error.message },
                { status: 413 }
            );
        }
        console.error("Food analysis error:", error);
        return NextResponse.json(
            { error: "Failed to analyze food images" },
            { status: 500 }
        );
    }
    };
}

export const POST = createAnalyzeFoodHandler();

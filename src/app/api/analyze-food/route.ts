import { NextRequest, NextResponse } from "next/server";
import { generateFoodAnalysisJson } from "@/lib/gemini";
import {
  MAX_IMAGE_REQUEST_BYTES,
  MAX_IMAGE_COUNT,
  MAX_IMAGE_BYTES,
  ALLOWED_IMAGE_TYPES,
  hasContentType,
  imageBytesMatchMimeType,
  ModelTimeoutError,
  PayloadTooLargeError,
  readBoundedRequestBody,
  rejectDeclaredPayloadTooLarge,
  modelRequestGate,
  type ModelRequestGate,
  withModelDeadline,
} from "@/lib/api-guards";
import {
  foodAnalysisSchema,
  ModelContractError,
  parseModelJson,
} from "@/lib/model-contracts";

const DEFAULT_MODEL_TIMEOUT_MS = 30_000;

type ImagePart = { inlineData: { data: string; mimeType: string } };

type AnalyzeFoodHandlerOptions = {
  generate?: (parts: Array<string | ImagePart>) => Promise<string>;
  gate?: ModelRequestGate;
  timeoutMs?: number;
};

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function generateWithGemini(
  parts: Array<string | ImagePart>
): Promise<string> {
  const [prompt, ...rawImages] = parts;
  if (typeof prompt !== "string") throw new Error("Missing analysis prompt");
  const images = rawImages.map((part) => {
    if (typeof part === "string") throw new Error("Invalid image part");
    return part.inlineData;
  });
  return generateFoodAnalysisJson(prompt, images);
}

export function createAnalyzeFoodHandler(
  options: AnalyzeFoodHandlerOptions = {}
) {
  const generate = options.generate ?? generateWithGemini;
  const gate = options.gate ?? modelRequestGate;
  const timeoutMs = options.timeoutMs ?? DEFAULT_MODEL_TIMEOUT_MS;

  return async function handleAnalyzeFood(request: NextRequest) {
    const tooLarge = rejectDeclaredPayloadTooLarge(
      request,
      MAX_IMAGE_REQUEST_BYTES
    );
    if (tooLarge) return tooLarge;
    if (!hasContentType(request, "multipart/form-data")) {
      return json({ error: "Request must use multipart/form-data" }, 400);
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
      const entries = formData.getAll("images");

      if (
        entries.length < 1 ||
        entries.length > MAX_IMAGE_COUNT ||
        entries.some((entry) => !(entry instanceof File))
      ) {
        return json({ error: "Upload between one and four images" }, 400);
      }
      const images = entries as File[];
      if (images.some((image) => !ALLOWED_IMAGE_TYPES.has(image.type))) {
        return json({ error: "Images must be JPEG, PNG, or WebP" }, 400);
      }
      if (images.some((image) => image.size > MAX_IMAGE_BYTES)) {
        return json({ error: "Each image must be 4 MiB or smaller" }, 413);
      }

      const imageBytes = await Promise.all(
        images.map(async (image) => new Uint8Array(await image.arrayBuffer()))
      );
      if (
        imageBytes.some(
          (bytes, index) => !imageBytesMatchMimeType(bytes, images[index].type)
        )
      ) {
        return json(
          { error: "Image contents do not match the declared format" },
          400
        );
      }

      const prompt = `Analyze the supplied food images as preference signals.
Return cuisine types, flavor profile, dining style, likely ingredients, and a confidence score.
Do not identify people, infer sensitive traits, or include prose outside the schema.`;
      const parts: Array<string | ImagePart> = [
        prompt,
        ...imageBytes.map((bytes, index) => ({
          inlineData: {
            data: Buffer.from(bytes).toString("base64"),
            mimeType: images[index].type,
          },
        })),
      ];
      const decision = gate.tryStart(request);
      if (!decision.ok) return decision.response;

      const startedAt = performance.now();
      let response: string;
      const operation = Promise.resolve().then(() => generate(parts));
      void operation.then(decision.release, decision.release);
      try {
        response = await withModelDeadline(operation, timeoutMs);
      } finally {
        console.info("model_request", {
          route: "analyze-food",
          durationMs: Math.round(performance.now() - startedAt),
          imageCount: images.length,
        });
      }

      return json(parseModelJson(response, foodAnalysisSchema));
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        return json({ error: error.message }, 413);
      }
      if (error instanceof ModelTimeoutError) {
        return json({ error: "Model request timed out" }, 504);
      }
      if (error instanceof ModelContractError) {
        return json({ error: "Model returned an invalid food analysis" }, 502);
      }
      console.error("Food analysis error:", error);
      return json({ error: "Failed to analyze food images" }, 500);
    }
  };
}

export const POST = createAnalyzeFoodHandler();

import { NextResponse } from "next/server";
import type { FoodAnalysis, TripPreferences } from "@/types";

export const MAX_IMAGE_REQUEST_BYTES = 12 * 1024 * 1024;
export const MAX_ITINERARY_REQUEST_BYTES = 32 * 1024;
export const MAX_IMAGE_COUNT = 4;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type ModelRequestGate = {
  tryStart: (request: Request) =>
    | { ok: true; release: () => void }
    | { ok: false; response: NextResponse };
};

type ModelRequestGateOptions = {
  maxRequests?: number;
  windowMs?: number;
  maxConcurrent?: number;
  maxTrackedClients?: number;
  now?: () => number;
};

function clientKey(request: Request): string {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function rateLimitedResponse(message: string, retryAfter: number): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  );
}

export function createModelRequestGate(
  options: ModelRequestGateOptions = {}
): ModelRequestGate {
  const maxRequests = options.maxRequests ?? 10;
  const windowMs = options.windowMs ?? 60_000;
  const maxConcurrent = options.maxConcurrent ?? 4;
  const maxTrackedClients = options.maxTrackedClients ?? 10_000;
  const now = options.now ?? Date.now;
  const clients = new Map<string, { count: number; resetAt: number }>();
  let activeRequests = 0;

  return {
    tryStart(request) {
      const currentTime = now();
      const key = clientKey(request);
      let client = clients.get(key);
      if (!client && clients.size >= maxTrackedClients) {
        for (const [candidateKey, candidate] of clients) {
          if (candidate.resetAt <= currentTime) clients.delete(candidateKey);
        }
        if (clients.size >= maxTrackedClients) {
          return {
            ok: false,
            response: rateLimitedResponse(
              "The model rate limiter is at capacity",
              1
            ),
          };
        }
      }
      if (!client || client.resetAt <= currentTime) {
        client = { count: 0, resetAt: currentTime + windowMs };
        clients.set(key, client);
      }

      if (client.count >= maxRequests) {
        const retryAfter = Math.max(
          1,
          Math.ceil((client.resetAt - currentTime) / 1000)
        );
        return {
          ok: false,
          response: rateLimitedResponse(
            "Too many model requests from this client",
            retryAfter
          ),
        };
      }

      if (activeRequests >= maxConcurrent) {
        return {
          ok: false,
          response: rateLimitedResponse(
            "The model service is handling its maximum concurrent requests",
            1
          ),
        };
      }

      client.count += 1;
      activeRequests += 1;
      let released = false;
      return {
        ok: true,
        release() {
          if (released) return;
          released = true;
          activeRequests -= 1;
        },
      };
    },
  };
}

export const modelRequestGate = createModelRequestGate();

export class PayloadTooLargeError extends Error {
  constructor() {
    super("Request payload is too large");
    this.name = "PayloadTooLargeError";
  }
}

export class ModelTimeoutError extends Error {
  constructor() {
    super("Model request timed out");
    this.name = "ModelTimeoutError";
  }
}

export async function withModelDeadline<T>(
  operation: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ModelTimeoutError()), timeoutMs);
  });
  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function imageBytesMatchMimeType(
  bytes: Uint8Array,
  mimeType: string
): boolean {
  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return signature.every((byte, index) => bytes[index] === byte);
  }
  if (mimeType === "image/webp") {
    return (
      bytes.length >= 12 &&
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}

export function rejectDeclaredPayloadTooLarge(
  request: Request,
  maxBytes: number
): NextResponse | undefined {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) return undefined;

  const length = Number(rawLength);
  if (Number.isFinite(length) && length > maxBytes) {
    return NextResponse.json(
      { error: "Request payload is too large" },
      { status: 413 }
    );
  }

  return undefined;
}

export function hasContentType(request: Request, expected: string): boolean {
  return (request.headers.get("content-type") ?? "")
    .toLowerCase()
    .startsWith(expected);
}

export async function readBoundedRequestBody(
  request: Request,
  maxBytes: number
): Promise<Uint8Array> {
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel("Request payload is too large");
        throw new PayloadTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

type TripGenerationInput = {
  foodAnalysis: FoodAnalysis;
  preferences: TripPreferences;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedString(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function boundedStringArray(
  value: unknown,
  minItems: number,
  maxItems: number,
  maxItemLength: number
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minItems &&
    value.length <= maxItems &&
    value.every((item) => boundedString(item, maxItemLength))
  );
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateTripGenerationInput(
  value: unknown
): { ok: true; value: TripGenerationInput } | { ok: false } {
  if (!isRecord(value)) return { ok: false };
  const rawFood = value.foodAnalysis;
  const rawPreferences = value.preferences;
  if (!isRecord(rawFood) || !isRecord(rawPreferences)) return { ok: false };

  const tripLength = rawPreferences.tripLength;
  const budget = rawPreferences.budget;
  const pace = rawPreferences.pace;
  const dietaryRestrictions = rawPreferences.dietaryRestrictions;

  if (
    !boundedString(rawPreferences.destination, 120) ||
    !boundedString(rawPreferences.startingLocation, 120) ||
    typeof tripLength !== "number" ||
    !Number.isInteger(tripLength) ||
    tripLength < 1 ||
    tripLength > 14 ||
    !isValidDate(rawPreferences.startDate) ||
    (budget !== undefined &&
      budget !== "budget" &&
      budget !== "moderate" &&
      budget !== "luxury") ||
    (pace !== undefined &&
      pace !== "relaxed" &&
      pace !== "moderate" &&
      pace !== "packed") ||
    (dietaryRestrictions !== undefined &&
      !boundedStringArray(dietaryRestrictions, 0, 10, 80))
  ) {
    return { ok: false };
  }

  if (
    !boundedStringArray(rawFood.cuisine, 1, 10, 80) ||
    !boundedStringArray(rawFood.flavorProfile, 1, 10, 80) ||
    !boundedStringArray(rawFood.diningStyle, 1, 5, 80) ||
    !boundedStringArray(rawFood.ingredients, 0, 20, 80) ||
    typeof rawFood.confidence !== "number" ||
    !Number.isFinite(rawFood.confidence) ||
    rawFood.confidence < 0 ||
    rawFood.confidence > 1
  ) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      foodAnalysis: {
        cuisine: rawFood.cuisine.map((item) => item.trim()),
        flavorProfile: rawFood.flavorProfile.map((item) => item.trim()),
        diningStyle: rawFood.diningStyle.map((item) => item.trim()),
        ingredients: rawFood.ingredients.map((item) => item.trim()),
        confidence: rawFood.confidence,
      },
      preferences: {
        destination: rawPreferences.destination.trim(),
        startingLocation: rawPreferences.startingLocation.trim(),
        tripLength,
        startDate: rawPreferences.startDate,
        budget,
        pace,
        dietaryRestrictions: dietaryRestrictions?.map((item) => item.trim()),
      },
    },
  };
}

import { z } from "zod";

const boundedLabel = z.string().trim().min(1).max(80);

export const foodAnalysisSchema = z
  .object({
    cuisine: z.array(boundedLabel).min(1).max(10),
    flavorProfile: z.array(boundedLabel).min(1).max(10),
    diningStyle: z.array(boundedLabel).min(1).max(5),
    ingredients: z.array(boundedLabel).max(20),
    confidence: z.number().min(0).max(1),
  })
  .strict();

const itineraryItemSchema = z
  .object({
    // Gemini never sees the regex (pattern is stripped below), so the description carries the format.
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .describe("24-hour time as HH:MM, such as 09:00 or 19:30"),
    type: z.enum(["meal", "attraction", "transport", "hotel"]),
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(500),
    duration: z.string().trim().min(1).max(80),
    whySelected: z.string().trim().min(1).max(300),
    estimatedCost: z.number().finite().min(0).max(100_000),
    location: z
      .object({
        name: z.string().trim().min(1).max(120),
        address: z.string().trim().min(1).max(240),
      })
      .strict()
      .optional(),
  })
  .strict();

const modelDaySchema = z
  .object({
    summary: z.string().trim().min(1).max(300),
    items: z.array(itineraryItemSchema).min(1).max(12),
  })
  .strict();

const modelBudgetSchema = z
  .object({
    flights: z.number().finite().min(0).max(1_000_000),
    hotels: z.number().finite().min(0).max(1_000_000),
    food: z.number().finite().min(0).max(1_000_000),
    activities: z.number().finite().min(0).max(1_000_000),
    transport: z.number().finite().min(0).max(1_000_000),
  })
  .strict();

export const modelItinerarySchema = z
  .object({
    // No .max here: Gemini rejects the schema with 400 INVALID_ARGUMENT when both nested
    // arrays declare maxItems. The route still requires exactly tripLength (1 to 14) days.
    days: z.array(modelDaySchema).min(1),
    budgetBreakdown: modelBudgetSchema,
  })
  .strict();

export type ModelItinerary = z.infer<typeof modelItinerarySchema>;

function toGeminiJsonSchema(schema: z.ZodType): unknown {
  const raw = z.toJSONSchema(schema) as Record<string, unknown>;
  const removeUnsupportedKeywords = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(removeUnsupportedKeywords);
    if (typeof value !== "object" || value === null) return value;

    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key]) =>
            key !== "$schema" &&
            key !== "minLength" &&
            key !== "maxLength" &&
            key !== "pattern"
        )
        .map(([key, child]) => [key, removeUnsupportedKeywords(child)])
    );
  };
  return removeUnsupportedKeywords(raw);
}

export const foodAnalysisJsonSchema = toGeminiJsonSchema(foodAnalysisSchema);
export const modelItineraryJsonSchema = toGeminiJsonSchema(modelItinerarySchema);

export function parseModelJson<T>(raw: string, schema: z.ZodType<T>): T {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new ModelContractError("Model returned malformed JSON");
  }

  const result = schema.safeParse(value);
  if (!result.success) {
    throw new ModelContractError("Model response failed schema validation");
  }
  return result.data;
}

export class ModelContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModelContractError";
  }
}

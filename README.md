# Tripemini

Tripemini is a Gemini hackathon MVP that turns food photos into an inferred taste profile and an illustrative travel itinerary draft.
It demonstrates a bounded multimodal workflow rather than a booking engine, route optimizer, or source of verified travel facts.

[Live demo](https://tripemini.vercel.app) | [Gemini 3 Hackathon](https://gemini3.devpost.com/)

## Shipped workflow

1. Upload food photos that represent your preferences.
2. Enter a destination, starting location, date, trip length, pace, and budget style.
3. Review a generated draft containing meals, attractions, explanations, and illustrative cost estimates.

The current MVP does not use live restaurant search, maps, booking inventory, route optimization, or verified pricing data.
Generated restaurant names, addresses, availability, prices, travel times, and schedules may be incomplete or inaccurate.
Verify every real-world detail independently before relying on an itinerary.

## Request boundaries

- Food analysis accepts one to four JPEG, PNG, or WebP images.
- Each image is limited to 4 MiB, and the complete multipart request is limited to 12 MiB.
- Itinerary requests are limited to 32 KiB and trips from 1 to 14 days.
- Destination, location, date, preference arrays, enums, and confidence values are validated before model execution.
- Declared image MIME types are checked against JPEG, PNG, or WebP file signatures before upload content reaches the model.
- Gemini responses use JSON schemas and are validated again at runtime before the application returns them.
- User-provided trip fields are serialized inside an explicit untrusted-data boundary in the itinerary prompt.
- Model calls have a 30-second deadline and invalid model responses fail closed.
- IDs, dates, item totals, and the total budget are computed by the server instead of trusted from model output.
- One process permits at most four concurrent model calls.
- One client may start at most ten model calls per minute.
- Rate-limit state tracks at most 10,000 clients per process.
- Limit responses use `429` and include `Retry-After`.

The rate and concurrency gates are process-local safeguards.
A multi-instance public deployment also needs durable platform-level rate limiting, spend alerts, and abuse monitoring.
The current MVP has no user authentication, saved itineraries, sharing, booking, or account system.

## Image handling and privacy

Uploaded images are sent to the server-side model integration for analysis.
The application does not intentionally persist uploaded images or generated itineraries, but the configured model provider processes request content under its own terms.
Do not upload sensitive photos or images containing private personal information.

## Local development

Use Node.js 22 and pnpm 10.17.0.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Set `GOOGLE_GEMINI_API_KEY` in `.env.local` to a server-side Gemini API key.
Never expose this key through a `NEXT_PUBLIC_` variable.

## Verification

```bash
pnpm audit --audit-level low
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

The deterministic suite does not call Gemini.
It covers streamed and declared payload limits, image count, size and signature rules, trip input validation, prompt-data isolation, structured model output, canonical server fields, timeouts, rate limiting, bounded client tracking, and model concurrency.

## Architecture

| Path | Responsibility |
| --- | --- |
| `src/app/api/analyze-food` | Validates bounded multipart uploads and requests a structured taste-profile draft. |
| `src/app/api/generate-itinerary` | Validates trip inputs and requests a structured itinerary draft. |
| `src/lib/api-guards.ts` | Implements request-size, validation, rate, concurrency, and client-tracking boundaries. |
| `src/lib/model-contracts.ts` | Defines model-output schemas and fail-closed runtime parsing. |
| `src/lib/gemini.ts` | Configures the server-side Gemini 3.5 Flash client and structured output. |
| `src/store/trip-store.ts` | Holds temporary browser-side MVP workflow state. |

## License

This project is available under the [MIT License](LICENSE).

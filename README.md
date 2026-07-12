# Tripemini

Tripemini is a Gemini 3 Hackathon MVP that turns food photos into a taste profile and a structured travel itinerary.
It demonstrates a bounded multimodal workflow rather than a booking engine or a source of verified travel facts.

[Live demo](https://tripemini.vercel.app) | [Gemini 3 Hackathon](https://gemini3.devpost.com/)

## Workflow

1. Upload food photos that represent your preferences.
2. Enter a destination, starting location, date, trip length, pace, and budget style.
3. Review a generated itinerary with meals, attractions, explanations, and estimated costs.

Gemini output can be incomplete or inaccurate.
Restaurant details, addresses, availability, prices, and travel estimates must be verified independently before use.

## Request boundaries

- Food analysis accepts one to four JPEG, PNG, or WebP images.
- Each image is limited to 4 MiB, and the complete multipart request is limited to 12 MiB.
- Itinerary requests are limited to 32 KiB and trips from 1 to 14 days.
- Destination, location, date, preference arrays, enums, and confidence values are validated before model execution.
- One process permits at most four concurrent model calls.
- One client may start at most ten model calls per minute.
- Rate-limit state tracks at most 10,000 clients per process.
- Limit responses use `429` and include `Retry-After`.

The rate and concurrency gates are process-local safeguards.
A multi-instance public deployment should also use durable platform-level rate limiting, spend alerts, and abuse monitoring.
The current MVP has no user authentication.

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
It covers streamed and declared payload limits, image count, size and MIME rules, trip input validation, rate limiting, bounded client tracking, and model concurrency.

## Architecture

| Path | Responsibility |
| --- | --- |
| `src/app/api/analyze-food` | Validates bounded multipart uploads and requests a structured taste profile. |
| `src/app/api/generate-itinerary` | Validates trip inputs and requests a structured itinerary. |
| `src/lib/api-guards.ts` | Implements request-size, validation, rate, concurrency, and client-tracking boundaries. |
| `src/lib/gemini.ts` | Lazily creates the configured Gemini model clients. |
| `src/store/trip-store.ts` | Holds browser-side MVP workflow state. |

## License

This project is available under the [MIT License](LICENSE).

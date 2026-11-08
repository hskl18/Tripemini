# Security Policy

## Scope

This policy covers the Tripemini web app in this repository and its public demo at [tripemini.vercel.app](https://tripemini.vercel.app).
The two model routes, `POST /api/analyze-food` and `POST /api/generate-itinerary`, are the security-sensitive surface: they accept untrusted uploads and text, spend a server-side Gemini key, and return model output.

Tripemini is a hackathon MVP maintained on a best-effort basis, with no response-time guarantee.
Security fixes go to `main`, which deploys the demo, and to the next release; older releases get no backports.
[DESIGN.md](DESIGN.md) explains the request boundaries and what is still out of scope.

## Reporting

Do not open a public issue for a vulnerability.
Report it through GitHub's private vulnerability reporting: the **Security** tab of this repository, then **Report a vulnerability**.

Please include:

- the commit or the demo URL you tested
- the route or page involved
- reproduction steps
- the impact, such as key exposure, unbounded model spend, or content injected into the page

Do not run load or cost-amplification tests against the public demo; the server-side Gemini key is billed per call.

## Current controls

- Request bodies are read with byte limits, uploads are limited to four JPEG, PNG, or WebP images of 4 MiB each, and image bytes must match the declared type.
- Trip fields are validated before any model call and sent to the model as delimited untrusted data.
- Model output must match a strict schema; anything else fails closed with `502`, and the server computes IDs, dates, and totals itself.
- Each client may start ten model calls a minute, each process runs at most four at a time, and each call has a 30-second deadline.
- The Gemini key is read only on the server from `GOOGLE_GEMINI_API_KEY` and is never sent to the browser.
- Responses carry a Content Security Policy that limits scripts and images to the app's own origin and inline content, and connections to the app plus Vercel's vitals endpoint, along with `X-Frame-Options: DENY` and `nosniff`; API responses are `no-store`.
- Uploaded images and generated itineraries are not stored by the app.

## Known limitations

- Rate and concurrency limits are per server process, so on serverless hosting they do not bound total traffic or spend.
- There is no authentication, so anyone who can reach the demo can use the model routes within those limits.
- The untrusted-data prompt boundary lowers prompt-injection risk but does not eliminate it; the output schema limits what an injected instruction can return.
- Generated places, prices, and schedules are unverified, and the result page says so.

## Secrets

Keep the Gemini key in `.env.local` or the hosting provider's environment settings, never in a `NEXT_PUBLIC_` variable or a committed file.

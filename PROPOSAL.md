# Tripemini: Hackathon Concept and Shipped Scope

This document records the original product idea and distinguishes it from the functionality that is currently implemented.

## Inspiration

Most travel planners begin with a destination, budget, or schedule.
Tripemini explores whether food photos can provide a more natural starting point for an itinerary draft.

The project was created as a hackathon MVP, not as a production travel service.
Its purpose is to demonstrate a compact multimodal workflow with explicit request boundaries and a reviewable result.

## Shipped MVP

The current application supports the following workflow:

- Upload one to four supported food images.
- Infer a structured taste profile from those images.
- Collect destination, starting location, date, trip length, pace, and budget style.
- Generate an illustrative multi-day itinerary draft.
- Display meals, attractions, short explanations, and approximate costs.
- Surface request limits and retry guidance when the model endpoint is busy.

All generated places, addresses, prices, schedules, and travel estimates require independent verification.
The application does not claim that a generated restaurant exists, is open, has availability, or matches the displayed price.

## Not currently implemented

The shipped MVP does not include:

- Live restaurant or attraction search.
- Google Search or Google Maps grounding.
- Booking inventory or affiliate integrations.
- Map rendering or route optimization.
- Real-time opening hours, ratings, availability, or prices.
- User accounts or saved itineraries.
- Shareable itinerary links.
- Stop replacement or day-level regeneration.
- Group preference merging.

These are possible future directions, not current product claims.

## Technical approach

The application uses a Next.js frontend and two server-side model routes.
One route analyzes bounded image uploads into a taste-profile draft.
The second route combines that draft with validated trip preferences to generate a structured itinerary draft.

The public routes enforce request-size, image-count, field-validation, rate, and concurrency boundaries before starting model work.
The current rate and concurrency state is process-local and is not a substitute for durable deployment-level abuse controls.

## Design lessons

Multimodal input can make preference collection feel more direct than a long questionnaire.
Model output also requires strict product framing because a plausible itinerary is not the same as verified travel data.
The most important engineering work is therefore at the trust boundary: bounded input, structured output, explicit failure behavior, and honest UI copy.

## Future work

Future development should prioritize evidence and reliability before adding more surface area.

1. Add a verified place-data provider with source attribution.
2. Add durable rate limiting, cost monitoring, and abuse controls.
3. Measure model latency, token usage, and structured-output success rates.
4. Add maps and route planning only after reliable location data is available.
5. Add accounts, persistence, and sharing only with clear privacy and authorization boundaries.

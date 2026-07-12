# Tripemini Product Rationale

This document describes product hypotheses for the hackathon MVP.
It does not present validated market size, demand, or business-model claims.

## User problem hypothesis

Some travelers choose destinations and daily activities around food preferences.
Existing planning workflows often require users to translate those preferences into search terms before building an itinerary.

Tripemini tests a narrower question: can food photos make the first step of itinerary drafting faster and more expressive?

## Candidate users

The current concept may be useful to:

- Travelers who organize trips around meals and local cuisine.
- People who find images easier to provide than detailed preference forms.
- Hackathon users exploring multimodal planning workflows.
- Travelers who want a starting draft and understand that every detail needs verification.

These groups are hypotheses until supported by user research and product analytics.

## Current differentiation

The shipped MVP combines three elements:

- Food-photo input.
- A structured taste-profile draft.
- A multi-day itinerary draft organized around that profile.

The application does not currently compete as a booking platform, map product, verified restaurant database, or production travel assistant.

## Validation questions

The next product study should answer:

1. Do users prefer photo-based taste input to a short text questionnaire?
2. Does the inferred taste profile feel accurate enough to edit and continue?
3. Do users finish the itinerary workflow after uploading images?
4. Which generated details require the most correction?
5. Are users willing to verify places, prices, and schedules before use?
6. Does the workflow provide value without live place data?

## Evidence to collect

Any future product claim should be supported by documented evidence such as:

- Completion rate from upload to itinerary draft.
- User-rated taste-profile relevance.
- Structured-output success and retry rates.
- Median and tail latency by trip length and image count.
- Token usage and estimated model cost per completed workflow.
- Percentage of generated places that can be matched to a verified data source.
- Qualitative interviews describing where the draft saved or added work.

Analytics should avoid collecting uploaded photos, raw prompts, precise trip locations, or other sensitive content unless users explicitly consent.

## Risks

### Fabricated places or addresses

The UI and README describe the result as an unverified draft.
A verified place-data provider with visible sources is required before making stronger claims.

### Incorrect prices or schedules

The MVP presents generated values as illustrative estimates.
Current provider data and timestamps are required before treating them as travel facts.

### Model cost abuse

The routes have bounded process-local request and concurrency gates.
A public multi-instance deployment still needs durable rate limits, global budgets, and spend alerts.

### Slow or failed generation

The current UI surfaces errors and leaves inputs available for retry, while the server applies a 30-second model deadline.
Measured latency distributions and clearer recovery states remain future work.

### Sensitive image content

The application does not intentionally persist uploaded images.
Metadata stripping and clearer provider-processing disclosure would reduce privacy risk further.

## Future business exploration

Accounts, saved trips, booking links, affiliate integrations, and business APIs remain possible directions.
None should be described as an active feature or revenue stream until the core workflow is validated and the underlying place data is trustworthy.

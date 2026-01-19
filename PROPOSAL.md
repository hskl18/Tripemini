# Tripemini

> Upload a photo of food you love, Tripemini plans your entire trip around your taste.

## Inspiration

Most travel planning tools start with destinations, budgets, or schedules. But for many people, trips actually start with taste. Food is often the strongest signal of personal preference, yet it is rarely used as a primary input for planning an entire trip.

We wanted to explore a different entry point to travel planning: **What if a single photo of food you love could determine where you go, what you eat, and how your days are organized?**

With Gemini's multimodal understanding and search capabilities, we built Tripemini to transform personal food preferences into complete, automated travel itineraries.

## What It Does

Tripemini is an AI-powered travel planning assistant that generates end-to-end itineraries based on user taste.

### Users can:
- Upload one or more food images they love
- Select or discover a destination
- Choose trip length, starting location, and approximate dates
- Answer a small number of preference questions

### From this input, Tripemini automatically:
- Infers cuisine, flavor profile, and dining preferences from food images
- Recommends highly rated restaurants aligned with those preferences
- Organizes meals and nearby attractions into optimized daily routes
- Generates full day or multi-day itineraries with realistic timing and location awareness

The result is a trip that feels personalized and intentional, rather than a generic list of recommendations.

## Demo Experience

Tripemini is presented as a web application designed for fast exploration and clear visualization.

### The demo includes:
- A gallery of example itineraries such as a 3-day Japan food-focused trip
- An interactive planner where users can generate a custom itinerary in one click
- A timeline and map-based view that shows meals, attractions, and routes together

Each itinerary item includes an explanation of **why it was selected**, allowing users to understand and adjust the plan. Users can replace stops, regenerate a day, and share the itinerary as a link.

## How We Built It

Tripemini is built around **Gemini 3's multimodal reasoning and search tools**.

| Component | Role |
|-----------|------|
| **Gemini Vision** | Analyzes uploaded food images to extract cuisine and taste signals |
| **Gemini Search** | Tool calls retrieve relevant restaurants, places, and travel data |
| **Gemini Reasoning** | Balances constraints such as distance, ratings, operating hours, and trip duration |

The system composes results into structured, explainable itineraries. Rather than simple recommendations, Gemini is responsible for decision-making and planning.

## Challenges We Ran Into

- Translating subjective food preferences into structured, searchable signals
- Coordinating multiple real-world constraints like distance, time, and availability
- Ensuring generated itineraries were coherent and realistic rather than simple lists

Addressing these challenges required careful prompt design and structured tool calls.

## Accomplishments We're Proud Of

- A novel multimodal entry point for travel planning
- Fully automated itinerary generation from minimal user input
- A clear demonstration of Gemini's vision, search, and reasoning capabilities

## What We Learned

Multimodal inputs significantly improve personalization. Starting from images rather than text allows users to express intent more naturally.

We also learned that combining search with reasoning is essential for real-world planning tasks.

## What's Next for Tripemini

- Support for dietary restrictions and budgets
- Real-time itinerary re-planning during trips
- Group preference merging
- Deeper integration with maps and navigation

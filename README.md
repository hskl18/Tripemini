# Tripemini 🍜✈️

> **MVP Project** - Built for the [Gemini 3 Hackathon](https://gemini3.devpost.com/)

AI-powered travel planning that starts with your taste. Upload food photos, get a personalized trip itinerary.

## How It Works

1. **Upload** photos of food you love
2. **Enter** your destination and trip details  
3. **Get** a complete itinerary with restaurants, attractions, and budget estimates

## Gemini 3 Integration

This project leverages **Gemini 3's advanced multimodal capabilities**:

| Feature | Gemini 3 Capability Used |
|---------|-------------------------|
| Food Image Analysis | **Multimodal Vision** - Extracts cuisine types, flavor profiles, and dining preferences from photos |
| Itinerary Generation | **Advanced Reasoning** - Balances constraints (distance, time, ratings) to create coherent plans |
| Personalized Recommendations | **Context Understanding** - Links food preferences to restaurant and attraction suggestions |
| Budget Estimation | **Structured Output** - Returns well-formatted JSON with cost breakdowns |

### Why Gemini 3?

- **1M token context window** - Can process multiple food images and generate detailed multi-day itineraries
- **Reasoning-first architecture** - Creates logical, realistic travel plans rather than random lists
- **Native multimodal** - Seamlessly combines image understanding with text generation
- **Low latency** - Fast enough for interactive web applications

## Quick Start

```bash
pnpm install
```

Add your Gemini API key to `.env.local`:
```
GOOGLE_GEMINI_API_KEY=your_key_here
```

```bash
pnpm dev
```

Get your API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## Tech Stack

- **Next.js 16** - App Router, TypeScript
- **Gemini 3 Flash** - Vision + text generation (fast mode)
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Vercel Analytics** - Usage tracking

## Features

- 🖼️ Food image analysis via Gemini Vision
- 📍 Restaurant & attraction recommendations  
- 💰 Budget breakdown (flights, hotels, food, activities)
- 📱 Mobile responsive
- ⚡ Real-time itinerary generation
- 📊 Generation time estimates for longer trips

## Project Structure

```
src/
├── app/
│   ├── api/          # Gemini API routes
│   └── page.tsx      # Main app
├── components/       # UI components
├── lib/gemini.ts     # Gemini client
├── store/            # Zustand store
└── types/            # TypeScript types
```

## MVP Roadmap

Current MVP includes core functionality. Future iterations could add:

- [ ] Dietary restrictions filter
- [ ] Real-time re-planning during trips
- [ ] Group preference merging
- [ ] Map integration with directions
- [ ] Save & share itineraries
- [ ] User accounts

## Links

- **Live Demo**: [tripemini.vercel.app](https://tripemini.vercel.app)
- **Hackathon**: [Gemini 3 Hackathon](https://gemini3.devpost.com/)

## License

[MIT](LICENSE)

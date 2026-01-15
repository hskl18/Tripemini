# Tripemini 🍜✈️

AI-powered travel planning that starts with your taste. Upload food photos, get a personalized trip itinerary.

## How It Works

1. **Upload** photos of food you love
2. **Enter** your destination and trip details  
3. **Get** a complete itinerary with restaurants, attractions, and budget estimates

## Quick Start

```bash
# Install dependencies
pnpm install

# Add your Gemini API key to .env.local
GOOGLE_GEMINI_API_KEY=your_key_here

# Run dev server
pnpm dev
```

Get your API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## Tech Stack

- **Next.js 16** - App Router, TypeScript
- **Gemini 3 Pro Preview** - Vision + text generation
- **Tailwind CSS** - Styling
- **Zustand** - State management

## Features

- 🖼️ Food image analysis via Gemini Vision
- 📍 Restaurant & attraction recommendations
- 💰 Budget breakdown (flights, hotels, food, activities)
- 📱 Mobile responsive
- ⚡ Real-time itinerary generation

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

## License

MIT

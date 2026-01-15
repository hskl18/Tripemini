import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import type { FoodAnalysis, TripPreferences } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { foodAnalysis, preferences } = body as {
      foodAnalysis: FoodAnalysis;
      preferences: TripPreferences;
    };

    if (!foodAnalysis || !preferences) {
      return NextResponse.json(
        { error: "Missing food analysis or preferences" },
        { status: 400 }
      );
    }

    const budgetRanges = {
      budget: { meal: "10-25", hotel: "50-100", activity: "0-20" },
      moderate: { meal: "25-60", hotel: "100-200", activity: "20-50" },
      luxury: { meal: "60-150", hotel: "200-500", activity: "50-150" },
    };
    const budgetRange = budgetRanges[preferences.budget || "moderate"];

    const prompt = `You are a travel planning expert. Create a detailed ${preferences.tripLength}-day itinerary for ${preferences.destination}.

USER'S FOOD PREFERENCES (extracted from their food photos):
- Cuisines they love: ${foodAnalysis.cuisine.join(", ")}
- Flavor profile: ${foodAnalysis.flavorProfile.join(", ")}
- Dining style: ${foodAnalysis.diningStyle.join(", ")}
- Favorite ingredients: ${foodAnalysis.ingredients.join(", ")}

TRIP DETAILS:
- Destination: ${preferences.destination}
- Starting from: ${preferences.startingLocation}
- Trip length: ${preferences.tripLength} days
- Start date: ${preferences.startDate}
- Budget level: ${preferences.budget || "moderate"}
- Pace: ${preferences.pace || "moderate"}
${preferences.dietaryRestrictions?.length ? `- Dietary restrictions: ${preferences.dietaryRestrictions.join(", ")}` : ""}

BUDGET GUIDELINES (USD):
- Meals: $${budgetRange.meal} per person
- Hotels: $${budgetRange.hotel} per night
- Activities: $${budgetRange.activity} per activity

Generate a complete itinerary with:
1. Restaurants that match their taste preferences (breakfast, lunch, dinner)
2. Attractions and activities near meal locations
3. Realistic timing and travel between locations
4. Explanation for WHY each place was selected based on their food preferences
5. IMPORTANT: Include estimated costs in USD for EVERY item
6. IMPORTANT: Include imageUrl for restaurants and attractions - use real Unsplash URLs like "https://images.unsplash.com/photo-[id]?w=400" with relevant food/travel photos
7. Calculate daily totals and overall trip budget breakdown

Return ONLY valid JSON in this exact format:
{
  "id": "unique-id",
  "destination": "${preferences.destination}",
  "startDate": "${preferences.startDate}",
  "endDate": "calculated end date",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "summary": "Brief day overview",
      "dailyTotal": 150,
      "items": [
        {
          "id": "item-1",
          "time": "09:00",
          "type": "meal",
          "title": "Restaurant Name",
          "description": "What to try here",
          "duration": "1 hour",
          "whySelected": "Why this matches their taste",
          "estimatedCost": 35,
          "imageUrl": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
          "location": {
            "name": "Restaurant Name",
            "cuisine": "Cuisine type",
            "rating": 4.5,
            "priceLevel": "$$",
            "address": "Full address",
            "coordinates": { "lat": 0.0, "lng": 0.0 },
            "estimatedCost": 35,
            "imageUrl": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400"
          }
        },
        {
          "id": "item-2",
          "time": "11:00",
          "type": "attraction",
          "title": "Attraction Name",
          "description": "What to see/do here",
          "duration": "2 hours",
          "whySelected": "Why this is recommended",
          "estimatedCost": 20,
          "imageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
          "location": {
            "name": "Attraction Name",
            "type": "temple",
            "address": "Full address",
            "coordinates": { "lat": 0.0, "lng": 0.0 },
            "estimatedCost": 20,
            "imageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400"
          }
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "flights": 800,
    "hotels": 500,
    "food": 300,
    "activities": 150,
    "transport": 100,
    "total": 1850
  },
  "foodPreferences": ${JSON.stringify(foodAnalysis)},
  "createdAt": "${new Date().toISOString()}"
}

Use realistic Unsplash photo IDs for the destination. For Japan use Japanese food/temple/city photos, for Italy use Italian scenes, etc.`;

    const result = await getGeminiModel().generateContent(prompt);
    const response = result.response.text();

    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const itinerary = JSON.parse(cleanedResponse);

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("Itinerary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}

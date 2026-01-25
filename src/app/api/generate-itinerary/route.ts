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

    const budgetMultiplier = {
      budget: 0.6,
      moderate: 1,
      luxury: 2,
    };
    const multiplier = budgetMultiplier[preferences.budget || "moderate"];

    // Simplified, faster prompt
    const prompt = `Create a ${preferences.tripLength}-day travel itinerary for ${preferences.destination}.

USER TASTE: ${foodAnalysis.cuisine.join(", ")} cuisine, ${foodAnalysis.flavorProfile.slice(0, 3).join(", ")} flavors, ${foodAnalysis.diningStyle[0] || "casual"} dining.

TRIP: From ${preferences.startingLocation}, starting ${preferences.startDate}, ${preferences.pace || "moderate"} pace, ${preferences.budget || "moderate"} budget.

For each day include 3 meals + 2-3 attractions. Each item needs: time, title, description (1 sentence), duration, estimatedCost (USD), whySelected (1 sentence linking to their food taste).

Return ONLY valid JSON:
{
  "id": "${Date.now()}",
  "destination": "${preferences.destination}",
  "startDate": "${preferences.startDate}",
  "endDate": "YYYY-MM-DD",
  "days": [{
    "day": 1,
    "date": "YYYY-MM-DD",
    "summary": "Day theme",
    "dailyTotal": 0,
    "items": [{
      "id": "d1-1",
      "time": "09:00",
      "type": "meal|attraction|transport",
      "title": "Name",
      "description": "Brief description",
      "duration": "1 hour",
      "whySelected": "Matches your love of X cuisine",
      "estimatedCost": ${Math.round(30 * multiplier)},
      "imageUrl": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
      "location": {
        "name": "Name",
        "address": "Address",
        "coordinates": {"lat": 0, "lng": 0}
      }
    }]
  }],
  "budgetBreakdown": {
    "flights": ${Math.round(800 * multiplier)},
    "hotels": ${Math.round(preferences.tripLength * 120 * multiplier)},
    "food": ${Math.round(preferences.tripLength * 80 * multiplier)},
    "activities": ${Math.round(preferences.tripLength * 40 * multiplier)},
    "transport": ${Math.round(preferences.tripLength * 20 * multiplier)},
    "total": 0
  },
  "foodPreferences": ${JSON.stringify(foodAnalysis)},
  "createdAt": "${new Date().toISOString()}"
}

Use real Unsplash photo URLs relevant to ${preferences.destination}. Calculate dailyTotal and budgetBreakdown.total correctly.`;

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

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ItineraryView } from "../src/components/itinerary-view";
import type { Itinerary } from "../src/types";

test("the itinerary result labels generated travel details as unverified", () => {
  const itinerary: Itinerary = {
    id: "trip-test",
    destination: "Tokyo",
    startDate: "2026-08-01",
    endDate: "2026-08-01",
    createdAt: "2026-07-12T00:00:00.000Z",
    foodPreferences: {
      cuisine: ["Japanese"],
      flavorProfile: ["umami"],
      diningStyle: ["casual"],
      ingredients: ["rice"],
      confidence: 0.9,
    },
    budgetBreakdown: {
      flights: 800,
      hotels: 120,
      food: 80,
      activities: 40,
      transport: 20,
      total: 1060,
    },
    days: [
      {
        day: 1,
        date: "2026-08-01",
        summary: "Illustrative day",
        dailyTotal: 20,
        items: [
          {
            id: "d1-1",
            time: "09:00",
            type: "meal",
            title: "Generated cafe",
            description: "A generated suggestion.",
            duration: "1 hour",
            whySelected: "Matches the inferred profile.",
            estimatedCost: 20,
            location: { name: "Generated cafe", address: "Generated address" },
          },
        ],
      },
    ],
  };

  const html = renderToStaticMarkup(
    React.createElement(ItineraryView, { itinerary })
  );
  const warningIndex = html.indexOf("Illustrative, unverified draft");
  const generatedDetailIndex = html.indexOf("Generated cafe");

  assert.ok(warningIndex >= 0);
  assert.ok(generatedDetailIndex > warningIndex);
  assert.match(html, /Verify every place, address, price, schedule, availability/);
});

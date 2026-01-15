export interface FoodAnalysis {
    cuisine: string[];
    flavorProfile: string[];
    diningStyle: string[];
    ingredients: string[];
    confidence: number;
}

export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    priceLevel: string;
    address: string;
    coordinates: { lat: number; lng: number };
    openingHours?: string;
    whyRecommended: string;
    imageUrl?: string;
    estimatedCost: number;
}

export interface Attraction {
    id: string;
    name: string;
    type: string;
    description: string;
    duration: string;
    address: string;
    coordinates: { lat: number; lng: number };
    whyRecommended: string;
    imageUrl?: string;
    estimatedCost: number;
}

export interface ItineraryItem {
    id: string;
    time: string;
    type: "meal" | "attraction" | "transport" | "hotel";
    title: string;
    description: string;
    location?: Restaurant | Attraction;
    duration: string;
    whySelected: string;
    imageUrl?: string;
    estimatedCost: number;
}

export interface DayPlan {
    day: number;
    date: string;
    items: ItineraryItem[];
    summary: string;
    dailyTotal: number;
}

export interface BudgetBreakdown {
    flights: number;
    hotels: number;
    food: number;
    activities: number;
    transport: number;
    total: number;
}

export interface Itinerary {
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    days: DayPlan[];
    foodPreferences: FoodAnalysis;
    createdAt: string;
    budgetBreakdown: BudgetBreakdown;
}

export interface TripPreferences {
    destination: string;
    startingLocation: string;
    tripLength: number;
    startDate: string;
    budget?: "budget" | "moderate" | "luxury";
    pace?: "relaxed" | "moderate" | "packed";
    dietaryRestrictions?: string[];
}

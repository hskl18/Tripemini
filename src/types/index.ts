export interface FoodAnalysis {
    cuisine: string[];
    flavorProfile: string[];
    diningStyle: string[];
    ingredients: string[];
    confidence: number;
}

export interface ItineraryLocation {
    name: string;
    address: string;
}

export interface ItineraryItem {
    id: string;
    time: string;
    type: "meal" | "attraction" | "transport" | "hotel";
    title: string;
    description: string;
    location?: ItineraryLocation;
    duration: string;
    whySelected: string;
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

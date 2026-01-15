"use client";

import { MapPin, Clock, Utensils, Camera, Info, DollarSign, Plane, Hotel, Car } from "lucide-react";
import type { Itinerary, DayPlan, ItineraryItem, BudgetBreakdown } from "@/types";

interface ItineraryViewProps {
    itinerary: Itinerary;
}

function BudgetCard({ budget }: { budget: BudgetBreakdown }) {
    const items = [
        { label: "Flights", value: budget.flights, icon: Plane, color: "text-blue-500" },
        { label: "Hotels", value: budget.hotels, icon: Hotel, color: "text-purple-500" },
        { label: "Food", value: budget.food, icon: Utensils, color: "text-amber-500" },
        { label: "Activities", value: budget.activities, icon: Camera, color: "text-green-500" },
        { label: "Transport", value: budget.transport, icon: Car, color: "text-gray-500" },
    ];

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                Estimated Trip Budget
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mb-4">
                {items.map((item) => (
                    <div key={item.label} className="bg-white rounded-lg p-2 md:p-3 text-center">
                        <item.icon className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 ${item.color}`} />
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">${item.value}</p>
                    </div>
                ))}
            </div>
            <div className="text-center pt-3 md:pt-4 border-t border-amber-200">
                <p className="text-xs md:text-sm text-gray-600">Total Estimated Cost</p>
                <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                    ${budget.total}
                </p>
            </div>
        </div>
    );
}

function ItemCard({ item }: { item: ItineraryItem }) {
    const getIcon = () => {
        switch (item.type) {
            case "meal":
                return <Utensils className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />;
            case "attraction":
                return <Camera className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />;
            case "hotel":
                return <Hotel className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />;
            default:
                return <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />;
        }
    };

    const fallbackImage = item.type === "meal"
        ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
        : "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400";

    return (
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            {/* Image */}
            {(item.imageUrl || item.location?.imageUrl) && (
                <div className="flex-shrink-0 w-full sm:w-24 h-32 sm:h-24 md:w-32 md:h-32">
                    <img
                        src={item.imageUrl || item.location?.imageUrl || fallbackImage}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackImage;
                        }}
                    />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{item.time}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                    </div>
                    {item.estimatedCost > 0 && (
                        <span className="text-xs md:text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            ${item.estimatedCost}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getIcon()}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{item.title}</h4>
                </div>

                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{item.description}</p>

                {item.location && (
                    <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 mt-2">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{item.location.address}</span>
                    </div>
                )}

                <div className="mt-2 p-2 bg-amber-50 rounded-md">
                    <div className="flex items-start gap-2">
                        <Info className="w-3 h-3 md:w-4 md:h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs md:text-sm text-amber-700 line-clamp-2">{item.whySelected}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DayCard({ day }: { day: DayPlan }) {
    return (
        <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm md:text-base">
                        {day.day}
                    </div>
                    <div>
                        <h3 className="font-semibold text-base md:text-lg">Day {day.day}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{day.date}</p>
                    </div>
                </div>
                {day.dailyTotal > 0 && (
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Daily Total</p>
                        <p className="font-semibold text-green-600 text-sm md:text-base">${day.dailyTotal}</p>
                    </div>
                )}
            </div>
            <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{day.summary}</p>
            <div className="space-y-3 pl-4 md:pl-6 border-l-2 border-amber-200">
                {day.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export function ItineraryView({ itinerary }: ItineraryViewProps) {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Your {itinerary.destination} Adventure
                </h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                    {itinerary.startDate} - {itinerary.endDate}
                </p>
                <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2">
                    {itinerary.foodPreferences.cuisine.map((c) => (
                        <span
                            key={c}
                            className="px-2 md:px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm"
                        >
                            {c}
                        </span>
                    ))}
                </div>
            </div>

            {/* Budget Breakdown */}
            {itinerary.budgetBreakdown && (
                <BudgetCard budget={itinerary.budgetBreakdown} />
            )}

            {/* Daily Itinerary */}
            <div className="space-y-4 md:space-y-6">
                {itinerary.days.map((day) => (
                    <DayCard key={day.day} day={day} />
                ))}
            </div>
        </div>
    );
}

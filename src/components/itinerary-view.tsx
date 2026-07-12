"use client";

import Image from "next/image";
import { MapPin, Clock, Utensils, Camera, Info, DollarSign, Plane, Hotel, Car } from "lucide-react";
import type { Itinerary, DayPlan, ItineraryItem, BudgetBreakdown } from "@/types";

interface ItineraryViewProps {
    itinerary: Itinerary;
}

function BudgetCard({ budget }: { budget: BudgetBreakdown }) {
    const items = [
        { label: "Flights", value: budget.flights, icon: Plane, color: "text-blue-500" },
        { label: "Hotels", value: budget.hotels, icon: Hotel, color: "text-purple-500" },
        { label: "Food", value: budget.food, icon: Utensils, color: "text-orange-500" },
        { label: "Activities", value: budget.activities, icon: Camera, color: "text-green-500" },
        { label: "Transport", value: budget.transport, icon: Car, color: "text-gray-500" },
    ];

    return (
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
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
            <div className="text-center pt-3 md:pt-4 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600">Total Estimated Cost</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-500">
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
                return <Utensils className="w-4 h-4 text-orange-500" />;
            case "attraction":
                return <Camera className="w-4 h-4 text-blue-500" />;
            case "hotel":
                return <Hotel className="w-4 h-4 text-purple-500" />;
            default:
                return <MapPin className="w-4 h-4 text-gray-500" />;
        }
    };

    const fallbackImage = item.type === "meal"
        ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
        : "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400";

    return (
        <div className="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all overflow-hidden">
            <div className="flex gap-4 p-4">
                {/* Image */}
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
                    <Image
                        src={item.imageUrl || item.location?.imageUrl || fallbackImage}
                        alt={item.title}
                        width={96}
                        height={96}
                        unoptimized
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Time and cost row */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.time}</span>
                            <span className="text-gray-300">•</span>
                            <span>{item.duration}</span>
                        </div>
                        {item.estimatedCost > 0 && (
                            <span className="text-sm font-medium text-gray-900">
                                ${item.estimatedCost}
                            </span>
                        )}
                    </div>

                    {/* Title with icon */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="flex-shrink-0">{getIcon()}</span>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {item.title}
                        </h4>
                    </div>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                    </p>

                    {/* Location */}
                    {item.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{item.location.address}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Why selected - full width at bottom */}
            <div className="px-4 py-2.5 bg-orange-50 border-t border-orange-100">
                <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-700 line-clamp-2">{item.whySelected}</p>
                </div>
            </div>
        </div>
    );
}

function DayCard({ day }: { day: DayPlan }) {
    return (
        <div className="mb-8">
            {/* Day header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {day.day}
                    </div>
                    <div>
                        <h3 className="font-semibold text-base md:text-lg text-gray-900">Day {day.day}</h3>
                        <p className="text-xs text-gray-500">{day.date}</p>
                    </div>
                </div>
                {day.dailyTotal > 0 && (
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Daily Total</p>
                        <p className="font-semibold text-gray-900">${day.dailyTotal}</p>
                    </div>
                )}
            </div>

            {/* Day summary */}
            <p className="text-sm text-gray-600 mb-4 pl-[52px]">{day.summary}</p>

            {/* Items */}
            <div className="space-y-3 pl-[52px]">
                {day.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export function ItineraryView({ itinerary }: ItineraryViewProps) {
    return (
        <div>
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Your {itinerary.destination} Adventure
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                    {itinerary.startDate} - {itinerary.endDate}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {itinerary.foodPreferences.cuisine.map((c) => (
                        <span
                            key={c}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
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
            <div>
                {itinerary.days.map((day) => (
                    <DayCard key={day.day} day={day} />
                ))}
            </div>
        </div>
    );
}

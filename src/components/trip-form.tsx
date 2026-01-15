"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, Wallet } from "lucide-react";
import { useTripStore } from "@/store/trip-store";
import type { TripPreferences } from "@/types";

interface TripFormProps {
    onSubmit: (preferences: TripPreferences) => void;
}

export function TripForm({ onSubmit }: TripFormProps) {
    const { isGenerating } = useTripStore();
    const [formData, setFormData] = useState<TripPreferences>({
        destination: "",
        startingLocation: "",
        tripLength: 3,
        startDate: "",
        budget: "moderate",
        pace: "moderate",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const inputClass = "w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm md:text-base";
    const labelClass = "flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>
                        <MapPin className="w-4 h-4" />
                        Destination
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Tokyo, Japan"
                        value={formData.destination}
                        onChange={(e) =>
                            setFormData({ ...formData, destination: e.target.value })
                        }
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        <MapPin className="w-4 h-4" />
                        Starting Location
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., San Francisco, CA"
                        value={formData.startingLocation}
                        onChange={(e) =>
                            setFormData({ ...formData, startingLocation: e.target.value })
                        }
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>
                        <Calendar className="w-4 h-4" />
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                            setFormData({ ...formData, startDate: e.target.value })
                        }
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        <Clock className="w-4 h-4" />
                        Trip Length
                    </label>
                    <select
                        value={formData.tripLength}
                        onChange={(e) =>
                            setFormData({ ...formData, tripLength: Number(e.target.value) })
                        }
                        className={inputClass}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((days) => (
                            <option key={days} value={days}>
                                {days} {days === 1 ? "day" : "days"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>
                        <Wallet className="w-4 h-4" />
                        Budget
                    </label>
                    <select
                        value={formData.budget}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                budget: e.target.value as TripPreferences["budget"],
                            })
                        }
                        className={inputClass}
                    >
                        <option value="budget">Budget-friendly</option>
                        <option value="moderate">Moderate</option>
                        <option value="luxury">Luxury</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>
                        <Clock className="w-4 h-4" />
                        Pace
                    </label>
                    <select
                        value={formData.pace}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                pace: e.target.value as TripPreferences["pace"],
                            })
                        }
                        className={inputClass}
                    >
                        <option value="relaxed">Relaxed</option>
                        <option value="moderate">Moderate</option>
                        <option value="packed">Packed</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
                {isGenerating ? "Creating your perfect trip..." : "Generate My Itinerary"}
            </button>
        </form>
    );
}

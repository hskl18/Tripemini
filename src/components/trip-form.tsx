"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, Wallet, AlertCircle } from "lucide-react";
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

    const inputClass = "w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm md:text-base";
    const labelClass = "flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2";

    const getEstimatedTime = (days: number) => {
        if (days <= 3) return null;
        if (days <= 5) return "~30 seconds";
        if (days <= 7) return "~1 minute";
        if (days <= 10) return "~1-2 minutes";
        return "~2-3 minutes";
    };

    const estimatedTime = getEstimatedTime(formData.tripLength);

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

            {/* Time estimate warning for longer trips */}
            {estimatedTime && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-orange-800">
                            <span className="font-medium">{formData.tripLength}-day trips</span> take longer to generate.
                        </p>
                        <p className="text-orange-600">
                            Estimated time: {estimatedTime}
                        </p>
                    </div>
                </div>
            )}

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
                className="w-full py-3 md:py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
                {isGenerating ? "Creating your perfect trip..." : "Generate My Itinerary"}
            </button>
        </form>
    );
}

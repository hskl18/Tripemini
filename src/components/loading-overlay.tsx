"use client";

import { Sparkles, ScanEye, Calendar } from "lucide-react";

// The provider does not expose reliable stage-level progress.
const foodAnalysisSteps = [
    { icon: ScanEye, text: "Generating an illustrative taste profile" },
];

// Keep the loading state honest until measured progress is available.
const itinerarySteps = [
    { icon: Calendar, text: "Generating an illustrative itinerary draft" },
];

interface LoadingOverlayProps {
    type: "food-analysis" | "itinerary";
}

function LoadingContent({ type }: LoadingOverlayProps) {
    const steps = type === "food-analysis" ? foodAnalysisSteps : itinerarySteps;
    const title = type === "food-analysis" ? "Analyzing Your Taste" : "Creating Your Trip";
    const accentColor = type === "food-analysis" ? "emerald" : "orange";

    const CurrentIcon = steps[0]?.icon || Sparkles;

    return (
        <div className="bg-white/95 backdrop-blur rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            {/* Animated icon */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${accentColor === "emerald" ? "bg-emerald-50" : "bg-orange-50"
                        }`}>
                        <CurrentIcon className={`w-10 h-10 ${accentColor === "emerald" ? "text-emerald-500" : "text-orange-500"
                            } transition-all duration-300`} />
                    </div>
                    {/* Spinning ring */}
                    <svg className="absolute inset-0 w-20 h-20 animate-spin" style={{ animationDuration: '3s' }}>
                        <circle
                            cx="40"
                            cy="40"
                            r="38"
                            fill="none"
                            stroke={accentColor === "emerald" ? "#10b981" : "#f97316"}
                            strokeWidth="3"
                            strokeDasharray="60 180"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {title}
            </h3>

            {/* Current step text */}
            <p className={`text-center mb-6 ${accentColor === "emerald" ? "text-emerald-600" : "text-orange-600"
                }`}>
                {steps[0]?.text}...
            </p>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-4">
                <div
                    className={`h-1.5 w-8 rounded-full ${accentColor === "emerald" ? "bg-emerald-500" : "bg-orange-500"}`}
                />
            </div>

            {/* Subtle hint */}
            <p className="text-xs text-gray-400 text-center">
                This may take a moment
            </p>
        </div>
    );
}

export function LoadingOverlay({ type }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <LoadingContent key={type} type={type} />
        </div>
    );
}

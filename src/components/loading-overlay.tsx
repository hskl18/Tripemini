"use client";

import { useEffect, useState } from "react";
import { Sparkles, ScanEye, ChefHat, Palette, MapPin, Utensils, Calendar } from "lucide-react";

// Steps for food analysis
const foodAnalysisSteps = [
    { icon: ScanEye, text: "Scanning photos" },
    { icon: ChefHat, text: "Identifying cuisines" },
    { icon: Palette, text: "Detecting flavors" },
    { icon: Sparkles, text: "Finalizing" },
];

// Steps for itinerary generation (simplified)
const itinerarySteps = [
    { icon: Utensils, text: "Finding restaurants" },
    { icon: MapPin, text: "Discovering places" },
    { icon: Calendar, text: "Building itinerary" },
    { icon: Sparkles, text: "Finalizing" },
];

interface LoadingOverlayProps {
    type: "food-analysis" | "itinerary";
}

function LoadingContent({ type }: LoadingOverlayProps) {
    const steps = type === "food-analysis" ? foodAnalysisSteps : itinerarySteps;
    const title = type === "food-analysis" ? "Analyzing Your Taste" : "Creating Your Trip";
    const accentColor = type === "food-analysis" ? "emerald" : "orange";

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const duration = type === "food-analysis" ? 2000 : 8000;
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, duration);

        return () => clearInterval(interval);
    }, [steps.length, type]);

    const CurrentIcon = steps[currentStep]?.icon || Sparkles;

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
                {steps[currentStep]?.text}...
            </p>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-4">
                {steps.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                            ? `w-8 ${accentColor === "emerald" ? "bg-emerald-500" : "bg-orange-500"}`
                            : index < currentStep
                                ? `w-4 ${accentColor === "emerald" ? "bg-emerald-300" : "bg-orange-300"}`
                                : "w-4 bg-gray-200"
                            }`}
                    />
                ))}
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

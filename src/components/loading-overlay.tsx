"use client";

import { useEffect, useState } from "react";
import { Utensils, MapPin, Calendar, Sparkles, Search, Route, CheckCircle, ScanEye, ChefHat, Palette, Star, Clock, DollarSign, Plane } from "lucide-react";

// Steps for food analysis (shorter)
const foodAnalysisSteps = [
    { icon: ScanEye, text: "Scanning your food photos...", duration: 2000 },
    { icon: ChefHat, text: "Identifying cuisines...", duration: 2500 },
    { icon: Palette, text: "Detecting flavor profiles...", duration: 2000 },
    { icon: Sparkles, text: "Finalizing preferences...", duration: 1500 },
];

// Steps for itinerary generation (longer, more detailed)
const itinerarySteps = [
    { icon: Utensils, text: "Matching restaurants to your taste...", duration: 3000 },
    { icon: Star, text: "Finding top-rated spots...", duration: 3500 },
    { icon: MapPin, text: "Discovering nearby attractions...", duration: 3000 },
    { icon: Route, text: "Optimizing daily routes...", duration: 3500 },
    { icon: Clock, text: "Scheduling activities...", duration: 3000 },
    { icon: DollarSign, text: "Calculating budget estimates...", duration: 3000 },
    { icon: Plane, text: "Planning transportation...", duration: 3000 },
    { icon: Calendar, text: "Building your itinerary...", duration: 4000 },
    { icon: Search, text: "Adding local recommendations...", duration: 3500 },
    { icon: Sparkles, text: "Adding final touches...", duration: 5000 },
];

interface LoadingOverlayProps {
    type: "food-analysis" | "itinerary";
}

export function LoadingOverlay({ type }: LoadingOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const steps = type === "food-analysis" ? foodAnalysisSteps : itinerarySteps;
    const title = type === "food-analysis" ? "Analyzing Your Taste" : "Creating Your Perfect Trip";

    useEffect(() => {
        setCurrentStep(0);
        setCompletedSteps([]);
    }, [type]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                const next = prev + 1;
                if (next < steps.length) {
                    setCompletedSteps((completed) => [...completed, prev]);
                    return next;
                }
                return prev;
            });
        }, steps[currentStep]?.duration || 3000);

        return () => clearInterval(interval);
    }, [currentStep, steps]);

    const CurrentIcon = steps[currentStep]?.icon || Sparkles;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${type === "food-analysis" ? "bg-green-100" : "bg-amber-100"
                            }`}>
                            <CurrentIcon className={`w-8 h-8 md:w-10 md:h-10 ${type === "food-analysis" ? "text-green-500" : "text-amber-500"
                                }`} />
                        </div>
                        <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin ${type === "food-analysis" ? "border-t-green-400" : "border-t-amber-400"
                            }`}></div>
                    </div>
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center">
                    {title}
                </h3>

                <p className={`font-medium text-center mb-6 text-sm md:text-base animate-pulse ${type === "food-analysis" ? "text-green-600" : "text-amber-600"
                    }`}>
                    {steps[currentStep]?.text || "Almost there..."}
                </p>

                <div className="space-y-2">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isCompleted = completedSteps.includes(index);
                        const isCurrent = index === currentStep;

                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isCurrent ? (type === "food-analysis" ? "bg-green-50" : "bg-amber-50") : ""
                                    }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                            ? "bg-green-100"
                                            : isCurrent
                                                ? (type === "food-analysis" ? "bg-green-100" : "bg-amber-100")
                                                : "bg-gray-100"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <StepIcon
                                            className={`w-3 h-3 ${isCurrent
                                                    ? (type === "food-analysis" ? "text-green-500" : "text-amber-500")
                                                    : "text-gray-400"
                                                }`}
                                        />
                                    )}
                                </div>
                                <span
                                    className={`text-xs md:text-sm ${isCompleted
                                            ? "text-green-600"
                                            : isCurrent
                                                ? (type === "food-analysis" ? "text-green-600 font-medium" : "text-amber-600 font-medium")
                                                : "text-gray-400"
                                        }`}
                                >
                                    {step.text.replace("...", "")}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${type === "food-analysis"
                                ? "bg-gradient-to-r from-green-400 to-emerald-400"
                                : "bg-gradient-to-r from-amber-400 to-orange-400"
                            }`}
                        style={{
                            width: `${((currentStep + 1) / steps.length) * 100}%`,
                        }}
                    />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>
        </div>
    );
}

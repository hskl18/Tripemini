"use client";

import { useEffect, useState } from "react";
import { Utensils, MapPin, Calendar, Sparkles, Search, Route, CheckCircle } from "lucide-react";

const loadingSteps = [
    { icon: Utensils, text: "Analyzing your taste preferences...", duration: 3000 },
    { icon: Search, text: "Searching for matching restaurants...", duration: 4000 },
    { icon: MapPin, text: "Finding nearby attractions...", duration: 3500 },
    { icon: Route, text: "Optimizing daily routes...", duration: 3000 },
    { icon: Calendar, text: "Building your itinerary...", duration: 4000 },
    { icon: Sparkles, text: "Adding final touches...", duration: 3000 },
];

export function LoadingOverlay() {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                const next = prev + 1;
                if (next < loadingSteps.length) {
                    setCompletedSteps((completed) => [...completed, prev]);
                    return next;
                }
                return prev;
            });
        }, loadingSteps[currentStep]?.duration || 3000);

        return () => clearInterval(interval);
    }, [currentStep]);

    const CurrentIcon = loadingSteps[currentStep]?.icon || Sparkles;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-100 flex items-center justify-center">
                            <CurrentIcon className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin"></div>
                    </div>
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center">
                    Creating Your Perfect Trip
                </h3>

                <p className="text-amber-600 font-medium text-center mb-6 text-sm md:text-base animate-pulse">
                    {loadingSteps[currentStep]?.text || "Almost there..."}
                </p>

                <div className="space-y-2">
                    {loadingSteps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isCompleted = completedSteps.includes(index);
                        const isCurrent = index === currentStep;

                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isCurrent ? "bg-amber-50" : ""
                                    }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                            ? "bg-green-100"
                                            : isCurrent
                                                ? "bg-amber-100"
                                                : "bg-gray-100"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <StepIcon
                                            className={`w-3 h-3 ${isCurrent ? "text-amber-500" : "text-gray-400"
                                                }`}
                                        />
                                    )}
                                </div>
                                <span
                                    className={`text-xs md:text-sm ${isCompleted
                                            ? "text-green-600"
                                            : isCurrent
                                                ? "text-amber-600 font-medium"
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
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500 ease-out"
                        style={{
                            width: `${((currentStep + 1) / loadingSteps.length) * 100}%`,
                        }}
                    />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                    Step {currentStep + 1} of {loadingSteps.length}
                </p>
            </div>
        </div>
    );
}

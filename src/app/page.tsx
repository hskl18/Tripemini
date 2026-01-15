"use client";

import { useState } from "react";
import { Utensils, Sparkles, Map } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { TripForm } from "@/components/trip-form";
import { ItineraryView } from "@/components/itinerary-view";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useTripStore } from "@/store/trip-store";
import type { TripPreferences } from "@/types";

export default function Home() {
    const {
        uploadedImages,
        foodAnalysis,
        itinerary,
        isGenerating,
        setFoodAnalysis,
        setItinerary,
        setIsGenerating,
        reset,
    } = useTripStore();

    const [step, setStep] = useState<"upload" | "preferences" | "result">("upload");
    const [error, setError] = useState<string | null>(null);
    const [loadingType, setLoadingType] = useState<"food-analysis" | "itinerary">("food-analysis");

    const handleAnalyzeFood = async () => {
        if (uploadedImages.length === 0) {
            setError("Please upload at least one food photo");
            return;
        }

        setError(null);
        setLoadingType("food-analysis");
        setIsGenerating(true);

        try {
            const formData = new FormData();
            uploadedImages.forEach((img) => formData.append("images", img));

            const response = await fetch("/api/analyze-food", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to analyze food");

            const analysis = await response.json();
            setFoodAnalysis(analysis);
            setStep("preferences");
        } catch {
            setError("Failed to analyze your food photos. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateItinerary = async (preferences: TripPreferences) => {
        if (!foodAnalysis) return;

        setError(null);
        setLoadingType("itinerary");
        setIsGenerating(true);

        try {
            const response = await fetch("/api/generate-itinerary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foodAnalysis, preferences }),
            });

            if (!response.ok) throw new Error("Failed to generate itinerary");

            const generatedItinerary = await response.json();
            setItinerary(generatedItinerary);
            setStep("result");
        } catch {
            setError("Failed to generate your itinerary. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleStartOver = () => {
        reset();
        setStep("upload");
        setError(null);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
            {isGenerating && <LoadingOverlay type={loadingType} />}

            {/* Header */}
            <header className="py-4 md:py-6 px-4 border-b border-amber-100">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                            <Utensils className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold text-gray-900">Tripemini</span>
                    </div>
                    <nav className="hidden sm:flex items-center gap-6">
                        <button className="text-gray-600 hover:text-gray-900">Gallery</button>
                        <button className="text-gray-600 hover:text-gray-900">About</button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            {step === "upload" && (
                <section className="py-8 md:py-16 px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Plan Your Trip Around Your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                            Taste
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Upload a photo of food you love, and Tripemini plans your entire trip
                        around your taste. Powered by Gemini AI.
                    </p>
                </section>
            )}

            {/* Main Content */}
            <section className="max-w-4xl mx-auto px-4 py-4 md:py-8">
                {error && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm md:text-base">
                        {error}
                    </div>
                )}

                {step === "upload" && (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8">
                        <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                            <h2 className="text-xl md:text-2xl font-semibold">Step 1: Share Your Taste</h2>
                        </div>
                        <ImageUpload />
                        <button
                            onClick={handleAnalyzeFood}
                            disabled={uploadedImages.length === 0 || isGenerating}
                            className="mt-4 md:mt-6 w-full py-3 md:py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                        >
                            {isGenerating ? "Analyzing your taste..." : "Analyze My Food Preferences"}
                        </button>
                    </div>
                )}

                {step === "preferences" && foodAnalysis && (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8">
                        <div className="mb-6 md:mb-8 p-3 md:p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-2 text-sm md:text-base">
                                ✨ We detected your taste preferences!
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {foodAnalysis.cuisine.map((c) => (
                                    <span key={c} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs md:text-sm">
                                        {c}
                                    </span>
                                ))}
                                {foodAnalysis.flavorProfile.map((f) => (
                                    <span key={f} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs md:text-sm">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <Map className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                            <h2 className="text-xl md:text-2xl font-semibold">Step 2: Plan Your Trip</h2>
                        </div>
                        <TripForm onSubmit={handleGenerateItinerary} />
                    </div>
                )}

                {step === "result" && itinerary && (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8">
                        <ItineraryView itinerary={itinerary} />
                        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                            <button
                                onClick={handleStartOver}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-base"
                            >
                                Start Over
                            </button>
                            <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-lg hover:from-amber-500 hover:to-orange-500 text-sm md:text-base">
                                Share Itinerary
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="py-6 md:py-8 px-4 border-t border-gray-200 mt-8 md:mt-16">
                <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm md:text-base">
                    <p>Built with Gemini AI • Tripemini © 2026</p>
                </div>
            </footer>
        </main>
    );
}

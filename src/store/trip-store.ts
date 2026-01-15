import { create } from "zustand";
import type { FoodAnalysis, Itinerary, TripPreferences } from "@/types";

interface TripState {
    uploadedImages: File[];
    foodAnalysis: FoodAnalysis | null;
    preferences: TripPreferences | null;
    itinerary: Itinerary | null;
    isGenerating: boolean;

    setUploadedImages: (images: File[]) => void;
    addImage: (image: File) => void;
    removeImage: (index: number) => void;
    setFoodAnalysis: (analysis: FoodAnalysis) => void;
    setPreferences: (preferences: TripPreferences) => void;
    setItinerary: (itinerary: Itinerary) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    reset: () => void;
}

export const useTripStore = create<TripState>((set) => ({
    uploadedImages: [],
    foodAnalysis: null,
    preferences: null,
    itinerary: null,
    isGenerating: false,

    setUploadedImages: (images) => set({ uploadedImages: images }),
    addImage: (image) =>
        set((state) => ({ uploadedImages: [...state.uploadedImages, image] })),
    removeImage: (index) =>
        set((state) => ({
            uploadedImages: state.uploadedImages.filter((_, i) => i !== index),
        })),
    setFoodAnalysis: (analysis) => set({ foodAnalysis: analysis }),
    setPreferences: (preferences) => set({ preferences }),
    setItinerary: (itinerary) => set({ itinerary }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    reset: () =>
        set({
            uploadedImages: [],
            foodAnalysis: null,
            preferences: null,
            itinerary: null,
            isGenerating: false,
        }),
}));

"use client";

import { useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { useTripStore } from "@/store/trip-store";

export function ImageUpload() {
    const { uploadedImages, addImage, removeImage } = useTripStore();

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files).filter((f) =>
                f.type.startsWith("image/")
            );
            files.forEach(addImage);
        },
        [addImage]
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(addImage);
    };

    return (
        <div className="space-y-4">
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="food-upload"
                />
                <label htmlFor="food-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-3 md:mb-4" />
                    <p className="text-base md:text-lg font-medium text-gray-700">
                        Drop your favorite food photos here
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                        or tap to browse • PNG, JPG up to 10MB
                    </p>
                </label>
            </div>

            {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Food ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {uploadedImages.length === 0 && (
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload photos of dishes you love to get personalized recommendations</span>
                </div>
            )}
        </div>
    );
}

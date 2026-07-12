"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { useTripStore } from "@/store/trip-store";

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function FoodPreview({ file, index, onRemove }: {
    file: File;
    index: number;
    onRemove: (index: number) => void;
}) {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        const image = imageRef.current;
        if (image) image.src = objectUrl;
        return () => {
            URL.revokeObjectURL(objectUrl);
            image?.removeAttribute("src");
        };
    }, [file]);

    return (
        <div className="relative group aspect-square">
            {/* Blob previews are browser-local and cannot use the Next.js image optimizer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imageRef}
                alt={`Food ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
            />
            <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove food image ${index + 1}`}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
                <X className="w-3 h-3 md:w-4 md:h-4" />
            </button>
        </div>
    );
}

export function ImageUpload() {
    const { uploadedImages, addImage, removeImage } = useTripStore();
    const [uploadError, setUploadError] = useState<string>();

    const addAcceptedImages = useCallback(
        (files: File[]) => {
            const remainingSlots = Math.max(0, MAX_IMAGES - uploadedImages.length);
            const accepted = files
                .filter(
                    (file) =>
                        ALLOWED_IMAGE_TYPES.has(file.type) &&
                        file.size <= MAX_IMAGE_BYTES
                )
                .slice(0, remainingSlots);
            if (remainingSlots === 0) {
                setUploadError("Remove an image before adding another one.");
                return;
            }
            if (accepted.length !== files.length) {
                setUploadError(
                    "Only four JPEG, PNG, or WebP images up to 4 MiB each are accepted."
                );
            } else {
                setUploadError(undefined);
            }
            accepted.forEach(addImage);
        },
        [addImage, uploadedImages.length]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            addAcceptedImages(Array.from(e.dataTransfer.files));
        },
        [addAcceptedImages]
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        addAcceptedImages(Array.from(e.target.files || []));
        e.target.value = "";
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
                    accept="image/jpeg,image/png,image/webp"
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
                        or tap to browse • JPEG, PNG, or WebP • up to 4 MiB each • four images maximum
                    </p>
                </label>
            </div>

            {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    {uploadedImages.map((file, index) => (
                        <FoodPreview
                            key={`${file.name}-${file.lastModified}-${index}`}
                            file={file}
                            index={index}
                            onRemove={removeImage}
                        />
                    ))}
                </div>
            )}

            {uploadError && (
                <p role="alert" className="text-sm text-red-600">
                    {uploadError}
                </p>
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

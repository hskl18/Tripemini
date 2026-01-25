import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let _geminiModel: GenerativeModel | null = null;
let _geminiVisionModel: GenerativeModel | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAI) {
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            throw new Error("Missing GOOGLE_GEMINI_API_KEY environment variable");
        }
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    }
    return genAI;
}

// Use Gemini 3 Flash Preview for fast itinerary generation
export function getGeminiModel(): GenerativeModel {
    if (!_geminiModel) {
        _geminiModel = getGenAI().getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
            }
        });
    }
    return _geminiModel;
}

// Use Gemini 3 Flash Preview for food analysis
export function getGeminiVisionModel(): GenerativeModel {
    if (!_geminiVisionModel) {
        _geminiVisionModel = getGenAI().getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 1024,
            }
        });
    }
    return _geminiVisionModel;
}

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

export function getGeminiModel(): GenerativeModel {
    if (!_geminiModel) {
        _geminiModel = getGenAI().getGenerativeModel({ model: "gemini-3-pro-preview" });
    }
    return _geminiModel;
}

export function getGeminiVisionModel(): GenerativeModel {
    if (!_geminiVisionModel) {
        _geminiVisionModel = getGenAI().getGenerativeModel({ model: "gemini-3-pro-preview" });
    }
    return _geminiVisionModel;
}

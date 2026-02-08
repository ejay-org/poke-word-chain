import { GoogleGenerativeAI } from '@google/generative-ai';
import { getValidNextWord, getLastChar } from './gameLogic';
import { GEMINI_CONFIG, SYSTEM_PROMPTS } from '@/constants';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Rate Limiting Config
const requestTimestamps: number[] = [];

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL_NAME });
} else {
    console.warn('Gemini API Key is missing. AI will be disabled or fall back to local logic.');
}

/**
 * Checks if the rate limit has been exceeded.
 * @returns true if request is allowed, false if limited.
 */
function checkRateLimit(): boolean {
    const now = Date.now();
    // Remove timestamps older than 1 minute (60,000 ms)
    while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
        requestTimestamps.shift();
    }

    if (requestTimestamps.length >= GEMINI_CONFIG.RATE_LIMIT_RPM) {
        return false;
    }

    requestTimestamps.push(now);
    return true;
}

/**
 * Generates a response from the AI Pokemon Master.
 * 
 * @param lastWord The word the user just said.
 * @param usedWords The history of used words to avoid duplication.
 * @returns A promise that resolves to the AI's word and message.
 */
export async function generateAiResponse(lastWord: string, usedWords: Set<string>): Promise<{ word: string; message: string }> {
    const endChar = getLastChar(lastWord);

    // 1. First, find a valid word locally to ensure gameplay continuity.
    const validWord = getValidNextWord(endChar, usedWords);

    if (!validWord) {
        throw new Error('No valid moves left for AI.');
    }

    // If local fallback logic triggers, we use this message
    // If API is not available, return a generic response with the valid word.
    if (!model) {
        return {
            word: validWord,
            message: `${validWord}! (API 키가 없어서 로컬 로직으로 응답함)`
        };
    }

    // Check Rate Limit
    if (!checkRateLimit()) {
        console.warn('Gemini API Rate Limit Exceeded (Client-side check). Falling back to local logic.');
        return {
            word: validWord,
            message: `${validWord}! (말을 너무 많이 했더니 숨차... 잠시만 천천히 할게 헥헥)`
        };
    }

    try {
        // 2. Prompt Gemini to generate a persona-based message using the selected word.
        const prompt = SYSTEM_PROMPTS.POKEMON_MASTER(lastWord, validWord);

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return {
            word: validWord,
            message: text.trim()
        };

    } catch (error: any) {
        console.error('Gemini API Error (Primary Model):', error);

        const errorMessage = error.toString().toLowerCase();
        if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('limit')) {

            console.warn('Quota exceeded. Switching to Fallback Model:', GEMINI_CONFIG.FALLBACK_MODEL_NAME);
            try {
                // Initialize/Use fallback model
                const fallbackModel = genAI!.getGenerativeModel({ model: GEMINI_CONFIG.FALLBACK_MODEL_NAME });
                const prompt = SYSTEM_PROMPTS.POKEMON_MASTER(lastWord, validWord);
                const result = await fallbackModel.generateContent(prompt);
                const response = result.response;
                const text = response.text();

                return {
                    word: validWord,
                    message: text.trim()
                };
            } catch (fallbackError: any) {
                console.error('Gemini API Error (Fallback Model):', fallbackError);
                return {
                    word: validWord,
                    message: `${validWord}! (AI가 지금 너무 피곤해서... 잠깐 쉴게 😴)`
                };
            }
        }

        // Fallback to basic message
        return {
            word: validWord,
            message: `${validWord}! (AI 연결 상태가 좋지 않아...)`
        };
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getValidNextPokemon, getLastChar } from './gameLogic';
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
 * Finds a valid word locally for the AI to allow immediate response.
 */
export function getAiWord(lastWord: string, usedWords: Set<string>): string | null {
    const endChar = getLastChar(lastWord);
    const pokemon = getValidNextPokemon(endChar, usedWords);
    return pokemon ? pokemon.name : null;
}

/**
 * Generates the persona-based message for the chosen word asynchronously.
 */
export async function getAiMessage(aiWord: string, lastWord: string): Promise<string> {
    if (!model) {
        return `${aiWord}! (API 키가 없어서 로컬 로직으로 응답함)`;
    }

    // Check Rate Limit
    if (!checkRateLimit()) {
        console.warn('Gemini API Rate Limit Exceeded (Client-side check). Falling back to local logic.');
        return `${aiWord}! (말을 너무 많이 했더니 숨차... 잠시만 천천히 할게 헥헥)`;
    }

    try {
        // Prompt Gemini to generate a persona-based message using the selected word.
        const prompt = SYSTEM_PROMPTS.POKEMON_MASTER(lastWord, aiWord);

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return text.trim();

    } catch (error: any) {
        console.error('Gemini API Error (Primary Model):', error);

        const errorMessage = error.toString().toLowerCase();
        if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('limit')) {

            console.warn('Quota exceeded. Switching to Fallback Model:', GEMINI_CONFIG.FALLBACK_MODEL_NAME);
            try {
                // Initialize/Use fallback model
                const fallbackModel = genAI!.getGenerativeModel({ model: GEMINI_CONFIG.FALLBACK_MODEL_NAME });
                const prompt = SYSTEM_PROMPTS.POKEMON_MASTER(lastWord, aiWord);
                const result = await fallbackModel.generateContent(prompt);
                const response = result.response;
                const text = response.text();

                return text.trim();
            } catch (fallbackError: any) {
                console.error('Gemini API Error (Fallback Model):', fallbackError);
                return `${aiWord}! (AI가 지금 너무 피곤해서... 잠깐 쉴게 😴)`;
            }
        }

        // Fallback to basic message
        return `${aiWord}! (AI 연결 상태가 좋지 않아...)`;
    }
}

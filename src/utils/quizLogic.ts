/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, SYSTEM_PROMPTS } from '@/constants';
import type { Pokemon } from '@/utils/gameLogic';
import pokemonDataRaw from '@/data/pokemonData.json';

const pokemonData = pokemonDataRaw as Pokemon[];

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const quizRequestTimestamps: number[] = [];

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL_NAME });
}

export interface QuizHintsResult {
    hints: string[];
    fromFallback: boolean;
}

function checkQuizRateLimit(): boolean {
    const now = Date.now();
    while (quizRequestTimestamps.length > 0 && quizRequestTimestamps[0] < now - 60000) {
        quizRequestTimestamps.shift();
    }
    if (quizRequestTimestamps.length >= GEMINI_CONFIG.RATE_LIMIT_RPM) {
        return false;
    }
    quizRequestTimestamps.push(now);
    return true;
}

function buildFallbackHints(pokemon: Pokemon): string[] {
    const abilitiesText = pokemon.abilities.length > 0
        ? pokemon.abilities[0]
        : '특별한 능력';
    return [
        `${pokemon.generation}세대에 등장한 포켓몬이에요.`,
        pokemon.description,
        `이 포켓몬의 특성 중에는 '${abilitiesText}'이(가) 있어요.`,
        `타입은 ${pokemon.types.join('/')} 계열이에요.`,
        `영어 이름은 '${pokemon.nameEn[0]}'으로 시작해요.`,
    ];
}

function parseHints(rawText: string): string[] {
    const cleaned = rawText
        .replace(/^```(?:json)?\n?/, '')
        .replace(/\n?```$/, '')
        .trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed.hints) || parsed.hints.length !== 5) {
        throw new Error('Invalid hints format');
    }
    return parsed.hints as string[];
}

export async function generateQuizHints(pokemon: Pokemon): Promise<QuizHintsResult> {
    if (!model) {
        return { hints: buildFallbackHints(pokemon), fromFallback: true };
    }

    if (!checkQuizRateLimit()) {
        return { hints: buildFallbackHints(pokemon), fromFallback: true };
    }

    const prompt = SYSTEM_PROMPTS.QUIZ_HINTS({
        generation: pokemon.generation,
        types: pokemon.types,
        typesEn: pokemon.typesEn,
        abilities: pokemon.abilities,
        description: pokemon.description,
        nameEn: pokemon.nameEn,
    });

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const hints = parseHints(text);
        return { hints, fromFallback: false };
    } catch (error: any) {
        const msg = error.toString().toLowerCase();
        if (msg.includes('quota') || msg.includes('429') || msg.includes('limit')) {
            try {
                const fallbackModel = genAI!.getGenerativeModel({ model: GEMINI_CONFIG.FALLBACK_MODEL_NAME });
                const result = await fallbackModel.generateContent(prompt);
                const text = result.response.text().trim();
                const hints = parseHints(text);
                return { hints, fromFallback: false };
            } catch {
                // fall through to local fallback
            }
        }
        return { hints: buildFallbackHints(pokemon), fromFallback: true };
    }
}

export function getRandomQuizPokemon(): Pokemon {
    const idx = Math.floor(Math.random() * pokemonData.length);
    return pokemonData[idx];
}

export function checkAnswer(guess: string, pokemon: Pokemon): boolean {
    const normalized = guess.trim().normalize('NFC');
    return (
        normalized === pokemon.name.normalize('NFC') ||
        normalized.toLowerCase() === pokemon.nameEn.toLowerCase()
    );
}

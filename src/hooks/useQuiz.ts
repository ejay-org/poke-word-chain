import { useState, useCallback } from 'react';
import { generateQuizHints, getRandomQuizPokemon, checkAnswer } from '@/utils/quizLogic';
import type { Pokemon } from '@/utils/gameLogic';

export type QuizStatus = 'idle' | 'loading' | 'playing' | 'success' | 'failure';

interface UseQuizReturn {
    status: QuizStatus;
    currentPokemon: Pokemon | null;
    revealedHints: string[];
    revealedCount: number;
    hintsTotal: number;
    fromFallback: boolean;
    startQuiz: () => Promise<void>;
    submitGuess: (input: string) => void;
    skipToNextHint: () => void;
    resetQuiz: () => void;
}

export function useQuiz(): UseQuizReturn {
    const [status, setStatus] = useState<QuizStatus>('idle');
    const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
    const [hints, setHints] = useState<string[]>([]);
    const [revealedCount, setRevealedCount] = useState(1);
    const [fromFallback, setFromFallback] = useState(false);

    const startQuiz = useCallback(async () => {
        if (status === 'loading') return;
        setStatus('loading');
        setCurrentPokemon(null);
        setHints([]);
        setRevealedCount(1);
        setFromFallback(false);

        const pokemon = getRandomQuizPokemon();
        const result = await generateQuizHints(pokemon);

        setCurrentPokemon(pokemon);
        setHints(result.hints);
        setFromFallback(result.fromFallback);
        setRevealedCount(1);
        setStatus('playing');
    }, [status]);

    const submitGuess = useCallback((input: string) => {
        if (status !== 'playing' || !currentPokemon) return;

        if (checkAnswer(input, currentPokemon)) {
            setStatus('success');
            return;
        }

        if (revealedCount < 5) {
            setRevealedCount((c) => c + 1);
        } else {
            setStatus('failure');
        }
    }, [status, currentPokemon, revealedCount]);

    const skipToNextHint = useCallback(() => {
        if (status !== 'playing') return;
        if (revealedCount < 5) {
            setRevealedCount((c) => c + 1);
        } else {
            setStatus('failure');
        }
    }, [status, revealedCount]);

    const resetQuiz = useCallback(() => {
        setStatus('idle');
        setCurrentPokemon(null);
        setHints([]);
        setRevealedCount(1);
        setFromFallback(false);
    }, []);

    return {
        status,
        currentPokemon,
        revealedHints: hints.slice(0, revealedCount),
        revealedCount,
        hintsTotal: 5,
        fromFallback,
        startQuiz,
        submitGuess,
        skipToNextHint,
        resetQuiz,
    };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as gameLogic from '@/utils/gameLogic';


// Mock dependencies
vi.mock('@/utils/gameLogic', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/utils/gameLogic')>();
    return {
        ...actual,
        getValidNextPokemon: vi.fn(),
        getRandomPokemon: vi.fn(),
        validateWord: vi.fn(),
        getLastChar: (word: string) => word.slice(-1),
    };
});

vi.mock('@/utils/gemini_api', () => ({
    getAiMessage: vi.fn().mockResolvedValue('AI Message'),
}));

describe('useGame Hook - User Game Over', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should detect when user has no moves and set status to lost', async () => {
        // Setup Mocks
        (gameLogic.validateWord as any).mockReturnValue({
            isValid: true,
            pokemon: { name: 'UserMon', imageUrl: 'user.png' }
        });

        // Start with Pika
        (gameLogic.getRandomPokemon as any).mockReturnValue({
            name: 'Pika',
            imageUrl: 'pika.png'
        });

        // AI plays 'AiMon'
        (gameLogic.getValidNextPokemon as any).mockImplementation((lastChar: string, usedWords: Set<string>) => {
            if (lastChar === 'n') { // Last char of 'UserMon'
                if (usedWords.has('AiMon')) {
                    return null;
                }
                return { name: 'AiMon', imageUrl: 'ai.png' };
            }
            return null;
        });

        const { result } = renderHook(() => useGame());

        // Start Game
        act(() => {
            result.current.startGame('normal');
        });

        await act(async () => {
            vi.advanceTimersByTime(2000); // AI Start
        });

        // User plays 'UserMon'
        act(() => {
            result.current.submitUserWord('UserMon');
        });

        // Fast-forward AI turn
        await act(async () => {
            vi.runAllTimers();
        });

        // Check Logic:
        // 1. User played UserMon (ends in n)
        // 2. AI played AiMon (ends in n)
        // 3. Logic checks if valid move exists for 'n'. Mock returns null.
        // 4. Status should be 'lost'

        expect(result.current.messages.some(m => m.pokemonName === 'AiMon')).toBe(true);
        expect(result.current.status).toBe('lost');
        expect(result.current.messages.some(m => m.isGameEnd === true)).toBe(true);
    });
});

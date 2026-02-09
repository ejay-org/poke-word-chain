/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as gameLogic from '@/utils/gameLogic';
import * as geminiApi from '@/utils/gemini_api';

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
    getAiWord: vi.fn(),
    getAiMessage: vi.fn().mockResolvedValue('AI Message'),
}));

describe('useGame Hook - AI Image Display', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should start with AI message and handle user response', async () => {
        // Setup Mocks
        (gameLogic.validateWord as any).mockReturnValue({
            isValid: true,
            pokemon: { name: '파이리', imageUrl: 'user-img.png' }
        });

        // Mock getRandomPokemon for Start Game
        (gameLogic.getRandomPokemon as any).mockReturnValue({
            name: '피카츄',
            imageUrl: 'pika.png'
        });

        // Mock getValidNextPokemon for AI Turn
        (gameLogic.getValidNextPokemon as any).mockReturnValue({
            name: '리자드',
            imageUrl: 'ai-img.png',
            description: 'Fire Lizard'
        });

        // Mock getAiWord (legacy, if used)
        (geminiApi.getAiWord as any).mockReturnValue('리자드');

        const { result } = renderHook(() => useGame());

        // Start Game
        act(() => {
            result.current.startGame('normal');
        });

        // Fast-forward initial AI start delay (1500ms)
        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        // Check for AI Start Message
        const startMessage = result.current.messages.find(m => m.sender === 'ai' && m.pokemonName === '피카츄');
        expect(startMessage).toBeTruthy();
        expect(startMessage?.pokemonImageUrl).toBe('pika.png');

        // Submit User Word
        act(() => {
            result.current.submitUserWord('파이리');
        });

        // Fast-forward time for AI response delay
        await act(async () => {
            vi.runAllTimers();
        });

        // Check messages
        const aiMessage = result.current.messages.find(m => m.sender === 'ai' && m.pokemonName === '리자드');

        expect(aiMessage).toBeTruthy();
        expect(aiMessage?.pokemonName).toBe('리자드');
        expect(aiMessage?.pokemonImageUrl).toBe('ai-img.png');
    });

    it('should include pokemonImageUrl in AI response in Normal Mode', async () => {
        // Setup Mocks
        (gameLogic.validateWord as any).mockReturnValue({
            isValid: true,
            pokemon: { name: '파이리', imageUrl: 'user-img.png' }
        });

        // Mock getValidNextPokemon to return a Pokemon with an Image
        (gameLogic.getValidNextPokemon as any).mockReturnValue({
            name: '리자드',
            imageUrl: 'ai-img.png',
            description: 'Fire Lizard'
        });

        // Mock getAiWord (legacy, if used)
        (geminiApi.getAiWord as any).mockReturnValue('리자드');

        const { result } = renderHook(() => useGame());

        // Start Game
        act(() => {
            result.current.startGame('normal');
        });

        // Submit User Word
        act(() => {
            result.current.submitUserWord('파이리');
        });

        // Fast-forward time for AI delay
        await act(async () => {
            vi.runAllTimers();
        });

        // Check messages
        const messages = result.current.messages;
        const aiMessage = messages.find(m => m.sender === 'ai' && m.text.includes('리자드'));

        expect(aiMessage).toBeTruthy();
        expect(aiMessage?.pokemonName).toBe('리자드');
        // This expectation is the key: IT SHOULD HAVE AN IMAGE
        expect(aiMessage?.pokemonImageUrl).toBe('ai-img.png');
    });

    it('should include pokemonImageUrl in AI response in AI Mode', async () => {
        // Setup Mocks
        (gameLogic.validateWord as any).mockReturnValue({
            isValid: true,
            pokemon: { name: '파이리', imageUrl: 'user-img.png' }
        });

        (gameLogic.getValidNextPokemon as any).mockReturnValue({
            name: '리자드',
            imageUrl: 'ai-img.png',
            description: 'Fire Lizard'
        });
        (geminiApi.getAiWord as any).mockReturnValue('리자드');
        (geminiApi.getAiMessage as any).mockResolvedValue('리자드! 불꽃 세례!');

        const { result } = renderHook(() => useGame());

        // Start Game
        act(() => {
            result.current.startGame('ai');
        });

        // Submit User Word
        act(() => {
            result.current.submitUserWord('파이리');
        });

        // Fast-forward time for AI delay
        await act(async () => {
            vi.runAllTimers();
        });

        // Check messages (Async update might need waiting, but fake timers help)
        // With current "blocking" logic, it waits for getAiMessage.
        // With "non-blocking" logic, it shows immediately.

        const messages = result.current.messages;
        // Depending on implementation, we might check for the existence of ANY message with image
        const aiMessage = messages.find(m => m.sender === 'ai' && (m.text.includes('리자드') || m.pokemonName === '리자드'));

        expect(aiMessage).toBeTruthy();
        expect(aiMessage?.pokemonImageUrl).toBe('ai-img.png');
    });
});

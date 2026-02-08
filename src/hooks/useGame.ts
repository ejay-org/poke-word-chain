import { useState, useCallback, useRef } from 'react';
import { validateWord, getValidNextWord, getLastChar } from '@/utils/gameLogic';
import type { ChatMessage } from '@/types';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';
export type Turn = 'user' | 'ai';

interface UseGameReturn {
    messages: ChatMessage[];
    status: GameStatus;
    currentTurn: Turn;
    usedWords: Set<string>;
    startGame: () => void;
    submitUserWord: (word: string) => void;
    giveHint: () => void;
    resetGame: () => void;
}

export function useGame(): UseGameReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<GameStatus>('idle');
    const [currentTurn, setCurrentTurn] = useState<Turn>('user');
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    // Keep track of the last word's end char for validation (chaining)
    // If empty, it means any word is valid (start of game).
    const lastEndChar = useRef<string>('');

    const addMessage = (sender: 'user' | 'ai' | 'system', text: string) => {
        const newMessage: ChatMessage = {
            id: `${sender}-${Date.now()}-${Math.random()}`,
            sender,
            text,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const startGame = useCallback(() => {
        setMessages([]);
        setUsedWords(new Set());
        setStatus('playing');
        setCurrentTurn('user');
        lastEndChar.current = '';
        addMessage('ai', '포켓몬 끝말잇기를 시작합니다! 먼저 포켓몬 이름을 말씀해주세요.');
    }, []);

    const resetGame = useCallback(() => {
        setMessages([]);
        setUsedWords(new Set());
        setStatus('idle');
        setCurrentTurn('user');
        lastEndChar.current = '';
    }, []);



    const submitUserWord = useCallback((word: string) => {
        if (status !== 'playing' || currentTurn !== 'user') return;

        // Validate
        const validation = validateWord(word, lastEndChar.current, usedWords);

        if (!validation.isValid) {
            // Show error as system message or just alert? 
            // System message is better for chat interface.
            addMessage('system', `❌ ${validation.error}`);
            return;
        }

        // Valid User Move
        const validWord = validation.pokemon!.name; // Normalized name if needed, but we use trimmed.
        addMessage('user', validWord);

        // Update State
        const newUsedWords = new Set(usedWords);
        newUsedWords.add(validWord);
        setUsedWords(newUsedWords);
        setCurrentTurn('ai');

        // Process AI Turn
        const userEndChar = getLastChar(validWord);
        lastEndChar.current = userEndChar;

        setTimeout(() => {
            // AI Turn Logic
            const aiWord = getValidNextWord(userEndChar, newUsedWords);

            if (!aiWord) {
                // AI cannot find a word -> User Wins
                addMessage('ai', `으윽... '${userEndChar}'(으)로 시작하는 포켓몬이 생각이 안 나...!`);
                addMessage('system', '🎉 축하합니다! 당신이 이겼습니다!');
                setStatus('won');
                return;
            }

            // AI found a word
            addMessage('ai', aiWord);

            // Update State for AI move
            // We need to update state again. Note: usedWords here is from closure (old), 
            // but we know what we added. 
            // Better to use functional state update to be safe against race conditions?
            // But here we are in a timeout, so we should be careful.

            setUsedWords((prev) => {
                const next = new Set(prev);
                next.add(aiWord);
                return next;
            });

            lastEndChar.current = getLastChar(aiWord);
            setCurrentTurn('user');

        }, 1200 + Math.random() * 1000); // 1.2s ~ 2.2s delay for realism

    }, [status, currentTurn, usedWords]);

    const giveHint = useCallback(() => {
        if (status !== 'playing') return;

        // Find a valid word for the USER
        const hintWord = getValidNextWord(lastEndChar.current, usedWords);
        if (hintWord) {
            addMessage('system', `💡 힌트: ${hintWord}`);
        } else {
            addMessage('system', '💡 더 이상 가능한 단어가 없습니다!');
        }
    }, [status, usedWords]);

    return {
        messages,
        status,
        currentTurn,
        usedWords,
        startGame,
        submitUserWord,
        giveHint,
        resetGame,
    };
}

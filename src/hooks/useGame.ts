import { useState, useCallback, useRef } from 'react';
import { validateWord, getValidNextPokemon, getLastChar, getRandomPokemon } from '@/utils/gameLogic';
import { getAiMessage } from '@/utils/gemini_api';
import { GAME_CONFIG } from '@/constants';
import type { ChatMessage, GameMode } from '@/types';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';
export type Turn = 'user' | 'ai';

interface UseGameReturn {
    messages: ChatMessage[];
    status: GameStatus;
    currentTurn: Turn;
    usedWords: Set<string>;
    gameMode: GameMode;
    startGame: (mode: GameMode) => void;
    submitUserWord: (word: string) => void;
    giveHint: () => void;
    resetGame: () => void;
    updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
}

export function useGame(): UseGameReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<GameStatus>('idle');
    const [currentTurn, setCurrentTurn] = useState<Turn>('user');
    const [gameMode, setGameMode] = useState<GameMode>('normal');
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    // Keep track of the last word's end char for validation (chaining)
    // If empty, it means any word is valid (start of game).
    const lastEndChar = useRef<string>('');

    const addMessage = (sender: 'user' | 'ai' | 'system', text: string, options?: Partial<ChatMessage>): string => {
        const id = `${sender}-${Date.now()}-${Math.random()}`;
        const newMessage: ChatMessage = {
            id,
            sender,
            text,
            timestamp: Date.now(),
            ...options
        };
        setMessages((prev) => [...prev, newMessage]);
        return id;
    };

    const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
        setMessages((prev) => prev.map(msg =>
            msg.id === id ? { ...msg, ...updates } : msg
        ));
    }, []);

    const startGame = useCallback((mode: GameMode) => {
        setMessages([]);
        setUsedWords(new Set());
        setStatus('playing');
        setCurrentTurn('user');
        setGameMode(mode);
        lastEndChar.current = '';
        addMessage('system', '게임을 시작합니다! AI가 먼저 포켓몬을 제시합니다.');

        // AI Start Logic with Delay
        setTimeout(() => {
            const startPokemon = getRandomPokemon();
            const startWord = startPokemon.name;

            // Immediate display
            addMessage('ai', `${startWord}! (시작 단어)`, {
                pokemonName: startWord,
                pokemonImageUrl: startPokemon.imageUrl
            });

            // Set initial state
            setUsedWords((prev) => {
                const next = new Set(prev); // Use fresh set/prev just in case, though it's new
                next.add(startWord);
                return next;
            });
            lastEndChar.current = getLastChar(startWord);
            setCurrentTurn('user'); // User's turn to answer
        }, 1500);
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
            // Show error as system message
            addMessage('system', `❌ ${validation.error}`);
            return;
        }

        // Valid User Move
        const validWord = validation.pokemon!.name;
        const validImage = validation.pokemon!.imageUrl;
        addMessage('user', validWord, { pokemonName: validWord, pokemonImageUrl: validImage });

        // Update State
        const newUsedWords = new Set(usedWords);
        newUsedWords.add(validWord);
        setUsedWords(newUsedWords);
        setCurrentTurn('ai');

        // Process AI Turn
        const userEndChar = getLastChar(validWord);
        lastEndChar.current = userEndChar;

        // AI Logic: Non-blocking (Immediate word/image, Async message)
        setTimeout(async () => {
            try {
                // 1. Select AI Pokemon Immediately
                const aiPokemon = getValidNextPokemon(userEndChar, newUsedWords);

                if (!aiPokemon) {
                    addMessage('ai', `으윽... '${userEndChar}'(으)로 시작하는 포켓몬이 생각이 안 나...!`);
                    addMessage('system', '🎉 축하합니다! 당신이 이겼습니다!', { isGameEnd: true });
                    setStatus('won');
                    return;
                }

                const aiWord = aiPokemon.name;
                const aiImage = aiPokemon.imageUrl;

                // 2. Immediate Display (Word + Image)
                const initialText = gameMode === 'normal' ? `${aiWord}!` : `${aiWord} (AI가 고민 중... 💭)`;

                const aiMsgId = addMessage('ai', initialText, {
                    pokemonName: aiWord,
                    pokemonImageUrl: aiImage
                });

                // 3. Update Game State Immediately
                const updatedUsedWords = new Set(newUsedWords);
                updatedUsedWords.add(aiWord);

                setUsedWords(updatedUsedWords);

                const aiEndChar = getLastChar(aiWord);
                lastEndChar.current = aiEndChar;
                setCurrentTurn('user');

                // 4. CHECK IF USER LOST (No moves left)
                const userNextMove = getValidNextPokemon(aiEndChar, updatedUsedWords);
                if (!userNextMove) {
                    setTimeout(() => {
                        addMessage('system', `더 이상 '${aiEndChar}'(으)로 시작하는 포켓몬이 없습니다.`, { isGameEnd: true });
                        setStatus('lost');
                    }, 500); // Slight delay for dramatic effect
                }

                // 5. Async: Fetch Persona Message (AI Mode Only)
                if (gameMode === 'ai' && !!userNextMove) { // Only fetch persona if game continues
                    try {
                        const fullMessage = await getAiMessage(aiWord, userEndChar);
                        updateMessage(aiMsgId, { text: fullMessage });
                    } catch (err) {
                        console.error("Failed to get AI message", err);
                        // If failed, just keep the word
                        updateMessage(aiMsgId, { text: `${aiWord}!` });
                    }
                }

            } catch (error) {
                console.error("Critical AI Error", error);
                addMessage('system', '❌ AI 오류가 발생했습니다.', { isGameEnd: true });
            }
        }, GAME_CONFIG.AI_DELAY_MIN + Math.random() * GAME_CONFIG.AI_DELAY_RANDOM);

    }, [status, currentTurn, usedWords, gameMode]);

    const giveHint = useCallback(() => {
        if (status !== 'playing') return;

        // Find a valid word for the USER
        const hintPokemon = getValidNextPokemon(lastEndChar.current, usedWords);
        if (hintPokemon) {
            addMessage('system', `💡 힌트: ${hintPokemon.description}`, { hintAnswer: hintPokemon.name });
        } else {
            addMessage('system', '💡 더 이상 가능한 단어가 없습니다!');
        }
    }, [status, usedWords]);

    return {
        messages,
        status,
        currentTurn,
        usedWords,
        gameMode,
        startGame,
        submitUserWord,
        giveHint,
        resetGame,
        updateMessage,
    };
}

import { useState, useCallback, useRef } from 'react';

interface UseTTSReturn {
    isSpeaking: boolean;
    speak: (text: string) => void;
    cancel: () => void;
}

/**
 * Web Speech API (SpeechSynthesis) wrapper for Korean TTS.
 * No external API required — uses the browser's built-in engine.
 */
export function useTTS(): UseTTSReturn {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const speak = useCallback(
        (text: string) => {
            if (!window.speechSynthesis) return;

            // Cancel any ongoing speech first
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            // Prefer a Korean voice if available
            const voices = window.speechSynthesis.getVoices();
            const koreanVoice = voices.find(
                (v) => v.lang === 'ko-KR' || v.lang.startsWith('ko')
            );
            if (koreanVoice) {
                utterance.voice = koreanVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        },
        []
    );

    return { isSpeaking, speak, cancel };
}

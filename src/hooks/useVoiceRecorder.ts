import { useState, useRef, useCallback } from 'react';
import { transcribeAudio } from '@/services/groq_stt';

export type RecorderStatus = 'idle' | 'recording' | 'processing' | 'error';

interface UseVoiceRecorderOptions {
    onTranscript: (text: string) => void;
    onError?: (message: string) => void;
}

interface UseVoiceRecorderReturn {
    status: RecorderStatus;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
}

export function useVoiceRecorder({
    onTranscript,
    onError,
}: UseVoiceRecorderOptions): UseVoiceRecorderReturn {
    const [status, setStatus] = useState<RecorderStatus>('idle');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        // Stop all tracks to release microphone
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    }, []);

    const startRecording = useCallback(async () => {
        if (status === 'recording') {
            stopRecording();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = [];

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                setStatus('processing');
                try {
                    const audioBlob = new Blob(chunksRef.current, {
                        type: 'audio/webm',
                    });
                    const text = await transcribeAudio(audioBlob);
                    if (text) {
                        onTranscript(text);
                    }
                } catch (err) {
                    const message =
                        err instanceof Error ? err.message : '음성 인식 중 오류가 발생했습니다.';
                    console.error('STT Error:', err);
                    onError?.(message);
                } finally {
                    setStatus('idle');
                }
            };

            mediaRecorder.start();
            setStatus('recording');
        } catch (err) {
            console.error('Microphone access error:', err);
            const message =
                err instanceof Error && err.name === 'NotAllowedError'
                    ? '마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.'
                    : '마이크에 접근할 수 없습니다.';
            onError?.(message);
            setStatus('idle');
        }
    }, [status, stopRecording, onTranscript, onError]);

    return { status, startRecording, stopRecording };
}

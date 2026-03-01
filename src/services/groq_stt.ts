const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_MODEL = 'whisper-large-v3-turbo';

/**
 * Transcribes an audio Blob using Groq Whisper API.
 * @param audioBlob - The recorded audio blob (webm/ogg/wav)
 * @returns The transcribed Korean text
 * @throws Error if API key is missing or request fails
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error(
            'VITE_GROQ_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.'
        );
    }

    // Blob → File (required by Groq API for filename/extension)
    const audioFile = new File([audioBlob], 'recording.webm', {
        type: audioBlob.type || 'audio/webm',
    });

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', GROQ_MODEL);
    formData.append('language', 'ko');
    formData.append('response_format', 'json');

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Groq STT API error:', response.status, errorBody);

        if (response.status === 401) {
            throw new Error('Groq API 키가 유효하지 않습니다.');
        } else if (response.status === 429) {
            throw new Error('Groq API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        } else {
            throw new Error(`음성 인식 실패 (${response.status})`);
        }
    }

    const data = (await response.json()) as { text: string };

    // Remove trailing punctuation/whitespace that Whisper sometimes adds
    return data.text.trim().replace(/[.,!?。、！？]+$/, '');
}

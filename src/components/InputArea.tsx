import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

interface InputAreaProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  showVoice?: boolean;
}

export default function InputArea({ onSubmit, disabled = false, showVoice = false }: InputAreaProps) {
  const [input, setInput] = useState('');
  const [sttError, setSttError] = useState<string | null>(null);

  const { status: recorderStatus, startRecording } = useVoiceRecorder({
    onTranscript: (text) => {
      // Populate the input field so the user can review and submit
      setInput(text.trim());
      setSttError(null);
    },
    onError: (message) => {
      setSttError(message);
      // Clear error after 4 seconds
      setTimeout(() => setSttError(null), 4000);
    },
  });

  const isRecording = recorderStatus === 'recording';
  const isProcessing = recorderStatus === 'processing';
  const voiceBusy = isRecording || isProcessing;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled || voiceBusy) return;
    onSubmit(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Input pill */}
        <div className="flex-1 relative flex items-center bg-card rounded-full border border-primary/15 shadow-sm overflow-hidden h-13">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? '🔴 녹음 중...' : isProcessing ? '⏳ 인식 중...' : 'Type a Pokemon name...'}
            disabled={disabled || voiceBusy}
            autoComplete="off"
            className="flex-1 bg-transparent pl-5 pr-2 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          />

          {/* Mic button — only in conversation mode */}
          {showVoice && (
            <button
              type="button"
              onClick={startRecording}
              disabled={disabled || isProcessing}
              title={isRecording ? '녹음 중지' : '음성으로 입력'}
              className="px-3 flex-shrink-0 transition-colors disabled:opacity-30"
            >
              {isProcessing ? (
                <Loader2 className="size-4 text-primary animate-spin" />
              ) : isRecording ? (
                <MicOff className="size-4 text-red-500 animate-pulse" />
              ) : (
                <Mic className="size-4 text-muted-foreground/50 hover:text-primary" />
              )}
            </button>
          )}
        </div>

        {/* Send button — coral circle */}
        <button
          type="submit"
          disabled={disabled || voiceBusy || !input.trim()}
          className="size-13 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 flex-shrink-0"
        >
          <Send className="size-5 text-white ml-0.5" />
        </button>
      </form>

      {/* STT error message */}
      {sttError && (
        <p className="text-xs text-red-500 px-2 animate-in fade-in slide-in-from-top-1">
          {sttError}
        </p>
      )}
    </div>
  );
}

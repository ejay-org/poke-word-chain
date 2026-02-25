import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Image, Send } from 'lucide-react';

interface InputAreaProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function InputArea({ onSubmit, disabled = false }: InputAreaProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      {/* Input pill */}
      <div className="flex-1 relative flex items-center bg-card rounded-full border border-primary/15 shadow-sm overflow-hidden h-13">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a Pokemon name..."
          disabled={disabled}
          autoComplete="off"
          className="flex-1 bg-transparent pl-5 pr-2 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
        {/* Image icon inside input */}
        <button
          type="button"
          className="px-3 text-muted-foreground/50 hover:text-primary transition-colors flex-shrink-0"
          tabIndex={-1}
        >
          <Image className="size-4" />
        </button>
      </div>

      {/* Send button — coral circle */}
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="size-13 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 flex-shrink-0"
      >
        <Send className="size-5 text-white ml-0.5" />
      </button>
    </form>
  );
}

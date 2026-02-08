import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="border-t bg-background px-4 py-3">
      <div className="mx-auto max-w-2xl flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="포켓몬 이름을 입력하세요..."
          disabled={disabled}
          className="rounded-full h-11 text-base md:text-sm"
          autoComplete="off"
        />
        <Button
          type="submit"
          variant="pokedex"
          size="icon"
          disabled={disabled || !input.trim()}
          className="rounded-full shrink-0 size-11"
        >
          <Send className="size-5" />
        </Button>
      </div>
    </form>
  );
}

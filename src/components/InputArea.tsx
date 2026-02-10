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
    <form onSubmit={handleSubmit} className="border-t bg-background px-4 py-3 pb-6">
      <div className="mx-auto max-w-2xl relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="포켓몬 이름을 입력하세요..."
          disabled={disabled}
          className="rounded-full h-14 pl-6 pr-14 text-lg shadow-sm border-2 border-gray-200 focus-visible:border-[#EE1515] focus-visible:ring-[#EE1515]/20 transition-all bg-white"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-2 bottom-2 aspect-square h-auto w-auto rounded-full bg-[#EE1515] hover:bg-[#D00000] text-white shadow-md disabled:opacity-50 transition-all active:scale-95"
        >
          <Send className="size-5 ml-0.5" />
        </Button>
      </div>
    </form>
  );
}

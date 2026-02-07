import { useState, type FormEvent, type KeyboardEvent } from 'react';

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
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white px-4 py-3"
    >
      <div className="max-w-2xl mx-auto flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="포켓몬 이름을 입력하세요..."
          disabled={disabled}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pokedex-red focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-pokedex-red hover:bg-pokedex-darkred text-white font-medium px-5 py-2.5 rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </div>
    </form>
  );
}

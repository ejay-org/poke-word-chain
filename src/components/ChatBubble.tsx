import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="size-8 shrink-0 mt-1 mr-2 rounded-full bg-pokedex-red text-white flex items-center justify-center text-sm font-bold">
          P
        </div>
      )}

      <div className="max-w-[75%]">
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-pokedex-red text-white rounded-br-md'
              : 'bg-card text-card-foreground rounded-bl-md shadow-sm border'
          )}
        >
          {message.text}
        </div>

        {message.pokemonImageUrl && (
          <div className={cn('mt-1.5', isUser && 'flex justify-end')}>
            <img
              src={message.pokemonImageUrl}
              alt={message.pokemonName || '포켓몬'}
              className="size-16 object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {isUser && (
        <div className="size-8 shrink-0 mt-1 ml-2 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
          나
        </div>
      )}
    </div>
  );
}

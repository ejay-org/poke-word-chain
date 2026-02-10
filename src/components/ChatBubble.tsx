import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
  onRestart?: () => void;
  onImageLoad?: () => void;
}

export default function ChatBubble({ message, onRestart, onImageLoad }: ChatBubbleProps) {
  const isUser = message.sender === 'user';
  const [showAnswer, setShowAnswer] = useState(false);

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

          {message.hintAnswer && (
            <div className="mt-3 pt-2 border-t border-border/50">
              {!showAnswer ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAnswer(true)}
                  className="h-7 text-xs w-full bg-secondary/50 hover:bg-secondary"
                >
                  <Eye className="size-3 mr-1.5" />
                  정답 보기
                </Button>
              ) : (
                <div className="text-xs font-bold text-primary animate-in fade-in slide-in-from-top-1">
                  💡 정답: {message.hintAnswer}
                </div>
              )}
            </div>
          )}
        </div>

        {message.pokemonImageUrl && (
          <div className={cn('mt-1.5', isUser && 'flex justify-end')}>
            <img
              src={message.pokemonImageUrl}
              alt={message.pokemonName || '포켓몬'}
              className="size-32 object-contain"
              loading="lazy"
              onLoad={onImageLoad}
            />
          </div>
        )}

        {message.isGameEnd && onRestart && (
          <div className="mt-3 flex justify-center animate-in zoom-in-95 fade-in duration-300">
            <Button onClick={onRestart} className="w-full shadow-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              <RotateCcw className="mr-2 size-4" />
              다시 하기
            </Button>
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

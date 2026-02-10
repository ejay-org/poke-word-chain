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
    <div className={cn('flex mb-4 items-end', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="size-10 shrink-0 mr-3 rounded-full bg-[#EE1515] border-2 border-white shadow-md flex items-center justify-center text-white font-bold relative overflow-hidden">
          {/* Pokeball line effect */}
          <div className="absolute inset-x-0 top-[45%] h-[10%] bg-[#222224]"></div>
          <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] bg-white rounded-full border-2 border-[#222224] z-10"></div>
        </div>
      )}

      <div className={cn("max-w-[75%] flex flex-col", isUser && "items-end")}>
        <div
          className={cn(
            'px-5 py-3 rounded-2xl text-[15px] leading-relaxed relative shadow-md',
            isUser
              ? 'bg-[#EE1515] text-white rounded-br-none'
              : 'bg-white text-[#222224] rounded-bl-none border border-gray-200'
          )}
        >
          {message.text}

          {message.hintAnswer && (
            <div className="mt-3 pt-2 border-t border-black/10">
              {!showAnswer ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnswer(true)}
                  className="h-auto py-1 px-2 text-xs w-full hover:bg-black/5 text-[#EE1515]"
                >
                  <Eye className="size-3 mr-1.5" />
                  정답 보기
                </Button>
              ) : (
                <div className="text-xs font-bold text-[#EE1515] animate-in fade-in slide-in-from-top-1">
                  💡 정답: {message.hintAnswer}
                </div>
              )}
            </div>
          )}
        </div>

        {message.pokemonImageUrl && (
          <div className="mt-2 inline-block">
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
          <div className="mt-3 flex justify-center animate-in zoom-in-95 fade-in duration-300 w-full">
            <Button onClick={onRestart} className="shadow-lg bg-[#EE1515] hover:bg-[#D00000] text-white font-bold rounded-full px-6 border-2 border-white ring-2 ring-[#EE1515]/20">
              <RotateCcw className="mr-2 size-4" />
              다시 하기
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="size-10 shrink-0 ml-3 rounded-full bg-[#222224] flex items-center justify-center text-white font-bold shadow-sm">
          나
        </div>
      )}
    </div>
  );
}

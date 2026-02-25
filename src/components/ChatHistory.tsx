import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatMessage } from '@/types';
import ChatBubble from './ChatBubble';

interface ChatHistoryProps {
  messages: ChatMessage[];
  onRestart?: () => void;
}

export default function ChatHistory({ messages, onRestart }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-5 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[55vh] text-center gap-3">
            {/* Pokeball illustration */}
            <div className="size-20 rounded-full bg-card border border-primary/15 shadow-sm flex items-center justify-center">
              <span className="text-4xl">⚡</span>
            </div>
            <div>
              <p className="font-bold text-foreground/70 text-sm">포켓몬 끝말잇기 시작!</p>
              <p className="text-xs text-muted-foreground mt-1">아래 버튼으로 게임을 시작해보세요</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onRestart={onRestart}
              onImageLoad={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            />
          ))
        )}
        {/* Scroll target */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
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
      <div className="px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageCircle className="size-10 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium">포켓몬 이름을 입력해 게임을 시작하세요!</p>
            <p className="text-xs mt-1">예: 피카츄, 이상해씨, 파이리 ...</p>
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
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

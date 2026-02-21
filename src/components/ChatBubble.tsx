import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { RotateCcw, Eye } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
  onRestart?: () => void;
  onImageLoad?: () => void;
}

export default function ChatBubble({ message, onRestart, onImageLoad }: ChatBubbleProps) {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  const [showAnswer, setShowAnswer] = useState(false);

  // System messages
  if (isSystem) {
    const isAnswer = message.text.startsWith('✅');
    const isHint = message.hintAnswer && !isAnswer;

    if (isAnswer) {
      // 정답 공개 — 눈에 띄는 카드 스타일
      return (
        <div className="flex justify-center my-3 px-4">
          <div className="w-full bg-card border-2 border-primary rounded-2xl px-4 py-3 text-center shadow-md shadow-primary/10 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-[10px] font-bold tracking-widest text-primary/60 uppercase mb-1">정답 공개</p>
            <p className="text-xl font-black text-primary">{message.hintAnswer ?? message.text.replace('✅ 정답: ', '')}</p>
          </div>
        </div>
      );
    }

    if (isHint) {
      // 힌트 메시지 — 설명 + 숨겨진 정답
      return (
        <div className="flex justify-center my-3 px-4">
          <div className="w-full bg-card border border-primary/20 rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-primary/50 uppercase mb-1">💡 힌트</p>
            <div className="text-sm text-foreground/80 leading-relaxed">
              <span>{message.text.replace('💡 힌트: ', '')}</span>
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="ml-2 font-bold text-primary hover:underline transition-all whitespace-nowrap"
                >
                  정답보기
                </button>
              ) : (
                <span className="ml-2 font-bold text-primary animate-in fade-in zoom-in-95 whitespace-nowrap">
                  {message.hintAnswer}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 일반 시스템 메시지 — 작은 pill
    return (
      <div className="flex justify-center my-3">
        <span className="bg-muted text-muted-foreground text-xs font-medium px-4 py-1.5 rounded-full">
          {message.text}
        </span>
      </div>
    );
  }


  return (
    <div className={cn('flex mb-5 items-start gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row')}>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        {!isUser ? (
          <div className="size-10 rounded-full bg-card border border-primary/20 shadow-sm overflow-hidden flex items-center justify-center">
            {/* Robot icon for AI */}
            <span className="text-xl">🤖</span>
          </div>
        ) : (
          <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-md">
            <span className="text-white text-lg">👤</span>
          </div>
        )}
      </div>

      {/* Bubble content */}
      <div className={cn('flex flex-col gap-1 max-w-[78%]', isUser && 'items-end')}>

        {/* Sender label */}
        <span className={cn(
          'text-[10px] font-bold tracking-widest uppercase px-1',
          isUser ? 'text-primary text-right' : 'text-primary/60'
        )}>
          {isUser ? 'YOU' : 'POKEBOT'}
        </span>

        {/* Pokemon card bubble */}
        {message.pokemonImageUrl ? (
          <div
            className={cn(
              'rounded-3xl overflow-hidden shadow-md',
              isUser
                ? 'bg-primary rounded-tr-sm'
                : 'bg-card border border-primary/15 rounded-tl-sm'
            )}
          >
            {/* Pokemon name header */}
            <div className="px-4 pt-3 pb-1">
              <span className={cn(
                'text-lg font-bold',
                isUser ? 'text-white' : 'text-foreground'
              )}>
                {message.pokemonName ?? message.text}
              </span>
            </div>
            {/* Pokemon image area */}
            <div className={cn(
              'mx-3 mb-3 rounded-2xl overflow-hidden flex items-center justify-center',
              isUser ? 'bg-card/20' : 'bg-[#2d2d3a]'
            )} style={{ minHeight: '160px' }}>
              <img
                src={message.pokemonImageUrl}
                alt={message.pokemonName || '포켓몬'}
                className="w-36 h-36 object-contain drop-shadow-xl"
                loading="lazy"
                onLoad={onImageLoad}
              />
            </div>
          </div>
        ) : (
          /* Plain text bubble */
          <div
            className={cn(
              'px-4 py-3 rounded-3xl text-sm leading-relaxed shadow-sm',
              isUser
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-card text-foreground border border-primary/15 rounded-tl-sm'
            )}
          >
            {message.text}

            {/* Hint reveal */}
            {message.hintAnswer && (
              <div className="mt-2 pt-2 border-t border-primary/20">
                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary/70 hover:text-primary transition-colors"
                  >
                    <Eye className="size-3" />
                    정답 보기
                  </button>
                ) : (
                  <p className="text-xs font-bold text-primary animate-in fade-in slide-in-from-top-1">
                    💡 정답: {message.hintAnswer}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Restart button */}
        {message.isGameEnd && onRestart && (
          <div className="mt-2 flex justify-center w-full animate-in zoom-in-95 fade-in duration-300">
            <button
              onClick={onRestart}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
            >
              <RotateCcw className="size-4" />
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

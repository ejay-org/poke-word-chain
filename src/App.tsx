import { useRef, useEffect } from 'react';
import Header from '@/components/Header';
import ChatHistory from '@/components/ChatHistory';
import InputArea from '@/components/InputArea';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw, Lightbulb } from 'lucide-react';

function App() {
  const {
    messages,
    status,
    currentTurn,
    startGame,
    submitUserWord,
    giveHint,
    resetGame
  } = useGame();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    // ChatHistory handles internal scrolling, but we might want to ensure focus or layout stability?
    // ChatHistory component already has scroll logic.
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col mx-auto w-full max-w-2xl overflow-hidden relative">
        <ChatHistory messages={messages} />

        {/* Game Overlay for Idle/Ended states */}
        {status === 'idle' && (
          <div className="absolute inset-x-0 bottom-0 top-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
            <div className="bg-card p-8 rounded-2xl shadow-lg border text-center max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-4 text-primary">포켓몬 끝말잇기</h2>
              <p className="text-muted-foreground mb-6">
                AI 포켓몬 마스터와 대결하세요!
                <br />
                끝말잇기 규칙과 두음법칙이 적용됩니다.
              </p>
              <Button onClick={startGame} size="lg" className="w-full text-lg h-12">
                <PlayCircle className="mr-2 size-5" />
                게임 시작
              </Button>
            </div>
          </div>
        )}

        {(status === 'won' || status === 'lost') && (
          <div className="absolute inset-x-0 bottom-24 p-4 z-10 flex justify-center animate-in slide-in-from-bottom-5 fade-in">
            <div className="bg-card px-6 py-4 rounded-full shadow-xl border flex gap-4 items-center">
              <span className="font-bold text-lg">
                {status === 'won' ? '🎉 승리!' : '💀 패배...'}
              </span>
              <Button onClick={startGame} variant="default" size="sm">
                <RotateCcw className="mr-2 size-4" />
                다시 하기
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 border-t bg-background space-y-2">
          {/* Action Bar for Hints/Reset during game */}
          {status === 'playing' && (
            <div className="flex justify-end gap-2 px-2">
              <Button variant="ghost" size="sm" onClick={giveHint} className="text-muted-foreground hover:text-primary">
                <Lightbulb className="mr-1 size-4" /> 힌트
              </Button>
              <Button variant="ghost" size="sm" onClick={resetGame} className="text-muted-foreground hover:text-destructive">
                <RotateCcw className="mr-1 size-4" /> 초기화
              </Button>
            </div>
          )}

          <InputArea
            onSubmit={submitUserWord}
            disabled={status !== 'playing' || currentTurn !== 'user'}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

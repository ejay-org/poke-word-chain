import { useEffect } from 'react';
import Header from '@/components/Header';
import ChatHistory from '@/components/ChatHistory';
import InputArea from '@/components/InputArea';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw, Lightbulb } from 'lucide-react';

export default function GamePage() {
    const {
        messages,
        status,
        currentTurn,
        startGame,
        submitUserWord,
        giveHint,
        resetGame
    } = useGame();

    // Auto-scroll to bottom of chat
    useEffect(() => {
        // ChatHistory handles internal scrolling
    }, [messages]);

    return (
        <div className="h-[100dvh] flex flex-col bg-background">
            <div className="relative">
                <Header />
            </div>

            <main className="flex-1 flex flex-col mx-auto w-full max-w-2xl overflow-hidden relative">
                <ChatHistory messages={messages} onRestart={resetGame} />

                {/* Game Overlay for Idle/Ended states */}
                {status === 'idle' && (
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
                        <div className="bg-card p-8 rounded-2xl shadow-lg border text-center max-w-sm w-full">
                            <h2 className="text-2xl font-bold mb-4 text-primary">Poke Word Chain</h2>
                            <p className="text-muted-foreground mb-6">
                                AI 포켓몬 마스터와 대결하세요!
                                <br />
                                끝말잇기 규칙과 두음법칙이 적용됩니다.
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                                <Button onClick={() => startGame('ai')} size="lg" className="w-full text-lg h-14 relative overflow-hidden group bg-[#EE1515] hover:bg-[#D00000] text-white shadow-md border-2 border-white ring-2 ring-[#EE1515]/20">
                                    <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-opacity"></span>
                                    <PlayCircle className="mr-2 size-5" />
                                    AI 모드 시작 (페르소나)
                                </Button>
                                <Button onClick={() => startGame('normal')} variant="outline" size="lg" className="w-full text-lg h-14 border-2 border-gray-200 hover:bg-gray-50 text-[#222224]">
                                    <PlayCircle className="mr-2 size-5" />
                                    일반 모드 시작 (빠름)
                                </Button>
                            </div>
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

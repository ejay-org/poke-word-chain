import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Trophy, Clock, Lightbulb, PlayCircle, Eye } from 'lucide-react';
import ChatHistory from '@/components/ChatHistory';
import InputArea from '@/components/InputArea';
import BottomNav from '@/components/BottomNav';
import { useGame } from '@/hooks/useGame';

export default function GamePage() {
    const navigate = useNavigate();
    const {
        messages,
        status,
        currentTurn,
        startGame,
        submitUserWord,
        giveHint,
        revealAnswer,
        resetGame,
    } = useGame();

    // Compute score from user messages
    const score = messages.filter(m => m.sender === 'user').length;

    return (
        <div className="h-[100dvh] flex flex-col bg-background max-w-sm mx-auto w-full">

            {/* ── Header ── */}
            <header className="bg-background px-4 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="size-10 rounded-full bg-card border border-primary/15 shadow-sm flex items-center justify-center hover:bg-primary/5 active:scale-95 transition-all"
                >
                    <ArrowLeft className="size-4 text-foreground" />
                </button>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-lg font-black text-foreground tracking-tight">Word Chain</h1>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-muted-foreground font-medium">PokeBot Online</span>
                    </div>
                </div>

                {/* Info button */}
                <button
                    onClick={resetGame}
                    title="Reset game"
                    className="size-10 rounded-full bg-card border border-primary/15 shadow-sm flex items-center justify-center hover:bg-primary/5 active:scale-95 transition-all"
                >
                    <Info className="size-4 text-foreground" />
                </button>
            </header>

            {/* ── Chat area ── */}
            <main className="flex-1 overflow-hidden relative">
                <ChatHistory messages={messages} onRestart={resetGame} />

                {/* Idle overlay */}
                {status === 'idle' && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
                        <div className="bg-card w-full rounded-3xl p-7 shadow-[0_20px_60px_rgba(255,166,158,0.2)] border border-primary/15 text-center relative overflow-hidden">
                            {/* Coral accent top-right */}
                            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-bl-full pointer-events-none" />

                            {/* Icon */}
                            <div className="size-18 mx-auto mb-4 relative">
                                <div className="size-16 rounded-full bg-primary mx-auto flex items-center justify-center shadow-lg">
                                    <span className="text-3xl">⚡</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-foreground mb-1">Poke Word Chain</h2>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                AI 포켓몬 마스터와 대결하세요!<br />
                                끝말잇기 규칙과 두음법칙이 적용됩니다.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => startGame('ai')}
                                    className="w-full py-4 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="size-4" />
                                    AI 모드 시작 (페르소나)
                                </button>
                                <button
                                    onClick={() => startGame('normal')}
                                    className="w-full py-3.5 rounded-full bg-card text-foreground font-semibold text-sm border border-primary/20 hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="size-4 text-primary" />
                                    일반 모드 시작 (빠름)
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Thinking indicator — three dots */}
                {status === 'playing' && currentTurn === 'ai' && (
                    <div className="absolute bottom-2 left-4 flex gap-1.5 items-center px-4 py-2 bg-card rounded-full border border-primary/10 shadow-sm">
                        <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}
            </main>

            {/* ── Bottom area ── */}
            {status === 'idle' ? (
                /* idle: 메인 메뉴와 동일한 하단 내비게이션 */
                <BottomNav />
            ) : (
                /* playing/won/lost: 게임 전용 하단 바 */
                <div className="flex-shrink-0 bg-background border-t border-primary/10">
                    {/* Input row */}
                    <div className="px-4 pt-3 pb-2">
                        <InputArea
                            onSubmit={submitUserWord}
                            disabled={status !== 'playing' || currentTurn !== 'user'}
                        />
                    </div>

                    {/* Bottom tab bar — SCORE / RECENT / HINT / 정답 */}
                    <div
                        className="flex items-center justify-around px-4 pb-4 pt-1"
                        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                    >
                        {/* Score */}
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="relative">
                                <Trophy className="size-5 text-primary" />
                                <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-[7px] font-black text-primary">!</span>
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-primary tracking-wide uppercase">
                                Score: {score}
                            </span>
                        </div>

                        {/* Recent */}
                        <button
                            onClick={resetGame}
                            className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity active:scale-95"
                        >
                            <Clock className="size-5 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase">Recent</span>
                        </button>

                        {/* Hint */}
                        <button
                            onClick={giveHint}
                            disabled={status !== 'playing'}
                            className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity active:scale-95 disabled:opacity-30"
                        >
                            <Lightbulb className="size-5 text-primary" />
                            <span className="text-[10px] font-bold text-primary tracking-wide uppercase">Hint</span>
                        </button>

                        {/* 정답 보기 */}
                        <button
                            onClick={revealAnswer}
                            disabled={status !== 'playing'}
                            className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity active:scale-95 disabled:opacity-30"
                        >
                            <Eye className="size-5 text-foreground/60" />
                            <span className="text-[10px] font-bold text-foreground/60 tracking-wide uppercase">정답</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Clock, Lightbulb, PlayCircle, Eye, MessageSquareHeart } from 'lucide-react';
import ChatHistory from '@/components/ChatHistory';
import InputArea from '@/components/InputArea';
import { useGame } from '@/hooks/useGame';
import { useTTS } from '@/hooks/useTTS';

export default function GamePage() {
    const navigate = useNavigate();
    const {
        messages,
        status,
        currentTurn,
        gameMode,
        startGame,
        submitUserWord,
        giveHint,
        revealAnswer,
        resetGame,
    } = useGame();

    const { speak, cancel } = useTTS();

    // Track the last AI message id we've spoken to avoid re-speaking on re-renders
    const lastSpokenId = useRef<string>('');

    // Auto-speak AI messages in conversation mode
    useEffect(() => {
        if (gameMode !== 'conversation') return;
        const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
        if (!lastAiMsg || lastAiMsg.id === lastSpokenId.current) return;
        // Don't speak "thinking" placeholder
        if (lastAiMsg.text.includes('고민 중')) return;

        lastSpokenId.current = lastAiMsg.id;
        // Speak pokemon name only (concise for word-chain game)
        const textToSpeak = lastAiMsg.pokemonName ?? lastAiMsg.text;
        speak(textToSpeak);
    }, [messages, gameMode, speak]);

    // Cancel TTS when game resets or mode changes
    useEffect(() => {
        if (status === 'idle') {
            cancel();
            lastSpokenId.current = '';
        }
    }, [status, cancel]);

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
                    {/* Mode badge */}
                    {status !== 'idle' && (
                        <span className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">
                            {gameMode === 'normal' ? '일반 모드' : gameMode === 'ai' ? 'AI 모드' : '대화 모드 🔊'}
                        </span>
                    )}
                </div>

                {/* Empty placeholder */}
                <div className="size-10" />
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
                                {/* AI Mode */}
                                <button
                                    onClick={() => startGame('ai')}
                                    className="w-full py-4 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="size-4" />
                                    AI 모드
                                    <span className="text-white/70 font-normal text-xs">(페르소나 대사)</span>
                                </button>

                                {/* Conversation Mode */}
                                <button
                                    onClick={() => startGame('conversation')}
                                    className="w-full py-4 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/30 hover:bg-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageSquareHeart className="size-4" />
                                    대화 모드
                                    <span className="text-primary/60 font-normal text-xs">(🎤 음성 입력 · 🔊 음성 출력)</span>
                                </button>

                                {/* Normal Mode */}
                                <button
                                    onClick={() => startGame('normal')}
                                    className="w-full py-3.5 rounded-full bg-card text-foreground font-semibold text-sm border border-primary/20 hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="size-4 text-primary" />
                                    일반 모드
                                    <span className="text-muted-foreground font-normal text-xs">(빠름)</span>
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
            {status !== 'idle' && (
                <div className="flex-shrink-0 bg-background border-t border-primary/10">
                    {/* Input row */}
                    <div className="px-4 pt-3 pb-2">
                        <InputArea
                            onSubmit={submitUserWord}
                            disabled={status !== 'playing' || currentTurn !== 'user'}
                            showVoice={gameMode === 'conversation'}
                        />
                    </div>

                    {/* Bottom tab bar */}
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

                        {/* Recent / Reset */}
                        <button
                            onClick={resetGame}
                            className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity active:scale-95"
                        >
                            <Clock className="size-5 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase">Reset</span>
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

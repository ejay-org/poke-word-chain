import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';

function HintCard({ index, text, isLatest }: { index: number; text: string; isLatest: boolean }) {
    return (
        <div
            className={`bg-card rounded-2xl px-4 py-3 border shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                isLatest ? 'border-primary/60' : 'border-primary/20'
            }`}
        >
            <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-black flex items-center justify-center mt-0.5">
                    {index}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

export default function QuizPage() {
    const navigate = useNavigate();
    const {
        status,
        currentPokemon,
        revealedHints,
        revealedCount,
        hintsTotal,
        fromFallback,
        startQuiz,
        submitGuess,
        skipToNextHint,
        resetQuiz,
    } = useQuiz();

    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const hintsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (status === 'playing') {
            hintsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
        }
    }, [revealedCount, status]);

    function handleSubmit() {
        if (!inputValue.trim()) return;
        submitGuess(inputValue);
        setInputValue('');
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            handleSubmit();
        }
    }

    return (
        <div className="h-[100dvh] flex flex-col bg-background dot-pattern max-w-sm mx-auto w-full">

            {/* ── Header ── */}
            <header className="bg-background px-4 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
                <button
                    onClick={() => navigate('/')}
                    className="size-10 rounded-full bg-card border border-primary/15 shadow-sm flex items-center justify-center hover:bg-primary/5 active:scale-95 transition-all"
                >
                    <ArrowLeft className="size-4 text-foreground" />
                </button>

                <div className="text-center">
                    <h1 className="text-lg font-black text-foreground tracking-tight">Pokemon Quiz</h1>
                    {status === 'playing' && (
                        <span className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">
                            힌트 {revealedCount} / {hintsTotal}
                        </span>
                    )}
                </div>

                <div className="size-10 flex items-center justify-center">
                    <HelpCircle className="size-5 text-primary/40" />
                </div>
            </header>

            {/* ── Main ── */}
            <main className="flex-1 overflow-hidden relative">

                {/* Loading overlay */}
                {status === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
                        <div className="bg-card rounded-3xl p-8 shadow-[0_20px_60px_rgba(255,166,158,0.2)] border border-primary/15 text-center w-full">
                            <div className="flex justify-center gap-2 mb-4">
                                <span className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                                <span className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                                <span className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                            </div>
                            <p className="text-sm font-bold text-muted-foreground">포켓몬을 고르는 중...</p>
                        </div>
                    </div>
                )}

                {/* Success overlay */}
                {status === 'success' && currentPokemon && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-6 z-10">
                        <div className="bg-card rounded-3xl p-7 shadow-[0_20px_60px_rgba(255,166,158,0.2)] border border-primary/15 text-center w-full">
                            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
                                <span className="text-3xl">🏆</span>
                            </div>
                            <h2 className="text-2xl font-black text-primary mb-1">정답!</h2>
                            <p className="text-xs text-muted-foreground mb-3">
                                힌트 {revealedCount}개 만에 맞혔어요!
                            </p>
                            <img
                                src={currentPokemon.imageUrl}
                                alt={currentPokemon.name}
                                className="w-36 h-36 object-contain drop-shadow-2xl mx-auto mb-3"
                            />
                            <p className="text-xl font-black text-foreground">{currentPokemon.name}</p>
                            <p className="text-sm text-muted-foreground mb-1">
                                #{String(currentPokemon.id).padStart(3, '0')} · {currentPokemon.nameEn}
                            </p>
                            <div className="flex flex-col gap-3 mt-5">
                                <button
                                    onClick={() => { resetQuiz(); startQuiz(); }}
                                    className="w-full py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all"
                                >
                                    다시 도전
                                </button>
                                <button
                                    onClick={() => navigate(`/pokecard/${currentPokemon.id}`)}
                                    className="text-sm text-primary font-bold underline underline-offset-2"
                                >
                                    포켓몬 카드 보기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Failure overlay */}
                {status === 'failure' && currentPokemon && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-6 z-10">
                        <div className="bg-card rounded-3xl p-7 shadow-[0_20px_60px_rgba(255,166,158,0.2)] border border-primary/15 text-center w-full">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                <span className="text-3xl">😔</span>
                            </div>
                            <h2 className="text-2xl font-black text-foreground/70 mb-1">아쉽네요...</h2>
                            <p className="text-xs text-muted-foreground mb-3">정답은 바로</p>
                            <img
                                src={currentPokemon.imageUrl}
                                alt={currentPokemon.name}
                                className="w-36 h-36 object-contain drop-shadow-2xl mx-auto mb-3"
                            />
                            <p className="text-xl font-black text-primary">{currentPokemon.name}</p>
                            <p className="text-sm text-muted-foreground mb-1">
                                #{String(currentPokemon.id).padStart(3, '0')} · {currentPokemon.nameEn}
                            </p>
                            <div className="flex flex-col gap-3 mt-5">
                                <button
                                    onClick={() => { resetQuiz(); startQuiz(); }}
                                    className="w-full py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all"
                                >
                                    다시 도전
                                </button>
                                <button
                                    onClick={() => navigate(`/pokecard/${currentPokemon.id}`)}
                                    className="text-sm text-primary font-bold underline underline-offset-2"
                                >
                                    포켓몬 카드 보기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hints scroll area */}
                {status === 'playing' && (
                    <div className="h-full overflow-y-auto px-4 py-5">
                        {fromFallback && (
                            <div className="flex justify-center mb-3">
                                <span className="bg-muted text-muted-foreground text-xs rounded-full px-3 py-1 font-medium">
                                    오프라인 힌트
                                </span>
                            </div>
                        )}
                        <div className="space-y-3 pb-4">
                            {revealedHints.map((hint, i) => (
                                <HintCard
                                    key={i}
                                    index={i + 1}
                                    text={hint}
                                    isLatest={i === revealedCount - 1}
                                />
                            ))}
                        </div>
                        <div ref={hintsEndRef} />
                    </div>
                )}
            </main>

            {/* ── Bottom input bar ── */}
            {status === 'playing' && (
                <div className="flex-shrink-0 bg-background border-t border-primary/10 px-4 py-3 space-y-2">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="포켓몬 이름을 입력하세요..."
                            className="flex-1 bg-card rounded-full border border-primary/15 shadow-sm h-12 pl-5 pr-3 text-sm outline-none focus:border-primary/40 transition-colors"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!inputValue.trim()}
                            className="h-12 px-5 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/30 active:scale-95 transition-all disabled:opacity-40"
                        >
                            제출
                        </button>
                    </div>
                    <button
                        onClick={skipToNextHint}
                        className="w-full py-2.5 rounded-full bg-card border border-primary/20 text-primary font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                        {revealedCount < hintsTotal ? (
                            <>
                                다음 힌트 보기
                                <span className="text-muted-foreground font-normal">({revealedCount} / {hintsTotal})</span>
                                <ChevronRight className="size-4" />
                            </>
                        ) : (
                            '포기하기 (정답 확인)'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

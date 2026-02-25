import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Puzzle } from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center bg-background dot-pattern pb-24 overflow-x-hidden">
            <div className="w-full max-w-sm mx-auto flex flex-col items-center px-5 pt-8 gap-6">

                {/* Mascot Section */}
                <div className="flex flex-col items-center gap-3 w-full">
                    {/* Mascot card */}
                    <div className="bg-card rounded-3xl shadow-[0_8px_32px_rgba(255,166,158,0.18)] p-6 w-48 h-48 flex items-center justify-center border border-primary/10">
                        <div className="relative">
                            <div className="w-28 h-28 relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary to-primary/70 shadow-lg" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                    <div className="flex gap-3 mt-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-foreground/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-foreground/80" />
                                    </div>
                                    <div className="w-1.5 h-1 rounded-full bg-foreground/40 mt-0.5" />
                                    <div className="w-5 h-2.5 border-b-2 border-foreground/50 rounded-b-full mt-0.5" />
                                </div>
                                <div className="absolute -top-1.5 left-3 w-4 h-4 rounded-full bg-primary/80" />
                                <div className="absolute -top-1.5 right-3 w-4 h-4 rounded-full bg-primary/80" />
                            </div>
                        </div>
                    </div>

                    {/* Speech bubble */}
                    <div className="relative bg-card rounded-3xl px-6 py-3 shadow-[0_4px_16px_rgba(255,166,158,0.15)] border border-primary/10">
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-card" />
                        <div className="text-center">
                            <p className="text-lg font-bold text-foreground/80">Hello, Trainer!</p>
                            <p className="text-sm font-semibold text-primary">Let's play together!</p>
                        </div>
                    </div>
                </div>

                {/* Menu Cards — 같은 높이로 고정 */}
                <div className="flex flex-col gap-4 w-full">

                    {/* Pokedex Card */}
                    <button
                        onClick={() => navigate('/pokedex')}
                        className="group bg-primary rounded-3xl p-1 shadow-[0_8px_0_rgba(255,130,120,0.4)] active:shadow-[0_2px_0_rgba(255,130,120,0.4)] active:translate-y-[6px] transition-all duration-150 w-full"
                    >
                        <div className="bg-primary/90 rounded-[1.4rem] px-5 py-0 flex items-center gap-4 h-24">
                            {/* Icon circle */}
                            <div className="w-14 h-14 rounded-full bg-card/30 flex items-center justify-center flex-shrink-0 border-2 border-card/20">
                                <BookOpen className="size-6 text-card" strokeWidth={1.5} />
                            </div>
                            {/* Text */}
                            <div className="flex-1 text-left">
                                <p className="text-xl font-bold text-card">Pokedex</p>
                                <p className="text-xs font-bold text-card/70 tracking-widest uppercase">Dictionary</p>
                            </div>
                            <ChevronRight className="size-5 text-card/70 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>

                    {/* Word Chain Card */}
                    <button
                        onClick={() => navigate('/game')}
                        className="group bg-card rounded-3xl p-1 shadow-[0_8px_0_rgba(255,166,158,0.3)] active:shadow-[0_2px_0_rgba(255,166,158,0.3)] active:translate-y-[6px] transition-all duration-150 w-full border border-primary/20"
                    >
                        <div className="bg-card rounded-[1.4rem] px-5 py-0 flex items-center gap-4 h-24">
                            {/* Icon circle */}
                            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
                                <Puzzle className="size-6 text-card" strokeWidth={1.5} />
                            </div>
                            {/* Text */}
                            <div className="flex-1 text-left">
                                <p className="text-xl font-bold text-foreground">Word Chain</p>
                                <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-0.5">Game Time</p>
                            </div>
                            <ChevronRight className="size-5 text-primary/60 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

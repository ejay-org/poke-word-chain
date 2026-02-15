import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-12 p-6 overflow-hidden relative">
            {/* Background Decoration (Optional) */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

            <div className="text-center space-y-2 relative z-10 transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-[#EE1515] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)]">
                    Poke<br />World
                </h1>
            </div>

            <div className="grid gap-6 w-full max-w-sm relative z-10">
                <Button
                    size="lg"
                    className="h-24 text-xl rounded-full bg-[#EE1515] hover:bg-[#D00000] text-white shadow-[0_6px_0_#8B0000] active:shadow-none active:translate-y-[6px] transition-all border-4 border-white ring-4 ring-black/10 relative overflow-hidden group"
                    onClick={() => navigate('/game')}
                >
                    {/* Pokeball decorative line */}
                    <div className="absolute inset-x-0 top-1/2 h-1 bg-black/20 -translate-y-1/2 pointer-events-none group-hover:h-2 transition-all"></div>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 size-8 bg-white rounded-full border-4 border-[#EE1515] group-hover:border-[#D00000] z-10"></div>

                    <span className="ml-8 font-bold">게임 시작</span>
                </Button>

                <Button
                    variant="secondary"
                    size="lg"
                    className="h-20 text-xl rounded-full bg-white hover:bg-gray-50 text-[#EE1515] shadow-[0_6px_0_#94A3B8] active:shadow-none active:translate-y-[6px] transition-all border-4 border-[#EE1515]"
                    onClick={() => navigate('/pokedex')}
                >
                    <BookOpen className="mr-3 h-8 w-8" />
                    포켓몬 도감
                </Button>
            </div>

            <footer className="absolute bottom-4 text-sm text-muted-foreground font-medium">
                © 2026 Pokemon Word Chain
            </footer>
        </div>
    );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import pokemonData from '@/data/pokemonData.json';

interface Pokemon {
    id: number;
    name: string;
    nameEn: string;
    generation: number;
    types: string[];
    typesEn: string[];
    abilities: string[];
    description: string;
    imageUrl: string;
    evolvesFromId: number | null;
    evolvesToIds: number[];
}

export default function PokedexPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [cardAnimation, setCardAnimation] = useState('');

    const minSwipeDistance = 50;

    const findPokemonById = (id: number): Pokemon | undefined => {
        return (pokemonData as Pokemon[]).find(p => p.id === id);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        const term = searchTerm.trim().toLowerCase();
        // Try searching by name (KR/EN) or ID
        const result = (pokemonData as Pokemon[]).find(p =>
            p.name === term ||
            p.nameEn.toLowerCase() === term ||
            p.id.toString() === term
        );

        setSearchResult(result || null);
        setHasSearched(true);
        setCardAnimation('animate-in fade-in zoom-in duration-300');
    };

    const selectPokemon = (pokemon: Pokemon, direction: 'left' | 'right' | 'none' = 'none') => {
        setCardAnimation(
            direction === 'left' ? 'animate-in slide-in-from-right fade-in duration-300' :
                direction === 'right' ? 'animate-in slide-in-from-left fade-in duration-300' :
                    'animate-in fade-in zoom-in duration-300'
        );
        setSearchResult(pokemon);
        setSearchTerm(pokemon.name);
    }

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        handleSwipe(distance);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const onMouseMove = () => {
        if (!isDragging) return;
        // Optional: Implement visual drag feedback if needed
    };

    const onMouseUp = (e: React.MouseEvent) => {
        if (!isDragging || startX === null) return;
        setIsDragging(false);
        const distance = startX - e.clientX;
        handleSwipe(distance);
        setStartX(null);
    };

    const onMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setStartX(null);
        }
    };

    const handleSwipe = (distance: number) => {
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goNext();
        } else if (isRightSwipe) {
            goPrev();
        }
    };

    const goPrev = () => {
        if (!searchResult?.evolvesFromId) return;
        const prevPokemon = findPokemonById(searchResult.evolvesFromId);
        if (prevPokemon) {
            selectPokemon(prevPokemon, 'right');
        }
    };

    const goNext = () => {
        // If multiple evolutions, just pick the first one for swipe logic for now
        // A better UI might show multiple options if they exist.
        if (!searchResult?.evolvesToIds || searchResult.evolvesToIds.length === 0) return;
        // Prioritize Eevee-like handling later? For now just take first.
        const nextId = searchResult.evolvesToIds[0];
        const nextPokemon = findPokemonById(nextId);
        if (nextPokemon) {
            selectPokemon(nextPokemon, 'left');
        }
    };

    // Helper to get prev/next for buttons
    const prevPokemon = searchResult?.evolvesFromId ? findPokemonById(searchResult.evolvesFromId) : null;
    // Show multiple next evolutions if available
    const nextPokemons = searchResult?.evolvesToIds
        ? searchResult.evolvesToIds.map(id => findPokemonById(id)).filter((p): p is Pokemon => !!p)
        : [];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center">
            {/* Header */}
            <div className="w-full">
                <Header title="포켓몬 도감" subtitle="포켓몬 정보를 검색해보세요!" />
            </div>

            <div className="w-full flex-1 flex flex-col items-center p-6 pt-4">

                {/* Search Section */}
                <div className="w-full max-w-md mb-4">
                    <form onSubmit={handleSearch} className="relative">
                        <Input
                            type="text"
                            placeholder="포켓몬 이름 또는 번호..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-full h-14 pl-6 pr-14 text-lg shadow-sm border-2 border-border focus-visible:border-[#EE1515] focus-visible:ring-[#EE1515]/20 transition-all bg-white"
                        />
                        <Button type="submit" className="absolute right-2 top-2 bottom-2 aspect-square h-auto w-auto rounded-full bg-[#EE1515] hover:bg-[#D00000] text-white shadow-md transition-all active:scale-95">
                            <Search className="size-5" />
                        </Button>
                    </form>
                </div>

                {/* Result Section */}
                <div className="w-full max-w-md flex-1 flex flex-col items-center justify-start pb-10">
                    {searchResult ? (
                        <>
                            <div
                                className={`w-full bg-white text-card-foreground border-4 border-[#EE1515] shadow-[0_8px_16px_rgba(238,21,21,0.15)] rounded-[2rem] overflow-hidden relative touch-pan-y ${cardAnimation} select-none cursor-grab active:cursor-grabbing`}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                onMouseLeave={onMouseLeave}
                            >
                                {/* Decorative background circle */}
                                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#EE1515]/10 to-transparent rounded-t-[2rem]"></div>

                                {/* Evolution Navigation Hints - REMOVED BUTTONS, NOW SWIPE ONLY */}

                                {/* Card Header: Name & ID */}
                                <div className="p-6 pb-0 flex justify-between items-start relative z-10">
                                    <div>
                                        <span className="text-lg font-bold text-[#EE1515]/60">#{String(searchResult.id).padStart(3, '0')}</span>
                                        <h2 className="text-3xl font-extrabold text-[#EE1515] mt-1">{searchResult.name}</h2>
                                        <p className="text-sm text-muted-foreground capitalize font-medium">{searchResult.nameEn}</p>
                                    </div>
                                </div>

                                {/* Card Body: Image */}
                                <div className="p-8 pb-4 flex justify-center relative z-10">
                                    <img
                                        src={searchResult.imageUrl}
                                        alt={searchResult.name}
                                        className="w-56 h-56 object-contain drop-shadow-xl hover:scale-110 transition-transform duration-300 filter"
                                    />
                                </div>

                                {/* Card Footer: Info */}
                                <div className="p-6 pt-0 space-y-6 relative z-10">
                                    {/* Types */}
                                    <div className="flex gap-2 justify-center">
                                        {searchResult.types.map((type, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-1.5 rounded-full text-base font-bold bg-[#EE1515] text-white shadow-sm border border-[#D00000]"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-gray-200">
                                        <p className="text-base leading-relaxed text-center text-[#222224] font-medium break-keep">
                                            {searchResult.description}
                                        </p>
                                    </div>

                                    {/* Extra Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                        <div className="bg-red-50 p-3 rounded-2xl text-center border border-red-100">
                                            <span className="text-[#EE1515] font-bold block mb-1">세대</span>
                                            <span className="font-medium text-[#222224]">{searchResult.generation}세대</span>
                                        </div>
                                        <div className="bg-red-50 p-3 rounded-2xl text-center border border-red-100">
                                            <span className="text-[#EE1515] font-bold block mb-1">특성</span>
                                            <span className="font-medium text-[#222224]">{searchResult.abilities.join(', ')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Evolution Chain Display (Below card) */}
                            {(prevPokemon || nextPokemons.length > 0) && (
                                <div className="w-full mt-6 animate-in fade-in slide-in-from-bottom-2">
                                    <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider text-center">진화 정보</h3>
                                    <div className="flex justify-center items-center gap-2">
                                        {/* Prev */}
                                        {prevPokemon && (
                                            <div
                                                className="flex flex-col items-center opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                                                onClick={() => selectPokemon(prevPokemon, 'right')}
                                            >
                                                <div className="w-16 h-16 bg-white rounded-full border-2 border-border shadow-sm flex items-center justify-center p-2 mb-1">
                                                    <img src={prevPokemon.imageUrl} alt={prevPokemon.name} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-xs font-medium">{prevPokemon.name}</span>
                                            </div>
                                        )}

                                        {/* Current Arrow (if has prev) */}
                                        {prevPokemon && <ChevronRight className="text-muted-foreground/30" />}

                                        {/* Current */}
                                        <div className="flex flex-col items-center scale-110 font-bold text-[#EE1515]">
                                            <div className="w-20 h-20 bg-white rounded-full border-4 border-[#EE1515] shadow-md flex items-center justify-center p-2 mb-1">
                                                <img src={searchResult.imageUrl} alt={searchResult.name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-xs">{searchResult.name}</span>
                                        </div>

                                        {/* Next Arrow (if has next) */}
                                        {nextPokemons.length > 0 && <ChevronRight className="text-muted-foreground/30" />}

                                        {/* Next(s) */}
                                        {nextPokemons.map(p => (
                                            <div
                                                key={p.id}
                                                className="flex flex-col items-center opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                                                onClick={() => selectPokemon(p, 'left')}
                                            >
                                                <div className="w-16 h-16 bg-white rounded-full border-2 border-border shadow-sm flex items-center justify-center p-2 mb-1">
                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-xs font-medium">{p.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : hasSearched ? (
                        <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-8xl mb-6 opacity-30">❓</div>
                            <h3 className="text-2xl font-bold text-[#EE1515] mb-3">포켓몬을 찾을 수 없습니다</h3>
                            <p className="text-muted-foreground text-lg">
                                이름을 다시 확인해주세요!<br />
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-20 opacity-50">
                            <div className="text-8xl mb-6 grayscale opacity-30">🔍</div>
                            <p className="text-xl font-bold text-[#EE1515]">
                                궁금한 포켓몬을<br />
                                검색해보세요!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

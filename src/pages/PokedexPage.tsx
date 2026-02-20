import { useState, useRef } from 'react';
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

/** Build the full linear evolution chain from root to last. */
function buildChain(current: Pokemon, all: Pokemon[]): Pokemon[] {
    const chain: Pokemon[] = [];
    const visited = new Set<number>();

    // Walk backwards to root
    let node: Pokemon | undefined = current;
    while (node && !visited.has(node.id)) {
        visited.add(node.id);
        chain.unshift(node);
        node = node.evolvesFromId ? all.find(p => p.id === node!.evolvesFromId) : undefined;
    }

    // Walk forwards
    const addNext = (p: Pokemon) => {
        if (!p.evolvesToIds || p.evolvesToIds.length === 0) return;
        const next = all.find(x => x.id === p.evolvesToIds[0]);
        if (next && !visited.has(next.id)) {
            visited.add(next.id);
            chain.push(next);
            addNext(next);
        }
    };
    addNext(chain[chain.length - 1]);

    return chain;
}

/** Compact card optimised for mobile screens */
function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
    return (
        <div className="w-full bg-white rounded-[1.5rem] border-4 border-[#EE1515] shadow-[0_8px_24px_rgba(238,21,21,0.18)] overflow-hidden flex flex-col select-none relative">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#EE1515]/10 to-transparent rounded-t-[1.5rem] pointer-events-none" />

            {/* Name row */}
            <div className="px-4 pt-4 pb-0 flex items-center gap-3 relative z-10">
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#EE1515]/50 block">
                        #{String(pokemon.id).padStart(3, '0')}
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#EE1515] leading-tight truncate">
                        {pokemon.name}
                    </h2>
                    <p className="text-xs text-muted-foreground capitalize font-medium">
                        {pokemon.nameEn}
                    </p>
                </div>
                {/* Types — stacked vertically on the right */}
                <div className="flex flex-col gap-1 items-end">
                    {pokemon.types.map((type, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#EE1515] text-white border border-[#D00000]"
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            {/* Image — responsive height */}
            <div className="flex justify-center py-2 relative z-10">
                <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="w-36 h-36 object-contain drop-shadow-xl"
                    draggable={false}
                />
            </div>

            {/* Description */}
            <div className="mx-4 mb-3 bg-[#F8F9FA] px-4 py-3 rounded-2xl border border-gray-200 z-10">
                <p className="text-xs leading-relaxed text-center text-[#222224] font-medium break-keep line-clamp-4">
                    {pokemon.description}
                </p>
            </div>

            {/* Info row */}
            <div className="grid grid-cols-2 gap-2 px-4 pb-4 text-xs z-10">
                <div className="bg-red-50 py-2 rounded-xl text-center border border-red-100">
                    <span className="text-[#EE1515] font-bold block text-xs">세대</span>
                    <span className="font-medium text-[#222224]">{pokemon.generation}세대</span>
                </div>
                <div className="bg-red-50 py-2 rounded-xl text-center border border-red-100">
                    <span className="text-[#EE1515] font-bold block text-xs">특성</span>
                    <span className="font-medium text-[#222224] leading-tight">
                        {pokemon.abilities.join(', ')}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function PokedexPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [chain, setChain] = useState<Pokemon[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Drag / swipe state
    const dragStartX = useRef<number | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const isDragging = useRef(false);
    const wasDragged = useRef(false);
    const MIN_SWIPE = 50;

    const allPokemon = pokemonData as Pokemon[];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        const term = searchTerm.trim().toLowerCase();
        const result = allPokemon.find(p =>
            p.name === term ||
            p.nameEn.toLowerCase() === term ||
            p.id.toString() === term
        );

        if (result) {
            const newChain = buildChain(result, allPokemon);
            const idx = newChain.findIndex(p => p.id === result.id);
            setChain(newChain);
            setCurrentIndex(idx >= 0 ? idx : 0);
        } else {
            setChain([]);
            setCurrentIndex(0);
        }
        setHasSearched(true);
        setDragOffset(0);
    };

    const goTo = (index: number) => {
        if (index < 0 || index >= chain.length) return;
        setCurrentIndex(index);
        setSearchTerm(chain[index].name);
        setDragOffset(0);
    };

    // ── Touch handlers ──────────────────────────────────────────
    const onTouchStart = (e: React.TouchEvent) => {
        dragStartX.current = e.targetTouches[0].clientX;
        isDragging.current = true;
        wasDragged.current = false;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current || dragStartX.current === null) return;
        const delta = e.targetTouches[0].clientX - dragStartX.current;
        if (Math.abs(delta) > 5) wasDragged.current = true;
        const rubber = (currentIndex === 0 && delta > 0) || (currentIndex === chain.length - 1 && delta < 0);
        setDragOffset(rubber ? delta * 0.2 : delta);
    };

    const onTouchEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const offset = dragOffset;
        setDragOffset(0);
        if (offset < -MIN_SWIPE) goTo(currentIndex + 1);
        else if (offset > MIN_SWIPE) goTo(currentIndex - 1);
    };

    // ── Mouse handlers ───────────────────────────────────────────
    const onMouseDown = (e: React.MouseEvent) => {
        dragStartX.current = e.clientX;
        isDragging.current = true;
        wasDragged.current = false;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || dragStartX.current === null) return;
        const delta = e.clientX - dragStartX.current;
        if (Math.abs(delta) > 5) wasDragged.current = true;
        const rubber = (currentIndex === 0 && delta > 0) || (currentIndex === chain.length - 1 && delta < 0);
        setDragOffset(rubber ? delta * 0.2 : delta);
    };

    const onMouseUp = (e: React.MouseEvent) => {
        if (!isDragging.current || dragStartX.current === null) return;
        isDragging.current = false;
        const delta = e.clientX - dragStartX.current;
        dragStartX.current = null;
        setDragOffset(0);
        setTimeout(() => { wasDragged.current = false; }, 50);
        if (delta < -MIN_SWIPE) goTo(currentIndex + 1);
        else if (delta > MIN_SWIPE) goTo(currentIndex - 1);
    };

    const onMouseLeave = () => {
        if (isDragging.current) {
            isDragging.current = false;
            dragStartX.current = null;
            setDragOffset(0);
        }
    };

    const searchResult = chain[currentIndex] ?? null;
    const prevPokemon = currentIndex > 0 ? chain[currentIndex - 1] : null;
    const nextPokemon = currentIndex < chain.length - 1 ? chain[currentIndex + 1] : null;

    // Carousel geometry (px)
    const PEEK = 32;  // how much of the sibling card peeks in
    const GAP = 12;

    const hasEvolution = chain.length > 1;

    return (
        <div
            className="min-h-screen bg-background flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {/* Header */}
            <Header title="포켓몬 도감" subtitle="포켓몬 정보를 검색해보세요!" />

            {/* Body */}
            <div className="flex-1 flex flex-col pt-3">

                {/* Search bar */}
                <div className="px-4 mb-3">
                    <form onSubmit={handleSearch} className="relative">
                        <Input
                            type="text"
                            placeholder="포켓몬 이름 또는 번호…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-full h-12 pl-5 pr-12 text-base shadow-sm border-2 border-border focus-visible:border-[#EE1515] focus-visible:ring-[#EE1515]/20 transition-all bg-white"
                        />
                        <Button
                            type="submit"
                            className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square h-auto w-auto rounded-full bg-[#EE1515] hover:bg-[#D00000] text-white shadow-md transition-all active:scale-95"
                        >
                            <Search className="size-4" />
                        </Button>
                    </form>
                </div>

                {/* ── Results ──────────────────────────────── */}
                {searchResult ? (
                    <div className="flex-1 flex flex-col">
                        {/* Carousel viewport */}
                        <div
                            className="w-full overflow-hidden"
                            onTouchStart={hasEvolution ? onTouchStart : undefined}
                            onTouchMove={hasEvolution ? onTouchMove : undefined}
                            onTouchEnd={hasEvolution ? onTouchEnd : undefined}
                            onMouseDown={hasEvolution ? onMouseDown : undefined}
                            onMouseMove={hasEvolution ? onMouseMove : undefined}
                            onMouseUp={hasEvolution ? onMouseUp : undefined}
                            onMouseLeave={hasEvolution ? onMouseLeave : undefined}
                            style={{ cursor: hasEvolution ? 'grab' : 'default' }}
                        >
                            {/* Track */}
                            <div
                                className="flex items-start"
                                style={{
                                    // Each step = cardWidth + GAP = (viewport - 2*PEEK - GAP) + GAP = viewport - 2*PEEK
                                    // Using CSS calc multiplication: currentIndex * (100% - 2*PEEK)
                                    transform: `translateX(calc(${PEEK}px - ${currentIndex} * (100% - ${PEEK * 2}px) + ${dragOffset}px))`,
                                    transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                                    gap: `${GAP}px`,
                                    userSelect: 'none',
                                    paddingTop: '4px',
                                    paddingBottom: '8px',
                                }}
                            >
                                {chain.map((pokemon, idx) => {
                                    const isActive = idx === currentIndex;
                                    return (
                                        <div
                                            key={pokemon.id}
                                            className="flex-shrink-0"
                                            style={{
                                                width: `calc(100% - ${PEEK * 2}px - ${GAP}px)`,
                                                transition: 'opacity 0.3s, transform 0.3s',
                                                opacity: isActive ? 1 : 0.4,
                                                transform: isActive ? 'scale(1)' : 'scale(0.94)',
                                            }}
                                            onClick={() => { if (!wasDragged.current) goTo(idx); }}
                                        >
                                            <PokemonCard pokemon={pokemon} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Evolution indicators */}
                        {hasEvolution && (
                            <div className="flex flex-col items-center gap-2 pt-1 pb-4 px-4">
                                {/* Chain label row */}
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium flex-wrap justify-center">
                                    {chain.map((p, idx) => (
                                        <div key={p.id} className="flex items-center gap-1.5">
                                            {idx > 0 && (
                                                <ChevronRight className="size-3 text-muted-foreground/30 flex-shrink-0" />
                                            )}
                                            <button
                                                onClick={() => goTo(idx)}
                                                className={`flex items-center gap-1 transition-all rounded-full px-2 py-0.5 ${idx === currentIndex
                                                    ? 'bg-[#EE1515]/10 text-[#EE1515] font-bold'
                                                    : 'opacity-50 hover:opacity-80'
                                                    }`}
                                            >
                                                <img
                                                    src={p.imageUrl}
                                                    alt={p.name}
                                                    className="w-5 h-5 object-contain"
                                                    draggable={false}
                                                />
                                                <span>{p.name}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Dot indicators */}
                                <div className="flex gap-2 items-center">
                                    {chain.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => goTo(idx)}
                                            className={`rounded-full transition-all duration-200 ${idx === currentIndex
                                                ? 'w-5 h-2 bg-[#EE1515]'
                                                : 'w-2 h-2 bg-[#EE1515]/25 hover:bg-[#EE1515]/50'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Swipe hint — only show if there's a prev or next */}
                                {(prevPokemon || nextPokemon) && (
                                    <p className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                                        <span>←</span>
                                        <span>스와이프로 진화 탐색</span>
                                        <span>→</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ) : hasSearched ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-7xl mb-5 opacity-30">❓</div>
                        <h3 className="text-xl font-bold text-[#EE1515] mb-2">포켓몬을 찾을 수 없습니다</h3>
                        <p className="text-muted-foreground">이름을 다시 확인해주세요!</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-10 opacity-50">
                        <div className="text-7xl mb-5 grayscale opacity-30">🔍</div>
                        <p className="text-xl font-bold text-[#EE1515]">
                            궁금한 포켓몬을<br />
                            검색해보세요!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

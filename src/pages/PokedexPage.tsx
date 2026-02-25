import { useState, useMemo } from 'react';
import { Search, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
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

// 한글 타입 필터 목록
const TYPE_FILTERS_KR = [
    { kr: '전체', en: 'All' },
    { kr: '전기', en: 'electric' },
    { kr: '불꽃', en: 'fire' },
    { kr: '물', en: 'water' },
    { kr: '풀', en: 'grass' },
    { kr: '노말', en: 'normal' },
    { kr: '페어리', en: 'fairy' },
    { kr: '비행', en: 'flying' },
    { kr: '독', en: 'poison' },
    { kr: '에스퍼', en: 'psychic' },
    { kr: '벌레', en: 'bug' },
    { kr: '바위', en: 'rock' },
    { kr: '땅', en: 'ground' },
    { kr: '강철', en: 'steel' },
    { kr: '얼음', en: 'ice' },
    { kr: '드래곤', en: 'dragon' },
    { kr: '고스트', en: 'ghost' },
    { kr: '악', en: 'dark' },
    { kr: '격투', en: 'fighting' },
];

// 한글 타입 → 색상 맵
const typeColorMap: Record<string, string> = {
    '전기': '#FFD600',
    '불꽃': '#FF6F3C',
    '물': '#5AC8F5',
    '풀': '#7AC74C',
    '노말': '#A8A878',
    '페어리': '#F4A7C3',
    '비행': '#AFC4E0',
    '독': '#A33EA1',
    '에스퍼': '#FF5B7E',
    '벌레': '#A6B91A',
    '바위': '#B6A136',
    '땅': '#E2BF65',
    '강철': '#B7B7CE',
    '얼음': '#96D9D6',
    '드래곤': '#6F35FC',
    '고스트': '#735797',
    '악': '#705746',
    '격투': '#C22E28',
};

function TypeBadge({ type }: { type: string }) {
    const color = typeColorMap[type] || '#FFA69E';
    return (
        <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: color }}
        >
            {type}
        </span>
    );
}

function PokemonGridCard({ pokemon, onClick }: { pokemon: Pokemon; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="bg-card rounded-3xl p-3 flex flex-col items-center gap-2 shadow-sm border border-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 text-left w-full"
        >
            {/* Image area */}
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-[#e8f8f5] to-[#d4efeb] flex items-center justify-center overflow-hidden">
                <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="w-4/5 h-4/5 object-contain drop-shadow-md"
                    draggable={false}
                />
            </div>
            {/* Info */}
            <div className="flex flex-col items-center gap-1 w-full px-1">
                <span className="text-[10px] text-muted-foreground font-medium">
                    #{String(pokemon.id).padStart(3, '0')}
                </span>
                {/* 한글 이름 */}
                <p className="text-sm font-bold text-foreground leading-tight text-center">
                    {pokemon.name}
                </p>
                {/* 한글 타입 */}
                <div className="flex flex-wrap gap-1 justify-center">
                    {pokemon.types.map((t, i) => <TypeBadge key={i} type={t} />)}
                </div>
            </div>
        </button>
    );
}

export default function PokedexPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const navigate = useNavigate();

    const allPokemon = pokemonData as Pokemon[];

    const filtered = useMemo(() => {
        return allPokemon.filter((p) => {
            const matchSearch =
                !searchTerm.trim() ||
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.toString() === searchTerm.trim();

            const matchType =
                activeFilter === 'All' ||
                (p.typesEn || []).some((t) => t.toLowerCase() === activeFilter.toLowerCase());

            return matchSearch && matchType;
        });
    }, [searchTerm, activeFilter, allPokemon]);

    return (
        <div className="min-h-screen bg-background flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

            {/* ── Header ── */}
            <header className="bg-background px-4 pt-5 pb-3 flex items-center justify-between max-w-sm mx-auto w-full">
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="size-10 rounded-full bg-card border border-primary/15 shadow-sm flex items-center justify-center hover:bg-primary/5 active:scale-95 transition-all"
                >
                    <ArrowLeft className="size-4 text-foreground" />
                </button>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-lg font-black text-foreground tracking-tight">나의 포켓덱스</h1>
                </div>

                {/* Right button */}
                <button className="size-10 rounded-full bg-card border border-primary/15 shadow-sm flex items-center justify-center hover:bg-primary/5 active:scale-95 transition-all">
                    <Heart className="size-4 text-primary" />
                </button>
            </header>

            <div className="bg-background px-5 pb-0">

                {/* Search bar */}
                <div className="relative max-w-sm mx-auto w-full mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                    <Input
                        type="text"
                        placeholder="포켓몬을 검색하세요..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-2xl h-12 pl-11 pr-4 text-sm bg-card border-0 shadow-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                    />
                </div>

                {/* Type filter chips — 한글 */}
                <div className="max-w-sm mx-auto w-full overflow-x-auto scrollbar-hide-until-hover pb-3 -mx-5 px-5">
                    <div className="flex gap-2 w-max">
                        {TYPE_FILTERS_KR.map((filter) => (
                            <button
                                key={filter.en}
                                onClick={() => setActiveFilter(filter.en)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-150 ${activeFilter === filter.en
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-primary/10'
                                    }`}
                            >
                                {filter.kr}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-28 max-w-sm mx-auto w-full">
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {filtered.map((pokemon) => (
                            <PokemonGridCard
                                key={pokemon.id}
                                pokemon={pokemon}
                                onClick={() => navigate(`/pokecard/${pokemon.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4 opacity-30">❓</div>
                        <p className="font-bold text-foreground/60">포켓몬을 찾을 수 없습니다</p>
                        <p className="text-sm text-muted-foreground mt-1">이름을 다시 확인해주세요!</p>
                    </div>
                )}
            </div>

        </div>
    );
}

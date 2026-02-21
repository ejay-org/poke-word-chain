import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
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

// 한글 타입 → 색상
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

export default function PokeCardPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const allPokemon = pokemonData as Pokemon[];
    const pokemon = allPokemon.find((p) => p.id === Number(id));

    if (!pokemon) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 opacity-30">❓</div>
                    <p className="font-bold text-foreground/60">포켓몬을 찾을 수 없습니다</p>
                    <button
                        onClick={() => navigate('/pokedex')}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold text-sm"
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // 한글 첫 번째 타입으로 색상 결정
    const primaryTypeKr = pokemon.types[0] || '노말';
    const cardBgColor = typeColorMap[primaryTypeKr] || '#FFA69E';

    // 스탯 (id 기반 임의값)
    const health = Math.floor(50 + (pokemon.id % 50) * 2);
    const attack = Math.floor(30 + (pokemon.id % 40) * 1.5);

    // 설명 bullet points
    const bullets = [
        pokemon.description,
        `${pokemon.generation}세대 포켓몬`,
        pokemon.abilities.length > 0 ? `특성: ${pokemon.abilities.join(', ')}` : null,
    ].filter(Boolean) as string[];

    return (
        // 전체 배경을 카드와 동일한 크림색(card)으로 통일
        <div className="min-h-screen bg-card flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

            {/* Top Bar */}
            <div className="px-5 pt-6 pb-2 flex items-center justify-between">
                <button
                    onClick={() => navigate('/pokedex')}
                    className="w-9 h-9 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors active:scale-95"
                >
                    <ArrowLeft className="size-4 text-foreground" />
                </button>
                <h2 className="text-sm font-black tracking-widest uppercase text-foreground/70">Poké Card</h2>
                <button className="w-9 h-9 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors active:scale-95">
                    <Heart className="size-4 text-primary" />
                </button>
            </div>

            {/* Pokemon Image Card */}
            <div className="px-5 pt-2 pb-4">
                <div
                    className="w-full rounded-3xl overflow-hidden shadow-lg"
                    style={{ background: `linear-gradient(135deg, #2d2d3a 0%, #1a1a25 100%)` }}
                >
                    <div className="h-56 flex items-center justify-center relative p-4">
                        {/* 타입 컬러 글로우 */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{ background: `radial-gradient(circle at 50% 60%, ${cardBgColor}, transparent 70%)` }}
                        />
                        <img
                            src={pokemon.imageUrl}
                            alt={pokemon.name}
                            className="h-48 w-48 object-contain drop-shadow-2xl relative z-10"
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            {/* Info Section — bg-card로 이미지 영역과 배경 통일 */}
            <div className="flex-1 bg-card px-5 pt-2 pb-4 flex flex-col gap-5">

                {/* 한글 이름 & 한글 타입 */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-primary leading-tight">{pokemon.name}</h1>
                    <p className="text-sm font-semibold text-muted-foreground mt-1">
                        #{String(pokemon.id).padStart(3, '0')}
                    </p>
                    {/* 한글 타입 뱃지들 */}
                    <div className="flex gap-2 justify-center mt-2">
                        {pokemon.types.map((t, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: typeColorMap[t] || '#FFA69E' }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats — bg-background (회색)으로만 구분 */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background rounded-2xl p-4 flex flex-col items-center shadow-sm">
                        <Heart className="size-5 text-foreground mb-1" fill="currentColor" />
                        <span className="text-2xl font-black text-foreground">{health}</span>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-0.5">체력</span>
                    </div>
                    <div className="bg-background rounded-2xl p-4 flex flex-col items-center shadow-sm">
                        <span className="text-xl text-primary mb-1">★</span>
                        <span className="text-2xl font-black text-foreground">{attack}</span>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-0.5">공격</span>
                    </div>
                </div>

                {/* About section — bg-background로 구분 */}
                <div className="bg-background rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="size-4 text-primary" />
                        <span className="text-sm font-bold text-muted-foreground">About {pokemon.name}</span>
                    </div>
                    <ul className="space-y-2">
                        {bullets.map((line, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span className="leading-relaxed">{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate('/pokedex')}
                    className="w-full py-4 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 mt-auto"
                >
                    <ArrowLeft className="size-4" />
                    포켓덱스로 돌아가기
                </button>
            </div>
        </div>
    );
}

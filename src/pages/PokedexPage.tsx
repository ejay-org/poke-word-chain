import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import pokemonDataRaw from '@/data/pokemonData.json';
import type { Pokemon } from '@/utils/gameLogic';
import { ALL_TYPES, ALL_GENERATIONS, GENERATION_LABELS, TYPE_COLORS } from '@/utils/pokedexUtils';
import PokemonCard from '@/components/PokemonCard';
import PokemonDetailModal from '@/components/PokemonDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, X, SlidersHorizontal } from 'lucide-react';

const pokemonData = pokemonDataRaw as Pokemon[];

export default function PokedexPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGen, setSelectedGen] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPokemon = useMemo(() => {
    return pokemonData.filter((p) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.includes(q);
        const matchesEn = p.nameEn?.toLowerCase().includes(q);
        const matchesId = String(p.id) === q;
        if (!matchesName && !matchesEn && !matchesId) return false;
      }
      // Generation filter
      if (selectedGen !== null && p.generation !== selectedGen) return false;
      // Type filter
      if (selectedType !== null && !p.types.includes(selectedType)) return false;
      return true;
    });
  }, [searchQuery, selectedGen, selectedType]);

  const handleSelectPokemon = useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (!selectedPokemon) return;
    const idx = filteredPokemon.findIndex((p) => p.id === selectedPokemon.id);
    if (idx > 0) setSelectedPokemon(filteredPokemon[idx - 1]);
  }, [selectedPokemon, filteredPokemon]);

  const handleNext = useCallback(() => {
    if (!selectedPokemon) return;
    const idx = filteredPokemon.findIndex((p) => p.id === selectedPokemon.id);
    if (idx < filteredPokemon.length - 1) setSelectedPokemon(filteredPokemon[idx + 1]);
  }, [selectedPokemon, filteredPokemon]);

  const selectedIdx = selectedPokemon
    ? filteredPokemon.findIndex((p) => p.id === selectedPokemon.id)
    : -1;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGen(null);
    setSelectedType(null);
  };

  const hasActiveFilters = searchQuery || selectedGen !== null || selectedType !== null;

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="bg-pokedex-red text-white shadow-lg shrink-0">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 shrink-0"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-inner border-2 border-pokedex-darkred shrink-0">
            <div className="size-6 rounded-full bg-pokedex-red border-2 border-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">포켓몬 도감</h1>
            <p className="text-xs text-red-200">
              {filteredPokemon.length}마리의 포켓몬
            </p>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="shrink-0 border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 py-3 space-y-3">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="포켓몬 이름, 영문명 또는 번호로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="space-y-3">
              {/* Generation Filter */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  세대
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_GENERATIONS.map((gen) => (
                    <button
                      key={gen}
                      onClick={() => setSelectedGen(selectedGen === gen ? null : gen)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                        selectedGen === gen
                          ? 'bg-pokedex-red text-white border-pokedex-red'
                          : 'bg-background text-foreground border-border hover:border-pokedex-red/50'
                      }`}
                    >
                      {GENERATION_LABELS[gen]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  타입
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(selectedType === type ? null : type)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                        selectedType === type
                          ? 'text-white border-transparent'
                          : 'bg-background text-foreground border-border hover:opacity-80'
                      }`}
                      style={
                        selectedType === type
                          ? { backgroundColor: TYPE_COLORS[type] }
                          : undefined
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="h-3 w-3 mr-1" />
                  필터 초기화
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-4">
          {filteredPokemon.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">검색 결과가 없습니다</p>
              <p className="text-sm mt-1">다른 검색어나 필터를 시도해보세요</p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                  필터 초기화
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={handleSelectPokemon}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          onClose={handleCloseModal}
          onPrev={selectedIdx > 0 ? handlePrev : null}
          onNext={selectedIdx < filteredPokemon.length - 1 ? handleNext : null}
        />
      )}
    </div>
  );
}

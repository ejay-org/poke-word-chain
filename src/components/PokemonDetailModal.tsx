import { useEffect } from 'react';
import type { Pokemon } from '@/utils/gameLogic';
import { TYPE_COLORS, GENERATION_LABELS } from '@/utils/pokedexUtils';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PokemonDetailModalProps {
  pokemon: Pokemon;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
}

export default function PokemonDetailModal({
  pokemon,
  onClose,
  onPrev,
  onNext,
}: PokemonDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  const primaryType = pokemon.types[0];
  const bgColor = TYPE_COLORS[primaryType] || '#999';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header with type color */}
        <div
          className="relative rounded-t-2xl px-6 pt-6 pb-16"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 font-mono text-sm font-bold">
              #{String(pokemon.id).padStart(4, '0')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-2xl font-bold text-white">{pokemon.name}</h2>
          <p className="text-white/70 text-sm">{pokemon.nameEn}</p>

          <div className="flex gap-2 mt-3">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="text-xs px-3 py-1 rounded-full text-white font-semibold border border-white/30"
                style={{ backgroundColor: `${TYPE_COLORS[type] || '#999'}cc` }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Pokemon Image - overlapping header */}
        <div className="flex justify-center -mt-12 relative z-10">
          <div className="w-40 h-40 bg-card rounded-full p-2 shadow-lg border-4 border-card">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6 space-y-5">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              설명
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {pokemon.description || '설명이 없습니다.'}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                세대
              </h3>
              <p className="text-sm font-medium">
                {GENERATION_LABELS[pokemon.generation] || `${pokemon.generation}세대`}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                도감번호
              </h3>
              <p className="text-sm font-medium">No. {pokemon.id}</p>
            </div>
          </div>

          {/* Abilities */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                특성
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability}
                    className="text-sm px-3 py-1 bg-muted rounded-full font-medium"
                  >
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Types (English) */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              타입 (EN)
            </h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.typesEn.map((type) => (
                <span
                  key={type}
                  className="text-sm px-3 py-1 bg-muted rounded-full font-medium capitalize"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between px-6 pb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev ?? undefined}
            disabled={!onPrev}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext ?? undefined}
            disabled={!onNext}
            className="gap-1"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

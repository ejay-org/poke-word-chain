import type { Pokemon } from '@/utils/gameLogic';
import { TYPE_COLORS } from '@/utils/pokedexUtils';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <button
      onClick={() => onClick(pokemon)}
      className="group bg-card border rounded-xl p-3 hover:shadow-lg hover:border-pokedex-red/40 transition-all duration-200 cursor-pointer text-left w-full"
    >
      <div className="relative bg-muted/50 rounded-lg p-2 mb-2 aspect-square flex items-center justify-center overflow-hidden">
        <span className="absolute top-1 left-2 text-xs font-mono text-muted-foreground/60">
          #{String(pokemon.id).padStart(4, '0')}
        </span>
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
        />
      </div>
      <p className="font-bold text-sm truncate">{pokemon.name}</p>
      <p className="text-xs text-muted-foreground truncate">{pokemon.nameEn}</p>
      <div className="flex gap-1 mt-1.5 flex-wrap">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium leading-tight"
            style={{ backgroundColor: TYPE_COLORS[type] || '#999' }}
          >
            {type}
          </span>
        ))}
      </div>
    </button>
  );
}

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Header({
  title = "Word Chain",
  subtitle = "포켓몬 이름으로 끝말잇기 배틀!"
}: {
  title?: string;
  subtitle?: string;
}) {
  const navigate = useNavigate();

  return (
    <header className="bg-primary shadow-md relative overflow-hidden">
      {/* Subtle bottom stripe */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20" />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

      <div className="mx-auto max-w-sm px-4 py-3 flex items-center gap-3 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95 -ml-1 flex-shrink-0"
        >
          <ArrowLeft className="size-5 text-white" />
        </button>

        {/* Pokeball-style icon */}
        <div className="size-10 rounded-full bg-card flex items-center justify-center shadow-md border-2 border-white/30 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-x-0 top-[45%] h-[10%] bg-primary/20" />
          <div className="size-3 rounded-full bg-background border-2 border-primary/20 z-10 relative" />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-white tracking-tight drop-shadow-sm">{title}</h1>
          <p className="text-[11px] text-white/70 font-medium truncate">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

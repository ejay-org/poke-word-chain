import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Header({
  title = "게임 시작",
  subtitle = "포켓몬 이름으로 끝말잇기 배틀!"
}: {
  title?: string;
  subtitle?: string;
}) {
  const navigate = useNavigate();

  return (
    <header className="bg-[#EE1515] text-white shadow-lg relative overflow-hidden">
      {/* Pokeball decorative band */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-[#222224]/20"></div>

      <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/20 -ml-2"
        >
          <ArrowLeft className="size-6" />
        </Button>

        <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-md border-4 border-white ring-2 ring-[#222224]/10">
          <div className="size-4 rounded-full bg-[#EE1515]/20 border border-[#EE1515]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight drop-shadow-sm">{title}</h1>
          <p className="text-xs text-white/80 font-medium">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

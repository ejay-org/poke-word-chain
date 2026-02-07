export default function Header() {
  return (
    <header className="bg-pokedex-red text-white shadow-lg">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner border-2 border-pokedex-darkred">
          <div className="w-6 h-6 bg-pokedex-red rounded-full border-2 border-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">포켓몬 끝말잇기</h1>
          <p className="text-xs text-red-200">포켓몬 이름으로 끝말잇기 배틀!</p>
        </div>
      </div>
    </header>
  );
}

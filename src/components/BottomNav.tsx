import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Swords, User } from 'lucide-react';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const items: NavItem[] = [
        { label: 'HOME', icon: <Home className="size-5" />, path: '/' },
        { label: 'DEX', icon: <BookOpen className="size-5" />, path: '/pokedex' },
        { label: 'GAME', icon: <Swords className="size-5" />, path: '/game' },
        { label: 'TRAINER', icon: <User className="size-5" />, path: '/trainer' },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="bg-card/95 backdrop-blur-md border-t border-primary/20 shadow-[0_-4px_20px_rgba(255,166,158,0.15)]">
                <div className="max-w-sm mx-auto flex items-center justify-around py-2 px-4">
                    {items.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 ${isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-primary/70'
                                    }`}
                            >
                                <div
                                    className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                                >
                                    {item.icon}
                                </div>
                                <span
                                    className={`text-[9px] font-bold tracking-widest uppercase transition-all ${isActive ? 'text-primary' : 'text-muted-foreground/70'
                                        }`}
                                >
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

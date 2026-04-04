import { useEffect, useRef } from 'react';

interface CelebrationOverlayProps {
    message: string;
    subMessage?: string;
    onDismiss: () => void;
}

const FIREWORKS = [
    { emoji: '🎆', x: 15, y: 20, delay: 0, size: 2.5 },
    { emoji: '🎇', x: 80, y: 15, delay: 0.3, size: 2 },
    { emoji: '✨', x: 50, y: 10, delay: 0.6, size: 1.8 },
    { emoji: '🎉', x: 10, y: 60, delay: 0.2, size: 2.2 },
    { emoji: '🎊', x: 85, y: 55, delay: 0.5, size: 2 },
    { emoji: '🎆', x: 70, y: 25, delay: 0.8, size: 1.6 },
    { emoji: '✨', x: 25, y: 40, delay: 1.0, size: 1.5 },
    { emoji: '🎇', x: 60, y: 70, delay: 0.4, size: 1.8 },
    { emoji: '🎉', x: 40, y: 80, delay: 0.7, size: 2.0 },
    { emoji: '🎊', x: 90, y: 80, delay: 0.9, size: 1.6 },
    { emoji: '✨', x: 5,  y: 85, delay: 1.1, size: 1.4 },
    { emoji: '🎆', x: 45, y: 50, delay: 0.15, size: 1.7 },
];

export default function CelebrationOverlay({ message, subMessage, onDismiss }: CelebrationOverlayProps) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        timerRef.current = setTimeout(onDismiss, 4000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [onDismiss]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onDismiss}
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
            {/* Firework emojis */}
            {FIREWORKS.map((fw, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${fw.x}%`,
                        top: `${fw.y}%`,
                        fontSize: `${fw.size}rem`,
                        animation: `celebrate-pop 0.6s ease-out ${fw.delay}s both, celebrate-float 2s ease-in-out ${fw.delay}s infinite alternate`,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    {fw.emoji}
                </span>
            ))}

            {/* Message card */}
            <div
                className="relative z-10 bg-white rounded-3xl px-8 py-7 shadow-2xl text-center mx-6 max-w-xs w-full"
                style={{ animation: 'celebrate-card 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-5xl mb-3" style={{ animation: 'celebrate-spin 0.8s ease-out 0.2s both' }}>
                    🏆
                </div>
                <h2 className="text-xl font-black text-gray-800 leading-tight mb-1">
                    축하합니다!
                </h2>
                <p className="text-base font-bold text-gray-700 leading-snug">
                    {message}
                </p>
                {subMessage && (
                    <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
                )}
                <button
                    onClick={onDismiss}
                    className="mt-5 px-6 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-md shadow-primary/30 active:scale-95 transition-all"
                >
                    확인
                </button>
            </div>

            <style>{`
                @keyframes celebrate-pop {
                    0% { transform: scale(0) translateY(30px); opacity: 0; }
                    70% { transform: scale(1.3) translateY(-5px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes celebrate-float {
                    0% { transform: translateY(0px) rotate(-5deg); }
                    100% { transform: translateY(-12px) rotate(5deg); }
                }
                @keyframes celebrate-card {
                    0% { transform: scale(0.5) translateY(40px); opacity: 0; }
                    80% { transform: scale(1.05) translateY(-4px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes celebrate-spin {
                    0% { transform: scale(0) rotate(-180deg); }
                    70% { transform: scale(1.2) rotate(10deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
            `}</style>
        </div>
    );
}

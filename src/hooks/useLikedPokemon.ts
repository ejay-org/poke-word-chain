import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'likedPokemon';

function getLikedIds(): number[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as number[];
    } catch {
        return [];
    }
}

function saveLikedIds(ids: number[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useLikedPokemon() {
    const [likedIds, setLikedIds] = useState<number[]>(getLikedIds);

    // Keep state in sync if another tab changes localStorage
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setLikedIds(getLikedIds());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const toggleLike = useCallback((id: number) => {
        setLikedIds((prev) => {
            const next = prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id];
            saveLikedIds(next);
            return next;
        });
    }, []);

    const isLiked = useCallback(
        (id: number) => likedIds.includes(id),
        [likedIds],
    );

    return { likedIds, toggleLike, isLiked };
}

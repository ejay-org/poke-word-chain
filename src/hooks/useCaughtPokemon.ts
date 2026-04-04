import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'caughtPokemon';

function getCaughtIds(): number[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as number[];
    } catch {
        return [];
    }
}

function saveCaughtIds(ids: number[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useCaughtPokemon() {
    const [caughtIds, setCaughtIds] = useState<number[]>(getCaughtIds);

    // Keep state in sync if another tab changes localStorage
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setCaughtIds(getCaughtIds());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // One-way add — once caught, always caught
    const addCaught = useCallback((id: number) => {
        setCaughtIds((prev) => {
            if (prev.includes(id)) return prev;
            const next = [...prev, id];
            saveCaughtIds(next);
            return next;
        });
    }, []);

    const isCaught = useCallback(
        (id: number) => caughtIds.includes(id),
        [caughtIds],
    );

    return { caughtIds, addCaught, isCaught };
}

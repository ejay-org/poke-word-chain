import { describe, it, expect, vi } from 'vitest';
import { getSafeRandomPokemon, hasValidSuccessor, Pokemon } from './gameLogic';

// Mock pokemon data
// const mockPokemonData: Pokemon[] = [
// ... removed unused data ...
// ];

// We need to mock the pokemonData import in gameLogic
// Since we can't easily refactor the specialized import in gameLogic.ts without changing source,
// we will rely on integration testing with the REAL data if possible, OR
// we can use vi.mock to mock the JSON module.

vi.mock('@/data/pokemonData.json', () => ({
    default: [
        { id: 1, name: '시작이좋아', generation: 1, types: [], typesEn: [], abilities: [], description: '', imageUrl: '' }, // Ends in 아 -> Successor needed
        { id: 2, name: '아보', generation: 1, types: [], typesEn: [], abilities: [], description: '', imageUrl: '' }, // Starts with 아
        { id: 3, name: '끝말이없어', generation: 1, types: [], typesEn: [], abilities: [], description: '', imageUrl: '' }, // Ends in 어 -> No successor
    ]
}));

describe('Safe Start Logic', () => {
    it('hasValidSuccessor returns true for pokemon with successors', () => {
        // Based on the mock above:
        // '시작이좋아' -> Ends in '아'. '아보' exists. Should be true.
        const goodStart: Pokemon = { id: 1, name: '시작이좋아', generation: 1, types: [], typesEn: [], abilities: [], description: '', imageUrl: '' };
        expect(hasValidSuccessor(goodStart)).toBe(true);
    });

    it('hasValidSuccessor returns false for pokemon without successors', () => {
        // '끝말이없어' -> Ends in '어'. No pokemon starts with '어'. Should be false.
        const badStart: Pokemon = { id: 3, name: '끝말이없어', generation: 1, types: [], typesEn: [], abilities: [], description: '', imageUrl: '' };
        expect(hasValidSuccessor(badStart)).toBe(false);
    });

    it('getSafeRandomPokemon returns a pokemon with a successor', () => {
        // Should always return '시작이좋아' or '아보' (since '아보' ends in '보', and let's assume no '보' starts... wait)
        // In the mock:
        // 1. 시작이좋아 -> 아 -> 아보 (VALID)
        // 2. 아보 -> 보 -> ?? (No '보' starter in mock) -> INVALID
        // 3. 끝말이없어 -> 어 -> ?? (No '어' starter in mock) -> INVALID

        // So only '시작이좋아' is safe.

        for (let i = 0; i < 10; i++) {
            const pokemon = getSafeRandomPokemon();
            expect(pokemon.name).toBe('시작이좋아');
        }
    });
});

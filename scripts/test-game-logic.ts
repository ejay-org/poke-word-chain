
import { validateWord } from '../src/utils/gameLogic';
import type { Pokemon } from '../src/utils/gameLogic';

// Mock Pokemon Data for testing? No, we will use the real one imported in gameLogic.ts
// But since we are running this with ts-node or similar, we might need to handle JSON imports.
// For simplicity in this environment, we will rely on the implementation being correct and test it via a temporary test file that we run.

const testCases = [
    { word: '피카츄', chain: '', used: new Set<string>(), expected: true },
    { word: '피카츄', chain: '피', used: new Set<string>(), expected: true },
    { word: '피카츄', chain: '라이츄', used: new Set<string>(), expected: false }, // Chain mismatch
    { word: '없는포켓몬', chain: '', used: new Set<string>(), expected: false }, // Not in DB
    { word: '피카츄', chain: '', used: new Set(['피카츄']), expected: false }, // Already used
];

console.log('--- Starting Validation Tests ---');

testCases.forEach((tc, index) => {
    const result = validateWord(tc.word, tc.chain, tc.used);
    const passed = result.isValid === tc.expected;
    console.log(`Test Case ${index + 1}: ${tc.word} (Chain: '${tc.chain}') -> Expected: ${tc.expected}, Got: ${result.isValid} -> ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
        console.log(`   Reason: ${result.error}`);
    }
});

console.log('--- Tests Completed ---');

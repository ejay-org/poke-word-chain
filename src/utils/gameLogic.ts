import pokemonDataRaw from '../data/pokemonData.json';

// Define the Pokemon interface based on the JSON structure
export interface Pokemon {
  id: number;
  name: string;
  generation: number;
  types: string[];
  typesEn: string[];
  abilities: string[];
  description: string;
  imageUrl: string;
}

const pokemonData = pokemonDataRaw as Pokemon[];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  pokemon?: Pokemon;
}

/**
 * Validates a word for the Pokemon Word Chain game.
 * 
 * @param word The user's input word.
 * @param chainWord The last character of the previous word (or empty if start).
 * @param usedWords A Set of words that have already been used.
 * @returns ValidationResult object.
 */
export function validateWord(word: string, chainWord: string, usedWords: Set<string>): ValidationResult {
  const trimmedWord = word.trim();

  // 1. Check if the word is empty
  if (!trimmedWord) {
    return { isValid: false, error: '단어를 입력해주세요.' };
  }

  // 2. Check if the word has already been used
  if (usedWords.has(trimmedWord)) {
    return { isValid: false, error: '이미 사용된 단어입니다.' };
  }

  // 3. Check for chain rule (End-to-Start)
  // TODO: Add Initial Sound Rule (Do-eum-beop-chik) logic here in Step 9
  if (chainWord && trimmedWord.charAt(0) !== chainWord) {
     return { isValid: false, error: `'${chainWord}'(으)로 시작해야 합니다.` };
  }

  // 4. Check if the word exists in the Pokemon database
  const pokemon = pokemonData.find((p) => p.name === trimmedWord);
  if (!pokemon) {
    return { isValid: false, error: '포켓몬 도감에 없는 이름입니다.' };
  }

  return { isValid: true, pokemon };
}

/**
 * Helper to get the last character of a word for the next chain.
 * This will be expanded in Step 9 for Initial Sound Rule.
 */
export function getLastChar(word: string): string {
    if (!word) return '';
    return word.charAt(word.length - 1);
}

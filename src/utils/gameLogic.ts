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
 * Korean Initial Sound Rule (Do-eum-beop-chik) map.
 * Maps a character to its alternative starting character(s).
 */
const INITIAL_SOUND_MAP: Record<string, string> = {
  // ㄹ (R/L) -> ㄴ (N)
  '라': '나', '락': '낙', '란': '난', '랄': '날', '람': '남', '랍': '납', '랑': '낭',
  '래': '내', '랭': '냉',
  '레': '네', '렉': '넥', '렌': '넨', '렐': '넬', '렘': '넴', '렙': '넵', '렝': '넹', // Loanwords
  '로': '노', '록': '녹', '론': '논', '롤': '놀', '롬': '놈', '롭': '놉', '롱': '농',
  '뢰': '뇌', '료': '뇨', '루': '누', '룩': '눅', '룬': '눈', '룰': '눌', '룸': '눔', '룹': '눕', '룽': '눙',
  '르': '느', '륵': '늑', '른': '는', '를': '늘', '름': '늠', '릅': '늡', '릉': '능',

  // ㄴ (N) -> ㅇ (Null/Vowel)
  '녀': '여', '녁': '역', '년': '연', '녈': '열', '념': '염', '녑': '엽', '녕': '영',
  '뇨': '요', '뇩': '욕', '뇬': '욘', '뇰': '욜', '뇸': '욤', '뇹': '욥', '뇽': '용',
  '뉴': '유', '뉵': '육', '뉸': '윤', '뉼': '율', '늄': '윰', '늅': '윱', '늉': '융',
  '니': '이', '닉': '익', '닌': '인', '닐': '일', '님': '임', '닙': '입', '닝': '잉',

  // ㄹ (R/L) -> ㅇ (Null/Vowel)
  '리': '이', '릭': '익', '린': '인', '릴': '일', '림': '임', '립': '입', '링': '잉',
  '례': '예', '롄': '옌', '롑': '옙',
};

/**
 * Gets valid starting characters for the next word based on the previous word's last character.
 * Applies Korean Initial Sound Rule (Do-eum-beop-chik).
 * 
 * @param char The last character of the previous word.
 * @returns Array of valid starting characters (including the original one).
 */
export function getInitialSoundCandidates(char: string): string[] {
  const candidates = [char];
  const alt = INITIAL_SOUND_MAP[char];
  if (alt && !candidates.includes(alt)) {
    candidates.push(alt);
  }
  // Also handle reverse cases? (e.g. User types '이' for '리' ending? No, usually rules are strict: End with '리' -> Start with '리' or '이'.)
  // But what if the next word starts with '이' but the previous ended in '리'? That's handled above.

  return candidates;
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

  // 3. Check for chain rule (End-to-Start) with Initial Sound Rule
  if (chainWord) {
    const candidates = getInitialSoundCandidates(chainWord);
    const firstChar = trimmedWord.charAt(0);
    if (!candidates.includes(firstChar)) {
      const expectation = candidates.length > 1
        ? `'${candidates[0]}' 또는 '${candidates[1]}'(으)로 시작해야 합니다.`
        : `'${chainWord}'(으)로 시작해야 합니다.`;
      return { isValid: false, error: expectation };
    }
  }

  // 4. Check if the word exists in the Pokemon database
  const pokemon = pokemonData.find((p) => p.name === trimmedWord);
  if (!pokemon) {
    return { isValid: false, error: '포켓몬 도감에 없는 이름입니다.' };
  }

  return { isValid: true, pokemon };
}

/**
 * Finds a valid next Pokemon for the AI (or Hint).
 * 
 * @param lastChar The last character of the previous word.
 * @param usedWords Set of words already used.
 * @returns A valid Pokemon object, or null if no move is possible.
 */
export function getValidNextPokemon(lastChar: string, usedWords: Set<string>): Pokemon | null {
  // 1. Get valid starting characters (handling Do-eum-beop-chik)
  const candidates = getInitialSoundCandidates(lastChar);

  // 2. Filter Pokemon that match the starting character and are not used
  const availablePokemon = pokemonData.filter((p) => {
    if (usedWords.has(p.name)) return false;
    return candidates.includes(p.name.charAt(0));
  });

  if (availablePokemon.length === 0) {
    return null;
  }

  // 3. Pick a random word from the available list
  const randomIndex = Math.floor(Math.random() * availablePokemon.length);
  return availablePokemon[randomIndex];
}

/**
 * Checks if a Pokemon has at least one valid successor in the current database.
 * 
 * @param pokemon The Pokemon to check
 * @returns true if there is at least one valid next move
 */
export function hasValidSuccessor(pokemon: Pokemon): boolean {
  const lastChar = getLastChar(pokemon.name);
  // We pass an empty set for usedWords to check for *any* theoretical successor in a fresh game state.
  // Although in a real game, the start word itself is used, but for "startability" check,
  // we just want to know if a word exists that starts with the last char.
  // Actually, getValidNextPokemon filters by usedWords.
  // If we just want to know if a successor EXISTS in the DB, we can use a fresh set.
  // But wait, the start word WILL be in usedWords immediately. 
  // So we should simulate that the start word is already used? 
  // The current getValidNextPokemon checks if 'p.name' is in usedWords.
  // So if we pass a set containing the pokemon.name, we check if there is ANOTHER pokemon.

  const simulatedUsedWords = new Set<string>([pokemon.name]);
  const nextPokemon = getValidNextPokemon(lastChar, simulatedUsedWords);
  return nextPokemon !== null;
}

/**
 * Gets a random Pokemon from the database that is guaranteed to have a valid successor.
 * Used for AI to start the game safely.
 */
export function getSafeRandomPokemon(): Pokemon {
  // Filter only pokemon that have a valid successor
  // This could be expensive to calculate every time if the DB is huge, 
  // but for 1000 pokemon it's instantaneous.
  const safePokemonList = pokemonData.filter(hasValidSuccessor);

  if (safePokemonList.length === 0) {
    // Fallback if something is terribly wrong with data (should not happen)
    return getRandomPokemon();
  }

  const randomIndex = Math.floor(Math.random() * safePokemonList.length);
  return safePokemonList[randomIndex];
}

/**
 * Gets a random Pokemon from the database.
 * Used for AI to start the game.
 */
export function getRandomPokemon(): Pokemon {
  const randomIndex = Math.floor(Math.random() * pokemonData.length);
  return pokemonData[randomIndex];
}


/**
 * Helper to get the last character of a word for the next chain.
 */
export function getLastChar(word: string): string {
  if (!word) return '';
  return word.charAt(word.length - 1);
}

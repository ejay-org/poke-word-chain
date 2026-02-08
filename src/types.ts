export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  pokemonName?: string;
  hintAnswer?: string; // For hint messages
  pokemonImageUrl?: string;
  isGameEnd?: boolean;
  timestamp: number;
}

export type GameMode = 'normal' | 'ai';

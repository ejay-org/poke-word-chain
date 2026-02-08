export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  pokemonName?: string;
  pokemonImageUrl?: string;
  timestamp: number;
}

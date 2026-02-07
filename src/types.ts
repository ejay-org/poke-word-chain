export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  pokemonName?: string;
  pokemonImageUrl?: string;
  timestamp: number;
}

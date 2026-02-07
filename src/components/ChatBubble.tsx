import type { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-pokedex-red text-white flex items-center justify-center text-sm font-bold mr-2 flex-shrink-0 mt-1">
          P
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? 'order-1' : ''}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-pokedex-red text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
          }`}
        >
          {message.text}
        </div>
        {message.pokemonImageUrl && (
          <div className={`mt-1.5 ${isUser ? 'flex justify-end' : ''}`}>
            <img
              src={message.pokemonImageUrl}
              alt={message.pokemonName || '포켓몬'}
              className="w-16 h-16 object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold ml-2 flex-shrink-0 mt-1">
          나
        </div>
      )}
    </div>
  );
}

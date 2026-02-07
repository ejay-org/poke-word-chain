import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import ChatHistory from '@/components/ChatHistory';
import InputArea from '@/components/InputArea';
import type { ChatMessage } from '@/types';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = useCallback((text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // TODO: Step 8+ 에서 게임 로직 및 AI 응답 연동
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `"${text}" — 아직 게임 로직이 연결되지 않았어요. Phase 2에서 구현 예정!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col mx-auto w-full max-w-2xl overflow-hidden">
        <ChatHistory messages={messages} />
        <InputArea onSubmit={handleSubmit} />
      </main>
    </div>
  );
}

export default App;

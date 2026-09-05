import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import type { ChatMessage, ScamAnalysis } from '@/lib/types';
import { generateChatResponse } from '@/lib/chatbot';

interface ChatbotProps {
  analysis: ScamAnalysis | null;
  initialQuestion?: string | null;
  onQuestionConsumed?: () => void;
}

export function Chatbot({ analysis, initialQuestion, onQuestionConsumed }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I am Ask Scam Shield. I can explain scam analysis in simple words, tell you what to do, or answer questions in Hindi. How can I help?',
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialQuestion) {
      if (!isOpen) setIsOpen(true);
      handleSend(initialQuestion);
      onQuestionConsumed?.();
    }
  }, [initialQuestion]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    const response = generateChatResponse(text, analysis, messages);
    const botMsg: ChatMessage = { role: 'assistant', content: response };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="Open chatbot"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
          <MessageCircle className="relative w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 w-full sm:w-96 h-[70vh] sm:h-[500px] flex flex-col bg-white dark:bg-[#121826] sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-5 h-5" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">Ask Scam Shield</p>
                <p className="text-[10px] text-blue-200 mt-0.5">Your AI scam assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Quick buttons */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {['Is this safe?', 'What should I do?', 'Explain in Hindi'].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-50 dark:bg-[#0d1320] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

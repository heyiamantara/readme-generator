'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  readme: string;
  onReadmeUpdate: (newReadme: string) => void;
}

export default function ChatBox({ readme, onReadmeUpdate }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !readme) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readme,
          instruction: currentInput,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('=== CHAT RESPONSE ===');
      console.log('Response data:', data);
      console.log('Updated README length:', data.updatedReadme?.length);
      console.log('Updated README preview:', data.updatedReadme?.substring(0, 100));
      console.log('Content changed:', readme !== data.updatedReadme);
      
      if (data.updatedReadme) {
        console.log('Calling onReadmeUpdate with new README');
        
        // Check if AI actually made changes
        const hasChanges = readme !== data.updatedReadme;
        
        onReadmeUpdate(data.updatedReadme);
        const assistantMessage: Message = {
          role: 'assistant',
          content: hasChanges 
            ? 'README updated successfully! ✨' 
            : 'README updated (Note: AI may not have made visible changes)',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('No updated README received');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? `Error: ${error.message}` : 'Error: Failed to connect to the server',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const examplePrompts = [
    'Add emojis to headings',
    'Make it more detailed',
    'Add code examples',
    'Improve formatting',
    'Add badges and shields',
    'Add project screenshots section',
    'Add API documentation',
    'Make description more engaging',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white">
        <h2 className="text-xl font-bold text-gray-900">
          Refine your README
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Ask AI to improve or modify your README
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Start refining your README</p>
            <p className="text-sm text-gray-400">
              Try the suggestions below or type your own
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is refining your README...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Example Prompts */}
      {messages.length === 0 && (
        <div className="px-6 py-3 border-t border-pink-100 bg-pink-50/50">
          <p className="text-xs text-gray-600 mb-2 font-medium">Try these:</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="text-xs bg-white border border-pink-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-all whitespace-nowrap flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-pink-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI to improve your README..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg text-white font-medium px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

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

  const quickActions = [
    'Add badges',
    'Add Docker setup',
    'Improve description',
    'Add contributing guidelines',
    'Add installation steps',
    'Make it more professional',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        Refine your README
      </h2>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInput(action)}
                className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full hover:bg-pink-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="mb-4 space-y-3 max-h-[300px] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>💬 Start refining your README with AI!</p>
            <p className="text-sm mt-2">
              Try: "Add badges" or "Add Docker setup"
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-pink-500 text-white'
                  : 'bg-pink-50 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-pink-50 text-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your refinement instruction..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

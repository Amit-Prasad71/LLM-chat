import React, { useState } from 'react';
import { Send, Bot, User, ChevronDown, Menu, X, MessageSquare, Plus } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Model {
  id: string;
  name: string;
}

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model>({ id: 'gpt-4', name: 'GPT-4' });
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sample previous chats
  const [previousChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Website Development Discussion',
      preview: 'Can you help me build a React website?',
      timestamp: new Date('2024-03-10T10:00:00'),
    },
    {
      id: '2',
      title: 'AI Integration Questions',
      preview: 'How do I integrate GPT-4 into my app?',
      timestamp: new Date('2024-03-09T15:30:00'),
    },
    {
      id: '3',
      title: 'Code Review Session',
      preview: 'Could you review my TypeScript code?',
      timestamp: new Date('2024-03-08T09:15:00'),
    },
  ]);

  const models: Model[] = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'claude-2', name: 'Claude 2' },
  ];

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: `This is a simulated response using ${selectedModel.name}. Replace this with actual API integration.`
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-black border-r border-white/10 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors float-right"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
          <button 
            onClick={handleNewChat}
            className="flex items-center space-x-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors text-white"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {previousChats.map((chat) => (
            <button
              key={chat.id}
              className="w-full p-4 border-b border-white/10 hover:bg-white/5 transition-colors text-left flex items-start space-x-3"
            >
              <MessageSquare className="w-5 h-5 text-white/60 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-white truncate">{chat.title}</h3>
                  <span className="text-xs text-white/40 whitespace-nowrap ml-2">
                    {formatDate(chat.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-white/60 truncate">{chat.preview}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-white/60" />
                </button>
              )}
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-white" />
                <h1 className="text-xl font-semibold text-white">AI Chat</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewChat}
                className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors text-white"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
              
              {/* Model Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm font-medium text-white">{selectedModel.name}</span>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </button>
                
                {isModelDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-lg shadow-lg z-10">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setIsModelDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-black">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-white mb-2">Good Morning, John!</h2>
                <p className="text-white/60">How can I assist you today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.role === 'assistant' ? 'bg-white/5' : 'bg-white/10'
                  } rounded-lg p-4`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white/60" />
                  )}
                  <div className="flex-1">
                    <p className="text-white">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="border-t border-white/10 bg-black p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-white text-black rounded-lg px-6 py-2 hover:bg-white/90 transition-colors flex items-center space-x-2"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
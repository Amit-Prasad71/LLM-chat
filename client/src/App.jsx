import React, { useState } from 'react';
import Layout from './components/Layout.jsx';
import ChatMessages from './components/ChatMessages.jsx';
import InputForm from './components/InputForm.jsx';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState({ id: 'gpt-4', name: 'GPT-4' });
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Sample previous chats
    const [previousChats] = useState([
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

    const models = [
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'claude-2', name: 'Claude 2' },
    ];

    const handleNewChat = () => {
        setMessages([]);
        setInput('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        setMessages([...messages, newMessage]);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                role: 'assistant',
                content: `This is a simulated response using ${selectedModel.name}. Replace this with actual API integration.`
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);

        setInput('');
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    return (
        <Layout
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            previousChats={previousChats}
            handleNewChat={handleNewChat}
            formatDate={formatDate}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isModelDropdownOpen={isModelDropdownOpen}
            setIsModelDropdownOpen={setIsModelDropdownOpen}
            models={models}
        >
            <ChatMessages messages={messages} />
            <InputForm input={input} setInput={setInput} handleSubmit={handleSubmit} />
        </Layout>
    );
}

export default App;
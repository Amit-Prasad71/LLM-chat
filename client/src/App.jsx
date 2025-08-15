import React, { useState } from 'react';
import Layout from './components/Layout.jsx';
import ChatMessages from './components/ChatMessages.jsx';
import InputForm from './components/InputForm.jsx';

function App() {
    const preamble = {
        role: "system",
        content: "You are a friendly chatbot"
    }
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState({ id: 'gpt-4', name: 'GPT-4' });
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

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
        setMessages([preamble]);
        setInput('');
    };

    const callApi = async (messages) => {
        let requestBody = {
            messages: messages,
            max_new_tokens: 1000,
            temperature: 0.7,
            top_k: 50,
            top_p: 0.95,
            do_sample: true,
            new: false,
            model: "llama3.2"
        }
        try {
            const response = await fetch('http://192.168.0.120:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json(); // This will parse the response body into JSON.
            console.log("Response: ", data.response);
            return data.response;
        } catch (e) {
            console.log("Error: ", e);
            return "ERROR"
        }

    }

    const callDeepSeekApi = async (messages) => {
        let requestBody = {
            messages: messages,
            max_new_tokens: 1000,
            temperature: 0.7
        }
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json(); // This will parse the response body into JSON.
            console.log("Response: ", data.response);
            return data.response;
        } catch (e) {
            console.log("Error: ", e);
            return "ERROR"
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage]
        setMessages(updatedMessages);

        // Simulate AI response
        // setTimeout(() => {
        //     const aiResponse = {
        //         role: 'assistant',
        //         content: `This is a simulated response using ${selectedModel.name}. Replace this with actual API integration.`
        //     };
        //     setMessages(prev => [...prev, aiResponse]);
        // }, 1000);

        const aiResponse = await callApi([preamble, ...updatedMessages]);
        let requiredAIResponse = {
            role: 'assistant',
            content: `${aiResponse}`
        };
        setMessages(prev => [...prev, requiredAIResponse])
        setInput('');
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    return (

        <div className='bg-black'>
            <Layout
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isRightSidebarOpen={isRightSidebarOpen}
                setIsRightSidebarOpen={setIsRightSidebarOpen}
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
        </div>

    );
}

export default App;
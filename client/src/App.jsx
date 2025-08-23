import React, { useState } from 'react';
import Layout from './components/Layout.jsx';
import ChatMessages from './components/ChatMessages.jsx';
import InputForm from './components/InputForm.jsx';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";


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
    const [loading, setLoading] = useState(false);

    // Sample previous chats
    const [previousChats, setPreviousChats] = useState([
        {
            id: '1',
            title: 'Chat - 1',
            timestamp: new Date('2024-03-10T10:00:00'),
            messages: [],
        },
        {
            id: '2',
            title: 'Chat - 2',
            timestamp: new Date('2024-03-09T15:30:00'),
            messages: [],
        },
        {
            id: '3',
            title: 'Chat - 3',
            timestamp: new Date('2024-03-08T09:15:00'),
            messages: [],
        },
    ]);

    const models = [
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'claude-2', name: 'Claude 2' },
    ];

    const handleNewChat = () => {
        const currentChatId = (previousChats.length + 1).toString()
        const currentChat = {
            id: currentChatId,
            title: `Chat - ${currentChatId}`,
            timestamp: new Date(),
            messages: messages,
        }
        previousChats.push(currentChat)
        setMessages([]);
        setPreviousChats(previousChats)
        setInput('');
    };

    const callApi = async (messages) => {
        let requestBody = {
            messages: messages,
            max_new_tokens: 1000,
            temperature: 0.7,
            top_k: 50,
            top_p: 0.95,
            stop_sequence: ["\n"],
            stream: false,
            do_sample: true,
            new: false,
            model: "llama3.2"
        }
        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json(); // This will parse the response body into JSON.
            console.log("Response: ", data);
            return data;
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
        if (loading) {
            return
        }
        if (!input.trim()) return;
        let updatedMessages = messages
        const newMessage = { role: 'user', content: input };
        //for loading UI
        const emptyResponse = { role: 'assistant', content: '' };
        updatedMessages.push(newMessage)
        updatedMessages.push(emptyResponse)
        setMessages(updatedMessages);
        setInput('');
        setLoading(true)
        const aiResponse = await callApi([preamble, ...updatedMessages]);
        let errorMessage = 'Failed to reach server.'
        let requiredAIResponse = {
            role: 'assistant',
            content: ''
        };
        aiResponse !== 'ERROR' ? (requiredAIResponse.content = `${aiResponse.message.content}`) : (requiredAIResponse.content = errorMessage)

        updatedMessages.pop()
        updatedMessages.push(requiredAIResponse)
        setLoading(false)
        setMessages(updatedMessages)
    };

    const onChatSelect = (chatId) => {
        if (chatId) {
            setMessages(previousChats[Number(chatId) - 1].messages)
        }
    }

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
                onChatSelect={onChatSelect}
            >
                <ChatMessages messages={messages} loading={loading} />
                <InputForm input={input} setInput={setInput} handleSubmit={handleSubmit} loading={loading} />
            </Layout>
        </div>

    );
}

export default App;
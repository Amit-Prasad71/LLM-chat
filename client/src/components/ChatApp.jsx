import React, { useEffect, useState } from 'react';
import Layout from './Layout.jsx';
import ChatMessages from './ChatMessages.jsx';
import InputForm from './InputForm.jsx';
import { useNavigate, useParams } from 'react-router-dom'

export default function ChatApp() {

	const navigate = useNavigate();
	const preamble = {
		role: "system",
		content: "You are a friendly chatbot"
	}

	const [previousChats, setPreviousChats] = useState([]);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [selectedModel, setSelectedModel] = useState({ id: 'gpt-4', name: 'GPT-4' });
	const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { chatId } = useParams();

	useEffect(() => {
		if (chatId) {
			if (!previousChats.length || Number(chatId) > previousChats.length) {
				navigate('/')
				return
			}
			setMessages(previousChats[Number(chatId) - 1].messages);
		} else {
			setMessages([]);
		}
	}, [chatId, previousChats]);

	const handleNewChat = () => {
		setLoading(false)
		setMessages([])
		navigate("/");
	};

	function createChat(id, timestamp = new Date(), messages = []) {
		return {
			id: id,
			title: `Chat - ${id}`,
			timestamp,
			messages,
		};
	}

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

		let isNewChat = messages.length === 0

		let updatedMessages = [...messages]
		let updatedPreviousChats = [...previousChats];

		if (isNewChat) {
			const newChat = createChat((previousChats.length + 1).toString())
			updatedPreviousChats.push(newChat)
			setPreviousChats([...previousChats, newChat])
		}

		let currentChatId = isNewChat ? previousChats.length + 1 : Number(chatId)

		const newMessage = { role: 'user', content: input };
		//for loading UI
		const emptyResponse = { role: 'assistant', content: '' };
		updatedMessages.push(newMessage)
		updatedMessages.push(emptyResponse)
		setMessages(updatedMessages);
		if (isNewChat) {
			navigate(`/c/${currentChatId}`)
		}
		updatedPreviousChats[currentChatId - 1] = {
			...updatedPreviousChats[currentChatId - 1],
			messages: updatedMessages
		};
		setPreviousChats(updatedPreviousChats)
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
		updatedPreviousChats[currentChatId - 1] = {
			...updatedPreviousChats[currentChatId - 1],
			messages: updatedMessages
		};
		setLoading(false)
		setMessages(updatedMessages)
		setPreviousChats(updatedPreviousChats)
	};

	const onChatSelect = (chatId) => {
		navigate(`/c/${chatId}`);
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
	)
}
import React, { useEffect, useState } from 'react';
import Layout from './Layout.jsx';
import ChatMessages from './ChatMessages.jsx';
import InputForm from './InputForm.jsx';
import { useNavigate, useParams } from 'react-router-dom'
import { useModelContext } from '../context/ModelContext.jsx';

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
	const { model, key } = useModelContext();

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
			temperature: 0.7,
			model: model
		}
		try {
			const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${key}`
				},
				body: JSON.stringify(requestBody),
				redirect: "follow"
			});
			const data = await response.json(); // This will parse the response body into JSON.
			console.log("Response: ", data.response);
			return data.response;
		} catch (e) {
			console.log("Error: ", e);
			return "ERROR"
		}

	}
	const callStreamApi = async (messages, onStreamChunk) => {

		let requestBody = {
			messages: messages,
			max_new_tokens: 1000,
			temperature: 0.7,
			top_k: 50,
			top_p: 0.95,
			stop_sequence: ["\n"],
			stream: true,
			do_sample: true,
			new: false,
			model: "llama3.2",
		}

		const response = await fetch('http://localhost:11434/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});


		if (!response.body) {
			throw new Error("ERROR");
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");

		let buffer = "";

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			// split into lines (JSONL)
			const lines = buffer.split("\n");
			buffer = lines.pop(); // keep last line in case it's incomplete

			for (const line of lines) {
				if (!line.trim()) continue;

				let data;
				try {
					data = JSON.parse(line);
				} catch (err) {
					console.error("JSON parse error:", err, line);
					continue;
				}

				if (data.message?.content) {
					onStreamChunk(data.message.content); // now safe
				}

				if (data.done) {
					return;
				}
			}
		}

	}

	const makeAPIcall = async (preamble, updatedMessages) => {
		if (model === "deepseek-chat") {
			callDeepSeekApi(updatedMessages)
		} else if (model === "ollama") {
			callApi([preamble, ...updatedMessages])
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;
		if (!input.trim()) return;

		let isNewChat = messages.length === 0;
		let updatedMessages = [...messages];
		let updatedPreviousChats = [...previousChats];

		if (isNewChat) {
			const newChat = createChat((previousChats.length + 1).toString());
			updatedPreviousChats.push(newChat);
			setPreviousChats([...previousChats, newChat]);
		}

		let currentChatId = isNewChat ? previousChats.length + 1 : Number(chatId);

		const newMessage = { role: "user", content: input };
		const assistantMessage = { role: "assistant", content: "" }; // start empty

		updatedMessages.push(newMessage);
		updatedMessages.push(assistantMessage);
		setMessages(updatedMessages);

		if (isNewChat) {
			navigate(`/c/${currentChatId}`);
		}

		updatedPreviousChats[currentChatId - 1] = {
			...updatedPreviousChats[currentChatId - 1],
			messages: updatedMessages,
		};
		setPreviousChats(updatedPreviousChats);
		setInput("");
		setLoading(true);

		try {
			await callStreamApi([preamble, ...updatedMessages], (chunk) => {
				setMessages((prev) => {
					const newMessages = [...prev]
					const lastIndex = newMessages.length - 1

					const updatedAssistantMessage = {
						...newMessages[lastIndex],
						content: newMessages[lastIndex].content + chunk,
					}
					newMessages[lastIndex] = updatedAssistantMessage
					return newMessages
				})


				setPreviousChats((prevChats) => {
					const newChats = [...prevChats];
					const chatIndex = currentChatId - 1;

					newChats[chatIndex] = {
						...newChats[chatIndex],
						messages: [
							...newChats[chatIndex].messages.slice(0, -1),
							{
								...newChats[chatIndex].messages.at(-1),
								content: newChats[chatIndex].messages.at(-1).content + chunk,
							},
						],
					};

					return newChats;
				});
			});
		} catch (err) {
			setMessages((prev) => {
				const newMessages = [...prev]
				const lastIndex = newMessages.length - 1

				const updatedAssistantMessage = {
					...newMessages[lastIndex],
					content: "Failed to reach server"
				}
				newMessages[lastIndex] = updatedAssistantMessage
				return newMessages
			})
		}
		setLoading(false)
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
				onChatSelect={onChatSelect}
			>
				<ChatMessages messages={messages} loading={loading} />
				<InputForm input={input} setInput={setInput} handleSubmit={handleSubmit} loading={loading} />
			</Layout>
		</div>
	)
}
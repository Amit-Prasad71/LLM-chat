import React, { useEffect, useRef, useState } from 'react';
import Layout from './Layout.jsx';
import ChatMessages from './ChatMessages.jsx';
import InputForm from './InputForm.jsx';
import { useNavigate, useParams } from 'react-router-dom'
import { useModelContext } from '../context/ModelContext.jsx';
import { useError } from '../context/ErrorContext.jsx';
import ErrorToast from './ErrorToast.jsx';
import * as C from '../constants.js'

export default function ChatApp() {

	const navigate = useNavigate();

	const [previousChats, setPreviousChats] = useState([]);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [selectedModel, setSelectedModel] = useState({});
	const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
	const [loading, setLoading] = useState(false);
	const { chatId } = useParams();
	const { model, key, ollamaModel, ollamaLocalPort, temp, topP, topK, preamble, setPreamble } = useModelContext();
	const { showError, errMessage, setShowError, setErrMessage } = useError();

	const abortControllerRef = useRef(null)

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
			title: `Chat ${id}`,
			timestamp,
			messages,
		};
	}

	const callDeepSeekApi = async (messages, abortController, onStreamChunk) => {

		let requestBody = {
			messages: messages,
			temperature: temp,
			stream: true,
			model: model
		}

		const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${key}`
			},
			body: JSON.stringify(requestBody),
			signal: abortController.signal
		});

		if (!response.body) {
			throw new Error("ERROR");
		}
		if (!response.ok) {
			if (response.status === 404) throw new Error("Model not found. Please enter valid model name")
			else throw new Error("Something went wrong. Please try again.")
		}
		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");

		let buffer = "";

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			// split into lines (SSE sends newline-delimited "data: ..." events)
			const lines = buffer.split("\n");
			buffer = lines.pop(); // keep last line if incomplete

			for (const line of lines) {
				if (!line.trim()) continue;

				if (line.startsWith("data: ")) {
					const payload = line.replace(/^data: /, "").trim();

					// End of stream
					if (payload === "[DONE]") {
						return;
					}

					try {
						const data = JSON.parse(payload);

						const delta = data.choices?.[0]?.delta?.content;
						if (delta) {
							onStreamChunk(delta);
						}
					} catch (err) {
						continue;
					}
				}
			}
		}

	}

	const callOllamaApi = async (messages, abortController, onStreamChunk) => {

		let requestBody = {
			messages: messages,
			max_new_tokens: 1000,
			temperature: temp,
			top_k: topK,
			top_p: topP,
			stop_sequence: ["\n"],
			stream: true,
			do_sample: true,
			new: false,
			model: ollamaModel,
		}

		const response = await fetch('http://localhost:11434/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
			signal: abortController.signal //hook abort controller
		});

		if (!response.body) {
			throw new Error("ERROR");
		}
		if (!response.ok) {
			if (response.status === 404) throw new Error("Model not found. Please enter valid model name")
			else throw new Error("Something went wrong. Please try again.")
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

	const validateInput = () => {
		if (model === '') throw new Error("Please choose a provider")
		if (model === 'ollama') {
			if (ollamaModel === '') throw new Error("Please enter local model to proceed")
		}
		else if (model === 'deepseek-chat') {
			if (key === '') throw new Error("Please enter API key to proceed")
		}
		return true
	}

	const makeAPIcall = async (preamble, updatedMessages, currentChatId, abortController) => {
		if (model === "deepseek-chat") {

			await callDeepSeekApi([preamble, ...updatedMessages], abortController, (chunk) => {
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

		} else if (model === "ollama") {

			await callOllamaApi([preamble, ...updatedMessages], abortController, (chunk) => {
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
		}
	}

	const handleSubmit = async () => {
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		if (loading) return;
		if (!input.trim()) return;
		try {
			if (!validateInput()) return;
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

			const systemMessage = {
				role: "system",
				content: preamble ? preamble : C.defaultPreamble
			}

			//sent as request to API
			let messageBody = [...updatedMessages]
			messageBody.pop()

			await makeAPIcall(systemMessage, messageBody, currentChatId, abortController)

		} catch (err) {
			setShowError(true);
			const errorMessage = err.name === "AbortError" ? "Aborted by user" : err.message
			setErrMessage(errorMessage);
			let currentChatId = messages.length === 0 ? previousChats.length + 1 : Number(chatId);

			setPreviousChats((prevChats) => {
				const newChats = [...prevChats];
				const chatIndex = currentChatId - 1;

				newChats[chatIndex] = {
					...newChats[chatIndex],
					messages: [
						...newChats[chatIndex].messages.slice(0, -1),
						{
							...newChats[chatIndex].messages.at(-1),
							content: "Something went wrong. Please try again.",
						},
					],
				};

				return newChats;
			});

		}
		setLoading(false)
		abortControllerRef.current = null
	};

	const handleStop = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			setLoading(false);
		}
	}

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
				<InputForm input={input} setInput={setInput} handleSubmit={handleSubmit} loading={loading} handleStop={handleStop} />
			</Layout>
			<ErrorToast showError={showError} errMessage={errMessage} onClose={() => setShowError(false)} />
		</div>
	)
}
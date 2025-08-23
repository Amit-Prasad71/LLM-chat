import React from 'react';
import { Bot, User, Copy } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

function Message({ message, loading }) {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(message.content);
	};
	const isAssistantMessageLoading = loading && message.role === 'assistant' && message.content === ''
	return (

		<div className={`group pb-8 flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>

			<div
				className={` ${message.role !== 'assistant' ? 'bg-white/10 max-w-lg break-words' : 'bg-black w-full'
					} rounded-lg`}
			>
				<div className="relative flex-1">
					{message.role === 'user' && <p className="text-white p-4">{message.content}</p>}
					{message.role === 'assistant' && <MarkdownRenderer content={message.content} />}

					{!isAssistantMessageLoading &&
						<button
							onClick={copyToClipboard}
							className="absolute left-0 m-1 hidden group-hover:block group-focus-within:block p-1 rounded bg-black hover:bg-white/20"
						>
							<Copy className=" w-4 h-4 text-white" />
						</button>
					}
				</div>
			</div>
		</div>
	);
}

export default Message;
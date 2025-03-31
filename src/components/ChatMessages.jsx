import React from 'react';
import { Bot, User } from 'lucide-react';
import Message from './Message.jsx';

function ChatMessages({ messages }) {
	return (
		<div className="flex-1 overflow-y-auto p-4 bg-black">
			<div className="max-w-4xl mx-auto space-y-4">
				{messages.length === 0 ? (
					<div className="text-center py-8">
						<h2 className="text-2xl font-bold text-white mb-2">Good Morning, John!</h2>
						<p className="text-white/60">How can I assist you today?</p>
					</div>
				) : (
					messages.map((message, index) => (
						<Message key={index} message={message} />
					))
				)}
			</div>
		</div>
	);
}

export default ChatMessages;
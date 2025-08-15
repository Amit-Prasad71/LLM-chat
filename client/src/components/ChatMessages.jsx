import React from 'react';
import { Bot, User } from 'lucide-react';
import Message from './Message.jsx';
import StaggeredText from './StaggeredText.jsx';

function ChatMessages({ messages }) {
	return (
		<div className="flex-1 overflow-y-auto p-4 bg-black">
			<div className="max-w-4xl mx-auto space-y-4">
				{messages.length === 0 ? (
					<div className="text-center py-8">
						<StaggeredText text="Hello!" />
						<p className="text-white/60">How may I assist you today?</p>
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
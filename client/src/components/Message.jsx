import React from 'react';
import { Bot, User } from 'lucide-react';

function Message({ message }) {
	return (
		<div
			className={` ${message.role !== 'assistant' ? 'bg-white/10' : 'bg-black'
				} rounded-lg p-4`}
		>
			{message.role === 'assistant' ? (
				<Bot className="w-6 h-6 mb-4 text-white" />
			) : (
				<User className="w-6 h-6 text-white/60" />
			)}
			<div className="flex-1">
				<p className="text-white">{message.content}</p>
			</div>
		</div>
	);
}

export default Message;
import React from 'react';
import { MessageSquare } from 'lucide-react';

function ChatListItem({ chat, formatDate, onChatSelect }) {
	return (
		<button
			key={chat.id}
			onClick={() => onChatSelect(chat.id)} // Assuming you have a function to handle chat selection
			className="w-full p-4 border-b border-white/10 hover:bg-white/5 transition-colors text-left flex items-start space-x-3 cursor-pointer"
		>
			<MessageSquare className="w-5 h-5 text-white/60 mt-1" />
			<div className="flex-1 min-w-0">
				<div className="flex justify-between items-start">
					<h3 className="font-medium text-white truncate">{chat.title}</h3>
					<span className="text-xs text-white/40 whitespace-nowrap ml-2">
            {formatDate(chat.timestamp)}
          </span>
				</div>
				<p className="text-sm text-white/60 truncate">{chat.preview}</p>
			</div>
		</button>
	);
}

export default ChatListItem;
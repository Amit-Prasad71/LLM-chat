import React from 'react';
import { MessageSquare } from 'lucide-react';

function ChatListItem({ chat, formatDate, onChatSelect }) {
	return (
		<button
			key={chat.id}
			onClick={() => onChatSelect(chat.id)} // Assuming you have a function to handle chat selection
			className="w-full px-4 py-2 border-white/10  rounded-lg hover:bg-white/5 transition-colors text-left flex items-start space-x-3 cursor-pointer"
		>
			<div className="flex-1 min-w-0">
				<div className="flex justify-between items-start">
					<p className="font-medium text-white/80 truncate text-sm">{chat.title}</p>
					<p className="text-xs text-white/40 whitespace-nowrap ml-2 pt-1">
						{formatDate(chat.timestamp)}
					</p>
				</div>
			</div>
		</button>
	);
}

export default ChatListItem;
import React from 'react';
import { X, Plus, MessageSquare } from 'lucide-react';
import ChatListItem from './ChatListItem.jsx';

function Sidebar({ isSidebarOpen, setIsSidebarOpen, previousChats, handleNewChat, formatDate }) {
	return (
		<div className={`${isSidebarOpen ? 'w-60' : 'w-0'} bg-black border-r border-white/10 transition-all duration-300 overflow-hidden flex flex-col`}>
			<div className="p-4 border-b border-white/10">
				<button
					onClick={() => setIsSidebarOpen(false)}
					className="p-2 hover:bg-white/10 rounded-lg transition-colors float-right"
				>
					<X className="w-5 h-5 text-white/60" />
				</button>
				<button
					onClick={handleNewChat}
					className="flex items-center space-x-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors text-white"
				>
					<Plus className="w-4 h-4" />
					<span>New Chat</span>
				</button>
			</div>
			<div className="flex-1 overflow-y-auto">
				{previousChats.map((chat) => (
					<ChatListItem key={chat.id} chat={chat} formatDate={formatDate} />
				))}
			</div>
		</div>
	);
}

export default Sidebar;
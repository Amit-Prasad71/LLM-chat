import React from 'react';
import { Bot, User } from 'lucide-react';
import Message from './Message.jsx';
import StaggeredText from './StaggeredText.jsx';
import Loader from './Loader';

function assistantLoading(loading) {
	return (
		<div className='flex gap-4 mb-4'>
			{loading && <Loader />}
		</div>
	)
}

function ChatMessages({ messages, loading }) {
	const endIndex = messages.length - 1
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
						<Message key={index} messageIndex={index} message={message} loading={loading} endIndex={endIndex} />
					))
				)}
				{messages.length !== 0 && assistantLoading(loading)}
			</div>
		</div>
	);
}

export default ChatMessages;
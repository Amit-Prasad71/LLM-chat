import { useEffect, useRef } from 'react';
import Message from './Message.jsx';
import StaggeredText from './StaggeredText.jsx';
import LoaderDots from './LoaderDots.jsx';
import { AnimatePresence, motion } from "framer-motion";

function assistantLoading(loading) {
	return (
		<div className="flex gap-4 mb-4">
			<AnimatePresence>
				{loading && (
					<motion.div
						key="loader"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4, ease: "easeInOut" }}
					>
						<LoaderDots />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

function ChatMessages({ messages, loading }) {

	const bottomRef = useRef(null);

	useEffect(() => {
		// scroll into view whenever messages change
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [loading]);

	const endIndex = messages.length - 1
	return (
		<div className="flex-1 overflow-y-auto p-4 bg-black custom-scrollbar-hide">
			<div className="max-w-4xl mx-auto space-y-2">
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
				<div ref={bottomRef}>{assistantLoading(loading)}</div>
			</div>

		</div>
	);
}

export default ChatMessages;
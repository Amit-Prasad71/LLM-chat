import React from 'react';
import { Send } from 'lucide-react';
import LoaderDots from './LoaderDots';

function InputForm({ input, setInput, handleSubmit, loading }) {
	return (
		<div className="border-t border-white/10 bg-black p-4">
			<div className="max-w-4xl mx-auto">
				<form onSubmit={handleSubmit} className="flex space-x-4">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your message..."
						className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
					/>
					<button
						type="submit"
						className="bg-white text-black rounded-lg px-6 py-2 hover:bg-white/90 transition-colors flex items-center space-x-2"
					>
						{!loading && <span>Send</span>}
						{!loading ? <Send className="w-4 h-4" /> : <LoaderDots />}

					</button>
				</form>
			</div>
		</div>
	);
}

export default InputForm;
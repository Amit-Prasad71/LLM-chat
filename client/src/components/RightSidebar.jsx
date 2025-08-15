import React from 'react';
import { X, Plus, MessageSquare, LockKeyhole, Box } from 'lucide-react';
import ChatListItem from './ChatListItem.jsx';
import { useState } from "react";

function RightSidebar({ isRightSidebarOpen, setIsRightSidebarOpen }) {
	const [temp, setTemp] = useState(0.7);
	const [topP, setTopP] = useState(1);
	const [topK, setTopK] = useState(50);
	const [provider, setProvider] = useState("");

	return (
		<div className={`${isRightSidebarOpen ? 'w-80' : 'w-0'} bg-black border-l border-white/10 transition-all duration-300 overflow-hidden`}>
			<div className="border-white/10">

				<div>
					<div className='p-4'>
						<button
							onClick={() => setIsRightSidebarOpen(false)}
							className="p-2 block hover:bg-white/10 rounded-lg transition-colors float-left"
						>
							<X className="w-5 h-5 text-white/60" />
						</button>
					</div>


					<div className='flex flex-col gap-4 clear-both p-4'>
						<div>
							<label htmlFor="provider" className="flex items-center gap-2 mb-1 px-1 text-white">
								Provider
								<Box className="w-4 h-4 text-white/60" />
							</label>
							<select
								id="llm-provider"
								value={provider}
								onChange={(e) => setProvider(e.target.value)}
								className={`px-3 py-2 pr-8 w-full bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors ${provider === "" ? 'text-gray-400' : 'text-white'}`}
							>
								<option value="" disabled hidden className='text-gray-400'>Select a provider</option>
								<option value="deepseek" className="bg-black text-white">Deepseek </option>
								<option value="gpt4o" className="bg-black text-white">GPT-4o</option>
							</select>
						</div>

						<div>
							<label htmlFor="apiKey" className="flex items-center gap-2 px-1 mb-1 text-white">
								Secret
								<LockKeyhole className="w-4 h-4 text-white/60" />
							</label>
							<input
								id="apiKey"
								type="password"
								placeholder="Enter your API key"
								className="w-full px-4 py-2 mb-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/30"
							/>
						</div>
					</div>






				</div>









				<div className='p-4 w-full border-t border-white/10'>

					<p className='text-gray-300 text-sm mb-4'>Advanced Settings</p>
					<div>
						<label htmlFor="temp_slider" className="block text-white mb-2 mt-2">
							Temp: <span>{temp}</span>
						</label>
						<input
							id="mySlider"
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={temp}
							onChange={(e) => setTemp(parseFloat(e.target.value))}
							className="w-full accent-white"
						/>
					</div>
					<div>
						<label htmlFor="topP_slider" className="block text-white mb-2 mt-2">
							TopP: <span>{topP}</span>
						</label>
						<input
							id="topP_slider"
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={topP}
							onChange={(e) => setTopP(parseFloat(e.target.value))}
							className="w-full accent-white"
						/>
					</div>
					<div>
						<label htmlFor="topK_slider" className="block text-white mb-2 mt-2">
							TopK: <span>{topK}</span>
						</label>
						<input
							id="topK_slider"
							type="range"
							min="0"
							max="1000"
							step="1"
							value={topK}
							onChange={(e) => setTopK(parseFloat(e.target.value))}
							className="w-full accent-white"
						/>
					</div>







				</div>



			</div>
		</div>
	);
}

export default RightSidebar;
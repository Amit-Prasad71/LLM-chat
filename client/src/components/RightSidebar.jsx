import { X, LockKeyhole, Box, Book, ChevronUp, ChevronDown, Eye, EyeClosed, Bot, Info, Brain, Anchor } from 'lucide-react';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModelContext } from '../context/ModelContext.jsx';

function RightSidebar({ isRightSidebarOpen, setIsRightSidebarOpen }) {

	const providerOptions = {
		'': {
			'preamble': false,
			'topK': false,
			'topP': false,
			'temp': false
		},
		'deepseek-chat': {
			'preamble': true,
			'topK': true,
			'topP': true,
			'temp': true
		},
		'ollama': {
			'preamble': true,
			'topK': true,
			'topP': true,
			'temp': true
		}
	}


	const [provider, setProvider] = useState("");
	const [showSecret, setShowSecret] = useState(false)

	const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false)
	const [isSecretInputEmpty, setIsSecretInputEmpty] = useState(true)
	const { setModel, setKey, setOllamaModel, setOllamaLocalPort, setTemp, setTopK, setTopP, temp, topK, topP, preamble, setPreamble } = useModelContext()


	const handleSecretInput = (key) => {
		setIsSecretInputEmpty(!key)
		setKey(key)
	}

	const handleProvider = (provider) => {
		setProvider(provider)
		setModel(provider)
	}

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
							<div className='relative'>
								<select
									id="llm-provider"
									value={provider}
									onChange={(e) => handleProvider(e.target.value)}
									className={`appearance-none px-3 py-2 pr-8 w-full bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors ${provider === "" ? 'text-gray-400' : 'text-white'}`}
								>
									<option value="" disabled hidden className='text-white/50'>Select a provider</option>
									<option value="deepseek-chat" className="bg-black text-white">Deepseek </option>
									<option value="ollama" className="bg-black text-white">Ollama</option>
								</select>
								<ChevronDown className="w-4 h-4 absolute top-3.5 right-3 text-white/60 " />
							</div>

						</div>
						{provider !== 'ollama' && (
							<div>
								<label
									htmlFor="apiKey"
									className="flex items-center gap-2 px-1 text-white"
								>
									Secret
									<LockKeyhole className="w-4 h-4 text-white/60" />
								</label>
								<div className="relative group">
									<input
										id="apiKey"
										type={showSecret ? "text" : "password"}
										onChange={(e) => handleSecretInput(e.target.value)}
										placeholder="Enter your API key"
										className="w-full px-4 py-2 pr-10 mb-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/30"
									/>
									{!isSecretInputEmpty && <button
										type="button"
										onClick={() => setShowSecret(!showSecret)}
										className="absolute inset-y-4 top-0 right-3 flex items-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
									>
										{showSecret ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
									</button>
									}
								</div>
							</div>
						)}

						{provider === 'ollama' && (
							<div>
								<label
									htmlFor="ollamaModel"
									className="flex items-center gap-2 px-1 text-white"
								>
									Model
									<Brain className="w-4 h-4 text-white/60" />
								</label>
								<p className={`${!isRightSidebarOpen && 'whitespace-nowrap overflow-hidden text-ellipsis'} text-white/50 text-xs mt-1 mb-2 px-1`}>Choose the model name installed in your Ollama setup (e.g. llama3.2, etc.)</p>
								<div className="relative group">
									<input
										id="ollamaModel"
										type="text"
										onChange={(e) => setOllamaModel(e.target.value)}
										placeholder="Enter model"
										className="w-full px-4 py-2 pr-10 mb-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/30"
									/>
								</div>
							</div>
						)}

						{provider === 'ollama' && (
							<div>
								<label
									htmlFor="ollamaPort"
									className="flex items-center gap-2 px-1 text-white"
								>
									Port
									<Anchor className="w-4 h-4 text-white/60" />
								</label>
								<p className={`${!isRightSidebarOpen && 'whitespace-nowrap overflow-hidden text-ellipsis'} text-white/50 text-xs mt-1 mb-2 px-1`}>Specify the local port used by the Ollama server (default: 11434).</p>
								<div className="relative group">
									<input
										id="ollamaPort"
										type="number"
										onInput={(e) => {
											if (e.target.value.length > 5) {
												e.target.value = e.target.value.slice(0, 5);
											}
										}}
										onChange={(e) => setOllamaLocalPort(e.target.value)}
										placeholder="Enter port"
										className="w-full px-4 py-2 pr-10 mb-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/30"
									/>
								</div>
							</div>
						)}

					</div>
				</div>


				{provider !== '' && (
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.4 }}
							className='p-4 w-full border-t border-white/10'
						>

							<div className="flex items-center justify-between w-full mb-4" onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}>
								<p className="text-gray-300 text-sm">Advanced Settings</p>
								<button>
									{isAdvancedSettingsOpen ? (
										<ChevronUp className="w-4 h-4 text-white/60" />
									) : (
										<ChevronDown className="w-4 h-4 text-white/60" />
									)}
								</button>
							</div>


							{isAdvancedSettingsOpen && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.5 }}
									className="overflow-hidden"
								>

									{providerOptions[provider].preamble && (
										<motion.div
											key="preamble"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 10 }}
											transition={{ duration: 0.5 }}
										>
											<label htmlFor="preamble" className="flex items-center gap-2 px-1 mb-1 text-white">
												Preamble
												<Book className="w-4 h-4 text-white/60" />
											</label>
											<textarea
												id="preamble"
												type="text"
												value={preamble}
												onChange={(e) => setPreamble(e.target.value)}
												placeholder="Initial instructions here..."
												className="w-full px-4 py-2 mb-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/30 custom-scrollbar-hide"
												style={{ minHeight: "20px", maxHeight: "120px", overflowY: "auto" }}
											/>
										</motion.div>
									)}
									{providerOptions[provider].temp && (
										<motion.div
											key="temp-slider"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 10 }}
											transition={{ duration: 0.5 }}
										>
											<div className='flex justify-between'>
												<label htmlFor="temp_slider" className="text-white/80 mb-2 text-sm">Temp</label>
												<p className='text-white/80 mb-2 text-sm'>{temp}</p>
											</div>
											<input
												id="temp_slider"
												type="range"
												min="0"
												max="1"
												step="0.1"
												value={temp}
												onChange={(e) => setTemp(parseFloat(e.target.value))}
												className="w-full accent-white mb-4 opacity-50"
											/>
										</motion.div>
									)}


									{providerOptions[provider].topP && (
										<motion.div
											key="topP_slider"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 10 }}
											transition={{ duration: 0.5 }}
										>
											<div className='flex justify-between'>
												<label htmlFor="topP_slider" className="text-white/80 mb-2 text-sm">TopP</label>
												<p className='text-white/80 mb-2 text-sm'>{topP}</p>
											</div>
											<input
												id="topP_slider"
												type="range"
												min="0"
												max="1"
												step="0.1"
												value={topP}
												onChange={(e) => setTopP(parseFloat(e.target.value))}
												className="w-full accent-white mb-4 opacity-50"
											/>
										</motion.div>
									)}


									{providerOptions[provider].topK && (
										<motion.div
											key="topK_slider"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 10 }}
											transition={{ duration: 0.2 }}
										>

											<div className='flex justify-between'>
												<label htmlFor="topK_slider" className="text-white/80 mb-2 text-sm">TopK</label>
												<p className='text-white/80 mb-2 text-sm'>{topK}</p>
											</div>
											<input
												id="topK_slider"
												type="range"
												min="0"
												max="1000"
												step="1"
												value={topK}
												onChange={(e) => setTopK(parseFloat(e.target.value))}
												className="w-full accent-white mb-4 opacity-50"
											/>
										</motion.div>
									)}

								</motion.div>
							)}

						</motion.div>
					</AnimatePresence>
				)}





			</div>
		</div>
	);
}

export default RightSidebar;
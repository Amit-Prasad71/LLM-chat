import React from 'react';
import { Menu, Bot, Plus, ChevronDown } from 'lucide-react';

function Header({
					isSidebarOpen,
					setIsSidebarOpen,
					handleNewChat,
					selectedModel,
					setSelectedModel,
					isModelDropdownOpen,
					setIsModelDropdownOpen,
					models,
				}) {
	return (
		<header className="bg-black border-b border-white/10 p-4">
			<div className="max-w-4xl mx-auto flex items-center justify-between">
				<div className="flex items-center space-x-3">
					{!isSidebarOpen && (
						<button
							onClick={() => setIsSidebarOpen(true)}
							className="p-2 hover:bg-white/10 rounded-lg transition-colors"
						>
							<Menu className="w-5 h-5 text-white/60" />
						</button>
					)}
					<div className="flex items-center space-x-2">
						<Bot className="w-6 h-6 text-white" />
						<h1 className="text-xl font-semibold text-white">AI Chat</h1>
					</div>
				</div>

				<div className="flex items-center space-x-3">
					<button
						onClick={handleNewChat}
						className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors text-white"
					>
						<Plus className="w-4 h-4" />
						<span>New Chat</span>
					</button>

					{/* Model Selector */}
					<div className="relative">
						<button
							onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
							className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
						>
							<span className="text-sm font-medium text-white">{selectedModel.name}</span>
							<ChevronDown className="w-4 h-4 text-white/60" />
						</button>

						{isModelDropdownOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-lg shadow-lg z-10">
								{models.map((model) => (
									<button
										key={model.id}
										onClick={() => {
											setSelectedModel(model);
											setIsModelDropdownOpen(false);
										}}
										className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg"
									>
										{model.name}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
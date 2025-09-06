import React from 'react';
import { Menu, Bot, Plus, ChevronDown, Bolt } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import * as C from '../constants'

function Header({
	isSidebarOpen,
	setIsSidebarOpen,
	handleNewChat,
	selectedModel,
	setSelectedModel,
	isModelDropdownOpen,
	setIsModelDropdownOpen,
	models,
	isRightSidebarOpen,
	setIsRightSidebarOpen
}) {
	return (
		<header className="bg-black border-b border-white/10 p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					{!isSidebarOpen && (
						<button
							onClick={() => setIsSidebarOpen(true)}
							className="p-2 hover:bg-white/10 rounded-lg transition-colors"
						>
							<Bot className="w-6 h-6 text-white" />
						</button>
					)}
					<div className="flex items-center space-x-2">
						<a href="/" className="text-xl font-semibold text-white">
							AI Chat
						</a>
					</div>
				</div>

				<div className="flex items-center space-x-3">

					{!isRightSidebarOpen && <a href={`${C.GITHUB_URL}`} target='_blank'><FaGithub size={20} className='text-white' /></a>}

					{!isRightSidebarOpen && (
						<button
							onClick={() => setIsRightSidebarOpen(true)}
							className="flex items-center space-x-2 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors text-white"
						>
							<Bolt className="w-5 h-5" />

						</button>
					)}

				</div>

			</div>
		</header>
	);
}

export default Header;
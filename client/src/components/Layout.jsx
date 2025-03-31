import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

function Layout({
					children,
					isSidebarOpen,
					setIsSidebarOpen,
					previousChats,
					handleNewChat,
					formatDate,
					selectedModel,
					setSelectedModel,
					isModelDropdownOpen,
					setIsModelDropdownOpen,
					models,
				}) {
	return (
		<div className="flex h-screen bg-black">
			<Sidebar
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
				previousChats={previousChats}
				handleNewChat={handleNewChat}
				formatDate={formatDate}
			/>
			<div className="flex-1 flex flex-col">
				<Header
					setIsSidebarOpen={setIsSidebarOpen}
					handleNewChat={handleNewChat}
					selectedModel={selectedModel}
					setSelectedModel={setSelectedModel}
					isModelDropdownOpen={isModelDropdownOpen}
					setIsModelDropdownOpen={setIsModelDropdownOpen}
					models={models}
					isSidebarOpen={isSidebarOpen}
				/>
				{children}
			</div>
		</div>
	);
}

export default Layout;
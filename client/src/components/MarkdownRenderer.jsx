import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownRenderer({ content }) {
	return (
		<div className="prose prose-invert max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					code({ inline, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || "");
						return !inline && match ? (
							<SyntaxHighlighter
								style={oneDark}
								language={match[1]}
								PreTag="div"
								className="rounded-lg p-3"
								{...props}
							>
								{String(children).replace(/\n$/, "")}
							</SyntaxHighlighter>
						) : (
							<code className="bg-black/40 px-1 py-0.5 rounded-lg" {...props}>
								{children}
							</code>
						);
					},
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // import KaTeX styles

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useModelContext } from "../context/ModelContext.jsx";


export default function MarkdownRenderer({ content }) {
	const { provider, model } = useModelContext()

	function normalizeMath(content) {
		return content
			// Replace block [ ... ] with $$ ... $$
			.replace(/\[\s*([^\]]+)\s*\]/gs, (_, expr) => `$$${expr}$$`);
	}

	const isNormalizeRequired = () => {
		return provider === 'deepseek' && (model === 'deepseek-reasoner' || model === 'deepseek-coder')
	}

	return (
		<div className="prose prose-invert max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeKatex]}
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
				{
					isNormalizeRequired() ? normalizeMath(content) : content
				}
			</ReactMarkdown>
		</div>
	);
}

import { useMemo } from "react";

export default function StaggeredText({ text }) {
	const chars = useMemo(() => text.split(""), [text]);

	return (
		<div className="flex items-center justify-center bg-black mb-4">
			<div className="flex text-white text-4xl font-semibold">
				{chars.map((ch, i) => (
					<span
						key={i}
						className="opacity-0 animate-reveal"
						style={{ animationDelay: `${i * 100}ms` }}
					>
						{ch === " " ? "\u00A0" : ch}
					</span>
				))}
			</div>
		</div>
	);
}
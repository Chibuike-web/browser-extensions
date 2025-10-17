import { createRoot } from "react-dom/client";
import "./popup.css";
import { useState } from "react";

export default function Popup() {
	const [summaryType, setSummaryType] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSummarize = () => {
		if (!summaryType) return;
		setIsLoading(true);
		chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
			const tabId = tabs[0]?.id;
			if (typeof tabId !== "number") return;
			await chrome.tabs.sendMessage(tabId, { action: "generate_summary", summaryType });
		});
	};

	return (
		<div className="w-[300px] p-4 text-sm bg-white text-gray-800">
			<h1 className="text-lg font-semibold">AITransform</h1>
			<select
				className="w-full mb-6 mt-2 border rounded-md p-1 focus:outline-none"
				value={summaryType}
				onChange={(e) => setSummaryType(e.target.value)}
			>
				<option>Executive Summary</option>
				<option>Detailed Breakdown</option>
				<option>Technical Focus</option>
			</select>
			<button
				type="button"
				className="w-full flex items-center justify-center bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50"
				disabled={isLoading}
				onClick={handleSummarize}
			>
				{isLoading ? (
					<span className="flex items-center gap-2">
						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						Generating...
					</span>
				) : (
					"Generating Summary"
				)}
			</button>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<Popup />);

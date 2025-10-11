import { createRoot } from "react-dom/client";
import "./popup.css";
import { useState, type MouseEvent } from "react";

export default function Popup() {
	const [summaryType, setSummaryType] = useState("");
	const handleSummarize = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		chrome.runtime.sendMessage({ action: "open_summary_page" });
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
				className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
				onClick={handleSummarize}
			>
				Generate Summary
			</button>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<Popup />);

import { createRoot } from "react-dom/client";
import "./popup.css";
import { useEffect, useState } from "react";

function SummaryPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [data, setData] = useState(null);
	useEffect(() => {
		setIsLoading(true);
		chrome.runtime.onMessage.addListener(async (msg) => {
			if (msg.status === "success") {
				setData(msg.data);
			} else if (msg.status === "failed") {
				setError(msg.error);
			}
		});
		console.log(data);
	}, []);

	if (isLoading) return <p>Loading....</p>;

	if (error) return <p>{error}</p>;
	return (
		<div className="p-4 bg-white text-gray-900 min-h-screen">
			<h1 className="text-2xl font-bold mb-4">Summary</h1>
			{!data && !error && <p>Waiting for summary...</p>}
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<SummaryPage />);

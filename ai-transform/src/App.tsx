export default function App() {
	const handleClick = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
			if (!tab.id) return;
			chrome.tabs.sendMessage(tab.id, { action: "extractText" }, (response) => {
				console.log("Extracted text:", response.text);
			});
		});
	};

	return (
		<main className="p-2 w-[600px] h-[500px]">
			<h1 className="font-bold">Scan the page</h1>
			<button onClick={handleClick}>Extract Page Text</button>
		</main>
	);
}

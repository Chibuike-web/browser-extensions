export default function App() {
	interface ExtractTextResponse {
		text: string;
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		chrome.tabs.query({ active: true, currentWindow: true }, ([tab]: chrome.tabs.Tab[]) => {
			if (!tab.id) return;
			chrome.tabs.sendMessage(
				tab.id,
				{ action: "extractText" },
				(response: ExtractTextResponse) => {
					console.log("Extracted text:", response.text);
				}
			);
		});
	};

	return (
		<main className="p-4 w-[600px] h-[500px] bg-white border border-gray-200 rounded-xl flex flex-col">
			<h1 className="text-lg font-semibold text-gray-800 mb-4">Job Post Finder</h1>

			<form onSubmit={handleSubmit} className="flex mb-4">
				<input
					type="search"
					placeholder="Enter job title..."
					className="flex-1 border border-gray-300 focus:border-gray-400 rounded-l-md px-3 py-2 text-sm text-gray-700 
			focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gray-400/40
			transition-all"
				/>
				<button
					type="submit"
					className="bg-gray-800 text-white px-4 py-2 text-sm rounded-r-md 
			hover:bg-gray-900 focus-visible:outline-none 
			focus-visible:ring-3 focus-visible:ring-gray-400/40
			transition-all"
				>
					Find Posts
				</button>
			</form>

			<div className="flex-1 border border-gray-200 rounded-md p-2 text-gray-500 text-sm overflow-y-auto">
				Results will appear here
			</div>

			<footer className="mt-4 text-xs text-gray-400 text-center">Powered by LinkedIn Search</footer>
		</main>
	);
}

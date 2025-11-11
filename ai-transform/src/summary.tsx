import { createRoot } from "react-dom/client";
import "./popup.css";
import { useEffect, useState } from "react";
import { CircleCheck, Clock } from "lucide-react";

type SummaryData = {
	title: string;
	url?: string;
	tags?: string[];
	readingTimeMinutes?: number;
	summary: string;
	bullets: string[];
	keyPoints: string[];
	technicalNotes?: string[];
	headings?: {
		heading: string;
		content: string;
		links?: string[];
	}[];
};

function SummaryPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [data, setData] = useState<SummaryData | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const { summaryData, summaryError } = await chrome.storage.local.get([
					"summaryData",
					"summaryError",
				]);
				if (summaryError) {
					setError(summaryError);
					return;
				} else if (summaryData) {
					const title =
						summaryData.title
							?.trim()
							.replace(/[^\w\s-]/g, "")
							.replace(/\s+/g, "-") || "untitled";

					localStorage.setItem(`summaryData-${title}`, JSON.stringify(summaryData));
					const params = new URLSearchParams(window.location.search);
					params.set("title", title);
					window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

					const cached = localStorage.getItem(`summaryData-${title}`);
					if (cached) {
						setData(JSON.parse(cached));
						return;
					}
				} else {
					const storage = Object.entries(localStorage).filter(([key]) =>
						key.startsWith("summaryData-")
					);

					if (storage.length === 0) {
						setError("No summary data found.");
						return;
					}
					const searchParams = new URLSearchParams(window.location.search);
					const title = searchParams.get("title");

					if (!title) {
						setError("No title parameter found.");
						return;
					}

					const key = `summaryData-${title}`;
					const cached = localStorage.getItem(key);

					if (!cached) {
						setError("No summary data found.");
						return;
					}

					setData(JSON.parse(cached));
				}
			} catch (error) {
				console.error("Storage get error:", error);
				setError("Failed to load summary.");
			} finally {
				setIsLoading(false);
				chrome.storage.local.remove(["summaryData", "summaryError"]);
			}
		};
		loadData();
	}, []);

	if (isLoading) return <p className="p-4 text-gray-500">Loading...</p>;
	if (error) return <p className="p-4 text-red-500">{error}</p>;

	return (
		<main className="min-h-screen py-10 bg-gray-50">
			<div className="bg-gray-50 text-gray-800 px-6 max-w-[600px] mx-auto">
				{data ? (
					<div className="flex flex-col gap-6">
						{/* Header */}
						<header className="flex flex-col gap-3 border-b border-gray-200 pb-4">
							<h1 className="text-2xl font-semibold">{data.title}</h1>
							<div className="flex gap-4">
								{data.url && (
									<a
										href={data.url}
										target="_blank"
										className="text-sm px-3 py-1.5 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white"
									>
										{data.url}
									</a>
								)}
								{data.readingTimeMinutes && (
									<div className="text-xs flex items-center gap-1 text-gray-400">
										<Clock className="size-4" /> <span>{data.readingTimeMinutes} min read</span>
									</div>
								)}
							</div>
						</header>

						{/* Summary */}
						<section className="flex flex-col gap-2">
							<h2 className="text-lg font-semibold text-gray-700">Main Summary</h2>
							<p className="text-gray-600 leading-relaxed">{data.summary}</p>
						</section>

						{/* Highlight */}
						<section className="flex flex-col gap-2">
							<h2 className="text-lg font-semibold text-gray-700">Highlights</h2>
							<ul className="flex flex-col gap-4 text-gray-600 w-full">
								{data.bullets.map((item, i) => (
									<li
										className="mx-[-16px] flex items-center gap-4 px-3.5 py-4 bg-gray-100 rounded-[6px] hover:bg-gray-200"
										key={i}
									>
										<span>
											<CircleCheck className="size-4" />
										</span>
										<span> {item}</span>
									</li>
								))}
							</ul>
						</section>

						{/* Key Points */}
						<section className="flex flex-col gap-2">
							<h2 className="text-lg font-semibold text-gray-700">Key Points</h2>
							<ul className="flex flex-col gap-4 text-gray-600 w-full">
								{data.keyPoints.map((item, i) => (
									<li
										className="mx-[-16px] flex items-center gap-4 px-3.5 py-4 bg-gray-100 rounded-[6px] hover:bg-gray-200"
										key={i}
									>
										<span>
											<CircleCheck className="size-4" />
										</span>
										<span> {item}</span>
									</li>
								))}
							</ul>
						</section>

						{/* Headings (Structured Breakdown) */}
						{data.headings && data.headings.length > 0 && (
							<section className="flex flex-col gap-3">
								<h2 className="text-lg font-semibold text-gray-700">Detailed Sections</h2>
								<div className="flex flex-col gap-4">
									{data.headings.map((item, i) => (
										<div key={i} className="border border-gray-200 rounded-lg p-3">
											<h3 className="text-md font-medium text-gray-800">{item.heading}</h3>
											<p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
											{item.links && item.links.length > 0 && (
												<ul className="list-disc pl-5 mt-1 text-xs text-gray-500">
													{item.links.map((link, j) => (
														<li key={j}>
															<a href={link} target="_blank" className="hover:underline">
																{link}
															</a>
														</li>
													))}
												</ul>
											)}
										</div>
									))}
								</div>
							</section>
						)}

						{/* Technical Notes */}
						{data.technicalNotes && data.technicalNotes.length > 0 && (
							<section className="flex flex-col gap-2">
								<h2 className="text-lg font-semibold text-gray-700">Technical Notes</h2>
								<ul className="flex flex-col gap-4 text-gray-600 w-full">
									{data.technicalNotes.map((item, i) => (
										<li
											className="mx-[-16px] flex items-center gap-4 px-3.5 py-4 bg-gray-100 rounded-[6px] hover:bg-gray-200"
											key={i}
										>
											<span>
												<CircleCheck className="size-4" />
											</span>
											<span> {item}</span>
										</li>
									))}
								</ul>
							</section>
						)}

						{/* Tags */}
						{data.tags && data.tags.length > 0 && (
							<section className="flex flex-col gap-2">
								<h2 className="text-lg font-semibold text-gray-700">Tags</h2>
								<div className="flex flex-wrap gap-2">
									{data.tags.map((tag, i) => (
										<span
											key={i}
											className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
										>
											#{tag}
										</span>
									))}
								</div>
							</section>
						)}
					</div>
				) : (
					<p className="text-gray-500 text-center">No summary available.</p>
				)}
			</div>
		</main>
	);
}

createRoot(document.getElementById("root")!).render(<SummaryPage />);

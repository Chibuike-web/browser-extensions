chrome.runtime.onMessage.addListener((msg) => {
	if (msg.action === "open_summary_page") {
		const url = chrome.runtime.getURL("summary.html");
		chrome.tabs.create({ url });
	}
});

chrome.runtime.onMessage.addListener(async (msg) => {
	if (msg.action === "summarize_page") {
		const data = {
			type: msg.type,
			text: msg.text,
			url: msg.url,
			title: msg.title,
		};
		try {
			const res = await fetch("http://localhost:7248/ai/ai-transform", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const resData = await res.json();

			if (!res.ok) {
				console.error(resData.error);
				chrome.runtime.sendMessage({ status: "failed", error: resData.error });
				return;
			}
			chrome.runtime.sendMessage({ status: "success", data: resData.data });
		} catch (error) {
			console.error("Error calling Gemini API:", error);
			chrome.runtime.sendMessage({ status: "failed", error });
		}
	}
});

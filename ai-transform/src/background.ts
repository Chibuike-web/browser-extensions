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

			if (!res.ok) throw new Error(resData.error);

			chrome.storage.local.set({ summaryData: resData.data }, () => {
				if (chrome.runtime.lastError) {
					console.error("Error setting value: " + chrome.runtime.lastError.message);
				} else {
					console.log(`Value ${resData.data} saved for key "summaryData"`);
				}
			});

			const url = chrome.runtime.getURL("summary.html");
			chrome.tabs.create({ url });
		} catch (error) {
			console.error("Error calling Gemini API:", error);
			chrome.storage.local.set({ summaryError: error });
			const url = chrome.runtime.getURL("summary.html");
			chrome.tabs.create({ url });
		}
	}
});

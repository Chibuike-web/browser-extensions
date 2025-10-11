chrome.runtime.onMessage.addListener(async (msg) => {
	if (msg.action === "generate_summary") {
		const textContent = document.body.innerText.slice(0, 15000);
		await chrome.runtime.sendMessage({
			action: "summarize_page",
			type: msg.summaryType,
			text: textContent,
			url: location.href,
			title: document.title,
		});
	}
});

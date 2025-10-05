/// <reference types="chrome"/>

console.log("✅ Content script injected successfully");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Received in content script:", message);

	if (message.action === "scan images") {
		sendResponse({ images: scanImages() });
	} else if (message.action === "add alt") {
		const noAltImagesSrc = scanImages();

		chrome.runtime.sendMessage({ imageSrcs: noAltImagesSrc }, (res) => {
			if (res.error) {
				console.log(res.error, res.details);
			} else {
				attachAltTexts(res.data);
			}
		});
		sendResponse({ info: "alt text added" });
		return true;
	} else if (message.action === "manualAlt") {
		attachAltTexts(message.data);
		sendResponse({ info: "alt text added" });
	}
});

function scanImages() {
	const allImages = document.querySelectorAll("img");
	/**@type {HTMLImageElement[]} */
	const noAltImages = [];
	allImages.forEach((img) => {
		if (!img.hasAttribute("alt") || img.alt.trim() === "") {
			noAltImages.push(img);
		}
	});

	const noAltImagesSrc = noAltImages.map((i) => i.src);

	return noAltImagesSrc;
}

/**@param {Array<{src:string, alt:string}>} results */
function attachAltTexts(results) {
	results.forEach((item) => {
		const imgs = document.querySelectorAll(`img[src="${item.src}"]`);
		imgs.forEach((img) => {
			img.setAttribute("alt", item.alt);
			console.log(`Alt set: ${item.alt} → ${item.src}`);
		});
	});
}

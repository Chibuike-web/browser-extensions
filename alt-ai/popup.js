/// <reference types="chrome"/>

const wrapper = document.getElementById("wrapper");
const btnContainer = document.querySelector(".btn-container");
const scanBtn = /** @type {HTMLButtonElement} */ document.getElementById("scan-btn");
const addAltBtn = /** @type {HTMLButtonElement} */ (document.getElementById("add-alt-btn"));
const resultArea = document.getElementById("result-area");
let noAltImagesSrc = [];

scanBtn?.addEventListener("click", (e) => {
	e.preventDefault();

	const oldApplyBtn = document.getElementById("apply-btn");
	if (oldApplyBtn) oldApplyBtn.remove();

	scanBtn.textContent = "Rescan";

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tabId = tabs[0]?.id;
		if (typeof tabId === "number") {
			chrome.tabs.sendMessage(tabId, { action: "scan images" }, (res) => {
				noAltImagesSrc = res.images || [];
				if (!resultArea) return;

				if (noAltImagesSrc.length === 0) {
					resultArea.innerHTML = `<p class="status-message success">All images have alt text 🎉</p>`;
					addAltBtn.disabled = true;
					addAltBtn.classList.add("disabled");
					return;
				}

				resultArea.classList.add("with-images");
				const images = noAltImagesSrc

					.map(
						/**
						 * @param {string} img
						 * @param {number} index
						 * @returns {string}
						 */ (img, index) => {
							return /*html*/ `
                <div class="missing-alt">
                  <img class="image" src="${img}" />
									<input type="text" data-src="${img}" id="input-${index}" class="alt-input"/>
                </div>
              `;
						}
					)
					.join("");
				resultArea.innerHTML = /*html*/ `
						<p class="status-message warning">Found ${noAltImagesSrc.length} images without alt text</p>
						<div class="images-container">${images}</div>
					`;
				applyAltBtn();
			});
		}
	});
});

function applyAltBtn() {
	const applyBtn = document.createElement("button");
	applyBtn.textContent = "Apply alts";
	applyBtn.id = "apply-btn";
	applyBtn.addEventListener("click", (e) => {
		e.preventDefault();
		console.log("Apply button clicked");
		applyBtn.remove();

		const altData = manualAlt();

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tabId = tabs[0]?.id;
			if (typeof tabId === "number") {
				chrome.tabs.sendMessage(tabId, { action: "manualAlt", data: altData }, (res) => {
					console.log(res.info);
					resultArea.innerHTML = `<p class="status-message success">All images have alt text 🎉</p>`;
					addAltBtn.disabled = true;
					addAltBtn.classList.add("disabled");
				});
			}
		});
	});
	wrapper.appendChild(applyBtn);
}

function manualAlt() {
	const inputs = document.querySelectorAll(".alt-input");
	const altData = Array.from(inputs).map((input) => ({
		src: input instanceof HTMLElement ? input.dataset.src : null,
		alt: input instanceof HTMLInputElement ? input.value.trim() : "",
	}));
	return altData;
}

addAltBtn.addEventListener("click", (e) => {
	e.preventDefault();

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tabId = tabs[0]?.id;
		if (typeof tabId === "number") {
			chrome.tabs.sendMessage(tabId, { action: "add alt" });
		}
	});
});

chrome.runtime.onMessage.addListener((message) => {
	if (message.status === "fetching") {
		console.log("Fetching alt text...");

		addAltBtn.disabled = true;
		addAltBtn.classList.add("disabled");

		if (!document.getElementById("loading-spinner")) {
			const spinner = document.createElement("span");
			spinner.id = "loading-spinner";
			spinner.className = "spinner";
			spinner.style.marginLeft = "8px";
			addAltBtn.appendChild(spinner);
		}
	} else if (message.status === "done") {
		console.log("Alt text fetch complete");

		const spinner = document.getElementById("loading-spinner");
		if (spinner) spinner.remove();

		resultArea.innerHTML = `<p class="status-message success">All images have alt text 🎉</p>`;
		const applyBtn = document.getElementById("apply-btn");
		if (applyBtn) applyBtn.remove();
	}
});

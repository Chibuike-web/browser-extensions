/// <reference types="chrome"/>

const wrapper = document.getElementById("wrapper");
const btnContainer = document.querySelector(".btn-container");
const scanBtn = document.getElementById("scan-btn");
const addAltBtn = document.getElementById("add-alt-btn");
const resultArea = document.getElementById("result-area");
let noAltImagesSrc = [];

scanBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	applyAltBtn();
	scanBtn.textContent = "Rescan";

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tabId = tabs[0]?.id;
		if (typeof tabId === "number") {
			chrome.tabs.sendMessage(tabId, { action: "scan images" }, (res) => {
				noAltImagesSrc = res.images || [];
				if (resultArea) {
					if (noAltImagesSrc.length === 0) {
						resultArea.innerHTML = `<p class="status-message success">All images have alt text 🎉</p>`;
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
				}
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
		const altData = manualAlt();

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tabId = tabs[0]?.id;
			if (typeof tabId === "number") {
				chrome.tabs.sendMessage(tabId, { action: "manualAlt", data: altData }, (res) => {});
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
			chrome.tabs.sendMessage(tabId, { action: "add alt" }, (res) => {
				if (res.info === "alt text added") {
					resultArea.innerHTML = `<p class="status-message success">All images have alt text 🎉</p>`;
				}
			});
		}
	});
});

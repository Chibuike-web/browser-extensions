import { Router } from "express";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const router = Router();

router.post("/gemini-api", async (req, res) => {
	const { prompt } = req.body;
	if (!prompt) {
		return res.status(400).json({ error: "No prompt provided" });
	}

	try {
		const geminiRes = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
			}
		);

		if (!geminiRes.ok) {
			console.error("Gemini API error:", await geminiRes.text());
			return res.status(500).json({ error: "Gemini API call failed" });
		}
		const data = await geminiRes.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No alt text";
		const cleaned = text.replace(/```json|```/g, "").trim();
		let altText = [];
		try {
			altText = JSON.parse(cleaned);
		} catch (err) {
			console.error("Failed to parse Gemini JSON:", err, cleaned);
		}
		console.log("Gemini response:", altText);
		res.status(200).json({ altText });
	} catch (error) {
		console.error("Error calling Gemini API:", error);
	}
});

export default router;

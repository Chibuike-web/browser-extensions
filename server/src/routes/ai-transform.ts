import { Router } from "express";
import { requestSchema } from "../schema/request-schema";
import z from "zod";
import { summarySchema } from "../schema/summary-schema";
import { generateObject } from "ai";

const router = Router();

router.post("/ai-transform", async (req, res) => {
	const data = req.body;
	const parsed = requestSchema.safeParse(data);
	if (!parsed.success) {
		const { fieldErrors } = z.flattenError(parsed.error);

		const structured = Object.entries(fieldErrors).map(([key, value]) => ({
			field: key,
			message: value[0],
		}));

		const formErrors = structured.reduce((acc, { field, message }) => {
			acc[field] = message;
			return acc;
		}, {} as Record<string, string>);
		console.log(formErrors);
		return res.status(400).json({ errors: formErrors });
	}

	console.log("\n\n ----- Output ---------\n\n");
	const prompt = `
You are an expert summarizer. Receive an article/text and produce a JSON object ONLY (no explanatory text).

Rules:
1. Output must be valid JSON only. Do not include commentary, code fences, or markdown.
2. If a field is not applicable, return an empty array or empty string (do not return null).
3. Keep bullets short (max 120 characters). Key points can be full sentences.
4. For "Executive Summary": prioritize a short summary (2-3 sentences) and 3-5 business/impact bullets.
5. For "Detailed Breakdown": expand keyPoints to 4-6 items and include a slightly longer summary (3-4 sentences).
6. For "Technical Focus": include "technicalNotes" with 3-6 items describing architecture, algorithms, data flow, or implementation risks.
7. Provide a realistic readingTimeMinutes (integer) based on ~200-250 words per minute.
8. Do not hallucinate facts about the source. If the text does not specify something, do not invent it — prefer generic phrasing ("the author", "the study", etc.).
9. Use language of the input text; if language cannot be detected, default to English.

Input:
---BEGIN INPUT---
TITLE: ${parsed.data?.title}
URL: ${parsed.data?.url}
TYPE: ${parsed.data?.type}}
TEXT: ${parsed.data?.text}
---END INPUT---
`.trim();

	try {
		const result = await generateObject({
			model: "gpt-4.1-nano",
			schema: summarySchema,
			prompt,
		});
		console.log("Extracted object:", result.object);
		res.status(200).json({ data: result.object });
	} catch (error) {
		console.error(error);
	}
});

export default router;

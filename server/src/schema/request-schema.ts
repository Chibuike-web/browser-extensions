import { z } from "zod";

export const requestSchema = z.object({
	type: z.enum(["Executive Summary", "Detailed Breakdown", "Technical Focus"] as const, {
		error: () => ({ message: "invalid summary type" }),
	}),
	text: z.string().min(1, "text required").max(16000, "text too long"),
	url: z.string().optional(),
	title: z.string().max(1000).optional(),
});

export type RequestSchema = z.infer<typeof requestSchema>;

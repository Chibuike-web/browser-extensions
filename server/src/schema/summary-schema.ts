import { z } from "zod";

export const summarySchema = z.object({
	title: z.string().min(1),
	url: z.string().optional(),
	tags: z.array(z.string()).optional(),
	readingTimeMinutes: z.number().int().positive().optional(),

	// Core summary content
	summary: z.string().min(1),
	bullets: z.array(z.string()).max(12),
	keyPoints: z.array(z.string()).max(12),
	technicalNotes: z.array(z.string()).optional(),

	// Structural / hierarchical breakdown
	headings: z
		.array(
			z.object({
				heading: z.string().min(1),
				content: z.string().min(1),
				links: z.array(z.string()).optional(),
			})
		)
		.optional(),
});

export type Summary = z.infer<typeof summarySchema>;

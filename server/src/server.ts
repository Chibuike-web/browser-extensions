import express from "express";
import cors from "cors";
import geminiRouter from "./routes/gemini";
import aiTransformRouter from "./routes/ai-transform";

const PORT = process.env.PORT || 7248;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", geminiRouter);
app.use("/ai", aiTransformRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

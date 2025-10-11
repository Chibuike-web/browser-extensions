import express from "express";
import cors from "cors";
import geminiRouter from "./routes/gemini.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", geminiRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import { ENV } from "./config";
import geminiRouter from "./routes/gemini";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", geminiRouter);

const PORT = ENV.PORT;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

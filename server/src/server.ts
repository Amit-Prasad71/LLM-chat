import express from "express";
import type { Request, Response } from "express"
import path from "path";
import { fileURLToPath } from "url";

// support __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static frontend build
const clientBuildPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientBuildPath));

// Example API route
app.get("/api/hello", (req: Request, res: Response) => {
	res.json({ message: "Hello from Express + TypeScript API!" });
});

// Catch-all to serve React index.html
app.get("*", (req: Request, res: Response) => {
	res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import express, { Request, Response } from "express";

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API Example
app.get("/api", (req: Request, res: Response) => {
  res.send("API is running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// src/app.ts
import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config(); // This will read the .env file and set the environment variables

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! This is your TypeScript Express server.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

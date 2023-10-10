// src/app.ts
import express from "express";
import { Request, Response } from "express";

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

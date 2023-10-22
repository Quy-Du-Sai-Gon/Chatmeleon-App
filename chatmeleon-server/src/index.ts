// src/app.ts
import express from "express";
import { Request, Response } from "express";
import { messageRoute } from '../routes/message-route.js';
import errorMiddleware from '../middlewares/error-handler.js'

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});

app.use(express.json());

export const routes = express.Router();
routes.use(messageRoute);
routes.use(errorMiddleware);
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

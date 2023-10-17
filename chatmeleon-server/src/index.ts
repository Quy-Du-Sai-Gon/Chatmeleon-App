// src/app.ts
import express from "express";
import { Request, Response } from "express";
import errorMiddleware from '../middlewares/error-handler.js';
import { conversationRoute } from '../routes/conversation-route.js';

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});

app.use(express.json());

export const routes = express.Router();
routes.use(conversationRoute);
routes.use(errorMiddleware);
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

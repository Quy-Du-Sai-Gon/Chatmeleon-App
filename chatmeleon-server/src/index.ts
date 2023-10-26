import express from "express";
import { Request, Response } from "express";

import errorMiddleware from "../middlewares/error-handler";
import { messageRoute } from "../routes/message-route";
import { conversationRoute } from "../routes/conversation-route";
import { userRoute } from "../routes/user-route";
import dotenv from "dotenv";

const app = express();

dotenv.config();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});

app.use(express.json());

app.use(messageRoute);
app.use(conversationRoute);
app.use(userRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

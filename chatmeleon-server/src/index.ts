import express from "express";
import { Request, Response } from "express";

import errorMiddleware from '../middlewares/error-handler.js';
import { messageRoute } from '../routes/message-route.js';
import { conversationRoute } from '../routes/conversation-route.js';
import { userRoute } from '../routes/user-route.js';

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});

app.use(express.json());

export const routes = express.Router();

routes.use(messageRoute);
routes.use(conversationRoute);
routes.use(userRoute);

routes.use(errorMiddleware);
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

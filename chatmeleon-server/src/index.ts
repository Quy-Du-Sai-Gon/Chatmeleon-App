import express from "express";
import { Request, Response } from "express";
import errorMiddleware from '../middlewares/error-handler.js';
import { conversationRoute } from '../routes/conversation-route.js';
import { userRoute } from '../routes/user-route.js';

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});

app.use(express.json());

export const routes = express.Router();
routes.use(conversationRoute);
routes.use(userRoute);
routes.use(errorMiddleware);
app.use('/', routes);
// End testing code

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

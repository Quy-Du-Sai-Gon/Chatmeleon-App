// src/app.ts
import express from "express";
import { Request, Response } from "express";
import { defaultRoute } from '../routes/test-route.js';
import {conversationRoute} from '../routes/conversation-route.js';

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});   

// Testing code
export const routes = express.Router();
routes.use(defaultRoute);
routes.use(conversationRoute);
app.use('/', routes);
// End testing code

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

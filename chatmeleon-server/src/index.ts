import express, { Request, Response } from "express";

import "express-async-errors";

import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";

// Requires 'yamljs' package to load YAML files
import YAML from "yamljs";

const swaggerDocument = YAML.load("../documentation/chatmeleon-swagger.yaml");

dotenv.config();


import errorMiddleware from "./middlewares/error-handler";
import { messageRoute } from "./routes/message-route";
import { conversationRoute } from "./routes/conversation-route";
import { userRoute } from "./routes/user-route";

const app = express();

const port = process.env.PORT;

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

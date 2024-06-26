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
import { userRelationshipRoute } from "./routes/user-relationship-route";
import { socialRoute } from "./routes/social-route";

import { createServer } from "http";
import { io } from "./libs/socket.io";
import cors from "cors";
import { parseCorsOrigin } from "./utils";


const app = express();
const httpServer = createServer(app);
io.attach(httpServer);

const port = process.env.PORT;

app.use(
  cors({
    origin: parseCorsOrigin(process.env.API_CORS_ORIGINS),
  })
);
app.use(express.json());

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});

app.use(messageRoute);
app.use(conversationRoute);
app.use(socialRoute);
app.use(userRoute);
app.use(userRelationshipRoute);

app.use(errorMiddleware);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

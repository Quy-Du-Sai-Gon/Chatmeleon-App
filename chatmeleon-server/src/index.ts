import express from "express";
import { Request, Response } from "express";
import errorMiddleware from '../middlewares/error-handler.js'
import { userRoute } from '../routes/user-route.js';

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running.");
});   

export const routes = express.Router();
routes.use(userRoute);
routes.use(errorMiddleware);
app.use('/', routes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

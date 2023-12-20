import { ChatTokenPayload } from "./auth";

declare global {
  namespace Express {
    interface Request {
      auth?: ChatTokenPayload;
    }
  }
}

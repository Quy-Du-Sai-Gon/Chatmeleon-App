import { ChatTokenPayloadType } from "./auth";

declare module "express" {
  interface Request {
    /** The decrypted ChatToken payload for protected routes */
    auth?: ChatTokenPayloadType;
  }
}

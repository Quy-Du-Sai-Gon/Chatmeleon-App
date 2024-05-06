import { ChatTokenPayload } from "@/types/auth";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

/**
 * Middleware function to require authentication for a route.
 * It checks if the request has a valid JWT token in the Authorization header.
 * If the token is missing or invalid, it sends a 401 Unauthorized response.
 * If the token is valid, it decodes the token and attaches the decoded payload to the request object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resUnauthorized = () =>
    res
      .status(401)
      .type("text/plain")
      .send("Unauthorized - JWT token is missing or invalid.");

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return resUnauthorized();
  }

  const chatToken = authHeader.substring("Bearer ".length);
  const { error, payload } = await verifyChatToken(chatToken);

  if (error) {
    return resUnauthorized();
  }

  req.auth = payload;
  req.chatToken = chatToken;

  next();
};

export type VerifyChatTokenResult =
  | { error: null; payload: ChatTokenPayload }
  | { error: jwt.VerifyErrors | ZodError<ChatTokenPayload>; payload: null };

/**
 * Verify that the ChatToken is valid, i.e., signed by the auth server and is of
 * the correct format.
 */
export const verifyChatToken = (chatToken: string) =>
  new Promise<VerifyChatTokenResult>((resolve) =>
    jwt.verify(chatToken, process.env.CHAT_TOKEN_SECRET!, (err, decoded) => {
      if (err) {
        return resolve({ error: err, payload: null });
      }

      const result = ChatTokenPayload.safeParse(decoded);
      if (!result.success) {
        return resolve({ error: result.error, payload: null });
      }

      resolve({ error: null, payload: result.data });
    })
  );
